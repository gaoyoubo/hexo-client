<template>
  <el-container style="height: 100%;">
    <tag-tree></tag-tree>
    <article-list></article-list>
    <article-view></article-view>
  </el-container>
</template>

<script>
  import TagTree from './TagTree'
  import ArticleList from './ArticleList'
  import ArticleView from './ArticleView'

  export default {
    name: 'main-page',
    components: {TagTree, ArticleList, ArticleView},
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
