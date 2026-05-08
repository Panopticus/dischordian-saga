/* ═══════════════════════════════════════════════════════
   SOUL STONES — pure logic module
   See docs/design/SOUL_STONES_SYSTEM.md §1.1-1.3.

   Stones are collected as VIOLET (neutral). Each violet stone
   may then be CORRUPTED → red (counts toward Demon-Pet
   summoning) or PURIFIED → gold (counts toward Divine-Light
   investments). The choice is permanent per stone.

   Functions here are pure: they take the current count state
   and return the next state, or `null` when the operation
   is not permitted (insufficient stones, etc). The server
   router writes the result back to the `soulStones` row.
   ═══════════════════════════════════════════════════════ */

/** Per-player Soul Stone count snapshot — mirrors the relevant columns
 *  on `soulStones` (apps/db/schema.ts). The router converts the row
 *  to/from this shape so this module stays free of drizzle types. */
export interface SoulStoneCounts {
  violetCount: number;
  redCount: number;
  goldCount: number;
}

/** Weekly soft-cap on combat-source collection (§1.2). */
export const WEEKLY_COLLECT_CAP = 15;

/** Red stones required to summon a Tier-1 Demon Pet (§2.2). MVP starts
 *  at 10 — the doc spec is 7 but we round up while the demon-pet
 *  catalog is stubbed. Adjustable when the full roster lands. */
export const DEMON_PET_SUMMON_COST = 10;

/** Corrupt one violet stone → one red stone. Returns the new counts,
 *  or `null` if the player has no violet stones to spend. */
export function corruptSoulStone(counts: SoulStoneCounts): SoulStoneCounts | null {
  if (counts.violetCount < 1) return null;
  return {
    violetCount: counts.violetCount - 1,
    redCount: counts.redCount + 1,
    goldCount: counts.goldCount,
  };
}

/** Purify one violet stone → one gold stone. MVP is 1:1; the doc spec
 *  layers in a Dream-Token cost and a 15% failure rate (§3.1) which
 *  will land in a follow-up once the resonance-chamber UI exists. */
export function purifySoulStone(counts: SoulStoneCounts): SoulStoneCounts | null {
  if (counts.violetCount < 1) return null;
  return {
    violetCount: counts.violetCount - 1,
    redCount: counts.redCount,
    goldCount: counts.goldCount + 1,
  };
}

/** Result of a Demon-Pet summon. The `petPlaceholder` field is a stub
 *  until the real pet-roster generator lands — the gate just needs the
 *  function name to exist (`summonDemonPet`). */
export interface DemonPetSummonResult {
  success: true;
  redSpent: number;
  newCounts: SoulStoneCounts;
  petPlaceholder: "demon_pet";
}

/** Consume `cost` red stones to summon a Demon Pet placeholder. Returns
 *  `null` when the player can't afford it. The real pet-creation
 *  pipeline (Hierarchy roster lookup, art, ability wiring) is out of
 *  MVP scope — this just consumes stones and confirms the ritual. */
export function summonDemonPet(
  counts: SoulStoneCounts,
  cost: number = DEMON_PET_SUMMON_COST,
): DemonPetSummonResult | null {
  if (counts.redCount < cost) return null;
  return {
    success: true,
    redSpent: cost,
    newCounts: {
      violetCount: counts.violetCount,
      redCount: counts.redCount - cost,
      goldCount: counts.goldCount,
    },
    petPlaceholder: "demon_pet",
  };
}

/** Drop quantities per source (§1.2). The router calls into the
 *  matching one at each drop site; combat-win is the only site wired
 *  in the MVP slice. */
export const DROP_QUANTITIES = {
  combat_win: 1,
  combat_loss: 1, // 25% chance gate is at the call site
  story_chapter: 2,
  secret_found: 1, // gold (pre-purified)
  trust_milestone: 1,
} as const;

export type SoulStoneDropSource = keyof typeof DROP_QUANTITIES;

/** Returns `true` when the source counts toward the weekly soft-cap.
 *  Narrative sources (story chapters, trust milestones) are uncapped
 *  per §1.2; only combat / exploration sources hit the limit. */
export function dropSourceCountsTowardWeeklyCap(source: SoulStoneDropSource): boolean {
  return source === "combat_win" || source === "combat_loss";
}
