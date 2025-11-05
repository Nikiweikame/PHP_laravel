<!-- <script setup lang="ts">
import { useUiStore } from '@/stores/useUiStore'
const uiStore = useUiStore()
</script>
<template>
    //漢堡按鈕 (手機版用)
    <button v-if="!uiStore.showMobileNav" class="hamburger" @click="uiStore.toggleNav">
      ☰
    </button>
</template>
<style lang="scss" scoped>
.hamburger {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1200;
  background: transparent;
  border: none;
  font-size: 28px;
  color: #333;
  cursor: pointer;
}
</style> -->
<script setup lang="ts">
import { useUiStore } from '@/stores/useUiStore'
const uiStore = useUiStore()
</script>

<template>
  <div class="mobile-header d-flex d-md-none">
    <button class="hamburger" @click="uiStore.toggleNav">☰</button>
    <h1 class="title">{{ uiStore.pageTitle }}</h1>
  </div>
</template>

<style lang="scss" scoped>
.mobile-header {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  // display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.hamburger {
  margin-right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  position: fixed;
  left: 16px;
  z-index: 1200;
  background: transparent;
  border: none;
  font-size: 28px;
  color: #333;
  cursor: pointer;
}
.title {
  font-size: 18px;
  font-weight: 600;
}
</style>
