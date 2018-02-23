<template>
  <el-container>
    <el-header>
      <main-menu active="/settings"></main-menu>
    </el-header>
    <el-main>
      <el-form label-width="80px" :model="sysConfig">
        <el-tabs value="system" tab-position="left">
          <el-tab-pane name="system">
            <span slot="label"><i class="el-icon-setting"></i> 系统配置</span>
            <el-form-item label="Hexo目录" label-width="120px">
              <el-input v-model="sysConfig.base"/>
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
          <el-button type="success" icon="el-icon-check" @click="generate">生成</el-button>
          <el-button type="success" icon="el-icon-upload2" @click="deploy">发布</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
  import MainMenu from './MainMenu'
  import HexoClient from '@/HexoClient'

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
      HexoClient.dbGet('sysConfig').then(doc => {
        me.sysConfig = doc
      })
    },
    methods: {
      saveConfig () {
        var me = this
        HexoClient.dbSet('sysConfig', this.sysConfig).then(() => {
          me.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          })
        })
      },
      generate () {
        var loading = this.$loading({
          lock: true,
          text: '生成中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        window.hexo.call('generate').then(function () {
          loading.close()
          return window.hexo.exit()
        }).catch(function (err) {
          console.error(err)
          loading.close()
          return window.hexo.exit(err)
        })
      },
      deploy () {
        var loading = this.$loading({
          lock: true,
          text: '发布中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        window.hexo.call('deploy').then(function () {
          loading.close()
          return window.hexo.exit()
        }).catch(function (err) {
          console.error(err)
          loading.close()
          return window.hexo.exit(err)
        })
      }
    }
  }
</script>
