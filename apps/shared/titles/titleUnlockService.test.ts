/**
 * Unit tests for titleUnlockService — pure-function evaluator.
 * Mirrors apps/shared/tcg-core/rewards/expansionUnlockService.test.ts.
 */
import { describe, it, expect } from "vitest";
import {
  evaluateTitleUnlock,
  isTitleUnlocked,
  computeNewlyUnlocked,
  progressFraction,
  describeRootProgression,
  makeTitleProgressSnapshot,
} from "./titleUnlockService";
import { TITLE_DEFINITIONS, getTitleDef } from "./titleDefinitions";

describe("evaluateTitleUnlock", () => {
  describe("pvp_rank_reached", () => {
    it("returns false when player is below the gate", () => {
      const state = makeTitleProgressSnapshot({ rankTiers: [["card_1v1", 2]] });
      expect(evaluateTitleUnlock(
        { kind: "pvp_rank_reached", gameType: "card_1v1", minTier: 4 },
        state,
      )).toBe(false);
    });
    it("returns true when player is at or above the gate", () => {
      const state = makeTitleProgressSnapshot({ rankTiers: [["card_1v1", 4]] });
      expect(evaluateTitleUnlock(
        { kind: "pvp_rank_reached", gameType: "card_1v1", minTier: 4 },
        state,
      )).toBe(true);
    });
    it("returns false for an unrelated gameType", () => {
      const state = makeTitleProgressSnapshot({ rankTiers: [["chess", 6]] });
      expect(evaluateTitleUnlock(
        { kind: "pvp_rank_reached", gameType: "card_1v1", minTier: 4 },
        state,
      )).toBe(false);
    });
  });

  describe("pvp_wins_total", () => {
    it("uses gameType-specific wins when gameType set", () => {
      const state = makeTitleProgressSnapshot({
        winsByGameType: [["card_1v1", 50], ["chess", 5]],
        totalWins: 55,
      });
      expect(evaluateTitleUnlock(
        { kind: "pvp_wins_total", gameType: "card_1v1", count: 50 },
        state,
      )).toBe(true);
      expect(evaluateTitleUnlock(
        { kind: "pvp_wins_total", gameType: "chess", count: 50 },
        state,
      )).toBe(false);
    });
    it("uses totalWins when gameType is omitted", () => {
      const state = makeTitleProgressSnapshot({ totalWins: 100 });
      expect(evaluateTitleUnlock(
        { kind: "pvp_wins_total", count: 50 },
        state,
      )).toBe(true);
    });
  });

  describe("coop_role_mastery", () => {
    it("matches per-role mastery levels independently", () => {
      const state = makeTitleProgressSnapshot({
        coopRoleMastery: [["healer", 3], ["tank", 1]],
      });
      expect(evaluateTitleUnlock({ kind: "coop_role_mastery", role: "healer", level: 3 }, state)).toBe(true);
      expect(evaluateTitleUnlock({ kind: "coop_role_mastery", role: "tank", level: 3 }, state)).toBe(false);
      expect(evaluateTitleUnlock({ kind: "coop_role_mastery", role: "dps", level: 1 }, state)).toBe(false);
    });
  });

  describe("loredex_discovered", () => {
    it("returns true iff the entity is in the discovered set", () => {
      const state = makeTitleProgressSnapshot({ loredexDiscovered: ["entity_2"] });
      expect(evaluateTitleUnlock({ kind: "loredex_discovered", entityId: "entity_2" }, state)).toBe(true);
      expect(evaluateTitleUnlock({ kind: "loredex_discovered", entityId: "entity_99" }, state)).toBe(false);
    });
  });

  describe("act_completed / secret_revealed", () => {
    it("act_completed reads from completedActs", () => {
      const state = makeTitleProgressSnapshot({ completedActs: [3] });
      expect(evaluateTitleUnlock({ kind: "act_completed", act: 3 }, state)).toBe(true);
      expect(evaluateTitleUnlock({ kind: "act_completed", act: 4 }, state)).toBe(false);
    });
    it("secret_revealed reads from secretActsRevealed", () => {
      const state = makeTitleProgressSnapshot({ secretActsRevealed: [4] });
      expect(evaluateTitleUnlock({ kind: "secret_revealed", act: 4 }, state)).toBe(true);
      expect(evaluateTitleUnlock({ kind: "secret_revealed", act: 5 }, state)).toBe(false);
    });
  });

  describe("mystery_solve_first / mystery_solve_any", () => {
    it("wildcard '*' matches any solve", () => {
      const empty = makeTitleProgressSnapshot({});
      const has = makeTitleProgressSnapshot({ mysterySolved: ["foo"] });
      expect(evaluateTitleUnlock({ kind: "mystery_solve_any", boardKey: "*" }, empty)).toBe(false);
      expect(evaluateTitleUnlock({ kind: "mystery_solve_any", boardKey: "*" }, has)).toBe(true);
    });
    it("specific board key requires exact match", () => {
      const state = makeTitleProgressSnapshot({ mysterySolved: ["thought_virus"] });
      expect(evaluateTitleUnlock({ kind: "mystery_solve_any", boardKey: "thought_virus" }, state)).toBe(true);
      expect(evaluateTitleUnlock({ kind: "mystery_solve_any", boardKey: "project_celebration" }, state)).toBe(false);
    });
    it("first-discoverer set is independent from solved set", () => {
      const state = makeTitleProgressSnapshot({
        mysterySolved: ["thought_virus"],
        mysteryFirstSolved: [],
      });
      expect(evaluateTitleUnlock({ kind: "mystery_solve_any", boardKey: "thought_virus" }, state)).toBe(true);
      expect(evaluateTitleUnlock({ kind: "mystery_solve_first", boardKey: "thought_virus" }, state)).toBe(false);
    });
  });

  describe("cross_game_dual_rank", () => {
    it("requires at least 2 of N gameTypes at minTier", () => {
      const state = makeTitleProgressSnapshot({
        rankTiers: [["card_1v1", 4], ["chess", 4], ["td_raid", 1]],
      });
      expect(evaluateTitleUnlock({
        kind: "cross_game_dual_rank",
        minTier: 4,
        gameTypes: ["card_1v1", "chess", "td_raid"],
      }, state)).toBe(true);
    });
    it("returns false if only one qualifies", () => {
      const state = makeTitleProgressSnapshot({ rankTiers: [["card_1v1", 5]] });
      expect(evaluateTitleUnlock({
        kind: "cross_game_dual_rank",
        minTier: 4,
        gameTypes: ["card_1v1", "chess"],
      }, state)).toBe(false);
    });
  });

  describe("guild conditions", () => {
    it("guild_war_won fires on any win when no territoryKey set", () => {
      const state = makeTitleProgressSnapshot({ guildWarsWon: 1 });
      expect(evaluateTitleUnlock({ kind: "guild_war_won" }, state)).toBe(true);
    });
    it("guild_war_won with territoryKey requires that territory", () => {
      const state = makeTitleProgressSnapshot({
        guildWarsWon: 5,
        guildWarTerritoriesHeld: ["panopticon_core"],
      });
      expect(evaluateTitleUnlock({ kind: "guild_war_won", territoryKey: "panopticon_core" }, state)).toBe(true);
      expect(evaluateTitleUnlock({ kind: "guild_war_won", territoryKey: "iron_lion_citadel" }, state)).toBe(false);
    });
  });
});

