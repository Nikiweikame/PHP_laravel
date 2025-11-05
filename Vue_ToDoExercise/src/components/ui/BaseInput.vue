<!-- /src/components/BaseInput.vue -->
<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'change'])

const props = defineProps({
  label: { type: String, required: true }, // 標籤文字
  id: { type: String, required: true }, // input 的 id/name
  type: { type: String, default: 'text' }, // input 類型：text/password/number...
  placeholder: { type: String, default: '' }, // 提示文字
  modelValue: { type: [String, Number], default: '' }, // 綁定值（支援 v-model）
  disabled: { type: Boolean, default: false }, // 是否禁用輸入
})
</script>

<template>
  <label :for="id" class="form-label">{{ label }}</label>
  <input
    :id="id"
    :name="id"
    class="form-control focus"
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    :disabled="disabled"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @change="emit('change', $event)"
    required
  />
</template>

<style scoped>
.focus:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(96, 196, 143, 0.25);
  border-color: #60c48f;
}
</style>
