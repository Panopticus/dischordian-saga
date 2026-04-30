/**
 * Replay producer wiring guard (#6 / #46 follow-up).
 *
 * Coverage layers:
 *
 *   1. `persistFinishedMatch` no-DB safety — when the DB pool isn't
 *      configured (tests / local without MySQL) the function must
 *      return `null` without throwing. The post-match WS flow has
 *      already sent MATCH_RESULT to both clients before this fires;
 *      a thrown error here would surface as an unhandled promise
 *      rejection that the WS handler would never see (call site is
 *      `void persistFinishedMatch(...)`).
 *
 *   2. Static-analysis on the duelystWs wiring so the call site
 *      can't silently disappear. Specifically: the import is in
 *      place, the call is fire-and-forget (`void` prefix), it runs
 *      AFTER MATCH_RESULT is sent, and it passes the canonical
 *      snapshot fields (gameType, startedAt, players, winnerSide,
 *      gameState, actionLog, p1Config / p2Config).
 *
 *   3. Static-analysis on `replayPersistence.ts` so the share-token
 *      generation, hash computation, and DB write shape stay pinned.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  persistFinishedMatch,
  type FinishedMatchSnapshot,
} from "./services/replayPersistence";
import type { GameState } from "../shared/tcg-core";

const ROOT = process.cwd();
function read(rel: string): string {
  return fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
}

/** Minimal GameState stub — `hashState` accepts any value and the DB
 *  write short-circuits before the field is written, so this only
 *  needs the seed / rulesVersion fields the producer reads.
 *
 *  Cast through `unknown` because GameState's full surface is huge
 *  and the producer only touches `seed` + `rulesVersion`. */
function stubGameState(seed: string, rulesVersion: string): GameState {
  return { seed, rulesVersion } as unknown as GameState;
}

function stubSnapshot(
  overrides: Partial<FinishedMatchSnapshot> = {},
): FinishedMatchSnapshot {
  return {
    gameType: "duelyst",
    startedAt: Date.now() - 60_000,
    player1: { userId: 1, userName: "Alice" },
    player2: { userId: 2, userName: "Bob" },
    winnerSide: 0,
    gameState: stubGameState("seed-abc", "1.1.0"),
    actionLog: [],
    ...overrides,
  };
}

describe("persistFinishedMatch — no-DB safety", () => {
  it("returns null without throwing when getDb is unavailable (tests / local)", async () => {
    // In the test env, getDb() short-circuits to null because no
    // DATABASE_URL is set. The function must absorb that and return.
    const result = await persistFinishedMatch(stubSnapshot());
    expect(result).toBeNull();
  });

  it("absorbs all the canonical snapshot variants without throwing", async () => {
    // Spot-check the variants the duelystWs producer can supply:
    // disconnect, surrender, normal end. Each carries a different
    // `tags` shape but otherwise the snapshot is uniform.
    for (const reason of ["disconnect", "surrender", "victory", "draw"]) {
      const result = await persistFinishedMatch(
        stubSnapshot({ tags: [reason] }),
      );
      expect(result).toBeNull();
    }
  });

  it("absorbs both winner sides", async () => {
    expect(await persistFinishedMatch(stubSnapshot({ winnerSide: 0 }))).toBeNull();
    expect(await persistFinishedMatch(stubSnapshot({ winnerSide: 1 }))).toBeNull();
  });
});

