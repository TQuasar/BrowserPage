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

    private abbrPathMap: Map<string, path[]> = new Map();

    public readConfig(): void {
        const storage: object = JSON.parse(<string>localStorage.getItem(this.nameSpace));
        this.userConfig = reactive(<object>JSONPath.completeObject(storage, this.initConfig));
        this.writeConfig();
    }

    public getConfig(...path: path[]) {
        const newPath: path[] = this.completePath(path);
        let thisObj: jsonRecord = this.userConfig;
        const name = newPath.pop()!;
        for (const key of newPath) {
            thisObj = thisObj[key];
        }
        return toRef(thisObj, name);
    }

    public setConfig(value: any, ...path: path[]): void {
        const newPath: path[] = this.completePath(path);
        const name: string = <string>newPath.pop();
        let thisObj: any = this.userConfig;
        for (const key of newPath) {
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

    private completePath(paths: path[]): path[] {
        const thisPath: path[] = [];
        let query: path[] | null = null;
        let queryIndex: number = 0;

        let i: number = 0;
        for (const path of paths) {
            thisPath.push(path);
            const string: string = JSON.stringify(thisPath);

            if (this.abbrPathMap.has(string)) {
                query = this.abbrPathMap.get(string)!;
                queryIndex = i;
            }

            i++;
        }
        if (query) {
            const copy = JSON.parse(JSON.stringify(query));
            copy.push(...paths.slice(queryIndex+1));
            return copy;
        } else {
            return thisPath;
        }
    }

    public abbrPath(abbr: path[], explanation: path[]): void {
        this.abbrPathMap.set(JSON.stringify(abbr), explanation);
    }
}

export default ManageConfig;