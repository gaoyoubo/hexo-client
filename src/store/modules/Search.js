const state = {
  show: false,
  results: [],
  selectIndex: -1
};
const mutations = {
  show(state, show) {
    state.show = show;
  },
  results(state, results) {
    state.results = results;
  },
  incrSelectIndex(state, delta) {
    state.selectIndex += delta;
  },
  selectIndex(state, val) {
    state.selectIndex = val;
  }
};
const actions = {
  show(context) {
    context.commit("show", true);
  },
  hide(context) {
    context.commit("show", false);
    context.commit("selectIndex", -1);
  },
  search(context, keyword) {
    if (keyword) {
      let posts = context.rootGetters["Hexo/posts"];
      let results = posts.filter((item, index, array) => {
        let tempKeyword = keyword.toUpperCase();
        return (
          item.title.toUpperCase().indexOf(tempKeyword) >= 0 ||
          item.summary.toUpperCase().indexOf(tempKeyword) >= 0
        );
      });
      context.commit("results", results);
    } else {
      context.commit("results", []);
      context.commit("selectIndex", -1);
    }
  },
  selectUp(context) {
    let curIndex = context.state.selectIndex;
    let maxIndex = context.state.results.length - 1;
    if (maxIndex < 0 || curIndex < 0) {
      // 已经在最顶部
      return;
    }
    context.commit("incrSelectIndex", -1);
  },
  selectDown(context) {
    let curIndex = context.state.selectIndex;
    let maxIndex = context.state.results.length - 1;
    if (maxIndex < 0 || curIndex >= maxIndex) {
      // 已经在最底部
      return;
    }
    context.commit("incrSelectIndex", 1);
  },
  selectEnter(context, selectId) {
    if (!selectId) {
      let curIndex = context.state.selectIndex;
      if (curIndex >= 0) {
        let cur = context.state.results[curIndex];
        selectId = cur.id;
      }
    }
    if (selectId) {
      context.dispatch("Hexo/selectPost", selectId, { root: true });
      let item = document.getElementById(selectId);
      if (item) {
        item.scrollIntoViewIfNeeded(true); // 将文章列表滚动到所选的那篇文章处
      }
    }
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
