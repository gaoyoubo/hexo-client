<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
  }

  .layout-content {
    min-height: 200px;
    margin: 0px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
</style>
<template>
  <div class="layout">
    <div class="layout-content">
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
    <div class="layout-copy">
      <a @click="copyright">http://www.mspring.org</a>
    </div>
  </div>
</template>

<script>
  import hexo from '../store/modules/Hexo'

  export default {
    data () {
      return {
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
        this.$electron.shell.openExternal('http://www.mspring.org')
      }
    },
    components: {}
  }
</script>

<style>
</style>
