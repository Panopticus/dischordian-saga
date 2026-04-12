import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════
   TASK 1.3: PRESTIGE SYSTEM ENDPOINT — doPrestige + XP wiring
   ═══════════════════════════════════════════════════════ */

/* ─── SHARED LIBRARY — pure function verification ─── */
import {
  canPrestige,
  getPrestigeLevel,
  getPrestigeMultipliers,
  getPrestigeStars,
  getPrestigeTitle,
  calculatePrestigeCost,
  PRESTIGE_LEVELS,
  DEFAULT_PRESTIGE_STATE,
} from "../shared/prestigeSystem";

describe("Prestige shared library", () => {
  it("defines exactly 7 prestige levels", () => {
    expect(PRESTIGE_LEVELS.length).toBe(7);
  });

  it("each level has monotonically increasing xpMultiplier", () => {
    for (let i = 1; i < PRESTIGE_LEVELS.length; i++) {
      expect(PRESTIGE_LEVELS[i].xpMultiplier).toBeGreaterThan(PRESTIGE_LEVELS[i - 1].xpMultiplier);
    }
  });

  it("top tier reaches 2.5x XP", () => {
    const top = PRESTIGE_LEVELS[PRESTIGE_LEVELS.length - 1];
    expect(top.xpMultiplier).toBeCloseTo(2.5, 2);
    expect(top.level).toBe(7);
  });

  describe("canPrestige gating", () => {
    it("rejects players below level 25", () => {
      expect(canPrestige(24, 0)).toBe(false);
    });

    it("allows level 25 non-prestiged players", () => {
      expect(canPrestige(25, 0)).toBe(true);
    });

    it("allows level 25 players who are partway through prestige tiers", () => {
      expect(canPrestige(25, 3)).toBe(true);
    });

    it("rejects players already at max prestige tier (7)", () => {
      expect(canPrestige(25, 7)).toBe(false);
    });

    it("rejects players above max tier (safety)", () => {
      expect(canPrestige(25, 99)).toBe(false);
    });
  });

  describe("getPrestigeMultipliers", () => {
    it("returns unit multipliers for tier 0", () => {
      const m = getPrestigeMultipliers(0);
      expect(m.xp).toBe(1);
      expect(m.resource).toBe(1);
      expect(m.trust).toBe(1);
    });

    it("returns tier 1 values (10% XP boost)", () => {
      const m = getPrestigeMultipliers(1);
      expect(m.xp).toBeCloseTo(1.10, 2);
    });

    it("returns tier 7 values (2.5x XP)", () => {
      const m = getPrestigeMultipliers(7);
      expect(m.xp).toBeCloseTo(2.50, 2);
      expect(m.resource).toBeCloseTo(1.50, 2);
    });

    it("returns unit multipliers for out-of-range tier", () => {
      const m = getPrestigeMultipliers(99);
      expect(m.xp).toBe(1);
    });
  });

  describe("getPrestigeStars", () => {
    it("returns empty string for tier 0", () => {
      expect(getPrestigeStars(0)).toBe("");
    });

    it("returns N stars for tier N", () => {
      expect(getPrestigeStars(3)).toBe("★★★");
      expect(getPrestigeStars(7)).toBe("★★★★★★★");
    });

    it("clamps at 7 stars for out-of-range tier", () => {
      expect(getPrestigeStars(10).length).toBe(7);
    });
  });

  describe("getPrestigeTitle", () => {
    it("returns base title for tier 0", () => {
      expect(getPrestigeTitle(0, "Operative")).toBe("Operative");
    });

    it("prepends prestige prefix + appends stars for tier > 0", () => {
      const title = getPrestigeTitle(1, "Operative");
      expect(title).toContain("Reborn");
      expect(title).toContain("★");
    });

    it("uses 'Transcendent' for tier 7", () => {
      const title = getPrestigeTitle(7, "Operative");
      expect(title).toContain("Transcendent");
    });
  });

  describe("calculatePrestigeCost", () => {
    it("lists level reset as part of the cost", () => {
      const cost = calculatePrestigeCost(1);
      expect(cost.resets.some(r => r.toLowerCase().includes("level"))).toBe(true);
    });

    it("lists trust as preserved", () => {
      const cost = calculatePrestigeCost(1);
      expect(cost.preserves.some(p => p.toLowerCase().includes("trust"))).toBe(true);
    });

    it("lists cards as preserved", () => {
      const cost = calculatePrestigeCost(1);
      expect(cost.preserves.some(p => p.toLowerCase().includes("card"))).toBe(true);
    });
  });

  it("DEFAULT_PRESTIGE_STATE starts fresh", () => {
    expect(DEFAULT_PRESTIGE_STATE.currentPrestige).toBe(0);
    expect(DEFAULT_PRESTIGE_STATE.totalPrestiges).toBe(0);
    expect(DEFAULT_PRESTIGE_STATE.prestigeHistory).toEqual([]);
  });

  it("getPrestigeLevel returns undefined for tier 0", () => {
    expect(getPrestigeLevel(0)).toBeUndefined();
  });

  it("getPrestigeLevel returns level definition for tier 1-7", () => {
    for (let tier = 1; tier <= 7; tier++) {
      const level = getPrestigeLevel(tier);
      expect(level).toBeDefined();
      expect(level?.level).toBe(tier);
      expect(level?.stars).toBe(tier);
    }
  });
});

