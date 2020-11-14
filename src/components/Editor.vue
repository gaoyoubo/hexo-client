<template>
  <div
    ref="editor"
    :style="{ height: contentHeight }"
    style="height: 100%; width: 100%;"
  ></div>
</template>

<script>
import qiniuUploader from "@/service/QiniuUploader";
import smmsUploader from "@/service/SmmsUploader";
import aliyunOssUploader from "@/service/AliyunOssUploader";
import tencentOssUploader from "@/service/TencentOssUploader";
import Vditor from "vditor";
import "vditor/src/assets/scss/index.scss";

export default {
  name: "Editor",
  props: {
    value: {
      type: String,
      default: ""
    },
    initValue: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      vditor: null,
      contentHeight: this.height
    };
  },
  mounted() {
    this.initEditor();
    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    initEditor() {
      this.resize();
      const me = this;
      this.vditor = new Vditor(this.$refs.editor, {
        value: me.value,
        mode: "sv",
        toolbar: [
          "fullscreen",
          "|",
          "emoji",
          "headings",
          "bold",
          "italic",
          "strike",
          "link",
          "list",
          "ordered-list",
          "check",
          "outdent",
          "indent",
          "quote",
          "line",
          "code",
          "inline-code",
          "upload",
          "table",
          "undo",
          "redo",
          "|",
          "edit-mode",
          "preview",
          "both",
          {
            name: "more",
            toolbar: ["devtools"]
          }
        ],
        toolbarConfig: {
          pin: false,
          hide: false
        },
        placeholder: "请输入内容",
        cache: {
          enable: false
        },
        counter: {
          enable: true,
          type: "text"
        },
        delay: 200,
        theme: "classic",
        preview: {
          mode: "both",
          markdown: {
            toc: true,
            mark: true
          },
          hljs: {
            enable: true,
            style: "github",
            lineNumber: true
          },
          actions: ["desktop", "tablet", "mobile"]
        },
        upload: {
          accept: "image/*",
          filename(name) {
            return name.replace(/\?|\\|\/|:|\||<|>|\*|\[|\]|\s+/g, "-");
          },
          handler(files) {
            console.log(files);
            for (let i = 0; i < files.length; i++) {
              me.imgAdd(files[i])
                .then({})
                .catch(e => {
                  console.log(e);
                });
            }
          }
        },
        input(val) {
          me.$emit("input", val);
          me.$emit("change", val);
        }
      });
    },
    resize() {
      this.contentHeight = document.documentElement.clientHeight - 105 + "px";
    },
    async imgAdd(file) {
      const me = this;
      const sysConfig = me.$store.state.Config.config;
      try {
        let url = "";
        if (sysConfig.uploadType === "aliyunOss") {
          url = await aliyunOssUploader.upload(file, sysConfig);
        } else if (sysConfig.uploadType === "tencentOss") {
          url = await tencentOssUploader.upload(file, sysConfig);
        } else if (sysConfig.uploadType === "qiniu") {
          url = await qiniuUploader.upload(file, sysConfig);
        } else if (sysConfig.uploadType === "sm.ms") {
          url = await smmsUploader.upload(file);
        } else {
          me.$notify.error({
            title: "错误",
            message: "不支持的上传类型：" + sysConfig.uploadType
          });
        }
        if (url) {
          me.vditor.insertValue("![" + file.name + "](" + url + ")");
        }
      } catch (e) {
        console.error(e);
        me.$notify.error({
          title: "错误",
          message: "图片上传失败：" + e
        });
      }
    }
  },
  computed: {
    editorLanguage() {
      let config = this.$store.state.Config.config;
      if (config.language === "zh") {
        return "zh-CN";
      } else {
        return "en";
      }
    }
  }
};
</script>

<style scoped></style>
