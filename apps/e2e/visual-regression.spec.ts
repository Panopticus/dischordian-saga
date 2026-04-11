/* ═══════════════════════════════════════════════════════
   VISUAL REGRESSION TESTS — Playwright screenshot comparisons
   First run creates baseline snapshots; subsequent runs compare.
   ═══════════════════════════════════════════════════════ */
import { test, expect } from "@playwright/test";

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
