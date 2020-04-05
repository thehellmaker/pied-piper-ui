/* eslint-disable eol-last */
<template>
  <div class="wrapper fadeInDown">
    <div id="formContent">
      <!-- Tabs Titles -->
      <h2 class="inactive underlineHover">
        <a href="/login">Sign In</a>
      </h2>
      <!--h2 class="inactive underlineHover">
        <a href="/signup">Sign Up</a>
      </h2-->

      <!-- Icon -->
      <div class="fadeIn first">
        <img src="../../assets/logo-notext.jpg" id="icon" alt="User Icon" />
      </div>

      <!-- Login Form -->
      <form>
        <input
          type="text"
          id="Email"
          class="fadeIn second"
          name="Email"
          placeholder="Email"
          v-model="email"
        />
        <input v-on:click="forgotPassword" type="submit" class="fadeIn fourth" value="Submit" />
      </form>

      <!-- Success message -->
      <div
        class="nav-action-alert alert alert-success"
        v-if="successMessage"
      >{{this.successMessage}}</div>

      <!-- Error message -->
      <div class="alert alert-danger alert-nodename" v-if="error">
        <strong>Error :</strong>
        {{this.error}}
      </div>
    </div>
  </div>
</template>

<script>
import * as myAuthenticationPlugin from 'authenticationPlugin/App'
export default {
  name: 'forgotPassword',
  data: function () {
    return {
      email: '',
      successMessage: '',
      error: ''
    }
  },
  methods: {
    forgotPassword: async function (e) {
      try {
        e.preventDefault()
        this.successMessage = await myAuthenticationPlugin.default.forgotPassword(
          this.email
        )
      } catch (err) {
        this.error = err.message
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/authentication.scss'
</style>
