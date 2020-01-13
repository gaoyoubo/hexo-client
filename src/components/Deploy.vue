<template>
  <div style="display:contents">
    <el-button
      icon="el-icon-upload"
      size="small"
      type="success"
      @click="deploy"
      circle
      style="margin-left: 10px;"
    ></el-button>

    <div
      v-if="showConsoleLoading"
      class="loading-console el-loading-mask loading-console is-fullscreen"
      :style="{width: deployConsoleWidth, height: deployConsoleHeight}"
    >
      <div class="el-loading-spinner">
        <i class="el-icon-loading"></i>
        <!-- <div class="el-loading-text"> -->
        <el-scrollbar class="el-loading-text el-scrollbar">
          <pre>{{deployConsoleText}}</pre>
          <div ref="consoleScrollEnd"></div>
        </el-scrollbar>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import when from "when";
const { exec } = require("child_process");
const fixPath = require("fix-path");
export default {
  name: "deploy",
  data() {
    return {
      showConsoleLoading: false,
      deployConsoleText: "发布中...\n",
      deployConsoleWidth: "0px",
      deployConsoleHeight: "0px"
    };
  },
  mounted() {
    window.addEventListener("resize", this.deployConsoleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.deployConsoleResize);
  },
  methods: {
    deploy() {
      if (this.$store.state.Config.config.shellDeploy) {
        this.deployHexoWithShell();
      } else {
        this.deployHexoWithGit();
      }
    },

    deployHexoWithShell() {
      const me = this;
      me.deployConsoleText = "发布中...\n";
      me.deployConsoleResize();
      me.showConsoleLoading = true;
      this.doDeployHexoWithShell().then(
        function() {
          // 执行成功
          me.deployConsoleAppendText("\n执行成功");
          me.$message({
            showClose: true,
            message: "发布成功",
            duration: 2000,
            type: "success",
            onClose: function() {
              me.showConsoleLoading = false;
            }
          });
        },
        function(err) {
          // 执行失败
          me.deployConsoleAppendText("\n执行失败");
          me.$message({
            showClose: true,
            message: "发布失败",
            duration: 2000,
            type: "error",
            onClose: function() {
              me.showConsoleLoading = false;
            }
          });
        },
        function(data) {
          // 执行中
          me.deployConsoleAppendText(data);
        }
      );
    },

    doDeployHexoWithShell() {
      var deferred = when.defer();
      fixPath();
      const workProcess = exec("hexo generate -d", {
        cwd: this.$store.state.Config.config.path,
        maxBuffer: 5000 * 1024 // 默认 200 * 1024
      });

      // 打印正常的后台可执行程序输出
      workProcess.stdout.on("data", function(data) {
        deferred.notify(data);
      });

      // 打印错误的后台可执行程序输出
      workProcess.stderr.on("data", function(data) {
        deferred.notify(data);
      });

      // 退出之后的输出
      workProcess.on("close", function(code, signal) {
        if (code === 0) {
          deferred.resolve(0);
        } else {
          deferred.reject(code, signal);
        }
      });

      return deferred.promise;
    },

    //
    // doDeployHexoWithShell() {
    //   return new Promise((resolve, reject, notify) => {
    //     exec(
    //       "hexo generate -d",
    //       {
    //         cwd: this.$store.state.Config.config.path,
    //         maxBuffer: 5000 * 1024 // 默认 200 * 1024
    //       },
    //       (err, stdout, stderr) => {
    //         if (err) {
    //           debugger;
    //           console.error(`shell err: ${err}`);
    //           return reject(err);
    //         }
    //         if (stdout) {
    //           debugger;
    //           console.log(stdout);
    //           resolve(stdout);
    //         } else {
    //           debugger;
    //           console.error(`err: ${stderr}`);
    //           return reject(stderr);
    //         }
    //       }
    //     );
    //   });
    // },

    async deployHexoWithGit() {
      let simpleStatus = await this.simpleStatus();
      if (simpleStatus.modified) {
        this.commit(
          simpleStatus.branch,
          "Commit at " + this.dateFormat("yyyy-MM-dd hh:mm:ss", new Date())
        );
      } else {
        this.$notify({ message: "资料库无变更", type: "warning" });
      }
    },

    async simpleStatus() {
      let status = { modified: false, branch: "master" };
      try {
        let statusSummary = await this.git().status();
        if (
          statusSummary.modified.length > 0 ||
          statusSummary.not_added.length > 0 ||
          statusSummary.deleted.length > 0
        ) {
          status.modified = true;
        }
        status.branch = statusSummary.current;
        return status;
      } catch (e) {
        console.error(e);
        return status;
      }
    },

    async commit(branch, msg) {
      let success = true;
      let loading = this.$loading({
        lock: true,
        text: "发布中请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      try {
        await this.git().add("./*");
        await this.git().commit(msg);
        await this.git().push("origin", branch);
      } catch (e) {
        success = false;
      } finally {
        loading.close();
        this.$message({
          showClose: true,
          message: success ? "发布成功" : "发布失败",
          duration: 2000,
          type: success ? "success" : "error"
        });
      }
    },

    git() {
      let workingDir = this.workingDir();
      return require("simple-git/promise")(workingDir);
    },

    workingDir() {
      let config = this.$store.state.Config.config;
      return config.path;
    },

    dateFormat(fmt, date) {
      var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    },

    deployConsoleAppendText(text) {
      this.deployConsoleText += text;
      if (
        this.$refs.consoleScrollEnd &&
        this.$refs.consoleScrollEnd.scrollIntoView
      ) {
        this.$refs.consoleScrollEnd.scrollIntoView(); // 滚动到最底部
      }
    },

    deployConsoleResize() {
      this.deployConsoleWidth = document.documentElement.clientWidth + "px";
      this.deployConsoleHeight = document.documentElement.clientHeight + "px";
    }
  }
};
</script>

<style lang="scss">
.loading-console {
  z-index: 2001;
  background-color: rgba(0, 0, 0, 0.7);

  .el-loading-spinner {
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    text-align: left;
    width: 100%;
    height: 100%;
    padding-top: 28px;
    // margin: 20px !important;

    i.el-icon-loading {
      margin-left: 10px;
    }

    div.el-loading-text {
      overflow: auto;
      // scroll-behavior: smooth;
      width: 100%;
      height: 100%;

      pre {
        margin: 0px;
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 50px;
      }
    }
  }
}
</style>
