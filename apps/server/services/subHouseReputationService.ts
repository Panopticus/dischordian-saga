/* ═══════════════════════════════════════════════════════
   SUB-HOUSE REPUTATION SERVICE — phase 2 of the items-matter
   / Game-of-Thrones arc.

   Reads + writes per-(user, sub-house) reputation, applying
   anti-correlated rivalry deltas automatically. Posts crossed-
   threshold events to the public-knowledge log so NPCs and
   the court widget pick them up.

   Storage model: per-user/per-house rows in
   trade_sub_house_reputation. We do NOT cache here (too many
   users); every call hits the DB or returns sensible defaults
   when DB is null. Hot reads are fine — the table has a
   composite index on (userId, houseKey).
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { tradeSubHouseReputation } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { logger } from "../logger";

import {
  SUB_HOUSE_REGISTRY,
  isKnownSubHouseKey,
  rivalryDeltas,
  type SubHouseKey,
} from "@shared/tradeEmpire/houses";
import { postPublicKnowledge } from "./publicKnowledgeService";
import { seasonClockService } from "./seasonClockService";

// --- Thresholds -----------------------------------------------------------

/**
 * Reputation thresholds at which the service auto-posts
 * public-knowledge events. Crossing one in either direction posts
 * once per crossing (we read peakReputation to detect the first
 * time a player reaches a positive threshold).
 */
const POSITIVE_THRESHOLDS = [25, 50, 75, 100] as const;
const NEGATIVE_THRESHOLDS = [-25, -50, -75, -100] as const;

// --- Types ----------------------------------------------------------------

export interface SubHouseRepRow {
  houseKey: SubHouseKey;
  reputation: number;
  peakReputation: number;
}

// --- Read paths -----------------------------------------------------------

/**
 * Read all sub-house reputations for a user. Houses with no row
 * yet return 0/0 so the caller never has to special-case missing
 * entries. Used by the court widget.
 */
export async function getAllSubHouseReputation(
  userId: number,
): Promise<ReadonlyArray<SubHouseRepRow>> {
  const db = await getDb();
  if (!db) {
    return Object.keys(SUB_HOUSE_REGISTRY).map(key => ({
      houseKey: key as SubHouseKey,
      reputation: 0,
      peakReputation: 0,
    }));
  }

  try {
    const rows = await db
      .select()
      .from(tradeSubHouseReputation)
      .where(eq(tradeSubHouseReputation.userId, userId));

    const byHouse = new Map<string, { reputation: number; peakReputation: number }>();
    for (const r of rows) {
      byHouse.set(r.houseKey, {
        reputation: r.reputation,
        peakReputation: r.peakReputation,
      });
    }

    return Object.keys(SUB_HOUSE_REGISTRY).map(key => {
      const found = byHouse.get(key);
      return {
        houseKey: key as SubHouseKey,
        reputation: found?.reputation ?? 0,
        peakReputation: found?.peakReputation ?? 0,
      };
    });
  } catch (err) {
    logger.error("[subHouseRep] getAll failed:", err);
    return [];
  }
}

/** Read a single house's reputation for a user. */
export async function getSubHouseReputation(
  userId: number,
  houseKey: SubHouseKey,
): Promise<SubHouseRepRow> {
  const db = await getDb();
  if (!db) {
    return { houseKey, reputation: 0, peakReputation: 0 };
  }
  try {
    const rows = await db
      .select()
      .from(tradeSubHouseReputation)
      .where(
        and(
          eq(tradeSubHouseReputation.userId, userId),
          eq(tradeSubHouseReputation.houseKey, houseKey),
        ),
      )
      .limit(1);
    if (rows.length === 0) {
      return { houseKey, reputation: 0, peakReputation: 0 };
    }
    const r = rows[0];
    return {
      houseKey,
      reputation: r.reputation,
      peakReputation: r.peakReputation,
    };
  } catch (err) {
    logger.error("[subHouseRep] get failed:", err);
    return { houseKey, reputation: 0, peakReputation: 0 };
  }
}

// --- Write paths ----------------------------------------------------------

/**
 * Apply a reputation delta to one sub-house. Automatically
 * anti-correlates against the rival via rivalryDeltas(). Posts a
 * threshold-crossing event to the public-knowledge log if the
 * change pushes the player across a meaningful boundary.
 *
 * @param userId
 * @param primaryHouseKey  The house the player primarily acted for/against.
 * @param primaryDelta     Positive or negative integer; rivalry math handles
 *                         the rival side automatically.
 * @param reason           Free-form description for the public-knowledge
 *                         summary if a threshold is crossed.
 */
