import { describe, expect, it } from "vitest";
import {
  ACT_3_OPPONENTS,
  ACT_4_OPPONENTS,
  ACT_6_OPPONENTS,
  ACT_7_OPPONENTS,
  ACTS_2_TO_7_OPPONENTS,
  getActNOpponent,
  getOpponentsForAct,
} from "./acts2to7Opponents";

const STUB_PATTERNS: readonly RegExp[] = [
  /\bTODO\b/,
  /\bFIXME\b/,
  /\bXXX\b/,
  /\bTBD\b/,
  /\blorem ipsum\b/i,
  /\[placeholder\]/i,
];

describe("acts2to7Opponents", () => {
  it("assembles the registry from Act 3, 4, 6, 7 shards", () => {
    const expectedLength =
      ACT_3_OPPONENTS.length +
      ACT_4_OPPONENTS.length +
      ACT_6_OPPONENTS.length +
      ACT_7_OPPONENTS.length;
    expect(ACTS_2_TO_7_OPPONENTS).toHaveLength(expectedLength);
  });

  it("keeps every opponent id globally unique", () => {
    const ids = ACTS_2_TO_7_OPPONENTS.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ships the audit-required minimum per act", () => {
    expect(ACT_3_OPPONENTS.length).toBeGreaterThanOrEqual(3);
    expect(ACT_4_OPPONENTS.length).toBeGreaterThanOrEqual(3);
    expect(ACT_6_OPPONENTS.length).toBeGreaterThanOrEqual(2);
    expect(ACT_7_OPPONENTS.length).toBeGreaterThanOrEqual(4);
  });

  it("authors every required field with non-empty text", () => {
    for (const opp of ACTS_2_TO_7_OPPONENTS) {
      expect(opp.name.trim().length, `${opp.id} missing name`).toBeGreaterThan(0);
      expect(opp.backstory.trim().length, `${opp.id} missing backstory`).toBeGreaterThan(0);
      expect(opp.preMatchLine.trim().length, `${opp.id} missing preMatchLine`).toBeGreaterThan(0);
      expect(opp.postMatchWin.trim().length, `${opp.id} missing postMatchWin`).toBeGreaterThan(0);
      expect(opp.postMatchLoss.trim().length, `${opp.id} missing postMatchLoss`).toBeGreaterThan(0);
      expect(opp.deckLeaning.length, `${opp.id} missing deckLeaning`).toBeGreaterThan(0);
    }
  });

  it("rejects author-side stub markers in any line", () => {
    for (const opp of ACTS_2_TO_7_OPPONENTS) {
      const corpus = [
        opp.backstory,
        opp.preMatchLine,
        opp.postMatchWin,
        opp.postMatchLoss,
      ].join("\n");
      for (const pattern of STUB_PATTERNS) {
        expect(
          pattern.test(corpus),
          `${opp.id} contains stub marker ${pattern}`
        ).toBe(false);
      }
    }
  });

  it("keeps act + step consistent with the shard it belongs to", () => {
    for (const opp of ACT_3_OPPONENTS) expect(opp.act).toBe(3);
    for (const opp of ACT_4_OPPONENTS) expect(opp.act).toBe(4);
    for (const opp of ACT_6_OPPONENTS) expect(opp.act).toBe(6);
    for (const opp of ACT_7_OPPONENTS) expect(opp.act).toBe(7);
  });

  it("gates Path A/B/C Act 4 opponents with mutually-exclusive flags", () => {
    const pathA = ACT_4_OPPONENTS.find((o) => o.id === "act4_the_bridge")!;
    const pathB = ACT_4_OPPONENTS.find((o) => o.id === "act4_the_discovery")!;
    const pathC = ACT_4_OPPONENTS.find((o) => o.id === "act4_the_betrayal")!;
    expect(pathA.requiredFlag).toBe("act1_path_A");
    expect(pathB.requiredFlag).toBe("act3_partial_share");
    expect(pathB.excludeFlag).toBe("act1_path_A");
    expect(pathC.requiredFlag).toBe("act3_full_secret");
    expect(pathC.excludeFlag).toBe("act1_path_A");
  });

  it("getActNOpponent resolves by id and returns undefined for unknown ids", () => {
    expect(getActNOpponent("act3_substrate_echo")?.name).toBe("The Substrate Echo");
    expect(getActNOpponent("does_not_exist")).toBeUndefined();
  });

  it("getOpponentsForAct returns the correct shard", () => {
    expect(getOpponentsForAct(3)).toEqual(ACT_3_OPPONENTS);
    expect(getOpponentsForAct(4)).toEqual(ACT_4_OPPONENTS);
    expect(getOpponentsForAct(6)).toEqual(ACT_6_OPPONENTS);
    expect(getOpponentsForAct(7)).toEqual(ACT_7_OPPONENTS);
  });
});
