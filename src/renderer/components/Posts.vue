<template>
  <el-container>
    <el-aside style="min-width: 300px;" id="articleListContainer" @scroll.native="articleListScroll">
      <article-list v-on:selectedArticle="selectedArticle" v-on:loaded="articleLoaded"></article-list>
    </el-aside>

    <el-main>
      <article-view :id="selectedId"></article-view>
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
      return {
        selectedId: '' // 已经选中的文章编号
      }
    },
    methods: {
      selectedArticle (id) {
        this.selectedId = id
      },
      articleListScroll (e) {
        var ele = e.srcElement
        window.articleListScroll = {
          scrollTop: ele.scrollTop,
          scrollLeft: ele.scrollLeft
        }
      },
      articleLoaded () {
        var ele = document.getElementById('articleListContainer')
        if (window.articleListScroll) {
          ele.scrollTop = window.articleListScroll.scrollTop
          ele.scrollLeft = window.articleListScroll.scrollLeft
        }
      }
    }
  }
</script>

