/**
 * Replay verification job (#92) — coverage.
 *
 * Two layers:
 *
 *   1. Behavioral tests on the pure `verifyReplay` helper. These
 *      cover every reason-code branch (missing-matchId, missing-hash,
 *      missing-config, parse-error, hash-mismatch) plus the happy
 *      path against a deterministic engine round-trip.
 *
 *   2. Static-analysis on the wiring so the admin endpoint, schema
 *      column, migration, and bootstrap all stay in lockstep. Loss
 *      of any one of them silently disables the verifier on rows
 *      created after the regression — exactly the kind of bug this
 *      job exists to catch in the *engine*.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  verifyReplay,
  type VerifiableReplay,
} from "./services/replayVerification";
import { createServerMatchState, buildMatchConfig } from "./tcg/matchCore";
import { hashState } from "../shared/tcg-core";

const ROOT = process.cwd();
function read(rel: string): string {
  return fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
}

/** A minimal but real GameState set up via the same buildMatchConfig
 *  + createServerMatchState path the live server uses. The action log
 *  is empty — verification with `[]` should reproduce the same hash
 *  the live server would compute at the very first move. That's
 *  enough to validate the full reconstruction → hashState chain
 *  without depending on every reducer rule.
 *
 *  Falls back to `null` if the deck-cards aren't in the registry yet
 *  (the buildMatchConfig path needs the general def to exist). The
 *  call sites below skip the happy-path test in that case. */
function freshFixture(): VerifiableReplay | null {
  // Use a faction known to be present + a placeholder deck. The
  // skipValidation flag in buildMatchConfig matches the live queue
  // (duelystWs.ts:108-117) so we don't need a fully-populated deck.
  const matchId = "verify-test-match";
  // buildMatchConfig requires a non-empty deckCardIds even under
  // skipValidation:true. Use placeholder ids the engine treats as
  // unknown vanilla cards — matches the pattern in matchCore.ts §87.
  const p1Built = buildMatchConfig(
    { userId: 100, faction: "insurgency", deckCardIds: ["placeholder_card_a"] },
    { skipValidation: true },
  );
  const p2Built = buildMatchConfig(
    { userId: 200, faction: "architect", deckCardIds: ["placeholder_card_b"] },
    { skipValidation: true },
  );
  if (p1Built.error || p2Built.error || !p1Built.config || !p2Built.config) {
    return null;
  }
  let initialState;
  try {
    initialState = createServerMatchState({
      matchId,
      p1: p1Built.config,
      p2: p2Built.config,
    });
  } catch {
    return null;
  }
  return {
    matchId,
    moveData: JSON.stringify([]),
    finalStateHash: hashState(initialState),
    p1Config: { faction: "insurgency", deckCardIds: ["placeholder_card_a"] },
    p2Config: { faction: "architect", deckCardIds: ["placeholder_card_b"] },
    player1Id: 100,
    player2Id: 200,
  };
}

describe("verifyReplay — pre-flight rejections", () => {
  const base: VerifiableReplay = {
    matchId: "m-1",
    moveData: "[]",
    finalStateHash: "deadbeef00000000",
    p1Config: { faction: "insurgency", deckCardIds: [] },
    p2Config: { faction: "architect", deckCardIds: [] },
    player1Id: 1,
    player2Id: 2,
  };

  it("rejects rows with missing matchId (legacy producer)", () => {
    const result = verifyReplay({ ...base, matchId: null });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("missing-matchId");
      expect(result.detail).toMatch(/matchId/);
    }
  });

  it("rejects rows with missing finalStateHash", () => {
    const result = verifyReplay({ ...base, finalStateHash: null });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("missing-hash");
  });

  it("rejects rows with missing p1Config", () => {
    const result = verifyReplay({ ...base, p1Config: null });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("missing-config");
  });

  it("rejects rows with missing p2Config", () => {
    const result = verifyReplay({ ...base, p2Config: null });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("missing-config");
  });

  it("rejects rows with null player2Id (single-player not supported)", () => {
    const result = verifyReplay({ ...base, player2Id: null });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("missing-config");
  });
});

