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
  // CI: 0 retries (was 1). Most current failures are `waitForLoadState
  // ("networkidle")` timeouts — the app maintains persistent WS/SSE
  // connections so the network never idles. A retry just doubles the
  // 30s test-timeout cost (60s/spec) without changing the outcome.
  // Local: 1 retry to keep dev flake tolerance.
  retries: process.env.CI ? 0 : 1,
  // CI: 2 workers (was 1). Ubuntu-runner has 4 cores; doubling
  // parallelism roughly halves wall-time of the suite. The suite
  // currently can only run ~13 of 118 specs in the 12-min cap because
  // every networkidle wait burns 30s; combined with retries:0 above
  // and the globalTimeout bump below, the budget now reaches the full
  // suite.
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  // Whole-suite ceiling. The job's timeout-minutes is 25 (raised in
  // a30ada8 once the env-stub fix made the server actually boot and
  // the suite started taking real wall-time). Pre-Playwright steps
  // (install + Chromium + build + server-start) run ~3 min, leaving
  // ~22 min before GHA cancel; 20 min here ensures the suite caps
  // and uploads the HTML report with comfortable headroom for upload
  // and teardown. The cap exists so a hung spec can't run out the
  // whole job — we always get a failure report.
  globalTimeout: 20 * 60_000,

  globalSetup: GLOBAL_SETUP,

  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",

  reporter: [["html", { open: "never" }]],

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
