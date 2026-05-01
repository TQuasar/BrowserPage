<script setup lang="ts">
interface Props {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
}
const props = withDefaults(defineProps<Props>(), {
  direction: "row",
});
</script>

<template>
<div id="settingItem">
  <slot></slot>
</div>
</template>

<style scoped>
#settingItem {
  padding: 10px;
  width: 100%;
  min-height: 40px;
  display: flex;
  flex-direction: v-bind(props.direction);
  align-items: center;
  border-radius: 10px;
  border: var(--primaryColor3) solid 2px;
  margin-bottom: 10px;
  transition: background-color linear 0.2s;
}
#settingItem:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>