import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css' // 引入 CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // 引入 JS（包含 Popper.js 用於 dropdown、modal 等）
import './styles/main.scss'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 建立 Pinia 實例
const pinia = createPinia()
// 啟用持久化插件
pinia.use(piniaPluginPersistedstate)


const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
