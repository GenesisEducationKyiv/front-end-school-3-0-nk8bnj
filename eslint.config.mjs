import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import globals from "globals";

const recommendedTypeCheckedConfig =
  pluginTs.configs["recommended-type-checked"];

export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**", ".next", "build"],
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      "@typescript-eslint": pluginTs,
    },
    rules: {
      ...recommendedTypeCheckedConfig.rules,
    },
  },
];
