// src/stores/useExerciseStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ITEMS_ENDPOINT } from '@/config/api'
import { useUserStore } from '@/stores/useUserStore'
import { useUiStore } from './useUiStore'
import { useUserApiStore } from './useUserApiStore'
import { useExerciseRecordStore } from './useExerciseRecordStore'
import { alertError, alertSuccess } from '@/utils/alert'

export interface ItemsContent {
  id: number
  name: string
  weight_unit: boolean
  calories_per_unit: number
  unit: string
  description: string
  updated_by: string
  formula: string
  is_creator: boolean
  user: number
}

export const useExerciseItemStore = defineStore('exerciseItems', () => {
  const userStore = useUserStore()
  const uiStore = useUiStore()
  const ApiStore = useUserApiStore()
  const router = useRouter()

  // --- 運動項目相關狀態 ---
  const itemsTitle = ['運動項目', '計量單位', '卡路里消耗公式', '描述', '動作']
  const itemsContent = ref<ItemsContent[]>([]) // 空陣列初始
  // 取得初始運動項目資料
  const getItems = async () => {
    const myHeaders = ApiStore.createHeaders(true)

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
    try {
      const response = await fetch(ITEMS_ENDPOINT, requestOptions)
      const result = await response.json()
      // 如果 token 過期或未授權
      if (response.status === 401) {
        userStore.reset() // 🔹 清除使用者資料
        router.push('/login') // 🔹 導向登入頁
        return [] // 回傳空陣列和0卡路里
      }

      if (result.success) {
        return result.data as ItemsContent[]
      } else {
        return [] // 回傳空陣列
      }
    } catch (error) {
      return [] // 回傳空陣列
    }
  }

  // 運動項目的資料
  const updateItems = async () => {
    itemsContent.value = await getItems()
  }
  updateItems()

  const itemId = ref('')
  const unit = ref('')
  const calories_per_unit = ref(0)
  const description = ref('')
  const weight_unit = ref(false)
  const name = ref('')
  const formula = ref('')

  const initExerciseItemForm = (item?: ItemsContent) => {
    if (item) {
      fillExerciseForm(item)
    } else {
      resetExerciseForm()
    }
  }
  const fillExerciseForm = (item: ItemsContent) => {
    itemId.value = item.id.toString()
    unit.value = item.unit
    calories_per_unit.value = item.calories_per_unit
    description.value = item.description
    weight_unit.value = item.weight_unit 
    name.value = item.name
    formula.value = item.formula
  }

  const resetExerciseForm = () => {
    itemId.value = ''
    unit.value = ''
    calories_per_unit.value = 0
    description.value = ''
    weight_unit.value = false
    name.value = ''
    formula.value = ''
  }
  const updateExerciseItem = async () => {
    const myHeaders = ApiStore.createHeaders(true)
    const raw = JSON.stringify({
      name: name.value,
      weight_unit: weight_unit.value ? true : false,
      calories_per_unit: calories_per_unit.value,
      description: description.value,
      unit: unit.value,
    })
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow',
      body: raw,
    }
    try {
      const response = await fetch(`${ITEMS_ENDPOINT}/${itemId.value}`, requestOptions)
      const result = await response.json()

      // 如果 token 過期或未授權
      if (response.status === 401) {
        userStore.reset() // 🔹 清除使用者資料
        router.push('/login') // 🔹 導向登入頁
        return false
      }

      if (result.success) {
        alertSuccess('更新運動項目成功', result.message)
        return true
      } else {
        alertError('更新運動項目失敗', result.message)
        return false
      }
    } catch (error: any) {
      return false
    }
  }

  const storeExerciseItem = async () => {
    const myHeaders = ApiStore.createHeaders(true)
    const raw = JSON.stringify({
      name: name.value,
      weight_unit: weight_unit.value ? true : false,
      calories_per_unit: calories_per_unit.value,
      description: description.value,
      unit: unit.value,
    })
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body: raw,
    }
    try {
      const response = await fetch(ITEMS_ENDPOINT, requestOptions)
      const result = await response.json()

      // 如果 token 過期或未授權
      if (response.status === 401) {
        userStore.reset() // 🔹 清除使用者資料
        router.push('/login') // 🔹 導向登入頁
        return false
      }

      if (result.success) {
        alertSuccess('新增運動項目成功', result.message)
        return true
      } else {
        alertError('新增運動項目失敗', result.message)
        return false
      }
    } catch (error: any) {
      alertError('新增運動項目失敗', error.message)
      return false
    }
  }

  const deleteExerciseItem = async (id: number) => {
    const myHeaders = ApiStore.createHeaders(true)

    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
    }
    try {
      const response = await fetch(`${ITEMS_ENDPOINT}/${id}`, requestOptions)
      const result = await response.json()

      // 如果 token 過期或未授權
      if (response.status === 401) {
        userStore.reset() // 🔹 清除使用者資料
        router.push('/login') // 🔹 導向登入頁
        return false
      }

      if (result.success) {
        alertSuccess('刪除運動項目成功', result.message)
        return true
      } else {
        alertError('刪除運動項目失敗', result.message)
        return false
      }
    } catch (error: any) {
      alertError('刪除運動項目失敗', error.message)
      return false
    }
  }

  return {
    itemsTitle,
    itemsContent,
    updateItems,
    name,
    unit,
    description,
    calories_per_unit,
    weight_unit,
    formula,
    initExerciseItemForm,
    updateExerciseItem,
    storeExerciseItem,
    deleteExerciseItem,
  }
})
