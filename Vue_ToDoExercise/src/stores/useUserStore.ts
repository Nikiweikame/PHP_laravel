// /src/stores/user.ts
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { alertSuccess, alertWarning, alertError } from '@/utils/alert'
import { ref } from 'vue'
import { useExerciseItemStore } from './useExerciseItemStore'
import { useExerciseRecordStore } from './useExerciseRecordStore'

interface SecurityQuestion {
  id: number
  security_question: string
}
// const router = useRouter()

export const useUserStore = defineStore(
  'user',
  () => {
    // 登入輸入欄位
    const account = ref('') // 登入輸入用帳號
    const password = ref('')
    const newPassword = ref('')

    // 顯示用（側邊欄、header）
    const nickname = ref('')
    const originNickname = ref('')
    const asideAccount = ref('John Doe') // 顯示使用者名稱（登入後會更新）
    const asideNickname = ref('訪客') // 顯示使用者暱稱（登入後會更新）
    const weight = ref(0)
    const originWeight = ref(0)

    // 安全性設定
    const securityQuestion = ref('1')
    const securityAnswer = ref('')
    const strength = ref('weak')

    // 登入狀態與 Token
    const isLoggedIn = ref(false)
    const token = ref<string | null>(localStorage.getItem('token'))

    // 額外資料
    const securityQuestionsList = ref<SecurityQuestion[]>([])
    const router = useRouter()

    /** 重設所有欄位（登出或清除資料時用） */
    function reset() {
      account.value = ''
      password.value = ''
      newPassword.value = ''
      nickname.value = ''
      originNickname.value = ''
      asideAccount.value = 'John Doe'
      asideNickname.value = '訪客'
      weight.value = 0
      originWeight.value = 0
      securityQuestion.value = '1'
      securityAnswer.value = ''
      strength.value = 'weak'
      isLoggedIn.value = false
      token.value = ''

      const exerciseItemStore = useExerciseItemStore()
      const exerciseRecordStore = useExerciseRecordStore()
      exerciseItemStore.itemsContent = []
      exerciseRecordStore.recordsContent = []
    }
    function resetProfileData() {
      nickname.value = originNickname.value
      weight.value = originWeight.value
    }
    function updateProfileDate() {
      originNickname.value = nickname.value
      originWeight.value = weight.value
      asideNickname.value = nickname.value
    }
    function clearSecurityInfo() {
      securityQuestion.value = '1'
      securityAnswer.value = ''
      password.value = ''
      newPassword.value = ''
      strength.value = 'weak'
    }

    /**
     * 密碼強度檢測函式
     * 規則：
     *  - 只含一種型態（小寫、大寫、數字） → 弱 (weak)
     *  - 含兩種型態 → 中 (medium)
     *  - 同時有 大寫 + 小寫 + 數字 → 強 (strong)
     */
    function checkStrength() {
      const pw = newPassword.value

      // 檢查是否包含小寫字母
      const hasLower = /[a-z]/.test(pw)
      // 檢查是否包含大寫字母
      const hasUpper = /[A-Z]/.test(pw)
      // 檢查是否包含數字
      const hasNumber = /[0-9]/.test(pw)

      // 計算符合條件的種類數（true 的個數）
      const typesCount = [hasLower, hasUpper, hasNumber].filter(Boolean).length

      // 根據種類數決定強度
      if (pw.length === 0) {
        // 空密碼視為弱
        strength.value = 'weak'
      } else if (typesCount === 1) {
        // 只有一種型態（純數字、純英文）→ 弱
        strength.value = 'weak'
      } else if (typesCount === 2) {
        // 兩種型態（大小寫、有字母有數字但不全）→ 中
        strength.value = 'medium'
      } else if (typesCount === 3) {
        // 同時有大小寫與數字 → 強
        strength.value = 'strong'
      }
    }
    return {
      account,
      password,
      newPassword,
      nickname,
      originNickname,
      asideAccount,
      asideNickname,
      weight,
      originWeight,
      securityQuestion,
      securityAnswer,
      strength,
      isLoggedIn,
      token,
      securityQuestionsList,
      reset,
      resetProfileData,
      updateProfileDate,
      clearSecurityInfo,
      checkStrength,
    }
  },
  {
    persist: {
      key: 'user', // localStorage 的 key 名稱
      paths: [
        'isLoggedIn',
        'token',
        'asideAccount',
        'asideNickname',
        'nickname',
        'weight',
      ], // 要持久化的欄位
      storage: localStorage, // 使用 localStorage
    },
  } as any, // TypeScript 目前對 pinia-plugin-persistedstate 支援不佳，暫時用 any 繞過,
)
