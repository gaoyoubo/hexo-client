<template>
  <el-main>
    <el-form label-width="80px" :model="sysConfig">
      <el-tabs value="system" tab-position="left">
        <el-tab-pane name="system">
          <span slot="label"><i class="el-icon-setting"></i> 系统配置</span>
          <el-form-item label="Hexo目录" label-width="120px">
            <el-input v-model="sysConfig.path"/>
          </el-form-item>
          <el-form-item label="七牛AccessKey" label-width="120px">
            <el-input v-model="sysConfig.qiniuAccessKey"/>
          </el-form-item>
          <el-form-item label="七牛SecretKey" label-width="120px">
            <el-input v-model="sysConfig.qiniuSecretKey"/>
          </el-form-item>
          <el-form-item label="七牛Bucket" label-width="120px">
            <el-input v-model="sysConfig.qiniuBucket"/>
          </el-form-item>
          <el-form-item label="七牛域名" label-width="120px">
            <el-input v-model="sysConfig.qiniuHost"/>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" @click="saveConfig">保存</el-button>
        <!--<el-button type="success" icon="el-icon-check" @click="generate">生成</el-button>-->
        <!--<el-button type="success" icon="el-icon-upload2" @click="deploy">发布</el-button>-->
        <el-button type="primary" icon="el-icon-upload" @click="generateAndDeploy">生成发布</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
  import MainMenu from './MainMenu'
  import configManager from '@/service/ConfigManager'

  export default {
    components: {MainMenu},
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
      generateAndDeploy () {
        var me = this
        var loading = this.$loading({
          lock: true,
          text: '生成中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        window.hexo.call('generate', {}, function (err) {
          if (err) {
            loading.close()
            console.error(err)
            me.$notify.error('生成成功')
          } else {
            loading.text = '发布中...'
            window.hexo.call('deploy', {}, function (err) {
              loading.close()
              if (err) {
                console.error(err)
                me.$notify.error('发布失败')
              } else {
                me.$notify.success('发布成功')
              }
            })
          }
        })
      },
      generate () {
        var me = this
        var loading = this.$loading({
          lock: true,
          text: '生成中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        window.hexo.call('generate', {}, function (err) {
          loading.close()
          if (err) {
            console.error(err)
            me.$notify.error('生成成功')
          } else {
            me.$notify.success('生成成功')
          }
        })
      },
      deploy () {
        var me = this
        var loading = this.$loading({
          lock: true,
          text: '发布中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        window.hexo.call('deploy', {}, function (err) {
          loading.close()
          if (err) {
            console.error(err)
            me.$notify.error('发布失败')
          } else {
            me.$notify.success('发布成功')
          }
        })
      }
    }
  }
</script>
