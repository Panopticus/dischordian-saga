/* ═══════════════════════════════════════════════════════
   EQUIPPED SUIT LOADER — phase 9 of the items-matter / GoT
   arc. Builds an AggregatedBonus[] synthesised from the
   user's primary citizen's `gear` JSON so that suit
   adapters (courtEntryReaction, toDiplomacyModifiers, etc.)
   can run server-side without the client-side
   passiveBonusAggregator.

   The JSON shape (per crafting.ts:attemptSuitCraft) is:
     gear[slot] = { id, setId, rarity, slot, source }

   For each set with N pieces equipped, we emit one synthetic
   AggregatedBonus per crossed tier (2/4/7/10), mirroring the
   shape passiveBonusAggregator emits client-side. Adapters
   already consume this shape via piecesEquippedForSet().
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { citizenCharacters } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import type { AggregatedBonus } from "@/game/passiveBonusAggregator";

const TIER_THRESHOLDS = [2, 4, 7, 10] as const;

interface GearEntry {
  id?: string;
  setId?: string;
  rarity?: string;
  slot?: string;
  source?: string;
}

/**
 * Load the user's equipped suit pieces and convert them into the
 * AggregatedBonus shape consumed by suit adapters. Returns an empty
 * array on missing DB / no citizen / no gear.
 */
export async function loadEquippedSuitBonuses(
  userId: number,
): Promise<ReadonlyArray<AggregatedBonus>> {
  const db = await getDb();
  if (!db) return [];
  try {
    const [citizen] = await db
      .select({ gear: citizenCharacters.gear })
      .from(citizenCharacters)
      .where(
        and(
          eq(citizenCharacters.userId, userId),
          eq(citizenCharacters.isPrimary, 1),
        ),
      )
      .limit(1);
    if (!citizen?.gear) return [];

    return synthesiseBonuses(citizen.gear as Record<string, unknown>);
  } catch {
    return [];
  }
}

/** Pure helper, exported so the integration test can exercise it. */
export function synthesiseBonuses(
  gear: Record<string, unknown>,
): ReadonlyArray<AggregatedBonus> {
  const setCounts = new Map<string, number>();
  for (const value of Object.values(gear)) {
    if (!value || typeof value !== "object") continue;
    const entry = value as GearEntry;
    if (!entry.setId) continue;
    setCounts.set(entry.setId, (setCounts.get(entry.setId) ?? 0) + 1);
  }

  const out: AggregatedBonus[] = [];
  for (const [setId, count] of setCounts.entries()) {
    for (const tier of TIER_THRESHOLDS) {
      if (count >= tier) {
        out.push({
          source: `suit-set:${setId}`,
          sourceCategory: "suit_set",
          system: "all",
          type: "passive",
          target: "cutscene_silhouette",
          value: 1,
          label: `${setId} (${tier}pc): synthesised by equippedSuitLoader`,
        });
      }
    }
  }
  return out;
}
