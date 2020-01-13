<template>
  <div>
    <div class="icon"></div>
    <el-menu :collapse="true"
             @select="dispatch"
             default-active="main"
             background-color="#333"
             text-color="#fff"
             active-text-color="#ffd04b">
      <el-menu-item index="main">
        <i class="el-icon-document"></i>
        <span slot="title">{{$t('menuArticle')}}</span>
      </el-menu-item>
      <el-menu-item index="create">
        <i class="el-icon-edit"></i>
        <span slot="title">{{$t('menuCreate')}}</span>
      </el-menu-item>
      <el-menu-item index="settings">
        <i class="el-icon-setting"></i>
        <span slot="title">{{$t('menuSettings')}}</span>
      </el-menu-item>
      <el-menu-item index="about">
        <i class="el-icon-info"></i>
        <span slot="title">{{$t('menuAbout')}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },

    methods: {
      dispatch (index, path) {
        switch (index) {
          case 'main':
          case 'create':
          case 'settings':
          case 'about':
            this.$router.push({name: index})
            break
          default:
            console.log('dispatch: index=' + index + ', path=' + path)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.iconfont {
  font-size: 24px;
}
</style>