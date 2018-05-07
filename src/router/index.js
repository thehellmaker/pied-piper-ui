import Vue from 'vue'
import Router from 'vue-router'
import SearchAPI from '@/components/SearchAPI'
import CreateAPI from '@/components/CreateAPI'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SearchAPI',
      component: SearchAPI
    },
    {
      path: '/create/api',
      name: CreateAPI,
      component: CreateAPI
    }
  ]
})
