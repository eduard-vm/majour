<template>
  <div>
    <form @submit.prevent>
      <input type="text" v-model="student.name" name="name" placeholder="Имя Фамилия" />
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      student: {
        name: null,
      },
    };
  },
};
</script>
