<template>
  <el-container>
    <el-aside :width="leftWidth" class="left">
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
    </el-aside>
    <el-main class="main" :style="{'width': contentWidth}">
      <el-form ref="form" :model="curPost" :rules="validateRules" label-width="60px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="curPost.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="curPost.author"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="标签" prop="tags">
              <el-select v-model="curPost.tags" multiple filterable allow-create placeholder="请选择文章标签"
                         style="width: 100%;">
                <el-option v-for="tag in tags" :key="tag" :label="tag" :value="tag"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="margin: 0px;">
            <el-form-item label="" prop="content">
              <editor ref="editor" :editor-height="editorHeight" :value="curPost.content"
                      v-model="curPost.content"></editor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" style="float: right; margin-right: 10px;" @click="updatePost">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
  import Editor from '@/components/Editor.vue'

  export default {
    data () {
      return {
        windowHeight: '300px', // 窗口高度
        leftWidth: '300px', // 侧边宽度
        contentWidth: '200px', // 内容宽度
        editorHeight: '300px', // 编辑器高度
        tags: [],
        curPost: {}, // 当前文章
        originPost: {}, // 保留一份没修改的文章对象
        validateRules: {
          title: [
            {required: true, message: '请输入文章标题', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入文章内容', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleResize () {
        this.contentWidth = (document.documentElement.clientWidth - 320) + 'px'
        this.editorHeight = (document.documentElement.clientHeight - 320) + 'px'
      },

      selectPost (event, post) {
        // 设置当前选中数据
        this.curPost = JSON.parse(JSON.stringify(post))
        this.originPost = JSON.parse(JSON.stringify(post))
        // 设置选中样式
        this.$refs.post.forEach(item => {
          item.classList.remove('active')
        })
        event.currentTarget.classList.add('active')
      },

      updatePost () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$store.dispatch('updatePost', {
              originPost: this.originPost,
              post: this.curPost
            })
          }
        })
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
        this.originPost = JSON.parse(JSON.stringify(this.posts[0]))
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