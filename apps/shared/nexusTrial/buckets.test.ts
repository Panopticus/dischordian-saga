import { describe, it, expect } from "vitest";
import {
  cardBuckets,
  bucket,
  COMPANION_KEYS,
  BALLOT_KEYS,
} from "./buckets";

describe("bucket(family, key)", () => {
  it("composes family:key", () => {
    expect(bucket("companion", "elara")).toBe("companion:elara");
    expect(bucket("ballot", "wraith_calder")).toBe("ballot:wraith_calder");
  });
});

describe("cardBuckets — companion vote (Confession)", () => {
  it("Elara's card credits companion:elara + character:elara", () => {
    const buckets = cardBuckets("s1_reward_companion_elara");
    expect(buckets).toContain("companion:elara");
    expect(buckets).toContain("character:elara");
  });

  it("The Human's card credits companion:human + character:human", () => {
    const buckets = cardBuckets("s1_companion_the_human_main");
    expect(buckets).toContain("companion:human");
    expect(buckets).toContain("character:human");
  });
});

describe("cardBuckets — second-death ballot", () => {
  it("Wraith's card credits ballot:wraith_calder", () => {
    expect(cardBuckets("s1_char_106_wraith_calder")).toContain("ballot:wraith_calder");
  });

  it("Akai's card credits ballot:akai_shi", () => {
    expect(cardBuckets("s1_char_003_akai_shi")).toContain("ballot:akai_shi");
    expect(cardBuckets("imprint/akai_shi")).toContain("ballot:akai_shi");
  });

  it("Lycos (no playable card yet) is pre-wired — future cards Just Work", () => {
    expect(cardBuckets("s2_char_999_lycos_pack_alpha")).toContain("ballot:lycos");
  });

  it("Vex Solène (no playable card yet) is pre-wired", () => {
    expect(cardBuckets("s2_char_999_vex_solene_maestro")).toContain("ballot:vex_solene");
  });
});

describe("cardBuckets — character-only contributions", () => {
  it("Locke credits the character tally (not ballot, not companion)", () => {
    const buckets = cardBuckets("s1_char_001_adjudicar_locke");
    expect(buckets).toContain("character:locke");
    expect(buckets).not.toContain("companion:locke");
    expect(buckets).not.toContain("ballot:locke");
  });

  it("Jericho Jones → character:jericho_jones only", () => {
    expect(cardBuckets("s1_char_jericho_jones_arrival")).toEqual([
      "character:jericho_jones",
    ]);
  });

  it("ordinary card with no character match returns []", () => {
    expect(cardBuckets("s1_spell_dawn_breaks")).toEqual([]);
  });

  it("dedups when family + character co-occur", () => {
    // Sanity: companion:elara and character:elara are distinct, so
    // both appear; the dedup only removes literal duplicates.
    const buckets = cardBuckets("s1_companion_elara_main");
    expect(buckets.filter((b) => b === "character:elara").length).toBe(1);
  });
});

describe("registry parity", () => {
  it("all companion + ballot keys are non-empty", () => {
    expect(COMPANION_KEYS.length).toBe(2);
    expect(BALLOT_KEYS.length).toBe(4);
  });
});
