import JSONPath from "@utils/JSONPath";
import {reactive, toRef} from "vue";

type jsonRecord = {
    [key: string]: any;
}
type path = string | number;

class ManageConfig {
    constructor(nameSpace: string, initConfig: object) {
        this.nameSpace = nameSpace;
        this.initConfig = reactive(initConfig);
    }

    private readonly initConfig: object;
    private userConfig: object = reactive({});
    private readonly nameSpace: string;

    public readConfig(): void {
        const storage: object = JSON.parse(<string>localStorage.getItem(this.nameSpace));
        this.userConfig = reactive(<object>JSONPath.completeObject(storage, this.initConfig));
        this.writeConfig();
    }

    public getConfig(...path: path[]) {
        let thisObj: jsonRecord = this.userConfig;
        const name = path.pop()!;
        for (const key of path) {
            thisObj = thisObj[key];
        }
        return toRef(thisObj, name);
    }

    public setConfig(value: any, ...path: path[]): void {
        const name: string = <string>path.pop();
        let thisObj: any = this.userConfig;
        for (const key of path) {
            thisObj = thisObj[key];
        }
        thisObj[name] = value;
    }

    public writeConfig(): void {
        localStorage.setItem(this.nameSpace, JSON.stringify(this.userConfig));
    }

    public clearConfig(): void {
        localStorage.removeItem(this.nameSpace);
    }

    public resetConfig(): void {
        Object.assign(this.userConfig, this.initConfig);
    }
}

export default ManageConfig;