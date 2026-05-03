<script setup lang="ts">
import Tips from "@components/Tips/Tips";
</script>

<template>
<div id="tipsBox">
  <div
      class="tipItem"
      v-for="(item, index) in Object.values(Tips.tipList)"
      :data-end="item.end"
      :key="index"
  >
    <img :src="`/src/assets/images/tipIcons/${item.type}.svg`" width="16" height="16" alt="">
    <span>{{ item.text }}</span>
  </div>
</div>
</template>

<style scoped>
#tipsBox {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
  z-index: 10000;
  top: 0;
  left: 0;
  padding: 10px;
  margin: 0;
  width: 100vw;
  height: 100vh;
}

.tipItem {
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: small;
  padding: 5px 15px;
  border-radius: 5px;
  transition: transform ease 0.2s;
  animation: fade-in 0.2s;
}
.tipItem[data-end=true] {
  animation: fade-out 0.25s;  /* 多一点防止时间不够导致又跳回来 */
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fade-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-100%);
  }
}
</style>