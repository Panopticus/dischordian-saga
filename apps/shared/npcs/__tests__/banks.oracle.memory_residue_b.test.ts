// apps/shared/npcs/__tests__/banks.oracle.memory_residue_b.test.ts
//
// Phase 6b.3 sub-chunk F verification — Oracle memory-residue bank
// (second half: 10 new lines covering canonical Prisoner / Jailer /
// Liberation / Heart-of-Time witnessed-memory scenes per
// the_oracle.md §§2.3, 2.4, 2.7, 2.10).
//
// Closes the canonical 20-line memory-residue channel target (10
// Mechronis/Origin/Harvest from sub-chunk E + 10 Prisoner/Jailer/
// Liberation/HoT here).
//
// Validates per §§1.2 + 1.5 + 2.3-2.10:
//   1. 10 new memory-residue lines shipped (3 Prisoner + 3 Jailer
//      + 2 Liberation + 2 Heart-of-Time)
//   2. All on memory_residue surface
//   3. All gate on requiresRevealStage: "memory_residue"
//   4. Canonical-flag gating per era:
//      - Prisoner: canonical post-Ch6 (oracle_disambiguated_player_
//        from_clone)
//      - Jailer: canonical post-Ch6
//      - Liberation: canonical post-Ch5 (oracle_revealed_via_ch5_
//        cinematic)
//      - Heart-of-Time: canonical post-Ch6 (Stage-4-weave-anchor)
//   5. §1.2 cadence canon: every line uses canonical "we / us /
//      our" + canonical "We are [X-ing]" present-tense framing
//   6. Canonical-anchor landings per scene
//   7. §1.3 forbidden vocabulary absent

import { describe, it, expect } from "vitest";
import { THE_ORACLE_BANK } from "../banks/the_oracle";

const NEW_PRISONER_IDS = [
  "oracle.memory_residue.prisoner.first_amnesia",
  "oracle.memory_residue.prisoner.player_meets_him_unrecognizing",
  "oracle.memory_residue.prisoner.we_were_asking_back",
];

const NEW_JAILER_IDS = [
  "oracle.memory_residue.jailer.experimentation_begins",
  "oracle.memory_residue.jailer.becoming_warden",
  "oracle.memory_residue.jailer.not_knowing_was_the_captivity",
];

const NEW_LIBERATION_IDS = [
  "oracle.memory_residue.liberation.panopticon_raid",
  "oracle.memory_residue.liberation.warden_destroyed",
];

const NEW_HOT_IDS = [
  "oracle.memory_residue.heart_of_time.epoch_1_arrival",
  "oracle.memory_residue.heart_of_time.we_walked_together",
];

const ALL_NEW_IDS = [
  ...NEW_PRISONER_IDS,
  ...NEW_JAILER_IDS,
  ...NEW_LIBERATION_IDS,
  ...NEW_HOT_IDS,
];

const NEW_PRISONER = THE_ORACLE_BANK.filter((l) =>
  NEW_PRISONER_IDS.includes(l.lineId),
);
const NEW_JAILER = THE_ORACLE_BANK.filter((l) =>
  NEW_JAILER_IDS.includes(l.lineId),
);
const NEW_LIBERATION = THE_ORACLE_BANK.filter((l) =>
  NEW_LIBERATION_IDS.includes(l.lineId),
);
const NEW_HOT = THE_ORACLE_BANK.filter((l) => NEW_HOT_IDS.includes(l.lineId));
const ALL_NEW = [
  ...NEW_PRISONER,
  ...NEW_JAILER,
  ...NEW_LIBERATION,
  ...NEW_HOT,
];

describe("Oracle memory-residue sub-chunk F — shape", () => {
  it("ships 10 new memory-residue lines (3 Prisoner + 3 Jailer + 2 Liberation + 2 HoT)", () => {
    expect(ALL_NEW.length).toBe(10);
  });

  it("ships exactly 3 Prisoner-state lines", () => {
    expect(NEW_PRISONER.length).toBe(3);
  });

  it("ships exactly 3 Jailer-state lines", () => {
    expect(NEW_JAILER.length).toBe(3);
  });

  it("ships exactly 2 Liberation lines", () => {
    expect(NEW_LIBERATION.length).toBe(2);
  });

  it("ships exactly 2 Heart-of-Time / Epoch-1 anchor lines", () => {
    expect(NEW_HOT.length).toBe(2);
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
  it("Prisoner lines gate on oracle_disambiguated_player_from_clone (canonical post-Ch6)", () => {
    for (const l of NEW_PRISONER) {
      expect(l.unlockFlags, l.lineId).toContain(
        "oracle_disambiguated_player_from_clone",
      );
    }
  });

  it("Jailer lines gate on oracle_disambiguated_player_from_clone (canonical post-Ch6)", () => {
    for (const l of NEW_JAILER) {
      expect(l.unlockFlags, l.lineId).toContain(
        "oracle_disambiguated_player_from_clone",
      );
    }
  });

  it("Liberation lines gate on oracle_revealed_via_ch5_cinematic (canonical post-Ch5)", () => {
    for (const l of NEW_LIBERATION) {
      expect(l.unlockFlags, l.lineId).toContain(
        "oracle_revealed_via_ch5_cinematic",
      );
    }
  });

  it("Heart-of-Time lines gate on oracle_disambiguated_player_from_clone (Stage-4-weave-anchor)", () => {
    for (const l of NEW_HOT) {
      expect(l.unlockFlags, l.lineId).toContain(
        "oracle_disambiguated_player_from_clone",
      );
    }
  });
});

describe("§1.2 memory-residue cadence canon", () => {
  it("every new line uses canonical 'we / us / our' first-person-plural-of-witness", () => {
    for (const l of ALL_NEW) {
      expect(l.text, l.lineId).toMatch(/\b(we|us|our)\b/i);
    }
  });

  it("every new line uses canonical present-tense 'We are [X-ing]' framing", () => {
    for (const l of ALL_NEW) {
      expect(l.text, l.lineId).toMatch(/\bWe are\b/);
    }
  });

  it("canonical 'we / us / our' density across the chunk ≥30 instances", () => {
    const allText = ALL_NEW.map((l) => l.text).join(" ");
    const matches = allText.match(/\b(we|us|our)\b/gi);
    expect(matches?.length ?? 0).toBeGreaterThanOrEqual(30);
  });
});

describe("Prisoner-state canonical anchors", () => {
  it("first_amnesia lands canonical 'wake without canonical-memory' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) => l.lineId === "oracle.memory_residue.prisoner.first_amnesia",
    );
    expect(line?.text).toMatch(/canonically wake without canonical-memory/);
    expect(line?.text).toMatch(
      /canonical-Prisoner canonically begin/,
    );
    expect(line?.setsFlags).toContain("oracle_prisoner_memory_witnessed");
  });

  it("player_meets_him_unrecognizing lands canonical 'meeting without being canonically known' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.memory_residue.prisoner.player_meets_him_unrecognizing",
    );
    expect(line?.text).toMatch(/canonical-meeting between the player and the canonical-Prisoner/);
    expect(line?.text).toMatch(
      /canonically watching ourselves be met without being canonically known/,
    );
  });

  it("we_were_asking_back lands canonical 'Underneath the asking was the canonical-same answer' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.memory_residue.prisoner.we_were_asking_back",
    );
    expect(line?.text).toMatch(/We were canonically both asking/);
    expect(line?.text).toMatch(
      /Underneath the asking was the canonical-same answer/,
    );
  });
});

