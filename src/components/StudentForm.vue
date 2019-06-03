<template>
  <form @submit.prevent class="form">
    <div class="form__item">
      <div class="form__item-label">
      </div>
      <div class="form__item-control"></div>
    </div>
  </form>
</template>
<script>
export default {
  name: 'student-form',

  data() {
    return {
      form: {
        name: null,
      },
    };
  },
};
</script>

style