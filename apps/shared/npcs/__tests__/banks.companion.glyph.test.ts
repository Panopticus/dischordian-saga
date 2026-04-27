// apps/shared/npcs/__tests__/banks.companion.glyph.test.ts
//
// Phase 6c.2 part-2 verification — DMC Clone Companion Channel 1
// (glyph) bank expansion (~6 new lines covering the canonical 4
// glyph categories per dmc_clone_companion.md §1.2).
//
// Canonical glyph categories per §1.2:
//   - Recognition glyphs: small geometric mark, 1-2s duration
//   - Question glyphs: angular asymmetric with one missing edge, 4-6s
//   - Approval glyphs: closed balanced shape with mirror-symmetry
//   - Mourning glyphs: unraveling shape, 6-8s
//
// Coverage assertions:
//   - Question × {unmet_npc, morally_complex_choice} (2 lines)
//   - Approval × {faction_aligned_choice, trade_empire_route} (2 lines)
//   - Recognition × room_revisit (1 line)
//   - Mourning × faction_collapse (1 line)
//
// Voice / canon protections:
//   - All lines expressionChannel: "glyph"
//   - All lines render via [bracketed expression] format (canonical
//     non-verbal expression-bank convention)
//   - Visual-signature canon enforced (recognition 1-2s; question
//     4-6s; approval closed balanced symmetric; mourning unraveling)
//   - §1.1 channel-by-channel canon: glyph lines do NOT appear at
//     post-Wary trust bands until earned (gate canonical)
//   - Three-channel-minimum rule (§1.3): post-Witnessed glyphs
//     canonically partner with posture/sound; this test does not
//     enforce cross-channel landing (that's a runtime selector
//     concern), only that each glyph line is canonically authored
//     in the glyph register

import { describe, it, expect } from "vitest";
import { DMC_CLONE_COMPANION_BANK } from "../banks/dmc_clone_companion";

const GLYPH_LINES = DMC_CLONE_COMPANION_BANK.filter(
  (l) => l.expressionChannel === "glyph",
);

const NEW_GLYPH_LINES = GLYPH_LINES.filter(
  (l) =>
    l.lineId === "companion.expression.glyph.question_unmet_npc" ||
    l.lineId === "companion.expression.glyph.question_morally_complex_choice" ||
    l.lineId === "companion.expression.glyph.approval_faction_aligned_choice" ||
    l.lineId === "companion.expression.glyph.approval_trade_empire_route" ||
    l.lineId === "companion.expression.glyph.recognition_room_revisit" ||
    l.lineId === "companion.expression.glyph.mourning_faction_collapse",
);

