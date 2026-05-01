/**
 * Dreamer Awareness service.
 *
 * Silent counter that powers the covert side of the dual-faction
 * recruitment system (D1 in
 * /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md).
 *
 * The Dreamer never speaks. The visible signal a player receives is
 * the coded vision cutscene that fires when their awareness count
 * crosses a Discordian threshold (3 / 7 / 13 / 23). Until that
 * threshold lands, the counter accumulates silently — no UI, no
 * progress bar, no leaderboard. Players who notice they're being
 * watched figure it out from the visions.
 *
 * Contracts:
 *   - Each tag id fires at most once per user. Repeat calls are
 *     idempotent and return `{ alreadyFired: true, count }` so
 *     callers can detect the no-op.
 *   - The DB is the source of truth; a missing pool means the
 *     gameplay continues to work and tag fires are silently
 *     dropped (no throws, no crashes).
 *   - Threshold crossings are computed at write time from the
 *     `prevCount → newCount` transition and surfaced in the
 *     return value so callers (vision delivery system) can
 *     queue cutscenes without re-querying.
 */
import { eq } from "drizzle-orm";
import { dreamerAwareness } from "../../db/schema";
import {
  getDreamerAwarenessTag,
  thresholdCrossed,
} from "../../shared/dreamerAwarenessTags";
import { getDb } from "../db";
import { logger } from "../logger";

export interface TagDreamerResult {
  /** True if this call advanced the counter; false if the tag had
   *  already fired before (idempotent retry / re-trigger). */
  readonly applied: boolean;
  /** Whether the tag had already fired before this call. Mirrors
   *  `!applied` for callers that prefer the affirmative shape. */
  readonly alreadyFired: boolean;
  /** Counter value AFTER this call. Equal to the previous count when
   *  the tag had already fired. */
  readonly count: number;
  /** If a vision threshold was crossed by this fire, the threshold
   *  value (3 / 7 / 13 / 23). Otherwise undefined. The vision
   *  delivery system reads this to enqueue the corresponding
   *  cutscene. */
  readonly thresholdCrossed: number | undefined;
}

const NO_OP_RESULT: TagDreamerResult = {
  applied: false,
  alreadyFired: false,
  count: 0,
  thresholdCrossed: undefined,
};

/**
 * Record a Dreamer-aware action against `userId`. The tag id must
 * exist in `apps/shared/dreamerAwarenessTags.ts`; unknown ids are
 * a logged no-op rather than a throw, so a content-side typo can't
 * crash a gameplay flow.
 */
export async function tagDreamerAwareness(
  userId: number,
  tagId: string,
): Promise<TagDreamerResult> {
  const tag = getDreamerAwarenessTag(tagId);
  if (!tag) {
    logger.warn(`[dreamerAwareness] unknown tag id: ${tagId}`);
    return NO_OP_RESULT;
  }

  const db = await getDb();
  if (!db) return NO_OP_RESULT;

  try {
    const [existing] = await db
      .select()
      .from(dreamerAwareness)
      .where(eq(dreamerAwareness.userId, userId))
      .limit(1);

    if (!existing) {
      const newCount = tag.weight;
      await db.insert(dreamerAwareness).values({
        userId,
        awarenessCount: newCount,
        tagsFired: tag.id,
        visionsReceived: [],
        lastTagAt: new Date(),
      });
      return {
        applied: true,
        alreadyFired: false,
        count: newCount,
        thresholdCrossed: thresholdCrossed(0, newCount),
      };
    }

    if (firedTagsContains(existing.tagsFired, tag.id)) {
      return {
        applied: false,
        alreadyFired: true,
        count: existing.awarenessCount,
        thresholdCrossed: undefined,
      };
    }

    const prevCount = existing.awarenessCount;
    const newCount = prevCount + tag.weight;
    const newTags = existing.tagsFired
      ? `${existing.tagsFired}|${tag.id}`
      : tag.id;
    await db
      .update(dreamerAwareness)
      .set({
        awarenessCount: newCount,
        tagsFired: newTags,
        lastTagAt: new Date(),
      })
      .where(eq(dreamerAwareness.userId, userId));

    return {
      applied: true,
      alreadyFired: false,
      count: newCount,
      thresholdCrossed: thresholdCrossed(prevCount, newCount),
    };
  } catch (e) {
    logger.warn(
      `[dreamerAwareness] tag '${tagId}' for user ${userId} failed: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
    return NO_OP_RESULT;
  }
}

export interface DreamerAwarenessSnapshot {
  readonly userId: number;
  readonly count: number;
  readonly tagsFired: readonly string[];
  readonly visionsReceived: readonly string[];
}

/**
 * Read the current awareness state for `userId`. Returns null when
 * the user has no row yet (no tag has fired) or when the DB is
 * unavailable. The vision delivery system uses this at login to
 * decide whether a queued vision is pending.
 */
export async function getDreamerAwareness(
  userId: number,
): Promise<DreamerAwarenessSnapshot | null> {
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
      userId: row.userId,
      count: row.awarenessCount,
      tagsFired: parseFiredTags(row.tagsFired),
      visionsReceived: row.visionsReceived ?? [],
    };
  } catch (e) {
    logger.warn(
      `[dreamerAwareness] read for user ${userId} failed: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
    return null;
  }
}

/**
 * Record that a vision id has been delivered to `userId`. Idempotent
 * — re-calling with the same vision id is a no-op. The vision
 * delivery system writes here on cutscene completion so the next
 * threshold check doesn't re-fire the same vision.
 */
export async function markVisionReceived(
  userId: number,
  visionId: string,
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const [row] = await db
      .select()
      .from(dreamerAwareness)
      .where(eq(dreamerAwareness.userId, userId))
      .limit(1);
    if (!row) {
      // No counter row yet — visions can't have been delivered without
      // an awareness fire first, so this is a producer-side bug.
      // Log and bail.
      logger.warn(
        `[dreamerAwareness] markVisionReceived(${userId}, ${visionId}) — no counter row exists`,
      );
      return;
    }
    const existing = row.visionsReceived ?? [];
    if (existing.includes(visionId)) return;
    await db
      .update(dreamerAwareness)
      .set({ visionsReceived: [...existing, visionId] })
      .where(eq(dreamerAwareness.userId, userId));
  } catch (e) {
    logger.warn(
      `[dreamerAwareness] markVisionReceived for user ${userId} failed: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
  }
}

/* ─── helpers ─── */

function firedTagsContains(tagsFired: string, id: string): boolean {
  if (!tagsFired) return false;
  // Tokenize on the pipe delimiter so we don't match `id` as a
  // substring of a longer tag (e.g. "ask_dream" matching inside
  // "ask_dream_repeated").
  for (const t of tagsFired.split("|")) {
    if (t === id) return true;
  }
  return false;
}

function parseFiredTags(tagsFired: string): readonly string[] {
  if (!tagsFired) return [];
  return tagsFired.split("|").filter((t) => t.length > 0);
}
