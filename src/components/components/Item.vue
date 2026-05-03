<script setup lang="ts">
interface Props {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  hoverColor?: string;
  border?: string;
  gap?: string;
}
const props = withDefaults(defineProps<Props>(), {
  direction: "row",
  hoverColor: "rgba(0, 0, 0, 0.05)",
  border: "var(--primaryColor3) solid 2px",
  gap: '0'
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
  gap: v-bind(props.gap);
  align-items: center;
  border-radius: 10px;
  border: v-bind(props.border);
  margin-bottom: 10px;
  transition: background-color linear 0.2s;
}
#settingItem:hover {
  background-color: v-bind(props.hoverColor);
}
</style>