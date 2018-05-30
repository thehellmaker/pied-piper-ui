<template if="PiedPiper">
  <div class="create-api-page-container">
    <div class="graph-execution-container card-container">
      <div class="heading">
        <strong>EXECUTION</strong>
      </div>
      <div class="btn btn-outline-primary btn-sm" @click="showExecution = !showExecution" v-if="!showExecution">
        + Show Details
      </div>
      <div class="graph-input-output-container" v-if="showExecution">
        <div class="graph-explicit-inputs card-sub-container">
          <div class="heading">INPUTS</div>
          <ul>
            <li class="explicit-input-each" v-for="(value, key) in inputValues"
                :key="key">
              <span class="explicitValueName">{{key}}</span>
              <input v-model="inputValues[key]"/>
            </li>
          </ul>
        </div>
        <div class="btn btn-primary" @click="runGraph"> Run Graph </div>
        <div class="graph-output card-sub-container">
          <div class="heading">OUTPUT</div>
          <div class="output-value">{{outputValue}}</div>
        </div>
        <div class="btn btn-sm btn-outline-primary left" @click="showExecution = !showExecution" v-if="showExecution">
          - Hide Details
        </div>
      </div>
    </div>

    <div class="create-api-container card-container">
      <div class="heading">CREATE API GRAPH</div>
      <div class="content">
        <div class="nav-actions-container">
          <div class="nav-actions left">
            <span>
              <div class="project-heading">
                <div class="heading">PROJECT NAME</div>
                <editable v-model="graph.projectName"
                          class="editable-input"></editable>
              </div>
              <div class="project-heading">
                <div class="heading">GRAPH NAME</div>
                <editable v-model="graph.graphName"
                          class="editable-input"></editable>
              </div><br/>
              <div class="nav-action-alert alert alert-danger" v-if="!validGraph"><strong>ProjectName/GraphName is empty !!!</strong> Please Edit the project name</div>
              <div class="nav-action-alert alert alert-danger" v-if="saveGraphError"><strong>Save Error !!!</strong> An Error Occurred when attrmpting to save the graph</div>
              <div class="nav-action-alert alert alert-success" v-if="saveGraphSuccess"><strong>Save Success !!!</strong> The graph has been successfully saved</div>
            </span>
          </div>
          <div class="nav-actions right">
            <div class="btn btn-danger" @click="saveGraph"> Save </div>
            <b-dropdown id="ddown1" text="Add Node" right class="m-md-2" variant="success">
              <b-dropdown-item v-for="(node) in availableNodes" :key="node.nodeName" @click="addNode(node)">
                {{node.nodeClass}}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>

        <div class="node-container card-sub-container">
          <div class="node-list">
            <div class="heading">LIST OF NODES  </div>
            <ul>
              <li class="node" v-for="(node) in graph.nodeMap" :key="node.nodeName"
                  v-bind:class="{selected: isNodeSelected(node.nodeName)}" @click="setNodeSelection(node.nodeName)">
                {{node.nodeName}}
              </li>
            </ul>
          </div>
          <div class="spacing"></div>

          <div class="node-details" v-for="(node) in graph.nodeMap" :key="node.nodeName">
            <template v-if="isNodeSelected(node.nodeName)">
              <div class="heading">
                <editable v-model="node.nodeName" @input="syncNodeSelected(...arguments)"
                          class="node-name editable-input"></editable>
                <div class="node-type">Type:  {{node.nodeClass}}</div>
                <div class="btn btn-outline-danger btn-sm right" @click="deleteNode(node)">Delete Node</div>
                <div class="alert alert-danger alert-nodename" v-if="isNodeError(node.nodeName)"><strong>Duplicate Node Name!</strong>
                  Please provide a name which does not exist
                </div>
              </div>
              <!--<div class="node-spec-container">-->
              <!--<span class="node-spec"> <a href="#">Interim</a> </span>-->
              <!--<span class="node-spec"> | </span>-->
              <!--<span class="node-spec"> <a href="#">Enabled</a></span>-->
              <!--<span class="node-spec"> | </span>-->
              <!--<span class="node-spec"> <a href="#">Do not use cached data</a></span>-->
              <!--<span class="node-spec"> | </span>-->
              <!--<span class="node-spec"> <a href="#">Fan out</a></span>-->
              <!--</div>-->
              <div class="add-parameter-container">
                <div id="add-parameter" class="btn btn-primary" @click="addParam(node)"> Add Parameter </div>
              </div>
              <div class="parameter-container">
                <div class="param-list-container">
                  <ul>
                    <li class="node" v-for="(parameter) in node.parameterMap" :key="parameter.parameterName"
                        v-bind:class="{selected: isParamSelected(node.nodeName, parameter.parameterName)}"
                        @click="setParamSelection(node.nodeName, parameter.parameterName)">
                      {{parameter.parameterName}}<span v-if="parameter.required">*</span>
                    </li>
                  </ul>
                </div>
                <div class="spacing"></div>
                <div class="param-details-container" v-for="(parameter) in node.parameterMap"
                     v-if="isParamSelected(node.nodeName, parameter.parameterName)" :key="parameter.parameterName">
                  <div class="heading">
                    <editable v-model="parameter.parameterName" @input="syncParamSelected(...arguments)"
                              class="node-name editable-input"></editable>
                    <div class="btn btn-outline-danger btn-sm right" v-if="!parameter.required"
                         @click="deleteParam(node, parameter)">
                      Delete Parameter
                    </div>
                  </div>
                  <div class="alert alert-danger alert-nodename" v-if="isParamError(parameter.parameterName)"><strong>Duplicate Parameter Name!</strong>
                    Please provide a name which does not exist
                  </div>
                  <select v-model="parameter.parameterType" class="param-type" @change="checkIfValueAtRuntime">
                    <template v-for="parameterType in parameterTypes">
                      <option v-bind:key="parameterType">
                        {{parameterType}}
                      </option>
                    </template>
                  </select>
                  <select v-if="parameter.parameterType == 'REFERENCE_FROM_ANOTHER_NODE'"
                          v-model="parameter.referenceNodeName" class="param-reference-node">
                    <option v-for="(node) in graph.nodeMap" :key="node.nodeName">
                      {{node.nodeName}}
                    </option>
                  </select>
                  <div v-if="parameter.parameterType != 'VALUE_SPECIFIED_AT_RUNTIME'" class="constant-field-container">
                    <textarea type="Text" placeholder="Constant value here" class="constant-field"
                              v-model="parameter.parameterValue"/>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import editable from './Editable.vue'
