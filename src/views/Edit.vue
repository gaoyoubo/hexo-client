<template>
  <el-form v-if="inited" :model="postForm" :rules="postFormRules" ref="postForm" style="height: 100%">

    <el-container style="height: 100%;">
      <el-main class="main">
        <!-- 标题 -->
        <el-form-item prop="title">
          <el-input v-model="postForm.title" @input="formChanged = true" :disabled="true"
                    :placeholder="$t('articleTitlePlaceholder')" style="width: 100%;"></el-input>
        </el-form-item>
        <!-- 内容 -->
        <el-form-item prop="content">
          <markdown-editor v-model="postForm.content" :initValue="postForm.content" @change="formChanged = true" @save="submitForm"/>
        </el-form-item>
      </el-main>
      <el-aside class="aside">

        <el-scrollbar class="scrollbar" ref="scrollbar">

          <div class="card">
            <div class="card-header">
              <span>发布</span>
              <el-button class="collapse" type="text"
                         :icon="show1 ? 'el-icon-arrow-up': 'el-icon-arrow-down'"
                         @click="show1 = !show1"></el-button>
            </div>
            <el-collapse-transition>
              <div class="card-body" v-show="show1">
                <!-- 路径 -->
                <el-form-item prop="path">
                  <el-input v-model="postForm.path" @input="formChanged = true" :disabled="true"
                            :placeholder="$t('articlePathPlaceholder')" style="width: 100%;"></el-input>
                </el-form-item>

                <!-- 开启toc -->
                <el-switch v-model="postForm.toc" @input="formChanged = true"
                           :active-text="$t('openToc')"></el-switch>

                <!-- 提交按钮 -->
                <el-button type="primary" icon="el-icon-success" size="mini"
                           style="float: right"
                           @click="submitForm()">{{$t('save')}}
                </el-button>
              </div>
            </el-collapse-transition>
          </div>


          <!-- 标签 -->
          <div class="card">
            <div class="card-header">
              <span>标签</span>
              <el-button class="collapse" type="text"
                         :icon="show2 ? 'el-icon-arrow-up': 'el-icon-arrow-down'"
                         @click="show2 = !show2">
              </el-button>
            </div>
            <el-collapse-transition>
              <div class="card-body" v-show="show2">
                <el-form-item prop="tags">
                  <el-select v-model="postForm.tags" multiple filterable allow-create default-first-option
                             style="width:100%;" :placeholder="$t('selectTags')" @input="formChanged = true">
                    <el-option v-for="tag in tags"
                               :key="tag"
                               :label="tag"
                               :value="tag">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-collapse-transition>
          </div>

          <!-- 分类 -->
          <div class="card">
            <div class="card-header">
              <span>分类</span>
              <el-button class="collapse" type="text"
                         :icon="show3 ? 'el-icon-arrow-up': 'el-icon-arrow-down'"
                         @click="show3 = !show3">
              </el-button>
            </div>
            <el-collapse-transition>
              <div class="card-body" v-show="show3">
                <el-form-item prop="categories">
                  <el-select v-model="postForm.categories" multiple filterable allow-create default-first-option
                             style="width:100%;" :placeholder="$t('selectCategories')" @input="formChanged = true">
                    <el-option v-for="category in categories"
                               :key="category"
                               :label="category"
                               :value="category">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-collapse-transition>
          </div>

          <!-- Front-matter -->
          <div class="card">
            <div class="card-header">
              <span>Front-matter <i class="el-icon-question" style="cursor: pointer;" @click="openFrontMatterHelp"></i></span>
              <el-button class="collapse" type="text"
                         :icon="show4 ? 'el-icon-arrow-up': 'el-icon-arrow-down'"
                         @click="show4 = !show4">
              </el-button>
            </div>
            <el-collapse-transition>
              <div class="card-body" v-show="show4">
                <el-form-item v-for="item in frontMatters" :key="item.title" :label="item.title">
                  <el-input :value="item.value">
                    <el-button slot="prepend" icon="el-icon-edit" @click="openEditFrontMatter(item)"></el-button>
                    <el-button slot="append" icon="el-icon-delete" @click="deleteFrontMatter(item)"></el-button>
                  </el-input>
                </el-form-item>
                <el-button type="success" plain icon="el-icon-plus" size="mini" @click="openAddFrontMatter">Add</el-button>
                <front-matter ref="frontMatterEditor" @ok="addFrontMatter"/>
              </div>
            </el-collapse-transition>
          </div>

        </el-scrollbar>

      </el-aside>
    </el-container>

  </el-form>
