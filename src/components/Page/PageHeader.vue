<script lang="ts" setup>
import {Ref, ref, inject} from "vue";
import LinkButton from "./LinkButton.vue";
import wishes from "@assets/json/wishSentence.json";
import manageUserConfig from "@utils/manageUserConfig";
type website = {"ico": string, "name": string, "url": string}[];

// 从响应式配置中获取值
const userName = manageUserConfig.getConfig("userName");
const defaultWebsite = manageUserConfig.getConfig("defaultWebsite");

let theTime: Ref = ref("");
let wishSentence: Ref = ref("");

(()=>{
  /* 隔离变量 */
  class Time {
    private static readonly timeData: [
      startTime: number,
      endTime: number,
      name: string,
      wish: string[]
    ][] = [
      [3, 5, "凌晨", wishes["凌晨"]],
      [6, 7, "清晨", wishes["清晨"]],
      [8, 9, "早晨", wishes["早晨"]],
      [10, 11, "上午", wishes["上午"]],
      [12, 14, "中午", wishes["中午"]],
      [15, 17, "下午", wishes["下午"]],
      [18, 19, "傍晚", wishes["傍晚"]],
      [20, 23, "晚上", wishes["晚上"]],
      [0, 2, "深夜", wishes["深夜"]]
    ];
    private static readonly theDate = new Date();

    public static currentTime() {
      const hours = this.theDate.getHours();
      for (const [start, end, name] of this.timeData) {
        if (start <= hours && end >= hours) {
          return name;
        }
      }
    }

    public static giveWish() {
      const hours = this.theDate.getHours();
      for (const [start, end, _, wish] of this.timeData) {
        if (start <= hours && end >= hours) {
          return wish[Math.floor(Math.random() * wish.length)];
        }
      }
    }
  }
  theTime.value = Time.currentTime();
  wishSentence.value = Time.giveWish();
  setInterval(() => {
    theTime.value = Time.currentTime()
    wishSentence.value = Time.giveWish();
  }, 5000);
})()
const changeSetting = <Function>inject("changeSetting");
</script>

<template>
  <header class="pageHead">
    <h1 class="pageTitle"><strong>{{ theTime }}好，{{ userName }}</strong></h1>
    <h4 class="wishSentence">{{ wishSentence }}</h4>

    <div class="floatingBar">
      <LinkButton
          v-for="(item, index) in defaultWebsite"
          :key="index"
          :img-ico="item.ico"
          :target-name="item.name"
          :target-url="item.url"
          :title="item.name"/>
    </div>

    <div class="openSetting" @click="changeSetting()">
      <img width="36px" height="36px" src="@assets/images/openSetting.svg" alt="设置">
    </div>
    <hr/>
  </header>
</template>

<style scoped>
  .pageHead {
    padding: 10px;
    user-select: none;
    position: relative;
    width: 100%;
  }

  .floatingBar {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 5px 0;
    padding: 5px;
  }

  .floatingBar > * {
    margin-left: 3px;
  }

  .pageTitle {
    position: relative;
    color: var(--textColor1);
    margin: 5px 0;
    font-size: 60px;
  }

  .wishSentence {
    position: relative;
    display: inline;
    color: var(--textColor3);
    right: 0;
  }

  @keyframes spin {
    from {transform: rotateZ(0deg);}
    to {transform: rotateZ(360deg);}
  }
  
  .openSetting {
    --size: 36px;
    --gap: 5px;
    position: absolute;
    right: calc(var(--size) / 2 + var(--gap));
    top: var(--gap);
    z-index: 2000;
    width: var(--size);
    height: var(--size);
  }

  .openSetting > img {
    pointer-events: none;
  }

  .openSetting:hover {
    animation: spin 2s infinite linear;
  }
</style>