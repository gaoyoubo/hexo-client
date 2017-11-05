const fs = require('fs')
const yaml = require('js-yaml')
const dir = '/Users/gaoyoubo/code/node/blog.mspring.org'

class HexoUtils {
  /**
   * 列出所有文章
   * @returns {*}
   */
  listPosts () {
    var me = this
    var path = dir + '/source/_posts'
    var files = fs.readdirSync(path, null)
    var posts = []
    files.forEach(file => {
      var filename = path + '/' + file
      var post = me.readPost(filename)
      posts.push(post)
    })
    posts.sort((p1, p2) => {
      var t1 = Date.parse(p1.date)
      var t2 = Date.parse(p2.date)
      if (t1 > t2) {
        return -1
      } else if (t1 < t2) {
        return 1
      }
      return 0
    })
    return posts
  }

  /**
   * 读取文章
   * @param filename
   * @returns {Object}
   */
  readPost (filename) {
    var data = fs.readFileSync(filename, 'utf8')
    return this.json(data)
  }

  // /**
  //  * 读取文章
  //  * @param filename
  //  * @returns {*}
  //  */
  // readPost (filename) {
  //   var deferred = when.defer()
  //   var me = this
  //   fs.readFile(filename, 'utf8', (err, data) => {
  //     if (err) {
  //       console.error('文章信息读取错误', err)
  //       deferred.reject(err)
  //     }
  //     var article = me.json(data)
  //     deferred.resolve(article)
  //   })
  //   return deferred.promise
  // }

  /**
   * 把 markdown 文件内容转换成 JSON 格式.
   *
   * @param  {String} article
   * @return {Object}
   */
  json (article) {
    var temp = article.split('---\n')
    var meta = temp[0].split('\n')
    var result = {
      content: temp[1]
    }
    // 解析普通属性
    meta.forEach(value => {
      let arr = value.split(':')
      let key = arr[0]
      let val = arr.slice(1).join(':')
      if (key && val) {
        result[key] = val.trim()
      }
    })
    // 解析标签和分类
    var tags = []
    var categories = []
    var tagFlag = false
    var catFlag = false
    meta.forEach(value => {
      value = value.trim()
      if (value.startsWith('tags:')) {
        tagFlag = true
        catFlag = false
      }
      if (value.startsWith('categories:')) {
        catFlag = true
        tagFlag = false
      }
      if (tagFlag && value.startsWith('-')) {
        var tag = value.substring(1, value.length)
        if (tags.indexOf(tag) === -1) {
          tags.push(tag)
        }
      }
      if (catFlag && value.startsWith('-')) {
        var cat = value.substring(1, value.length)
        if (categories.indexOf(cat) === -1) {
          categories.push(cat)
        }
      }
    })
    result['tags'] = tags
    result['categories'] = categories
    return result
  }

  getConfig () {
    return yaml.safeLoad(fs.readFileSync(dir + '/_config.yml', 'utf8'))
  }
}

export default new HexoUtils()
