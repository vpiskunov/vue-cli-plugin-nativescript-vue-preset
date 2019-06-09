module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    // "@vue/airbnb" is default in Vue CLI 3 (UI), however it requires-in eslint-config-airbnb-base, which contains an error
    // triggering "import/no-cycle" was not defined. Weirdly, it is listed in eslint-config-airbnb-base as added/fixed
    // in current version (4.1.0). For now, use airbnb-base instead
    // "@vue/airbnb",
    'airbnb-base',
  ],
  rules: {
    'object-curly-newline': 'off',
    'no-plusplus': 'off',
    camelcase: 'off',
    'no-return-assign': ['warn', 'except-parens'],
    'no-prototype-builtins': 'off',
    'no-unused-expressions': 'off',
    'space-before-function-paren': ['error', 'always'],
    'import/no-extraneous-dependencies':
            ['error', {
              devDependencies: true,
              packageDir: './',
            },
            ],
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 10,
        multiline: {
          max: 10,
          allowFirstLine: true,
        },
      },
    ],
    // don't require .vue extension when importing
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        vue: 'ignorePackages',
      },
    ],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // for vuex state
          'acc', // for reduce accumulators
          'e', // for e.returnvalue
        ],
      },
    ],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    // "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    'linebreak-style': 0,
  },
  plugins: [

  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 8,
    sourceType: 'module',
  },
  globals: {
    TNS_APP_MODE: true,
    TNS_APP_PLATFORM: true,
  },
  overrides: [
    {
      files: ['webpack.config.js', '.eslintrc.js'],
      rules: {
        'global-require': 'off',
        'max-len': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: require.resolve('@vue/cli-service/webpack.config.js'),
      },
    },
  },

};
