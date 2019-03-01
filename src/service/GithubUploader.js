import when from 'when'

const fs = require('fs')
const path = require('path')
const uuid = require('uuid/v1')
const moment = require('moment')

class GithubUploader {
  upload (file, sysConfig) {
    let deferred = when.defer()
    fileToBuffer(file, function (buffer) {
      let sourceDir = getSourceDir(sysConfig)
      let abstractImgPath = getAbstractImgPath(file)
      let filepath = path.format({
        dir: sourceDir,
        base: abstractImgPath
      })

      // 判断如果父目录不存在，那么创建
      mkdirsSync(path.resolve(filepath, '..'))

      fs.writeFile(filepath, buffer, {'flag': 'w'}, function (err) {
        if (err) {
          deferred.reject(err)
        } else {
          deferred.resolve(abstractImgPath)
        }
      })
    })
    return deferred.promise
  }

  /**
   * 将markdown编辑器中本地相对路径的图片渲染出来
   * thanks for https://github.com/mshick/markdown-it-imgix
   * @param md
   * @param options
   */
  markdownItPlugin (md, options) {
    function mapSrc (profiles) {
      return function (token) {
        if (token.type === 'image') {
          let srcIndex = token.attrIndex('src')
          let src = getAttr(token, 'src')
          let width = getAttr(token, 'width')
          let height = getAttr(token, 'height')
          for (let profile of profiles) {
            if (!profile.match || !profile.prefix) {
              continue
            }
            if (startWith(src, profile.match)) {
              if (width && height) {
                profile.params = Object.assign({}, profile.params, {w: width, h: height})
              }
              token.attrs[srcIndex][1] = getImageBase64(profile.prefix, src)
            }
          }
        }
        return token
      }
    }

    function getImageBase64 (dir, filename) {
      let data = fs.readFileSync(dir + filename)
      let base64 = data.toString('base64')
      return 'data:image/jpg;base64,' + base64
    }

    function getAttr (token, attr) {
      const idx = token.attrIndex(attr)
      if (idx !== -1) {
        return token.attrs[idx][1]
      }
    }

    function startWith (str, prefix) {
      return str && prefix && str.indexOf(prefix) === 0
    }

    const profiles = Array.isArray(options) ? options : [options]
    const defaultRenderer = md.renderer.rules.image
    md.renderer.rules.image = function (tokens, idx, opt, env, self) {
      tokens = tokens.map(mapSrc(profiles))
      return defaultRenderer(tokens, idx, opt, env, self)
    }
  }
}

function mkdirsSync (dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

function fileToBuffer (file, callback) {
  let reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = function () {
    callback(Buffer.from(this.result))
  }
}

/**
 * 获取图片相对于source目录的路径
 * @param file
 */
function getAbstractImgPath (file) {
  let name = uuid()
  let ext = getFileExt(file)
  return '/images/' + moment().format('YYYY/MM/DD/') + name + ext
}

/**
 * 获取hexo的source目录路径
 * @param sysConfig
 * @returns {string}
 */
function getSourceDir (sysConfig) {
  return path.format({
    dir: sysConfig.path,
    base: 'source'
  })
}

function getFileExt (file) {
  let ext
  if (file && file.name) {
    ext = path.extname(file.name)
  }
  if (!ext) {
    ext = '.jpg'
  }
  return ext
}

export default new GithubUploader()
