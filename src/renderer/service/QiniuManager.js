import qiniu from 'qiniu'
import When from 'when'
import configManager from './ConfigManager'

var fs = require('fs')
var md5 = require('md5')

class QiniuManager {
  /**
   * 上传
   * @param file
   * @param upConfig
   * @param progressCallback
   */
  upload (file) {
    var deferred = When.defer()

    var config = new qiniu.conf.Config()
    config.zone = qiniu.zone.Zone_z0

    var resumeUploader = new qiniu.resume_up.ResumeUploader(config)
    var putExtra = new qiniu.resume_up.PutExtra()
    putExtra.progressCallback = (uploadBytes, totalBytes) => {
      deferred.notify(parseInt((uploadBytes / totalBytes * 10000)) / 100)
    }
    this.upConfig(file).then(upConfig => {
      resumeUploader.putFile(upConfig.upToken, upConfig.key, file.path, putExtra, function (respErr, respBody, respInfo) {
        if (respErr) {
          deferred.reject(respErr)
        } else {
          if (respInfo.statusCode === 200) {
            var url = upConfig.host + '/' + respBody.key
            deferred.resolve(url)
          } else {
            deferred.reject()
          }
        }
      })
    }, err => deferred.reject(err))
    return deferred.promise
  }

  upConfig (file) {
    var deferred = When.defer()
    var key = this.getKey(file.path)
    configManager.getSysConfig().then(sysConfig => {
      var accessKey = sysConfig.qiniuAccessKey
      var secretKey = sysConfig.qiniuSecretKey
      var bucket = sysConfig.qiniuBucket
      var host = sysConfig.qiniuHost

      if (!accessKey || !secretKey || !bucket || !host) {
        deferred.reject('请先完成七牛配置！')
      } else {
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
        var putPolicy = new qiniu.rs.PutPolicy({
          scope: bucket + ':' + key,
          expires: 7200
        })
        var upToken = putPolicy.uploadToken(mac)
        deferred.resolve({upToken: upToken, host: host, key: key})
      }
    }, err => {
      deferred.reject(err)
    })
    return deferred.promise
  }

  /**
   * 获取文件的key
   * @param path
   * @returns {*}
   */
  getKey (path) {
    var buf = fs.readFileSync(path)
    return md5(buf)
  }
}

export default new QiniuManager()
