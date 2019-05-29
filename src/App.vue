<template>
  <div id="app">
    <drawer /> 
    <div class="root-container">
      <router-view />
    </div>
  </div>
</template>
<script>
import Drawer from '@/components/Drawer';

export default {
  name: 'app',

  components: {
    Drawer,
  },
};
</script>

<style lang="sass">
.root-container
  height: 100vh
</style>
