import VueRouter from 'vue-router'

import OrbitView from './orbitView.vue';
import GroundView from './groundView.vue';
import About from './about.vue';
import Orbits from './orbits.vue';

const routes = [
  { path: '/2d', component: GroundView },
  { path: '/', component: About },
  { path: '/about', component: About },
  { path: '/orbits', component: Orbits }
]
const router = new VueRouter({
  routes // short for `routes: routes`
})

module.exports = router;