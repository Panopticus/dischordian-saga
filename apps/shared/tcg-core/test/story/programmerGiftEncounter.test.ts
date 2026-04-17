/**
 * §5.6 Programmer gift encounter wiring tests.
 *
 * Parallel to authorityTrialEncounter.test.ts: smoke-level checks
 * that chapters.ts / encounter.ts / init.ts plumbing propagates
 * `giftMode` from the encounter definition into an initialized
 * GameState's `programmerGift` field.
 */
import { describe, it, expect } from "vitest";
import {
  ALL_CARD_DEFINITIONS,
  buildCardRegistry,
} from "../../index";
import { CHAPTER_MAP } from "../../story/chapters";
import { initEncounter } from "../../story/encounter";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

describe("§5.6 chProgrammerGift wiring", () => {
  it("is registered in CHAPTER_MAP with giftMode set", () => {
    const enc = CHAPTER_MAP["ch_programmer_gift"];
    expect(enc).toBeDefined();
    expect(enc.bossGeneralDefId).toBe("gen_programmer");
    expect(enc.bossFaction).toBe("neutral");
    expect(enc.giftMode).toEqual({ earliestOfferTurn: 3 });
  });

  it("preserves default general_killed win/lose — a declined gift still resolves via combat", () => {
    const enc = CHAPTER_MAP["ch_programmer_gift"];
    expect(enc.winConditions).toEqual([{ kind: "general_killed" }]);
    expect(enc.loseConditions).toEqual([{ kind: "general_killed" }]);
  });

  it("declares pre/win/loss dialog ids matching the dialog bank contract", () => {
    const enc = CHAPTER_MAP["ch_programmer_gift"];
    expect(enc.preMatchDialog).toBe("dialog_programmer_gift_pre");
    expect(enc.postMatchWinDialog).toBe("dialog_programmer_gift_win");
    expect(enc.postMatchLossDialog).toBe("dialog_programmer_gift_loss");
  });

  it("initEncounter populates GameState.programmerGift in not_offered", () => {
    const enc = CHAPTER_MAP["ch_programmer_gift"];
    const init = initEncounter({
      encounter: enc,
      playerFaction: "insurgency",
      playerGeneralDefId: "gen_insurgency",
      playerDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `p_${i}`),
      registry,
    });
    const s = init.gameState;
    expect(s.programmerGift).toBeDefined();
    expect(s.programmerGift!.status).toBe("not_offered");
    // Offer/resolution turns are absent in the initial state.
    expect(s.programmerGift!.offeredOnTurn).toBeUndefined();
    expect(s.programmerGift!.resolvedOnTurn).toBeUndefined();
  });

  it("non-gift encounters leave programmerGift undefined (no cross-contamination)", () => {
    // ch_authority_trial is the cleanest control: different mode,
    // same initEncounter call path.
    const enc = CHAPTER_MAP["ch_authority_trial"];
    const init = initEncounter({
      encounter: enc,
      playerFaction: "insurgency",
      playerGeneralDefId: "gen_insurgency",
      playerDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `p_${i}`),
      registry,
    });
    expect(init.gameState.programmerGift).toBeUndefined();
    expect(init.gameState.trial).toBeDefined();
  });
});

describe("gen_programmer card", () => {
  it("is registered in the card registry with the expected shape", () => {
    const def = registry.get("gen_programmer");
    expect(def).toBeDefined();
    expect(def!.cardType).toBe("general");
    expect(def!.faction).toBe("neutral");
    expect(def!.abilities).toEqual([]);
    expect(def!.baseStats?.power).toBe(3);
    expect(def!.baseStats?.health).toBe(22);
  });
});
