import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: require('@/components/Index').default
    },
    {
      path: '/article',
      name: 'article',
      component: require('@/components/Article').default
    },
    {
      path: '/article/create',
      name: 'articleCreate',
      component: require('@/components/ArticleCreate').default
    },
    {
      path: '/config',
      name: 'config',
      component: require('@/components/Config').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
