<template>
  <el-container style="height: 100%;">
    <el-aside style="min-width: 300px;" id="articleListContainer" @scroll.native="scroll">
      <article-list></article-list>
    </el-aside>

    <!--<el-scrollbar>-->
    <el-main style="padding-top: 0px;">
      <article-view></article-view>
    </el-main>
    <!--</el-scrollbar>-->
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
    mounted () {
      this.setscroll()
    },
    methods: {
      // 存储滚动位置
      scroll (e) {
        this.$store.dispatch('UiStatus/onscroll', {
          scrollTop: e.srcElement.scrollTop,
          scrollLeft: e.srcElement.scrollLeft
        })
      },
      // 设置滚动位置
      setscroll () {
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

