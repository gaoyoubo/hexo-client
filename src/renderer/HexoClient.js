import When from 'when'
import Nedb from 'nedb'
import path from 'path'
import qiniu from 'qiniu'
import * as qiniuJs from 'qiniu-js'

var fs = require('fs')
var md5 = require('md5')

const HOME_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
const DB_PATH = `${path.resolve(HOME_PATH, '.hexo-client/db')}`
var db = new Nedb({
  autoload: true,
  filename: DB_PATH
})

class HexoClient {
  upConfig (key) {
    var deferred = When.defer()
    this.sysConfig().then(sysConfig => {
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

  upload (file) {
    var key
    if (file.path) {
      var buf = fs.readFileSync(file.path)
      key = md5(buf)
    } else {
      // TODO gaoyoubo @ 2018/7/21 这里的md5计算的并不正确
      key = md5(file)
    }

    var deferred = When.defer()
    this.upConfig(key).then(upConfig => {
      var putExtra = {
        fname: '',
        params: {},
        mimeType: [] || null
      }
      var config = {
        useCdnDomain: true,
        disableStatisticsReport: false,
        retryCount: 6
      }
      var observable = qiniuJs.upload(file, upConfig.key, upConfig.upToken, putExtra, config)
      var observer = {
        next (res) {
          deferred.notify(res)
        },
        error (err) {
          deferred.reject(err)
        },
        complete (res) {
          var url = upConfig.host + '/' + res.key
          deferred.resolve(url)
        }
      }
      observable.subscribe(observer)
    }, err => {
      deferred.reject(err)
    })
    return deferred.promise
  }

  /**
   * 文本框光标位置插入文字
   * @param editor
   * @param str
   */
  insertText (editor, str) {
    if (document.selection) {
      var sel = document.selection.createRange()
      sel.text = str
    } else if (typeof editor.selectionStart === 'number' && typeof editor.selectionEnd === 'number') {
      var startPos = editor.selectionStart
      var endPos = editor.selectionEnd
      var cursorPos = startPos
      var tmpStr = editor.value
      editor.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length)
      cursorPos += str.length
      editor.selectionStart = editor.selectionEnd = cursorPos
    } else {
      editor.value += str
    }
    return editor.value
  }

  /**
   * 保存单个属性
   * @param id
   * @param property
   * @param value
   * @returns {*}
   */
  dbSetProperty (id, property, value) {
    var doc = {}
    doc[property] = value
    return this.dbSet(id, doc)
  }

  /**
   * 保存文档
   * @param id
   * @param doc
   */
  dbSet (id, doc) {
    var deferred = When.defer()
    doc['_id'] = id
    db.update(
      {
        _id: id
      },
      {
        $set: doc
      },
      {
        multi: true,
        upsert: true,
        returnUpdatedDocs: true
      },
      (err, affected, doc, upsert) => {
        if (err) {
          deferred.reject(err)
        }
        deferred.resolve(doc)
      }
    )
    return deferred.promise
  }

  dbGet (id) {
    var deferred = When.defer()
    db.findOne({_id: id}, (err, doc) => {
      if (err) {
        deferred.reject(err)
      }
      deferred.resolve(doc)
    })
    return deferred.promise
  }

  sysConfig () {
    return this.dbGet('sysConfig')
  }
}

export default new HexoClient()
