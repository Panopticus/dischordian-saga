/**
 * Pure reducer. The only legal way to evolve a GameState.
 *
 * Contract:
 *   - `reduce(state, action, registry)` is a pure function.
 *   - `state` must be treated as immutable. In dev we `Object.freeze` it
 *     shallowly as a sanity check; violations throw.
 *   - On any illegal action, the reducer returns `{state: state, events: [],
 *     error}`. It never throws for a validation failure.
 *   - On any legal action, the reducer returns `{state: nextState, events}`
 *     where `nextState` is a new object (structural sharing via Immer is
 *     fine; identity must differ when anything changed).
 *   - Randomness is drawn only from `state.rngState`; `nextState.rngState`
 *     is advanced to reflect any draws. If the reducer made no random
 *     choices, `nextState.rngState === state.rngState`.
 *
 * This file is currently a skeleton: it validates the contract plumbing
 * (action routing, frozen input, error returns, determinism) so that
 * downstream workstreams (WS2 card interpreter, WS4 server match loop,
 * WS9 replay verifier) can wire onto a stable surface immediately.
 *
 * Each `case` block delegates to a dedicated handler under engine/* that
 * will be filled in subsequently. The reducer itself should never grow
 * past a couple hundred lines.
 */
import { produce, freeze } from "immer";
import type { Draft } from "immer";
import type { GameState, CardRegistry } from "../types/GameState";
import type { Action, ReduceError } from "../types/Action";
import type { GameEvent } from "../types/Event";
import { createRng, type Rng } from "./rng";
import { RULES_VERSION } from "./version";
import { runStateBasedActions, SBA_SAFETY_CAP } from "./stateBasedActions";
import { drainTriggerQueue, type TriggerEffectRunner } from "./triggerQueue";

export interface ReduceResult {
  state: GameState;
  events: readonly GameEvent[];
  error?: ReduceError;
}

/**
 * Opaque handle passed into each handler. Collects events + RNG draws, so
 * handlers mutate an Immer draft instead of returning new states by hand.
 */
export interface ReduceCtx {
  events: GameEvent[];
  /** Seedrandom instance initialized from state.rngState. Persist on exit. */
  rng: Rng;
  registry: CardRegistry;
}

/**
 * Pluggable effect runner for the trigger queue.
 *
 * The real runner lives in engine/effectInterpreter.ts (lands with the card
 * loader in WS2). The reducer installs it here so test suites can
 * substitute a recording stub. Default is a no-op that just drops triggers
 * — until WS2 ships, enqueued triggers have no effect bodies to run.
 */
let triggerEffectRunner: TriggerEffectRunner = (_draft, _pending, _ctx) => {
  // No-op default. WS2 installs the effectInterpreter runner via
  // `setTriggerEffectRunner`.
};

export function setTriggerEffectRunner(runner: TriggerEffectRunner): void {
  triggerEffectRunner = runner;
}

/** For tests only — restore the no-op default. */
export function resetTriggerEffectRunner(): void {
  triggerEffectRunner = () => {};
}

/**
 * Pure reducer entry point.
 *
 * - Never throws on invalid actions.
 * - Freezes the input shallowly in development to catch mutation bugs.
 * - Pumps the trigger queue and SBA fixed-point via `runFixedPoint`.
 */
export function reduce(
  state: GameState,
  action: Action,
  registry: CardRegistry
): ReduceResult {
  if (state.phase === "ended") {
    return {
      state,
      events: [],
      error: { code: "match_ended", message: "Cannot act after match end." },
    };
  }

  // Dev-only shallow freeze: if a downstream handler tries to mutate the
  // input directly (bypassing Immer), v8 throws a TypeError here and the
  // test suite catches it loud.
  if (process.env.NODE_ENV !== "production") {
    freeze(state, true);
  }

  // Fresh RNG cursor initialized from persisted state.
  const rng = createRng(state.rngState, true);
  const events: GameEvent[] = [];
  const ctx: ReduceCtx = { events, rng, registry };

  let error: ReduceError | undefined;

  const next = produce(state, (draft) => {
    try {
      switch (action.kind) {
        case "mulligan":
          error = handleMulligan(draft, action, ctx);
          break;
        case "finish_mulligan":
          error = handleFinishMulligan(draft, action, ctx);
          break;
        case "move":
          error = handleMove(draft, action, ctx);
          break;
        case "attack":
          error = handleAttack(draft, action, ctx);
          break;
        case "play_card":
          error = handlePlayCard(draft, action, ctx);
          break;
        case "replace_card":
          error = handleReplaceCard(draft, action, ctx);
          break;
        case "bloodborn_spell":
          error = handleBloodborn(draft, action, ctx);
          break;
        case "end_turn":
          error = handleEndTurn(draft, action, ctx);
          break;
        case "concede":
          error = handleConcede(draft, action, ctx);
          break;
        default: {
          const _exhaust: never = action;
          void _exhaust;
        }
      }

      if (error) return;

      // Advance the RNG cursor so callers who drew randomness see the new
      // state persisted.
      draft.rngState = ctx.rng.state();
      // Bump sequence counter so clients can dedup in-flight resubmits.
      draft.actionSeq = draft.actionSeq + 1;

      // Fixed-point: drain triggers + run state-based actions until stable.
      // These modules land in follow-up commits; for now the skeleton just
      // records the hook site.
      runFixedPoint(draft, ctx);
    } catch (e) {
      // Any exception from a handler is a bug in the reducer, not a player
      // action. Translate to an error record and leave state unchanged by
      // throwing inside produce; but we never want this in shipped builds.
      if (process.env.NODE_ENV !== "production") {
        throw e;
      }
      error = {
        code: "illegal_move",
        message: `Reducer exception: ${(e as Error).message}`,
      };
    }
  });

  if (error) {
    return { state, events: [], error };
  }
  return { state: next, events };
}

