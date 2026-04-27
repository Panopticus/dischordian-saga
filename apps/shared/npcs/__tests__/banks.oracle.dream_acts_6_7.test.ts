// apps/shared/npcs/__tests__/banks.oracle.dream_acts_6_7.test.ts
//
// Phase 6b.3 sub-chunk D verification — Oracle Acts 6-7 dream-
// substrate (5 Present-band + 4 Inheriting-band = 9 new lines
// covering canonical post-Ch6 disambiguation register + canonical
// pre-Disappearance Inheriting register per the_oracle.md §3.4).
//
// Validates per §§1.1-1.5 + §3.4:
//   1. 5 new Present-band Acts 6-7 dream lines + 4 new Inheriting-
//      band Acts 7+ dream lines = 9 total
//   2. All on dream_sequence surface
//   3. All gate on requiresRevealStage: "dream_substrate"
//   4. Present-band lines: requiresTrustBand "Present", canonical
//      gate on oracle_disambiguated_player_from_clone flag, minAct
//      6, maxAct ≤ 7
//   5. Inheriting-band lines: requiresTrustBand "Inheriting",
//      canonical gate on disambiguation flag, minAct 7, maxAct 7
//   6. §1.2 dream-cadence: bracketed framing + voice-quote +
//      ending-on-residue
//   7. Canonical-anchor landings:
//      - Present: "underneath the three" / "we walked together" /
//        "Warden" / "looking-underneath is the canonical-choosing"
//      - Inheriting: "I am about to canonically disappear" /
//        "Revelation is canonically arriving" / "almost ready to
//        refuse" / "we are canonically nearly done"
//   8. §1.3 forbidden vocabulary absent

import { describe, it, expect } from "vitest";
import { THE_ORACLE_BANK } from "../banks/the_oracle";

const NEW_PRESENT_IDS = [
  "oracle.dream.act6.present.post_disambiguation_co_presence",
  "oracle.dream.act7.present.mechronis_walked_together",
  "oracle.dream.act6.present.the_warden_named",
  "oracle.dream.act6.present.canonical_three_underneath_one",
  "oracle.dream.act6.present.dream_residue_oracle_decisions",
];

const NEW_INHERITING_IDS = [
  "oracle.dream.act7.inheriting.disappearance_imminent",
  "oracle.dream.act7.inheriting.canonical_revelation_arriving",
  "oracle.dream.act7.inheriting.almost_ready_to_refuse",
  "oracle.dream.act7.inheriting.canonical_we_are_nearly_done",
];

const ALL_NEW_IDS = [...NEW_PRESENT_IDS, ...NEW_INHERITING_IDS];

const NEW_PRESENT = THE_ORACLE_BANK.filter((l) =>
  NEW_PRESENT_IDS.includes(l.lineId),
);
const NEW_INHERITING = THE_ORACLE_BANK.filter((l) =>
  NEW_INHERITING_IDS.includes(l.lineId),
);
const ALL_NEW = [...NEW_PRESENT, ...NEW_INHERITING];

describe("Oracle Acts 6-7 dream-substrate — shape", () => {
  it("ships 9 new lines (5 Present + 4 Inheriting)", () => {
    expect(ALL_NEW.length).toBe(9);
  });

  it("ships exactly 5 new Present-band lines", () => {
    expect(NEW_PRESENT.length).toBe(5);
  });

  it("ships exactly 4 new Inheriting-band lines", () => {
    expect(NEW_INHERITING.length).toBe(4);
  });

  it("every new line uses dream_sequence surface only", () => {
    for (const l of ALL_NEW) {
      expect(l.surfaces, l.lineId).toEqual(["dream_sequence"]);
    }
  });

  it("every new line gates on requiresRevealStage: 'dream_substrate'", () => {
    for (const l of ALL_NEW) {
      expect(l.requiresRevealStage, l.lineId).toBe("dream_substrate");
    }
  });

  it("every new line gates on canonical disambiguation flag", () => {
    // Per writers'-guide spec: post-Ch6 dreams gate on the canonical
    // mirror-match-resolution flag.
    for (const l of ALL_NEW) {
      expect(l.unlockFlags, l.lineId).toContain(
        "oracle_disambiguated_player_from_clone",
      );
    }
  });

  it("new dream lineIds are unique", () => {
    const ids = ALL_NEW.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Present-band gating canon (Acts 6-7 post-Ch6 disambiguation)", () => {
  it("every Present-band line gates on Present trust band", () => {
    for (const l of NEW_PRESENT) {
      expect(l.requiresTrustBand, l.lineId).toBe("Present");
    }
  });

  it("Present-band lines fire in Acts 6-7", () => {
    for (const l of NEW_PRESENT) {
      expect(l.minAct ?? 0, l.lineId).toBeGreaterThanOrEqual(6);
      expect(l.maxAct ?? 0, l.lineId).toBeLessThanOrEqual(7);
    }
  });
});

describe("Inheriting-band gating canon (Acts 7+ pre-Disappearance)", () => {
  it("every Inheriting-band line gates on Inheriting trust band", () => {
    for (const l of NEW_INHERITING) {
      expect(l.requiresTrustBand, l.lineId).toBe("Inheriting");
    }
  });

  it("Inheriting-band lines fire in Act 7", () => {
    for (const l of NEW_INHERITING) {
      expect(l.minAct, l.lineId).toBe(7);
      expect(l.maxAct, l.lineId).toBe(7);
    }
  });
});

describe("§1.2 dream-cadence canon — bracketed framing", () => {
  it("every new line opens with canonical '[Dream-residue:' framing", () => {
    for (const l of ALL_NEW) {
      expect(l.text, l.lineId).toMatch(/^\[Dream-residue:/);
    }
  });

  it("every new line ends with canonical closing bracket ']'", () => {
    for (const l of ALL_NEW) {
      expect(l.text.trim().endsWith("]"), l.lineId).toBe(true);
    }
  });

  it("every new line contains canonical voice-quoted spoken content", () => {
    for (const l of ALL_NEW) {
      expect(l.text, l.lineId).toMatch(/'[^']+\.['"]?/);
    }
  });
});

describe("Present-band canonical anchor landings", () => {
  it("post_disambiguation_co_presence lands canonical 'You disambiguated me from the clone'", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act6.present.post_disambiguation_co_presence",
    );
    expect(line?.text).toMatch(/You disambiguated me from the clone/);
    expect(line?.text).toMatch(
      /We canonically share the substrate now/,
    );
    expect(line?.setsFlags).toContain("oracle_post_ch6_dream_received");
  });

  it("mechronis_walked_together lands canonical Acts 7+ 'we walked together' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act7.present.mechronis_walked_together",
    );
    expect(line?.text).toMatch(
      /We walked the Mechronis bench together/,
    );
    expect(line?.text).toMatch(/remembering is canonically beginning/);
  });

  it("the_warden_named lands canonical 'Warden / instrument-of-my-own-captivity' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.dream.act6.present.the_warden_named",
    );
    expect(line?.text).toMatch(/The Warden is the structure/);
    expect(line?.text).toMatch(/Enigma and the Programmer canonically destroyed it/);
    expect(line?.text).toMatch(/instrument-of-my-own-captivity/);
  });

  it("canonical_three_underneath_one lands canonical 'all three were me' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act6.present.canonical_three_underneath_one",
    );
    expect(line?.text).toMatch(/Prisoner.*Jailer.*False Prophet/);
    expect(line?.text).toMatch(/all three were me/);
    expect(line?.text).toMatch(/me is underneath the three/);
    expect(line?.text).toMatch(/looking-underneath is the canonical-choosing/);
  });

  it("dream_residue_oracle_decisions lands canonical 'contract I would canonically not sign' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act6.present.dream_residue_oracle_decisions",
    );
    expect(line?.text).toMatch(
      /contract I would canonically not sign/,
    );
    expect(line?.text).toMatch(
      /Take the canonical-not-signing with you/,
    );
  });
});

