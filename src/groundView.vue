<template>
  <div class="unselectable">
    <div class="zoomControls">
      <span class="material-icons" @click="zoom(1)"> zoom_in </span>

      <span class="material-icons" @click="zoom(-1)"> zoom_out </span>
    </div>

    <div class="mapContainer" ref="mapContainer" v-dragscroll>
      <canvas
        :style="{ width: sWidth }"
        :width="width"
        :height="height"
        class="groundmap"
        id="ground"
      ></canvas>
    </div>
  </div>
</template>

<script>
import { dragscroll } from "vue-dragscroll";

import groundControl from "./groundControl";
const OrbitElement = require("./oe");

const drawImage = (url, ctx) => {
  const image = new Image();
  image.src = url;
  image.onload = () => {
    ctx.drawImage(image, 0, 0, 6000, 3000);
  };
};

const image = new Image();
image.src = "./2_no_clouds_4k.jpg";

let earthRotationConst = 0.000072921159;


export default {
  directives: {
    dragscroll,
  },

  data() {
    let realWidth = window.innerWidth;
    if (realWidth > 1700) realWidth = 1500;

    return {
      width: 6000 + "px",
      height: 6000 / 2 + "px",
      sHeight: realWidth / 2 + "px",
      sWidth: realWidth + "px",
      size: realWidth,
      ctx: null,
      interval: null,
    };
  },

  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
  },
  methods: {
    zoom(factor) {
      this.size = this.size + 200 * factor;
      this.sWidth = this.size + "px";
    },
    addPoint(lat, long, color) {
      let mapWidth = 6000;
      let mapHeight = 3000;
      let x = (long + 180) * (mapWidth / 360);
      let y = mapHeight - (lat + 90) * (mapHeight / 180);
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, 10, 10);
    },
    addLocation(lat, long, color) {
      let mapWidth = 6000;
      let mapHeight = 3000;
      let x = (long + 180) * (mapWidth / 360);
      let y = mapHeight - (lat + 90) * (mapHeight / 180);
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 50, 0, 2 * Math.PI);
      this.ctx.fill();
    },
    plotOrbits(orbits) {
      for (let orbit of orbits) {
        if (orbit.name && orbit.name.toLowerCase() == "moon") continue;
        let { lon, lat } = OrbitElement.convert2LatLon(
          orbit.position,
          orbit.time,
          earthRotationConst
        );
        this.addLocation(lat, lon, orbit.color);

        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.strokeStyle = orbit.color;
        let i = 0;
        let lastX = 0;
        let lastY = 0;
        if (orbits.length < 10) {
          for (let pos of orbit.trace) {
            let { lon, lat } = OrbitElement.convert2LatLon(
              pos[0],
              pos[1],
              earthRotationConst
            );
            let mapWidth = 6000;
            let mapHeight = 3000;
            let x = (lon + 180) * (mapWidth / 360);
            let y = mapHeight - (lat + 90) * (mapHeight / 180);
            //this.addPoint(lat,lon, orbit.color);
            if (i == 0) {
              this.ctx.moveTo(x, y);
              i++;
            } else {
              let max_dist = Math.max(Math.abs(lastX - x), Math.abs(lastY - y));
              //console.log(max_dist)
              if (max_dist > 600) {
                this.ctx.stroke();
                i = 0;
              } else {
                this.ctx.lineTo(x, y);
              }
            }
            lastX = x;
            lastY = y;
          }

          this.ctx.stroke();
        }
      }
    },
    runtime() {
      let self = this;
      let { orbits } = groundControl.getCurrent();
      self.ctx.drawImage(image, 0, 0, 6000, 3000);
      self.plotOrbits(orbits);
    },
  },
  mounted() {
    let canvas = document.getElementById("ground");
    let context = canvas.getContext("2d");
    let self = this;

    self.ctx = context;

    image.onload = () => {
      self.runtime();
    };

    this.interval = setInterval(function () {
      self.runtime();
    }, 100);
  },
};
</script>

<style lang="scss">
.groundmap {
  margin: auto;
  display: block;
  margin-top: 20px;
}

.mapContainer {
  width: 100%;
  height: calc(100vh - 100px);
  overflow: hidden;
  canvas {
    padding: 500px;
  }
  background: black;
}

.zoomControls {
  position: absolute;
  display: inline;
  right: 0;
  z-index: 100;
  color: white;
  background: rgba(0, 0, 0, 0.2);
  span {
    font-size: 2.5em;
    margin: 5px;
    cursor: pointer;
  }
}
</style>