<template>
  <el-container :style="{'height': windowHeight, 'border': 'solid 1px #eee;'}">
    <el-header style="text-align: right; font-size: 12px">
      <main-menu></main-menu>
    </el-header>
    <el-container>
      <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
        <article-list></article-list>
      </el-aside>

      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
  import ArticleList from './ArticleList'
  import MainMenu from './MainMenu'
  export default {
    name: 'main-page',
    components: {ArticleList, MainMenu},
    data () {
      return {
        windowHeight: '300px', // 窗口高度
        loading: null
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

