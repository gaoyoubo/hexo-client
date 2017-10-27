<style>
  html, body {
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
  }

  .left {
    overflow-x: hidden;
    overflow-y: auto;
    background-color: rgb(238, 241, 246);
  }

  .right {
  }

  .post-list {
    position: relative;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;
    list-style: none;
    background-color: transparent;
  }

  .post-list .post-li {
    position: relative;
    overflow: hidden;
    padding: 0px;
  }

  .post-list .post-li .post-table {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  .post-list .post-li .post-table .post-table-cell {
    position: relative;
    display: table-cell;
  }

  .post-list .post-li .post-table .post-table-cell h4 {
    line-height: 21px;
    font-weight: 500;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 18px;
  }

  .post-list .post-li .post-table .post-table-cell h5 {
    font-size: 14px;
    font-weight: 400;
    color: #8f8f94;
  }

  .post-list .post-li .post-table .post-table-cell p {
    font-size: 12px;
    font-weight: 400;
    color: #8f8f94;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
<template>
  <el-container :style="{'height': windowHeight, 'border': 'solid 1px red;'}">
    <el-aside width="300px" class="left">
      <ul class="post-list">
        <li class="post-li" v-for="post in posts">
          <div class="post-table">
            <div class="post-table-cell">
              <h4>{{ post.title }}</h4>
              <h5>作者：{{ post.author }}</h5>
              <!--<p>Hi，李明明，申请交行信息卡，100元等你拿，李明明，申请交行信息卡，100元等你拿，</p>-->
            </div>
            <div class="mui-table-cell mui-col-xs-2 mui-text-right">
              <span class="mui-h5">{{ post.date }}</span>
            </div>
          </div>
        </li>
      </ul>
    </el-aside>

    <el-container class="right">
      <el-main>
        <el-table :data="tableData">
          <el-table-column prop="date" label="日期" width="140">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import hexo from '../store/modules/Hexo'

  export default {
    data () {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }
      return {
        tableData: Array(20).fill(item),
        windowHeight: '300px',
        posts: []
      }
    },

    methods: {
      handleResize () {
        this.windowHeight = document.documentElement.clientHeight + 'px'
        console.log(this.windowHeight)
      }
    },

    mounted () {
      this.handleResize()
      window.addEventListener('resize', this.handleResize)

      var me = this
      hexo.listPostFiles().then(filenames => {
        filenames.forEach(filename => {
          hexo.readPost(filename).then(post => {
            me.posts.push(post)
            console.log(me.posts.length)
          })
        })
      })
    },

    beforeDestroy () {
      window.removeEventListener('resize', this.handleResize)
    }
  }
</script>
