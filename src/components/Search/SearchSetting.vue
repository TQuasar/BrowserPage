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
import {ref, Ref} from "vue";
import Group from "@components/components/Group.vue";
import requestPage from "@utils/requestPage";
import History from "@components/Search/History";

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
const newEngineURL = ref("");
const newEngineTarget = ref("");
async function addEngine() {
  const loadingTip = Tips.addTip({"type": "loading", "text": `添加来源于${newEngineURL.value}的引擎`, "time": null});
  try {
    new URL(newEngineURL.value);
    const data = await requestPage(newEngineURL.value);
    settingConfig.getConfig("engines").value.push({name: data.name, url: newEngineTarget.value, icon: data.ico});

    newEngineURL.value = "";
    newEngineTarget.value = "";
    Tips.addTip({"type": "succeed", "text": `加载成功, ${data.name}`, "time": 2000})
  } catch (e) {
    Tips.addTip({"type": "error", "text": "加载失败，无效的URL地址", "time": 1000})
  }
  Tips.deleteTip(loadingTip);
}

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

const shortcutURL = ref("");
async function addShortcut(index: number) {
  const loadingTip = Tips.addTip({"type": "loading", "text": `添加来源于${shortcutURL.value}的快捷方式`, "time": null});
  try {
    new URL(shortcutURL.value);
    const data = await requestPage(shortcutURL.value);
    settingConfig.getConfig("navigation").value[index][1].push([data.name, data.url, data.ico]);

    shortcutURL.value = "";
    Tips.addTip({"type": "succeed", "text": `加载成功, ${data.name}`, "time": 2000})
  } catch (e) {
    Tips.addTip({"type": "error", "text": "加载失败，无效的URL地址", "time": 1000})
  }
  Tips.deleteTip(loadingTip);
}

const newItemName = ref("");
function addItem() {
  settingConfig.getConfig("navigation").value.push([newItemName.value, []]);
  newItemName.value = "";
}
</script>

<template>
  <!-- 设置搜索引擎 -->
  <Item direction="column">
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
    <div style="width: 100%">
      <Button title="添加新搜索引擎" type="info" circle width="30px" height="30px" padding="0" @click="addEngine">十</Button>
      <br>
      <Text size="10px" color="#333" text="(查询方式: 即查询内容后跳转的网址，用${query}表示输入的内容，例如查询'TQuasar'时search?q=${query}的值就是search?q=TQuasar)"/>
      <br>
      <Text text="新搜索引擎网址: "/>
      <Input placeholder="输入目标网址" :model-value="newEngineURL" width="80%" @change="(value) => newEngineURL = String(value)" />
      <br>
      <Text text="查询方式: "/>
      <Input placeholder="输入目标网址" :model-value="newEngineTarget" width="80%" @change="(value) => newEngineTarget = String(value)" />
    </div>
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
  <Item direction="column">
    <List :items="settingConfig.getConfig('navigation').value" order="no" title="快捷导航栏" v-slot="boxProps">
      <Group :name="boxProps.item[0]" fold>
        <List :items="boxProps.item[1]" order="no" v-slot="itemProps">
          <Button
              title="删除此搜索引擎"
              type="danger"
              circle
              width="20px"
              height="20px"
              padding="0"
              v-if="engines.length > 1"
          >一
          </Button><br>
          <Text text="名称"/><Input :model-value="itemProps.item[0]" @change="value => itemProps.item[0] = value"/><br>
          <Text text="地址"/><Input :model-value="itemProps.item[1]" @change="value => itemProps.item[1] = value"/><br>
          <Text text="图标"/><Input :model-value="itemProps.item[2]" @change="value => itemProps.item[2] = value"/><br>
        </List>
        <!-- 添加快捷方式 -->
        <Item hoverColor="rgba(0,0,0,0)" gap="10px" border="none">
          <Button title="添加新快捷方式" type="info" @click="() => addShortcut(boxProps.index)" circle width="30px" height="30px" padding="0">十</Button>
          <Text text="新快捷方式地址: "/>
          <Input placeholder="输入目标网址" :model-value="shortcutURL" width="60%" @change="(value) => shortcutURL = String(value)" />
        </Item>
      </Group>
    </List>
    <!-- 添加条目 -->
    <Item hoverColor="rgba(0,0,0,0)" gap="10px" border="none">
      <Button title="添加新条目" type="info" @click="addItem" circle width="30px" height="30px" padding="0">十</Button>
      <Text text="新条目名称: "/>
      <Input placeholder="输入条目名称" :model-value="newItemName" width="60%" @change="(value) => newItemName = String(value)" />
    </Item>
  </Item>
  <!-- 所有历史记录 -->
  <Item>
    <Group :name="`全部历史记录 ×${history.length} / ${History.maxHistory.value}`" fold>
      <Button
          title="全部删除"
          type="danger"
          @click="History.clearItems()"
      >全部删除
      </Button>
      <List :items="history" v-slot="props" order="no">
        <Button
            title="删除"
            type="warning"
            circle
            width="10px"
            height="10px"
            padding="0"
            style="margin-right: 5px;font-size: 12px"
            @click="History.deleteItem(props.index)"
        >×
        </Button>
        <span @click="History.openURL(props.item[1])">
          <!-- TODO:增加跳转到目标地址功能 -->
          <Text class="historyContent" :text="props.item[0]" size="12px"/>
          <Text :text="props.item[1]" color="#9E9E9E" size="10px"/>
        </span>
      </List>
    </Group>
  </Item>
</template>

<style>
.historyContent {
  margin-right: 10px;
}
</style>