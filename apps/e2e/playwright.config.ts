import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import { STORAGE_STATE_PATH } from "./global-setup";

// `require.resolve` doesn't exist under ESM; derive the absolute
// global-setup path from this file's URL instead. Same reason as the
// __dirname fix in global-setup.ts.
const __dirname = dirname(fileURLToPath(import.meta.url));
const GLOBAL_SETUP = resolve(__dirname, "global-setup.ts");

const storageState = existsSync(STORAGE_STATE_PATH) ? STORAGE_STATE_PATH : undefined;

export default defineConfig({
  testDir: ".",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30_000,

  globalSetup: GLOBAL_SETUP,

  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",

  reporter: "html",

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },

  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    trace: "on-first-retry",
    storageState,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
