<template>
  <div>
    <Menu mode="horizontal" theme="light" :active-name="activeIndex" @on-select="handleSelect">
      <!--
      <MenuItem name="/">
        <Icon type="ios-home"></Icon>
        首页
      </MenuItem>
      -->
      <MenuItem name="/article">
        <Icon type="ios-paper"></Icon>
        文章
      </MenuItem>
      <MenuItem name="/article/create">
        <Icon type="ios-compose"></Icon>
        发表
      </MenuItem>
      <!--
      <MenuItem name="/config">
        <Icon type="ios-cog"></Icon>
        配置
      </MenuItem>
      -->
    </Menu>
  </div>
</template>

<script>
  import router from '@/router'

  export default {
    data () {
      return {
        activeIndex: '/article'
      }
    },
    methods: {
      handleSelect (name) {
        router.push(name)
      }
    }
  }
</script>