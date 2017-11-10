<template>
  <Tabs v-model="activeName" @on-click="handleClick" :value="activeName" class="editor">
    <TabPane label="预览" name="preview">
      <div class="marked-preview markdown-body" v-html="markdown"
           :style="{'height': editorHeight}"></div>
    </TabPane>
    <TabPane label="编辑" name="edit">
      <textarea :id="editorId" ref="txt" class="marked-txt"
                :value="content"
                @input="update"
                :style="{'height': editorHeight}"></textarea>
    </TabPane>
  </Tabs>
</template>
<script>
  import marked from 'marked'

  export default {
    props: {
      value: {
        type: String,
        default: ''
      },
      editorHeight: {
        type: String,
        default: '400px'
      },
      inputActiveName: { // 默认打开的tab
        type: String,
        default: 'preview'
      }
    },
    data () {
      return {
        editorId: 'editor_' + new Date().getTime(),
        content: this.value,
        markdown: '',
        activeName: this.inputActiveName
      }
    },
    mounted () {
      // 设置编辑器内容
      this.$on('setContent', function (content) {
        this.setContent(content)
      })

      // 插入图片
      this.$on('insertImage', function (imageUrl) {
        var editor = document.getElementById(this.editorId)
        this.insertText(editor, '![](' + imageUrl + ')')

        this.content = editor.value
      })
    },
    watch: {
      value (val) {
        this.setContent(val)
      }
    },
    methods: {
      update: function (e) {
        this.content = e.target.value
        this.$emit('input', this.content)
      },
      handleClick (tab, event) {
        if (tab.name === 'preview') {
          this.markdown = marked(this.content, {sanitize: true})
        }
      },
      // 光标位置插入内容
      insertText (obj, str) {
        if (document.selection) {
          var sel = document.selection.createRange()
          sel.text = str
        } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
          var startPos = obj.selectionStart
          var endPos = obj.selectionEnd
          var cursorPos = startPos
          var tmpStr = obj.value
          obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length)
          cursorPos += str.length
          obj.selectionStart = obj.selectionEnd = cursorPos
        } else {
          obj.value += str
        }
      },
      setContent (content) {
        this.content = content
        this.markdown = marked(this.content, {sanitize: true})
      }
    },
    components: {}
  }
