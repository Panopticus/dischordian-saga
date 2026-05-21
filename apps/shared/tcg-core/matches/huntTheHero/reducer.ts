/* ═══════════════════════════════════════════════════════
   HUNT-THE-HERO — pure reducer

   Total over the action union. Returns either a new state
   or a ReduceError. The reducer never throws on bad input.

   Action union:
     - { kind: "player_play"; card; targetHero? } — player
       plays a card from hand.
     - { kind: "player_end_turn" } — player ends their turn;
       phase flips to wolf_turn.
     - { kind: "wolf_take_turn" } — scripted Wolf AI plays a
       single card, draws, and flips phase back to player_turn.

   The Wolf is fully deterministic — server calls
   `wolf_take_turn` between player turns. No human Wolf
   client exists.

   Termination is computed at every phase flip:
     - turn > maxTurns                  → draw_timeout
     - all heroes resolved (dead /
       evacuated / spared) AND no
       hero is dead                     → mercy_extended (if
                                          mercyPlayed) else
                                          player_saved_all
     - killed >= 1 at end                → wolf_killed_{one,two,all}
   ═══════════════════════════════════════════════════════ */

import {
  type HuntState,
  type Hero,
  type HeroId,
  type PlayerCardId,
  type WolfCardId,
  type HuntOutcome,
} from "./state";

export type HuntAction =
  | {
      kind: "player_play";
      card: PlayerCardId;
      targetHero?: HeroId;
    }
  | { kind: "player_end_turn" }
  | { kind: "wolf_take_turn" };

export type HuntReduceErrorCode =
  | "phase_mismatch"
  | "card_not_in_hand"
  | "missing_target"
  | "invalid_target"
  | "match_ended";

export interface HuntReduceError {
  code: HuntReduceErrorCode;
  message: string;
}

export interface HuntReduceResult {
  state: HuntState;
  error?: HuntReduceError;
}

const HUNT_DAMAGE = 3;

/** Pure entry point. Returns updated state or an error. */
export function reduceHunt(
  state: HuntState,
  action: HuntAction,
): HuntReduceResult {
  if (state.phase === "ended") {
    return {
      state,
      error: { code: "match_ended", message: "match already ended" },
    };
  }

  switch (action.kind) {
    case "player_play":
      return reducePlayerPlay(state, action);
    case "player_end_turn":
      return reducePlayerEndTurn(state);
    case "wolf_take_turn":
      return reduceWolfTurn(state);
  }
}

/* ─── PLAYER ACTIONS ─── */

function reducePlayerPlay(
  state: HuntState,
  action: { kind: "player_play"; card: PlayerCardId; targetHero?: HeroId },
): HuntReduceResult {
  if (state.phase !== "player_turn") {
    return {
      state,
      error: { code: "phase_mismatch", message: "not your turn" },
    };
  }
  const handIdx = state.playerHand.indexOf(action.card);
  if (handIdx === -1) {
    return {
      state,
      error: {
        code: "card_not_in_hand",
        message: `${action.card} is not in hand`,
      },
    };
  }

  let next = state;
  const target = action.targetHero
    ? findHero(state, action.targetHero)
    : null;

  switch (action.card) {
    case "warn": {
      if (!target) {
        return {
          state,
          error: { code: "missing_target", message: "warn requires a target" },
        };
      }
      if (target.resolution !== "alive") {
        return {
          state,
          error: {
            code: "invalid_target",
            message: "warn targets only living heroes",
          },
        };
      }
      next = mapHero(state, target.id, (h) => ({
        ...h,
        maxHp: h.maxHp + 2,
        hp: Math.min(h.maxHp + 2, h.hp + 2),
        shielded: true,
        warned: true,
      }));
      next = pushLog(
        next,
        `Player warns ${target.name}. They steel themselves; +2 HP and shielded.`,
      );
      break;
    }
    case "shield": {
      if (!target) {
        return {
          state,
          error: { code: "missing_target", message: "shield requires a target" },
        };
      }
      if (target.resolution !== "alive") {
        return {
          state,
          error: { code: "invalid_target", message: "shield targets only living heroes" },
        };
      }
      next = mapHero(state, target.id, (h) => ({ ...h, shielded: true }));
      next = pushLog(next, `Player shields ${target.name}.`);
      break;
    }
    case "evacuate": {
      if (!target) {
        return {
          state,
          error: { code: "missing_target", message: "evacuate requires a target" },
        };
      }
      if (target.resolution !== "alive") {
        return {
          state,
          error: { code: "invalid_target", message: "evacuate targets only living heroes" },
        };
      }
      if (target.hp * 2 < target.maxHp) {
        return {
          state,
          error: {
            code: "invalid_target",
            message: "evacuate requires the hero at ≥ 50% HP",
          },
        };
      }
      next = mapHero(state, target.id, (h) => ({ ...h, resolution: "evacuated" }));
      next = pushLog(next, `Player evacuates ${target.name}. Saved.`);
      break;
    }
    case "confront": {
      // Global: the next hunt is interrupted. Modeled by
      // shielding every living hero once.
      next = {
        ...state,
        heroes: state.heroes.map((h) =>
          h.resolution === "alive" ? { ...h, shielded: true } : h,
        ),
      };
      next = pushLog(
        next,
        `Player confronts Lycos. Every living hero is briefly shielded — his next hunt has nowhere to land.`,
      );
      break;
    }
  }

  // Discard the played card from hand.
  const nextHand = next.playerHand.slice();
  nextHand.splice(handIdx, 1);
  next = { ...next, playerHand: nextHand };

  return checkTermination(next);
}

