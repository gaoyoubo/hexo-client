<template>
  <el-scrollbar style="height: 100%;" class="el-scrollbar">
    <el-container style="height: 100%;">
      <el-main>
        <div class="notice">
          <div>
            <div class="notice-title">
              <div class="title" @click="showHelp = !showHelp">
                <span>
                  什么是好博客导航？
                  <i
                    :class="{'el-icon-caret-top': showHelp, 'el-icon-caret-bottom': !showHelp }"
                  />
                </span>
              </div>
              <label class="tool">
                <el-link type="primary" @click="openSubmitDialog">点击提交你的博客&gt;&gt;</el-link>
              </label>
            </div>
          </div>
          <el-collapse-transition>
            <div class="notice-content" v-show="showHelp">
              <p>好博客导航是一个收录优质、原创、计算机相关博客导航工具。</p>
              <p>
                导航地址：
                <a @click="openUrl('https://mlog.club/links')">https://mlog.club/links</a>
              </p>
              <h1>为什么要做`好博客`导航</h1>
              <p>我在网上看到过很多博客导航，但是收录的博客质量参差不齐，而且没有专业编程相关的技术类型博客导航，有很多优质好博客没有得到很好的展示机会，好博客导航主要就是为了解决一问题，让独立博主能够很好的展示自己，让自己的文章能够帮助更多人，让更多的程序员能够关注到自己喜欢的博客。</p>
              <p>后续我们还会对所有收录的博客进行分类、打标签，对优质博客进行推荐。</p>
              <h1>收录规则：</h1>
              <ul>
                <li>只收录计算机相关的技术博客</li>
                <li>拒绝SEO类型博客</li>
                <li>拒绝大量转载文章的博客</li>
                <li>独立博客优先</li>
                <li>提交后我们会进行审核，审核通过后即可显示</li>
              </ul>
            </div>
          </el-collapse-transition>
        </div>

        <div class="links" v-if="linksPage">
          <div v-for="link in linksPage.results" :key="link.linkId" class="link">
            <div class="link-logo">
              <img v-if="link.logo" :src="link.logo" />
              <img v-if="!link.logo" src="../assets/images/blog.png" />
            </div>
            <div class="link-title">
              <a :title="link.title" target="_blank" @click="openUrl(link.url)">{{ link.title }}</a>
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              background
              layout="prev,next"
              :total="linksPage.page.total"
              :page-size="linksPage.page.limit"
              hide-on-single-page
            ></el-pagination>
          </div>
        </div>
      </el-main>

      <el-dialog title="提交博客" :visible.sync="submitFormVisible">
        <el-form :model="submitForm">
          <el-form-item label="博客标题">
            <el-input v-model="submitForm.title" autocomplete="off" placeholder="博客标题（必填）"></el-input>
          </el-form-item>
          <el-form-item label="博客链接">
            <el-input v-model="submitForm.url" autocomplete="off" placeholder="博客链接（必填）"></el-input>
          </el-form-item>
          <el-form-item label="博客简介">
            <el-input
              v-model="submitForm.summary"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              autocomplete="off"
              placeholder="博客简介（必填）"
            ></el-input>
          </el-form-item>
          <el-form-item label="博客Logo">
            <el-input
              v-model="submitForm.logo"
              autocomplete="off"
              placeholder="博客Logo（可空），请填写Logo链接"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitBlog">确 定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </el-scrollbar>
</template>

<script>
import axios from "axios";
import { shell } from "electron";
export default {
  data() {
    return {
      showHelp: false,
      submitFormVisible: false,
      linksPage: null,
      submitForm: {
        title: "",
        url: "",
        summary: "",
        logo: ""
      }
    };
  },
  mounted() {
    this.getBlogs();
  },
  methods: {
    async getBlogs() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      try {
        const resp = await axios.get("https://mlog.club/api/link/links");
        if (!resp.data.success) {
          // 服务器返回错误
          this.$message({
            showClose: true,
            message: resp.data.message,
            type: "error"
          });
          return;
        }
        this.linksPage = resp.data.data;
      } catch (e) {
        this.$message({
          showClose: true,
          message: e,
          type: "error"
        });
      } finally {
        loading.close();
      }
    },
    openUrl(url) {
      url = url + "?utm_source=hexoclient";
      shell.openExternal(url);
    },
    openSubmitDialog() {
      this.submitFormVisible = !this.submitFormVisible;
    },
    async submitBlog() {
      try {
        const formData = new FormData();
        formData.append("title", this.submitForm.title);
        formData.append("url", this.submitForm.url);
        formData.append("summary", this.submitForm.summary);
        formData.append("logo", this.submitForm.logo);

        const config = {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        };

        const resp = await axios.post(
          "https://mlog.club/api/link/create",
          formData,
          config
        );
        if (!resp.data.success) {
          // 服务器返回错误
          this.$message({
            showClose: true,
            message: resp.data.message,
            type: "error"
          });
          return;
        }
        this.$message({
          showClose: true,
          message: "提交成功",
          type: "success"
        });
      } catch (e) {
        this.$message({
          showClose: true,
          message: e,
          type: "error"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: #3273dc;
  cursor: pointer;
}

.notice {
  padding: 0 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #fcf8e3;
  border-color: #faebcc;
  color: #8a6d3b;

  .notice-title {
    font-weight: bold;
    font-size: 18px;
    padding: 15px 0;
    color: #3273dc;

    .title {
      cursor: pointer;
      position: absolute;
      display: contents;
    }
    .tool {
      float: right;
    }
  }

  .notice-content {
    h1 {
      margin-bottom: 10px;
      margin-top: 10px;
    }
    //   ul {
    //     list-style: circle;
    //     margin-left: 20px;
    //     margin-top: 10px;
    //   }
  }
}
.links {
  padding-bottom: 20px;

  .pagination {
    margin-top: 20px;
  }

  .link {
    height: 50px;
    display: inline-block;
    margin: 3px;
    padding: 5px;
    border: 1px solid #eeeeee;
    border-radius: 5%;

    &:hover {
      cursor: pointer;
      background-color: #f7f5ee;
      font-weight: bold;
    }

    .link-logo {
      display: inline-block;
      min-width: 50px;
      min-width: 50px;
      img {
        max-width: 50px;
        max-height: 50px;
      }
    }

    .link-title {
      display: inline-block;
      margin-left: 10px;
      width: 120px;
      a {
        font-size: 15px;
        font-weight: 600;
        line-height: 50px;

        overflow: hidden;
        word-break: break-all;
        -webkit-line-clamp: 1;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        display: -webkit-box;
      }
    }
  }
}
</style>