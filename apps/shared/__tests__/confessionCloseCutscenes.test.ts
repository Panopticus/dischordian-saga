import { describe, expect, it } from "vitest";
import {
  ACT_6_CONFESSION_STANCE_FLAGS,
} from "@shared/act6CompletionGate";
import {
  CONFESSION_CLOSE_CHARACTERS,
  CONFESSION_CLOSE_CUTSCENES,
  CONFESSION_CLOSE_CUTSCENE_TOTAL,
  CONFESSION_CLOSE_STANCES,
  resolveConfessionCloseCutscene,
  resolveConfessionCloseCutscenesForStance,
  stanceFromFlag,
} from "@shared/confessionCloseCutscenes";

describe("confessionCloseCutscenes — parity", () => {
  it("registers exactly 7 stances × 2 characters = 14 entries", () => {
    expect(CONFESSION_CLOSE_CUTSCENE_TOTAL).toBe(14);
    expect(CONFESSION_CLOSE_CUTSCENES).toHaveLength(14);
    expect(CONFESSION_CLOSE_STANCES).toHaveLength(7);
    expect(CONFESSION_CLOSE_CHARACTERS).toHaveLength(2);
  });

  it("derives stance slugs from the act6CompletionGate stance flags", () => {
    const expected = ACT_6_CONFESSION_STANCE_FLAGS.map((f) =>
      f.replace(/^act6_confession_close_/, ""),
    ).sort();
    expect([...CONFESSION_CLOSE_STANCES].sort()).toEqual(expected);
  });

  it("ids match the producer-delivered MP4 basename pattern", () => {
    for (const def of CONFESSION_CLOSE_CUTSCENES) {
      expect(def.id).toBe(`act6_confession_${def.character}_${def.stance}`);
      expect(def.videoRelPath).toBe(
        `videos/confession_close/${def.id}.mp4`,
      );
    }
  });

  it("resolveConfessionCloseCutscene round-trips every (character, stance) pair", () => {
    for (const character of CONFESSION_CLOSE_CHARACTERS) {
      for (const stance of CONFESSION_CLOSE_STANCES) {
        const def = resolveConfessionCloseCutscene(character, stance);
        expect(def).toBeDefined();
        expect(def?.character).toBe(character);
        expect(def?.stance).toBe(stance);
      }
    }
  });

  it("resolveConfessionCloseCutscenesForStance returns both character variants", () => {
    for (const stance of CONFESSION_CLOSE_STANCES) {
      const pair = resolveConfessionCloseCutscenesForStance(stance);
      expect(pair.elara?.character).toBe("elara");
      expect(pair.elara?.stance).toBe(stance);
      expect(pair.human?.character).toBe("human");
      expect(pair.human?.stance).toBe(stance);
    }
  });

  it("stanceFromFlag parses every canonical stance flag and rejects unknown ones", () => {
    for (const flag of ACT_6_CONFESSION_STANCE_FLAGS) {
      const slug = stanceFromFlag(flag);
      expect(slug).not.toBeNull();
      expect(CONFESSION_CLOSE_STANCES).toContain(slug!);
    }
    expect(stanceFromFlag("act6_confession_close_bogus")).toBeNull();
    expect(stanceFromFlag("not_a_confession_flag")).toBeNull();
  });
});
