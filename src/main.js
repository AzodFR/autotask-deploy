import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Vuex from 'vuex'
import store from './store/index.ts'
import icons from "v-svg-icons";

const vue = createApp(App)
vue.use(Vuex);
vue.use(store);
vue.use(ElementPlus)
vue.component("icon", icons);
vue.mount('#app')
