import {Ref} from "vue";
import manageConfig from "@utils/manageConfig";

type path = string | number;
class RawConfig {
    private configs: {
        [name: string]: {
            raw: any,
            ref: Ref<any>
        }
    } = {};
    private manager: manageConfig;

    public loadConfig(name: string, ...paths: path[]) {
        const data = this.manager.getConfig(...paths);
        this.configs[name] = {
            ref: data,
            raw: data.value
        };
    }
    public rawConfig(name: string): any {
        return this.configs[name].raw;
    }

    public refConfig(name: string): Ref<any> {
        return this.configs[name].ref;
    }

    constructor(manager: manageConfig) {
        this.manager = manager;
    }
}

export default RawConfig;