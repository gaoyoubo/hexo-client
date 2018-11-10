<template>
  <div id="app" :style="{'height': windowHeight}">
    <el-container v-if="inited">

      <main-menu></main-menu>

      <el-main style="width: 100%; height: 100%; padding: 0px;">
        <router-view></router-view>
      </el-main>
    </el-container>

    <el-dialog title="请先填写正确的Hexo安装目录：" :visible.sync="dialogFormVisible" :modal="true"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="true"
               :before-close="beforeCloseDialog">
      <el-form>
        <el-form-item>
          <el-button type="primary" @click="showFileDialog">选择目录</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="path" :disabled="true" auto-complete="off" placeholder="请选择正确的Hexo安装目录"></el-input>
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

  export default {
    name: 'hexo-client',
    components: {MainMenu},
    data () {
      return {
        path: '',
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
      this.$store.dispatch('Hexo/destroy')
    },

    methods: {
      async init () {
        let loading = this.$loading({lock: true, text: 'Loading...', spinner: 'el-icon-loading'})
        try {
          await this.$store.dispatch('Config/initConfig')
          await this.$store.dispatch('Hexo/init')
        } finally {
          loading.close()
        }
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
      },

      showFileDialog () {
        var me = this
        const dialog = require('electron').remote.dialog
        dialog.showOpenDialog({properties: ['openDirectory']}, (filename) => {
          if (filename.length === 1) {
            me.path = filename[0]
          }
        })
      }
    },

    computed: {
      inited () {
        return this.$store.state.Hexo.inited
      },
      dialogFormVisible () {
        return this.$store.state.Hexo.dialogFormVisible
      }
    }
  }
</script>
