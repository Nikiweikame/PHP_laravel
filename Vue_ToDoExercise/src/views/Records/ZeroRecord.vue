<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
const authStore = useAuthStore()
</script>
<template>
  <p class="ZeroRecord">{{ `${authStore.nickname}，這個月快來做運動吧！` }}</p>
</template>
<style lang="scss" scoped>
.ZeroRecord {
  margin: 0;
  grid-column: 1 / -1;
  padding: 8px 0;
  font-weight: bold;
  color: #000;
}
</style>
