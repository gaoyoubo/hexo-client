<template>
  <el-aside class="sidebar" style="width: 64px;">
    <div class="icon"></div>
    <el-menu :router="true"
             :collapse="true"
             default-active="/main"
             background-color="#333"
             text-color="#fff"
             active-text-color="#ffd04b">
      <el-menu-item index="/main">
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
      <el-menu-item index="/about">
        <i class="el-icon-info"></i>
        <span slot="title">关于</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
  export default {
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

