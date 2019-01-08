<template>
  <div class="tag-tree">
    <div class="toggle" :class="{open: open, close: !open}" @click="toggle">
      <i :class="{'el-icon-arrow-left': open, 'el-icon-arrow-right': !open}"></i>
    </div>
    <transition name="el-fade-in">
      <div v-show="open" class="tool-box" :style="{height: toolboxHeight}">
        <el-button icon="el-icon-edit" type="info" size="small" @click="createPost" circle></el-button>
        <el-button icon="el-icon-search" type="primary" size="small" @click="search" circle></el-button>
        <deploy/>
      </div>
    </transition>
    <transition name="el-fade-in">
      <el-scrollbar v-show="open" style="width: 200px; min-width: 200px;" :style="{height: scrollbarHeight}"
                    ref="scrollbar" class="el-scrollbar">
        <el-menu default-active="all" :default-openeds="defaultOpeneds" @select="handleSelect">
          <el-menu-item index="all">
            <v-icon :width="12" :height="12" name="archive"></v-icon>
            <span slot="title">全部</span>
          </el-menu-item>
          <el-submenu index="categories">
            <template slot="title">
              <v-icon :width="12" :height="12" name="indent"></v-icon>
              <span slot="title">分类</span>
            </template>
            <el-menu-item v-for="cat in categories" :index="'cat#' + cat">
              <v-icon :width="12" :height="12" name="list"></v-icon>
              <span slot="title">{{cat}}</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="tags">
            <template slot="title">
              <v-icon :width="12" :height="12" name="tags"></v-icon>
              <span slot="title">标签</span>
            </template>
            <el-menu-item v-for="tag in tags" :index="'tag#' + tag">
              <v-icon :width="12" :height="12" name="tag"></v-icon>
              <span slot="title">{{tag}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-scrollbar>
    </transition>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Deploy from './Deploy'

  export default {
    name: 'TagTree',
    components: {Deploy},
    data () {
      return {
        open: true,
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
          this.open = false
        } else {
          this.open = true
        }
      },
      handleSelect (key, keyPath) {
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
      })
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

  .el-submenu .el-menu-item {
    font-size: 12px;
    height: 36px;
    line-height: 36px;
  }

  .tool-box {
    border-right: 1px solid #E9E9E9;
    text-align: center;
    padding-top: 5px;
  }
</style>
