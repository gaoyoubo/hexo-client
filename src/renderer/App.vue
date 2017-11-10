<template>
  <div id="app">
    <section class="is-vertical" :style="{'height': windowHeight}" v-if="sysInited">
      <header class="header">
        <page-header></page-header>
      </header>
      <router-view></router-view>
    </section>

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

  header {
    padding: 0 20px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    display: block;
    height: 60px;
  }

  aside {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  section {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-box-sizing: border-box;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    box-sizing: border-box;
  }

  section.is-vertical {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
  }

  main {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    box-sizing: border-box;
    overflow: auto;
    padding: 20px;
  }
</style>