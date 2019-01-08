import when from 'when'
import utils from '@/service/Utils'

const Hexo = require('hexo')
const fs = require('fs')

const state = {
  instance: null,
  inited: false,
  selectedPostId: null,
  selectedTag: null,
  selectedCat: null
}
const mutations = {
  setInstance (state, hexo) {
    state.instance = hexo
  },
  setInited (state) {
    state.inited = true
  },
  setSelectedPostId (state, postId) {
    state.selectedPostId = postId
  },
  setSelectedTag (state, tag) {
    state.selectedTag = tag
  },
  setSelectedCat (state, cat) {
    state.selectedCat = cat
  }
}
const actions = {
  async start (context) {
    let loading = this._vm.$loading({lock: true, text: 'Loading...', spinner: 'el-icon-loading'})
    try {
      await context.dispatch('Config/initConfig', null, {root: true})
      await context.dispatch('init')
    } finally {
      loading.close()
    }
  },
  // 初始化
  async init (context) {
    let config = context.rootState.Config.config
    if (!config || !config.path) {
      context.dispatch('UiStatus/setDialogFormVisible', true, {root: true})
    } else {
      let hexo = new Hexo(config.path, {
        debug: false,
        silent: true // 开启安静模式。不在终端中显示任何信息。
      })
      await hexo.init()
      await hexo.watch()

      context.dispatch('UiStatus/setDialogFormVisible', false, {root: true})
      context.commit('setInstance', hexo)
      context.commit('setInited')
    }
  },

  // 销毁
  destroy (context) {
    context.state.instance.unwatch()
  },

  // 获取文章
  getPost (context, postId) {
    return context.state.instance.locals.get('posts').findOne({_id: postId})
  },

  // 选中文章
  selectPost (context, postId) {
    context.commit('setSelectedPostId', postId)
  },

  // 树形菜单中选中项目
  selectTree (context, str) {
    if (!str) {
      return
    }

    let tagPrefix = 'tag#'
    let catPrefix = 'cat#'

    if (str.lastIndexOf(tagPrefix) === 0) {
      let tag = str.substr(tagPrefix.length)
      context.commit('setSelectedTag', tag)
      context.commit('setSelectedCat', '')
    } else if (str.lastIndexOf(catPrefix) === 0) {
      let cat = str.substr(tagPrefix.length)
      context.commit('setSelectedTag', '')
      context.commit('setSelectedCat', cat)
    } else {
      context.commit('setSelectedTag', '')
      context.commit('setSelectedCat', '')
    }
  },

  // 验证表单
  validatePostForm (context, postForm) {
    let deferred = when.defer()
    postForm.validate(function (valid) {
      deferred.resolve(valid)
    })
    return deferred.promise
  },

  // 创建、修改文章
  async createPost (context, postForm) {
    let deferred = when.defer()
    let hexo = context.state.instance
    hexo.post.create(postForm, true).then(function () {
      deferred.resolve()
    }, function (err) {
      deferred.reject(err)
    })
    return deferred.promise
  },

  // 删除文章
  async deletePost (context, postId) {
    let post = await context.dispatch('getPost', postId)
    let deferred = when.defer()
    fs.unlink(post.full_source, (err) => {
      if (err) {
        deferred.reject(err)
      } else {
        context.commit('setSelectedPostId', undefined) // 重置一下当前选中的文章
        deferred.resolve(post)
      }
    })
    return deferred.promise
  },

  // 发布
  async deploy (context) {
    let vm = this._vm
    let loading = vm.$loading({
      lock: true,
      text: '生成中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    let hexo = context.state.instance
    try {
      await hexo.call('generate', {})
      loading.text += '生成成功! 发布中...'
      try {
        await hexo.call('deploy', {})
        vm.$notify.success('发布成功')
      } catch (e) {
        console.error(e)
        vm.$notify.error('发布失败')
      } finally {
        loading.close()
      }
    } catch (err) {
      loading.close()
      console.error(err)
      vm.$notify.error('生成失败')
    }
  }
}
const getters = {
  tags: state => {
    let tags = []
    let temp = state.instance.locals.get('tags')
    if (temp && temp.length > 0) {
      temp.forEach(tag => tags.push(tag.name))
    }
    return tags
  },
  categories: state => {
    let categories = []
    let temp = state.instance.locals.get('categories')
    if (temp && temp.length > 0) {
      temp.forEach(category => categories.push(category.name))
    }
    return categories
  },
  posts: state => {
    let posts = []
    let temp = state.instance.locals.get('posts').sort('date', -1)
    if (temp && temp.length > 0) {
      temp.forEach(post => {
        posts.push({
          id: post._id,
          title: post.title,
          date: post.date.format('YYYY-MM-DD hh:mm:ss'),
          author: post.author,
          tags: post.tags.data,
          categories: post.categories.data,
          summary: utils.getPostSummary(post.content)
        })
      })
    }
    return posts
  },
  filtredPosts: state => {
    let posts = []
    let temp = state.instance.locals.get('posts').sort('date', -1)
    if (temp && temp.length > 0) {
      temp.forEach(post => {
        let tags = []
        let categories = []
        post.tags.data.forEach(data => tags.push(data.name))
        post.categories.data.forEach(data => categories.push(data.name))
        if (state.selectedTag) {
          if (!tags || tags.length === 0 || tags.indexOf(state.selectedTag) === -1) {
            return
          }
        }
        if (state.selectedCat) {
          if (!categories || categories.length === 0 || categories.indexOf(state.selectedCat) === -1) {
            return
          }
        }

        posts.push({
          id: post._id,
          title: post.title,
          date: post.date.format('YYYY-MM-DD hh:mm:ss'),
          author: post.author,
          tags: post.tags.data,
          categories: post.categories.data,
          summary: utils.getPostSummary(post.content)
        })
      })
    }
    return posts
  },
  selectedPost: state => {
    let posts = state.instance.locals.get('posts').sort('date', -1)
    let selectedPostId = state.selectedPostId
    if (!selectedPostId && posts.length > 0) { // 如果没选中，那么默认显示第一篇
      selectedPostId = posts.toArray()[0].toObject()._id
    }
    if (!selectedPostId) {
      return
    }
    var post = posts.findOne({_id: selectedPostId}).toObject()
    return post
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
