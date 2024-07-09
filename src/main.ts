// import './assets/main.css'
// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import 'element-plus/dist/index.css'
import ElementPlus from "element-plus";
import "uno.css";

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'iconify-icon';


import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.use(createPinia())
app.use(router)
app.use(ElementPlus);
app.mount('#app')
