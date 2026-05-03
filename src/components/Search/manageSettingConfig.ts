import manageConfig from "@utils/manageConfig";
import settingConfig from "./Search.config.json";

const config = new manageConfig("settingConfig", settingConfig);
config.readConfig();
config.abbrPath(["engines"], ["--engines"]);
config.abbrPath(["history"], ["--history"]);
config.abbrPath(["navigation"], ["--navigation"]);

export default config;