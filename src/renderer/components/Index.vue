<style scoped>
</style>
<template>
  <div id="app">
    <Row>
      <Col span="6" v-for="post in posts" style="padding: 10px;">
        <Card>
          <div slot="extra">
            <Button type="primary" shape="circle" size="small" icon="edit"></Button>
            <Button type="warning" shape="circle" size="small" icon="trash-a"></Button>
          </div>
          <div>
            <p>{{ post.title }}</p>
            <p>{{ post.author }}</p>
            <p>{{ post.author }}</p>
            <p><Tag v-for="tag in post.tags">{{ tag }}</Tag></p>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import hexo from '../store/modules/Hexo'

  export default {
    data () {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }
      return {
        tableData: Array(20).fill(item),
        posts: []
      }
    },
    mounted () {
      var me = this
      hexo.listPostFiles().then(filenames => {
        filenames.forEach(filename => {
          hexo.readPost(filename).then(post => {
            me.posts.push(post)
            console.log(me.posts.length)
          })
        })
      })
    },
    methods: {
      copyright () {
        this.$store.commit('scanTags')
      }
    },
    components: {}
  }
</script>

<style>
</style>
