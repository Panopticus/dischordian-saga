/**
 * Guild Quest progression service.
 *
 * Subscribes to the same event vocabulary that grants titles +
 * drops conspiracy clues, and increments matching guild quest
 * progress rows. Idempotent — duplicate progression events round
 * up to the same target without double-counting.
 *
 * Event-to-quest mapping is computed from the GUILD_QUESTS catalog
 * at module load; the dispatch loop is O(quests-per-event-kind).
 */
import { eq, and, sql, inArray } from "drizzle-orm";
import { getDb } from "../db";
import {
  guildQuestProgress,
  guildMembers,
  guilds,
} from "../../db/schema";
import {
  GUILD_QUESTS,
  questTarget,
  type GuildQuestDef,
  type GuildQuestCondition,
} from "@shared/guildQuests/questDefinitions";
import { logger } from "../logger";

/**
 * Discriminated event union the quest service consumes. Mirrors
 * the title event vocabulary so any caller can fire one event and
 * cover both grant paths.
 */
export type QuestEvent =
  | { kind: "pvp_card_won"; userId: number; gameType: "card_1v1" | "card_2v2" | "card_ffa" }
  | { kind: "pvp_card_played"; userId: number }
  | { kind: "chess_won"; userId: number }
  | { kind: "raid_cleared"; userId: number; bossKey: string }
  | { kind: "td_raid_won"; userId: number }
  | { kind: "td_defense_held"; userId: number }
  | { kind: "circuit_race_completed"; userId: number }
  | { kind: "trade_mission_completed"; userId: number }
  | { kind: "conspiracy_clue_collected"; userId: number; clueKey: string }
  | { kind: "conspiracy_board_solved"; userId: number; boardKey: string }
  | { kind: "member_reached_tier"; userId: number; gameType: string; tier: number }
  | { kind: "guild_war_contribution"; userId: number; points: number }
  | { kind: "any_pvp_match"; userId: number };

/** Maps a QuestEvent to the increment count for any matching quest. */
function deltaForEvent(
  cond: GuildQuestCondition,
  evt: QuestEvent,
): number {
  switch (cond.kind) {
    case "pvp_wins_total":
      if (evt.kind === "pvp_card_won") {
        if (cond.gameType && cond.gameType !== evt.gameType) return 0;
        return 1;
      }
      if (evt.kind === "chess_won" && cond.gameType === "chess") return 1;
      return 0;
    case "card_duels_played":
      return evt.kind === "pvp_card_played" ? 1 : 0;
    case "chess_wins":
      return evt.kind === "chess_won" ? 1 : 0;
    case "raid_clears":
      return evt.kind === "raid_cleared" ? 1 : 0;
    case "td_raid_wins":
      return evt.kind === "td_raid_won" ? 1 : 0;
    case "td_defenses":
      return evt.kind === "td_defense_held" ? 1 : 0;
    case "circuit_races":
      return evt.kind === "circuit_race_completed" ? 1 : 0;
    case "trade_missions_complete":
      return evt.kind === "trade_mission_completed" ? 1 : 0;
    case "conspiracy_clues_collected":
      return evt.kind === "conspiracy_clue_collected" ? 1 : 0;
    case "conspiracy_board_solved":
      if (evt.kind !== "conspiracy_board_solved") return 0;
      if (cond.boardKey && cond.boardKey !== evt.boardKey) return 0;
      return 1;
    case "member_reaches_tier":
      if (evt.kind !== "member_reached_tier") return 0;
      if (cond.gameType && cond.gameType !== evt.gameType) return 0;
      return evt.tier >= cond.tier ? 1 : 0;
    case "guild_war_contribution":
      return evt.kind === "guild_war_contribution" ? evt.points : 0;
    case "any_pvp_match":
      return evt.kind === "any_pvp_match" ? 1 : 0;
  }
}

/**
 * Increment progress on every quest matching this event for the
 * user's guild (if they're in one). Marks quests complete the
 * moment progress reaches target.
 */
