<script setup lang="ts">
import UserInformation from './UserInformation.vue'
import { useUiStore } from '@/stores/useUiStore'
import { ref } from 'vue'

const uiStore = useUiStore()
defineProps({
  label: {
    type: String,
  },
  figure: {
    type: String,
  },
})


</script>
<template>
  <a class="d-flex gap-3 nav-item" href="#">
    <span class="material-symbols-outlined">{{ figure }}</span>
    <p class="nav-item-lable">{{ label }}</p>
  </a>
</template>

<style lang="scss" scoped>
.nav-item {
  color: #333;
  border-radius: 8px;
}
.nav-item.router-link-active a {
  background-color: #60c48f;
  color: #fff;
}
.nav-item-lable {
  margin: 0;
}


.nav-item {
  display: block;
  padding: 0.5rem 1rem;
  color: #333;
  &:hover {
    background-color: #60c48f1a;
  }
}
.nav-item.router-link-active {
  background-color: #60c48f;
  color: #fff;
}
</style>
