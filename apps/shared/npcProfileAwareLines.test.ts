import { describe, it, expect } from "vitest";
import {
  NPC_LINES,
  pickNpcLine,
  listProfileAwareNpcs,
} from "./npcProfileAwareLines";
import { emptyProfile, type PlayerProfile } from "./playerProfile";

describe("npcProfileAwareLines", () => {
  it("seeds at least 7 NPCs", () => {
    expect(listProfileAwareNpcs().length).toBeGreaterThanOrEqual(7);
  });

  it("returns null for an unknown NPC", () => {
    expect(pickNpcLine("nonexistent_npc", emptyProfile())).toBeNull();
  });

  it("returns a neutral line for a neutral profile", () => {
    const line = pickNpcLine("the_oracle", emptyProfile());
    expect(line).toBeTruthy();
    expect(typeof line).toBe("string");
  });

  it("returns different lines at opposite profile extremes", () => {
    const lowCuriosity: PlayerProfile = { ...emptyProfile(), curiosity: -80 };
    const highCuriosity: PlayerProfile = { ...emptyProfile(), curiosity: 80 };
    const lowLine = pickNpcLine("the_oracle", lowCuriosity);
    const highLine = pickNpcLine("the_oracle", highCuriosity);
    expect(lowLine).not.toBe(highLine);
    expect(lowLine).not.toBeNull();
    expect(highLine).not.toBeNull();
  });

  it("every seeded NPC has at least a neutral line or a fallback", () => {
    for (const npcId of listProfileAwareNpcs()) {
      const line = pickNpcLine(npcId, emptyProfile());
      expect(line, `NPC ${npcId} has no line for a neutral profile`).toBeTruthy();
    }
  });

  it("every seeded NPC maps its axis to a valid entry", () => {
    for (const [npcId, entry] of Object.entries(NPC_LINES)) {
      expect(entry.axis, `NPC ${npcId} missing axis`).toBeTruthy();
      expect(
        Object.keys(entry.lines).length,
        `NPC ${npcId} needs at least one line`,
      ).toBeGreaterThan(0);
    }
  });
});
