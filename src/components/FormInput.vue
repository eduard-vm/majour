<template>
  <div class="form-item">
    <div v-if="$slots.label || label" class="form__item-label">
      <slot name="label" />
    </div>
    <div class="form__item-control">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'form-item',

  props: {
    label: String,
  },
};
</script>
<style lang="sass" scoped>
.form-item
  &__label
  &__control
</style>
