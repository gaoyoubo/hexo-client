<template>
  <el-container>
    <el-header>
      <main-menu active="/create"></main-menu>
    </el-header>
    <el-main>
      发表
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

