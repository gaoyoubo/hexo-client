<template>
  <div class="box">

    <a class="button is-primary">Primary</a>
    <a class="button is-link">Link</a>
    <a class="button is-info">Info</a>
    <a class="button is-success">Success</a>
    <a class="button is-warning">Warning</a>
    <a class="button is-danger" @click="open">Danger Test</a>

  </div>
</template>

<script>
  // import fs from 'fs'
  export default {
    name: 'landing-page',
    components: {},
    methods: {
      open () {
        this.$store.commit('scanTags')
        // this.$electron.shell.openExternal('http://www.mspring.org')
      }
    }
  }
</script>

<style>
</style>
