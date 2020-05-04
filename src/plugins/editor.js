import Vue from "vue";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";

Vue.use(mavonEditor);

// 禁用渲染html，修复一个漏洞。https://github.com/gaoyoubo/hexo-client/issues/35
mavonEditor.markdownIt.set({ html: false });
