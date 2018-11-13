<template>

  <el-scrollbar ref="scrollbar" class="el-scrollbar">
    <div class="article-list" v-if="posts.length > 0">
      <div class="article-list-panel" v-for="(post, index) in posts" ref="post" @click="selected(post.id)"
           :data-id="post.id" v-bind:class="{active: post.id === selectedPostId}">
        <div class="article-list-item">
          <h4 class="article-title">{{ post.title }}</h4>
          <div class="article-tags">
            <span class="tag" v-for="(tag, index) in post.tags">#{{ tag.name }}</span>
          </div>
          <span class="article-date">{{ post.date }}</span>

          <a class="article-edit-btn" @click="editPost(post.id)">
            <i class="el-icon-edit-outline"></i>
          </a>
          <a class="article-delete-btn" @click="deletePost(post.id)">
            <i class="el-icon-delete"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="article-none-panel" v-if="posts.length === 0">
      无文章
    </div>
  </el-scrollbar>

</template>

<script>
  export default {
    data () {
      return {
        scrollWrap: null // 滚动条容器
      }
    },

    mounted () {
      this.scrollWrap = this.$refs.scrollbar.$refs.wrap // 滚动条容器，详见：el-scrollbar组件源码
      this.onscroll()
      this.setScrollLocation()
    },

    methods: {
      selected: function (selectedId) {
        this.$store.dispatch('Hexo/selectPost', selectedId)
      },

      editPost: function (id) {
        this.$router.push({name: 'edit', params: {postId: id}})
      },

      async deletePost (id) {
        if (confirm('是否确认删除该文章？')) {
          await this.$store.dispatch('Hexo/deletePost', id)
          this.$notify({title: '成功', message: '删除成功', type: 'success'})
        }
      },

      // 监听滚动状态，并存储滚动位置
      onscroll (e) {
        var me = this
        me.scrollWrap.addEventListener('scroll', function (e) {
          me.$store.dispatch('UiStatus/onscroll', {
            scrollTop: e.srcElement.scrollTop,
            scrollLeft: e.srcElement.scrollLeft
          })
        })
      },

      // 设置滚动位置
      setScrollLocation () {
        let scrollTop = this.$store.state.UiStatus.postListScrollTop || 0
        let scrollLeft = this.$store.state.UiStatus.postListScrollLeft || 0
        if (scrollTop > 0 || scrollLeft > 0) {
          this.scrollWrap.scrollTop = scrollTop
          this.scrollWrap.scrollLeft = scrollLeft
        }
      }
    },

    computed: {
      posts () {
        return this.$store.getters['Hexo/posts']
      },
      selectedPostId () {
        let selectedPost = this.$store.getters['Hexo/selectedPost']
        return selectedPost ? selectedPost._id : null
      }
    }
  }
</script>

<style>
  .el-scrollbar {
    width: 380px;
    border-right: 1px solid #E9E9E9;
  }

  .article-list {
    background-color: #FAFAFA;
  }

  .article-none-panel {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    color: #727272;
    text-align: center;
    margin-top: 20px;
    size: 24px;
  }

  .article-list-panel.active {
    background-color: #EEEEEE;
  }

  .article-list-item {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    color: #727272;
    font-size: 13px;
    padding: 8px;
    position: relative;
    cursor: pointer;
    /*border-bottom: 1px solid rgba(235, 238, 245, 0.8);*/
  }

  .article-list-item .article-title {
    color: #323232;
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

  .article-list-item .article-tags {
    margin: 0px 0px 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .article-list-item .article-tags .tag {
  }

  .article-list-item .article-tags .tag:after {
    content: " ";
  }

  .article-list-item .article-date {
    margin: 0px 0px 5px;
  }

  .article-edit-btn {
    top: 5px;
    right: 6px;
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
    right: 36px;
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
    background-color: #c0c0c0;
  }

  .article-list-panel:hover .article-edit-btn,
  .article-list-panel:hover .article-delete-btn {
    opacity: 1;
  }

</style>

