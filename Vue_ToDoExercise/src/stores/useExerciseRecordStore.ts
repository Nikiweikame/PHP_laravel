// src/stores/useExerciseRecordStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { RECORDS_ENDPOINT } from '@/config/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUiStore } from './useUiStore'
import { useUserApiStore } from './useUserApiStore'
import { useRouter } from 'vue-router'
import { useExerciseItemStore, type ItemsContent } from './useExerciseItemStore'
import dayjs from 'dayjs'
import { alertError, alertSuccess } from '@/utils/alert'

export interface RecordsContent {
  id: number
  exercise_type: string
  exercise_type_id: number
  date: string
  day_only: string
  time: string
  count: number
  unit: string
  calories: number
  recorded_at: string
  description: string
  formula: string
  calories_per_unit: number
}

export const useExerciseRecordStore = defineStore('exerciseRecord', () => {
  const authStore = useAuthStore()
  const uiStore = useUiStore()
  const ApiStore = useUserApiStore()
  const exerciseItems = useExerciseItemStore()
  const router = useRouter()
  const total_calories = ref('0')
  // --- 日期相關狀態 ---
  const year = ref(new Date().getFullYear())
  const month = ref(new Date().getMonth() + 1)
  // 取得初始運動紀錄資料
  const getInitialRecords = async () => {
    const myHeaders = ApiStore.createHeaders(true)

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
    try {
      const response = await fetch(
        `${RECORDS_ENDPOINT}?year_month=${year.value}-${month.value}`,
        requestOptions,
      )
      const result = await response.json()

      // 如果 token 過期或未授權
      if (response.status === 401) {
        console.warn('Token 已失效，登出中...')
        authStore.reset() // 🔹 清除使用者資料
        router.push('/login') // 🔹 導向登入頁
        return [[], '0'] // 回傳空陣列和0卡路里
      }

      if (result.success) {
        return [result.data.records as RecordsContent[], result.data.total_calories] // 回傳資料給 computed
      } else {
        total_calories.value = '0' // 更新總卡路里
        return [[], '0'] // 回傳空陣列和0卡路里
      }
    } catch (error) {
      return [[], '0'] // 回傳空陣列和0卡路里
    }
  }

  // --- 運動紀錄相關狀態 ---
  const recordsTitle = ['日期/時間', '運動項目', '持續時間/次數', '消耗卡路里', '動作']
  const recordsContent = ref<RecordsContent[]>([]) // 空陣列初始

  // 載入當月資料
  const updateRecords = async () => {
    ;[recordsContent.value, total_calories.value] = await getInitialRecords()
  }

  // --- 新增日期選擇 ---

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  // 預設為今天日期 + 現在時間
  const now = new Date()
  // HTML input type="date" 要 YYYY-MM-DD 格式
  const recordDate = ref(now.toISOString().split('T')[0])
  // HTML input type="time" 要 HH:mm 格式
  const recordTime = ref(now.toTimeString().slice(0, 5))
  // add/modify pade
  const recordId = ref('0')
  const recordExerciseId = ref('0')
  const count = ref(0)
  const unit = ref('')
  const description = ref('')
  const formula = ref('')
  const calories = ref(0)
  const weight_unit = ref(false)
  const calories_per_unit = ref(0)

  const setMonth = (y: number, m: number) => {
    year.value = y
    month.value = m
  }

  const prevMonth = async () => {
    if (month.value === 1) {
      month.value = 12
      year.value--
    } else {
      month.value--
    }
    await refreshRecordsWithLoading()
  }

  const nextMonth = async () => {
    if (month.value === 12) {
      month.value = 1
      year.value++
    } else {
      month.value++
    }
    await refreshRecordsWithLoading()
  }

  // 封裝載入動作的更新方法
  const refreshRecordsWithLoading = async () => {
    try {
      uiStore.showLoading()
      await updateRecords()
    } finally {
      uiStore.hideLoading()
    }
  }
  const formattedDate = computed(() => `${monthNames[month.value - 1]} ${year.value}`)

  // 載入既有數據
  const setExerciseRecordForm = (record: RecordsContent) => {
    recordId.value = record.id.toString()
    calories.value = record.calories ?? 0
    count.value = record.count ?? 0
    recordTime.value = record.time ?? ''
    recordDate.value = record.date ?? ''
    recordExerciseId.value = record.exercise_type_id.toString()
    unit.value = `(${record.unit})`
    description.value = record.description
    formula.value = record.formula
    calories_per_unit.value = record.calories_per_unit
  }
  // 初始化
  const initExerciseRecordForm = (exercise?: ItemsContent) => {
    recordId.value = ''
    recordTime.value = now.toTimeString().slice(0, 5) // 'HH:mm'
    recordDate.value = now.toISOString().split('T')[0] // 'YYYY-MM-DD'
    count.value = 0
    calories.value = 0

    if (exercise) {
      recordExerciseId.value = exercise.id.toString()
      unit.value = `(${exercise.unit})`
      description.value = exercise.description ?? ''
      formula.value = exercise.formula
      weight_unit.value = exercise.weight_unit 
      calories_per_unit.value = exercise.calories_per_unit
    } else {
      recordExerciseId.value = '0'
      unit.value = ''
      description.value = ''
      formula.value = ''
      weight_unit.value = false
      calories_per_unit.value = 0
    }
  }
  // 運動項目更新後，連動欄位變更
  const updateFromOption = (option: HTMLOptionElement | null) => {
    if (!option) return
    unit.value = `(${option.dataset.unit ?? 'error'})`
    formula.value = option.dataset.formula ?? 'error'
    description.value = option.dataset.description ?? 'error'
    weight_unit.value = option.dataset.weight_unit === 'true'
    calories_per_unit.value = (option.dataset.calories_per_unit ?? 0) as number
    // 計算卡路里
    calculateCalories()
  }
  const calculateCalories = () => {
    if (weight_unit.value) {
      calories.value = Number((authStore.weight * count.value * calories_per_unit.value).toFixed(2))
    } else {
      calories.value = Number((count.value * calories_per_unit.value).toFixed(2))
    }
  }

  const updateExerciseRecord = async () => {
    const myHeaders = ApiStore.createHeaders(true)
    const raw = JSON.stringify({
      exercise_type_id: recordExerciseId.value,
      record_time: `${recordDate.value} ${recordTime.value}`,
      count: count.value,
      unit: unit.value.replace(/[()]/g, ''),
      calories: calories.value,
    })
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow',
      body: raw,
    }
    try {
      const response = await fetch(`${RECORDS_ENDPOINT}/${recordId.value}`, requestOptions)
      const result = await response.json()

      // 如果 token 過期或未授權
      if (response.status === 401) {
        console.warn('Token 已失效，登出中...')
        authStore.reset() // 🔹 清除使用者資料
        router.push('/login') // 🔹 導向登入頁
        return false
      }

      if (result.success) {
        alertSuccess('更新運動紀錄成功', result.message)
        return true
      } else {
        alertError('更新運動紀錄失敗', result.message)
        return false
      }
    } catch (error: any) {
      alertError('更新運動紀錄失敗', error.message)
      return false
    }
  }

  const storeExerciseRecord = async () => {
    const myHeaders = ApiStore.createHeaders(true)
    const raw = JSON.stringify({
      exercise_type_id: recordExerciseId.value,
      record_time: `${recordDate.value} ${recordTime.value}`,
      count: count.value,
      unit: unit.value.replace(/[()]/g, ''),
      calories: calories.value,
    })
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body: raw,
    }
    try {
      const response = await fetch(RECORDS_ENDPOINT, requestOptions)
      const result = await response.json()

      // 如果 token 過期或未授權
      if (response.status === 401) {
        console.warn('Token 已失效，登出中...')
        authStore.reset() // 🔹 清除使用者資料
        router.push('/login') // 🔹 導向登入頁
        return false
      }

      if (result.success) {
        alertSuccess('新增運動紀錄成功', result.message)
        return true
      } else {
        alertError('新增運動紀錄失敗', result.message)
        return false
      }
    } catch (error: any) {
      alertError('新增運動紀錄失敗', error.message)
      return false
    }
  }

  const deleteExerciseRecord = async (id: number) => {
    const myHeaders = ApiStore.createHeaders(true)

    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
    }
    try {
      const response = await fetch(`${RECORDS_ENDPOINT}/${id}`, requestOptions)
      const result = await response.json()

      // 如果 token 過期或未授權
      if (response.status === 401) {
        console.warn('Token 已失效，登出中...')
        authStore.reset() // 🔹 清除使用者資料
        router.push('/login') // 🔹 導向登入頁
        return false
      }

      if (result.success) {
        alertSuccess('刪除運動紀錄成功', result.message)
        return true
      } else {
        alertError('刪除運動紀錄失敗', result.message)
        return false
      }
    } catch (error: any) {
      console.error('刪除運動紀錄發生錯誤', error)
      return false
    }
  }

  return {
    recordsTitle,
    recordsContent,
    year,
    month,
    setMonth,
    prevMonth,
    nextMonth,
    formattedDate,
    total_calories,
    updateRecords,
    recordDate,
    recordTime,
    recordExerciseId,
    count,
    unit,
    description,
    formula,
    calories,
    setExerciseRecordForm,
    initExerciseRecordForm,
    weight_unit,
    updateFromOption,
    calculateCalories,
    updateExerciseRecord,
    storeExerciseRecord,
    deleteExerciseRecord,
  }
})
