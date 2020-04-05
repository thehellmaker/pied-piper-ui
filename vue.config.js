const path = require('path')
module.exports = {
  runtimeCompiler: true,
  chainWebpack: config => {
    config.resolve.alias.set('authenticationPlugin', path.resolve('src/plugins/authentication/firebase'))
  }
}
