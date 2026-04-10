import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
import { LEGACY_ANY_ALLOWLIST } from "./eslint.legacy-any-allowlist.js";

export default tseslint.config(
  {
    ignores: [
      "dist/",
      "node_modules/",
      "**/*.test.ts",
      "dischordian-saga-full-source.txt",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "error",
      // Ban `any` globally. Pre-existing offenders are grandfathered via
      // the override block below and expected to shrink over time. New
      // files can never reach for `any`, and a ratchet test
      // (server/anyAllowlist.test.ts) fails if the allowlist grows.
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  // Grandfathered legacy offenders — shrinking this list is the only
  // accepted direction. See eslint.legacy-any-allowlist.js and
  // server/anyAllowlist.test.ts.
  {
    files: LEGACY_ANY_ALLOWLIST,
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  eslintConfigPrettier
);
