import firebase from 'firebase'
export function refreshPageOnAuthStateChange (app, Vue, App, router, store) {
  firebase.auth().onAuthStateChanged(user => {
    if (!app) {
      app=new Vue({
        router,
        store,
        components: { App },
        template: '<App/>'
        // render: h => h(App)
      }).$mount('#app')
    }
  })
}
