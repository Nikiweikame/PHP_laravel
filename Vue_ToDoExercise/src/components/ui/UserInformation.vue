<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'// 取用 Pinia store
const authStore = useAuthStore()

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
          <h5 class="card-title">{{ authStore.userData.nickname }}</h5>
          <p class="card-text">{{ authStore.userData.account }}</p>
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
