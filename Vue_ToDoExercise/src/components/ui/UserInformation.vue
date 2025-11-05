<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
// 取用 Pinia store
const userStore = useUserStore()
defineProps({
  name: {
    type: String,
  },
})
</script>
<template>
  <div class="card userInformation" style="max-width: 540px">
    <div class="row g-0">
      <div class="col-4 d-flex align-items-center justify-content-center">
        <!-- <img src="..." class="img-fluid rounded-start" alt="..."> -->
        <div class="avatar-badge"></div>
      </div>
      <div class="col-8">
        <div class="card-body">
          <h5 class="card-title">{{ userStore.asideNickname }}</h5>
          <p class="card-text">{{ userStore.asideAccount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.userInformation {
  flex: 0;
  &.card {
    border: 0;
  }
  .card-body {
    padding: 12px 0;
  }
  .card-text {
    color: #509572;
  }
  .avatar-badge {
    border-radius: 50%;
    background-color: aquamarine;
    width: 50px;
    height: 50px;
  }
}
</style>
