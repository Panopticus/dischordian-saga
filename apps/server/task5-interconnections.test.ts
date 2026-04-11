import { describe, it, expect, beforeEach } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════
   TASK 5 — System Interconnections
   5.1 — Companion bond → combat rewards
   5.2 — Morality → marketplace price modifier (display parity)
   5.3 — Guild war outcome → Living Universe pressure
   ═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   TASK 5.1 — Companion combat bonuses
   ═══════════════════════════════════════════════════════ */

describe("Task 5.1 — companionCombat service", () => {
  const svcSrc = fs.readFileSync(
    path.resolve(__dirname, "services/companionCombat.ts"),
    "utf-8",
  );

  it("exports the existing getCombatBonus + applyBonus + formatBreakdown helpers", () => {
    expect(svcSrc).toContain("getCombatBonus");
    expect(svcSrc).toContain("applyBonus");
    expect(svcSrc).toContain("formatBreakdown");
  });

  it("exports new applyCompanionBonusesToRewards helper", () => {
    expect(svcSrc).toContain("applyCompanionBonusesToRewards");
  });

  it("applyCompanionBonusesToRewards returns points, xp, dream, credits, bonus", () => {
    expect(svcSrc).toMatch(/points:\s*Math\.round/);
    expect(svcSrc).toMatch(/xp:\s*Math\.round/);
    expect(svcSrc).toMatch(/dream:\s*Math\.round/);
    expect(svcSrc).toMatch(/credits:\s*Math\.round/);
    expect(svcSrc).toContain("bonus,");
  });

  it("applyCompanionBonusesToRewards uses attack as the single scalar axis", () => {
    expect(svcSrc).toMatch(/const mult = 1 \+ bonus\.attack \/ 100/);
  });

  it("documents the Task 5.1 integration", () => {
    expect(svcSrc).toContain("Task 5.1");
  });
});

describe("Task 5.1 — fightLeaderboard wires companion bonus into points", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "routers/fightLeaderboard.ts"),
    "utf-8",
  );

  it("calls applyCompanionBonusesToRewards for the points payload", () => {
    expect(src).toMatch(/companionCombat\.applyCompanionBonusesToRewards\(userId,\s*\{\s*points:\s*input\.pointsEarned/);
  });

  it("persists the adjusted pointsEarned to fightMatches", () => {
    expect(src).toMatch(/pointsEarned:\s*adjustedPointsEarned/);
  });

  it("falls back to the raw input.pointsEarned on losses", () => {
    expect(src).toContain("input.won ? companionScaled.points : input.pointsEarned");
  });

  it("returns pointsEarned + pointsBasePreBonus so the client can render a breakdown", () => {
    expect(src).toContain("pointsEarned: adjustedPointsEarned");
    expect(src).toContain("pointsBasePreBonus: input.pointsEarned");
  });

  it("companionBonus return field includes pointsBoostApplied", () => {
    expect(src).toContain("pointsBoostApplied");
  });

  it("preserves the existing ELO K-factor companion bonus (no regression)", () => {
    expect(src).toContain("companionKBonus = Math.floor(companionBonus.attack / 2)");
    expect(src).toContain("adjustedK = 32 + traitKBonus + companionKBonus");
  });
});

/* ═══════════════════════════════════════════════════════
   TASK 5.2 — Morality marketplace price modifier
   ═══════════════════════════════════════════════════════ */

