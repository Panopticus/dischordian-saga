/* ═══════════════════════════════════════════════════════
   FACTION STANDING SERVICE

   Apply standing deltas to user_faction_standing rows. Side
   effects:

     - Cross-faction echo: +20 to Insurgency drains opposed
       factions by -10 (resolveCrossEffects).
     - Threshold-crossing flags: writes
       `faction:championed:<id>` at +75, `faction:enemied:<id>`
       at -75. The flag is sticky (kept across later regression
       so NPCs can say "you used to walk with us").
     - Per-cycle peak/trough tracking for achievements.

   Idempotent — applying the same delta twice in a row yields
   the same flag set. Each call returns a summary of the new
   bands and any flags written, suitable for logging.
   ═══════════════════════════════════════════════════════ */

import { and, eq, sql } from "drizzle-orm";

import { npcPublicFlags, userFactionStanding } from "../../db/schema";
import {
  FACTION_REGISTRY,
  bandFor,
  resolveCrossEffects,
  type FactionBand,
  type FactionId,
} from "../../shared/factions";
import { getDb } from "../db";
import { logger } from "../logger";

export interface FactionStandingSummary {
  factionId: FactionId;
  before: number;
  after: number;
  bandBefore: FactionBand;
  bandAfter: FactionBand;
  flagsSet: string[];
}

export async function applyFactionDelta(args: {
  userId: number;
  factionId: FactionId;
  delta: number;
  source?: string;
  /** When false, opposed factions don't receive the echo delta.
   *  Defaults to true. */
  applyEcho?: boolean;
}): Promise<FactionStandingSummary[]> {
  if (args.delta === 0) return [];
  const summaries: FactionStandingSummary[] = [];
  summaries.push(await applyOne(args.userId, args.factionId, args.delta, args.source));
  if (args.applyEcho !== false) {
    for (const echo of resolveCrossEffects(args.factionId, args.delta)) {
      summaries.push(await applyOne(args.userId, echo.factionId, echo.delta, args.source));
    }
  }
  return summaries;
}

async function applyOne(
  userId: number,
  factionId: FactionId,
  delta: number,
  source?: string,
): Promise<FactionStandingSummary> {
  const db = await getDb();
  const empty: FactionStandingSummary = {
    factionId,
    before: 0,
    after: 0,
    bandBefore: "neutral",
    bandAfter: "neutral",
    flagsSet: [],
  };
  if (!db) return empty;

  const def = FACTION_REGISTRY[factionId];

  // Read existing or seed a row
  const [existing] = await db
    .select()
    .from(userFactionStanding)
    .where(and(
      eq(userFactionStanding.userId, userId),
      eq(userFactionStanding.factionId, factionId),
    ))
    .limit(1);

  const before = existing?.standing ?? def.startingStanding;
  const after = Math.max(-100, Math.min(100, before + delta));
  const peak = Math.max(existing?.peakStanding ?? before, after);
  const trough = Math.min(existing?.troughStanding ?? before, after);

  if (existing) {
    await db
      .update(userFactionStanding)
      .set({ standing: after, peakStanding: peak, troughStanding: trough })
      .where(eq(userFactionStanding.id, existing.id));
  } else {
    await db.insert(userFactionStanding).values({
      userId,
      factionId,
      standing: after,
      peakStanding: peak,
      troughStanding: trough,
    });
  }

  const summary: FactionStandingSummary = {
    factionId,
    before,
    after,
    bandBefore: bandFor(before),
    bandAfter: bandFor(after),
    flagsSet: [],
  };

  // Threshold-crossing flags. We write on the upward-crossing of
  // +75 and the downward-crossing of -75. Idempotent on the
  // npc_public_flags unique index.
  if (after >= 75 && before < 75) {
    await writeFlag(userId, def.championedFlag, source);
    summary.flagsSet.push(def.championedFlag);
  }
  if (after <= -75 && before > -75) {
    await writeFlag(userId, def.enemiedFlag, source);
    summary.flagsSet.push(def.enemiedFlag);
  }

  return summary;
}

async function writeFlag(
  userId: number,
  flag: string,
  source: string | undefined,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.insert(npcPublicFlags).values({
      userId,
      flag,
      setBy: source ?? "faction",
    }).onDuplicateKeyUpdate({
      set: { flag: sql`${npcPublicFlags.flag}` },
    });
  } catch (err) {
    logger.error(`[FactionStanding] flag write failed for ${flag}:`, err);
  }
}

/** Read all standing rows for a player; missing rows default to
 *  the faction's startingStanding (almost always 0). */
export async function getFactionStandings(
  userId: number,
): Promise<Record<FactionId, number>> {
  const db = await getDb();
  const result: Record<FactionId, number> = {
    architect_remnants: FACTION_REGISTRY.architect_remnants.startingStanding,
    new_babylon: FACTION_REGISTRY.new_babylon.startingStanding,
    hierarchy: FACTION_REGISTRY.hierarchy.startingStanding,
    insurgency: FACTION_REGISTRY.insurgency.startingStanding,
    dreamers_children: FACTION_REGISTRY.dreamers_children.startingStanding,
  };
  if (!db) return result;
  const rows = await db
    .select({
      factionId: userFactionStanding.factionId,
      standing: userFactionStanding.standing,
    })
    .from(userFactionStanding)
    .where(eq(userFactionStanding.userId, userId));
  for (const row of rows) {
    if (row.factionId in result) {
      result[row.factionId as FactionId] = row.standing;
    }
  }
  return result;
}
