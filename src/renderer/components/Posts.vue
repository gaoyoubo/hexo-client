<template>
  <el-container>
    <el-header>
      <main-menu active="/posts"></main-menu>
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
  import ArticleList from './Posts/ArticleList'
  import ArticleView from './Posts/ArticleView'
  import ArticleEdit from './Posts/ArticleEdit'
  export default {
    name: 'main-page',
    components: {MainMenu, ArticleList, ArticleView, ArticleEdit},
    data () {
      return {
        selectedId: '' // 已经选中的文章编号
      }
    },

    methods: {
      selectedArticle (id) {
        this.selectedId = id
      }
    }
  }
</script>

