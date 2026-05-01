<script setup lang="ts">
import {Ref} from "vue";
import manageUserConfig from "@utils/manageUserConfig";

import Text from "@components/components/Text.vue";
import Item from "@components/components/Item.vue";
import Input from "@components/components/Input.vue";
import List from "@components/components/List.vue";
import rawConfig from "@utils/rawConfig";
import Button from "@components/components/Button.vue";
import requestURL from "@utils/requestPage.js";

const props = defineProps<{settingTools: Function}>();
const configs = new rawConfig(manageUserConfig);

configs.loadConfig("userName", "userName");
configs.loadConfig("defaultWebsite", "defaultWebsite");
configs.loadConfig("extensions", "extensions");

props.settingTools(manageUserConfig, configs, [
  {"path": ["userName"], "name": "userName"},
  {"path": ["defaultWebsite"], "name": "defaultWebsite"},
  {"path": ["extensions"], "name": "extensions"},
]);

const addWebsite = async () => {
  const url = window.prompt("输入网址");
  const data = await requestURL(url);
  configs.refConfig("defaultWebsite").value.push(data);
}
</script>

<template>
  <Item>
    <Text text="用户名" userSelect="none"/>
    <Input v-model="configs.refConfig('userName').value" :maxlength="10" width="200px"/>
  </Item>
  <Item direction="column">
    <List title="快捷方式" :items="<{name: string, ico: string, url: string}[]>configs.refConfig('defaultWebsite').value" dynamic v-slot="props">
      <br>
      <Text text="名称"/><Input
        :model-value="props.item.name"
        @blur="(e) => {manageUserConfig.setConfig(e.target?.value, 'defaultWebsite', props.index, 'name')}"
      />
      <br>
      <Text text="图标"/><Input
        :model-value="props.item.ico"
        @blur="(e) => {manageUserConfig.setConfig(e.target?.value, 'defaultWebsite', props.index, 'ico')}"
      />
      <br>
      <Text text="地址"/><Input
        :model-value="props.item.url"
        @blur="(e) => {manageUserConfig.setConfig(e.target?.value, 'defaultWebsite', props.index, 'url')}"
      />
    </List>
    <Button type="info" @click="addWebsite">添加</Button>
  </Item>
</template>

<style>

</style>