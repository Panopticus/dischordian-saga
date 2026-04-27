// apps/shared/npcs/__tests__/banks.companion.variant_grid_pairwise.test.ts
//
// Phase 6c.2-bis-1 verification — Companion variant-grid pairwise
// expansion (2 missing identity-chain seeds + 8 canonical 2-axis
// pairwise variants per dmc_clone_companion.md §1.5 + §5.5).
//
// Coverage:
//   - 2 missing identity-chain seeds (Student + Detective; Last +
//     Seeker shipped in Phase 6c.2 part 5)
//   - Faction × identity-chain pairwise (×4 canonical anchor combos)
//   - Alignment × identity-chain pairwise (×2)
//   - Trust-pattern × identity-chain pairwise (×2)

import { describe, it, expect } from "vitest";
import { DMC_CLONE_COMPANION_BANK } from "../banks/dmc_clone_companion";

const NEW_VARIANT_LINES = DMC_CLONE_COMPANION_BANK.filter((l) =>
  [
    "companion.named.variant.identity_chain_student",
    "companion.named.variant.identity_chain_detective",
    "companion.named.variant.coalition_x_last",
    "companion.named.variant.insurgency_x_seeker",
    "companion.named.variant.hierarchy_x_detective",
    "companion.named.variant.ark_x_student",
    "companion.named.variant.light_x_last",
    "companion.named.variant.dark_x_detective",
    "companion.named.variant.gregarious_x_seeker",
    "companion.named.variant.concentrated_x_last",
  ].includes(l.lineId),
);

