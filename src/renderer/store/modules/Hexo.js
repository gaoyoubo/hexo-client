const fs = require('fs')
const readline = require('readline')

class Hexo {
  listPostFiles () {
    var me = this
    var path = '/home/gaoyoubo/code/web/blog.mspring.org/source/_posts'
    fs.readdir(path, null, (err, files) => {
      if (err) {
        console.log(err.message)
        return
      }
      files.forEach(file => {
        me.readMarkdown(path + '/' + file)
      })
    })
  }

  readMarkdown (filename) {
    // fs.readFile(filename, 'utf8', (err, data) => {
    //   console.log(data)
    //   file.readline
    // })
    const rl = readline.createInterface({
      input: fs.createReadStream(filename)
    })

    var Post = {} // post对象
    var metaEnd = false // 文章属性读取是否结束
    rl.on('line', line => {
      if (line === '---') {
        metaEnd = true
      }

    })
  }
}

export default new Hexo()
