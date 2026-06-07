import manageConfig from "@utils/manageConfig";
import userConfig from "@assets/json/userConfig.json";

const config = new manageConfig("userConfig", userConfig);
config.abbrPath(["defaultWebsite"], ["--defaultWebsite"]);
config.abbrPath(["extensions"], ["!!extensions"]);

export default config;