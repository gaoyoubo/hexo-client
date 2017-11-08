import Datastore from '@/Datastore'
import When from 'when'

class DBUtils {
  db () {
    return Datastore
  }

  getSysConfig () {
    var deferred = When.defer()
    Datastore.findOne({_id: 'sysConfig'}, (err, doc) => {
      if (err) {
        deferred.reject(err)
      }
      deferred.resolve(doc)
    })
    return deferred.promise
  }

  setSysConfig (key, value) {
    var cfg = {}
    cfg[key] = value
    return this.setSysConfigs(cfg)
  }

  setSysConfigs (config) {
    var deferred = When.defer()
    Datastore.update({
      _id: 'sysConfig'
    }, {
      $set: config
    }, {
      multi: true,
      upsert: true
    }, (err, affected, doc, upsert) => {
      if (err) {
        deferred.reject(err)
      }
      deferred.resolve()
    })
    return deferred.promise
  }
}

export default new DBUtils()
