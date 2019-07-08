let OSS = require('ali-oss')

class AliyunOssUploader {
  upload (file, sysConfig) {
    let client = ossClient(sysConfig)
    return client.put('object-key', new Blob(['content'], {type: 'text/plain'}))
    // return client.put('a/123', new Blob(['content'], {type: 'text/plain'}))
  }
}

function ossClient (sysConfig) {
  return new OSS({
    endpoint: 'https://oss-cn-hongkong.aliyuncs.com',
    accessKeyId: sysConfig.aliyunOssAccessKeyId,
    accessKeySecret: sysConfig.aliyunOssAccessKeySecret,
    bucket: sysConfig.aliyunOssBucket,
    cname: true
  })
}

export default new AliyunOssUploader()
