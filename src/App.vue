<script lang="ts" setup>
import {provide, ref, Ref} from "vue";
import PageBox from "@components/Page/PageBox.vue";
import Setting from "@components/Setting/Setting.vue";

const openSetting: Ref<boolean> = ref(true);

document.addEventListener('mousedown', (e) => {
  if (e.button !== 0) e.preventDefault();
})
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
})

/* 修改开启设置的状态 */
provide("changeSetting", () => openSetting.value = !openSetting.value);

</script>

<template>
  <div class="app">
    <Setting :open-setting="openSetting"/>
    <PageBox/>
  </div>
</template>

<style>
:root {
  --primaryColor1: #F1F8E9;
  --primaryColor2: #E8F5E9;
  --primaryColor3: #b6d5b8;
  --primaryColor4: #A5D6A7;
  --primaryColor5: #81C784;

  --settingColor1: rgb(223 236 223 / 0.8);

  --textColor1: #212121;
  --textColor2: #424242;
  --textColor3: #616161;
  --textColor4: #757575;
  --textColor5: #9E9E9E;
  --textColor6: #BDBDBD;
  --textColor7: #4CAF50;

  --buttonColor1: #A5D6A7;
  --buttonColor2: #81C784;
  --buttonColor3: #66BB6A;
  --buttonColor4: #E8F5E9;

  --functionColor1: #66BB6A;
  --functionColor2: #FFB74D;
  --functionColor3: #EF5350;
  --functionColor4: #42A5F5;
  --functionColor5: #0288D1;
  --functionColor6: #BA68C8;
  --functionColor7: #FFF176;
  --functionColor8: #BDBDBD;

  --linkColor: #4007a2;
  --linkColorHover: #6618e8;
  --linkColorFocus: #3e0a93;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: var(--primaryColor1);
}

.app {
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

img {
  user-select: none;
}
</style>
<style>
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  display: none;
}

::-webkit-scrollbar-thumb {
  display: none;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>