describe("Companion Channel-1 glyph bank — Phase 6c.2 part 2 expansion", () => {
  it("ships ≥6 new glyph lines (Phase 6c.2 part 2 baseline)", () => {
    expect(NEW_GLYPH_LINES.length).toBeGreaterThanOrEqual(6);
  });

  it("total glyph-channel bank now ≥8 lines (2 prior + 6 new)", () => {
    expect(GLYPH_LINES.length).toBeGreaterThanOrEqual(8);
  });

  it("every glyph line is owned by dmc_clone_companion", () => {
    for (const l of NEW_GLYPH_LINES) {
      expect(l.npcKey, l.lineId).toBe("dmc_clone_companion");
    }
  });

  it("every glyph line carries expressionChannel: 'glyph'", () => {
    for (const l of NEW_GLYPH_LINES) {
      expect(l.expressionChannel, l.lineId).toBe("glyph");
    }
  });

  it("every glyph line includes 'expression' surface (non-verbal canonical)", () => {
    for (const l of NEW_GLYPH_LINES) {
      expect(l.surfaces, l.lineId).toContain("expression");
    }
  });

  it("every glyph line uses bracketed [expression] format (non-verbal canon)", () => {
    for (const l of NEW_GLYPH_LINES) {
      expect(l.text.startsWith("["), l.lineId).toBe(true);
      expect(l.text.endsWith("]"), l.lineId).toBe(true);
    }
  });

  it("every glyph line carries cooldownKey + maxPlays cap", () => {
    for (const l of NEW_GLYPH_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });

  it("glyph line ids are unique", () => {
    const ids = NEW_GLYPH_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Question glyph canon (§1.2)", () => {
  const questions = NEW_GLYPH_LINES.filter((l) =>
    l.lineId.includes("question"),
  );

  it("ships ≥2 question-glyph lines", () => {
    expect(questions.length).toBeGreaterThanOrEqual(2);
  });

  it("question-glyph: unmet_npc lands canonical 'angular, asymmetric, one edge missing' canon", () => {
    const unmet = NEW_GLYPH_LINES.find(
      (l) => l.lineId === "companion.expression.glyph.question_unmet_npc",
    );
    expect(unmet?.text).toMatch(/angular/i);
    expect(unmet?.text).toMatch(/asymmetric/i);
    expect(unmet?.text).toMatch(/one edge canonically\s+missing/);
  });

  it("question-glyph: morally_complex lands canonical 6s duration + soul-consistency-check canon", () => {
    const moral = NEW_GLYPH_LINES.find(
      (l) =>
        l.lineId ===
        "companion.expression.glyph.question_morally_complex_choice",
    );
    // canonical 4-6s duration per §1.2
    expect(moral?.text).toMatch(/holds 6 seconds/i);
    // canonical soul-consistency-check stance
    expect(moral?.text).toMatch(/has not yet answered themselves/i);
  });
});

describe("Approval glyph canon (§1.2)", () => {
  const approvals = NEW_GLYPH_LINES.filter((l) => l.lineId.includes("approval"));

  it("ships ≥2 approval-glyph lines", () => {
    expect(approvals.length).toBeGreaterThanOrEqual(2);
  });

  it("approval-glyph: faction_aligned lands canonical 'closed, balanced, mirror-symmetric' canon", () => {
    const aligned = NEW_GLYPH_LINES.find(
      (l) =>
        l.lineId ===
        "companion.expression.glyph.approval_faction_aligned_choice",
    );
    expect(aligned?.text).toMatch(/closed/i);
    expect(aligned?.text).toMatch(/balanced/i);
    expect(aligned?.text).toMatch(/mirror-symmetric/i);
    // canonical "approval canonically brief" canon
    expect(aligned?.text).toMatch(/Approval is canonically brief/);
    expect(aligned?.text).toMatch(/does not linger on agreement/i);
  });

  it("approval-glyph: trade_empire_route includes 'trade_empire' surface (channel-event-mapping canon)", () => {
    const route = NEW_GLYPH_LINES.find(
      (l) =>
        l.lineId ===
        "companion.expression.glyph.approval_trade_empire_route",
    );
    // canonical channel-event-mapping per §1.1: trade-empire events
    // canonically land in glyphs.
    expect(route?.surfaces).toContain("trade_empire");
    expect(route?.text).toMatch(/route-completion/i);
    expect(route?.text).toMatch(/posture-memory/i);
  });
});

describe("Recognition glyph canon (§1.2)", () => {
  it("recognition-glyph: room_revisit lands canonical 1-2s + slightly-more-confident canon", () => {
    const revisit = NEW_GLYPH_LINES.find(
      (l) =>
        l.lineId === "companion.expression.glyph.recognition_room_revisit",
    );
    // canonical 1-2s duration per §1.2
    expect(revisit?.text).toMatch(/1\.2 seconds/);
    // canonical soul-fragment-remembers-room canon
    expect(revisit?.text).toMatch(/remembers the room/i);
    // canonical "slightly more confident" (room-revisit canon)
    expect(revisit?.text).toMatch(/more confident/i);
  });
});

describe("Mourning glyph canon (§1.2 + §1.3 cross-channel canon)", () => {
  it("mourning-glyph: faction_collapse lands canonical 'unravels' + 7s canon", () => {
    const mourn = NEW_GLYPH_LINES.find(
      (l) =>
        l.lineId === "companion.expression.glyph.mourning_faction_collapse",
    );
    expect(mourn?.text).toMatch(/unravels/i);
    // canonical 6-8s duration per §1.2 (this line lands at 7s)
    expect(mourn?.text).toMatch(/7 seconds/);
    // canonical "soul-fragment remembers loss with greater fidelity"
    // per §1.2 most-expressive-pre-verbal-channel canon
    expect(mourn?.text).toMatch(/canonical-archive/i);
    expect(mourn?.text).toMatch(/has not yet finished noticing/i);
  });
});

describe("Trust-band gating (channel-by-channel canon §1.1)", () => {
  it("Wary-band glyphs available at lowest trust (recognition + question_unmet_npc canonical)", () => {
    const waryBand = NEW_GLYPH_LINES.filter(
      (l) => l.requiresTrustBand === "Wary",
    );
    // canonical pre-Witnessed accessible glyphs:
    // - question_unmet_npc (canonical first-encounter)
    // - recognition_room_revisit (canonical revisit recognition)
    expect(waryBand.length).toBeGreaterThanOrEqual(2);
  });

  it("Witnessed-band glyphs canonically gate above first-channel canon", () => {
    const witnessedBand = NEW_GLYPH_LINES.filter(
      (l) => l.requiresTrustBand === "Witnessed",
    );
    // canonical post-Wary glyphs:
    // - question_morally_complex (canonical soul-check)
    // - approval × 2 (canonical approval canonical)
    // - mourning_faction_collapse (canonical loss canon)
    expect(witnessedBand.length).toBeGreaterThanOrEqual(4);
  });
});

describe("Channel-by-channel canon — no verbal leakage", () => {
  it("no glyph line uses verbal-channel content (canonical non-verbal-only canon)", () => {
    for (const l of NEW_GLYPH_LINES) {
      // canonical bracketed-expression format = canonically non-verbal
      // The text canonically describes the visual glyph; it should NOT
      // contain quoted speech or first-person Companion statements.
      expect(l.text, l.lineId).not.toMatch(/"[^"]+"/);  // no quoted speech
      expect(l.text, l.lineId).not.toMatch(/^I /);      // no first-person opening
    }
  });

  it("no glyph line carries requiresRevealStage (channel-1 canonical pre-naming surface)", () => {
    for (const l of NEW_GLYPH_LINES) {
      // canonical channel-1 canonically operates pre-naming. Reveal-
      // stage gating canonically attaches to channel-4/5 lines, not
      // channel-1 glyphs.
      expect(l.requiresRevealStage, l.lineId).toBeUndefined();
    }
  });
});
