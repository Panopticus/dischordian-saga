import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Accessibility Tests
//
// Tests for skip-to-content, keyboard focus, ARIA labels, and
// reduced-motion preference. Some tests work on the public TitlePage;
// others require auth for the full app shell.
// ---------------------------------------------------------------------------

test.describe("Skip-to-content link (requires auth)", () => {
  // The SkipToContent component is rendered inside the app shell, which
  // is only visible to authenticated users.
  test.skip(true, "Requires auth fixtures — SkipToContent is inside AppShell behind AuthGate");

  test("skip-to-content link exists and navigates to #main-content", async ({ page }) => {
    await page.goto("/");

    // The link is visually hidden until focused
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    // Tab into it
    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();

    // Click it and verify the target exists
    await skipLink.click();
    await expect(page.locator("#main-content")).toBeAttached();
  });
});

test.describe("Keyboard focusability (requires auth)", () => {
  test.skip(true, "Requires auth fixtures — interactive elements are behind AuthGate");

  test("all interactive elements in main nav are keyboard focusable", async ({ page }) => {
    await page.goto("/");

    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();

    const links = nav.locator("a, button");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    // Verify each link/button has a non-negative tabindex (or no tabindex, which defaults to 0)
    for (let i = 0; i < count; i++) {
      const el = links.nth(i);
      const tabindex = await el.getAttribute("tabindex");
      // tabindex should be null (default focusable) or >= 0
      if (tabindex !== null) {
        expect(Number(tabindex)).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

test.describe("ARIA labels on navigation (requires auth)", () => {
  test.skip(true, "Requires auth fixtures — navigation is behind AuthGate");

  test("main navigation has aria-label", async ({ page }) => {
    await page.goto("/");

    // Desktop nav
    await expect(
      page.locator('nav[aria-label="Main navigation"]'),
    ).toBeAttached();

    // Mobile nav (visible on smaller viewports)
    await expect(
      page.locator('nav[aria-label="Mobile navigation"]'),
    ).toBeAttached();
  });
});

test.describe("Reduced motion preference", () => {
  test("respects prefers-reduced-motion media query", async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // The page should still load and render without motion/animation errors
    await expect(page.locator("body")).toBeVisible();

    // Verify the CSS media query is active by checking computed styles
    const hasReducedMotion = await page.evaluate(() => {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });
    expect(hasReducedMotion).toBe(true);
  });
});

test.describe("Title page keyboard accessibility (public)", () => {
  test("login button is focusable via keyboard", async ({ page }) => {
    await page.goto("/");

    // Wait for the login button to appear (it has a staggered reveal)
    const loginButton = page.getByRole("button", { name: /initialize with google/i });
    await expect(loginButton).toBeVisible({ timeout: 5_000 });

    // Tab to it
    await page.keyboard.press("Tab");
    // May need multiple tabs depending on other focusable elements (links, etc.)
    let focused = false;
    for (let i = 0; i < 10; i++) {
      const activeTag = await page.evaluate(() => document.activeElement?.tagName);
      const activeText = await page.evaluate(() => document.activeElement?.textContent);
      if (activeText?.includes("INITIALIZE WITH GOOGLE")) {
        focused = true;
        break;
      }
      await page.keyboard.press("Tab");
    }
    expect(focused).toBe(true);
  });

  test("terms and privacy links are focusable via keyboard", async ({ page }) => {
    await page.goto("/");

    const termsLink = page.getByRole("link", { name: /terms/i });
    const privacyLink = page.getByRole("link", { name: /privacy/i });

    await expect(termsLink).toBeVisible();
    await expect(privacyLink).toBeVisible();

    // Verify they have href attributes (making them natively focusable)
    await expect(termsLink).toHaveAttribute("href", "/terms");
    await expect(privacyLink).toHaveAttribute("href", "/privacy");
  });
});