describe("Inheriting-band canonical anchor landings", () => {
  it("disappearance_imminent lands canonical 'I am about to canonically disappear' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act7.inheriting.disappearance_imminent",
    );
    expect(line?.text).toMatch(
      /I am about to canonically disappear/,
    );
    expect(line?.text).toMatch(/Take what we have shared with you/);
    expect(line?.text).toMatch(
      /canonical-people who do not yet know we existed/,
    );
    expect(line?.setsFlags).toContain(
      "oracle_disappearance_imminent_acknowledged",
    );
  });

  it("canonical_revelation_arriving lands canonical 'content is canonical-deferred' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act7.inheriting.canonical_revelation_arriving",
    );
    expect(line?.text).toMatch(
      /Revelation is canonically arriving/,
    );
    expect(line?.text).toMatch(/content is canonical-deferred/);
  });

  it("almost_ready_to_refuse lands canonical Hierophant cross-canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act7.inheriting.almost_ready_to_refuse",
    );
    expect(line?.text).toMatch(/Hierophant is canonically preparing/);
    expect(line?.text).toMatch(/almost ready to refuse/);
    expect(line?.text).toMatch(/Spend it on canonical-listening/);
  });

  it("canonical_we_are_nearly_done lands canonical pre-Disappearance closure register", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act7.inheriting.canonical_we_are_nearly_done",
    );
    expect(line?.text).toMatch(/We are canonically nearly done/);
    expect(line?.text).toMatch(/substrate is canonically about to/);
    expect(line?.text).toMatch(
      /canonical-people you canonically choose/,
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

  it("NO 'retainer' / 'fine print' (Locke's vocabulary)", () => {
    expect(allText).not.toMatch(/\b(retainer|fine print)\b/i);
  });
});

describe("§1.3 vocabulary anchors land canonically", () => {
  const allText = ALL_NEW.map((l) => l.text).join(" ");

  it("canonical 'we / us / our' (Tells #3 + #6) ≥7 instances across the chunk", () => {
    // 9 lines × canonical ~1 each = ≥7 minimum (canonical density
    // preserved despite some lines leaning on "underneath" or
    // "canonical" instead).
    const matches = allText.match(/\b(we|us|our)\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(7);
  });

  it("canonical 'underneath' (Tell #2) ≥3 instances", () => {
    const matches = allText.match(/\bunderneath\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(3);
  });

  it("canonical 'Take ... with you / Spend it' (Tell #5) ≥4 closures", () => {
    const takeMatches = allText.match(/\bTake (the|what|it)\b/g);
    const spendMatches = allText.match(/\bSpend it\b/g);
    expect(
      (takeMatches?.length ?? 0) + (spendMatches?.length ?? 0),
    ).toBeGreaterThanOrEqual(4);
  });

  it("canonical 'canonical' anchor density (Inheriting register signature) ≥15 instances", () => {
    // Inheriting register canonically intensifies the "canonical"
    // anchor density per the existing pilot line + new Inheriting
    // lines. Combined Present + Inheriting ≥15 is conservative.
    const matches = allText.match(/\bcanonical/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(15);
  });
});
