import { createApp } from 'vue'
import App from './App.vue'
import config from "./assets/config.json"

const app = createApp(App)
app.config.globalProperties.$config = config;
app.mount("#app");