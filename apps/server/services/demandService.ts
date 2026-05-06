/* ═══════════════════════════════════════════════════════
   FACTION DEMAND SERVICE — phase 7 of the items-matter /
   Game-of-Thrones arc. Surfaces and resolves the
   "aggressive item sink" the design plan called for.

   Generation:
     During the season-tick `running` phase, the driver
     calls maybeGenerateDemandForUser(userId) for each
     active user. Probability of a demand firing per tick
     is controlled by GENERATION_PROBABILITY; only
     sub-houses where the player has ≥ 25 rep are eligible
     to make a demand (you can't be shaken down by a house
     that doesn't know you).

   Resolution:
     payDemand: consume one matching card; +rep with
     demanding house, -rep with rival. Posts a demand_paid
     public-knowledge event.
     refuseDemand: -rep with demanding house, +rep with
     rival, posts a demand_refused event with public flag.
     Expired demands count as refusals (handled by a sweep
     in the season tick).
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { cards, tradeDemands, userCards } from "../../db/schema";
import { and, desc, eq, lte } from "drizzle-orm";
import { logger } from "../logger";

import {
  SUB_HOUSE_REGISTRY,
  isKnownSubHouseKey,
  type SubHouseKey,
} from "@shared/tradeEmpire/houses";

import { applySubHouseRepDelta, getAllSubHouseReputation } from "./subHouseReputationService";
import { postPublicKnowledge } from "./publicKnowledgeService";
import { seasonClockService } from "./seasonClockService";

// --- Tunables -------------------------------------------------------------

/** Per-tick probability of a demand firing for an active user. */
const GENERATION_PROBABILITY = 0.15;
/** Minimum rep with a sub-house before it can demand. */
const MIN_REP_TO_DEMAND = 25;
/** How long a demand stays pending before counting as a refusal. */
const DEMAND_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 1 week

/** Rarity tier ladder; demands rise with rep. */
const RARITY_LADDER = ["common", "uncommon", "rare", "epic", "legendary"] as const;

function rarityForRep(rep: number): string {
  if (rep >= 90) return "legendary";
  if (rep >= 70) return "epic";
  if (rep >= 50) return "rare";
  if (rep >= 35) return "uncommon";
  return "common";
}

// --- Generation ----------------------------------------------------------

/**
 * Maybe generate a single demand for the given user. Picks a random
 * eligible sub-house (rep ≥ 25, not unalignable, no pending demand
 * from that house already). Idempotent in the sense that if no
 * eligible house is found, this is a no-op.
 *
 * Called once per agenda tick from seasonTickService.
 */
export async function maybeGenerateDemandForUser(
  userId: number,
  rng: () => number = Math.random,
): Promise<{ generated: boolean; demandId?: number }> {
  if (rng() >= GENERATION_PROBABILITY) return { generated: false };

  const db = await getDb();
  if (!db) return { generated: false };

  // Houses where the player has ≥ MIN_REP_TO_DEMAND.
  const reps = await getAllSubHouseReputation(userId);
  const eligibleHouses = reps.filter(r => {
    const def = SUB_HOUSE_REGISTRY[r.houseKey];
    return def && !def.unalignable && r.reputation >= MIN_REP_TO_DEMAND;
  });
  if (eligibleHouses.length === 0) return { generated: false };

  // Skip houses with a still-pending demand against this user.
  const pending = await db
    .select({ houseKey: tradeDemands.demandingHouseKey })
    .from(tradeDemands)
    .where(and(eq(tradeDemands.userId, userId), eq(tradeDemands.status, "pending")));
  const pendingSet = new Set(pending.map(r => r.houseKey));
  const open = eligibleHouses.filter(r => !pendingSet.has(r.houseKey));
  if (open.length === 0) return { generated: false };

  const pick = open[Math.floor(rng() * open.length)];
  const demandingHouse = pick.houseKey;
  const rarity = rarityForRep(pick.reputation);
  const seasonNumber = seasonClockService.getState().seasonNumber;
  const expiresAt = new Date(Date.now() + DEMAND_TTL_MS);

  try {
    const [insert] = await db.insert(tradeDemands).values({
      userId,
      demandingHouseKey: demandingHouse,
      demandedRarity: rarity,
      demandedFaction: null,
      expiresAt,
      status: "pending",
      seasonNumber,
    }).$returningId();

    await postPublicKnowledge({
      userId,
      eventKind: "agenda_step", // Reuse — surfaces in news feed.
      subjectHouseKey: demandingHouse,
      summary: `${SUB_HOUSE_REGISTRY[demandingHouse].name} demands a ${rarity} card from the player.`,
      payload: {
        kind: "demand_issued",
        demandId: insert?.id,
        demandedRarity: rarity,
      },
      seasonNumber,
    }).catch(err => logger.warn("[demands] gen public knowledge failed:", err));

    return { generated: true, demandId: insert?.id };
  } catch (err) {
    logger.error("[demands] generation failed:", err);
    return { generated: false };
  }
}

