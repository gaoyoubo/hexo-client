<template>
  <el-container style="height: 100%;">
    <article-list></article-list>
    <article-view></article-view>
  </el-container>
</template>

<script>
  import ArticleList from './Posts/ArticleList'
  import ArticleView from './Posts/ArticleView'

  export default {
    name: 'main-page',
    components: {ArticleList, ArticleView},
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
