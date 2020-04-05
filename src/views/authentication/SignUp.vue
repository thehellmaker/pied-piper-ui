/* eslint-disable eol-last */
<template>
  <div class="wrapper fadeInDown">
    <div id="formContent">
      <!-- Tabs Titles -->
      <h2 class="inactive underlineHover">
        <a href="/login">Sign In</a>
      </h2>
      <h2 class="active">Sign Up</h2>

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
        <input
          type="password"
          id="password"
          class="fadeIn third"
          name="login"
          placeholder="Password"
          v-model="password"
        />
        <input v-on:click="signup" type="submit" class="fadeIn fourth" value="Sign Up" />
      </form>

      <!-- Remind Passowrd -->
      <div id="formFooter">
        <a class="underlineHover" href="/forgotpassword">Forgot Password?</a>
      </div>

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
import firebase from 'firebase'
import * as myAuthenticationPlugin from 'authenticationPlugin/App'
export default {
  name: 'login',
  data: function () {
    return {
      email: '',
      password: '',
      successMessage: '',
      error: ''
    }
  },
  methods: {
    signup: async function (e) {
      try {
        e.preventDefault()
        this.successMessage = await myAuthenticationPlugin.default.signup(
          this.email,
          this.password
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
