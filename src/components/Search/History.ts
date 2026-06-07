import {Ref} from "vue";
import settingConfig from "@components/Search/manageSettingConfig";
import Tips from "@components/Tips/Tips";

class History {
    public static searchHistories: Ref<string[][]> = settingConfig.getConfig("history");
    public static maxHistory: Ref<number> = settingConfig.getConfig("maxHistory");
    public static showHistory: Ref<number> = settingConfig.getConfig("showHistory");
    public static incognitoMode: Ref<boolean> = settingConfig.getConfig("incognitoMode");
    public static openMethod: Ref<string> = settingConfig.getConfig("openMethod");

    public static tools = [
        {"name": "清空历史记录", "click": History.clearItems}
    ];

    private static writeHistory(): void {
        settingConfig.setConfig(History.searchHistories.value, "history");
        settingConfig.writeConfig();
    }

    public static addItem(query: string, url: string): void {
        if (History.incognitoMode.value) return;  /* 无痕模式下不记录 */
        History.searchHistories.value.unshift([query, url]);
        if (History.searchHistories.value.length >= History.maxHistory.value) {
            History.searchHistories.value = History.searchHistories.value.slice(0, History.maxHistory.value);
        }
        History.writeHistory();
    }

    public static deleteItem(index: number, tip: boolean = true): void {
        History.searchHistories.value.splice(index, 1);
        History.writeHistory();

        if (tip) Tips.addTip({type: 'succeed', text: '删除成功', time: 1000})
    }

    public static clearItems(tip: boolean = true): void {
        History.searchHistories.value = [];
        History.writeHistory();
        if (tip) Tips.addTip({type: 'succeed', text: `删除全部历史记录 ×${History.searchHistories.value.length}条`, time: 1000})
    }

    public static visibleHistory(): string[][] {
        return History.searchHistories.value.slice(0, History.showHistory.value);
    }

    public static openURL(url: string): void {
        window.open(url, History.openMethod.value);
    }

    public static changeMethod(): void {
        History.openMethod.value = History.openMethod.value === "_self" ? "_blank" : "_self";
        settingConfig.setConfig(History.openMethod.value, "openMethod");
        settingConfig.writeConfig();
    };
}

export default History;