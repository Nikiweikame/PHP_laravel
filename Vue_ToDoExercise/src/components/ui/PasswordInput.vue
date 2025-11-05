<!-- /src/components/PasswordInput.vue -->
<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import { ref } from 'vue'

const userStore = useUserStore()

const show = ref(false)
function toggle() {
  show.value = !show.value
}
</script>

<template>
  <div class="login-card__inputbox">
    <span class="login-card__icon material-symbols-outlined">lock</span>
    <input
      name="password"
      class="login-card__input"
      placeholder="密碼"
      :type="show ? 'text' : 'password'"
      v-model="userStore.password"
    />
    <button class="login-card__button-visibility" @click="toggle" type="button">
      <span class="login-card__icon-visibility material-symbols-outlined">visibility</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.password {
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
