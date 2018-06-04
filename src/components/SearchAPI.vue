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
        <div class="search-box">
          <div>
            <input class="search-text" placeholder="Search Pied Piper" v-model="searchTerm"/>
          </div>
          <div class="btn btn-primary" @click="triggerKeyworkSearch(searchTerm)"> Search </div>
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
            <td class="api-name"> <a :href="'/#/api?projectName='+graph.projectName+'&graphName='+graph.graphName">{{graph.graphName}}</a>  </td>
            <td class="api-project-name" @click="triggerExactSearch(graph.projectName, '')"> {{graph.projectName}} </td>
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
      projectName: '',
      graphName: '',
      searchTerm: '',
      graphList: []
    }
  },
  methods: {
    search: function () {
      var searchGraphInput = {
        tableName: 'AlmightyTable',
        projectName: this.projectName,
        graphName: this.graphName,
        searchTerm: this.searchTerm
      }
      this.$http.post('https://ms9uc1ppsa.execute-api.us-east-1.amazonaws.com/prod/graph/search', searchGraphInput).then(function (successEvent) {
        var output = JSON.parse(successEvent.data).output
        var parsedGraphs = []
        if (output.length === 0) this.$set(this, 'graphList', parsedGraphs)
        output.forEach(function (element) {
          parsedGraphs.push(JSON.parse(element.graph))
        })
        this.$set(this, 'graphList', parsedGraphs)
      }, function (errorEvent) {
        console.log(errorEvent)
      })
    },
    triggerExactSearch: function (projectName, graphName) {
      console.log(JSON.stringify(projectName))
      this.projectName = projectName
      this.graphName = graphName
      this.search()
    },
    triggerKeyworkSearch: function (searchTerm) {
      this.projectName = ''
      this.graphName = ''
      this.searchTerm = searchTerm
      this.search()
    },
    triggerScan: function () {
      this.projectName = ''
      this.graphName = ''
      this.searchTerm = ''
      this.search()
    }
  },
  mounted: function () {
    this.search()
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
