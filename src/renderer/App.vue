<template>
  <div id="app" :style="{'height': windowHeight}">
    <el-container v-if="inited">
      <el-header>
        <main-menu></main-menu>
      </el-header>
      <el-container>
        <router-view></router-view>
      </el-container>
    </el-container>

    <el-dialog title="请先填写正确的Hexo地址：" :visible.sync="dialogFormVisible" :modal="true"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="true"
               :before-close="beforeCloseDialog">
      <el-form>
        <el-form-item>
          <el-input v-model="path" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setSysConfig">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import MainMenu from './components/MainMenu'
  import configManager from '@/service/ConfigManager'
  import hexoManager from '@/service/HexoManager'

  export default {
    name: 'hexo-client',
    components: {MainMenu},
    data () {
      return {
        path: '',
        dialogFormVisible: false,
        inited: false,
        windowHeight: '300px' // 窗口高度
      }
    },

    mounted () {
      window.addEventListener('resize', this.resize)
      this.resize()
      this.init()
    },

    beforeDestroy () {
      window.removeEventListener('resize', this.resize)
      hexoManager.unwatch()
    },

    methods: {
      init () {
        var me = this
        var loading = this.$loading({
          lock: true,
          text: 'Loading...',
          spinner: 'el-icon-loading'
        })
        hexoManager.init().then(function () {
          me.inited = true
          loading.close()
        }, function (err) {
          console.log(err)
          me.dialogFormVisible = true
          loading.close()
        })
      },

      resize () {
        this.windowHeight = document.documentElement.clientHeight + 'px'
      },

      setSysConfig () {
        var me = this
        configManager.setSysConfig({path: me.path}).then(function () {
          me.dialogFormVisible = false
          me.init()
        })
      },
      beforeCloseDialog () {
        alert('请先填写正确的Hexo地址')
        return false
      }
    }
  }
</script>

