<template>
  <div id="app">
    <div class="nav">
      <a class="no-link" href="/#/"><img class="logo" src="./assets/logo-notext.jpg" /></a>
      <a class="no-link" href="/#/"><div class="logo-text"> PIED PIPER</div></a>
      <a class="no-link" href="/#/api"><div class="nav-button btn btn-outline-danger"> CREATE API</div></a>
      <a class="no-link" href="/#/"><div class="nav-button btn btn-outline-secondary"> SEARCH APIs</div></a>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
