import DBUtils from '../../DBUtils'

export default {
  state: {
    sysConfig: {},
    config: {}
  },
  mutations: {
    INIT_SYS_CONFIG (state, sysConfig) {
      state.sysConfig = sysConfig
    }
  },
  actions: {
    /**
     * 初始化配置
     * @param context
     */
    initConfig (context) {
      // 初始化系统配置
      DBUtils.getSysConfig().done(doc => {
        context.commit('INIT_SYS_CONFIG', doc)
      })
    },

    /**
     * 设置路径
     * @param context
     * @param path
     */
    setPath (context, path, callback) {
      // DBUtils.setSysConfig('path', path).then((affected, doc, upsert) => {
      //   if (callback) {
      //     callback()
      //   }
      // })
      debugger
      if (callback) {
        callback()
      }
    }
  }
}
