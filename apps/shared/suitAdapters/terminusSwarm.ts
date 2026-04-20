/* ═══════════════════════════════════════════════════════
   TERMINUS SWARM SUIT ADAPTER (plan §G.11)

   Terminus is pure TS — the adapter passes a `modifiers`
   object directly into createGameState() / engine.tick().
   No postMessage, no Godot.
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import { piecesEquippedForSet, suitOnly } from "./_shared";

export interface TerminusModifiers {
  /** Multiplier on every tower's damage. 1.0 = default. */
  towerDamageMult: number;
  /** Multiplier on every tower's range. 1.0 = default. */
  towerRangeMult: number;
  /** Multiplier on cooldowns (lower = faster). 1.0 = default. */
  towerCooldownMult: number;
  /** Flat bonus to starting currency. */
  startingCurrency: number;
  /** Flat extra starting turret slots (Pressure-Loom 10pc). */
  extraStartingTurrets: number;
  /** Multiplier on wave-end interest (1.0 = default). */
  waveInterestRate: number;
  /** Multiplier on virus tick speed (lower = slower). 1.0 = default. */
  virusTickReduction: number;
  /** Re-rollable waves per run (Probability 10pc). */
  rerollableWaves: number;
}

export function toTerminusModifiers(
  bonuses: readonly AggregatedBonus[],
): TerminusModifiers {
  const s = suitOnly(bonuses);
  const engineer = piecesEquippedForSet(s, "pressure-loom-harness");
  const dicewright = piecesEquippedForSet(s, "dicewrights-motley");
  const arcane = piecesEquippedForSet(s, "arcane-rune-regalia");
  return {
    towerDamageMult: 1,
    towerRangeMult: 1,
    towerCooldownMult: engineer >= 4 ? 0.95 : 1,
    startingCurrency: engineer >= 2 ? 50 : 0,
    extraStartingTurrets: engineer >= 10 ? 1 : 0,
    waveInterestRate: engineer >= 7 ? 1.1 : 1,
    virusTickReduction: arcane >= 7 ? 0.9 : 1,
    rerollableWaves: dicewright >= 10 ? 1 : 0,
  };
}
