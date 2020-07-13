<template>
    
    <canvas :style='{width: sWidth, height: sHeight}' :width="width" :height="height" class="groundmap" id="ground"></canvas>


</template>

<script>

import groundControl from './groundControl';
const OrbitElement = require('./oe');

const drawImage = (url, ctx) => {
    const image = new Image();
    image.src = url;
    image.onload = () => {
       ctx.drawImage(image, 0, 0, 6000, 3000)
    }
}


export default {


    

    data(){
        
        let realWidth = window.innerWidth;
        if(realWidth > 1700) realWidth = 1700;

        return {
            width: 6000+'px',
            height: 6000/2 +'px',
            sHeight: realWidth/2 + 'px',
            sWidth: realWidth+'px',
            ctx: null,
            interval: null
        }
    },

    beforeDestroy(){
        if(this.interval) clearInterval(this.interval);
    },
    methods: {

        addPoint(lat, long, color){


            let mapWidth = 6000;
            let mapHeight = 3000;
            let x = (long + 180) * (mapWidth / 360);
            let y = mapHeight - (lat + 90) * (mapHeight / 180);
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, 10, 10);

        },
        plotOrbits(orbits){
            for(let orbit of orbits){
                if(orbit.name.toLowerCase()=='moon') continue;
                let { lon, lat } = OrbitElement.convert2LatLon(orbit.position, orbit.time, 0.00007292115)
                this.addPoint(lat,lon, orbit.color)
            }
        },
        runtime(){
            let self = this;
            this.interval = setInterval(() => {
                let {orbits} = groundControl.getCurrent()
                self.plotOrbits(orbits)
            }, 10);
        }
    },
    mounted(){


let canvas = document.getElementById('ground');
let context = canvas.getContext('2d');

this.ctx = context;
    const image = new Image();
    image.src = './earth.jpg';
        image.onload = () => {

       context.drawImage(image, 0, 0, 6000, 3000)


        }

        this.runtime()

    }


}
</script>

<style>


    .groundmap{
        margin: auto;
        display: block;
        margin-top: 20px;
    }



</style>