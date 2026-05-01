import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// PvP Overhaul — happy-path smoke tests for the new systems.
//
// Like the rest of this suite, the app gates content behind Google OAuth.
// These tests verify the public surfaces (page-load, title page redirects,
// route registration) and document the auth-gated flows for when storageState
// fixtures are wired up.
// ---------------------------------------------------------------------------

test.describe("PvP overhaul — public route registration", () => {
  test("/titles redirects unauthenticated user to landing", async ({ page }) => {
    await page.goto("/titles");
    // Either renders the landing page or shows the auth prompt — both confirm
    // the route is registered and the bundle loaded.
    await expect(page).toHaveTitle(/Loredex OS|Dischordia/i);
  });

  test("/conspiracy renders or redirects without crashing", async ({ page }) => {
    await page.goto("/conspiracy");
    await expect(page).toHaveTitle(/Loredex OS|Dischordia/i);
  });

  test("/guild-hall renders or redirects without crashing", async ({ page }) => {
    await page.goto("/guild-hall");
    await expect(page).toHaveTitle(/Loredex OS|Dischordia/i);
  });

  test("/pvp-variants renders or redirects without crashing", async ({ page }) => {
    await page.goto("/pvp-variants");
    await expect(page).toHaveTitle(/Loredex OS|Dischordia/i);
  });
});

test.describe("PvP overhaul — auth-gated flows", () => {
  test.skip("title equip flow updates lobby + post-match", async ({ page }) => {
    // Pre-req: authenticated session.
    // 1. Navigate to /titles
    // 2. Catalog renders with multi-tier progressions
    // 3. Click EQUIP on an earned title
    // 4. Navigate to /pvp
    // 5. Equipped title pill visible under display name
  });

  test.skip("conspiracy first-solve grants Antiquarian title", async ({ page }) => {
    // Pre-req: authenticated session, near-complete clue progress.
    // 1. Navigate to /conspiracy
    // 2. Click ATTEMPT SOLVE on a board with all clues gathered
    // 3. Server-wide reveal banner appears
    // 4. Navigate to /titles → "Antiquarian: Queen of Truth" earned
    //    (only if first-discoverer; tier-2 otherwise)
  });

  test.skip("guild quest claim bumps treasury + unlocks banner", async ({ page }) => {
    // Pre-req: authenticated guild leader, completed weekly quest.
    // 1. Navigate to /guild-hall → quests tab
    // 2. CLAIM REWARD on a completed quest
    // 3. Treasury Dream count increments
    // 4. Banner appears in unlocked banner list
  });

  test.skip("Tier 5 hub: declare guild skirmish flow", async ({ page }) => {
    // Pre-req: authenticated guild officer.
    // 1. Navigate to /pvp-variants → SKIRMISH tab
    // 2. Enter rival guild id, click DECLARE SKIRMISH
    // 3. New skirmish appears in list with status=proposed
    // 4. Mode-mix bracket renders all four mode slots (—/—/—/—)
  });

  test.skip("apprentice trial cohort completion records to server", async ({ page }) => {
    // Pre-req: authenticated session with active cohort.
    // 1. Navigate to /cohort
    // 2. Wait for cohort to conclude (or simulate via dev tooling)
    // 3. Confirm recordCompletion fires (network tab)
    // 4. Navigate to /titles → "Apprentice Aboard" tier-1 earned
  });

  test.skip("PvP lobby renders opponent's equipped title", async ({ page }) => {
    // Pre-req: two authenticated sessions queueing simultaneously.
    // 1. Both queue from /pvp
    // 2. MATCH_FOUND fires with opponentUserId
    // 3. Each player's lobby shows opponent's title pill
  });
});
