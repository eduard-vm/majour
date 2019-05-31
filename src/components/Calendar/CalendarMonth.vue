<template>
  <div class="calendar__month">
    <div class="calendar__week" v-for="(week, weekIdx) of data" :key="weekIdx">
      <div class="calendar__day" ref="day" @contextmenu.prevent v-for="(day, dayIdx) of week" :key="dayIdx">
        {{ day.date.day }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'calendar-month',
  props: {
    data: Array,
  },

  methods: {
    getDaysDOM() {
      return this.$refs.day;
    },
  },
}
</script>

<style lang="sass" scoped>
.calendar
  &__month
    width: 100%
    display: block
    perspective: 500px
    flex-shrink: 0
    position: relative
    z-index: 1
    &--clone
    &--clone
      z-index: 0
      position: absolute
      top: 0
  &__week
    width: 100%
    transform-origin: 50% 50%
    display: flex

  &__day
    box-sizing: border-box
    width: 20%
    margin: 1px
    min-height: 60px
    border: 1px solid #dbe4e1
    color: #455843
    // padding: 12px
    display: flex
    user-select: none
    backface-visibility: hidden
    background-color: #fff
    justify-content: center
    align-items: center
    font-size: 17px
    will-change: transform, opacity, background-color
    // border-radius: 1px
    box-shadow: 0 0 1px rgba(#000, 0.08)
    &:active
      opacity: 0.5
</style>
