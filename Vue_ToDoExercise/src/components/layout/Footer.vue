<script setup lang="ts">
// import { useCounterStore } from "@/stores/meals.js";
import { RouterLink, RouterView } from 'vue-router'
defineProps({
  name: {
    type: String,
  },
})
</script>
<template>
  <footer class="footer__container">
    <p class="footer__copyright mb-0">© 2025 好想做運動. All rights reserved.</p>
  </footer>
</template>
<style lang="scss" scoped>
.footer {
  &__container {
    color: #888888;
    width: 100%;
    margin: 16px auto;
  }
  &__copyright {
    text-align: center;
  }
}
</style>
