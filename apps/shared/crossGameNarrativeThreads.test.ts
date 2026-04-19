import { describe, expect, it } from "vitest";
import {
  CROSS_GAME_THREADS,
  getAllBeats,
  getOrderedBeats,
  getThread,
  getThreadsForGame,
} from "./crossGameNarrativeThreads";

describe("crossGameNarrativeThreads", () => {
  it("every thread id is globally unique", () => {
    const ids = CROSS_GAME_THREADS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every beat id is globally unique across threads", () => {
    const ids: string[] = [];
    for (const t of CROSS_GAME_THREADS) for (const b of t.beats) ids.push(b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every participating game list includes the origin game", () => {
    for (const t of CROSS_GAME_THREADS) {
      expect(
        t.participatingGames.includes(t.originGame),
        `${t.id} origin ${t.originGame} not in participatingGames`,
      ).toBe(true);
    }
  });

  it("every beat's emittedBy is in the thread's participatingGames", () => {
    for (const t of CROSS_GAME_THREADS) {
      for (const b of t.beats) {
        expect(
          t.participatingGames.includes(b.emittedBy),
          `${t.id} beat ${b.id} emittedBy ${b.emittedBy} not a participant`,
        ).toBe(true);
      }
    }
  });

  it("every beat has a non-empty canonicalDescription and a numeric order", () => {
    for (const t of CROSS_GAME_THREADS) {
      for (const b of t.beats) {
        expect(b.canonicalDescription.trim().length).toBeGreaterThan(0);
        expect(Number.isFinite(b.order)).toBe(true);
      }
    }
  });

  it("getOrderedBeats returns beats sorted by order", () => {
    const beats = getOrderedBeats("cades_fall");
    for (let i = 1; i < beats.length; i++) {
      expect(beats[i].order).toBeGreaterThanOrEqual(beats[i - 1].order);
    }
    expect(getOrderedBeats("does_not_exist")).toEqual([]);
  });

  it("getThreadsForGame filters correctly", () => {
    const cades = getThreadsForGame("cades_fps").map((t) => t.id);
    expect(cades).toContain("cades_fall");
    expect(cades).toContain("last_words_echo");
    expect(cades).not.toContain("programmers_gift");
  });

  it("getThread returns undefined for unknown ids", () => {
    expect(getThread("does_not_exist")).toBeUndefined();
    expect(getThread("cades_fall")?.title).toBe("The Fall of Cades");
  });

  it("getAllBeats produces a flat id→beat map covering every beat", () => {
    const all = getAllBeats();
    const totalBeats = CROSS_GAME_THREADS.reduce(
      (sum, t) => sum + t.beats.length,
      0,
    );
    expect(Object.keys(all).length).toBe(totalBeats);
  });

  it("every game has at least two threads that participate in it", () => {
    for (const game of ["loredex", "cades_fps", "dead_mans_circuit"] as const) {
      const threads = CROSS_GAME_THREADS.filter((t) =>
        t.participatingGames.includes(game),
      );
      expect(
        threads.length,
        `${game} participates in fewer than 2 threads`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("rejects author-side stub markers in beat descriptions", () => {
    const stubs = [/\bTODO\b/, /\bFIXME\b/, /\[placeholder\]/i, /\blorem ipsum\b/i];
    for (const t of CROSS_GAME_THREADS) {
      for (const b of t.beats) {
        for (const pattern of stubs) {
          expect(
            pattern.test(b.canonicalDescription),
            `${b.id} canonicalDescription contains stub marker ${pattern}`,
          ).toBe(false);
        }
      }
    }
  });

  it("ships at least one three-game thread", () => {
    const threeGame = CROSS_GAME_THREADS.filter(
      (t) => t.participatingGames.length === 3,
    );
    expect(threeGame.length).toBeGreaterThanOrEqual(1);
  });
});
