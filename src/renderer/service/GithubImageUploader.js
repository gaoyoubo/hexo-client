import when from 'when'

const fs = require('fs')
const path = require('path')
const uuid = require('uuid/v1')

class GithubImageUploader {
  upload (file, sysConfig) {
    let deferred = when.defer()
    fileToBuffer(file, function (buffer) {
      let path = getFilePath(file, sysConfig)
      fs.writeFile(path, buffer, {'flag': 'w'}, function (err) {
        if (err) {
          deferred.reject(err)
        } else {
          commitAndPush(path, sysConfig).then(function () {
            deferred.resolve('fuck')
          }).catch(function (e) {
            deferred.reject(e)
          })
        }
      })
    })
    return deferred.promise
  }
}

async function commitAndPush (path, sysConfig) {
  try {
    let workingDir = sysConfig.path
    let git = require('simple-git/promise')(workingDir)
    let branch = await getCurrentBranch(git)
    await git.add(path)
    await git.commit('Upload image ' + path)
    await git.push('origin', branch)
  } catch (e) {
    console.error(e)
    throw e
  }
}

async function getCurrentBranch (git) {
  let statusSummary = await git.status()
  return statusSummary.current
}

function fileToBuffer (file, callback) {
  let reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = function () {
    callback(Buffer.from(this.result))
  }
}

function getFilePath (file, sysConfig) {
  let dir = sysConfig.path
  let name = uuid()
  let ext = getFileExt(file)
  let imagesDir = path.format({
    dir: dir,
    base: 'source/images'
  })
  return path.format({
    dir: imagesDir,
    name: name,
    ext: ext
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

export default new GithubImageUploader()
