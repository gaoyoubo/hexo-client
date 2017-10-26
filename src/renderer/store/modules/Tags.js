import hexo from './Hexo'

export default {
  state: {},
  mutations: {
    scanTags (state) {
      hexo.listPostFiles()
    }
  },
  actions: {
    // syncTags ({commit, state}) {
    //   // let openRequest = window.indexedDB.open('music')
    // }
  }
}
