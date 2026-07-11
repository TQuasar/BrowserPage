<script setup lang="ts">
import Hr from "@components/components/Hr.vue";
import Item from "@components/components/Item.vue";
import Li from "@components/components/Li.vue";
import Text from "@components/components/Text.vue";
import Input from "@components/components/Input.vue";

interface Props {
  title?: string | boolean | undefined,
  order?: "in" | "out" | "no",
  compact?: boolean,
  items: any[]
}
const props = withDefaults(defineProps<Props>(), {
  title: false,
  order: "out",
  compact: false
});
</script>

<template>
  <div class="settingList">
    <div v-if="Boolean(title)">
      <span style="font-weight: bold;font-size: 24px">{{ title }}</span>
      <Hr/>
    </div>
    <Li
        v-for="(item, index) in items"
        :key="index"
        :order="props.order"
        :compact="props.compact"
    ><slot :item="item" :index="index"></slot></Li>
  </div>
</template>

<style scoped>
.settingList {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: 15px;
}
</style>