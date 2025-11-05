<script setup lang="ts">
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useUserStore } from '@/stores/useUserStore'
import { useUserApiStore } from '@/stores/useUserApiStore'
import { useUiStore } from '@/stores/useUiStore'
import SecurityQuestionChange from '@/components/layout/SecurityQuestionChange.vue'
import PasswordChange from '@/components/layout/PasswordChange.vue'

const uiStore = useUiStore()
const userStore = useUserStore()
const ApiStore = useUserApiStore()

async function submitForm(event: Event) {
  const form = event.target as HTMLFormElement
  if (!form.checkValidity()) {
    // 欄位沒填好，瀏覽器會自動顯示提示
    form.reportValidity()
    return
  }
  uiStore.showLoading()
  await ApiStore.updateProfile()
  uiStore.hideLoading()
}
</script>
<template>
  <form class="container p-3 text-left register" @submit.prevent="submitForm">
    <h2>個人檔案</h2>
    <div class="row">
      <div class="col-12 col-md-6 mb-3">
        <BaseInput
          label="暱稱"
          id="nickname"
          type="text"
          placeholder="請輸入您的暱稱"
          v-model="userStore.nickname"
        />
      </div>
      <div class="col-12 col-md-6 mb-3">
        <BaseInput
          label="體重 (kg)"
          id="weight"
          type="number"
          placeholder="請輸入您的體重"
          v-model="userStore.weight"
        />
      </div>
      <div class="col-12 mb-3 text-center">
        <RouterLink to="/" class="link">
          <BaseButton label="取消" class="cancel" />
        </RouterLink>
        <BaseButton label="修改個人資料" type="submit" class="primary" />
      </div>
    </div>
  </form>
  <SecurityQuestionChange />
  <PasswordChange />
</template>
<style lang="scss" scoped>
.password-strenght-figure {
  background-color: #60c48f;
}
.register {
  .focus {
    &:focus {
      border-color: #60c48f;
      box-shadow: none;
    }
  }
  .link + .primary {
    margin-left: 12px;
  }
}
</style>
