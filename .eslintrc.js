module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
  },
  'extends': ["prettier"],
  'parserOptions': {
    'ecmaVersion': 12
  },
  'plugins': ['prettier'],
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
    ],
    'prettier/prettier': ["error"]
  }
};
