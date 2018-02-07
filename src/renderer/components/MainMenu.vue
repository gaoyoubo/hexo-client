<template>
  <el-menu
      :default-active="active"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
    <el-menu-item index="posts">文章</el-menu-item>
    <el-menu-item index="settings">配置</el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    props: {
      active: {
        type: String,
        default: 'posts'
      }
    },
    data () {
      return {}
    }
  }
</script>

<style>
  html, body {
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
  }
</style>

