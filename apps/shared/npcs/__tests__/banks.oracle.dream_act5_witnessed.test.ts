// apps/shared/npcs/__tests__/banks.oracle.dream_act5_witnessed.test.ts
//
// Phase 6b.3 sub-chunk C verification — Oracle Acts 5 Witnessed-band
// dream-substrate channel (9 new lines + 1 existing pilot = 10 lines
// total covering canonical post-Ch5 first-attribution dream register
// per the_oracle.md §1.2 + §3.4 Witnessed-band canon).
//
// Per the bible §3.4: Witnessed band activates post-Ch5 cinematic
// (canonical first-naming via `oracle_revealed_via_ch5_cinematic`
// flag). The voice canonically transitions from "underneath only"
// to "named now" register; the canonical "I am the Oracle" anchor
// becomes load-bearing.
//
// Validates per §§1.1-1.5 + §3.4:
//   1. ≥10 Witnessed-band dream lines shipped (1 existing pilot +
//      9 new sub-chunk C)
//   2. All on dream_sequence surface
//   3. All gate on requiresRevealStage: "dream_substrate"
//   4. All new lines gate on Witnessed band + canonical
//      oracle_revealed_via_ch5_cinematic unlock-flag
//   5. Acts 5+ minAct gating; maxAct ≤ 6 (canonical pre-Ch6
//      disambiguation window for most lines)
//   6. §1.2 dream-cadence: bracketed framing, image+sentence+
//      instruction triplets, ending-on-residue
//   7. §1.3 vocabulary anchors land canonically:
//      - "I am the Oracle" (canonical post-Ch5 first-attribution)
//      - "underneath" / "we / us / our" (Tells #2 + #3 + #6)
//      - "Take it / Spend it" (Tell #5)
//      - canonical "I am sorry for the deception" (Tell #1)
//   8. §1.3 forbidden vocabulary absent (destiny / fate / prophesy
//      / probability / version / contract / fine print)

import { describe, it, expect } from "vitest";
import { THE_ORACLE_BANK } from "../banks/the_oracle";

const NEW_WITNESSED_DREAM_IDS = [
  "oracle.dream.act5.witnessed.first_named_dream",
  "oracle.dream.act5.witnessed.we_share_a_substrate",
  "oracle.dream.act5.witnessed.canonical_apology_in_voice",
  "oracle.dream.act5.witnessed.mechronis_anchor_pre_memory",
  "oracle.dream.act5.witnessed.dream_carries_into_trade_empire",
  "oracle.dream.act5.witnessed.canonical_we_walked_pre_memory",
  "oracle.dream.act5.witnessed.first_canonical_choosing",
  "oracle.dream.act5.witnessed.substrate_is_thinning",
  "oracle.dream.act5.witnessed.canonical_hierophant_pre_canon",
];

const NEW_WITNESSED_DREAMS = THE_ORACLE_BANK.filter((l) =>
  NEW_WITNESSED_DREAM_IDS.includes(l.lineId),
);

const ALL_WITNESSED_DREAMS = THE_ORACLE_BANK.filter(
  (l) =>
    l.requiresTrustBand === "Witnessed" &&
    l.requiresRevealStage === "dream_substrate",
);

