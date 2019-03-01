const Store = require('electron-store')
const os = require('os')

class Config {
  constructor () {
    this.store = new Store({
      cwd: os.homedir() + '/.hexo-client',
      name: 'sysConfig',
      fileExtension: 'json'
    })
  }

  all () {
    return this.store.store
  }

  get (key, defaultValue) {
    return this.store.get(key, defaultValue)
  }

  set (key, value) {
    this.store.set(key, value)
  }

  setAll (options) {
    if (!options) {
      return
    }
    let me = this
    Object.keys(options).forEach(function (key) {
      me.set(key, options[key])
    })
  }
}

export default new Config()
