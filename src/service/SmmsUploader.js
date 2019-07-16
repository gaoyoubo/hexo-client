import axios from 'axios'
import when from 'when'

class SmmsUploader {
  upload (file) {
    let formData = new FormData()
    formData.append('smfile', file)
    formData.append('ssl', 'true')
    formData.append('format', 'json')

    let config = {
      headers: {'Content-Type': 'multipart/form-data'}
    }

    let deferred = when.defer()
    axios.post('https://sm.ms/api/upload', formData, config).then(response => {
      if (response.status !== 200) {
        deferred.reject('网络错误')
      } else if (response.data.code === 'error') {
        deferred.reject(response.data.msg)
      } else {
        deferred.resolve(response.data.data.url)
      }
    }).catch(error => {
      deferred.reject(error)
    })
    return deferred.promise
  }
}

export default new SmmsUploader()
