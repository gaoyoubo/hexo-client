<template>
  <el-main>

    <el-form :model="postForm" :rules="postFormRules" ref="postForm" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="postForm.title" :readonly="true" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <el-tabs value="edit" @tab-click="preview">
          <el-tab-pane label="编辑" name="edit">
              <textarea v-model="postForm.content" class="content" placeholder="请输入内容"
                        ref="txt"
                        :class="{'is-dragover': dragover}"
                        :style="{height: contentHeight}"
                        @input="formChanged = true"
                        @drop.prevent="onDrop"
                        @dragover.prevent="dragover = true"
                        @dragleave.prevent="dragover = false"></textarea>
          </el-tab-pane>
          <el-tab-pane label="预览" name="preview">
            <div class="preview article-entry" v-html="previewContent" :style="{height: contentHeight}"></div>
          </el-tab-pane>
        </el-tabs>
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
  import HexoClient from '@/HexoClient'
  import When from 'when'

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
        previewContent: '',
        dragover: false,
        uploading: false,
        uploadingText: 'loading...',
        contentHeight: '',
        formChanged: false
      }
    },
    mounted () {
      this.handleResize()
      window.addEventListener('resize', this.handleResize)
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
      window.removeEventListener('resize', this.handleResize)
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
      onDrop (e) {
        this.dragover = false
        var files = e.dataTransfer.files

        // 检查文件合法性
        var checkSuccess = true
        for (var j = 0; j < files.length; j++) {
          if (!files[j].type.match(/image*/)) {
            console.log('仅支持上传图片...', files[j])
            checkSuccess = false
            break
          }
        }
        if (!checkSuccess) {
          this.$notify.error({
            message: '只能上传图片文件'
          })
          return
        }

        var me = this
        HexoClient.dbGet('sysConfig').then(sysConfig => {
          var accessKey = sysConfig.qiniuAccessKey
          var secretKey = sysConfig.qiniuSecretKey
          var bucket = sysConfig.qiniuBucket
          var host = sysConfig.qiniuHost

          if (!accessKey || !secretKey || !bucket || !host) {
            me.$notify.error({
              message: '请先完成七牛配置！'
            })
            return
          }

          me.uploading = true
          me.uploadingText = '正在上传 ' + files.length + ' 张图片...'

          var uploadToken = HexoClient.uploadToken(accessKey, secretKey, bucket)

          var promises = []
          for (var i = 0; i < files.length; i++) {
            promises.push(HexoClient.upload(files[i], uploadToken))
          }

          When.all(promises).then(results => {
            results.forEach(result => {
              var imageUrl = host + '/' + result.key
              me.postForm.content = HexoClient.insertText(me.$refs.txt, '![](' + imageUrl + ')\n')
            })
            me.uploading = false
          }, errs => {
            me.$notify.error({
              message: '图片上传失败：' + errs
            })
            me.uploading = false
          })
        })
      },
      handleResize () {
        this.contentHeight = (document.documentElement.clientHeight - 430) + 'px'
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
