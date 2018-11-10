// 记录页面状态
const state = {
  postListScrollTop: 0,
  postListScrollLeft: 0,
  dialogFormVisible: false
}
const mutations = {
  onscroll (state, obj) {
    state.postListScrollTop = obj.scrollTop
    state.postListScrollLeft = obj.scrollLeft
  },
  setDialogFormVisible (state, visible) {
    state.dialogFormVisible = visible
  }
}
const actions = {
  onscroll (context, obj) {
    context.commit('onscroll', {
      scrollTop: obj.scrollTop,
      scrollLeft: obj.scrollLeft
    })
  },
  setDialogFormVisible (context, visible) {
    context.commit('setDialogFormVisible', visible)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
