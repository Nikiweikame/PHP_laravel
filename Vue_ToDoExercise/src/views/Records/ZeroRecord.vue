<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
const userStore = useUserStore()
</script>
<template>
  <p class="ZeroRecord">{{ `${userStore.nickname}，這個月快來做運動吧！` }}</p>
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
