import Vue from 'vue'
import Router from 'vue-router'
import SearchAPI from './views/SearchAPI.vue'
import CreateAPI from './views/CreateAPI.vue'
import Login from './views/auth/LogIn.vue'
import Signup from './views/auth/SignUp.vue'
import forgotPassword from './views/auth/ForgotPassword.vue'
import * as myAuthenticationPlugin from 'authenticationPlugin/App'
Vue.use(Router)
let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/forgotpassword',
      name: 'forgotpassword',
      component: forgotPassword,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/',
      name: 'SearchAPI',
      component: SearchAPI,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/api',
      name: 'CreateAPI',
      component: CreateAPI,
      meta: {
        requiresAuth: true
      }
    }
  ]
})
// Nav Guards
router.beforeEach((to, from, next) => {
  // check for required auth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // check if NOT logged in
    if (!myAuthenticationPlugin.getLoggedInUser()) {
      // Go to login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else if (myAuthenticationPlugin.getLoggedInUser().isEmailVerified === true) {
      // Proceed to route
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // check if logged in
    if (myAuthenticationPlugin.getLoggedInUser() && myAuthenticationPlugin.getLoggedInUser().isEmailVerified === true) {
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      // Proceed to route
      next()
    }
  } else {
    // Proceed to route
    next()
  }
})
export default router
