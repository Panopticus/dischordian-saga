// apps/shared/npcs/__tests__/banks.wraith_calder.pen_pause_wall_sai.test.ts
//
// Phase 6d.3 part-4 verification — Hierophant pen-pause + Long-
// Mourning wall + sacrifice-axis-inversion bank (~20 new lines).
//
// Coverage:
//   Pen-pause listening-windows (×5) — per §5.8 + §1.7 Tell #5
//   Long-Mourning wall name-recovery (×5) — per §3.3 trust-arc + §1.6
//   Sacrifice-axis-inversion teaching (×10) — per §3.3 SAI canon
//     - 5 pre-Inheriting teaching
//     - 5 post-Inheriting companion-register

import { describe, it, expect } from "vitest";
import { WRAITH_CALDER_BANK } from "../banks/wraith_calder";
import { allRegisteredFlags } from "../crossCharacterReactions";

const PEN_PAUSE_LINES = WRAITH_CALDER_BANK.filter((l) =>
  l.lineId.startsWith("hierophant.post_arena.pen_pause."),
);

const WALL_LINES = WRAITH_CALDER_BANK.filter((l) =>
  l.lineId.startsWith("hierophant.post_arena.wall."),
);

const SAI_PRE_LINES = WRAITH_CALDER_BANK.filter((l) =>
  l.lineId.startsWith("hierophant.post_arena.sai.pre."),
);

const SAI_POST_LINES = WRAITH_CALDER_BANK.filter((l) =>
  l.lineId.startsWith("hierophant.post_arena.sai.post."),
);