export async function applySubHouseRepDelta(
  userId: number,
  primaryHouseKey: SubHouseKey,
  primaryDelta: number,
  reason: string,
): Promise<ReadonlyArray<SubHouseRepRow>> {
  if (!isKnownSubHouseKey(primaryHouseKey)) {
    logger.warn(`[subHouseRep] unknown house ${primaryHouseKey}`);
    return [];
  }
  if (primaryDelta === 0) return [];

  const deltas = rivalryDeltas(primaryHouseKey, primaryDelta);
  const db = await getDb();
  if (!db) return [];

  const updated: SubHouseRepRow[] = [];
  const seasonNumber = seasonClockService.getState().seasonNumber;

  for (const [houseKeyStr, delta] of Object.entries(deltas)) {
    if (delta === undefined || delta === 0) continue;
    const houseKey = houseKeyStr as SubHouseKey;
    try {
      const before = await getSubHouseReputation(userId, houseKey);
      const nextRep = before.reputation + delta;
      const nextPeak = Math.max(before.peakReputation, Math.abs(nextRep));

      // Upsert.
      await db
        .insert(tradeSubHouseReputation)
        .values({
          userId,
          houseKey,
          reputation: nextRep,
          peakReputation: nextPeak,
        })
        .onDuplicateKeyUpdate({
          set: {
            reputation: nextRep,
            peakReputation: nextPeak,
          },
        });

      updated.push({ houseKey, reputation: nextRep, peakReputation: nextPeak });

      // Post threshold-crossing event if applicable.
      const crossed = thresholdCrossed(before.reputation, nextRep);
      if (crossed !== null) {
        await postPublicKnowledge({
          userId,
          eventKind: "agenda_step", // Generic "rep moved" event kind.
          subjectHouseKey: houseKey,
          summary: thresholdSummary(houseKey, crossed, reason),
          payload: {
            houseKey,
            from: before.reputation,
            to: nextRep,
            threshold: crossed,
            reason,
          },
          seasonNumber,
        }).catch(err =>
          logger.warn("[subHouseRep] threshold post failed:", err),
        );
      }
    } catch (err) {
      logger.error("[subHouseRep] apply delta failed:", err);
    }
  }

  return updated;
}

/**
 * Detect whether the rep movement crossed a known threshold (in
 * either direction). Returns the crossed threshold or null.
 *
 * "Crossed" means: from < threshold && to >= threshold (positive)
 * or from > threshold && to <= threshold (negative). We test both
 * directions so a fall from +75 to +20 emits a "fell below 25" event.
 */
export function thresholdCrossed(from: number, to: number): number | null {
  if (from === to) return null;
  for (const t of POSITIVE_THRESHOLDS) {
    if (from < t && to >= t) return t;
    if (from >= t && to < t) return t;
  }
  for (const t of NEGATIVE_THRESHOLDS) {
    if (from > t && to <= t) return t;
    if (from <= t && to > t) return t;
  }
  return null;
}

function thresholdSummary(
  houseKey: SubHouseKey,
  threshold: number,
  reason: string,
): string {
  const def = SUB_HOUSE_REGISTRY[houseKey];
  if (threshold > 0) {
    return `${def.name} marks the player as a friend (rep ≥ ${threshold}). Source: ${reason}.`;
  }
  return `${def.name} marks the player as a problem (rep ≤ ${threshold}). Source: ${reason}.`;
}

// --- Faction rollup -------------------------------------------------------

/**
 * Top-level faction reputation = mean of its sub-houses' reps.
 * Computed on read; sub-house rows are the single source of truth.
 */
export async function getFactionReputationRollup(
  userId: number,
): Promise<Record<string, number>> {
  const all = await getAllSubHouseReputation(userId);
  const sums: Record<string, { sum: number; count: number }> = {};
  for (const row of all) {
    const def = SUB_HOUSE_REGISTRY[row.houseKey];
    if (!def) continue;
    const fid = def.factionId;
    if (!sums[fid]) sums[fid] = { sum: 0, count: 0 };
    sums[fid].sum += row.reputation;
    sums[fid].count += 1;
  }
  const out: Record<string, number> = {};
  for (const [fid, { sum, count }] of Object.entries(sums)) {
    out[fid] = count > 0 ? Math.round(sum / count) : 0;
  }
  return out;
}