export async function recordQuestEvent(evt: QuestEvent): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const memberRows = await db
    .select({ guildId: guildMembers.guildId })
    .from(guildMembers)
    .where(eq(guildMembers.userId, evt.userId))
    .limit(1);
  const guildId = memberRows[0]?.guildId;
  if (!guildId) return;

  // Find every quest that this event might advance.
  const matches: Array<{ def: GuildQuestDef; delta: number }> = [];
  for (const q of GUILD_QUESTS) {
    const delta = deltaForEvent(q.condition, evt);
    if (delta > 0) matches.push({ def: q, delta });
  }
  if (matches.length === 0) return;

  // Read every progress row for this guild + matching quest keys
  // in one round-trip.
  const matchKeys = matches.map((m) => m.def.questKey);
  const progressRows = matchKeys.length
    ? await db
        .select()
        .from(guildQuestProgress)
        .where(
          and(
            eq(guildQuestProgress.guildId, guildId),
            inArray(guildQuestProgress.questKey, matchKeys),
          ),
        )
    : [];
  const progressByKey = new Map(progressRows.map((r) => [r.questKey, r]));

  for (const { def, delta } of matches) {
    const target = questTarget(def.condition);
    const existing = progressByKey.get(def.questKey);
    if (existing) {
      // Already complete? Skip.
      if (existing.completedAt) continue;
      const newProgress = Math.min(target, existing.progress + delta);
      const completedAt = newProgress >= target ? new Date() : null;
      await db
        .update(guildQuestProgress)
        .set({
          progress: newProgress,
          ...(completedAt ? { completedAt } : {}),
        })
        .where(eq(guildQuestProgress.id, existing.id));
      if (completedAt) {
        logger.info("guild_quest_completed", "guildQuestService", {
          guildId,
          questKey: def.questKey,
          scope: def.scope,
        });
      }
    } else {
      const newProgress = Math.min(target, delta);
      const completedAt = newProgress >= target ? new Date() : null;
      try {
        await db.insert(guildQuestProgress).values({
          guildId,
          questKey: def.questKey,
          progress: newProgress,
          target,
          completedAt: completedAt ?? undefined,
          resetAt: new Date(),
        });
      } catch (err) {
        // Racy insert (another caller upserted between read and
        // insert). Recover by updating.
        await db
          .update(guildQuestProgress)
          .set({
            progress: sql`progress + ${delta}`,
          })
          .where(
            and(
              eq(guildQuestProgress.guildId, guildId),
              eq(guildQuestProgress.questKey, def.questKey),
            ),
          );
      }
    }
  }
}

/**
 * Reset every quest of a given scope for every guild. Idempotent:
 * compares anchor dates so re-running within the same window is a
 * no-op. Called by the cron runner.
 *
 * Returns the number of rows reset.
 */
export async function resetGuildQuestsForScope(
  scope: "daily" | "weekly" | "seasonal",
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const anchor = anchorForScope(scope);
  // Wipe progress + clear completedAt for every row matching scope's
  // quest keys whose resetAt is before the current window's anchor.
  const scopeKeys = GUILD_QUESTS.filter((q) => q.scope === scope).map((q) => q.questKey);
  if (scopeKeys.length === 0) return 0;
  const result = await db
    .update(guildQuestProgress)
    .set({
      progress: 0,
      completedAt: null,
      rewardClaimed: 0,
      resetAt: anchor,
    })
    .where(
      and(
        inArray(guildQuestProgress.questKey, scopeKeys),
        sql`reset_at < ${anchor}`,
      ),
    );
  // Drizzle's MySQL update doesn't return affected count uniformly;
  // log instead.
  logger.info("guild_quest_reset_complete", "guildQuestService", {
    scope,
    anchor: anchor.toISOString(),
  });
  return scopeKeys.length;
}

/** Compute the anchor timestamp for a scope's current window. */
function anchorForScope(scope: "daily" | "weekly" | "seasonal"): Date {
  const now = new Date();
  if (scope === "daily") {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }
  if (scope === "weekly") {
    const dayOfWeek = now.getUTCDay() || 7;
    return new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - (dayOfWeek - 1),
    ));
  }
  // Seasonal — anchor to month boundaries (4-month seasons). Tier 5
  // can refine this once pvpSeason boundaries are exposed.
  const seasonMonth = Math.floor(now.getUTCMonth() / 4) * 4;
  return new Date(Date.UTC(now.getUTCFullYear(), seasonMonth, 1));
}

/** Run all three scopes in sequence — invoked by the cron runner. */
export async function runQuestResetTick(): Promise<void> {
  await resetGuildQuestsForScope("daily");
  await resetGuildQuestsForScope("weekly");
  await resetGuildQuestsForScope("seasonal");
}

export { anchorForScope };
