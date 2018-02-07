<template>
  <el-container>
    <el-header>
      <main-menu active="/settings"></main-menu>
    </el-header>
    <el-main>
      配置
    </el-main>
  </el-container>
</template>

<script>
  import MainMenu from './MainMenu'
  export default {
    components: {MainMenu},
    data () {
      return {}
    }
  }
</script>

