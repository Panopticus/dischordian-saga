import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// Transmission Flow E2E Tests
//
// Covers the full "Late Night with the Meme" loop:
//   1. Inbox renders with unlocked broadcasts grouped by epoch
//   2. Playing a broadcast fires the CRT player with intro → video → outro
//   3. Completing grants rewards (XP / Dream / achievement) via the server
//   4. Watched state persists and is reflected back in the inbox
//   5. Replays skip the intro and go straight to the video
//   6. "TRANSMISSION INCOMING" toast fires when new episodes unlock
//   7. Bell notification is created server-side for the same event
//
// All protected tests are skipped until the shared auth fixture is
// wired up — see critical-paths.spec.ts for the same gating pattern.
// When storageState lands, flip the top-level skip to enable the suite.
// ---------------------------------------------------------------------------

const REQUIRES_AUTH =
  "Requires auth fixtures — add storageState for Google OAuth session";

test.describe("Transmission inbox (requires auth)", () => {
  test.skip(true, REQUIRES_AUTH);

  test("inbox page loads with progress bar and epoch groupings", async ({ page }) => {
    await page.goto("/transmissions");

    // Page title + header
    await expect(page).toHaveTitle(/Loredex OS/i);
    await expect(page.getByRole("heading", { name: /TRANSMISSIONS/ })).toBeVisible();

    // Global archive progress bar (added in the follow-up polish pass)
    await expect(page.getByTestId("transmission-progress")).toBeVisible();

    // At least one series group should render — epoch 1 is "always"
    // unlocked via Ep 0 "In the Beginning".
    await expect(page.getByTestId("transmission-group-epoch1")).toBeVisible();
  });

  test("clicking a broadcast opens the CRT player", async ({ page }) => {
    await page.goto("/transmissions");

    // First episode is Epoch 1 Ep 0 "In the Beginning" (unlock: always)
    await page.getByTestId("transmission-ep1-0").click();
    await expect(page.getByTestId("meme-broadcast")).toBeVisible();

    // Header strip shows "LIVE" and the title
    await expect(page.getByText("LIVE")).toBeVisible();
    await expect(page.getByText("In the Beginning")).toBeVisible();
  });

  test("completing a first watch grants XP/Dream/achievement toast", async ({ page }) => {
    await page.goto("/transmissions");
    await page.getByTestId("transmission-ep1-0").click();

    // Advance past intro kinetic typography
    await page.getByRole("button", { name: /ROLL THE TAPE/i }).click();

    // Skip the video element directly to the outro
    await page.getByRole("button", { name: /SKIP/i }).click();

    // Click through the outro rewards dialog
    await page.getByRole("button", { name: /SIGN OFF/i }).click();

    // Reward toast (sonner) shows XP + Dream
    await expect(page.getByText(/\+100 XP/)).toBeVisible();
    await expect(page.getByText(/\+10 Dream/)).toBeVisible();

    // Back on the inbox, the episode should now show the archived
    // checkmark instead of the NEW tag.
    await expect(page.getByTestId("transmission-ep1-0")).toBeVisible();
    await expect(page.locator('[data-testid="transmission-ep1-0"] .lucide-check-circle'))
      .toBeVisible();
  });

  test("replay of an already-watched broadcast skips intro", async ({ page }) => {
    // Prerequisite: the previous test already watched ep1-0
    await page.goto("/transmissions");
    await page.getByTestId("transmission-ep1-0").click();

    // Replay should NOT show ROLL THE TAPE — it should jump straight
    // into the video phase (no intro kinetic commentary).
    await expect(page.getByRole("button", { name: /ROLL THE TAPE/i })).toHaveCount(0);
    await expect(page.locator("video")).toBeVisible();
  });

  test("TRANSMISSION INCOMING toast fires when new episode unlocks", async ({ page }) => {
    // Requires a test helper that bumps citizen level on the server.
    // For now, load a pre-seeded account with level >= 2 and verify
    // that the ep1-2 episode (level-gated) triggers the incoming toast.
    await page.goto("/");
    await expect(page.getByText(/TRANSMISSION INCOMING/)).toBeVisible();
  });

  test("watching a broadcast creates a persistent bell notification", async ({ page }) => {
    await page.goto("/transmissions");
    await page.getByTestId("transmission-ep1-0").click();
    await page.getByRole("button", { name: /ROLL THE TAPE/i }).click();
    await page.getByRole("button", { name: /SKIP/i }).click();
    await page.getByRole("button", { name: /SIGN OFF/i }).click();

    // Navigate away and back — the bell badge should reflect the
    // meme_broadcast notification inserted by notifyIncoming.
    await page.goto("/");
    const bell = page.getByRole("button", { name: /notifications/i });
    await bell.click();
    await expect(page.getByText(/Late Night with the Meme/)).toBeVisible();
  });
});

test.describe("Transmission flag chain (requires auth)", () => {
  test.skip(true, REQUIRES_AUTH);

  test("watching ep2-1 unlocks ep2-2 via the watched flag", async ({ page }) => {
    // Requires a pre-seeded account at level >= 10 so ep2-1 is unlocked.
    await page.goto("/transmissions");

    // Ep2-2 should NOT be visible before watching Ep2-1
    await expect(page.getByTestId("transmission-ep2-2")).toHaveCount(0);

    // Watch Ep2-1
    await page.getByTestId("transmission-ep2-1").click();
    await page.getByRole("button", { name: /ROLL THE TAPE/i }).click();
    await page.getByRole("button", { name: /SKIP/i }).click();
    await page.getByRole("button", { name: /SIGN OFF/i }).click();
    await page.keyboard.press("Escape");

    // Now Ep2-2 should be visible
    await expect(page.getByTestId("transmission-ep2-2")).toBeVisible();
  });
});

test.describe("Spaces In Between fallback (requires auth)", () => {
  test.skip(true, REQUIRES_AUTH);

  test("null-video SIB episode renders audio-intercept fallback", async ({ page }) => {
    // Requires humanTrust >= 1 to unlock the first SIB episode.
    await page.goto("/transmissions");
    await page.getByTestId("transmission-sib-ep1").click();
    await page.getByRole("button", { name: /ROLL THE TAPE/i }).click();

    // Fallback should render instead of <video>
    await expect(page.getByText(/AUDIO INTERCEPT/)).toBeVisible();
    await expect(page.getByText(/VIDEO UNAVAILABLE/)).toBeVisible();

    // CONTINUE TO OUTRO button becomes available after the kinetic
    // synopsis reveal completes.
    await expect(page.getByRole("button", { name: /CONTINUE TO OUTRO/i })).toBeVisible();
  });
});
