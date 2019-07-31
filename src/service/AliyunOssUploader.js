import when from 'when'

const OSS = require('ali-oss')
const urllib = require('urllib')
const moment = require('moment')
const uuid = require('uuid/v1')
const path = require('path')

class AliyunOssUploader {
  async upload (file, sysConfig) {
    let client = AliyunOssUploader.getOssClient(sysConfig)
    try {
      let b = await AliyunOssUploader.fileToBuffer(file)
      let key = AliyunOssUploader.makeKey(file)
      let result = await client.put(key, b)
      return AliyunOssUploader.makeUrl(sysConfig, result)
    } catch (e) {
      throw e
    }
  }

  static getOssClient (sysConfig) {
    return new OSS({
      endpoint: sysConfig.aliyunOssEndpoint,
      accessKeyId: sysConfig.aliyunOssAccessKeyId,
      accessKeySecret: sysConfig.aliyunOssAccessKeySecret,
      bucket: sysConfig.aliyunOssBucket,
      urllib: urllib
    })
  }

  static fileToBuffer (file) {
    let deferred = when.defer()
    let reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = function () {
      let b = Buffer.from(this.result)
      deferred.resolve(b)
    }
    return deferred.promise
  }

  static makeKey (file) {
    let extName = this.extName(file)
    return 'hexo-client/' + moment().format('YYYY/MM/DD/') + uuid() + extName
  }

  static extName (file) {
    let ext
    if (file && file.name) {
      ext = path.extname(file.name)
    }
    if (!ext) {
      ext = '.jpg'
    }
    return ext
  }

  static makeUrl (sysConfig, result) {
    if (!sysConfig.aliyunOssHost) {
      // 没配置host的情况下，使用默认的url
      return result.url
    }
    return sysConfig.aliyunOssHost + result.name
  }
}

export default new AliyunOssUploader()
