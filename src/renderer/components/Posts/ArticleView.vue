<template>
  <div v-if="post">
    <article class="am-article">
      <div class="am-article-hd">
        <h1 class="am-article-title">{{ post.title }}</h1>
        <p class="am-article-meta">{{ post.author }}</p>
      </div>
      <div class="am-article-bd" v-html="post.content"></div>
    </article>
  </div>
</template>

<script>
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
    watch: {
      id: function () {
        var posts = window.hexo.locals.get('posts')
        this.post = posts.findOne({_id: this.id}).toObject()
      }
    }
  }
</script>

<style scoped>
  .am-article:before,
  .am-article:after {
    content: " ";
    display: table;
  }

  .am-article:after {
    clear: both;
  }

  .am-article > :last-child {
    margin-bottom: 0;
  }

  .am-article + .am-article {
    margin-top: 2.4rem;
  }

  .am-article-title {
    font-size: 2rem;
    font-weight: normal;
    margin: 0px;
  }

  .am-article-title a {
    color: inherit;
    text-decoration: none;
  }

  .am-article-meta {
    font-size: 1.2rem;
    line-height: 1.5;
    color: #999999;
  }

  .am-article-bd blockquote {
    font-family: Georgia, "Times New Roman", Times, Kai, "Kaiti SC", KaiTi, BiauKai, "FontAwesome", serif;
  }

  .am-article-bd img {
    display: block;
    max-width: 100%;
  }
</style>

