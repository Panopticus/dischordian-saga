/**
 * Tests for set-code derivation and resolution.
 */
import { describe, it, expect } from "vitest";
import {
  deriveSetCode,
  setCodeOf,
  isSetCode,
  SET_CODES,
} from "./setCode";

describe("deriveSetCode", () => {
  it("maps s1_* prefixes to S1_MEMOIR", () => {
    expect(deriveSetCode("s1_char_001")).toBe("S1_MEMOIR");
    expect(deriveSetCode("s1_imprint_elara")).toBe("S1_MEMOIR");
    expect(deriveSetCode("s1_pack_seed_chess")).toBe("S1_MEMOIR");
    expect(deriveSetCode("s1_spell_211")).toBe("S1_MEMOIR");
    expect(deriveSetCode("s1_song_062")).toBe("S1_MEMOIR");
  });

  it("maps s2_* prefixes to S2_HIERARCHY", () => {
    expect(deriveSetCode("s2_hierarchy_ceo_molgarath")).toBe("S2_HIERARCHY");
    expect(deriveSetCode("s2_director_001")).toBe("S2_HIERARCHY");
  });

  it("maps act{1..7}_* prefixes to ACT_EXCLUSIVES", () => {
    expect(deriveSetCode("act1_memoir_keeper")).toBe("ACT_EXCLUSIVES");
    expect(deriveSetCode("act3_offer_legend")).toBe("ACT_EXCLUSIVES");
    expect(deriveSetCode("act7_convergence_capstone")).toBe("ACT_EXCLUSIVES");
  });

  it("does not match act-routes that aren't card IDs", () => {
    // Defensive: an id like "act_started" is a campaign flag, not a card.
    expect(deriveSetCode("act_started")).toBe("S1_MEMOIR");
    expect(deriveSetCode("activator")).toBe("S1_MEMOIR");
  });

  it("defaults gen_* generals + everything-else to S1_MEMOIR", () => {
    expect(deriveSetCode("gen_architect")).toBe("S1_MEMOIR");
    expect(deriveSetCode("gen_neutral")).toBe("S1_MEMOIR");
    expect(deriveSetCode("burnt_card_placeholder")).toBe("S1_MEMOIR");
  });
});

describe("setCodeOf", () => {
  it("uses the explicit setCode field when present", () => {
    expect(setCodeOf({ id: "s1_char_001", setCode: "S2_HIERARCHY" })).toBe("S2_HIERARCHY");
    expect(setCodeOf({ id: "act3_x", setCode: "S1_MEMOIR" })).toBe("S1_MEMOIR");
  });

  it("falls back to deriveSetCode when setCode is absent", () => {
    expect(setCodeOf({ id: "s1_char_001" })).toBe("S1_MEMOIR");
    expect(setCodeOf({ id: "s2_director_007" })).toBe("S2_HIERARCHY");
    expect(setCodeOf({ id: "act5_map_card" })).toBe("ACT_EXCLUSIVES");
  });
});

describe("isSetCode", () => {
  it("returns true for known codes", () => {
    expect(isSetCode("S1_MEMOIR")).toBe(true);
    expect(isSetCode("S2_HIERARCHY")).toBe(true);
    expect(isSetCode("ACT_EXCLUSIVES")).toBe(true);
  });

  it("returns false for unknown values", () => {
    expect(isSetCode("s1")).toBe(false); // legacy lowercase
    expect(isSetCode("S3_FUTURE")).toBe(false);
    expect(isSetCode("")).toBe(false);
    expect(isSetCode(null)).toBe(false);
    expect(isSetCode(undefined)).toBe(false);
    expect(isSetCode(42)).toBe(false);
  });
});

describe("SET_CODES const", () => {
  it("matches the SetCode union exactly", () => {
    expect(SET_CODES.S1_MEMOIR).toBe("S1_MEMOIR");
    expect(SET_CODES.S2_HIERARCHY).toBe("S2_HIERARCHY");
    expect(SET_CODES.ACT_EXCLUSIVES).toBe("ACT_EXCLUSIVES");
  });
});
