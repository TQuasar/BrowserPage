<script lang="ts" setup>
interface Props {
  imgIco: string;
  targetName: string;
  targetUrl: string;
}

const props = defineProps<Props>();
const openWindow = (url: string) => {
  window.open(url);
};
</script>

<template>
  <div class="linkBox">
    <img class="linkIco" alt="图像" :src="imgIco" width="16" height="16"/>
    <span class="linkText" @click="openWindow(targetUrl)">{{ targetName }}</span>
  </div>
</template>

<style scoped>
  .linkBox {
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: background-color ease 0.2s;
    border-radius: 3px;
    padding: 3px;
    cursor: pointer;
  }

  .linkBox:hover {
    background-color: var(--buttonColor4);
  }

  .linkIco {
    margin-right: 2px;
    pointer-events: none;
  }

  .linkText {
    width: 75px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--textColor1);
    text-decoration: none;
    font-size: 12px;
  }

  .linkText:hover {
    color: var(--textColor2);
  }

  .linkText:focus {
    color: var(--textColor3);
  }
</style>