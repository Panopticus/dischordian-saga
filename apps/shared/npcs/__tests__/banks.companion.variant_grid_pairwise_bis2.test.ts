// apps/shared/npcs/__tests__/banks.companion.variant_grid_pairwise_bis2.test.ts
//
// Phase 6c.2-bis-2 verification — Companion variant-grid pairwise
// expansion (8 faction × alignment + 8 faction × trust-pattern
// canonical 2-axis variants per dmc_clone_companion.md §1.5 + §5.5).
//
// Coverage:
//   - Faction × alignment pairwise (×8): coalition/insurgency/
//     hierarchy/ark × light/dark
//   - Faction × trust-pattern pairwise (×8): coalition/insurgency/
//     hierarchy/ark × gregarious_many/concentrated_few

import { describe, it, expect } from "vitest";
import { DMC_CLONE_COMPANION_BANK } from "../banks/dmc_clone_companion";

const FACTION_X_ALIGN_IDS = [
  "companion.named.variant.coalition_x_light",
  "companion.named.variant.coalition_x_dark",
  "companion.named.variant.insurgency_x_light",
  "companion.named.variant.insurgency_x_dark",
  "companion.named.variant.hierarchy_x_light",
  "companion.named.variant.hierarchy_x_dark",
  "companion.named.variant.ark_x_light",
  "companion.named.variant.ark_x_dark",
];

const FACTION_X_TRUST_IDS = [
  "companion.named.variant.coalition_x_gregarious",
  "companion.named.variant.coalition_x_concentrated",
  "companion.named.variant.insurgency_x_gregarious",
  "companion.named.variant.insurgency_x_concentrated",
  "companion.named.variant.hierarchy_x_gregarious",
  "companion.named.variant.hierarchy_x_concentrated",
  "companion.named.variant.ark_x_gregarious",
  "companion.named.variant.ark_x_concentrated",
];

const ALL_BIS2_IDS = [...FACTION_X_ALIGN_IDS, ...FACTION_X_TRUST_IDS];

const NEW_LINES = DMC_CLONE_COMPANION_BANK.filter((l) =>
  ALL_BIS2_IDS.includes(l.lineId),
);

describe("Companion variant-grid pairwise — Phase 6c.2-bis-2", () => {
  it("ships all 16 canonical variant lines", () => {
    expect(NEW_LINES.length).toBe(16);
  });

  it("every new line is owned by dmc_clone_companion", () => {
    for (const l of NEW_LINES) {
      expect(l.npcKey, l.lineId).toBe("dmc_clone_companion");
    }
  });

  it("every new line uses Channel-5 named-personality verbal register", () => {
    for (const l of NEW_LINES) {
      expect(l.expressionChannel, l.lineId).toBe("named_personality");
    }
  });

  it("every new line gates Inheriting + Inheriting + companion_named", () => {
    for (const l of NEW_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("Inheriting");
      expect(l.requiresTrustBand, l.lineId).toBe("Inheriting");
      expect(l.unlockFlags, l.lineId).toContain("companion_named");
    }
  });

  it("every new line carries cooldownKey + maxPlays cap", () => {
    for (const l of NEW_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });

  it("variant line ids are canonically unique", () => {
    const ids = NEW_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Faction × alignment pairwise variants", () => {
  for (const id of FACTION_X_ALIGN_IDS) {
    it(`${id} gates faction + alignment flags`, () => {
      const l = NEW_LINES.find((x) => x.lineId === id);
      expect(l, id).toBeDefined();
      const flags = l?.unlockFlags ?? [];
      const factionFlag = flags.find((f) =>
        f.startsWith("player_dominant_faction_"),
      );
      const alignFlag = flags.find((f) => f.startsWith("player_alignment_"));
      expect(factionFlag, id).toBeDefined();
      expect(alignFlag, id).toBeDefined();
    });
  }

  it("coalition_x_light lands canonical mortality-facing × mercy canon", () => {
    const l = NEW_LINES.find(
      (x) => x.lineId === "companion.named.variant.coalition_x_light",
    );
    expect(l?.text).toMatch(/canonical-Coalition/);
    expect(l?.text).toMatch(/grieving/i);
  });

  it("hierarchy_x_dark lands canonical filing-without-apology canon", () => {
    const l = NEW_LINES.find(
      (x) => x.lineId === "companion.named.variant.hierarchy_x_dark",
    );
    expect(l?.text).toMatch(/canonical-Hierarchy canonical-files/);
    expect(l?.text).toMatch(/without canonical-apology/);
  });

  it("ark_x_dark lands canonical archive-of-actual canon", () => {
    const l = NEW_LINES.find(
      (x) => x.lineId === "companion.named.variant.ark_x_dark",
    );
    expect(l?.text).toMatch(/archive canonical-of canonical-the canonical-actual/);
  });
});

describe("Faction × trust-pattern pairwise variants", () => {
  for (const id of FACTION_X_TRUST_IDS) {
    it(`${id} gates faction + trust-pattern flags`, () => {
      const l = NEW_LINES.find((x) => x.lineId === id);
      expect(l, id).toBeDefined();
      const flags = l?.unlockFlags ?? [];
      const factionFlag = flags.find((f) =>
        f.startsWith("player_dominant_faction_"),
      );
      const trustFlag = flags.find((f) =>
        f.startsWith("player_trust_pattern_"),
      );
      expect(factionFlag, id).toBeDefined();
      expect(trustFlag, id).toBeDefined();
    });
  }

  it("insurgency_x_concentrated lands canonical tight-cell canon", () => {
    const l = NEW_LINES.find(
      (x) => x.lineId === "companion.named.variant.insurgency_x_concentrated",
    );
    expect(l?.text).toMatch(/canonical-Insurgency canonical-cell/);
    expect(l?.text).toMatch(/canonical-final/);
  });

  it("ark_x_gregarious lands canonical keeping-many canon", () => {
    const l = NEW_LINES.find(
      (x) => x.lineId === "companion.named.variant.ark_x_gregarious",
    );
    expect(l?.text).toMatch(/keeping-many/);
  });
});

describe("Canonical donor-state-derivation anchors (§1.5)", () => {
  const allText = NEW_LINES.map((l) => l.text).join(" ");

  it("'Both canonical-shapes are canonical-mine' anchor lands across all 16 variants", () => {
    const matches = allText.match(/Both canonical-shapes are canonical-mine/gi) ?? [];
    expect(matches.length).toBe(16);
  });
});

describe("Pairwise variants canonically reference BOTH axes (≥3 unlockFlags)", () => {
  it("each pairwise variant gates ≥3 flags (companion_named + 2 axis flags)", () => {
    for (const l of NEW_LINES) {
      expect((l.unlockFlags ?? []).length, l.lineId).toBeGreaterThanOrEqual(3);
    }
  });
});
