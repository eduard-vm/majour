<template>
  <div class="calendar">
    <div class="calendar__control">
      <div class="left">
        <button type="button" @click="prevMonth" class="calendar__control-btn calendar__control-btn--prev" />
      </div>
      <div class="center">
        <transition mode="out-in">
          <span class="calendar__month-name">
            {{ monthDisplayed }}
          </span>
        </transition>
      </div>
      <div class="right">
        <button type="button" @click="nextMonth" class="calendar__control-btn calendar__control-btn--next" />
      </div>
    </div>
    <div class="calendar__container">
      <div class="calendar__month" v-touch:moving="movingHandler" v-touch:start="touchStart" v-touch:end="touchEnd">
        <div class="calendar__week" v-for="(week, weekNum) of calendar" :key="weekNum">
          <div class="calendar__day" v-for="(day, dayNum) of week" :key="dayNum">
            {{ day.date.day }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from '@/components/Calendar';
import anime from 'animejs';
import { close } from 'fs';

const months = 'январь,февраль,март,апрель,май,июнь,июль,август,сентябрь,октябрь,ноябрь,декабрь'.split(',');

export default {
  name: 'calendar',

  components: {
    Calendar,
  },

  data() {
    return {
      year: null,
      renderBefore: 1,
      renderAfter: 1,
      month: null,
      monthDisplayed: null,
      calendar: [],
      clone: null,
      touch: {
        startX: 0,
        moveTween: null,
        stopX: 0,
        treshold: 100,
        moveTweenEnter: null,
        direction: 1,
        currentX: 0,
      },
    };
  },

  // computed: {
  //   monthDisplayed() {
  //     return months[this.month];
  //   }
  // },

  watch: {
    year(year) {
      console.info('year ', year);
    },
    month(value, oldValue) {
      const tl = anime.timeline({
        easing: 'easeInOutCirc',
        duration: 300
      });
      const self = this;

      const $items = [].slice.call(this.$el.querySelectorAll('.calendar__day'), 0).reverse();
      const $montName = this.$el.querySelector('.calendar__month-name');
      const direction = value > oldValue ? -1 : 1;

      tl.add({
        targets: $items, 
        translateY: '30px',
        translateX: 30 * direction + 'px',
        scale: 0.5,
        opacity: 0,
        delay: anime.stagger(9),
        complete() {
          self.buildCalendar();
        },
      })
      tl.add({
        targets: $items, 
        translateY: '0',
        translateX: '0',
        scale: 1,
        opacity: 1,
        delay: anime.stagger(9) 
      })
      anime.timeline({
        easing: 'easeInOutCirc',
        duration: 600
      }).add({
        targets: $montName,
        opacity: 0,
        translateX: 30 * direction + 'px', 
        complete() {
          self.setMonthName();
        },
      }).add({
        targets: $montName,
        translateX: [30 * -direction + 'px', 0], 
        opacity: 1,
      })
    },
  },

  methods: {
    getTouchDirection() {
      return this.touch.direction;
    },

    prepareTouchTween(direction) {
      const vm = this;
      if (!this.clone) {
        const $container = this.$el.querySelector('.calendar__container');
        const $month = this.$el.querySelector('.calendar__month');
        const _clone = $month.cloneNode();
        _clone.style.position = 'absolute';
        _clone.classList.add('--clone');
        $container.appendChild(_clone);

        this.clone = _clone;
      }
      let $items = [].slice.call(this.$el.querySelectorAll('.calendar__day'), 0).reverse();
      let $cloneItems = [].slice.call(this.$el.querySelectorAll('.calendar__day'), 0).reverse();

      this.touch.moveTween = anime({
        targets: $items, 
        translateY: '90px',
        autoplay: false,
        opacity: 0,
        scale: 0.9,
        easing: 'spring(1, 80, 10, 0)',
        // rotateX() {
        //   return -135 + 'deg';
        // },

        // rotateY() {
        //   return direction * 45 + 'deg';
        // },
        delay: anime.stagger(10),
      });
    },

    movingHandler(event) {
      const self = this;
      const scrW = this.$el.offsetWidth;
      const centerX = scrW / 2;
      const posX = event.touches[0].clientX;
      let x = (this.touch.startX - posX);
      x = x / scrW;
      const direction = x > 0 ? 1 : -1;
      if (this.touch.direction !== direction) {
        this.touch.direction = direction;
        this.prepareTouchTween(direction);
      }
      x = Math.abs(x);
      console.log(Math.sin(x) / Math.PI * 2, x)
      this.touch.moveTween.seek(this.touch.moveTween.duration * (Math.sin(x) / Math.PI));
    },

    touchStart(event) {
      this.touch.startX = event.touches[0].clientX;
      const scrW = this.$el.offsetWidth;
      const centerX = scrW / 2;
      this.touch.direction = this.touch.startX > centerX ? 1 : -1;
      this.prepareTouchTween(this.touch.direction);
    },

    touchEnd(event) {
      console.info('@touch:end > moveTween: ', this.touch.moveTween);
      // const delta = currX - this.startTX;
      // this.touch.moveTween.reverse();
      // this.touch.moveTween.reverse();
      // this.touch.moveTween.play();
    },

    setMonthName() {
      this.monthDisplayed = months[this.month];
    },

    prevMonth() {
      if (this.month - 1 < 0) {
        this.year = (this.year - 1);
        this.month = 11;
      } else {
        this.month = (this.month - 1);
      }
    },

    nextMonth() {
      if (this.month + 1 > 11) {
        this.year = (this.year + 1);
        this.month = 0;
      } else {
        this.month = (this.month + 1);
      }
    },

    buildCalendar() {
      const calendar = [];
      const dateArgs = [this.year, this.month];
      const now = new Date();
      const dayMonthStarts = new Date(...dateArgs).getDay();

      const currentDay = now.getDate();
      const currentMonth = now.getMonth();

      for (let i = 0; i < 6; i++) {
        const week = [];
        for (let k = 0; k < 7; k++) {
          const dayNum = (k + 1) + (i * 7);
          const date = new Date(...dateArgs, dayNum - (dayMonthStarts - 1));
          const isWeakends = date.getDay() === 0 || date.getDay() === 6;
          if (!isWeakends) {       
            week.push({
              id: dayNum,
              date: {
                day: date.getDate(),
                month: date.getMonth(),
                format: this.formatDate(date),
              },
              isToday: date.getDate() === currentDay && date.getMonth() === currentMonth,
            });
          }
        }
        calendar.push(week);
      }
      this.calendar = calendar;
    },

    formatDate(date) {
      return date;
    },
  },

  mounted() {
    const now = new Date();
    this.year = now.getFullYear(); 
    this.month = now.getMonth(); 
    this.setMonthName();
  },
};
</script>

<style lang="sass" scoped>
.reset-button
  padding: 0
  margin: 0
  border: 0
  background: none
  background-color: transparent
  line-height: 1

.calendar
  width: 100%
  &__wrapper
    position: relative
    z-index: 0
    width: 100%
    display: block
    overflow: hidden
  &__month
    width: 100%
    display: block
    overflow: hidden
  &__month-name
    will-change: transform
  &__week
    width: 100%
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
    backface-visibility: hidden
    justify-content: center
    align-items: center
    font-size: 17px
    will-change: transform, opacity, background-color
    border-radius: 1px
    &:active
      opacity: 0.7
  &__control
    padding: 10px
    display: flex
    justify-content: space-between
    width: 100%
    box-sizing: border-box
    .center
      display: flex
      align-items: center
      text-transform: uppercase
      font-size: 22px
  &__control-btn
    @extend .reset-button
    width: 40px
    height: 40px
    // border: 1px solid #f0f0f0
    box-sizing: border-box
    &:active
      opacity: 0.7
    &--next,
    &--prev
      position: relative
      &:after
        content: ''
        position: absolute
        top: calc(50% - 8px)
        left: calc(50% - 8px)
        width: 12px
        height: 12px
        transform-origin: center center
        transform: rotate(45deg)
        border: 2px solid #333
    &--prev
      &:after
        border-top-width: 0
        border-right-width: 0
    &--next
      &:after
        border-bottom-width: 0
        border-left-width: 0
</style>
