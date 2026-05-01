import manageConfig from "@utils/manageConfig";
import settingConfig from "./Search.config.json";
const config = new manageConfig("settingConfig", settingConfig);
config.readConfig();
export default config;