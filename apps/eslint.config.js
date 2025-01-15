import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  {
    rules: {
      "arrow-parens": "error",
      "comma-dangle": ["error", "always-multiline"],
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-console": "error",
      "jsx-quotes": ["error", "prefer-double"],
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },
];
