<script lang="ts" setup>
import PageHeader from "./PageHeader.vue";
import PageBody from "./PageBody.vue";
</script>

<template>
  <div class="pageBox">
    <PageHeader/>
    <PageBody/>
  </div>
</template>

<style scoped>
  .pageBox {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
</style>