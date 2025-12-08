// src/api/auth.ts
import api from '@/api/api'
import type {
  LoginData,
  RegisterData,
  profileInformation,
  UpdateData,
  ForgetPasswordData,
  changePasswordData,
} from '@/types/auth'

export async function login(LoginData: LoginData) {
  try {
    console.log('LoginData', LoginData)
    const { data } = await api.post('/login', LoginData)
    return data
  } catch (error: any) {
    throw new Error(error.message || '伺服器無回應')
  }
}

export async function register(registerData: RegisterData) {
  try {
    const { data } = await api.post('/register', registerData)
    return data
  } catch (error: any) {
    throw new Error(error.message || '伺服器錯誤')
  }
}

export async function logout() {
  try {
    const { data } = await api.post('/logout', {})
    return data
  } catch (error: any) {
    throw new Error(error.message || '伺服器錯誤')
  }
}

export async function updateProfile(UpdateData: UpdateData) {
  try {
    const { data } = await api.put('/profile', UpdateData)
    return data
  } catch (error: any) {
    throw new Error(error.message || '伺服器無回應')
  }
}
//驗證答案並重設密碼
export async function resetPasswordByQuestion(resetData: ForgetPasswordData) {
  try {
    console.log('resetData', resetData)
    const { data } = await api.post('/reset-password', resetData)
    return data
  } catch (error: any) {
    throw new Error(error.message || '伺服器無回應')
  }
}
// 重設密碼
export async function updatePassword(passwordData: changePasswordData) {
  try {
    console.log('passwordData', passwordData)
    const { data } = await api.put('/password/update', passwordData)
    return data
  } catch (error: any) {
    throw new Error(error.message || '伺服器無回應')
  }
}
// 沿用舊密碼
export async function renewPassword() {
  try {
    const { data } = await api.post('/password/renew', {})
    return data
  } catch (error: any) {
    throw new Error(error.message || '伺服器無回應')
  }
}
