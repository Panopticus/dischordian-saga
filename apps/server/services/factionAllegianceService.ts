/**
 * Faction Allegiance Service — Phase D2.
 *
 * Single entry point for incrementing per-user, per-faction
 * played/won counters when a TCG match ends. Called from every
 * match-end code path that knows a player's chosen faction for
 * that match.
 *
 * Thresholds (per plan): crossing 10/25/50 matches played
 * unlocks tiers 1-3 (play-based); crossing 10/50/100 wins
 * unlocks tiers 4-6 (win-based). Tier 6 is the legendary faction
 * champion card. The service computes the new highest tier,
 * updates the row, and returns the new tiers that were crossed
 * so the caller can grant the corresponding allegiance card
 * via the existing grantCardReward path.
 *
 * Idempotency contract: callers are responsible for firing
 * incrementFactionStats once per real match completion; the
 * service trusts the caller.
 */
import { eq, and, sql } from "drizzle-orm";
import type { DrizzleDb } from "../db";
import { factionStats, userCards, notifications } from "../../db/schema";
import { logger } from "../logger";

/** Season-1 factions tracked by allegiance. Must match the
 *  mysqlEnum in schema.ts. */
export type AllegianceFaction =
  | "architect"
  | "insurgency"
  | "dreamer"
  | "new_babylon"
  | "antiquarian"
  | "thought_virus";

export type AllegianceTier = 1 | 2 | 3 | 4 | 5 | 6;

/** Thresholds matching the plan. Tiers 1-3 are play-based;
 *  tiers 4-6 are win-based. */
export const ALLEGIANCE_THRESHOLDS = {
  1: { kind: "played" as const, amount: 10 },
  2: { kind: "played" as const, amount: 25 },
  3: { kind: "played" as const, amount: 50 },
  4: { kind: "won" as const, amount: 10 },
  5: { kind: "won" as const, amount: 50 },
  6: { kind: "won" as const, amount: 100 },
} as const;

/** Compute the highest tier the player has earned given their
 *  current played + won counts. Returns 0 if none crossed. */
export function tierForAllegiance(
  played: number,
  won: number,
): 0 | AllegianceTier {
  // Check win-based tiers from highest to lowest.
  if (won >= ALLEGIANCE_THRESHOLDS[6].amount) return 6;
  if (won >= ALLEGIANCE_THRESHOLDS[5].amount) return 5;
  if (won >= ALLEGIANCE_THRESHOLDS[4].amount) return 4;
  // Then play-based tiers.
  if (played >= ALLEGIANCE_THRESHOLDS[3].amount) return 3;
  if (played >= ALLEGIANCE_THRESHOLDS[2].amount) return 2;
  if (played >= ALLEGIANCE_THRESHOLDS[1].amount) return 1;
  return 0;
}

export interface IncrementFactionStatsInput {
  userId: number;
  faction: AllegianceFaction;
  /** True if the player won the match. A loss still increments
   *  `played`. Draws should be passed with won=false. */
  won: boolean;
}

export interface IncrementFactionStatsResult {
  ok: boolean;
  faction: AllegianceFaction;
  played: number;
  won: number;
  /** Tiers newly crossed by this increment (may be empty). */
  unlockedTiers: AllegianceTier[];
}

/**
 * Upsert the factionStats row for the player + faction, bump
 * the counters, compute any newly-crossed tiers, and return
 * the result.
 */
export async function incrementFactionStats(
  db: NonNullable<DrizzleDb>,
  input: IncrementFactionStatsInput,
): Promise<IncrementFactionStatsResult> {
  const existing = await db.select().from(factionStats)
    .where(and(
      eq(factionStats.userId, input.userId),
      eq(factionStats.faction, input.faction),
    )).limit(1);

  const prevPlayed = existing[0]?.played ?? 0;
  const prevWon = existing[0]?.won ?? 0;
  const prevTier = (existing[0]?.highestTierUnlocked ?? 0) as 0 | AllegianceTier;

  const newPlayed = prevPlayed + 1;
  const newWon = prevWon + (input.won ? 1 : 0);
  const newTier = tierForAllegiance(newPlayed, newWon);

  if (existing[0]) {
    await db.update(factionStats)
      .set({
        played: newPlayed,
        won: newWon,
        highestTierUnlocked: newTier,
      })
      .where(and(
        eq(factionStats.userId, input.userId),
        eq(factionStats.faction, input.faction),
      ));
  } else {
    await db.insert(factionStats).values({
      userId: input.userId,
      faction: input.faction,
      played: newPlayed,
      won: newWon,
      highestTierUnlocked: newTier,
    });
  }

  // Collect newly-crossed tiers. A single increment typically
  // crosses at most one tier, but grant-multiple is correct if
  // a retroactive backfill is ever done.
  const unlockedTiers: AllegianceTier[] = [];
  for (let t = prevTier + 1; t <= newTier; t++) {
    unlockedTiers.push(t as AllegianceTier);
  }

  if (unlockedTiers.length > 0) {
    logger.info(
      `[FactionAllegiance] user ${input.userId} ${input.faction}: tiers unlocked: ${unlockedTiers.join(",")} (played=${newPlayed}, won=${newWon})`,
    );
  }

  return {
    ok: true,
    faction: input.faction,
    played: newPlayed,
    won: newWon,
    unlockedTiers,
  };
}

