<template>
  <div class="page">
    <router-link :to="{ name: 'Students' }">Добавить ученика</router-link>
    <router-link :to="{ name: 'Calendar' }">Календарь</router-link>
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

<style lang="sass" scoped></style>
