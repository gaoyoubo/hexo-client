import qiniu from 'qiniu'
import when from 'when'

const stream = require('stream')

class QiniuUploader {
  /**
   * 上传
   * @param file
   * @param sysConfig
   */
  upload (file, sysConfig) {
    let deferred = when.defer()
    let uploader = getFormUploader(sysConfig)
    let upConfig = getUpConfig(sysConfig)
    let putExtra = new qiniu.form_up.PutExtra()
    putExtra.progressCallback = (uploadBytes, totalBytes) => {
      deferred.notify(parseInt((uploadBytes / totalBytes * 10000)) / 100)
    }
    fileToStream(file, function (fileStream) {
      uploader.putStream(upConfig.upToken, null, fileStream, putExtra, function (respErr, respBody, respInfo) {
        if (respErr) {
          deferred.reject(respErr)
        } else {
          if (respInfo.statusCode === 200) {
            let url = upConfig.host + '/' + respBody.key
            deferred.resolve(url)
          } else {
            deferred.reject()
          }
        }
      })
    })
    return deferred.promise
  }
}

export default new QiniuUploader()

function getFormUploader (sysConfig) {
  let config = new qiniu.conf.Config()
  if (sysConfig.qiniuZone === 'huadong') {
    config.zone = qiniu.zone.Zone_z0
  } else if (sysConfig.qiniuZone === 'huabei') {
    config.zone = qiniu.zone.Zone_z1
  } else if (sysConfig.qiniuZone === 'huanan') {
    config.zone = qiniu.zone.Zone_z2
  } else if (sysConfig.qiniuZone === 'beimei') {
    config.zone = qiniu.zone.Zone_na0
  } else {
    config.zone = qiniu.zone.Zone_z0
  }
  return new qiniu.form_up.FormUploader(config)
}

function getUpConfig (sysConfig) {
  let accessKey = sysConfig.qiniuAccessKey
  let secretKey = sysConfig.qiniuSecretKey
  let bucket = sysConfig.qiniuBucket
  let host = sysConfig.qiniuHost

  if (!accessKey || !secretKey || !bucket || !host) {
    throw new Error('请先完成七牛配置！')
  } else {
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    let putPolicy = new qiniu.rs.PutPolicy({
      scope: bucket,
      expires: 7200
    })
    let upToken = putPolicy.uploadToken(mac)
    return {upToken: upToken, host: host}
  }
}

function fileToStream (file, callback) {
  let reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = function () {
    let bufferStream = new stream.PassThrough()
    bufferStream.end(Buffer.from(this.result))
    callback(bufferStream)
  }
}