// --- Resolution paths -----------------------------------------------------

export interface PayDemandArgs {
  userId: number;
  demandId: number;
  cardId: string;
  isFoil?: boolean;
}

/**
 * Pay a demand by consuming one matching card. Validates the card
 * meets the rarity floor (and the optional faction filter), removes
 * one copy, applies sub-house rep delta (+12 to demanding house with
 * rivalry anti-correlation), marks the demand paid, posts demand_paid.
 */
export async function payDemand(
  args: PayDemandArgs,
): Promise<{ ok: true; demandId: number } | { ok: false; error: string }> {
  const db = await getDb();
  if (!db) return { ok: false, error: "no db" };

  const [demand] = await db
    .select()
    .from(tradeDemands)
    .where(
      and(
        eq(tradeDemands.id, args.demandId),
        eq(tradeDemands.userId, args.userId),
        eq(tradeDemands.status, "pending"),
      ),
    )
    .limit(1);
  if (!demand) return { ok: false, error: "demand not found or already resolved" };

  const [cardDef] = await db
    .select()
    .from(cards)
    .where(eq(cards.cardId, args.cardId))
    .limit(1);
  if (!cardDef) return { ok: false, error: "card not found" };

  // Rarity floor check.
  const cardRarityIdx = RARITY_LADDER.indexOf(cardDef.rarity as typeof RARITY_LADDER[number]);
  const demandRarityIdx = RARITY_LADDER.indexOf(
    demand.demandedRarity as typeof RARITY_LADDER[number],
  );
  if (cardRarityIdx < 0 || demandRarityIdx < 0 || cardRarityIdx < demandRarityIdx) {
    return { ok: false, error: `card rarity ${cardDef.rarity} does not meet demand ${demand.demandedRarity}` };
  }

  // Faction filter (if any).
  if (demand.demandedFaction && cardDef.faction !== demand.demandedFaction) {
    return { ok: false, error: `card faction ${cardDef.faction ?? "neutral"} does not match demand` };
  }

  const isFoilInt: 0 | 1 = args.isFoil ? 1 : 0;
  const [owned] = await db
    .select()
    .from(userCards)
    .where(
      and(
        eq(userCards.userId, args.userId),
        eq(userCards.cardId, args.cardId),
        eq(userCards.isFoil, isFoilInt),
      ),
    )
    .limit(1);
  if (!owned || owned.quantity < 1) {
    return { ok: false, error: "you do not own this card" };
  }

  // Consume the card.
  if (owned.quantity > 1) {
    await db
      .update(userCards)
      .set({ quantity: owned.quantity - 1 })
      .where(
        and(
          eq(userCards.userId, args.userId),
          eq(userCards.cardId, args.cardId),
          eq(userCards.isFoil, isFoilInt),
        ),
      );
  } else {
    await db
      .delete(userCards)
      .where(
        and(
          eq(userCards.userId, args.userId),
          eq(userCards.cardId, args.cardId),
          eq(userCards.isFoil, isFoilInt),
        ),
      );
  }

  // Mark demand paid.
  await db
    .update(tradeDemands)
    .set({
      status: "paid",
      resolvedAt: new Date(),
      resolution: `paid with ${args.cardId}${args.isFoil ? " (foil)" : ""}`,
    })
    .where(eq(tradeDemands.id, args.demandId));

  // Sub-house rep: positive to demanding house, anti-correlated to rival.
  const houseKey = demand.demandingHouseKey as SubHouseKey;
  if (isKnownSubHouseKey(houseKey)) {
    await applySubHouseRepDelta(args.userId, houseKey, 12, `paid demand #${args.demandId}`).catch(
      err => logger.warn("[demands] pay rep delta failed:", err),
    );
  }

  await postPublicKnowledge({
    userId: args.userId,
    eventKind: "demand_paid",
    subjectHouseKey: houseKey,
    summary: `${SUB_HOUSE_REGISTRY[houseKey]?.name ?? houseKey} accepted payment for a demand.`,
    payload: {
      demandId: args.demandId,
      cardId: args.cardId,
      rarity: cardDef.rarity,
    },
    seasonNumber: seasonClockService.getState().seasonNumber,
  }).catch(err => logger.warn("[demands] pay public knowledge failed:", err));

  return { ok: true, demandId: args.demandId };
}

