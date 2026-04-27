// apps/shared/npcs/__tests__/banks.wraith_calder.pre_arena.test.ts
//
// Phase 6d.3 part-2 verification — pre-arena Wraith Calder Ch3b bank
// (~15 lines covering Ghost's Gambit match-flow + seven deaths
// trust-band registers + Wolf-pack lore + pre-arena cross-references
// per wraith_calder.md §§1.2-1.4 + §2.1-2.2).
//
// Coverage:
//   Ghost's Gambit match-flow × 5 turn-states
//   Seven deaths × 4 trust-band registers (Hostile/Wary/Witnessed/Present)
//   Wolf-pack lore × 3 (per loreAchievements.ts 410-414)
//   Pre-arena cross-references × 3 (Vex / Locke / Seer)

import { describe, it, expect } from "vitest";
import { WRAITH_CALDER_BANK } from "../banks/wraith_calder";

const NEW_PRE_ARENA_LINES = WRAITH_CALDER_BANK.filter((l) =>
  [
    // Ghost's Gambit match-flow (5)
    "wraith.pre_arena.ch3b.match.opening_register",
    "wraith.pre_arena.ch3b.match.mid_game_first_blood",
    "wraith.pre_arena.ch3b.match.late_game_escalation",
    "wraith.pre_arena.ch3b.match.player_dominant",
    "wraith.pre_arena.ch3b.match.player_struggling",
    // Seven deaths × 4 trust bands (4)
    "wraith.pre_arena.seven_deaths.hostile_register",
    "wraith.pre_arena.seven_deaths.wary_register",
    "wraith.pre_arena.seven_deaths.witnessed_register",
    "wraith.pre_arena.seven_deaths.present_register",
    // Wolf-pack lore (3)
    "wraith.pre_arena.wolf.seven_days",
    "wraith.pre_arena.wolf.what_it_taught",
    "wraith.pre_arena.wolf.spite_origin",
    // Pre-arena cross-references (3)
    "wraith.pre_arena.cross.vex_as_coda_runner",
    "wraith.pre_arena.cross.locke_as_authority_fixed_point",
    "wraith.pre_arena.cross.seer_as_prophecy_domain",
  ].includes(l.lineId),
);