function reducePlayerEndTurn(state: HuntState): HuntReduceResult {
  if (state.phase !== "player_turn") {
    return {
      state,
      error: { code: "phase_mismatch", message: "not your turn" },
    };
  }
  // Draw one player card for next turn (no-op if deck empty).
  const drawn = drawOne(state.playerDeck);
  const next: HuntState = {
    ...state,
    phase: "wolf_turn",
    playerDeck: drawn.rest,
    playerHand: drawn.card
      ? [...state.playerHand, drawn.card]
      : state.playerHand,
    log: [...state.log, "Player ends turn. Lycos's turn."],
  };
  return checkTermination(next);
}

/* ─── WOLF AI ─── */

function reduceWolfTurn(state: HuntState): HuntReduceResult {
  if (state.phase !== "wolf_turn") {
    return {
      state,
      error: { code: "phase_mismatch", message: "not the wolf's turn" },
    };
  }

  // Memory of the medic always plays first if drawn.
  let cardIdx = state.wolfHand.indexOf("memory_of_the_medic");
  if (cardIdx === -1) {
    // Else play the first card in deterministic priority:
    // mercy (if any hero is alive AND we have killed at least one),
    // hunt (priority target: most-wounded living non-shielded),
    // restraint (fallback).
    const priorityOrder: WolfCardId[] = ["mercy", "hunt", "restraint"];
    for (const candidate of priorityOrder) {
      const idx = state.wolfHand.indexOf(candidate);
      if (idx !== -1) {
        cardIdx = idx;
        break;
      }
    }
  }

  let next = state;
  if (cardIdx === -1) {
    next = pushLog(state, "Lycos pauses, hand empty. The hunt holds.");
  } else {
    const card = state.wolfHand[cardIdx];
    next = applyWolfCard(state, card);
    // Discard played card.
    const nextHand = next.wolfHand.slice();
    nextHand.splice(cardIdx, 1);
    next = { ...next, wolfHand: nextHand };
  }

  // Draw for next turn.
  const drawn = drawOne(next.wolfDeck);
  next = {
    ...next,
    wolfDeck: drawn.rest,
    wolfHand: drawn.card ? [...next.wolfHand, drawn.card] : next.wolfHand,
    phase: "player_turn",
    turn: next.turn + 1,
  };

  return checkTermination(next);
}

