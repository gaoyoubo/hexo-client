<template>
  <el-main style="padding: 0px;">
    <div class="about-content">
      <div>
        <h3>QQ群：<a @click="openQrcode" class="qq_qrcode">618213781</a></h3>
        <h3>项目地址</h3>
        <ul>
          <li>
            Github：
            <a
              @click="openUrl('https://github.com/gaoyoubo/hexo-client')"
              href="#"
            >https://github.com/gaoyoubo/hexo-client</a>
          </li>
          <li>
            Blog：
            <a @click="openUrl('http://www.mspring.org')" href="#">http://www.mspring.org</a>
          </li>
        </ul>
      </div>
      <div>
        <h3>使用帮助</h3>
        <ul>
          <li>
            QQ交流群：
            <span class="qq">618213781</span>
            <a @click="openQrcode" class="qq_qrcode">QQ群二维码</a>
          </li>
          <li>
            帮助文档：
            <a
              @click="openUrl('https://www.mspring.org/2018/11/29/HexoClient%E4%BD%BF%E7%94%A8%E5%B8%AE%E5%8A%A9/')"
              href="#"
            >点击查看帮助文档</a>
          </li>
          <li>
            提交问题：
            <a
              @click="openUrl('https://github.com/gaoyoubo/hexo-client/issues/new')"
              href="#"
            >点击提交问题</a>
          </li>
        </ul>
      </div>
      <div>
        <h3>站在巨人肩上</h3>
        <ul>
          <li>
            <a @click="openUrl('https://github.com/electron/electron')" href="#">electron</a>
          </li>
          <li>
            <a @click="openUrl('https://cn.vuejs.org')" href="#">Vue.js</a>
          </li>
          <li>
            <a
              @click="openUrl('https://github.com/SimulatedGREG/electron-vue')"
              href="#"
            >electron-vue</a>
          </li>
          <li>
            <a @click="openUrl('http://element-cn.eleme.io')" href="#">element-ui</a>
          </li>
        </ul>
      </div>
      <div>
        <h3>捐赠</h3>
        <div class="juanzeng">
          <img src="../assets/images/alipay.png" />
          <div class="txt">
            <span>支付宝</span>
          </div>
        </div>
        <div class="juanzeng">
          <img src="../assets/images/weixin.png" />
          <div class="txt">
            <span>微信</span>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="扫码进群" :visible.sync="qrcodeVisible" width="540px" height="740px">
      <img class="qrcode" src="../assets/images/qq.jpg" />
    </el-dialog>
  </el-main>
</template>

<script>
export default {
  data() {
    return {
      qrcodeVisible: false
    };
  },
  created() {},
  methods: {
    openUrl(url) {
      require("electron").shell.openExternal(url);
    },
    openQrcode() {
      this.qrcodeVisible = true;
    }
  }
};
</script>

<style scoped>
.about-content {
  margin: 50px;
  font-size: 15px;
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

span.qq {
  font-size: 15px;
  font-weight: bold;
}

.qq_qrcode {
  margin-left: 5px;
  font-size: 15px;
  font-weight: bold;
  color: red;
  cursor: pointer;
}

img.qrcode {
  width: 100%;
}
</style>
