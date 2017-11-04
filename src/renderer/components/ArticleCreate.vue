<template>
  <el-container>
    <el-main class="main">
      <el-form ref="form" :model="post" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="标题" prop="title">
              <el-input v-model="post.title"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="标签" prop="title">
              <el-select v-model="post.tags" multiple filterable allow-create placeholder="请选择文章标签">
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="作者" prop="title">
              <el-input v-model="post.author"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容">
              <editor ref="editor" editor-height="400px" input-active-name="edit" :value="post.content"
                      v-model="post.content"></editor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
  import hexo from '@/store/modules/Hexo'
  import Editor from '@/components/Editor.vue'

  export default {
    data () {
      return {
        config: {},
        post: {
          title: '',
          content: '',
          author: '',
          tags: []
        }
      }
    },
    methods: {},

    mounted () {
      this.config = hexo.getConfig()
      this.post.author = this.config.author
    },

    beforeDestroy () {
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
    padding: 10px 0px 0px 5px;
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