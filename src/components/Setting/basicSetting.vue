<script setup lang="ts">
import {ref} from "vue";
import manageUserConfig from "@utils/manageUserConfig";

import Text from "@components/components/Text.vue";
import Item from "@components/components/Item.vue";
import Input from "@components/components/Input.vue";
import List from "@components/components/List.vue";
import rawConfig from "@utils/rawConfig";
import Button from "@components/components/Button.vue";
import requestURL from "@utils/requestPage.js";
import Tips from "@components/Tips/Tips";

const props = defineProps<{settingTools: Function}>();
const configs = new rawConfig(manageUserConfig);

configs.loadConfig("userName", "userName");
configs.loadConfig("defaultWebsite", "defaultWebsite");

props.settingTools(manageUserConfig, configs, [
  {"path": ["userName"], "name": "userName"},
  {"path": ["defaultWebsite"], "name": "defaultWebsite"}
]);

const newWebsite = ref("");
const addWebsite = async () => {
  const loadingTip = Tips.addTip({"type": "loading", "text": `加载来源于${newWebsite.value}的页面`, "time": null});
  try {
    new URL(newWebsite.value);
    const data = await requestURL(newWebsite.value);
    manageUserConfig.getConfig('defaultWebsite').value.push(data);
    newWebsite.value = "";

    Tips.addTip({"type": "succeed", "text": `加载成功, ${data.name}`, "time": 2000})
  } catch (e) {
    Tips.addTip({"type": "error", "text": "加载失败，无效的URL地址", "time": 1000})
  }
  Tips.deleteTip(loadingTip);
}

const defaultWebsite = <{name: string, ico: string, url: string}[]>manageUserConfig.getConfig('defaultWebsite').value;
</script>

<template>
  <Item>
    <Text text="用户名" userSelect="none"/>
    <Input v-model="manageUserConfig.getConfig('userName').value" :maxlength="10" width="200px"/>
  </Item>
  <Item direction="column">
    <List
        order="no"
        title="快捷方式"
        :items="defaultWebsite"
        v-slot="props"
    >
      <Button
          title="删除此条目"
          type="danger"
          circle
          width="20px"
          height="20px"
          padding="0"
          @click="defaultWebsite.splice(props.index, 1);Tips.addTip({'type': 'succeed', 'text': `成功删除条目 ${props.item.name}`, 'time': 1500})"
      >一</Button>
      <br>
      <Text text="名称"/><Input
        :model-value="props.item.name"
        @change="value => manageUserConfig.setConfig(value, 'defaultWebsite', props.index, 'name')"
      />
      <br>
      <Text text="图标"/><Input
        :model-value="props.item.ico"
        @change="value => manageUserConfig.setConfig(value, 'defaultWebsite', props.index, 'ico')"
      />
      <br>
      <Text text="地址"/><Input
        :model-value="props.item.url"
        @change="value => manageUserConfig.setConfig(value, 'defaultWebsite', props.index, 'url')"
      />
    </List>
    <Item hoverColor="rgba(0,0,0,0)" gap="10px" border="none">
      <Button title="添加新条目" type="info" @click="addWebsite" circle>十</Button>
      <Text text="新条目地址: "/>
      <Input placeholder="输入目标网址" :model-value="newWebsite" width="60%" @change="(value) => newWebsite = String(value)" />
    </Item>
  </Item>
</template>

<style>

</style>