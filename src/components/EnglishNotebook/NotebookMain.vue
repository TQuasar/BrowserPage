<script setup lang="ts">
import { defineProps, type Component } from "vue";

type Page = {
  id: number;
  title: string;
  content: string;
  component: Component;
};

const props = defineProps<{ page: Page }>();
</script>

<template>
  <main class="notebook-main">
    <keep-alive>
      <component :is="props.page.component" :page="props.page" :key="props.page.id" />
    </keep-alive>
  </main>
</template>

<style scoped>
.notebook-main {
  flex: 1;
  width: 100%;
  overflow: auto;
  padding: 16px;
  box-sizing: border-box;
  background-color: #f9f5e7;
}
</style>