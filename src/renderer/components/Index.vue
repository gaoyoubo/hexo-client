<template>
  <div>
    <el-button type="primary" style="float: right; margin-right: 10px;" @click="test">test</el-button>
    我是首页
  </div>
</template>

<script>
  import Datastore from '../Datastore'
  import { remote } from 'electron'

  export default {
    data () {
      return {}
    },

    methods: {
      test () {
      }
    },

    beforeDestroy () {
    },

    components: {}
  }
</script>
