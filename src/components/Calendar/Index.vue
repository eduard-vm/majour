<template>
  <div class="schedule" v-touch:moving="movingHandler" v-touch:start="touchActive = true" v-touch:end="touchActive = false">
    <!-- <div class="schedule__sidebar"></div> -->
    <div class="schedule__calendar">
      <div class="schedule__calendar-header">
        <div class="schedule__row schedule__row--header">
          <div class="schedule__cell" v-for="(name, idx) of calendarDays" :key="idx">
            <div class="schedule__cell-body">{{ name }}</div>
          </div>
        </div>
      </div>
      <div class="schedule__calendar-month">
        <div class="schedule__row" v-for="(r, ri) of calendar" :key="ri">
          <div :class="prepareCellClass('schedule__cell', c)" v-for="(c, ci) of r" :key="ci" @click="cellClickHandle(ri, ci)">
            <div class="schedule__cell-body">{{ c.date.day }}</div>
            <!-- <div class="day__date"></div> -->
            <!-- <div class="day__date"></div> -->
            <!-- <div class="day__details">
              <span class="ico">x</span>
              <span class="ico">s</span>
              <span class="ico">y</span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import anime from 'animejs';

const CalendarManager = function () {
  this.dasyOfWeekShort = 'пн,вт,ср,чт,пт,сб,вс'.split(',');
  this.dasyOfWeekFull = 'понедельник,вторник,среда,четверг,пятница,суббота,воскресенье'.split(',');
  this.monthOfYearFull = 'январь,февраль,март,апрель,май,июнь,июль,август,сентябрь,октябрь,ноябрь,декабрь'.split(',');
  this.monthOfYearShort = 'янв,фев,мар,апр,май,июн,июл,авг,сен,окт,нояб,дек'.split(',');
  this.calendar = this.calendar || [];
  this.currentDate = this.currentDate || new Date();
  this.currentYear = this.currentYear || new Date().getFullYear();
  this.currentMonth = this.currentMonth || new Date().getMonth();

  const self = this;

  this.fromatDate = function (date) {
    let monthName = self.getMonthNameFull(date.getMonth());
    monthName = monthName.split('');
    monthName = monthName[0].toUpperCase() + monthName.splice(1).join('');
    return `${monthName}, ${date.getDate()} `
  }

  this.generateMonthCalendar = function () {
    const currentDate = new Date();
    // currentDate.setMonth(self.month);
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentDayNumber = currentDate.getDate();
    const dayMonthStarts = new Date(currentYear, currentMonth).getDay();
    const dayEndsMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendar = [];

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let k = 0; k < 7; k++) {
        const dayNum = (k + 1) + (i * 7);
        const date = new Date(currentYear, currentMonth, dayNum - (dayMonthStarts - 1));
        const isWeakends = date.getDay() === 0 || date.getDay() === 6;
        if (!isWeakends) {       
          week.push({
            id: dayNum,
            date: {
              day: date.getDate(),
              month: date.getMonth(),
              format: self.fromatDate(date),
            },
            isToday: date.getDate() === currentDay && date.getMonth() === currentMonth,
            isPrevMonth: currentMonth < date.getMonth(),
            isNextMonth: currentMonth > date.getMonth()
          });
        }
      }
      calendar.push(week);
    }
    return calendar;
  };
};

CalendarManager.prototype.getDayNameFull = function (day) {
    return this.dasyOfWeekFull[day - 1];
};

CalendarManager.prototype.nextMonth = function (day) {
    return this.dasyOfWeekFull[day - 1];
};

CalendarManager.prototype.prevMonth = function (day) {
    // return this.dasyOfWeekFull[day - 1];

};

CalendarManager.prototype.getDayNameShort = function (day) {
    return this.dasyOfWeekShort[day - 1];
};
CalendarManager.prototype.getMonthNameFull = function (month) {
    return this.monthOfYearFull[month];
};
CalendarManager.prototype.getMonthNameShort = function (month) {
    return this.monthOfYearShort[month];
};

CalendarManager.prototype.create = function () {
  this.calendar = this.generateMonthCalendar();
  return this.calendar;
};