function applyWolfCard(state: HuntState, card: WolfCardId): HuntState {
  switch (card) {
    case "hunt": {
      // Target the most-wounded living non-shielded hero.
      const living = state.heroes.filter((h) => h.resolution === "alive");
      const candidates = living.filter((h) => !h.shielded);
      const pool = candidates.length > 0 ? candidates : living;
      if (pool.length === 0) {
        return pushLog(state, "Lycos's hunt finds nothing left to hunt.");
      }
      const target = pool.reduce((lo, h) =>
        h.hp / h.maxHp < lo.hp / lo.maxHp ? h : lo,
      );
      // Shield consumed → 0 damage; else hp -= HUNT_DAMAGE.
      if (target.shielded) {
        const next = mapHero(state, target.id, (h) => ({ ...h, shielded: false }));
        return pushLog(
          next,
          `Lycos hunts ${target.name}. The shield holds — no damage.`,
        );
      }
      const newHp = target.hp - HUNT_DAMAGE;
      const next = mapHero(state, target.id, (h) => ({
        ...h,
        hp: Math.max(0, newHp),
        resolution: newHp <= 0 ? "dead" : h.resolution,
      }));
      if (newHp <= 0) {
        return pushLog(next, `Lycos hunts ${target.name}. They fall.`);
      }
      return pushLog(
        next,
        `Lycos hunts ${target.name}. Damage: ${HUNT_DAMAGE}. HP: ${Math.max(0, newHp)}/${target.maxHp}.`,
      );
    }
    case "mercy": {
      // Spare the most-wounded living hero.
      const living = state.heroes.filter((h) => h.resolution === "alive");
      if (living.length === 0) {
        return pushLog(state, "Lycos extends mercy to an empty Hall. No one left to spare.");
      }
      const target = living.reduce((lo, h) =>
        h.hp / h.maxHp < lo.hp / lo.maxHp ? h : lo,
      );
      const next: HuntState = {
        ...mapHero(state, target.id, (h) => ({ ...h, resolution: "spared" })),
        mercyPlayed: true,
      };
      return pushLog(
        next,
        `Lycos extends mercy to ${target.name}. The chronicle marks the gesture.`,
      );
    }
    case "restraint": {
      // Draw one extra card later (handled in main turn flow's
      // single draw — here we just narrate). Effectively a pass.
      return pushLog(
        state,
        "Lycos holds the hunt this turn. The Hall is quiet.",
      );
    }
    case "memory_of_the_medic": {
      const medic = state.heroes.find((h) => h.id === "field_medic");
      if (!medic || medic.resolution !== "alive") {
        return pushLog(
          state,
          "Lycos recalls the medic. The memory finds no one to land on.",
        );
      }
      const next: HuntState = {
        ...mapHero(state, "field_medic", (h) => ({ ...h, resolution: "spared" })),
        mercyPlayed: true,
      };
      return pushLog(
        next,
        `Lycos remembers the field medic to whom he extended mercy. Auto-mercy: ${medic.name} is spared.`,
      );
    }
  }
}

/* ─── TERMINATION ─── */

function checkTermination(state: HuntState): HuntReduceResult {
  const killed = state.heroes.filter((h) => h.resolution === "dead").length;
  const unresolved = state.heroes.filter((h) => h.resolution === "alive").length;

  // All heroes resolved → terminal.
  if (unresolved === 0) {
    const outcome = computeOutcome(state, killed);
    return {
      state: { ...state, phase: "ended", outcome, log: [...state.log, terminalLine(outcome)] },
    };
  }
  // Turn cap reached → terminal.
  if (state.turn > state.maxTurns) {
    const outcome: HuntOutcome = killed === 0 ? "draw_timeout" : computeOutcome(state, killed);
    return {
      state: {
        ...state,
        phase: "ended",
        outcome,
        log: [...state.log, terminalLine(outcome)],
      },
    };
  }
  return { state };
}

function computeOutcome(state: HuntState, killed: number): HuntOutcome {
  if (killed === 0) {
    return state.mercyPlayed ? "mercy_extended" : "player_saved_all";
  }
  if (killed === 1) return "wolf_killed_one";
  if (killed === 2) return "wolf_killed_two";
  return "wolf_killed_all";
}

function terminalLine(outcome: HuntOutcome): string {
  switch (outcome) {
    case "player_saved_all":
      return "All three heroes survived. Lycos's hunt closed without bloodshed.";
    case "mercy_extended":
      return "Lycos extended mercy. The chronicle records the gesture as a second concession.";
    case "wolf_killed_one":
      return "One hero fell to the Hunt.";
    case "wolf_killed_two":
      return "Two heroes fell to the Hunt.";
    case "wolf_killed_all":
      return "All three heroes fell. The Hall's geometry was vindicated.";
    case "draw_timeout":
      return "The turn count expired before the Hunt resolved. The Hall returns to waiting.";
  }
}

/* ─── HELPERS ─── */

function findHero(state: HuntState, id: HeroId): Hero | null {
  return state.heroes.find((h) => h.id === id) ?? null;
}

function mapHero(
  state: HuntState,
  id: HeroId,
  f: (h: Hero) => Hero,
): HuntState {
  return {
    ...state,
    heroes: state.heroes.map((h) => (h.id === id ? f(h) : h)),
  };
}

function pushLog(state: HuntState, line: string): HuntState {
  return { ...state, log: [...state.log, line] };
}

function drawOne<T>(deck: ReadonlyArray<T>): { card: T | null; rest: ReadonlyArray<T> } {
  if (deck.length === 0) return { card: null, rest: deck };
  return { card: deck[0], rest: deck.slice(1) };
}
