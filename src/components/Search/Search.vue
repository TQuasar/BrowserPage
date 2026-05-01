<script setup lang="ts">
import {computed, Ref, ref} from "vue";
import config from "./Search.config.json";
import settingConfig from "@components/Search/manageSettingConfig";

type engine = {
  name: string
  url: string
  icon: string
}
settingConfig.readConfig();

let incognitoMode: Ref<boolean> = settingConfig.getConfig("incognitoMode");
class History {
  private static searchHistories: Ref<string[][]> = settingConfig.getConfig("--history");
  private static maxHistory: Ref<number> = settingConfig.getConfig("maxHistory");
  private static showHistory: Ref<number> = settingConfig.getConfig("showHistory");

  public static tools = [
    {"name": "清空历史记录", "click": History.clearItems}
  ];

  private static writeHistory() {
    settingConfig.setConfig(History.searchHistories.value, "--history");
    settingConfig.writeConfig();
  }

  public static addItem(query: string, url: string) {
    if (incognitoMode.value) return;  /* 无痕模式下不记录 */
    History.searchHistories.value.unshift([query, url]);
    if (History.searchHistories.value.length >= History.maxHistory.value) {
      History.searchHistories.value = History.searchHistories.value.slice(0, History.maxHistory.value);
    }
    History.writeHistory();
  }

  public static deleteItem(index: number) {
    History.searchHistories.value.splice(index, 1);
    History.writeHistory();
  }

  public static clearItems() {
    History.searchHistories.value = [];
    History.writeHistory();
  }

  public static visibleHistory() {
    return History.searchHistories.value.slice(0, History.showHistory.value);
  }
}

let openMethod: Ref<string> = settingConfig.getConfig("openMethod");
const changeMethod = () => {
  openMethod.value = openMethod.value === "_self" ? "_blank" : "_self";
  settingConfig.setConfig(openMethod.value, "openMethod");
  settingConfig.writeConfig();
};
function openURL(url: string): void {
  window.open(url, openMethod.value);
}
/**
 * The function `getEngine` query information of the engine `name`.
 * @param name the engine name
 */
function getEngine(name: string) {
  for (const engine of config["**engines"]) {
    if (engine.name == name) return engine;
  }
}
/* 当前选择的引擎基本属性 */
const engineData: Ref = ref(getEngine(settingConfig.getConfig("defaultEngine").value));
/**
 * The function `query` searches the `queryText` with search engine
 * @param queryText The searched content
 */
const query = (queryText: string) => {
  try {
    /* TODO: 增添自动检测补全协议部分 */
    new URL(queryText);
    openURL(queryText);
    History.addItem("", queryText);
  } catch (e) {
    const url = engineData.value.url.replace(/\${query}/, queryText)
    openURL(url);
    History.addItem(queryText, url);
  }
};

const bookmarks: Ref<[string, [string, string, string][]][]> = settingConfig.getConfig("**navigation");
/* 当前搜索引擎名 */
let searchEngine = computed(() => engineData.value.name);
/* 点击搜索框 */
let onSearch: Ref = ref(false);
/* 选择搜索引擎面板 */
let openEnginePanel: Ref = ref(false);
/* Searched content */
let queryInput: string = "";
</script>

