<template>
  <div class="toolbar">
    <div class="toolbar__left">
      <button type="button" v-if="options.buttons.back" @click="$router.go(-1)" class="btn btn--toolbar btn--back" />
    </div>
    <div class="toolbar__center"></div>
    <div class="toolbar__right"></div>
  </div>
</template>
<script>
import anime from 'animejs';

export default {
  name: 'toolbar',

  props: {
    options: {
      type: Object,
      default() {
        return {
          buttons: {
            back: false
          },
        };
      },
    },
  },

  data() {
    return {};
  },
};
</script>

<style lang="sass" scoped>
.btn
  background-color: transparent
  width: 32px
  height: 32px
  padding: 0
  margin: 0
  line-height: 32px
  border: none
  box-sizing: border-box
  &:active
    opacity: 0
.toolbar
  position: absolute
  top: 0
  left: 0
  right: 0
  width: 100%
  min-height: 56px
  background-color: #fff
  z-index: 99
  // border-bottom: 1px solid #999
  box-sizing: border-box
  box-shadow: 0 1px 3px 1px rgba(#000, 0.18)
  display: flex
  &--main
    box-shadow: none
  &__left, &__right, &__center
    display: flex
    align-items: center
    box-sizing: border-box
  &__left
    padding-left: 10px
  &__right
    padding-right: 10px
.btn
  &--back
    background-image: url('~@/assets/svg/arrow-back.svg')
</style>
