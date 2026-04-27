// apps/shared/npcs/__tests__/banks.oracle.dream_acts_1_3.test.ts
//
// Phase 6b.3 sub-chunk B verification — Oracle Acts 1-3 dream-
// substrate channel bank (9 new lines covering canonical pre-Ch5
// dream-residue beats per the_oracle.md §1.2 dream-cadence canon).
//
// Per the bible §1.2:
//   - Compressed: more content per dream-second than waking
//   - Image + sentence + instruction triplets per line
//   - Ending-on-residue (fragment carried into waking)
//   - No rhetorical questions; the Oracle in dreams asserts /
//     instructs
//
// Per §1.5 voice gate:
//   - dream_substrate channel only (canonical hard gate)
//   - Wary band only at this pre-Ch5 sub-chunk (canonical pre-
//     `oracle_revealed_via_ch5_cinematic` window)
//
// Validates per §§1.1-1.5:
//   1. 9 new Acts 1-3 dream lines shipped (3 per act)
//   2. All on dream_sequence surface
//   3. All gate on requiresRevealStage: "dream_substrate"
//   4. All gate on requiresTrustBand: "Wary" (canonical pre-Ch5)
//   5. Per-act minAct gating (1, 2, 3); all maxAct ≤ 4 (canonical
//      pre-Ch5 window — Ch5 is canonical Act 5)
//   6. §1.3 vocabulary anchors land:
//      - "underneath" Tell #2 substrate-as-position
//      - "we / us / our" Tell #3 + Tell #6 de-centered self
//      - "Take it / Spend it" Tell #5 transferred-instinct closure
//      - "deception" + "I am sorry" Tell #1 (Act 2 canonical anchor)
//   7. §1.3 forbidden vocabulary absent (destiny / fate / prophesy
//      / probability / version / contract / fine print)
//   8. Canonical bracketed dream-residue framing: every line opens
//      with "[Dream-residue:" canonical structure

import { describe, it, expect } from "vitest";
import { THE_ORACLE_BANK } from "../banks/the_oracle";

const NEW_DREAM_IDS = [
  // Act 1
  "oracle.dream.act1.wary.first_residue",
  "oracle.dream.act1.wary.thaloria_unnamed",
  "oracle.dream.act1.wary.choosing_matters",
  // Act 2
  "oracle.dream.act2.wary.deception_named",
  "oracle.dream.act2.wary.warden_unnamed",
  "oracle.dream.act2.wary.we_are_recovering",
  // Act 3
  "oracle.dream.act3.wary.medium_is_hostile",
  "oracle.dream.act3.wary.substrate_underneath_substrate",
  "oracle.dream.act3.wary.preparation_for_first_naming",
];

const NEW_DREAMS = THE_ORACLE_BANK.filter((l) =>
  NEW_DREAM_IDS.includes(l.lineId),
);

