<template>
  <div v-if="post">
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
  </div>
</template>

<script>
  var electron = require('electron')
  export default {
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        post: null
      }
    },
    updated () {
      var articleDom = document.getElementsByClassName('article')
      if (articleDom && articleDom.length > 0) {
        var links = articleDom[0].getElementsByTagName('a')
        for (var i = 0; i < links.length; i++) {
          links[i].onclick = function (event) {
            var href = event.target.getAttribute('href')
            if (href) {
              electron.shell.openExternal(href)
            }
            return false
          }
        }
      }
    },
    watch: {
      id: function () {
        var posts = window.hexo.locals.get('posts')
        this.post = posts.findOne({_id: this.id}).toObject()
      }
    }
  }
</script>

