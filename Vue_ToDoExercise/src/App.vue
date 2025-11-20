<script setup lang="ts">
import { useUserStore } from './stores/useUserStore'
import { RouterView } from 'vue-router'

import Aside from './components/layout/Aside.vue'
import Loading from './components/layout/Loading.vue'
import MobileHeader from './components/layout/MobileHeader.vue'

const userStore = useUserStore()
</script>

<template>
  <MobileHeader />
  <Loading />
  <div class="d-flex">
    <Aside />
    <div class="container p-4">
      <RouterView/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.test {
  display: flex;
}

</style>
