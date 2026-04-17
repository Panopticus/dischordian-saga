/**
 * §4.9 Seer visit encounter wiring tests.
 *
 * Parallel to programmerGiftEncounter / gameMasterEncounter / authority-
 * TrialEncounter: smoke-level checks that chapters.ts / encounter.ts /
 * init.ts plumbing propagates `prophecyMode` into a match's
 * `seerProphecy` state, plus integration tests that drive the match
 * through end-turn cycles and verify the bake/consume hook actually
 * transitions state and fires Seer plays.
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
import {
  BURNT_CARD_PLACEHOLDER_ID,
} from "../../types/SeerProphecy";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

describe("§4.9 chSeerVisit wiring", () => {
  it("is registered in CHAPTER_MAP with prophecyMode set", () => {
    const enc = CHAPTER_MAP["ch_seer_visit"];
    expect(enc).toBeDefined();
    expect(enc.bossGeneralDefId).toBe("gen_seer");
    expect(enc.bossFaction).toBe("neutral");
    expect(enc.prophecyMode).toEqual({ turnCount: 6 });
  });

  it("declares a turn_limit lose-condition at 8 (6-turn prophecy + slack)", () => {
    const enc = CHAPTER_MAP["ch_seer_visit"];
    expect(enc.loseConditions).toEqual(
      expect.arrayContaining([{ kind: "turn_limit", turn: 8 }]),
    );
  });

  it("declares pre/win/loss dialog ids matching the dialog bank contract", () => {
    const enc = CHAPTER_MAP["ch_seer_visit"];
    expect(enc.preMatchDialog).toBe("dialog_seer_visit_pre");
    expect(enc.postMatchWinDialog).toBe("dialog_seer_visit_win");
    expect(enc.postMatchLossDialog).toBe("dialog_seer_visit_loss");
  });

  it("initEncounter populates GameState.seerProphecy in the initial state", () => {
    const enc = CHAPTER_MAP["ch_seer_visit"];
    const init = initEncounter({
      encounter: enc,
      playerFaction: "insurgency",
      playerGeneralDefId: "gen_insurgency",
      playerDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `p_${i}`),
      registry,
    });
    expect(init.gameState.seerProphecy).toBeDefined();
    expect(init.gameState.seerProphecy!.pending).toBeNull();
    expect(init.gameState.seerProphecy!.playsPerformed).toBe(0);
  });

  it("non-prophecy encounters leave seerProphecy undefined", () => {
    const enc = CHAPTER_MAP["ch_authority_trial"];
    const init = initEncounter({
      encounter: enc,
      playerFaction: "insurgency",
      playerGeneralDefId: "gen_insurgency",
      playerDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `p_${i}`),
      registry,
    });
    expect(init.gameState.seerProphecy).toBeUndefined();
    expect(init.gameState.trial).toBeDefined();
  });
});

describe("§4.9 reducer integration — bake + consume + force play", () => {
  function startSeerMatch() {
    const enc = CHAPTER_MAP["ch_seer_visit"];
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
      expect(r.error).toBeUndefined();
      s = r.state;
    }
    return s;
  }

  it("Seer's first play bakes-and-consumes in the same tick when side 1 becomes active", () => {
    let s = startSeerMatch();
    // After mulligans we're on side 0's first turn. End it to hand
    // the turn to the Seer; the §4.9 hook should bake + consume +
    // force-play immediately.
    const r = reduce(
      s,
      { kind: "end_turn", actor: 0, seq: 0 } as Action,
      registry,
    );
    expect(r.error).toBeUndefined();
    s = r.state;
    expect(s.seerProphecy!.playsPerformed).toBe(1);
    // Pending cleared after consume.
    expect(s.seerProphecy!.pending).toBeNull();
  });

  it("accumulates playsPerformed across several Seer turns", () => {
    let s = startSeerMatch();
    // Drive a few full rounds (side 0 end_turn → side 1 end_turn).
    for (let i = 0; i < 3; i++) {
      s = reduce(
        s,
        { kind: "end_turn", actor: s.currentPlayer, seq: 0 } as Action,
        registry,
      ).state;
      if (s.phase === "ended") break;
      s = reduce(
        s,
        { kind: "end_turn", actor: s.currentPlayer, seq: 0 } as Action,
        registry,
      ).state;
      if (s.phase === "ended") break;
    }
    expect(s.seerProphecy!.playsPerformed).toBeGreaterThanOrEqual(2);
  });

  it("player-turn transitions bake a pending future for the Seer's next turn", () => {
    let s = startSeerMatch();
    // Side 0 first turn, end it → Seer plays → Seer ends their turn
    // → back to side 0. On that last refresh, a pending future
    // should be baked for the Seer's NEXT turn.
    s = reduce(
      s,
      { kind: "end_turn", actor: 0, seq: 0 } as Action,
      registry,
    ).state;
    s = reduce(
      s,
      { kind: "end_turn", actor: 1, seq: 0 } as Action,
      registry,
    ).state;
    // Side 0 now active. A pending future should have been baked.
    expect(s.currentPlayer).toBe(0);
    expect(s.seerProphecy!.pending).not.toBeNull();
    expect(s.seerProphecy!.pending!.turnIndex).toBe(s.turnNumber);
  });
});

describe("gen_seer card", () => {
  it("is registered in the card registry with the expected shape", () => {
    const def = registry.get("gen_seer");
    expect(def).toBeDefined();
    expect(def!.cardType).toBe("general");
    expect(def!.faction).toBe("neutral");
    expect(def!.abilities).toEqual([]);
    expect(def!.baseStats?.power).toBe(3);
    expect(def!.baseStats?.health).toBe(25);
  });
});

describe("burnt_card_placeholder", () => {
  it("is registered in the card registry (reserved schema slot)", () => {
    const def = registry.get(BURNT_CARD_PLACEHOLDER_ID);
    expect(def).toBeDefined();
    expect(def!.faction).toBe("neutral");
    expect(def!.cost).toBe(0);
    expect(def!.abilities).toEqual([]);
  });
});
