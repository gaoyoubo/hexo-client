// 记录页面滚动位置

const state = {
  postListScrollTop: 0,
  postListScrollLeft: 0
}
const mutations = {
  onscroll (state, obj) {
    state.postListScrollTop = obj.scrollTop
    state.postListScrollLeft = obj.scrollLeft
  }
}
const actions = {
  onscroll (context, obj) {
    context.commit('onscroll', {
      scrollTop: obj.scrollTop,
      scrollLeft: obj.scrollLeft
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
