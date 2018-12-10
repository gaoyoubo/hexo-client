<template>
  <el-main>
    <el-form style="margin-top: 50px;" label-width="80px" :model="config">
      <el-form-item label="Hexo目录" label-width="120px">
        <el-input v-model="config.path"/>
      </el-form-item>
      <el-form-item label="七牛存储区域" label-width="120px">
        <el-select v-model="config.qiniuZone" default-first-option placeholder="请选择机房">
          <el-option label="华东" value="huadong"></el-option>
          <el-option label="华北" value="huabei"></el-option>
          <el-option label="华南" value="huanan"></el-option>
          <el-option label="北美" value="beimei"></el-option>
        </el-select>
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
