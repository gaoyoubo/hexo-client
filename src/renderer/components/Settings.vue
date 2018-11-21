<template>
  <el-main style="padding: 0px;">
    <el-form style="margin-top: 50px;" label-width="80px" :model="sysConfig">
      <el-form-item label="Hexo目录" label-width="120px">
        <el-input v-model="sysConfig.path"/>
      </el-form-item>
      <el-form-item label="七牛AK" label-width="120px">
        <el-input v-model="sysConfig.qiniuAccessKey"/>
      </el-form-item>
      <el-form-item label="七牛SK" label-width="120px">
        <el-input v-model="sysConfig.qiniuSecretKey"/>
      </el-form-item>
      <el-form-item label="七牛Bucket" label-width="120px">
        <el-input v-model="sysConfig.qiniuBucket"/>
      </el-form-item>
      <el-form-item label="七牛域名" label-width="120px">
        <el-input v-model="sysConfig.qiniuHost"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveConfig">保存配置</el-button>
        <el-button type="primary" icon="el-icon-upload" @click="generateAndDeploy">生成发布</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
  import configManager from '@/service/ConfigManager'

  export default {
    data () {
      return {
        sysConfig: {
          base: '',
          qiniuAccessKey: '',
          qiniuSecretKey: '',
          qiniuBucket: '',
          qiniuHost: ''
        }
      }
    },
    created () {
      var me = this
      configManager.getSysConfig().then(sysConfig => {
        me.sysConfig = sysConfig
      })
    },
    methods: {
      saveConfig () {
        var me = this
        configManager.setSysConfig(this.sysConfig).then(() => {
          me.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          })
        })
      },
      async generateAndDeploy () {
        let loading = this.$loading({
          lock: true,
          text: '生成中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        let hexo = this.$store.state.Hexo.instance
        try {
          await hexo.call('generate', {})
          loading.text = '发布中...'
          try {
            await hexo.call('deploy', {})
            this.$notify.success('发布成功')
          } catch (e) {
            console.error(e)
            this.$notify.error('发布失败')
          } finally {
            loading.close()
          }
        } catch (err) {
          loading.close()
          console.error(err)
          this.$notify.error('生成失败')
        }
      }
    }
  }
</script>
