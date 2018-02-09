<template>

  <div class="article-list">
    <div class="article-list-panel" v-for="(post, index) in posts" ref="post" @click="selected(post.id)"
         :data-id="post.id">
      <div class="article-list-item">
        <h4 class="article-title">{{ post.title }}</h4>
        <p class="article-desc"></p>
        <ul class="article-info">
          <li class="meta">{{ post.author }}</li>
          <li class="meta">{{ post.date }}</li>
        </ul>

        <a class="article-edit-btn" @click="editPost(post.id)">
          <i class="el-icon-edit-outline"></i>
        </a>
        <a class="article-delete-btn" @click="deletePost(post.id)">
          <i class="el-icon-delete"></i>
        </a>
      </div>
    </div>
  </div>

</template>

<script>
  const fs = require('fs')
  export default {
    data () {
      return {
        posts: []
      }
    },

    methods: {
      selected: function (selectedId) {
        this.$emit('selectedArticle', selectedId)
        this.$refs.post.forEach(item => {
          item.classList.remove('active')
          if (item.attributes['data-id'].nodeValue === selectedId) {
            item.classList.add('active')
          }
        })
        window.selectedPostId = selectedId
      },

      editPost: function (id) {
        console.log('edit', id)
      },

      deletePost: function (id) {
        if (confirm('是否确认删除该文章？')) {
          var me = this
          var post = window.hexo.locals.get('posts').findOne({_id: id})
          if (!post) {
            me.$message.error('文章不存在')
          } else {
            fs.unlink(post.full_source, (err) => {
              if (err) {
                console.error('删除文件失败:' + post.full_source)
                me.$notify.error({
                  title: '删除失败',
                  message: err.message
                })
              } else {
                // 从数组中删除
                var index = -1
                for (var i = 0; i < me.posts.length; i++) {
                  if (me.posts[i].id === id) {
                    index = i
                    break
                  }
                }
                if (index !== -1) {
                  me.posts.splice(index, 1)
                }

                me.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success'
                })
              }
            })
          }
        }
      }
    },

    mounted () {
      var me = this
      var posts = window.hexo.locals.get('posts').sort('date', -1)
      if (posts && posts.length > 0) {
        window.lastPostId = posts.data[0]._id // 最后一篇文章
        me.posts.splice(0, me.posts.length) // 清空列表中所有数据
        posts.forEach(post => {
          if (!window.selectedPostId) {
            window.selectedPostId = post._id
          }
          me.posts.push({
            id: post._id,
            title: post.title,
            date: post.date.format('YYYY-MM-DD'),
            author: post.author
          })
        })
      }
    },

    updated () {
      var selectedPost = window.hexo.locals.get('posts').findOne({_id: window.selectedPostId})
      if (selectedPost) { // 如果上次选中的文章还存在，那么优先展示上次选中的
        this.selected(window.selectedPostId)
      } else { // 否则展示最新的那篇文章
        this.selected(window.lastPostId)
      }
    }
  }
</script>

<style>
  .article-list {
    background-color: #F7FAFF;
  }

  .article-list-panel.active {
    background-color: #DFEBFF;
  }

  .article-list-panel.active:hover {
    background-color: #DFEBFF;
  }

  .article-list-panel:hover {
    background-color: #ECF3FF;
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

  .article-edit-btn {
    top: 5px;
    right: 0px;
    opacity: 0;
    position: absolute;
    padding: 5px 6px;
    border-radius: 15px;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    transition: opacity 0.3s ease, background-color 0.1s ease;
    background-color: #d5d5d5;
  }

  .article-delete-btn {
    top: 5px;
    right: 30px;
    opacity: 0;
    position: absolute;
    padding: 5px 6px;
    border-radius: 15px;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    transition: opacity 0.3s ease, background-color 0.1s ease;
    background-color: #d5d5d5;
  }

  .article-edit-btn:hover, .article-delete-btn:hover {
    background-color: #ffffed;
  }

  .article-list-panel:hover .article-edit-btn,
  .article-list-panel:hover .article-delete-btn {
    opacity: 1;
  }

</style>

