/* ═══════════════════════════════════════════════════════
   ARK EVENTS SUIT ADAPTER (plan §G.11)

   Two injection points per plan §G.11:
     - eventRollModifier  (bumps d20 roll or equivalent)
     - rewardTableModifier (shifts rarity weights)
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import { piecesEquippedForSet, suitOnly } from "./_shared";

export interface ArkEventModifiers {
  /** Flat bonus to the event discovery roll. */
  eventRollBonus: number;
  /** Allow one re-roll per day when nat-1 equivalent lands. */
  rerollOnMin: boolean;
  /** Shift rare rarities up by this many weight points. */
  rarityWeightShift: number;
  /** One auto-success per act (Bulwark 10pc). */
  autoSuccessesPerAct: number;
}

export function toArkEventModifiers(
  bonuses: readonly AggregatedBonus[],
): ArkEventModifiers {
  const s = suitOnly(bonuses);
  const oracle = piecesEquippedForSet(s, "regalia-of-the-seeing-stylus");
  const bulwark = piecesEquippedForSet(s, "bulwark-of-the-eighth-column");
  // Any element-set at 4pc = gentle rarity nudge.
  const elementIds = [
    "geomancers-stratum",
    "ember-bellows-array",
    "tide-engine-carapace",
    "aetheric-dirigible-rig",
    "void-sextant-ensemble",
    "chronometer-livery",
    "dicewrights-motley",
    "null-weaver-mantle",
  ];
  let elementAnyFour = false;
  for (const id of elementIds) {
    if (piecesEquippedForSet(s, id) >= 4) {
      elementAnyFour = true;
      break;
    }
  }
  return {
    eventRollBonus: oracle >= 7 ? 5 : oracle >= 2 ? 2 : 0,
    rerollOnMin: oracle >= 7,
    rarityWeightShift: elementAnyFour ? 1 : 0,
    autoSuccessesPerAct: bulwark >= 10 ? 1 : 0,
  };
}
