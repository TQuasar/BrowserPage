<script setup lang="ts">
interface Props {
  order: "in" | "out" | "no",
  compact?: boolean,
}
/* TODO:完善in-order模式 */
const props = defineProps<Props>()
</script>

<template>
<span class="settingLi" :class="{ compact: props.compact }">
  <span v-if="props.order !== 'no'">· </span>
  <slot></slot>
</span>
</template>

<style scoped>
.settingLi {
  position: relative;
  display: block;
  padding: 5px;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  transition: background-color ease 0.2s
}

.settingLi.compact {
  padding: 0;
}

.settingLi:hover {
  background-color: var(--primaryColor2);
}
</style>