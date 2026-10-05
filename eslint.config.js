const js = require("@eslint/js");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "eslint.config.js",
    ],
  },

  js.configs.recommended,

  {
    files: [
      "src/**/*.js",
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        console: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        document: "readonly",
        window: "readonly",
        fetch: "readonly",
        FormData: "readonly",
      },
    },

    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },

  {
    files: [
      "tests/**/*.js",
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        console: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
      },
    },

    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];