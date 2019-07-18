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

  const urllib = require('urllib')

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
        this.checkUpdate()
      },

      resize () {
        this.windowHeight = document.documentElement.clientHeight + 'px'
      },

      checkUpdate () {
        let me = this
        urllib.request('https://api.github.com/repos/gaoyoubo/hexo-client/releases/latest', function (err, data, res) {
          if (err) {
            console.error('Check update fail', err)
          }
          let ret = JSON.parse(data.toString())
          if (ret.draft || ret.prerelease) {
            return
          }

          let current = me.calculateIntValue(window.appVersion)
          let latest = me.calculateIntValue(ret.name)

          if (current >= latest) {
            // 没有新版本
            return
          }

          let title = '新版本提醒'
          let content = '检测到新版本：' + ret.name + '，点击`去下载`按钮下载最新版本。'
          let url = ret.html_url
          me.$confirm(content, title, {
            confirmButtonText: '去下载',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            require('electron').shell.openExternal(url)
          }).catch(() => {
          })
        })
      },

      /**
       * 根据版本计算出一个int值
       * @param version
       * @returns {number}
       */
      calculateIntValue (version) {
        version = version.replace(/v/g, '')
        let ss = version.split('.')
        if (ss == null || ss.length !== 3) {
          return -1
        }
        let major = parseInt(ss[0])
        let minor = parseInt(ss[1])
        let micro = parseInt(ss[2])
        if (isNaN(major) || isNaN(minor) || isNaN(micro)) {
          return -1
        }
        return major * 1000000 + minor * 1000 + micro
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
