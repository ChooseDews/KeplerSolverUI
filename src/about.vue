<template>
  <div class="whitepage">



      <h2>Orbit.JS <small>Created By John Dews-Flick</small></h2>

      <p>This web program allows you to simulate mutliple orbiting objects about earth and view their ground track in real time. This system uses kepler's equation to propigate the orbit, starting at current system time.</p>

        <h3>Instructions</h3>

        <p>Time can be controlled in the top left using the pause, play, increase rate, and decrease rate buttons. The elapsed time since starting the simulation and date are also shown.</p>
        <p>The tabs at the top allow you to switch between different pages; keep in mind the simulation will continue while switching tabs unless it is paused.</p>




  </div>
</template>

<script>
export default {

}
</script>

<style>

.whitepage{
    margin: auto;
    margin-top: 30px;
    max-width: 1000px;
    padding: 30px;
    background-color: white;
}

</style>