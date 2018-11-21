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
        <span slot="title">文章</span>
      </el-menu-item>
      <el-menu-item index="create">
        <i class="el-icon-edit"></i>
        <span slot="title">发表</span>
      </el-menu-item>
      <el-menu-item index="search">
        <i class="el-icon-search"></i>
        <span slot="title">搜索</span>
      </el-menu-item>
      <el-menu-item index="settings">
        <i class="el-icon-setting"></i>
        <span slot="title">配置</span>
      </el-menu-item>
      <el-menu-item index="about">
        <i class="el-icon-info"></i>
        <span slot="title">关于</span>
      </el-menu-item>
    </el-menu>

    <search/>
  </div>
</template>

<script>
  import Search from './Search'

  export default {
    components: {Search},
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
          case 'search':
            this.$store.dispatch('Search/show')
            break
          default:
            console.log('dispatch: index=' + index + ', path=' + path)
        }
      }
    }
  }
</script>
