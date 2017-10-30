<template>
  <el-container>
    <el-aside :width="leftWidth" class="left">
      <div class="article-list-panel" v-for="post in posts" @click="edit(post.content)">
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
    <el-main class="right" :style="{'width': contentWidth}">
      <el-row style="width: 100%;">
        <el-col :span="24" style="margin: 0px;">
          <editor ref="editor" :editor-height="editorHeight"></editor>
        </el-col>
        <el-col :span="24">
          <el-button type="primary" style="float: right; margin-right: 10px;">保存</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import hexo from '@/store/modules/Hexo'
  import Editor from '@/components/Editor.vue'

  export default {
    data () {
      return {
        windowHeight: '300px', // 窗口高度
        leftWidth: '300px', // 侧边宽度
        contentWidth: '200px', // 内容宽度
        editorHeight: '300px', // 编辑器高度
        posts: []
      }
    },
    methods: {
      handleResize () {
        this.contentWidth = (document.documentElement.clientWidth - 320) + 'px'
        this.editorHeight = (document.documentElement.clientHeight - 180) + 'px'
      },

      edit (content) {
        var me = this
        me.$refs.editor.$emit('setContent', content)
      }
    },

    mounted () {
      this.handleResize()
      window.addEventListener('resize', this.handleResize)

      var me = this
      hexo.listPostFiles().then(filenames => {
        filenames.forEach(filename => {
          hexo.readPost(filename).then(post => {
            me.posts.push(post)
          })
        })
      })
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
  html, body {
    height: 100%;
    /*overflow: hidden;*/
    margin: 0px;
    padding: 0px;
  }

  .left {
    overflow-x: hidden;
    overflow-y: auto;
    background-color: rgb(238, 241, 246);
  }

  .right {
    padding: 0px 0px 0px 5px;
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