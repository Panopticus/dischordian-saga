import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// PvP Overhaul — happy-path smoke tests for the new systems.
//
// Public route registration tests run unconditionally. Auth-gated flows run
// only when the global-setup minted a storageState (E2E_AUTH_OPEN_ID +
// JWT_SECRET env vars set); otherwise they skip with a clear message.
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const HAS_AUTH = existsSync(join(__dirname, ".auth", "storageState.json"));

test.describe("PvP overhaul — public route registration", () => {
  test("/titles loads", async ({ page }) => {
    await page.goto("/titles");
    await expect(page).toHaveTitle(/Loredex OS|Dischordia/i);
  });

  test("/conspiracy loads", async ({ page }) => {
    await page.goto("/conspiracy");
    await expect(page).toHaveTitle(/Loredex OS|Dischordia/i);
  });

  test("/guild-hall loads", async ({ page }) => {
    await page.goto("/guild-hall");
    await expect(page).toHaveTitle(/Loredex OS|Dischordia/i);
  });

  test("/pvp-variants loads", async ({ page }) => {
    await page.goto("/pvp-variants");
    await expect(page).toHaveTitle(/Loredex OS|Dischordia/i);
  });

  test("/admin/pvp loads", async ({ page }) => {
    await page.goto("/admin/pvp");
    await expect(page).toHaveTitle(/Loredex OS|Dischordia/i);
  });
});

test.describe("PvP overhaul — auth-gated flows", () => {
  test.skip(!HAS_AUTH, "Set E2E_AUTH_OPEN_ID + JWT_SECRET to run auth-gated specs");

  test("titles page renders catalog when authenticated", async ({ page }) => {
    await page.goto("/titles");
    // Tabs render by category — at least one should be visible.
    await expect(page.getByRole("button", { name: /PvP Rank/i })).toBeVisible({ timeout: 10_000 });
  });

  test("conspiracy page renders board catalog", async ({ page }) => {
    await page.goto("/conspiracy");
    // The five lore-rooted boards should each render a card with their name.
    await expect(page.getByText(/Thought Virus|Project Celebration/i)).toBeVisible({ timeout: 10_000 });
  });

  test("guild hall renders perks tab by default", async ({ page }) => {
    await page.goto("/guild-hall");
    await expect(page.getByRole("button", { name: /PERKS/ })).toBeVisible({ timeout: 10_000 });
  });

  test("pvp variants renders circuit tab by default", async ({ page }) => {
    await page.goto("/pvp-variants");
    await expect(page.getByRole("button", { name: /CIRCUIT/ })).toBeVisible({ timeout: 10_000 });
  });

  test("admin pvp telemetry renders title funnels section", async ({ page }) => {
    // Admin role required server-side; this only verifies the page mounts.
    await page.goto("/admin/pvp");
    await expect(page.getByRole("heading", { name: /ADMIN — PVP DASHBOARD/i })).toBeVisible({ timeout: 10_000 });
  });
});
