<script setup lang="ts">
import { ref } from 'vue'
import SecurityQuestionSelect from '@/components/ui/SecurityQuestionSelect.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useUserStore } from '@/stores/useUserStore'
import { useUiStore } from '@/stores/useUiStore'
import { useUserApiStore } from '@/stores/useUserApiStore'

const userStore = useUserStore()
const uiStore = useUiStore()
const ApiStore = useUserApiStore()

function closeDialog() {
  userStore.reset()
  uiStore.toggleForgetPasswordModel()
}

function complete() {
  uiStore.forgetPasswordComplete()
  closeDialog()
}
async function submitForm(event: Event) {
  const form = event.target as HTMLFormElement
  if (!form.checkValidity()) {
    // 欄位沒填好，瀏覽器會自動顯示提示
    form.reportValidity()
    return
  }
  uiStore.showLoading()
  await ApiStore.resetPasswordByQuestion()
  uiStore.hideLoading()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="uiStore.forgetPasswordModel" class="dialog-backdrop" @click.self="closeDialog">
        <form
          v-if="uiStore.forgetPasswordStep === 'security-question'"
          class="dialog-content"
          @submit.prevent="submitForm"
        >
          <div class="mb-3">
            <h3 class="mb-3">忘記密碼</h3>
            <p>請輸入您的帳號並回答安全提問以重設密碼</p>
          </div>
          <div class="mb-3">
            <BaseInput
              label="帳號"
              id="account"
              type="text"
              placeholder="請輸入您的帳號"
              v-model="userStore.account"
            />
          </div>
          <div class="mb-3">
            <SecurityQuestionSelect v-model="userStore.securityQuestion" />
          </div>
          <div class="mb-3">
            <BaseInput
              label="答案"
              id="security-answer"
              type="text"
              placeholder="請輸入您的答案"
              v-model="userStore.securityAnswer"
            />
          </div>
          <div class="mb-3 text-end">
            <BaseButton class="cancel" type="button" @click="closeDialog" label="取消" />
            <BaseButton class="primary" type="submit" label="送出" />
          </div>
        </form>
        <div v-else class="dialog-content">
          <div class="mb-3">
            <BaseInput
              label="這是系統為您產生的密碼"
              id="new-password"
              type="text"
              v-model="userStore.newPassword"
              :disabled="true"
            />
          </div>
          <div class="mb-3 text-end">
            <BaseButton class="primary" @click="complete" label="確定" />
          </div>
        </div>
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
.primary {
  margin-left: 12px;
}
</style>
