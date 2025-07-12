// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import globals from "globals";
import pluginNext from "@next/eslint-plugin-next";

const recommendedTypeCheckedConfig =
  pluginTs.configs["recommended-type-checked"];

export default [{
  ignores: ["**/node_modules/**", "**/dist/**", ".next", "build"],
}, {
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
    "@next/next": pluginNext,
  },
  rules: {
    ...recommendedTypeCheckedConfig.rules,
    ...pluginNext.configs.recommended.rules,
  },
}, ...storybook.configs["flat/recommended"]];
