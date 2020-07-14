import VueRouter from 'vue-router'

import OrbitView from './orbitView.vue';
import GroundView from './groundView.vue';
import About from './about.vue';
import Orbits from './orbits.vue';


const routes = [
    { path: '/2d', component: GroundView },
    { path: '/', component: OrbitView },
    { path: '/about', component: About },
    { path: '/orbits', component: Orbits }
  ]
  
  // 3. Create the router instance and pass the `routes` option
  // You can pass in additional options here, but let's
  // keep it simple for now.
  const router = new VueRouter({
    routes // short for `routes: routes`
  })

  
  module.exports = router;