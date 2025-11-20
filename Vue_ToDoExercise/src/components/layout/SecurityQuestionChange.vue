<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SecurityQuestionSelect from '@/components/ui/SecurityQuestionSelect.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import { useUserStore } from '@/stores/useUserStore'
import { useUiStore } from '@/stores/useUiStore'
import { useUserApiStore } from '@/stores/useUserApiStore'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])
const userStore = useUserStore()
const uiStore = useUiStore()
const ApiStore = useUserApiStore()

onMounted(() => {
  ApiStore.getSecurityQuestions()
})

function closeDialog() {
  userStore.clearSecurityInfo()
  uiStore.securityQuestionChangeModel = false
}

const step = ref('security-question')
function next() {
  step.value = 'change-password'
}
function complete() {
  step.value = 'security-question'
  userStore.reset()
  
  closeDialog()
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
  await ApiStore.updateProfile()
  closeDialog()
  uiStore.hideLoading()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="uiStore.securityQuestionChangeModel"
        class="dialog-backdrop"
        @click.self="closeDialog"
      >
        <form class="dialog-content" @submit.prevent="submitForm">
          <div class="mb-3">
            <h3 class="mb-3">重設安全提問</h3>
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
          <div class="mb-3">
            <label for="password" class="mb-3 w-100 form-label">
              <h5 class="mb-0">請輸入密碼</h5>
            </label>
            <PasswordInput />
          </div>
          <div class="mb-3 text-end">
            <BaseButton class="cancel" type="button" @click="closeDialog" label="取消" />
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
h5{
  font-size: 16px;
}
</style>
