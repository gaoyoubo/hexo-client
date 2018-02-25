<template>
  <div id="app" :style="{'height': windowHeight}">
    <router-view v-if="inited"></router-view>

    <el-dialog title="请先填写正确的Hexo地址：" :visible.sync="dialogFormVisible" :modal="true"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="true"
               :before-close="beforeCloseDialog">
      <el-form>
        <el-form-item>
          <el-input v-model="base" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setBase">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import HexoClient from '@/HexoClient'

  var Hexo = require('hexo')
  export default {
    name: 'hexo-client',
    data () {
      return {
        base: '',
        dialogFormVisible: false,
        inited: false,
        windowHeight: '300px' // 窗口高度
      }
    },

    beforeCreate () {

    },

    mounted () {
      window.addEventListener('resize', this.handleResize)
      this.handleResize()
      this.init()
    },

    beforeDestroy () {
      window.removeEventListener('resize', this.handleResize)
      window.hexo.unwatch()
    },

    methods: {
      handleResize () {
        this.windowHeight = document.documentElement.clientHeight + 'px'
      },
      init () {
        var me = this
        HexoClient.dbGet('sysConfig').then(sysConfig => {
          if (sysConfig && sysConfig.base) {
            me.initHexo(sysConfig.base)
          } else {
            me.dialogFormVisible = true
          }
        })
      },
      initHexo (path) {
        var me = this
        var loading = this.$loading({
          lock: true,
          text: 'Loading...',
          spinner: 'el-icon-loading'
        })

        window.hexo = new Hexo(path, {
          debug: false
        })
        console.log('1. hexo init...')
        window.hexo.init().then(function () {
          console.log('2. hexo init...finished')
          console.log('3. hexo loading...')
          window.hexo.watch().then(function () {
            console.log('4. hexo loading...finished')
            me.inited = true
            loading.close()
          })
        })
      },
      setBase () {
        this.dialogFormVisible = false
        var me = this
        var base = me.base
        HexoClient.dbSetProperty('sysConfig', 'base', base).then(doc => {
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
</style>
