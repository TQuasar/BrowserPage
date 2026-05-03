<script setup lang="ts">
interface Props {
  order: "in" | "out" | "no",
}
/* TODO:完善in-order模式 */
const props = defineProps<Props>()
</script>

<template>
<span class="settingLi">
  <span v-if="props.order !== 'no'">· </span>
  <slot></slot>
</span>
</template>

<style scoped>
.settingLi {
  display: block;
  padding: 5px;
  border-radius: 5px;
  width: 100%;
  transition: background-color ease 0.2s
}

.settingLi:hover {
  background-color: var(--primaryColor2);
}
</style>