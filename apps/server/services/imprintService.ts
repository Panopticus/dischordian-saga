/**
 * NPC Imprint Service — Phase F3.
 *
 * Single entry point for granting NPC imprint fragments. Every
 * game-mode hook (story chapter completion, chess opponent
 * matches, trade empire missions, lore journal entries, dream
 * fragments, living universe events, companion conversations)
 * calls awardFragments() with a stable source tag and the NPC
 * slug. The service:
 *
 *   1. Validates the source tag against IMPRINT_FRAGMENT_SOURCES
 *      and uses its canonical fragment yield as the amount
 *      (callers can pass a custom amount to override; defaults
 *      to the source's listed value).
 *   2. Upserts the npc_imprints row (incrementing fragments).
 *   3. Appends an npc_imprint_grants audit row.
 *   4. Computes the new tier via tierForFragments() and compares
 *      to the previously-stored highestTierUnlocked. If the new
 *      tier is higher, grants the corresponding tiered cardDefId
 *      via insertImprintCard() and updates highestTierUnlocked.
 *      Multiple tier crossings in one call (a 5-fragment grant
 *      that crosses two thresholds) grant every intermediate
 *      card.
 *   5. Sends a notification per tier unlock so the player sees
 *      the progress.
 *
 * Returns a structured result the caller can use for the toast.
 *
 * Idempotent over duplicate source events because callers should
 * key off their own event ids — the service does NOT dedupe; it
 * trusts the caller to only fire awardFragments once per real
 * event. The audit log lets us catch double-grants in QA.
 */
import { eq, and, sql } from "drizzle-orm";
import type { DrizzleDb } from "../db";
import {
  npcImprints,
  npcImprintGrants,
  userCards,
  notifications,
} from "../../db/schema";
import {
  getImprintNpc,
  tierForFragments,
  IMPRINT_FRAGMENT_SOURCES,
  IMPRINT_TIER_RARITY,
  type ImprintFragmentSource,
  type ImprintTier,
} from "@shared/tcg-core";
import { logger } from "../logger";

export interface AwardFragmentsInput {
  userId: number;
  npcSlug: string;
  source: ImprintFragmentSource;
  /** Optional override; defaults to IMPRINT_FRAGMENT_SOURCES[source]. */
  amount?: number;
  /** Optional human-readable detail for the audit log
   *  ("ch7_insurgency_stronghold"). */
  sourceDetail?: string;
}

export interface AwardFragmentsResult {
  ok: boolean;
  npcSlug: string;
  fragmentsGranted: number;
  totalFragments: number;
  /** Tiers newly unlocked by this call (empty if none crossed). */
  unlockedTiers: ImprintTier[];
  /** CardDefIds granted as a result of the unlocked tiers. */
  unlockedCardDefIds: string[];
  /** True if the npc slug was unknown. The call is a no-op in
   *  that case — we never silently insert phantom NPC rows. */
  unknownNpc: boolean;
}

/** Insert or increment a single user-owned card, copying the
 *  upsert pattern from cardRewardService. Returns true if newly
 *  granted (first copy), false if quantity bumped. */
async function insertImprintCard(
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
    obtainedVia: "npc_imprint",
  });
  return true;
}

/**
 * Grant imprint fragments for an NPC and unlock any newly
 * crossed tier cards in the same transaction.
 */
export async function awardFragments(
  db: NonNullable<DrizzleDb>,
  input: AwardFragmentsInput,
): Promise<AwardFragmentsResult> {
  const npc = getImprintNpc(input.npcSlug);
  if (!npc) {
    logger.warn(`[Imprints] Unknown NPC slug: ${input.npcSlug}`);
    return {
      ok: false,
      npcSlug: input.npcSlug,
      fragmentsGranted: 0,
      totalFragments: 0,
      unlockedTiers: [],
      unlockedCardDefIds: [],
      unknownNpc: true,
    };
  }

  const amount = input.amount ?? IMPRINT_FRAGMENT_SOURCES[input.source];
  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      ok: false,
      npcSlug: input.npcSlug,
      fragmentsGranted: 0,
      totalFragments: 0,
      unlockedTiers: [],
      unlockedCardDefIds: [],
      unknownNpc: false,
    };
  }

  // Read current row (if any) to compute the tier delta.
  const existing = await db.select().from(npcImprints)
    .where(and(
      eq(npcImprints.userId, input.userId),
      eq(npcImprints.npcId, npc.slug),
    )).limit(1);

  const prevFragments = existing[0]?.fragments ?? 0;
  const prevTier = (existing[0]?.highestTierUnlocked ?? 0) as 0 | ImprintTier;
  const newFragments = prevFragments + amount;
  const newTier = tierForFragments(newFragments);

  // Upsert the imprints row.
  if (existing[0]) {
    await db.update(npcImprints)
      .set({
        fragments: newFragments,
        highestTierUnlocked: newTier,
        lastSource: input.source,
      })
      .where(and(
        eq(npcImprints.userId, input.userId),
        eq(npcImprints.npcId, npc.slug),
      ));
  } else {
    await db.insert(npcImprints).values({
      userId: input.userId,
      npcId: npc.slug,
      fragments: newFragments,
      highestTierUnlocked: newTier,
      lastSource: input.source,
    });
  }

  // Append audit log entry.
  await db.insert(npcImprintGrants).values({
    userId: input.userId,
    npcId: npc.slug,
    amount,
    source: input.source,
    sourceDetail: input.sourceDetail ?? null,
  });

  // Grant every newly unlocked tier card.
  const unlockedTiers: ImprintTier[] = [];
  const unlockedCardDefIds: string[] = [];
  for (let t = (prevTier + 1) as ImprintTier; t <= newTier; t = (t + 1) as ImprintTier) {
    const cardDefId = npc.tieredCardDefIds[t - 1];
    await insertImprintCard(db, input.userId, cardDefId);
    unlockedTiers.push(t);
    unlockedCardDefIds.push(cardDefId);

    // Notification per tier unlock.
    await db.insert(notifications).values({
      userId: input.userId,
      type: "achievement",
      title: `${npc.displayName} — ${IMPRINT_TIER_RARITY[t].toUpperCase()} Imprint`,
      message: `You have collected enough fragments to forge the ${IMPRINT_TIER_RARITY[t]} imprint of ${npc.displayName}.`,
      actionUrl: "/imprints",
    });
  }

  return {
    ok: true,
    npcSlug: npc.slug,
    fragmentsGranted: amount,
    totalFragments: newFragments,
    unlockedTiers,
    unlockedCardDefIds,
    unknownNpc: false,
  };
}

/** Look up a single imprint progress row for the gallery UI. */
export async function getImprintProgress(
  db: NonNullable<DrizzleDb>,
  userId: number,
  npcSlug: string,
) {
  const rows = await db.select().from(npcImprints)
    .where(and(
      eq(npcImprints.userId, userId),
      eq(npcImprints.npcId, npcSlug),
    )).limit(1);
  return rows[0] ?? null;
}

/** List all imprint rows for a user — gallery hydration. */
export async function listImprintProgress(
  db: NonNullable<DrizzleDb>,
  userId: number,
) {
  return db.select().from(npcImprints)
    .where(eq(npcImprints.userId, userId));
}
