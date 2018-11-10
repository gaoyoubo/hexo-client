<template>
  <div class="dragable dragarea"
       :style="{width: '100%', height: height + 'px'}"></div>
</template>

<script>
  export default {
    props: {
      height: {
        type: Number,
        default: 30
      }
    },
    data () {
      return {}
    },
    created () {
    },
    methods: {}
  }
</script>

<style scoped>
  .dragarea {
    z-index: 999;
    position: absolute;
  }
</style>
