import when from 'when'

const fs = require('fs')

class Hexo {
  listPostFiles () {
    var path = '/home/gaoyoubo/code/web/blog.mspring.org/source/_posts'
    var deferred = when.defer()
    fs.readdir(path, null, (err, files) => {
      if (err) {
        console.log(err.message)
        deferred.reject(err)
      }
      var filenames = []
      files.forEach(file => {
        filenames.push(path + '/' + file)
      })
      deferred.resolve(filenames)
    })
    return deferred.promise
  }

  readPost (filename) {
    var deferred = when.defer()
    var me = this
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        console.error('文章信息读取错误', err)
        deferred.reject(err)
      }
      var article = me.json(data)
      deferred.resolve(article)
    })
    return deferred.promise
  }

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
      if (arr.length !== 2) {
        return
      }
      let key = arr[0]
      let val = arr[1]
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
}

export default new Hexo()