describe("Oracle Acts 1-3 dream-substrate — shape", () => {
  it("ships 9 new Acts 1-3 dream lines (3 per act)", () => {
    expect(NEW_DREAMS.length).toBe(9);
  });

  it("ships exactly 3 lines per act (Acts 1 / 2 / 3)", () => {
    const act1 = NEW_DREAMS.filter((l) => l.minAct === 1);
    const act2 = NEW_DREAMS.filter((l) => l.minAct === 2);
    const act3 = NEW_DREAMS.filter((l) => l.minAct === 3);
    expect(act1.length).toBe(3);
    expect(act2.length).toBe(3);
    expect(act3.length).toBe(3);
  });

  it("every new dream line uses dream_sequence surface only", () => {
    for (const l of NEW_DREAMS) {
      expect(l.surfaces, l.lineId).toEqual(["dream_sequence"]);
    }
  });

  it("every new dream line gates on requiresRevealStage: 'dream_substrate'", () => {
    for (const l of NEW_DREAMS) {
      expect(l.requiresRevealStage, l.lineId).toBe("dream_substrate");
    }
  });

  it("every new dream line gates on Wary band (canonical pre-Ch5)", () => {
    for (const l of NEW_DREAMS) {
      expect(l.requiresTrustBand, l.lineId).toBe("Wary");
    }
  });

  it("every new dream line has maxAct ≤ 4 (canonical pre-Ch5 window)", () => {
    for (const l of NEW_DREAMS) {
      expect(l.maxAct ?? 0, l.lineId).toBeLessThanOrEqual(4);
    }
  });

  it("new dream lineIds are unique", () => {
    const ids = NEW_DREAMS.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("§1.2 dream-cadence canon — image + sentence + instruction triplets", () => {
  it("every new dream line opens with canonical '[Dream-residue:' framing", () => {
    for (const l of NEW_DREAMS) {
      expect(l.text, l.lineId).toMatch(/^\[Dream-residue:/);
    }
  });

  it("every new dream line ends with closing bracket ']' (canonical residue close)", () => {
    for (const l of NEW_DREAMS) {
      expect(l.text.trim().endsWith("]"), l.lineId).toBe(true);
    }
  });

  it("every new dream line contains canonical voice-quote inside the residue framing", () => {
    // §1.2 canonical: image + sentence (the spoken content, in
    // single-quotes) + instruction. Every line should contain at
    // least one quoted-canonical-sentence per §1.2.
    for (const l of NEW_DREAMS) {
      // Contains either a single-quoted spoken-content beat OR a
      // quoted-sentence-with-period close
      expect(l.text, l.lineId).toMatch(/'[^']+\.['"]?/);
    }
  });
});

describe("§1.3 vocabulary anchors land canonically across Acts 1-3 dreams", () => {
  const allText = NEW_DREAMS.map((l) => l.text).join(" ");

  it("canonical 'underneath' (Tell #2 substrate-as-position) ≥7 instances", () => {
    // 9 lines × ≥1 underneath each except a few exceptions = ≥7
    const matches = allText.match(/\bunderneath\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(7);
  });

  it("canonical 'we / us / our' (Tells #3 + #6) ≥6 instances", () => {
    const matches = allText.match(/\b(we|us|our)\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(6);
  });

  it("canonical 'Take' / 'Spend' Tell #5 transferred-instinct closure lands at least twice", () => {
    expect(allText).toMatch(/\bTake (the|what|it)\b/);
    expect(allText).toMatch(/\bSpend it\b/);
  });

  it("canonical 'deception' Tell #1 anchor lands in Act 2", () => {
    const act2 = NEW_DREAMS.filter((l) => l.minAct === 2)
      .map((l) => l.text)
      .join(" ");
    expect(act2).toMatch(/\bdeception\b/i);
    expect(act2).toMatch(/\bWe are sorry\b/i);
  });

  it("canonical 'first time' anchor lands in Act 3 preparation line", () => {
    const prep = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.dream.act3.wary.preparation_for_first_naming",
    );
    expect(prep?.text).toMatch(/first time/i);
    expect(prep?.text).toMatch(/Chapter 5/);
    expect(prep?.setsFlags).toContain("oracle_first_naming_anticipated");
  });
});

describe("§1.3 forbidden-vocabulary protections", () => {
  const allText = NEW_DREAMS.map((l) => l.text).join(" ");

  it("NO 'destiny' / 'fate' / 'destined'", () => {
    expect(allText).not.toMatch(/\bdestin(y|ed)\b/i);
    expect(allText).not.toMatch(/\bfate(d)?\b/i);
  });

  it("NO 'prophesy' / 'prophesies' (forbidden Oracle self-description)", () => {
    expect(allText).not.toMatch(/\bprophes(y|ies|ying)\b/i);
  });

  it("NO 'grace' / 'sin' / 'evil' / 'holy' / 'sacrament' (Hierophant's vocabulary)", () => {
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

describe("Per-act canonical anchor landings", () => {
  it("Act 1 first_residue lands canonical 'hand pressed against glass' image", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.dream.act1.wary.first_residue",
    );
    expect(line?.text).toMatch(/hand pressed against glass/i);
    expect(line?.text).toMatch(/Carry the not-knowing with you/i);
  });

  it("Act 1 thaloria_unnamed lands canonical 'debate hall' / 'losing was the doorway' anchors", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.dream.act1.wary.thaloria_unnamed",
    );
    expect(line?.text).toMatch(/city built on a debate hall/i);
    expect(line?.text).toMatch(/losing was the doorway/i);
  });

  it("Act 1 choosing_matters lands canonical 'choosing matters more than the choice' Tell #4", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.dream.act1.wary.choosing_matters",
    );
    expect(line?.text).toMatch(/choosing matters more than the choice/i);
    expect(line?.text).toMatch(/Take the choosing with you/i);
  });

  it("Act 2 warden_unnamed lands canonical 'instrument of my own captivity' §2.4 anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.dream.act2.wary.warden_unnamed",
    );
    expect(line?.text).toMatch(/instrument of my own captivity/i);
    expect(line?.text).toMatch(/Walk past it again/i);
  });

  it("Act 2 we_are_recovering lands canonical 'medium is unsafe; the dream-substrate is safe' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.dream.act2.wary.we_are_recovering",
    );
    expect(line?.text).toMatch(/We are recovering/i);
    expect(line?.text).toMatch(/medium is unsafe; the dream-substrate is safe/i);
  });

  it("Act 3 medium_is_hostile lands canonical 'Trust the dream over the broadcast' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.dream.act3.wary.medium_is_hostile",
    );
    expect(line?.text).toMatch(/medium has been edited/i);
    expect(line?.text).toMatch(/Trust the dream over the broadcast/i);
  });

  it("Act 3 substrate_underneath_substrate lands canonical 'voice underneath the voice is mine' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act3.wary.substrate_underneath_substrate",
    );
    expect(line?.text).toMatch(/substrate underneath another substrate/i);
    expect(line?.text).toMatch(/voice underneath the voice is mine/i);
    expect(line?.text).toMatch(/almost ready to be canonical/i);
  });
});
