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
          <div class="calendar__day" :data-day="day.date.dayOfWeek" v-for="(day, dayNum) of week" :key="dayNum">
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
import { sortBy } from 'lodash';

const months = 'январь,февраль,март,апрель,май,июнь,июль,август,сентябрь,октябрь,ноябрь,декабрь'.split(',');

export default {
  name: 'calendar',

  components: {
    Calendar,
  },

  data() {
    return {
      f1: null,
      // renderBefore: 1,
      // renderAfter: 1,
      year: null,
      month: null,
      timeline: null,
      timelines: {},
      monthDisplayed: null,
      calendar: [],
      items: [],
      touch: {
        treshold: 200,
        // easing: 'ХйуЕгоЗнает(Пока что)',
        direction: 1,
        startX: 0,
        currentX: 0,
        stopX: 0,
      },
    };
  },

  methods: {
    updateTimeline(direction) {
      const vm = this;

      const timeline = anime.timeline({
        duration: 160,
        easing: 'linear',
        autoplay: false,
      });
      this.items = [].slice.call(this.$el.querySelectorAll('.calendar__day'), 0);

      // if (direction < 0) this.items.reverse();
      timeline.add({
        targets: this.items,
        translateX: `${90 * -this.touch.direction}px`,
        opacity: 0,
        delay: anime.stagger(10),
        // delay(node, idx, count) {
        //   if (idx % 5 === 0) {
        //     return 15;
        //   }
        //   return 50;
        // },
        // complete() {
        //   console.info('on done')
        // }
      });
      this.timeline = timeline;
    },

    movingHandler(event) {
      const self = this;
      const w = this.$el.offsetWidth;
      // const centerX = w / 2;
      const posX = event.touches[0].clientX;
      this.touch.stopX = event.touches[0].clientX;
      let x = (this.touch.startX - posX);
      x = x / w;
      const direction = x > 0 ? 1 : -1;
      if (this.touch.direction !== direction) {
        this.touch.direction = direction;
        this.updateTimeline(direction);
      }
      x = Math.abs(x);
      this.timeline.seek(this.timeline.duration * x);
    },

    touchStart(event) {
      this.touch.startX = event.touches[0].clientX;
      // const centerX = this.$el.offsetWidth / 2;
      // const items = [].slice.call(this.$el.querySelectorAll('.calendar__day'), 0);
      // .sort((n1, n2) => {
      //   const d1 = +n1.dataset.day;
      //   const d2 = +n2.dataset.day;
      //   if (d1 < d2) {
      //     return -1;
      //   }
      //   if (d1 > d2) {
      //     return 1;
      //   }
      //   return 0;
      // });
      // this.items = items;
      this.touch.direction = this.touch.startX > (this.$el.offsetWidth / 2) ? 1 : -1;
      this.updateTimeline();
    },

    touchEnd(event) {
      // const delta = this.touch.stopX - this.touch.startX;
      this.timeline.reverse();
      this.timeline.play();
      this.timeline.complete = function() {
        console.log('on done');
      }
      // if (delta < -this.touch.treshold) {
      //   this.timeline.play();
      // } else if (delta > this.touch.treshold) {
      //   this.timeline.play();
      // } else {
      //   this.timeline.reverse();
      //   this.timeline.play();
      // }
      // const delta = currX - this.startTX;
      // this.touch.moveTweenLeave.reverse();
      // this.touch.moveTweenLeave.reverse();
      // this.touch.moveTweenLeave.play();
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
                dayOfWeek: date.getDay(),
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
    this.buildCalendar();
    this.setMonthName();
    this.$nextTick(() => {
      // this.items = [].slice.call(this.$el.querySelectorAll('.calendar__day'), 0);
    });
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
  &__container
    position: relative
    z-index: 0
    width: 100%
    display: block
    overflow: hidden
    z-index: 5
  &__month
    width: 100%
    display: block
    overflow: hidden
    perspective: 500px
    &--clone
      top: 0
      left: 0
      .calendar__day
        background-color: rgba(blue, 0.2)
  &__month-name
    will-change: transform
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
    backface-visibility: hidden
    background-color: #fff
    justify-content: center
    align-items: center
    font-size: 17px
    will-change: transform, opacity, background-color
    border-radius: 1px
    &:active
      opacity: 0.5
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
    box-sizing: border-box
    outline: none
    transition: opacity 120ms linear
    will-change: opacity
    &:active
      opacity: 0.5
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
        background-color: transparent
        border: 3px solid #333
    &--prev
      &:after
        border-top-width: 0
        border-right-width: 0
    &--next
      &:after
        border-bottom-width: 0
        border-left-width: 0
</style>