/**
 * Refuse a demand. Costs sub-house rep with the demanding house and
 * grants a small windfall to its rival. Posts demand_refused with a
 * public flag for downstream NPC reactions.
 */
export async function refuseDemand(
  userId: number,
  demandId: number,
): Promise<{ ok: true; demandId: number } | { ok: false; error: string }> {
  const db = await getDb();
  if (!db) return { ok: false, error: "no db" };

  const [demand] = await db
    .select()
    .from(tradeDemands)
    .where(
      and(
        eq(tradeDemands.id, demandId),
        eq(tradeDemands.userId, userId),
        eq(tradeDemands.status, "pending"),
      ),
    )
    .limit(1);
  if (!demand) return { ok: false, error: "demand not found or already resolved" };

  await db
    .update(tradeDemands)
    .set({
      status: "refused",
      resolvedAt: new Date(),
      resolution: "refused",
    })
    .where(eq(tradeDemands.id, demandId));

  const houseKey = demand.demandingHouseKey as SubHouseKey;
  if (isKnownSubHouseKey(houseKey)) {
    await applySubHouseRepDelta(userId, houseKey, -18, `refused demand #${demandId}`).catch(
      err => logger.warn("[demands] refuse rep delta failed:", err),
    );
  }

  await postPublicKnowledge({
    userId,
    eventKind: "demand_refused",
    subjectHouseKey: houseKey,
    summary: `${SUB_HOUSE_REGISTRY[houseKey]?.name ?? houseKey} records a refused demand.`,
    payload: { demandId },
    seasonNumber: seasonClockService.getState().seasonNumber,
  }).catch(err => logger.warn("[demands] refuse public knowledge failed:", err));

  return { ok: true, demandId };
}

// --- Forge a substitute --------------------------------------------------

/**
 * Phase 9 — the third demand resolution path. Consume materials
 * from the caller's citizen pouch to forge a fake substitute. The
 * receiver rolls a detection check; success counts as a normal
 * payment, failure counts WORSE than a refusal (per the design
 * plan: "getting caught is worse than refusing").
 *
 * Detection probability scales with the receiving sub-house's
 * engagement style — bibliographic houses (Antiquarian) detect
 * more reliably than barter houses (Free Ports).
 */
export interface ForgeSubstituteArgs {
  userId: number;
  demandId: number;
  /** Cost in suit-materials pouch units (any combination). */
  materialsToConsume: ReadonlyArray<{ materialId: string; count: number }>;
}

