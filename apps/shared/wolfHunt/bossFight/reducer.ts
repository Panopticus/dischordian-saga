/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Boss fight card module: reducer

   Pure function over (state, action) → state'. The server
   loops this reducer until phase === "ended", then emits
   a boss_fight_resolved action to the mission reducer.

   Player turn flow:
     1. Client calls play_wolf_card(card).
     2. Reducer applies the card: lieutenant HP down,
        lycos HP down by selfCost (or up by mercy's effect),
        log line written.
     3. Reducer advances phase to lieutenant_turn.
     4. Server immediately calls take_lieutenant_turn()
        for the AI's reply; reducer plays a defender card
        and advances phase back to wolf_turn.

   Terminal conditions checked after each card resolution:
     - lieutenantHp <= 0 → wolf_wins
     - mercy lands with lieutenantHp <= 10 → wolf_wins (spared)
     - lycosHp <= 0 → lycos_dies
     - turn > maxTurns → lieutenant_wins (escaped)
   ═══════════════════════════════════════════════════════ */

import {
  WOLF_CARD_DEFS,
  DEFENDER_CARD_DEFS,
} from "./cards";
import type {
  BossState,
  WolfCardId,
  DefenderCardId,
} from "./state";

export type BossAction =
  | { kind: "play_wolf_card"; card: WolfCardId }
  | { kind: "take_lieutenant_turn" };

function checkTerminal(state: BossState): BossState {
  if (state.outcome) return state;
  if (state.lycosHp <= 0) {
    return { ...state, phase: "ended", outcome: "lycos_dies" };
  }
  if (state.lieutenantHp <= 0) {
    return { ...state, phase: "ended", outcome: "wolf_wins" };
  }
  if (state.turn > state.maxTurns) {
    return { ...state, phase: "ended", outcome: "lieutenant_wins" };
  }
  return state;
}

function drawWolf(state: BossState): BossState {
  if (state.wolfDeck.length === 0) return state;
  const [next, ...rest] = state.wolfDeck;
  return {
    ...state,
    wolfHand: [...state.wolfHand, next],
    wolfDeck: rest,
  };
}

function drawDefender(state: BossState): BossState {
  if (state.defenderDeck.length === 0) return state;
  const [next, ...rest] = state.defenderDeck;
  return {
    ...state,
    defenderHand: [...state.defenderHand, next],
    defenderDeck: rest,
  };
}

function chooseDefenderCard(state: BossState): DefenderCardId | null {
  if (state.defenderHand.length === 0) return null;
  // Tiny AI: if low HP, prefer heal; if Wolf is low, prefer damage; else
  // pick the first card in hand.
  if (state.lieutenantHp < state.lieutenantMaxHp * 0.4) {
    const heal = state.defenderHand.find((c) => DEFENDER_CARD_DEFS[c].heal > 0);
    if (heal) return heal;
  }
  if (state.lycosHp < state.lycosMaxHp * 0.4) {
    const dmg = state.defenderHand.find((c) => DEFENDER_CARD_DEFS[c].damage > 0);
    if (dmg) return dmg;
  }
  return state.defenderHand[0];
}

export function reduceBossFight(state: BossState, action: BossAction): BossState {
  if (state.outcome) return state;

  switch (action.kind) {
    case "play_wolf_card": {
      if (state.phase !== "wolf_turn") return state;
      if (!state.wolfHand.includes(action.card)) return state;

      const def = WOLF_CARD_DEFS[action.card];
      const handAfter = state.wolfHand.filter((c, i, arr) => {
        // remove first occurrence
        return arr.indexOf(action.card) !== i ? true : c !== action.card;
      });

      const lieutenantHp = state.lieutenantHp - def.damage;
      const lycosHp = Math.max(0, Math.min(state.lycosMaxHp, state.lycosHp - def.selfCost));

      const sparedNow = def.spares && lieutenantHp <= 10;

      let next: BossState = {
        ...state,
        wolfHand: handAfter,
        lieutenantHp: sparedNow ? 0 : lieutenantHp,
        lycosHp,
        log: [...state.log, `Lycos plays ${def.name}.`],
        phase: "lieutenant_turn",
      };
      if (sparedNow) {
        next = { ...next, phase: "ended", outcome: "wolf_wins" };
      }
      return checkTerminal(next);
    }

    case "take_lieutenant_turn": {
      if (state.phase !== "lieutenant_turn") return state;

      let working: BossState = drawDefender(state);
      const pick = chooseDefenderCard(working);
      if (!pick) {
        // No card to play — pass and advance turn.
        return checkTerminal({
          ...working,
          turn: working.turn + 1,
          phase: "wolf_turn",
        });
      }

      const def = DEFENDER_CARD_DEFS[pick];
      const handAfter = working.defenderHand.filter((c, i, arr) => {
        return arr.indexOf(pick) !== i ? true : c !== pick;
      });
      const lycosHp = Math.max(0, working.lycosHp - def.damage);
      const lieutenantHp = Math.min(
        working.lieutenantMaxHp,
        working.lieutenantHp + def.heal,
      );

      working = {
        ...working,
        defenderHand: handAfter,
        lycosHp,
        lieutenantHp,
        log: [...working.log, `The lieutenant plays ${def.name}.`],
        turn: working.turn + 1,
        phase: "wolf_turn",
      };

      // Wolf draws at end of his turn cycle.
      working = drawWolf(working);

      return checkTerminal(working);
    }
  }
}
