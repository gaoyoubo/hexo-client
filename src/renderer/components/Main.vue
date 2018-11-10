<template>
  <el-container style="height: 100%;">
    <article-list></article-list>

    <el-scrollbar style="width: 100%">
      <el-main style="padding-top: 0px;">
        <article-view></article-view>
      </el-main>
    </el-scrollbar>
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
    methods: {
    }
  }
</script>

<style>

</style>
