module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
   "@tdi/base"
  ],
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
          ".json",
        ],
      },
    },
  },
}