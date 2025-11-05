<!-- /src/components/BaseInput.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useExerciseItemStore } from '@/stores/useExerciseItemStore'
const erciseItemStore = useExerciseItemStore()

const checked = ref(true)
// 顯示公式文字
const formula = computed(() => {
  if (erciseItemStore.weight_unit) {
    return `體重 × ${erciseItemStore.unit || "計量單位"} × ${erciseItemStore.calories_per_unit}`
  } else {
    return `${erciseItemStore.unit || "計量單位"} × ${erciseItemStore.calories_per_unit}`
  }
})
</script>

<template>
  <div class="calorie-formula space-y-2">
    <label class="flex items-center gap-2">
      <span class="font-medium">卡路里計算公式</span>
      <input type="checkbox" v-model="erciseItemStore.weight_unit" />
      <span class="text-sm text-gray-600">是否計算體重</span>
    </label>
    <div class="p-2 rounded bg-gray-100 text-gray-800 text-sm font-mono">
      {{ formula }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calorie-formula {
  input {
    margin: 8px;
  }
}
</style>
