<template>
  <el-menu
      :default-active="active"
      :router="true"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
    <el-menu-item index="/posts">
      <i class="el-icon-document"></i>
      <span slot="title">文章</span>
    </el-menu-item>
    <el-menu-item index="/create">
      <i class="el-icon-edit"></i>
      <span slot="title">发表</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="el-icon-setting"></i>
      <span slot="title">配置</span>
    </el-menu-item>
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

