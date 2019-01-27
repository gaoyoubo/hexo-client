<template>
  <el-scrollbar style="width: 100%">
    <el-main v-if="post" style="padding-top: 0px;">
      <article class="article">
        <div class="article-inner">
          <header class="article-header">
            <h1 class="article-title">{{ post.title }}</h1>
            <label class="article-time">{{ post.date.format('YYYY-MM-DD HH:mm:ss') }}</label>
            <label class="article-cat" v-for="(category, index) in post.categories.data">
              <el-tag size="small">{{ category.name }}</el-tag>
            </label>
            <label class="article-tag" v-for="(tag, index) in post.tags.data">
              <el-tag type="info" size="small">{{ tag.name }}</el-tag>
            </label>
          </header>
          <div class="article-entry" v-html="post.content"></div>
        </div>
      </article>
    </el-main>
  </el-scrollbar>
</template>

<script>
  const electron = require('electron')
  export default {
    data () {
      return {
        loading: false
      }
    },
    updated () {
      this.renderArticle()
    },
    mounted () {
      this.renderArticle()
    },
    methods: {
      renderArticle () {
        this.loading = true
        try {
          this.renderImage()
          this.renderLink()
        } finally {
          this.loading = false
        }
      },
      // 渲染图片
      renderImage () {
        let contentDom = document.getElementsByClassName('article-entry')
        if (contentDom && contentDom.length > 0) {
          let sysConfig = this.$store.state.Config.config
          let imgs = contentDom[0].getElementsByTagName('img')
          for (let i = 0; i < imgs.length; i++) {
            let img = imgs[i]
            let src = img.getAttribute('src')
            if (this.startWith(src, '/images')) {
              img.setAttribute('src', 'file://' + sysConfig.path + '/source' + src)
            }
          }
        }
      },
      // 渲染a标签
      renderLink () {
        let articleDom = document.getElementsByClassName('article')
        if (articleDom && articleDom.length > 0) {
          let links = articleDom[0].getElementsByTagName('a')
          for (let i = 0; i < links.length; i++) {
            links[i].onclick = function (event) {
              let href = event.target.getAttribute('href')
              if (href) {
                electron.shell.openExternal(href)
              }
              return false
            }
          }
        }
      },
      startWith (str, prefix) {
        return str && prefix && str.indexOf(prefix) === 0
      }
    },
    computed: {
      post () {
        return this.$store.getters['Hexo/selectedPost']
      }
    }
  }
</script>