<style>
  html, body {
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3", FontAwesome, sans-serif;
  }

  #app {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    box-sizing: border-box;
    min-width: 0;
  }

  .el-header {
    color: #333;
    line-height: 60px;
    padding: 0px;
  }

  .el-aside {
    color: #333;
  }

  /*以下是文章展示样式*/
  .article {
    position: relative;
    background: #fff;
    -webkit-transition: all 0.2s ease-in;
  }

  .article img {
    max-width: 100%;
  }

  .article a,
  .article a:visited {
    color: blue;
  }

  .article .article-inner {
    position: relative;
    margin-bottom: 10px;
  }

  .article .article-header {
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
  }

  .article .article-title {
    color: #696969;
    line-height: 35px;
    margin: 10px 0px 10px 0px;
    font-size: 26px;
  }

  .article .article-tag,
  .article .article-cat,
  .article .article-time {
    margin: 0px 5px;
    font-size: 14px;
    line-height: 1.5;
    color: #999;
  }

  .article-entry {
    font-family: Menlo, Monaco, "Andale Mono", "lucida console", "Courier New", monospace;
    font-size: 15px;
    line-height: 21px;
    padding: 0px;
  }

  .article-entry p {
    margin-top: 10px;
  }

  .article-entry p code, .article-entry li code {
    padding: 1px 3px;
    margin: 0 3px;
    background: #ddd;
    border: 1px solid #ccc;
    font-family: Menlo, Monaco, "Andale Mono", "lucida console", "Courier New", monospace;
    word-wrap: break-word;
    font-size: 14px;
  }

  .article-entry blockquote {
    border-left: 5px solid #ccc;
    padding: 15px 10px;
    margin: 0px 0px 0px 3px;
    border-left: 3px solid #657b83;
    background: #f6f6f6;
  }

  .article-entry blockquote p {
    margin: 0px;
  }

  .article-entry em {
    font-style: italic;
  }

  .article-entry ul li {
    display: block;
    margin: 5px 0px;
  }

  .article-entry ul li:before {
    content: "";
    width: 6px;
    height: 6px;
    border: 1px solid #999;
    border-radius: 10px;
    background: #aaa;
    display: inline-block;
    float: left;
    margin-right: 6px;
    margin-top: 6px;
  }

  .article-entry ul, .article-entry ol {
    font-size: 14px;
    margin: 10px 0px;
  }

  .article-entry li ul, .article-entry li ol {
    margin-left: 30px;
  }

  .article-entry li ul li:before, .article-entry li ol li:before {
    content: "";
    background: #dedede;
  }

  .article-entry h1 {
    margin-top: 30px;
  }

  .article-entry h2 {
    margin-top: 20px;
    font-weight: 300;
    color: #574C4C;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
  }

  .article-entry h3, .article-entry h4, .article-entry h5, .article-entry h6 {
    margin-top: 20px;
    font-weight: 300;
    color: #574C4C;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
  }

  .article-entry video {
    max-width: 100%;
  }

  .article-entry strong {
    font-weight: bold;
  }

  .article-entry .caption {
    display: block;
    font-size: 0.8em;
    color: #aaa;
  }

  .article-entry hr {
    height: 0;
    margin-top: 20px;
    margin-bottom: 20px;
    border-left: 0;
    border-right: 0;
    border-top: 1px solid #DDD;
    border-bottom: 1px solid #FFF;
  }

  .article-entry pre {
    font-size: 0.9em;
    line-height: 1.5;
    margin-top: 10px;
    padding: 5px 15px;
    overflow-x: auto;
    color: #657b83;
    font-size: 10px;
    border: 1px solid #ccc;
    text-shadow: 0 1px #444;
    font-family: Menlo, Monaco, "Andale Mono", "lucida console", "Courier New", monospace;
  }

  .article-entry pre code {
    font-size: 14px;
  }

  .article-entry table {
    width: 100%;
    border: 1px solid #dedede;
    margin: 15px 0;
    border-collapse: collapse;
  }

  .article-entry table tr, .article-entry table td {
    height: 35px;
  }

  .article-entry table thead tr {
    background: #f8f8f8;
  }

  .article-entry table tbody tr:hover {
    background: #efefef;
  }

  .article-entry table td, .article-entry table th {
    border: 1px solid #dedede;
    padding: 0 10px;
  }

  .article-entry figure table {
    border: none;
    width: auto;
    margin: 0;
  }

  .article-entry figure table tbody tr:hover {
    background: none;
  }

  .article-meta {
    width: 150px;
    font-size: 14px;
    text-align: right;
    position: absolute;
    right: 0;
    top: 23px;
    text-align: center;
    z-index: 1;
  }

  .article-meta time {
    color: #aaa;
  }

  .article-entry pre,
  .article-entry .highlight {
    background: #272822;
    margin: 10px 0;
    padding: 10px 10px;
    overflow: auto;
    color: #fff;
    font-size: 0.9em;
    line-height: 22.400000000000002px;
  }

  .article-entry .highlight .gutter pre,
  .article-entry .highlight .gutter pre .line,
  .article-entry .gist .gist-file .gist-data .line-numbers {
    color: #666;
  }

  .article-entry pre,
  .article-entry code {
    font-family: "Source Code Pro", Consolas, Monaco, Menlo, Consolas, monospace;
  }

  .article-entry code {
    background: #eee;
    padding: 0 0.3em;
    border: none;
  }

  .article-entry pre code {
    background: none;
    text-shadow: none;
    padding: 0;
    color: #fff;
  }

  .article-entry .highlight {
    border-radius: 4px;
  }

  .article-entry .highlight pre {
    border: none;
    margin: 0;
    padding: 0;
  }

  .article-entry .highlight table {
    margin: 0;
    width: auto;
  }

  .article-entry .highlight td {
    border: none;
    padding: 0;
  }

  .article-entry .highlight figcaption {
    line-height: 1em;
    margin-bottom: 1em;
  }

  .article-entry .highlight figcaption:before,
  .article-entry .highlight figcaption:after {
    content: "";
    display: table;
  }

  .article-entry .highlight figcaption:after {
    clear: both;
  }

  .article-entry .highlight figcaption a {
    float: right;
  }

  .article-entry .highlight .gutter pre {
    text-align: right;
    padding-right: 20px;
  }

  .article-entry .highlight .gutter pre .line {
    text-shadow: none;
  }

  .article-entry .highlight .line {
    color: #fff;
    min-height: 19px;
  }

  .article-entry .gist {
    margin: 0 -20px;
    border-style: solid;
    border-color: #ddd;
    border-width: 1px 0;
    background: #272822;
    padding: 15px 20px 15px 0;
  }

  .article-entry .gist .gist-file {
    border: none;
    font-family: "Source Code Pro", Consolas, Monaco, Menlo, Consolas, monospace;
    margin: 0;
  }

  .article-entry .gist .gist-file .gist-data {
    background: none;
    border: none;
  }

  .article-entry .gist .gist-file .gist-data .line-numbers {
    background: none;
    border: none;
    padding: 0 20px 0 0;
  }

  .article-entry .gist .gist-file .gist-data .line-data {
    padding: 0 !important;
  }

  .article-entry .gist .gist-file .highlight {
    margin: 0;
    padding: 0;
    border: none;
  }

  .article-entry .gist .gist-file .gist-meta {
    background: #272822;
    font: 0.85em "Helvetica Neue", Helvetica, Arial, sans-serif;
    text-shadow: 0 0;
    padding: 0;
    margin-top: 1em;
    margin-left: 20px;
  }

  .article-entry .gist .gist-file .gist-meta a {
    color: #258fb8;
    font-weight: normal;
  }

  .article-entry .gist .gist-file .gist-meta a:hover {
    text-decoration: underline;
  }

  pre .comment {
    color: #75715e;
  }

  pre .keyword,
  pre .function .keyword,
  pre .class .params {
    color: #66d9ef;
  }

  pre .tag,
  pre .doctype,
  pre .params,
  pre .function,
  pre .css .value {
    color: #fff;
  }

  pre .css ~ * .tag,
  pre .title,
  pre .at_rule,
  pre .at_rule .keyword,
  pre .preprocessor,
  pre .preprocessor .keyword {
    color: #f92672;
  }

  pre .attribute,
  pre .built_in,
  pre .class,
  pre .css ~ * .class,
  pre .function .title {
    color: #a6e22e;
  }

  pre .value,
  pre .string {
    color: #e6db74;
  }

  pre .number {
    color: #7163d7;
  }

  pre .id,
  pre .css ~ * .id {
    color: #fd971f;
  }
</style>
