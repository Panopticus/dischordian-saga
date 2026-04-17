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
  reduce,
  type Action,
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

describe("§5.6 scripted-action offer_programmer_gift", () => {
  it("chapter registers the scripted offer on turn 3 / side 1", () => {
    const enc = CHAPTER_MAP["ch_programmer_gift"];
    expect(enc.scriptedActions).toEqual([
      { kind: "offer_programmer_gift", globalTurn: 3, side: 1 },
    ]);
  });

  it("fires on the Programmer's turn 3 via the scripted-action drainer", () => {
    const enc = CHAPTER_MAP["ch_programmer_gift"];
    const init = initEncounter({
      encounter: enc,
      playerFaction: "insurgency",
      playerGeneralDefId: "gen_insurgency",
      playerDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `p_${i}`),
      registry,
    });

    let s = init.gameState;
    // Finish mulligans for both sides.
    for (const actor of [0, 1] as const) {
      const r = reduce(
        s,
        { kind: "finish_mulligan", actor, seq: 0 } as Action,
        registry,
      );
      expect(r.error).toBeUndefined();
      s = r.state;
    }

    // Cycle end_turns until we're past turn 3 for the Programmer.
    // Scripted offer fires on the turn-refresh that activates side 1
    // with turnNumber === 3. The drainer runs AFTER refresh.
    let safetyCap = 20;
    while (s.programmerGift?.status !== "offered" && safetyCap-- > 0) {
      const r = reduce(
        s,
        { kind: "end_turn", actor: s.currentPlayer, seq: 0 } as Action,
        registry,
      );
      expect(r.error).toBeUndefined();
      s = r.state;
    }
    expect(s.programmerGift?.status).toBe("offered");
    expect(s.programmerGift?.offeredOnTurn).toBe(3);
  });

  it("drainer is idempotent — no duplicate offer once status is terminal", () => {
    const enc = CHAPTER_MAP["ch_programmer_gift"];
    const init = initEncounter({
      encounter: enc,
      playerFaction: "insurgency",
      playerGeneralDefId: "gen_insurgency",
      playerDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `p_${i}`),
      registry,
    });
    let s = init.gameState;
    for (const actor of [0, 1] as const) {
      const r = reduce(
        s,
        { kind: "finish_mulligan", actor, seq: 0 } as Action,
        registry,
      );
      s = r.state;
    }
    // Advance until offered.
    let cap = 20;
    while (s.programmerGift?.status !== "offered" && cap-- > 0) {
      s = reduce(
        s,
        { kind: "end_turn", actor: s.currentPlayer, seq: 0 } as Action,
        registry,
      ).state;
    }
    expect(s.programmerGift?.status).toBe("offered");
    // Player accepts — match ends.
    const r = reduce(
      s,
      {
        kind: "programmer_gift_choice",
        actor: 0,
        choice: "accept",
        seq: 0,
      } as Action,
      registry,
    );
    s = r.state;
    expect(s.programmerGift?.status).toBe("accepted");
    expect(s.phase).toBe("ended");
    expect(s.winner).toBe(0);
    expect(s.programmerGift?.offeredOnTurn).toBe(3);
  });

  it("decline keeps the match going", () => {
    const enc = CHAPTER_MAP["ch_programmer_gift"];
    const init = initEncounter({
      encounter: enc,
      playerFaction: "insurgency",
      playerGeneralDefId: "gen_insurgency",
      playerDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `p_${i}`),
      registry,
    });
    let s = init.gameState;
    for (const actor of [0, 1] as const) {
      s = reduce(
        s,
        { kind: "finish_mulligan", actor, seq: 0 } as Action,
        registry,
      ).state;
    }
    let cap = 20;
    while (s.programmerGift?.status !== "offered" && cap-- > 0) {
      s = reduce(
        s,
        { kind: "end_turn", actor: s.currentPlayer, seq: 0 } as Action,
        registry,
      ).state;
    }
    s = reduce(
      s,
      {
        kind: "programmer_gift_choice",
        actor: 0,
        choice: "decline",
        seq: 0,
      } as Action,
      registry,
    ).state;
    expect(s.programmerGift?.status).toBe("declined");
    expect(s.phase).not.toBe("ended");
    expect(s.winner).toBeNull();
  });
});
