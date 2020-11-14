<template>
  <el-main class="setting-main">
    <el-form label-width="120px" label-position="left" :model="config">
      <el-form-item :label="$t('settingTitlePath')">
        <el-input v-model="config.path" style="width:100%" />
      </el-form-item>
      <el-form-item :label="$t('settingTitleLanguage')">
        <el-select
          v-model="config.language"
          default-first-option
          :placeholder="$t('settingLanguagePlaceholder')"
          style="width:100%"
        >
          <el-option :label="$t('chinese')" value="zh"></el-option>
          <el-option :label="$t('english')" value="en"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="命令行自动部署">
        <el-switch v-model="config.shellDeploy"></el-switch>
      </el-form-item>

      <el-form-item :label="$t('settingTitleImageServer')">
        <el-select
          v-model="config.uploadType"
          default-first-option
          :placeholder="$t('settingImageServerPlaceholder')"
          style="width:100%"
        >
          <el-option label="GitHub" value="github"></el-option>
          <el-option label="七牛" value="qiniu"></el-option>
          <el-option label="阿里云OSS" value="aliyunOss"></el-option>
          <el-option label="腾讯云OSS" value="tencentOss"></el-option>
          <el-option label="sm.ms" value="sm.ms"></el-option>
        </el-select>
      </el-form-item>
      <transition name="el-zoom-in-top">
        <div v-show="config.uploadType === 'qiniu'">
          <el-form-item label="七牛存储区域">
            <el-select
              v-model="config.qiniuZone"
              default-first-option
              placeholder="请选择机房"
              style="width:100%"
            >
              <el-option label="华东" value="huadong"></el-option>
              <el-option label="华北" value="huabei"></el-option>
              <el-option label="华南" value="huanan"></el-option>
              <el-option label="北美" value="beimei"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="AccessKey">
            <el-input
              v-model="config.qiniuAccessKey"
              style="width:100%"
              placeholder="七牛AccessKey"
            />
          </el-form-item>
          <el-form-item label="SecretKey">
            <el-input
              v-model="config.qiniuSecretKey"
              style="width:100%"
              placeholder="七牛SecretKey"
            />
          </el-form-item>
          <el-form-item label="Bucket">
            <el-input
              v-model="config.qiniuBucket"
              style="width:100%"
              placeholder="七牛Bucket"
            />
          </el-form-item>
          <el-form-item label="Host">
            <el-input
              v-model="config.qiniuHost"
              style="width:100%"
              placeholder="七牛Host"
            />
          </el-form-item>
        </div>
      </transition>

      <transition name="el-zoom-in-top">
        <div v-show="config.uploadType === 'aliyunOss'">
          <el-form-item label="Endpoint">
            <el-input
              v-model="config.aliyunOssEndpoint"
              style="width:100%"
              placeholder="Aliyun oss endpoint"
            />
          </el-form-item>
          <el-form-item label="AccessId">
            <el-input
              v-model="config.aliyunOssAccessKeyId"
              style="width:100%"
              placeholder="Aliyun oss accessKeyId"
            />
          </el-form-item>
          <el-form-item label="AccessSecret">
            <el-input
              v-model="config.aliyunOssAccessKeySecret"
              style="width:100%"
              placeholder="Aliyun oss accessKeySecret"
            />
          </el-form-item>
          <el-form-item label="Bucket">
            <el-input
              v-model="config.aliyunOssBucket"
              style="width:100%"
              placeholder="Aliyun oss bucket"
            />
          </el-form-item>
          <el-form-item label="Host">
            <el-input
              v-model="config.aliyunOssHost"
              style="width:100%"
              placeholder="Aliyun oss host"
            />
          </el-form-item>
        </div>
      </transition>

      <transition name="el-zoom-in-top">
        <div v-show="config.uploadType === 'tencentOss'">
          <el-form-item label="SecretId">
            <el-input
              v-model="config.tencentOssSecretId"
              style="width:100%"
              placeholder="Tencent oss SecretId"
            />
          </el-form-item>
          <el-form-item label="SecretKey">
            <el-input
              v-model="config.tencentOssSecretKey"
              style="width:100%"
              placeholder="Tencent oss SecretKey"
            />
          </el-form-item>
          <el-form-item label="COS_REGION">
            <el-input
              v-model="config.tencentOssCOS_REGION"
              style="width:100%"
              placeholder="Tencent oss COS_REGION"
            />
          </el-form-item>
          <el-form-item label="Bucket">
            <el-input
              v-model="config.tencentOssBucket"
              style="width:100%"
              placeholder="Tencent oss bucket"
            />
          </el-form-item>
        </div>
      </transition>

      <el-form-item>
        <el-button type="primary" @click="saveConfig">{{
          $t("save")
        }}</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
export default {
  data() {
    return {
      config: {
        base: "",
        path: "",
        language: "",
        uploadType: "",
        qiniuZone: "",
        qiniuAccessKey: "",
        qiniuSecretKey: "",
        qiniuBucket: "",
        qiniuHost: "",
        aliyunOssEndpoint: "",
        aliyunOssAccessKeyId: "",
        aliyunOssAccessKeySecret: "",
        aliyunOssBucket: "",
        aliyunOssHost: "",
        tencentOssSecretId: "",
        tencentOssSecretKey: "",
        tencentOssCOS_REGION: "",
        tencentOssBucket: "",
        shellDeploy: false
      }
    };
  },
  created() {
    this.config = this.$store.state.Config.config;
  },
  methods: {
    async saveConfig() {
      let config = this.$store.state.Config.config;
      let message = "保存成功";
      if (config.language !== this.config.language) {
        message = "保存成功，变更语言需要重启后生效。";
      }
      await this.$store.dispatch("Config/setConfig", this.config);
      this.$notify.success({
        title: "成功",
        message: message
      });
    }
  }
};
</script>

<style scoped>
.setting-main .el-form {
  margin-top: 30px;
  width: 650px;
}
</style>
