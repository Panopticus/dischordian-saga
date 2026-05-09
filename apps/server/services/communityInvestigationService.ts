/* ═══════════════════════════════════════════════════════
   COMMUNITY INVESTIGATION SERVICE — server consumer of AR7.

   audit/16 PR 35 (consumer follow-up to PR 29 / finding AR7).

   PR 29 shipped the pure substrate
   (apps/shared/communityInvestigation.ts —
   `buildCommunitySnapshot`, `percentDiscoveredByKind`,
   `currentMilestone`, `nextMilestone`, `canPlayerContribute`).
   This service ships the persistence + read paths the tRPC
   router calls into.

   Privacy invariants the service enforces:
     - `optIn=false` rows are still persisted (so the player
       gets credit on THEIR private progress UI) but the
       cross-player snapshot drops them — `buildCommunitySnapshot`
       does this filter pure-side.
     - The snapshot returns aggregate counts only. Per-target
       sets / per-player attributions are NEVER returned to a
       cross-player consumer; the unique index
       (userId, kind, targetId) just prevents a single player
       from over-counting.
   ═══════════════════════════════════════════════════════ */

import { and, eq } from "drizzle-orm";

import { getDb } from "../db";
import { logger } from "../logger";
import { communityDiscoveryEvents } from "../../db/schema";
import {
  buildCommunitySnapshot,
  currentMilestone,
  nextMilestone,
  type CommunityDiscoveryEvent,
  type CommunityDiscoveryKind,
  type CommunityInvestigationSnapshot,
} from "@shared/communityInvestigation";

/** Args to the per-discovery insert. */
export interface RecordDiscoveryArgs {
  userId: number;
  kind: CommunityDiscoveryKind;
  targetId: string;
  optIn: boolean;
  seasonKey?: string;
  occurredAt?: Date;
}

/** Insert one discovery event. Idempotent on
 *  (userId, kind, targetId): if the same player re-discovers
 *  the same target, the original row stays — preserving the
 *  audit'd "50 players collecting clue_a counts ONCE" framing.
 *  Returns the row id (or 0 on no-op). */
export async function recordDiscoveryEvent(
  args: RecordDiscoveryArgs,
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  try {
    const [res] = await db.insert(communityDiscoveryEvents).values({
      userId: args.userId,
      kind: args.kind,
      targetId: args.targetId,
      optIn: args.optIn,
      seasonKey: args.seasonKey ?? null,
      occurredAt: args.occurredAt ?? new Date(),
    });
    return Number((res as { insertId?: number })?.insertId ?? 0);
  } catch (err) {
    // Duplicate-key on the unique index is the expected
    // "already discovered" path. Other errors get logged.
    const msg = err instanceof Error ? err.message : String(err);
    if (!/Duplicate entry/i.test(msg)) {
      logger.warn("[communityInvestigation] insert failed:", msg);
    }
    return 0;
  }
}

/** Update the optIn flag for one (user, kind, target) row.
 *  The runtime calls this when a player toggles the
 *  "contribute to community totals" setting and we want
 *  retroactive consent applied to historical rows for that
 *  user. Returns count of rows updated. */
export async function setOptInForUser(
  userId: number,
  optIn: boolean,
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  try {
    const res = await db
      .update(communityDiscoveryEvents)
      .set({ optIn })
      .where(eq(communityDiscoveryEvents.userId, userId));
    return Number((res as { rowsAffected?: number })?.rowsAffected ?? 0);
  } catch (err) {
    logger.warn("[communityInvestigation] setOptInForUser failed:", err);
    return 0;
  }
}

/** Read all events from the durable store. Internal helper —
 *  the snapshot read goes through `getCommunitySnapshot`
 *  which calls the pure aggregator. */
async function readAllEvents(): Promise<CommunityDiscoveryEvent[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select({
        id: communityDiscoveryEvents.id,
        kind: communityDiscoveryEvents.kind,
        targetId: communityDiscoveryEvents.targetId,
        optIn: communityDiscoveryEvents.optIn,
        seasonKey: communityDiscoveryEvents.seasonKey,
        occurredAt: communityDiscoveryEvents.occurredAt,
      })
      .from(communityDiscoveryEvents);
    return rows.map((r) => ({
      id: String(r.id),
      kind: r.kind as CommunityDiscoveryKind,
      targetId: r.targetId,
      optIn: Boolean(r.optIn),
      occurredAt: r.occurredAt ?? new Date(0),
      seasonKey: r.seasonKey ?? undefined,
    }));
  } catch (err) {
    logger.warn("[communityInvestigation] readAllEvents failed:", err);
    return [];
  }
}

/** Compute the snapshot. The aggregator dedupes per
 *  (kind, targetId) — so 50 players collecting clue_a
 *  contributes one count globally. */
export async function getCommunitySnapshot(options: {
  seasonKey?: string;
  declaredTargets?: Readonly<Record<CommunityDiscoveryKind, number>>;
} = {}): Promise<CommunityInvestigationSnapshot> {
  const events = await readAllEvents();
  return buildCommunitySnapshot(events, options);
}

/** Convenience: snapshot + milestone tuple. The router
 *  calls this so the UI can render
 *  (current, next, percent) in one round-trip. */
export async function getMilestoneSnapshot(options: {
  seasonKey?: string;
  declaredTargets?: Readonly<Record<CommunityDiscoveryKind, number>>;
} = {}): Promise<{
  snapshot: CommunityInvestigationSnapshot;
  currentMilestoneId: string | null;
  next: { milestoneId: string; remaining: number } | null;
}> {
  const snapshot = await getCommunitySnapshot(options);
  const cur = currentMilestone(snapshot);
  const nxt = nextMilestone(snapshot);
  return {
    snapshot,
    currentMilestoneId: cur?.id ?? null,
    next: nxt ? { milestoneId: nxt.milestone.id, remaining: nxt.remaining } : null,
  };
}

/** Read the per-user, opt-in-respecting count for a single
 *  (kind, target) — used by the player's PRIVATE progress UI
 *  to show "you found this; X others have too" without
 *  leaking who. */
export async function countDiscoverersFor(
  kind: CommunityDiscoveryKind,
  targetId: string,
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  try {
    const rows = await db
      .select({ id: communityDiscoveryEvents.id })
      .from(communityDiscoveryEvents)
      .where(
        and(
          eq(communityDiscoveryEvents.kind, kind),
          eq(communityDiscoveryEvents.targetId, targetId),
          eq(communityDiscoveryEvents.optIn, true),
        ),
      );
    return rows.length;
  } catch (err) {
    logger.warn("[communityInvestigation] countDiscoverersFor failed:", err);
    return 0;
  }
}
