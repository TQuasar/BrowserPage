<script setup lang="ts">
import settingConfig from "@components/Search/manageSettingConfig";
import rawConfig from "@utils/rawConfig";
import List from "@components/components/List.vue";
import Item from "@components/components/Item.vue";
import Text from "@components/components/Text.vue";
import Input from "@components/components/Input.vue";
import Switch from "@components/components/Switch.vue";
import Tips from "@components/Tips/Tips";
import Button from "@components/components/Button.vue";
import {Ref} from "vue";
import Group from "@components/components/Group.vue";

const props = defineProps<{ settingTools: Function }>();
const configs = new rawConfig(settingConfig);

configs.loadConfig("defaultEngine", "defaultEngine");
configs.loadConfig("engines", "engines");
configs.loadConfig("maxHistory", "maxHistory");
configs.loadConfig("showHistory", "showHistory");
configs.loadConfig("history", "history");
configs.loadConfig("navigation", "navigation");

props.settingTools(settingConfig, configs, [
  {"path": ["defaultEngine"], "name": "defaultEngine"},
  {"path": ["engines"], "name": "engines"},
  {"path": ["maxHistory"], "name": "maxHistory"},
  {"path": ["showHistory"], "name": "showHistory"},
  {"path": ["history"], "name": "history"},
  {"path": ["navigation"], "name": "navigation"},
]);

const engines = <Ref<[]>>settingConfig.getConfig('engines');

type path = string | number;

function saveNumber(value: any, min: number = 0, max: number = Infinity, ...paths: path[]) {
  value = Number(value);
  if (isNaN(value)) {
    Tips.addTip({type: "warn", text: "输入值必须是有效数字", time: 1500});
    value = 0;
  }
  if (value < min || value > max) {
    value = value < min ? min : value > max ? max : value;
    Tips.addTip({type: "info", text: `输入值必须在 ${min} ~ ${max} 之间`, time: 1500});
  }
  settingConfig.setConfig(value, ...paths)
}

const history: Ref<[string, string][]> = settingConfig.getConfig("history");
</script>

<template>
  <!-- 设置搜索引擎 -->
  <Item>
    <List order="no" title="搜索引擎" :items="engines" v-slot="props">
      <Button
          title="删除此搜索引擎"
          type="danger"
          circle
          width="20px"
          height="20px"
          padding="0"
          v-if="engines.length > 1"
          @click="
          engines.splice(props.index, 1);
          Tips.addTip({'type': 'succeed', 'text': `成功删除搜索引擎 ${props.item.name}`, 'time': 1500});
        "
      >一
      </Button>
      <br>
      <Text text="名称"/>
      <Input
          :model-value="props.item.name"
          @change="value => {
        settingConfig.setConfig(value, 'engines', props.index, 'name');
        settingConfig.setConfig(value, 'defaultEngine');
      }"
      /><br>
      <Text text="图标"/>
      <Input
          :model-value="props.item.icon"
          @change="value => settingConfig.setConfig(value, 'engines', props.index, 'icon')"
      /><br>
      <Text text="地址"/>
      <Input
          :model-value="props.item.url"
          @change="value => settingConfig.setConfig(value, 'engines', props.index, 'url')"
      /><br>
      <Text text="启用"/>
      <Switch
          :model-value="settingConfig.getConfig('defaultEngine').value === props.item.name"
          @click="settingConfig.setConfig(props.item.name, 'defaultEngine')"
      />
    </List>
  </Item>
  <!-- 历史记录数量 -->
  <Item>
    <div>
      <Text text="最大历史记录数"/>
      <Input
          :model-value="settingConfig.getConfig('maxHistory').value"
          @blur="event => saveNumber((<any>event.target).value, 10, 500, 'maxHistory')"
      />
    </div>
    <div>
      <Text text="显示历史记录数"/>
      <Input
          :model-value="settingConfig.getConfig('showHistory').value"
          @blur="event => saveNumber((<any>event.target).value, 0 , 20, 'showHistory')"
      />
    </div>
  </Item>
  <!-- 快捷导航栏 -->
  <Item>
    <List :items="settingConfig.getConfig('navigation').value" order="no" title="快捷导航栏" v-slot="boxProps">
      <Group :name="boxProps.item[0]" fold>
        <List :items="boxProps.item[1]" order="no" v-slot="itemProps">
          <Text text="名称"/><Input :model-value="itemProps.item[0]"/><br>
          <Text text="地址"/><Input :model-value="itemProps.item[1]"/><br>
          <Text text="图标"/><Input :model-value="itemProps.item[2]"/><br>
        </List>
      </Group>
    </List>
  </Item>
  <!-- 所有历史记录 -->
  <Item>
    <Group :name="`全部历史记录 ×${history.length}`" fold>
      <List :items="history" v-slot="props">
        <!-- TODO:增加跳转到目标地址功能 -->
        <Text class="historyContent" :text="props.item[0]"/>
        <Text :text="props.item[1]" color="#9E9E9E" size="10px"/>
      </List>
    </Group>
  </Item>
</template>

<style>
.historyContent {
  margin-right: 10px;
}
</style>