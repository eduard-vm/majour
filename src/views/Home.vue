<template>
  <div class="page">
    <div class="form">
      <div class="form-item form-item--rounded">
        <label for="name">Имя Фамилия</label>
        <input
          for="name" type="text" autocomplete="off"
          class="form-input form-input--rounded"
          v-model="form.name"
        />
      </div>
      <div class="form-item">
        <label for="birthday">Дата рождения</label>
        <datepicker />
        <!-- <input
          type="date" name="birthday"
          class="form-input form-input--date"
          v-model="form.birthday" 
        /> -->
        <div class="form-item__control">
          <!-- <div class=form-item__append>{{ yearsOld }}</div> -->
        </div>
      </div>
      <div class="form-item">
        <label for="motherName">Имя мамы</label>
        <input class="form-input" type="text" v-model="form.motherName" name="motherName">
      </div>
      <div class="form-item">
        <label for="phone">Телефон</label>
        <input
          v-mask="'+7(###)###-##-##'" placeholder="+7(___)___-__-__"
          class="form-input" type="text" v-model="form.phone" name="phone">
      </div>
      <div class="form-item form-item--rounded">
        <label for="name">Диагноз</label>
        <textarea
          for="name" rows="10" autocomplete="off"
          class="form-input form-input--rounded"
          v-model="form.diagnosis" 
        />
      </div>
    </div>
    <!-- <nav class="nav">
      <router-link class="nav__item nav__item--students" :to="{ name: 'StudentsMain' }">Ученики</router-link>
      <router-link class="nav__item nav__item--calendar" :to="{ name: 'Calendar' }">Календарь</router-link>
    </nav> -->
    <!-- <button type="button" @click="$router.push({ name: 'Students' })">Ученики</button> -->
    <!-- <calendar /> -->
    <!-- <div v-for="(student, idx) of students" class="item" :key="idx">
      {{ student.name }}
    </div> -->
    <!-- <h1>Menu</h1> -->
    <!-- <button @click="addStudent">Добавить ученика</button> -->
    <!-- <div class="form-progress">
    </div> -->
  </div>
</template>

<script>
// import Calendar from '@/components/Calendar';
import { mapGetters, mapActions } from 'vuex';
import Datepicker from '@/components/Datepicker';
import faker from 'faker';

var db = null;

function onerr(e) {
  console.info('indexed db: on err', e);
}

function onsuccess(e) {
  db = event.target.result;
  console.log('on return db ', db, e)
  return db;
}


const connect = (dbName) => {
  const req = window.indexedDB.open(dbName);

  return new Promise((resolve, reject) => {
    req.onerror = onerr;
    req.onsuccess = event => resolve(onsuccess(event));
    req.onupgradeneeded = event => resolve(onsuccess(event));
  });
}


export default {
  name: 'home-page',

  components: {
    // Calendar,
    Datepicker,
  },

  data() {
    return {
      form: {
        name: 'Жан-Поль Михалёв',
        birhday: null,
        diagnosis: null,
        motherName: null,
        phone: null,
      }
    };
  },

  computed: {
    ...mapGetters({}),
  },

  methods: {
    ...mapActions({
      save: 'students/save',
    }),

    async addStudent() {
      const student = {
        id: Date.now(),
        name: faker.name.findName(),
        diagnosis: faker.lorem.words(30),
        birhday: faker.date.between(new Date(2009, 0, 0), new Date(2013, 0, 0)),
        created_at: new Date(),
      };

      // const db = await connect('schedule');
      // if (!Object.values(db.objectStoreNames).includes('students')) {
      //   db.createObjectStore('students', { keyPath: 'id' });
      // }
      // const transaction = db.transaction(['students'], 'readwrite');
      // transaction.oncomplete = function(event) {
      //   console.log('on transaction ', event);
      // }
      // transaction.onerror = function(event) {
      //   console.log('on error ', event);
      // }
      // req.onerror = function (err) {
      //   console.error('ON ERR ', err)
      // }
      // .objectStore('customers').get('444-44-4444');
      // console.info('connection ', conn);
      // const transaction = db.transaction(['students'], 'readwrite');

      // transaction.oncomplete = function(event) {
      //   alert('All done!');
      // };

      // transaction.onerror = function(err) {
      //   // Don't forget to handle errors!
      //   console.info('on get object store error ', err);
      // };

      // var objectStore = transaction.objectStore('students');
      // console.info('object store', objectStore);
      // for (var i in customerData) {
      //   var request = objectStore.add(customerData[i]);
      //   request.onsuccess = function(event) {
      //     // event.target.result == customerData[i].ssn;
      //   };
      // }
      // .then(r => {
      //   console.info('on connect', r);
      // }).catch(err => {
      //   console.info('on connect error', r);
      // });
    },
  },

  mounted() {
    window.faker = faker;
  }
};
</script>

<style lang="sass" scoped>
  $light: #fdfdfd
  $dark-gray: #747474
  $gray: #a5a5a5
  $light-gray: #d8d8d8
  $accent: #ff3b53
  .form-item
    margin-bottom: 32px
    label
      font-size: 13px
      text-transform: uppercase
      color: #000
      // transform: translateY(-45px)
      // opacity: 0
      display: inline-block
      margin: 0 0 8px 12px
      // transition: opacity 120ms linear, transform 120ms linear
  .form-input
    // border-radius: 15px
    border: none
    padding: 12px 24px
    width: 100%
    box-sizing: border-box
    font-size: 13px
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
  textarea
    &.form-input
      padding: 18px 24px
  .form
    height: 100%
    width: 100%
    box-sizing: border-box
    // background-color: #f3f3f3
    position: relative
    padding: 12px 20px
    // &:before
    //   width: 80px
    //   height: 100%
    //   position: absolute
    //   top: 0
    //   left: -40px
    //   // background-color: blue
    //   background-color: $light-gray
    //   border-radius: 0 50px 0 0
    //   content: ''
  .form-progress
    width: 90%
    height: 4px
    // background-color: rgba(blue, 0.5)
    background-color: blue
    // box-shadow: inset 0 1px 1px rgba(#000, 0.5)
    margin: 0 auto
    border-radius: 3px
  .page
    height: 100%
  .nav
    width: 100%
    &__item
      border-left: 1px solid #f0f0f0
      // display: flex
      // justify-content: center
      // align-items: center
      width: 100%
      display: block
      padding: 30px 10px
      color: #8d8d8d
      text-decoration: none
      font-size: 13 px
      min-height: 30%
      &:active
        opacity: 0.6
</style>
