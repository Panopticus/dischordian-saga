/**
 * CIRCUIT SIDE QUEST SERVICE
 * ──────────────────────────────────────────────────
 * Tracks progress on Dead Man's Circuit cross-game side quests.
 * Hooked into the rippleEngine so quest progress advances naturally
 * as the player participates in other systems during a season.
 */
import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import { circuitSideQuestProgress, circuitSeasons } from "../../db/schema";
import {
  CIRCUIT_SIDE_QUESTS,
  getCircuitSideQuestsForTrigger,
  type CircuitQuestTriggerKind,
} from "../../shared/deadMansCircuit";
import { logger } from "../logger";

/** Look up the active season id, if any. */
async function getActiveSeasonId(): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;
  const [s] = await db.select({ id: circuitSeasons.id }).from(circuitSeasons)
    .where(eq(circuitSeasons.status, "active"))
    .limit(1);
  return s?.id ?? null;
}

/**
 * Advance any side quests whose trigger matches `trigger` for this user.
 * Called from rippleEngine handlers. Silent on failure (no DB / no season).
 */
export async function advanceCircuitSideQuests(
  userId: number,
  trigger: CircuitQuestTriggerKind,
  amount: number = 1,
): Promise<void> {
  try {
    const seasonId = await getActiveSeasonId();
    if (!seasonId) return; // No live season → quests don't track

    const db = await getDb();
    if (!db) return;

    const quests = getCircuitSideQuestsForTrigger(trigger);
    if (quests.length === 0) return;

    for (const q of quests) {
      // Upsert progress row for this user/season/quest
      const [existing] = await db.select().from(circuitSideQuestProgress)
        .where(and(
          eq(circuitSideQuestProgress.userId, userId),
          eq(circuitSideQuestProgress.seasonId, seasonId),
          eq(circuitSideQuestProgress.questKey, q.key),
        ))
        .limit(1);

      if (!existing) {
        const newProgress = Math.min(amount, q.target);
        const completed = newProgress >= q.target ? 1 : 0;
        await db.insert(circuitSideQuestProgress).values({
          userId,
          seasonId,
          questKey: q.key,
          progress: newProgress,
          target: q.target,
          completed,
          claimed: 0,
          cpAwarded: 0,
        });
        if (completed) logger.info(`[Circuit] Side quest ${q.key} completed for user ${userId}`);
        continue;
      }

      if (existing.completed) continue;

      const newProgress = Math.min(existing.progress + amount, q.target);
      const completed = newProgress >= q.target ? 1 : 0;
      await db.update(circuitSideQuestProgress)
        .set({ progress: newProgress, completed })
        .where(eq(circuitSideQuestProgress.id, existing.id));

      if (completed && !existing.completed) {
        logger.info(`[Circuit] Side quest ${q.key} completed for user ${userId}`);
      }
    }
  } catch (e) {
    logger.error("[Circuit] advanceCircuitSideQuests failed:", e);
  }
}

/**
 * Look up all side quest progress rows for a user in the active season,
 * filling in defaults for quests they haven't started yet.
 */
export async function getMyCircuitSideQuests(userId: number): Promise<{
  seasonId: number | null;
  quests: Array<{
    key: string;
    title: string;
    description: string;
    lore: string;
    target: number;
    progress: number;
    completed: boolean;
    claimed: boolean;
    cpReward: number;
    cosmeticReward?: string;
    titleReward?: string;
  }>;
}> {
  const seasonId = await getActiveSeasonId();
  if (!seasonId) return { seasonId: null, quests: [] };

  const db = await getDb();
  if (!db) return { seasonId, quests: [] };

  const rows = await db.select().from(circuitSideQuestProgress)
    .where(and(
      eq(circuitSideQuestProgress.userId, userId),
      eq(circuitSideQuestProgress.seasonId, seasonId),
    ));
  const byKey = new Map(rows.map(r => [r.questKey, r]));

  const quests = CIRCUIT_SIDE_QUESTS.map(q => {
    const r = byKey.get(q.key);
    return {
      key: q.key,
      title: q.title,
      description: q.description,
      lore: q.lore,
      target: q.target,
      progress: r?.progress ?? 0,
      completed: !!r?.completed,
      claimed: !!r?.claimed,
      cpReward: q.cpReward,
      cosmeticReward: q.cosmeticReward,
      titleReward: q.titleReward,
    };
  });

  return { seasonId, quests };
}
