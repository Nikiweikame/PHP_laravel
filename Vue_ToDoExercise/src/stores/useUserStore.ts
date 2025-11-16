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
export const useUserStore = defineStore('user', {
  state: () => ({
    // 登入輸入欄位
    account: '', // 登入輸入用帳號
    password: '',
    newPassword: '',

    // 顯示用（側邊欄、header）
    nickname: '',
    originNickname: '',
    asideAccount: 'John Doe', // 顯示使用者名稱（登入後會更新）
    asideNickname: '訪客', // 顯示使用者暱稱（登入後會更新）
    weight: 0,
    originWeight: 0,

    // 安全性設定
    securityQuestion: '1',
    securityAnswer: '',
    strength: 'weak',

    // 登入狀態與 Token
    isLoggedIn: false,
    token: ref<string | null>(localStorage.getItem('token')),

    // API 基本設定
    apiUrl: 'http://127.0.0.1:8000/api',

    // 額外資料
    securityQuestionsList: [] as SecurityQuestion[],
    router: useRouter(),
  }),

  actions: {
    /** 重設所有欄位（登出或清除資料時用） */
    reset() {
      this.account = ''
      this.password = ''
      this.newPassword = ''
      this.nickname = ''
      this.originNickname = ''
      this.asideAccount = 'John Doe'
      this.asideNickname = '訪客'
      this.weight = 0
      this.originWeight = 0
      this.securityQuestion = '1'
      this.securityAnswer = ''
      this.strength = 'weak'
      this.isLoggedIn = false
      this.token = ''
      const exerciseItemStore = useExerciseItemStore()
      exerciseItemStore.itemsContent = []
      const exerciseRecordStore = useExerciseRecordStore()
      exerciseRecordStore.recordsContent = []
    },
    resetProfileData() {
      this.nickname = this.originNickname
      this.weight = this.originWeight
    },
    updateProfileDate() {
      this.originNickname = this.nickname
      this.originWeight = this.weight
      this.asideNickname = this.nickname
    },
    clearSecurityInfo() {
      this.securityQuestion = '1'
      this.securityAnswer = ''
      this.password = ''
      this.newPassword = ''
      this.strength = 'weak'
    },

    /**
     * 密碼強度檢測函式
     * 規則：
     *  - 只含一種型態（小寫、大寫、數字） → 弱 (weak)
     *  - 含兩種型態 → 中 (medium)
     *  - 同時有 大寫 + 小寫 + 數字 → 強 (strong)
     */
    checkStrength() {
      const pw = this.newPassword

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
        this.strength = 'weak'
      } else if (typesCount === 1) {
        // 只有一種型態（純數字、純英文）→ 弱
        this.strength = 'weak'
      } else if (typesCount === 2) {
        // 兩種型態（大小寫、有字母有數字但不全）→ 中
        this.strength = 'medium'
      } else if (typesCount === 3) {
        // 同時有大小寫與數字 → 強
        this.strength = 'strong'


      }
    },
  },

  // 持久化設定
  persist: {
    persist: {
      key: 'user', // localStorage 的 key 名稱
      paths: ['isLoggedIn', 'token', 'displayName', 'nickname', 'weight'], // 要持久化的欄位
      storage: localStorage, // 使用 localStorage 來存取
    },
  } as any, // TypeScript 目前對 pinia-plugin-persistedstate 支援不佳，暫時用 any 繞過
})
