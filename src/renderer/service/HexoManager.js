import configManager from './ConfigManager'
import when from 'when'

const Hexo = require('hexo')

class HexoManager {
  init () {
    var deferred = when.defer()
    configManager.getSysConfig().then(sysConfig => {
      if (sysConfig && sysConfig.path) {
        window.hexo = new Hexo(sysConfig.path, {
          debug: false
        })
        console.log('1. hexo init...')
        window.hexo.init().then(() => {
          console.log('2. hexo init...finished')
          console.log('3. hexo loading...')
          window.hexo.watch().then(function () {
            console.log('4. hexo loading...finished')
            deferred.resolve()
          })
        })
      } else {
        deferred.reject('请先配置hexo根目录')
      }
    })
    return deferred.promise
  }

  unwatch () {
    if (window.hexo) {
      window.hexo.unwatch()
    }
  }
}

export default new HexoManager()
