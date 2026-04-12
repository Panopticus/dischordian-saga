/**
 * Trigger queue — APNAP-ordered deterministic resolution of pending triggers.
 *
 * APNAP = Active Player, Non-Active Player. MTG's ordering convention for
 * simultaneous triggers. It's battle-tested, easy to reason about, and fully
 * deterministic given stable sort keys.
 *
 * Resolution order for simultaneous triggers:
 *   1. Triggers owned by the active player, sorted by (row, col, entityId,
 *      abilityIdx).
 *   2. Triggers owned by the non-active player, same sort.
 *   3. Within a single entity, multiple abilities resolve in their
 *      declaration order (abilityIdx).
 *
 * We build PendingTrigger.sortKey at enqueue time so drain just reads a
 * pre-sorted view. The sort key is:
 *
 *   [ownerPriority, row, col, entityIdTieBreaker, abilityIdx]
 *
 * where ownerPriority is 0 for the active player's triggers, 1 for the
 * opponent's; and entityIdTieBreaker is a stable lex comparison on the
 * entityId string.
 *
 * --- Effect execution plug-point ---
 *
 * This file does NOT know how to execute effect trees. That job belongs to
 * `effectInterpreter.ts` (ships with the card loader in WS2). Until then,
 * `drainTriggerQueue` delegates to a caller-supplied `TriggerEffectRunner`
 * so we can ship the ordering logic, land tests for it, and slot the real
 * interpreter in later without refactoring the queue.
 *
 * The runner signature:
 *
 *    (draft, pending, ctx) => void
 *
 * — it's allowed to mutate the draft freely (via Immer) and to push events
 * into ctx.events. It may also enqueue NEW triggers in response by
 * appending to draft.triggerQueue; the drain loop will pick them up on the
 * next iteration automatically.
 *
 * Reducer wires the real effectInterpreter runner into the drain call in a
 * follow-up commit. Tests here use a recording stub runner to prove the
 * ordering contract.
 */
import type { Draft } from "immer";
import type { GameState, PendingTrigger } from "../types/GameState";
import type { ReduceCtx } from "./reducer";
import type { Side } from "../types/Ids";

/** Pluggable effect execution callback. */
export type TriggerEffectRunner = (
  draft: Draft<GameState>,
  pending: PendingTrigger,
  ctx: ReduceCtx
) => void;

/** Maximum trigger drain iterations per fixed-point loop. Defense in depth. */
export const TRIGGER_DRAIN_CAP = 256;

/**
 * Drain the trigger queue to empty, running each trigger through the
 * supplied runner in APNAP order. Returns true if any triggers were
 * resolved, false if the queue was empty on entry.
 *
 * If a trigger's effect enqueues more triggers, those are resolved on
 * subsequent iterations in the same drain call. This is intentional — new
 * triggers should resolve before SBA runs again, so the chain of death
 * triggers fires at the same "time slice" as the original cause.
 */
export function drainTriggerQueue(
  draft: Draft<GameState>,
  ctx: ReduceCtx,
  runner: TriggerEffectRunner
): boolean {
  if (draft.triggerQueue.length === 0) return false;
  let drained = 0;
  let resolved = false;

  while (draft.triggerQueue.length > 0) {
    if (drained >= TRIGGER_DRAIN_CAP) {
      throw new Error(
        `drainTriggerQueue: exceeded ${TRIGGER_DRAIN_CAP} iterations. ` +
          "Likely an infinite trigger chain; card effects must terminate."
      );
    }
    // Re-sort in case new triggers were enqueued mid-drain. Sort is stable
    // via the sortKey tuple, so order is reproducible.
    const queue = draft.triggerQueue.slice();
    queue.sort(compareSortKeys);
    // Pop the first trigger and write the remainder back.
    const next = queue.shift()!;
    draft.triggerQueue = queue;
    runner(draft, next, ctx);
    drained++;
    resolved = true;
  }
  return resolved;
}

/**
 * Enqueue a pending trigger with APNAP sortKey for the current game state.
 *
 * Call this from the reducer or from the effect interpreter whenever an
 * event occurs that matches an entity's Trigger declaration. The queue is
 * re-sorted on each drain step, so ordering invariants survive out-of-order
 * enqueues.
 */
export function enqueueTrigger(
  draft: Draft<GameState>,
  params: {
    sourceEntityId: string;
    sourceOwner: Side;
    sourceRow: number;
    sourceCol: number;
    abilityIdx: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any;
  }
): void {
  const activePlayer = draft.currentPlayer;
  const ownerPriority = params.sourceOwner === activePlayer ? 0 : 1;
  const pending: PendingTrigger = {
    sortKey: [
      ownerPriority,
      params.sourceRow,
      params.sourceCol,
      params.sourceEntityId,
      params.abilityIdx,
    ],
    sourceEntityId: params.sourceEntityId as PendingTrigger["sourceEntityId"],
    abilityIdx: params.abilityIdx,
    context: params.context,
  };
  draft.triggerQueue = [...draft.triggerQueue, pending];
}

/**
 * Lex compare two sortKeys. Tuple order: [priority, row, col, entityId, idx].
 * String comparison for the entityId component; numeric for the rest.
 */
function compareSortKeys(a: PendingTrigger, b: PendingTrigger): number {
  const ak = a.sortKey;
  const bk = b.sortKey;
  for (let i = 0; i < 5; i++) {
    const av = ak[i];
    const bv = bk[i];
    if (av === bv) continue;
    if (typeof av === "number" && typeof bv === "number") {
      return av - bv;
    }
    return av < bv ? -1 : 1;
  }
  return 0;
}
