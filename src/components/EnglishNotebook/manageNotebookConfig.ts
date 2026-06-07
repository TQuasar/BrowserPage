import manageConfig from "@utils/manageConfig";
import innerFrameConfig from "./Notebook.config.json";

const config = new manageConfig("Notebook", innerFrameConfig);
config.abbrPath(["words"], ["--words"]);
config.abbrPath(["sentences"], ["--sentences"]);
export default config;