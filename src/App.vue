<template>
  <div id="app">
    <div class="nav">
      <img class="logo" src="./assets/logo-notext.jpg" />
      <div class="logo-text"> PIED PIPER</div>
      <div class="bordered-button nav-button bordered-button-red"> <a class="no-link" href="/#/create/api">CREATE API</a> </div>
      <div class="nav-button"> <a class="no-link" href="/#/"> SEARCH APIs </a>  </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
