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
  test.skip(!process.env.E2E_AUTH_OPEN_ID, "Set E2E_AUTH_OPEN_ID + JWT_SECRET to mint a session storageState (SkipToContent behind AuthGate)");

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
  test.skip(!process.env.E2E_AUTH_OPEN_ID, "Set E2E_AUTH_OPEN_ID + JWT_SECRET to mint a session storageState (interactive elements behind AuthGate)");

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
  test.skip(!process.env.E2E_AUTH_OPEN_ID, "Set E2E_AUTH_OPEN_ID + JWT_SECRET to mint a session storageState (navigation behind AuthGate)");

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

/**
 * Colorblind palette presets — the SettingsPage exposes a four-way
 * OptionSelector ("off" / "deuteranopia" / "protanopia" / "tritanopia").
 * The selector writes through `saveSettings`, which (a) persists to
 * localStorage under "loredex-settings" and (b) calls applySettingsToDOM
 * in apps/client/src/lib/settingsSync.ts to toggle a `colorblind-{mode}`
 * class on `<html>`.
 *
 * Apps/client/src/App.tsx also reads localStorage directly on first
 * mount to apply the class before the settings page renders, so this
 * test seeds localStorage and reloads the public landing page.
 *
 * Each mode is checked in turn, including "off" → no colorblind-* class.
 */
test.describe("Colorblind palette presets (public)", () => {
  for (const mode of ["deuteranopia", "protanopia", "tritanopia"] as const) {
    test(`${mode} mode applies html.colorblind-${mode}`, async ({ page }) => {
      await page.goto("/");
      await page.evaluate((m) => {
        localStorage.setItem("loredex-settings", JSON.stringify({ colorblindMode: m }));
      }, mode);
      await page.reload();
      // App.tsx applies the class on first mount from localStorage.
      const html = page.locator("html");
      await expect(html).toHaveClass(new RegExp(`colorblind-${mode}`));
      // The other two modes must NOT be present (mutually exclusive).
      const other = (["deuteranopia", "protanopia", "tritanopia"] as const).filter(
        (m) => m !== mode,
      );
      for (const m of other) {
        await expect(html).not.toHaveClass(new RegExp(`colorblind-${m}`));
      }
    });
  }

  test("off mode (default) applies no colorblind-* class", async ({ page }) => {
    await page.goto("/");
    // Clear any prior setting so we genuinely test the off default.
    await page.evaluate(() => localStorage.removeItem("loredex-settings"));
    await page.reload();
    const className = await page.locator("html").getAttribute("class");
    expect(className ?? "").not.toMatch(/colorblind-/);
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

/**
 * Captions toggle — `settings.captions` flips an `html.captions-on`
 * class via apps/client/src/lib/settingsSync.ts → applySettingsToDOM,
 * and a CSS rule in apps/client/src/index.css (`html.captions-on
 * .caption-label`) un-hides any `<span class="caption-label">` from
 * `display: none` to `display: inline-block`.
 *
 * AwakeningPage uses the pattern today
 * (apps/client/src/pages/AwakeningPage.tsx:292). The infrastructure
 * was previously untested; this block locks the contract in.
 */
test.describe("Captions toggle (public)", () => {
  test("captions: true seeds html.captions-on", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("loredex-settings", JSON.stringify({ captions: true }));
    });
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/captions-on/);
  });

  test("captions: false (default) does not apply html.captions-on", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("loredex-settings"));
    await page.reload();
    const className = await page.locator("html").getAttribute("class");
    expect(className ?? "").not.toMatch(/captions-on/);
  });

  test("captions: true makes .caption-label elements visible (CSS contract)", async ({ page }) => {
    // Insert a probe element + assert its computed display when the
    // class is on. Avoids depending on which page renders the label
    // in production (AwakeningPage is auth-gated).
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("loredex-settings", JSON.stringify({ captions: true }));
    });
    await page.reload();
    const display = await page.evaluate(() => {
      const probe = document.createElement("span");
      probe.className = "caption-label";
      probe.textContent = "[ PROBE ]";
      document.body.appendChild(probe);
      const computed = window.getComputedStyle(probe).display;
      probe.remove();
      return computed;
    });
    // index.css: `html.captions-on .caption-label { display: inline-block; }`
    expect(display).toBe("inline-block");
  });

  test("captions: false hides .caption-label elements (CSS contract)", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("loredex-settings"));
    await page.reload();
    const display = await page.evaluate(() => {
      const probe = document.createElement("span");
      probe.className = "caption-label";
      probe.textContent = "[ PROBE ]";
      document.body.appendChild(probe);
      const computed = window.getComputedStyle(probe).display;
      probe.remove();
      return computed;
    });
    // index.css: `.caption-label { display: none; }` (default)
    expect(display).toBe("none");
  });
});
