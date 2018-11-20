<template>
  <el-container style="height: 100%;">
      <article-list></article-list>
      <article-view></article-view>
  </el-container>
</template>

<script>
  import ArticleList from './ArticleList'
  import ArticleView from './ArticleView'

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
