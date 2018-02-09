<template>
  <el-container>
    <el-header>
      <main-menu active="/create"></main-menu>
    </el-header>
    <el-main>

      <el-form :model="postForm" :rules="postFormRules" ref="postForm" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="postForm.title"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-tabs value="edit" @tab-click="preview">
            <el-tab-pane label="编辑" name="edit">
              <textarea v-model="postForm.content" class="content" placeholder="请输入内容"></textarea>
            </el-tab-pane>
            <el-tab-pane label="预览" name="preview">
              <div class="preview" v-html="previewContent"></div>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <el-select v-model="postForm.tags" multiple filterable allow-create default-first-option
                     placeholder="请选择标签">
            <el-option v-for="tag in tags"
                       :key="tag"
                       :label="tag"
                       :value="tag">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类" prop="categories">
          <el-select v-model="postForm.categories" multiple filterable allow-create default-first-option
                     placeholder="请选择分类">
            <el-option v-for="tag in tags"
                       :key="tag"
                       :label="tag"
                       :value="tag">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm()">立即创建</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>

    </el-main>
  </el-container>
</template>

<script>
  import MainMenu from './MainMenu'

  export default {
    components: {MainMenu},
    data () {
      return {
        postForm: {
          title: '',
          content: '',
          tags: [],
          categories: []
        },
        postFormRules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
            {min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ]
        },
        tags: [],
        categories: [],
        previewContent: ''
      }
    },
    mounted () {
      window.hexo.locals.get('tags').forEach(tag => this.tags.push(tag.name))
      window.hexo.locals.get('categories').forEach(category => this.categories.push(category.name))
    },
    methods: {
      preview (tabPanel) {
        if (tabPanel.name === 'preview') {
          var me = this
          if (me.postForm.content) {
            window.hexo.post.render(new Date().getTime() + '.md', {content: this.postForm.content})
              .then(function (previewData) {
                me.previewContent = previewData.content
              })
          } else {
            me.previewContent = ''
          }
        }
      },
      submitForm () {
        var me = this
        this.$refs.postForm.validate((valid) => {
          if (valid) {
            window.hexo.post.create(me.postForm, false).then(function () {
              me.$notify({
                title: '成功',
                message: '发布成功',
                type: 'success'
              })
              me.$router.replace('/posts')
            }, function () {
              me.$notify.error({
                title: '错误',
                message: '发布失败'
              })
            })
          } else {
            me.$notify.error({
              title: '错误',
              message: '表单验证失败'
            })
            return false
          }
        })
      },
      resetForm () {
        this.$refs.postForm.resetFields()
      }
    }
  }
</script>

<style scoped>
  .content {
    height: 400px;
    width: 100%;
    display: block;
    resize: vertical;
    padding: 5px 15px;
    line-height: 1.5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: inherit;
    color: #606266;
    background: #fff none;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    font-family: 'Monaco', courier, monospace;
  }

  .preview {
    height: 400px;
    width: 100%;
    overflow: auto;
    border: 1px solid #ccc;
    padding: 3px 10px;
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
  }
</style>
