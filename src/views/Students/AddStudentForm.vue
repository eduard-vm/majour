<template>
  <div>
    <h4>Форма добавление ученика</h4>
    <form @submit.prevent>
      <input type="text" v-model="student.name" name="name" placeholder="Имя Фамилия" />
    </form>
    <div>
      <button type="button" :disabled="formUnfilled">Добавить</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-student-form',
  data() {
    return {
      student: {
        name: null,
      },
    };
  },
  computed: {
    formUnfilled() {
      return !Object.values(this.student).some(Boolean);
    },
  },
}
</script>
