<script setup lang="ts">
import { ref, computed } from 'vue'
import SecurityQuestionSelect from '@/components/ui/SecurityQuestionSelect.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import { useUserStore } from '@/stores/useUserStore'
import { useUiStore } from '@/stores/useUiStore'
import { useUserApiStore } from '@/stores/useUserApiStore'
import { useExerciseRecordStore } from '@/stores/useExerciseRecordStore'
import ExerciseItemSelect from '../ui/ExerciseItemSelect.vue'
import { useExerciseItemStore } from '@/stores/useExerciseItemStore'
import CalorieFormulaInput from '../ui/CalorieFormulaInput.vue'

const userStore = useUserStore()
const uiStore = useUiStore()
const ApiStore = useUserApiStore()
const exerciseRecordStore = useExerciseRecordStore()
const exerciseItemStore = useExerciseItemStore()

function closeDialog() {
  uiStore.showRecordDialog = false
}

async function submitForm(event: Event) {
  console.log(event, event.target)
  const form = event.target as HTMLFormElement
  if (!form.checkValidity()) {
    // 欄位沒填好，瀏覽器會自動顯示提示
    form.reportValidity()
    return
  }
  // 驗證通過，送 API
  uiStore.showLoading()
  let success = false

  if (uiStore.RecordModel === 'add') {
    success = await exerciseItemStore.storeExerciseItem()
  } else {
    success = await exerciseItemStore.updateExerciseItem()
  }

  if (success) {
    await exerciseItemStore.updateItems() // ✅ 更新成功後重新抓資料
    closeDialog()
  }
  uiStore.hideLoading()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="uiStore.showRecordDialog" class="dialog-backdrop" @click.self="closeDialog">
        <form class="dialog-content row" @submit.prevent="submitForm">
          <div class="mb-3 col-12">
            <h3 class="mb-0">
              {{ uiStore.ItemModel === 'add' ? '新增運動項目' : '修改運動項目' }}
            </h3>
          </div>
          <div class="mb-3 col-12">
            <!-- 運動名稱 -->
            <BaseInput label="運動名稱" id="record-date" type="text" v-model="exerciseItemStore.name" />
          </div>
          <div class="mb-3 col-12 col-md-6">
            <!-- 計量單位 -->
            <BaseInput label="計量單位" id="record-time" type="text" v-model="exerciseItemStore.unit" />
          </div>
          <div class="mb-3 col-12 col-md-6">
            <!-- 卡路里係數 -->
            <BaseInput label="卡路里係數" id="record-time" type="number" v-model="exerciseItemStore.calories_per_unit" />
          </div>
          <div class="mb-3 col-12">
            <CalorieFormulaInput />
          </div>
          <div class="mb-3 col-12">
            <!-- 運動項目說明 -->
            <BaseInput :label="`運動項目說明`" id="record-description" type="text" v-model="exerciseItemStore.description" />
          </div>
          <div class="mb-3 text-end">
            <BaseButton class="cancel" type="button" @click="closeDialog" label="取消" />
            <BaseButton class="primary" type="submit" :label="uiStore.RecordModel === 'add' ? '新增' : '修改'" />
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

.bt+.bt {
  margin-left: 12px;
}
</style>
