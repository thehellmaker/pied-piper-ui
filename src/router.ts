import Vue from 'vue'
import Router from 'vue-router'
import SearchAPI from './views/SearchAPI.vue'
import CreateAPI from './views/CreateAPI.vue'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'SearchAPI',
      component: SearchAPI
    },
    {
      path: '/api',
      name: 'CreateAPI',
      component: CreateAPI
    }
  ]
})
