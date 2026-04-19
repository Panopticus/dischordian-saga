/* ═══════════════════════════════════════════════════════
   CROSS-GAME BEATS CLIENT HELPER

   Thin wrapper over the crossGameThreads.emit tRPC mutation.
   Consumers (narrative-act runners, room unlock handlers,
   recruitment mission completers) call fireCrossGameBeat()
   at the canonical narrative moment; the helper takes care
   of:

     - dispatching the mutation (emittedBy defaults to
       "loredex" — Loredex is the most common caller)
     - same-session idempotency (second call with the same
       beatId short-circuits locally, no network hop)
     - silent-failure semantics (network errors don't
       block narrative flow; beats retry on next trigger)

   The server is the source of truth; this helper is a
   convenience for game-side callers. The client never
   tries to reason about whether the server has already
   recorded the beat — it just asks. The server tells it.

   Imperative use (outside React):
     fireCrossGameBeat("cades_fall_expulsion")

   React integration: call initCrossGameBeats(trpc.useUtils())
   once from a top-level component before any consumer fires.
   ═══════════════════════════════════════════════════════ */

import type { trpc } from "./trpc";

type TrpcUtils = ReturnType<typeof trpc.useUtils>;
type TrpcClient = TrpcUtils["client"];

let client: TrpcClient | null = null;
const emittedThisSession = new Set<string>();

/**
 * Wire the helper to the tRPC client. Call once, as early as
 * possible after auth resolves. Idempotent — later calls overwrite
 * the cached reference (useful for hot-reload).
 */
export function initCrossGameBeats(utils: TrpcUtils): void {
  client = utils.client;
}

export interface FireCrossGameBeatResult {
  /** Whether the request (or the short-circuit) succeeded. */
  success: boolean;
  /** Whether the server already had this beat on record. */
  alreadyEmitted: boolean;
  /** Short-circuited locally without a server round-trip. */
  shortCircuited: boolean;
}

/**
 * Fire a cross-game beat. The beat id must match a registered entry
 * in crossGameNarrativeThreads.ts; the server will reject unknown
 * ids. Defaults `emittedBy` to "loredex" — callers in Cades FPS or
 * Dead Man's Circuit override.
 *
 * Same-session idempotency: repeated calls with the same beatId
 * return shortCircuited: true without a network request.
 *
 * Silent-failure contract: network errors are swallowed and logged.
 * Narrative flow does not block on cross-game emits.
 */
export async function fireCrossGameBeat(
  beatId: string,
  opts: {
    emittedBy?: "loredex" | "cades_fps" | "dead_mans_circuit";
  } = {},
): Promise<FireCrossGameBeatResult> {
  if (emittedThisSession.has(beatId)) {
    return { success: true, alreadyEmitted: true, shortCircuited: true };
  }
  if (!client) {
    // The app hasn't wired initCrossGameBeats yet. Don't throw —
    // narrative code should never crash because a cross-game wire
    // is missing. Log once and move on.
    console.warn(
      `[crossGameBeats] Client not initialized; skipping emit of ${beatId}`,
    );
    return { success: false, alreadyEmitted: false, shortCircuited: false };
  }
  try {
    const result = await client.crossGameThreads.emit.mutate({
      beatId,
      emittedBy: opts.emittedBy ?? "loredex",
    });
    emittedThisSession.add(beatId);
    return {
      success: result.success,
      alreadyEmitted: result.alreadyEmitted,
      shortCircuited: false,
    };
  } catch (e) {
    console.warn(`[crossGameBeats] Emit failed for ${beatId}:`, e);
    return { success: false, alreadyEmitted: false, shortCircuited: false };
  }
}

/**
 * Whether a given beat has been fired in the current session. Useful
 * for debug panels and one-shot trigger guards that want to avoid
 * even calling fireCrossGameBeat in hot loops.
 */
export function hasBeatBeenEmittedThisSession(beatId: string): boolean {
  return emittedThisSession.has(beatId);
}

/** Test-only: reset the session-local cache + client reference. */
export function _resetCrossGameBeatsForTests(): void {
  emittedThisSession.clear();
  client = null;
}
