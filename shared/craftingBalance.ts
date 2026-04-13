/* ═══════════════════════════════════════════════════════
   F.3 CRAFTING PARTIAL SUCCESS — Material recovery & near misses

   Problem: When crafting fails, ALL materials are consumed.
   This punishes new players harshly and discourages crafting,
   which is one of the few existing Dream sinks.

   Solution:
   1. Partial material return on failure (30-70% based on skill)
   2. "Near miss" mechanic: if roll is within 5% of success,
      grant a lower-rarity output instead of nothing.
   ═══════════════════════════════════════════════════════ */

/* ─── RARITY HIERARCHY ─── */

const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary", "mythic", "neyon"] as const;
export type Rarity = (typeof RARITY_ORDER)[number];

/** Near-miss threshold: if the roll was within this % of succeeding */
const NEAR_MISS_THRESHOLD = 0.05;

/* ─── MATERIAL RETURN ON FAILURE ─── */

/**
 * Return rate scales linearly from 30% (skill 1) to 70% (skill 10).
 *
 *   Skill 1:  30% materials returned
 *   Skill 2:  34.4%
 *   Skill 3:  38.9%
 *   Skill 4:  43.3%
 *   Skill 5:  47.8% (~50%)
 *   Skill 6:  52.2%
 *   Skill 7:  56.7%
 *   Skill 8:  61.1%
 *   Skill 9:  65.6%
 *   Skill 10: 70%
 */
export function getMaterialReturnRate(skillLevel: number): number {
  const clamped = Math.max(1, Math.min(10, skillLevel));
  // Linear interpolation: skill 1 -> 0.30, skill 10 -> 0.70
  return 0.30 + ((clamped - 1) / 9) * 0.40;
}

/**
 * Given a skill level and the materials that were consumed,
 * calculates how many of each material to return to the player.
 *
 * Each material quantity is multiplied by the return rate and
 * rounded down (floor). Materials with quantity < 1 after rounding
 * are omitted (you always lose at least a little).
 */
export function calculateMaterialReturn(
  skillLevel: number,
  inputMaterials: Record<string, number>,
): Record<string, number> {
  const rate = getMaterialReturnRate(skillLevel);
  const returned: Record<string, number> = {};

  for (const [materialId, quantity] of Object.entries(inputMaterials)) {
    const returnedQty = Math.floor(quantity * rate);
    if (returnedQty > 0) {
      returned[materialId] = returnedQty;
    }
  }

  return returned;
}

/* ─── NEAR MISS MECHANIC ─── */

/**
 * Determines if a failed craft roll was a "near miss" and,
 * if so, returns a lower-rarity output instead of nothing.
 *
 * A near miss occurs when the roll was within 5% of the
 * success threshold (e.g., success rate 0.60, roll was 0.63).
 *
 * @param roll - The random roll that caused the failure (0-1)
 * @param successRate - The success rate threshold (0-1)
 * @param targetRarity - The rarity the craft was trying to produce
 * @returns The lower rarity to grant, or null if not a near miss
 *
 * Examples:
 *   roll=0.63, successRate=0.60, target="epic" -> "rare"
 *   roll=0.64, successRate=0.60, target="epic" -> "rare"
 *   roll=0.66, successRate=0.60, target="epic" -> null (too far)
 *   roll=0.63, successRate=0.60, target="common" -> null (no lower rarity)
 */
export function calculateNearMiss(
  roll: number,
  successRate: number,
  targetRarity: string,
): string | null {
  // Must be a failure (roll > successRate)
  if (roll <= successRate) return null;

  // Check if within the near-miss threshold
  if (roll - successRate > NEAR_MISS_THRESHOLD) return null;

  // Find the target rarity in the hierarchy
  const targetIndex = RARITY_ORDER.indexOf(targetRarity as Rarity);

  // No near miss if rarity is unknown or already at the lowest
  if (targetIndex <= 0) return null;

  // Return one rarity tier lower
  return RARITY_ORDER[targetIndex - 1];
}

/* ─── COMBINED FAILURE RESULT ─── */

export interface CraftFailureResult {
  /** Materials returned to the player */
  materialsReturned: Record<string, number>;
  /** If non-null, the player gets a lower-rarity item instead of nothing */
  nearMissRarity: string | null;
  /** Human-readable message for the UI */
  message: string;
}

/**
 * Computes the full result of a crafting failure, combining
 * material return and near-miss mechanics.
 */
export function processCraftFailure(
  skillLevel: number,
  inputMaterials: Record<string, number>,
  roll: number,
  successRate: number,
  targetRarity: string,
): CraftFailureResult {
  const materialsReturned = calculateMaterialReturn(skillLevel, inputMaterials);
  const nearMissRarity = calculateNearMiss(roll, successRate, targetRarity);
  const returnRate = getMaterialReturnRate(skillLevel);
  const returnPct = Math.round(returnRate * 100);

  let message: string;
  if (nearMissRarity) {
    message =
      `Near miss! Crafting failed, but you were close enough to salvage a ` +
      `${nearMissRarity} result. ${returnPct}% of materials recovered.`;
  } else {
    message =
      `Crafting failed. Your skill allowed you to recover ${returnPct}% of materials.`;
  }

  return { materialsReturned, nearMissRarity, message };
}
