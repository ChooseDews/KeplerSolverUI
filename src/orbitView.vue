<template>
    <div id="3d-orbit" class="orbit"></div>
</template>

<script>

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const OrbitElement = require('./oe');
const $ = require("mathjs");
import groundControl from './groundControl';
var store = require('store')


let scale = 0.0001;
let earthRadius = 6356;
let moonRadius = 1737.1;


let d2r = 3.14159265359/180;
let mu = 398600.4418;

let getRandomColor = () => Math.random() * 0xffffff;


let convertVector = (r) => [r[1]*scale, r[2]*scale, r[0]*scale]

let createEarth = (radius, segments) => new THREE.Mesh(
  new THREE.SphereGeometry(radius, segments, segments),
  new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('2_no_clouds_4k.jpg'),
    bumpMap: THREE.ImageUtils.loadTexture('elev_bump_4k.jpg'),
    bumpScale:   0.01,
    specularMap: THREE.ImageUtils.loadTexture('water_4k.png'),
    specular: new THREE.Color('grey')      
  })
);

let createMoon = (radius, segments) => new THREE.Mesh(
  new THREE.SphereGeometry(radius, segments, segments),
  new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('moonmap2k.jpg'),
    bumpMap: THREE.ImageUtils.loadTexture('moonbump2k.jpg'),
    bumpScale:   0.01   
  })
);

let createCraft = (radius, segments, color) => new THREE.Mesh(
  new THREE.SphereGeometry(radius, segments, segments),
  new THREE.MeshBasicMaterial( {color: color || getRandomColor()} )
);


let createClouds = (radius, segments) =>  new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, segments),			
    new THREE.MeshPhongMaterial({
      map:         THREE.ImageUtils.loadTexture('fair_clouds_4k.png'),
      transparent: true
    })
);

export default {
    data(){
        return{camera: null}
    },
    beforeDestroy(){

        console.log('about to destory 3d orbit view')

        //store camera position locally
        if(!this.camera) return;
        let position = this.camera.position;
        let rotation = this.camera.rotation;
        store.set('camera', { position, rotation })
    },
    mounted(){


        let time = 0;


const PI = Math.PI;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);

let lastCameraPos = store.get('camera')
if(lastCameraPos){
    let p = lastCameraPos.position;
    let r = lastCameraPos.rotation;
    camera.position.set(p.x, p.y, p.z);
    camera.rotation.set(r._x, r._y, r._z)
}

var renderer = new THREE.WebGLRenderer();
scene.add(new THREE.AmbientLight(0x333333));
var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,3,5);
scene.add(light);
renderer.setSize(window.innerWidth, window.innerHeight-100);
document.getElementById('3d-orbit').appendChild(renderer.domElement);




let createOrbit = (points, color) => {
  var material = new THREE.LineBasicMaterial( { color: color || getRandomColor(),transparent: true,  opacity: 0.7 } );
  let vecs = [];
  for(let p of points){
    vecs.push( new THREE.Vector3( ...convertVector(p.r) ) );
  }
  var geometry = new THREE.BufferGeometry().setFromPoints(vecs);
  var line = new THREE.Line( geometry, material );
  scene.add( line );
  return line;
}



//initalize
var controls = new OrbitControls( camera, renderer.domElement );
controls.update();
camera.position.z = 10.5;

let orbitTracks = [];



let clouds = createClouds(earthRadius*scale*1.01, 20);
scene.add(clouds)

let earth = createEarth(earthRadius*scale, 20)

scene.add(earth)




let orbitElements = [];


const refreshOrbits = function(orbits){
  for(let track of orbitTracks) scene.remove(track);
  orbitTracks = [];
  for(let orbit of orbits){
    orbitTracks.push(createOrbit(orbit.orbit, orbit.color))
  }
}

const refreshCrafts = function(orbits){
  for(let o of orbitElements) scene.remove(o);
  orbitElements = [];
  for(let orbit of orbits){
      if(orbit.name.toLowerCase() == 'moon'){
          let m = createMoon(moonRadius*scale, 20);
          orbitElements.push(m)
          scene.add(m);
        }else{
          let c = createCraft(0.2, 20, orbit.color);
          scene.add(c);
          orbitElements.push(c)
        }
  }
}


const setOrbits = function({orbits, currentTime}){
    time = currentTime;
    earth.rotation.y = currentTime*2*PI/(24*60*60);
    clouds.rotation.y = 1.1*currentTime*2*PI/(24*60*60);
    if(orbits.length != orbitElements.length){
      refreshCrafts(orbits);
    }
    if(orbits.length != orbitTracks.length){
      refreshOrbits(orbits);
    }
    for(let i in orbits){
      orbitElements[i].position.set(...convertVector(orbits[i].position));
      orbitElements[i]._id = orbits[i].id;
    }
}



//repeat at 60fps
let render = function () {
    controls.update();
    renderer.render(scene, camera);
    setOrbits(groundControl.getCurrent());
    requestAnimationFrame(render);
};

this.camera = camera;

render();


}
}
</script>




<style>

.orbit{
    display: flex;
}

</style>