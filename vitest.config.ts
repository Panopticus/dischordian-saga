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
  },
});
