<template>
  <el-container>
    <el-header>
      <main-menu active="/settings"></main-menu>
    </el-header>
    <el-main>
      <el-form label-width="80px" :model="sysConfig">
        <el-tabs value="qiniu" tab-position="left">
          <el-tab-pane label="七牛配置" name="qiniu">
            <el-form-item label="AccessKey">
              <el-input v-model="sysConfig.qiniuAccessKey"/>
            </el-form-item>
            <el-form-item label="SecretKey">
              <el-input v-model="sysConfig.qiniuSecretKey"/>
            </el-form-item>
            <el-form-item label="Bucket">
              <el-input v-model="sysConfig.qiniuBucket"/>
            </el-form-item>
            <el-form-item label="域名">
              <el-input v-model="sysConfig.qiniuHost"/>
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
  import MainMenu from './MainMenu'
  import HexoClient from '@/HexoClient'

  export default {
    components: {MainMenu},
    data () {
      return {
        sysConfig: {
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
      }
    }
  }
</script>

