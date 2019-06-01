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
      v-touch:moving="movingHandler"
      v-touch:start="touchStart"
      v-touch:end="touchEnd"
      class="calendar__container"
    >
      <div class="transform-pane">
        <div class="calendar__month" v-for="(m, i) of calendar" :key="i">
          <div class="calendar__day" @click="selectDate(m, d, i, di, $event)" v-for="(d, di) of m" :key="di">
            {{ d.id }}
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

function generateCalendar(year, month, ctx) {
  const calendar = [];
  const now = new Date(year, month);
  [
    new Date(now.getFullYear(), now.getMonth() -1),
    new Date(now.getFullYear(), now.getMonth()),
    new Date(now.getFullYear(), now.getMonth() +1),
  ].forEach((date, index) => {
    calendar.push(generateMonth(date, (d) => {
      return ctx.createDate(date, d);
    }));
  });

  return calendar;
}

function generateMonth(sd, ccb) {
  const dargs = [sd.getFullYear(), sd.getMonth()];
  const s = new Date(...dargs).getDay();

  const m = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      const d  = new Date(...dargs, ((j + 1) + (i * 7)) - (s - 1));
      const D = d.getDay();
      if (!(D === 0 || D === 6)) {
        m.push(ccb(d));
      }
    }
  }
  return m;
}

function buildCalendar(y, m, formatDate) {
  const calendar = [];
  const dateArgs = [y, m];
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
            format: formatDate(date),
          },
          isToday: date.getDate() === currentDay && date.getMonth() === currentMonth,
        });
      }
    }
    calendar.push(week);
  }
  return calendar;
}
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
    month(month) {
      this.monthDisplayed = months[this.month];
      console.log('on change month', month);
    },

    transformIndex(index) {
      const vm = this;
      vm.calendar = generateCalendar(vm.year, vm.month, vm);

      anime({
        targets: this.$pane,
        translateX: -this.transformIndex * 100 + '%',
      });

      this.monthDisplayed = months[this.month];
    },
  },

  methods: {
    selectDate(month, day, monthIdx, dayIdx, event) {
      console.info('month, day, monthIdx, dayIdx, event', month, day, monthIdx, dayIdx, event);
      const $month = this.$el.querySelectorAll('.calendar__month')[monthIdx];
      const $day = $month.querySelectorAll('.calendar__day')[dayIdx];

      const w = this.$el.offsetWidth;
      const h = this.$el.offsetHeight;
      // console.log($pane);
      const $_clone = $day.cloneNode(true);
      // $_clone.style.position = 'absolute';
      // $_clone.style.backgroundColor = 'red';
      const dw = $day.offsetWidth
      const dh = $day.offsetHeight
      // $_clone.
      const {x, y} = event;
      $_clone.style.position = 'abolute';
      $_clone.style.left = x + 'px';
      $_clone.style.top = y + 'px';
      $_clone.style.width = dw + 'px';
      $_clone.style.height = dh + 'px';
      this.$el.appendChild($_clone);
      // console.log(x, y);/
      console.log(w / dw, h / dh)
      // anime({
      //   targets: $day,
      //   scaleX: w / dw,
      //   scaleY: h / dh,
      // })
      console.log($day);
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
      this.transformIndex = this.transformIndex > 0 ? this.transformIndex - 1 : 0;
    },

    nextMonth() {
      this.transformIndex = this.transformIndex === 2 ? 2 : this.transformIndex + 1;
      if (this.month + 1 > 11) {
        this.year = (this.year + 1);
        this.month = 0;
      } else {
        this.month = (this.month + 1);
      }
    },

    buildCalendar() {
      const calendar = buildCalendar(this.year, this.month, this.formatDate);
      this.calendar = calendar;
    },

    formatDate(date) {
      return date.getDate();
    },

    iniCalenda() {
      anime.set(this.$el.querySelector('.transform-pane'), {
        translateX: '-100%',
      });
    }
  },

  mounted() {
    this.$pane = this.$el.querySelector('.transform-pane');
    anime.set(this.pane, {
      translateX: '-100%',
    });
    const now = new Date();
    this.month = now.getMonth();
    this.year = now.getFullYear();
    this.calendar = generateCalendar(this.year, this.month, this);
    this.monthDisplayed = months[this.month];
    this.iniCalenda();
    // console.info(this.calendar);
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
.calendar
  position: relative
  width: 100%
  &__month
    width: 100%
    display: flex
    flex-wrap: wrap
    flex-shrink: 0
    box-sizing: border-box
  &__day
    flex-shrink: 0
    min-width: calc(20% - 4px)
    box-shadow: 0 0 0 1px rgba(#000, 0.068)
    transform-origin: 50% 50%
    box-sizing: border-box
    display: flex
    background-color: #fff
    justify-content: center
    align-items: center
    font-size: 11px
    min-height: 60px
    margin: 2px
    color: #adadad
    border-radius: 1px
    will-change: transform
  &__container
    position: relative
    z-index: 0
    width: 100%
    display: block
    overflow: hidden
  &__month-name
    will-change: transform
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