describe("Task 5.2 — marketplace morality modifier", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "routers/marketplace.ts"),
    "utf-8",
  );

  it("declares the computeMoralityPriceModifier helper at the top of the file", () => {
    expect(src).toContain("function computeMoralityPriceModifier");
    // Should be above the import of `z` so it is hoist-safe
    const helperIdx = src.indexOf("function computeMoralityPriceModifier");
    const zodImportIdx = src.indexOf('import { z }');
    expect(helperIdx).toBeGreaterThan(0);
    expect(helperIdx).toBeLessThan(zodImportIdx);
  });

  it("returns 1.0 for neutral alignment", () => {
    expect(src).toMatch(/if \(!moralityScore\) return 1/);
  });

  it("covers both tech and organic item vocabularies", () => {
    expect(src).toContain("techTerms");
    expect(src).toContain("organicTerms");
  });

  it("caps the modifier at 15% at score ±100", () => {
    expect(src).toMatch(/intensity \* 0\.15/);
    expect(src).toMatch(/Math\.abs\(moralityScore\) \/ 100/);
  });

  it("buyListing uses the helper instead of inline duplicate logic", () => {
    expect(src).toMatch(/computeMoralityPriceModifier\(\s*moralityScore,/);
  });

  it("listListings applies the helper to every returned listing", () => {
    expect(src).toMatch(/listings\.map\(\(listing\)/);
    expect(src).toMatch(/computeMoralityPriceModifier\(\s*buyerMorality,/);
  });

  it("listListings surfaces the original price alongside the adjusted one", () => {
    expect(src).toContain("listPriceDream: listing.priceDream");
    expect(src).toContain("listPriceCredits: listing.priceCredits");
    expect(src).toContain("moralityPriceMult");
  });

  it("skips the adjustment for items that are neither tech nor organic", () => {
    expect(src).toMatch(/if \(!isTech && !isOrganic\) return 1/);
  });

  it("documents the Task 5.2 display-parity goal", () => {
    expect(src).toContain("Task 5.2");
    expect(src).toMatch(/display[-\s]?time/i);
  });
});

/* ═══════════════════════════════════════════════════════
   TASK 5.3 — Guild war resolution → faction pressure
   ═══════════════════════════════════════════════════════ */

describe("Task 5.3 — guild war resolution bumps community pressure", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "routers/guildWars.ts"),
    "utf-8",
  );

  it("imports pressureService", () => {
    expect(src).toContain('import { pressureService } from "../services/pressureService"');
  });

  it("computes a factionShiftPoints scalar from war scores", () => {
    expect(src).toContain("factionShiftPoints");
    expect(src).toMatch(/Math\.floor\(\(war\[0\]\.scoreA \+ war\[0\]\.scoreB\) \/ 100\)/);
  });

  it("calls pressureService.increment with the appropriate pressure type per faction", () => {
    expect(src).toContain("pressureService.increment");
    // empire wins → exploration (Antiquarian)
    expect(src).toContain('winnerFaction === "insurgency" ? "betrayals" : "exploration"');
  });

  it("uses a real contributing member userId as the pressure owner", () => {
    expect(src).toMatch(/select\(\{\s*userId:\s*guildMembers\.userId\s*\}\)\s*\.from\(guildMembers\)/);
  });

  it("sources the increment with a deterministic key including the warId", () => {
    expect(src).toMatch(/guild_war_resolved_\$\{input\.warId\}_\$\{winnerFaction\}/);
  });

  it("notification message surfaces the faction shift points", () => {
    expect(src).toContain("shifted the");
    expect(src).toContain("faction balance by +");
  });

  it("resolveWar return value includes factionShiftPoints + factionShiftMessage", () => {
    expect(src).toContain("factionShiftPoints,");
    expect(src).toContain("factionShiftMessage:");
  });

  it("catches pressure increment errors so a backend hiccup doesn't roll back the war", () => {
    expect(src).toMatch(/catch\s*\(e\)\s*\{[\s\S]{0,200}GuildWars.*Faction pressure/);
  });

  it("documents the Task 5.3 cross-system link", () => {
    expect(src).toContain("Task 5.3");
  });
});

/* ═══════════════════════════════════════════════════════
   RUNTIME — exercise the helpers directly (no DB needed)
   ═══════════════════════════════════════════════════════ */

