<template>
  <el-container>
    <el-header>
      <main-menu active="/about"></main-menu>
    </el-header>
    <el-main>
      <div class="about-content">
        <div>
          <h3>说明：本人非专业前端，开发这个目的完全是为了自用，<span style="color: red;font-weight: bold;">欢迎各路大神添砖加瓦</span>。</h3>
          <ul>
            <li>Github：<a @click="openUrl('https://github.com/gaoyoubo/hexo-client')" href="#">https://github.com/gaoyoubo/hexo-client</a>
            </li>
            <li>Blog：<a @click="openUrl('http://www.mspring.org')" href="#">http://www.mspring.org</a></li>
          </ul>
        </div>
        <div>
          <h3>使用框架</h3>
          <ul>
            <li><a @click="openUrl('https://cn.vuejs.org')" href="#">Vue.js</a></li>
            <li><a @click="openUrl('https://github.com/electron/electron')" href="#">electron</a></li>
            <li><a @click="openUrl('https://github.com/SimulatedGREG/electron-vue')" href="#">electron-vue</a></li>
            <li><a @click="openUrl('http://element-cn.eleme.io')" href="#">element-ui</a></li>
          </ul>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import MainMenu from './MainMenu'

  export default {
    components: {MainMenu},
    data () {
      return {}
    },
    created () {
    },
    methods: {
      openUrl (url) {
        require('electron').shell.openExternal(url)
      }
    }
  }
</script>

<style scoped>
  .about-content {
    margin: 50px;
    font-size: 15px;
    font-family: Georgia, "Times New Roman", Times, Kai, "Kaiti SC", KaiTi, BiauKai, "FontAwesome", serif;
  }

  .about-content ul li {
    padding: 3px;
  }
</style>
