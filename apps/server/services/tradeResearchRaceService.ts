/* ═══════════════════════════════════════════════════════
   TRADE RESEARCH RACE SERVICE — Phase D.5

   When a player begins researching a tech that has a
   research-race configured, an NPC racer is rolled and
   the race ticks until one side completes. If the rival
   wins, the player still gets the tech but with a
   reduced bonus (per the schema doc-comment).

   Schema: apps/db/schema.ts:6993 (tradeResearchRaces,
   audit-allow: pending-feature Phase D.5).
   ═══════════════════════════════════════════════════════ */
import { and, eq, lte } from "drizzle-orm";
import { getDb } from "../db";
import { tradeResearchRaces, notifications } from "../../db/schema";
import { logger } from "../logger";

/**
 * Real-time race window. The deadline column on each row encodes
 * `startedAt + RESEARCH_RACE_WINDOW_MS` so the rival completes when
 * `Date.now() >= deadlineMs` and no player resolution arrived first.
 *
 * Per schema doc-comment: "Real-ms deadline by which one side completes."
 */
export const RESEARCH_RACE_WINDOW_MS = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Pool of canonical sub-house keys the NPC racer can be drawn from.
 * Phase D.5 keeps the roll small and bible-faithful — the same six
 * sub-houses the contracts/court systems already reference.
 */
const RIVAL_HOUSE_POOL: ReadonlyArray<string> = [
  "nb_authoritys_ledger",
  "hierarchy_severance",
  "antiquarian_casino",
  "antiquarian_shelfmates",
  "ind_freeports",
  "thaloria_quietwork",
];

function pickRivalHouse(seed: number): string {
  const idx = Math.abs(seed) % RIVAL_HOUSE_POOL.length;
  return RIVAL_HOUSE_POOL[idx]!;
}

/**
 * Begin a research race for `userId` on `techKey`. Inserts a row
 * with status="pending", deadlineMs = now + RESEARCH_RACE_WINDOW_MS.
 * No-op if a pending row for the same (userId, techKey) already
 * exists — research starts can safely retry.
 *
 * Game-mechanic: the rival-NPC roll described in the schema
 * doc-comment at apps/db/schema.ts:6993.
 */
export async function startResearchRace(
  userId: number,
  techKey: string,
  options?: { rivalHouseKey?: string; windowMs?: number },
): Promise<{ deadlineMs: number; rivalHouseKey: string } | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    // Don't double-insert pending rows for the same (user, tech).
    const [existing] = await db
      .select()
      .from(tradeResearchRaces)
      .where(
        and(
          eq(tradeResearchRaces.userId, userId),
          eq(tradeResearchRaces.techKey, techKey),
          eq(tradeResearchRaces.status, "pending"),
        ),
      )
      .limit(1);
    if (existing) {
      return {
        deadlineMs: Number(existing.deadlineMs),
        rivalHouseKey: existing.rivalHouseKey,
      };
    }

    const windowMs = options?.windowMs ?? RESEARCH_RACE_WINDOW_MS;
    const rivalHouseKey =
      options?.rivalHouseKey ?? pickRivalHouse(userId + techKey.length);
    const deadlineMs = Date.now() + windowMs;

    await db.insert(tradeResearchRaces).values({
      userId,
      techKey,
      rivalHouseKey,
      deadlineMs,
      status: "pending",
    });

    return { deadlineMs, rivalHouseKey };
  } catch (err) {
    logger.warn("research_race_start_failed", "tradeResearchRaceService", {
      userId,
      techKey,
      err: String(err),
    });
    return null;
  }
}

/**
 * Mark every pending race for `userId` on `techKey` as `player_won`
 * with `resolvedAt = now`. Called from the tech-completion path so
 * the player beating the rival closes the race.
 */
export async function markPlayerWon(
  userId: number,
  techKey: string,
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;
    await db
      .update(tradeResearchRaces)
      .set({ status: "player_won", resolvedAt: new Date() })
      .where(
        and(
          eq(tradeResearchRaces.userId, userId),
          eq(tradeResearchRaces.techKey, techKey),
          eq(tradeResearchRaces.status, "pending"),
        ),
      );
  } catch (err) {
    logger.warn("research_race_player_win_failed", "tradeResearchRaceService", {
      userId,
      techKey,
      err: String(err),
    });
  }
}

/**
 * Cron tick: every pending row whose deadlineMs has elapsed is
 * resolved as `rival_won`, with a `system` notification dropped to
 * the player so they see the outcome.
 *
 * Game-mechanic: the per-tick rival advancement described in the
 * schema doc-comment. The rival's progress is encoded as the
 * deadline timestamp; once real-time crosses it, the rival has
 * "completed" the tech.
 *
 * Cron entry-point: scheduled hourly from apps/server/_core/index.ts.
 */
export async function tickResearchRaces(): Promise<{ rivalWins: number }> {
  try {
    const db = await getDb();
    if (!db) return { rivalWins: 0 };

    const now = Date.now();
    const expired = await db
      .select()
      .from(tradeResearchRaces)
      .where(
        and(
          eq(tradeResearchRaces.status, "pending"),
          lte(tradeResearchRaces.deadlineMs, now),
        ),
      );

    if (expired.length === 0) return { rivalWins: 0 };

    let rivalWins = 0;
    for (const row of expired) {
      try {
        await db
          .update(tradeResearchRaces)
          .set({ status: "rival_won", resolvedAt: new Date() })
          .where(eq(tradeResearchRaces.id, row.id));

        // Player notification — uses the generic `system` enum value
        // so we don't need a schema bump for a Phase D.5 surface.
        await db
          .insert(notifications)
          .values({
            userId: row.userId,
            type: "system",
            title: "Research Race Lost",
            message:
              `The ${row.rivalHouseKey} beat you to "${row.techKey}". ` +
              "You'll still complete the tech, but with a reduced bonus.",
            metadata: {
              kind: "trade_research_race_rival_won",
              techKey: row.techKey,
              rivalHouseKey: row.rivalHouseKey,
            },
          })
          .catch((e) =>
            logger.warn(
              "research_race_notify_failed",
              "tradeResearchRaceService",
              { userId: row.userId, err: String(e) },
            ),
          );

        rivalWins++;
      } catch (err) {
        logger.warn(
          "research_race_resolve_failed",
          "tradeResearchRaceService",
          { id: row.id, err: String(err) },
        );
      }
    }
    return { rivalWins };
  } catch (err) {
    logger.warn("research_race_tick_failed", "tradeResearchRaceService", {
      err: String(err),
    });
    return { rivalWins: 0 };
  }
}