describe("computeNewlyUnlocked", () => {
  it("returns titles that are eligible but not yet earned", () => {
    const state = makeTitleProgressSnapshot({
      rankTiers: [["card_1v1", 6], ["chess", 6]],
      winsByGameType: [["card_1v1", 500]],
      totalWins: 500,
    });
    const earned = new Set<string>(["warlord_t1"]);
    const newly = computeNewlyUnlocked(state, earned);
    const newlyKeys = newly.map((t) => t.titleKey);
    // Should grant warlord_t2 + warlord_t3 (rank), seer_t1/t2/t3 (wins)
    expect(newlyKeys).toContain("warlord_t2");
    expect(newlyKeys).toContain("warlord_t3");
    expect(newlyKeys).toContain("seer_t3");
    // Should NOT regrant warlord_t1
    expect(newlyKeys).not.toContain("warlord_t1");
  });

  it("returns empty array when nothing is newly eligible", () => {
    const state = makeTitleProgressSnapshot({});
    const earned = new Set<string>();
    const newly = computeNewlyUnlocked(state, earned);
    expect(newly).toEqual([]);
  });
});

describe("progressFraction", () => {
  it("returns 1 for satisfied gates", () => {
    const state = makeTitleProgressSnapshot({ totalWins: 100 });
    expect(progressFraction({ kind: "pvp_wins_total", count: 50 }, state)).toBe(1);
  });
  it("returns a fractional value for partial progress", () => {
    const state = makeTitleProgressSnapshot({ totalWins: 25 });
    expect(progressFraction({ kind: "pvp_wins_total", count: 100 }, state)).toBe(0.25);
  });
  it("clamps to [0, 1]", () => {
    const state = makeTitleProgressSnapshot({});
    expect(progressFraction({ kind: "pvp_wins_total", count: 100 }, state)).toBe(0);
  });
  it("returns 0 for boolean gates that are not yet met", () => {
    const state = makeTitleProgressSnapshot({});
    // Discovery gates have no continuous signal.
    expect(progressFraction({ kind: "loredex_discovered", entityId: "entity_1" }, state)).toBe(0);
  });
});

describe("describeRootProgression", () => {
  it("identifies the next tier and progress", () => {
    // Snapshot: tier-1 worth of card_1v1 wins, no rank.
    const state = makeTitleProgressSnapshot({
      winsByGameType: [["card_1v1", 5]],
      totalWins: 5,
      rankTiers: [["card_1v1", 1]],
    });
    const earned = new Set<string>(["warlord_t1"]);
    const desc = describeRootProgression("warlord", state, earned);
    expect(desc.rootKey).toBe("warlord");
    expect(desc.highestEarnedTier).toBe(1);
    expect(desc.nextTier?.titleKey).toBe("warlord_t2");
    // tier 4 needed; we have 1 → 0.25 progress
    expect(desc.nextTierProgress).toBeCloseTo(0.25);
  });

  it("returns nextTierProgress 1 when entire root is earned", () => {
    const state = makeTitleProgressSnapshot({});
    const earned = new Set<string>(["warlord_t1", "warlord_t2", "warlord_t3"]);
    const desc = describeRootProgression("warlord", state, earned);
    expect(desc.nextTier).toBeUndefined();
    expect(desc.nextTierProgress).toBe(1);
  });
});

