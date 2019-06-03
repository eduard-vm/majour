<template>
  <div id="app">
    <!-- <div class="splashscreen">
      <div class="splashscreen__container" ref="ssContainer" />
    </div> -->
    <toolbar :options="toolbarOptions" :class="toolbarClass" />
    <drawer /> 
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
import anime from 'animejs';
export default {
  name: 'app',

  components: {
    Drawer,
    Toolbar,
  },

  data() {
    return {
      loadingText: 'Загрузка',
      toolbarOptions: {
        buttons: {
          back: true,
        },
      },
      toolbarClass: 'toolbar',
      transitionName: 'slide-left',
    };
  },

  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length;
      const fromDepth = from.path.split('/').length;
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
      this.updateToolbarOptions();
    }
  },

  methods: {
    mainLoading() {
      const timeline = new anime.timeline({
        duration: 3000,
      });

      const container = this.$el.querySelector('.splashscreen__container');
      this.loadingText.split('').map(s => {
        const node = document.createElement('SPAN');
        node.innerHTML = s;
        node.style.willChange = 'transform, opacity';
        node.style.display = 'inline-block';
        node.style.opacity = '0';
        container.appendChild(node);
      });

      timeline.add({
        targets: container.querySelectorAll('span'),
        opacity: [0, 1],
        loop: 10,
        delay: anime.stagger(100),
      });
    },

    updateToolbarOptions() {
      const options = {
        buttons: {
          back: true,
        },
      };

      if (this.$route.path === '/') {
        options.buttons.back = false;
        this.toolbarClass = 'toolbar--main';
      } else {
        this.toolbarClass = 'toolbar';
      }

      this.toolbarOptions = { ...this.toolbarOptions, ...options };
    },
  },

  mounted() {
    // this.mainLoading();
  },

  created() {
    this.updateToolbarOptions();
  },
};
</script>

<style lang="sass">
html,
body,
#app
  font-family: 'Roboto'
.splashscreen
  position: absolute
  top: 0
  bottom: 0
  left: 0
  display: flex
  justify-content: center
  align-items: center
  text-transform: uppercase
  right: 0
  background-color: #fff
  width: 100%
  height: 100%
  z-index: 9999
.root-container
  height: calc(100vh - 56px)
  position: absolute
  top: 56px
  // background-color: rgba(green, 0.1)
  overflow: hidden
  overflow-y: auto
  width: 100%
  .page
    width: 100%
    box-sizing: border-box
.fade-enter-active, .fade-leave-active
  transition: opacity .5s ease

.fade-enter, .fade-leave-active
  opacity: 0

.child-view
  position: absolute
  transition: all .5s cubic-bezier(.55,0,.1,1)
  width: 100%
  height: 100%
.slide-left-enter, .slide-right-leave-active
  opacity: 0
  -webkit-transform: translate(30px, 0)
  transform: translate(30px, 0)

.slide-left-leave-active, .slide-right-enter
  opacity: 0
  -webkit-transform: translate(-30px, 0)
  transform: translate(-30px, 0)

</style>
