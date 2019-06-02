<template>
  <div class="page">
    <nav class="nav">
      <router-link class="nav__item nav__item--students" :to="{ name: 'StudentsMain' }">Ученики</router-link>
      <router-link class="nav__item nav__item--calendar" :to="{ name: 'Calendar' }">Календарь</router-link>
    </nav>
    <!-- <button type="button" @click="$router.push({ name: 'Students' })">Ученики</button> -->
    <!-- <calendar /> -->
    <!-- <div v-for="(student, idx) of students" class="item" :key="idx">
      {{ student.name }}
    </div> -->
  </div>
</template>

<script>
// import Calendar from '@/components/Calendar';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'home-page',

  components: {
    // Calendar,
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters({}),
  },

  methods: {
    ...mapActions({}),
  },
};
</script>

<style lang="sass" scoped>
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
