<script setup lang="ts">


import { useUserStore } from '@/stores/useUserStore'; 

const userStore = useUserStore()

</script>
<template>
    <div class="password-strenght__title mb-2">{{`密碼強度(${userStore.strength})`}}</div>
    <div class="password-strenght__bar">
      <div :class="['password-strenght__result', userStore.strength]"></div>
    </div>
</template>
<style lang="scss">
.password-strenght {
  &__bar {
    background-color: #d1e6db;
    border-radius: 8px;
  }
  &__result {
    height: 8px;
    &.weak {
      width: 33%;
      background-color: #ff4d4f; /* 紅色 = 弱 */
    }
    &.medium {
      width: 66%;
      background-color: #faad14; /* 黃色 = 中 */
    }
    &.strong {
      width: 100%;
      background-color: #60c48f;
    }
  }
}
</style>
