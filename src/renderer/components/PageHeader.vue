<template>
  <div>
    <el-menu
        :default-active="activeIndex"
        :router="true"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/article">文章</el-menu-item>
      <el-menu-item index="/article/create">发表</el-menu-item>
      <el-menu-item index="/config">配置</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        activeIndex: '/article'
      }
    },
    methods: {
      handleSelect (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>