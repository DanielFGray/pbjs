module.exports = {
  // parser: 'babel-eslint',
  extends: [
    'airbnb-base',
  ],
  env: {
    node: true,
  },
  rules: {
    semi: ['error', 'never'],
    indent: ['error', 2, { flatTernaryExpressions: true }],
    'no-unexpected-multiline': 'error',
    'no-nested-ternary': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_$' }],
  },
}
