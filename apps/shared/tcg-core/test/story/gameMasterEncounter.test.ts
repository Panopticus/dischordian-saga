/**
 * §5.7 Game Master encounter wiring tests.
 *
 * Parallel to programmerGiftEncounter / authorityTrialEncounter:
 * smoke-level checks that chapters.ts / encounter.ts / init.ts
 * plumbing propagates `witnessMode` from the encounter definition
 * into an initialized GameState's `publicWitness` field.
 */
import { describe, it, expect } from "vitest";
import {
  ALL_CARD_DEFINITIONS,
  buildCardRegistry,
} from "../../index";
import { CHAPTER_MAP } from "../../story/chapters";
import { initEncounter } from "../../story/encounter";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

describe("§5.7 chGameMaster wiring", () => {
  it("is registered in CHAPTER_MAP with witnessMode set", () => {
    const enc = CHAPTER_MAP["ch_game_master"];
    expect(enc).toBeDefined();
    expect(enc.bossGeneralDefId).toBe("gen_game_master_original");
    expect(enc.bossFaction).toBe("neutral");
    expect(enc.witnessMode).toEqual({});
  });

  it("preserves default general_killed win/lose — public record carries regardless", () => {
    const enc = CHAPTER_MAP["ch_game_master"];
    expect(enc.winConditions).toEqual([{ kind: "general_killed" }]);
    expect(enc.loseConditions).toEqual([{ kind: "general_killed" }]);
  });

  it("declares pre/win/loss dialog ids matching the dialog bank contract", () => {
    const enc = CHAPTER_MAP["ch_game_master"];
    expect(enc.preMatchDialog).toBe("dialog_game_master_pre");
    expect(enc.postMatchWinDialog).toBe("dialog_game_master_win");
    expect(enc.postMatchLossDialog).toBe("dialog_game_master_loss");
  });

  it("initEncounter populates GameState.publicWitness at balance 0 with no entries", () => {
    const enc = CHAPTER_MAP["ch_game_master"];
    const init = initEncounter({
      encounter: enc,
      playerFaction: "insurgency",
      playerGeneralDefId: "gen_insurgency",
      playerDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `p_${i}`),
      registry,
    });
    const s = init.gameState;
    expect(s.publicWitness).toBeDefined();
    expect(s.publicWitness!.balance).toBe(0);
    expect(s.publicWitness!.entries).toEqual([]);
  });

  it("non-witness encounters leave publicWitness undefined (no cross-contamination)", () => {
    // ch_authority_trial is the cleanest control.
    const enc = CHAPTER_MAP["ch_authority_trial"];
    const init = initEncounter({
      encounter: enc,
      playerFaction: "insurgency",
      playerGeneralDefId: "gen_insurgency",
      playerDeckCardDefIds: Array.from({ length: 39 }, (_, i) => `p_${i}`),
      registry,
    });
    expect(init.gameState.publicWitness).toBeUndefined();
    expect(init.gameState.trial).toBeDefined();
  });
});

describe("gen_game_master_original card", () => {
  it("is registered in the card registry with the expected shape", () => {
    const def = registry.get("gen_game_master_original");
    expect(def).toBeDefined();
    expect(def!.cardType).toBe("general");
    expect(def!.faction).toBe("neutral");
    expect(def!.abilities).toEqual([]);
    expect(def!.baseStats?.power).toBe(4);
    expect(def!.baseStats?.health).toBe(24);
  });
});
