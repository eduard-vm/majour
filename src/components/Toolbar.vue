<template>
  <div class="toolbar">
    <div class="toolbar__left"></div>
    <div class="toolbar__center"></div>
    <div class="toolbar__right"></div>
  </div>
</template>
<script>
import anime from 'animejs';

export default {
  name: 'toolbar',
};
</script>

<style lang="sass" scoped>
.toolbar
  position: absolute
  top: 0
  left: 0
  right: 0
  width: 100%
  min-height: 56px
  background-color: #f6f6f6
  z-index: 99
  // border-bottom: 1px solid #999
  box-sizing: border-box
  box-shadow: 0 1px 3px 1px rgba(#000, 0.18)
</style>
