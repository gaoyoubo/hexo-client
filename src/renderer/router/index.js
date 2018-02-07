import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/posts',
      name: 'posts',
      component: require('@/components/Posts').default
    },
    {
      path: '/create',
      name: 'create',
      component: require('@/components/Create').default
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/components/Settings').default
    },
    {
      path: '*',
      redirect: '/posts'
    }
  ]
})
