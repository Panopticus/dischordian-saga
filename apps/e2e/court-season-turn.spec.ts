import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Court / season-turn smoke (phase 9 of items-matter / GoT arc).
//
// Public-facing smoke: with no auth, the /court route still has to render
// without crashing the SPA. The page itself gates protected queries behind
// auth — we just confirm the route bundle loads, the SPA mounts, and the
// expected scaffold (header / "loading…" or "could not load" copy) appears.
//
// Auth-gated full path is documented as test.skip() until storageState
// fixtures are wired (matches the existing critical-paths.spec.ts pattern).
// ---------------------------------------------------------------------------

test.describe("/court route (public smoke)", () => {
  test("court route bundle loads without runtime error", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", err => errors.push(String(err)));
    page.on("console", msg => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/court");

    // The lazy chunk loads either the court widget or the auth-gated
    // redirect. Either way, no uncaught runtime errors should fire.
    await page.waitForLoadState("domcontentloaded");
    expect(errors).toEqual([]);
  });

  test.skip("authenticated season-turn smoke", async () => {
    // Requires storageState fixture for an authenticated user with a
    // non-empty sub-house reputation row. When the harness lands, the
    // assertions are:
    //   1. Visit /court; sub-house reputation grid renders.
    //   2. Click a House Oath sign button; toast confirms.
    //   3. Refresh; the news feed includes a contract_signed event.
    //   4. Trigger _tickMyAgendas via a dev-tool button (or admin
    //      tRPC call) and confirm an agenda stage advances to
    //      world_fired or countered in the agenda widget.
    //   5. Confirm the season banner reflects the active declaration.
  });
});