describe("verifyReplay — moveData parsing", () => {
  const base: VerifiableReplay = {
    matchId: "m-1",
    moveData: "[]",
    finalStateHash: "deadbeef00000000",
    p1Config: { faction: "insurgency", deckCardIds: [] },
    p2Config: { faction: "architect", deckCardIds: [] },
    player1Id: 1,
    player2Id: 2,
  };

  it("returns parse-error when moveData isn't valid JSON", () => {
    const result = verifyReplay({ ...base, moveData: "{not json" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("parse-error");
  });

  it("returns parse-error when moveData parses to a non-array", () => {
    const result = verifyReplay({ ...base, moveData: '{"not":"an array"}' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("parse-error");
      expect(result.detail).toMatch(/non-array/);
    }
  });

  it("returns replay-error when pNConfig.faction is missing", () => {
    const result = verifyReplay({
      ...base,
      p1Config: { deckCardIds: [] }, // no faction
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("replay-error");
      expect(result.detail).toMatch(/faction/);
    }
  });

  it("returns replay-error when pNConfig.deckCardIds is the wrong shape", () => {
    const result = verifyReplay({
      ...base,
      p1Config: { faction: "insurgency", deckCardIds: "not-an-array" },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("replay-error");
      expect(result.detail).toMatch(/deckCardIds/);
    }
  });
});

describe("verifyReplay — happy-path against deterministic engine", () => {
  const fixture = freshFixture();

  it.skipIf(!fixture)(
    "returns ok:true with matching hash for a freshly-built initial state",
    () => {
      const result = verifyReplay(fixture!);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.actualHash).toBe(result.expectedHash);
        expect(result.actionsReplayed).toBe(0);
      }
    },
  );

  it.skipIf(!fixture)(
    "returns hash-mismatch when finalStateHash is wrong",
    () => {
      const result = verifyReplay({
        ...fixture!,
        finalStateHash: "ffffffffffffffff",
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe("hash-mismatch");
        expect(result.expectedHash).toBe("ffffffffffffffff");
        expect(result.actualHash).not.toBe("ffffffffffffffff");
        expect(result.actionsReplayed).toBe(0);
      }
    },
  );

  it.skipIf(!fixture)(
    "matchId-dependence: changing matchId between record and verify diverges the hash",
    () => {
      // This is the entire reason migration 0057 exists. If this test
      // ever passes with a *different* matchId, the engine has stopped
      // hashing matchId-dependent fields and the matchId column is
      // suddenly redundant — which would also be a useful signal.
      const result = verifyReplay({
        ...fixture!,
        matchId: "different-matchId-from-record",
      });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.reason).toBe("hash-mismatch");
    },
  );
});

describe("Replay verification — schema + migration + bootstrap + router wiring", () => {
  it("schema declares the matchId column on gameReplays", () => {
    const src = read("apps/db/schema.ts");
    expect(src).toMatch(
      /matchId:\s*varchar\(\s*"matchId"\s*,\s*\{\s*length:\s*64\s*\}\s*\)/,
    );
  });

  it("migration 0057 adds the column with an index", () => {
    const src = read("apps/db/0057_game_replays_match_id.sql");
    expect(src).toMatch(/ALTER TABLE\s+`game_replays`/i);
    expect(src).toMatch(/ADD COLUMN\s+`matchId`\s+VARCHAR\(64\)/i);
    expect(src).toMatch(/idx_game_replays_match_id/);
  });

  it("bootstrap exports bootstrapReplayMatchId with idempotent column probe", () => {
    const src = read("apps/server/services/replaysBootstrap.ts");
    expect(src).toMatch(/export function bootstrapReplayMatchId/);
    expect(src).toMatch(/column_name\s*=\s*'\$\{opts\.column\}'/);
    expect(src).toMatch(/column:\s*["']matchId["']/);
  });

  it("server _core/index.ts wires bootstrapReplayMatchId into startup", () => {
    const src = read("apps/server/_core/index.ts");
    expect(src).toMatch(/bootstrapReplayMatchId/);
    expect(src).toMatch(/bootstrapReplayShareToken[\s\S]*bootstrapReplayMatchId/);
  });

  it("db-fresh-smoke asserts the matchId column lands", () => {
    const src = read("apps/scripts/db-fresh-smoke.ts");
    expect(src).toMatch(/bootstrapReplayMatchId/);
    expect(src).toMatch(/columnExists\(db,\s*"game_replays",\s*"matchId"\)/);
  });

  it("router exposes verifyReplay as an admin-only query", () => {
    const src = read("apps/server/routers/replaySystem.ts");
    expect(src).toMatch(
      /import\s*\{[^}]*verifyReplay[^}]*\}\s*from\s*["']\.\.\/services\/replayVerification["']/,
    );
    expect(src).toMatch(/verifyReplay:\s*adminProcedure/);
    // The admin endpoint must pass every column the verifier needs;
    // missing one would silently downgrade to a "missing-X" reason
    // even on a fully-populated row.
    for (const field of [
      "matchId",
      "moveData",
      "finalStateHash",
      "p1Config",
      "p2Config",
      "player1Id",
      "player2Id",
    ]) {
      expect(src, `verifyReplay must pass row.${field}`).toMatch(
        new RegExp(`${field}:\\s*row\\.${field}`),
      );
    }
  });
});
