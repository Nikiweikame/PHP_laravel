<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
// 取用 Pinia store
const userStore = useUserStore()

// 綁定使用者選擇的問題
const props = defineProps({
  modelValue: { type: [String], default: '' }, // 綁定值（支援 v-model）
})


const emit = defineEmits(['update:modelValue'])

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('update:modelValue', value)  // 更新父組件或 Pinia
}

</script>

<template>
  <label for="security-question" class="form-label">安全提問</label>
  <select
    id="security-question"
    class="security-question form-control focus"
    :value="modelValue"
    @change="onChange"
  >
    <option v-for="(q, index) in userStore.securityQuestionsList" :key="q.id" :value="q.id">
      {{ q.security_question }}
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
