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
import { createRng, rngShuffle, type Rng } from "./rng";
import { RULES_VERSION } from "./version";
import { runStateBasedActions, SBA_SAFETY_CAP } from "./stateBasedActions";
import { drainTriggerQueue, type TriggerEffectRunner } from "./triggerQueue";
import { handleMulligan, handleFinishMulligan } from "./mulligan";
import { refreshTurnForPlayer } from "./turn";
import { tickLockout } from "./lockout";
import { drainScriptedActions } from "./scriptedActions";
import { emitPhaseStartEvent, resolveTrialOutcome } from "./trialPhase";
import { acceptGift, declineGift } from "./programmerGift";
import {
  bakeSeerFuture,
  consumeSeerFuture,
  forceSeerPlay,
  sampleSeerFutureCard,
} from "./seerProphecy";
import { handlePlayCard as handlePlayCardReal } from "./playCard";
import { handleMove as handleMoveReal } from "./movement";
import { handleAttack as handleAttackReal } from "./combat";
import { createDefaultTriggerRunner } from "./defaultTriggerRunner";
import type { ConcreteAbility } from "../types/Trigger";
import type { Effect } from "../types/Effect";
import type { EntityId } from "../types/Ids";
import { interpret } from "./effectInterpreter";
import { makeExecCtx } from "./execCtx";

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
 * Defaults to `createDefaultTriggerRunner()` — the real bridge from the
 * trigger queue to the effect interpreter. Tests that want to observe
 * trigger ordering without running real effects can swap this out via
 * `setTriggerEffectRunner(recordingStub)` and restore the default via
 * `resetTriggerEffectRunner()`.
 */
let triggerEffectRunner: TriggerEffectRunner = createDefaultTriggerRunner();

export function setTriggerEffectRunner(runner: TriggerEffectRunner): void {
  triggerEffectRunner = runner;
}

