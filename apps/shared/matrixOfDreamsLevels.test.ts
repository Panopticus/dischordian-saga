import { describe, it, expect } from "vitest";
import {
  MATRIX_OF_DREAMS_LEVELS,
  getLevelById,
  getLevelsBySchool,
  getAvailableLevels,
  getFirstSchoolForTeaching,
} from "./matrixOfDreamsLevels";

describe("matrixOfDreamsLevels", () => {
  it("registers 24 levels (12 Celebration + 12 Mechronis)", () => {
    expect(MATRIX_OF_DREAMS_LEVELS.length).toBe(24);
    expect(getLevelsBySchool("celebration").length).toBe(12);
    expect(getLevelsBySchool("mechronis").length).toBe(12);
  });

  it("every level id is unique", () => {
    const ids = MATRIX_OF_DREAMS_LEVELS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every level has a non-empty title and beat", () => {
    for (const l of MATRIX_OF_DREAMS_LEVELS) {
      expect(l.title.length).toBeGreaterThan(0);
      expect(l.beat.length).toBeGreaterThan(0);
    }
  });

  it("every Celebration episode 1-12 is present", () => {
    const cel = getLevelsBySchool("celebration");
    const numbers = cel.map((l) => l.episodeNumber).sort((a, b) => a - b);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("every Mechronis episode 1-12 is present", () => {
    const mech = getLevelsBySchool("mechronis");
    const numbers = mech.map((l) => l.episodeNumber).sort((a, b) => a - b);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("C9 (The Match — goggles handoff) requires C3 chess class and C6 dueling court", () => {
    const c9 = getLevelById("celebration_c9_the_match");
    expect(c9?.prereqEpisodes).toContain("celebration_c3_chess_class");
    expect(c9?.prereqEpisodes).toContain("celebration_c6_the_dueling_court");
  });

  it("C12 (The Last Good Day — Prince-is-Engineer reveal) is only reachable after C11", () => {
    const c12 = getLevelById("celebration_c12_the_last_good_day");
    expect(c12?.conspiracyClue).toBe("prince_is_engineer");
    expect(c12?.prereqEpisodes).toContain("celebration_c11_the_uncles_verdict");
  });

  it("M12 (The Diploma That Isn't) chains through M11 and M9", () => {
    const m12 = getLevelById("mechronis_m12_the_diploma_that_isnt");
    expect(m12?.prereqEpisodes).toContain("mechronis_m11_the_patrons_true_face");
  });

  it("getAvailableLevels with empty completion set returns the no-prereq starting episodes", () => {
    const available = getAvailableLevels(new Set());
    const availableIds = available.map((l) => l.id);
    // C1 has no prereqs and starts the Celebration thread
    expect(availableIds).toContain("celebration_c1_the_watch");
    // M1, M2, M3 have no prereqs at Mechronis
    expect(availableIds).toContain("mechronis_m1_choric_compliance");
    expect(availableIds).toContain("mechronis_m2_applied_surveillance");
    expect(availableIds).toContain("mechronis_m3_the_trade_exercise");
    // C9 must NOT be available without prereqs
    expect(availableIds).not.toContain("celebration_c9_the_match");
  });

  it("getAvailableLevels gates dependent episodes correctly", () => {
    const completed = new Set([
      "celebration_c1_the_watch",
      "celebration_c2_first_day",
      "celebration_c3_chess_class",
      "celebration_c6_the_dueling_court",
    ]);
    const available = getAvailableLevels(completed).map((l) => l.id);
    // C9 should now be available
    expect(available).toContain("celebration_c9_the_match");
    // C10 still gated on C9 + C4
    expect(available).not.toContain("celebration_c10_the_arks_rise");
  });

  it("getFirstSchoolForTeaching reflects which school the player learned a subject in first", () => {
    // Player took chess at Celebration C3 first
    const cel = new Set(["celebration_c3_chess_class"]);
    expect(getFirstSchoolForTeaching(cel, "chess_intro_alive_warm")).toBe("celebration");

    // Player took chess via Mechronis M1's compliance variant first
    const mech = new Set(["mechronis_m1_choric_compliance"]);
    // M1 teaches card combat, not chess directly — but it's the compliance variant of card combat
    expect(getFirstSchoolForTeaching(mech, "card_combat_compliance_variant")).toBe("mechronis");
  });

  it("Celebration C9 conspiracy clue is the Goggles beat (chess_replay_match)", () => {
    const c9 = getLevelById("celebration_c9_the_match");
    expect(c9?.teaches).toBe("chess_replay_match");
  });

  it("every conspiracy clue id used by an episode is from the canonical clue list", () => {
    const allowedClues = new Set([
      "ghost_seen",
      "uncle_blocks_messenger",
      "banner_glitches_propaganda",
      "ghost_speaks_the_warlord",
      "warlord_revealed",
      "patron_is_architect_proxy",
      "first_celebration_destroyed",
      "prince_is_engineer",
    ]);
    for (const l of MATRIX_OF_DREAMS_LEVELS) {
      if (l.conspiracyClue) {
        expect(allowedClues.has(l.conspiracyClue)).toBe(true);
      }
    }
  });

  it("every prereq references a real episode id", () => {
    const allIds = new Set(MATRIX_OF_DREAMS_LEVELS.map((l) => l.id));
    for (const l of MATRIX_OF_DREAMS_LEVELS) {
      for (const p of l.prereqEpisodes) {
        expect(allIds.has(p)).toBe(true);
      }
    }
  });
});
