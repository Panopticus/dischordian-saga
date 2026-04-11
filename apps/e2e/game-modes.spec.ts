import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Game Mode Smoke Tests
//
// All game pages sit behind authentication + room-discovery gating.
// These tests are skipped until auth fixtures are wired up.
// ---------------------------------------------------------------------------

test.describe("Game mode smoke tests (requires auth)", () => {
  // Skip: needs authenticated session with rooms unlocked
  test.skip(true, "Requires auth fixtures — add storageState for Google OAuth session with rooms unlocked");

  test("chess page loads and board renders", async ({ page }) => {
    await page.goto("/chess");

    // The chess page uses react-chessboard / chessground — look for the board container
    await expect(
      page.locator("cg-board, [class*='chessboard'], [class*='chess'], [data-board]").first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("fight page loads and arena renders", async ({ page }) => {
    await page.goto("/fight");

    // The fight page renders a combat arena
    await expect(
      page.locator("[class*='fight'], [class*='arena'], [class*='combat'], canvas, h1, h2").first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("card game page loads", async ({ page }) => {
    await page.goto("/cards/play");

    await expect(
      page.locator("[class*='card'], [class*='game'], canvas, h1, h2").first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("deck builder page loads", async ({ page }) => {
    await page.goto("/deck-builder");

    await expect(
      page.locator("[class*='deck'], [class*='builder'], h1, h2").first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("duelyst / dischordia page loads", async ({ page }) => {
    await page.goto("/duelyst");

    await expect(
      page.locator("[class*='grid'], [class*='board'], canvas, h1, h2").first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("trade empire page loads", async ({ page }) => {
    await page.goto("/trade-empire");

    await expect(
      page.locator("[class*='trade'], [class*='map'], canvas, h1, h2").first(),
    ).toBeVisible({ timeout: 10_000 });
  });
});
