<template>
  <div id="app" :style="{'height': windowHeight}">
    <router-view v-if="inited"></router-view>
  </div>
</template>

<script>
  var Hexo = require('hexo')
  var base = '/Users/gaoyoubo/code/node/blog.mspring.org'
  export default {
    name: 'hexo-client',

    data () {
      return {
        inited: false,
        windowHeight: '300px' // 窗口高度
      }
    },

    beforeCreate () {
      var me = this
      var loading = this.$loading({
        lock: true,
        text: 'Loading...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      window.hexo = new Hexo(base, {
        debug: true
      })
      console.log('hexo init...')
      window.hexo.init().then(function () {
        console.log('hexo init...finished')
        console.log('hexo loading...')
        window.hexo.watch().then(function () {
          console.log('hexo loading...finished')
          me.inited = true
          loading.close()
        })
      })
    },

    mounted () {
      window.addEventListener('resize', this.handleResize)
      this.handleResize()
    },

    beforeDestroy () {
      window.removeEventListener('resize', this.handleResize)
      window.hexo.unwatch()
    },

    methods: {
      handleResize () {
        this.windowHeight = document.documentElement.clientHeight + 'px'
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
