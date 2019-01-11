<template>
  <el-container style="height: 100%;">
    <tree-nav></tree-nav>
    <article-list></article-list>
    <article-view></article-view>
  </el-container>
</template>

<script>
  import TreeNav from './TreeNav'
  import ArticleList from './ArticleList'
  import ArticleView from './ArticleView'

  export default {
    name: 'main-page',
    components: {TreeNav, ArticleList, ArticleView},
    data () {
      return {}
    },
    mounted () {
    },
    methods: {}
  }
</script>

<style>

</style>
