import firebase from 'firebase'
export function checkIfUserRegisteredAndEmailVerified (router) {
// Nav Guards
  router.beforeEach((to, from, next) => {
    // check for required auth guard
    if (to.matched.some(record => record.meta.requiresAuth)) {
    // check if NOT logged in
      if (!firebase.auth().currentUser) {
      // Go to login
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      } else if (firebase.auth().currentUser.emailVerified === true) {
      // Proceed to route
        next()
      }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // check if logged in
      if (firebase.auth().currentUser && firebase.auth().currentUser.emailVerified === true) {
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
  return router
}
