<script setup lang="ts">
import { ref } from 'vue'
import SecurityQuestionSelect from '@/components/ui/SecurityQuestionSelect.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useUserStore } from '@/stores/useUserStore'
import { useUiStore } from '@/stores/useUiStore'
import { useUserApiStore } from '@/stores/useUserApiStore'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import NewPasswordInput from '../ui/NewPasswordInput.vue'
import PasswordStrenght from '@/components/ui/PasswordStrenght.vue'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])
const userStore = useUserStore()
const uiStore = useUiStore()
const ApiStore = useUserApiStore()

function closeDialog() {
  userStore.clearSecurityInfo()
  uiStore.passwordChangeModel = false
}

const step = ref('security-question')
function next() {
  step.value = 'change-password'
}
async function updatePasswordDate() {

  // 驗證通過，送 API
  uiStore.showLoading()
  await ApiStore.renewPassword()
  closeDialog()
  uiStore.hideLoading()
}
async function submitForm(event: Event) {
  const form = event.target as HTMLFormElement
  if (!form.checkValidity()) {
    // 欄位沒填好，瀏覽器會自動顯示提示
    form.reportValidity()
    return
  }

  // 驗證通過，送 API
  uiStore.showLoading()
  await ApiStore.updatePassword()
  closeDialog()
  uiStore.hideLoading()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="uiStore.passwordChangeModel" class="dialog-backdrop" @click.self="closeDialog">
        <form class="dialog-content" @submit.prevent="submitForm">
          <div class="mb-3">
            <h3 class="mb-3">重設密碼</h3>
            <p class="mb-3">請輸入舊密碼與新密碼</p>
          </div>
          <div class="mb-3">
            <label for="password" class="mb-3 w-100 form-label">
              <h5>舊密碼</h5>
            </label>
            <PasswordInput />
          </div>
          <div class="mb-3">
            <NewPasswordInput />
          </div>
          <div class="mb-3">
            <PasswordStrenght />
          </div>
          <div class="mb-3 text-end">
            <BaseButton class="cancel" type="button" @click="closeDialog" label="取消" />
            <BaseButton
              class="secondary"
              type="button"
              @click="updatePasswordDate"
              label="沿用舊密碼"
            />
            <BaseButton class="primary" type="submit" label="修改" />
          </div>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.dialog-content {
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
.bt + .bt {
  margin-left: 12px;
}
</style>
