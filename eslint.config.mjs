import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/storybook-static/**",
      "**/coverage/**",
      "**/*.snap",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    settings: {
      "import/resolver": {
        typescript: { project: ["packages/*/tsconfig.json"] },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
    },
  },
  {
    // Build and tooling configs sit outside src/ and pull from devDependencies the
    // workspace resolver doesn't reliably introspect; TypeScript handles their
    // module resolution on its own.
    files: [
      "**/vite.config.{ts,js,mjs}",
      "**/vitest.config.{ts,js,mjs}",
      "**/.storybook/**/*.{ts,tsx,js,jsx}",
      "**/scripts/**/*.{js,mjs,ts}",
      "eslint.config.{ts,js,mjs}",
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      "import/no-unresolved": "off",
      "no-console": "off",
    },
  },
  {
    files: ["packages/*/src/**/*.{js,jsx,ts,tsx}", "packages/*/test-utils/**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      "import/resolver": {
        typescript: { project: ["packages/*/tsconfig.json"] },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
    },
    rules: {
      "no-console": "error",
      "import/order": ["error", { "newlines-between": "never" }],
      "import/named": "off",
      "import/no-unresolved": ["error", { ignore: ["^@epignosis_llc/"] }],
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
    },
  },
  {
    files: ["packages/react/src/**/*.{js,jsx,ts,tsx}", "packages/react/test-utils/**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unknown-property": ["error", { ignore: ["css"] }],
    },
  },
  {
    files: ["**/*.stories.{ts,tsx}"],
    rules: {
      "import/no-unresolved": ["error", { ignore: ["^@storybook/"] }],
    },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "import/named": "off",
      "no-console": "off",
    },
  },
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  prettierRecommended,
];
