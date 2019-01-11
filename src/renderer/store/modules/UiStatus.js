// 记录页面状态
const state = {
  postListScrollTop: 0,
  postListScrollLeft: 0,
  dialogFormVisible: false,
  treeNavOpen: true // 树形导航菜单是否开启
}
const mutations = {
  onscroll (state, obj) {
    state.postListScrollTop = obj.scrollTop
    state.postListScrollLeft = obj.scrollLeft
  },
  setDialogFormVisible (state, visible) {
    state.dialogFormVisible = visible
  },
  setTreeNavOpen (state, open) {
    state.treeNavOpen = open
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
  },
  openTreeNav (context) {
    context.commit('setTreeNavOpen', true)
  },
  closeTreeNav (context) {
    context.commit('setTreeNavOpen', false)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
