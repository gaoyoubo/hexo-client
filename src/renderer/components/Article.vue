<template>
  <section>
    <aside class="left" width="300px;">
      <div class="article-list-panel" v-for="(post, index) in posts" @click="selectPost($event, post)" ref="post">
        <div class="article-list-item">
          <h4 class="article-title">{{ post.title }}</h4>
          <p class="article-desc"></p>
          <ul class="article-info">
            <li class="meta">{{ post.author }}</li>
            <li class="meta">{{ post.date }}</li>
          </ul>
        </div>
      </div>
    </aside>
    <section class="main" :style="{'width': contentWidth}">
      <Form ref="form" :model="curPost" :label-width="60" style="width: 100%;">
        <Row>
          <Col :span="12">
          <FormItem label="标题" prop="title">
            <Input v-model="curPost.title"></Input>
          </FormItem>
          </Col>

          <Col :span="12">
          <FormItem label="作者" prop="title">
            <Input v-model="curPost.author"></Input>
          </FormItem>
          </Col>
          </Col>
        </Row>

        <Row>
          <Col :span="24">
          <FormItem label="标签" prop="title">
            <Tag v-for="tag in curPost.tags" :key="tag" :name="tag" closable @on-close="delTag">{{ tag }}</Tag>
            <!--<Button icon="ios-plus-empty" type="dashed" size="small" @click="addTag">添加标签</Button>-->
            <AutoComplete
                :data="tags"
                :filter-method="filterTags"
                v-model="inputTagText"
                @on-select="addTag"
                @keyup.native.enter="inputTag"
                size="small"
                placeholder="Input tag"
                style="width:120px">
            </AutoComplete>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col :span="24" style="margin: 0px;">
          <editor ref="editor" :editor-height="editorHeight" :value="curPost.content"
                  v-model="curPost.content"></editor>
          </Col>
        </Row>

        <Row>
          <Col :span="24">
          <Button type="primary" icon="ios-compose" style="float: right; margin-right: 10px;" @click="writePost">发表
          </Button>
          </Col>
        </Row>
      </Form>
    </section>
  </section>
</template>

<script>
  import Editor from '@/components/Editor.vue'

  export default {
    data () {
      return {
        windowHeight: '300px', // 窗口高度
        contentWidth: '200px', // 内容宽度
        editorHeight: '300px', // 编辑器高度
        tags: [], // all tags
        curPost: {}, // 当前文章
        inputTagText: ''
      }
    },
    methods: {
      handleResize () {
        this.contentWidth = (document.documentElement.clientWidth - 320) + 'px'
        this.editorHeight = (document.documentElement.clientHeight - 280) + 'px'
      },

      /**
       * 选中文章
       * @param event
       * @param post
       */
      selectPost (event, post) {
        // 设置当前选中数据
        this.curPost = JSON.parse(JSON.stringify(post))
        // 设置选中样式
        this.$refs.post.forEach(item => {
          item.classList.remove('active')
        })
        event.currentTarget.classList.add('active')
      },

      /**
       * 发表文章
       */
      writePost () {
        this.$store.dispatch('writePost', this.curPost)
      },

      /**
       * search tags
       */
      filterTags (value, option) {
        return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
      },

      /**
       * 添加标签
       */
      addTag (tag) {
        var contains = false
        for (var i = 0; i < this.curPost.tags.length; i++) {
          if (this.curPost.tags[i].toUpperCase() === tag.toUpperCase()) {
            contains = true
            break
          }
        }
        if (contains) {
          this.$Message.warning('tag exists')
        } else {
          this.curPost.tags.push(tag)
        }
      },

      /**
       * input tag
       */
      inputTag () {
        this.addTag(this.inputTagText)
      },

      /**
       * 删除标签
       * @param event
       * @param name
       */
      delTag (event, name) {
        const index = this.curPost.tags.indexOf(name)
        this.curPost.tags.splice(index, 1)
      }
    },
    computed: {
      posts: function () {
        return this.$store.getters.posts
      }
    },
    mounted () {
      this.handleResize()
      window.addEventListener('resize', this.handleResize)

      this.tags = this.$store.state.Hexo.tags

      // 默认选中第一篇文章
      if (this.posts && this.posts.length > 0) {
        this.curPost = JSON.parse(JSON.stringify(this.posts[0]))
        this.$refs.post[0].classList.add('active')
      }
    },

    beforeDestroy () {
      window.removeEventListener('resize', this.handleResize)
    },

    components: {
      Editor
    }
  }
</script>

<style>
  .left {
    overflow-x: hidden;
    overflow-y: auto;
    background-color: rgb(238, 241, 246);
    width: 300px;
  }

  .main {
    padding: 10px 5px 5px 5px;
  }

  .article-list-panel.active {
    background-color: white;
  }

  .article-list-item {
    padding: 8px;
    position: relative;
    border-bottom: 1px solid rgba(110, 100, 102, 0.15);
    cursor: pointer;
  }

  .article-list-item .article-title {
    margin: 0px 0px 5px;
    font-weight: 400;
    font-size: 17px;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    word-wrap: break-word;
    word-break: break-all;
  }

  .article-list-item .article-desc {
    margin: 0px 0px 5px;
    color: #999999;
    font-size: 13px;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .article-list-item .article-info {
    margin: 0px;
    padding: 0px;
    font-size: 13px;
    color: #CECECE;
    line-height: 1em;
    list-style: none;
    overflow: hidden;
  }

  .article-list-item .article-info .meta {
    float: left;
    padding-right: 1em;
  }
</style>