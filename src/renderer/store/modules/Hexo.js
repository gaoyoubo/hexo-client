import HexoUtils from '@/HexoUtils'

export default {
  state: {
    posts: []
  },
  mutations: {
    initHexo (state) {
      state.posts = HexoUtils.listPosts()
    }
  },
  actions: {
    // syncTags ({commit, state}) {
    //   // let openRequest = window.indexedDB.open('music')
    // }
  }
}
