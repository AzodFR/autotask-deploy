module.exports = {
    root: true,
    env: {
      node: true,
    },
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 2020,
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      '@typescript-eslint/no-var-requires': 0,
      "@typescript-eslint/no-this-alias": ["off"],
      "printWidth": 0
    },
  };