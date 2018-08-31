<template>
  <el-container>
    <el-aside style="min-width: 300px;" id="articleListContainer" @scroll.native="scroll">
      <article-list v-on:loaded="loaded"></article-list>
    </el-aside>

    <el-main style="padding-top: 0px;">
      <article-view></article-view>
    </el-main>
  </el-container>
</template>

<script>
  import MainMenu from './MainMenu'
  import ArticleList from './Posts/ArticleList'
  import ArticleView from './Posts/ArticleView'

  export default {
    name: 'main-page',
    components: {MainMenu, ArticleList, ArticleView},
    data () {
      return {}
    },
    methods: {
      scroll (e) {
        this.$store.dispatch('UiStatus/onscroll', {
          scrollTop: e.srcElement.scrollTop,
          scrollLeft: e.srcElement.scrollLeft
        })
      },
      loaded () {
        let ele = document.getElementById('articleListContainer')
        let scrollTop = this.$store.state.UiStatus.postListScrollTop || 0
        let scrollLeft = this.$store.state.UiStatus.postListScrollLeft || 0
        if (scrollTop > 0 || scrollLeft > 0) {
          ele.scrollTop = scrollTop
          ele.scrollLeft = scrollLeft
        }
      }
    }
  }
</script>

