import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import MateChat from '@matechat/core';
import VueDevui from 'vue-devui';
import i18n from './i18n';

// global styles
import './assets/global.css'
import '@devui-design/icons/icomoon/devui-icon.css';

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(MateChat)
app.use(VueDevui)
app.use(i18n)
app.mount('#app')
