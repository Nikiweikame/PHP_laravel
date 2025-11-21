// /stores/useUiStore.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'

export const useUiStore = defineStore('ui', () => {
  const route = useRoute()
  const userStore = useUserStore() // ✅ 要放在這裡

  // 導覽項目集中管理
  const navItems = [
    { label: '首頁', figure: 'home', path: '/' },
    { label: '登入', figure: 'login', path: '/login', auth: false },
    { label: '註冊', figure: 'person_add', path: '/register', auth: false },
    { label: '運動紀錄', figure: 'directions_run', path: '/records', auth: true },
    { label: '運動項目', figure: 'list_alt', path: '/items', auth: true },
    { label: '個人檔案', figure: 'person', path: '/profile', auth: true },
  ]
  // 根據登入狀態自動過濾
  const filteredNavItems = computed(() =>
    navItems.filter((item) => item.figure === 'home' || item.auth === userStore.isLoggedIn),
  )

  const forgetPasswordModel = ref(false)
  const toggleForgetPasswordModel = () => {
    forgetPasswordModel.value = !forgetPasswordModel.value
  }

  // 個人檔案頁面項目
  const securityQuestionChangeModel = ref(false)
  const passwordChangeModel = ref(false)
  const toggleSecurityQuestionModel = () => {
    userStore.securityAnswer = ''
    securityQuestionChangeModel.value = !securityQuestionChangeModel.value
  }
  const togglePasswordModel = () => {
    userStore.password = ''
    userStore.newPassword = ''
    passwordChangeModel.value = !passwordChangeModel.value
  }

  const profileItems = [
    { label: '安全提問', figure: 'help_outline', controller: toggleSecurityQuestionModel },
    { label: '密碼修改', figure: 'lock', controller: togglePasswordModel },
  ]

  // 自動取得頁面標題
  const pageTitle = computed(() => {
    const found = navItems.find((item) => item.path === route.path)
    return found ? found.label : '我的應用'
  })

  // 控制手機版側邊選單顯示
  const showMobileNav = ref(false)
  const toggleNav = () => (showMobileNav.value = !showMobileNav.value)
  // 全域載入中狀態
  const isLoading = ref(false)
  const showLoading = () => {
    isLoading.value = true
  }
  const hideLoading = () => {
    isLoading.value = false
  }

  const forgetPasswordStep = ref('security-question')
  function forgetPasswordNext(newpd: string) {
    forgetPasswordStep.value = 'change-password'
    userStore.newPassword = newpd
  }
  function forgetPasswordComplete() {
    forgetPasswordStep.value = 'security-question'
    userStore.reset()
  }

  const showRecordDialog = ref(false)
  const RecordModel = ref<'add' | 'modify' | 'delete'>('add')
  const openRecordDialog = (model: 'add' | 'modify' | 'delete') => {
    showRecordDialog.value = true
    RecordModel.value = model
  }
  const showItemDialog = ref(false)
  const ItemModel = ref<'add' | 'modify' | 'delete'>('add')
  const openItemDialog = (model: 'add' | 'modify' | 'delete') => {
    showItemDialog.value = true
    ItemModel.value = model
  }
  return {
    navItems,
    filteredNavItems,
    profileItems,
    pageTitle,
    showMobileNav,
    toggleNav,
    isLoading,
    showLoading,
    hideLoading,
    securityQuestionChangeModel,
    passwordChangeModel,
    toggleSecurityQuestionModel,
    togglePasswordModel,
    forgetPasswordModel,
    toggleForgetPasswordModel,
    forgetPasswordStep,
    forgetPasswordNext,
    forgetPasswordComplete,
    showRecordDialog,
    RecordModel,
    openRecordDialog,
    showItemDialog,
    ItemModel,
    openItemDialog,
  }
})
