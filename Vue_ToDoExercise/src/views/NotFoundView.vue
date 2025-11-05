<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import HeaderLogo from '@/components/layout/HeaderLogo.vue'

import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <HeaderLogo />
  <main class="notfound">
    <div class="notfound__upper">
      <h1 class="mb-0">404</h1>
      <h2 class="mb-0">頁面未找到</h2>
      <p class="mb-0">
        糟糕！這個頁面好像迷路了。您正在尋找的頁面不存在，或已被移動。別擔心，讓我們帶您回到正軌。
      </p>
    </div>
    <BaseButton class="primary" type="button" label="返回首頁" @click="router.push('/')" />
  </main>
</template>
<style lang="scss" scoped>
.notfound {
  text-align: center;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  &__upper {
    width: 400px;
    height: 300px;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    text-align: center;
    justify-content: space-between;
  }

  h1 {
    color: #60c48f;
    font-size: 128px;
    font-weight: 700;
    font-family: 'Lexend', 'Noto Sans', sans-serif;
  }

  h2 {
    font-size: 24px;
    font-weight: 700;
  }

  .primary {
    margin: 0 auto;
  }
}
</style>
