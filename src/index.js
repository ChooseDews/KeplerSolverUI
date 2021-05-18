import "normalize.css/normalize.css"
import "./style.scss";
import * as THREE from "three";
import Vue from "vue";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import VueTabsChrome from 'vue-tabs-chrome';
const OrbitElement = require('./oe');
const $ = require("mathjs");
import groundControl from './groundControl';
import VueRouter from 'vue-router'
import router from './router';
import MainApp from './app.vue'

Vue.use(VueRouter)
window.groundControl = groundControl;
Vue.use(VueTabsChrome)
new Vue({
  el: '#app',
  render: h => h(MainApp),
  router
});







