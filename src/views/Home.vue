<template>
  <div class="home">
    <calendar />
  </div>
</template>

<script>
import Calendar from '@/components/Calendar';
export default {
  name: 'home-page',

  components: {
    Calendar,
  },
};
</script>
