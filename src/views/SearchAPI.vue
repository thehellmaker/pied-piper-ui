<template>
  <div class="search-container">
    <div class="spacing"></div>
    <div class="card-view search-view">
      <div class="heading">
        SEARCH API
      </div>
      <div class="content">
        <div class="search-box">
          <div>
          <input class="search-text" placeholder="Project Name" v-model="projectName"/>
          </div>
          <div>
          <input class="search-text" placeholder="Graph Name" v-model="graphName"/>
          </div>
          <div class="btn btn-primary" @click="triggerExactSearch(projectName, graphName)"> Search </div>
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
          <tr v-for="graph in graphList" :key="graph.graphName">
            <td class="api-name"> <a :href="'/api?projectName='+graph.projectName+'&graphName='+graph.graphName">{{graph.graphName}}</a>  </td>
            <td class="api-project-name" @click="triggerExactSearch(graph.projectName, '')"> {{graph.projectName}} </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="spacing"></div>
  </div>

</template>

<script>
const host = require('../../config.js')
var hostnamePrefix = host.hostname
export default {
  name: 'PiedPiper',
  data () {
    return {
      projectName: '',
      graphName: '',
      searchTerm: '',
      graphList: []
    }
  },
  methods: {
    search: function () {
      var searchGraphInput = {
        filterType: 'UNIQUE_GRAPH_LIST_FILTER',
        projectName: this.projectName,
        graphName: this.graphName,
        searchTerm: this.searchTerm
      }
      this.$http.post(hostnamePrefix + '/graph/search', searchGraphInput).then(function (successEvent) {
        var output = successEvent.data
        var parsedGraphs = []
        if (output.length === 0) this.$set(this, 'graphList', parsedGraphs)
        output.forEach(function (element) {
          parsedGraphs.push(element)
        })
        this.$set(this, 'graphList', parsedGraphs)
      }, function (errorEvent) {
        console.log(errorEvent)
      })
    },
    triggerExactSearch: function (projectName, graphName) {
      if(projectName === undefined || projectName.trim() === '') return;
      var url = '/?projectName='+projectName
      if(graphName !== undefined && graphName.trim() !== '' )  url += '&graphName='+graphName
      window.location.href = url
    }
  },
  mounted: function () {
    if(this.$route.query.projectName === undefined || this.$route.query.projectName === '') {
      window.location.href = '/?projectName=Examples'
    } else {
      this.projectName = this.$route.query.projectName
      this.graphName = this.$route.query.graphName
      this.search()
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
