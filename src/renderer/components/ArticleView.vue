<template>
  <div>
    ArticleView {{ id }}
  </div>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data () {
      return {}
    }
  }
</script>

