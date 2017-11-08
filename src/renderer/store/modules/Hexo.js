import HexoUtils from '@/HexoUtils'
import DBUtils from '@/DBUtils'

export default {
  state: {
    // 系统配置
    sysConfig: {},
    // 配置
    config: {},
    // 文章
    posts: [],
    // 标签
    tags: [],
    // 分类
    categories: [],

    // 系统是否初始化
    sysInited: false,
    // 系统配置是否初始化
    sysConfigInited: true
  },
  mutations: {
    INIT_SYS_CONFIG (state, sysConfig) {
      state.sysConfig = sysConfig
      state.sysConfigInited = sysConfig && sysConfig.path
    },

    INIT_HEXO (state, path) {
      console.log('loading...')
      var posts = HexoUtils.listPosts(path)
      var tags = []
      var categories = []
      posts.forEach(post => {
        if (post.tags && post.tags.length > 0) {
          post.tags.forEach(tag => {
            if (tags.indexOf(tag) === -1) {
              tags.push(tag)
            }
          })
          if (post.categories && post.categories.length > 0) {
            post.categories.forEach(category => {
              if (categories.indexOf(category) === -1) {
                categories.push(category)
              }
            })
          }
        }
      })
      state.posts = posts
      state.tags = tags
      state.categories = categories
      state.config = HexoUtils.getConfig(path)
      state.sysInited = true
      console.log('loading... end')
    }
  },
  actions: {
    /**
     * 初始化配置
     * @param context
     */
    init (context) {
      // 初始化系统配置
      DBUtils.getSysConfig().done(doc => {
        context.commit('INIT_SYS_CONFIG', doc)

        if (doc && doc.path) {
          context.commit('INIT_HEXO', doc.path)
        } else {
          console.log('请先配置path')
        }
      })
    },

    writePost (context, post) {
      debugger
      var path = context.state.sysConfig.path
      if (path) {
        HexoUtils.writePost(path, post)
        context.commit('INIT_HEXO', path)
      } else {
        window.alert('请先配置path')
      }
    },

    /**
     * 设置路径
     * @param context
     * @param path
     */
    setPath (context, path) {
      if (HexoUtils.checkPath(path)) {
        DBUtils.setSysConfig('path', path).then(() => {
          context.dispatch('init')
        })
      } else {
        window.alert('错误的目录配置:' + path)
      }
    }
  },
  getters: {
    sysInited: function (state) {
      return state.sysInited
    },
    sysConfigInited: function (state) {
      return state.sysConfigInited
    },
    posts: function (state) {
      return state.posts
    }
  }
}
