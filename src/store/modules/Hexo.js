import when from 'when'
import utils from '@/service/Utils'

const Hexo = require('hexo')
const fs = require('fs')

const state = {
  instance: null,
  inited: false,
  selectedPostId: null,
  selectedTag: null,
  selectedCat: null,
  selectedDrafts: false,
}
const mutations = {
  setInstance(state, hexo) {
    state.instance = hexo
  },
  setInited(state) {
    state.inited = true
  },
  setSelectedPostId(state, postId) {
    state.selectedPostId = postId
  },
  setSelectedTag(state, tag) {
    state.selectedTag = tag
  },
  setSelectedCat(state, cat) {
    state.selectedCat = cat
  },
  setSelectedDrafts(state, selectedDrafts) {
    state.selectedDrafts = selectedDrafts
  }
}
const actions = {
  /**
   * 开始
   * @param context
   * @returns {Promise<void>}
   */
  async start(context) {
    let loading = this._vm.$loading({ lock: true, text: 'Loading...', spinner: 'el-icon-loading' })
    try {
      await context.dispatch('Config/initConfig', null, { root: true })
      await context.dispatch('init')
    } finally {
      loading.close()
    }
  },

  /**
   * 初始化
   * @param context
   * @returns {Promise<void>}
   */
  async init(context) {
    let config = context.rootState.Config.config
    if (!config || !config.path) {
      context.dispatch('UiStatus/setDialogFormVisible', true, { root: true })
    } else {
      try {
        let hexo = new Hexo(config.path, {
          debug: false,
          // safe: true, // 安全模式，安全模式下不会加载第三方插件
          silent: true, // 开启安静模式。不在终端中显示任何信息。
          drafts: true, // 显示草稿，详见hexo/index.js#_showDrafts
        })

        await hexo.init()
        await hexo.watch()

        context.dispatch('UiStatus/setDialogFormVisible', false, { root: true })
        context.commit('setInstance', hexo)
        context.commit('setInited')
      } catch (e) {
        console.error(e)
        this._vm.$alert('打开失败，你可以切换到开发者工具（View > Toggle Developer Tools）查看错误消息。异常反馈QQ群：618213781', '打开失败', {
          confirmButtonText: '确定'
        });
      }
    }
  },

  /**
   * 销毁
   * @param context
   */
  destroy(context) {
    context.state.instance.unwatch()
  },

  /**
   * 获取文章
   * @param context
   * @param postId
   * @returns {*}
   */
  getPost(context, postId) {
    return context.state.instance.locals.get('posts').findOne({ _id: postId })
  },

  /**
   * 选中文章
   * @param context
   * @param postId
   */
  selectPost(context, postId) {
    context.commit('setSelectedPostId', postId)
  },

  /**
   * 树形菜单中选中项目
   * @param context
   * @param str
   */
  selectTree(context, str) {
    if (!str) {
      return
    }

    let tagPrefix = 'tag#'
    let catPrefix = 'cat#'

    if (str.lastIndexOf(tagPrefix) === 0) {
      let tag = str.substr(tagPrefix.length)
      context.commit('setSelectedTag', tag)
      context.commit('setSelectedCat', '')
      context.commit('setSelectedDrafts', false)
    } else if (str.lastIndexOf(catPrefix) === 0) {
      let cat = str.substr(tagPrefix.length)
      context.commit('setSelectedTag', '')
      context.commit('setSelectedCat', cat)
      context.commit('setSelectedDrafts', false)
    } else if (str === 'drafts') {
      context.commit('setSelectedDrafts', true)
    } else {
      context.commit('setSelectedTag', '')
      context.commit('setSelectedCat', '')
      context.commit('setSelectedDrafts', false)
    }
  },

  /**
   * 验证表单
   * @param context
   * @param postForm
   * @returns {Q.Promise<T>}
   */
  validatePostForm(context, postForm) {
    let deferred = when.defer()
    postForm.validate(function (valid) {
      deferred.resolve(valid)
    })
    return deferred.promise
  },

  /**
   * 创建文章
   * @param context
   * @param postForm
   * @returns {Q.Promise<T>}
   */
  createPost(context, postForm) {
    let deferred = when.defer()
    let hexo = context.state.instance
    let suffix = '.md'
    if (postForm.path && postForm.path.indexOf(suffix, this.length - suffix.length) === -1) { // 设置了path，并且path不以.md结尾
      postForm.path = postForm.path + '.md'
    }
    // let replace = postForm.layout === 'draft' // 如果是草稿，那么就要进行覆盖
    hexo.post.create(postForm, true, function (err, value) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(value)
      }
    })
    return deferred.promise
  },

  /**
   * 修改文章
   * @param context
   * @param postForm
   * @returns {Q.Promise<T>}
   */
  editPost(context, postForm) {
    let deferred = when.defer()
    let hexo = context.state.instance
    let suffix = '.md'
    if (postForm.path && postForm.path.indexOf(suffix, this.length - suffix.length) === -1) { // 设置了path，并且path不以.md结尾
      postForm.path = postForm.path + '.md'
    }
    hexo.post.create(postForm, true, function (err, value) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(value)
      }
    })
    return deferred.promise
  },

  /**
   * 发布草稿
   * @param context
   * @param postForm
   * @returns {Q.Promise<T>}
   */
  publishPost(context, postForm) {
    let deferred = when.defer()
    let hexo = context.state.instance
    let suffix = '.md'
    if (postForm.path && postForm.path.indexOf(suffix, this.length - suffix.length) === -1) { // 设置了path，并且path不以.md结尾
      postForm.slug = postForm.path + '.md'
    }
    hexo.post.publish(postForm, true, function (err, value) {
      if (err) {
        deferred.reject(err)
      } else {
        context.commit('setSelectedPostId', undefined) // 重置一下当前选中的文章
        deferred.resolve(value)
      }
    })
    return deferred.promise
  },

  /**
   * 删除文章
   * @param context
   * @param postId
   * @returns {Q.Promise<T>}
   */
  async deletePost(context, postId) {
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

  /**
   * 发布
   * @param context
   * @returns {Promise<void>}
   */
  async deploy(context) {
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
        vm.$notify.error('发布失败')
      } finally {
        loading.close()
      }
    } catch (err) {
      loading.close()
      vm.$notify.error('生成失败')
    }
  }
}
const getters = {
  /**
   * 所有的标签
   * @param state
   * @returns {Array}
   */
  tags: state => {
    let tags = []
    if (state.instance && state.instance.locals) {
      let temp = state.instance.locals.get('tags')
      if (temp && temp.length > 0) {
        temp.forEach(tag => {
          if (!tags.includes(tag.name)) {
            tags.push(tag.name)
          }
        })
      }
    }
    return tags
  },
  /**
   * 所有的分组
   * @param state
   * @returns {Array}
   */
  categories: state => {
    let categories = []
    if (state.instance && state.instance.locals) {
      let temp = state.instance.locals.get('categories')
      if (temp && temp.length > 0) {
        temp.forEach(category => {
          if (!categories.includes(category.name)) {
            categories.push(category.name)
          }
        })
      }
    }
    return categories
  },
  /**
   * 所有的文章，按照时间倒序排列
   * @param state
   * @returns {Array}
   */
  posts: state => {
    let posts = []
    let temp = state.instance.locals.get('posts').sort('date', -1)
    if (temp && temp.length > 0) {
      temp.forEach(post => {
        posts.push(utils.formatPost(post))
      })
    }
    return posts
  },
  /**
   * 文章过滤
   * @param state
   * @returns {Array}
   */
  filteredPosts: state => {
    let posts = []
    let temp = state.instance.locals.get('posts').sort('date', -1)
    if (temp && temp.length > 0) {
      temp.forEach(post => {
        if (state.selectedDrafts) { // 如果当前看的是草稿
          if (post.published) {
            return
          }
        } else {
          if (!post.published) {
            return
          }
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
        }

        posts.push(utils.formatPost(post))
      })
    }
    return posts
  },
  /**
   * 当前选中的树形菜单项目
   * @param state
   * @returns {string}
   */
  selectedTreeItem: state => {
    if (state.selectedDrafts) {
      return 'drafts'
    } else if (state.selectedCat) {
      return 'cat#' + state.selectedCat
    } else if (state.selectedTag) {
      return 'tag#' + state.selectedTag
    }
    return 'all'
  },
  /**
   * 选中的文章
   * @param state
   * @returns {{}}
   */
  selectedPost: state => {
    let posts = state.instance.locals.get('posts').sort('date', -1)
    let selectedPostId = state.selectedPostId
    if (!selectedPostId && posts.length > 0) { // 如果没选中，那么默认显示第一篇
      let arr = posts.toArray()
      for (let i = 0; i < arr.length; i++) {
        let p = arr[i]
        if (p.published) {
          selectedPostId = p._id
          break
        }
      }
    }
    if (!selectedPostId) {
      return null
    }
    let post = posts.findOne({ _id: selectedPostId }).toObject()
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
