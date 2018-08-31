import when from 'when'

const storage = require('electron-json-storage')
const CONFIG_KEY = 'sysConfig'

class ConfigManager {
  getSysConfig () {
    return this.get(CONFIG_KEY)
  }

  setSysConfig (options) {
    return this.set(CONFIG_KEY, options)
  }

  set (key, options) {
    var deferred = when.defer()
    storage.set(key, options, err => {
      if (err) {
        console.error(err)
        deferred.reject(err)
      } else {
        deferred.resolve()
      }
    })
    return deferred.promise
  }

  get (key) {
    var deferred = when.defer()
    storage.get(key, (err, data) => {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(data)
      }
    })
    return deferred.promise
  }
}

export default new ConfigManager()
