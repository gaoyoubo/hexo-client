<template>
  <div id="app">
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
        inited: false
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
    }
  }
</script>

<style>
  /* CSS */
</style>
