module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    rules: {
      "no-unused-vars": "warn",
      "semi": ["error", "always"]
    }
  };
  