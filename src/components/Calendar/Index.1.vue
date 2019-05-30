<template>
  <div class="schedule" v-touch:moving="movingHandler" v-touch:start="onTouchStart" v-touch:end="onTouchEnd">
    <div class="schedule__header">
      {{ currentMonth }} {{ currentYear !== new Date().getFullYear() ? currentYear : '' }}
    </div>
    <div class="schedule__calendar">
      <div class="schedule__calendar-header">
        <div class="schedule__row schedule__row--header">
          <div class="schedule__cell" v-for="(name, idx) of calendarDays" :key="idx">
            <div class="schedule__cell-body">{{ name }}</div>
          </div>
        </div>
      </div>
      <div class="schedule__pane">
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
  </div>
</template>

<script>
import anime from 'animejs';
const months = 'январь,февраль,март,апрель,май,июнь,июль,август,сентябрь,октябрь,ноябрь,декабрь'.split(',');

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

  this.generateMonthCalendar = function (year, month) {
    const currentDate = new Date();
    console.log('year ', year, month)
    if (year) currentDate.setFullYear(year);
    if (month) currentDate.setMonth(month);

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
      self.currentYear = currentYear;
      self.currentMonth = currentMonth;
      calendar.push(week);
    }
    return calendar;
  };
};

CalendarManager.prototype.getMonth = function (day) {
    return this.currentMonth;
};

CalendarManager.prototype.getFullYear = function (day) {
    return this.currentYear;
};

CalendarManager.prototype.getDayNameFull = function (day) {
    return this.dasyOfWeekFull[day - 1];
};

CalendarManager.prototype.nextMonth = function () {
  return this.generateMonthCalendar(this.currentYear, this.currentMonth + 1);
};

CalendarManager.prototype.prevMonth = function () {
  return this.generateMonthCalendar(this.currentYear, this.currentMonth - 1);
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
  return this.generateMonthCalendar();
};

function parseCSSTransform(str) {
  const transform = {
    translateX: {
      value: 0,
      unit: 'px',
    },
    translateY: {
      value: 0,
      unit: 'px',
    },
    translateZ: {
      value: 0,
      unit: 'px',
    },
    rotateZ: {
      value: 0,
      unit: 'deg',
    },
    rotateY: {
      value: 0,
      unit: 'deg',
    },
    rotateZ: {
      value: 0,
      unit: 'deg',
    },
    skewZ: {
      value: 0,
      unit: 'deg',
    },
    skewY: {
      value: 0,
      unit: 'deg',
    },
    skewZ: {
      value: 0,
      unit: 'deg',
    },
    skew: {},
    rotate: {},
    translate: {},
  };

  const props = str.split(/\s(?=\S+\(.*?\))(?!rotate(?:Y|Z))/).forEach(prop => {
    prop = prop.split('(').filter(Boolean);
    if (prop.length) {
      const key = prop[0];
      
      let value = (prop[1].split('').splice(0, prop[1].length - 1).join(''));
      value = value.match(/([0-9-.]+)([^0-9-\s]+)/);
      transform[key] = {
        value: +value[1],
        unit: value[2],
      };
    }
  });

  return transform;
}

function easeInSin(t) {
  return 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2);
}

export default {
  name: 'home',
  data() {
    return {
      touchActive: false,
      currentMonthIndex: new Date().getMonth(),
      calendarManager: null,
      calendarDays: 'пн,вт,ср,чт,пт'.split(','),
      startTX: 0,
      treshold: 120,
      currentYear: new Date().getFullYear(),
      startXPos: 0,
      calendar: [],
      studets: [],
    };
  },
  computed: {
    currentMonth() {
      return months[this.currentMonthIndex];
    },
  },
  methods: {
    movingHandler(e, v) {
      const $el = this.$el.querySelector('.schedule__calendar-month');
      const posX = (this.startX - e.touches[0].clientX);
      const posX1 = e.touches[0].clientX;
      let x = this.startTX - posX;
      $el.style.transform = `translateX(${x}px)`;
    },

    onTouchStart(e) {
      console.info('onTouchStart ', e);
      this.startX = e.touches[0].clientX;
      // const currX = parseCSSTransform($el.style.transform).translateX.value;
      const $el = this.$el.querySelector('.schedule__calendar-month');
      this.startTX = parseCSSTransform($el.style.transform).translateX.value;
      console.log(e.touches)
    },

    onTouchEnd(e) {
      const $el = this.$el.querySelector('.schedule__calendar-month');
      const currX = parseCSSTransform($el.style.transform).translateX.value;
      const delta = currX - this.startTX;
      console.log('delta: ', delta, this.treshold)
      if (delta < -this.treshold) {
        console.log(' туда слайд > ')
        this.nextMonth();
        anime({
          targets: '.schedule__calendar-month',
          // opacity: [0, 1],
          translateX: '-100%',
          easing: 'linear',
          duration: 300,
        });
      } else if (delta > this.treshold) {
        this.prevMonth();
        anime({
          targets: '.schedule__calendar-month',
          // opacity: [0, 1],
          translateX: '100%',
          easing: 'linear',
          duration: 300,
        });
        console.log(' сюда слайд > ')
      }
      console.log(anime)
      anime({
        targets: '.schedule__calendar-month',
        opacity: [0, 1],
        translateX: 0,
        easing: 'linear',
        duration: 300,
      });
      // $el.style.transform = `translateX(0)`;
      console.info('onTouchEnd ', e);
    },

    nextMonth() {
      this.calendar = this.calendarManager.nextMonth();
      this.currentMonthIndex = this.calendarManager.getMonth();
      this.currentYear = this.calendarManager.getFullYear();
    },

    prevMonth() {
      this.calendar = this.calendarManager.prevMonth();
      this.currentMonthIndex = this.calendarManager.getMonth();
      this.currentYear = this.calendarManager.getFullYear();
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
  // display: flex
  box-sizing: border-box
  width: 100%
  &__header
    font-size: 24px
    text-align: center
    padding: 20px 0
    text-transform: uppercase
    font-weight: bold
  // padding: 6px
  &__pane
    width: 100%
    overflow: hidden
    // background-color: rgba(yellow, 0.5)
  &__sidebar
    // background-color: #d9d9d9
    width: 60px
    border-right: 1px solid #646464
    box-sizing: border-box
  // &__calendar
  &__calendar
    box-sizing: border-box
    width: 100%
    // box-shadow: 0 3px 12px rgba(#000, 0.08)
  &__calendar-header,
  &__calendar-month
    // transform: translateX(100px)
    box-sizing: border-box
    width: 100%
    // transition: transform 240ms ease-in-out
    // padding: 6px
  &__calendar-header
    padding-bottom: 0
  &__calendar-month
    padding-top: 0
    // display: flex
    // margin-top: 12px
    // flex-wrap: wrap
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
    // height: calc(((100% / 1.614) / 4) / 1.614)
    width: 20%
    height: auto
    min-height: 60px
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
    color: #2c3c2f
    transition: background-color 160ms ease-in-out, color 160ms ease-in-out
    &:active
      background-color: rgba(#000, 0.3)
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
