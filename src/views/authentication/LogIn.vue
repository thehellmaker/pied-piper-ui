/* eslint-disable eol-last */
<template>
  <div class="wrapper fadeInDown">
    <div id="formContent">
      <!-- Tabs Titles -->
      <h2 id="login" class="active">Sign In</h2>
      <h2 class="inactive underlineHover">
        <a id="signup" href="/signup">Sign Up</a>
      </h2>
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
        <input v-on:click="login" type="submit" class="fadeIn fourth" value="Log In" id="submit" />
      </form>

      <!-- Remind Passowrd -->
      <div id="formFooter">
        <a id="forgotpassword" class="underlineHover" href="/forgotpassword">Forgot Password?</a>
      </div>

      <!-- Email not verified message -->
      <div class="alert alert-danger alert-nodename" v-if="this.isEmailVerified===false">
        <strong>Verify email!!!</strong>
        {{this.email}}
      </div>

      <!-- Error message -->
      <div class="alert alert-danger alert-nodename" v-if="error">
        <strong>Error :</strong>
        {{this.error}}
      </div>
    </div>
  </div>
</template>

<script>
import myAuthenticationPlugin from 'authenticationPlugin/App'
export default {
  name: 'login',
  data: function () {
    return {
      email: '',
      password: '',
      isEmailVerified: '',
      error: ''
    }
  },
  methods: {
    login: async function (e) {
      try {
        e.preventDefault()
        await myAuthenticationPlugin.authenticate(this.email, this.password)
        this.isEmailVerified = myAuthenticationPlugin.getLoggedInUser().isEmailVerified
        if (this.isEmailVerified) {
          this.$router.push({ path: this.$route.query.redirect })
          this.$router.go({ path: this.$router.path })
        }
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
