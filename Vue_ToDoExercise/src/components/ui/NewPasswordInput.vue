<!-- /src/components/PasswordInput.vue -->
<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import { useUiStore } from '@/stores/useUiStore'
import { ref } from 'vue'

const userStore = useUserStore()
const uiStore = useUiStore()

const show = ref(false)
function toggle() {
  show.value = !show.value
}
</script>

<template>
  <label for="newPassword" class="form-label">
    <h5 class="mb-3">{{ uiStore.passwordChangeModel ? '新密碼' : '密碼' }}</h5>
    <p class="mb-3">建議密碼包含大小寫字母與數字，以提高安全性（非必須）</p>
  </label>
  <div class="password__input-container">
    <input
      :type="show ? 'text' : 'password'"
      class="form-control focus password__input"
      name="newPassword"
      id="newPassword"
      minlength="6"
      placeholder="請輸入您的密碼(6位數以上)"
      v-model="userStore.newPassword"
      @input="userStore.checkStrength"
      required
    />
    <button class="password__button-visibility" @click="toggle" type="button">
      <span class="password__icon-visibility material-symbols-outlined">visibility</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.password {
  &__input {
    padding: 12px 16px;
  }
  &__input-container {
    position: relative;
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
