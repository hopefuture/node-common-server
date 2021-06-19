module.exports = {
  root: true,
  env: {
    node: true
  },
  rules: {
    'no-trailing-spaces': 'off',
    semi: ['error', 'always'], // 覆盖 eslint-config-standard 规则 semi
    'no-console': 'off',
    'no-debugger': 'off',
    'multiline-ternary': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'no-unused-vars': 'off'
  },
  plugins: [
    'import',
    'promise'
  ],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:node/recommended',
    'plugin:promise/recommended',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
}
