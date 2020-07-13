
const OrbitElement = require('./oe');
const ID = function () { // https://gist.github.com/gordonbrander/2230317
    return '_' + Math.random().toString(36).substr(2, 9);
};

const getRandomColor = () => '#'+Math.floor(Math.random()*16777215).toString(16);


const mu = 398600.4418;
const pi = Math.PI;
const d2r = pi/180;
let currentClock = null;

let currentTime = 0; //load in setting?

let inOrbit = [];


let removeOrbit = function(id){
    inOrbit = inOrbit.filter(x=>x.id!=id);
}

let progressOrbits = (deltaT) => { //deltaT is in [sec]
    for(let i in inOrbit){
      let orbit = inOrbit[i];
      let n = orbit.oe;
      let ν_f = OrbitElement.kelperSolve(n.a, n.e, orbit.ν, orbit.time, currentTime+deltaT, mu);
      inOrbit[i].ν = ν_f;
      inOrbit[i].time = currentTime+deltaT;
      let {r,v} = OrbitElement.computeECI(n.ω, n.i, n.Ω, n.a, n.e, ν_f, mu);
      orbit.position = r;
    }
    currentTime+=deltaT;
  }
  
let gatherPoint = function(n, mu) {
    let angle = [];
    for (let i = 0; i < 90; i=i+1) {
      angle[i] = OrbitElement.computeECI(n.ω, n.i, n.Ω, n.a, n.e, i*4*d2r, mu);
    }
    angle.push(angle[0])
    return angle;
};

let refreshOrbits = function(){
    for(let i in inOrbit){
        inOrbit[i].orbit = gatherPoint(inOrbit[i].oe, mu);
    }
};


let addOrbit = function(n, name){
    let {r,v} = OrbitElement.computeECI(n.ω, n.i, n.Ω, n.a, n.e, n.ν, mu);
    inOrbit.push({
        name,
        id: ID(),
        oe: n,
        time: currentTime,
        ν: n.ν,
        orbit: gatherPoint(n, mu),
        position: r,
        color: getRandomColor()
    }); 
};


addOrbit({
    a: 0.3844e6,
    e: 0.0549,
    i: 5.145*d2r,
    Ω: 34*d2r,
    ω: 32*d2r,
    ν: 0
  }, 'moon')


  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  let randomOE = () => {
    return {
    ω: rand(0, 2*pi),
    i: rand(0, 2*pi),
    Ω: rand(0, 2*pi),
    a: rand(32164, 5*42164),
    ν: 0,
    e:  rand(0.001, 0.5),
    }
  }


  let n = 1;
  const addRandom = () => {
    addOrbit(randomOE(), 'orbit '+n);
    n++;
  }












let getCurrent = function(){ //this map is imporant to unlink the status
    return {orbits: inOrbit.map(x=>({...x})), currentTime: Number(currentTime) }
}

let stop = function(){
    if(currentClock){
        clearInterval(currentClock);
        currentClock = null;
    }
}

const rate = 10; //ms
const rate_s = rate/1000; //sec

let play = function(time){ //time is in [sec]/[real-life sec]
    if(currentClock) stop();
    setTimeout(function(){
        let delta_t = rate_s*time;
        currentClock = setInterval(function(){ 
            progressOrbits(delta_t)
        }, rate);
    },25)
}


module.exports = {
    getCurrent,
    refreshOrbits,
    addOrbit,
    removeOrbit,
    progressOrbits: function(dt){
        if(currentClock) return null;
        progressOrbits(dt);
        return true;
    },
    play,
    stop,
    addRandom
}