import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import Homeview from '@/views/Home/HomeView.vue'
import RegisterView from '@/views/Register/RegisterView.vue'
import RecordsView from '@/views/Records/RecordsView.vue'
import LoginView from '@/views/Login/LoginView.vue'
import ItemsView from '@/views/Items/ItemsView.vue'
import ProfileView from '@/views/Profile/ProfileView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Homeview },
  { path: '/records', name: 'Records', component: RecordsView, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/items', name: 'Items', component: ItemsView, meta: { requiresAuth: true } },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }, //NotFoundView, // 你自己寫一個 404 頁面
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 如果頁面需要登入而使用者尚未登入
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login') // 👈 導回登入頁
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isLoggedIn) {
    next('/records') // 已登入就導回首頁
  } else {
    next()
  }
})
export default router
