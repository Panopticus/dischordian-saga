// apps/shared/npcs/__tests__/banks.oracle.cinematic_exception.test.ts
//
// Phase 6b.3 sub-chunk G (FINAL) verification — Oracle cinematic-
// exception channel bank (12 new lines: 3 Ch5 + 3 Ch6 + 3 Ch10 +
// 3 Ch12 covering canonical waking-saga-time cinematic exceptions
// per the_oracle.md §1.5 + §2.8).
//
// Per the bible §1.5: cinematic-exception is the canonical waking-
// saga-time exception — the Oracle canonically may speak in
// cinematics without violating the dream-or-memory voice gate.
//
// Validates per §§1.5 + 2.8 + 2.9:
//   1. 12 new cinematic-exception lines shipped (3 per cinematic
//      scene × 4 scenes)
//   2. All on cinematic surface
//   3. All gate on requiresRevealStage: "cinematic_exception"
//   4. Per-cinematic minAct gating (5 / 6 / 10 / 12)
//   5. Canonical-flag gating: Ch5 expansions on
//      oracle_revealed_via_ch5_cinematic; Ch6/Ch10/Ch12 on
//      oracle_disambiguated_player_from_clone
//   6. Canonical-anchor landings per scene
//   7. §1.3 forbidden vocabulary absent
//   8. New cross-character flags registered:
//      oracle_fall_canon_witnessed (Ch12 Fall)
//      oracle_disappearance_canon_announced (Ch12 Disappearance)

import { describe, it, expect } from "vitest";
import { THE_ORACLE_BANK } from "../banks/the_oracle";
import { CROSS_CHARACTER_REACTIONS } from "../crossCharacterReactions";

const NEW_CH5_IDS = [
  "oracle.cinematic.ch5.eleven_chapters_canon",
  "oracle.cinematic.ch5.canonical_first_choosing",
  "oracle.cinematic.ch5.canonical_apology_first_attribution",
];

const NEW_CH6_IDS = [
  "oracle.cinematic.ch6.i_was_underneath",
  "oracle.cinematic.ch6.canonical_two_falsifications",
  "oracle.cinematic.ch6.disambiguation_closing",
];

const NEW_CH10_IDS = [
  "oracle.cinematic.ch10.template_canon",
  "oracle.cinematic.ch10.face_you_wear_canon",
  "oracle.cinematic.ch10.canonical_reveal_closing",
];

const NEW_CH12_IDS = [
  "oracle.cinematic.ch12.fall_arrives",
  "oracle.cinematic.ch12.revelation_arrives",
  "oracle.cinematic.ch12.canonical_disappearance_announced",
];

const ALL_NEW_IDS = [
  ...NEW_CH5_IDS,
  ...NEW_CH6_IDS,
  ...NEW_CH10_IDS,
  ...NEW_CH12_IDS,
];

const NEW_CH5 = THE_ORACLE_BANK.filter((l) => NEW_CH5_IDS.includes(l.lineId));
const NEW_CH6 = THE_ORACLE_BANK.filter((l) => NEW_CH6_IDS.includes(l.lineId));
const NEW_CH10 = THE_ORACLE_BANK.filter((l) =>
  NEW_CH10_IDS.includes(l.lineId),
);
const NEW_CH12 = THE_ORACLE_BANK.filter((l) =>
  NEW_CH12_IDS.includes(l.lineId),
);
const ALL_NEW = [...NEW_CH5, ...NEW_CH6, ...NEW_CH10, ...NEW_CH12];

describe("Oracle cinematic-exception sub-chunk G — shape", () => {
  it("ships 12 new cinematic-exception lines (3 per cinematic × 4 scenes)", () => {
    expect(ALL_NEW.length).toBe(12);
  });

  it("ships exactly 3 lines per cinematic (Ch5 / Ch6 / Ch10 / Ch12)", () => {
    expect(NEW_CH5.length).toBe(3);
    expect(NEW_CH6.length).toBe(3);
    expect(NEW_CH10.length).toBe(3);
    expect(NEW_CH12.length).toBe(3);
  });

  it("every new line uses cinematic surface only", () => {
    for (const l of ALL_NEW) {
      expect(l.surfaces, l.lineId).toEqual(["cinematic"]);
    }
  });

  it("every new line gates on requiresRevealStage: 'cinematic_exception'", () => {
    for (const l of ALL_NEW) {
      expect(l.requiresRevealStage, l.lineId).toBe("cinematic_exception");
    }
  });

  it("new cinematic lineIds are unique", () => {
    const ids = ALL_NEW.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every new line is canonically once-per-playthrough (maxPlays === 1)", () => {
    for (const l of ALL_NEW) {
      expect(l.maxPlays, l.lineId).toBe(1);
    }
  });
});

