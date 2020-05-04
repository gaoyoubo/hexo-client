import when from "when";

const COS = require("cos-nodejs-sdk-v5");
const moment = require("moment");
import { v4 as uuid } from "uuid";
const path = require("path");

class TencentOssUploader {
  async upload(file, sysConfig) {
    let b = await TencentOssUploader.fileToBuffer(file);
    let key = TencentOssUploader.makeKey(file);
    return TencentOssUploader.putObject(sysConfig, key, b);
  }

  static fileToBuffer(file) {
    let deferred = when.defer();
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function() {
      let b = Buffer.from(this.result);
      deferred.resolve(b);
    };
    return deferred.promise;
  }

  static makeKey(file) {
    let extName = this.extName(file);
    return "hexo-client/" + moment().format("YYYY/MM/DD/") + uuid() + extName;
  }

  static extName(file) {
    let ext;
    if (file && file.name) {
      ext = path.extname(file.name);
    }
    if (!ext) {
      ext = ".jpg";
    }
    return ext;
  }

  static getOssClient(sysConfig) {
    return new COS({
      SecretId: sysConfig.tencentOssSecretId,
      SecretKey: sysConfig.tencentOssSecretKey
    });
  }

  static async putObject(sysConfig, key, b) {
    let client = TencentOssUploader.getOssClient(sysConfig);
    let data = await new Promise((res, rej) => {
      client.putObject(
        {
          Bucket: sysConfig.tencentOssBucket,
          Region: sysConfig.tencentOssCOS_REGION,
          Key: key,
          StorageClass: "STANDARD",
          Body: b
        },
        function(err, data) {
          if (err) {
            rej(err);
          } else {
            res(data);
          }
        }
      );
    });
    return "https://" + data.Location;
  }
}

export default new TencentOssUploader();
