<script setup lang="ts">
import { useUiStore } from '@/stores/useUiStore'

const uiStore = useUiStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="uiStore.isLoading"
        class="loading-overlay d-flex align-items-center justify-content-center"
      >
        <div class="spinner-border text-light" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.loading-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 0%;
  height: 100%;
  width: 100%;
  background-color: black;
  opacity: 50%;
}
</style>
