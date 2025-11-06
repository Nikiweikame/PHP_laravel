<script setup lang="ts">
// import { useCounterStore } from "@/stores/meals.js";
import { ref } from 'vue'
import PasswordStrenght from '@/components/ui/PasswordStrenght.vue'
import SecurityQuestionSelect from '@/components/ui/SecurityQuestionSelect.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import NewPasswordInput from '@/components/ui/NewPasswordInput.vue'
import { useUserStore } from '@/stores/useUserStore'
import { useUserApiStore } from '@/stores/useUserApiStore'
const userStore = useUserStore()
const ApiStore = useUserApiStore()


function submitForm(event: Event) {
  const form = event.target as HTMLFormElement
  if (!form.checkValidity()) {
    // 欄位沒填好，瀏覽器會自動顯示提示
    form.reportValidity()
    return
  }
  // 驗證通過，送 API
  ApiStore.register()
}
</script>
<template>
  <form class="container p-3 text-left register" @submit.prevent="submitForm">
    <h2>註冊</h2>
    <div class="row">
      <div class="col-12 col-md-6 mb-3">
        <BaseInput
          label="帳號"
          id="account"
          type="text"
          placeholder="請輸入您的帳號"
          v-model="userStore.account"
        />
      </div>
      <div class="col-12 col-md-6 mb-3">
        <BaseInput
          label="暱稱"
          id="nickname"
          type="text"
          placeholder="請輸入您的暱稱"
          v-model="userStore.nickname"
        />
      </div>
      <div class="col-12 mb-3">
        <NewPasswordInput />
      </div>
      <div class="col-12 mb-3">
        <PasswordStrenght />
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
      <div class="col-12 mb-3">
        <SecurityQuestionSelect v-model="userStore.securityQuestion" />
      </div>
      <div class="col-12 mb-3">
        <BaseInput
          label="答案"
          id="security-answer"
          type="text"
          placeholder="請輸入您的答案"
          v-model="userStore.securityAnswer"
        />
      </div>
      <div class="col-12 mb-3 text-center">
        <RouterLink to="/" class="link">
          <BaseButton label="取消" class="cancel" />
        </RouterLink>
        <BaseButton type="submit" class="primary" label="註冊" />
      </div>
    </div>
  </form>
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
