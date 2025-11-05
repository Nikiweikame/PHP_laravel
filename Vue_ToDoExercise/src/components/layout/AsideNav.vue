<script setup lang="ts">
import { RouterLink } from 'vue-router'
import NavItem from '@/components/ui/NavItem.vue'
import { useUiStore } from '@/stores/useUiStore'
import { useUserStore } from '@/stores/useUserStore'
import { useUserApiStore } from '@/stores/useUserApiStore'

const uiStore = useUiStore()
const userStore = useUserStore()
const ApiStore = useUserApiStore()
defineProps({
  name: {
    type: String,
  },
})
</script>
<template>
  <nav class="aside-nav">
    <div>
      <RouterLink
        v-for="item in uiStore.filteredNavItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
      >
        <NavItem :label="item.label" :figure="item.figure" />
      </RouterLink>
      <!-- 只在 /profile 顯示額外欄位 -->
      <template v-if="$route.path === '/profile'" v-for="item in uiStore.profileItems">
        <NavItem :label="item.label" :figure="item.figure" @click="item.controller" />
      </template>
    </div>
    <div v-if="userStore.isLoggedIn" class="logout">
      <NavItem label="登出" figure="logout" @click="ApiStore.logout" />
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.aside-nav {
  flex: 1 1 auto;
  justify-content: space-between;
}
.nav-item {
  text-decoration: none;
}
</style>
