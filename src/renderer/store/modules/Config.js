import configManager from '@/service/ConfigManager'

const state = {
  config: {}
}

const mutations = {
  updateConfig (state, config) {
    state.config = config
  }
}

const actions = {
  async initConfig (context) {
    context.commit('updateConfig', await configManager.getSysConfig())
  },
  async setConfig (context, options) {
    await configManager.setSysConfig(options)
    context.dispatch('initConfig')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
