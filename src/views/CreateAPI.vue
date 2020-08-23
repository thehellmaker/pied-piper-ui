<template if="PiedPiper">
  <div class="create-api-page-container">
    <div class="graph-execution-container card-container">
      <div class="heading">
        <strong>EXECUTION</strong>
      </div>
      <div
        class="btn btn-outline-primary btn-sm"
        @click="showExecution = !showExecution"
        v-if="!showExecution"
      >+ Show Details</div>
      <div class="graph-input-output-container" v-if="showExecution">
        <div class="graph-explicit-inputs card-sub-container">
          <div class="heading">INPUTS</div>
          <ul>
            <li class="explicit-input-each" v-for="(value, key) in inputValues" :key="key">
              <span class="explicitValueName">{{key}}</span>
              <input v-model="inputValues[key]" />
            </li>
          </ul>
        </div>
        <div class="btn btn-primary" @click="runGraph" v-if="!runInProgress">Run Graph</div>
        <div class="btn btn-primary" v-if="runInProgress">Running</div>
        <div class="graph-output card-sub-container">
          <div class="heading">OUTPUT</div>
          <tree-view :data="outputValue"></tree-view>
        </div>
        <div
          class="btn btn-sm btn-outline-primary left"
          @click="showExecution = !showExecution"
          v-if="showExecution"
        >- Hide Details</div>
      </div>
    </div>

    <div class="create-api-container card-container">
      <div class="heading">CREATE API GRAPH</div>
      <div class="content">
        <div class="nav-actions-container">
          <table class="nav-actions">
            <tr>
              <td>
                <div class="project-heading">
                  <div class="heading">PROJECT NAME</div>
                  <div class="editable-input">{{previousProjectName}}</div>
                </div>
              </td>
              <td>
                <div class="project-heading">
                  <div class="heading">GRAPH NAME</div>
                  <div class="editable-input">{{previousGraphName}}</div>
                </div>
              </td>
              <td>
                <div class="project-heading">
                  <div class="heading">BRANCH NAME</div>
                  <span class="editable-input">{{previousBranchName}}</span>
                  <b-dropdown
                    id="ddown-branch"
                    text
                    right
                    class="m-md-1 version-ddown"
                    variant="success"
                  >
                    <b-dropdown-item
                      v-for="(branchEach) in branchList"
                      :key="branchEach"
                      class="version-ddown-li"
                      @click="openVersion(graph.projectName, graph.graphName, branchEach, undefined)"
                    >{{branchEach}}</b-dropdown-item>
                  </b-dropdown>
                </div>
              </td>
              <td>
                <div class="project-heading">
                  <div class="heading">Version</div>
                  <span class="editable-input">{{this.versionShow(versionStr)}}</span>
                  <b-dropdown id="ddown2" text right class="m-md-1 version-ddown" variant="success">
                    <b-dropdown-item
                      v-for="(versionEach) in versionList"
                      :key="versionEach"
                      class="version-ddown-li"
                      @click="openVersion(previousProjectName, previousGraphName, previousBranchName, versionEach)"
                    >{{versionEach}}</b-dropdown-item>
                  </b-dropdown>
                </div>
              </td>
            </tr>
          </table>
          <br />
          <table class="nav-actions" v-if="!isAliasVersion(versionStr)">
            <tr>
              <td>
                <div class="btn btn-danger" @click="saveGraph" v-if="!saveInProgress">Save</div>
              </td>
              <td>
                <div class="btn btn-danger" v-if="saveInProgress">Saving</div>
              </td>
              <td>
                <b-dropdown id="ddown1" text="Add Node" right class="m-md-2" variant="success">
                  <b-dropdown-item
                    v-for="(node) in availableNodes"
                    :key="node.nodeName"
                    @click="addNode(node)"
                  >{{node.nodeClass}}</b-dropdown-item>
                </b-dropdown>
              </td>
              <td>
                <b-dropdown
                  id="optionsDropdown"
                  text="Options"
                  right
                  class="m-md-2"
                  variant="success"
                >
                  <b-dropdown-item v-b-modal.publish-to-branch-modal>Publish To Branch</b-dropdown-item>
                  <b-dropdown-item v-b-modal.publish-alias-modal>Publish Alias</b-dropdown-item>
                  <b-dropdown-item>A/B Testing</b-dropdown-item>
                </b-dropdown>
                <b-modal id="publish-to-branch-modal" title="Publish To A New Branch" hide-footer>
                  <div class="d-block text-center">
                    <div>
                      <span>
                        <b>Project Name:</b>
                      </span>
                      <span>{{previousProjectName}}</span>
                    </div>
                    <div>
                      <span>
                        <b>Graph Name:</b>
                      </span>
                      <span>{{previousGraphName}}</span>
                    </div>
                    <div>
                      <span>
                        <b>Branch Name:</b>
                      </span>
                      <span>{{branchName}}</span>
                    </div>
                    <div>
                      <span>
                        <b>Version:</b>
                      </span>
                      <span>{{version}}</span>
                    </div>
                  </div>
                  <div class="d-block text-center">
                    <div class="project-heading">
                      <div class="heading">NEW BRANCH NAME</div>
                      <editable class="editable-input" style="width: 50px" v-model="newBranchName"></editable>
                    </div>

                    <div class="project-heading">
                      <div class="heading">VERSION DESCRIPTION</div>
                      <div>
                        <textarea class="editable-input" v-model="aliasToPublishDescription"></textarea>
                      </div>
                    </div>
                  </div>
                  <b-button
                    class="mt-1"
                    variant="outline-secondary"
                    block
                    @click="$bvModal.hide('publish-to-branch-modal')"
                  >Cancel</b-button>
                  <b-button
                    class="mt-1"
                    variant="outline-danger"
                    block
                    @click="publishToBranch"
                  >Publish New Branch</b-button>
                </b-modal>
                <b-modal id="publish-alias-modal" title="Publish Alias" hide-footer>
                  <div class="d-block text-center">
                    <div>
                      <span>
                        <b>Project Name:</b>
                      </span>
                      <span>{{previousProjectName}}</span>
                    </div>
                    <div>
                      <span>
                        <b>Graph Name:</b>
                      </span>
                      <span>{{previousGraphName}}</span>
                    </div>
                    <div>
                      <span>
                        <b>Branch Name:</b>
                      </span>
                      <span>{{branchName}}</span>
                    </div>
                    <div>
                      <span>
                        <b>Version:</b>
                      </span>
                      <span>{{version}}</span>
                    </div>
                  </div>
                  <div class="d-block text-center">
                    <div class="project-heading">
                      <div class="heading">ALIAS</div>
                      <span class="editable-input" style="width: 50px">{{aliasToPublish}}</span>
                      <b-dropdown id="aliasDropdown" right class="m-md-2" variant="success">
                        <b-dropdown-item @click="selectAliasToPublish('PROD')">PROD</b-dropdown-item>
                        <b-dropdown-item @click="selectAliasToPublish('PREPROD')">PREPROD</b-dropdown-item>
                        <b-dropdown-item @click="selectAliasToPublish('DEV')">DEV</b-dropdown-item>
                      </b-dropdown>
                    </div>

                    <div class="project-heading">
                      <div class="heading">ALIAS DESCRIPTION</div>
                      <div>
                        <textarea class="editable-input" v-model="aliasToPublishDescription"></textarea>
                      </div>
                    </div>
                  </div>
                  <b-button
                    class="mt-1"
                    variant="outline-secondary"
                    block
                    @click="$bvModal.hide('publish-alias-modal')"
                  >Cancel</b-button>
                  <b-button
                    class="mt-1"
                    variant="outline-danger"
                    block
                    @click="publishAlias"
                  >Publish Alias</b-button>
                </b-modal>
              </td>
            </tr>
          </table>
        </div>

        <div class="node-container card-sub-container">
          <div class="node-list">
            <div class="heading">LIST OF NODES</div>
            <ul>
              <li
                class="node"
                v-for="(node) in graph.nodeMap"
                :key="node.nodeName"
                v-bind:class="{selected: isNodeSelected(node.nodeName)}"
                @click="setNodeSelection(node.nodeName)"
              >{{node.nodeName}}</li>
            </ul>
          </div>
          <div class="spacing"></div>

          <div class="node-details" v-for="(node) in graph.nodeMap" :key="node.nodeName">
            <template v-if="isNodeSelected(node.nodeName)">
              <div class="heading">
                <editable
                  v-model="node.nodeName"
                  @input="syncNodeSelected(...arguments)"
                  class="node-name editable-input"
                ></editable>
                <div class="node-type">Type: {{node.nodeClass}}</div>
                <div
                  class="btn btn-outline-danger btn-sm right"
                  @click="deleteNode(node)"
                >Delete Node</div>
                <div class="alert alert-danger alert-nodename" v-if="isNodeError(node.nodeName)">
                  <strong>Duplicate Node Name!</strong>
                  Please provide a name which does not exist
                </div>
              </div>
              <div class="node-spec-container">
                <span class="node-spec">
                  <input
                    type="checkbox"
                    id="checkbox"
                    :checked="isIncludeOutput(node)"
                    @click="isIncludeOutputEvent($event, node)"
                  /> IncludeInOutput
                </span>
              </div>
              <div class="add-parameter-attr-container">
                <div
                  class="add-parameter-attr btn btn-primary"
                  @click="addParam(node)"
                >Add Parameter</div>
              </div>
              <div class="parameter-container">
                <div class="param-list-container">
                  <ul>
                    <li
                      class="node"
                      v-for="(parameter) in node.parameterMap"
                      :key="parameter.parameterName"
                      v-bind:class="{selected: isParamSelected(node.nodeName, parameter.parameterName)}"
                      @click="setParamSelection(node.nodeName, parameter.parameterName)"
                    >
                      {{parameter.parameterName}}
                      <span v-if="parameter.required">*</span>
                    </li>
                  </ul>
                </div>
                <div class="spacing"></div>
                <div
                  class="param-details-container"
                  v-for="(parameter) in node.parameterMap"
                  :key="parameter.parameterName"
                >
                  <div v-if="isParamSelected(node.nodeName, parameter.parameterName)">
                    <div class="heading">
                      <editable
                        v-model="parameter.parameterName"
                        @input="syncParamSelected(...arguments)"
                        class="node-name editable-input"
                      ></editable>
                      <div
                        class="btn btn-outline-danger btn-sm right"
                        v-if="!parameter.required"
                        @click="deleteParam(node, parameter)"
                      >Delete Parameter</div>
                    </div>
                    <div
                      class="alert alert-danger alert-nodename"
                      v-if="isParamError(parameter.parameterName)"
                    >
                      <strong>Duplicate Parameter Name!</strong>
                      Please provide a name which does not exist
                    </div>

                    <div v-if="getViewType(parameter) === 'DROPDOWN'">
                      <select class="left" v-model="parameter.parameterValue">
                        <option
                          v-for="allowedValue in restMethods(node.nodeClass, parameter)"
                          :value="allowedValue"
                          :key="allowedValue"
                        >{{allowedValue}}</option>
                      </select>
                    </div>

                    <div v-else>
                      <select
                        v-model="parameter.parameterType"
                        class="param-type"
                        @change="checkIfValueAtRuntime"
                      >
                        <template v-for="parameterType in parameterTypes">
                          <option v-bind:key="parameterType">{{parameterType}}</option>
                        </template>
                      </select>

                      <select
                        v-model="parameter.parameterFormat"
                        class="param-type"
                        @change="selectFormatType(parameter.parameterFormat)"
                        v-if="parameter.parameterType == 'CONSTANT'"
                      >
                        <template v-for="parameterFormat in parameterFormats">
                          <option
                            v-bind:key="parameterFormat.name"
                            v-bind:value="parameterFormat.name"
                          >{{parameterFormat.name}}</option>
                        </template>
                      </select>

                      <select
                        v-if="parameter.parameterType == 'REFERENCE_FROM_ANOTHER_NODE'"
                        v-model="parameter.referenceNodeName"
                        class="param-reference-node"
                      >
                        <option
                          v-for="(node) in graph.nodeMap"
                          :key="node.nodeName"
                        >{{node.nodeName}}</option>
                      </select>
                      <div class="constant-field-container">
                        <editor
                          v-model="parameter.parameterValue"
                          @init="editorInit"
                          theme="chrome"
                          width="100%"
                          height="700"
                        ></editor>
                      </div>
                      <br />
                    </div>

                    <div class="add-parameter-attr-container">
                      <div
                        class="add-parameter-attr btn btn-primary"
                        @click="addAttribute(parameter)"
                      >Add Attribute</div>
                    </div>
                    <table v-if="isShowAttributeMapSection(parameter)">
                      <tr>
                        <th>ATTRIBUTE NAME</th>
                        <th>ATTRIBUTE VALUE</th>
                      </tr>
                      <tr v-for="(attrValue, attrName) in parameter.attributeMap" :key="attrName">
                        <td>
                          <input
                            placeholder="AttributeName"
                            :value="attrName"
                            @focus="focusAttribute"
                            @blur="blurAttribute($event, parameter)"
                          />
                        </td>
                        <td>
                          <input
                            placeholder="AttributeValue"
                            :value="attrValue"
                            @change="syncAttributeValue(parameter, attrName, $event.target.value)"
                          />
                        </td>
                        <td>
                          <div
                            class="btn btn-outline-danger"
                            @click="deleteAttribute(parameter, attrName)"
                          >Delete Attribute</div>
                        </td>
                      </tr>
                    </table>
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
// register modal component

