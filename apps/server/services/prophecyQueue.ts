/**
 * Prophecy queue — server-side three-sink router.
 *
 * The reactor (GameContext.setNarrativeFlag) calls
 * enqueueProphecyForFlag on every false→true narrative-flag
 * transition. This service looks up the bound prophecy vision in
 * apps/shared/prophecyVisionMap.ts and, depending on its intensity,
 * routes it to one of three sinks:
 *
 *   - marquee → pendingMarqueeIds (drained ≤ 1 per session by
 *     the DreamerVisionPlayer; renders dream-mode interrupt
 *     with bookends + awaken).
 *   - whisper → unlockedWhisperIds (visible in the Antiquarian's
 *     Index; never interrupts).
 *   - static  → no row mutation; client-side memorable-moments
 *     stream picks it up via the existing slideshow_watched
 *     emission path (we just return it so the client can echo
 *     a one-line prophecy stamp).
 *
 * Pacing: drainNextMarquee enforces ≤ 1 marquee per session via
 * lastMarqueePlayedAt. The session window is whatever the auth
 * layer considers "this login" — DreamerVisionPlayer fires once
 * per page load already, and lastMarqueePlayedAt prevents the
 * same session from draining twice if the component remounts.
 *
 * First-contact gate: while `daniel_cross_first_contact` is
 * unset, only the First Visitation marquee can drain. Other
 * pending marquees stay queued.
 */

import { eq } from "drizzle-orm";
import { dreamerAwareness } from "../../db/schema";
import {
  findProphecyForFlag,
  getProphecyVisionById,
  isProphecyEligible,
  resolveBookend,
  type ProphecyVision,
  type PlayerProphecySnapshot,
} from "../../shared/prophecyVisionMap";
import { getDb } from "../db";
import { logger } from "../logger";

/** A session window: marquees can drain at most once per. */
const SESSION_WINDOW_MS = 30 * 60 * 1000; // 30 min — tuned to a typical play session

export interface EnqueueResult {
  readonly enqueued: boolean;
  readonly intensity?: ProphecyVision["intensity"];
  readonly visionId?: string;
  readonly reason?:
    | "no_binding"
    | "ineligible"
    | "already_queued"
    | "already_received"
    | "already_viewed"
    | "no_db";
}

interface ProphecyAwarenessRow {
  prophecyVisionsReceived: string[];
  pendingMarqueeIds: string[];
  prophecyVisionsCompleted: string[];
  unlockedWhisperIds: string[];
  viewedWhisperIds: string[];
  albumFilmsCompleted: string[];
  albumFilmBookmarks: Record<string, string>;
  prophecyAchievementsGranted: string[];
  awarenessCount: number;
  lastMarqueePlayedAt: Date | null;
}

function emptyProphecyState(): ProphecyAwarenessRow {
  return {
    prophecyVisionsReceived: [],
    pendingMarqueeIds: [],
    prophecyVisionsCompleted: [],
    unlockedWhisperIds: [],
    viewedWhisperIds: [],
    albumFilmsCompleted: [],
    albumFilmBookmarks: {},
    prophecyAchievementsGranted: [],
    awarenessCount: 0,
    lastMarqueePlayedAt: null,
  };
}

