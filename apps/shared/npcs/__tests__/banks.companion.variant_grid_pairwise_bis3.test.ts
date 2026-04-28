// apps/shared/npcs/__tests__/banks.companion.variant_grid_pairwise_bis3.test.ts
//
// Phase 6c.2-bis-3 verification — Companion variant-grid pairwise
// expansion introducing the canonical SAGA-STATE axis (12 saga-state
// pairwise variants per dmc_clone_companion.md §1.5 + §5.5).
//
// Coverage:
//   - saga_oracle_recognized_post_ch6 × identity-chain (×4):
//     last / seeker / student / detective
//   - saga_hierophant_post_arena_witnessed × faction (×4):
//     coalition / insurgency / hierarchy / ark
//   - saga_meme_architect_fusion_revealed × alignment+trust (×4):
//     light / dark / gregarious_many / concentrated_few

import { describe, it, expect } from "vitest";
import { DMC_CLONE_COMPANION_BANK } from "../banks/dmc_clone_companion";

const ORACLE_X_IDENTITY_IDS = [
  "companion.named.variant.oracle_recognized_x_last",
  "companion.named.variant.oracle_recognized_x_seeker",
  "companion.named.variant.oracle_recognized_x_student",
  "companion.named.variant.oracle_recognized_x_detective",
];

const HIEROPHANT_X_FACTION_IDS = [
  "companion.named.variant.hierophant_post_arena_x_coalition",
  "companion.named.variant.hierophant_post_arena_x_insurgency",
  "companion.named.variant.hierophant_post_arena_x_hierarchy",
  "companion.named.variant.hierophant_post_arena_x_ark",
];

const MEME_X_AXIS_IDS = [
  "companion.named.variant.meme_revealed_x_light",
  "companion.named.variant.meme_revealed_x_dark",
  "companion.named.variant.meme_revealed_x_gregarious",
  "companion.named.variant.meme_revealed_x_concentrated",
];

const ALL_BIS3_IDS = [
  ...ORACLE_X_IDENTITY_IDS,
  ...HIEROPHANT_X_FACTION_IDS,
  ...MEME_X_AXIS_IDS,
];

const NEW_LINES = DMC_CLONE_COMPANION_BANK.filter((l) =>
  ALL_BIS3_IDS.includes(l.lineId),
);

describe("Companion variant-grid saga-state pairwise — Phase 6c.2-bis-3", () => {
  it("ships all 12 canonical saga-state variant lines", () => {
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

describe("saga_oracle × identity-chain pairwise variants", () => {
  for (const id of ORACLE_X_IDENTITY_IDS) {
    it(`${id} gates saga_oracle_recognized_post_ch6 + identity-chain flag`, () => {
      const l = NEW_LINES.find((x) => x.lineId === id);
      expect(l, id).toBeDefined();
      const flags = l?.unlockFlags ?? [];
      expect(flags, id).toContain("saga_oracle_recognized_post_ch6");
      const identityFlag = flags.find(
        (f) =>
          f.startsWith("player_identity_chain_") ||
          f === "dmc_identity_chain_completed",
      );
      expect(identityFlag, id).toBeDefined();
    });
  }

  it("oracle_recognized_x_last lands canonical 'late arrival' grief canon", () => {
    const l = NEW_LINES.find(
      (x) => x.lineId === "companion.named.variant.oracle_recognized_x_last",
    );
    expect(l?.text).toMatch(/canonical-late/);
    expect(l?.text).toMatch(/grief/);
  });

  it("oracle_recognized_x_detective lands canonical 're-read with Oracle-eyes' canon", () => {
    const l = NEW_LINES.find(
      (x) => x.lineId === "companion.named.variant.oracle_recognized_x_detective",
    );
    expect(l?.text).toMatch(/re-read the canonical-saga/);
    expect(l?.text).toMatch(/Oracle-eyes/);
  });
});

describe("saga_hierophant × faction pairwise variants", () => {
  for (const id of HIEROPHANT_X_FACTION_IDS) {
    it(`${id} gates saga_hierophant_post_arena_witnessed + faction flag`, () => {
      const l = NEW_LINES.find((x) => x.lineId === id);
      expect(l, id).toBeDefined();
      const flags = l?.unlockFlags ?? [];
      expect(flags, id).toContain("saga_hierophant_post_arena_witnessed");
      const factionFlag = flags.find((f) =>
        f.startsWith("player_dominant_faction_"),
      );
      expect(factionFlag, id).toBeDefined();
    });
  }

  it("hierophant_post_arena_x_insurgency lands canonical 'trust-the-Wraith-watch-the-Hierophant' canon", () => {
    const l = NEW_LINES.find(
      (x) =>
        x.lineId === "companion.named.variant.hierophant_post_arena_x_insurgency",
    );
    expect(l?.text).toMatch(/trust the canonical-Wraith-who-was/);
    expect(l?.text).toMatch(/watch the canonical-Hierophant-who-is/);
  });

  it("hierophant_post_arena_x_hierarchy lands canonical 'wall × record agreement' canon", () => {
    const l = NEW_LINES.find(
      (x) =>
        x.lineId === "companion.named.variant.hierophant_post_arena_x_hierarchy",
    );
    expect(l?.text).toMatch(/canonical-wall/);
    expect(l?.text).toMatch(/canonical-record/);
  });
});

describe("saga_meme × alignment+trust pairwise variants", () => {
  for (const id of MEME_X_AXIS_IDS) {
    it(`${id} gates saga_meme_architect_fusion_revealed + axis flag`, () => {
      const l = NEW_LINES.find((x) => x.lineId === id);
      expect(l, id).toBeDefined();
      const flags = l?.unlockFlags ?? [];
      expect(flags, id).toContain("saga_meme_architect_fusion_revealed");
      const axisFlag = flags.find(
        (f) =>
          f.startsWith("player_alignment_") ||
          f.startsWith("player_trust_pattern_"),
      );
      expect(axisFlag, id).toBeDefined();
    });
  }

  it("meme_revealed_x_light lands canonical 'grieving-without-cynicism' canon", () => {
    const l = NEW_LINES.find(
      (x) => x.lineId === "companion.named.variant.meme_revealed_x_light",
    );
    expect(l?.text).toMatch(/grieving-without-canonical-cynicism/);
  });

  it("meme_revealed_x_concentrated lands canonical 'few survived the revelation' canon", () => {
    const l = NEW_LINES.find(
      (x) => x.lineId === "companion.named.variant.meme_revealed_x_concentrated",
    );
    expect(l?.text).toMatch(/canonical-deep canonical-few/);
    expect(l?.text).toMatch(/canonical-survived canonical-the canonical-revelation/);
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
