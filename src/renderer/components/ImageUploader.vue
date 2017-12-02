<template>
  <el-container>
    <el-main>
      <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          accept="image/*"
          :http-request="doUpload"
          :multiple="true"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
  import qiniuJs from 'qiniu.js'

  var qiniu = require('qiniu')
  var fs = require('fs')
  var md5 = require('md5')

  export default {
    data () {
      return {
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    methods: {
      doUpload (event) {
        debugger
        var buf = fs.readFileSync(event.file.path)
        var key = md5(buf)
        var upToken = this.getUpToken(key)
        console.log(upToken)

        var imagesBucket = qiniuJs.bucket('m-spring', {
          putToken: upToken,
          url: 'http://file.mspring.org'
        })
        imagesBucket.putFile(key, event.file, {
          progress: function (precent, loaded, total) {
          }
        }).then(function (rsp) {
          var image = imagesBucket.key(rsp.key)
          console.log(image)
          /*
          if (onSuccess) {
            onSuccess({
              key: rsp.key,
              hash: rsp.hash,
              url: image.url()
            })
          }
          */
        }, function (err) {
          console.log(err)
        })
      },
      getUpToken (key) {
        var config = new qiniu.conf.Config()
        config.zone = qiniu.zone.Zone_z0

        var accessKey = 'fFLsq2BPeDEXYsnkEpFlICPfsU6pYCfXV21GL8zY'
        var secretKey = 'S3Qr4jS8WH5Fp-ubtVFelQnDk37M3j71q2Td5Xj2'
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

        var putPolicy = new qiniu.rs.PutPolicy({scope: 'm-spring' + ':' + key})
        return putPolicy.uploadToken(mac)
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      }
    }
  }
</script>