<template>
  <div id="app">
    <!--
    <el-container :style="{'height': windowHeight, 'border': 'solid 1px red;'}" v-if="sysInited">
      <el-header class="header">
        <page-header></page-header>
      </el-header>

      <router-view></router-view>

    </el-container>
    -->

    <div :style="{'height': windowHeight, 'border': 'solid 1px red;'}" v-if="sysInited">
      <div class="header">
        <page-header></page-header>
      </div>

      <router-view></router-view>
    </div>

    <Modal v-model="showPathConfig" width="360" :closable="false" :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>请配置正确的路径</span>
      </p>
      <div style="text-align:center">
        <Input v-model="path" placeholder="请配置正确的Hexo路径"/>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="setPath"> 确 定 </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import PageHeader from '@/components/PageHeader.vue'

  export default {
    name: 'hexo-client',
    data () {
      return {
        windowHeight: '300px', // 窗口高度
        leftWidth: '300px', // 侧边宽度
        path: ''
      }
    },

    computed: {
      sysConfigInited: function () {
        return this.$store.getters.sysConfigInited
      },
      sysInited: function () {
        return this.$store.getters.sysInited
      },
      showPathConfig: function () {
        return !this.$store.getters.sysConfigInited
      }
    },

    methods: {
      handleResize () {
        this.windowHeight = document.documentElement.clientHeight + 'px'
      },
      setPath () {
        this.$store.dispatch('setPath', this.path)
      }
    },

    created () {
      this.$store.dispatch('init')
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