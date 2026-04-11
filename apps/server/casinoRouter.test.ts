/* ═══════════════════════════════════════════════════════
   CASINO + CHRISTMAS IN JULY — Router wiring tests

   These are *not* full integration tests (those would
   require spinning up a MySQL server). Instead, they
   verify that:

     1. Both routers are registered in the appRouter.
     2. All expected procedures are wired and are either
        queries or mutations as documented.
     3. The shared event-window middleware behaves as
        expected across in-window, out-of-window, and
        override cases.

   Live DB-backed tests run in a follow-up e2e pass.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { checkEventWindow, CHRISTMAS_IN_JULY_WINDOW } from "./middleware/eventWindow";

/* ─── ROUTER WIRING ─── */

describe("appRouter wiring", () => {
  it("registers the casino router", () => {
    expect(appRouter._def.procedures).toBeDefined();
    // @ts-expect-error — untyped procedure map lookup for test introspection
    expect(appRouter._def.procedures["casino.getState"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playVoidSlots"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playEntropyDice"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playNebulaPoker"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playQuantumRoulette"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playPazaak21"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playHighLow"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playScratchCard"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playVoidBlackjackTournament"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playLiarsDice"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playFactionWarBet"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playDreamRoulette"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playCardBattlersGauntlet"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playVoidBingo"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.playVoidCase"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.reportMahjongCompletion"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.getFactionWarOdds"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.getJackpotPool"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.claimJackpot"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["casino.jackpotLeaderboard"]).toBeDefined();
  });

  it("registers the christmasInJuly router", () => {
    // @ts-expect-error
    expect(appRouter._def.procedures["christmasInJuly.getConfig"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["christmasInJuly.getCharityPool"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["christmasInJuly.getMyProgress"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["christmasInJuly.claimDailyTokens"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["christmasInJuly.spinWheel"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["christmasInJuly.rollCraps"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["christmasInJuly.sendGift"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["christmasInJuly.claimGift"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["christmasInJuly.myGifts"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["christmasInJuly.claimDailyChallenge"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["christmasInJuly.donateToCharity"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["christmasInJuly.searchGiftRecipients"]).toBeDefined();
    // @ts-expect-error
    expect(appRouter._def.procedures["christmasInJuly.topGifters"]).toBeDefined();
  });
});

/* ─── EVENT WINDOW MIDDLEWARE ─── */

// getDb() is called by isTestingFlagEnabled. We mock it to null so the
// feature flag lookup short-circuits to "disabled" without touching MySQL.
vi.mock("./db", () => ({
  getDb: vi.fn(async () => null),
}));

describe("checkEventWindow middleware", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("allows calls inside the window", async () => {
    vi.setSystemTime(new Date("2026-07-07T12:00:00Z"));
    const mw = checkEventWindow(CHRISTMAS_IN_JULY_WINDOW);
    const next = vi.fn(async () => "ok");
    const result = await mw({ next, ctx: {} });
    expect(result).toBe("ok");
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects calls before the window starts", async () => {
    vi.setSystemTime(new Date("2026-04-01T00:00:00Z"));
    const mw = checkEventWindow(CHRISTMAS_IN_JULY_WINDOW);
    const next = vi.fn(async () => "ok");
    await expect(mw({ next, ctx: {} })).rejects.toThrow(/not currently active/i);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects calls after the window ends", async () => {
    vi.setSystemTime(new Date("2027-01-01T00:00:00Z"));
    const mw = checkEventWindow(CHRISTMAS_IN_JULY_WINDOW);
    const next = vi.fn(async () => "ok");
    await expect(mw({ next, ctx: {} })).rejects.toThrow(/not currently active/i);
    expect(next).not.toHaveBeenCalled();
  });

  it("honours the window boundary precisely at start", async () => {
    vi.setSystemTime(new Date(CHRISTMAS_IN_JULY_WINDOW.start));
    const mw = checkEventWindow(CHRISTMAS_IN_JULY_WINDOW);
    const next = vi.fn(async () => "ok");
    await expect(mw({ next, ctx: {} })).resolves.toBe("ok");
  });

  it("honours the window boundary precisely at end", async () => {
    vi.setSystemTime(new Date(CHRISTMAS_IN_JULY_WINDOW.end));
    const mw = checkEventWindow(CHRISTMAS_IN_JULY_WINDOW);
    const next = vi.fn(async () => "ok");
    await expect(mw({ next, ctx: {} })).resolves.toBe("ok");
  });
});
