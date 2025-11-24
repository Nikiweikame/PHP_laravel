<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserApiStore } from '@/stores/useUserApiStore';


// 取得 store
const authStore = useAuthStore()
const ApiStore = useUserApiStore()
</script>
<template>
  <div>
    <button type="submit" class="login-button">
      <span class="truncate">登入</span>
    </button>
  </div>
</template>
<style lang="scss" scoped>
  .login-button {
    width: 100%;
    padding: 12px 8px;
    background-color: #60c48f;
    border: none;
    color: white;
    border-radius: 12px;
  }
</style>