/** Restore the production default trigger runner. */
export function resetTriggerEffectRunner(): void {
  triggerEffectRunner = createDefaultTriggerRunner();
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
        case "programmer_gift_choice":
          error = handleProgrammerGiftChoice(draft, action, ctx);
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

function handleMove(
  draft: Draft<GameState>,
  action: Extract<Action, { kind: "move" }>,
  ctx: ReduceCtx
): ReduceError | undefined {
  return handleMoveReal(draft, action, ctx);
}

function handleAttack(
  draft: Draft<GameState>,
  action: Extract<Action, { kind: "attack" }>,
  ctx: ReduceCtx
): ReduceError | undefined {
  return handleAttackReal(draft, action, ctx);
}

function handlePlayCard(
  draft: Draft<GameState>,
  action: Extract<Action, { kind: "play_card" }>,
  ctx: ReduceCtx
): ReduceError | undefined {
  return handlePlayCardReal(draft, action, ctx);
}

function handleReplaceCard(
  draft: Draft<GameState>,
  action: Extract<Action, { kind: "replace_card" }>,
  ctx: ReduceCtx
): ReduceError | undefined {
  if (draft.phase !== "playing") {
    return { code: "wrong_phase", message: "replace_card only legal in play phase" };
  }
  if (action.actor !== draft.currentPlayer) {
    return { code: "not_your_turn", message: "replace_card from non-active player" };
  }
  const player = draft.players[action.actor];
  if (player.replaceUsed) {
    return {
      code: "action_already_used",
      message: "already used replace this turn",
    };
  }
  if (action.handIndex < 0 || action.handIndex >= player.hand.length) {
    return {
      code: "hand_index_out_of_bounds",
      message: `replace_card handIndex ${action.handIndex} out of bounds`,
    };
  }
  if (player.deck.length === 0) {
    return {
      code: "illegal_move",
      message: "cannot replace — deck is empty",
    };
  }

  // Remove the card from hand, shuffle it into the deck, draw the top.
  const removed = player.hand[action.handIndex];
  player.hand = [
    ...player.hand.slice(0, action.handIndex),
    ...player.hand.slice(action.handIndex + 1),
  ];
  player.deck = [...player.deck, removed];
  player.deck = rngShuffle(ctx.rng, player.deck);

  // Draw the new top card into the same hand slot position.
  const drawn = player.deck[0];
  player.deck = player.deck.slice(1);
  player.hand = [
    ...player.hand.slice(0, action.handIndex),
    drawn,
    ...player.hand.slice(action.handIndex),
  ];

  player.replaceUsed = true;
  ctx.events.push({
    type: "card_replaced",
    player: action.actor,
    handIndex: action.handIndex,
    newCardDefId: drawn.defId,
  });
  return undefined;
}

function handleBloodborn(
  draft: Draft<GameState>,
  action: Extract<Action, { kind: "bloodborn_spell" }>,
  ctx: ReduceCtx
): ReduceError | undefined {
  if (draft.phase !== "playing") {
    return { code: "wrong_phase", message: "bloodborn_spell only legal in play phase" };
  }
  if (action.actor !== draft.currentPlayer) {
    return { code: "not_your_turn", message: "bloodborn_spell from non-active player" };
  }
  const player = draft.players[action.actor];
  if (player.bloodbornUsed) {
    return {
      code: "action_already_used",
      message: "bloodborn already used this game",
    };
  }

  // Resolve the general's card definition for its Bloodborn ability.
  const generalEntityId = player.generalEntityId;
  const generalEntry = Object.values(draft.board).find(
    (e) => e.entityId === generalEntityId
  );
  if (!generalEntry) {
    return { code: "illegal_move", message: "general not on board" };
  }

  // Look up the general's card definition. If not in the registry
  // (placeholder generals in tests), the BBS still consumes 1 mana
  // and sets the flag, but no effect fires.
  const generalDef = ctx.registry.get(generalEntry.card.defId);

  // Resolve BBS ability from the general's definition if available.
  let bbsAbility: ConcreteAbility | undefined;
  if (generalDef) {
    const abilities = (generalDef.abilities ?? []) as unknown as ConcreteAbility[];
    bbsAbility = abilities.find(
      (a) => a.trigger.kind === "activated"
    );
  }

  // BBS costs 1 mana (Duelyst convention). Authored generals can
  // override via the activated ability's manaCost field.
  const bbsCost = bbsAbility
    ? (bbsAbility.trigger as { manaCost?: number }).manaCost ?? 1
    : 1;

  if (player.mana < bbsCost) {
    return {
      code: "insufficient_mana",
      message: `bloodborn costs ${bbsCost}, player has ${player.mana} mana`,
    };
  }

  player.mana -= bbsCost;
  player.bloodbornUsed = true;

  ctx.events.push({
    type: "bloodborn_cast",
    player: action.actor,
    spellName: generalDef?.name ?? generalEntry.card.defId,
  });

  // Execute the BBS effect if one exists.
  if (bbsAbility) {
    const execCtx = makeExecCtx(action.actor, {
      sourceEntityId: generalEntityId as EntityId,
      playerChosenTargetId: action.targetEntityId as EntityId | undefined,
    });
    interpret(bbsAbility.effect as Effect, execCtx, draft, ctx);
  }

  return undefined;
}

function handleEndTurn(
  draft: Draft<GameState>,
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
  // §5.5 Warlord lockout — tick the countdown when the lockout's
  // target side ends their turn (spec §2.3 — "as the player completes
  // each of turns 4, 5, 6, the corresponding tile dims"). When the
  // counter hits 0, tickLockout clears `state.lockout` and emits
  // `warlord_lockout_ended`. Must run before refreshTurnForPlayer so
  // the incoming side's refresh sees the post-tick lockout state.
  if (draft.lockout && draft.lockout.targetSide === ending) {
    tickLockout(draft, ending, ctx.events);
  }
  const nextPlayer = (ending === 0 ? 1 : 0) as 0 | 1;
  draft.currentPlayer = nextPlayer;
  if (nextPlayer === 0) draft.turnNumber = draft.turnNumber + 1;
  // Refresh the incoming player: +1 max mana, draw a card, reset
  // bloodborn/replace flags, refresh unit action counts.
  refreshTurnForPlayer(draft, nextPlayer, ctx);
  ctx.events.push({
    type: "turn_started",
    player: nextPlayer,
    turnNumber: draft.turnNumber,
  });
  // §5.8 trial: emit phase_started for the new turn (no-op on non-
  // trial matches). Resolve the verdict the moment we enter phase 10
  // since phase 10 has no card play (spec §2 row 10 — pure
  // resolution). The campaign layer reads `state.trial.outcome` to
  // fire the §5.8.1 Last Words cutscene. Runs BEFORE the scripted-
  // action drain so phase events land in narrative order (phase
  // start → scripted plays → player input).
  emitPhaseStartEvent(draft, ctx.events);
  if (draft.trial && draft.turnNumber === 10) {
    resolveTrialOutcome(draft, ctx.events);
  }
  // §4.9 Seer prophecy hook. Two halves:
  //   • Incoming side 0 (player): bake the Seer's next play if none
  //     pending. Spec §3 invariant — the pending future is visible
  //     during the player's turn so card effects can (eventually)
  //     resolve against it.
  //   • Incoming side 1 (Seer): consume the pending future if one
  //     matches the new turn and force-play it. If no bake exists yet
  //     (canonical first Seer turn of the match), bake-then-consume
  //     in the same tick so the Seer's very first play always fires.
  // Silent re-route of contradicted player effects is deferred to
  // a follow-up PR; the match plays correctly without it.
  if (draft.seerProphecy) {
    if (nextPlayer === 1) {
      if (!draft.seerProphecy.pending) {
        const sampled = sampleSeerFutureCard(draft, ctx);
        if (sampled) {
          draft.seerProphecy = bakeSeerFuture(
            draft.seerProphecy,
            sampled,
            draft.turnNumber,
          );
        }
      }
      const result = consumeSeerFuture(draft.seerProphecy, draft.turnNumber);
      draft.seerProphecy = result.next;
      if (result.consumed) {
        forceSeerPlay(draft, result.consumed.cardDefId, ctx);
      }
    } else if (!draft.seerProphecy.pending) {
      const sampled = sampleSeerFutureCard(draft, ctx);
      if (sampled) {
        draft.seerProphecy = bakeSeerFuture(
          draft.seerProphecy,
          sampled,
          draft.turnNumber,
        );
      }
    }
  }
  // Drain any scripted actions matching the new (turnNumber, side).
  // Story encounters use this to author set-piece plays the AI can't
  // be trusted to make on schedule (canonical case: §5.5 Warlord
  // Three Moves on her turn 3). Runs AFTER refresh so the active
  // side's hand/mana are fully set up before the scripted action
  // touches them.
  drainScriptedActions(draft, nextPlayer, ctx);
  return undefined;
}

function handleConcede(
  draft: Draft<GameState>,
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

/**
 * §5.6 Programmer gift — player accepted or declined the deliberate
 * throw. Transitions programmerGift state via the pure helpers.
 *
 * Accept: the Programmer's throw lands — the player wins the match
 * immediately (the "gift" is the win). WinReason is "surrender" for
 * now; the post-match dialog layer differentiates gift-win from
 * combat-win via the programmerGift.status === "accepted" read.
 *
 * Decline: the match continues under standard rules. The transition
 * records the refusal so Acts 2+ codex variants can branch on it.
 *
 * No-op when programmerGift is absent (non-§5.6 match) or already
 * resolved. No error — the engine treats stale/late clicks as a
 * tolerant pass-through.
 */
function handleProgrammerGiftChoice(
  draft: Draft<GameState>,
  action: Extract<Action, { kind: "programmer_gift_choice" }>,
  ctx: ReduceCtx
): ReduceError | undefined {
  const gift = draft.programmerGift;
  if (!gift || gift.status !== "offered") return undefined;
  const turn = draft.turnNumber;
  if (action.choice === "accept") {
    draft.programmerGift = acceptGift(gift, turn);
    // Programmer concedes — the player wins immediately. The actor's
    // side is the player; the loser is the opposite side.
    const loser = (action.actor === 0 ? 1 : 0) as 0 | 1;
    const winner = action.actor;
    draft.winner = winner;
    draft.winReason = "surrender";
    draft.phase = "ended";
    void loser;
    ctx.events.push({ type: "match_ended", winner, reason: "surrender" });
  } else {
    draft.programmerGift = declineGift(gift, turn);
    // Match continues under standard rules. No state change beyond
    // the gift transition itself.
  }
  return undefined;
}

/** Exposed for tests & introspection. */
export const __rulesVersionForDebug = RULES_VERSION;
