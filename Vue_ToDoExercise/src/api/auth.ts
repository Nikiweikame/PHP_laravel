// src/api/auth.ts
import api from '@/api/api'
import type { LoginData, RegisterData } from '@/types/auth'

export async function login(LoginData: LoginData) {
  try {
    const { data } = await api.post('/login', LoginData)
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.message || '登入失敗')
    }
  } catch (error: any) {
    throw new Error(error.message || '伺服器無回應')
  }
}

export async function register(registerData: RegisterData) {
  try {
    const { data } = await api.post('/register', registerData)
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.message || '伺服器未正常回應')
    }
  } catch (error: any) {
    throw new Error(error.message || '伺服器錯誤')
  }
}

export async function logout() {
  try {
    const { data } = await api.post('/logout', {})
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.message || '伺服器未正常回應')
    }
  } catch (error: any) {
    throw new Error(error.message || '伺服器錯誤')
  }
}
