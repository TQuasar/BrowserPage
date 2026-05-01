<script setup lang="ts">

</script>

<template>
<span class="settingLi">
  <span>· </span>
  <slot></slot>
</span>
</template>

<style scoped>
.settingLi {
  padding: 5px;
  border-radius: 5px;
  transition: background-color ease 0.2s
}

.settingLi:hover {
  background-color: var(--primaryColor2);
}
</style>