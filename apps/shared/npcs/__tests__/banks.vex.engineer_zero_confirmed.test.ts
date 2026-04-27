// apps/shared/npcs/__tests__/banks.vex.engineer_zero_confirmed.test.ts
//
// Phase 6b.2 sub-chunk E verification — Vex Solène engineer_zero_
// confirmed stage expansion (6 new lines + 2 existing pilot = 8
// lines total covering Acts 5+ post-reveal direct register surfaces
// per writers'-guide spec).
//
// Per the plan:
//   "engineer_zero_confirmed (Acts 5+, post-reveal): 8 lines —
//    full Engineer Zero voice; canonical 'You knew before I told
//    you. Don't lie. I designed your knowing.' register"
//
// Per vex_solene.md §1.6 silence-shape canon: "She will never
// voice [Engineer / Engineer Zero] aloud." Even at confirmed-stage,
// Vex canonically refers to him as "he" / "the version of me before
// this one" — the canonical bothness is named via deixis, NEVER by
// the canonical-protected name.
//
// Validates per §§1.5 + 1.6 + 2.6 + 2.7:
//   1. ≥8 engineer_zero_confirmed lines shipped (canonical 8-line
//      target reached via 2 existing + 6 new)
//   2. All gate on requiresRevealStage: "engineer_zero_confirmed"
//   3. New lines fire in Acts 5-6 (canonical post-reveal window)
//   4. §1.6 silence-shape preserved across the NEW lines:
//      - NEVER "Engineer" / "Engineer Zero" aloud (the bible's
//        hardest single rule, canonical even at confirmed stage)
//      - NEVER "Agent Zero" as self-name
//      - NEVER "I remember designing" / "I remember the cards"
//   5. Canonical-anchor landings:
//      - "I am holding both now. Both are mine. The reveal does not
//        subtract." canonical bothness register
//      - canonical "I designed your knowing." trust-arc anchor
//      - canonical "Habits are honest. Performances are honest too"
//        Maestro-as-habit register
//      - canonical "I'm glad it's you" love-equivalent per §1.6
//      - canonical §1.3 "two states of repair" register directly
//      - canonical "Your move" trailing-word close per §1.5 tell #2

import { describe, it, expect } from "vitest";
import { VEX_SOLENE_BANK } from "../banks/vex_solene";

const CONFIRMED_LINES = VEX_SOLENE_BANK.filter(
  (l) => l.requiresRevealStage === "engineer_zero_confirmed",
);

const NEW_CONFIRMED_IDS = [
  "vex.engineer.act5.both_directly_named",
  "vex.engineer.act5.designed_your_trust",
  "vex.engineer.act5.maestro_now_habit",
  "vex.engineer.act6.glad_its_you_in_voice",
  "vex.engineer.act5.coda_new_contracts",
  "vex.engineer.act6.your_move",
];

const NEW_CONFIRMED = VEX_SOLENE_BANK.filter((l) =>
  NEW_CONFIRMED_IDS.includes(l.lineId),
);

