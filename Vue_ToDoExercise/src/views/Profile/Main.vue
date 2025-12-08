<script setup lang="ts">
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUserApiStore } from '@/stores/useUserApiStore'
import { useUiStore } from '@/stores/useUiStore'
import SecurityQuestionChange from '@/components/layout/SecurityQuestionChange.vue'
import PasswordChange from '@/components/layout/PasswordChange.vue'
import { onMounted } from 'vue'
import { validProfileData } from '@/utils/valid'
import router from '@/router'

const uiStore = useUiStore()
const authStore = useAuthStore()
const ApiStore = useUserApiStore()

// router guard 或某個 middleware
authStore.resetModifyUser() // ← 在 onMounted 之前就執行！

// onMounted(() => {
//   console.log(authStore.userData)
//   authStore.resetModifyUser()
//   console.log(authStore.modifyUser)
// })

async function submitForm(event: Event) {
  const form = event.target as HTMLFormElement
  if (!form.checkValidity()) {
    // 欄位沒填好，瀏覽器會自動顯示提示
    form.reportValidity()
    return
  }
  uiStore.showLoading()
  const updateData = validProfileData(authStore.modifyUser)
  await authStore.doUpdateProfile(updateData)
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
          v-model="authStore.modifyUser.nickname"
        />
      </div>
      <div class="col-12 col-md-6 mb-3">
        <BaseInput
          label="體重 (kg)"
          id="weight"
          type="number"
          placeholder="請輸入您的體重"
          v-model="authStore.modifyUser.weight"
        />
      </div>
      <div class="col-12 mb-3 text-center">
        <RouterLink to="/records" class="link">
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
