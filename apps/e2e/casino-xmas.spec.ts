/* ═══════════════════════════════════════════════════════
   CASINO + CHRISTMAS IN JULY — E2E scaffold

   These tests exercise the rendered HTML of the casino +
   event pages. Most of them are marked `test.skip()`
   because they depend on an authenticated session and a
   running DB — flip them on when the stack has a test
   user harness in place.
   ═══════════════════════════════════════════════════════ */
import { test, expect } from "@playwright/test";

test.describe("The Degen's Casino — public surfaces", () => {
  test.skip("casino page redirects unauthenticated users to the title page", async ({ page }) => {
    await page.goto("/casino");
    await expect(page).toHaveURL(/\//);
  });

  test.skip("casino leaderboard renders a jackpot pool balance", async ({ page }) => {
    await page.goto("/casino/leaderboard");
    await expect(page.getByText(/Progressive Jackpot Pool/i)).toBeVisible();
    await expect(page.getByText(/DREAM/i)).toBeVisible();
  });
});

test.describe("Christmas in July — authenticated flow", () => {
  // These require an authenticated test user, a MySQL instance, and the
  // xmas_july_testing feature flag enabled. They describe the golden
  // path rather than run it; the matching unit + router tests cover the
  // underlying logic directly.
  test.skip("golden path: claim daily tokens → spin wheel → send gift → claim gift", async ({ page }) => {
    await page.goto("/events/christmas-in-july");

    // Daily tokens — first visit of the day should show an unclaimed
    // 10-token bonus.
    await expect(page.getByRole("button", { name: /daily tokens/i })).toBeVisible();
    await page.getByRole("button", { name: /daily tokens/i }).click();

    // Wheel tab — spin should advance festive tokens and log a prize.
    await page.getByRole("button", { name: /Wheel/i }).click();
    await page.getByRole("button", { name: /SPIN/i }).click();
    await expect(page.getByText(/You Won/i)).toBeVisible({ timeout: 6000 });

    // Floor tab — search for a recipient and send a gift.
    await page.getByRole("button", { name: /The Floor/i }).click();
    await page.getByPlaceholder(/Search by name/i).fill("Vos");
    await page.getByText(/Voss/i).click();
    await page.getByRole("button", { name: /Send$/i }).click();
    await expect(page.getByText(/Gift sent/i)).toBeVisible();

    // Inbox count should advance for the recipient (tested separately
    // with a second session — see `two-user-gift-flow` below).
  });

  test.skip("milestone broadcast: 1000th gift fires a notification", async ({ page }) => {
    await page.goto("/events/christmas-in-july");
    await page.getByRole("button", { name: /Charity/i }).click();
    await expect(page.getByText(/First Frost/i)).toBeVisible();
  });

  test.skip("two-user gift flow: sender → recipient claim", async ({ browser }) => {
    const senderCtx = await browser.newContext();
    const recipientCtx = await browser.newContext();
    try {
      const sender = await senderCtx.newPage();
      const recipient = await recipientCtx.newPage();
      await sender.goto("/events/christmas-in-july");
      await recipient.goto("/events/christmas-in-july");
      // Sender dispatches gift
      await sender.getByPlaceholder(/Search by name/i).fill("Test");
      await sender.getByText(/Test User 2/i).click();
      await sender.getByRole("button", { name: /Send$/i }).click();
      // Recipient should see an unclaimed gift in their inbox
      await recipient.reload();
      await expect(recipient.getByText(/unclaimed/i)).toBeVisible();
      await recipient.getByRole("button", { name: /Claim/i }).click();
      await expect(recipient.getByText(/claimed/i)).toBeVisible();
    } finally {
      await senderCtx.close();
      await recipientCtx.close();
    }
  });
});
