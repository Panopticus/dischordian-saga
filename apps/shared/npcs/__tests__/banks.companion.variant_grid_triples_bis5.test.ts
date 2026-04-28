// apps/shared/npcs/__tests__/banks.companion.variant_grid_triples_bis5.test.ts
//
// Phase 6c.2-bis-5 verification — Companion variant-grid 3-axis
// triple expansion (4 canonical 3-axis canonical-anchor combos
// per dmc_clone_companion.md §1.5 + §5.5).
//
// Coverage — canonical-rare canonical-saga-states where canonical-
// three canonical-shapes canonically reinforce:
//   - oracle_x_coalition_x_last (canonical-cycle-bounded
//     canonical-survival-of-canonical-Oracle)
//   - hierophant_x_insurgency_x_light (canonical-faith-watched-
//     with-canonical-mercy)
//   - meme_x_dark_x_concentrated (canonical-deepest-audit-
//     survives-the-canonical-revelation)
//   - oracle_x_hierophant_x_detective (canonical-saga-coherence-
//     confirmed; the canonical 2-saga-state canonical-arc)

import { describe, it, expect } from "vitest";
import { DMC_CLONE_COMPANION_BANK } from "../banks/dmc_clone_companion";

const TRIPLE_IDS = [
  "companion.named.variant.oracle_x_coalition_x_last",
  "companion.named.variant.hierophant_x_insurgency_x_light",
  "companion.named.variant.meme_x_dark_x_concentrated",
  "companion.named.variant.oracle_x_hierophant_x_detective",
];

const NEW_LINES = DMC_CLONE_COMPANION_BANK.filter((l) =>
  TRIPLE_IDS.includes(l.lineId),
);

describe("Companion variant-grid 3-axis triples — Phase 6c.2-bis-5", () => {
  it("ships all 4 canonical triple variant lines", () => {
    expect(NEW_LINES.length).toBe(4);
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

  it("every triple gates ≥4 canonical flags (companion_named + 3 axis flags)", () => {
    for (const l of NEW_LINES) {
      expect((l.unlockFlags ?? []).length, l.lineId).toBeGreaterThanOrEqual(4);
    }
  });

  it("variant line ids are canonically unique", () => {
    const ids = NEW_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("oracle_x_coalition_x_last — canonical six-cycles canon", () => {
  const l = NEW_LINES.find(
    (x) => x.lineId === "companion.named.variant.oracle_x_coalition_x_last",
  );

  it("gates all three canonical axis flags", () => {
    expect(l?.unlockFlags).toContain("saga_oracle_recognized_post_ch6");
    expect(l?.unlockFlags).toContain("player_dominant_faction_coalition");
    expect(l?.unlockFlags).toContain("dmc_identity_chain_completed");
  });

  it("lands canonical six-cycle canon (canonical-six → canonical-seventh)", () => {
    expect(l?.text).toMatch(/canonical-Six canonical-canonical-cycles/);
    expect(l?.text).toMatch(/canonical-seventh canonical-canonical-return/);
  });
});

describe("hierophant_x_insurgency_x_light — canonical faith-watched-with-mercy", () => {
  const l = NEW_LINES.find(
    (x) =>
      x.lineId === "companion.named.variant.hierophant_x_insurgency_x_light",
  );

  it("gates all three canonical axis flags", () => {
    expect(l?.unlockFlags).toContain("saga_hierophant_post_arena_witnessed");
    expect(l?.unlockFlags).toContain("player_dominant_faction_insurgency");
    expect(l?.unlockFlags).toContain("player_alignment_light");
  });

  it("lands canonical 'questioner's mercy' canon", () => {
    expect(l?.text).toMatch(/questioner's canonical-mercy/);
    expect(l?.text).toMatch(/without canonical-canonical-cruelty/);
  });
});

describe("meme_x_dark_x_concentrated — canonical deepest-audit-survives", () => {
  const l = NEW_LINES.find(
    (x) => x.lineId === "companion.named.variant.meme_x_dark_x_concentrated",
  );

  it("gates all three canonical axis flags", () => {
    expect(l?.unlockFlags).toContain("saga_meme_architect_fusion_revealed");
    expect(l?.unlockFlags).toContain("player_alignment_dark");
    expect(l?.unlockFlags).toContain("player_trust_pattern_concentrated_few");
  });

  it("lands canonical 'lost nothing of the deep' canon", () => {
    expect(l?.text).toMatch(/lost canonical-canonical-nothing canonical-of canonical-canonical-the canonical-canonical-deep/);
  });
});

describe("oracle_x_hierophant_x_detective — canonical saga-coherence", () => {
  const l = NEW_LINES.find(
    (x) =>
      x.lineId === "companion.named.variant.oracle_x_hierophant_x_detective",
  );

  it("gates BOTH saga-state flags + identity-chain flag", () => {
    expect(l?.unlockFlags).toContain("saga_oracle_recognized_post_ch6");
    expect(l?.unlockFlags).toContain("saga_hierophant_post_arena_witnessed");
    expect(l?.unlockFlags).toContain("player_identity_chain_detective");
  });

  it("lands canonical 'two saga-state revelations on same arc' canon", () => {
    expect(l?.text).toMatch(/Two canonical-canonical-saga-state canonical-revelations/);
    expect(l?.text).toMatch(/canonical-self-consistent/);
  });
});

describe("Canonical donor-state-derivation triple anchor (§1.5)", () => {
  const allText = NEW_LINES.map((l) => l.text).join(" ");

  it("'All canonical-three canonical-shapes are canonical-mine' anchor lands across all 4 triples", () => {
    const matches = allText.match(/All canonical-three canonical-shapes are canonical-mine/gi) ?? [];
    expect(matches.length).toBe(4);
  });
});

describe("Cumulative variant-grid coverage closes the canonical-grid", () => {
  it("Companion bank now ships ≥54 variant-grid named-personality lines (10+16+12+12+4)", () => {
    const allVariants = DMC_CLONE_COMPANION_BANK.filter((l) =>
      l.lineId.startsWith("companion.named.variant."),
    );
    expect(allVariants.length).toBeGreaterThanOrEqual(54);
  });
});
