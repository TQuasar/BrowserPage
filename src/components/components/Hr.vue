<script lang="ts" setup>
interface Props {
  width?: string
}

const props = defineProps<Props>()
</script>

<template>
  <hr :style="{ width: props.width ?? 95 + '%' }"/>
</template>

<style scoped>
hr {
  height: 2px;
  display: block;
  background-color: var(--primaryColor5);
  margin: 10px 0;
  border: none;
}
</style>