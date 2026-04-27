/* ═══════════════════════════════════════════════════════
   REPLAY PERSISTENCE — server-side write path for finished
   matches into `game_replays`.

   Follows the share-token PR (commit 20c6102) which added the
   unguessable URL contract. This file closes the producer half
   of #6 / #46: when a match ends, persist the action log + seed +
   rulesVersion + final-state hash so the replay can be reproduced
   end-to-end via the deterministic reducer + a /replay/<token> URL.

   Pulled into a separate service from `duelystWs.endMatch` so:
     - The DB write is fire-and-forget (the WS handler stays
       latency-bounded for sending MATCH_RESULT to both clients).
     - The serialization + insert is unit-testable without WS state.
     - When the producer rolls out to other game types (chess, pvp,
       pet-battles, etc.) they share one helper instead of duplicating
       the gameReplays insert shape across N WS handlers.
   ═══════════════════════════════════════════════════════ */
import { getDb } from "../db";
import { gameReplays } from "../../db/schema";
import { generateShareToken } from "./replayTokens";
import { logger } from "../logger";
import { hashState, type Action, type GameState } from "../../shared/tcg-core";

/** Caller-supplied snapshot of a finished match. Decoupled from
 *  `DuelystMatch` so other producers (chess, pvp, etc.) can call this
 *  without owning that exact type. */
export interface FinishedMatchSnapshot {
  /** "duelyst" | "chess" | "pvp" | "pet-battle" — used for the
   *  game_replays.gameType column and the gameType filter on
   *  getRecentByType. */
  gameType: string;
  /** UTC ms timestamp the match started — used to derive duration. */
  startedAt: number;
  player1: { userId: number; userName: string };
  player2: { userId: number; userName: string };
  /** 0 → player1 won; 1 → player2 won. */
  winnerSide: 0 | 1;
  gameState: GameState;
  actionLog: Action[];
  /** Optional per-player config snapshot (deck, faction, etc.). Stored
   *  as JSON. Pass undefined for game types without a deck concept. */
  p1Config?: Record<string, unknown>;
  p2Config?: Record<string, unknown>;
  /** Optional tags ("ranked", "tournament", "casual", etc.). */
  tags?: string[];
}

/** Result of a successful insert — returned so the WS handler can
 *  push the `shareToken` to the winning client (future feature:
 *  inline "share replay" button on the post-match panel). */
export interface ReplayPersistenceResult {
  replayId: number;
  shareToken: string;
}

/** Persist a finished match into `game_replays`. Returns the new id +
 *  shareToken on success, or `null` when the DB pool isn't configured
 *  (tests / local-without-MySQL) or the insert fails — in which case
 *  the call is logged and silently dropped so a write failure can't
 *  block the WS post-match flow.
 *
 *  Note: the moveData column is text, so the action log is serialized
 *  via JSON.stringify. Replay reconstruction reverses this with
 *  JSON.parse and feeds the actions through `reduce()` from a fresh
 *  initial state seeded with the same `seed` / `rulesVersion`. */
export async function persistFinishedMatch(
  snapshot: FinishedMatchSnapshot,
): Promise<ReplayPersistenceResult | null> {
  const db = await getDb();
  if (!db) {
    // Tests / local without MySQL — silently no-op so the WS handler
    // stays functional. The legacy console-log line in duelystWs
    // already covers the diagnostic surface for this case.
    return null;
  }

  try {
    const winnerPlayer =
      snapshot.winnerSide === 0 ? snapshot.player1 : snapshot.player2;
    const finalStateHash = hashState(snapshot.gameState);
    const moveData = JSON.stringify(snapshot.actionLog);
    const duration = Math.max(0, Date.now() - snapshot.startedAt);
    const shareToken = generateShareToken();

    const [result] = await db
      .insert(gameReplays)
      .values({
        gameType: snapshot.gameType,
        player1Id: snapshot.player1.userId,
        player1Name: snapshot.player1.userName,
        player2Id: snapshot.player2.userId,
        player2Name: snapshot.player2.userName,
        winnerId: winnerPlayer.userId,
        moveData,
        totalMoves: snapshot.actionLog.length,
        duration,
        tags: snapshot.tags ?? null,
        seed: snapshot.gameState.seed ?? null,
        rulesVersion: snapshot.gameState.rulesVersion ?? null,
        finalStateHash,
        p1Config: snapshot.p1Config ?? null,
        p2Config: snapshot.p2Config ?? null,
        shareToken,
      })
      .$returningId();

    logger.info(
      `[ReplayPersistence] saved gameType=${snapshot.gameType} replayId=${result.id} ` +
        `actions=${snapshot.actionLog.length} hash=${finalStateHash} token=${shareToken}`,
    );
    return { replayId: result.id, shareToken };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Write failure is non-fatal: the WS post-match flow already
    // sent MATCH_RESULT to both clients. Log + drop so a DB blip
    // doesn't cascade into a UI hang. Replay is just lost.
    logger.warn(
      `[ReplayPersistence] insert failed (gameType=${snapshot.gameType}): ${msg}`,
    );
    return null;
  }
}