describe("Per-cinematic minAct gating", () => {
  it("Ch5 expansions have minAct === 5", () => {
    for (const l of NEW_CH5) {
      expect(l.minAct, l.lineId).toBe(5);
    }
  });

  it("Ch6 expansions have minAct === 6", () => {
    for (const l of NEW_CH6) {
      expect(l.minAct, l.lineId).toBe(6);
    }
  });

  it("Ch10 expansions have minAct === 10", () => {
    for (const l of NEW_CH10) {
      expect(l.minAct, l.lineId).toBe(10);
    }
  });

  it("Ch12 first-authored lines have minAct === 12", () => {
    for (const l of NEW_CH12) {
      expect(l.minAct, l.lineId).toBe(12);
    }
  });
});

describe("Canonical-flag gating per cinematic", () => {
  it("Ch5 lines gate on oracle_revealed_via_ch5_cinematic (canonical first-naming)", () => {
    for (const l of NEW_CH5) {
      expect(l.unlockFlags, l.lineId).toContain(
        "oracle_revealed_via_ch5_cinematic",
      );
    }
  });

  it("Ch6 / Ch10 / Ch12 lines gate on oracle_disambiguated_player_from_clone (canonical post-Ch6)", () => {
    for (const l of [...NEW_CH6, ...NEW_CH10, ...NEW_CH12]) {
      expect(l.unlockFlags, l.lineId).toContain(
        "oracle_disambiguated_player_from_clone",
      );
    }
  });
});

describe("Ch5 canonical anchor landings", () => {
  it("eleven_chapters_canon lands canonical 'eleven chapters of canonical-listening' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.cinematic.ch5.eleven_chapters_canon",
    );
    expect(line?.text).toMatch(/Eleven chapters of canonical-listening/);
    expect(line?.text).toMatch(
      /canonical-substrate, the canonical-voice-underneath/,
    );
  });

  it("canonical_first_choosing lands canonical Tell #4 'choose me instead of remember me' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.cinematic.ch5.canonical_first_choosing",
    );
    expect(line?.text).toMatch(/choose me instead of remember me/);
    expect(line?.text).toMatch(
      /Spend the choosing on canonical-walking-forward/,
    );
  });

  it("canonical_apology_first_attribution lands Tell #1 canonical 'I am sorry for the deception' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.cinematic.ch5.canonical_apology_first_attribution",
    );
    expect(line?.text).toMatch(/I am sorry for the deception/);
    expect(line?.text).toMatch(
      /canonical-asymmetry/,
    );
  });
});

describe("Ch6 canonical anchor landings", () => {
  it("i_was_underneath lands canonical 'I was underneath. I was not what they trusted.' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.cinematic.ch6.i_was_underneath",
    );
    expect(line?.text).toMatch(/I was underneath/);
    expect(line?.text).toMatch(/canonical-misplaced-trust/);
  });

  it("canonical_two_falsifications lands canonical two-layer falsification canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.cinematic.ch6.canonical_two_falsifications",
    );
    expect(line?.text).toMatch(
      /canonical-two falsifications canonically layered/,
    );
    expect(line?.text).toMatch(/Architect canonically made the canonical-clone/);
    expect(line?.text).toMatch(/Meme canonically wore the canonical-clone's face/);
  });

  it("disambiguation_closing lands canonical 'we canonically share the substrate now' closure", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.cinematic.ch6.disambiguation_closing",
    );
    expect(line?.text).toMatch(/canonical-disambiguation is canonical-complete/);
    expect(line?.text).toMatch(
      /We canonically share the substrate now/,
    );
  });
});

