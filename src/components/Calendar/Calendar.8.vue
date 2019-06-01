<template>
  <div class="calendar">
    <div class="calendar__container">
      <div class="calendar__month" v-for="(m, i) of calendar" :key="i">
        <div class="calendar__day" v-for="(d, di) of m" :key="di">
          {{ d }}
        </div>
      </div>
    </div>
    <!-- <div class="calendar__control">
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

function generateCalendar(ctx) {
  const calendar = [];
  const now = new Date();
  [
    new Date(now.getFullYear(), now.getMonth() -1),
    new Date(now.getFullYear(), now.getMonth()),
    new Date(now.getFullYear(), now.getMonth() +1),
  ].forEach((date, index) => {
    calendar.push(generateMonth(date, (d) => {
      return ctx.formatDate(d);
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
      m.push(ccb(new Date(...dargs, ((j + 1) + (i * 7)) - (s - 1))));
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

      const container = this.$refs.calendarContainer;

      if (container.querySelector('.calendar__month--clone')) {
        container.removeChild(container.querySelector('.calendar__month--clone'));
      }
      const newMonth = new calendarMonth({
        propsData: {
          data: buildCalendar(this.year, this.month + 1, this.formatDate),
        },
      }).$mount();
      newMonth.$el.classList.add('calendar__month--clone');

      container.appendChild(newMonth.$el);
      const cloneItems = newMonth.getDaysDOM();

      const timeline = anime.timeline({
        duration: 160,
        // easing: 'cubicBezier(.5, .05, .1, .3)',
        easing: 'linear',
        autoplay: false,
        complete() {
          if (container.querySelector('.calendar__month--clone')) {
            // container.removeChild(container.querySelector('.calendar__month--clone'));
          }
        },
      });

      const daysNum = Array.from(Array(5)).map((_$, i) => i);
      const delay = function(n, i) {
        let val = 5;
        daysNum.some(_i => {
          if ((i - _i) % daysNum.length === 0) {
            val = ((_i * _i) + 30 * _i);
          }  
        });
        return val
      };

      if (this.touch.direction > 0) this.items.reverse();
      timeline.add({
        targets: this.items,
        translateX: `${80 * this.touch.direction}px`,
        // translateY: `${80 * this.touch.direction}px`,
        opacity: {
          value: 0,
        },
        delay
      });
      timeline.add({
        targets: cloneItems,
        translateX: [`${80 * this.touch.direction}px`, 0],
        // translateY: [`${80 * this.touch.direction}px`, 0],
        // translateX: 0,
        opacity: [0, 1],
        // delay: anime.stagger(10),
        delay,
      }, '-=160');

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

    buildCalendar() {
      const calendar = buildCalendar(this.year, this.month, this.formatDate);
      this.calendar = calendar;
    },

    formatDate(date) {
      return date.getDate();
    },
  },

  mounted() {
    this.calendar = generateCalendar(this);
    console.info(this.calendar);
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
  &__month
    width: 200px
    border: 1px solid #ccc
    display: flex
    flex-wrap: wrap
    box-sizing: border-box
  &__day
    flex-shrink: 0
    width: 20%
    border: 1px solid #ccc
    height: 40px
    box-sizing: border-box
  &__container
    position: relative
    z-index: 0
    width: 100%
    display: block
    overflow: hidden
    z-index: 5
    display: flex
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
