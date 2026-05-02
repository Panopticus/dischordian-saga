/**
 * Boss heuristic AI for the PvP battle engine (apps/shared/pvpBattle.ts).
 *
 * Distinct from apps/shared/tcg-core/ai/coopBossAI.ts which targets
 * the deeper Duelyst-style positional engine. This one drives the
 * simpler Hearthstone-like PvpBattleState used by pvpWs.ts in
 * production.
 *
 * Decision priority for the boss's turn:
 *   1. Play the most-expensive affordable card from hand
 *   2. Attack lowest-HP enemy minion; fall back to face if board empty
 *   3. End turn
 *
 * The runner calls this in a loop until it returns {kind: "end_turn"}.
 * Pure / no I/O / serialisable.
 */
import type { PvpBattleState, PvpAction } from "@shared/pvpBattle";

export interface BossDecision {
  readonly action: PvpAction;
  /** Hint to the runner: how long to delay before applying the action.
   *  Lets the boss's turn play out at human-readable pace instead of
   *  resolving everything in one frame. */
  readonly delayMs: number;
}

const BETWEEN_ACTIONS_MS = 750;
const PRE_END_TURN_MS = 250;

export function chooseBossAction(
  state: PvpBattleState,
  bossPlayerId: number,
): BossDecision {
  const boss = state.player1.id === bossPlayerId ? state.player1 : state.player2;
  const opponent = state.player1.id === bossPlayerId ? state.player2 : state.player1;
  if (!boss) return { action: { type: "END_TURN" }, delayMs: PRE_END_TURN_MS };

  // 1. Play most-expensive affordable card.
  const affordable = boss.hand.filter((c) => c.cost <= boss.energy);
  if (affordable.length > 0) {
    affordable.sort((a, b) => b.cost - a.cost);
    return {
      action: { type: "PLAY_CARD", cardInstanceId: affordable[0].instanceId },
      delayMs: BETWEEN_ACTIONS_MS,
    };
  }

  // 2. Attack with whichever boss minion can swing.
  const attackers = boss.field.filter((c) => !c.hasAttacked && !c.justDeployed && c.attack > 0);
  if (attackers.length > 0) {
    attackers.sort((a, b) => b.attack - a.attack);
    const attacker = attackers[0];
    // Prefer killing lowest-HP enemy minion; else face.
    const targets = opponent.field.filter((c) => c.currentHP > 0).sort((a, b) => a.currentHP - b.currentHP);
    const targetId: string | "face" = targets.length > 0 ? targets[0].instanceId : "face";
    return {
      action: { type: "ATTACK", attackerInstanceId: attacker.instanceId, targetInstanceId: targetId },
      delayMs: BETWEEN_ACTIONS_MS,
    };
  }

  // 3. End turn.
  return { action: { type: "END_TURN" }, delayMs: PRE_END_TURN_MS };
}

/**
 * Convenience: enumerate the full sequence of actions the boss will
 * take this turn. Useful for tests + replay reconstruction.
 *
 * Caller passes a `simulate` function that applies an action to a
 * state copy and returns the resulting state — typically wraps
 * `processPvpAction` from pvpBattle.
 */
export function planBossTurn(
  initialState: PvpBattleState,
  bossPlayerId: number,
  simulate: (state: PvpBattleState, action: PvpAction) => PvpBattleState,
  maxActions = 32,
): PvpAction[] {
  const actions: PvpAction[] = [];
  let state = initialState;
  for (let i = 0; i < maxActions; i++) {
    const decision = chooseBossAction(state, bossPlayerId);
    actions.push(decision.action);
    if (decision.action.type === "END_TURN") return actions;
    state = simulate(state, decision.action);
  }
  // Hit the safety cap — force end turn so we don't loop forever
  // on a buggy state.
  actions.push({ type: "END_TURN" });
  return actions;
}