<template>
  <div class="search">
    <!-- Search box -->
    <div id="searchBox" :data-onSearch="String(onSearch)" :data-incognit="String(incognitoMode)">
      <input
          id="searchInput"
          type="text"
          :data-incognit="String(incognitoMode)"
          autocomplete="off"
          :placeholder="`在 ${searchEngine} 中${incognitoMode ? '无痕搜索' : '搜索'}......`"
          @focus="onSearch = true"
          @blur="onSearch = false"
          @keyup.enter="query(queryInput)"
          v-model="queryInput"
      />

      <div id="enterSearch" class="searchTools" :data-incognit="String(incognitoMode)" title="搜索网页" @click="query(queryInput)">
        <img src="./images/enterSearch.svg" alt="搜索" width="24" height="24"/>
      </div>
      <div id="incognitoMode"
           class="searchTools"
           :data-incognit="String(incognitoMode)"
           title="无痕模式"
           @click="incognitoMode = !incognitoMode;settingConfig.setConfig(incognitoMode, 'incognitoMode');settingConfig.writeConfig();">
        <img src="./images/incognitoMode.svg" alt="无痕模式" height="24" width="24" />
      </div>
      <div id="searchMethod" class="searchTools" :data-incognit="String(incognitoMode)" :title="openMethod === '_self' ? '在当前窗口打开搜索结果' : '在新窗口打开搜索结果'" @click="changeMethod">
        <img v-if="openMethod==='_self'" src="./images/openSelf.svg" alt="无痕模式" height="24" width="24">
        <img v-else src="./images/openBlank.svg" alt="" height="24" width="24">
      </div>
      <div id="searchEngine" class="searchTools" :data-incognit="String(incognitoMode)" :title="`使用 ${searchEngine} 搜索`"
          @click="openEnginePanel = !openEnginePanel;console.log(openEnginePanel)"
          :data-onSearch="String(onSearch)"
      >
        <span><!-- 切换搜索引擎右下角标 --><img id="engineIcon" :src="engineData.icon" alt="" width="16" height="16"></span>
        <img src="./images/searchEngine.svg" alt="引擎" width="24" height="24">
      </div>

      <!-- Search engine panel -->
      <div id="convertEngine" v-if="openEnginePanel">
        <div
            class="engine"
            v-for="(item, index) in settingConfig.getConfig('**engines').value"
            :key="index"
            @click="
              settingConfig.setConfig(item.name, 'defaultEngine');
              settingConfig.writeConfig();
              engineData = getEngine(item.name);
            "
        >
          <img :src="item.icon" :alt="item.name" width="16" height="16" />
          <span>{{ item.name }}</span>
          <svg v-if="item.name === searchEngine" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12l5 5 9-9" stroke="green" stroke-width="2" fill="none" stroke-linecap="butt"/>
          </svg>
        </div>
      </div>
    </div>
    <!-- History -->
    <div id="searchHistories" :data-incognit="String(incognitoMode)" v-if="onSearch" @mousedown.prevent @click.prevent>
      <!-- Record items -->
      <div
          class="history"
          v-for="(item, index) in History.visibleHistory()"
          :key="index"
      >
        <img src="./images/enterSearch.svg" alt="" width="16" height="16">
        <span class="historyItemContent" @click="openURL(item[1])">
          <span class="historyItemName" :data-incognit="String(incognitoMode)">{{ item[0] }}</span>
          <span class="historyItemURL">{{ item[1] }}</span>
        </span>

        <span class="deleteHistory" :data-incognit="String(incognitoMode)" @click="History.deleteItem(index)">删除</span>
      </div>
      <!-- Tools bar -->
      <div id="historyTool">
        <span
            v-for="(item, index) in History.tools"
            :title="item.name"
            :key="index"
            @click="item.click()"
        >{{ item.name }}</span>
      </div>
    </div>
    <!-- Bookmarks -->
    <div id="bookmarks">
      <div
          class="bookmarkBox"
          v-for="(mark, markIndex) in bookmarks"
          :key="`item-${markIndex}`"
      >
        <span>{{ mark[0] }}:</span>
        <div class="bookmarkTools"><span
            v-for="(item, index) in mark[1]"
            :key="index"
            @click="openURL(item[1])"
            :title="item[1]"
        >
          <img :src="item[2]" alt="" width="12" height="12">
          <span>{{ item[0] }}</span>
        </span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search {
  --boxHeight: 40px;
  --inputHeight: 30px;
  --historyItemHeight: 35px;
  --halfBoxHeight: calc(var(--boxHeight) / 2);
  --gap: calc((var(--boxHeight) - var(--inputHeight)) / 2);
  --borderColor: #42A5F5;
  --backgroundColor: #fff;
  --backgroundDark: #333;
  --bookmarksBorder: #ddd;
  --searchWidth: 75%;

  position: relative;
}
#searchBox {
  display: flex;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--backgroundColor);
  border: solid var(--borderColor) 2px;
  border-radius: var(--boxHeight);
  height: var(--boxHeight);
  align-items: center;
  width: var(--searchWidth);
  transition: background-color ease 0.2s;
}
#searchBox[data-onSearch="true"] {
  border-radius: var(--halfBoxHeight) var(--halfBoxHeight) 0 0;
}
#searchBox[data-incognit="true"] {
  background-color: var(--backgroundDark);
}