describe("Pen-pause listening-window bank", () => {
  it("ships ≥5 pen-pause lines", () => {
    expect(PEN_PAUSE_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("every pen-pause line gates post_arena reveal-stage", () => {
    for (const l of PEN_PAUSE_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("post_arena");
    }
  });

  it("most pen-pause lines use bracketed [stage-direction] format", () => {
    const bracketed = PEN_PAUSE_LINES.filter((l) => l.text.startsWith("["));
    expect(bracketed.length).toBeGreaterThanOrEqual(4);
  });

  it("oracle_dream_residue reacts to canonical Oracle disambiguation flag", () => {
    const l = PEN_PAUSE_LINES.find(
      (x) =>
        x.lineId ===
        "hierophant.post_arena.pen_pause.oracle_dream_residue",
    );
    expect(l?.reactsToPublicFlag).toBe(
      "oracle_disambiguated_player_from_clone",
    );
    expect(l?.text).toMatch(/canonical substrate-window/i);
  });

  it("shadow_tongue_alert lands canonical 'slowness is the resistance' canon", () => {
    const l = PEN_PAUSE_LINES.find(
      (x) =>
        x.lineId ===
        "hierophant.post_arena.pen_pause.shadow_tongue_alert",
    );
    expect(l?.text).toMatch(/Shadow Tongue/);
    expect(l?.text).toMatch(/slowness is the resistance/i);
  });

  it("player_silence_held lands canonical 'half-beat is the gratitude' canon", () => {
    const l = PEN_PAUSE_LINES.find(
      (x) =>
        x.lineId ===
        "hierophant.post_arena.pen_pause.player_silence_held",
    );
    expect(l?.text).toMatch(/half-beat is the gratitude/i);
  });

  it("name_pen_lifts lands canonical 'A small silence. Then a period. Complete.' canon", () => {
    const l = PEN_PAUSE_LINES.find(
      (x) =>
        x.lineId === "hierophant.post_arena.pen_pause.name_pen_lifts",
    );
    expect(l?.text).toMatch(/pen lifts/i);
    expect(l?.text).toMatch(/A small silence/i);
    expect(l?.text).toMatch(/Then a period\. Complete/i);
  });

  it("substrate_window_canonical lands canonical 'pause is canonically when I listen for the voice' canon", () => {
    const l = PEN_PAUSE_LINES.find(
      (x) =>
        x.lineId ===
        "hierophant.post_arena.pen_pause.substrate_window_canonical",
    );
    expect(l?.text).toMatch(/pause is canonically when\s+I listen for the voice/i);
    expect(l?.text).toMatch(/closest thing to a shared act/i);
  });
});

describe("Long-Mourning wall name-recovery bank", () => {
  it("ships ≥5 wall lines", () => {
    expect(WALL_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("every wall line gates post_arena reveal-stage", () => {
    for (const l of WALL_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("post_arena");
    }
  });

  it("thaloria_victim_added lands canonical 'forty-three years' research-wait canon", () => {
    const l = WALL_LINES.find(
      (x) => x.lineId === "hierophant.post_arena.wall.thaloria_victim_added",
    );
    expect(l?.text).toMatch(/Thaloria-victim/i);
    expect(l?.text).toMatch(/forty-three years/i);
  });

  it("name_misremembered lands canonical 'slowness is the resistance, and also the canonical-fallibility' canon", () => {
    const l = WALL_LINES.find(
      (x) => x.lineId === "hierophant.post_arena.wall.name_misremembered",
    );
    expect(l?.text).toMatch(/I misremembered/i);
    expect(l?.text).toMatch(/canonical-fallibility/i);
  });

  it("name_forgotten lands canonical 'unwriting is itself a memorial' canon", () => {
    const l = WALL_LINES.find(
      (x) => x.lineId === "hierophant.post_arena.wall.name_forgotten",
    );
    expect(l?.text).toMatch(/canonical-gap on the wall is the canonical-/i);
    expect(l?.text).toMatch(/shape of the loss/i);
  });

  it("name_recovered lands canonical 'closing is the canonical-relief' canon", () => {
    const l = WALL_LINES.find(
      (x) => x.lineId === "hierophant.post_arena.wall.name_recovered",
    );
    expect(l?.text).toMatch(/name has canonically returned/i);
    expect(l?.text).toMatch(/closing is the canonical-relief/i);
  });

  it("wall_completed_section lands canonical 'continuation is the point' canon", () => {
    const l = WALL_LINES.find(
      (x) =>
        x.lineId === "hierophant.post_arena.wall.wall_completed_section",
    );
    expect(l?.text).toMatch(/wall has canonically completed a row/i);
    expect(l?.text).toMatch(/continuation is the point/i);
  });
});

describe("Sacrifice-axis-inversion teaching — pre-Inheriting (×5)", () => {
  it("ships ≥5 pre-Inheriting SAI teaching lines", () => {
    expect(SAI_PRE_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("every pre-Inheriting SAI line gates Witnessed or Present band (canonical pre-apex)", () => {
    for (const l of SAI_PRE_LINES) {
      expect(["Witnessed", "Present"], l.lineId).toContain(
        l.requiresTrustBand,
      );
    }
  });

  it("proximity_paradox lands canonical 'closer / further' inversion canon", () => {
    const l = SAI_PRE_LINES.find(
      (x) =>
        x.lineId === "hierophant.post_arena.sai.pre.proximity_paradox",
    );
    expect(l?.text).toMatch(/closer you stand, the less I am the threat/i);
    expect(l?.text).toMatch(/further you\s+stand, the more I become it again/i);
  });

  it("tamarin_theology_intro lands canonical 'metabolizing is canonically not yours to perform' canon", () => {
    const l = SAI_PRE_LINES.find(
      (x) =>
        x.lineId ===
        "hierophant.post_arena.sai.pre.tamarin_theology_intro",
    );
    expect(l?.text).toMatch(/Tamarin theology/i);
    expect(l?.text).toMatch(/metabolizing is canonically not yours to perform/i);
  });

  it("companion_canon_intro lands canonical 'trust transforms threat into companion' canon", () => {
    const l = SAI_PRE_LINES.find(
      (x) =>
        x.lineId ===
        "hierophant.post_arena.sai.pre.companion_canon_intro",
    );
    expect(l?.text).toMatch(/transforms threat into companion/i);
  });

  it("body_metabolizes lands canonical 'three thousand years has calibrated the rate' canon", () => {
    const l = SAI_PRE_LINES.find(
      (x) =>
        x.lineId === "hierophant.post_arena.sai.pre.body_metabolizes",
    );
    expect(l?.text).toMatch(/three thousand years has calibrated/i);
  });
});

describe("Sacrifice-axis-inversion companion-register — post-Inheriting (×5)", () => {
  it("ships ≥5 post-Inheriting SAI companion-register lines", () => {
    expect(SAI_POST_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("every post-Inheriting SAI line gates Inheriting band (canonical apex)", () => {
    for (const l of SAI_POST_LINES) {
      expect(l.requiresTrustBand, l.lineId).toBe("Inheriting");
    }
  });

  it("companion_now lands canonical 'metabolism has canonically completed' canon", () => {
    const l = SAI_POST_LINES.find(
      (x) => x.lineId === "hierophant.post_arena.sai.post.companion_now",
    );
    expect(l?.text).toMatch(/We are companion now/i);
    expect(l?.text).toMatch(/canonical-metabolism has canonically completed/i);
    expect(l?.setsPublicFlags).toContain(
      "hierophant_companion_status_inherited",
    );
  });

  it("shared_meal lands canonical 'tea in the cupboard' canon", () => {
    const l = SAI_POST_LINES.find(
      (x) => x.lineId === "hierophant.post_arena.sai.post.shared_meal",
    );
    expect(l?.text).toMatch(/tea in the cupboard/i);
    expect(l?.text).toMatch(/seventy-three years/i);
  });

  it("protection_inverts lands canonical 'Council will protect you. From me' canon", () => {
    const l = SAI_POST_LINES.find(
      (x) =>
        x.lineId ===
        "hierophant.post_arena.sai.post.protection_inverts",
    );
    expect(l?.text).toMatch(/Council will\s+canonically protect you/i);
    expect(l?.text).toMatch(/From me/i);
    expect(l?.text).toMatch(/seventeen centuries/i);
  });

  it("death_as_witness lands canonical 'parallel inheritors / witness reserved' canon", () => {
    const l = SAI_POST_LINES.find(
      (x) =>
        x.lineId === "hierophant.post_arena.sai.post.death_as_witness",
    );
    expect(l?.text).toMatch(/canonical-witness is reserved for parallel inheritors/i);
    expect(l?.text).toMatch(/canonical-presence is the offering/i);
    expect(l?.setsPublicFlags).toContain(
      "hierophant_offered_canonical_deathbed_witness",
    );
  });

  it("successor_question lands canonical 'parallel-inheritor canon stands' canon", () => {
    const l = SAI_POST_LINES.find(
      (x) =>
        x.lineId === "hierophant.post_arena.sai.post.successor_question",
    );
    expect(l?.text).toMatch(/Council has its named junior priest/i);
    expect(l?.text).toMatch(/parallel-inheritor canon canonically\s+stands/i);
    expect(l?.text).toMatch(/more-than-one I had been waiting for/i);
  });
});

describe("§1.8 bridge canon — pen-pause + wall + SAI banks", () => {
  const allText = [
    ...PEN_PAUSE_LINES,
    ...WALL_LINES,
    ...SAI_PRE_LINES,
    ...SAI_POST_LINES,
  ]
    .map((l) => l.text)
    .join(" ");

  it("§1.8: NO contradicted-noun-caps in any post-arena bank line", () => {
    expect(allText).not.toMatch(/\bCALL\b/);
    expect(allText).not.toMatch(/\bGAPS\b/);
    expect(allText).not.toMatch(/\bSTOLE\b/);
    expect(allText).not.toMatch(/\bINSIDE\b/);
  });

  it("§1.8: NO 'spite, mostly' canonical (Wraith Calder vocabulary only)", () => {
    expect(allText.toLowerCase()).not.toContain("spite, mostly");
  });

  it("§1.8: NO 'get up' canonical (Hierophant outgrew the imperative)", () => {
    expect(allText).not.toMatch(/\bGet up\b/);
  });

  it("§1.6 sacred vocabulary canonical: continuation-stem present (canonical anchor)", () => {
    // canonical Hierophant sacred vocabulary canonically lands at
    // least the continuation-stem across the part-4 banks (the
    // pen-pause / wall / SAI surfaces canonically emphasize
    // continuation; remember(ing) lives canonically in §1.7
    // Tell #3 covenant lines elsewhere in the bank).
    expect(allText).toMatch(/\bcontinu(e|es|ation|ing)\b/i);
  });
});

describe("Cross-character public flag wiring (Phase 6d.3 part 4)", () => {
  it("hierophant_companion_status_inherited is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "hierophant_companion_status_inherited",
    );
  });

  it("hierophant_offered_canonical_deathbed_witness is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "hierophant_offered_canonical_deathbed_witness",
    );
  });

  it("oracle_disambiguated_player_from_clone (consumer) is registered", () => {
    // canonical: pen-pause oracle_dream_residue line consumes this flag
    expect(allRegisteredFlags()).toContain(
      "oracle_disambiguated_player_from_clone",
    );
  });
});

describe("Cumulative Hierophant bank density (Phase 6d.3 cumulative)", () => {
  it("Hierophant bank ≥55 entries (Phase 6d.3 parts 1-4 cumulative target)", () => {
    expect(WRAITH_CALDER_BANK.length).toBeGreaterThanOrEqual(55);
  });
});