async function readProphecyState(
  userId: number,
): Promise<ProphecyAwarenessRow | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const [row] = await db
      .select()
      .from(dreamerAwareness)
      .where(eq(dreamerAwareness.userId, userId))
      .limit(1);
    if (!row) return null;
    return {
      prophecyVisionsReceived: row.prophecyVisionsReceived ?? [],
      pendingMarqueeIds: row.pendingMarqueeIds ?? [],
      prophecyVisionsCompleted: row.prophecyVisionsCompleted ?? [],
      unlockedWhisperIds: row.unlockedWhisperIds ?? [],
      viewedWhisperIds: row.viewedWhisperIds ?? [],
      albumFilmsCompleted: row.albumFilmsCompleted ?? [],
      albumFilmBookmarks: row.albumFilmBookmarks ?? {},
      prophecyAchievementsGranted: row.prophecyAchievementsGranted ?? [],
      awarenessCount: row.awarenessCount,
      lastMarqueePlayedAt: row.lastMarqueePlayedAt ?? null,
    };
  } catch (e) {
    logger.warn(
      `[prophecyQueue] readProphecyState(${userId}) failed: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
    return null;
  }
}

/** Snapshot the player's eligibility state. The caller passes
 *  in `currentAct` and `firstContactReceived` because those live
 *  in narrative state, not the dreamer_awareness row. */
export interface EligibilitySnapshot {
  readonly currentAct: number;
  readonly firstContactReceived: boolean;
}

/**
 * Enqueue the prophecy bound to `flagId`, if any. No-ops cleanly
 * for unbound flags, ineligible visions, or re-fires.
 *
 * Routing:
 *   - marquee  → appended to pendingMarqueeIds (deduped)
 *   - whisper  → appended to unlockedWhisperIds (deduped)
 *   - static   → no DB mutation; the caller is expected to record
 *     a slideshow_watched memorable moment with the prophecy line.
 */
export async function enqueueProphecyForFlag(
  userId: number,
  flagId: string,
  snapshot: EligibilitySnapshot,
): Promise<EnqueueResult> {
  const vision = findProphecyForFlag(flagId);
  if (!vision) return { enqueued: false, reason: "no_binding" };

  const db = await getDb();
  if (!db) return { enqueued: false, reason: "no_db" };

  const state = (await readProphecyState(userId)) ?? emptyProphecyState();

  const eligibilitySnapshot: PlayerProphecySnapshot = {
    awareness: state.awarenessCount,
    currentAct: snapshot.currentAct,
    firstContactReceived: snapshot.firstContactReceived,
  };
  if (!isProphecyEligible(vision, eligibilitySnapshot)) {
    return {
      enqueued: false,
      intensity: vision.intensity,
      visionId: vision.id,
      reason: "ineligible",
    };
  }

  if (vision.intensity === "marquee") {
    if (state.prophecyVisionsReceived.includes(vision.id)) {
      return {
        enqueued: false,
        intensity: vision.intensity,
        visionId: vision.id,
        reason: "already_received",
      };
    }
    if (state.pendingMarqueeIds.includes(vision.id)) {
      return {
        enqueued: false,
        intensity: vision.intensity,
        visionId: vision.id,
        reason: "already_queued",
      };
    }
    try {
      await db
        .update(dreamerAwareness)
        .set({
          pendingMarqueeIds: [...state.pendingMarqueeIds, vision.id],
        })
        .where(eq(dreamerAwareness.userId, userId));
    } catch (e) {
      logger.warn(
        `[prophecyQueue] marquee enqueue failed for user ${userId}: ${
          e instanceof Error ? e.message : String(e)
        }`,
      );
      return { enqueued: false, reason: "no_db" };
    }
    return { enqueued: true, intensity: "marquee", visionId: vision.id };
  }

  if (vision.intensity === "whisper") {
    if (state.unlockedWhisperIds.includes(vision.id)) {
      return {
        enqueued: false,
        intensity: vision.intensity,
        visionId: vision.id,
        reason: "already_queued",
      };
    }
    if (state.viewedWhisperIds.includes(vision.id)) {
      return {
        enqueued: false,
        intensity: vision.intensity,
        visionId: vision.id,
        reason: "already_viewed",
      };
    }
    try {
      await db
        .update(dreamerAwareness)
        .set({
          unlockedWhisperIds: [...state.unlockedWhisperIds, vision.id],
        })
        .where(eq(dreamerAwareness.userId, userId));
    } catch (e) {
      logger.warn(
        `[prophecyQueue] whisper unlock failed for user ${userId}: ${
          e instanceof Error ? e.message : String(e)
        }`,
      );
      return { enqueued: false, reason: "no_db" };
    }
    return { enqueued: true, intensity: "whisper", visionId: vision.id };
  }

  // static — no DB mutation; caller emits the memorable-moment.
  return { enqueued: true, intensity: "static", visionId: vision.id };
}

/**
 * Drain the next marquee for `userId`, enforcing the ≤ 1 per
 * session rule. Returns null when nothing is pending OR when
 * a marquee already played in the current session. Marks the
 * vision as received (not yet completed) so it stops queueing.
 *
 * First-contact promotion: if `firstContactReceived` is false
 * and the First Visitation (`pv_first_visitation`) is in the
 * pending list, that vision is drained ahead of any other.
 */
export async function drainNextMarquee(
  userId: number,
  snapshot: EligibilitySnapshot,
): Promise<{
  vision: ProphecyVision;
  bookend: ReturnType<typeof resolveBookend>;
} | null> {
  const db = await getDb();
  if (!db) return null;
  const state = await readProphecyState(userId);
  if (!state) return null;
  if (state.pendingMarqueeIds.length === 0) return null;

  // Session-pacing gate.
  if (state.lastMarqueePlayedAt) {
    const elapsed = Date.now() - state.lastMarqueePlayedAt.getTime();
    if (elapsed < SESSION_WINDOW_MS) {
      return null;
    }
  }

  // First-contact promotion.
  let visionId: string | undefined;
  if (
    !snapshot.firstContactReceived &&
    state.pendingMarqueeIds.includes("pv_first_visitation")
  ) {
    visionId = "pv_first_visitation";
  } else {
    visionId = state.pendingMarqueeIds.find((id) => {
      const v = getProphecyVisionById(id);
      if (!v) return false;
      return isProphecyEligible(v, {
        awareness: state.awarenessCount,
        currentAct: snapshot.currentAct,
        firstContactReceived: snapshot.firstContactReceived,
      });
    });
  }
  if (!visionId) return null;

  const vision = getProphecyVisionById(visionId);
  if (!vision) return null;
  const bookend = resolveBookend(vision);

  // Mark received; remove from pending; bump session timestamp.
  const nextPending = state.pendingMarqueeIds.filter((id) => id !== vision.id);
  const nextReceived = state.prophecyVisionsReceived.includes(vision.id)
    ? state.prophecyVisionsReceived
    : [...state.prophecyVisionsReceived, vision.id];

  try {
    await db
      .update(dreamerAwareness)
      .set({
        pendingMarqueeIds: nextPending,
        prophecyVisionsReceived: nextReceived,
        lastMarqueePlayedAt: new Date(),
      })
      .where(eq(dreamerAwareness.userId, userId));
  } catch (e) {
    logger.warn(
      `[prophecyQueue] drainNextMarquee write failed for user ${userId}: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
    return null;
  }

  return { vision, bookend };
}

