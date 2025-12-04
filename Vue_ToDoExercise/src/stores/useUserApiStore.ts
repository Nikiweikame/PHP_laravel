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
import { useAuthStore } from '@/stores/useAuthStore'
import { useUiStore } from './useUiStore'
import { alertSuccess, alertWarning, alertError } from '@/utils/alert'
import { useRouter } from 'vue-router'

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
  const authStore = useAuthStore()
  const uiStore = useUiStore()
  const router = useRouter()


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
      authStore.reset() // 會重置到 state 初始值
      localStorage.removeItem('user') // 清除保存的狀態
      router.push('/login')
    }
  }
  async function getSecurityQuestions() {
    if (authStore.securityQuestionsList.length > 0) {
      // 已經有資料就不重複取得
      return
    }
    const requestOptions: RequestInit = { method: 'GET', redirect: 'follow' }

    try {
      const response = await fetch(SECURITY_QUESTION_ENDPOINT, requestOptions)
      const result = await response.json()
      if (result.success) {
        authStore.securityQuestionsList = result.data
      }
    } catch (error) {
      console.error('安全性問題讀取失敗', error)
    }
  }
  // 驗證答案並重設密碼
  async function resetPasswordByQuestion() {
    // const myHeaders = createHeaders(false)
    // const raw = JSON.stringify({
    //   account: authStore.account,
    //   security_question_id: authStore.securityQuestion,
    //   security_answer: authStore.securityAnswer,
    // })
    // const requestOptions: RequestInit = {
    //   method: 'post',
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: 'follow',
    // }

    // try {
    //   const response = await fetch(RESTETPASSWORD_ENDPOINT, requestOptions)
    //   const result = await response.json()
    //   if (result.success) {
    //     uiStore.forgetPasswordNext('12qwAS')
    //   } else {
    //     console.warn('密碼重設失敗', result.message)
    //     alertError('密碼重設失敗', result.message)
    //   }
    // } catch (error: any) {
    //   const msg = error instanceof Error ? error.message : String(error)
    //   console.warn('密碼重設失敗', error.message)
    //   alertError('伺服器無回應', msg)
    // }
  }
  async function updateProfile() {
    // const myHeaders = createHeaders(true)

    // const updateData: UpdateData = {} // --- 基本資料驗證 ---
    // if (authStore.nickname && authStore.nickname.trim() !== '') {
    //   updateData.nickname = authStore.nickname.trim()
    // }
    // if (authStore.weight && authStore.weight > 0) {
    //   updateData.weight = authStore.weight
    // }

    // // --- 安全提問驗證 ---
    // if (authStore.securityQuestion && authStore.securityAnswer) {
    //   if (authStore.securityAnswer.trim() === '') {
    //     alertWarning('安全性問題答案不可為空', '請填寫答案後再送出')
    //     return false
    //   }
    //   updateData.security_question_id = authStore.securityQuestion
    //   updateData.security_answer = authStore.securityAnswer.trim()
    //   updateData.password = authStore.password
    // }

    // // --- 檢查是否有資料需要更新 ---
    // if (Object.keys(updateData).length === 0) {
    //   alertWarning('沒有可更新的資料', '請修改資料後再送出')
    //   return false
    // }
    // const raw = JSON.stringify(updateData)
    // const requestOptions: RequestInit = {
    //   method: 'put',
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: 'follow',
    // }

    // try {
    //   const response = await fetch(PROFILE_ENDPOINT, requestOptions)
    //   const tokenStatus = checkTokenValid(response) as TokenStatus
    //   if (tokenStatus.expired) {
    //     alertWarning('資料更新失敗', tokenStatus.message)
    //     authStore.reset()
    //     router.push('/login')
    //     return
    //   }
    //   const result = await response.json()
    //   if (result.success) {
    //     alertSuccess('資料更新成功', result.message)
    //     authStore.updateProfileDate()
    //   } else {
    //     console.warn('資料更新失敗', result.message)
    //     alertError('資料更新失敗', result.message)
    //     authStore.resetProfileData()
    //   }
    // } catch (error: any) {
    //   const msg = error instanceof Error ? error.message : String(error)
    //   console.warn('資料更新失敗', error.message)
    //   alertError(msg, '伺服器無回應')
    //   authStore.resetProfileData()
    // }
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
        authStore.reset()
        router.push('/login')
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
    // const myHeaders = createHeaders(true)

    // const raw = JSON.stringify({
    //   old_password: authStore.password,
    //   new_password: authStore.newPassword,
    // })
    // const requestOptions: RequestInit = {
    //   method: 'put',
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: 'follow',
    // }

    // try {
    //   const response = await fetch(UPDATEPASSWORD_ENDPOINT, requestOptions)
    //   const tokenStatus = checkTokenValid(response) as TokenStatus
    //   if (tokenStatus.expired) {
    //     alertWarning('密碼更新失敗', tokenStatus.message)
    //     authStore.reset()
    //     router.push('/login')
    //     return
    //   }
    //   const result = await response.json()
    //   if (result.success) {
    //     alertSuccess('密碼更新成功', '請使用新密碼重新登入')
    //     authStore.reset() // 清掉 token / 使用者資料
    //     router.push('/login')
    //   } else {
    //     console.warn('密碼更新失敗', result.message)
    //     alertError('密碼更新失敗', result.message)
    //   }
    // } catch (error: any) {
    //   const msg = error instanceof Error ? error.message : String(error)
    //   alertError(msg, '伺服器無回應')
    // }
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
      const { token } = useAuthStore()
      if (token) headers.append('Authorization', `Bearer ${token}`)
    }

    return headers
  }

  return {
    logout,
    getSecurityQuestions,
    updateProfile,
    renewPassword,
    updatePassword,
    resetPasswordByQuestion,
    createHeaders,
  }
})
