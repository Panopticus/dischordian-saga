/* ═══════════════════════════════════════════════════════
   REPLAY VERIFICATION (#92)

   Re-execute the persisted action log of a finished match through
   the deterministic reducer and assert that the recomputed
   final-state hash matches the one stored at end-of-match. Used by
   admins to:

     - Catch engine-divergence bugs (reducer behaviour drifts between
       the version that recorded the replay and the version replaying
       it now). The action log + seed + initial state are stable;
       only the reducer changes between rulesVersions.

     - Catch stored-replay tampering (someone edits the moveData
       column directly to fake a record / a leaderboard win).

     - Sanity-check newly-shipped features that touch the engine —
       run the verifier against a sample of recent replays before
       deploying.

   The function is pure: takes a row (or a row-shaped input) and the
   server card registry, returns a structured result. The admin
   endpoint in apps/server/routers/replaySystem.ts is a thin wrapper
   that loads the row by id, calls this, and returns the result.
   ═══════════════════════════════════════════════════════ */
import {
  reduce,
  hashState,
  type Action,
  type GameState,
} from "../../shared/tcg-core";
import {
  buildMatchConfig,
  createServerMatchState,
  serverCardRegistry,
} from "../tcg/matchCore";

/** Subset of `gameReplays` columns the verifier needs. Decoupled
 *  from the Drizzle row type so unit tests can pass a literal. */
export interface VerifiableReplay {
  matchId: string | null;
  moveData: string;
  finalStateHash: string | null;
  /** JSON snapshot stored at saveReplay time. The producer in
   *  duelystWs.endMatch writes `{ faction, deckCardIds }`. */
  p1Config: Record<string, unknown> | null;
  p2Config: Record<string, unknown> | null;
  player1Id: number;
  player2Id: number | null;
}

export type VerifyReplayResult =
  | { ok: true; expectedHash: string; actualHash: string; actionsReplayed: number }
  | {
      ok: false;
      /** Why verification failed. The categories below are mutually
       *  exclusive and each maps to a distinct UI affordance:
       *    - missing-matchId / missing-hash / missing-config →
       *      "row was written under an older producer; can't verify".
       *      Don't surface as a divergence.
       *    - parse-error / replay-error / hash-mismatch →
       *      genuine engine or tampering signal. Page an admin. */
      reason:
        | "missing-matchId"
        | "missing-hash"
        | "missing-config"
        | "parse-error"
        | "replay-error"
        | "hash-mismatch";
      detail?: string;
      expectedHash?: string;
      actualHash?: string;
      actionsReplayed?: number;
      /** Index of the action that threw, if any. */
      divergedAtAction?: number;
    };

/** Re-execute the replay and check the final hash. */
export function verifyReplay(
  replay: VerifiableReplay,
  registry = serverCardRegistry,
): VerifyReplayResult {
  // ─── Pre-flight: required fields ───
  if (!replay.matchId) {
    return {
      ok: false,
      reason: "missing-matchId",
      detail:
        "Replay row predates migration 0057. New replays produced by " +
        "the post-#57 producer carry matchId; legacy rows can't be " +
        "verified because hashState() depends on the engine's " +
        "matchId-seeded card-instance ids.",
    };
  }
  if (!replay.finalStateHash) {
    return {
      ok: false,
      reason: "missing-hash",
      detail: "Stored finalStateHash is null — nothing to compare against.",
    };
  }
  if (!replay.p1Config || !replay.p2Config) {
    return {
      ok: false,
      reason: "missing-config",
      detail:
        "Per-player config snapshot (faction + deckCardIds) is null. " +
        "Replay can't be reconstructed without re-deriving the " +
        "initial GameState.",
    };
  }
  if (replay.player2Id == null) {
    return {
      ok: false,
      reason: "missing-config",
      detail: "player2Id is null — single-player replays aren't supported by the verifier yet.",
    };
  }

  // ─── Parse moveData ───
  let actionLog: Action[];
  try {
    const parsed = JSON.parse(replay.moveData);
    if (!Array.isArray(parsed)) {
      return {
        ok: false,
        reason: "parse-error",
        detail: "moveData parsed to non-array; expected JSON.stringify(Action[]).",
      };
    }
    actionLog = parsed as Action[];
  } catch (err) {
    return {
      ok: false,
      reason: "parse-error",
      detail: err instanceof Error ? err.message : String(err),
    };
  }

  // ─── Reconstruct initial GameState ───
  // Re-use the same buildMatchConfig path the live server uses so the
  // verifier exercises the production initial-state code, not a
  // verifier-only shortcut. skipValidation:true matches the live
  // queue (see duelystWs.ts:108-117) so verification doesn't bounce
  // off the partial-card-set situation.
  let state: GameState;
  try {
    const p1Built = buildMatchConfigFromSnapshot(replay.p1Config, replay.player1Id);
    const p2Built = buildMatchConfigFromSnapshot(replay.p2Config, replay.player2Id);
    state = createServerMatchState({
      matchId: replay.matchId,
      p1: p1Built,
      p2: p2Built,
    });
  } catch (err) {
    return {
      ok: false,
      reason: "replay-error",
      detail: `init failed: ${err instanceof Error ? err.message : String(err)}`,
      divergedAtAction: -1,
    };
  }

  // ─── Replay actions ───
  for (let i = 0; i < actionLog.length; i++) {
    try {
      const result = reduce(state, actionLog[i], registry);
      state = result.state;
    } catch (err) {
      return {
        ok: false,
        reason: "replay-error",
        detail: err instanceof Error ? err.message : String(err),
        divergedAtAction: i,
        actionsReplayed: i,
      };
    }
  }

  // ─── Compare hash ───
  const actualHash = hashState(state);
  if (actualHash !== replay.finalStateHash) {
    return {
      ok: false,
      reason: "hash-mismatch",
      expectedHash: replay.finalStateHash,
      actualHash,
      actionsReplayed: actionLog.length,
    };
  }

  return {
    ok: true,
    expectedHash: replay.finalStateHash,
    actualHash,
    actionsReplayed: actionLog.length,
  };
}

/** Reconstruct a real `MatchConfig` from the JSON pNConfig blob the
 *  producer writes (`{ faction, deckCardIds }`). userId comes from the
 *  separate column. Routes through the same buildMatchConfig the live
 *  server uses so generalDefId / deckCardDefIds / faction-resolution
 *  stay consistent. Throws on validation failure → caller surfaces as
 *  `replay-error`. */
function buildMatchConfigFromSnapshot(
  raw: Record<string, unknown>,
  userId: number,
) {
  const faction = raw.faction;
  const deckCardIds = raw.deckCardIds;
  if (typeof faction !== "string") {
    throw new Error(`pNConfig.faction missing or non-string (got ${typeof faction})`);
  }
  if (!Array.isArray(deckCardIds) || !deckCardIds.every((c) => typeof c === "string")) {
    throw new Error("pNConfig.deckCardIds missing or non-string-array");
  }
  const built = buildMatchConfig(
    { userId, faction, deckCardIds: deckCardIds as string[] },
    { skipValidation: true },
  );
  if (built.error || !built.config) {
    throw new Error(`buildMatchConfig failed: ${built.error ?? "no config returned"}`);
  }
  return built.config;
}
