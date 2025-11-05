<script lang="ts">

</script>
<template>
  <button class="addbutton__container btn btn-success d-flex justify-content-center align-items-center">
    <span class="material-symbols-outlined">add</span>
  </button>
</template>
<style lang="scss" scoped>
.addbutton {
  &__container {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 32px;
    z-index: 1000;

    position: fixed;
    right: 30px;
    bottom: 30px;
    background-color: #60c48f;
    border: 0;
    border-radius: 50%;
    padding: 12px;
  }
}
</style>