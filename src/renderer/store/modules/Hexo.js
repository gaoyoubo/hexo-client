import HexoUtils from '@/HexoUtils'

export default {
  state: {
    config: {},
    posts: [],
    tags: [],
    categories: []
  },
  mutations: {
    INIT_HEXO_CONFIG (state) {
      state.config = HexoUtils.getConfig()
    },

    INIT_HEXO_POST (state) {
      var posts = HexoUtils.listPosts()
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
    }
  },
  actions: {
    initHexo (context) {
      context.commit('INIT_HEXO_CONFIG')
      context.commit('INIT_HEXO_POST')
    },

    writePost (context, post) {
      HexoUtils.writePost(post)
      context.commit('INIT_HEXO_POST')
    }
  }
}
