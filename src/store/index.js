import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  namespaced: true,
  // 如果启用严格默认，hexo.watch()的时候文件发生变更会抛出异常，所以这里默认关闭
  strict: false
  // strict: process.env.NODE_ENV !== 'production'
})
