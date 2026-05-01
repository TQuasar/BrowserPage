<script lang="ts" setup>
import {ref} from "vue";

interface Props {
  name: string,
  fold: boolean
}

const props = defineProps<Props>();
const isFold = ref(props.fold);
</script>

<template>
<div class="settingGroup">
  <div class="title">
    <h1>{{ name }}</h1>
    <div class="folder" @click="isFold = !isFold" :data-fold="String(isFold)">
      <img width="24" height="24" src="../../assets/images/folderButton.svg" alt="展开">
    </div>
  </div>
  <hr/>
  <div class="content" v-if="isFold">
    <slot></slot>
  </div>
</div>
</template>

<style scoped>
h1 {
  margin-bottom: 0;
  color: var(--textColor7);
  display: inline-block;
  user-select: none;
}

hr {
  width: 95%;
  height: 2px;
  background-color: var(--primaryColor5);
  margin: 5px 0;
  border: none;
}

.folder {
  display: inline-block;
  margin-left: 10px;
  transform: scaleY(-1);
  transition: filter, transform ease 0.2s;
}

.folder:hover {
  filter: brightness(110%);
}

.folder[data-fold="true"] {
  transform: scaleY(1);
}

.content > * {
  margin-left: 30px;
}
</style>