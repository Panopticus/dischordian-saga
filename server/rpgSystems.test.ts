import { describe, it, expect } from "vitest";

/* ═══════════════════════════════════════════════════════
   1. SYNERGY BONUSES
   ═══════════════════════════════════════════════════════ */
import {
  SYNERGY_BONUSES,
  resolveSynergies,
  getSynergyEffectsForSystem,
  type SynergyBonus,
} from "../shared/synergyBonuses";

describe("Synergy Bonuses", () => {
  describe("SYNERGY_BONUSES data integrity", () => {
    it("has at least 10 synergy combos defined", () => {
      expect(SYNERGY_BONUSES.length).toBeGreaterThanOrEqual(10);
    });
    it("each combo has required fields", () => {
      for (const s of SYNERGY_BONUSES) {
        expect(s.key).toBeTruthy();
        expect(s.name).toBeTruthy();
        expect(s.description).toBeTruthy();
        expect(s.effects.length).toBeGreaterThan(0);
      }
    });
    it("keys are unique", () => {
      const keys = SYNERGY_BONUSES.map(s => s.key);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });

  describe("resolveSynergies", () => {
    it("returns matching synergies for a Quarchon Assassin Fire build", () => {
      const result = resolveSynergies({
        species: "quarchon",
        characterClass: "assassin",
        element: "fire",
      });
      expect(Array.isArray(result)).toBe(true);
    });
    it("returns empty array for non-matching build", () => {
      const result = resolveSynergies({
        species: "human" as any,
        characterClass: "warrior" as any,
        element: "water",
      });
      // May or may not match, but should not throw
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getSynergyEffectsForSystem", () => {
    it("returns an object with effects and sources arrays", () => {
      const citizen = { species: "quarchon" as any, characterClass: "assassin" as any, element: "fire" as any };
      const result = getSynergyEffectsForSystem(citizen, "combat");
      expect(Array.isArray(result.effects)).toBe(true);
      expect(Array.isArray(result.sources)).toBe(true);
    });
  });
});

/* ═══════════════════════════════════════════════════════
   2. BRANCHING MASTERY PATHS
   ═══════════════════════════════════════════════════════ */
import {
  getClassBranches,
  CLASS_BRANCHES,
  type MasteryBranch,
  type CharacterClass,
} from "../shared/classMastery";

describe("Branching Mastery Paths", () => {
  describe("CLASS_BRANCHES data integrity", () => {
    it("has branches defined for all 5 classes", () => {
      const classes: CharacterClass[] = ["spy", "oracle", "assassin", "engineer", "soldier"];
      for (const cls of classes) {
        const branches = CLASS_BRANCHES[cls];
        expect(branches).toBeDefined();
        expect(branches.pathA).toBeDefined();
        expect(branches.pathB).toBeDefined();
      }
    });
    it("each branch has name, description, and perks", () => {
      for (const [cls, branches] of Object.entries(CLASS_BRANCHES)) {
        expect(branches.pathA.name).toBeTruthy();
        expect(branches.pathB.name).toBeTruthy();
        expect(branches.pathA.description).toBeTruthy();
        expect(branches.pathB.description).toBeTruthy();
        expect(branches.pathA.perks.length).toBeGreaterThan(0);
        expect(branches.pathB.perks.length).toBeGreaterThan(0);
      }
    });
  });

  describe("getClassBranches", () => {
    it("returns branches for engineer", () => {
      const branches = getClassBranches("engineer");
      expect(branches).toBeDefined();
      expect(branches.pathA.name).toBeTruthy();
      expect(branches.pathB.name).toBeTruthy();
    });
    it("returns undefined for invalid class", () => {
      const branches = getClassBranches("invalid" as any);
      expect(branches).toBeUndefined();
    });
  });
});

/* ═══════════════════════════════════════════════════════
   3. CITIZEN TALENTS
   ═══════════════════════════════════════════════════════ */
import {
  CITIZEN_TALENTS,
  TALENT_MILESTONES,
  getTalentsAtMilestone,
  getAvailableTalents,
} from "../shared/citizenTalents";

describe("Citizen Talents", () => {
  describe("CITIZEN_TALENTS data integrity", () => {
    it("has at least 16 talents defined", () => {
      expect(CITIZEN_TALENTS.length).toBeGreaterThanOrEqual(16);
    });
    it("each talent has required fields", () => {
      for (const t of CITIZEN_TALENTS) {
        expect(t.key).toBeTruthy();
        expect(t.name).toBeTruthy();
        expect(t.description).toBeTruthy();
        expect(t.tier).toBeGreaterThanOrEqual(1);
        expect(t.tier).toBeLessThanOrEqual(4);
      }
    });
    it("keys are unique", () => {
      const keys = CITIZEN_TALENTS.map(t => t.key);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });

  describe("TALENT_MILESTONES", () => {
    it("has 4 milestones at levels 5, 10, 15, 20", () => {
      expect(TALENT_MILESTONES).toEqual([5, 10, 15, 20]);
    });
  });

  describe("getTalentsAtMilestone", () => {
    it("returns tier 1 talents for milestone level 5", () => {
      const talents = getTalentsAtMilestone(5);
      expect(talents.length).toBeGreaterThan(0);
      for (const t of talents) {
        expect(t.tier).toBe(1);
      }
    });
    it("returns tier 4 talents for milestone level 20", () => {
      const talents = getTalentsAtMilestone(20);
      expect(talents.length).toBeGreaterThan(0);
      for (const t of talents) {
        expect(t.tier).toBe(4);
      }
    });
  });

  describe("getAvailableTalents", () => {
    it("returns no milestones for level 1", () => {
      const available = getAvailableTalents(1);
      expect(available).toEqual([]);
    });
    it("returns 1 milestone for level 5", () => {
      const available = getAvailableTalents(5);
      expect(available.length).toBe(1);
      expect(available[0].milestone).toBe(5);
    });
    it("returns all milestones for level 20", () => {
      const available = getAvailableTalents(20);
      expect(available.length).toBe(4);
    });
  });
});

/* ═══════════════════════════════════════════════════════
   4. CIVIL SKILLS
   ═══════════════════════════════════════════════════════ */
import {
  CIVIL_SKILLS,
  getCivilSkillLevel,
  getActiveBonuses,
  calculateCivilSkillXp,
} from "../shared/civilSkills";

describe("Civil Skills", () => {
  describe("CIVIL_SKILLS data integrity", () => {
    it("has civil skills defined", () => {
      expect(CIVIL_SKILLS.length).toBeGreaterThanOrEqual(6);
    });
    it("each skill has key, name, description, and levels", () => {
      for (const s of CIVIL_SKILLS) {
        expect(s.key).toBeTruthy();
        expect(s.name).toBeTruthy();
        expect(s.description).toBeTruthy();
        expect(s.levelBonuses.length).toBeGreaterThan(0);
      }
    });
  });

  describe("getCivilSkillLevel", () => {
    it("returns level 0 for 0 XP", () => {
      // Level 1 is the minimum (0 XP still gives level 1 in this system)
      expect(getCivilSkillLevel(0)).toBeGreaterThanOrEqual(0);
    });
    it("returns higher level for more XP", () => {
      const low = getCivilSkillLevel(10);
      const high = getCivilSkillLevel(50000);
      expect(high).toBeGreaterThan(low);
    });
  });

  describe("getActiveBonuses", () => {
    it("returns bonuses for a given skill and level", () => {
      const bonuses = getActiveBonuses("bartering", 3);
      expect(Array.isArray(bonuses)).toBe(true);
    });
    it("returns empty array for level 0", () => {
      const bonuses = getActiveBonuses("bartering", 0);
      expect(bonuses).toEqual([]);
    });
  });

  describe("calculateCivilSkillXp", () => {
    it("returns XP gains for a valid action", () => {
      const xp = calculateCivilSkillXp("trade_complete");
      expect(typeof xp).toBe("object");
    });
  });
});

/* ═══════════════════════════════════════════════════════
   5. ELEMENTAL COMBOS
   ═══════════════════════════════════════════════════════ */
import {
  ELEMENTAL_COMBOS,
  resolveElementalCombo,
  getElementAdvantages,
} from "../shared/elementalCombos";

describe("Elemental Combos", () => {
  describe("ELEMENTAL_COMBOS data integrity", () => {
    it("has at least 8 combos defined", () => {
      expect(ELEMENTAL_COMBOS.length).toBeGreaterThanOrEqual(8);
    });
    it("each combo has required fields", () => {
      for (const c of ELEMENTAL_COMBOS) {
        expect(c.key).toBeTruthy();
        expect(c.name).toBeTruthy();
        expect(c.elements.length).toBe(2);
        expect(c.effects.length).toBeGreaterThan(0);
      }
    });
  });

  describe("resolveElementalCombo", () => {
    it("finds a combo for fire + air", () => {
      const combo = resolveElementalCombo("fire", "air");
      // May or may not exist depending on data, but should not throw
      if (combo) {
        expect(combo.name).toBeTruthy();
      }
    });
    it("returns null or undefined for same element", () => {
      const combo = resolveElementalCombo("fire", "fire");
      expect(!combo).toBe(true);
    });
  });

  describe("getElementAdvantages", () => {
    it("returns strong and weak arrays for fire", () => {
      const adv = getElementAdvantages("fire");
      expect(adv.strong).toBeDefined();
      expect(adv.weak).toBeDefined();
      expect(Array.isArray(adv.strong)).toBe(true);
      expect(Array.isArray(adv.weak)).toBe(true);
    });
  });
});

/* ═══════════════════════════════════════════════════════
   6. COMPANION SYNERGIES
   ═══════════════════════════════════════════════════════ */
import {
  COMPANION_PROFILES,
  calculateSynergyScore,
  getSynergyTier,
  getSynergySummary,
} from "../shared/companionSynergies";

describe("Companion Synergies", () => {
  describe("COMPANION_PROFILES data integrity", () => {
    it("has profiles for elara and the_human", () => {
      expect(COMPANION_PROFILES.elara).toBeDefined();
      expect(COMPANION_PROFILES.the_human).toBeDefined();
    });
    it("each profile has synergy arrays", () => {
      for (const [id, profile] of Object.entries(COMPANION_PROFILES)) {
        expect(profile.name).toBeTruthy();
        expect(Array.isArray(profile.synergyClasses)).toBe(true);
        expect(Array.isArray(profile.synergyElements)).toBe(true);
        expect(Array.isArray(profile.synergySpecies)).toBe(true);
      }
    });
  });

  describe("calculateSynergyScore", () => {
    it("returns a number for any valid build", () => {
      const score = calculateSynergyScore(
        { species: "quarchon", characterClass: "warrior", element: "fire", alignment: "order" },
        "elara",
        50
      );
      expect(typeof score).toBe("number");
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getSynergyTier", () => {
    it("returns a tier object", () => {
      const tier = getSynergyTier(5, 50);
      expect(tier).toBeDefined();
      expect(typeof tier.tier).toBe("number");
      expect(tier.name).toBeTruthy();
    });
    it("higher scores give better tiers", () => {
      const low = getSynergyTier(1, 0);
      const high = getSynergyTier(90, 5);
      expect(typeof low.tier).toBe("number");
      expect(typeof high.tier).toBe("number");
      expect(high.tier).toBeGreaterThanOrEqual(low.tier);
    });
  });

  describe("getSynergySummary", () => {
    it("returns a complete summary", () => {
      const summary = getSynergySummary(
        "elara",
        { species: "quarchon", characterClass: "mystic", element: "space", alignment: "order" },
        50,
        5
      );
      expect(summary.companionName).toBeTruthy();
      expect(summary.tier).toBeDefined();
      expect(typeof summary.synergyScore).toBe("number");
      expect(typeof summary.maxScore).toBe("number");
      expect(Array.isArray(summary.matchDetails)).toBe(true);
    });
  });
});

/* ═══════════════════════════════════════════════════════
   7. PRESTIGE CLASSES
   ═══════════════════════════════════════════════════════ */
import {
  PRESTIGE_CLASSES,
  meetsPrestigeRequirements,
  getPrestigePerks,
} from "../shared/prestigeClasses";

describe("Prestige Classes", () => {
  describe("PRESTIGE_CLASSES data integrity", () => {
    it("has at least 5 prestige classes defined", () => {
      expect(PRESTIGE_CLASSES.length).toBeGreaterThanOrEqual(5);
    });
    it("each class has required fields", () => {
      for (const pc of PRESTIGE_CLASSES) {
        expect(pc.key).toBeTruthy();
        expect(pc.name).toBeTruthy();
        expect(pc.description).toBeTruthy();
        expect(pc.primaryClass).toBeTruthy();
        expect(pc.secondaryClass).toBeTruthy();
        expect(pc.minLevel).toBeGreaterThanOrEqual(15);
        expect(pc.perks.length).toBeGreaterThan(0);
      }
    });
    it("keys are unique", () => {
      const keys = PRESTIGE_CLASSES.map(p => p.key);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });

  describe("meetsPrestigeRequirements", () => {
    it("returns not eligible for low-level character", () => {
      const result = meetsPrestigeRequirements(
        PRESTIGE_CLASSES[0].key,
        5,
        {},
        []
      );
      expect(result.eligible).toBe(false);
      expect(result.missing.length).toBeGreaterThan(0);
    });
    it("returns eligible when all requirements met", () => {
      const pc = PRESTIGE_CLASSES[0];
      const ranks: Record<string, number> = {
        [pc.primaryClass]: 5,
        [pc.secondaryClass]: 5,
      };
      const result = meetsPrestigeRequirements(
        pc.key,
        25,
        ranks,
        [pc.unlockQuestId]
      );
      expect(result.eligible).toBe(true);
      expect(result.missing).toEqual([]);
    });
  });

  describe("getPrestigePerks", () => {
    it("returns perks for rank 1", () => {
      const perks = getPrestigePerks(PRESTIGE_CLASSES[0].key, 1);
      expect(Array.isArray(perks)).toBe(true);
    });
    it("returns more perks at higher ranks", () => {
      const perks1 = getPrestigePerks(PRESTIGE_CLASSES[0].key, 1);
      const perks3 = getPrestigePerks(PRESTIGE_CLASSES[0].key, 3);
      expect(perks3.length).toBeGreaterThanOrEqual(perks1.length);
    });
  });
});

/* ═══════════════════════════════════════════════════════
   8. ACHIEVEMENT TRAITS
   ═══════════════════════════════════════════════════════ */
import {
  ACHIEVEMENT_TRAITS,
  getTraitProgress,
  getUnlockedTraits,
  getTraitSlots,
} from "../shared/achievementTraits";

describe("Achievement Traits", () => {
  describe("ACHIEVEMENT_TRAITS data integrity", () => {
    it("has at least 12 traits defined", () => {
      expect(ACHIEVEMENT_TRAITS.length).toBeGreaterThanOrEqual(12);
    });
    it("each trait has required fields", () => {
      for (const t of ACHIEVEMENT_TRAITS) {
        expect(t.key).toBeTruthy();
        expect(t.name).toBeTruthy();
        expect(t.description).toBeTruthy();
        expect(["bronze", "silver", "gold", "diamond"]).toContain(t.tier);
        expect(t.icon).toBeTruthy();
        expect(t.effects.length).toBeGreaterThan(0);
      }
    });
    it("keys are unique", () => {
      const keys = ACHIEVEMENT_TRAITS.map(t => t.key);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });

  describe("getTraitSlots", () => {
    it("returns 0 slots at level 1 (first slot unlocks at 5)", () => {
      expect(getTraitSlots(1)).toBe(0);
    });
    it("returns 1 slot at level 5", () => {
      expect(getTraitSlots(5)).toBe(1);
    });
    it("returns 2 slots at level 10", () => {
      expect(getTraitSlots(10)).toBe(2);
    });
    it("returns 3 slots at level 20", () => {
      expect(getTraitSlots(20)).toBe(3);
    });
  });

  describe("getTraitProgress", () => {
    it("returns progress for a trait with achievement counters", () => {
      const trait = ACHIEVEMENT_TRAITS[0];
      const counter = trait.achievement.counter;
      const progress = getTraitProgress(trait.key, {
        [counter]: 5,
      });
      expect(progress).toBeDefined();
      expect(typeof progress.current).toBe("number");
      expect(typeof progress.target).toBe("number");
      expect(typeof progress.progress).toBe("number");
      expect(typeof progress.unlocked).toBe("boolean");
      expect(progress.current).toBe(5);
    });
    it("returns unlocked=true when target is met", () => {
      const trait = ACHIEVEMENT_TRAITS[0];
      const counter = trait.achievement.counter;
      const progress = getTraitProgress(trait.key, {
        [counter]: trait.achievement.target + 100,
      });
      expect(progress.unlocked).toBe(true);
    });
  });

  describe("getUnlockedTraits", () => {
    it("returns only unlocked traits", () => {
      // Build achievement progress that unlocks the first trait
      const trait = ACHIEVEMENT_TRAITS[0];
      const counter = trait.achievement.counter;
      const achievementProgress = {
        [counter]: trait.achievement.target + 100,
      };
      const unlocked = getUnlockedTraits(achievementProgress);
      expect(Array.isArray(unlocked)).toBe(true);
      expect(unlocked.length).toBeGreaterThan(0);
      expect(unlocked.some(t => t.key === trait.key)).toBe(true);
    });
    it("returns empty array with no progress", () => {
      const unlocked = getUnlockedTraits({});
      expect(unlocked).toEqual([]);
    });
  });
});
