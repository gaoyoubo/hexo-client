<template>
  <el-main>

    <el-form :model="postForm" :rules="postFormRules" ref="postForm" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="postForm.title" :readonly="true" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="内容" prop="content" v-loading="uploading" :element-loading-text="uploadingText">
        <mavon-editor ref="editor" v-model="postForm.content" :toolbars="toolbars" :ishljs = "true"
                      @imgsAdd="imgsAdd" @fullScreen="fullScreen"  @save="submitForm"
                      @change="formChanged = true"
                      :style="{height: contentHeight}" :boxShadow="false"/>
      </el-form-item>

      <el-form-item label="标签" prop="tags">
        <el-select v-model="postForm.tags" multiple filterable allow-create default-first-option
                   style="width:100%;" placeholder="请选择标签" @input="formChanged = true">
          <el-option v-for="tag in tags"
                     :key="tag"
                     :label="tag"
                     :value="tag">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="分类" prop="categories">
        <el-select v-model="postForm.categories" multiple filterable allow-create default-first-option
                   style="width:100%;" placeholder="请选择分类" @input="formChanged = true">
          <el-option v-for="category in categories"
                     :key="category"
                     :label="category"
                     :value="category">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-form-item style="display:inline-block;">
          <el-button type="primary" @click="submitForm()">保存修改</el-button>
        </el-form-item>
        <el-form-item label="开启文章目录" style="display:inline-block;">
          <el-switch v-model="postForm.toc" @input="formChanged = true"></el-switch>
        </el-form-item>
      </el-form-item>
    </el-form>

  </el-main>
</template>

<script>
  import MainMenu from './MainMenu'
  import qiniuManager from '@/service/QiniuManager'
  import when from 'when'

  export default {
    components: {MainMenu},
    data () {
      return {
        postForm: {
          title: '',
          content: '',
          tags: [],
          categories: [],
          date: '',
          toc: false
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
        uploading: false,
        uploadingText: 'loading...',
        contentHeight: '',
        formChanged: false,
        fullScreenFlag: false,
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          // readmodel: true, // 沉浸式阅读
          // htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          // trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true // 预览
        }
      }
    },
    mounted () {
      this.resize()
      window.addEventListener('resize', this.resize)
      window.hexo.locals.get('tags').forEach(tag => this.tags.push(tag.name))
      window.hexo.locals.get('categories').forEach(category => this.categories.push(category.name))

      var postId = this.$route.params.postId
      var post = window.hexo.locals.get('posts').findOne({_id: postId})

      var me = this
      var keys = Object.keys(post)
      keys.forEach(key => {
        switch (key) {
          case 'title':
            me.postForm.title = post.title.trim()
            break
          case '_content':
            me.postForm.content = post._content.trim()
            break
          case 'tags':
            post.tags.forEach(tag => {
              me.postForm.tags.push(tag.name)
            })
            break
          case 'categories':
            post.categories.forEach(cat => {
              me.postForm.categories.push(cat.name)
            })
            break
          case 'date':
            me.postForm.date = post.date.format('YYYY-MM-DD HH:mm:ss')
            break
          case 'toc':
            me.postForm.toc = post.toc
            break
          default:
            break
        }
      })
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.resize)
    },
    beforeRouteLeave (to, from, next) {
      if (this.formChanged) {
        if (window.confirm('有未保存的更改，确认离开吗？')) {
          next()
        } else {
          next(false)
        }
      } else {
        next()
      }
    },
    methods: {
      submitForm () {
        var me = this
        this.$refs.postForm.validate((valid) => {
          if (valid) {
            window.hexo.post.create(me.postForm, true).then(function () {
              me.formChanged = false
              me.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
              })
            }, function () {
              me.$notify.error({
                title: '错误',
                message: '修改成功'
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

      imgsAdd (files) {
        var me = this
        me.uploading = true
        me.uploadingText = '正在上传 ' + files.length + ' 张图片...'

        var promises = []
        for (var i = 0; i < files.length; i++) {
          promises.push(qiniuManager.upload(files[i]))
        }

        when.all(promises).then(results => {
          results.forEach(imageUrl => {
            var editor = me.$refs.editor
            editor.insertText(editor.getTextareaDom(), {
              prefix: '![](' + imageUrl + ')\n',
              subfix: '',
              str: ''
            })
            me.uploading = false
          })
          me.uploading = false
        }, errs => {
          me.$notify.error({
            message: '图片上传失败：' + errs
          })
          me.uploading = false
        })
      },

      fullScreen (status) {
        this.fullScreenFlag = status
      },

      resize () {
        if (this.fullScreenFlag) {
          this.contentHeight = (document.documentElement.clientHeight) + 'px'
        } else {
          this.contentHeight = (document.documentElement.clientHeight - 370) + 'px'
        }
      }
    },
    watch: {
      fullScreenFlag: function () {
        this.resize()
      }
    }
  }
</script>

<style scoped>
  .content {
    width: 100%;
    min-height: 300px;
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

  .content.is-dragover {
    background-color: rgba(32, 159, 255, .06);
    border: 2px dashed #409eff;
  }

  .preview {
    width: 100%;
    min-height: 300px;
    overflow: auto;
    border: 1px solid #ccc;
    width: 100%;
    min-height: 300px;
    display: block;
    resize: vertical;
    padding: 0px 5px;
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
</style>
