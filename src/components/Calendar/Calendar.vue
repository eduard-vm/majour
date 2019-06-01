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
    <div 

      class="calendar__container"
    >
      <div class="calendar__header">
        <div class="calendar__day calendar__day--header" v-for="(day, dayN) of 'пн,вт,ср,чт,пт'.split(',')" :key="dayN">
          {{ day }}
        </div>
      </div>
      <div class="calendar__month">
        <div class="calendar__day"
          @contextmenu.prevent
          v-touch:start="cellTouchStart"
          v-touch:end="cellTouchEnd"
          @click="selectDate(day, dayN, $event)"
          v-for="(day, dayN) of calendar"
          :key="dayN">
          <div class="cell">
            <div class="cell__background" />
            <div class="cell__body">
              {{ day.id }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--
    <div
      class="calendar__container"
      ref="calendarContainer"
      v-touch:moving="movingHandler"
      v-touch:start="touchStart"
      v-touch:end="touchEnd"
    >
      <calendar-month :data="calendar" />
    </div> -->
  </div>
</template>

<script>
import Vue from 'vue';
import Calendar from '@/components/Calendar';
import anime from 'animejs';
import { close } from 'fs';
import { sortBy } from 'lodash';
import CalendarMonth from './CalendarMonth';
const calendarMonth = Vue.extend(CalendarMonth);
const months = 'январь,февраль,март,апрель,май,июнь,июль,август,сентябрь,октябрь,ноябрь,декабрь'.split(',');

export default {
  name: 'calendar',

  components: {
    Calendar,
    CalendarMonth,
  },

  data() {
    return {
      $pane: null,
      transformIndex: 1,
      year: null,
      month: null,
      timeline: null,
      timelines: {},
      monthDisplayed: null,
      calendar: [],
      items: [],
      lock: false,
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

  watch: {
    month: 'animate',
  },

  methods: {
    cellTouchStart(e) {
      const sibling = e.target
      console.info(sibling)
    },
    cellTouchEnd(cellTouchStart, cellTouchEnd) {

    },
    animate(value, oldValue) {
      const ctx = this;
      const monthNameNode = this.$el.querySelectorAll('.calendar__month-name');
      const nodes = this.$el.querySelectorAll('.calendar__month .calendar__day');
      const timeline = anime.timeline({
        duration: 120,
        easing: 'linear',
      });
      const dir = (value === 0 && oldValue === 11) ? -1 : (value > oldValue ? -1 : 1);

      anime({
        targets: monthNameNode,
        translateX: `${dir * 50}%`,
        easing: 'easeOutCirc',
        opacity: 0,
      });

      const delay = anime.stagger(15);
      timeline.add({
        targets: nodes,
        translateX: `${dir * 100}%`,
        opacity: 0,
        delay,
        complete() {
          ctx.updateMonth();

          anime({
            targets: monthNameNode,
            translateX: [`${-dir * 50}%`, 0],
            opacity: [0, 1],
          });
        },
      });

      timeline.add({
        targets: nodes,
        translateX: [`${-dir * 100}%`, 0],
        opacity: [0, 1],
        delay,
      });
    },
    updateMonth() {
      this.calendar = this.createMonth(this.year, this.month);
      this.setMonthName();
    },
    createMonth(year, month) {
      const dateArgs = [year, month];
      const monthStartsDay = new Date(...dateArgs).getDay();

      const days = [];

      for (let weekN = 0; weekN < 6; weekN++) {
        for (let dayN = 0; dayN < 7; dayN++) {
          const dayDate  = new Date(...dateArgs, ((dayN + 1) + (weekN * 7)) - (monthStartsDay - 1));
          const dayOfWeek = dayDate.getDay();
          if (!(dayOfWeek === 0 || dayOfWeek === 6)) {
            days.push({
              id: dayDate.getDate(),
            });
          }
        }
      }
      return days;
    },

    selectDate(month, day, monthIdx, dayIdx, event) {
      // console.info('month, day, monthIdx, dayIdx, event', month, day, monthIdx, dayIdx, event);
      // const $month = this.$el.querySelectorAll('.calendar__month')[monthIdx];
      // const $day = $month.querySelectorAll('.calendar__day')[dayIdx];

      // const w = this.$el.offsetWidth;
      // const h = this.$el.offsetHeight;
      // // console.log($pane);
      // const $_clone = $day.cloneNode(true);
      // // $_clone.style.position = 'absolute';
      // // $_clone.style.backgroundColor = 'red';
      // const dw = $day.offsetWidth
      // const dh = $day.offsetHeight
      // // $_clone.
      // const {x, y} = event;
      // $_clone.style.position = 'abolute';
      // $_clone.style.left = x + 'px';
      // $_clone.style.top = y + 'px';
      // $_clone.style.width = dw + 'px';
      // $_clone.style.height = dh + 'px';
      // this.$el.appendChild($_clone);
      // // console.log(x, y);/
      // console.log(w / dw, h / dh)
      // // anime({
      // //   targets: $day,
      // //   scaleX: w / dw,
      // //   scaleY: h / dh,
      // // })
      // console.log($day);
    },

    createDate(m, d) {
      return {
        id: d.getDate(),
        month: months[m.getMonth()],
        day: d.getDay(),
        date: d,
        _month: m,
      };
    },

    updateTimeline(direction) {
      const vm = this;

      const $container = this.$el.querySelector('.calendar__container');
      const $pane = this.$el.querySelector('.transform-pane');
      const timeline = anime.timeline({
        duration: 160,
        easing: 'linear',
        autoplay: false,
      });

      // const daysNum = Array.from(Array(5)).map((_$, i) => i);
      // const delay = function(n, i) {
      //   let val = 5;
      //   daysNum.some(_i => {
      //     if ((i - _i) % daysNum.length === 0) {
      //       val = ((_i * _i) + 30 * _i);
      //     }  
      //   });
      //   return val
      // };

      // if (this.touch.direction > 0) this.items.reverse();
      // timeline.add({
      //   targets: this.items,
      //   translateX: `${80 * this.touch.direction}px`,
      //   // translateY: `${80 * this.touch.direction}px`,
      //   opacity: {
      //     value: 0,
      //   },
      //   delay
      // });

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
      // const direction = x - (w / 2) > 0 ? -1 : 1;
      const direction = x > 0 ? -1 : 1;
      // console.info((x - (w / 2)), direction)
      if (this.touch.direction !== direction) {
        this.touch.direction = direction;
        this.updateTimeline(direction);
      }
      x = Math.abs(x);
      this.timeline.seek(this.timeline.duration * x);
    },

    touchStart(event) {
      const prevX = this.touch.startX;
      this.touch.startX = event.touches[0].clientX;

      this.touch.direction = prevX > this.touch.startX ? -1 : 1;
      this.updateTimeline();
    },

    touchEnd(event) {
      const delta = this.touch.stopX - this.touch.startX;
      this.timeline.reverse();
      this.timeline.play();
      // if (delta < -this.touch.treshold) {
      //   this.timeline.complete = function() {
      //     console.log('on done to prev slide');
      //   }
      //   // this.timeline.play();
      // } else if (delta > this.touch.treshold) {
      //   this.timeline.complete = function() {
      //     console.log('on done to next slide');
      //   }
      //   // this.timeline.play();
      // } else {
      //   this.timeline.reverse();
      // }
      // this.timeline.play();
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

    formatDate(date) {
      return date.getDate();
    },
  },

  mounted() {
    const now = new Date();
    this.month = now.getMonth();
    this.year = now.getFullYear();
    // this.calendar = this.createMonth(this.year, this.month)
    // this.$pane = this.$el.querySelector('.transform-pane');
    // anime.set(this.pane, {
    //   translateX: '-100%',
    // });
    // this.calendar = generateCalendar(this.year, this.month, this);
    // this.monthDisplayed = months[this.month];
    // this.iniCalenda();
    // // console.info(this.calendar);
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
.transform-pane
  position: relative
  z-index: 0
  // transform: translateX(-50%)
  display: flex
  will-change: transform
// .cell
//   width: 30px
//   height: 30px
//   border-radius: 50%
//   box-shadow: 0 0 2px 2px rgba(#000, 0.068)
//   display: flex
//   justify-content: center
//   align-items: center
//   background-color: #fff
.cell
  position: relative
  width: 100%
  height: 100%
  user-select: none
  &__background
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: yellow
    opacity: 0
    z-index: 0
    will-change: opacity
    transition: opacity 240ms linear
  &__body
    z-index: 1
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    display: flex
    color: #666
    opacity: 0.6
    justify-content: center
    align-items: center
    will-change: opacity
    transition: opacity 240ms linear
  &:active
    .cell__body
      opacity: 1
    .cell__background
      opacity: 1
.calendar
  position: relative
  width: 100%
  &__header
    width: 100%
    display: flex
    flex-wrap: wrap
    flex-shrink: 0
    persperctive: 500px
    transform-origin: 50% 0
    box-sizing: border-box
  &__month
    width: 100%
    display: flex
    flex-wrap: wrap
    flex-shrink: 0
    persperctive: 500px
    transform-origin: 50% 0
    box-sizing: border-box
  &__day
    flex-shrink: 0
    min-width: 20%
    border-bottom: 1px dotted #f0f0f0
    // box-shadow: inset 2px 2px 0 1px rgba(#000, 0.068)
    transform-origin: 50% 50%
    box-sizing: border-box
    font-size: 13px
    min-height: 60px
    color: #adadad
    border-radius: 1px
    position: relative
    will-change: transform
    display: flex
    justify-content: center
    align-items: center
    &--header
      text-transform: uppercase
      border-bottom-color: #e0e0e0
      // border-bottom-width: 2px
      border-bottom-style: solid
      color: #333

  &__container
    position: relative
    z-index: 0
    width: 100%
    display: block
    overflow: hidden
  &__month-name
    will-change: transform
  &__control
    padding: 10px 20px
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
