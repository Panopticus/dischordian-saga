/* ═══════════════════════════════════════════════════════
   VISUAL REGRESSION TESTS — Playwright screenshot comparisons
   First run creates baseline snapshots; subsequent runs compare.
   ═══════════════════════════════════════════════════════ */
import { test, expect } from "@playwright/test";

// Skip visual-regression in CI unless explicitly opted in. Baselines
// are render-engine-specific (font hinting, scrollbar widths, ASCII
// vs. emoji glyph sets) and almost never match between developer
// machines and the GitHub-hosted ubuntu-latest runner. Until the
// baselines are regenerated in CI and committed (or until a per-OS
// baseline matrix is set up), every CI run reports a wall of
// "screenshot differs" failures that aren't real regressions. The
// other 100+ specs in the e2e suite still run. Local devs see the
// tests by default (skip condition is CI-only); to opt in on CI,
// regenerate baselines under CI first then set RUN_VISUAL_REGRESSION=1.
const SKIP_VISUAL_IN_CI =
  !!process.env.CI && !process.env.RUN_VISUAL_REGRESSION;
const SKIP_REASON =
  "Visual baselines are platform-specific; regenerate under CI and set RUN_VISUAL_REGRESSION=1 to opt in";

// ─── Desktop viewport pages ────────────────────────────

const pages = [
  { name: "landing", path: "/" },
  { name: "games", path: "/games" },
  { name: "loredex", path: "/loredex" },
  { name: "settings", path: "/settings" },
  { name: "character-sheet", path: "/character-sheet" },
  { name: "quest-tracker", path: "/quest-tracker" },
] as const;

test.describe("Visual Regression — Desktop", () => {
  test.skip(SKIP_VISUAL_IN_CI, SKIP_REASON);
  for (const page of pages) {
    test(`${page.name} page matches baseline`, async ({ page: p }) => {
      await p.goto(page.path, { waitUntil: "networkidle" });
      // Allow animations / lazy-loaded content to settle
      await p.waitForTimeout(500);
      await expect(p).toHaveScreenshot(`desktop-${page.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});

// ─── Mobile viewport (375×667 — iPhone SE) ─────────────

test.describe("Visual Regression — Mobile", () => {
  test.skip(SKIP_VISUAL_IN_CI, SKIP_REASON);
  test.use({ viewport: { width: 375, height: 667 } });

  for (const page of pages) {
    test(`${page.name} page matches mobile baseline`, async ({ page: p }) => {
      await p.goto(page.path, { waitUntil: "networkidle" });
      await p.waitForTimeout(500);
      await expect(p).toHaveScreenshot(`mobile-${page.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});

// ─── Theme variants (landing page only) ────────────────

test.describe("Visual Regression — Theme Variants", () => {
  test.skip(SKIP_VISUAL_IN_CI, SKIP_REASON);
  test("landing page — dark theme", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // Ensure dark mode is active via media emulation
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("theme-dark-landing.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("landing page — light theme", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.emulateMedia({ colorScheme: "light" });
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("theme-light-landing.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});
