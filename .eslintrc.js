const path = require('path');

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 10,
    project: "./tsconfig.json"
  },
  plugins: [
    "@typescript-eslint",
    "eslint-plugin-import"
  ],
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    //doesnt work, it reports false errors
    "constructor-super": "off",
    "@typescript-eslint/class-name-casing": "error",
    "@typescript-eslint/explicit-function-return-type": ["error", {
      "allowExpressions": true
    }],
    "@typescript-eslint/func-call-spacing": "error",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/interface-name-prefix": ["error", "always"],
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/semi": "error",
    "@typescript-eslint/type-annotation-spacing": "error",
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": false,
      "optionalDependencies": false,
      "peerDependencies": false
    }],
    "camelcase": "error",
    "func-call-spacing": "off",
    "new-parens": "error",
    "no-caller": "error",
    "no-bitwise": "off",
    "no-console": "warn",
    "no-var": "error",
    "object-curly-spacing": ["error", "never"],
    "prefer-const": "error",
    "semi": "off"
  },
  "overrides": [
    {
      "files": ["**/test/**/*.ts"],
      "rules": {
        "import/no-extraneous-dependencies": "off",
        "@typescript-eslint/no-explicit-any": "off"
      }
    },
  ]
};
