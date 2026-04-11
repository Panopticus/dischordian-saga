import { test, expect } from "./fixtures/authFixture";

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
// All authenticated paths use the `authedPage` fixture, which
// injects the `x-test-auth-bypass` header. The server must run with
// `TEST_AUTH_BYPASS_OPEN_ID=<seeded-user>` for these tests to
// execute; otherwise the fixture skips them with a clear message.
//
// Flag-chain / level-gated tests still need a pre-seeded citizen
// with a known level, which is why the two describes below are
// skipped at the `test.skip(...)` level — the auth fixture alone
// is not enough without DB seeding.
// ---------------------------------------------------------------------------

test.describe("Transmission inbox", () => {
  test("inbox page loads with progress bar and epoch groupings", async ({ authedPage }) => {
    await authedPage.goto("/transmissions");

    // Page title + header
    await expect(authedPage).toHaveTitle(/Loredex OS/i);
    await expect(authedPage.getByRole("heading", { name: /TRANSMISSIONS/ })).toBeVisible();

    // Global archive progress bar (added in the follow-up polish pass)
    await expect(authedPage.getByTestId("transmission-progress")).toBeVisible();

    // At least one series group should render — epoch 1 is "always"
    // unlocked via Ep 0 "In the Beginning".
    await expect(authedPage.getByTestId("transmission-group-epoch1")).toBeVisible();
  });

  test("clicking a broadcast opens the CRT player", async ({ authedPage }) => {
    await authedPage.goto("/transmissions");

    // First episode is Epoch 1 Ep 0 "In the Beginning" (unlock: always)
    await authedPage.getByTestId("transmission-ep1-0").click();
    await expect(authedPage.getByTestId("meme-broadcast")).toBeVisible();

    // Header strip shows "LIVE" and the title
    await expect(authedPage.getByText("LIVE")).toBeVisible();
    await expect(authedPage.getByText("In the Beginning")).toBeVisible();
  });

  test("completing a first watch grants XP/Dream/achievement toast", async ({ authedPage }) => {
    await authedPage.goto("/transmissions");
    await authedPage.getByTestId("transmission-ep1-0").click();

    // Advance past intro kinetic typography
    await authedPage.getByRole("button", { name: /ROLL THE TAPE/i }).click();

    // Skip the video element directly to the outro
    await authedPage.getByRole("button", { name: /SKIP/i }).click();

    // Click through the outro rewards dialog
    await authedPage.getByRole("button", { name: /SIGN OFF/i }).click();

    // Reward toast (sonner) shows XP + Dream
    await expect(authedPage.getByText(/\+100 XP/)).toBeVisible();
    await expect(authedPage.getByText(/\+10 Dream/)).toBeVisible();

    // Back on the inbox, the episode should now show the archived
    // checkmark instead of the NEW tag.
    await expect(authedPage.getByTestId("transmission-ep1-0")).toBeVisible();
    await expect(authedPage.locator('[data-testid="transmission-ep1-0"] .lucide-check-circle'))
      .toBeVisible();
  });

  test("replay of an already-watched broadcast skips intro", async ({ authedPage }) => {
    // Prerequisite: the previous test already watched ep1-0
    await authedPage.goto("/transmissions");
    await authedPage.getByTestId("transmission-ep1-0").click();

    // Replay should NOT show ROLL THE TAPE — it should jump straight
    // into the video phase (no intro kinetic commentary).
    await expect(authedPage.getByRole("button", { name: /ROLL THE TAPE/i })).toHaveCount(0);
    await expect(authedPage.locator("video")).toBeVisible();
  });

  test("watching a broadcast creates a persistent bell notification", async ({ authedPage }) => {
    await authedPage.goto("/transmissions");
    await authedPage.getByTestId("transmission-ep1-0").click();
    await authedPage.getByRole("button", { name: /ROLL THE TAPE/i }).click();
    await authedPage.getByRole("button", { name: /SKIP/i }).click();
    await authedPage.getByRole("button", { name: /SIGN OFF/i }).click();

    // Navigate away and back — the bell badge should reflect the
    // meme_broadcast notification inserted by notifyIncoming.
    await authedPage.goto("/");
    const bell = authedPage.getByRole("button", { name: /notifications/i });
    await bell.click();
    await expect(authedPage.getByText(/Late Night with the Meme/)).toBeVisible();
  });
});

test.describe("Transmission flag chain", () => {
  // Still skipped — requires a pre-seeded citizen with level >= 10 so
  // the level-gated Epoch 2 Ep 1 broadcast is unlocked. The auth
  // bypass alone isn't enough; the test user's character row needs
  // a known level. Enable once `seedTestUser.ts` supports level seeding.
  test.skip(true, "Requires pre-seeded citizen with level >= 10");

  test("watching ep2-1 unlocks ep2-2 via the watched flag", async ({ authedPage }) => {
    await authedPage.goto("/transmissions");

    // Ep2-2 should NOT be visible before watching Ep2-1
    await expect(authedPage.getByTestId("transmission-ep2-2")).toHaveCount(0);

    // Watch Ep2-1
    await authedPage.getByTestId("transmission-ep2-1").click();
    await authedPage.getByRole("button", { name: /ROLL THE TAPE/i }).click();
    await authedPage.getByRole("button", { name: /SKIP/i }).click();
    await authedPage.getByRole("button", { name: /SIGN OFF/i }).click();
    await authedPage.keyboard.press("Escape");

    // Now Ep2-2 should be visible
    await expect(authedPage.getByTestId("transmission-ep2-2")).toBeVisible();
  });

  test("TRANSMISSION INCOMING toast fires when new episode unlocks", async ({ authedPage }) => {
    // Leveling up across a threshold normally fires getNewlyUnlocked
    // on every game-state update. In test this needs the DB-seeded
    // level to cross a boundary, which isn't wired up yet.
    await authedPage.goto("/");
    await expect(authedPage.getByText(/TRANSMISSION INCOMING/)).toBeVisible();
  });
});

test.describe("Spaces In Between fallback", () => {
  // Still skipped — SIB Ep 1 unlocks on humanTrust >= 1. Needs the
  // seeded user to have that relationship set up.
  test.skip(true, "Requires pre-seeded humanTrust >= 1");

  test("null-video SIB episode renders audio-intercept fallback", async ({ authedPage }) => {
    await authedPage.goto("/transmissions");
    await authedPage.getByTestId("transmission-sib-ep1").click();
    await authedPage.getByRole("button", { name: /ROLL THE TAPE/i }).click();

    // Fallback should render instead of <video>
    await expect(authedPage.getByText(/AUDIO INTERCEPT/)).toBeVisible();
    await expect(authedPage.getByText(/VIDEO UNAVAILABLE/)).toBeVisible();

    // CONTINUE TO OUTRO button becomes available after the kinetic
    // synopsis reveal completes.
    await expect(authedPage.getByRole("button", { name: /CONTINUE TO OUTRO/i })).toBeVisible();
  });
});
