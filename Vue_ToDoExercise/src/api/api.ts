import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'
import router from '@/router'
import { alertWarning } from '@/utils/alert'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// 自動帶 Token
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// Token 過期統一處理
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      alertWarning('Token 過期', '請重新登入')
      const authStore = useAuthStore()
      authStore.reset()
      router.push('/login')
    }
    return Promise.reject(error)
  },
)

export default api
