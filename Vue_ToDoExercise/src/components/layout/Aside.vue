<script setup lang="ts">
import UserInformation from '../ui/UserInformation.vue'
import AsideNav from './AsideNav.vue'
import { useUiStore } from '@/stores/useUiStore'
import { ref } from 'vue'

const uiStore = useUiStore()
defineProps({
  name: {
    type: String,
  },
})
</script>
<template>
  <!-- 桌機版 -->
  <div class="aside__container d-none d-md-block">
    <aside class="aside__wrapper d-flex flex-column">
      <UserInformation />
      <AsideNav class="d-flex flex-column" />
    </aside>
  </div>

  <!-- 手機版 -->
  <Teleport to="body" v-if="uiStore.showMobileNav">
    <div class="mobile-overlay d-flex flex-column d-md-none" @click.self="uiStore.toggleNav">
      <aside class="aside__container mobile">
        <UserInformation />
        <AsideNav />
      </aside>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
// .aside {
//   &__container {
//     background-color: #fff;
//     padding: 16px;
//     width: 256px;
//   }
// }

.aside {
  &__container {
    background-color: #fff;
    min-width: 256px;
    &.mobile {
      padding: 16px;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1100;
      transition: transform 0.3s ease;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    }
  }
  &__wrapper {
    background-color: #fff;
    position: fixed;
    padding: 16px;
    width: 256px;
    height: 100%;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
}
</style>
