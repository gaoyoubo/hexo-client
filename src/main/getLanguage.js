import when from 'when'

const CONFIG_KEY = 'sysConfig'
const os = require('os')
const storage = require('electron-json-storage')
storage.setDataPath(os.homedir() + '/.hexo-client')

function getSysConfig () {
  let deferred = when.defer()
  storage.get(CONFIG_KEY, (err, data) => {
    if (err) {
      deferred.reject(err)
    } else {
      deferred.resolve(data.language)
    }
  })
  return deferred.promise
}

const getLanguage = async function () {
  let sysConfig = await getSysConfig()
  if (sysConfig && sysConfig.language) {
    return sysConfig.language
  } else {
    return 'zh'
  }
}
