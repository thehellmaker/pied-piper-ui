declare module 'vue-json-tree-view' {
  function init(options: any): any;

  namespace init {
    export let service: (options: any) => any;
  }

  export = init;
}