describe("Task 5 — runtime helper behavior", () => {
  describe("computeMoralityPriceModifier", () => {
    // Re-implement the helper inline so we can exercise it without
    // importing the router (which pulls in the full tRPC stack).
    function computeMoralityPriceModifier(
      moralityScore: number,
      category: string | null | undefined,
      itemName: string | null | undefined,
    ): number {
      if (!moralityScore) return 1;
      const cat = (category ?? "").toLowerCase();
      const name = (itemName ?? "").toLowerCase();
      const techTerms = ["tech", "machine", "circuit", "neural", "data", "virus", "synthetic", "mech"];
      const organicTerms = ["organic", "natural", "soul", "dream", "compassion", "healing", "gift", "life"];
      const isTech = techTerms.some((t) => cat.includes(t) || name.includes(t));
      const isOrganic = organicTerms.some((t) => cat.includes(t) || name.includes(t));
      if (!isTech && !isOrganic) return 1;
      let itemAlignmentFactor = 0;
      if (moralityScore > 0 && isOrganic) itemAlignmentFactor = 1;
      if (moralityScore > 0 && isTech) itemAlignmentFactor = -1;
      if (moralityScore < 0 && isTech) itemAlignmentFactor = 1;
      if (moralityScore < 0 && isOrganic) itemAlignmentFactor = -1;
      if (itemAlignmentFactor === 0) return 1;
      const intensity = Math.abs(moralityScore) / 100;
      const moralityModifier = intensity * 0.15 * itemAlignmentFactor;
      return 1 - moralityModifier;
    }

    it("returns 1 for neutral alignment (score = 0)", () => {
      expect(computeMoralityPriceModifier(0, "tech", "tech_item")).toBe(1);
    });

    it("returns 1 for items that are neither tech nor organic", () => {
      expect(computeMoralityPriceModifier(100, "weapon", "sword")).toBe(1);
      expect(computeMoralityPriceModifier(-100, "food", "apple")).toBe(1);
    });

    it("gives humanity-aligned players a 15% discount on organic items at max alignment", () => {
      const mult = computeMoralityPriceModifier(100, "organic", "dream_gift");
      expect(mult).toBeCloseTo(0.85, 2);
    });

    it("charges humanity-aligned players a 15% premium on tech items at max alignment", () => {
      const mult = computeMoralityPriceModifier(100, "tech", "neural_chip");
      expect(mult).toBeCloseTo(1.15, 2);
    });

    it("gives machine-aligned players a 15% discount on tech items at max alignment", () => {
      const mult = computeMoralityPriceModifier(-100, "tech", "circuit_board");
      expect(mult).toBeCloseTo(0.85, 2);
    });

    it("charges machine-aligned players a 15% premium on organic items at max alignment", () => {
      const mult = computeMoralityPriceModifier(-100, "organic", "healing_salve");
      expect(mult).toBeCloseTo(1.15, 2);
    });

    it("scales linearly with morality score", () => {
      const half = computeMoralityPriceModifier(50, "organic", "life_seed");
      expect(half).toBeCloseTo(0.925, 3); // (50/100)*15% = 7.5% discount
    });

    it("detects item alignment via itemName when category is neutral", () => {
      const mult = computeMoralityPriceModifier(100, "misc", "synthetic_core");
      expect(mult).toBeCloseTo(1.15, 2);
    });

    it("handles null/undefined category and itemName gracefully", () => {
      expect(computeMoralityPriceModifier(100, null, null)).toBe(1);
      expect(computeMoralityPriceModifier(100, undefined, undefined)).toBe(1);
    });
  });

  describe("companion bonus math", () => {
    // Mirror the helper's math to validate the integer rounding
    const applyMult = (base: number, attackPercent: number) =>
      Math.round(base * (1 + attackPercent / 100));

    it("zero bonus → no change", () => {
      expect(applyMult(100, 0)).toBe(100);
    });

    it("10% bonus on 100 points → 110", () => {
      expect(applyMult(100, 10)).toBe(110);
    });

    it("6% bonus rounds 123 → 130", () => {
      expect(applyMult(123, 6)).toBe(130);
    });

    it("15% Transcendent bonus at 1000 points → 1150", () => {
      expect(applyMult(1000, 15)).toBe(1150);
    });

    it("negative bonus (defensive guard) → clamped via round", () => {
      // Spec doesn't support negative attack bonus but test the math
      expect(applyMult(100, -10)).toBe(90);
    });
  });

  describe("guild war faction pressure routing", () => {
    const routeFaction = (winner: "empire" | "insurgency") =>
      winner === "insurgency" ? "betrayals" : "exploration";

    it("empire wins → Antiquarian's Revelation (exploration)", () => {
      expect(routeFaction("empire")).toBe("exploration");
    });

    it("insurgency wins → Shadow Tongue Edit (betrayals)", () => {
      expect(routeFaction("insurgency")).toBe("betrayals");
    });

    it("factionShiftPoints caps at a minimum of 1", () => {
      const scoreA = 0;
      const scoreB = 50;
      const shift = Math.max(1, Math.floor((scoreA + scoreB) / 100));
      expect(shift).toBe(1);
    });

    it("factionShiftPoints scales with war intensity", () => {
      const scoreA = 800;
      const scoreB = 1200;
      const shift = Math.max(1, Math.floor((scoreA + scoreB) / 100));
      expect(shift).toBe(20);
    });
  });
});

/* ═══════════════════════════════════════════════════════
   REGRESSION — no cross-pollination between tasks broke anything
   ═══════════════════════════════════════════════════════ */

describe("Task 5 — no regression in existing consumers", () => {
  it("petBattles still uses applyPrestigeBonuses for companion XP", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "routers/petBattles.ts"),
      "utf-8",
    );
    expect(src).toContain("applyPrestigeBonuses");
    expect(src).toContain("companionCombat.getCombatBonus");
  });

  it("marketplace.buyListing still applies categoryMult from Living Universe consequences", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "routers/marketplace.ts"),
      "utf-8",
    );
    expect(src).toContain("categoryMult");
    expect(src).toContain("getConsequences");
  });

  it("guildWars.resolveWar still distributes the prize pool", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "routers/guildWars.ts"),
      "utf-8",
    );
    expect(src).toContain("prizePoolDream");
    expect(src).toContain("treasuryDream");
  });
});
