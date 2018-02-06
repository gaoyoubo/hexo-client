<template>

  <div>
    <div class="article-list-panel" v-for="(post, index) in posts" ref="post">
      <div class="article-list-item">
        <h4 class="article-title">{{ post.title }}</h4>
        <p class="article-desc"></p>
        <ul class="article-info">
          <li class="meta">{{ post.author }}</li>
          <li class="meta">{{ post.date.format('YYYY-MM-DD') }}</li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    data () {
      return {
        posts: []
      }
    },

    methods: {},

    mounted () {
      this.posts = window.hexo.locals.get('posts').data
    }
  }
</script>

<style>
  .article-list-item {
    padding: 8px;
    position: relative;
    border-bottom: 1px solid rgba(110, 100, 102, 0.15);
    cursor: pointer;
  }

  .article-list-item .article-title {
    margin: 0px 0px 5px;
    font-weight: 400;
    font-size: 17px;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    word-wrap: break-word;
    word-break: break-all;
  }

  .article-list-item .article-desc {
    margin: 0px 0px 5px;
    color: #999999;
    font-size: 13px;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .article-list-item .article-info {
    margin: 0px;
    padding: 0px;
    font-size: 13px;
    color: #CECECE;
    line-height: 1em;
    list-style: none;
    overflow: hidden;
  }

  .article-list-item .article-info .meta {
    float: left;
    padding-right: 1em;
  }
</style>