describe("Companion variant-grid pairwise expansion — Phase 6c.2-bis-1", () => {
  it("ships ≥10 new variant-grid lines", () => {
    expect(NEW_VARIANT_LINES.length).toBeGreaterThanOrEqual(10);
  });

  it("every new line is owned by dmc_clone_companion", () => {
    for (const l of NEW_VARIANT_LINES) {
      expect(l.npcKey, l.lineId).toBe("dmc_clone_companion");
    }
  });

  it("every new line uses Channel-5 named-personality verbal register", () => {
    for (const l of NEW_VARIANT_LINES) {
      expect(l.expressionChannel, l.lineId).toBe("named_personality");
    }
  });

  it("every new line gates Inheriting + Inheriting + companion_named", () => {
    for (const l of NEW_VARIANT_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("Inheriting");
      expect(l.requiresTrustBand, l.lineId).toBe("Inheriting");
      expect(l.unlockFlags, l.lineId).toContain("companion_named");
    }
  });

  it("every new line carries cooldownKey + maxPlays cap", () => {
    for (const l of NEW_VARIANT_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });

  it("variant line ids are unique", () => {
    const ids = NEW_VARIANT_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Missing identity-chain seeds (Student + Detective)", () => {
  it("Student variant lands canonical 'receiving the canonical-saga' canon", () => {
    const l = NEW_VARIANT_LINES.find(
      (x) => x.lineId === "companion.named.variant.identity_chain_student",
    );
    expect(l?.text).toMatch(/Student-aligned/i);
    expect(l?.text).toMatch(/receiving the canonical-saga before canonical-claiming/i);
    expect(l?.text).toMatch(/shaping is what I am/i);
  });

  it("Detective variant lands canonical 'audit / evidence-gathering' canon", () => {
    const l = NEW_VARIANT_LINES.find(
      (x) => x.lineId === "companion.named.variant.identity_chain_detective",
    );
    expect(l?.text).toMatch(/Detective-aligned/i);
    expect(l?.text).toMatch(/canonical-audit/i);
    expect(l?.text).toMatch(/pattern-from-incomplete-data/i);
  });
});

describe("Faction × identity-chain pairwise variants", () => {
  it("coalition_x_last gates both faction + identity-chain flags", () => {
    const l = NEW_VARIANT_LINES.find(
      (x) => x.lineId === "companion.named.variant.coalition_x_last",
    );
    expect(l?.unlockFlags).toContain("player_dominant_faction_coalition");
    expect(l?.unlockFlags).toContain("dmc_identity_chain_completed");
    expect(l?.text).toMatch(/canonical-last canonical-ark/i);
  });

  it("insurgency_x_seeker gates both faction + Seeker flags", () => {
    const l = NEW_VARIANT_LINES.find(
      (x) => x.lineId === "companion.named.variant.insurgency_x_seeker",
    );
    expect(l?.unlockFlags).toContain("player_dominant_faction_insurgency");
    expect(l?.unlockFlags).toContain("player_identity_chain_seeker");
    expect(l?.text).toMatch(/canonical-asking does canonical-not canonical-/i);
  });

  it("hierarchy_x_detective lands canonical 'same instinct at different scales' canon", () => {
    const l = NEW_VARIANT_LINES.find(
      (x) => x.lineId === "companion.named.variant.hierarchy_x_detective",
    );
    expect(l?.unlockFlags).toContain("player_dominant_faction_hierarchy");
    expect(l?.unlockFlags).toContain("player_identity_chain_detective");
    expect(l?.text).toMatch(/same canonical-\s*instinct at canonical-different scales/i);
  });

  it("ark_x_student lands canonical 'preserving / receiving' convergence canon", () => {
    const l = NEW_VARIANT_LINES.find(
      (x) => x.lineId === "companion.named.variant.ark_x_student",
    );
    expect(l?.unlockFlags).toContain("player_dominant_faction_ark");
    expect(l?.unlockFlags).toContain("player_identity_chain_student");
    expect(l?.text).toMatch(/canonical-Ark canonical-preserves/i);
    expect(l?.text).toMatch(/canonical-Student canonical-receives/i);
  });
});

describe("Alignment × identity-chain pairwise variants", () => {
  it("light_x_last lands canonical 'this is the life I have' bounded-generosity canon", () => {
    const l = NEW_VARIANT_LINES.find(
      (x) => x.lineId === "companion.named.variant.light_x_last",
    );
    expect(l?.unlockFlags).toContain("player_dominant_alignment_light");
    expect(l?.unlockFlags).toContain("dmc_identity_chain_completed");
    expect(l?.text).toMatch(/canonical-life I have/i);
  });

  it("dark_x_detective lands canonical 'restraint beyond evidence' canon", () => {
    const l = NEW_VARIANT_LINES.find(
      (x) => x.lineId === "companion.named.variant.dark_x_detective",
    );
    expect(l?.unlockFlags).toContain("player_dominant_alignment_dark");
    expect(l?.unlockFlags).toContain("player_identity_chain_detective");
    expect(l?.text).toMatch(/canonical-restraint is canonical-mine/i);
  });
});

describe("Trust-pattern × identity-chain pairwise variants", () => {
  it("gregarious_x_seeker lands canonical 'asking-as-greeting' canon", () => {
    const l = NEW_VARIANT_LINES.find(
      (x) => x.lineId === "companion.named.variant.gregarious_x_seeker",
    );
    expect(l?.unlockFlags).toContain("player_trust_pattern_gregarious_many");
    expect(l?.unlockFlags).toContain("player_identity_chain_seeker");
    expect(l?.text).toMatch(/asking-as-greeting/i);
  });

  it("concentrated_x_last lands canonical 'going-deep-with-canonical-time-permitted' canon", () => {
    const l = NEW_VARIANT_LINES.find(
      (x) => x.lineId === "companion.named.variant.concentrated_x_last",
    );
    expect(l?.unlockFlags).toContain("player_trust_pattern_concentrated_few");
    expect(l?.unlockFlags).toContain("dmc_identity_chain_completed");
    expect(l?.text).toMatch(/going-deep/i);
    expect(l?.text).toMatch(/depth is canonical-mine/i);
  });
});

describe("Canonical donor-state-derivation anchor (§1.5)", () => {
  const allText = NEW_VARIANT_LINES.map((l) => l.text).join(" ");

  it("'shaping is what I am' anchor lands across multiple variants", () => {
    const matches = allText.match(/shaping is what I am/gi) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("'canonical-mine' anchor lands canonically across variants", () => {
    const matches = allText.match(/canonical-mine/gi) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(5);
  });
});

describe("Pairwise variants canonically reference BOTH axes", () => {
  it("each pairwise variant gates ≥2 axis-flags (canonical 2-axis canon)", () => {
    const pairwiseLines = NEW_VARIANT_LINES.filter((l) =>
      l.lineId.includes("_x_"),
    );
    for (const l of pairwiseLines) {
      // canonical: pairwise variants gate ≥3 flags (companion_named +
      // 2 axis flags)
      expect((l.unlockFlags ?? []).length, l.lineId).toBeGreaterThanOrEqual(3);
    }
  });
});
