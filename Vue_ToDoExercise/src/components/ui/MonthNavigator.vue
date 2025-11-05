<script setup lang="ts">
import { useUiStore } from '@/stores/useUiStore'
import { useExerciseRecordStore } from '@/stores/useExerciseRecordStore'
const uiStore = useUiStore()
const exerciseRecordStore = useExerciseRecordStore();
</script>

<template>
  <div class="month-navigator p-2 w-100">
    <button class="arrow" @click="exerciseRecordStore.prevMonth">‹</button>
    <span class="date-text">{{ exerciseRecordStore.formattedDate }}</span>
    <button class="arrow" @click="exerciseRecordStore.nextMonth">›</button>
  </div>
</template>

<style scoped>
.month-navigator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 8px 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb;
  border-radius: 12px;
  max-width: 300px;
}
.arrow {
  border: none;
  background: transparent;
  font-size: 1.8rem;
  cursor: pointer;
}
.date-text {
  font-weight: 600;
  min-width: 140px;
  text-align: center;
}
</style>
