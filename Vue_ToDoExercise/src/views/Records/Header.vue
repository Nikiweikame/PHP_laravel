<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import MonthNavigator from '@/components/ui/MonthNavigator.vue'
const userStore = useUserStore()
</script>
<template>
  <header class="d-flex flex-xl-row flex-column justify-content-between align-items-center haeder">
    <h1 class="m-0 p-3">{{ `你好，${userStore.nickname}，今天要做什麼運動？` }}</h1>
    <MonthNavigator />
  </header>
</template>
<style lang="scss" scoped>
.haeder {
  h1 {
    font-weight: 900;
    font-size: 36px;
  }
}
</style>
