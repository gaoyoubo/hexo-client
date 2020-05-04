<template>
  <el-scrollbar style="width: 100%">
    <el-main v-if="post" style="padding-top: 0px;">
      <transition name="el-fade-in-linear">
        <article class="article" v-show="inited">
          <div class="article-inner">
            <header class="article-header">
              <h1 class="article-title">{{ post.title }}</h1>
              <label class="article-time">{{
                post.date.format("YYYY-MM-DD HH:mm:ss")
              }}</label>
              <label
                class="article-cat"
                v-for="category in post.categories.data"
                :key="'cat:' + category.name"
              >
                <el-tag size="small">{{ category.name }}</el-tag>
              </label>
              <label
                class="article-tag"
                v-for="tag in post.tags.data"
                :key="'tag:' + tag.name"
              >
                <el-tag type="info" size="small">{{ tag.name }}</el-tag>
              </label>
            </header>
            <div class="article-entry" v-html="post.content"></div>
          </div>
        </article>
      </transition>
    </el-main>
  </el-scrollbar>
</template>

<script>
const electron = require("electron");
const fs = require("fs");

export default {
  data() {
    return {
      inited: false
    };
  },
  mounted() {
    this.renderArticle();
  },
  updated() {
    this.renderArticle();
  },
  methods: {
    renderArticle() {
      this.renderImage();
      this.renderLink();
      this.inited = true;
    },
    // 渲染图片
    renderImage() {
      let contentDom = document.getElementsByClassName("article-entry");
      if (contentDom && contentDom.length > 0) {
        let sysConfig = this.$store.state.Config.config;
        let images = contentDom[0].getElementsByTagName("img");
        for (let i = 0; i < images.length; i++) {
          let img = images[i];
          let src = img.getAttribute("src");
          if (this.startWith(src, "/images")) {
            try {
              let path = sysConfig.path + "/source" + src;
              let data = fs.readFileSync(path);
              let base64 = data.toString("base64");
              img.setAttribute("src", "data:image/jpg;base64," + base64);
            } catch (e) {
              console.error(e);
            }
            // fs.readFile(path, function (err, data) {
            //   if (!err) {
            //     let base64 = data.toString('base64')
            //     img.setAttribute('src', 'data:image/jpg;base64,' + base64)
            //   }
            // })
          }
        }
      }
    },
    // 渲染a标签
    renderLink() {
      let articleDom = document.getElementsByClassName("article");
      if (articleDom && articleDom.length > 0) {
        let links = articleDom[0].getElementsByTagName("a");
        for (let i = 0; i < links.length; i++) {
          links[i].onclick = function(event) {
            let href = event.target.getAttribute("href");
            if (href) {
              electron.shell.openExternal(href);
            }
            return false;
          };
        }
      }
    },
    startWith(str, prefix) {
      return str && prefix && str.indexOf(prefix) === 0;
    }
  },
  computed: {
    post() {
      return this.$store.getters["Hexo/selectedPost"];
    }
  }
};
</script>

<style scoped lang="scss"></style>
