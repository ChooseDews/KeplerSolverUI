<template>
  <div>
    <MainNav></MainNav>

    <div class="width: 100%;">
      <splitpanes
        class="default-theme"
        vertical
        style="height: calc(100vh - 100px)"
      >
        <pane min-size="20">
          <OrbitView></OrbitView>
        </pane>
        <pane min-size="20">
          <router-view></router-view>
        </pane>
      </splitpanes>
    </div>
    <MainFooter></MainFooter>

  </div>
</template>

<script>
import MainNav from "./nav";
import MainFooter from "./footer";
import OrbitView from "./orbitView.vue";

import { Splitpanes, Pane } from "splitpanes";

export default {
  components: { MainNav, MainFooter, OrbitView, Splitpanes, Pane },
};
</script>

<style lang="scss">
.custom-resizer {
  width: 100%;
  height: calc(100vh - 100px);
}
.custom-resizer > .pane {
  text-align: left;
  padding: 15px;
  overflow: hidden;
  background: #eee;
  border: 1px solid #ccc;
}
.custom-resizer > .pane ~ .pane {
}
.custom-resizer > .multipane-resizer {
  margin: 0;
  left: 0;
  position: relative;
  &:before {
    display: block;
    content: "";
    width: 3px;
    height: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -20px;
    margin-left: -1.5px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
  &:hover {
    &:before {
      border-color: #999;
    }
  }
}
</style>