const DETECTION_PROBABILITY_BY_HOUSE: Readonly<Record<string, number>> = {
  // Bibliographic / institutional houses see through forgeries fast.
  antiquarian_shelfmates: 0.85,
  nb_authoritys_ledger: 0.75,
  hierarchy_severance: 0.7,
  thaloria_council: 0.65,
  // Aleatory / barter houses care less about provenance.
  antiquarian_casino: 0.4,
  ind_freeports: 0.3,
  ind_unaligned: 0.35,
  // Combat-focused houses don't audit; they intimidate.
  hierarchy_acquisitions: 0.5,
  thaloria_quietwork: 0.55,
  insurgency_zero_doctrine: 0.6,
  insurgency_old_network: 0.45,
  ae_architects_court: 0.7,
  ae_substrate_rebels: 0.5,
  nb_civic_engineers: 0.6,
  potentials_restorationists: 0.5,
  potentials_reformers: 0.5,
};

export async function forgeDemandSubstitute(
  args: ForgeSubstituteArgs,
  rng: () => number = Math.random,
): Promise<
  | { ok: true; outcome: "passed" | "detected"; demandId: number }
  | { ok: false; error: string }
> {
  const db = await getDb();
  if (!db) return { ok: false, error: "no db" };

  const { citizenCharacters } = await import("../../db/schema");

  const [demand] = await db
    .select()
    .from(tradeDemands)
    .where(
      and(
        eq(tradeDemands.id, args.demandId),
        eq(tradeDemands.userId, args.userId),
        eq(tradeDemands.status, "pending"),
      ),
    )
    .limit(1);
  if (!demand) return { ok: false, error: "demand not found or already resolved" };

  // Check & deduct materials from the citizen pouch.
  const [citizen] = await db
    .select()
    .from(citizenCharacters)
    .where(
      and(
        eq(citizenCharacters.userId, args.userId),
        eq(citizenCharacters.isPrimary, 1),
      ),
    )
    .limit(1);
  if (!citizen) return { ok: false, error: "no citizen on file" };

  const pouch = (citizen.suitMaterials ?? {}) as Record<string, number>;
  for (const req of args.materialsToConsume) {
    if ((pouch[req.materialId] ?? 0) < req.count) {
      return { ok: false, error: `insufficient ${req.materialId}` };
    }
  }
  const nextPouch: Record<string, number> = { ...pouch };
  for (const req of args.materialsToConsume) {
    nextPouch[req.materialId] = (nextPouch[req.materialId] ?? 0) - req.count;
  }
  await db
    .update(citizenCharacters)
    .set({ suitMaterials: nextPouch })
    .where(eq(citizenCharacters.userId, args.userId));

  const houseKey = demand.demandingHouseKey as SubHouseKey;
  const detectProb = DETECTION_PROBABILITY_BY_HOUSE[houseKey] ?? 0.6;
  const detected = rng() < detectProb;

  const seasonNumber = seasonClockService.getState().seasonNumber;

  if (detected) {
    // Worse than refusal: -28 rep, public_flag posted, demand goes to refused.
    await db
      .update(tradeDemands)
      .set({
        status: "refused",
        resolvedAt: new Date(),
        resolution: "forgery detected",
      })
      .where(eq(tradeDemands.id, args.demandId));

    if (isKnownSubHouseKey(houseKey)) {
      await applySubHouseRepDelta(args.userId, houseKey, -28, `forgery detected #${args.demandId}`).catch(
        err => logger.warn("[demands] forgery rep delta failed:", err),
      );
    }

    await postPublicKnowledge({
      userId: args.userId,
      eventKind: "demand_refused",
      subjectHouseKey: houseKey,
      summary: `${SUB_HOUSE_REGISTRY[houseKey]?.name ?? houseKey} caught the player in a forged tribute.`,
      payload: { demandId: args.demandId, forgeryDetected: true },
      seasonNumber,
    }).catch(err => logger.warn("[demands] forgery public knowledge failed:", err));

    return { ok: true, outcome: "detected", demandId: args.demandId };
  }

  // Forgery passed: identical to a small payment.
  await db
    .update(tradeDemands)
    .set({
      status: "paid",
      resolvedAt: new Date(),
      resolution: "forgery passed",
    })
    .where(eq(tradeDemands.id, args.demandId));

  if (isKnownSubHouseKey(houseKey)) {
    await applySubHouseRepDelta(args.userId, houseKey, 6, `forgery passed #${args.demandId}`).catch(
      err => logger.warn("[demands] forgery pass rep delta failed:", err),
    );
  }

  await postPublicKnowledge({
    userId: args.userId,
    eventKind: "demand_paid",
    subjectHouseKey: houseKey,
    summary: `${SUB_HOUSE_REGISTRY[houseKey]?.name ?? houseKey} accepted what looked like payment.`,
    payload: { demandId: args.demandId, forgeryPassed: true },
    seasonNumber,
  }).catch(err => logger.warn("[demands] forgery pass public knowledge failed:", err));

  return { ok: true, outcome: "passed", demandId: args.demandId };
}

