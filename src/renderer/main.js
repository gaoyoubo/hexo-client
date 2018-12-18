import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import { ipcRenderer, remote } from 'electron'
import { ebtRenderer } from 'electron-baidu-tongji'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style.css'
import mavonEditor from 'mavon-editor-hexo-client'
import 'mavon-editor-hexo-client/dist/css/index.css'

import VueParams from 'vue-params'
import VueI18Next from 'vue-i18next'

Vue.use(ElementUI)
Vue.use(mavonEditor)
Vue.use(VueParams)
Vue.use(VueI18Next)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

// 百度统计
const BAIDU_SITE_ID = '4b0947c1973db3139b436d8583b3fc00'
ebtRenderer(ipcRenderer, BAIDU_SITE_ID, router)

// i18n
window.i18next = remote.require('i18next')
Vue.params.i18nextLanguage = window.i18next.language
window.i18next.on('languageChanged', () => {
  console.log('change language', arguments)
  Vue.params.i18nextLanguage = window.i18next.language
})

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')
