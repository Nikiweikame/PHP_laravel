<script setup lang="ts">
import Logo from '../ui/Logo.vue'
</script>
<template>
  <RouterLink to="/" class="link">
    <header class="header__container">
      <h1>好想做運動<Logo class="header__Logo" /></h1>
    </header>
  </RouterLink>
</template>
<style lang="scss" scoped>
.header {
  &__container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    h1 {
      margin: 0;
      font-size: 0;
    }
  }
  &__Logo {
    height: 150px;
  }
}
</style>
