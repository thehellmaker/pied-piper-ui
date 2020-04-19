module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleNameMapper: {
    '^authenticationPlugin/(.*)$': '<rootDir>/src/plugins/authentication/firebase/$1'
  }
}
