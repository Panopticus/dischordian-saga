// apps/shared/npcs/__tests__/banks.vex.engineer_zero_hint.test.ts
//
// Phase 6b.2 sub-chunk D verification — Vex Solène engineer_zero_hint
// stage expansion (6 new lines + 2 existing pilot = 8 lines total
// covering Acts 4-5 Engineer-trace surfaces per writers'-guide spec).
//
// Per the plan:
//   "engineer_zero_hint (Acts 4-5, hint-but-not-confirmed): 8 lines —
//    Engineer-trace surfaces (vocabulary leakage, technical asides);
//    player axis-mercy gates whether the hint sharpens or softens"
//
// Per vex_solene.md §1.5 tell #3 (self-interrupting near recognition):
//   "When the Engineer's remnant inside her recognizes something she
//    shouldn't know, she breaks her own sentence. ... The break is
//    canon. She is *being* surprised, not performing surprise."
//
// Validates per §§1.5 + 1.6 + 2.7:
//   1. ≥8 engineer_zero_hint lines shipped (canonical 8-line target)
//   2. All gate on requiresRevealStage: "engineer_zero_hint"
//   3. New lines fire in Acts 4-5 (canonical hint window)
//   4. §1.6 silence-shape preserved across the chunk:
//      - NEVER "Engineer" / "Engineer Zero" aloud (hard rule)
//      - NEVER "Agent Zero" as self-name
//   5. §1.5 tell #3 self-interrupting break canonically lands in
//      ≥3 of the 6 new lines (the canonical "I —" / "—" pattern)
//   6. Canonical-anchor landings:
//      - card recognition "I — I have never seen it. I know that card."
//      - dog-tag recognition "I have not been told"
//      - Antiquarian-line "the speaker is — the speaker was —"
//      - designed-without-remembering "fingerprint is mine. The memory
//        is not. Both are honest."
//      - handwriting "two states of repair" §2.7 canon
//      - bench-metaphor-leakage "the mouth has more than the memory"

import { describe, it, expect } from "vitest";
import { VEX_SOLENE_BANK } from "../banks/vex_solene";

const HINT_LINES = VEX_SOLENE_BANK.filter(
  (l) => l.requiresRevealStage === "engineer_zero_hint",
);

const NEW_HINT_IDS = [
  "vex.hint.act4.card_recognition.coda_3",
  "vex.hint.act4.dog_tag_recognition",
  "vex.hint.act5.antiquarian_line_recognition",
  "vex.hint.act4.designed_without_remembering",
  "vex.hint.act5.engineer_trace_in_handwriting",
  "vex.hint.act4.bench_metaphor_leakage",
];

const NEW_HINT = VEX_SOLENE_BANK.filter((l) =>
  NEW_HINT_IDS.includes(l.lineId),
);

describe("Vex engineer_zero_hint stage — shape", () => {
  it("ships ≥8 engineer_zero_hint lines (canonical 8-line target)", () => {
    expect(HINT_LINES.length).toBeGreaterThanOrEqual(8);
  });

  it("ships 6 NEW lines from Phase 6b.2 sub-chunk D", () => {
    expect(NEW_HINT.length).toBe(6);
  });

  it("every engineer_zero_hint line gates on requiresRevealStage", () => {
    for (const l of HINT_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("engineer_zero_hint");
    }
  });

  it("every new line fires in Acts 4-5 (canonical hint window)", () => {
    for (const l of NEW_HINT) {
      expect(l.minAct ?? 0, l.lineId).toBeGreaterThanOrEqual(4);
      expect(l.minAct ?? 0, l.lineId).toBeLessThanOrEqual(5);
    }
  });

  it("hint lineIds are unique", () => {
    const ids = HINT_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every hint line is canonically once-per-playthrough", () => {
    for (const l of HINT_LINES) {
      expect(l.maxPlays, l.lineId).toBe(1);
    }
  });
});

describe("§1.5 tell #3 self-interrupting break canon (the canonical recognition tell)", () => {
  it("≥3 of the 6 new lines carry the canonical 'I —' / em-dash sentence-break", () => {
    // §1.5 tell #3: "she breaks her own sentence. *'I — I have never
    // seen it.'* *'I have not been told.'* The break is canon. She
    // is *being* surprised, not performing surprise."
    // We canonical-detect the canonical pattern: an em-dash or
    // hyphen surrounded by a sentence-break. Most plain text uses
    // the ASCII " — " (space-em-dash-space) pattern.
    const breaking = NEW_HINT.filter((l) =>
      / — | — — |. — /.test(l.text),
    );
    expect(breaking.length).toBeGreaterThanOrEqual(3);
  });

  it("card-recognition line lands the canonical 'Stop. Stop — play that again' opener", () => {
    const card = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.hint.act4.card_recognition.coda_3",
    );
    expect(card?.text).toMatch(/^Stop\. Stop —/);
    expect(card?.text).toMatch(/I know that card/);
    expect(card?.text).toMatch(/I — I have never seen it/);
    expect(card?.setsFlags).toContain("vex_coda_3_card_recognized");
  });

  it("dog-tag-recognition line lands the canonical 'I have not been told' canon", () => {
    const dogtag = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.hint.act4.dog_tag_recognition",
    );
    expect(dogtag?.text).toMatch(/I have not been told about it/i);
    expect(dogtag?.text).toMatch(/I — I should have been told/);
    expect(dogtag?.setsFlags).toContain("vex_engineer_dog_tag_recognized");
  });

  it("Antiquarian-line line lands the canonical 'speaker is — speaker was — speaker is not me' canon", () => {
    const antiq = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId === "vex.hint.act5.antiquarian_line_recognition",
    );
    expect(antiq?.text).toMatch(/Daniel said something just now/);
    expect(antiq?.text).toMatch(
      /The speaker is — the speaker was — the speaker is not me/,
    );
  });
});

