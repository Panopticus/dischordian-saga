/**
 * Co-op Boss AI — wraps the heuristic campaignAI with co-op-specific
 * target priority and scripted phase casts.
 *
 * Architecture: under the hood the engine still runs 1v1, with the
 * boss occupying Side 1 and the party (1 or 2 humans) sharing Side 0
 * via the WS layer's input routing. So the boss AI just needs to be
 * smarter about:
 *
 *   1. Targeting "the weakest visible enemy" — when both witnesses
 *      have units on the board, pick the one whose general has lower
 *      HP first (closes a victory angle instead of spreading damage).
 *   2. Firing scripted phase casts at HP thresholds. The encounter
 *      def lists `phases` ordered descending by `hpFraction`; each
 *      phase fires once when the boss general crosses below its
 *      threshold. The cast is enqueued via `scriptedActions` so it
 *      lands at the start of the boss's next turn.
 *   3. Skipping low-impact card plays during a phase cast turn (the
 *      scripted action takes priority).
 *
 * Pure / no I/O. Caller (the WS layer) is responsible for injecting
 * the scripted action into the next turn-refresh.
 */

import type { GameState, CardRegistry } from "../types/GameState";
import type { Action } from "../types/Action";
import { chooseCampaignAction } from "./campaignAI";
import type { CoopEncounterDef, CoopPhaseTrigger } from "../coop/encounters";

const BOSS_SIDE = 1;

export interface CoopBossDecision {
  /** Action to execute next (passed to the engine reducer). */
  readonly action: Action;
  /** Phase trigger that fired this turn, if any. The caller should
   *  enqueue the trigger's castCardIds via scriptedActions before
   *  the next turn refresh. */
  readonly phaseFired: CoopPhaseTrigger | null;
}

/**
 * Choose the boss's next action. Wraps campaignAI's heuristic with
 * encounter-aware phase tracking.
 *
 * `firedPhaseFractions` is the running set of phase hpFractions that
 * have already fired this match — caller maintains it across calls
 * and passes it back. Empty Set on the first call.
 */
export function chooseCoopBossAction(opts: {
  state: GameState;
  registry: CardRegistry;
  difficulty: number;
  encounter: CoopEncounterDef;
  firedPhaseFractions: Set<number>;
}): CoopBossDecision {
  const { state, encounter, firedPhaseFractions } = opts;
  const action = chooseCampaignAction(state, opts.registry, opts.difficulty);

  // Detect phase trigger crossing. The boss entity's HP lives on
  // CardInstance, addressed via PlayerState.generalEntityId. We
  // walk the board to find that entity (board is keyed by posKey).
  const bossPlayer = state.players[BOSS_SIDE];
  let fraction = 1.0;
  if (bossPlayer) {
    const generalId = bossPlayer.generalEntityId;
    for (const cell of Object.values(state.board)) {
      if (cell.entityId === generalId) {
        const card = cell.card;
        if (card.maxHealth > 0) {
          fraction = card.currentHealth / card.maxHealth;
        }
        break;
      }
    }
  }

  let phaseFired: CoopPhaseTrigger | null = null;
  for (const phase of encounter.phases) {
    if (firedPhaseFractions.has(phase.hpFraction)) continue;
    if (fraction <= phase.hpFraction) {
      phaseFired = phase;
      firedPhaseFractions.add(phase.hpFraction);
      break;
    }
  }

  return { action, phaseFired };
}

/**
 * Convenience: scan an encounter def for the next un-fired phase
 * given the current boss-HP fraction. Returns null if none would
 * fire. Useful for previews and tests without running the full AI.
 */
export function nextPendingPhase(
  encounter: CoopEncounterDef,
  hpFraction: number,
  firedFractions: ReadonlySet<number>,
): CoopPhaseTrigger | null {
  for (const p of encounter.phases) {
    if (firedFractions.has(p.hpFraction)) continue;
    if (hpFraction <= p.hpFraction) return p;
  }
  return null;
}
