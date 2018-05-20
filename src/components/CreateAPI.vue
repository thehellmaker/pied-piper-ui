<template if="PiedPiper">

  <div class="create-api-page-container">
    <div class="create-api-container">
      <div class="heading">CREATE API GRAPH</div>
      <div class="content">
        <div class="nav-actions left">
          <input class="red-input" type="Text" placeholder="PROJECT NAME" v-model="graph.projectName"/>
          <input class="red-input" type="Text" placeholder="API NAME" v-model="graph.graphName"/>


          <div class="btn btn-primary"> Test </div>
          <div class="btn btn-danger" @click="printGraph()"> Save </div>


        </div>
        <div class="nav-actions right">
          <b-dropdown id="ddown1" text="Add Node" right class="m-md-2" variant="success" >
                    <b-dropdown-item v-for="node in availableNodes">
                      {{node}}
                    </b-dropdown-item>
                  </b-dropdown>
        </div>


        <div class="node-container">
          <div class="node-list">
            <div class="heading">LIST OF NODES  </div>
            <ul>
              <li class="node" v-for="(node) in graph.nodeMap" :key="node.nodeName" v-bind:class="{selected: nodeSeen === 'node-'+node.nodeName}" @click="nodeSeen = 'node-'+node.nodeName">
                {{node.nodeName}}
              </li>
            </ul>
          </div>
          <div class="spacing"></div>

          <div class="node-details" v-for="(node) in graph.nodeMap" :key="node.nodeName">
            <template v-if="nodeSeen === 'node-'+node.nodeName">
              <div class="heading">
                <div class="node-name">{{node.nodeName}}</div>
                <div class="node-type">Type:  {{node.nodeClassName}}</div>
              </div>
              <div class="node-spec-container">
                <span class="node-spec"> <a href="#">Interim</a> </span>
                <span class="node-spec"> | </span>
                <span class="node-spec"> <a href="#">Enabled</a></span>
                <span class="node-spec"> | </span>
                <span class="node-spec"> <a href="#">Do not use cached data</a></span>
                <span class="node-spec"> | </span>
                <span class="node-spec"> <a href="#">Fan out</a></span>
              </div>
              <div class="add-parameter-container">
                <div id="add-parameter" class="btn btn-primary" @click="addParam(node)"> Add Parameter </div>
              </div>
              <div class="parameter-container">
                <div class="param-list-container">
                  <ul>
                    <li class="node"  v-for="(parameter) in node.parameterMap" :key="parameter.parameterName" v-bind:class="{selected: paramSeen === 'node-'+node.nodeName+'-param-'+ parameter.parameterName}" @click="paramSeen = 'node-'+node.nodeName+'-param-'+parameter.parameterName">
                      {{parameter.parameterName}}
                    </li>
                  </ul>
                </div>
                <div class="spacing"></div>
                <div class="param-details-container" v-for="(parameter) in node.parameterMap" v-if="paramSeen === 'node-'+node.nodeName+'-param-'+ parameter.parameterName" :key="parameter.parameterName">
                    <div class="param-name">{{parameter.parameterName}}</div>
                    <select v-model="parameter.parameterType" class="param-type">
                      <template v-for="parameterType in parameterTypes">
                        <option v-bind:key="parameterType">
                          {{parameterType}}
                        </option>
                      </template>
                    </select>
                    <select v-if="parameter.parameterType == 'REFERENCE_FROM_ANOTHER_NODE'" v-model="parameter.referenceNodeName" class="param-reference-node">
                      <option v-for="(node) in graph.nodeMap" :key="node.nodeName">
                        {{node.nodeName}}
                      </option>
                    </select>
                    <div v-if="parameter.parameterType != 'VALUE_SPECIFIED_AT_RUNTIME'" class="constant-field-container">
                      <textarea type="Text" placeholder="Constant value here" class="constant-field" v-model="parameter.parameterValue"/>
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
export default {
  name: 'PiedPiper',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      graph: JSON.parse(' { "projectName": "TestProject", "graphName": "TestGraph", "nodeMap": { "Node1": { "nodeName": "Node1", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode1" }, "Node2": { "nodeName": "Node2", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode2" }, "Node3": { "nodeName": "Node3", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode3", "parameterMap": { "param1": { "parameterName": "param1", "parameterType": "CONSTANT", "parameterValue": "akash" }, "param2": { "parameterName": "param2", "parameterType": "VALUE_SPECIFIED_AT_RUNTIME", "parameterValue": "runtimeValue" }, "param3": { "parameterName": "param3", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue1", "referenceNodeName": "Node1" }, "param4": { "parameterName": "param4", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue2", "referenceNodeName": "Node2" } } }, "Node4": { "nodeName": "Node4", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode4", "parameterMap": { "param1": { "parameterName": "param1", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue3", "referenceNodeName": "Node3" } } }, "Node5": { "nodeName": "Node5", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode5", "parameterMap": { "param1": { "parameterName": "param1", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue3", "referenceNodeName": "Node3" } } }, "Node6": { "nodeName": "Node6", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode6", "parameterMap": { "param1": { "parameterName": "param1", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue3", "referenceNodeName": "Node3" } } }, "Node7": { "nodeName": "Node7", "nodeClassName": "com.atom8.piedpiper.node.mock.MockNode7", "parameterMap": { "param1": { "parameterName": "param1", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue4", "referenceNodeName": "Node4" }, "param2": { "parameterName": "param2", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue5", "referenceNodeName": "Node5" }, "param3": { "parameterName": "param3", "parameterType": "REFERENCE_FROM_ANOTHER_NODE", "parameterValue": "$.referenceValue6", "referenceNodeName": "Node6" } } } } }'),
      parameterTypes: ['CONSTANT', 'REFERENCE_FROM_ANOTHER_NODE', 'VALUE_SPECIFIED_AT_RUNTIME'],
      paramSeen: '',
      nodeSeen: '',
      availableNodes: ['DynamoDBRetrieverNode', 'RESTServiceNode']
    }
  },
  methods: {
    addParam: function (node) {
      if (node.parameterMap === undefined) {
        this.$set(node, 'parameterMap', {})
      }
      var paramMap = node.parameterMap
      var paramName = 'param' + (parseInt(Object.keys(paramMap).length) + 1)
      var newParameter = { 'parameterName': paramName, 'parameterType': 'CONSTANT', 'parameterValue': '', 'referenceNodeName': '' }
      this.$set(paramMap, paramName, newParameter)
    },
    printGraph: function () {
      alert(JSON.stringify(this.graph))
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
