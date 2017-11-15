const fs = require('fs')
const yaml = require('js-yaml')

class HexoUtils {
  /**
   * 列出所有文章
   * @returns {*}
   */
  listPosts (dir) {
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
          tags.push(tag.trim())
        }
      }
      if (catFlag && value.startsWith('-')) {
        var cat = value.substring(1, value.length)
        if (categories.indexOf(cat) === -1) {
          categories.push(cat.trim())
        }
      }
    })
    result['tags'] = tags
    result['categories'] = categories
    return result
  }

  craetePost (dir, post) {
    // TODO 检查文件是否存在
    var path = dir + '/source/_posts/' + post.title + '.md'
    var content = this.markdown(post)
    fs.writeFileSync(path, content)
  }

  /**
   * 修改文章
   * @param dir 路径
   * @param originPost 原文章
   * @param post 修改后的文章
   */
  updatePost (dir, originPost, post) {
    // TODO 检查文件是否存在
    var originPath = dir + '/source/_posts/' + originPost.title + '.md' // 原路径
    var path = dir + '/source/_posts/' + post.title + '.md' // 新路径
    if (originPost.title !== post.title) { // 如果修改了文件名称，需要先rename一下
      fs.renameSync(originPath, path)
    }
    var content = this.markdown(post)
    fs.writeFileSync(path, content)
  }

  /**
   * 删除文章
   * @param dir
   * @param title
   */
  deletePost (dir, title) {
    var path = dir + '/source/_posts/' + title + '.md'
    fs.unlinkSync(path)
  }

  /**
   * 文章对象转成markdown
   * @param post
   * @returns {string}
   */
  markdown (post) {
    var content = []
    content.push('title: ' + post.title)
    content.push('author: ' + post.author)
    if (post.tags && post.tags.length > 0) {
      content.push('tags: ')
      post.tags.forEach(tag => {
        content.push('  - ' + tag)
      })
    }
    if (post.categories && post.categories.length > 0) {
      content.push('categories: ')
      post.categories.forEach(category => {
        content.push('  - ' + category)
      })
    }
    content.push('date: ' + (post.date ? post.date : this.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')))
    content.push('---')
    content.push(post.content)
    return content.join('\n')
  }

  /**
   * 获取配置
   * @returns {*}
   */
  getConfig (dir) {
    return yaml.safeLoad(fs.readFileSync(dir + '/_config.yml', 'utf8'))
  }

  /**
   * 检查是否是合法的hexo目录
   * @param dir
   */
  checkPath (dir) {
    try {
      fs.accessSync(dir, fs.constants.R_OK | fs.constants.W_OK)
      fs.accessSync(dir + '/_config.yml', fs.constants.R_OK | fs.constants.W_OK)
      fs.accessSync(dir + '/source', fs.constants.R_OK | fs.constants.W_OK)
      return true
    } catch (err) {
      return false
    }
  }

  /**
   * 日期格式化
   * @param date
   * @param fmt
   * @returns {*}
   */
  dateFormat (date, fmt) {
    var o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours() % 12,
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }
}

export default new HexoUtils()
