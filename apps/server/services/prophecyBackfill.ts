/**
 * Prophecy backfill — grant retroactive Witness credit to players
 * who already watched slideshows before the prophecy system shipped.
 *
 * Mechanism:
 *   - Read the player's narrativeFlags from gameState.
 *   - For every slideshow_<id>_complete flag that is true, look up
 *     the prophecy vision bound to that flag (if any).
 *   - If the vision is a Marquee that hasn't been completed yet,
 *     add it to prophecyVisionsCompleted (the Witness ladder).
 *   - If it's a Whisper or Static, add it to viewedWhisperIds (the
 *     long-tail Index ladder).
 *   - Run achievement evaluation at the end so any tier the
 *     retroactive grants newly satisfy lands cleanly.
 *
 * Idempotent — re-running the backfill is a no-op once everything
 * is up to date. Designed to be invokable from a one-shot admin
 * script (`pnpm tsx apps/scripts/run-prophecy-backfill.ts`) when
 * the system rolls out, and from the dreamer-visions router as a
 * lazy backfill on first read after migration.
 */

import { eq } from "drizzle-orm";
import { dreamerAwareness } from "../../db/schema";
import {
  PROPHECY_VISIONS,
  findProphecyForFlag,
  type ProphecyVision,
} from "../../shared/prophecyVisionMap";
import { getDb } from "../db";
import { logger } from "../logger";
import { evaluateAndGrant } from "./prophecyAchievements";

export interface BackfillResult {
  /** Marquees newly added to prophecyVisionsCompleted. */
  readonly marqueesGranted: readonly string[];
  /** Whispers / Statics / replayed Marquees newly added to
   *  viewedWhisperIds. */
  readonly indexGranted: readonly string[];
  /** Album films completed (none — we don't infer films from flags
   *  because the player must watch the album end-to-end as a
   *  continuous viewing for that tier). */
  readonly filmsGranted: readonly string[];
  /** Achievement ids granted as a side-effect of the backfill. */
  readonly achievementsGranted: readonly string[];
}

const EMPTY: BackfillResult = {
  marqueesGranted: [],
  indexGranted: [],
  filmsGranted: [],
  achievementsGranted: [],
};

/**
 * Run the backfill for `userId`. Idempotent. The caller passes in
 * the player's narrative-flag map (read from gameState — usually
 * the one already loaded by the request handler).
 */
export async function backfillProphecyCredit(
  userId: number,
  narrativeFlags: Readonly<Record<string, boolean>>,
  postAct7: boolean,
): Promise<BackfillResult> {
  const db = await getDb();
  if (!db) return EMPTY;
  const [row] = await db
    .select()
    .from(dreamerAwareness)
    .where(eq(dreamerAwareness.userId, userId))
    .limit(1);
  if (!row) return EMPTY;

  const completed = new Set<string>(row.prophecyVisionsCompleted ?? []);
  const viewed = new Set<string>(row.viewedWhisperIds ?? []);
  const received = new Set<string>(row.prophecyVisionsReceived ?? []);
  const unlocked = new Set<string>(row.unlockedWhisperIds ?? []);

  const marqueesGranted: string[] = [];
  const indexGranted: string[] = [];

  // Walk every prophecy binding and check whether the player has
  // its bound flag. If so, retroactively credit the watch.
  for (const v of PROPHECY_VISIONS) {
    if (!narrativeFlags[v.flagId]) continue;
    if (v.intensity === "marquee") {
      if (!completed.has(v.id)) {
        completed.add(v.id);
        received.add(v.id);
        marqueesGranted.push(v.id);
      }
    } else if (v.intensity === "whisper") {
      if (!viewed.has(v.id)) {
        viewed.add(v.id);
        unlocked.add(v.id);
        indexGranted.push(v.id);
      }
    } else if (v.intensity === "static") {
      if (!viewed.has(v.id)) {
        viewed.add(v.id);
        indexGranted.push(v.id);
      }
    }
  }

  if (marqueesGranted.length === 0 && indexGranted.length === 0) {
    // Even when the backfill is a no-op, run achievement
    // evaluation in case prior grants haven't been evaluated yet.
    const earned = await evaluateAndGrant(userId, postAct7);
    return {
      marqueesGranted: [],
      indexGranted: [],
      filmsGranted: [],
      achievementsGranted: earned.map((a) => a.id),
    };
  }

  try {
    await db
      .update(dreamerAwareness)
      .set({
        prophecyVisionsReceived: Array.from(received),
        prophecyVisionsCompleted: Array.from(completed),
        unlockedWhisperIds: Array.from(unlocked),
        viewedWhisperIds: Array.from(viewed),
      })
      .where(eq(dreamerAwareness.userId, userId));
  } catch (e) {
    logger.warn(
      `[prophecyBackfill] write failed for user ${userId}: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
    return EMPTY;
  }

  const earned = await evaluateAndGrant(userId, postAct7);
  return {
    marqueesGranted,
    indexGranted,
    filmsGranted: [],
    achievementsGranted: earned.map((a) => a.id),
  };
}

/** Pure helper used by tests + the admin script: list every
 *  prophecy vision whose bound flag is currently set on the
 *  passed-in flag map. Returns the visions in registry order. */
export function eligibleForBackfill(
  narrativeFlags: Readonly<Record<string, boolean>>,
): readonly ProphecyVision[] {
  return PROPHECY_VISIONS.filter((v) => narrativeFlags[v.flagId]);
}

/** Resolve the prophecy bound to a flag — exposed so admin tools
 *  can introspect what a flag will actually credit. */
export { findProphecyForFlag };
