<template>
<div>

    <MainNav></MainNav>
    <MainFooter></MainFooter>
    <div>
          <router-view></router-view>
    </div>
</div>

</template>

<script>

import MainNav from './nav';
import MainFooter from './footer';


export default {
    components: {MainNav, MainFooter}
}

</script>