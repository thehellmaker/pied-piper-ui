import Vue from 'vue'
import Router, { Route } from 'vue-router'
import SearchAPI from './views/SearchAPI.vue'
import CreateAPI from './views/CreateAPI.vue'
import Login from './views/authentication/LogIn.vue'
import Signup from './views/authentication/SignUp.vue'
import forgotPassword from './views/authentication/ForgotPassword.vue'
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
    // {
    //   path: '/signup',
    //   name: 'signup',
    //   component: Signup,
    //   meta: {
    //     requiresGuest: true
    //   }
    // },
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
    requiresAuthLogic(to, next)
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    requiresGuestLogic(to, next)
  } else {
    // Proceed to route
    next()
  }
})
function requiresAuthLogic (to:Route, next:Function) {
  // check if NOT logged in
  if (!isUserLoggedIn()) {
    // Go to login
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  } else if (isUserEmailVerified() === true) {
    // Proceed to route
    next()
  }
}

function requiresGuestLogic (to:Route, next:Function) {
  if (isUserLoggedIn() && isUserEmailVerified() === true) {
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
}

function isUserLoggedIn () {
  return myAuthenticationPlugin.getLoggedInUser()
}
function isUserEmailVerified () {
  return myAuthenticationPlugin.getLoggedInUser().isEmailVerified
}
export default router
