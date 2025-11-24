// src/api/auth.ts
import api from '@/api/api'

export async function login(user_id: string, password: string) {
  try {
    const { data } = await api.post('/login', { user_id, password })
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.message || '登入失敗')
    }
  } catch (error: any) {
      throw new Error(error.message || '伺服器無回應')
  }
}
