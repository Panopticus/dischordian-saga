/* ═══════════════════════════════════════════════════════
   CADES FPS SUIT ADAPTER (plan §G.11)

   Produces a `suit_bonuses` sub-object merged into the
   CADES_CONFIG postMessage payload. Godot-side stores the
   dict on the WebBridge autoload; ShieldManager.gd
   multiplies its hardcoded rate by shield_rate_mult.

   Reload semantics: bonuses are latched at CONFIG post
   time (plan §G.11.1). No retro-apply mid-run.
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import { piecesEquippedForSet, suitOnly } from "./_shared";

export interface FpsSuitBonuses {
  /** Accuracy multiplier applied to shot-spread. 1.0 = default. */
  accuracy: number;
  /** Reload-time multiplier (higher = faster). 1.0 = default. */
  reload_speed: number;
  /** Move-speed multiplier. 1.0 = default. */
  move_speed: number;
  /** Magazine-size additive delta. */
  mag_size: number;
  /** Damage falloff reduction multiplier. Higher = less falloff. */
  damage_falloff: number;
  /** Headshot crit multiplier. 1.0 = default. */
  headshot_crit: number;
  /** Multiplier on Godot's hardcoded shield-regen rate. 1.0 = default. */
  shield_rate_mult: number;
}

export function toFpsSuitBonuses(
  bonuses: readonly AggregatedBonus[],
): FpsSuitBonuses {
  const s = suitOnly(bonuses);
  const soldier = piecesEquippedForSet(s, "bulwark-of-the-eighth-column");
  const spy = piecesEquippedForSet(s, "low-profile-tailoring");
  const assassin = piecesEquippedForSet(s, "black-crepe-weave");
  const mourner = piecesEquippedForSet(s, "the-mourners-coat");
  return {
    accuracy: spy >= 4 ? 1.05 : 1,
    reload_speed: soldier >= 2 ? 1.1 : 1,
    move_speed: assassin >= 4 ? 1.08 : 1,
    mag_size: soldier >= 7 ? 2 : 0,
    damage_falloff: spy >= 7 ? 1.1 : 1,
    headshot_crit: assassin >= 7 ? 1.25 : 1,
    shield_rate_mult: mourner >= 10 ? 1.15 : 1,
  };
}