/* ─── ROUTER STRUCTURE — doPrestige surface area ─── */
describe("Prestige Router (doPrestige endpoint)", () => {
  const routerSrc = fs.readFileSync(
    path.resolve(__dirname, "routers/prestige.ts"),
    "utf-8"
  );

  describe("Router exports", () => {
    it("exports prestigeRouter", () => {
      expect(routerSrc).toContain("export const prestigeRouter");
    });
  });

  describe("Router procedures", () => {
    it("has getState query for UI", () => {
      expect(routerSrc).toMatch(/getState:\s*protectedProcedure\.query/);
    });

    it("has canPrestige query for button gating", () => {
      expect(routerSrc).toMatch(/canPrestige:\s*protectedProcedure\.query/);
    });

    it("has execute mutation (the actual doPrestige)", () => {
      expect(routerSrc).toMatch(/execute:\s*protectedProcedure/);
    });
  });

  describe("execute mutation behavior", () => {
    it("verifies eligibility via canPrestige before resetting", () => {
      expect(routerSrc).toMatch(/canPrestige\(citizen\.level,\s*currentTier\)/);
    });

    it("throws if max prestige tier reached", () => {
      expect(routerSrc).toContain("Max prestige tier reached");
    });

    it("resets citizen level to 1", () => {
      expect(routerSrc).toMatch(/update\(citizenCharacters\)[\s\S]{0,400}level:\s*1/);
    });

    it("resets citizen xp to 0", () => {
      expect(routerSrc).toMatch(/update\(citizenCharacters\)[\s\S]{0,400}xp:\s*0/);
    });

    it("resets room unlocks except cryo_bay", () => {
      expect(routerSrc).toContain("userArkProgress");
      expect(routerSrc).toContain("cryo_bay");
    });

    it("resets daily quest progress", () => {
      expect(routerSrc).toMatch(/delete\(dailyQuests\)/);
    });

    it("preserves 10% of Dream currency", () => {
      expect(routerSrc).toMatch(/currentDream\s*\*\s*0\.10/);
    });

    it("updates characterSheets.prestigeTier", () => {
      expect(routerSrc).toMatch(/update\(characterSheets\)[\s\S]{0,400}prestigeTier:\s*newTier/);
    });

    it("persists prestigeState for history", () => {
      expect(routerSrc).toContain("prestigeState: newState");
    });

    it("emits prestige_reset ripple event", () => {
      expect(routerSrc).toMatch(/ripple\.emit\("prestige_reset"/);
    });

    it("sends prestige_complete notification", () => {
      expect(routerSrc).toContain("prestige_complete");
    });

    it("returns new tier and multipliers", () => {
      expect(routerSrc).toMatch(/newTier[\s\S]{0,400}multipliers/);
    });
  });

  describe("Preserved tables (not touched during reset)", () => {
    it("does NOT update or delete companionRelationships", () => {
      expect(routerSrc).not.toMatch(/delete\(companionRelationships\)/);
      expect(routerSrc).not.toMatch(/update\(companionRelationships\)/);
    });

    it("does NOT update or delete eidolonBonds", () => {
      expect(routerSrc).not.toMatch(/delete\(eidolonBonds\)/);
      expect(routerSrc).not.toMatch(/update\(eidolonBonds\)/);
    });

    it("does NOT update or delete characterSheets.moralityScore", () => {
      expect(routerSrc).not.toMatch(/moralityScore:\s*0/);
    });

    it("does NOT update or delete userAchievements", () => {
      expect(routerSrc).not.toMatch(/delete\(userAchievements\)/);
    });
  });
});

/* ─── PRESTIGE MULTIPLIER HELPER ─── */
describe("prestigeMultiplier service", () => {
  const svcSrc = fs.readFileSync(
    path.resolve(__dirname, "services/prestigeMultiplier.ts"),
    "utf-8"
  );

  it("exports getPrestigeMultiplier (xp only)", () => {
    expect(svcSrc).toContain("export async function getPrestigeMultiplier");
  });

  it("exports getAllPrestigeMultipliers (xp/resource/trust)", () => {
    expect(svcSrc).toContain("export async function getAllPrestigeMultipliers");
  });

  it("exports applyPrestigeBonuses one-shot helper", () => {
    expect(svcSrc).toContain("export async function applyPrestigeBonuses");
  });

  it("returns 1.0 for tier 0 players (no overhead)", () => {
    expect(svcSrc).toMatch(/prestigeTier === 0\s*\)\s*return\s+1\.0/);
  });

  it("applyPrestigeBonuses returns tier, multipliers, and scaled amounts", () => {
    expect(svcSrc).toMatch(/multipliers:\s*\{/);
    expect(svcSrc).toMatch(/tier:/);
  });

  it("applyPrestigeBonuses uses Math.round to keep currencies integer", () => {
    expect(svcSrc).toContain("Math.round((rewards.xp");
    expect(svcSrc).toContain("Math.round((rewards.resource");
    expect(svcSrc).toContain("Math.round((rewards.trust");
  });

  it("applyPrestigeBonuses short-circuits when DB is unavailable", () => {
    expect(svcSrc).toMatch(/if \(!db\)[\s\S]{0,200}return\s*\{/);
  });
});

/* ─── DAILY QUESTS — prestige wiring verification ─── */
describe("dailyQuests.claimReward prestige wiring", () => {
  const routerSrc = fs.readFileSync(
    path.resolve(__dirname, "routers/dailyQuests.ts"),
    "utf-8"
  );

  it("imports applyPrestigeBonuses", () => {
    expect(routerSrc).toContain('import { applyPrestigeBonuses } from "../services/prestigeMultiplier"');
  });

  it("calls applyPrestigeBonuses during claimReward", () => {
    expect(routerSrc).toMatch(/applyPrestigeBonuses\(ctx\.user\.id/);
  });

  it("uses the prestige-adjusted xp value for the reward payload", () => {
    expect(routerSrc).toContain("prestige.xp");
  });

  it("uses the prestige-adjusted resource value for Dream", () => {
    expect(routerSrc).toContain("prestige.resource");
  });

  it("scales credits with the prestige resource multiplier", () => {
    expect(routerSrc).toContain("prestige.multipliers.resource");
  });

  it("returns prestigeBonus info so clients can render a toast", () => {
    expect(routerSrc).toContain("prestigeBonus");
    expect(routerSrc).toMatch(/tier:\s*prestige\.tier/);
  });
});

/* ─── PET BATTLES — prestige wiring verification ─── */
describe("petBattles submit prestige wiring", () => {
  const routerSrc = fs.readFileSync(
    path.resolve(__dirname, "routers/petBattles.ts"),
    "utf-8"
  );

  it("imports applyPrestigeBonuses", () => {
    expect(routerSrc).toContain('import { applyPrestigeBonuses } from "../services/prestigeMultiplier"');
  });

  it("calls applyPrestigeBonuses on the companion-boosted XP", () => {
    expect(routerSrc).toMatch(/applyPrestigeBonuses\(ctx\.user\.id,\s*\{\s*xp:\s*preMultXp\s*\}\)/);
  });

  it("persists the prestige-scaled XP to userProgress", () => {
    expect(routerSrc).toMatch(/const totalXp = prestige\.xp/);
  });

  it("returns prestigeBonus info with the battle result", () => {
    expect(routerSrc).toContain("prestigeBonus");
  });
});

/* ─── CROSS-CHECK WITH EXISTING CONSUMERS ─── */
describe("Existing prestige multiplier consumers remain intact", () => {
  it("classMasteryHelper still calls getPrestigeMultiplier", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "classMasteryHelper.ts"),
      "utf-8"
    );
    expect(src).toContain("getPrestigeMultiplier");
  });

  it("civilSkillHelper still calls getPrestigeMultiplier", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "civilSkillHelper.ts"),
      "utf-8"
    );
    expect(src).toContain("getPrestigeMultiplier");
  });

  it("battlePassXp service still calls getPrestigeMultiplier", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "services/battlePassXp.ts"),
      "utf-8"
    );
    expect(src).toContain("getPrestigeMultiplier");
  });
});
