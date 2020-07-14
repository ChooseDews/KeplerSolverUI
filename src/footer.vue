<template>
    
    <div class="footer" v-if="status">
        <div class="controls">
 
            <span class="material-icons" @click="pause()">pause</span>
            <span class="material-icons" @click="play()">play_arrow</span>
            <span class="material-icons" @click="slower()">
            fast_rewind
            </span>
            <span class="material-icons" @click="faster()">
            fast_forward
            </span>
        </div>


        <div class="data">
        {{(status.currentTime/60/60).toFixed(2)}} Hours elapsed ({{rate/60/60}} hr per sec)
        </div>
       
     

         <div class="data">
        Tracking {{status.orbits.length}} items 
        </div>
     
     
        <div class="controls">
            <span class="material-icons" @click="addRandom()">
toys
</span>



        </div>


           <div class="data">
        {{timeStamp.format('LLL')}}
        </div>


         <div class="data" style="float: right; padding-right: 20px">
        John Dews-Flick © 2020
        </div>


    </div>

</template>

<script>

import groundControl from './groundControl';
import moment from 'moment';


export default {
    mounted(){
        let self = this;
        setInterval(() => {
            self.status = groundControl.getCurrent();
            self.timeStamp = moment().add(self.status.currentTime, 's');
        }, 500);
        groundControl.play(this.rate)
        groundControl.addRandom()
    },
    data(){
        return {
            status: null,
            rate: 6*60*60,
            playing: true
        }
    },
    methods: {
        play(){
            groundControl.play(this.rate);
            this.playing = true;
        },
        pause(){
            groundControl.stop();
            this.playing = false;
        },
        addRandom(){
            groundControl.addRandom()
        },
        faster(){
            this.rate = this.rate + 60*60; //add one hour
            if(this.playing) this.play();
        },
        slower(){
            this.rate = this.rate - 60*60; //add one hour
            if(this.playing) this.play();

        }
    }
}
</script>

<style lang="scss">

.footer{
    width: 100%;
    height: 50px;
    background: black;
    color: white;
}

.controls{
    float: left;
    line-height: 50px;
    font-size: 2.5em;
    padding-left: 30px;
      -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none;
            
    .material-icons{
        padding: 5px;
    }
}

.data{
    float: left;
    line-height: 50px;
    padding-left: 30px;
    font-size: 16px;
}

</style>