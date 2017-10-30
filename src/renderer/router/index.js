import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'template',
      component: require('@/components/Template').default
    },
    {
      path: '/article',
      name: 'article',
      component: require('@/components/Article').default
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
