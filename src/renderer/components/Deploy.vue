<template>
  <el-button style="margin: 0px;" size="mini" icon="el-icon-upload" type="success"
             @click.sync="deploy">发布
  </el-button>
</template>

<script>
  export default {
    name: 'deploy',
    data () {
      return {}
    },
    mounted () {
    },
    methods: {
      async deploy () {
        if (await this.isModified()) {
          this.commit('simple-git')
        } else {
          this.$notify({message: '资料库无变更', type: 'warning'})
        }
      },

      async isModified () {
        try {
          let statusSummary = await this.git().status()
          return statusSummary.modified.length > 0
        } catch (e) {
          console.error(e)
          return false
        }
      },

      async commit (msg) {
        let loading = this.$loading({
          lock: true,
          text: '发布中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        try {
          await this.git().add('./*')
          await this.git().commit(msg)
          await this.git().push('origin', 'master')
          this.$notify({message: '发布成功', type: 'success'})
        } catch (e) {
          console.log(e)
          this.$notify.error({message: '发布失败'})
        } finally {
          loading.close()
        }
      },

      git () {
        let workingDir = this.workingDir()
        return require('simple-git/promise')(workingDir)
      },

      workingDir () {
        let config = this.$store.state.Config.config
        return config.path
      }

    }
  }
</script>

<style scoped>

</style>