/**
 * Fixed-point loop: drain the trigger queue, run state-based actions, repeat
 * until the draft is stable.
 *
 * This is the single most important correctness construct in the reducer.
 * Without it, cascading deaths (AoE → 3 deathwatch triggers → 4th unit dies
 * → more deathwatch triggers) silently miss steps. The order is:
 *
 *   1. drainTriggerQueue — resolve every pending trigger (in APNAP order)
 *      before touching SBA. Effect runners may enqueue new triggers
 *      mid-drain; those get absorbed in the same drain call.
 *   2. runStateBasedActions — after all triggers resolve, clean up dead
 *      entities and expired buffs. SBA may itself enqueue new triggers
 *      (on_death, on_any_unit_dies) — any such triggers will be visible on
 *      the next loop iteration and resolved before the next SBA pass.
 *
 * A hard safety cap (SBA_SAFETY_CAP iterations) prevents infinite loops
 * from buggy card authoring. No legal card interaction needs more than
 * ~9 iterations in practice.
 */
function runFixedPoint(draft: Draft<GameState>, ctx: ReduceCtx): void {
  for (let i = 0; i < SBA_SAFETY_CAP; i++) {
    let changed = false;
    if (draft.triggerQueue.length > 0) {
      changed = drainTriggerQueue(draft, ctx, triggerEffectRunner) || changed;
    }
    changed = runStateBasedActions(draft, ctx) || changed;
    if (!changed) return;
  }
  // Safety cap exceeded — in dev, throw loud; in prod, leave the match in
  // whatever state it got to and log via events. A real game should never
  // hit this.
  if (process.env.NODE_ENV !== "production") {
    throw new Error(
      `runFixedPoint: exceeded ${SBA_SAFETY_CAP} iterations. ` +
        "Likely an infinite trigger/SBA chain."
    );
  }
}

/* ─── Handler stubs ───
 *
 * Each returns either undefined (success — draft was mutated) or a
 * ReduceError (failure — draft is discarded). In the foundation commit we
 * implement just enough to exercise the contract: `concede` and
 * `end_turn` work; the rest error out cleanly.
 */

function handleMulligan(
  _draft: GameState,
  _action: Extract<Action, { kind: "mulligan" }>,
  _ctx: ReduceCtx
): ReduceError | undefined {
  return { code: "illegal_move", message: "mulligan: not implemented yet" };
}

function handleFinishMulligan(
  _draft: GameState,
  _action: Extract<Action, { kind: "finish_mulligan" }>,
  _ctx: ReduceCtx
): ReduceError | undefined {
  return { code: "illegal_move", message: "finish_mulligan: not implemented yet" };
}

function handleMove(
  _draft: GameState,
  _action: Extract<Action, { kind: "move" }>,
  _ctx: ReduceCtx
): ReduceError | undefined {
  return { code: "illegal_move", message: "move: not implemented yet" };
}

function handleAttack(
  _draft: GameState,
  _action: Extract<Action, { kind: "attack" }>,
  _ctx: ReduceCtx
): ReduceError | undefined {
  return { code: "illegal_attack", message: "attack: not implemented yet" };
}

function handlePlayCard(
  _draft: GameState,
  _action: Extract<Action, { kind: "play_card" }>,
  _ctx: ReduceCtx
): ReduceError | undefined {
  return { code: "illegal_move", message: "play_card: not implemented yet" };
}

function handleReplaceCard(
  _draft: GameState,
  _action: Extract<Action, { kind: "replace_card" }>,
  _ctx: ReduceCtx
): ReduceError | undefined {
  return { code: "illegal_move", message: "replace_card: not implemented yet" };
}

function handleBloodborn(
  _draft: GameState,
  _action: Extract<Action, { kind: "bloodborn_spell" }>,
  _ctx: ReduceCtx
): ReduceError | undefined {
  return { code: "illegal_move", message: "bloodborn_spell: not implemented yet" };
}

function handleEndTurn(
  draft: GameState,
  action: Extract<Action, { kind: "end_turn" }>,
  ctx: ReduceCtx
): ReduceError | undefined {
  if (draft.phase !== "playing") {
    return { code: "wrong_phase", message: "end_turn only legal in play phase" };
  }
  if (action.actor !== draft.currentPlayer) {
    return { code: "not_your_turn", message: "end_turn from non-active player" };
  }
  const ending = draft.currentPlayer;
  ctx.events.push({ type: "turn_ended", player: ending, turnNumber: draft.turnNumber });
  const nextPlayer = (ending === 0 ? 1 : 0) as 0 | 1;
  draft.currentPlayer = nextPlayer;
  if (nextPlayer === 0) draft.turnNumber = draft.turnNumber + 1;
  ctx.events.push({
    type: "turn_started",
    player: nextPlayer,
    turnNumber: draft.turnNumber,
  });
  return undefined;
}

function handleConcede(
  draft: GameState,
  action: Extract<Action, { kind: "concede" }>,
  ctx: ReduceCtx
): ReduceError | undefined {
  const loser = action.actor;
  const winner = (loser === 0 ? 1 : 0) as 0 | 1;
  draft.winner = winner;
  draft.winReason = "surrender";
  draft.phase = "ended";
  ctx.events.push({ type: "match_ended", winner, reason: "surrender" });
  return undefined;
}

/** Exposed for tests & introspection. */
export const __rulesVersionForDebug = RULES_VERSION;
