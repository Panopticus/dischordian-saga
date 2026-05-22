import { describe, it, expect } from "vitest";
import {
  BURNT_CARD_ROSTER,
  findBurntCard,
  isBurntCardNpc,
} from "./burntCardRoster";
import { RESURRECTABLE_NPC_KEYS } from "../resurrectionProtocols";

describe("BURNT_CARD_ROSTER", () => {
  it("contains exactly 20 entries", () => {
    expect(BURNT_CARD_ROSTER.length).toBe(20);
  });

  it("every NPC key is unique", () => {
    const keys = BURNT_CARD_ROSTER.map((e) => e.npcKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("includes all 6 resurrectable NPCs", () => {
    const rosterKeys = new Set(BURNT_CARD_ROSTER.map((e) => e.npcKey));
    for (const k of RESURRECTABLE_NPC_KEYS) {
      expect(rosterKeys.has(k)).toBe(true);
    }
  });

  it("exactly 4 entries are on the second-death ballot (1.5× bias)", () => {
    // Per the plan: Wraith Calder, The Wolf (Lycos), Akai Shi, Vex Solène.
    // Locke is fixed canon — her recovery does not bias a ballot vote
    // (she's not on the ballot).
    const biased = BURNT_CARD_ROSTER.filter((e) => e.ballotBiasMultiplier === 1.5);
    expect(biased.length).toBe(4);
    expect(new Set(biased.map((e) => e.npcKey))).toEqual(
      new Set(["wraith_calder", "lycos", "akai_shi", "vex_solene"]),
    );
  });

  it("every entry has narrative content (recoveryTitle + flavor)", () => {
    for (const e of BURNT_CARD_ROSTER) {
      expect(e.recoveryTitle.length).toBeGreaterThan(5);
      expect(e.flavor.length).toBeGreaterThan(20);
    }
  });

  it("findBurntCard returns the entry for a known key, undefined otherwise", () => {
    expect(findBurntCard("locke")?.recoveryTitle).toBe("The Adjudicator's Quill");
    expect(findBurntCard("not_an_npc")).toBeUndefined();
  });

  it("isBurntCardNpc narrows correctly", () => {
    expect(isBurntCardNpc("vex_solene")).toBe(true);
    expect(isBurntCardNpc("nonexistent")).toBe(false);
  });
});
