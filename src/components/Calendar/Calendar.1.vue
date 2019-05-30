<template>
  <div class="calendar">
    <div class="calendar__control">
      <div class="left">
        <button type="button" @click="prevMonth" class="calendar__control-btn calendar__control-btn--prev" />
      </div>
      <div class="center">
        <transition mode="out-in">
          <span>
            {{ monthDisplayed }}
          </span>
        </transition>
      </div>
      <div class="right">
        <button type="button" @click="nextMonth" class="calendar__control-btn calendar__control-btn--next" />
      </div>
    </div>
    <transition 
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @enter-cancelled="enterCancelled"

      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
      @leave-cancelled="leaveCancelled"
    >
      <div class="calendar__month">
        <div class="calendar__week" v-for="(week, weekNum) of calendar" :key="weekNum">
          <div class="calendar__day" v-for="(day, dayNum) of week" :key="dayNum">
            {{ day.date.day }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Calendar from '@/components/Calendar';

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
      calendar: [],
    };
  },

  computed: {
    monthDisplayed() {
      return months[this.month];
    }
  },

  watch: {
    calendar(calendar) {
      console.info('on update calendar', calendar);
    },

    month: {
      handler: 'buildCalendar',
    },
  },

  methods: {
    // ANIMATION
    beforeEnter(el) {
      console.info('@animation:before-enter ', el);
    },
    enter(el, done) {
      done();
    },
    afterEnter() {},
    enterCancelled() {},
    beforeLeave() {},
    leave(el, done) {
      done();
    },
    afterLeave() {},
    leaveCancelled() {},
    // !ANIMATION
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

  created() {
    const now = new Date();
    this.year = now.getFullYear(); 
    this.month = now.getMonth(); 
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
  &__week
    width: 100%
    display: flex
  &__day
    box-sizing: border-box
    width: 20%
    margin: 4px
    min-height: 60px
    border: 1px solid #dbe4e1
    color: #455843
    // padding: 12px
    display: flex
    justify-content: center
    align-items: center
    font-size: 17px
    border-radius: 2px
    &:active
      opacity: 0.7
  &__control
    padding: 10px 0
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
