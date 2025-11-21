<script setup lang="ts">
// import { useCounterStore } from "@/stores/meals.js";
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import { ref } from 'vue'
import LoginButton from '@/components/ui/LoginButton.vue'
import ForgotPasswordDialog from '@/components/layout/ForgotPasswordDialog.vue'
import { useUserStore } from '@/stores/useUserStore'
import { useUiStore } from '@/stores/useUiStore'
import { useUserApiStore } from '@/stores/useUserApiStore'

const userStore = useUserStore()
const uiStore = useUiStore()
const ApiStore = useUserApiStore()
</script>
<template>
  <div v-if="userStore.isLoggedIn" class="col-12 mt-3 mb-3 text-center">
    <RouterLink to="/profile" class="link">
      <BaseButton label="個人檔案" class="cancel" />
    </RouterLink>
    <RouterLink to="/item" class="link">
      <BaseButton label="運動項目" class="primary" />
    </RouterLink>
    <RouterLink to="/records" class="link">
      <BaseButton label="運動紀錄" class="primary" />
    </RouterLink>
  </div>
  <div v-else class="col-12 mt-3 mb-3 text-center">
    <RouterLink to="/register" class="link">
      <BaseButton label="註冊" class="cancel" />
    </RouterLink>
    <RouterLink to="/login" class="link">
      <BaseButton label="登入" class="primary" />
    </RouterLink>
  </div>
</template>
<style lang="scss" scoped>
.link + .link{
  margin-left: 16px;
}
</style>