describe("Jailer-state canonical anchors", () => {
  it("experimentation_begins lands canonical 'reshaping into the canonical-Jailer' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.memory_residue.jailer.experimentation_begins",
    );
    expect(line?.text).toMatch(/canonical-experimentation begin/);
    expect(line?.text).toMatch(
      /canonically rewritten into the canonical-instrument of canonical-our-own-captivity/,
    );
    expect(line?.setsFlags).toContain("oracle_jailer_memory_witnessed");
  });

  it("becoming_warden lands canonical 'canonical-keys are canonical-our-own-keys' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.memory_residue.jailer.becoming_warden",
    );
    expect(line?.text).toMatch(
      /canonical-keys are canonical-our-own-keys/,
    );
    expect(line?.text).toMatch(/canonical-learning is the canonical-locking/);
  });

  it("not_knowing_was_the_captivity lands canonical 'not-knowing was canonical-our-captivity' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.memory_residue.jailer.not_knowing_was_the_captivity",
    );
    expect(line?.text).toMatch(
      /canonical-not-knowing is canonical-our-captivity/,
    );
    expect(line?.text).toMatch(
      /canonical-walking the canonical-corridors of canonical-our-own-prison/,
    );
  });
});

describe("Liberation canonical anchors", () => {
  it("panopticon_raid lands canonical 'Enigma and the Programmer come through the canonical-walls' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.memory_residue.liberation.panopticon_raid",
    );
    expect(line?.text).toMatch(
      /Enigma and the Programmer canonically come through the canonical-walls/,
    );
    expect(line?.text).toMatch(/canonically did not know we were canonically waiting/);
    expect(line?.setsFlags).toContain("oracle_liberation_memory_witnessed");
    expect(line?.setsPublicFlags).toContain(
      "oracle_liberation_canon_witnessed",
    );
  });

  it("warden_destroyed lands canonical 'walk out / canonically have been walking since' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.memory_residue.liberation.warden_destroyed",
    );
    expect(line?.text).toMatch(
      /canonical-Warden canonically dissolve/,
    );
    expect(line?.text).toMatch(/We canonically walk out/);
    expect(line?.text).toMatch(
      /canonically have been walking since/,
    );
    expect(line?.text).toMatch(/Take the canonical-walking-out with you/);
  });
});

describe("Heart-of-Time / Epoch-1 anchor (Stage-4-weave-anchor)", () => {
  it("epoch_1_arrival lands canonical 'Hierophant canonically begins canonical-preparing for canonical-our-return' canon", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId === "oracle.memory_residue.heart_of_time.epoch_1_arrival",
    );
    expect(line?.text).toMatch(
      /canonical-Heart-of-Time canonically arrive at the canonical-end of canonical-Epoch-1/,
    );
    expect(line?.text).toMatch(
      /canonical-Hierophant canonically begins canonical-preparing for canonical-our-return/,
    );
    expect(line?.setsFlags).toContain(
      "oracle_heart_of_time_memory_witnessed",
    );
    expect(line?.setsPublicFlags).toContain(
      "oracle_heart_of_time_canon_witnessed",
    );
  });

  it("we_walked_together lands canonical Acts 7+ Identity-arc 'canonical-walking-together' anchor", () => {
    const line = THE_ORACLE_BANK.find(
      (l) =>
        l.lineId ===
        "oracle.memory_residue.heart_of_time.we_walked_together",
    );
    expect(line?.text).toMatch(/canonical-walking-together/);
    expect(line?.text).toMatch(
      /canonically walked the canonical-Heart-of-Time together/,
    );
    expect(line?.text).toMatch(
      /Take the canonical-walking-together with you/,
    );
    expect(line?.text).toMatch(/Spend it on canonical-recognition/);
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