</template>

<script>
  import { mapGetters } from 'vuex'
  import MarkdownEditor from '@/components/Editor'
  import FrontMatter from '@/components/FrontMatter'
  import Utils from '@/service/Utils'

  export default {
    components: {MarkdownEditor, FrontMatter},
    data () {
      return {
        show1: true,
        show2: true,
        show3: true,
        show4: true,
        inited: false,
        postForm: {
          title: '',
          path: '',
          content: '',
          tags: [],
          categories: [],
          date: '',
          toc: false
        },
        frontMatters: [],
        postFormRules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
            {min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ]
        },
      }
    },
    mounted () {
      this.init()
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
      async init () {
        let me = this
        let postId = this.$route.params.postId
        if (!postId) {
          return
        }
        let post = await this.$store.dispatch('Hexo/getPost', postId)
        if (!post) {
          return
        }

        let keys = Object.keys(post)
        for (let i = 0; i < keys.length; i++) {
          switch (keys[i]) {
            case 'title':
              me.postForm.title = post.title.trim()
              break
            case 'path': {
              let source = post.source.trim()
              if (source) {
                let start = source.indexOf('/')
                let end = source.lastIndexOf('.md')
                if (start !== -1 && end !== -1 && start !== end) {
                  me.postForm.path = source.substring(start + 1, end)
                }
              }
              break
            }
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
        }

        // frontMatter
        let frontMatter = Utils.frontMatter(post.raw)
        Object.keys(frontMatter).forEach(key => {
          me.frontMatters.push({
            title: key,
            value: frontMatter[key]
          })
        })

        this.inited = true
      },

      async submitForm () {
        let valid = await this.$store.dispatch('Hexo/validatePostForm', this.$refs.postForm)
        if (valid) {
          try {
            if (this.frontMatters && this.frontMatters.length > 0) {
              for (let i = 0; i < this.frontMatters.length; i++) {
                let item = this.frontMatters[i]
                this.postForm[item.title] = item.value
              }
            }
            await this.$store.dispatch('Hexo/editPost', this.postForm)
            this.formChanged = false
            this.$notify({title: '成功', message: '修改成功', type: 'success'})
          } catch (err) {
            this.$notify.error({title: '错误', message: '修改失败'})
          }
        } else {
          this.$notify.error({title: '错误', message: '表单验证失败'})
        }
      },

      openFrontMatterHelp () {
        require('electron').shell.openExternal('https://hexo.io/docs/front-matter.html')
      },

      openAddFrontMatter () {
        this.$refs.frontMatterEditor.open()
      },

      openEditFrontMatter (item) {
        this.$refs.frontMatterEditor.open(item.title, item.value)
      },

      addFrontMatter (item) {
        let exists = false
        for (let i = 0; i < this.frontMatters.length; i++) {
          if (this.frontMatters[i].title === item.title) {
            exists = true
            this.frontMatters[i].value = item.value
            break
          }
        }
        if (!exists) {
          this.frontMatters.push(item)
        }
      },

      deleteFrontMatter (item) {
        let index = -1
        for (let i = 0; i < this.frontMatters.length; i++) {
          if (this.frontMatters[i].title === item.title) {
            index = i
            break
          }
        }
        if (index > -1) {
          this.frontMatters.splice(index, 1)
        }
      }

    },
    computed: {
      ...mapGetters({
        tags: 'Hexo/tags',
        categories: 'Hexo/categories'
      })
    }
  }
</script>

<style scoped>
  .main {
    height: 100%;
    padding: 20px 10px 0px;
  }

  .aside {
    height: 100%;
    width: 300px !important;
    padding-top: 20px;
    padding-right: 10px;
  }

  .scrollbar {
    height: 100%;
    width: 300px !important;
  }

  .scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  .card {
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
  }

  .card .card-header {
    padding: 10px 10px;
    border-bottom: 1px solid #ebeef5;
  }

  .card .card-body {
    padding: 10px;
  }

  .card .collapse {
    float: right;
    padding: 3px 0;
  }
</style>
