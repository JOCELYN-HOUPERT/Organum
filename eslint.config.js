export default [
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        AudioContext: "readonly",
        webkitAudioContext: "readonly",
        indexedDB: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        crypto: "readonly",
        Blob: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "prefer-const": "warn",
      "eqeqeq": "error"
    }
  },
  {
    files: ["src/**/*.test.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly"
      }
    }
  }
];
