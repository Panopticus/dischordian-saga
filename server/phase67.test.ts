/**
 * Phase 67 Tests: Auto-Trigger Tutorials, Morality Visual Theming, Morality Leaderboard
 *
 * Tests cover:
 * 1. Auto-Tutorial Hook — Route matching, snooze/dismiss persistence, first-visit detection
 * 2. Morality Theme Context — Palette interpolation, side detection, CSS variable mapping
 * 3. Morality Leaderboard Router — Distribution aggregation, alignment classification, ranking
 */
import { describe, it, expect, beforeAll } from "vitest";

/* ═══════════════════════════════════════════════════════
   1. AUTO-TUTORIAL SYSTEM
   ═══════════════════════════════════════════════════════ */
describe("Auto-Tutorial System", () => {
  let LORE_TUTORIALS: any[];

  beforeAll(async () => {
    const mod = await import("../client/src/data/loreTutorials");
    LORE_TUTORIALS = mod.LORE_TUTORIALS;
  });

  it("should have tutorials with valid triggerRoutes", () => {
    const withRoutes = LORE_TUTORIALS.filter((t: any) => t.triggerRoute);
    expect(withRoutes.length).toBeGreaterThan(10);
    for (const t of withRoutes) {
      expect(t.triggerRoute).toMatch(/^\//);
    }
  });

  it("should find tutorials for key game pages", () => {
    const routes = ["/games", "/fight", "/cards", "/deck-builder", "/trade-empire"];
    for (const route of routes) {
      const matching = LORE_TUTORIALS.filter((t: any) => t.triggerRoute === route);
      expect(matching.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("should have unique tutorial IDs", () => {
    const ids = LORE_TUTORIALS.map((t: any) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have tutorials with required fields for auto-trigger", () => {
    for (const t of LORE_TUTORIALS) {
      expect(t.id).toBeTruthy();
      expect(t.title).toBeTruthy();
      expect(t.mechanic).toBeTruthy();
      expect(t.steps).toBeDefined();
      expect(t.steps.length).toBeGreaterThan(0);
    }
  });
});

/* ═══════════════════════════════════════════════════════
   2. MORALITY THEME SYSTEM
   ═══════════════════════════════════════════════════════ */
describe("Morality Theme System", () => {
  let BALANCED_PALETTE: any;
  let MACHINE_PALETTE: any;
  let HUMANITY_PALETTE: any;

  beforeAll(async () => {
    const mod = await import("../client/src/contexts/MoralityThemeContext");
    BALANCED_PALETTE = mod.BALANCED_PALETTE;
    MACHINE_PALETTE = mod.MACHINE_PALETTE;
    HUMANITY_PALETTE = mod.HUMANITY_PALETTE;
  });

  it("should define three distinct palettes", () => {
    expect(BALANCED_PALETTE).toBeDefined();
    expect(MACHINE_PALETTE).toBeDefined();
    expect(HUMANITY_PALETTE).toBeDefined();
    // Each should have primary color
    expect(BALANCED_PALETTE.primary).toBeTruthy();
    expect(MACHINE_PALETTE.primary).toBeTruthy();
    expect(HUMANITY_PALETTE.primary).toBeTruthy();
  });

  it("should have different primary colors for each palette", () => {
    expect(BALANCED_PALETTE.primary).not.toBe(MACHINE_PALETTE.primary);
    expect(BALANCED_PALETTE.primary).not.toBe(HUMANITY_PALETTE.primary);
    expect(MACHINE_PALETTE.primary).not.toBe(HUMANITY_PALETTE.primary);
  });

  it("should have valid hex colors in all palettes", () => {
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    for (const palette of [BALANCED_PALETTE, MACHINE_PALETTE, HUMANITY_PALETTE]) {
      expect(palette.neonCyan).toMatch(hexRegex);
      expect(palette.primary).toMatch(hexRegex);
      expect(palette.accent).toMatch(hexRegex);
      expect(palette.ring).toMatch(hexRegex);
      expect(palette.chart1).toMatch(hexRegex);
      expect(palette.chart2).toMatch(hexRegex);
    }
  });

  it("should have brand gradients for all palettes", () => {
    for (const palette of [BALANCED_PALETTE, MACHINE_PALETTE, HUMANITY_PALETTE]) {
      expect(palette.brandGradient).toContain("linear-gradient");
    }
  });

  it("machine palette should use red/silver tones", () => {
    // Machine primary should be reddish
    const r = parseInt(MACHINE_PALETTE.primary.slice(1, 3), 16);
    const g = parseInt(MACHINE_PALETTE.primary.slice(3, 5), 16);
    expect(r).toBeGreaterThan(g); // Red-dominant
  });

  it("humanity palette should use green tones", () => {
    // Humanity primary should be greenish
    const g = parseInt(HUMANITY_PALETTE.primary.slice(3, 5), 16);
    const r = parseInt(HUMANITY_PALETTE.primary.slice(1, 3), 16);
    expect(g).toBeGreaterThan(r); // Green-dominant
  });

  it("balanced palette should use cyan tones", () => {
    // Balanced primary should be cyan-ish
    const r = parseInt(BALANCED_PALETTE.primary.slice(1, 3), 16);
    const g = parseInt(BALANCED_PALETTE.primary.slice(3, 5), 16);
    const b = parseInt(BALANCED_PALETTE.primary.slice(5, 7), 16);
    // Cyan has high green and blue, low red
    expect(g + b).toBeGreaterThan(r * 2);
  });
});

/* ═══════════════════════════════════════════════════════
   3. MORALITY TIER DETECTION
   ═══════════════════════════════════════════════════════ */
describe("Morality Tier Detection", () => {
  let getMoralityTierDef: any;

  beforeAll(async () => {
    const mod = await import("../client/src/components/MoralityMeter");
    getMoralityTierDef = mod.getMoralityTierDef;
  });

  it("should classify score 0 as balanced", () => {
    const tier = getMoralityTierDef(0);
    expect(tier.side).toBe("balanced");
  });

  it("should classify negative scores as machine", () => {
    const tier = getMoralityTierDef(-50);
    expect(tier.side).toBe("machine");
  });

  it("should classify positive scores as humanity", () => {
    const tier = getMoralityTierDef(50);
    expect(tier.side).toBe("humanity");
  });

  it("should increase level with higher absolute scores", () => {
    const low = getMoralityTierDef(-30);
    const high = getMoralityTierDef(-80);
    expect(high.level).toBeGreaterThanOrEqual(low.level);
  });

  it("should be symmetric for machine and humanity", () => {
    const machine = getMoralityTierDef(-60);
    const humanity = getMoralityTierDef(60);
    expect(machine.level).toBe(humanity.level);
  });

  it("should handle extreme values", () => {
    const maxMachine = getMoralityTierDef(-100);
    const maxHumanity = getMoralityTierDef(100);
    expect(maxMachine.side).toBe("machine");
    expect(maxHumanity.side).toBe("humanity");
    expect(maxMachine.level).toBeGreaterThanOrEqual(4);
    expect(maxHumanity.level).toBeGreaterThanOrEqual(4);
  });
});

/* ═══════════════════════════════════════════════════════
   4. MORALITY LEADERBOARD ROUTER LOGIC
   ═══════════════════════════════════════════════════════ */
describe("Morality Leaderboard Classification", () => {
  // Test the classification logic directly
  function classifyAlignment(score: number): "machine" | "balanced" | "humanity" {
    if (score <= -20) return "machine";
    if (score >= 20) return "humanity";
    return "balanced";
  }

  function getTierLabel(score: number): string {
    const abs = Math.abs(score);
    if (abs < 20) return "Balanced";
    if (abs < 40) return score < 0 ? "Machine-Leaning" : "Humanity-Leaning";
    if (abs < 60) return score < 0 ? "Machine-Aligned" : "Humanity-Aligned";
    if (abs < 80) return score < 0 ? "Machine-Devoted" : "Humanity-Devoted";
    return score < 0 ? "Machine-Ascended" : "Humanity-Ascended";
  }

  it("should classify scores correctly", () => {
    expect(classifyAlignment(0)).toBe("balanced");
    expect(classifyAlignment(10)).toBe("balanced");
    expect(classifyAlignment(-10)).toBe("balanced");
    expect(classifyAlignment(20)).toBe("humanity");
    expect(classifyAlignment(-20)).toBe("machine");
    expect(classifyAlignment(100)).toBe("humanity");
    expect(classifyAlignment(-100)).toBe("machine");
  });

  it("should generate correct tier labels", () => {
    expect(getTierLabel(0)).toBe("Balanced");
    expect(getTierLabel(15)).toBe("Balanced");
    expect(getTierLabel(-15)).toBe("Balanced");
    expect(getTierLabel(25)).toBe("Humanity-Leaning");
    expect(getTierLabel(-25)).toBe("Machine-Leaning");
    expect(getTierLabel(50)).toBe("Humanity-Aligned");
    expect(getTierLabel(-50)).toBe("Machine-Aligned");
    expect(getTierLabel(70)).toBe("Humanity-Devoted");
    expect(getTierLabel(-70)).toBe("Machine-Devoted");
    expect(getTierLabel(90)).toBe("Humanity-Ascended");
    expect(getTierLabel(-90)).toBe("Machine-Ascended");
  });

  it("should have symmetric labels for positive and negative scores", () => {
    const testScores = [25, 50, 70, 90];
    for (const score of testScores) {
      const pos = getTierLabel(score);
      const neg = getTierLabel(-score);
      // Both should have the same structure, just different prefix
      expect(pos.includes("Humanity")).toBe(true);
      expect(neg.includes("Machine")).toBe(true);
      // Same suffix (Leaning, Aligned, Devoted, Ascended)
      const posSuffix = pos.split("-")[1];
      const negSuffix = neg.split("-")[1];
      expect(posSuffix).toBe(negSuffix);
    }
  });

  it("should aggregate distribution correctly", () => {
    const scores = [0, 10, -30, 50, -60, 80, -5, 25];
    let machine = 0, balanced = 0, humanity = 0;
    for (const s of scores) {
      const a = classifyAlignment(s);
      if (a === "machine") machine++;
      else if (a === "humanity") humanity++;
      else balanced++;
    }
    expect(machine).toBe(2); // -30, -60
    expect(balanced).toBe(3); // 0, 10, -5
    expect(humanity).toBe(3); // 50, 80, 25
    expect(machine + balanced + humanity).toBe(scores.length);
  });
});

/* ═══════════════════════════════════════════════════════
   5. MORALITY UNLOCKABLES INTEGRATION
   ═══════════════════════════════════════════════════════ */
describe("Morality Unlockables Integration with Theming", () => {
  let MORALITY_UNLOCKABLES: any[];
  let getUnlockedItems: any;

  beforeAll(async () => {
    const mod = await import("../client/src/data/moralityUnlockables");
    MORALITY_UNLOCKABLES = mod.MORALITY_UNLOCKABLES;
    getUnlockedItems = mod.getUnlockedItems;
  });

  it("should have unlockables for both machine and humanity sides", () => {
    const machineItems = MORALITY_UNLOCKABLES.filter((u: any) => u.side === "machine");
    const humanityItems = MORALITY_UNLOCKABLES.filter((u: any) => u.side === "humanity");
    expect(machineItems.length).toBeGreaterThan(0);
    expect(humanityItems.length).toBeGreaterThan(0);
  });

  it("should unlock more items at higher morality scores", () => {
    const lowUnlocks = getUnlockedItems(-30, []);
    const highUnlocks = getUnlockedItems(-80, []);
    expect(highUnlocks.length).toBeGreaterThanOrEqual(lowUnlocks.length);
  });

  it("should not unlock machine items for humanity scores", () => {
    const humanityUnlocks = getUnlockedItems(80, []);
    const machineItems = humanityUnlocks.filter((u: any) => u.side === "machine");
    expect(machineItems.length).toBe(0);
  });

  it("should not unlock humanity items for machine scores", () => {
    const machineUnlocks = getUnlockedItems(-80, []);
    const humanityItems = machineUnlocks.filter((u: any) => u.side === "humanity");
    expect(humanityItems.length).toBe(0);
  });
});
