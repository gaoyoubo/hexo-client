<template>
  <div id="app" :style="{'height': windowHeight}">
    <el-container v-if="inited">
      <el-aside class="sidebar" style="width: 64px;">
        <main-menu></main-menu>
      </el-aside>

      <el-main class="app-main">
        <el-container class="app-container">
          <el-main class="main">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-main>
    </el-container>

    <!-- 搜索组件 -->
    <search/>
    <!-- 初始化选择路径 -->
    <choose-path/>

  </div>
</template>

<script>
  import MainMenu from './components/MainMenu'
  import Search from './components/Search'
  import ChoosePath from './components/ChoosePath'

  export default {
    name: 'HexoClient',
    components: {ChoosePath, MainMenu, Search},
    data () {
      return {
        windowHeight: '300px' // 窗口高度
      }
    },

    created () {
    },

    mounted () {
      window.addEventListener('resize', this.resize)
      this.resize()
      this.init()
    },

    beforeDestroy () {
      window.removeEventListener('resize', this.resize)
      this.$store.dispatch('Hexo/destroy')
    },

    methods: {
      async init () {
        await this.$store.dispatch('Hexo/start')
      },

      resize () {
        this.windowHeight = document.documentElement.clientHeight + 'px'
      }
    },

    computed: {
      inited () {
        return this.$store.state.Hexo.inited
      }
    }
  }
</script>

<style scoped>
  .app-main {
    height: 100%;
    padding: 0px;
  }

  .app-container {
    width: 100%;
    height: 100%;
    padding: 0px;
  }

  .app-container .main {
    height: 100%;
    padding: 0px;
  }
</style>
