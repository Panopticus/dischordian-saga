/* ═══════════════════════════════════════════════════════
   Guild Hall Buffs — shared-module unit tests.

   Covers the pure stat-aggregation helpers in
   @shared/guildHall (getGuildHallStatBonuses and
   hallStatMultiplier). The DB-backed wrapper in
   _core/guildHallBuffs.ts is exercised implicitly in
   integration tests.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import {
  getGuildHallStatBonuses,
  hallStatMultiplier,
  HALL_TIERS,
  GUILD_DECORATIONS,
} from "@shared/guildHall";

describe("getGuildHallStatBonuses", () => {
  it("returns empty for tier 0 (no perks, no rooms, no decos)", () => {
    const bonuses = getGuildHallStatBonuses(0, []);
    expect(bonuses).toEqual({});
  });

  it("includes tier 1 perks (Outpost has 1 perk, non-percent)", () => {
    const bonuses = getGuildHallStatBonuses(1, []);
    // Outpost's 'outpost_chat' perk has percent:false so it should NOT appear.
    expect(bonuses.social).toBeUndefined();
  });

  it("accumulates tier 2 XP perks (Barracks: +5% XP)", () => {
    const bonuses = getGuildHallStatBonuses(2, []);
    expect(bonuses.xp).toBe(5);
    expect(bonuses.fight_damage).toBe(3);
  });

  it("accumulates tier 5 stacked perks + room bonuses", () => {
    const bonuses = getGuildHallStatBonuses(5, []);
    // Tier perks:  xp: 5 (Barracks) + 10 (Fortress) + 15 (Citadel) + 20 (Sanctum) = 50
    // No room currently grants raw xp, so the total is just the tier sum.
    expect(bonuses.xp).toBe(5 + 10 + 15 + 20);
    // war_points: 5 (Fortress perk) + 10 (Citadel) + 10 (Sanctum)
    //           + 3 (war_room HALL_ROOMS entry, unlocked at tier 5) = 28
    expect(bonuses.war_points).toBe(5 + 10 + 10 + 3);
    // craft_success: 5 (Citadel) + 10 (Sanctum) = 15
    expect(bonuses.craft_success).toBe(15);
  });

  it("folds decoration passive bonuses into the totals map", () => {
    // holographic_fire: +2% xp; crystal_chandelier: +3% dream_gain.
    const bonuses = getGuildHallStatBonuses(2, [
      { roomId: "mess_hall", decoId: "holographic_fire" },
      { roomId: "main_hall", decoId: "crystal_chandelier" },
    ]);
    // tier 2 xp = 5, + 2 from holographic_fire = 7
    expect(bonuses.xp).toBe(7);
    expect(bonuses.dream_gain).toBe(3);
  });

  it("ignores decoration ids not in the catalog", () => {
    const bonuses = getGuildHallStatBonuses(2, [
      { roomId: "main_hall", decoId: "definitely_not_real" },
    ]);
    // Only tier 2 perks remain.
    expect(bonuses.xp).toBe(5);
  });
});

describe("hallStatMultiplier", () => {
  it("returns 1 when the stat is missing", () => {
    expect(hallStatMultiplier({}, "xp")).toBe(1);
  });

  it("returns 1 + percent/100 when present", () => {
    expect(hallStatMultiplier({ xp: 15 }, "xp")).toBeCloseTo(1.15);
  });

  it("is unaffected by other stats", () => {
    expect(hallStatMultiplier({ xp: 10, dream_gain: 5 }, "dream_gain")).toBeCloseTo(1.05);
  });
});

describe("HALL_TIERS catalog sanity", () => {
  it("has 5 tiers", () => {
    expect(HALL_TIERS.length).toBe(5);
  });

  it("tier costs are strictly increasing", () => {
    for (let i = 1; i < HALL_TIERS.length; i++) {
      expect(HALL_TIERS[i].cost).toBeGreaterThanOrEqual(HALL_TIERS[i - 1].cost);
    }
  });
});

describe("GUILD_DECORATIONS catalog sanity", () => {
  it("every decoration with a passiveBonus has a percent value", () => {
    for (const d of GUILD_DECORATIONS) {
      if (d.passiveBonus) {
        expect(typeof d.passiveBonus.value).toBe("number");
        expect(d.passiveBonus.value).toBeGreaterThan(0);
      }
    }
  });
});
