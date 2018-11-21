<template>
  <div class="ins-search" :class="{show: show}">
    <div class="ins-search-mask"></div>
    <div class="ins-search-container">
      <div class="ins-input-wrapper">
        <input type="text" class="ins-search-input" placeholder="想要查找什么..." x-webkit-speech="" ref="searchInput"
               v-model.trim.change="keyword" @keyup.38="selectUp" @keyup.40="selectDown" @keyup.13="selectEnter"/>
        <button type="button" class="close ins-close ins-selectable" data-dismiss="modal" aria-label="Close"
                @click="hide">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div class="ins-section-wrapper">
        <div class="ins-section-container" ref="container">
          <section class="ins-section" v-if="results.length > 0">
            <div v-for="(item, index) in results" class="ins-selectable ins-search-item"
                 ref="items" :class="{active: index === selectIndex}" @click="clickItem(item.id)">
              <header><i class="el-icon-document"></i>{{ item.title }}</header>
              <p class="ins-search-preview">{{ item.summary }}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'search',
    data () {
      return {
        keyword: ''
      }
    },
    mounted () {
      document.addEventListener('keyup', this.onEsc)
    },
    updated () {
      this.$refs.searchInput.focus()
    },
    beforeDestroy () {
      document.removeEventListener('keyup', this.onEsc)
    },
    methods: {
      hide () {
        this.keyword = ''
        this.$store.dispatch('Search/hide')
      },

      search (keyword) {
        this.$store.dispatch('Search/search', keyword)
      },

      selectUp () {
        this.$store.dispatch('Search/selectUp')
      },

      selectDown () {
        this.$store.dispatch('Search/selectDown')
      },

      selectEnter () {
        this.$store.dispatch('Search/selectEnter', false)
        this.hide()
      },

      clickItem (selectId) {
        this.$store.dispatch('Search/selectEnter', selectId)
        this.hide()
      },

      onEsc (e) {
        if (!this.$store.state.Search.show) {
          return
        }
        if (e.keyCode === 27) { // esc
          this.hide()
        }
      },

      scrollToSelectIndex () {
        let selectIndex = this.$store.state.Search.selectIndex
        let items = this.$refs.items
        if (selectIndex >= 0 && selectIndex < items.length) {
          this.$refs.items[selectIndex].scrollIntoView(true)
        }
      }

    },
    watch: {
      keyword: 'search', // keyword发生变化调用search
      selectIndex: function () {
        this.scrollToSelectIndex()
      }
    },
    computed: {
      show () {
        return this.$store.state.Search.show
      },
      results () {
        return this.$store.state.Search.results
      },
      selectIndex () {
        return this.$store.state.Search.selectIndex
      }
    }
  }
</script>

<style scoped>
  .ins-search {
    display: none;
  }

  .ins-search.show {
    display: block;
  }

  .ins-selectable {
    cursor: pointer;
  }

  .ins-search-mask,
  .ins-search-container {
    position: fixed;
  }

  .ins-search-mask {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
    background: rgba(0, 0, 0, 0.5);
  }

  .ins-input-wrapper {
    position: relative;
  }

  .ins-input-wrapper .close {
    float: right;
    font-size: 24px;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    opacity: 0.2;
    filter: alpha(opacity=20);
  }

  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
    opacity: 0.5;
    filter: alpha(opacity=50);
  }

  .ins-input-wrapper button.close {
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
    -webkit-appearance: none;
  }

  .ins-search-input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 16px;
    -webkit-box-shadow: none;
    box-shadow: none;
    font-weight: 200;
    border-radius: 0;
    background: #fff;
    line-height: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 12px 28px 12px 20px;
    border-bottom: 1px solid #e2e2e2;
    font-family: "Microsoft Yahei Light", "Microsoft Yahei", Helvetica, Arial, sans-serif;
  }

  .ins-close {
    top: 50%;
    right: 6px;
    width: 20px;
    height: 20px;
    font-size: 24px;
    margin-top: -15px;
    position: absolute;
    text-align: center;
    opacity: 1.0;
    color: #666;
    display: inline-block;
    outline: 0 !important;
  }

  .ins-close:hover {
    color: #006bde;
  }

  .ins-search-container {
    left: 50%;
    top: 100px;
    z-index: 1051;
    bottom: 100px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 540px;
    margin-left: -270px;
  }

  .ins-section-wrapper {
    left: 0;
    right: 0;
    top: 45px;
    bottom: 0;
    overflow-y: auto;
    position: absolute;
    scroll-behavior: smooth;
  }

  .ins-section-container {
    position: relative;
    background: #f7f7f7;
  }

  .ins-section {
    font-size: 14px;
    line-height: 16px;
  }

  .ins-section .ins-section-header,
  .ins-section .ins-search-item {
    padding: 8px 15px;
  }

  .ins-section .ins-section-header {
    color: #9a9a9a;
    border-bottom: 1px solid #e2e2e2;
  }

  .ins-section .ins-slug {
    margin-left: 5px;
    color: #9a9a9a;
  }

  .ins-section .ins-slug:before {
    content: '(';
  }

  .ins-section .ins-slug:after {
    content: ')';
  }

  .ins-section .ins-search-item header,
  .ins-section .ins-search-item .ins-search-preview {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .ins-section .ins-search-item header .icon {
    margin-right: 8px;
  }

  .ins-section .ins-search-item .ins-search-preview {
    height: 15px;
    font-size: 12px;
    color: #9a9a9a;
    margin: 5px 0 0 20px;
  }

  .ins-section .ins-search-item:hover,
  .ins-section .ins-search-item.active {
    color: #fff;
    background: #006bde;
  }

  .ins-section .ins-search-item:hover .ins-slug,
  .ins-section .ins-search-item.active .ins-slug,
  .ins-section .ins-search-item:hover .ins-search-preview,
  .ins-section .ins-search-item.active .ins-search-preview {
    color: #fff;
  }
</style>