/**
 * Mark a marquee as completed in full or awoken-early. Only "full"
 * counts toward the Witness ladder — awoken-early just records the
 * partial. Idempotent.
 */
export async function markMarqueeWatched(
  userId: number,
  visionId: string,
  watched: "full" | "awoken_early",
): Promise<{ success: boolean; granted: boolean }> {
  const vision = getProphecyVisionById(visionId);
  if (!vision) return { success: false, granted: false };
  if (vision.intensity !== "marquee") {
    return { success: false, granted: false };
  }

  const db = await getDb();
  if (!db) return { success: false, granted: false };
  const state = await readProphecyState(userId);
  if (!state) return { success: false, granted: false };

  const alreadyComplete = state.prophecyVisionsCompleted.includes(visionId);
  if (watched === "awoken_early" || alreadyComplete) {
    // Awoken-early: no completion grant. If the player later
    // re-watches in full from the Index, the Index path can
    // still upgrade them to completed.
    return { success: true, granted: false };
  }

  try {
    await db
      .update(dreamerAwareness)
      .set({
        prophecyVisionsCompleted: [...state.prophecyVisionsCompleted, visionId],
      })
      .where(eq(dreamerAwareness.userId, userId));
  } catch (e) {
    logger.warn(
      `[prophecyQueue] markMarqueeWatched write failed for user ${userId}: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
    return { success: false, granted: false };
  }
  return { success: true, granted: true };
}

/** Mark a Whisper or Static (or replayed Marquee) viewed in full
 *  from the Antiquarian's Index. Counts toward Album Archivist
 *  and Antiquarian's Codex tiers. Idempotent. */
export async function markIndexViewed(
  userId: number,
  visionId: string,
): Promise<{ success: boolean; granted: boolean }> {
  const vision = getProphecyVisionById(visionId);
  if (!vision) return { success: false, granted: false };

  const db = await getDb();
  if (!db) return { success: false, granted: false };
  const state = await readProphecyState(userId);
  if (!state) return { success: false, granted: false };

  if (state.viewedWhisperIds.includes(visionId)) {
    return { success: true, granted: false };
  }
  // If a marquee that was awoken-early is now watched in full from
  // the Index, also promote it to completed.
  const promoteCompleted =
    vision.intensity === "marquee" &&
    !state.prophecyVisionsCompleted.includes(visionId);
  try {
    await db
      .update(dreamerAwareness)
      .set({
        viewedWhisperIds: [...state.viewedWhisperIds, visionId],
        prophecyVisionsCompleted: promoteCompleted
          ? [...state.prophecyVisionsCompleted, visionId]
          : state.prophecyVisionsCompleted,
      })
      .where(eq(dreamerAwareness.userId, userId));
  } catch (e) {
    logger.warn(
      `[prophecyQueue] markIndexViewed write failed for user ${userId}: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
    return { success: false, granted: false };
  }
  return { success: true, granted: true };
}

/** Mark an album-as-film viewing complete (no awaken). Counts
 *  toward the Album Film Witness tier. Idempotent. */
export async function markAlbumFilmComplete(
  userId: number,
  albumSlug: string,
): Promise<{ success: boolean; granted: boolean }> {
  const db = await getDb();
  if (!db) return { success: false, granted: false };
  const state = await readProphecyState(userId);
  if (!state) return { success: false, granted: false };
  if (state.albumFilmsCompleted.includes(albumSlug)) {
    return { success: true, granted: false };
  }
  try {
    await db
      .update(dreamerAwareness)
      .set({
        albumFilmsCompleted: [...state.albumFilmsCompleted, albumSlug],
        // Clear the bookmark — the film is done.
        albumFilmBookmarks: Object.fromEntries(
          Object.entries(state.albumFilmBookmarks).filter(
            ([slug]) => slug !== albumSlug,
          ),
        ),
      })
      .where(eq(dreamerAwareness.userId, userId));
  } catch (e) {
    logger.warn(
      `[prophecyQueue] markAlbumFilmComplete write failed for user ${userId}: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
    return { success: false, granted: false };
  }
  return { success: true, granted: true };
}

/** Save / clear an album-film bookmark. Used when the player
 *  hits "Awaken from the Album" — the position is recorded so
 *  the film can resume on next visit. */
export async function setAlbumFilmBookmark(
  userId: number,
  albumSlug: string,
  trackId: string | null,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const state = await readProphecyState(userId);
  if (!state) return;
  const next = { ...state.albumFilmBookmarks };
  if (trackId) next[albumSlug] = trackId;
  else delete next[albumSlug];
  try {
    await db
      .update(dreamerAwareness)
      .set({ albumFilmBookmarks: next })
      .where(eq(dreamerAwareness.userId, userId));
  } catch (e) {
    logger.warn(
      `[prophecyQueue] setAlbumFilmBookmark write failed for user ${userId}: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
  }
}

/** Read the player's full prophecy progress snapshot — used by
 *  the Antiquarian's Index and the achievement evaluator. */
export async function getProphecyProgress(userId: number): Promise<{
  marqueesReceived: readonly string[];
  marqueesCompleted: readonly string[];
  unlockedWhispers: readonly string[];
  viewedInIndex: readonly string[];
  albumFilmsCompleted: readonly string[];
  albumFilmBookmarks: Readonly<Record<string, string>>;
  achievementsGranted: readonly string[];
  pendingMarquees: readonly string[];
} | null> {
  const state = await readProphecyState(userId);
  if (!state) return null;
  return {
    marqueesReceived: state.prophecyVisionsReceived,
    marqueesCompleted: state.prophecyVisionsCompleted,
    unlockedWhispers: state.unlockedWhisperIds,
    viewedInIndex: state.viewedWhisperIds,
    albumFilmsCompleted: state.albumFilmsCompleted,
    albumFilmBookmarks: state.albumFilmBookmarks,
    achievementsGranted: state.prophecyAchievementsGranted,
    pendingMarquees: state.pendingMarqueeIds,
  };
}