</script>
<style>
  .editor {
    width: 99%;
    height: 100%;
    margin: 0px 0px 10px 0px;
  }

  .marked-txt {
    background-color: #f6f6f6;
  }

  .marked-preview {
    overflow: auto;
  }

  .marked-txt, .marked-preview {
    /*height: 400px;*/
    width: 100%;
    border: 1px solid #ccc;
    padding: 3px 10px;
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
  }

  .marked-preview code {
    color: #f66;
  }

  /*markdown样式*/
  .markdown-body {
    color: #333;
    word-wrap: break-word;
    font-size: 1pc;
    font-family: Helvetica Neue, Helvetica, Segoe UI, Arial, freesans, sans-serif;
    line-height: 1.6;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%
  }

  .markdown-body a {
    background-color: transparent
  }

  .markdown-body a:active, .markdown-body a:hover {
    outline: 0
  }

  .markdown-body strong {
    font-weight: 700
  }

  .markdown-body h1 {
    margin: .67em 0;
    font-size: 2em
  }

  .markdown-body img {
    border: 0
  }

  .markdown-body hr {
    box-sizing: content-box;
    height: 0
  }

  .markdown-body pre {
    overflow: auto
  }

  .markdown-body code, .markdown-body kbd, .markdown-body pre {
    font-size: 1em;
    font-family: monospace
  }

  .markdown-body input {
    margin: 0;
    color: inherit;
    font: inherit
  }

  .markdown-body html input[disabled] {
    cursor: default
  }

  .markdown-body input {
    line-height: normal
  }

  .markdown-body input[type=checkbox] {
    box-sizing: border-box;
    padding: 0
  }

  .markdown-body table {
    border-collapse: collapse;
    border-spacing: 0
  }

  .markdown-body td, .markdown-body th {
    padding: 0
  }

  .markdown-body * {
    box-sizing: border-box
  }

  .markdown-body input {
    font: 13px/1.4 Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif
  }

  .markdown-body a {
    color: #4078c0;
    text-decoration: none
  }

  .markdown-body a:active, .markdown-body a:hover {
    text-decoration: underline
  }

  .markdown-body hr {
    overflow: hidden;
    margin: 15px 0;
    height: 0;
    border: 0;
    border-bottom: 1px solid #ddd;
    background: 0 0
  }

  .markdown-body hr:after, .markdown-body hr:before {
    display: table;
    content: ""
  }

  .markdown-body hr:after {
    clear: both
  }

  .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
    margin-top: 15px;
    margin-bottom: 15px;
    line-height: 1.1
  }

  .markdown-body h1 {
    font-size: 30px
  }

  .markdown-body h2 {
    font-size: 21px
  }

  .markdown-body h3 {
    font-size: 1pc
  }

  .markdown-body h4 {
    font-size: 14px
  }

  .markdown-body h5 {
    font-size: 9pt
  }

  .markdown-body h6 {
    font-size: 11px
  }

  .markdown-body blockquote {
    margin: 0
  }

  .markdown-body ol, .markdown-body ul {
    margin-top: 0;
    margin-bottom: 0;
    padding: 0
  }

  .markdown-body ol ol, .markdown-body ul ol {
    list-style-type: lower-roman
  }

  .markdown-body ol ol ol, .markdown-body ol ul ol, .markdown-body ul ol ol, .markdown-body ul ul ol {
    list-style-type: lower-alpha
  }

  .markdown-body dd {
    margin-left: 0
  }

  .markdown-body code {
    font-size: 9pt;
    font-family: Consolas, Liberation Mono, Menlo, Courier, monospace
  }

  .markdown-body pre {
    margin-top: 0;
    margin-bottom: 0;
    font: 9pt Consolas, Liberation Mono, Menlo, Courier, monospace
  }

  .markdown-body .sel::-ms-expand {
    opacity: 0
  }

  .markdown-body .octicon {
    display: inline-block;
    text-decoration: none;
    font: normal normal normal 1pc/1 octicons-link;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-user-sel: none;
    -moz-user-sel: none;
    -ms-user-sel: none;
    user-sel: none
  }

  .markdown-body .octicon-link:before {
    content: '\f05c'
  }

  .markdown-body:after, .markdown-body:before {
    display: table;
    content: ""
  }

  .markdown-body:after {
    clear: both
  }

  .markdown-body > :first-child {
    margin-top: 0 !important
  }

  .markdown-body > :last-child {
    margin-bottom: 0 !important
  }

  .markdown-body a:not([href]) {
    color: inherit;
    text-decoration: none
  }

  .markdown-body .anchor {
    display: inline-block;
    margin-left: -18px;
    padding-right: 2px
  }

  .markdown-body .anchor:focus {
    outline: 0
  }

  .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
    margin-top: 1em;
    margin-bottom: 1pc;
    font-weight: 700;
    line-height: 1.4
  }

  .markdown-body h1 .octicon-link, .markdown-body h2 .octicon-link, .markdown-body h3 .octicon-link, .markdown-body h4 .octicon-link, .markdown-body h5 .octicon-link, .markdown-body h6 .octicon-link {
    visibility: hidden;
    color: #000;
    vertical-align: middle
  }

  .markdown-body h1:hover .anchor, .markdown-body h2:hover .anchor, .markdown-body h3:hover .anchor, .markdown-body h4:hover .anchor, .markdown-body h5:hover .anchor, .markdown-body h6:hover .anchor {
    text-decoration: none
  }

  .markdown-body h1:hover .anchor .octicon-link, .markdown-body h2:hover .anchor .octicon-link, .markdown-body h3:hover .anchor .octicon-link, .markdown-body h4:hover .anchor .octicon-link, .markdown-body h5:hover .anchor .octicon-link, .markdown-body h6:hover .anchor .octicon-link {
    visibility: visible
  }

  .markdown-body h1 {
    padding-bottom: .3em;
    border-bottom: 1px solid #eee;
    font-size: 2.25em;
    line-height: 1.2
  }

  .markdown-body h1 .anchor {
    line-height: 1
  }

  .markdown-body h2 {
    padding-bottom: .3em;
    border-bottom: 1px solid #eee;
    font-size: 1.75em;
    line-height: 1.225
  }

  .markdown-body h2 .anchor {
    line-height: 1
  }

  .markdown-body h3 {
    font-size: 1.5em;
    line-height: 1.43
  }

  .markdown-body h3 .anchor {
    line-height: 1.2
  }

  .markdown-body h4 {
    font-size: 1.25em
  }

  .markdown-body h4 .anchor {
    line-height: 1.2
  }

  .markdown-body h5 {
    font-size: 1em
  }

  .markdown-body h5 .anchor {
    line-height: 1.1
  }

  .markdown-body h6 {
    color: #777;
    font-size: 1em
  }

  .markdown-body h6 .anchor {
    line-height: 1.1
  }

  .markdown-body blockquote, .markdown-body dl, .markdown-body ol, .markdown-body p, .markdown-body pre, .markdown-body table, .markdown-body ul {
    margin-top: 0;
    margin-bottom: 1pc
  }

  .markdown-body hr {
    margin: 1pc 0;
    padding: 0;
    height: 4px;
    border: 0 none;
    background-color: #e7e7e7
  }

  .markdown-body ol, .markdown-body ul {
    padding-left: 2em
  }

  .markdown-body ol ol, .markdown-body ol ul, .markdown-body ul ol, .markdown-body ul ul {
    margin-top: 0;
    margin-bottom: 0
  }

  .markdown-body li > p {
    margin-top: 1pc
  }

  .markdown-body dl {
    padding: 0
  }

  .markdown-body dl dt {
    margin-top: 1pc;
    padding: 0;
    font-weight: 700;
    font-style: italic;
    font-size: 1em
  }

  .markdown-body dl dd {
    margin-bottom: 1pc;
    padding: 0 1pc
  }

  .markdown-body blockquote {
    padding: 0 15px;
    border-left: 4px solid #ddd;
    color: #777
  }

  .markdown-body blockquote > :first-child {
    margin-top: 0
  }

  .markdown-body blockquote > :last-child {
    margin-bottom: 0
  }

  .markdown-body table {
    display: block;
    overflow: auto;
    width: 100%;
    word-break: normal;
    word-break: keep-all
  }

  .markdown-body table th {
    font-weight: 700
  }

  .markdown-body table td, .markdown-body table th {
    padding: 6px 13px;
    border: 1px solid #ddd
  }

  .markdown-body table tr {
    border-top: 1px solid #ccc;
    background-color: #fff
  }

  .markdown-body table tr:nth-child(2n) {
    background-color: #f8f8f8
  }

  .markdown-body img {
    box-sizing: content-box;
    max-width: 100%;
    background-color: #fff
  }

  .markdown-body code {
    margin: 0;
    padding: 0;
    padding-top: .2em;
    padding-bottom: .2em;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, .04);
    font-size: 85%
  }

  .markdown-body code:after, .markdown-body code:before {
    content: "\00a0";
    letter-spacing: -.2em
  }

  .markdown-body pre > code {
    margin: 0;
    padding: 0;
    border: 0;
    background: 0 0;
    white-space: pre;
    font-size: 100%;
    word-break: normal
  }

  .markdown-body .highlight {
    margin-bottom: 1pc
  }

  .markdown-body .highlight pre, .markdown-body pre {
    overflow: auto;
    padding: 1pc;
    border-radius: 3px;
    background-color: #f7f7f7;
    font-size: 85%;
    line-height: 1.45
  }

  .markdown-body .highlight pre {
    margin-bottom: 0;
    word-break: normal
  }

  .markdown-body pre {
    word-wrap: normal
  }

  .markdown-body pre code {
    display: inline;
    overflow: initial;
    margin: 0;
    padding: 0;
    max-width: initial;
    border: 0;
    background-color: transparent;
    word-wrap: normal;
    line-height: inherit
  }

  .markdown-body pre code:after, .markdown-body pre code:before {
    content: normal
  }

  .markdown-body kbd {
    display: inline-block;
    padding: 3px 5px;
    border: solid 1px #ccc;
    border-radius: 3px;
    background-color: #fcfcfc;
    box-shadow: inset 0 -1px 0 #bbb;
    color: #555;
    vertical-align: middle;
    font-size: 11px;
    line-height: 10px;
    border-bottom-color: #bbb
  }

  .markdown-body .pl-c {
    color: #969896
  }

  .markdown-body .pl-c1, .markdown-body .pl-s .pl-v {
    color: #0086b3
  }

  .markdown-body .pl-e, .markdown-body .pl-en {
    color: #795da3
  }

  .markdown-body .pl-s .pl-s1, .markdown-body .pl-smi {
    color: #333
  }

  .markdown-body .pl-ent {
    color: #63a35c
  }

  .markdown-body .pl-k {
    color: #a71d5d
  }

  .markdown-body .pl-pds, .markdown-body .pl-s, .markdown-body .pl-s .pl-pse .pl-s1, .markdown-body .pl-sr, .markdown-body .pl-sr .pl-cce, .markdown-body .pl-sr .pl-sra, .markdown-body .pl-sr .pl-sre {
    color: #183691
  }

  .markdown-body .pl-v {
    color: #ed6a43
  }

  .markdown-body .pl-id {
    color: #b52a1d
  }

  .markdown-body .pl-ii {
    background-color: #b52a1d;
    color: #f8f8f8
  }

  .markdown-body .pl-sr .pl-cce {
    color: #63a35c;
    font-weight: 700
  }

  .markdown-body .pl-ml {
    color: #693a17
  }

  .markdown-body .pl-mh, .markdown-body .pl-mh .pl-en, .markdown-body .pl-ms {
    color: #1d3e81;
    font-weight: 700
  }

  .markdown-body .pl-mq {
    color: teal
  }

  .markdown-body .pl-mi {
    color: #333;
    font-style: italic
  }

  .markdown-body .pl-mb {
    color: #333;
    font-weight: 700
  }

  .markdown-body .pl-md {
    background-color: #ffecec;
    color: #bd2c00
  }

  .markdown-body .pl-mi1 {
    background-color: #eaffea;
    color: #55a532
  }

  .markdown-body .pl-mdr {
    color: #795da3;
    font-weight: 700
  }

  .markdown-body .pl-mo {
    color: #1d3e81
  }

  .markdown-body kbd {
    display: inline-block;
    padding: 3px 5px;
    border: solid 1px #ccc;
    border-radius: 3px;
    background-color: #fcfcfc;
    box-shadow: inset 0 -1px 0 #bbb;
    color: #555;
    vertical-align: middle;
    font: 11px Consolas, Liberation Mono, Menlo, Courier, monospace;
    line-height: 10px;
    border-bottom-color: #bbb
  }

  .markdown-body .task-list-item {
    list-style-type: none
  }

  .markdown-body .task-list-item + .task-list-item {
    margin-top: 3px
  }

  .markdown-body .task-list-item input {
    margin: 0 .35em .25em -1.6em;
    vertical-align: middle
  }

  .markdown-body :checked + .radio-label {
    position: relative;
    z-index: 1;
    border-color: #4078c0
  }
</style>
