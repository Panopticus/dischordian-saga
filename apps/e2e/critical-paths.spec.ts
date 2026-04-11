import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Critical Path Tests
//
// The app gates all content behind Google OAuth. Unauthenticated visitors see
// the TitlePage. Tests that need auth are marked with test.skip() so the suite
// still documents the intended coverage and can be enabled once auth fixtures
// (e.g. storageState) are wired up.
// ---------------------------------------------------------------------------

test.describe("Landing / Title Page (public)", () => {
  test("title page loads with correct document title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Loredex OS/i);
  });

  test("title page renders main UI elements", async ({ page }) => {
    await page.goto("/");

    // The two-line title: "THE DISCHORDIAN" + "SAGA"
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByText("THE DISCHORDIAN")).toBeVisible();
    await expect(page.getByText("SAGA")).toBeVisible();

    // Google sign-in button
    await expect(
      page.getByRole("button", { name: /initialize with google/i }),
    ).toBeVisible();
  });

  test("terms and privacy links are visible", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: /terms/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /privacy/i })).toBeVisible();
  });

  test("terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page).toHaveTitle(/Loredex OS/i);
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page).toHaveTitle(/Loredex OS/i);
  });
});

// ---------------------------------------------------------------------------
// All tests below require authentication. They are skipped until auth fixtures
// (storageState with a valid session cookie) are added.
// ---------------------------------------------------------------------------

test.describe("Navigation (requires auth)", () => {
  // Skip: needs authenticated session to get past AuthGate / TitlePage
  test.skip(true, "Requires auth fixtures — add storageState for Google OAuth session");

  test("sidebar navigation works — click items and verify page changes", async ({ page }) => {
    await page.goto("/");

    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();

    // Click a sidebar link and confirm URL changes
    const firstLink = nav.locator("a").first();
    const href = await firstLink.getAttribute("href");
    await firstLink.click();
    await expect(page).toHaveURL(new RegExp(href ?? "/"));
  });
});

test.describe("Games page (requires auth)", () => {
  test.skip(true, "Requires auth fixtures — add storageState for Google OAuth session");

  test("games page loads with game mode cards", async ({ page }) => {
    await page.goto("/board");

    // The GamesPage renders game tiles as links with titles
    await expect(page.getByText("DISCHORDIA")).toBeVisible();
    await expect(page.getByText("COMBAT SIMULATOR")).toBeVisible();
    await expect(page.getByText("INCEPTION ARK")).toBeVisible();
  });
});

test.describe("Loredex / Board page (requires auth)", () => {
  test.skip(true, "Requires auth fixtures — add storageState for Google OAuth session");

  test("board page loads with lore entries", async ({ page }) => {
    await page.goto("/board");
    // The home feed loads lore entries as cards
    await expect(page.locator("[data-testid], article, .card").first()).toBeVisible();
  });
});

test.describe("Settings page (requires auth)", () => {
  test.skip(true, "Requires auth fixtures — add storageState for Google OAuth session");

  test("settings page opens and contains toggle sections", async ({ page }) => {
    await page.goto("/settings");

    // Accessibility toggles
    await expect(page.getByText(/high contrast/i)).toBeVisible();
    await expect(page.getByText(/reduce motion/i)).toBeVisible();
    await expect(page.getByText(/dyslexia font/i)).toBeVisible();

    // Audio section
    await expect(page.getByText(/music/i)).toBeVisible();

    // Display section
    await expect(page.getByText(/font size/i).or(page.getByText(/appearance/i))).toBeVisible();
  });

  test("accessibility toggles work", async ({ page }) => {
    await page.goto("/settings");

    const highContrastToggle = page.getByRole("switch", { name: /high contrast/i });
    await highContrastToggle.click();

    // The class is applied to <html>
    await expect(page.locator("html")).toHaveClass(/high-contrast/);
  });
});

test.describe("Character sheet page (requires auth)", () => {
  test.skip(true, "Requires auth fixtures — add storageState for Google OAuth session");

  test("character sheet page loads", async ({ page }) => {
    await page.goto("/character-sheet");
    await expect(page.locator("h1, h2, [class*='character']").first()).toBeVisible();
  });
});

test.describe("Marketplace page (requires auth)", () => {
  test.skip(true, "Requires auth fixtures — add storageState for Google OAuth session");

  test("marketplace page loads with listings or empty state", async ({ page }) => {
    await page.goto("/marketplace");

    // Either listings exist or an empty state message is shown
    const content = page.locator("main, [id='main-content'], [role='main']").first();
    await expect(content).toBeVisible();
  });
});

test.describe("Quest tracker (requires auth)", () => {
  test.skip(true, "Requires auth fixtures — add storageState for Google OAuth session");

  test("quest board page loads", async ({ page }) => {
    await page.goto("/quests");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
});

test.describe("Mobile viewport", () => {
  test("title page renders correctly at 375x667", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(page.getByText("THE DISCHORDIAN")).toBeVisible();
    await expect(page.getByText("SAGA")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /initialize with google/i }),
    ).toBeVisible();

    // No horizontal overflow
    const body = page.locator("body");
    const bodyBox = await body.boundingBox();
    expect(bodyBox).toBeTruthy();
    expect(bodyBox!.width).toBeLessThanOrEqual(375);
  });
});

test.describe("Dark / light theme toggle (requires auth)", () => {
  test.skip(true, "Requires auth fixtures — add storageState for Google OAuth session");

  test("theme toggle switches data-mode between dark and light", async ({ page }) => {
    await page.goto("/settings");

    const html = page.locator("html");

    // Default is dark
    await expect(html).toHaveAttribute("data-mode", "dark");

    // Find and click the light theme option
    await page.getByText(/light/i).first().click();
    await expect(html).toHaveAttribute("data-mode", "light");

    // Toggle back
    await page.getByText(/dark/i).first().click();
    await expect(html).toHaveAttribute("data-mode", "dark");
  });
});
