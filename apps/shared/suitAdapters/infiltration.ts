/* ═══════════════════════════════════════════════════════
   INFILTRATION SUIT ADAPTER (plan §G.11)

   Reuses the scripted-dialog engine's `requires` predicate
   — the adapter exposes the set of set-ids that qualify as
   `hasSetBonus` gates, nothing more.
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import { piecesEquippedForSet, suitOnly } from "./_shared";

export interface InfiltrationModifiers {
  /** Map of setId -> highest equipped tier. Consumed by `requires` checks. */
  equippedTiers: Readonly<Record<string, number>>;
}

export function toInfiltrationModifiers(
  bonuses: readonly AggregatedBonus[],
): InfiltrationModifiers {
  const s = suitOnly(bonuses);
  const setIds = [
    "regalia-of-the-seeing-stylus",
    "pressure-loom-harness",
    "black-crepe-weave",
    "bulwark-of-the-eighth-column",
    "low-profile-tailoring",
    "arcane-rune-regalia",
    "clockwork-exoframe",
    "hybrid-vein-panoply",
    "the-mourners-coat",
    "the-first-chassis",
  ];
  const out: Record<string, number> = {};
  for (const id of setIds) {
    const n = piecesEquippedForSet(s, id);
    if (n > 0) out[id] = n;
  }
  return { equippedTiers: out };
}

/**
 * Convenience predicate for infiltration dialog-tree `requires`
 * fields: `hasSetBonus("bulwark-of-the-eighth-column", 4)`.
 */
export function hasInfiltrationSetBonus(
  mods: InfiltrationModifiers,
  setId: string,
  atLeastTier: number,
): boolean {
  return (mods.equippedTiers[setId] ?? 0) >= atLeastTier;
}
