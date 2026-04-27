// apps/shared/npcs/__tests__/banks.oracle.memory_residue_a.test.ts
//
// Phase 6b.3 sub-chunk E verification — Oracle memory-residue
// channel bank, first half (10 new lines: 4 Mechronis expansion +
// 3 Origin + 3 Harvest covering canonical witnessed-memory scenes
// per the_oracle.md §1.2 + §2.x timeline).
//
// Per the bible §1.2 memory-residue cadence canon:
//   - Narrator-frame, NOT direct speech
//   - First-person-plural-of-witness ("we / us / our") canonical
//   - Past-tense-as-present-tense interleaving
//   - Canonical Oracle vocabulary anchors land
//
// Per §1.5 voice gate: memory_residue surface only.
//
// Validates per §§1.2 + 1.5 + 2.1 + 2.2 + 2.10 + cross-bible Seer
// §4.5 triple-anchored Mechronis canon:
//   1. 10 new memory-residue lines shipped (4 Mechronis + 3 Origin
//      + 3 Harvest)
//   2. All on memory_residue surface
//   3. All gate on requiresRevealStage: "memory_residue"
//   4. Canonical-flag gating per era:
//      - Mechronis: canonical follow-up to existing mechronis_engineer
//        (gates on oracle_mechronis_memory_witnessed)
//      - Origin: canonical post-Ch5 (oracle_revealed_via_ch5_cinematic)
//      - Harvest: canonical post-Ch6 (oracle_disambiguated_player_from_clone)
//   5. §1.2 cadence canon: every line uses canonical "we / us / our"
//      first-person-plural-of-witness; canonical past+present
//      interleaving; NO direct-speech inside memories
//   6. Canonical-anchor landings per scene
//   7. §1.3 forbidden vocabulary absent

import { describe, it, expect } from "vitest";
import { THE_ORACLE_BANK } from "../banks/the_oracle";

const NEW_MECHRONIS_IDS = [
  "oracle.memory_residue.mechronis_bench_witness_pre_match",
  "oracle.memory_residue.mechronis_staff_inheritance",
  "oracle.memory_residue.mechronis_year_long_conversation",
  "oracle.memory_residue.mechronis_engineer_burnt_card",
];

const NEW_ORIGIN_IDS = [
  "oracle.memory_residue.origin.debate_hall_entry",
  "oracle.memory_residue.origin.witnessable_soul_argument",
  "oracle.memory_residue.origin.collector_doorway",
];

const NEW_HARVEST_IDS = [
  "oracle.memory_residue.harvest.collector_arrives",
  "oracle.memory_residue.harvest.amnesia_onset",
  "oracle.memory_residue.harvest.last_thalorian_moment",
];

const ALL_NEW_IDS = [
  ...NEW_MECHRONIS_IDS,
  ...NEW_ORIGIN_IDS,
  ...NEW_HARVEST_IDS,
];

const NEW_MECHRONIS = THE_ORACLE_BANK.filter((l) =>
  NEW_MECHRONIS_IDS.includes(l.lineId),
);
const NEW_ORIGIN = THE_ORACLE_BANK.filter((l) =>
  NEW_ORIGIN_IDS.includes(l.lineId),
);
const NEW_HARVEST = THE_ORACLE_BANK.filter((l) =>
  NEW_HARVEST_IDS.includes(l.lineId),
);
const ALL_NEW = [...NEW_MECHRONIS, ...NEW_ORIGIN, ...NEW_HARVEST];

describe("Oracle memory-residue sub-chunk E — shape", () => {
  it("ships 10 new memory-residue lines (4 Mechronis + 3 Origin + 3 Harvest)", () => {
    expect(ALL_NEW.length).toBe(10);
  });

  it("ships exactly 4 Mechronis expansion lines", () => {
    expect(NEW_MECHRONIS.length).toBe(4);
  });

  it("ships exactly 3 Origin lines", () => {
    expect(NEW_ORIGIN.length).toBe(3);
  });

  it("ships exactly 3 Harvest lines", () => {
    expect(NEW_HARVEST.length).toBe(3);
  });

  it("every new line uses memory_residue surface only", () => {
    for (const l of ALL_NEW) {
      expect(l.surfaces, l.lineId).toEqual(["memory_residue"]);
    }
  });

  it("every new line gates on requiresRevealStage: 'memory_residue'", () => {
    for (const l of ALL_NEW) {
      expect(l.requiresRevealStage, l.lineId).toBe("memory_residue");
    }
  });

  it("new lineIds are unique", () => {
    const ids = ALL_NEW.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every new line is canonically once-per-playthrough (maxPlays === 1)", () => {
    for (const l of ALL_NEW) {
      expect(l.maxPlays, l.lineId).toBe(1);
    }
  });
});

describe("Per-era canonical-flag gating", () => {
  it("Mechronis lines gate on oracle_mechronis_memory_witnessed (canonical follow-up)", () => {
    for (const l of NEW_MECHRONIS) {
      expect(l.unlockFlags, l.lineId).toContain(
        "oracle_mechronis_memory_witnessed",
      );
    }
  });

  it("Origin lines gate on oracle_revealed_via_ch5_cinematic (canonical post-Ch5)", () => {
    for (const l of NEW_ORIGIN) {
      expect(l.unlockFlags, l.lineId).toContain(
        "oracle_revealed_via_ch5_cinematic",
      );
    }
  });

  it("Harvest lines gate on oracle_disambiguated_player_from_clone (canonical post-Ch6)", () => {
    for (const l of NEW_HARVEST) {
      expect(l.unlockFlags, l.lineId).toContain(
        "oracle_disambiguated_player_from_clone",
      );
    }
  });
});

