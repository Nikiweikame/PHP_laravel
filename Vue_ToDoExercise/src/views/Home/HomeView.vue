<script setup lang="ts">
import Header from './Header.vue'
import Main from './Main.vue'
import Footer from '@/components/layout/Footer.vue'
</script>
<template>
  <Header />
  <Main />
  <Footer />
</template>
<style lang="scss" scoped>
.home_container {
  justify-content: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
