/**
 * §5.8 Authority trial encounter wiring tests.
 *
 * Smoke-level tests that the chapters.ts / encounter.ts plumbing
 * correctly propagates `trialMode` from the encounter definition
 * into an initialized GameState's `trial` field.
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

describe("§5.8 chAuthorityTrial wiring", () => {
  it("is registered in CHAPTER_MAP with trialMode set", () => {
    const enc = CHAPTER_MAP["ch_authority_trial"];
    expect(enc).toBeDefined();
    expect(enc.bossGeneralDefId).toBe("gen_authority");
    expect(enc.bossFaction).toBe("architect");
    expect(enc.trialMode).toEqual({ openingVerdictBalance: 0 });
  });

  it("initEncounter populates GameState.trial", () => {
    const enc = CHAPTER_MAP["ch_authority_trial"];
    const init = initEncounter({
      encounter: enc,
      playerFaction: "insurgency",
      playerGeneralDefId: "gen_insurgency",
      playerDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `p_${i}`),
      registry,
    });
    const s = init.gameState;
    expect(s.trial).toBeDefined();
    expect(s.trial!.openingVerdictBalance).toBe(0);
    expect(s.trial!.trialBalance).toBe(0);
    expect(s.trial!.openingArgumentPlayed).toBe(false);
    expect(s.trial!.closingArgumentPlayed).toBe(false);
    expect(s.trial!.outcome).toBeUndefined();
  });

  it("reaches turn 10 via repeated end_turn and auto-resolves the verdict", () => {
    const enc = CHAPTER_MAP["ch_authority_trial"];
    const init = initEncounter({
      encounter: enc,
      playerFaction: "insurgency",
      playerGeneralDefId: "gen_insurgency",
      playerDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `p_${i}`),
      registry,
    });

    // Run mulligans for both sides to enter the playing phase.
    let s = init.gameState;
    for (const actor of [0, 1] as const) {
      const r = reduce(
        s,
        { kind: "finish_mulligan", actor, seq: 0 } as Action,
        registry,
      );
      expect(r.error).toBeUndefined();
      s = r.state;
    }

    // End turns until the match reaches turn 10. The §5.8 engine
    // auto-resolves the verdict on entering turn 10 (spec §2 row 10 —
    // pure resolution, no card play).
    let safetyCap = 40;
    while (s.turnNumber < 10 && safetyCap-- > 0) {
      const r = reduce(
        s,
        { kind: "end_turn", actor: s.currentPlayer, seq: 0 } as Action,
        registry,
      );
      expect(r.error).toBeUndefined();
      s = r.state;
    }
    expect(s.turnNumber).toBe(10);
    expect(s.trial!.outcome).toBeDefined();
  });
});

describe("gen_authority card", () => {
  it("is registered in the card registry with the expected shape", () => {
    const def = registry.get("gen_authority");
    expect(def).toBeDefined();
    expect(def!.cardType).toBe("general");
    expect(def!.faction).toBe("architect");
    expect(def!.abilities).toEqual([]);
    expect(def!.baseStats?.power).toBe(0);
    expect(def!.baseStats?.health).toBe(99);
  });
});
