<script setup lang="ts">
const props = defineProps({
  label: { type: String, required: true }, //
})
</script>

<template>
  <button class="bt">{{ label }}</button>
</template>

<style lang="scss">
.bt {
  margin: 0 auto;
  width: auto;
  padding: 8px 16px;
  // height: 32px;
  border-radius: 12px;
}
.primary {
  background-color: #60c48f;
  border: 0;
  color: #fff;
}
.secondary {
  background-color: #f0f0f0; /* 中性色背景 */
  border: 1px solid #ccc;
  color: #333333; /* 深色文字 */
}
.cancel {
  background-color: #fff;
  border: 1px solid #60c48f;
  color: #60c48f;
}
</style>