export default {
  name: 'PiedPiper',
  components: {
    'editable': editable
  },
  data () {
    return {
      graph: {},
      parameterTypes: ['CONSTANT', 'REFERENCE_FROM_ANOTHER_NODE', 'VALUE_SPECIFIED_AT_RUNTIME', 'AWS_SSM  '],
      paramSelected: '',
      nodeSelected: '',
      duplicateNodeNameError: '',
      duplicateParamNameError: '',
      editField: '',
      availableNodes: [],
      newParameterJsonTemplate: {
        'parameterName': '',
        'parameterType': 'CONSTANT',
        'parameterValue': '',
        'referenceNodeName': ''
      },
      showExecution: false,
      inputValues: {},
      outputValue: '',
      saveGraphError: false,
      saveGraphSuccess: false
    }
  },
  methods: {
    printGraph: function () {
      console.log(JSON.stringify(this.graph))
    },
    getNodeSelectionValue: function (nodeName) {
      return nodeName
    },
    setNodeSelection: function (nodeName) {
      this.nodeSelected = this.getNodeSelectionValue(nodeName)
    },
    isNodeSelected: function (nodeName) {
      return this.nodeSelected === this.getNodeSelectionValue(nodeName)
    },
    isNodeError: function (nodeName) {
      return this.duplicateNodeNameError === this.getNodeSelectionValue(nodeName)
    },
    addNode: function (node) {
      if (this.graph.nodeMap === undefined) {
        this.$set(this.graph, 'nodeMap', {})
      }
      var clonedNode = this.cloneJson(node)
      clonedNode.nodeName = 'Node' + (parseInt(Object.keys(this.graph.nodeMap).length) + 1)
      clonedNode.parameterMap = {}
      var vm = this
      clonedNode.parameterMetadataList.forEach(function (element) {
        var newParameter = vm.cloneJson(vm.newParameterJsonTemplate)
        newParameter.parameterName = element.parameterName
        newParameter.required = element.required
        clonedNode.parameterMap[newParameter.parameterName] = newParameter
      })
      this.$set(this.graph.nodeMap, clonedNode.nodeName, clonedNode)
      this.setNodeSelection(clonedNode.nodeName)
    },
    deleteNode: function (node) {
      this.$delete(this.graph.nodeMap, node.nodeName)
    },
    syncNodeSelected: function (output, prev) {
      if (output === prev) {
        this.duplicateNodeNameError = ''
        return
      }
      if (this.graph.nodeMap[output] !== undefined) {
        this.duplicateNodeNameError = this.getNodeSelectionValue(prev)
        this.graph.nodeMap[prev].nodeName = prev
        return
      }

      var currentState = this.graph.nodeMap[prev]
      this.$delete(this.graph.nodeMap, prev)
      this.$set(this.graph.nodeMap, output, currentState)
      this.setNodeSelection(output)
    },
    getParamSelectionValue: function (nodeName, parameterName) {
      return parameterName
    },
    setParamSelection: function (nodeName, parameterName) {
      this.paramSelected = this.getParamSelectionValue(nodeName, parameterName)
    },
    isParamSelected: function (nodeName, parameterName) {
      return this.paramSelected === this.getParamSelectionValue(nodeName, parameterName)
    },
    addParam: function (node) {
      if (node.parameterMap === undefined) {
        this.$set(node, 'parameterMap', {})
      }
      var paramMap = node.parameterMap
      var paramName = 'param' + (parseInt(Object.keys(paramMap).length) + 1)
      var newParameter = this.cloneJson(this.newParameterJsonTemplate)
      newParameter.parameterName = paramName
      this.$set(paramMap, paramName, newParameter)
      this.setParamSelection(node.nodeName, paramName)
    },
    deleteParam: function (node, parameter) {
      this.$delete(node.parameterMap, parameter.parameterName)
    },
    syncParamSelected: function (output, prev) {
      if (output === prev) {
        this.duplicateParamNameError = ''
        return
      }
      if (this.graph.nodeMap[this.nodeSelected].parameterMap[output] !== undefined) {
        this.duplicateParamNameError = this.getParamSelectionValue(this.nodeSelected, prev)
        this.graph.nodeMap[this.nodeSelected].parameterMap[prev].parameterName = prev
        return
      }

      var currentState = this.graph.nodeMap[this.nodeSelected].parameterMap[prev]
      this.$delete(this.graph.nodeMap[this.nodeSelected].parameterMap, prev)
      this.$set(this.graph.nodeMap[this.nodeSelected].parameterMap, output, currentState)
      this.setParamSelection(this.nodeSelected, output)
    },
    isParamError: function (parameterName) {
      return this.duplicateParamNameError === this.getParamSelectionValue(this.nodeSelected, parameterName)
    },
    getNodeTypes: function () {
      this.$http.get('https://ms9uc1ppsa.execute-api.us-east-1.amazonaws.com/prod/nodetypes').then(function (response) {
        this.availableNodes = JSON.parse(response.data)
      }, function (error) {
        console.log(error.statusText)
      })
    },
    cloneJson: function (jsonObject) {
      return JSON.parse(JSON.stringify(jsonObject))
    },
    runGraph: function () {
      var executeGraphInput = {
        graph: this.graph,
        input: this.inputValues
      }
      this.$http.post('https://ms9uc1ppsa.execute-api.us-east-1.amazonaws.com/prod/graph/run', executeGraphInput).then(function (successEvent) {
        this.outputValue = JSON.stringify(successEvent)
      }, function (errorEvent) {
        this.outputValue = JSON.stringify(errorEvent)
      })
    },
    checkIfValueAtRuntime: function () {
      var explicitValues = {}
      if (this.graph.nodeMap !== undefined) {
        var graphLocal = this.graph
        Object.keys(this.graph.nodeMap).forEach(function (nodeName) {
          var nodeValue = graphLocal.nodeMap[nodeName]
          if (nodeValue.parameterMap !== undefined) {
            Object.keys(nodeValue.parameterMap).forEach(function (paramName) {
              var paramValue = nodeValue.parameterMap[paramName]
              if (paramValue.parameterType === 'VALUE_SPECIFIED_AT_RUNTIME') explicitValues[paramValue.parameterName] = ''
            })
          }
        })
      }
      this.$set(this, 'inputValues', explicitValues)
    },
    isNotBlank: function (stringValue) {
      return stringValue !== undefined && stringValue.trim() !== ''
    },
    saveGraph: function () {
      if (!this.validGraph) return
      var saveGraphInput = {
        graph: this.graph,
        tableName: 'AlmightyTable'
      }
      this.saveGraphSuccess = false
      this.$http.put('https://ms9uc1ppsa.execute-api.us-east-1.amazonaws.com/prod/graph', saveGraphInput).then(function (successEvent) {
        this.saveGraphError = false
        this.saveGraphSuccess = true
      }, function (errorEvent) {
        this.saveGraphError = true
        this.saveGraphSuccess = false
      })
    },
    fetchGraphFromQueryParameters: function () {
      if (this.isNotBlank(this.$route.query.projectName) && this.isNotBlank(this.$route.query.graphName)) {
        var searchGraphInput = {
          tableName: 'AlmightyTable',
          projectName: this.$route.query.projectName,
          graphName: this.$route.query.graphName
        }
        this.$http.post('https://ms9uc1ppsa.execute-api.us-east-1.amazonaws.com/prod/graph/search', searchGraphInput).then(function (successEvent) {
          var output = JSON.parse(successEvent.data).output
          if (output.length === 0) return
          var graph = JSON.parse(output[0].graph)
          this.$set(this, 'graph', graph)
        }, function (errorEvent) {
          console.log(errorEvent)
        })
      }
    }
  },
  mounted: function () {
    this.getNodeTypes()
    this.fetchGraphFromQueryParameters()
  },
  computed: {
    validGraph: function () {
      return this.isNotBlank(this.graph.graphName) && this.isNotBlank(this.graph.projectName)
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
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
<!--JSON.parse(' { "projectName": "TestProject", "graphName": "TestGraph", "nodeMap": { "Node1": { "nodeName": "Node1", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode1" }, "Node2": { "nodeName": "Node2", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode2" }, "Node3": { "nodeName": "Node3", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode3", "parameterMap": { "param1": { "parameterName": "param1", "parameterType": "CONSTANT", "parameterValue": "akash" }, "param2": { "parameterName": "param2", "parameterType": "VALUE_SPECIFIED_AT_RUNTIME", "parameterValue": "runtimeValue" }, "param3": { "parameterName": "param3", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue1", "referenceNodeName": "Node1" }, "param4": { "parameterName": "param4", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue2", "referenceNodeName": "Node2" } } }, "Node4": { "nodeName": "Node4", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode4", "parameterMap": { "param1": { "parameterName": "param1", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue3", "referenceNodeName": "Node3" } } }, "Node5": { "nodeName": "Node5", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode5", "parameterMap": { "param1": { "parameterName": "param1", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue3", "referenceNodeName": "Node3" } } }, "Node6": { "nodeName": "Node6", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode6", "parameterMap": { "param1": { "parameterName": "param1", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue3", "referenceNodeName": "Node3" } } }, "Node7": { "nodeName": "Node7", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode7", "parameterMap": { "param1": { "parameterName": "param1", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue4", "referenceNodeName": "Node4" }, "param2": { "parameterName": "param2", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue5", "referenceNodeName": "Node5" }, "param3": { "parameterName": "param3", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue6", "referenceNodeName": "Node6" } } } } }')-->
