module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single',
      'backtick'
    ],
    'semi': [
      'error',
      'always'
    ]
  }
};
