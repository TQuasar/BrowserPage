<script lang="ts" setup>
import Hr from "@components/components/Hr.vue";
import manageUserConfig from "@utils/manageUserConfig";
import {defineAsyncComponent, reactive, Ref, ref, shallowRef} from "vue";
import Button from "@components/components/Button.vue";
import manageConfig from "@utils/manageConfig";
import rawConfig from "@utils/rawConfig";
import Tips from "@components/Tips/Tips";

interface Props {
  openSetting: boolean;
}
const props = defineProps<Props>();

const loadedSettings: Ref = ref({});
const dynamicComponents: Ref = shallowRef({});
(async () => {
  async function loadSetting(name: string, icon: string, langZh: string, settingPath: string) {
    loadedSettings.value[name] = {
      "icon": icon,
      "langZh": langZh,
    };
    dynamicComponents.value[name] = defineAsyncComponent(() => import(settingPath));
  }

  type extensions = {[extension: string]: {path: string, setting: string, icon: string, languageZh: string}}
  await loadSetting("Basic", "src/assets/images/openSetting.svg", "基本设置", "./basicSetting.vue")
  for (const [key, value] of Object.entries(<extensions>manageUserConfig.getConfig("extensions").value)) {
    const strKey = <string>key;
    await loadSetting(
        strKey,
        manageUserConfig.getConfig("extensions", strKey, "icon").value,
        manageUserConfig.getConfig("extensions", strKey, "languageZh").value,
        value.setting
    );
  }
  await loadSetting("develop", "src/assets/images/develop.svg", "关于开发", "./develop.vue")
})();

let panelChoice = ref("Basic");

interface Tools {
  manager: manageConfig | null;
  configs: rawConfig | null
  paramsList: {path: path[], name: string}[] | null,
  success: () => void;
  primary: () => void;
  danger: () => void;
}

const toolFunctions = reactive<Tools>({
  "manager": null,
  "configs": null,
  "paramsList": null,
  "success": () => {
    for (const field of toolFunctions.paramsList!) {
      toolFunctions.manager!.setConfig(toolFunctions.configs!.refConfig(field.name), ...field.path)
    }
    toolFunctions.manager!.writeConfig();
    Tips.addTip({"type": "succeed", "text": "成功保存设置", "time": 1000});
  },
  "primary": () => {
    toolFunctions.manager!.resetConfig();
    toolFunctions.manager!.writeConfig();
    Tips.addTip({"type": "succeed", "text": "成功重置设置", "time": 1000});
  },
  "danger": () => {
    for (const field of toolFunctions.paramsList!) {
      toolFunctions.manager!.setConfig(toolFunctions.configs!.rawConfig(field.name), ...field.path)
    }
    toolFunctions.manager!.writeConfig();
    Tips.addTip({"type": "succeed", "text": "成功取消设置", "time": 1000});
  }
});

/**
 * The function `defineSettingTools` defines a last value and new value for a field.
 * @param manager
 * @param paramsList Field names correspond to [lastValue, newValue]
 */
type path = string | number;
function defineSettingTools(manager: manageConfig, configs: rawConfig, paramsList: {path: path[], name: string}[]) {
  toolFunctions.manager = manager;
  toolFunctions.configs = configs;
  toolFunctions.paramsList = paramsList;
}
</script>

<template>
<div class="settingBox" :data-open="openSetting">
  <header>
    <h1 id="settingTitle">设置</h1>
    <span id="savingTip">下滑点击确认保存设置</span>
  </header>
  <Hr width="100%" style="margin-bottom: 0" />
  <main>
    <nav>
      <div
          v-for="(item, index) in Object.keys(loadedSettings)"
          class="navItem"
          :key="index"
          :data-selected="String(item === panelChoice)"
          @click="panelChoice = item"
      >
        <img :src="loadedSettings[item].icon" alt="" width="28" height="28">
        {{ loadedSettings[item].langZh }}
      </div>
    </nav>
    <div id="settingContent">
      <h1 id="extensionTitle"><img id="icoTitle" :src="loadedSettings[panelChoice].icon" alt="" width="32" height="32"> {{ loadedSettings[panelChoice].langZh }}:</h1>
      <component
          :is="dynamicComponents[panelChoice]"
          :settingTools="defineSettingTools"
      />
      <!-- TODO: 简化按钮逻辑并传递函数 -->
      <div id="endingButtons">
        <Button type="success" width="70px" height="30px" @click="toolFunctions.success()">确认</Button>
        <Button type="primary" width="70px" height="30px" @click="toolFunctions.primary()">重置</Button>
        <Button type="danger" width="70px" height="30px" @click="toolFunctions.danger()">取消</Button>
      </div>
    </div>
  </main>
</div>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  padding: 10px;
}
main {
  display: flex;
  height: 100%;
}
#settingTitle {
  margin: 0;
}

#savingTip {
  color: var(--textColor3);
  font-size: 12px;
}

nav {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: clamp(250px, 25%, 300px);
  border-right: 2px solid var(--primaryColor5);
}
.navItem {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: medium;
  padding: 10px 20px;
  border-radius: 0 100px 100px 0;
  transition: background-color ease 0.2s;
}
.navItem:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
.navItem[data-selected="true"] {
  background-color: var(--primaryColor2);
  box-sizing: border-box;
  border: var(--functionColor1) solid 2px;
  border-left-width: 0;
}
.navItem > img {
  filter: brightness(0);
}

.settingBox {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1000;
  top: 0;
  left: 0;
  transform: translateX(100%);
  background-color: var(--settingColor1);
  backdrop-filter: blur(15px);
  user-select: none;
  transition: transform ease 0.4s;
}
.settingBox[data-open="true"] {
  transform: translateX(0);
}

#settingContent {
  padding: 100px;
  overflow-y: scroll;
  flex-grow: 1;
}

#extensionTitle {
  display: flex;
  align-items: center;
  gap: 10px;
}

#icoTitle {
  pointer-events: none;
  filter: brightness(0);
}

#endingButtons {
  margin-top: 40px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>