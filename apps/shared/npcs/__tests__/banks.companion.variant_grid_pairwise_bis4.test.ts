// apps/shared/npcs/__tests__/banks.companion.variant_grid_pairwise_bis4.test.ts
//
// Phase 6c.2-bis-4 verification — Companion variant-grid pairwise
// expansion (12 saga-state × remaining-axis canonical pairings per
// dmc_clone_companion.md §1.5 + §5.5).
//
// Coverage:
//   - saga_oracle × faction (×4): coalition / insurgency /
//     hierarchy / ark
//   - saga_hierophant × identity-chain (×4): last / seeker /
//     student / detective
//   - saga_meme × identity-chain (×4): last / seeker / student /
//     detective

import { describe, it, expect } from "vitest";
import { DMC_CLONE_COMPANION_BANK } from "../banks/dmc_clone_companion";

const ORACLE_X_FACTION_IDS = [
  "companion.named.variant.oracle_recognized_x_coalition",
  "companion.named.variant.oracle_recognized_x_insurgency",
  "companion.named.variant.oracle_recognized_x_hierarchy",
  "companion.named.variant.oracle_recognized_x_ark",
];

const HIEROPHANT_X_IDENTITY_IDS = [
  "companion.named.variant.hierophant_post_arena_x_last",
  "companion.named.variant.hierophant_post_arena_x_seeker",
  "companion.named.variant.hierophant_post_arena_x_student",
  "companion.named.variant.hierophant_post_arena_x_detective",
];

const MEME_X_IDENTITY_IDS = [
  "companion.named.variant.meme_revealed_x_last",
  "companion.named.variant.meme_revealed_x_seeker",
  "companion.named.variant.meme_revealed_x_student",
  "companion.named.variant.meme_revealed_x_detective",
];

const ALL_BIS4_IDS = [
  ...ORACLE_X_FACTION_IDS,
  ...HIEROPHANT_X_IDENTITY_IDS,
  ...MEME_X_IDENTITY_IDS,
];

const NEW_LINES = DMC_CLONE_COMPANION_BANK.filter((l) =>
  ALL_BIS4_IDS.includes(l.lineId),
);