describe("apprentice trial conditions", () => {
  it("apprentice_trial_attended fires at the threshold", () => {
    const state = makeTitleProgressSnapshot({ apprenticeTrialsAttended: 5 });
    expect(evaluateTitleUnlock({ kind: "apprentice_trial_attended", count: 5 }, state)).toBe(true);
    expect(evaluateTitleUnlock({ kind: "apprentice_trial_attended", count: 6 }, state)).toBe(false);
  });

  it("apprentice_trial_graduated requires graduation count, not attendance", () => {
    const attended = makeTitleProgressSnapshot({ apprenticeTrialsAttended: 10, apprenticeTrialsGraduated: 0 });
    expect(evaluateTitleUnlock({ kind: "apprentice_trial_graduated", count: 1 }, attended)).toBe(false);
    const graduated = makeTitleProgressSnapshot({ apprenticeTrialsGraduated: 3 });
    expect(evaluateTitleUnlock({ kind: "apprentice_trial_graduated", count: 3 }, graduated)).toBe(true);
  });

  it("celebrant_t1 lights up after one cohort attended", () => {
    const state = makeTitleProgressSnapshot({ apprenticeTrialsAttended: 1 });
    const def = getTitleDef("celebrant_t1")!;
    expect(isTitleUnlocked(def, state)).toBe(true);
  });

  it("celebrant_t3 (hidden) requires 3 graduations, not 3 attendances", () => {
    const def = getTitleDef("celebrant_t3")!;
    expect(def.hidden).toBe(true);
    const attended = makeTitleProgressSnapshot({ apprenticeTrialsAttended: 10, apprenticeTrialsGraduated: 2 });
    expect(isTitleUnlocked(def, attended)).toBe(false);
    const graduated = makeTitleProgressSnapshot({ apprenticeTrialsAttended: 3, apprenticeTrialsGraduated: 3 });
    expect(isTitleUnlocked(def, graduated)).toBe(true);
  });
});

describe("battle pass tier conditions (T9.17)", () => {
  it("battle_pass_tier_reached fires at threshold", () => {
    const state = makeTitleProgressSnapshot({ battlePassTier: 50 });
    expect(evaluateTitleUnlock({ kind: "battle_pass_tier_reached", minTier: 50 }, state)).toBe(true);
    expect(evaluateTitleUnlock({ kind: "battle_pass_tier_reached", minTier: 51 }, state)).toBe(false);
  });

  it("battlepass_t1 needs tier 10", () => {
    const def = getTitleDef("battlepass_t1")!;
    expect(isTitleUnlocked(def, makeTitleProgressSnapshot({ battlePassTier: 9 }))).toBe(false);
    expect(isTitleUnlocked(def, makeTitleProgressSnapshot({ battlePassTier: 10 }))).toBe(true);
  });

  it("battlepass_t3 needs tier 100", () => {
    const def = getTitleDef("battlepass_t3")!;
    expect(isTitleUnlocked(def, makeTitleProgressSnapshot({ battlePassTier: 99 }))).toBe(false);
    expect(isTitleUnlocked(def, makeTitleProgressSnapshot({ battlePassTier: 100 }))).toBe(true);
  });
});

describe("registry integrity", () => {
  it("every titleKey is unique", () => {
    const seen = new Set<string>();
    for (const t of TITLE_DEFINITIONS) {
      expect(seen.has(t.titleKey)).toBe(false);
      seen.add(t.titleKey);
    }
  });

  it("every getTitleDef lookup round-trips", () => {
    for (const t of TITLE_DEFINITIONS) {
      expect(getTitleDef(t.titleKey)).toBe(t);
    }
  });

  it("tiers within a root are unique and ascending", () => {
    const byRoot = new Map<string, number[]>();
    for (const t of TITLE_DEFINITIONS) {
      const list = byRoot.get(t.rootKey) ?? [];
      list.push(t.tier);
      byRoot.set(t.rootKey, list);
    }
    for (const [, tiers] of byRoot) {
      const sorted = [...tiers].sort((a, b) => a - b);
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i]).toBeGreaterThan(sorted[i - 1]);
      }
    }
  });

  it("isTitleUnlocked agrees with evaluateTitleUnlock", () => {
    const state = makeTitleProgressSnapshot({ totalWins: 1, rankTiers: [["card_1v1", 0]] });
    const def = getTitleDef("warlord_t1")!;
    expect(isTitleUnlocked(def, state)).toBe(evaluateTitleUnlock(def.condition, state));
  });
});
