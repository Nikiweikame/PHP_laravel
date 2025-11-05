<script setup lang="ts">
import { useUiStore } from '@/stores/useUiStore'
import { useExerciseRecordStore, type RecordsContent } from '@/stores/useExerciseRecordStore'
import ZeroRecord from '@/views/Records/ZeroRecord.vue'
import AddButton from '@/components/ui/AddButton.vue'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import RecordDialog from '@/components/layout/RecordDialog.vue'
import { confirmDialog } from '@/utils/alert'

const userStore = useUserStore()

const uiStore = useUiStore()
const exerciseRecordStore = useExerciseRecordStore()
onMounted(async () => {
  if (userStore.token) {
    await exerciseRecordStore.updateRecords()
  } else {
    console.warn('token 尚未準備好，稍後再取資料')
  }
})
const openModifyModel = (record: RecordsContent) => {
  uiStore.openRecordDialog('modify')
  // console.log(id, itemId)
  exerciseRecordStore.setExerciseRecordForm(record)
}
const openAddModel = ()=>{
  uiStore.openRecordDialog('add')
  // console.log(id, itemId)
  exerciseRecordStore.initExerciseRecordForm()
}
const alertDelete = async (id: number) => {
  const confirmed = await confirmDialog('確定要刪除此筆紀錄嗎？', '刪除後將無法復原！')

  if (!confirmed) {
    console.log('使用者取消刪除')
    return
  }

  const success = await exerciseRecordStore.deleteExerciseRecord(id)
  if (success) {
    console.log('刪除成功，重新載入資料')
    await exerciseRecordStore.updateRecords() // ✅ 更新成功後重新抓資料() 
  }
}
</script>
<template>
  <div class="records__container d-grid mt-3">
    <div class="records__title d-none d-md-grid">
      <div v-for="value in exerciseRecordStore.recordsTitle">{{ value }}</div>
    </div>
    <div class="records__body">
      <template
        v-for="value in exerciseRecordStore.recordsContent"
        v-if="exerciseRecordStore.recordsContent.length > 0"
      >
        <div class="records__cell d-none d-lg-block">{{ `${value.date} ${value.time}` }}</div>
        <div class="records__cell d-lg-none">{{ value.date }}</div>
        <div class="records__cell">{{ value.exercise_type }}</div>
        <div class="records__cell">{{ `${value.count} ${value.unit}` }}</div>
        <div class="records__cell">{{ `${value.calories}  kcal` }}</div>
        <div class="records__cell records__text">
          <span @click="openModifyModel(value)">edit</span
          ><span class="records__text--color" @click="alertDelete(value.id)">delete</span>
        </div>
      </template>
      <ZeroRecord v-else />
    </div>
    <p class="records__footer mb-0">
      {{ `當月消耗 ${exerciseRecordStore.total_calories} 卡路里` }}
    </p>
  </div>
  <AddButton @click="openAddModel" />
  <RecordDialog />
</template>
<style lang="scss" scoped>
.records {
  &__container {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    grid-template-columns: 1fr; /* 小螢幕時單欄 */
    color: #60c48f;
  }
  &__title {
    grid-template-columns: 1.2fr 1fr 1fr 1fr 0.8fr;
    text-align: center;
    color: #000;
    padding: 16px;
  }
  &__body {
    background-color: #fff;
    padding: 8px 16px;
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr 1fr 0.8fr;
    text-align: center;
  }
  &__text {
    font-family: 'Material Symbols Outlined';
    &--color {
      color: red;
    }
    span {
      padding: 8px;
      cursor: pointer;
      & + span {
        margin-left: 8px;
      }
    }
  }
  &__cell {
    padding: 8px 0;
  }
  &__footer {
    padding: 8px 16px;
    font-weight: bold;
    color: #000;
  }
}
</style>
