<template>
  <div id="app">
    <!-- <toolbar />
    <drawer />  -->
    <div class="root-container">
      <router-view />
    </div>
  </div>
</template>
<script>
import Drawer from '@/components/Drawer';
import Toolbar from '@/components/Toolbar';

export default {
  name: 'app',

  components: {
    Drawer,
    Toolbar,
  },
};
</script>

<style lang="sass">
.root-container
  height: calc(100vh - 56px)
  position: absolute
  top: 56px
  // background-color: rgba(green, 0.1)
  width: 100%
</style>
