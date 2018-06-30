import qiniu from 'qiniu'
import When from 'when'
import Nedb from 'nedb'
import path from 'path'

var fs = require('fs')
var md5 = require('md5')

const HOME_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
const DB_PATH = `${path.resolve(HOME_PATH, '.hexo-client/db')}`
var db = new Nedb({
  autoload: true,
  filename: DB_PATH
})

class HexoClient {
  /**
   * 获取上传令牌
   * @param accessKey
   * @param secretKey
   * @param bucket
   * @returns {string}
   */
  uploadToken (accessKey, secretKey, bucket) {
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    var putPolicy = new qiniu.rs.PutPolicy({
      scope: bucket,
      expires: 7200
    })
    return putPolicy.uploadToken(mac)
  }

  /**
   * 上传
   * @param file
   * @param uploadToken
   */
  upload (file, uploadToken) {
    var buf = fs.readFileSync(file.path)
    var key = md5(buf)

    var config = new qiniu.conf.Config()
    config.zone = qiniu.zone.Zone_z0

    var formUploader = new qiniu.form_up.FormUploader(config)
    var putExtra = new qiniu.form_up.PutExtra()

    // 文件上传
    var deferred = When.defer()
    formUploader.put(uploadToken, key, buf, putExtra, function (respErr, respBody, respInfo) {
      if (respErr) {
        deferred.reject(respErr)
      } else {
        if (respInfo.statusCode === 200) {
          deferred.resolve(respBody)
        } else {
          deferred.reject()
        }
      }
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
}

export default new HexoClient()
