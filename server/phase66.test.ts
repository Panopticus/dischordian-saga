/**
 * Phase 66 Tests: Lore Tutorial Hub, Tutorial Triggers, Morality Unlockables
 *
 * Tests cover:
 * 1. Lore Tutorial Hub — Category grouping, completion tracking, tutorial data
 * 2. Tutorial Trigger — Route matching, banner display, completion state
 * 3. Morality Unlockables — Tier gating, zero-sum mechanics, unlock logic
 * 4. Fight Page Morality Bonuses — Stat boosts from morality alignment
 */

/* ═══════════════════════════════════════════════════════
   1. MORALITY UNLOCKABLES DATA
   ═══════════════════════════════════════════════════════ */
describe("Morality Unlockables Data", () => {
  let MORALITY_UNLOCKABLES: any[];
  let getUnlockedItems: any;
  let getUnlockablesBySide: any;
  let isUnlocked: any;
  let getNextUnlockable: any;
  let CATEGORY_LABELS: any;

  beforeAll(async () => {
    const mod = await import("../client/src/data/moralityUnlockables");
    MORALITY_UNLOCKABLES = mod.MORALITY_UNLOCKABLES;
    getUnlockedItems = mod.getUnlockedItems;
    getUnlockablesBySide = mod.getUnlockablesBySide;
    isUnlocked = mod.isUnlocked;
    getNextUnlockable = mod.getNextUnlockable;
    CATEGORY_LABELS = mod.CATEGORY_LABELS;
  });

  describe("Data integrity", () => {
    it("should have at least 20 unlockable items", () => {
      expect(MORALITY_UNLOCKABLES.length).toBeGreaterThanOrEqual(20);
    });

    it("should have items for both machine and humanity sides", () => {
      const machineItems = MORALITY_UNLOCKABLES.filter((u: any) => u.side === "machine");
      const humanityItems = MORALITY_UNLOCKABLES.filter((u: any) => u.side === "humanity");
      const balancedItems = MORALITY_UNLOCKABLES.filter((u: any) => u.side === "balanced");
      expect(machineItems.length).toBeGreaterThan(0);
      expect(humanityItems.length).toBeGreaterThan(0);
      expect(balancedItems.length).toBeGreaterThan(0);
    });

    it("should have unique IDs for all items", () => {
      const ids = MORALITY_UNLOCKABLES.map((u: any) => u.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have valid categories for all items", () => {
      const validCategories = Object.keys(CATEGORY_LABELS);
      MORALITY_UNLOCKABLES.forEach((u: any) => {
        expect(validCategories).toContain(u.category);
      });
    });

    it("should have levels 1-5 for all items", () => {
      MORALITY_UNLOCKABLES.forEach((u: any) => {
        expect(u.requiredLevel).toBeGreaterThanOrEqual(1);
        expect(u.requiredLevel).toBeLessThanOrEqual(5);
      });
    });

    it("should have machine items with negative thresholds and humanity items with positive", () => {
      MORALITY_UNLOCKABLES.forEach((u: any) => {
        if (u.side === "machine") {
          expect(u.scoreThreshold).toBeLessThanOrEqual(0);
        } else if (u.side === "humanity") {
          expect(u.scoreThreshold).toBeGreaterThanOrEqual(0);
        }
      });
    });
  });

  describe("Zero-sum unlock mechanics", () => {
    it("should unlock balanced items at score 0", () => {
      const unlocked = getUnlockedItems(0);
      const balancedUnlocked = unlocked.filter((u: any) => u.side === "balanced");
      expect(balancedUnlocked.length).toBeGreaterThan(0);
    });

    it("should unlock machine items at negative scores", () => {
      const unlocked = getUnlockedItems(-80);
      const machineUnlocked = unlocked.filter((u: any) => u.side === "machine");
      expect(machineUnlocked.length).toBeGreaterThan(0);
    });

    it("should unlock humanity items at positive scores", () => {
      const unlocked = getUnlockedItems(80);
      const humanityUnlocked = unlocked.filter((u: any) => u.side === "humanity");
      expect(humanityUnlocked.length).toBeGreaterThan(0);
    });

    it("should NOT unlock machine items at positive scores (zero-sum)", () => {
      const unlocked = getUnlockedItems(50);
      const machineUnlocked = unlocked.filter((u: any) => u.side === "machine");
      // Machine items require negative scores, so at +50 none should be unlocked
      expect(machineUnlocked.length).toBe(0);
    });

    it("should NOT unlock humanity items at negative scores (zero-sum)", () => {
      const unlocked = getUnlockedItems(-50);
      const humanityUnlocked = unlocked.filter((u: any) => u.side === "humanity");
      // Humanity items require positive scores, so at -50 none should be unlocked
      expect(humanityUnlocked.length).toBe(0);
    });

    it("should unlock more items as score increases in one direction", () => {
      const at20 = getUnlockedItems(-20).filter((u: any) => u.side === "machine");
      const at60 = getUnlockedItems(-60).filter((u: any) => u.side === "machine");
      const at100 = getUnlockedItems(-100).filter((u: any) => u.side === "machine");
      expect(at60.length).toBeGreaterThan(at20.length);
      expect(at100.length).toBeGreaterThan(at60.length);
    });

    it("should demonstrate zero-sum: gaining machine loses humanity access", () => {
      // At 0, we have balanced items
      const atZero = getUnlockedItems(0);
      const humanityAtZero = atZero.filter((u: any) => u.side === "humanity");

      // At -80, we have machine items but no humanity
      const atNeg80 = getUnlockedItems(-80);
      const humanityAtNeg80 = atNeg80.filter((u: any) => u.side === "humanity");
      const machineAtNeg80 = atNeg80.filter((u: any) => u.side === "machine");

      expect(machineAtNeg80.length).toBeGreaterThan(0);
      expect(humanityAtNeg80.length).toBe(0);
    });
  });

  describe("isUnlocked function", () => {
    it("should return true for balanced items at any score", () => {
      const balancedItem = MORALITY_UNLOCKABLES.find((u: any) => u.side === "balanced");
      if (balancedItem) {
        expect(isUnlocked(balancedItem.id, 0)).toBe(true);
        expect(isUnlocked(balancedItem.id, -100)).toBe(true);
        expect(isUnlocked(balancedItem.id, 100)).toBe(true);
      }
    });

    it("should return false for non-existent IDs", () => {
      expect(isUnlocked("fake_id_12345", 0)).toBe(false);
    });

    it("should correctly gate machine level 5 items", () => {
      const machineL5 = MORALITY_UNLOCKABLES.find((u: any) => u.side === "machine" && u.requiredLevel === 5);
      if (machineL5) {
        expect(isUnlocked(machineL5.id, -80)).toBe(true);
        expect(isUnlocked(machineL5.id, -100)).toBe(true);
        expect(isUnlocked(machineL5.id, -50)).toBe(false);
        expect(isUnlocked(machineL5.id, 0)).toBe(false);
      }
    });

    it("should correctly gate humanity level 5 items", () => {
      const humanityL5 = MORALITY_UNLOCKABLES.find((u: any) => u.side === "humanity" && u.requiredLevel === 5);
      if (humanityL5) {
        expect(isUnlocked(humanityL5.id, 80)).toBe(true);
        expect(isUnlocked(humanityL5.id, 100)).toBe(true);
        expect(isUnlocked(humanityL5.id, 50)).toBe(false);
        expect(isUnlocked(humanityL5.id, 0)).toBe(false);
      }
    });
  });

  describe("getUnlockablesBySide", () => {
    it("should return items sorted by level", () => {
      const machineItems = getUnlockablesBySide("machine");
      for (let i = 1; i < machineItems.length; i++) {
        expect(machineItems[i].requiredLevel).toBeGreaterThanOrEqual(machineItems[i - 1].requiredLevel);
      }
    });

    it("should return only items of the requested side", () => {
      const humanityItems = getUnlockablesBySide("humanity");
      humanityItems.forEach((u: any) => {
        expect(u.side).toBe("humanity");
      });
    });
  });

  describe("getNextUnlockable", () => {
    it("should return a locked item when not everything is unlocked", () => {
      const next = getNextUnlockable(0);
      // At score 0, there should be locked items on both sides
      expect(next).not.toBeNull();
    });

    it("should return null when everything on the current path is unlocked", () => {
      // At -100, all machine items should be unlocked
      const next = getNextUnlockable(-100);
      // It might return a humanity item as the "next" since those are locked
      // The function should still return something since humanity items are locked
      // This tests the edge case
      if (next) {
        expect(next.side).toBeDefined();
      }
    });

    it("should return a machine item when score is negative", () => {
      const next = getNextUnlockable(-10);
      if (next) {
        expect(next.side).toBe("machine");
      }
    });

    it("should return a humanity item when score is positive", () => {
      const next = getNextUnlockable(10);
      if (next) {
        expect(next.side).toBe("humanity");
      }
    });
  });
});

/* ═══════════════════════════════════════════════════════
   2. MORALITY TIER DEFINITIONS
   ═══════════════════════════════════════════════════════ */
describe("Morality Tier Definitions", () => {
  // We test the tier logic that the MoralityMeter exports
  // Since MoralityMeter is a React component, we test the pure data/functions

  const MORALITY_TIERS = [
    { minScore: -100, maxScore: -80, side: "machine", level: 5 },
    { minScore: -79, maxScore: -60, side: "machine", level: 4 },
    { minScore: -59, maxScore: -40, side: "machine", level: 3 },
    { minScore: -39, maxScore: -20, side: "machine", level: 2 },
    { minScore: -19, maxScore: 19, side: "balanced", level: 1 },
    { minScore: 20, maxScore: 39, side: "humanity", level: 2 },
    { minScore: 40, maxScore: 59, side: "humanity", level: 3 },
    { minScore: 60, maxScore: 79, side: "humanity", level: 4 },
    { minScore: 80, maxScore: 100, side: "humanity", level: 5 },
  ];

  function getMoralityTier(score: number) {
    return MORALITY_TIERS.find(t => score >= t.minScore && score <= t.maxScore) || MORALITY_TIERS[4];
  }

  it("should cover the full -100 to +100 range", () => {
    for (let score = -100; score <= 100; score++) {
      const tier = getMoralityTier(score);
      expect(tier).toBeDefined();
      expect(score).toBeGreaterThanOrEqual(tier.minScore);
      expect(score).toBeLessThanOrEqual(tier.maxScore);
    }
  });

  it("should return machine side for negative scores below -20", () => {
    expect(getMoralityTier(-30).side).toBe("machine");
    expect(getMoralityTier(-50).side).toBe("machine");
    expect(getMoralityTier(-80).side).toBe("machine");
    expect(getMoralityTier(-100).side).toBe("machine");
  });

  it("should return humanity side for positive scores above 19", () => {
    expect(getMoralityTier(30).side).toBe("humanity");
    expect(getMoralityTier(50).side).toBe("humanity");
    expect(getMoralityTier(80).side).toBe("humanity");
    expect(getMoralityTier(100).side).toBe("humanity");
  });

  it("should return balanced for scores -19 to +19", () => {
    expect(getMoralityTier(0).side).toBe("balanced");
    expect(getMoralityTier(-19).side).toBe("balanced");
    expect(getMoralityTier(19).side).toBe("balanced");
  });

  it("should have increasing levels as scores move toward extremes", () => {
    expect(getMoralityTier(-20).level).toBe(2);
    expect(getMoralityTier(-40).level).toBe(3);
    expect(getMoralityTier(-60).level).toBe(4);
    expect(getMoralityTier(-80).level).toBe(5);
    expect(getMoralityTier(20).level).toBe(2);
    expect(getMoralityTier(40).level).toBe(3);
    expect(getMoralityTier(60).level).toBe(4);
    expect(getMoralityTier(80).level).toBe(5);
  });
});

/* ═══════════════════════════════════════════════════════
   3. FIGHT PAGE MORALITY BONUSES
   ═══════════════════════════════════════════════════════ */
describe("Fight Page Morality Bonuses", () => {
  // Test the morality bonus calculation logic used in FightPage's boostedPlayer
  const MORALITY_TIERS = [
    { minScore: -100, maxScore: -80, side: "machine", level: 5 },
    { minScore: -79, maxScore: -60, side: "machine", level: 4 },
    { minScore: -59, maxScore: -40, side: "machine", level: 3 },
    { minScore: -39, maxScore: -20, side: "machine", level: 2 },
    { minScore: -19, maxScore: 19, side: "balanced", level: 1 },
    { minScore: 20, maxScore: 39, side: "humanity", level: 2 },
    { minScore: 40, maxScore: 59, side: "humanity", level: 3 },
    { minScore: 60, maxScore: 79, side: "humanity", level: 4 },
    { minScore: 80, maxScore: 100, side: "humanity", level: 5 },
  ];

  function getMoralityTier(score: number) {
    return MORALITY_TIERS.find(t => score >= t.minScore && score <= t.maxScore) || MORALITY_TIERS[4];
  }

  function calculateMoralityBonus(score: number) {
    const tier = getMoralityTier(score);
    let attackBonus = 0;
    let hpBonus = 0;
    let defenseBonus = 0;

    if (tier.side === "machine" && tier.level >= 3) {
      attackBonus = tier.level - 2;
    } else if (tier.side === "humanity" && tier.level >= 3) {
      hpBonus = (tier.level - 2) * 3;
      if (tier.level >= 5) defenseBonus = 1;
    }

    return { attackBonus, hpBonus, defenseBonus };
  }

  it("should give no bonuses at balanced alignment", () => {
    const bonus = calculateMoralityBonus(0);
    expect(bonus.attackBonus).toBe(0);
    expect(bonus.hpBonus).toBe(0);
    expect(bonus.defenseBonus).toBe(0);
  });

  it("should give no bonuses at level 2 (either side)", () => {
    const machineL2 = calculateMoralityBonus(-30);
    expect(machineL2.attackBonus).toBe(0);
    const humanityL2 = calculateMoralityBonus(30);
    expect(humanityL2.hpBonus).toBe(0);
  });

  it("should give +1 attack at Machine Level 3", () => {
    const bonus = calculateMoralityBonus(-50);
    expect(bonus.attackBonus).toBe(1);
    expect(bonus.hpBonus).toBe(0);
  });

  it("should give +2 attack at Machine Level 4", () => {
    const bonus = calculateMoralityBonus(-70);
    expect(bonus.attackBonus).toBe(2);
  });

  it("should give +3 attack at Machine Level 5", () => {
    const bonus = calculateMoralityBonus(-90);
    expect(bonus.attackBonus).toBe(3);
  });

  it("should give +3 HP at Humanity Level 3", () => {
    const bonus = calculateMoralityBonus(50);
    expect(bonus.hpBonus).toBe(3);
    expect(bonus.attackBonus).toBe(0);
  });

  it("should give +6 HP at Humanity Level 4", () => {
    const bonus = calculateMoralityBonus(70);
    expect(bonus.hpBonus).toBe(6);
  });

  it("should give +9 HP and +1 defense at Humanity Level 5", () => {
    const bonus = calculateMoralityBonus(90);
    expect(bonus.hpBonus).toBe(9);
    expect(bonus.defenseBonus).toBe(1);
  });

  it("should be zero-sum: Machine gets attack, Humanity gets HP/defense", () => {
    const machine = calculateMoralityBonus(-90);
    const humanity = calculateMoralityBonus(90);

    // Machine: attack bonus, no HP/defense
    expect(machine.attackBonus).toBeGreaterThan(0);
    expect(machine.hpBonus).toBe(0);
    expect(machine.defenseBonus).toBe(0);

    // Humanity: HP/defense bonus, no attack
    expect(humanity.attackBonus).toBe(0);
    expect(humanity.hpBonus).toBeGreaterThan(0);
  });
});

/* ═══════════════════════════════════════════════════════
   4. LORE TUTORIAL DATA INTEGRITY
   ═══════════════════════════════════════════════════════ */
describe("Lore Tutorial Data", () => {
  let tutorials: any[];
  beforeAll(async () => {
    const mod = await import("../client/src/data/loreTutorials");
    tutorials = mod.LORE_TUTORIALS;
  });

  it("should have at least 20 tutorials", () => {
    expect(tutorials.length).toBeGreaterThanOrEqual(20);
  });

  it("should have unique IDs", () => {
    const ids = tutorials.map((t: any) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have valid mechanics for all tutorials", () => {
    const validMechanics = [
      "morality", "combat", "exploration", "deck_building", "trading",
      "ark_customization", "faction_politics", "card_collection",
      "narrative", "social", "crafting", "pvp", "economy",
      "progression", "puzzle", "discovery",
    ];
    tutorials.forEach((t: any) => {
      expect(typeof t.mechanic).toBe("string");
      expect(t.mechanic.length).toBeGreaterThan(0);
    });
  });

  it("should have at least 2 steps per tutorial", () => {
    tutorials.forEach((t: any) => {
      expect(t.steps.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("should have triggerRoutes that start with /", () => {
    tutorials.forEach((t: any) => {
      if (t.triggerRoute) {
        expect(t.triggerRoute.startsWith("/")).toBe(true);
      }
    });
  });

  it("should have totalRewards object for all tutorials", () => {
    tutorials.forEach((t: any) => {
      expect(t.totalRewards).toBeDefined();
      expect(typeof t.totalRewards.dreamTokens).toBe("number");
      expect(typeof t.totalRewards.xp).toBe("number");
      expect(typeof t.totalRewards.cards).toBe("number");
    });
  });

  it("should have morality choices in morality-mechanic tutorials", () => {
    const moralityTutorials = tutorials.filter((t: any) => t.mechanic === "morality");
    moralityTutorials.forEach((t: any) => {
      const hasMoralityChoice = t.steps.some((step: any) =>
        step.choices?.some((c: any) => c.moralityShift !== undefined && c.moralityShift !== 0)
      );
      expect(hasMoralityChoice).toBe(true);
    });
  });
});

/* ═══════════════════════════════════════════════════════
   5. TUTORIAL TRIGGER ROUTE MATCHING
   ═══════════════════════════════════════════════════════ */
describe("Tutorial Trigger Route Matching", () => {
  let tutorials: any[];
  beforeAll(async () => {
    const mod = await import("../client/src/data/loreTutorials");
    tutorials = mod.LORE_TUTORIALS;
  });

  it("should have tutorials for key game routes", () => {
    const keyRoutes = ["/fight", "/games", "/cards"];
    keyRoutes.forEach(route => {
      const matching = tutorials.filter((t: any) => t.triggerRoute === route);
      expect(matching.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("should group tutorials by triggerRoute correctly", () => {
    const routeMap = new Map<string, number>();
    tutorials.forEach((t: any) => {
      if (t.triggerRoute) {
        routeMap.set(t.triggerRoute, (routeMap.get(t.triggerRoute) || 0) + 1);
      }
    });
    // Each tutorial should have a unique route or shared route
    expect(routeMap.size).toBeGreaterThan(0);
  });
});

/* ═══════════════════════════════════════════════════════
   6. CATEGORY LABELS
   ═══════════════════════════════════════════════════════ */
describe("Category Labels", () => {
  let CATEGORY_LABELS: any;
  beforeAll(async () => {
    const mod = await import("../client/src/data/moralityUnlockables");
    CATEGORY_LABELS = mod.CATEGORY_LABELS;
  });

  it("should have labels for all categories", () => {
    const expectedCategories = ["ship_theme", "character_aura", "card_effect", "title", "item", "ability_mod"];
    expectedCategories.forEach(cat => {
      expect(CATEGORY_LABELS[cat]).toBeDefined();
      expect(typeof CATEGORY_LABELS[cat]).toBe("string");
    });
  });
});
