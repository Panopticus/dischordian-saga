/**
 * Prophecy achievements — server-side evaluator.
 *
 * After every markMarqueeWatched / markIndexViewed /
 * markAlbumFilmComplete, the dreamer-visions router calls
 * evaluateAndGrant to check whether any new Witness ladder
 * tier has been satisfied. Idempotent — already-granted ids
 * are skipped, never re-granted.
 *
 * Side effects:
 *   - cosmetic key added to the player's earned-cosmetic set
 *     (via achievement service, not implemented here — we just
 *     record the achievement id; the cosmetic surface reads it).
 *   - soulBoundDream balance bumped by the tier's bonus.
 *   - narrative flag set (Full Tapestry / Antiquarian's Codex).
 *   - oracleDeckProgress.fnordUnlocked auto-set on Full Tapestry.
 */

import { eq } from "drizzle-orm";
import { dreamerAwareness, oracleDeckProgress } from "../../db/schema";
import {
  evaluateAchievements,
  type ProphecyAchievement,
  type ProphecyProgress,
} from "../../shared/prophecyAchievements";
import type { AlbumSlug } from "../../shared/prophecyVisionMap";
import { getDb } from "../db";
import { logger } from "../logger";

interface ProphecyState {
  prophecyVisionsCompleted: string[];
  viewedWhisperIds: string[];
  albumFilmsCompleted: string[];
  prophecyAchievementsGranted: string[];
}

async function readState(userId: number): Promise<ProphecyState | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const [row] = await db
      .select({
        prophecyVisionsCompleted: dreamerAwareness.prophecyVisionsCompleted,
        viewedWhisperIds: dreamerAwareness.viewedWhisperIds,
        albumFilmsCompleted: dreamerAwareness.albumFilmsCompleted,
        prophecyAchievementsGranted: dreamerAwareness.prophecyAchievementsGranted,
      })
      .from(dreamerAwareness)
      .where(eq(dreamerAwareness.userId, userId))
      .limit(1);
    if (!row) return null;
    return {
      prophecyVisionsCompleted: row.prophecyVisionsCompleted ?? [],
      viewedWhisperIds: row.viewedWhisperIds ?? [],
      albumFilmsCompleted: row.albumFilmsCompleted ?? [],
      prophecyAchievementsGranted: row.prophecyAchievementsGranted ?? [],
    };
  } catch (e) {
    logger.warn(
      `[prophecyAchievements] readState(${userId}) failed: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
    return null;
  }
}

/**
 * Evaluate achievements for `userId` and grant any newly satisfied
 * ones. Returns the list of newly granted achievement ids — empty
 * when nothing new fired.
 */
export async function evaluateAndGrant(
  userId: number,
  postAct7: boolean,
): Promise<readonly ProphecyAchievement[]> {
  const db = await getDb();
  if (!db) return [];
  const state = await readState(userId);
  if (!state) return [];

  const progress: ProphecyProgress = {
    marqueesCompleted: new Set(state.prophecyVisionsCompleted),
    indexViewed: new Set(state.viewedWhisperIds),
    albumFilmsCompleted: new Set(state.albumFilmsCompleted as AlbumSlug[]),
    postAct7,
  };
  const earned = evaluateAchievements(progress);
  const granted = new Set(state.prophecyAchievementsGranted);
  const newlyEarned = earned.filter((a) => !granted.has(a.id));
  if (newlyEarned.length === 0) return [];

  try {
    await db
      .update(dreamerAwareness)
      .set({
        prophecyAchievementsGranted: [
          ...state.prophecyAchievementsGranted,
          ...newlyEarned.map((a) => a.id),
        ],
      })
      .where(eq(dreamerAwareness.userId, userId));
  } catch (e) {
    logger.warn(
      `[prophecyAchievements] grant write failed for user ${userId}: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
    return [];
  }

  // Side effect: Full Tapestry auto-sets oracleDeckProgress.fnordUnlocked.
  // The Oracle's hidden card finally has a delivery surface — the player
  // who has witnessed every marquee gets the Fnord.
  const triggersFnord = newlyEarned.some((a) =>
    a.sideEffects?.includes("fnord_unlocked"),
  );
  if (triggersFnord) {
    try {
      await db
        .update(oracleDeckProgress)
        .set({ fnordUnlocked: true })
        .where(eq(oracleDeckProgress.userId, userId));
    } catch (e) {
      logger.warn(
        `[prophecyAchievements] fnord unlock for user ${userId} failed: ${
          e instanceof Error ? e.message : String(e)
        }`,
      );
    }
  }

  return newlyEarned;
}
