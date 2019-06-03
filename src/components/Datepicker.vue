<template>
  <div class="datepicker">
    <div class=datepicker__date>
      <select v-model="year" class="form-input" aria-placeholder="ГОД">
        <option :value="null" disabled selected>ГОД</option>
        <option :value="y" v-for="y of years" :key="y">{{ y }}</option>
      </select>
      <span class="datepicker__splitter" />
      <select v-model="month" class="form-input">
        <option :value="null" disabled selected>МЕСЯЦ</option>
        <option :value="m.id" v-for="m of months" :key="m.id">{{ m.name }}</option>
      </select>
      <span class="datepicker__splitter" />
      <select v-model="day" class="form-input">
        <option :value="null" disabled selected>ДЕНЬ</option>
        <option :value="d" v-for="d of days" :key="d">{{ d }}</option>
      </select>
    </div>
    <!-- <div class="datepicker__append">{{ yearsOld }}</div> -->
  </div>
</template>
<script>
import { times } from 'lodash';
const monthNames = 'январь,февраль,март,апрель,май,июнь,июль,август,сентябрь,октябрь,ноябрь,декабрь'.split(',');
const days = 'понедельник,вторник,среда,четверг,пятница,суббота,воскресенье'.split(',');
function declOfNum(c, v) {  
  const cases = [2, 0, 1, 1, 1, 2];  
  return v[(c % 100 > 4 && c % 100 < 20) ? 2 : cases[(c % 10 <5) ? c % 10 : 5] ];  
}
export default {
  name: 'datepicker',

  props: {},

  data() {
    const nowYear = (new Date().getFullYear() - 3);
    const years = times(7, i => (nowYear - i)).reverse();
    const months = times(12, i => ({ id: i, name: monthNames[i] }));

    return {
      years,
      months,
      date: {
        year: null,
        month: null,
        day: null,
      },
    };
  },
  watch: {
    value: {
      immediate: true,
      handler() {

      },
    },
  },

  computed: {
    days() {
      if (this.date.year && this.date.month) {
        console.log('on return date ', this.date.month, new Date(this.date.year, this.date.month, 0).getDate());
        return times(new Date(this.date.year, this.date.month + 1, 0).getDate(), i => ++i);
      }
      return times(31, i => ++i);
    },

    yearsOld() {
      // if (this.student.birthday) {
      //   const ageDifMs = Date.now() - new Date(...this.student.birthday.split('-')).getTime();
      //   const ageDate = new Date(ageDifMs);
      //   const yearsOld = Math.abs(ageDate.getUTCFullYear() - 1970);
      // }

      // return null;
      return `6 ${declOfNum(6, ['год', 'года', 'лет'])}`;
    },

    year: {
      get() {
        return this.date.year;
      },
      set(value) {
        this.date.year = value;
      },
    },
    month: {
      get() {
        return this.date.month;
      },
      set(value) {
        this.date.month = value;
      },
    },
    day: {
      get() {
        return this.date.day;
      },
      set(value) {
        this.date.day = value;
      },
    },
  },
}
</script>

<style lang="sass" scoped>
$light: #fdfdfd
$dark-gray: #747474
$gray: #a5a5a5
$light-gray: #d8d8d8
$accent: #ff3b53
.datepicker
  paddin: 0
  display: flex
  &__date
    padding: 0 24px
    border: 1px solid $gray
    // border-right-width: 0
    display: flex
    align-items: center
    justify-content: space-between
    width: 100%
    box-sizing: border-box
    height: 100%
  &__append
    height: 100%
    flex-shrink: 0
    font-size: 13px
    display: flex
    flex-direction: column
    // padding: 12px 6px
    text-transform: uppercase
  &__splitter
    display: inline-block
    width: 16px
    height: 1px
    // margin: 0 2px
    box-sizing: border-box
    transform: rotate(-60deg)
    background-color: #000
  .form-input
    padding: 12px 0
    display: inline-block
    border-radius: 0
    position: relative
    width: auto
    margin: 0
    text-transform: uppercase
    border: none
    text-align: center
    border-left-width: 0
    background-color: #fff
    height: 100%
    min-width: 50px
    border-right-width: 0
    text-align: center
    font-size: 13px
    text-align-last: center
    option
      background-color: #fff
      color: #000
    &:nth-child(2),
    &:nth-child(3)
      // margin-left: 12px
    // &:nth-child(1),
    // &:nth-child(3)
    //   width: 60px
    &:nth-child(1)
      text-align: left
      text-align-last: left

.form-input
  // border-radius: 15px
  border: none
  // width: 100%
  box-sizing: border-box
  // font-size: 13px
  color: #000
  // background-color: $light-gray
  // box-shadow: 0 1px 3px rgba(#000, 0.088)
  border: 1px solid $gray
  &--rounded
    border-radius: 2px

  &:active,
  &:focus
    outline: none
    // box-shadow: 0 3px 7px rgba(#000, 0.099)
    // & + label
    //   color: $accent
    //   opacity: 1
    //   transform: translateY(-60px)
</style>
