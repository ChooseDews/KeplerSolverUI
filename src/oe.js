//library
const $ = require("mathjs");
let d2Rad = d => (d * $.pi) / 180;
let pi = $.pi;
let sqrt = $.sqrt;
let sin = $.sin;
let cos = $.cos;

let createTransform = (ω, i, Ω) => {
  const t_1 = [
    [$.cos(ω), -$.sin(ω), 0],
    [$.sin(ω), $.cos(ω), 0],
    [0, 0, 1]
  ];

  const t_2 = [
    [1, 0, 0],
    [0, $.cos(i), -$.sin(i)],
    [0, $.sin(i), $.cos(i)]
  ];

  const t_3 = [
    [$.cos(Ω), -$.sin(Ω), 0],
    [$.sin(Ω), $.cos(Ω), 0],
    [0, 0, 1]
  ];

  return b => {
    b = $.multiply(t_1, b); //#3 Eular
    b = $.multiply(t_2, b); //#1
    return $.multiply(t_3, b); //#3
  };
};


let νToE = function(v, e){
  return 2*$.atan2( $.sqrt(1-e)*$.sin(v/2), $.sqrt(1+e)*$.cos(v/2) )
}

let EToν = function(E, e){
  return 2*$.atan2( $.sqrt(1+e)*$.sin(E/2), $.sqrt(1-e)*$.cos(E/2) )
}

let kelperSolve = (a, e, ν_0, t_i, t_f, μ) => {

  let a3 = a*a*a;
  let mu = μ;
  E_0 = νToE(ν_0, e);
  let t_p = t_i-sqrt(a3/mu)*(E_0-e*$.sin(E_0));


  let k = $.floor((t_f-t_p)/(2*pi*$.sqrt(a3/mu)));
  let C = -$.sqrt(μ/a3)*(t_f-t_i) + 2*pi*k - E_0 + e*$.sin(E_0)

  let f = (x) => x-e*$.sin(x)+C;
  let f_prime = (x) => 1-e*cos(x);
  let g = (x) => f(x)/f_prime(x);
  let N = 10*$.ceil(1/(1-e));

  let last = E_0 + e*sin(E_0);
  for(i=0; i<N; i++){
    E_1 = last - g(last);
    if($.abs(E_1 - last) < 1e-100) break;
    last = E_1;
  }


  E_1 = E_1 - 2*pi*$.floor(E_1/(2*pi));
  let v_f = EToν(E_1, e);
  //if($.abs(v_f) < 1e-15) return 0;
  return v_f;

}


let computeECI = (ω, i, Ω, a, e, ν, μ) => {
  //these must be numbers!
  ω = Number(ω);
  i = Number(i);
  Ω = Number(Ω);
  a = Number(a);
  e = Number(e);
  ν = Number(ν);
  μ = Number(μ);


  //start the calculations
  let p = a * (1 - e * e);
  let r = p / (1 + e * $.cos(ν));
  let G = $.sqrt(μ / p);
  let T = createTransform(ω, i, Ω);

  let r_vec = [r * $.cos(ν), r * $.sin(ν), 0];
  let v_vec = [-$.sin(ν) * G, ($.cos(ν) + e) * G, 0];

  let h_p = $.cross(r_vec, v_vec);

  return {
    r: T(r_vec),
    v: T(v_vec),
    p,
    a,
    h_p
  };
};


const r2d = 180 / $.pi;

let createECIFTransform = (t, OmegaE) => {
  if (!OmegaE) OmegaE = 0.00007292115; //rad/sec

  q = t * OmegaE;
  const transfer = [
    [$.sin(q), -$.cos(q), 0],
    [$.cos(q), $.sin(q), 0],
    [0, 0, 1]
  ];

  return b => {
    return $.multiply(transfer, b); //#3
  };
};

let getLatLon = r => {
  lon = $.atan2(r[1], r[0]) * r2d;
  k = $.sqrt(r[1] * r[1] + r[0] * r[0]);
  lat = $.atan2(r[2], k) * r2d;
  return { lon, lat };
};

let computeECIF = (r, t, OmegaE) => {
  let T = createECIFTransform(t, OmegaE);
  return T(r);
};

let convert2LatLon = (r, t, OmegaE) => {
  let r_ecif = computeECIF(r,t,OmegaE);
  return getLatLon(r_ecif);
}


module.exports = {
  createTransform,
  computeECI,
  d2Rad,
  νToE,
  EToν,
  kelperSolve,
  computeECIF,
  getLatLon,
  convert2LatLon
};