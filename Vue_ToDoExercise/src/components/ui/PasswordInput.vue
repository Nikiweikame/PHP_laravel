<!-- /src/components/PasswordInput.vue -->
<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'
import { ref } from 'vue'

const authStore = useAuthStore()
const props = defineProps({
  modelValue: { type: String, default: '' }, // 綁定值（支援 v-model）
})
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
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
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
