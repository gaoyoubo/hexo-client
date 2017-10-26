// const fs = require('fs')
// const hexo = require('./Hexo')
import hexo from './Hexo'

export default {
  state: {},
  mutations: {
    scanTags (state) {
      // path
      // var path = '/home/gaoyoubo/code/web/blog.mspring.org/source/_posts'
      // fs.readdir(path, null, (err, files) => {
      //   if (err) {
      //     console.log(err.message)
      //     return
      //   }
      //   files.forEach(file => {
      //     readMarkdown(path, file)
      //   })
      // })

      hexo.listPostFiles()
    }
  },
  actions: {
    // syncTags ({commit, state}) {
    //   // let openRequest = window.indexedDB.open('music')
    // }
  }
}
