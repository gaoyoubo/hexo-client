<template>
  <el-main style="padding: 0px;">
    <div class="about-content">
      <div>
        <h3>项目地址</h3>
        <ul>
          <li>Github：<a @click="openUrl('https://github.com/gaoyoubo/hexo-client')" href="#">https://github.com/gaoyoubo/hexo-client</a>
          </li>
          <li>Blog：<a @click="openUrl('http://www.mspring.org')" href="#">http://www.mspring.org</a></li>
        </ul>
      </div>
      <div>
        <h3>站在巨人肩上</h3>
        <ul>
          <li><a @click="openUrl('https://github.com/electron/electron')" href="#">electron</a></li>
          <li><a @click="openUrl('https://cn.vuejs.org')" href="#">Vue.js</a></li>
          <li><a @click="openUrl('https://github.com/SimulatedGREG/electron-vue')" href="#">electron-vue</a></li>
          <li><a @click="openUrl('http://element-cn.eleme.io')" href="#">element-ui</a></li>
        </ul>
      </div>
      <div>
        <h3>捐赠</h3>
        <div class="juanzeng">
          <img src="../assets/alipay.png">
          <div class="txt">
            <span>支付宝</span>
          </div>
        </div>
        <div class="juanzeng">
          <img src="../assets/weixin.png">
          <div class="txt">
            <span>微信</span>
          </div>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
  export default {
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

  .juanzeng {
    display: inline-table;
    width: 210px;
    padding: 20px;
  }

  .juanzeng img {
    width: 210px;
    height: 210px;
  }

  .juanzeng .txt {
    font-size: 18px;
    text-align: center;
  }
</style>
