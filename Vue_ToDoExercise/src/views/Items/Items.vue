<script setup lang="ts">
import { useUiStore } from '@/stores/useUiStore'
import { useExerciseItemStore, type ItemsContent } from '@/stores/useExerciseItemStore'
import { useExerciseRecordStore } from '@/stores/useExerciseRecordStore'
import AddButton from '@/components/ui/AddButton.vue'
import router from '@/router'
import ItemDialog from '@/components/layout/ItemDialog.vue'
import { confirmDialog } from '@/utils/alert'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

const uiStore = useUiStore()
const exerciseItemStore = useExerciseItemStore()
const exerciseRecordStore = useExerciseRecordStore()
const userStore = useUserStore()
onMounted(async () => {
  if (userStore.token) {
    await exerciseItemStore.updateItems()
  } else {
    console.warn('token 尚未準備好，稍後再取資料')
  }
})

const openRecordAddModel = (item: ItemsContent) => {
  router.push('/')
  uiStore.openRecordDialog('add')
  exerciseRecordStore.initExerciseRecordForm(item)
}
const openModifyModel = (record: ItemsContent) => {
  uiStore.openRecordDialog('modify')
  exerciseItemStore.initExerciseItemForm(record)
}
const openAddModel = () => {
  uiStore.openRecordDialog('add')
  exerciseItemStore.initExerciseItemForm()
}
const alertDelete = async (id: number) => {
  const confirmed = await confirmDialog('確定要刪除此筆運動項目嗎？', '刪除後將無法復原！')

  if (!confirmed) {
    return
  }

  const success = await exerciseItemStore.deleteExerciseItem(id)
  if (success) {
    await exerciseItemStore.updateItems() // ✅ 更新成功後重新抓資料()
  }
}
</script>
<template>
  <div class="items__container d-grid mt-3">
    <div class="items__title d-none d-md-grid">
      <div v-for="value in exerciseItemStore.itemsTitle">{{ value }}</div>
    </div>
    <div class="items__body">
      <template v-for="value in exerciseItemStore.itemsContent">
        <div class="items__cell items__cell--cursor" @click="openRecordAddModel(value)">
          {{ value.name }}
        </div>
        <div class="items__cell">{{ value.unit }}</div>
        <div class="items__cell">{{ value.formula }}</div>
        <div class="items__cell">{{ value.description }}</div>
        <div class="items__cell items__text">
          <template v-if="value.is_creator">
            <span @click="openModifyModel(value)">edit</span><span class="items__text--color"
              @click="alertDelete(value.id)">delete</span>
          </template>
        </div>
      </template>
    </div>
  </div>
  <AddButton @click="openAddModel" />
  <ItemDialog />
</template>
<style lang="scss" scoped>
.items {
  &__container {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    grid-template-columns: 1fr;
    /* 小螢幕時單欄 */
    color: #60c48f;
  }

  &__title {
    grid-template-columns: 1fr 1fr 1.5fr 2fr 1fr;
    text-align: center;
    color: #000;
    padding: 16px;
  }

  &__body {
    background-color: #fff;
    padding: 8px 16px;
    display: grid;
    grid-template-columns: 1fr 1fr 1.5fr 2fr 1fr;
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

      &+span {
        margin-left: 8px;
      }
    }
  }

  &__cell {
    padding: 8px 0;

    &--cursor {
      cursor: pointer;
    }
  }

  &__footer {
    padding: 8px 16px;
    font-weight: bold;
    color: #000;
  }
}
</style>
