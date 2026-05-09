/* ═══════════════════════════════════════════════════════
   MYSTERY CLOSURE RESOLVER — server consumer of AR3.

   audit/16 PR 33 (consumer follow-up to PR 27 / finding AR3).

   Pre-PR-27, mysteries compiled at boot from
   mysteryRegistryBootstrap.ts and never reacted to mid-saga
   player choices. PR 27 shipped the schema (the
   `playerInfluenceGates` field on MysteryDefinition + the
   pure resolver `chooseMysteryClosureBranch`). This module
   is the runtime consumer: it loads the player's current
   state from the canonical DB tables, builds a
   MysteryInfluenceState, and returns the resolved branch.

   Pure resolver (`resolveMysteryClosureBranch`) is exported
   as well so unit tests don't need a live DB; the
   DB-touching wrapper (`resolvePlayerMysteryClosureBranch`)
   loads state, then delegates.

   Snapshot-on-close invariant — the `mergeDiscoveredEvidence`
   helper that protects already-discovered clues lives on
   the shared module; the runtime caller is expected to
   merge the player's existing evidence list against the
   resolved branch's evidence list before surfacing the new
   branch. This module surfaces the helper for convenience
   so consumers can find both pieces from one import.
   ═══════════════════════════════════════════════════════ */

import { and, eq } from "drizzle-orm";

import { getDb } from "../db";
import { logger } from "../logger";
import {
  characterSheets,
  npcTrustScalars,
  userProgress,
} from "../../db/schema";
import {
  chooseMysteryClosureBranch,
  mergeDiscoveredEvidence,
  type MysteryDefinition,
  type MysteryId,
  type MysteryInfluenceState,
} from "@shared/mysteryTypes";
import { lookupMystery } from "./mysteryRegistry";

/** What the resolver returns. `null` when no gate matched —
 *  caller falls back to the mystery's authored default
 *  closure. */
export type MysteryClosureResolution =
  | { gateId: string; branchId: string }
  | null;

/** Pure resolver — passed an explicit MysteryInfluenceState.
 *  Used directly in tests; the DB-touching wrapper below
 *  builds the state and calls this. Surfaces the underlying
 *  shared helper so consumers don't need to import
 *  mysteryTypes directly. */
export function resolveMysteryClosureBranch(
  mystery: Pick<MysteryDefinition, "playerInfluenceGates">,
  state: MysteryInfluenceState,
): MysteryClosureResolution {
  return chooseMysteryClosureBranch(mystery, state);
}

/** Re-export the snapshot-on-close evidence merger so
 *  consumers can find both halves of the AR3 contract from a
 *  single import. */
export { mergeDiscoveredEvidence };

/* ─── DB-loading wrapper ──────────────────────────────────
   Reads player state from the canonical tables:
   - userProgress.gameData.narrativeFlags  →  ReadonlySet<string>
   - userProgress.gameData.narrativeAct    →  number
   - characterSheets.moralityScore         →  number
   - npcTrustScalars (per-companion rows)  →  Record<string, number>
   ─────────────────────────────────────────────────────── */

/** Load the player-state snapshot the resolver needs. Best-
 *  effort: every loader degrades to a safe default on error
 *  (empty flags / 0 morality / 0 act / no trust). The
 *  resolver treats absent state as "no gate matches" — the
 *  caller falls back to the authored default branch. */
export async function loadMysteryInfluenceState(
  userId: number,
): Promise<MysteryInfluenceState> {
  const db = await getDb();
  if (!db) {
    return {
      narrativeFlags: new Set<string>(),
      moralityScore: 0,
      trustByCompanion: {},
      narrativeAct: 0,
    };
  }

  const flags = new Set<string>();
  let narrativeAct = 0;
  try {
    const [row] = await db
      .select({ gameData: userProgress.gameData })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    const gameData = (row?.gameData as Record<string, unknown> | null) ?? null;
    if (gameData) {
      const f = gameData.narrativeFlags as Record<string, unknown> | undefined;
      if (f) for (const [k, v] of Object.entries(f)) if (v) flags.add(k);
      const a = gameData.narrativeAct;
      if (typeof a === "number" && Number.isFinite(a)) narrativeAct = a;
    }
  } catch (err) {
    logger.warn("[mysteryClosureResolver] readUserProgress failed:", err);
  }

  let moralityScore = 0;
  try {
    const [row] = await db
      .select({ moralityScore: characterSheets.moralityScore })
      .from(characterSheets)
      .where(eq(characterSheets.userId, userId))
      .limit(1);
    if (row && typeof row.moralityScore === "number") {
      moralityScore = row.moralityScore;
    }
  } catch (err) {
    logger.warn("[mysteryClosureResolver] readCharacterSheets failed:", err);
  }

  const trustByCompanion: Record<string, number> = {};
  try {
    const rows = await db
      .select({
        npcId: npcTrustScalars.npcId,
        scalar: npcTrustScalars.scalar,
      })
      .from(npcTrustScalars)
      .where(eq(npcTrustScalars.userId, userId));
    for (const r of rows) {
      trustByCompanion[r.npcId] = r.scalar;
    }
  } catch (err) {
    logger.warn("[mysteryClosureResolver] readTrustScalars failed:", err);
  }

  return { narrativeFlags: flags, moralityScore, trustByCompanion, narrativeAct };
}

/** End-to-end: load the player state, look up the mystery,
 *  resolve the closure branch. Returns null when the mystery
 *  is unknown, has no gates, or no gate matched (caller
 *  falls back to the authored default). */
export async function resolvePlayerMysteryClosureBranch(
  userId: number,
  mysteryId: MysteryId,
): Promise<MysteryClosureResolution> {
  const mystery = lookupMystery(mysteryId);
  if (!mystery) return null;
  const state = await loadMysteryInfluenceState(userId);
  return resolveMysteryClosureBranch(mystery, state);
}

/** Convenience wrapper that combines the resolver with the
 *  snapshot-on-close evidence merge. Used by callers that
 *  want both pieces in one shot. The branch's evidenceIds
 *  come from the resolved branch's authored episode surface
 *  (the caller looks them up after the resolver returns the
 *  branchId). */
export function applyClosureSnapshot(
  alreadyDiscovered: ReadonlyArray<string>,
  newBranchEvidenceIds: ReadonlyArray<string>,
): ReadonlyArray<string> {
  return mergeDiscoveredEvidence(alreadyDiscovered, newBranchEvidenceIds);
}