describe("duelystWs producer wiring", () => {
  const SRC = read("apps/server/duelystWs.ts");

  it("imports persistFinishedMatch from the replay-persistence service", () => {
    expect(SRC).toMatch(
      /import\s*\{[^}]*persistFinishedMatch[^}]*\}\s*from\s*["']\.\/services\/replayPersistence["']/,
    );
  });

  it("invokes persistFinishedMatch with `void` prefix (fire-and-forget)", () => {
    expect(SRC).toMatch(/void\s+persistFinishedMatch\s*\(/);
  });

  it("passes gameType: \"duelyst\" so getRecentByType('duelyst') finds the row", () => {
    expect(SRC).toMatch(/gameType:\s*["']duelyst["']/);
  });

  it("passes the canonical snapshot fields", () => {
    expect(SRC).toMatch(/startedAt:\s*match\.startedAt/);
    expect(SRC).toMatch(/winnerSide,?/);
    expect(SRC).toMatch(/gameState:\s*match\.gameState/);
    expect(SRC).toMatch(/actionLog:\s*match\.actionLog/);
    expect(SRC).toMatch(/userId:\s*match\.player1\.userId/);
    expect(SRC).toMatch(/userId:\s*match\.player2\.userId/);
  });

  it("captures the per-player faction + deck snapshot for replay reconstruction", () => {
    expect(SRC).toMatch(/p1Config:\s*\{\s*faction:\s*match\.player1\.faction/);
    expect(SRC).toMatch(/deckCardIds:\s*match\.player1\.deckCardIds/);
    expect(SRC).toMatch(/p2Config:\s*\{\s*faction:\s*match\.player2\.faction/);
    expect(SRC).toMatch(/deckCardIds:\s*match\.player2\.deckCardIds/);
  });

  it("tags the replay with the engine's end reason (disconnect/surrender/victory)", () => {
    expect(SRC).toMatch(/tags:\s*\[\s*reason\s*\]/);
  });

  it("call site runs AFTER MATCH_RESULT is sent to both clients", () => {
    // Persistence is fire-and-forget but must not delay the post-match
    // payload. Specifically: the `send(...MATCH_RESULT...)` lines must
    // appear textually before the persistFinishedMatch call.
    const matchResultIdx = SRC.indexOf('"MATCH_RESULT"');
    const persistIdx = SRC.indexOf("persistFinishedMatch(");
    expect(matchResultIdx).toBeGreaterThan(0);
    expect(persistIdx).toBeGreaterThan(0);
    expect(persistIdx).toBeGreaterThan(matchResultIdx);
  });

  it("legacy `[DEFERRED] DB write` placeholder is gone", () => {
    // The original `endMatch` had a `// [DEFERRED] DB write to
    // cardGameMatches ...` comment marking this exact gap. Removing it
    // is the regression-guard that we actually replaced the deferred
    // path rather than adding the new producer alongside it.
    expect(SRC).not.toMatch(/\[DEFERRED\] DB write to cardGameMatches/);
  });
});

describe("replayPersistence service shape", () => {
  const SRC = read("apps/server/services/replayPersistence.ts");

  it("generates a shareToken for every successful insert", () => {
    expect(SRC).toMatch(
      /import\s*\{[^}]*generateShareToken[^}]*\}\s*from\s*["']\.\/replayTokens["']/,
    );
    expect(SRC).toMatch(/const\s+shareToken\s*=\s*generateShareToken\s*\(\s*\)/);
  });

  it("computes the canonical final-state hash via hashState", () => {
    expect(SRC).toMatch(
      /import\s*\{[^}]*hashState[^}]*\}\s*from\s*["']\.\.\/\.\.\/shared\/tcg-core["']/,
    );
    expect(SRC).toMatch(/hashState\s*\(\s*snapshot\.gameState\s*\)/);
  });

  it("serializes the action log via JSON.stringify so moveData is text-portable", () => {
    expect(SRC).toMatch(/JSON\.stringify\s*\(\s*snapshot\.actionLog\s*\)/);
  });

  it("never throws on insert failure (logs warn + returns null)", () => {
    expect(SRC).toMatch(/catch\s*\(\s*err\s*\)/);
    expect(SRC).toMatch(/logger\.warn\s*\([^)]*ReplayPersistence/);
    expect(SRC).toMatch(/return null/);
  });

  it("populates the deterministic-replay columns (seed, rulesVersion, finalStateHash)", () => {
    expect(SRC).toMatch(/seed:\s*snapshot\.gameState\.seed/);
    expect(SRC).toMatch(/rulesVersion:\s*snapshot\.gameState\.rulesVersion/);
    expect(SRC).toMatch(/finalStateHash,?/);
  });
});
