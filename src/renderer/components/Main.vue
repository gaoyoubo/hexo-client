<template>
  <el-container :style="{'height': windowHeight, 'border': 'solid 1px #eee;'}">
    <el-header style="text-align: right; font-size: 12px">
      <main-menu active="posts"></main-menu>
    </el-header>
    <el-container>
      <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
        <article-list v-on:selectedArticle="selectedArticle"></article-list>
      </el-aside>

      <el-main>
        <article-view :id="selectedId"></article-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import MainMenu from './MainMenu'
  import ArticleList from './ArticleList'
  import ArticleView from './ArticleView'
  import ArticleEdit from './ArticleEdit'
  export default {
    name: 'main-page',
    components: {ArticleList, MainMenu, ArticleView, ArticleEdit},
    data () {
      return {
        windowHeight: '300px', // 窗口高度
        loading: null,
        selectedId: '' // 已经选中的文章编号
      }
    },

    methods: {
      handleResize () {
        this.windowHeight = document.documentElement.clientHeight + 'px'
      },

      showLoading () {
        this.loading = this.$loading({
          lock: true,
          text: 'Loading...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      },

      closeLoading () {
        if (this.loading) {
          this.loading.close()
        }
      },

      selectedArticle (id) {
        this.selectedId = id
      }
    },

    mounted () {
      window.addEventListener('resize', this.handleResize)
      this.handleResize()
    },

    beforeDestroy () {
      window.removeEventListener('resize', this.handleResize)
      window.hexo.unwatch()
    }
  }
</script>

<style>
  html, body {
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3", FontAwesome, sans-serif;
  }

  .el-header {
    color: #333;
    line-height: 60px;
    padding: 0px;
  }

  .el-aside {
    color: #333;
  }
</style>

