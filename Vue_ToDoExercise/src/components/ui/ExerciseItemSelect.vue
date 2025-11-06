<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

import { useExerciseItemStore } from '@/stores/useExerciseItemStore'
import { useExerciseRecordStore } from '@/stores/useExerciseRecordStore'

// 取用 Pinia store
const userStore = useUserStore()
const exerciseItemStore = useExerciseItemStore()
const exerciseRecordStore = useExerciseRecordStore()
// 綁定使用者選擇的問題
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  }, // 綁定值（支援 v-model）
})
const emit = defineEmits(['update:modelValue'])

function onChange(event: Event) {
  const select = event.target as HTMLSelectElement
  const selectedOption = select.selectedOptions[0] as HTMLOptionElement
  const value = Number(selectedOption.value)
  emit('update:modelValue', value) // 更新父組件或 Pinia
  exerciseRecordStore.updateFromOption(selectedOption)
}
</script>

<template>
  <label for="security-question" class="form-label">運動項目</label>
  <select id="security-question" class="security-question form-control focus" :value="modelValue" @change="onChange"
    required>
    <option v-for="(q, index) in exerciseItemStore.itemsContent" :key="q.id" :value="q.id" :data-unit="q.unit"
      :data-formula="q.formula" :data-description="q.description" :data-weight_unit="q.weight_unit"
      :data-calories_per_unit="q.calories_per_unit">
      {{ q.name }}
    </option>
  </select>
</template>

<style scoped>
select {
  background-color: #fff;
  color: #333;
}

select:focus {
  outline: none;
  border-color: #60c48f;
  box-shadow: 0 0 0 2px rgba(96, 196, 143, 0.2);
}
</style>
