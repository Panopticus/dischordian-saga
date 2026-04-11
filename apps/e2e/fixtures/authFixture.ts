/* ═══════════════════════════════════════════════════════
   TEST AUTH FIXTURE — Playwright
   ═══════════════════════════════════════════════════════

   Extends Playwright's `test` with an `authedPage` fixture
   that injects the test-mode auth bypass header on every
   request. Pairs with `tryTestAuthBypass` in
   apps/server/_core/context.ts.

   USAGE

       import { test, expect } from "./fixtures/authFixture";

       test("requires auth", async ({ authedPage }) => {
         await authedPage.goto("/");
         await expect(authedPage.getByText(/dashboard/i)).toBeVisible();
       });

   SERVER REQUIREMENTS

   The server must be started with:

       TEST_AUTH_BYPASS_OPEN_ID=<seeded-user-openId> pnpm dev

   And the user row for that openId must exist in the DB. See
   `seedTestUser.ts` for a helper that creates it.

   Tests that opt into the fixture get a `page` that carries the
   `x-test-auth-bypass: 1` header on every HTTP request — tRPC
   requests + asset loads both. The server's `createContext`
   short-circuits OAuth and loads the seeded user.

   SAFETY

   The bypass cannot fire in production because `TEST_AUTH_BYPASS_OPEN_ID`
   is never set there. In dev, the bypass requires explicit opt-in
   via the env var AND the header — two independent signals.
   ═══════════════════════════════════════════════════════ */
import { test as base, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

type AuthFixture = {
  /**
   * A `Page` pre-configured with the `x-test-auth-bypass` header so
   * every request authenticates as the seeded test user. Fails fast
   * with a skip if the server doesn't have `TEST_AUTH_BYPASS_OPEN_ID`
   * configured.
   */
  authedPage: Page;
};

export const test = base.extend<AuthFixture>({
  authedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      extraHTTPHeaders: {
        "x-test-auth-bypass": "1",
      },
    });
    const page = await context.newPage();

    // Sanity check: the server has to be running with the bypass
    // env var set. Hit the auth.me query directly — if it returns
    // no user, the bypass isn't wired up and the test should skip
    // rather than time out waiting for UI that will never render.
    const meResponse = await page.request.get(
      "/api/trpc/auth.me?batch=1&input=%7B%220%22%3A%7B%7D%7D",
      { headers: { "x-test-auth-bypass": "1" } },
    );
    if (!meResponse.ok()) {
      test.skip(true, "Server is not running with TEST_AUTH_BYPASS_OPEN_ID set");
    }

    await use(page);
    await context.close();
  },
});

export { expect };
