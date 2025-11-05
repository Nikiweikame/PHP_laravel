<script setup lang="ts">
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useUiStore } from '@/stores/useUiStore'
import { useExerciseRecordStore } from '@/stores/useExerciseRecordStore'
import ExerciseItemSelect from '../ui/ExerciseItemSelect.vue'

const uiStore = useUiStore()
const exerciseRecordStore = useExerciseRecordStore()

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
    success = await exerciseRecordStore.storeExerciseRecord()
  } else {
    success = await exerciseRecordStore.updateExerciseRecord()
  }
  if (success) {
    await exerciseRecordStore.updateRecords() // ✅ 更新成功後重新抓資料
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
              {{ uiStore.RecordModel === 'add' ? '新增運動紀錄' : '修改運動紀錄' }}
            </h3>
          </div>
          <div class="mb-3 col-12 col-md-6">
            <!-- 日期 -->
            <BaseInput
              label="日期"
              id="record-date"
              type="date"
              v-model="exerciseRecordStore.recordDate"
            />
          </div>
          <div class="mb-3 col-12 col-md-6">
            <!-- 時間 -->
            <BaseInput
              label="時間"
              id="record-time"
              type="time"
              v-model="exerciseRecordStore.recordTime"
            />
          </div>
          <div class="mb-3 col-12 col-md-6">
            <!-- 運動項目 -->
            <ExerciseItemSelect v-model="exerciseRecordStore.recordExerciseId" />
          </div>
          <div class="mb-3 col-12 col-md-6">
            <!-- 運動時間/次數 -->
            <BaseInput
              :label="`單位${exerciseRecordStore.unit}`"
              id="record-datetime"
              type="number"
              v-model="exerciseRecordStore.count"
              @change="exerciseRecordStore.calculateCalories"
            />
          </div>
          <div class="mb-3 col-12">
            <!-- 卡路里消耗計算 -->
            <BaseInput
              :label="`卡路里消耗`"
              id="record-calories"
              type="number"
              v-model="exerciseRecordStore.calories"
              disabled
            />
          </div>
          <div class="mb-3 col-12">
            <!-- 運動項目說明 -->
            <BaseInput
              :label="`運動項目說明`"
              id="record-description"
              type="textarea"
              v-model="exerciseRecordStore.description"
              disabled
            />
          </div>
          <div class="mb-3 col-12">
            <!--  計算公式 -->
            <BaseInput
              :label="`計算公式`"
              id="record-formula"
              type="text"
              v-model="exerciseRecordStore.formula"
              disabled
            />
          </div>
          <div class="mb-3 text-end">
            <BaseButton class="cancel" type="button" @click="closeDialog" label="取消" />
            <BaseButton
              class="primary"
              type="submit"
              :label="uiStore.RecordModel === 'add' ? '新增' : '修改'"
            />
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
