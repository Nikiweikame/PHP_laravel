<script setup lang="ts">
// ../src/components/Login/Login.vue
import { useUiStore } from '@/stores/useUiStore'
import { useExerciseRecordStore } from '@/stores/useExerciseRecordStore'
import ZeroRecord from '@/views/Records/ZeroRecord.vue'
import AddButton from '@/components/ui/AddButton.vue'
import { ref } from 'vue'

const uiStore = useUiStore()
const exerciseStore = useExerciseRecordStore()
const isOpen = ref(false)
const isEdit = ref(false)
function handleSubmit() {
  isOpen.value = false
  // 重新載入資料
}
const exercise_type = ref('')
const count = ref(0)
const calories = ref(0)
function closeEditor() {
  isOpen.value = false
  return
}
</script>
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="editor-overlay">
        <div class="editor-card">
          <h2>{{ isEdit ? '修改紀錄' : '新增紀錄' }}</h2>

          <form @submit.prevent="handleSubmit">
            <label>
              運動項目：
              <input v-model="exercise_type" required />
            </label>

            <label>
              數量：
              <input v-model.number="count" type="number" min="0" />
            </label>

            <label>
              消耗卡路里：
              <input v-model.number="calories" type="number" min="0" />
            </label>

            <div class="actions">
              <button type="submit">{{ isEdit ? '更新' : '新增' }}</button>
              <button type="button" @click="closeEditor">取消</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useExerciseStore } from '@/stores/useExerciseStore'

const props = defineProps<{
  modelValue: boolean
  record?: any
}>()

const emit = defineEmits(['update:modelValue', 'saved'])

const isOpen = ref(props.modelValue)
const isEdit = ref(!!props.record)
const form = ref({
  exercise_type: props.record?.exercise_type || '',
  count: props.record?.count || 0,
  calories: props.record?.calories || 0,
})

watch(
  () => props.modelValue,
  (val) => (isOpen.value = val),
)

function closeEditor() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  const store = useExerciseStore()
  if (isEdit.value) {
    await store.updateRecord(form.value)
  } else {
    await store.createRecord(form.value)
  }
  emit('saved')
  closeEditor()
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.editor-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.editor-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.actions {
  margin-top: 1em;
  display: flex;
  justify-content: flex-end;
  gap: 1em;
}
</style>
