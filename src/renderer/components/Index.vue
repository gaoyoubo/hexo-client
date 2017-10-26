<template>
  <div class="box">

    <a class="button is-primary">Primary</a>
    <a class="button is-link">Link</a>
    <a class="button is-info">Info</a>
    <a class="button is-success">Success</a>
    <a class="button is-warning">Warning</a>
    <a class="button is-danger" @click="open">Danger Test</a>

    <section class="section">
      <div class="container">
        <h1 class="title">Section</h1>
        <h2 class="subtitle">
          A simple container to divide your page into <strong>sections</strong>, like the one you're currently reading
        </h2>
      </div>
    </section>

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
