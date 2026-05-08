import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "apps", "client", "src"),
      "@shared": path.resolve(templateRoot, "apps", "shared"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: [
      "apps/server/**/*.test.ts",
      "apps/server/**/*.spec.ts",
      "apps/shared/**/*.test.ts",
      "apps/shared/**/*.spec.ts",
      "apps/client/src/**/*.test.ts",
      "apps/client/src/**/*.test.tsx",
      "apps/scripts/**/*.test.ts",
    ],
    coverage: {
      // V8 instrumentation; reports go to coverage/. Active when
      // `pnpm test:coverage` runs (otherwise no overhead).
      provider: "v8",
      reporter: ["text", "json-summary", "json"],
      exclude: [
        "apps/scripts/**",
        "apps/e2e/**",
        "apps/db/migrations/**",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
      ],
      // Initial thresholds intentionally lenient — they're a floor,
      // not a target. Audit/ratchet-proposals.md R9 lays out the path
      // to ratchet these upward as the integration-test fixture lands.
      thresholds: {
        lines: 30,
        statements: 30,
        functions: 30,
        branches: 25,
      },
    },
  },
});
