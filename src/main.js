import { createApp } from 'vue'
import App from './App.vue'
import manageUserConfig from "@utils/manageUserConfig.ts";

manageUserConfig.readConfig();
createApp(App).mount('#app')
