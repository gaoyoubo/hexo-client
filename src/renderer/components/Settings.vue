<template>
  <el-main class="setting-main">
    <el-form label-width="120px" label-position="left" :model="config">
      <el-form-item label="Hexo目录">
        <el-input v-model="config.path" style="width:100%"/>
      </el-form-item>
      <el-form-item label="语言">
        <el-select v-model="config.language" default-first-option placeholder="请选择语言" style="width:100%">
          <el-option label="英语" value="en"></el-option>
          <el-option label="汉语" value="zh"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片上传服务">
        <el-select v-model="config.uploadType" default-first-option placeholder="请选择图片上传服务" style="width:100%">
          <el-option label="sm.ms" value="sm.ms"></el-option>
          <el-option label="七牛" value="qiniu"></el-option>
        </el-select>
      </el-form-item>
      <transition name="el-zoom-in-top">
        <div v-show="config.uploadType==='qiniu'">
          <el-form-item label="七牛存储区域">
            <el-select v-model="config.qiniuZone" default-first-option placeholder="请选择机房" style="width:100%">
              <el-option label="华东" value="huadong"></el-option>
              <el-option label="华北" value="huabei"></el-option>
              <el-option label="华南" value="huanan"></el-option>
              <el-option label="北美" value="beimei"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="七牛AK">
            <el-input v-model="config.qiniuAccessKey" style="width:100%"/>
          </el-form-item>
          <el-form-item label="七牛SK">
            <el-input v-model="config.qiniuSecretKey" style="width:100%"/>
          </el-form-item>
          <el-form-item label="七牛Bucket">
            <el-input v-model="config.qiniuBucket" style="width:100%"/>
          </el-form-item>
          <el-form-item label="七牛域名">
            <el-input v-model="config.qiniuHost" style="width:100%"/>
          </el-form-item>
        </div>
      </transition>
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
          language: '',
          uploadType: '',
          qiniuZone: '',
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
        let config = this.$store.state.Config.config
        let message = '保存成功'
        if (config.language !== this.config.language) {
          message = '保存成功，变更语言需要重启后生效。'
        }
        await this.$store.dispatch('Config/setConfig', this.config)
        this.$notify.success({
          title: '成功',
          message: message
        })
      }
    }
  }
</script>

<style scoped>
  .setting-main .el-form {
    margin-top: 50px;
    width: 650px;
  }
</style>
