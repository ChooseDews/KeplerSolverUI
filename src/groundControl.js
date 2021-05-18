
const OrbitElement = require('./oe');
const ID = function () { // https://gist.github.com/gordonbrander/2230317
    return '_' + Math.random().toString(36).substr(2, 9);
};

const getRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);


const mu = 398600.4418;
const pi = Math.PI;
const d2r = pi / 180;
let currentClock = null;

let currentTime = 0; //load in setting?

let inOrbit = [];


let removeOrbit = function (id) {
    inOrbit = inOrbit.filter(x => x.id != id);
}

let progressOrbits = (deltaT) => { //deltaT is in [sec]
    for (let i in inOrbit) {
        let newTime = currentTime + deltaT;
        let orbit = inOrbit[i];
        let n = orbit.oe;
        let ν_f = OrbitElement.kelperSolve(n.a, n.e, orbit.oe.ν, orbit.time, newTime, mu);
        inOrbit[i].oe.ν = ν_f;
        inOrbit[i].time = newTime;
        let { r, v } = OrbitElement.computeECI(n.ω, n.i, n.Ω, n.a, n.e, ν_f, mu);
        orbit.position = r;
        orbit.trace.push([r, newTime]);
        if (orbit.trace.length > 300) orbit.trace.shift();
    }
    currentTime += deltaT;
}

let gatherPoint = function (n, mu) {
    let angle = [];
    for (let i = 0; i < 90; i = i + 1) {
        angle[i] = OrbitElement.computeECI(n.ω, n.i, n.Ω, n.a, n.e, i * 4 * d2r, mu);
    }
    angle.push(angle[0])
    return angle;
};

let refreshOrbits = function () {
    for (let i in inOrbit) {
        inOrbit[i].orbit = gatherPoint(inOrbit[i].oe, mu);
    }
};


let addOrbit = function (n, name, color) {
    n.ω = Number(n.ω)
    n.i = Number(n.i)
    n.a = Number(n.a)
    n.Ω = Number(n.Ω)
    n.ν = Number(n.ν)
    n.e = Number(n.e)

    let { r, v } = OrbitElement.computeECI(n.ω, n.i, n.Ω, n.a, n.e, n.ν, mu);
    inOrbit.push({
        name,
        id: ID(),
        oe: n,
        time: currentTime,
        orbit: gatherPoint(n, mu),
        position: r,
        color: color || getRandomColor(),
        trace: []
    });
};

addOrbit({
    a: 0.3844e6,
    e: 0.0549,
    i: 5.145 * d2r,
    Ω: 34 * d2r,
    ω: 32 * d2r,
    ν: 0
}, 'moon')


function rand(min, max) {
    return Math.random() * (max - min) + min;
}

let randomOE = () => {
    return {
        ω: rand(0, 2 * pi),
        i: rand(0, 2 * pi),
        Ω: rand(0, 2 * pi),
        a: rand(32164, 5 * 42164),
        ν: 0,
        e: rand(0.001, 0.5),
    }
}


let n = 1;
const addRandom = () => {
    addOrbit(randomOE(), 'orbit ' + n);
    n++;
}





let getCurrent = function () { //this map is imporant to unlink the status
    return { orbits: inOrbit.map(x => ({ ...x })), currentTime: Number(currentTime) }
}

let getPeriod = function (n) {
    if (n.oe) n = n.oe;
    return 2 * pi * Math.sqrt(n.a * n.a * n.a / mu);
}



let stop = function () {
    if (currentClock) {
        clearInterval(currentClock);
        currentClock = null;
    }
}

const rate = 50; //ms
const rate_s = rate / 1000; //sec


let updateRate = function(newRate){
    rate = newRate
}


let play = function (time) { //time is in [sec]/[real-life sec]
    if (currentClock) stop();
    setTimeout(function () {
        let delta_t = rate_s * time;
        currentClock = setInterval(function () {
            progressOrbits(delta_t)
        }, rate);
    }, 25)
}


module.exports = {
    getCurrent,
    refreshOrbits,
    addOrbit,
    removeOrbit,
    progressOrbits: function (dt) {
        if (currentClock) return null;
        progressOrbits(dt);
        return true;
    },
    play,
    stop,
    addRandom,
    getPeriod,
    updateRate
}