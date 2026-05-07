import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
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

  /**
   * Wiring invariant — every beat must have a fire site somewhere
   * in the codebase, OR be in the deferred-narrative-wiring baseline.
   * CONNECTION_AUDIT §6.3 caught 17 beats with no fire site at all
   * (the entire CADES + DMC half of the registry); this guard
   * prevents that count from growing while the writers do the
   * narrative-moment-by-narrative-moment wiring in follow-up PRs.
   *
   * A "fire site" is any of:
   *   - `fireCrossGameBeat("<beat_id>")` in apps/ TS source
   *     (Loredex side — the helper at apps/client/src/lib/crossGameBeats.ts)
   *   - `fire_cross_game_beat("<beat_id>")` in games/ GD source
   *     (CADES + DMC side — the helper added on
   *      games/{cades-fps,dead-mans-circuit}/autoloads/WebBridge.gd)
   *
   * The baseline is a JSON list of beat ids known to lack a fire
   * site at the time the guard was added. PRs that add a fire site
   * MUST also remove the corresponding baseline entry; PRs that
   * introduce a NEW beat must wire it to a fire site or the test
   * will fail at the new beat (baseline cannot grow without
   * editing the file directly).
   */
  it("every beat has a fire site or is in the deferred-narrative-wiring baseline", () => {
    const REPO_ROOT = path.resolve(__dirname, "..", "..");
    const APPS_DIR = path.join(REPO_ROOT, "apps");
    const GAMES_DIR = path.join(REPO_ROOT, "games");
    const BASELINE_PATH = path.join(
      __dirname,
      "crossGameNarrativeThreads.baseline.json",
    );

    function readAll(dir: string, exts: string[]): string {
      let combined = "";
      const stack = [dir];
      while (stack.length) {
        const d = stack.pop()!;
        let entries: fs.Dirent[];
        try {
          entries = fs.readdirSync(d, { withFileTypes: true });
        } catch {
          continue;
        }
        for (const e of entries) {
          if (e.name === "node_modules" || e.name === "dist") continue;
          const full = path.join(d, e.name);
          if (e.isDirectory()) {
            stack.push(full);
          } else if (e.isFile() && exts.some(x => e.name.endsWith(x))) {
            try {
              combined += fs.readFileSync(full, "utf-8") + "\n";
            } catch {
              // ignore unreadable
            }
          }
        }
      }
      return combined;
    }

    const baseline = (() => {
      try {
        return JSON.parse(fs.readFileSync(BASELINE_PATH, "utf-8")) as {
          deferredNarrativeWiring: string[];
        };
      } catch {
        return { deferredNarrativeWiring: [] };
      }
    })();
    const baselineSet = new Set(baseline.deferredNarrativeWiring);

    const tsText = readAll(APPS_DIR, [".ts", ".tsx"]);
    const gdText = readAll(GAMES_DIR, [".gd"]);

    const violations: string[] = [];
    const usedBaseline = new Set<string>();
    for (const t of CROSS_GAME_THREADS) {
      for (const b of t.beats) {
        const tsFire = `fireCrossGameBeat("${b.id}")`;
        const gdFire = `fire_cross_game_beat("${b.id}")`;
        if (tsText.includes(tsFire) || gdText.includes(gdFire)) continue;
        if (baselineSet.has(b.id)) {
          usedBaseline.add(b.id);
          continue;
        }
        violations.push(
          `  - ${b.id} (thread ${t.id}, emittedBy ${b.emittedBy}): no fireCrossGameBeat or fire_cross_game_beat callsite, not in baseline`,
        );
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `Cross-game beats with no fire site:\n${violations.join("\n")}\n\n` +
          `Resolve each by either (A) calling fireCrossGameBeat("<id>") at the ` +
          `canonical narrative moment in apps/ TS code, (B) calling ` +
          `fire_cross_game_beat("<id>") in the relevant games/ GD scene, or ` +
          `(C) appending the beat id to ` +
          `apps/shared/crossGameNarrativeThreads.baseline.json. PREFER A/B; ` +
          `the baseline is a ratchet that should shrink, not grow. ` +
          `See docs/audits/CONNECTION_AUDIT_2026-05-07.md §6.3.`,
      );
    }
    expect(violations).toEqual([]);
  });
});
