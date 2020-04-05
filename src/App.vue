<template>
  <div id="app">
    <div class="nav">
      <a class="no-link" href="/"><img class="logo" src="./assets/logo-notext.jpg" /></a>
      <a class="no-link" href="/"><div class="logo-text"> PIED PIPER</div></a>
      <a v-if='isLoggedIn' class="no-link"><div v-on:click='logout' class="nav-button btn btn-outline-danger"> LOGOUT</div></a>
      <a v-if='isLoggedIn' class="no-link" href="/api"><div class="nav-button btn btn-outline-danger"> CREATE API</div></a>
      <a v-if='isLoggedIn' class="no-link" href="/"><div class="nav-button btn btn-outline-secondary"> SEARCH APIs</div></a>
    </div>
    <router-view/>
    <div class="alert alert-danger alert-nodename" v-if="error">
        <strong>Error :</strong>
        {{this.error}}
      </div>
  </div>
</template>

<script>
import * as myAuthenticationPlugin from 'authenticationPlugin/App'
export default {
  name: 'App',
  data () {
    return {
      isLoggedIn: myAuthenticationPlugin.isAuthenticated(),
      error: ''
    }
  },
  methods: {
    logout: async function () {
      try {
        await myAuthenticationPlugin.logout()
        this.$router.go({ path: this.$router.path })
      } catch (err) {
        this.error=err.message
      }
    }
  }
}
</script>
