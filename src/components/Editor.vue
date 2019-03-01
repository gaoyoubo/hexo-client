<template>
  <mavon-editor ref="editor" :value="value" :toolbars="toolbars" :ishljs="true"
                @imgAdd="imgAdd" @fullScreen="fullScreen" @change="change"
                :language="editorLanguage" :boxShadow="false"
                :placeholder="$t('articleContentPlaceholder')"
                codeStyle="atom-one-dark"
                :style="{height: contentHeight, width: '100%'}"
  />
</template>

<script>
  import qiniuUploader from '@/service/QiniuUploader'
  import smmsUploader from '@/service/SmmsUploader'
  import githubUploader from '@/service/GithubUploader'

  export default {
    name: 'Editor',
    props: {
      value: {
        type: String,
        default: ''
      },
      initValue: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        uploading: false,
        uploadingText: 'loading...', // TODO gaoyoubo @ 2019-02-28 没显示上传文案
        contentHeight: this.height,
        fullScreenStatus: false,
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
      let sysConfig = this.$store.state.Config.config
      this.$refs.editor.markdownIt.use(githubUploader.markdownItPlugin, {
        match: '/images',
        prefix: 'file://' + sysConfig.path + '/source'
      })

      this.resize()
      window.addEventListener('resize', this.resize)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.resize)
    },
    methods: {
      /**
       * 添加图片
       */
      async imgAdd (pos, file) {
        let me = this
        me.uploading = true
        me.uploadingText = '正在上传 ' + file.name
        let sysConfig = me.$store.state.Config.config

        if (sysConfig.uploadType === 'qiniu') {
          qiniuUploader.upload(file, sysConfig).then(url => {
            me.$refs.editor.$img2Url(pos, url)
            me.uploading = false
          }, err => {
            me.$notify.error({message: '图片上传失败：' + err})
            me.uploading = false
          })
        } else if (sysConfig.uploadtype === 'sm.ms') {
          smmsUploader.upload(file).then(url => {
            me.$refs.editor.$img2Url(pos, url)
            me.uploading = false
          }, err => {
            me.$notify.error({message: '图片上传失败：' + err})
            me.uploading = false
          })
        } else {
          githubUploader.upload(file, sysConfig).then(url => {
            me.$refs.editor.$img2Url(pos, url)
            me.uploading = false
          }, err => {
            me.$notify.error({message: '图片上传失败：' + err})
            me.uploading = false
          })
        }
      },
      /**
       * 内容变更
       * @param value
       * @param render
       */
      change (value) {
        this.$emit('input', value)
        if (value !== this.initValue) {
          this.$emit('change', value)
        }
      },
      /**
       * 切换全屏
       * @param status
       */
      fullScreen (status) {
        this.fullScreenStatus = status
        this.resize()
      },

      resize () {
        if (this.fullScreenStatus) {
          this.contentHeight = (document.documentElement.clientHeight) + 'px'
        } else {
          this.contentHeight = (document.documentElement.clientHeight - 110) + 'px'
        }
      }
    },
    computed: {
      editorLanguage () {
        let config = this.$store.state.Config.config
        if (config.language === 'zh') {
          return 'zh-CN'
        } else {
          return 'en'
        }
      }
    }
  }
</script>

<style scoped>

</style>