describe("Companion variant-grid saga-state pairwise — Phase 6c.2-bis-4", () => {
  it("ships all 12 canonical saga-state × axis variant lines", () => {
    expect(NEW_LINES.length).toBe(12);
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

describe("saga_oracle × faction pairwise variants", () => {
  for (const id of ORACLE_X_FACTION_IDS) {
    it(`${id} gates saga_oracle_recognized_post_ch6 + faction flag`, () => {
      const l = NEW_LINES.find((x) => x.lineId === id);
      expect(l, id).toBeDefined();
      const flags = l?.unlockFlags ?? [];
      expect(flags, id).toContain("saga_oracle_recognized_post_ch6");
      const factionFlag = flags.find((f) =>
        f.startsWith("player_dominant_faction_"),
      );
      expect(factionFlag, id).toBeDefined();
    });
  }

  it("oracle_recognized_x_insurgency lands canonical Liberation-as-precedent canon", () => {
    const l = NEW_LINES.find(
      (x) => x.lineId === "companion.named.variant.oracle_recognized_x_insurgency",
    );
    expect(l?.text).toMatch(/Liberation/);
    expect(l?.text).toMatch(/Programmer canonical-and canonical-Enigma/);
  });

  it("oracle_recognized_x_ark lands canonical six-stage history archive canon", () => {
    const l = NEW_LINES.find(
      (x) => x.lineId === "companion.named.variant.oracle_recognized_x_ark",
    );
    expect(l?.text).toMatch(/Thalorian canonical-debater/);
    expect(l?.text).toMatch(/Liberated/);
    expect(l?.text).toMatch(/Returning/);
  });
});

describe("saga_hierophant × identity-chain pairwise variants", () => {
  for (const id of HIEROPHANT_X_IDENTITY_IDS) {
    it(`${id} gates saga_hierophant_post_arena_witnessed + identity-chain flag`, () => {
      const l = NEW_LINES.find((x) => x.lineId === id);
      expect(l, id).toBeDefined();
      const flags = l?.unlockFlags ?? [];
      expect(flags, id).toContain("saga_hierophant_post_arena_witnessed");
      const identityFlag = flags.find(
        (f) =>
          f.startsWith("player_identity_chain_") ||
          f === "dmc_identity_chain_completed",
      );
      expect(identityFlag, id).toBeDefined();
    });
  }

  it("hierophant_post_arena_x_last lands canonical 'mortality-as-doctrine' canon", () => {
    const l = NEW_LINES.find(
      (x) =>
        x.lineId === "companion.named.variant.hierophant_post_arena_x_last",
    );
    expect(l?.text).toMatch(/seven-deaths/);
    expect(l?.text).toMatch(/canonical-mortality-as-doctrine/);
  });

  it("hierophant_post_arena_x_detective lands canonical 'continuity confirmed' canon", () => {
    const l = NEW_LINES.find(
      (x) =>
        x.lineId === "companion.named.variant.hierophant_post_arena_x_detective",
    );
    expect(l?.text).toMatch(/continuity/);
    expect(l?.text).toMatch(/evidence-tracked/);
  });
});

describe("saga_meme × identity-chain pairwise variants", () => {
  for (const id of MEME_X_IDENTITY_IDS) {
    it(`${id} gates saga_meme_architect_fusion_revealed + identity-chain flag`, () => {
      const l = NEW_LINES.find((x) => x.lineId === id);
      expect(l, id).toBeDefined();
      const flags = l?.unlockFlags ?? [];
      expect(flags, id).toContain("saga_meme_architect_fusion_revealed");
      const identityFlag = flags.find(
        (f) =>
          f.startsWith("player_identity_chain_") ||
          f === "dmc_identity_chain_completed",
      );
      expect(identityFlag, id).toBeDefined();
    });
  }

  it("meme_revealed_x_last lands canonical 'eleven lost cycles' canon", () => {
    const l = NEW_LINES.find(
      (x) => x.lineId === "companion.named.variant.meme_revealed_x_last",
    );
    expect(l?.text).toMatch(/eleven canonical-canonical-cycles/);
    expect(l?.text).toMatch(/canonical-mark canonical-the canonical-canonical-eleven canonical-lost canonical-cycles/);
  });

  it("meme_revealed_x_detective lands canonical 'five-disguises audit' canon", () => {
    const l = NEW_LINES.find(
      (x) => x.lineId === "companion.named.variant.meme_revealed_x_detective",
    );
    expect(l?.text).toMatch(/five canonical-disguises/);
    expect(l?.text).toMatch(/Broadcast/);
    expect(l?.text).toMatch(/Stolen/);
    expect(l?.text).toMatch(/Quiet/);
    expect(l?.text).toMatch(/Real/);
    expect(l?.text).toMatch(/Replacement/);
  });
});

describe("Canonical donor-state-derivation anchor (§1.5)", () => {
  const allText = NEW_LINES.map((l) => l.text).join(" ");

  it("'Both canonical-shapes are canonical-mine' anchor lands across all 12 variants", () => {
    const matches = allText.match(/Both canonical-shapes are canonical-mine/gi) ?? [];
    expect(matches.length).toBe(12);
  });
});

describe("Saga-state pairwise variants gate ≥3 unlockFlags (canonical 2-axis canon)", () => {
  it("each pairwise variant gates ≥3 flags (companion_named + saga-state + axis flag)", () => {
    for (const l of NEW_LINES) {
      expect((l.unlockFlags ?? []).length, l.lineId).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("Cumulative variant-grid coverage", () => {
  it("Companion bank now ships ≥48 variant-grid named-personality lines (10+16+12+12 ≥ 50)", () => {
    const allVariants = DMC_CLONE_COMPANION_BANK.filter((l) =>
      l.lineId.startsWith("companion.named.variant."),
    );
    expect(allVariants.length).toBeGreaterThanOrEqual(50);
  });
});
