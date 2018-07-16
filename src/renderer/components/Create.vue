<template>
  <el-container>
    <el-header>
      <main-menu active="/create"></main-menu>
    </el-header>
    <el-main>

      <el-form :model="postForm" :rules="postFormRules" ref="postForm" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="postForm.title" @input="formChanged = true"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-tabs value="edit" @tab-click="preview"
                   v-loading="uploading" :element-loading-text="uploadingText">
            <el-tab-pane label="编辑" name="edit">
              <textarea v-model="postForm.content" class="content" placeholder="请输入内容"
                        ref="txt"
                        :class="{'is-dragover': dragover}"
                        :style="{height: contentHeight}"
                        @input="formChanged = true"
                        @drop.prevent="onDrop"
                        @dragover.prevent="dragover = true"
                        @dragleave.prevent="dragover = false"
                        @paste="onPaste"></textarea>
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
            <el-button type="primary" @click="submitForm()">保存</el-button>
          </el-form-item>
          <el-form-item label="开启文章目录" style="display:inline-block;">
            <el-switch v-model="postForm.toc" @input="formChanged = true"></el-switch>
          </el-form-item>
        </el-form-item>
      </el-form>

    </el-main>
  </el-container>
</template>

<script>
  import MainMenu from './MainMenu'
  import HexoClient from '@/HexoClient'
  import When from 'when'
  import * as qiniu from 'qiniu-js'

  var md5 = require('md5')

  export default {
    components: {MainMenu},
    data () {
      return {
        postForm: {
          title: '',
          content: '',
          tags: [],
          categories: [],
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
                message: '保存成功',
                type: 'success'
              })
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

        this.uploadImages(files)
      },

      onPaste (event) {
        var images = getPasteImages(event)
        if (!images || images.length <= 0) {
          return
        }
        event.preventDefault()
        console.log('找到图片：' + images.length)

        for (var i = 0; i < images.length; i++) {
          upload(images[i])
        }

        var me = this

        function upload (image) {
          var reader = new FileReader()
          reader.onload = function (event) {
            var key = md5(event.target.result)
            HexoClient.prepareUpload(key).then(
              uploadConfig => {
                var putExtra = {
                  fname: '',
                  params: {},
                  mimeType: [] || null
                }
                var config = {
                  useCdnDomain: true,
                  disableStatisticsReport: false,
                  retryCount: 6
                }
                var observable = qiniu.upload(image, key, uploadConfig.uploadToken, putExtra, config)
                var observer = {
                  next (res) {
                  },
                  error (err) {
                    console.log(err)
                  },
                  complete (res) {
                    var imageUrl = uploadConfig.host + '/' + res.key
                    me.postForm.content = HexoClient.insertText(me.$refs.txt, '![](' + imageUrl + ')\n')
                  }
                }
                observable.subscribe(observer)
              },
              msg => {
                me.$notify.error({
                  message: msg
                })
              }
            )
          }
          reader.readAsDataURL(image)
        }

        function getPasteImages (event) {
          var images = []
          if (!event.clipboardData || !event.clipboardData.items) {
            return images
          }
          for (var i = 0; i < event.clipboardData.items.length; i++) {
            if (event.clipboardData.items[i].type.indexOf('image') !== -1) {
              var image = event.clipboardData.items[i].getAsFile()
              if (image) {
                images.push(image)
              }
            }
          }
          return images
        }
      },

      uploadImages (files) {
        var me = this
        HexoClient.prepareUpload().then(
          config => {
            me.uploading = true
            me.uploadingText = '正在上传 ' + files.length + ' 张图片...'

            var promises = []
            for (var i = 0; i < files.length; i++) {
              promises.push(HexoClient.upload(files[i], config.uploadToken))
            }

            When.all(promises).then(results => {
              results.forEach(result => {
                var imageUrl = config.host + '/' + result.key
                me.postForm.content = HexoClient.insertText(me.$refs.txt, '![](' + imageUrl + ')\n')
              })
              me.uploading = false
            }, errs => {
              me.$notify.error({
                message: '图片上传失败：' + errs
              })
              me.uploading = false
            })
          },
          msg => {
            me.$notify.error({
              message: msg
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
