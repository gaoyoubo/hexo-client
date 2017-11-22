<template>
  <el-container>
    <el-main>
      <el-form label-width="80px" :model="sysConfig">
        <el-tabs value="qiniu" tab-position="left">
          <el-tab-pane label="七牛配置" name="qiniu">
            <el-form-item label="accessKey">
              <el-input v-model="sysConfig.accessKey"/>
            </el-form-item>
            <el-form-item label="secretKey">
              <el-input v-model="sysConfig.secretKey"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveConfig">保存</el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    data () {
      return {
        sysConfig: JSON.parse(JSON.stringify(this.$store.state.Hexo.sysConfig))
      }
    },
    methods: {
      saveConfig () {
        this.$store.dispatch('setSysConfig', this.sysConfig)
      }
    }
  }
</script>