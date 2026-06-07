<script setup lang="ts">
import {ref, defineAsyncComponent, Ref} from "vue";
import manageUserConfig from "@utils/manageUserConfig";

const extensions: Ref<{
  [name: string]: {
    path: string,
    setting: string,
    icon: string,
    languageZh: string
  }
}> = manageUserConfig.getConfig("extensions");

const loadedComponents: any[] = [];
/* 动态加载组件 */
for (const [_, extension] of Object.entries(extensions.value)) {
  const load = defineAsyncComponent(async () => import(extension.path));
  loadedComponents.push(load);
}
</script>

<template>
  <div class="pageBody">
    <component
      v-for="(component, index) in loadedComponents"
      :key="index"
      :is="component"
    ></component>
  </div>
</template>

<style scoped>
.pageBody {
  padding: 10px;
}

.pageBody > * {
  margin-bottom: 15px;
}
</style>