// --- Sweep ---------------------------------------------------------------

/**
 * Mark all expired pending demands as `expired` and post a refusal-
 * style public-knowledge event. Called from the season tick driver.
 */
export async function sweepExpiredDemands(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const now = new Date();
  try {
    const expired = await db
      .select()
      .from(tradeDemands)
      .where(
        and(eq(tradeDemands.status, "pending"), lte(tradeDemands.expiresAt, now)),
      );
    if (expired.length === 0) return 0;

    for (const demand of expired) {
      await db
        .update(tradeDemands)
        .set({
          status: "expired",
          resolvedAt: now,
          resolution: "expired",
        })
        .where(eq(tradeDemands.id, demand.id));

      const houseKey = demand.demandingHouseKey as SubHouseKey;
      if (isKnownSubHouseKey(houseKey)) {
        await applySubHouseRepDelta(
          demand.userId,
          houseKey,
          -12,
          `demand #${demand.id} expired`,
        ).catch(err =>
          logger.warn("[demands] sweep rep delta failed:", err),
        );
      }

      await postPublicKnowledge({
        userId: demand.userId,
        eventKind: "demand_refused",
        subjectHouseKey: houseKey,
        summary: `${SUB_HOUSE_REGISTRY[houseKey]?.name ?? houseKey} marks the player as ignoring its demands.`,
        payload: { demandId: demand.id, expired: true },
        seasonNumber: demand.seasonNumber,
      }).catch(err =>
        logger.warn("[demands] sweep public knowledge failed:", err),
      );
    }
    return expired.length;
  } catch (err) {
    logger.error("[demands] sweep failed:", err);
    return 0;
  }
}

// --- Read paths ----------------------------------------------------------

export async function listMyDemands(userId: number): Promise<ReadonlyArray<{
  id: number;
  demandingHouseKey: string;
  demandingHouseName: string;
  demandedRarity: string;
  demandedFaction: string | null;
  status: string;
  expiresAt: number;
  createdAt: number;
  resolvedAt: number | null;
}>> {
  const db = await getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select()
      .from(tradeDemands)
      .where(eq(tradeDemands.userId, userId))
      .orderBy(desc(tradeDemands.createdAt));
    return rows.map(r => ({
      id: r.id,
      demandingHouseKey: r.demandingHouseKey,
      demandingHouseName: SUB_HOUSE_REGISTRY[r.demandingHouseKey as SubHouseKey]?.name ?? r.demandingHouseKey,
      demandedRarity: r.demandedRarity,
      demandedFaction: r.demandedFaction,
      status: r.status,
      expiresAt: r.expiresAt.getTime(),
      createdAt: r.createdAt.getTime(),
      resolvedAt: r.resolvedAt ? r.resolvedAt.getTime() : null,
    }));
  } catch (err) {
    logger.error("[demands] list failed:", err);
    return [];
  }
}

// --- Helpers (exported for tests) ----------------------------------------

export const _internals = {
  rarityForRep,
  RARITY_LADDER,
  DEMAND_TTL_MS,
};
