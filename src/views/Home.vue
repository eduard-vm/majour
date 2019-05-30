<template>
  <div class="page">
    <calendar />
    <!-- <div v-for="(student, idx) of students" class="item" :key="idx">
      {{ student.name }}
    </div> -->
  </div>
</template>

<script>
import Calendar from '@/components/Calendar';
export default {
  name: 'home-page',

  components: {
    Calendar,
  },

  data() {
    return {
      students: [
        {
          name: 'Student 1',
          id: 1,
        },
        {
          name: 'Student 2',
          id: 2,
        },
        {
          name: 'Student 2',
          id: 3,
        },
      ],
    }
  },
};
</script>

<style lang="sass" scoped>

</style>