export default {
  name: 'home',
  data() {
    return {
      touchActive: false,
      calendarManager: null,
      calendarDays: 'пн,вт,ср,чт,пт'.split(','),
      calendar: [],
      studets: [],
    };
  },
  methods: {
    movingHandler(e, v) {
      console.log('movingHandler', e.touches[0].pageX);
    },

    touchStartHandle(e) {
      console.info('touchStartHandle ', e);
    },

    cellClickHandle(cellIndex, rowIndex) {
      console.log('on select cell ', cellIndex, rowIndex);
    },

    prepareCellClass(klass, cell) {
      const result = {
        [klass]: true,
      };

      if (cell.isPrevMonth || cell.isNextMonth) {
        result[`${klass}--disabled`] = true;
      }

      if (cell.isToday) {
        result[`${klass}--today`] = true;
      }

      return result;
    },

    buildCalendar(year, month) {
      this.calendar = [];
    },
  },

  created() {
    this.calendarManager = new CalendarManager();
    this.calendar = this.calendarManager.create();
    window.cman = this.calendarManager;
  }
};
</script>
<style lang="sass" scoped>
.schedule
  // margin-top: 20px
  display: flex
  box-sizing: border-box
  // padding: 6px
  &__sidebar
    // background-color: #d9d9d9
    width: 60px
    border-right: 1px solid #646464
    box-sizing: border-box
  // &__calendar
  &__calendar
    box-sizing: border-box
    width: 100vw
    // box-shadow: 0 3px 12px rgba(#000, 0.08)
  &__calendar-header,
  &__calendar-month
    box-sizing: border-box
    width: 100%
    // padding: 6px
  &__calendar-header
    padding-bottom: 0
  &__calendar-month
    padding-top: 0
    display: flex
    // margin-top: 12px
    flex-wrap: wrap
  &__row
    display: flex
    flex-grow: 1
    width: 100%
    flex-wrap: nowrap
    justify-content: stretch
    box-sizing: border-box
    &:first-child
      .schedule__cell
        border-top-width: 0
    &--header
      background-color: #f6f6f6
      .schedule__cell
        border: none
      .schedule__cell-body
        font-size: 13px
        display: flex
        justify-content: center
        align-items: center
        text-transform: uppercase
  &__cell
    height: calc(((100vh / 1.614) / 4) / 1.614)
    width: 20%
    // border-top: 1px solid #f0f0f0
    // border-right: 1px solid #e0e0e0
    border-top: 1px solid #f6f6f6
    border-right: 1px solid #f0f0f0
    color: #435861
    font-size: 15px
    border-left-width: 0
    border-bottom-width: 0
    padding: 2px
    &:last-of-type
      border-right-width: 0
    user-select: none
    position: relative
    &--disabled
      opacity: 0.3
      // background-color: #f0f0f0
      // color: #d0d0d0
    &--header
      border: none
      background-color: #f6f6f6
      .schedule__cell-body
        font-size: 13px
        text-transform: uppercase
        display: flex
        justify-content: center
        align-items: center
    &--today
      // border-left-width: 1px
      // border-bottom-width: 1px
      .schedule__cell-body
        border: 1px solid rgba(green, 0.6)
  &__cell-body
    box-sizing: border-box
    display: flex
    width: 100%
    height: 100%
    justify-content: center
    align-items: center
    border-radius: 2px
    font-size: 15px
    color: #84a68b
    transition: background-color 160ms ease-in-out, color 160ms ease-in-out
    // &:active
    //   background-color: #f0f0f0
    &:active
      background-color: rgba(green, 0.3)
      color: #f0f0f0
  .day
    &__date
      font-size: 11px
      text-transform: uppercase
      color: #848484
      padding: 2px
    &__details
      position: absolute
      bottom: 0
      right: 0
      font-size: 11px
  .ico
    display: inline-block
    width: 12px
    color: #848484
    height: 12px
    border-left: 1px solid #e0e0e0
    text-transform: uppercase
    text-align: center
    &:first-of-type
      border-left-width: 0
</style>