describe("Ch10 canonical anchor landings", () => {
  it("template_canon lands canonical 'they made him from my template' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.cinematic.ch10.template_canon",
    );
    expect(line?.text).toMatch(/canonical-Architect canonically used the canonical-template/);
    expect(line?.text).toMatch(/canonical-arising is not us/);
  });

  it("face_you_wear_canon lands canonical 'face you canonically wear is canonical-yours' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.cinematic.ch10.face_you_wear_canon",
    );
    expect(line?.text).toMatch(
      /canonical-face you canonically wear is canonical-yours/,
    );
    expect(line?.text).toMatch(/canonical-wearing is the canonical-choosing/);
  });

  it("canonical_reveal_closing lands canonical 'canonical-genetic-reveal is canonical-not-canonical-predetermined' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.cinematic.ch10.canonical_reveal_closing",
    );
    expect(line?.text).toMatch(
      /canonical-genetic-reveal is canonical-not-canonical-predetermined/,
    );
    expect(line?.text).toMatch(/canonical-you is canonical-what-you-canonically-choose/);
  });
});

describe("Ch12 fall-of-reality canonical anchor landings", () => {
  it("fall_arrives lands canonical Fall canonical-arrival anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.cinematic.ch12.fall_arrives",
    );
    expect(line?.text).toMatch(/canonical-Fall is canonically arriving/);
    expect(line?.text).toMatch(/canonical-substrate is canonically thinning/);
    expect(line?.text).toMatch(/canonically warned you the canonical-medium was unsafe/);
    expect(line?.setsFlags).toContain("oracle_fall_cinematic_witnessed");
    expect(line?.setsPublicFlags).toContain("oracle_fall_canon_witnessed");
  });

  it("revelation_arrives lands canonical 'content is canonical-deferred' Revelation canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.cinematic.ch12.revelation_arrives",
    );
    expect(line?.text).toMatch(/canonical-Revelation is canonically arriving/);
    expect(line?.text).toMatch(/canonical-content is canonical-deferred/);
    expect(line?.text).toMatch(/Take the canonical-arriving with you/);
  });

  it("canonical_disappearance_announced lands canonical Disappearance announcement", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.cinematic.ch12.canonical_disappearance_announced",
    );
    expect(line?.text).toMatch(/I canonically disappear at the canonical-end-of-time/);
    expect(line?.text).toMatch(/I am canonically already going/);
    expect(line?.text).toMatch(
      /canonical-people who canonically do not yet know we canonically existed/,
    );
    expect(line?.setsFlags).toContain(
      "oracle_disappearance_cinematic_witnessed",
    );
    expect(line?.setsPublicFlags).toContain(
      "oracle_disappearance_canon_announced",
    );
  });
});

describe("§1.3 forbidden-vocabulary protections", () => {
  const allText = ALL_NEW.map((l) => l.text).join(" ");

  it("NO 'destiny' / 'fate' / 'destined'", () => {
    expect(allText).not.toMatch(/\bdestin(y|ed)\b/i);
    expect(allText).not.toMatch(/\bfate(d)?\b/i);
  });

  it("NO 'prophesy' / 'prophesies'", () => {
    expect(allText).not.toMatch(/\bprophes(y|ies|ying)\b/i);
  });

  it("NO 'grace' / 'sin' / 'evil' / 'holy' / 'sacrament'", () => {
    expect(allText).not.toMatch(/\b(grace|sin|evil|holy|sacrament)\b/i);
  });

  it("NO 'probability' / 'version' (Seer's vocabulary)", () => {
    expect(allText).not.toMatch(/\bprobabilit(y|ies)\b/i);
    expect(allText).not.toMatch(/\bversion(s)?\b/i);
  });

  it("NO 'contract' / 'retainer' / 'fine print' (Locke's vocabulary)", () => {
    expect(allText).not.toMatch(/\b(retainer|fine print)\b/i);
    expect(allText).not.toMatch(/\bcontract(s|ed|ing)?\b/i);
  });
});

describe("Cross-character flag registry", () => {
  it("oracle_fall_canon_witnessed has a registry entry", () => {
    const entry = CROSS_CHARACTER_REACTIONS.find(
      (r) => r.flag === "oracle_fall_canon_witnessed",
    );
    expect(entry).toBeDefined();
    expect(entry?.setBy).toContain("the_oracle");
  });

  it("oracle_disappearance_canon_announced has a registry entry", () => {
    const entry = CROSS_CHARACTER_REACTIONS.find(
      (r) => r.flag === "oracle_disappearance_canon_announced",
    );
    expect(entry).toBeDefined();
    expect(entry?.setBy).toContain("the_oracle");
  });
});