#searchInput {
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: var(--inputHeight);
  margin: var(--gap);
  padding: 0;
  font-size: small;
  flex-grow: 1;
}
#searchInput[data-incognit="true"] {
  color: var(--textColor6);
}
#searchInput:focus {
  outline: none;
}

.searchTools {
  position: relative;
  display: inline-block;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 5px;
  height: 100%;
  aspect-ratio: 1 / 1;
  transition: background-color ease 0.2s;
}
#searchEngine {
  border-top-right-radius: var(--boxHeight);
  border-bottom-right-radius: var(--boxHeight);
}
#searchEngine[data-onSearch="true"] {
  border-top-right-radius: var(--halfBoxHeight);
  border-bottom-right-radius: 0;
}
.searchTools > img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.searchTools:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);
}
.searchTools[data-incognit="true"]:hover {
  background-color: rgb(255, 255, 255, 0.2);
}

#engineIcon {
  position: absolute;
  right: 5px;
  bottom: 5px;
  z-index: 100;
}

#convertEngine {
  display: flex;
  position: absolute;
  flex-direction: column;
  right: -10px;
  background-color: var(--backgroundColor);
  border-radius: 5px;
  border: var(--borderColor) solid 2px;
  transform: translate(100%, 50%);
}

.engine {
  display: flex;
  align-items: center;
  user-select: none;
  border-radius: 5px;
  padding: 5px;
  height: 16px;
  transition: background-color ease 0.2s;
}
.engine:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
.engine > * {
  margin-right: 3px;
}
.engine > span {
  font-size: 14px;
  color: var(--textColor2);
}

img {
  pointer-events: none;
  user-select: none;
}
</style><!-- Search box -->
<style scoped>
#searchHistories {
  position: absolute;
  left: 50%;
  width: var(--searchWidth);
  transform: translateX(-50%);
  background-color: var(--backgroundColor);
  border: solid var(--borderColor) 2px;
  border-top: none;
  border-radius: 0 0 var(--halfBoxHeight) var(--halfBoxHeight);
  z-index: 10;
}
#searchHistories[data-incognit="true"] {
  background-color: var(--backgroundDark);
}

.history, #historyTool {
  display: flex;
  align-items: center;
  height: var(--historyItemHeight);
  box-sizing: border-box;
  padding: 8px;
  font-size: small;
  transition: background-color ease 0.2s;
  border-radius: var(--boxHeight);
  cursor: pointer;
}
.history:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
.history > img {
  margin-right: 15px;
}

.deleteHistory {
  position: relative;
  cursor: pointer;
  user-select: none;
  right: 0;
  color: var(--linkColor);
}
.deleteHistory:hover {
  color: var(--linkColorHover);
  text-decoration: underline var(--linkColorHover);
}
.deleteHistory[data-incognit="true"] {
  filter: brightness(250%);
}

.historyItemContent {
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.historyItemURL {
  margin-left: 5px;
  font-size: 10px;
  color: var(--textColor5);
}
.historyItemName[data-incognit="true"] {
  color: var(--textColor6);
}

#historyTool {
  color: var(--textColor4);
  height: var(--inputHeight);
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0 0 var(--halfBoxHeight) var(--halfBoxHeight);
  transition: background-color ease 0.2s;
}
#historyTool:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style><!-- History -->
<style scoped>
#bookmarks {
  position: relative;
  margin-top: 50px;
  width: var(--searchWidth);
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--backgroundColor);
  border: solid var(--bookmarksBorder) 2px;
  border-radius: calc(var(--halfBoxHeight) / 2);
}

.bookmarkBox, .bookmarkTools {
  display: flex;
  flex-wrap: wrap;
}
.bookmarkBox {
  gap: 12px;
}
.bookmarkTools {
  cursor: pointer;
}
.bookmarkBox > span {
  font-weight: bold;
  padding: var(--gap);
  user-select: none;
}
.bookmarkTools > span {
  display: flex;
  align-items: center;
  padding: var(--gap) 15px;
  border-radius: 5px;
  gap: 2px;
  transition: background-color ease 0.2s;
}

.bookmarkTools > span > span {
  font-size: 12px;
}
.bookmarkTools > span:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style><!-- Bookmarks -->