describe("§1.2 memory-residue cadence canon", () => {
  it("every new line uses canonical 'we / us / our' first-person-plural-of-witness", () => {
    // §1.2 canon: "the Oracle's narrator-frame in memory-residue
    // canonically uses canonical *we / us / our* phrasings"
    for (const l of ALL_NEW) {
      expect(l.text, l.lineId).toMatch(/\b(we|us|our)\b/i);
    }
  });

  it("canonical 'we / us / our' density across the chunk ≥30 instances", () => {
    const allText = ALL_NEW.map((l) => l.text).join(" ");
    const matches = allText.match(/\b(we|us|our)\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(30);
  });

  it("every new line uses canonical present-tense 'We are watching/walking/arguing' framing", () => {
    // §1.2 canonical past-tense-as-present-tense interleaving — the
    // canonical "We are [X-ing]" present-tense narrator-frame.
    for (const l of ALL_NEW) {
      expect(l.text, l.lineId).toMatch(/\bWe are\b/);
    }
  });
});

describe("Mechronis memory expansion canonical anchors", () => {
  it("bench_witness_pre_match lands canonical 'about to canonically witness the canonical-learning'", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.memory_residue.mechronis_bench_witness_pre_match",
    );
    expect(line?.text).toMatch(/We are watching the bench/);
    expect(line?.text).toMatch(/Engineer is already seated/);
    expect(line?.text).toMatch(/canonically witness the canonical-learning/);
  });

  it("staff_inheritance lands canonical 'measuring rod' Engineer-inheritance canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.memory_residue.mechronis_staff_inheritance",
    );
    expect(line?.text).toMatch(/Seer leave her staff on the bench/);
    expect(line?.text).toMatch(/canonically thinks it is a measuring rod/);
    expect(line?.text).toMatch(
      /We will canonically remember knowing/,
    );
    expect(line?.setsFlags).toContain("oracle_mechronis_staff_witnessed");
  });

  it("year_long_conversation lands cross-bible Seer §3.1 'Academy talk about it for a year' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.memory_residue.mechronis_year_long_conversation",
    );
    expect(line?.text).toMatch(/Academy talk about it for a year/);
    expect(line?.text).toMatch(/not-resolving is the canonical lesson/);
  });

  it("engineer_burnt_card lands cross-bible Seer §5.3 'remembered before learned' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.memory_residue.mechronis_engineer_burnt_card",
    );
    expect(line?.text).toMatch(/canonically find a card inside the staff/);
    expect(line?.text).toMatch(
      /He canonically remembers it before he canonically learns/,
    );
  });
});

describe("Origin memory canonical anchors", () => {
  it("debate_hall_entry lands canonical Thalorian soul-philosophy register", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.memory_residue.origin.debate_hall_entry",
    );
    expect(line?.text).toMatch(/walking into the debate hall on Thaloria/);
    expect(line?.text).toMatch(/canonical-acoustics of Thalorian soul-philosophy/);
    expect(line?.text).toMatch(/canonically know how it ends/);
    expect(line?.text).toMatch(/canonically going through with it anyway/);
    expect(line?.setsFlags).toContain("oracle_origin_memory_witnessed");
    expect(line?.setsPublicFlags).toContain("oracle_origin_canon_witnessed");
  });

  it("witnessable_soul_argument lands canonical 'soul that can be canonically witnessed' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.memory_residue.origin.witnessable_soul_argument",
    );
    expect(line?.text).toMatch(
      /soul that can be canonically witnessed/,
    );
    expect(line?.text).toMatch(/canonically more convenient to govern/);
    expect(line?.text).toMatch(/canonically know we are losing/);
  });

  it("collector_doorway lands canonical 'losing was the doorway' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.memory_residue.origin.collector_doorway",
    );
    expect(line?.text).toMatch(/canonical-doorway opens/);
    expect(line?.text).toMatch(/Collector is canonically waiting/);
    expect(line?.text).toMatch(/knowing is the canonical-cost of the canonical-loss/);
  });
});

describe("Harvest memory canonical anchors", () => {
  it("collector_arrives lands canonical 'taken' canon + asymmetry anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.memory_residue.harvest.collector_arrives",
    );
    expect(line?.text).toMatch(/We are watching the Collector approach/);
    expect(line?.text).toMatch(
      /canonically takes what is canonically inconvenient to leave/,
    );
    expect(line?.text).toMatch(
      /canonically watching ourselves be taken/,
    );
    expect(line?.text).toMatch(/canonical-asymmetry is canonical/);
    expect(line?.setsFlags).toContain("oracle_harvest_memory_witnessed");
    expect(line?.setsPublicFlags).toContain("oracle_harvest_canon_witnessed");
  });

  it("amnesia_onset lands canonical pre-Prisoner 'canonical-thinning' register", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.memory_residue.harvest.amnesia_onset",
    );
    expect(line?.text).toMatch(/canonically lose canonical-memory in pieces/);
    expect(line?.text).toMatch(/canonical-Prisoner is canonically about to canonically begin/);
    expect(line?.text).toMatch(
      /canonical-Prisoner did not yet know he was canonically the Oracle/,
    );
  });

  it("last_thalorian_moment lands Tell #5 closure 'Take ... with you. Spend it'", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.memory_residue.harvest.last_thalorian_moment",
    );
    expect(line?.text).toMatch(/canonical-last canonical-Thalorian moment/);
    expect(line?.text).toMatch(/Take the canonical-moment with you/);
    expect(line?.text).toMatch(/Spend it on canonical-attention/);
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