describe("Engineer-trace canonical-anchor landings", () => {
  it("designed-without-remembering lands canonical 'fingerprint is mine. The memory is not. Both are honest.'", () => {
    // §1.5 tell #1 inventory-then-courtesy via the canonical
    // "Both are honest" close.
    const designed = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.hint.act4.designed_without_remembering",
    );
    expect(designed?.text).toMatch(/I designed this protocol/);
    expect(designed?.text).toMatch(/I do not remember designing/);
    expect(designed?.text).toMatch(/fingerprint is mine. The memory is not/);
    expect(designed?.text).toMatch(/Both are honest/);
  });

  it("handwriting line lands the canonical §2.7 'two states of repair' canon", () => {
    // §2.7 asymmetric cross-self relationship + §1.3 canonical
    // "two states of repair" register.
    const hand = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.hint.act5.engineer_trace_in_handwriting",
    );
    expect(hand?.text).toMatch(/my handwriting/);
    expect(hand?.text).toMatch(/hand is younger/);
    expect(hand?.text).toMatch(/two states of repair/);
  });

  it("bench-metaphor-leakage lands canonical 'the mouth has more than the memory' canon", () => {
    const bench = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.hint.act4.bench_metaphor_leakage",
    );
    expect(bench?.text).toMatch(/I said 'the bench'/);
    expect(bench?.text).toMatch(/Mechronis is in my mouth/);
    expect(bench?.text).toMatch(/Mechronis is not in my memory/);
    expect(bench?.text).toMatch(/mouth has more than the memory/);
  });
});

describe("§1.6 silence-shape protections (the bible's hardest rules)", () => {
  const allText = NEW_HINT.map((l) => l.text).join(" ");

  it("§1.5 rule 2: NO 'Engineer' or 'Engineer Zero' aloud anywhere", () => {
    // Critical: even when the Engineer's pattern fires through her,
    // she does NOT name him aloud. The bible's hardest single rule.
    expect(allText).not.toMatch(/\bEngineer( Zero)?\b/);
  });

  it("§1.5 rule 1: NO 'Agent Zero' self-naming patterns", () => {
    expect(allText).not.toMatch(/\bI am Agent Zero\b/i);
    expect(allText).not.toMatch(/\bcalled Agent Zero\b/i);
  });

  it("§1.6: NO 'I remember' implying Engineer's memories", () => {
    // §1.6 canon: "the lack-of-memory is canon and load-bearing."
    // The hint-stage register specifically frames the canonical
    // "I do not remember" / "the memory is not" disclosures.
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

describe("Engineer-trace surface coverage", () => {
  it("match surface: card-recognition canonical Coda-3 beat", () => {
    const card = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.hint.act4.card_recognition.coda_3",
    );
    expect(card?.surfaces).toEqual(["match"]);
  });

  it("cinematic surface: dog-tag + handwriting recognition", () => {
    const dogtag = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.hint.act4.dog_tag_recognition",
    );
    const hand = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.hint.act5.engineer_trace_in_handwriting",
    );
    expect(dogtag?.surfaces).toContain("cinematic");
    expect(hand?.surfaces).toContain("cinematic");
  });

  it("transmission surface: Antiquarian-line + bench-metaphor leakage", () => {
    const antiq = VEX_SOLENE_BANK.find(
      (l) =>
        l.lineId === "vex.hint.act5.antiquarian_line_recognition",
    );
    const bench = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.hint.act4.bench_metaphor_leakage",
    );
    expect(antiq?.surfaces).toContain("transmission");
    expect(bench?.surfaces).toContain("transmission");
  });

  it("trade_empire / npc_line surface: designed-without-remembering", () => {
    const designed = VEX_SOLENE_BANK.find(
      (l) => l.lineId === "vex.hint.act4.designed_without_remembering",
    );
    expect(designed?.surfaces).toContain("trade_empire");
    expect(designed?.surfaces).toContain("npc_line");
  });
});
