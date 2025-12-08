// /src/stores/user.ts
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { alertSuccess, alertWarning, alertError } from '@/utils/alert'
import { reactive, ref } from 'vue'
import { useExerciseItemStore } from './useExerciseItemStore'
import { useExerciseRecordStore } from './useExerciseRecordStore'
import { useUiStore } from './useUiStore'
import {
  login,
  logout,
  register,
  renewPassword,
  resetPasswordByQuestion,
  updatePassword,
  updateProfile,
} from '@/api/auth'

import type {
  changePasswordData,
  ChangeSecurityQuestion,
  ForgetPasswordData,
  LoginData,
  profileInformation,
  RegisterData,
  SecurityQuestion,
  UpdateData,
} from '@/types/auth'

export const useAuthStore = defineStore(
  'AuthStore',
  () => {
    // 登入login
    const defaultLoginForm: LoginData = {
      account: '',
      password: '',
    }

    const loginForm = reactive<LoginData>({ ...defaultLoginForm })
    // 重置登入欄位
    function resetLoginForm() {
      Object.assign(loginForm, defaultLoginForm)
    }
    // 註冊register
    const defaultRegisterForm: RegisterData = {
      account: '',
      password: '',
      nickname: '',
      weight: 0,
      security_question_id: '1',
      security_answer: '',
    }
    const registerForm = reactive<RegisterData>({ ...defaultRegisterForm })
    function resetRegisterForm() {
      Object.assign(registerForm, defaultRegisterForm)
    }
    // 忘記密碼forget password

    const defaultForgetPasswordForm: ForgetPasswordData = {
      account: '',
      security_question_id: '1',
      security_answer: '',
      password: '',
    }
    const forgetPasswordForm = reactive<ForgetPasswordData>({ ...defaultForgetPasswordForm })
    function resetForgetPasswordForm() {
      Object.assign(forgetPasswordForm, defaultForgetPasswordForm)
    }
    // 密碼變更
    const defaultChangePasswordForm: changePasswordData = {
      old_password: '',
      new_password: '',
    }
    const changePasswordForm = reactive<changePasswordData>({ ...defaultChangePasswordForm })
    function resetChangePasswordForm() {
      Object.assign(changePasswordForm, defaultChangePasswordForm)
    }

    // 安全提問變更
    const defaultChangeSecurityQuestionForm: ChangeSecurityQuestion = {
      security_question_id: '1',
      security_answer: '',
      password: '',
    }
    const changeSecurityQuestionForm = reactive<ChangeSecurityQuestion>({
      ...defaultChangeSecurityQuestionForm,
    })
    function resetChangeSecurityQuestionForm() {
      Object.assign(changeSecurityQuestionForm, defaultChangeSecurityQuestionForm)
    }
    const newPassword = ref('')

    // 個人資訊儲存
    const defaultUser: profileInformation = {
      nickname: '訪客',
      account: 'John Doe',
      weight: 0,
    }
    const userData = reactive<profileInformation>({
      ...defaultUser,
    })
    function resetUser() {
      Object.assign(userData, defaultUser)
    }
    const modifyUser: profileInformation = {
      nickname: '訪客',
      account: 'John Doe',
      weight: 0,
    }

    function resetModifyUser() {
      Object.assign(modifyUser, userData)
    }

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
    const token = ref<string | null>(null)

    // 額外資料
    const securityQuestionsList = ref<SecurityQuestion[]>([])
    const router = useRouter()
    const uiStore = useUiStore()

    /** 重設所有欄位（登出或清除資料時用） */
    function reset() {
      resetLoginForm()
      resetRegisterForm()
      resetForgetPasswordForm()
      resetChangePasswordForm()
      resetChangeSecurityQuestionForm()
      resetUser()
      // account.value = ''
      // password.value = ''
      // newPassword.value = ''
      // nickname.value = ''
      // originNickname.value = ''
      // asideAccount.value = 'John Doe'
      // asideNickname.value = '訪客'
      // weight.value = 0
      // originWeight.value = 0
      // securityQuestion.value = '1'
      // securityAnswer.value = ''
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
    function updateProfileData(profileData: profileInformation) {
      console.log('profileData', profileData)
      userData.nickname = profileData.nickname
      userData.weight = profileData.weight
    }
    function clearSecurityInfo() {
      securityQuestion.value = '1'
      securityAnswer.value = ''
      // password.value = ''
      newPassword.value = ''
      strength.value = 'weak'
    }

    async function doLogin() {
      try {
        const result = await login(loginForm)
        if (result.success) {
          handleLoginSuccess(result.data)
        } else {
          throw new Error(result.message || '登入失敗')
        }
      } catch (error: any) {
        console.warn('登入失敗', error.message)
        alertWarning('登入失敗', error.message || '請檢查帳號密碼是否正確')
      }
    }
    function handleLoginSuccess(result: any) {
      setInformation(result)
      resetModifyUser()
      // 處理密碼狀態
      if (result.password_status !== 'ok') {
        alertWarning(result.password_status, '請前往個人檔案頁面更新密碼')
        router.push('/profile')
        uiStore.togglePasswordModel()
        return
      }

      alertSuccess('登入成功', '歡迎回來！')
      router.push('/records')
      return
    }
    function setInformation(result: any) {
      // 更新 token
      token.value = result.access_token

      // 更新使用者資料
      const user = result.user
      userData.account = user.account
      userData.nickname = user.nickname
      userData.weight = user.weight
      // 更新登入狀態
      isLoggedIn.value = true
      // 重置密碼強度
      strength.value = 'weak'

      return
    }

    function handleRegisterSuccess(result: any) {
      setInformation(result)
      alertSuccess('註冊成功', '歡迎加入！')
      router.push('/records')
      return
    }
    // 註冊
    async function doRegister() {
      try {
        console.log(registerForm,123)
        const result = await register(registerForm)
        if (result.success) {
          handleRegisterSuccess(result.data)
        } else {
          throw new Error(result.message || '註冊失敗')
        }
      } catch (error: any) {
        console.warn('註冊失敗', error.message)
        alertWarning('註冊失敗', error.message || '伺服器錯誤')
      }
    }
    async function doLogout() {
      try {
        const result = await logout()
        if (result.success) {
          alertSuccess('👋 已登出', '下次再見')
        } else {
          throw new Error(result.message || '伺服器未正常回應')
        }
      } catch (error: any) {
        alertWarning('⚠️ 登出異常', error.message && '將強制登出')
      } finally {
        // ✅ 無論 API 成功與否都要清除資料
        reset() // 會重置到 state 初始值
        localStorage.removeItem('user') // 清除保存的狀態
        router.push('/login')
      }
    }
    async function doUpdateProfile(updateData: UpdateData) {
      try {
        // --- 檢查是否有資料需要更新 ---
        if (Object.keys(updateData).length === 0) {
          alertWarning('沒有可更新的資料', '請修改資料後再送出')
          return false
        }
        const result = await updateProfile(updateData)
        if (result.success) {
          updateProfileData(result.data)
          alertSuccess('資料更新成功', '個人資料已更新')
        } else {
          throw new Error(result.message || '資料更新失敗')
        }
      } catch (error: any) {
        console.warn('資料更新失敗', error.message)
        alertWarning('資料更新失敗', error.message || '伺服器錯誤')
      }
    }

    async function doResetPasswordByQuestion() {
      try {
        const result = await resetPasswordByQuestion(forgetPasswordForm)
        if (result.success) {
          uiStore.forgetPasswordNext('12qwAS')
        } else {
          console.warn('密碼重設失敗', result.message)
          alertError('密碼重設失敗', result.message)
        }
      } catch (error: any) {
        console.warn('密碼重設失敗', error.message)
        alertError('密碼重設失敗', error.message)
      }
    }
    async function doUpdatePassword() {
      try {
        const result = await updatePassword(changePasswordForm)
        if (result.success) {
          alertSuccess('密碼更新成功', '請使用新密碼重新登入')
          reset() // 清掉 token / 使用者資料
          router.push('/login')
        } else {
          console.warn('密碼更新失敗', result.message)
          alertError('密碼更新失敗', result.message)
        }
      } catch (error: any) {
        console.warn('密碼更新失敗', error.message)
        alertError('密碼更新失敗', error.message)
      }
    }
    async function doRenewPassword() {
      try {
        const result = await renewPassword()
        if (result.success) {
          alertSuccess('密碼沿用成功', '建議使用新密碼重新登入')
        } else {
          console.warn('密碼沿用失敗', result.message)
          alertError('密碼沿用失敗', result.message)
        }
      } catch (error: any) {
        console.warn('密碼沿用失敗', error.message)
        alertError('密碼沿用失敗', error.message)
      }
    }
    return {
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
      loginForm,
      resetLoginForm,
      registerForm,
      resetRegisterForm,
      forgetPasswordForm,
      resetForgetPasswordForm,
      changePasswordForm,
      resetChangePasswordForm,
      changeSecurityQuestionForm,
      resetChangeSecurityQuestionForm,
      userData,
      resetUser,
      modifyUser,
      resetModifyUser,
      reset,
      resetProfileData,
      updateProfileData,
      clearSecurityInfo,
      doLogin,
      doRegister,
      doLogout,
      doUpdateProfile,
      doResetPasswordByQuestion,
      doUpdatePassword,
      doRenewPassword,
    }
  },
  {
    persist: {
      key: 'user', // localStorage 的 key 名稱
      paths: ['isLoggedIn', 'token', 'userData', 'modifyUser'], // 要持久化的欄位
      storage: localStorage, // 使用 localStorage
    },
  } as any, // TypeScript 目前對 pinia-plugin-persistedstate 支援不佳，暫時用 any 繞過,
)
