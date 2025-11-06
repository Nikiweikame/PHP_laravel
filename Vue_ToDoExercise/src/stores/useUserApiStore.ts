// src/stores/useUserApiStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  LOGIN_ENDPOINT,
  LOGOUT_ENDPOINT,
  REGISTER_ENDPOINT,
  PROFILE_ENDPOINT,
  SECURITY_QUESTION_ENDPOINT,
  RENEWPASSWORD_ENDPOINT,
  UPDATEPASSWORD_ENDPOINT,
  RESTETPASSWORD_ENDPOINT,
} from '@/config/api'
import { useUserStore } from '@/stores/useUserStore'
import { useUiStore } from './useUiStore'
import { alertSuccess, alertWarning, alertError } from '@/utils/alert'

interface TokenStatus {
  expired: boolean
  message: string
}
interface UpdateData {
  nickname?: string
  weight?: number
  security_question_id?: string
  security_answer?: string
  password?: string
  new_password?: string
}
export const useUserApiStore = defineStore('userApi', () => {
  const userStore = useUserStore()
  const uiStore = useUiStore()

  // 登入
  async function login() {
    const myHeaders = createHeaders(false)
    const raw = JSON.stringify({
      user_id: userStore.account,
      password: userStore.password,
    })

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    try {
      const response = await fetch(LOGIN_ENDPOINT, requestOptions)
      const result = await response.json()
      if (result.success) {
        const data = result.data
        //  拿token
        userStore.token = data.access_token
        // 取得使用者資料
        const user = data.user
        userStore.nickname = user.nickname
        userStore.originNickname = user.nickname
        userStore.asideAccount = userStore.account
        userStore.asideNickname = userStore.nickname
        userStore.weight = user.weight
        userStore.originWeight = user.weight
        userStore.isLoggedIn = true
        //  登入表單欄位清空
        userStore.account = ''
        userStore.password = ''
        if (data.password_status !== 'ok') {
          const warningTitle = data.password_status === 'expired' ? '密碼已過期' : '密碼為預設密碼'
          alertWarning(warningTitle, '請前往個人檔案頁面更新密碼')
          userStore.router.push('/profile')
          uiStore.togglePasswordModel()
          return
        }
        alertSuccess('登入成功', '歡迎回來！')
        userStore.router.push('/')
      } else {
        alertWarning('登入失敗', result.message || '請檢查帳號密碼是否正確')
      }
    } catch (error: any) {
      alertError('登入失敗', error.message || '伺服器無回應')
    }
  }

  // 註冊
  async function register() {
    try {
      const myHeaders = createHeaders(false)

      const raw = JSON.stringify({
        user_id: userStore.account,
        password: userStore.newPassword,
        nickname: userStore.nickname,
        weight: userStore.weight,
        security_question_id: userStore.securityQuestion,
        security_answer: userStore.securityAnswer,
      })

      const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      }

      const response = await fetch(REGISTER_ENDPOINT, requestOptions)
      const result = await response.json()
      if (result.success) {
        const data = result.data
        //  拿token
        userStore.token = data.access_token
        // 取得使用者資料並設定登入狀態
        const user = data.user
        userStore.nickname = user.nickname
        userStore.originNickname = user.nickname
        userStore.asideAccount = userStore.account
        userStore.asideNickname = userStore.nickname
        userStore.weight = user.weight
        userStore.originWeight = user.weight
        userStore.isLoggedIn = true
        //  登入表單欄位清空
        userStore.account = ''
        userStore.password = ''
        alertSuccess('註冊成功', '歡迎加入！')
        userStore.router.push('/')
        return
      } else {
        alertWarning('註冊失敗', result.message || '伺服器未正常回應')
        return
      }
    } catch (err: any) {
      alertError('註冊失敗', err.message || '伺服器錯誤')
    }
  }

  // 登出
  async function logout() {
    const myHeaders = createHeaders(true)

    const raw = ''
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }
    // 登出是一個「安全動作」，應該確保前端一定清乾淨。
    // 伺服器的回應是「加分」，不是「必要」。
    try {
      const response = await fetch(LOGOUT_ENDPOINT, requestOptions)
      const result = await response.json()
      if (result.success) {
        alertSuccess('👋 已登出', '下次再見')
      } else {
        alertWarning('⚠️ 登出異常', result.message || '伺服器未正常回應')
      }
    } catch (error) {
      alertError('伺服器錯誤', '無法連線至伺服器，將強制登出')
    } finally {
      // ✅ 無論 API 成功與否都要清除資料
      userStore.reset() // 會重置到 state 初始值
      localStorage.removeItem('user') // 清除保存的狀態
      userStore.router.push('/login')
    }
  }
  async function getSecurityQuestions() {
    if (userStore.securityQuestionsList.length > 0) {
      // 已經有資料就不重複取得
      return
    }
    const requestOptions: RequestInit = { method: 'GET', redirect: 'follow' }

    try {
      const response = await fetch(SECURITY_QUESTION_ENDPOINT, requestOptions)
      const result = await response.json()
      if (result.success) {
        userStore.securityQuestionsList = result.data
      }
    } catch (error) {
      console.error('安全性問題讀取失敗', error)
    }
  }
  // 驗證答案並重設密碼
  async function resetPasswordByQuestion() {
    const myHeaders = createHeaders(false)
    const raw = JSON.stringify({
      account: userStore.account,
      security_question_id: userStore.securityQuestion,
      security_answer: userStore.securityAnswer,
    })
    const requestOptions: RequestInit = {
      method: 'post',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    try {
      const response = await fetch(RESTETPASSWORD_ENDPOINT, requestOptions)
      const result = await response.json()
      if (result.success) {
        uiStore.forgetPasswordNext('12qwAS')
      } else {
        console.warn('密碼重設失敗', result.message)
        alertError('密碼重設失敗', result.message)
      }
    } catch (error: any) {
      const msg = error instanceof Error ? error.message : String(error)
      console.warn('密碼重設失敗', error.message)
      alertError('伺服器無回應', msg)
    }
  }
  async function updateProfile() {
    const myHeaders = createHeaders(true)

    const updateData: UpdateData = {} // --- 基本資料驗證 ---
    if (userStore.nickname && userStore.nickname.trim() !== '') {
      updateData.nickname = userStore.nickname.trim()
    }
    if (userStore.weight && userStore.weight > 0) {
      updateData.weight = userStore.weight
    }

    // --- 安全提問驗證 ---
    if (userStore.securityQuestion && userStore.securityAnswer) {
      if (userStore.securityAnswer.trim() === '') {
        alertWarning('安全性問題答案不可為空', '請填寫答案後再送出')
        return false
      }
      updateData.security_question_id = userStore.securityQuestion
      updateData.security_answer = userStore.securityAnswer.trim()
      updateData.password = userStore.password
    }

    // --- 檢查是否有資料需要更新 ---
    if (Object.keys(updateData).length === 0) {
      alertWarning('沒有可更新的資料', '請修改資料後再送出')
      return false
    }
    const raw = JSON.stringify(updateData)
    const requestOptions: RequestInit = {
      method: 'put',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    try {
      const response = await fetch(PROFILE_ENDPOINT, requestOptions)
      const tokenStatus = checkTokenValid(response) as TokenStatus
      if (tokenStatus.expired) {
        alertWarning('資料更新失敗', tokenStatus.message)
        userStore.reset()
        userStore.router.push('/login')
        return
      }
      const result = await response.json()
      if (result.success) {
        alertSuccess('資料更新成功', result.message)
        userStore.updateProfileDate()
      } else {
        console.warn('資料更新失敗', result.message)
        alertError('資料更新失敗', result.message)
        userStore.resetProfileData()
      }
    } catch (error: any) {
      const msg = error instanceof Error ? error.message : String(error)
      console.warn('資料更新失敗', error.message)
      alertError(msg, '伺服器無回應')
      userStore.resetProfileData()
    }
  }
  async function renewPassword() {
    const myHeaders = createHeaders(true)

    const raw = JSON.stringify({})
    const requestOptions: RequestInit = {
      method: 'post',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    try {
      const response = await fetch(RENEWPASSWORD_ENDPOINT, requestOptions)
      const tokenStatus = checkTokenValid(response) as TokenStatus
      if (tokenStatus.expired) {
        alertWarning('密碼更新失敗', tokenStatus.message)
        userStore.reset()
        userStore.router.push('/login')
        return
      }
      const result = await response.json()
      if (result.success) {
        alertSuccess('密碼更新成功', '建議使用新密碼重新登入')
      } else {
        console.warn('密碼更新失敗', result.message)
        alertError('密碼更新失敗', result.message)
      }
    } catch (error: any) {
      const msg = error instanceof Error ? error.message : String(error)
      alertError(msg, '伺服器無回應')
    }
  }
  async function updatePassword() {
    const myHeaders = createHeaders(true)

    const raw = JSON.stringify({
      old_password: userStore.password,
      new_password: userStore.newPassword,
    })
    const requestOptions: RequestInit = {
      method: 'put',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    try {
      const response = await fetch(UPDATEPASSWORD_ENDPOINT, requestOptions)
      const tokenStatus = checkTokenValid(response) as TokenStatus
      if (tokenStatus.expired) {
        alertWarning('密碼更新失敗', tokenStatus.message)
        userStore.reset()
        userStore.router.push('/login')
        return
      }
      const result = await response.json()
      if (result.success) {
        alertSuccess('密碼更新成功', '請使用新密碼重新登入')
        userStore.reset() // 清掉 token / 使用者資料
        userStore.router.push('/login')
      } else {
        console.warn('密碼更新失敗', result.message)
        alertError('密碼更新失敗', result.message)
      }
    } catch (error: any) {
      const msg = error instanceof Error ? error.message : String(error)
      alertError(msg, '伺服器無回應')
    }
  }
  function checkTokenValid(response: Response) {
    const tokenStatus = { expired: false, message: '' }
    if (response.status === 401 || response.status === 419) {
      tokenStatus.expired = true
      tokenStatus.message = '登入狀態已過期，請重新登入'
    }
    return tokenStatus
  }
  function createHeaders(withAuth = true): Headers {
    const headers = new Headers()
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/json')

    if (withAuth) {
      const { token } = useUserStore()
      if (token) headers.append('Authorization', `Bearer ${token}`)
    }

    return headers
  }

  return {
    login,
    register,
    logout,
    getSecurityQuestions,
    updateProfile,
    renewPassword,
    updatePassword,
    resetPasswordByQuestion,
    createHeaders,
  }
})