describe("Pre-arena Wraith Calder Ch3b bank — Phase 6d.3 part 2", () => {
  it("ships ≥15 new pre-arena lines", () => {
    expect(NEW_PRE_ARENA_LINES.length).toBeGreaterThanOrEqual(15);
  });

  it("every new line gates pre_arena reveal-stage", () => {
    for (const l of NEW_PRE_ARENA_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("pre_arena");
    }
  });

  it("every new line carries cooldownKey + maxPlays cap", () => {
    for (const l of NEW_PRE_ARENA_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });

  it("new line ids are unique", () => {
    const ids = NEW_PRE_ARENA_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Ghost's Gambit match-flow (×5 turn-states)", () => {
  const matchFlowLines = NEW_PRE_ARENA_LINES.filter((l) =>
    l.lineId.startsWith("wraith.pre_arena.ch3b.match."),
  );

  it("ships ≥5 match-flow lines", () => {
    expect(matchFlowLines.length).toBeGreaterThanOrEqual(5);
  });

  it("every match-flow line surfaces 'match'", () => {
    for (const l of matchFlowLines) {
      expect(l.surfaces, l.lineId).toContain("match");
    }
  });

  it("opening_register lands canonical 'eighth body / eighth deck' counting canon", () => {
    const l = matchFlowLines.find(
      (x) => x.lineId === "wraith.pre_arena.ch3b.match.opening_register",
    );
    expect(l?.text).toMatch(/Eighth body. Eighth deck/i);
  });

  it("mid_game_first_blood lands canonical 'data / Zero will want to know' canon", () => {
    const l = matchFlowLines.find(
      (x) =>
        x.lineId === "wraith.pre_arena.ch3b.match.mid_game_first_blood",
    );
    expect(l?.text).toMatch(/First blood/i);
    expect(l?.text).toMatch(/Zero will want to know/i);
  });

  it("late_game_escalation lands canonical 'system is INSIDE us' canon", () => {
    const l = matchFlowLines.find(
      (x) =>
        x.lineId === "wraith.pre_arena.ch3b.match.late_game_escalation",
    );
    expect(l?.text).toMatch(/canonical-death-eight territory/i);
    expect(l?.text).toMatch(/\bINSIDE\b/);
    // canonical Necromancer canon
    expect(l?.text).toMatch(/Necromancer's nanobots/i);
  });

  it("player_dominant lands canonical 'Come back ugly next time' canon", () => {
    const l = matchFlowLines.find(
      (x) => x.lineId === "wraith.pre_arena.ch3b.match.player_dominant",
    );
    expect(l?.text).toMatch(/Come back ugly next time/i);
  });

  it("player_struggling lands canonical 'Wrong move is better than no move' canon", () => {
    const l = matchFlowLines.find(
      (x) => x.lineId === "wraith.pre_arena.ch3b.match.player_struggling",
    );
    expect(l?.text).toMatch(/Wrong move is better than no move/i);
  });
});

describe("Seven deaths × 4 trust-band registers", () => {
  it("ships canonical Hostile / Wary / Witnessed / Present band lines", () => {
    const bands = ["Hostile", "Wary", "Witnessed", "Present"];
    for (const band of bands) {
      const l = NEW_PRE_ARENA_LINES.find(
        (x) =>
          x.lineId.startsWith("wraith.pre_arena.seven_deaths.") &&
          x.requiresTrustBand === band,
      );
      expect(l, `band ${band}`).toBeDefined();
    }
  });

  it("Hostile lands canonical 'eighth' threat canon", () => {
    const l = NEW_PRE_ARENA_LINES.find(
      (x) =>
        x.lineId === "wraith.pre_arena.seven_deaths.hostile_register",
    );
    expect(l?.text).toMatch(/seven/i);
    expect(l?.text).toMatch(/(eighth|out of my way)/i);
  });

  it("Witnessed lands canonical three-architects + body-by-body canon", () => {
    const l = NEW_PRE_ARENA_LINES.find(
      (x) =>
        x.lineId === "wraith.pre_arena.seven_deaths.witnessed_register",
    );
    // canonical three architects
    expect(l?.text).toMatch(/Mol'Garath/);
    expect(l?.text).toMatch(/Vox/);
    expect(l?.text).toMatch(/Warden/);
    // canonical "Each one solid" counting canon
    expect(l?.text).toMatch(/Each one solid/i);
  });

  it("Present lands canonical 'Don't mourn me if I drop. I'll be back.' canon", () => {
    const l = NEW_PRE_ARENA_LINES.find(
      (x) =>
        x.lineId === "wraith.pre_arena.seven_deaths.present_register",
    );
    expect(l?.text).toMatch(/Don't mourn me if I drop/i);
    expect(l?.text).toMatch(/I'll be back/i);
    // canonical mid-sentence pivot to ledger (Tell #4)
    expect(l?.text).toMatch(/whether YOU will come back/i);
  });
});

describe("Wolf-pack lore (×3, per loreAchievements.ts 410-414)", () => {
  const wolfLines = NEW_PRE_ARENA_LINES.filter((l) =>
    l.lineId.startsWith("wraith.pre_arena.wolf."),
  );

  it("ships ≥3 wolf-pack lines", () => {
    expect(wolfLines.length).toBeGreaterThanOrEqual(3);
  });

  it("seven_days lands canonical 'one day per body' symmetry canon", () => {
    const l = wolfLines.find(
      (x) => x.lineId === "wraith.pre_arena.wolf.seven_days",
    );
    expect(l?.text).toMatch(/seven days/i);
    expect(l?.text).toMatch(/One day per body/i);
  });

  it("what_it_taught lands canonical 'Patience earned, not granted' soul-tell canon", () => {
    const l = wolfLines.find(
      (x) => x.lineId === "wraith.pre_arena.wolf.what_it_taught",
    );
    expect(l?.text).toMatch(/Patience earned, not granted/i);
    // canonical "GAPS" caps for contradicted noun
    expect(l?.text).toMatch(/\bGAPS\b/);
  });

  it("spite_origin lands canonical 'Spite, mostly' honest-motive canon (§1.4 Tell #2)", () => {
    const l = wolfLines.find(
      (x) => x.lineId === "wraith.pre_arena.wolf.spite_origin",
    );
    expect(l?.text).toMatch(/Spite, mostly/i);
    // canonical 8-bodies-of-residue counting canon
    expect(l?.text).toMatch(/eight bodies of/i);
  });
});

describe("Pre-arena cross-references (×3)", () => {
  const crossLines = NEW_PRE_ARENA_LINES.filter((l) =>
    l.lineId.startsWith("wraith.pre_arena.cross."),
  );

  it("ships ≥3 cross-reference lines", () => {
    expect(crossLines.length).toBeGreaterThanOrEqual(3);
  });

  it("vex_as_coda_runner canonically does NOT name Vex by name (canonical name-protection canon)", () => {
    const l = crossLines.find(
      (x) => x.lineId === "wraith.pre_arena.cross.vex_as_coda_runner",
    );
    // canonical: "I won't say her name — she hasn't said it to me yet,
    // and I don't claim names that haven't been offered"
    expect(l?.text).toMatch(/Coda runs quiet/i);
    expect(l?.text).toMatch(/won't say her name/i);
    expect(l?.text).not.toMatch(/\bVex\b/);
  });

  it("locke_as_authority_fixed_point lands canonical 'Authority's fixed point' canon", () => {
    const l = crossLines.find(
      (x) =>
        x.lineId ===
        "wraith.pre_arena.cross.locke_as_authority_fixed_point",
    );
    expect(l?.text).toMatch(/Adjudicator Locke/);
    expect(l?.text).toMatch(/Authority's fixed point/i);
    // canonical "INSIDE us both" anchor
    expect(l?.text).toMatch(/\bINSIDE\b/);
  });

  it("seer_as_prophecy_domain lands canonical 'more bodies' canonical exchange canon", () => {
    const l = crossLines.find(
      (x) => x.lineId === "wraith.pre_arena.cross.seer_as_prophecy_domain",
    );
    expect(l?.text).toMatch(/Prophecy-domain/i);
    expect(l?.text).toMatch(/more bodies/i);
  });
});

describe("§§1.2-1.4 voice canon (pre-arena)", () => {
  const allText = NEW_PRE_ARENA_LINES.map((l) => l.text).join(" ");

  it("§1.3 vocabulary: 'bodies' canonical (not 'lives')", () => {
    expect(allText).toMatch(/\bbodies\b/i);
  });

  it("§1.3 vocabulary: 'INSIDE' caps anchor canonical", () => {
    expect(allText).toMatch(/\bINSIDE\b/);
  });

  it("§1.3 vocabulary: canonical 'spite' present (multiple lines)", () => {
    const matches = allText.match(/\bspite\b/gi) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("§1.2 cadence: selective caps for contradicted nouns (CALL / GAPS / STOLE / INSIDE / YOU)", () => {
    // canonical: at least 2 distinct ALLCAPS contradicted-noun
    // anchors across the bank
    const capsAnchors = ["CALL", "GAPS", "STOLE", "INSIDE", "YOU"];
    const present = capsAnchors.filter((a) =>
      new RegExp(`\\b${a}\\b`).test(allText),
    );
    expect(present.length).toBeGreaterThanOrEqual(2);
  });
});

describe("§1.8 bridge canon — pre-arena does NOT use Hierophant vocabulary", () => {
  const allText = NEW_PRE_ARENA_LINES.map((l) => l.text).join(" ");

  it("§1.8: NO 'continuation' canonical (Hierophant vocabulary)", () => {
    // canonical: "continuation" is canonical Hierophant only;
    // Wraith Calder canonically does not have this word
    expect(allText).not.toMatch(/\bcontinuation\b/i);
  });

  it("§1.8: NO 'liturgy' / 'ceremony' canonical (Hierophant vocabulary)", () => {
    expect(allText).not.toMatch(/\b(liturgy|ceremony|holy|scripture)\b/i);
  });

  it("§1.8: NO 'I will remember' canonical (Hierophant covenant phrase)", () => {
    // canonical: "I will remember" is canonical Hierophant covenant
    // language per §1.7 Tell #3; Wraith Calder canonically does
    // NOT use this exact phrase
    expect(allText).not.toMatch(/\bI will remember\b/i);
  });
});
