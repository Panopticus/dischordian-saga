/* ═══════════════════════════════════════════════════════
   DIPLOMACY MINIGAME SUIT ADAPTER (plan §G.11)

   Three hooks: word-bank capacity, set-gated unlockable
   demands, and Oracle 10pc's "preview next demand" once
   per negotiation.
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import { piecesEquippedForSet, suitOnly } from "./_shared";

export interface DiplomacyModifiers {
  /** Extra word-bank slots (additive). */
  wordBankCapacityDelta: number;
  /** Set ids that unlock gated demands. Kept as strings — readers own the demand table. */
  unlockedDemandSetIds: readonly string[];
  /** One "preview next demand" use per negotiation (Oracle 10pc). */
  previewDemandUses: number;
}

export function toDiplomacyModifiers(
  bonuses: readonly AggregatedBonus[],
): DiplomacyModifiers {
  const s = suitOnly(bonuses);
  const oracle = piecesEquippedForSet(s, "regalia-of-the-seeing-stylus");
  const spy = piecesEquippedForSet(s, "low-profile-tailoring");
  const mourner = piecesEquippedForSet(s, "the-mourners-coat");
  const unlocked: string[] = [];
  if (oracle >= 4) unlocked.push("regalia-of-the-seeing-stylus");
  if (spy >= 4) unlocked.push("low-profile-tailoring");
  if (mourner >= 4) unlocked.push("the-mourners-coat");
  return {
    wordBankCapacityDelta: oracle >= 2 ? 2 : spy >= 2 ? 1 : 0,
    unlockedDemandSetIds: unlocked,
    previewDemandUses: oracle >= 10 ? 1 : 0,
  };
}
