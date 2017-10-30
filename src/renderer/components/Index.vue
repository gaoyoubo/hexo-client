<template>
  <div>
    <el-button type="primary" style="float: right; margin-right: 10px;" @click="gitTest">Git测试</el-button>
    我是首页
  </div>
</template>

<script>
  import hexo from '@/store/modules/Hexo'
  export default {
    data () {
      return {}
    },

    methods: {
      gitTest () {
        hexo.listPostFiles()
      }
    },

    beforeDestroy () {
    },

    components: {}
  }
</script>
