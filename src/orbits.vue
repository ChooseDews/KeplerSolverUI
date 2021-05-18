<template>
  <div class="whitepage" v-if="status">
    <h2>
      Orbits ({{ orbits.length }})
      <span
        @click="enableCreate = !enableCreate"
        class="material-icons"
        style="vertical-align: top"
        >add_box</span
      >
    </h2>

    <div
      v-if="enableCreate"
      class="newOrbit orbitList"
      :style="{ 'border-left-color': newCraft.color }"
    >
      <input
        type="text"
        class="nameBox"
        v-model="newCraft.name"
        placeholder="Craft Name"
      />
      <input
        type="color"
        id="favcolor"
        name="favcolor"
        v-model="newCraft.color"
      /><br /><br />

      <div class="elements">
        <span class="oe">a=</span>
        <input v-model="newCraft.oe.a" type="number" />
        <span class="oe">e=</span>
        <input v-model="newCraft.oe.e" type="number" />
        <span class="oe">i=</span>
        <input v-model="newCraft.oe.i" type="number" />
        <span class="oe">Ω=</span>
        <input v-model="newCraft.oe.Ω" type="number" />
        <span class="oe">ω=</span>
        <input v-model="newCraft.oe.ω" type="number" />
        <span class="oe">ν=</span>
        <input v-model="newCraft.oe.ν" type="number" />
      </div>
      <br />
      <button @click="addOrbit(newCraft)" class="addOrbit">Add Orbit</button>
    </div>
    <p>
      All orbital elements are in radians. Propagation using Kepler's equation
    </p>
    <div
      v-for="orbit in orbits"
      class="orbitList"
      :style="{ 'border-left-color': orbit.color }"
    >
      <div class="orbitName">{{ orbit.name || orbit.id }}</div>
      <div class="side-controls" @click="remove(orbit)">
        <span class="material-icons"> delete_outline </span>
      </div>
      <div class="elements">
        <span class="oe">a=</span> {{ orbit.oe.a.toFixed(2) }}
        <span class="oe">e=</span> {{ orbit.oe.e.toFixed(3) }}
        <span class="oe">i=</span> {{ orbit.oe.i.toFixed(2) }}
        <span class="oe">Ω=</span> {{ orbit.oe.Ω.toFixed(2) }}
        <span class="oe">ω=</span> {{ orbit.oe.ω.toFixed(2) }}
        <span class="oe">ν=</span> {{ orbit.oe.ν.toFixed(2) }}
      </div>
      <div class="stats">
        <span>Period: {{ getPeriod(orbit) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import groundControl from "./groundControl";
const getRandomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

export default {
  data() {
    return {
      interval: null,
      status: null,
      orbits: [],
      newCraft: { color: getRandomColor(), oe: {} },
      enableCreate: false,
    };
  },
  methods: {
    getPeriod(oe) {
      return (groundControl.getPeriod(oe) / 60 / 60).toFixed(2) + " Hours";
    },
    remove(orbit) {
      groundControl.removeOrbit(orbit.id);
    },
    addOrbit(craft) {
      groundControl.addOrbit(craft.oe, craft.name, craft.color);
    },
  },
  mounted() {
    let self = this;
    self.status = groundControl.getCurrent();
    self.orbits = self.status.orbits;
    this.interval = setInterval(() => {
      self.status = groundControl.getCurrent();
      self.orbits = self.status.orbits;
    }, 500);
  },
};
</script>

<style>
.addOrbit {
  padding: 5px;
  margin: 5px;
}

.orbitList {
  padding: 20px;
  padding-top: 10px;
  padding-left: 10px;
  margin: 20px;
  border: 1px solid black;
  max-width: 800px;
  border-left: 15px solid blue;
}

.elements input {
  max-width: 60px;
  padding: 5px;
}

.nameBox {
  padding: 5px;
  margin: 10px;
}

.orbitName {
  text-transform: capitalize;
  padding-bottom: 10px;
  color: grey;
}

.whitepage {
  margin: auto;
  margin-top: 30px;
  max-width: 1000px;
  padding: 30px;
  background-color: white;
  max-height: calc(100vh - 250px);
  overflow-y: scroll;
}

.oe {
  padding-left: 10px;
  font-weight: bold;
}

.stats {
  padding-left: 10px;
}

.side-controls {
  float: right;
}
</style>