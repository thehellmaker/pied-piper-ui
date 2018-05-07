<template>
  <div class="search-container">
    <div class="spacing"></div>
    <div class="card-view search-view">
      <div class="heading">
        SEARCH API
      </div>
      <div class="content">
        <div class="search-box">
          <input class="search-text" placeholder="Type your API name here"/>
          <div class="search-action">
            <img class="search-img" src="../assets/search.png"/>
          </div>
        </div>
      </div>
    </div>
    <div class="spacing"></div>
    <div class="card-view api-list-view">
      <div class="heading">
        SEARCH RESULTS
      </div>
      <div class="content">
        <table class="content-table">
          <tr>
            <th align="left"> API NAME </th>
            <th align="left"> PROJECT NAME </th>
          </tr>
          <tr>
            <td align="left" class="api-name"> GetRecommendedPrice </td>
            <td align="left" class="api-project-name"> Gringott Service </td>
          </tr>
          <tr>
            <td align="left" class="api-name"> GetRecommendedPrice </td>
            <td align="left" class="api-project-name"> Gringott Service </td>
          </tr>
          <tr>
            <td align="left" class="api-name"> GetRecommendedPrice </td>
            <td align="left" class="api-project-name"> Gringott Service </td>
          </tr>
          <tr>
            <td align="left" class="api-name"> GetRecommendedPrice </td>
            <td align="left" class="api-project-name"> Gringott Service </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="spacing"></div>
  </div>

</template>

<script>
export default {
  name: 'PiedPiper',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
