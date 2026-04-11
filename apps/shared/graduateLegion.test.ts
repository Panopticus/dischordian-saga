import { describe, it, expect } from "vitest";
import {
  computeRoleBonus,
  computeSacrificeReward,
  computeGiftTrustBoost,
  canAssign,
  getAssignmentsByRole,
  getSlotUsage,
  SLOT_LIMITS,
  EMPTY_ROSTER,
  type LegionRoster,
} from "./graduateLegion";
import { generateApprentice } from "./apprentices";

describe("graduateLegion", () => {
  describe("computeRoleBonus", () => {
    const app = generateApprentice({ forceRarity: "rare", forceArchetype: "zealot" });

    it("army_leader returns army damage + morale bonuses + squad ability", () => {
      const bonuses = computeRoleBonus(app, "army_leader");
      const targets = bonuses.map(b => b.target);
      expect(targets).toContain("army_damage");
      expect(targets).toContain("army_morale");
      expect(targets).toContain("squad_ability");
    });

    it("trade_envoy returns trade profit + faction rep", () => {
      const bonuses = computeRoleBonus(app, "trade_envoy");
      const targets = bonuses.map(b => b.target);
      expect(targets).toContain("trade_profit");
      expect(targets).toContain("faction_rep_gain");
    });

    it("tower_captain returns fire rate + build cost + tower special", () => {
      const bonuses = computeRoleBonus(app, "tower_captain");
      const targets = bonuses.map(b => b.target);
      expect(targets).toContain("tower_fire_rate");
      expect(targets).toContain("tower_build_cost");
      expect(targets).toContain("tower_special");
    });

    it("cryo_vault returns no bonuses", () => {
      expect(computeRoleBonus(app, "cryo_vault")).toEqual([]);
    });

    it("companion returns no bonuses from this function (bond-driven elsewhere)", () => {
      expect(computeRoleBonus(app, "companion")).toEqual([]);
    });

    it("mythic rarity produces larger bonuses than common", () => {
      const common = generateApprentice({ forceRarity: "common", forceArchetype: "zealot" });
      const mythic = generateApprentice({ forceRarity: "mythic", forceArchetype: "zealot" });
      // Force same stats for apples-to-apples
      mythic.stats = { ...common.stats };
      const cBonus = computeRoleBonus(common, "trade_envoy").find(b => b.target === "trade_profit");
      const mBonus = computeRoleBonus(mythic, "trade_envoy").find(b => b.target === "trade_profit");
      expect(mBonus!.value).toBeGreaterThan(cBonus!.value);
    });
  });

  describe("computeSacrificeReward", () => {
    const baseApp = { ...generateApprentice(), rarity: "common" as const };

    it("reward scales with rarity", () => {
      const ranks = ["common", "uncommon", "rare", "epic", "mythic"] as const;
      let prevCorruption = -1;
      for (const r of ranks) {
        const reward = computeSacrificeReward({ ...baseApp, rarity: r });
        expect(reward.corruptionGain).toBeGreaterThan(prevCorruption);
        prevCorruption = reward.corruptionGain;
      }
    });

    it("mythic sacrifice unlocks narrative flag", () => {
      const reward = computeSacrificeReward({ ...baseApp, rarity: "mythic" });
      expect(reward.narrativeFlag).toBe("sacrificed_mythic_apprentice");
    });

    it("common sacrifice has no narrative flag", () => {
      const reward = computeSacrificeReward({ ...baseApp, rarity: "common" });
      expect(reward.narrativeFlag).toBeUndefined();
    });
  });

  describe("computeGiftTrustBoost", () => {
    const baseApp = { ...generateApprentice(), rarity: "common" as const, bond: 0 };

    it("boost scales with rarity", () => {
      expect(computeGiftTrustBoost({ ...baseApp, rarity: "common" })).toBeLessThan(
        computeGiftTrustBoost({ ...baseApp, rarity: "mythic" }),
      );
    });

    it("higher bond adds 10% of bond to boost", () => {
      const noBond = computeGiftTrustBoost({ ...baseApp, bond: 0 });
      const fullBond = computeGiftTrustBoost({ ...baseApp, bond: 100 });
      expect(fullBond - noBond).toBe(10);
    });
  });

  describe("slot logic", () => {
    it("SLOT_LIMITS has expected caps", () => {
      expect(SLOT_LIMITS.companion).toBe(1);
      expect(SLOT_LIMITS.cryo_vault).toBe(2);
      expect(SLOT_LIMITS.army_leader).toBe(3);
      expect(SLOT_LIMITS.trade_envoy).toBe(2);
      expect(SLOT_LIMITS.tower_captain).toBe(1);
    });

    it("canAssign returns true when slots available", () => {
      const roster: LegionRoster = { ...EMPTY_ROSTER };
      expect(canAssign(roster, "companion")).toBe(true);
      expect(canAssign(roster, "cryo_vault")).toBe(true);
      expect(canAssign(roster, "army_leader")).toBe(true);
    });

    it("canAssign returns false when slots full", () => {
      const roster: LegionRoster = {
        ...EMPTY_ROSTER,
        assignments: [
          { apprenticeId: "a", role: "companion", assignedAt: 0 },
        ],
      };
      expect(canAssign(roster, "companion")).toBe(false);
    });

    it("sacrificed + relationship_gift have no slot limit", () => {
      const roster: LegionRoster = {
        ...EMPTY_ROSTER,
        assignments: Array.from({ length: 20 }, (_, i) => ({
          apprenticeId: `a${i}`, role: "sacrificed" as const, assignedAt: 0,
        })),
      };
      expect(canAssign(roster, "sacrificed")).toBe(true);
      expect(canAssign(roster, "relationship_gift")).toBe(true);
    });

    it("getSlotUsage returns used/max per role", () => {
      const roster: LegionRoster = {
        ...EMPTY_ROSTER,
        assignments: [
          { apprenticeId: "a", role: "army_leader", assignedAt: 0 },
          { apprenticeId: "b", role: "army_leader", assignedAt: 0 },
        ],
      };
      const usage = getSlotUsage(roster, "army_leader");
      expect(usage.used).toBe(2);
      expect(usage.max).toBe(3);
    });
  });
});
