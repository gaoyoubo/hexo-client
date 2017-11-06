<template>
  <div id="app">
    <el-container :style="{'height': windowHeight, 'border': 'solid 1px red;'}">
      <el-header class="header">
        <page-header></page-header>
      </el-header>

      <router-view></router-view>

    </el-container>
  </div>
</template>

<script>
  import PageHeader from '@/components/PageHeader.vue'

  export default {
    data () {
      return {
        windowHeight: '300px', // 窗口高度
        leftWidth: '300px', // 侧边宽度
        posts: []
      }
    },

    methods: {
      handleResize () {
        this.windowHeight = document.documentElement.clientHeight + 'px'
      }
    },

    created () {
      this.$store.dispatch('initHexo')
    },

    mounted () {
      this.handleResize()
      window.addEventListener('resize', this.handleResize)
    },

    beforeDestroy () {
      window.removeEventListener('resize', this.handleResize)
    },

    components: {
      PageHeader
    }
  }
</script>
<style>
  html, body {
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
  }

  ::-webkit-scrollbar {
    width: 14px;
    height: 14px;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-thumb {
    border-radius: 999px;
    border: 5px solid transparent;
  }

  ::-webkit-scrollbar-track {
    box-shadow: 1px 1px 5px rgba(0, 0, 0, .2) inset;
  }

  ::-webkit-scrollbar-thumb {
    min-height: 20px;
    background-clip: content-box;
    box-shadow: 0 0 0 5px rgba(0, 0, 0, .2) inset;
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }

  .header {
    padding: 0px;
  }
</style>