/** Read-only helper — return the current faction stats row for
 *  a given user + faction, or null if none exists yet. */
export async function getFactionStats(
  db: NonNullable<DrizzleDb>,
  userId: number,
  faction: AllegianceFaction,
) {
  const rows = await db.select().from(factionStats)
    .where(and(
      eq(factionStats.userId, userId),
      eq(factionStats.faction, faction),
    )).limit(1);
  return rows[0] ?? null;
}

/** List all faction stats rows for a user — for the "Allegiance
 *  Progress" UI that shows all six factions in one grid. */
export async function listFactionStats(
  db: NonNullable<DrizzleDb>,
  userId: number,
) {
  return db.select().from(factionStats)
    .where(eq(factionStats.userId, userId));
}

/** CardDefId convention for allegiance cards. Matches the content
 *  files in cards/definitions/allegiance/<faction>.ts:
 *    s1_alleg_<faction>_t<tier>
 */
function allegianceCardDefId(
  faction: AllegianceFaction,
  tier: AllegianceTier,
): string {
  return `s1_alleg_${faction}_t${tier}`;
}

/** Display name used in the unlock notification. */
const FACTION_DISPLAY_NAME: Record<AllegianceFaction, string> = {
  architect: "Architect",
  insurgency: "Insurgency",
  dreamer: "Dreamer",
  new_babylon: "New Babylon",
  antiquarian: "Antiquarian",
  thought_virus: "Thought Virus",
};

/** Insert or increment a single allegiance card into userCards.
 *  Mirrors the imprint service's insert pattern. Returns true iff
 *  the card was newly granted (first copy). */
async function insertAllegianceCard(
  db: NonNullable<DrizzleDb>,
  userId: number,
  cardDefId: string,
): Promise<boolean> {
  const existing = await db.select().from(userCards)
    .where(and(
      eq(userCards.userId, userId),
      eq(userCards.cardId, cardDefId),
    )).limit(1);
  if (existing[0]) {
    await db.update(userCards)
      .set({ quantity: sql`${userCards.quantity} + 1` })
      .where(and(
        eq(userCards.userId, userId),
        eq(userCards.cardId, cardDefId),
      ));
    return false;
  }
  await db.insert(userCards).values({
    userId,
    cardId: cardDefId,
    quantity: 1,
    obtainedVia: "faction_allegiance",
  });
  return true;
}

/** Compute the +power/+health bonus for a player's allegiance
 *  cards based on their faction win count. Per the plan: every
 *  10 wins adds +1/+1, capped at +5/+5. Returns 0 for players
 *  with no row yet or fewer than 10 wins. */
export function computeAllegianceBonus(won: number): number {
  if (!Number.isFinite(won) || won <= 0) return 0;
  return Math.min(5, Math.floor(won / 10));
}

/** Build the cardStatOverrides map for createMatchState given
 *  a player's faction stats. Every allegiance card for that
 *  faction (s1_alleg_<faction>_t1..t6) receives the same +N/+N
 *  bonus where N = computeAllegianceBonus(won). The match init
 *  applies the override only to allegiance cards actually in
 *  the player's deck. */
export async function resolveAllegianceCardOverrides(
  db: NonNullable<DrizzleDb>,
  userId: number,
  faction: AllegianceFaction,
): Promise<Record<string, { power: number; health: number }>> {
  const stats = await getFactionStats(db, userId, faction);
  const bonus = computeAllegianceBonus(stats?.won ?? 0);
  if (bonus === 0) return {};
  const overrides: Record<string, { power: number; health: number }> = {};
  for (let tier = 1; tier <= 6; tier++) {
    const cardDefId = `s1_alleg_${faction}_t${tier}`;
    overrides[cardDefId] = { power: bonus, health: bonus };
  }
  return overrides;
}

/** End-to-end pipeline: increment factionStats, then for every
 *  newly-crossed tier grant the corresponding allegiance card and
 *  fire an achievement notification. Returns the same shape as
 *  incrementFactionStats plus the list of granted cardDefIds. */
export async function processFactionMatchEnd(
  db: NonNullable<DrizzleDb>,
  input: IncrementFactionStatsInput,
): Promise<IncrementFactionStatsResult & { unlockedCardDefIds: string[] }> {
  const result = await incrementFactionStats(db, input);
  const unlockedCardDefIds: string[] = [];
  for (const tier of result.unlockedTiers) {
    const cardDefId = allegianceCardDefId(input.faction, tier);
    try {
      await insertAllegianceCard(db, input.userId, cardDefId);
      unlockedCardDefIds.push(cardDefId);
      await db.insert(notifications).values({
        userId: input.userId,
        type: "achievement",
        title: `${FACTION_DISPLAY_NAME[input.faction]} Allegiance — Tier ${tier}`,
        message: `You unlocked the tier ${tier} ${FACTION_DISPLAY_NAME[input.faction]} allegiance card.`,
        actionUrl: "/collection",
      });
    } catch (e) {
      logger.warn(
        `[FactionAllegiance] grant failed for ${cardDefId}`,
        e,
      );
    }
  }
  return { ...result, unlockedCardDefIds };
}
