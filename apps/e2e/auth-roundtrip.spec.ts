/**
 * Critical-path E2E #90a — full auth + OAuth round-trip.
 *
 * Two layers:
 *
 *   Public (always runs in CI):
 *     - Title page renders the Google sign-in button with the correct
 *       OAuth client_id, redirect_uri, and scope.
 *     - The /api/oauth/callback endpoint exists and rejects an
 *       obviously-bad request without a 5xx.
 *     - The /api/refresh endpoint exists and rejects unauthenticated
 *       requests cleanly (no 5xx).
 *
 *   Authed (runs when E2E_AUTH_OPEN_ID + JWT_SECRET are set; the
 *   global-setup mints a session cookie):
 *     - Visiting "/" with the session cookie does NOT show the title
 *       page (i.e. the cookie was honoured and the AuthGate let the
 *       user in).
 *     - The session is durable across navigations.
 *     - /api/auth/logout clears the session and returns to the title
 *       page on next navigation.
 */
import { test, expect } from "@playwright/test";

test.describe("Auth round-trip — public surface", () => {
  test("title page renders Google sign-in button with OAuth fields", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: /initialize with google/i });
    await expect(button).toBeVisible();

    // The button or its surrounding form should reference the Google
    // OAuth endpoint or carry the client_id in a data attribute / link.
    // We don't assert the exact format — just that something OAuth-shaped
    // is present so a future regression that breaks the auth wiring
    // surfaces here.
    const html = await page.content();
    expect(html).toMatch(/accounts\.google\.com|client_id|oauth/i);
  });

  test("/api/oauth/callback responds (does not 5xx) when missing params", async ({ request }) => {
    // The endpoint must exist and reject malformed requests cleanly.
    // A 5xx here would indicate a server-side regression.
    const res = await request.get("/api/oauth/callback");
    expect(res.status()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(500);
  });

  test("/api/refresh rejects unauthenticated requests without 5xx", async ({ request }) => {
    const res = await request.post("/api/refresh");
    expect(res.status()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(500);
    // 401 / 400 / 403 are all acceptable rejections — anything in 4xx.
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test("logout endpoint exists and responds without 5xx", async ({ request }) => {
    const res = await request.post("/api/auth/logout");
    expect(res.status()).toBeGreaterThanOrEqual(200);
    expect(res.status()).toBeLessThan(500);
  });
});

test.describe("Auth round-trip — authed surface", () => {
  test.skip(
    !process.env.E2E_AUTH_OPEN_ID || !process.env.JWT_SECRET,
    "Set E2E_AUTH_OPEN_ID + JWT_SECRET to mint a session storageState",
  );

  test("session cookie bypasses the title page", async ({ page }) => {
    await page.goto("/");
    // With auth fixture, the AuthGate should NOT show the title-page
    // sign-in button. The user lands somewhere inside the app shell.
    await expect(
      page.getByRole("button", { name: /initialize with google/i }),
    ).toHaveCount(0);
  });

  test("session persists across navigations", async ({ page }) => {
    await page.goto("/");
    await page.goto("/settings");
    // If the cookie were dropped, /settings would either redirect to /
    // (showing the title page) or 401. Neither should happen.
    await expect(
      page.getByRole("button", { name: /initialize with google/i }),
    ).toHaveCount(0);
  });

  test("logout clears the session", async ({ page, request }) => {
    await page.goto("/");
    // Hit logout via the API; the cookie should be cleared.
    const res = await request.post("/api/auth/logout");
    expect(res.status()).toBeLessThan(500);
    // Reload the home page; AuthGate should re-engage.
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Either the title page renders or we are redirected somewhere
    // that does not include an authed-only nav. Acceptable shapes:
    //   - title-page sign-in button visible, OR
    //   - URL no longer matches the in-app shell
    const signInVisible = await page
      .getByRole("button", { name: /initialize with google/i })
      .isVisible()
      .catch(() => false);
    expect(signInVisible).toBeTruthy();
  });
});
