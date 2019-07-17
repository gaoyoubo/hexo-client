<template>
  <div class="tag-tree">
    <div class="toggle" :class="{open: open, close: !open}" @click="toggle">
      <i class="iconfont" :class="{'icon-arrow-left': open, 'icon-arrow-right': !open}" style="font-size:24px;"></i>
    </div>
    <div ref="collapse" class="collapse" :style="{width: open ? '200px' : '0px'}">
      <div class="tool-box" :style="{height: toolboxHeight}">
        <el-button icon="el-icon-edit" type="info" size="small" @click="createPost" circle></el-button>
        <el-button icon="el-icon-search" type="primary" size="small" @click="search" circle></el-button>
        <deploy/>
      </div>
      <el-scrollbar :style="{height: scrollbarHeight}" ref="scrollbar" class="el-scrollbar" view-style="height: 100%">
        <el-menu default-active="all" :default-openeds="defaultOpeneds" @select="handleSelect">
          <el-menu-item index="all">
            <i class="iconfont icon-archive"></i>
            <span slot="title">&nbsp;全部</span>
          </el-menu-item>
          <el-submenu index="categories">
            <template slot="title">
              <i class="iconfont icon-categories"></i>
              <span slot="title">&nbsp;分类</span>
            </template>
            <el-menu-item v-for="cat in categories" :index="'cat#' + cat" :key="cat">
              <i class="iconfont icon-category"></i>
              <span slot="title">&nbsp;{{cat}}</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="tags">
            <template slot="title">
              <i class="iconfont icon-tags"></i>
              <span slot="title">&nbsp;标签</span>
            </template>
            <el-menu-item v-for="tag in tags" :index="'tag#' + tag" :key="tag">
              <i class="iconfont icon-tag"></i>
              <span slot="title">&nbsp;{{tag}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Deploy from './Deploy'

  export default {
    name: 'TreeNav',
    components: {Deploy},
    data () {
      return {
        defaultOpeneds: ['categories', 'tags'],
        clientHeight: '', // 总高度
        scrollbarHeight: '', // 滚动条总高度
        toolboxHeight: '' // 工具条高度
      }
    },
    mounted () {
      this.resize()
      window.addEventListener('resize', this.resize)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.resize)
    },
    methods: {
      resize () {
        this.clientHeight = (document.documentElement.clientHeight) + 'px'
        this.scrollbarHeight = (document.documentElement.clientHeight - 45) + 'px'
        this.toolboxHeight = '40px'
      },
      toggle () {
        if (this.open) {
          this.$store.dispatch('UiStatus/closeTreeNav')
        } else {
          this.$store.dispatch('UiStatus/openTreeNav')
        }
      },
      handleSelect (key) {
        this.$store.dispatch('Hexo/selectTree', key)
      },

      // 新建文章
      createPost () {
        this.$router.push({name: 'create'})
      },

      // 搜索
      search () {
        this.$store.dispatch('Search/show')
      }
    },
    computed: {
      ...mapGetters({
        tags: 'Hexo/tags',
        categories: 'Hexo/categories'
      }),
      open () {
        return this.$store.state.UiStatus.treeNavOpen
      }
    }
  }
</script>

<style scoped>
  .tag-tree {
  }

  .toggle {
    position: absolute;
    z-index: 999;
    font-size: 28px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease, background-color 0.1s ease;
  }

  .tag-tree:hover .toggle, .toggle:hover {
    opacity: 1;
  }

  .toggle.open {
    left: 240px;
  }

  .toggle.close {
    left: 60px;
  }

  .collapse {
    width: 200px;
    -webkit-transition: width 0.3s;
    -moz-transition: width 0.3s;
    -o-transition: width 0.3s;
    transition: width 0.3s;
  }

  .tool-box {
    border-right: 1px solid #E9E9E9;
    text-align: center;
    padding-top: 5px;
  }

  .el-submenu .el-menu-item {
    font-size: 12px;
    height: 36px;
    line-height: 36px;
  }

  .el-scrollbar__view .el-menu {
    height: 100%!important;
  }
</style>
