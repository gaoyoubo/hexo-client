<template>
  <el-main style="padding: 0px;">
    <el-form style="margin-top: 50px;" label-width="80px" :model="config">
      <el-form-item label="Hexo目录" label-width="120px">
        <el-input v-model="config.path"/>
      </el-form-item>
      <el-form-item label="七牛AK" label-width="120px">
        <el-input v-model="config.qiniuAccessKey"/>
      </el-form-item>
      <el-form-item label="七牛SK" label-width="120px">
        <el-input v-model="config.qiniuSecretKey"/>
      </el-form-item>
      <el-form-item label="七牛Bucket" label-width="120px">
        <el-input v-model="config.qiniuBucket"/>
      </el-form-item>
      <el-form-item label="七牛域名" label-width="120px">
        <el-input v-model="config.qiniuHost"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.sync="saveConfig">保存配置</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
  export default {
    data () {
      return {
        config: {
          base: '',
          qiniuAccessKey: '',
          qiniuSecretKey: '',
          qiniuBucket: '',
          qiniuHost: ''
        }
      }
    },
    created () {
      this.config = this.$store.state.Config.config
    },
    methods: {
      async saveConfig () {
        await this.$store.dispatch('Config/setConfig', this.config)
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success'
        })
      }
    }
  }
</script>