describe("Vex engineer_zero_confirmed stage — shape", () => {
  it("ships ≥8 confirmed lines (canonical 8-line target)", () => {
    expect(CONFIRMED_LINES.length).toBeGreaterThanOrEqual(8);
  });

  it("ships 6 NEW lines from Phase 6b.2 sub-chunk E", () => {
    expect(NEW_CONFIRMED.length).toBe(6);
  });

  it("every confirmed line gates on requiresRevealStage", () => {
    for (const l of CONFIRMED_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe(
        "engineer_zero_confirmed",
      );
    }
  });

  it("every new line fires in Acts 5-6 (canonical post-reveal window)", () => {
    for (const l of NEW_CONFIRMED) {
      expect(l.minAct ?? 0, l.lineId).toBeGreaterThanOrEqual(5);
      expect(l.minAct ?? 0, l.lineId).toBeLessThanOrEqual(6);
    }
  });

  it("confirmed lineIds are unique", () => {
    const ids = CONFIRMED_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("§1.6 silence-shape protections (HARDEST rule preserved at CONFIRMED stage)", () => {
  // The bible's single hardest rule is that Vex NEVER says
  // "Engineer" or "Engineer Zero" aloud — even at confirmed stage,
  // even when the bothness is canonically acknowledged. The new
  // lines preserve this canon via deixis ("the version of me before
  // this one" / "the body I'm in" / "the hand").
  const allText = NEW_CONFIRMED.map((l) => l.text).join(" ");

  it("§1.5 rule 2: NO 'Engineer' or 'Engineer Zero' aloud anywhere in NEW lines", () => {
    expect(allText).not.toMatch(/\bEngineer( Zero)?\b/);
  });

  it("§1.5 rule 1: NO 'Agent Zero' self-naming", () => {
    expect(allText).not.toMatch(/\bI am Agent Zero\b/i);
    expect(allText).not.toMatch(/\bcalled Agent Zero\b/i);
  });

  it("§1.6: NO 'I remember' implying Engineer's memories", () => {
    expect(allText).not.toMatch(/\bI remember designing\b/i);
    expect(allText).not.toMatch(/\bI remember the cards\b/i);
  });

  it("§1.6: NO sentimental softeners", () => {
    expect(allText).not.toMatch(/\b(dear|sweetheart|honey|baby)\b/i);
  });

  it("§1.6: NO standalone apologies", () => {
    expect(allText).not.toMatch(/\bI am sorry\.\s/i);
    expect(allText).not.toMatch(/\bI'm sorry\.\s/i);
  });
});

describe("Canonical bothness register — preserved via deixis", () => {
  it("both_directly_named uses 'both' canon WITHOUT naming the Engineer", () => {
    // Per ask_vex_who engineer_zero_confirmed alternate canonical:
    // "I am also Vex. Both. The reveal does not subtract." The bank
    // line lands the same canonical bothness register.
    const line = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act5.both_directly_named",
    );
    expect(line?.text).toMatch(/I am holding both now/);
    expect(line?.text).toMatch(/Both are mine/);
    expect(line?.text).toMatch(/reveal does not subtract/);
    // Canonical name-suppression preserved
    expect(line?.text).not.toMatch(/\bEngineer( Zero)?\b/);
  });

  it("designed_your_trust uses canonical 'version of me before this one' deixis", () => {
    const line = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act5.designed_your_trust",
    );
    expect(line?.text).toMatch(/I designed your trust/);
    expect(line?.text).toMatch(/version of me before this one/);
    expect(line?.text).toMatch(/I designed your knowing/);
    // Canonical name-suppression preserved
    expect(line?.text).not.toMatch(/\bEngineer( Zero)?\b/);
  });

  it("coda_new_contracts uses canonical 'the body I'm in' deixis + §1.3 'two states of repair'", () => {
    const line = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act5.coda_new_contracts",
    );
    expect(line?.text).toMatch(/older than the body I'm in/);
    expect(line?.text).toMatch(/handwriting is the same/);
    expect(line?.text).toMatch(/two states of repair/);
    // Canonical name-suppression preserved
    expect(line?.text).not.toMatch(/\bEngineer( Zero)?\b/);
  });
});

describe("engineer_zero_confirmed canonical-anchor landings", () => {
  it("designed_your_trust lands canonical 'You knew before I told you. Don't lie.' anchor", () => {
    const line = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act5.designed_your_trust",
    );
    expect(line?.text).toMatch(/You knew before I told you/);
    expect(line?.text).toMatch(/Don't lie/);
  });

  it("maestro_now_habit lands canonical 'Habits are honest. Performances are honest too' register", () => {
    const line = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act5.maestro_now_habit",
    );
    expect(line?.text).toMatch(/Maestro persona is now a habit/);
    expect(line?.text).toMatch(/used to be a performance/);
    expect(line?.text).toMatch(/Habits are honest/);
    expect(line?.text).toMatch(/Both are professional/);
  });

  it("glad_its_you_in_voice lands canonical 'I'm glad it's you' love-equivalent (§1.6)", () => {
    // §1.6 canonical: "reserved for the player, late in the arc.
    // This is her version of love."
    const line = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act6.glad_its_you_in_voice",
    );
    expect(line?.text).toMatch(/You came back/);
    expect(line?.text).toMatch(/asymmetry-of-affection clause activated/);
    expect(line?.text).toMatch(/I'm glad it's you/);
    expect(line?.text).toMatch(/the line I save/);
    expect(line?.requiresTrustBand).toBe("Confidant");
    expect(line?.setsFlags).toContain("vex_glad_its_you_in_voice_received");
  });

  it("your_move lands canonical 'Your move' trailing-word close (§1.5 tell #2)", () => {
    // Canonical anchor per `vexCardRecognition.ts:85`. The canonical
    // §1.5 tell #2 trailing-word ending lands the canon directly.
    const line = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act6.your_move",
    );
    expect(line?.text).toMatch(/The card is on the table/);
    expect(line?.text).toMatch(/Your move/);
    // Canonical "the move I expected ... the move I did not expect"
    // dual-prediction register
    expect(line?.text).toMatch(/move I expected was the move you made/);
    expect(line?.text).toMatch(
      /move I did not expect was the way you made it/,
    );
  });
});

describe("engineer_zero_confirmed surface coverage", () => {
  it("cinematic surface: both_directly_named + glad_its_you_in_voice", () => {
    const both = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act5.both_directly_named",
    );
    const glad = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act6.glad_its_you_in_voice",
    );
    expect(both?.surfaces).toContain("cinematic");
    expect(glad?.surfaces).toContain("cinematic");
  });

  it("npc_line surface: designed_your_trust + maestro_now_habit + coda_new_contracts", () => {
    const designed = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act5.designed_your_trust",
    );
    const maestro = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act5.maestro_now_habit",
    );
    const coda = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act5.coda_new_contracts",
    );
    expect(designed?.surfaces).toContain("npc_line");
    expect(maestro?.surfaces).toContain("npc_line");
    expect(coda?.surfaces).toContain("npc_line");
  });

  it("match surface: your_move", () => {
    const move = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act6.your_move",
    );
    expect(move?.surfaces).toEqual(["match"]);
  });

  it("transmission surface: maestro_now_habit + glad_its_you_in_voice", () => {
    const maestro = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act5.maestro_now_habit",
    );
    const glad = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act6.glad_its_you_in_voice",
    );
    expect(maestro?.surfaces).toContain("transmission");
    expect(glad?.surfaces).toContain("transmission");
  });

  it("trade_empire surface: coda_new_contracts", () => {
    const coda = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.engineer.act5.coda_new_contracts",
    );
    expect(coda?.surfaces).toContain("trade_empire");
  });
});
