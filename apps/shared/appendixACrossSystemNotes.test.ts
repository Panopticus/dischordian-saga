import { describe, it, expect } from "vitest";
import {
  APPENDIX_A_NOTES,
  getAppendixANote,
  listAppendixANotes,
} from "./appendixACrossSystemNotes";

describe("Appendix A cross-system integration notes", () => {
  it("has exactly 10 notes (A.1-A.10)", () => {
    expect(Object.keys(APPENDIX_A_NOTES).length).toBe(10);
  });

  it("listAppendixANotes returns all 10 in canonical order", () => {
    const notes = listAppendixANotes();
    expect(notes.length).toBe(10);
    expect(notes[0].id).toBe("a1_matrix_of_dreams");
    expect(notes[9].id).toBe("a10_trophy_room_captains_quarters");
  });

  it("every note has a non-empty existingModule + witnessingConcern", () => {
    for (const note of listAppendixANotes()) {
      expect(note.existingModule.length).toBeGreaterThan(0);
      expect(note.witnessingConcern.length).toBeGreaterThan(0);
      expect(note.integrationMechanism.length).toBeGreaterThan(0);
    }
  });

  it("a7 (Celebration Trial) is already shell_landed", () => {
    expect(getAppendixANote("a7_celebration_trial").status).toBe("shell_landed");
  });

  it("a8 (Mechronis Professors) is already shell_landed", () => {
    expect(getAppendixANote("a8_mechronis_professors").status).toBe(
      "shell_landed",
    );
  });

  it("a4 Eyes network has an Eyes-recruitment shipping flag", () => {
    const a4 = getAppendixANote("a4_trade_agents_eyes_network");
    expect(a4.shippingFlags).toContain("eyes_network_recruitment_wired");
  });

  it("a5 Four Guilds raises one flag per guild", () => {
    const a5 = getAppendixANote("a5_four_guilds");
    expect(a5.shippingFlags?.length).toBe(4);
    expect(a5.shippingFlags).toContain("guild_living_infiltrated");
    expect(a5.shippingFlags).toContain("guild_locks_infiltrated");
    expect(a5.shippingFlags).toContain("guild_yellow_coats_infiltrated");
    expect(a5.shippingFlags).toContain("guild_influencers_infiltrated");
  });

  it("a9 DMC identity chain raises the four naming flags", () => {
    const a9 = getAppendixANote("a9_dmc_identity_chain");
    expect(a9.shippingFlags).toEqual([
      "dmc_student_named",
      "dmc_seeker_named",
      "dmc_detective_named",
      "dmc_last_named",
    ]);
  });
});