import editable from "./Editable.vue";
const host = require("../../config.js");

export default {
  name: "PiedPiper",
  components: {
    editor: require("vue2-ace-editor"),
    editable: editable
  },
  data() {
    return {
      aliasToPublish: "Choose Alias",
      newBranchName: "",
      aliasToPublishDescription: "",
      hostnamePrefix: host.hostname,
      writeHostnamePrefix: host.writeHostname,
      branchName: undefined,
      version: 0,
      versionStr: "",
      showModal: true,
      previousBranchName: undefined,
      previousProjectName: undefined,
      previousGraphName: undefined,
      previousVersion: 0,
      versionList: [],
      branchList: [],
      graph: {},
      parameterTypes: ["CONSTANT", "REFERENCE_FROM_ANOTHER_NODE", "AWS_SSM "],
      parameterFormats: [
        { name: "TEXT", aceValue: "ace/mode/text" },
        { name: "JAVASCRIPT", aceValue: "ace/mode/javascript" },
        { name: "JSON", aceValue: "ace/mode/json" }
      ],
      paramSelected: "",
      nodeSelected: "",
      duplicateNodeNameError: "",
      duplicateParamNameError: "",
      editField: "",
      availableNodes: [],
      newParameterJsonTemplate: {
        parameterName: "",
        parameterType: "CONSTANT",
        parameterValue: "",
        referenceNodeName: ""
      },
      showExecution: false,
      inputValues: {},
      outputValue: {},
      saveGraphError: false,
      saveGraphSuccess: false,
      saveInProgress: false,
      runInProgress: false,
      attributePrevValue: "",
      content: "",
      editor: undefined
    };
  },
  methods: {
    publishToBranch: function() {
      this.saveGraphImpl(
        this.graph,
        this.newBranchName,
        this.previousProjectName,
        this.previousGraphName,
        this.previousBranchName,
        this.previousVersion,
        function(successEvent) {
          console.log(successEvent);
          window.location.href = this.createApiUrl(
            this.graph.projectName,
            this.graph.graphName,
            this.newBranchName,
            undefined,
            undefined
          );
        },
        function(errorEvent) {
          console.log(errorEvent)
        }
      );
    },
    publishAlias: function() {
      if (!this.validGraph) return;

      var putAliasInput = {
        saveType: "PUT_ALIAS",
        versionDescription: this.aliasToPublishDescription,
        projectName: this.graph.projectName,
        graphName: this.graph.graphName,
        branchName: this.branchName,
        version: this.version,
        alias: this.aliasToPublish
      };
      this.$http.put(this.writeHostnamePrefix + "/graph", putAliasInput).then(
        function(successEvent) {
          window.location.href = this.createApiUrl(
            putAliasInput.projectName,
            putAliasInput.graphName,
            putAliasInput.branchName,
            undefined,
            putAliasInput.alias
          );
        },
        function(errorEvent) {
          this.saveGraphError = true;
          this.saveGraphSuccess = false;
          this.saveInProgress = false;
        }
      );
    },
    selectAliasToPublish: function(alias) {
      this.$set(this, "aliasToPublish", alias);
    },
    restMethods: function(nodeClass, parameter) {
      for (var nodeKey in this.availableNodes) {
        var node = this.availableNodes[nodeKey];
        if (node.nodeClass === nodeClass) {
          for (var parameterKey in node.parameterMetadataList) {
            var eachParameter = node.parameterMetadataList[parameterKey];
            if (parameter.parameterName === eachParameter.parameterName) {
              return eachParameter.allowedValues;
            }
          }
        }
      }
      return [];
    },
    editorInit: function(editor) {
      require("brace/ext/language_tools"); // language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); // language
      require("brace/mode/json"); // language
      require("brace/mode/less");
      require("brace/theme/chrome");
      require("brace/snippets/javascript"); // snippet
      this.editor = editor;
    },
    getFormatValueForName: function(parameterFormatName) {
      var formatValue = "";
      this.parameterFormats.forEach(function(each) {
        if (each.name === parameterFormatName) {
          formatValue = each.aceValue;
        }
      });
      return formatValue === "" ? getFormatForValue("TEXT") : formatValue;
    },
    selectFormatType: function(parameterFormatName) {
      var editor = this.editor;
      editor.session.setMode(this.getFormatValueForName(parameterFormatName));
    },
    getNodeSelectionValue: function(nodeName) {
      return nodeName;
    },
    setNodeSelection: function(nodeName) {
      this.nodeSelected = this.getNodeSelectionValue(nodeName);
    },
    isNodeSelected: function(nodeName) {
      return this.nodeSelected === this.getNodeSelectionValue(nodeName);
    },
    isNodeError: function(nodeName) {
      return (
        this.duplicateNodeNameError === this.getNodeSelectionValue(nodeName)
      );
    },
    addNode: function(node) {
      if (this.graph.nodeMap === undefined) {
        this.$set(this.graph, "nodeMap", {});
      }
      var clonedNode = this.cloneJson(node);
      clonedNode.nodeName =
        "Node" + (parseInt(Object.keys(this.graph.nodeMap).length) + 1);
      clonedNode.parameterMap = {};
      var vm = this;
      clonedNode.parameterMetadataList.forEach(function(element) {
        var newParameter = vm.cloneJson(vm.newParameterJsonTemplate);
        newParameter.parameterName = element.parameterName;
        newParameter.required = element.required;
        newParameter.allowedValues = element.allowedValues;
        clonedNode.parameterMap[newParameter.parameterName] = newParameter;
      });
      this.$set(this.graph.nodeMap, clonedNode.nodeName, clonedNode);
      this.setNodeSelection(clonedNode.nodeName);
    },
    deleteNode: function(node) {
      this.$delete(this.graph.nodeMap, node.nodeName);
    },
    openVersion: function(projectName, graphName, branchName, version) {
      var url = `/api?projectName=${projectName}&graphName=${graphName}&branchName=${branchName}`;
      if (version !== undefined) {
        if (this.isAliasVersion(version)) {
          url += `&alias=${version}`;
        } else {
          url += `&version=${version}`;
        }
      }
      window.location.href = url;
    },
    syncNodeSelected: function(output, prev) {
      if (output === prev) {
        this.duplicateNodeNameError = "";
        return;
      }
      if (this.graph.nodeMap[output] !== undefined) {
        this.duplicateNodeNameError = this.getNodeSelectionValue(prev);
        this.graph.nodeMap[prev].nodeName = prev;
        return;
      }

      var currentState = this.graph.nodeMap[prev];
      this.$delete(this.graph.nodeMap, prev);
      this.$set(this.graph.nodeMap, output, currentState);
      this.setNodeSelection(output);
    },
    getParamSelectionValue: function(nodeName, parameterName) {
      return parameterName;
    },
    setParamSelection: function(nodeName, parameterName) {
      this.paramSelected = this.getParamSelectionValue(nodeName, parameterName);
    },
    isParamSelected: function(nodeName, parameterName) {
      return (
        this.paramSelected ===
        this.getParamSelectionValue(nodeName, parameterName)
      );
    },
    addParam: function(node) {
      if (node.parameterMap === undefined) {
        this.$set(node, "parameterMap", {});
      }
      var paramMap = node.parameterMap;
      var paramName = "param" + (parseInt(Object.keys(paramMap).length) + 1);
      var newParameter = this.cloneJson(this.newParameterJsonTemplate);
      newParameter.parameterName = paramName;
      this.$set(paramMap, paramName, newParameter);
      this.setParamSelection(node.nodeName, paramName);
    },
    deleteParam: function(node, parameter) {
      this.$delete(node.parameterMap, parameter.parameterName);
    },
    syncParamSelected: function(output, prev) {
      if (output === prev) {
        this.duplicateParamNameError = "";
        return;
      }
      if (
        this.graph.nodeMap[this.nodeSelected].parameterMap[output] !== undefined
      ) {
        this.duplicateParamNameError = this.getParamSelectionValue(
          this.nodeSelected,
          prev
        );
        this.graph.nodeMap[this.nodeSelected].parameterMap[
          prev
        ].parameterName = prev;
        return;
      }

      var currentState = this.graph.nodeMap[this.nodeSelected].parameterMap[
        prev
      ];
      this.$delete(this.graph.nodeMap[this.nodeSelected].parameterMap, prev);
      this.$set(
        this.graph.nodeMap[this.nodeSelected].parameterMap,
        output,
        currentState
      );
      this.setParamSelection(this.nodeSelected, output);
    },
    isParamError: function(parameterName) {
      return (
        this.duplicateParamNameError ===
        this.getParamSelectionValue(this.nodeSelected, parameterName)
      );
    },
    isIncludeOutput: function(node) {
      if (
        node === undefined ||
        node.nodeSpecification === undefined ||
        node.nodeSpecification.includeOutput === undefined
      )
        return false;
      return node.nodeSpecification.includeOutput;
    },
    isIncludeOutputEvent: function(e, node) {
      var checked = e.target.checked;
      if (node.nodeSpecification === undefined)
        this.$set(node, "nodeSpecification", {});
      this.$set(node.nodeSpecification, "includeOutput", checked);
    },
    getViewType: function(parameter) {
      if (parameter.parameterType === "VALUE_SPECIFIED_AT_RUNTIME") {
        return "NONE";
      } else if (
        parameter.parameterType === "CONSTANT" ||
        parameter.parameterType === "REFERENCE_FROM_ANOTHER_NODE"
      ) {
        if (
          parameter.allowedValues !== undefined &&
          parameter.allowedValues.length > 0
        ) {
          return "DROPDOWN";
        } else {
          return "TEXT_AREA";
        }
      }
    },
    addAttribute: function(parameter) {
      if (parameter.attributeMap === undefined) {
        this.$set(parameter, "attributeMap", {});
      }
      var attributeMap = parameter.attributeMap;
      var attributeName =
        "attribute" + (parseInt(Object.keys(attributeMap).length) + 1);
      this.$set(attributeMap, attributeName, "");
    },
    isShowAttributeMapSection: function(parameter) {
      return (
        parameter.attributeMap !== undefined &&
        Object.keys(parameter.attributeMap).length > 0
      );
    },
    blurAttribute: function(event, parameter) {
      var newAttributeName = event.target.value;
      var oldAttributeName = this.attributeSelection;
      if (oldAttributeName !== newAttributeName) {
        var value = parameter.attributeMap[oldAttributeName];
        this.$delete(parameter.attributeMap, oldAttributeName);
        this.$set(parameter.attributeMap, newAttributeName, value);
      }
    },
    focusAttribute: function(event) {
      this.attributeSelection = event.target.value;
    },
    syncAttributeValue: function(parameter, attributeName, attributeValue) {
      parameter.attributeMap[attributeName] = attributeValue;
    },
    deleteAttribute: function(parameter, attributeName) {
      this.$delete(parameter.attributeMap, attributeName);
    },
    getNodeTypes: function() {
      this.$http.get(this.hostnamePrefix + "/nodetypes").then(
        function(response) {
          this.availableNodes = response.data;
        },
        function(error) {
          console.log("Error = ", error);
        }
      );
    },
    cloneJson: function(jsonObject) {
      return JSON.parse(JSON.stringify(jsonObject));
    },
    runGraph: function() {
      this.runInProgress = true;
      var executeGraphInput = {
        graph: this.graph,
        input: this.inputValues,
        clearCache: true
      };
      this.$http
        .post(this.hostnamePrefix + "/graph/run", executeGraphInput)
        .then(
          function(successEvent) {
            this.outputValue = JSON.parse(JSON.stringify(successEvent.body));
            this.runInProgress = false;
          },
          function(errorEvent) {
            this.outputValue = errorEvent.data;
            this.runInProgress = false;
          }
        );
    },
    checkIfValueAtRuntime: function() {
      var explicitValues = {};
      if (this.graph.nodeMap !== undefined) {
        var graphLocal = this.graph;
        Object.keys(this.graph.nodeMap).forEach(function(nodeName) {
          var nodeValue = graphLocal.nodeMap[nodeName];
          if (nodeValue.parameterMap !== undefined) {
            Object.keys(nodeValue.parameterMap).forEach(function(paramName) {
              var paramValue = nodeValue.parameterMap[paramName];
              if (paramValue.parameterValue.startsWith("${input.")) {
                explicitValues[
                  paramValue.parameterValue.substring(
                    8,
                    paramValue.parameterValue.length - 1
                  )
                ] = "";
              }
            });
          }
        });
      }
      this.$set(this, "inputValues", explicitValues);
    },
    isNotBlank: function(stringValue) {
      return (
        stringValue !== undefined &&
        stringValue.trim() !== "" &&
        stringValue !== "undefined"
      );
    },
    isBlank: function(stringValue) {
      return !this.isNotBlank(stringValue);
    },
    saveGraph: function() {
      this.saveInProgress = true;
      this.saveGraphSuccess = false;
      this.saveGraphImpl(
        this.graph,
        this.previousBranchName,
        this.previousProjectName,
        this.previousGraphName,
        this.previousBranchName,
        this.previousVersion,
        function(successEvent) {
          console.log(successEvent);
          this.saveGraphError = false;
          this.saveGraphSuccess = true;
          this.saveInProgress = false;
          window.location.href = this.createApiUrl(
            this.graph.projectName,
            this.graph.graphName,
            this.branchName,
            undefined,
            undefined
          );
        },
        function(errorEvent) {
          this.saveGraphError = true;
          this.saveGraphSuccess = false;
          this.saveInProgress = false;
        }
      );
    },
    saveGraphImpl: function(
      graph,
      branchName,
      previousProjectName,
      previousGraphName,
      previousBranchName,
      previousVersion,
      successCallback,
      errorCallback
    ) {
      if (!this.validateInput(graph.projectName, graph.graphName)) return;
      if (!this.validateInput(previousProjectName, previousGraphName)) return;

      var saveGraphInput = {
        graph: graph,
        branchName: branchName,
        saveType: "POST_NEW_VERSION",
        versionDescription: "Test Description",
        previousProjectName: previousProjectName,
        previousGraphName: previousGraphName,
        previousBranchName: previousBranchName,
        previousVersion: previousVersion
      };
      
      this.$http
        .put(this.writeHostnamePrefix + "/graph", saveGraphInput)
        .then(successCallback, errorCallback);
    },
    fetchGraphFromQueryParameters: function(
      projectName,
      graphName,
      branchName,
      version,
      alias
    ) {
      if (this.isBlank(projectName) || this.isBlank(graphName)) return;
      this.populateMainGraph(
        projectName,
        graphName,
        branchName,
        version,
        alias
      );
      this.populateVersionsDropdown(projectName, graphName, branchName);
      this.populateBranchesDropdown(projectName, graphName);
    },
    populateMainGraph: function(
      projectName,
      graphName,
      branchName,
      version,
      alias
    ) {
      const searchGraphInput = this.createSearchGraphInput(
        projectName,
        graphName,
        branchName,
        version,
        alias
      );
      this.$set(this, "previousProjectName", searchGraphInput.projectName);
      this.$set(this, "previousGraphName", searchGraphInput.graphName);
      this.$set(this, "previousBranchName", searchGraphInput.branchName);
      this.$http
        .post(this.hostnamePrefix + "/graph/search", searchGraphInput)
        .then(
          function(successEvent) {
            var output = successEvent.body;
            if (output.length === 0) return;
            var graph = output[0].graphJson;
            if (this.isBlank(version) && this.isBlank(alias)) {
              window.location.href = this.createApiUrl(
                graph.projectName,
                graph.graphName,
                output[0].branchName,
                output[0].version,
                undefined
              );
              return;
            }
            this.$set(this, "graph", graph);
            this.$set(this, "branchName", output[0].branchName);
            this.$set(this, "version", output[0].version);
            this.$set(this, "versionStr", output[0].versionStr);
            this.$set(this, "previousVersion", output[0].version);
            this.checkIfValueAtRuntime();
          },
          function(errorEvent) {}
        );
    },
    createSearchGraphInput: function(
      projectName,
      graphName,
      branchName,
      version,
      alias
    ) {
      var searchGraphInput = {
        projectName: projectName,
        graphName: graphName
      };
      if (this.isBlank(branchName)) branchName = "master";

      searchGraphInput["branchName"] = branchName;

      if (this.isNotBlank(version)) {
        searchGraphInput["version"] = version;
        this.$set(this, "versionStr", version);
      }

      if (this.isNotBlank(alias)) {
        searchGraphInput["alias"] = alias;
        this.$set(this, "versionStr", alias);
      }
      return searchGraphInput;
    },
    populateBranchesDropdown: function(projectName, graphName) {
      var allBranchSearchInput = {
        projectName: projectName,
        graphName: graphName
      };
      allBranchSearchInput["filterType"] = "UNIQUE_GRAPH_BRANCH_LIST_FILTER";

      this.$http
        .post(this.hostnamePrefix + "/graph/search", allBranchSearchInput)
        .then(
          function(successEvent) {
            var output = successEvent.body;
            if (output.length === 0) return;
            const branchList = [];
            for (var outputEach in output) {
              branchList.push(output[outputEach].branchName);
            }
            console.log(branchList);
            this.$set(this, "branchList", branchList);
          },
          function(errorEvent) {}
        );
    },
    populateVersionsDropdown: function(projectName, graphName, branchName) {
      var allVersionSearchInput = {
        projectName: projectName,
        graphName: graphName,
        branchName: branchName
      };
      this.$http
        .post(this.hostnamePrefix + "/graph/search", allVersionSearchInput)
        .then(
          function(successEvent) {
            var output = successEvent.body;
            if (output.length === 0) return;
            const versionList = [];
            for (var outputEach in output) {
              const parsedVersion = this.versionShow(
                output[outputEach].versionStr
              );
              versionList.push(parsedVersion);
            }
            versionList.push("PROD");
            versionList.push("PREPROD");
            versionList.push("DEV");
            console.log(versionList);
            this.$set(this, "versionList", versionList);
          },
          function(errorEvent) {}
        );
    },
    versionShow: function(versionStr) {
      try {
        const parsedVersion = parseInt(versionStr);
        if (isNaN(parsedVersion)) {
          return versionStr;
        }
        return parsedVersion;
      } catch (error) {
        return versionStr;
      }
    },
    isAliasVersion: function(versionStr) {
      return (
        versionStr === "PROD" ||
        versionStr === "PREPROD" ||
        versionStr === "DEV"
      );
    },
    createApiUrl: function(projectName, graphName, branchName, version, alias) {
      var url = `/api?projectName=${projectName}&graphName=${graphName}&branchName=${branchName}`;
      if (version !== undefined) {
        url += `&version=${version}`;
      } else if (this.isNotBlank(alias)) {
        url += `&alias=${alias}`;
      }
      return url;
    },
    validateInput: function(projectName, graphName) {
      return this.isNotBlank(graphName) && this.isNotBlank(projectName);
    }
  },
  mounted: function() {
    this.getNodeTypes();
    this.fetchGraphFromQueryParameters(
      this.$route.query.projectName,
      this.$route.query.graphName,
      this.$route.query.branchName,
      this.$route.query.version,
      this.$route.query.alias
    );
  },
  computed: {}
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
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
