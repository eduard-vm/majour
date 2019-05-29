<template>
  <div class="drawer">
    
  </div>
</template>
<script>
import anime from 'animejs';

export default {
  name: 'drawer',

  data() {
    return {
      isOpen: false,
      overlay: null,
    };
  },
  watch: {
    isOpen() {
      console.log(this.isOpen)
    }
  },
  methods: {
    close() {
      this.overlay.style.display = 'none'; 
      this.isOpen = false;
    },

    open() {
      this.overlay.style.display = 'block';
      this.isOpen = true;
      this.$nextTick(() => {
        anime({
          duration: 3000,
          targets: this.overlay,
          background: 'rgba(0, 0, 0, 0.3)',
        });
      });
    },
  },

  destroyed() {
    const overlay = document.body.querySelector('.drawer-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }
  },

  mounted() {
    const overlay = document.createElement('DIV');
    overlay.classList.add('drawer-overlay');
    overlay.addEventListener('click', this.close, false);
    document.body.append(overlay);
    this.overlay = overlay;
  },

  created() {
    window.open = this.open; 
    window.close = this.close; 
  }
};
</script>

<style lang="sass" scoped>
.drawer
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 100%
  width: 310px
  background-color: #f6f6f6
  z-index: 101
  transform: translateX(-310px)
  // &--open
  //   transform: translateX(0)
</style>

<style lang="sass">
.drawer-overlay
  z-index: 100
  width: 100%
  top: 0
  position: absolute
  display: none
  bottom: 0
  left: 0
  right: 0
  background-color: rgba(#000, 0.0)
  &.before-show
    will-change: background-color
    background-color: rgba(#000, 0)
</style>
