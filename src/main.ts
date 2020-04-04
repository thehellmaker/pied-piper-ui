import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Resource from 'vue-resource'
import TreeView from 'vue-json-tree-view'
import './registerServiceWorker'
import 'authenticationPlugin/Init'
import * as myAuthenticationPlugin from 'authenticationPlugin/App'
require('./assets/css/piedpiper.css')
Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(Resource)
Vue.use(TreeView)

let app: import('vue/types/vue').CombinedVueInstance<Vue, object, object, object, Record<never, any>> | undefined
myAuthenticationPlugin.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      components: { App },
      template: '<App/>'
      // render: h => h(App)
    }).$mount('#app')
  }
})
