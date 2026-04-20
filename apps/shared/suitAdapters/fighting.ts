/* ═══════════════════════════════════════════════════════
   FIGHTING SUIT ADAPTER (plan §G.11)

   Translates aggregator bonuses into the three existing
   FightEngine2D fighter-state fields (plus react-time).
   Populated at match init; never mutated mid-match.
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import { piecesEquippedForSet, suitOnly } from "./_shared";

export interface FightingModifiers {
  /** +damage%. Feeds FightEngine2D.playerDamageBonus. */
  damageBonus: number;
  /** +move-speed%. Feeds FightEngine2D.playerSpeedBonus. */
  speedBonus: number;
  /** +HP%. Feeds FightEngine2D.playerHpBonus. */
  hpBonus: number;
  /** +frame-advantage %. New field for scripted reactions. */
  reactTimeBonus: number;
}

export function toFightingModifiers(
  bonuses: readonly AggregatedBonus[],
): FightingModifiers {
  const s = suitOnly(bonuses);
  const bulwark = piecesEquippedForSet(s, "bulwark-of-the-eighth-column");
  const crepe = piecesEquippedForSet(s, "black-crepe-weave");
  const ember = piecesEquippedForSet(s, "ember-bellows-array");
  const chronometer = piecesEquippedForSet(s, "chronometer-livery");
  return {
    damageBonus: ember >= 7 ? 0.08 : 0,
    speedBonus: crepe >= 4 ? 0.1 : 0,
    hpBonus: bulwark >= 4 ? 0.05 : 0,
    reactTimeBonus: chronometer >= 4 ? 0.05 : 0,
  };
}
