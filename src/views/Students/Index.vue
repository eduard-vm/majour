<template>
  <div class="page">
    <div class="page__content" v-if="students.length">
      <div class="list list--students">
        <div class="list__item" v-for="(student, idx) of students" :key="idx">
          {{ student.name }}
        </div>
      </div>
    </div>
    <!-- <div class="content__empyt" v-else>
      <p>Ай-яй, нет ни одного ученика...</p>
    </div> -->
    <router-link :to="{ name: 'AddNewStudent' }">Добавить ученика</router-link>
    <!-- <button type="button" @click="$router.push({ name: 'AddNewStudent' })">Добавить ученика</button> -->
    <!-- <button type="button" @click="$router.push({ name: 'AddNewStudent' })">Добавить ученика</button> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'students-index',

  computed: {
    ...mapGetters({
      students: 'students/all',
    }),
  },

  methods: {
    ...mapActions({}),
  },
};
</script>

<style lang="sass" scoped>
  .page
    &__content
      box-shadow: 0 2px 6px 0 rgba(#000, 0.08)
</style>
