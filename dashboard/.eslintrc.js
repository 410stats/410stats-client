 module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    'rules': {
      // allow paren-less arrow functions
      'arrow-parens': 0,
  	"comma-dangle": 1,
  	"no-cond-assign": 1,
  	"no-console": 1,
  	"no-constant-condition": 1,
  	"no-control-regex": 1,
  	"no-debugger": 1,
  	"no-dupe-args": 1,
  	"no-dupe-keys": 1,
  	"no-duplicate-case": 1,
  	"no-empty-character-class": 1,
  	"no-empty": 1,
  	"no-ex-assign": 1,
  	"no-extra-boolean-cast": 2,
  	"no-extra-semi": 2,
  	"no-func-assign": 1,
  	"no-inner-declarations": 1,
  	"no-invalid-regexp": 2,
  	"no-irregular-whitespace": 2,
  	"no-negated-in-lhs": 1,
  	"no-obj-calls": 1,
  	"no-regex-spaces": 1,
  	"no-sparse-arrays": 1,
  	"no-unreachable": 1,
  	"use-isnan": 1,
  	"valid-typeof": 1,
  	"no-fallthrough": 1,
  	"no-octal": 1,
  	"no-redeclare": 1,
  	"no-delete-var": 1,
  	"no-undef": 1,
  	"no-unused-vars": 1,
  	"no-mixed-spaces-and-tabs": 1,
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    // required to lint *.vue files
    "plugins": [
        "html"
    ]
}
// http://eslint.org/docs/user-guide/configuring