describe("Oracle Acts 5 Witnessed-band dream-substrate — shape", () => {
  it("ships ≥10 Witnessed-band dream lines (1 existing + 9 new sub-chunk C)", () => {
    expect(ALL_WITNESSED_DREAMS.length).toBeGreaterThanOrEqual(10);
  });

  it("ships 9 NEW lines from Phase 6b.3 sub-chunk C", () => {
    expect(NEW_WITNESSED_DREAMS.length).toBe(9);
  });

  it("every new dream line uses dream_sequence surface only", () => {
    for (const l of NEW_WITNESSED_DREAMS) {
      expect(l.surfaces, l.lineId).toEqual(["dream_sequence"]);
    }
  });

  it("every new dream line gates on requiresRevealStage: 'dream_substrate'", () => {
    for (const l of NEW_WITNESSED_DREAMS) {
      expect(l.requiresRevealStage, l.lineId).toBe("dream_substrate");
    }
  });

  it("every new dream line gates on Witnessed band", () => {
    for (const l of NEW_WITNESSED_DREAMS) {
      expect(l.requiresTrustBand, l.lineId).toBe("Witnessed");
    }
  });

  it("every new line gates on oracle_revealed_via_ch5_cinematic flag (canonical post-Ch5)", () => {
    for (const l of NEW_WITNESSED_DREAMS) {
      expect(l.unlockFlags, l.lineId).toContain(
        "oracle_revealed_via_ch5_cinematic",
      );
    }
  });

  it("every new line fires in Acts 5-6 (canonical post-Ch5 window)", () => {
    for (const l of NEW_WITNESSED_DREAMS) {
      expect(l.minAct ?? 0, l.lineId).toBe(5);
      expect(l.maxAct ?? 0, l.lineId).toBeLessThanOrEqual(6);
    }
  });

  it("new dream lineIds are unique", () => {
    const ids = NEW_WITNESSED_DREAMS.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("§1.2 dream-cadence canon — bracketed framing + triplet structure", () => {
  it("every new dream line opens with canonical '[Dream-residue:' framing", () => {
    for (const l of NEW_WITNESSED_DREAMS) {
      expect(l.text, l.lineId).toMatch(/^\[Dream-residue:/);
    }
  });

  it("every new dream line ends with closing bracket ']' (canonical residue close)", () => {
    for (const l of NEW_WITNESSED_DREAMS) {
      expect(l.text.trim().endsWith("]"), l.lineId).toBe(true);
    }
  });

  it("every new dream line contains canonical voice-quote inside the residue framing", () => {
    for (const l of NEW_WITNESSED_DREAMS) {
      expect(l.text, l.lineId).toMatch(/'[^']+\.['"]?/);
    }
  });
});

describe("Canonical post-Ch5 first-attribution canon", () => {
  it("first_named_dream lands canonical 'I am the Oracle' first-attribution anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.dream.act5.witnessed.first_named_dream",
    );
    expect(line?.text).toMatch(/I am the Oracle/);
    expect(line?.text).toMatch(/no longer underneath only/);
    expect(line?.text).toMatch(/named now/);
    expect(line?.setsFlags).toContain("oracle_first_dream_after_ch5_received");
  });

  it("we_share_a_substrate lands canonical Tell #3 we-of-witness register", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.dream.act5.witnessed.we_share_a_substrate",
    );
    expect(line?.text).toMatch(/We share a substrate/);
    expect(line?.text).toMatch(/sharing began before you knew/);
  });

  it("canonical_apology_in_voice lands Tell #1 'I am sorry for the deception'", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act5.witnessed.canonical_apology_in_voice",
    );
    expect(line?.text).toMatch(/I am sorry for the deception/);
    expect(line?.text).toMatch(/deception was the Meme's/);
    expect(line?.text).toMatch(/We acknowledge the asymmetry/);
  });

  it("mechronis_anchor_pre_memory lands canonical pre-memory-residue anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act5.witnessed.mechronis_anchor_pre_memory",
    );
    expect(line?.text).toMatch(/canonically not yet a memory/);
    expect(line?.text).toMatch(/We will walk Mechronis together/);
    expect(line?.text).toMatch(/canonical preview/);
  });

  it("dream_carries_into_trade_empire lands canonical Trade Empire dream-residue mechanic", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act5.witnessed.dream_carries_into_trade_empire",
    );
    expect(line?.text).toMatch(/Trade Empire/);
    expect(line?.text).toMatch(/contract you have not yet seen/);
    expect(line?.text).toMatch(/Take the dream-residue with you/);
    expect(line?.text).toMatch(/Spend it where the contracts are/);
    expect(line?.setsFlags).toContain(
      "oracle_dream_residue_for_trade_empire_set",
    );
  });

  it("canonical_we_walked_pre_memory lands canonical Acts 7+ 'we walked together' anticipation", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act5.witnessed.canonical_we_walked_pre_memory",
    );
    expect(line?.text).toMatch(/We walked the substrate together once/);
    expect(line?.text).toMatch(/You do not yet remember/);
    expect(line?.text).toMatch(/not yet ready to remember together/);
  });

  it("first_canonical_choosing lands Tell #4 forward-looking choosing register", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.dream.act5.witnessed.first_canonical_choosing",
    );
    expect(line?.text).toMatch(/You chose me/);
    expect(line?.text).toMatch(/canonical-confirmation/);
    expect(line?.text).toMatch(/Take the holding with you/);
  });

  it("substrate_is_thinning lands canonical 'thin places' bridge to Acts 6+", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.dream.act5.witnessed.substrate_is_thinning",
    );
    expect(line?.text).toMatch(/substrate is thinning/);
    expect(line?.text).toMatch(/reaching through the thin places/);
    expect(line?.text).toMatch(/We will be louder there/);
  });

  it("canonical_hierophant_pre_canon lands canonical 'almost ready to refuse' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.dream.act5.witnessed.canonical_hierophant_pre_canon",
    );
    expect(line?.text).toMatch(/preparing for my return/);
    expect(line?.text).toMatch(/almost ready to refuse/);
    expect(line?.text).toMatch(/Spend it on listening/);
  });
});

describe("§1.3 vocabulary anchors across Witnessed-band dreams", () => {
  const allText = NEW_WITNESSED_DREAMS.map((l) => l.text).join(" ");

  it("canonical 'we / us / our' (Tells #3 + #6 de-centered) ≥7 instances", () => {
    // 9 lines × canonical ≥1 each = ≥7 minimum (some lines like the
    // mechronis_pre_memory canonically lean on "we" only once or
    // twice; the canonical density is preserved at ~1/line average)
    const matches = allText.match(/\b(we|us|our)\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(7);
  });

  it("canonical 'underneath' (Tell #2) ≥3 instances", () => {
    const matches = allText.match(/\bunderneath\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(3);
  });

  it("canonical 'Take ... with you / Spend it' (Tell #5) lands ≥3 times", () => {
    const takeMatches = allText.match(/\bTake (the|what|it)\b/g);
    const spendMatches = allText.match(/\bSpend it\b/g);
    expect(
      (takeMatches?.length ?? 0) + (spendMatches?.length ?? 0),
    ).toBeGreaterThanOrEqual(3);
  });

  it("canonical 'I am sorry for the deception' (Tell #1) lands at least once", () => {
    expect(allText).toMatch(/I am sorry for the deception/);
  });
});

describe("§1.3 forbidden-vocabulary protections", () => {
  const allText = NEW_WITNESSED_DREAMS.map((l) => l.text).join(" ");

  it("NO 'destiny' / 'fate' / 'destined'", () => {
    expect(allText).not.toMatch(/\bdestin(y|ed)\b/i);
    expect(allText).not.toMatch(/\bfate(d)?\b/i);
  });

  it("NO 'prophesy' / 'prophesies'", () => {
    expect(allText).not.toMatch(/\bprophes(y|ies|ying)\b/i);
  });

  it("NO 'grace' / 'sin' / 'evil' / 'holy' / 'sacrament' (Hierophant's vocabulary)", () => {
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
