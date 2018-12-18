import qiniu from 'qiniu'
import When from 'when'

class QiniuManager {
  /**
   * 上传
   * @param file
   * @param sysConfig
   */
  upload (file, sysConfig) {
    let deferred = When.defer()
    let uploader = this.getFormUploader(sysConfig)
    this.upConfig(file, sysConfig).then(upConfig => {
      let putExtra = new qiniu.form_up.PutExtra()
      putExtra.progressCallback = (uploadBytes, totalBytes) => {
        deferred.notify(parseInt((uploadBytes / totalBytes * 10000)) / 100)
      }
      uploader.putFile(upConfig.upToken, null, file.path, putExtra, function (respErr, respBody, respInfo) {
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
    }, err => deferred.reject(err))
    return deferred.promise
  }

  upConfig (file, sysConfig) {
    let deferred = When.defer()
    let accessKey = sysConfig.qiniuAccessKey
    let secretKey = sysConfig.qiniuSecretKey
    let bucket = sysConfig.qiniuBucket
    let host = sysConfig.qiniuHost

    if (!accessKey || !secretKey || !bucket || !host) {
      deferred.reject('请先完成七牛配置！')
    } else {
      let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
      let putPolicy = new qiniu.rs.PutPolicy({
        scope: bucket,
        expires: 7200
      })
      let upToken = putPolicy.uploadToken(mac)
      deferred.resolve({upToken: upToken, host: host})
    }
    return deferred.promise
  }

  getFormUploader (sysConfig) {
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
}

export default new QiniuManager()
