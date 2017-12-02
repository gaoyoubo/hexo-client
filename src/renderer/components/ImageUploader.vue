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
  import qiniu from 'qiniu'

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
      doUpload (arg) {
        var config = new qiniu.conf.Config()
        config.zone = qiniu.zone.Zone_z0

        var accessKey = 'fFLsq2BPeDEXYsnkEpFlICPfsU6pYCfXV21GL8zY'
        var secretKey = 'S3Qr4jS8WH5Fp-ubtVFelQnDk37M3j71q2Td5Xj2'
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

        var localFile = arg.file.path
        var buf = fs.readFileSync(localFile)
        var key = md5(buf)

        var options = {
          scope: 'm-spring' + ':' + key
        }
        var putPolicy = new qiniu.rs.PutPolicy(options)
        var uploadToken = putPolicy.uploadToken(mac)

        var formUploader = new qiniu.form_up.FormUploader(config)
        var putExtra = new qiniu.form_up.PutExtra()
        formUploader.putFile(uploadToken, key, localFile, putExtra,
          function (respErr, respBody, respInfo) {
            if (respErr) {
              throw respErr
            }
            if (respInfo.statusCode === 200) {
              console.log(respBody)
            } else {
              console.log(respInfo.statusCode)
              console.log(respBody)
            }
          })
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