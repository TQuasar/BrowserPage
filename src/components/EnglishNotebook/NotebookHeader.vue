<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

type Page = { id: number; title: string; content: string };

const props = defineProps<{ pages: Page[]; currentPageId: number }>();
const emit = defineEmits<{
  (e: "select-page", pageId: number): void;
  (e: "delete-page", pageId: number): void;
}>();

const handleSelect = (pageId: number) => {
  emit("select-page", pageId);
};

const handleDelete = (pageId: number) => {
  emit("delete-page", pageId);
};
</script>

<template>
  <header class="notebook-header">
    <div class="page-tabs">
      <div
        v-for="page in props.pages"
        :key="page.id"
        class="header-container"
        :class="{ active: page.id === props.currentPageId }"
        @click="handleSelect(page.id)"
        :title="page.title"
      >
        <span class="header-title">{{ page.title }}</span>
        <button
          class="header-clear"
          type="button"
          @click.stop="handleDelete(page.id)"
          title="删除此页"
        >
          ×
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.notebook-header {
  min-height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d8d0b0;
  background-color: #fffee4;
  padding: 6px 8px;
  box-sizing: border-box;
}

.page-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  flex: 1;
  align-items: center;
}

.header-container {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  min-width: 80px;
  max-width: 160px;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: 8px;
  background-color: #fff8d6;
  user-select: none;
  cursor: pointer;
}

.header-container.active {
  background-color: #e7e0a8;
  border-color: #d3cc8b;
}

.header-title {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-clear {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: #888;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

.header-clear:hover {
  color: #f05050;
}
</style>