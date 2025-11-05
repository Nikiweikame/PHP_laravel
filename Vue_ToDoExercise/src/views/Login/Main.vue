<script setup lang="ts">
// import { useCounterStore } from "@/stores/meals.js";
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import LoginButton from '@/components/ui/LoginButton.vue'
import ForgotPasswordDialog from '@/components/layout/ForgotPasswordDialog.vue'
import { useUserStore } from '@/stores/useUserStore'
import { useUiStore } from '@/stores/useUiStore'
import { useUserApiStore } from '@/stores/useUserApiStore'

const userStore = useUserStore()
const uiStore = useUiStore()
const ApiStore = useUserApiStore()

const show = ref(false)
function toggle() {
  show.value = !show.value
}
const DialogShow = ref(false)
async function showDialog() {
  uiStore.showLoading()
  userStore.reset()
  await ApiStore.getSecurityQuestions()
  uiStore.toggleForgetPasswordModel()
  uiStore.hideLoading()
}
async function submitForm(event: Event) {
  const form = event.target as HTMLFormElement
  if (!form.checkValidity()) {
    // 欄位沒填好，瀏覽器會自動顯示提示
    form.reportValidity()
    return
  }
  uiStore.showLoading()
  ApiStore.login()
  uiStore.hideLoading()
}
</script>
<template>
  <div class="card login-card__container">
    <form class="card-body" @submit.prevent="submitForm">
      <h5 class="card-title text-center login-card__title">登入您的帳戶</h5>
      <label class="w-100">
        <div class="login-card__inputbox">
          <span class="login-card__icon material-symbols-outlined">person</span>
          <input
            name="account"
            class="login-card__input"
            placeholder="使用者帳號"
            v-model="userStore.account"
            required
          />
        </div>
      </label>
      <label class="w-100">
        <div class="login-card__inputbox">
          <span class="login-card__icon material-symbols-outlined">lock</span>
          <input
            name="password"
            class="login-card__input"
            placeholder="密碼"
            :type="show ? 'text' : 'password'"
            v-model="userStore.password"
            required
          />
          <button class="login-card__button-visibility" @click="toggle" type="button">
            <span class="login-card__icon-visibility material-symbols-outlined">visibility</span>
          </button>
        </div>
      </label>
      <div class="flex items-center justify-between text-sm">
        <a class="" href="#" @click="showDialog">忘記密碼?</a>
      </div>
      <LoginButton />
      <div class="text-center">
        還沒有帳號?
        <RouterLink to="/register" class="">立即註冊</RouterLink>
      </div>
    </form>
  </div>
  <ForgotPasswordDialog />
</template>
<style lang="scss">
.login-card {
  &__container {
    width: 400px;
    margin: 16px auto;
    .card-body {
      width: 100%;
    }
    form {
      height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    a {
      text-decoration: none;
      color: #60c48f;
    }
  }
  &__title {
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 24px;
  }
  &__input {
    width: 100%;
    height: 3rem;
    padding: 12px 16px 12px 48px;
    border: 1px solid #dce5e0;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #333333;
    &::placeholder {
      color: #888888;
    }
    &:focus {
      outline: none;
      border-color: #60c48f;
      box-shadow: 0 0 0 3px rgb(96 196 143 / 0.3);
    }
  }
  &__inputbox {
    position: relative;
  }
  &__icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 24px;
    left: 12px;
  }
  &__button-visibility {
    display: flex;
    position: absolute;
    padding: 0 12px 0 0;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    border: none;
    background-color: transparent;
  }
}
</style>
