<template>
  <div>
    <vue-tabs-chrome v-model="tab" @click="tabClicked" :tabs="tabs" />
  </div>
</template>

<script>
export default {
  methods: {
    tabClicked(event, tab, index) {
      console.log(tab);
      this.$router.push(tab.url);
      this.tab = tab.key;
    },
  },
  data() {
    return {
      tab: "3d",
      tabs: [
        {
          label: "Ground Track",
          url: "/2d",
          closable: false,
          key: "g",
        },
        {
          label: "Orbits",
          url: "/orbits",
          key: "or",
          closable: false,
        },
        {
          label: "About",
          url: "/about",
          key: "a",
          closable: false,
        },
      ],
    };
  },
};
</script>
