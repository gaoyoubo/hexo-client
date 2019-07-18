<template>
  <el-dialog :title="$t('selectHexoPathTitle')" :visible.sync="dialogFormVisible" :modal="true"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :show-close="false">
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="showFileDialog">{{$t('selectHexoPath')}}</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="path" :disabled="true" auto-complete="off" :placeholder="$t('selectHexoPathTitle')"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="setConfig">{{$t('okBtn')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'ChoosePath',
    data () {
      return {
        path: ''
      }
    },
    methods: {
      showFileDialog () {
        var me = this
        const dialog = require('electron').remote.dialog
        dialog.showOpenDialog({properties: ['openDirectory']}, (filename) => {
          if (filename.length === 1) {
            me.path = filename[0]
          }
        })
      },
      async setConfig () {
        let config = this.$store.state.Config.config
        config.path = this.path
        await this.$store.dispatch('Config/setConfig', config)
        await this.$store.dispatch('Hexo/start')
      }
    },
    computed: {
      dialogFormVisible () {
        return this.$store.state.UiStatus.dialogFormVisible
      }
    }
  }
</script>

<style scoped>

</style>
