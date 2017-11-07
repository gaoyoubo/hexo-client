<template>
  <div id="app">
    <el-container :style="{'height': windowHeight, 'border': 'solid 1px red;'}" v-if="!dialogFormVisible">
      <el-header class="header">
        <page-header></page-header>
      </el-header>

      <router-view></router-view>

    </el-container>

    <el-dialog title="请配置正确的路径" :visible.sync="dialogFormVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false"
               :center="true">
      <el-form>
        <el-form-item label="路径" label-width="50px">
          <el-input v-model="path" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setPath">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import PageHeader from '@/components/PageHeader.vue'
  // import { app, BrowserWindow } from 'electron'
  const electron = require('electron')

  export default {
    data () {
      return {
        windowHeight: '300px', // 窗口高度
        leftWidth: '300px', // 侧边宽度
        dialogFormVisible: false,
        path: ''
      }
    },

    methods: {
      handleResize () {
        this.windowHeight = document.documentElement.clientHeight + 'px'
      },
      setPath () {
        var me = this
        me.$store.dispatch('setPath', me.path, () => {
          debugger
          console.log(electron)
        })
      }
    },

    beforeCreate () {
      this.$store.dispatch('initConfig')
      this.$store.dispatch('initHexo')
    },

    created () {
      if ((!this.$store.state.Config.sysConfig) || (!this.$store.state.Config.sysConfig.path)) {
        this.dialogFormVisible = true
      }
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