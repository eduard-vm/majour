<template>
  <div>
    <form @submit.prevent class="form">
      <div class="form-item">
        <label for="name">Имя Фамилия</label>
        <div class="form-item__control">
          <input class="form-input" type="text" v-model="student.name" name="name" />
        </div>
      </div>
      <div class="form-item">
        <label for="birthday">Дата рождения</label>
        <div class="form-item__control">
          <input class="form-input form-input--date" type="date" v-model="student.birthday" name="birthday">
          <div class=form-item__append>{{ yearsOld }}</div>
        </div>
      </div>
      <div class="form-item" style="margin-top:96px">
        <label for="diagnosis">Диагноз</label>
        <div class="form-item__control">
          <textarea
            class="form-input form-input--textarea"
            v-model="student.diagnosis"
            name="diagnosis"
            rows="10"
          />
        </div>
      </div>
      <!-- <div class="form-splitter" /> -->
      <div class="form-item">
        <label for="motherName">Имя мамы</label>
        <div class="form-item__control">
          <input class="form-input" type="text" v-model="student.motherName" name="motherName">
        </div>
      </div>
      <div class="form-item">
        <label for="phone">Телефон</label>
        <div class="form-item__control">
          <input @focus="focus=true" v-mask="'+7(###)###-##-##'" placeholder="+7(888)888-88-88" @blur="focus=false" class="form-input" type="text" v-model="student.phone" name="phone">
        </div>
      </div>
    </form>

    <div class="form-control">
      <button type="button" class="button button--full-width" :disabled="formIsFilled" @click="onSave">Добавить</button>
    </div>
  </div>
</template>

<script>
function declOfNum(c, v) {  
  const cases = [2, 0, 1, 1, 1, 2];  
  return v[(c % 100 > 4 && c % 100 < 20) ? 2 : cases[(c % 10 <5) ? c % 10 : 5] ];  
}
// use:
// declOfNum(count, ['найдена', 'найдено', 'найдены']);
import { mapActions } from 'vuex';

export default {
  name: 'new-student-form',
  data() {
    const today = new Date();
    return {
      today,
      focus: false,
      student: {
        name: null,
        birthday: null,
        phone: null,
        motherName: null,
        diagnosis: null,
      },
    };
  },
  computed: {
    yearsOld() {
      if (this.student.birthday) {
        const ageDifMs = Date.now() - new Date(...this.student.birthday.split('-')).getTime();
        const ageDate = new Date(ageDifMs);
        const yearsOld = Math.abs(ageDate.getUTCFullYear() - 1970);
        return `${yearsOld} ${declOfNum(yearsOld, ['год', 'года', 'лет'])}`;
      }

      return null;
    },

    formIsFilled() {
      const { name, birthday, diagnosis } = this.student;
      return [name, birthday, diagnosis].every(Boolean);
    },
  },
  watch: {
    student: {
      deep: true,
      handler(data) {
        console.info('data changed ', data);
      },
    },
  },
  methods: {
    ...mapActions({
      save: 'studets/save',
    }),

    onSave() {
      console.log('on save user ');
      // this.$notify({
      //   group: 'bottom',
      //   title: 'Добавление ученика',
      //   text: 'Ученик успешно добавлен',
      // });
      alert('Ученик успешно добавлен');
    }
  },
}
</script>

<style lang="sass" scoped>
form
  width: 100%
  padding: 0 20px
  box-sizing: border-box
.form-splitter
  width: 100%
  // border-bottom: 1px solid #e9e2dc
  // border-bottom: 1px solid 
  background-color: #e7edf0
  height: 12px
  box-sizing: border-box
  display: block
  margin: 48px 0
.form-control
  padding: 20px
  box-sizing: border-box
.form-item
  font-size: 13px
  color: #6d6d6d
  margin-bottom: 48px
  &__control
    display: flex
    justify-content: space-between
  label
    font-size: 13px
    text-transform: uppercase
    color: #3d3d3d
    margin-bottom: 12px
    display: block
  &__append
    padding: 0 20px
    line-height: auto
    color: inherit
    font-size: inherit
    align-items: center
    display: flex
.form
  margin-top: 24px
.button
  border: none
  // border: 1px solid #f1e7b6
  background-color: #f1e7b6
  // background-color: #fff
  padding: 12px
  line-height: 1
  // color: #8d8d8d
  color: #636360
  font-size: 13px
  border-radius: 2px
  text-transform: uppercase
  &--full-width
    width: 100%
  &:focus
    outline: none
    outline-width: 0
  &:active
    background-color: #f1e7b6
    opacity: 0.5
  &:disabled
    opacity: 0.5
    // color: #ebeded
    // border-color: #fff
    // background-color: #e7edf0
    // background-color: #e9e2dc
    // background-color: #f9f9f9
    // color: #fff
.form-input
  // border: 1px solid #f0f0f0
  border: 1px solid #f0f0f0
  border-width: 0 0 1px 0
  background-color: #fff
  width: 100%
  padding: 0
  margin: 0
  line-height: auto
  color: inherit
  font-size: inherit
  display: inline-block
  box-sizing: border-box
  transition: border-color 120ms linear
  padding: 12px 0
  &--date
    width: 70%
    min-width: 120px
  &--textarea
    // border-width: 1px
    resize: none
    &:focus,
    &:active
      border-color: #f1e7b6
  &:focus,
  &:active
    outline: none
    outline-width: 0
    // border-bottom: 1px solid #fc7969
    border-bottom-color: #f1e7b6
</style>
