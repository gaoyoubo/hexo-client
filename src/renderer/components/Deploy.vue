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
          this.commit('Commit at ' + this.dateFormat('yyyy-MM-dd HH:mm:ss', new Date()))
        } else {
          this.$notify({message: '资料库无变更', type: 'warning'})
        }
      },

      async isModified () {
        try {
          let statusSummary = await this.git().status()
          if (statusSummary.modified.length > 0) return true
          if (statusSummary.not_added.length > 0) return true
          return false
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
      },

      dateFormat (fmt, date) {
        var o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds(),
          'q+': Math.floor((date.getMonth() + 3) / 3),
          'S': date.getMilliseconds()
        }
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
          }
        }
        return fmt
      }

    }
  }
</script>

<style scoped>

</style>
