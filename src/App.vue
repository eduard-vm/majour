<template>
  <div id="app">
    <!-- <toolbar />
    <drawer />  -->
    <div class="root-container">
      <transition :name="transitionName">
        <router-view class="child-view" />
      </transition>
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

  data() {
    return {
      transitionName: 'slide-left',
    };
  },

  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
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

.fade-enter-active, .fade-leave-active
  transition: opacity .5s ease

.fade-enter, .fade-leave-active
  opacity: 0

.child-view
  position: absolute
  transition: all .5s cubic-bezier(.55,0,.1,1)

.slide-left-enter, .slide-right-leave-active
  opacity: 0
  -webkit-transform: translate(30px, 0)
  transform: translate(30px, 0)

.slide-left-leave-active, .slide-right-enter
  opacity: 0
  -webkit-transform: translate(-30px, 0)
  transform: translate(-30px, 0)

</style>
