/**
 * ExecCtx — the effect interpreter's environment.
 *
 * The interpreter walks effect trees inside a "current situation" that
 * tells it things like "which entity's ability is firing" (needed to
 * resolve `self`), "what is the current sub-target inside a with_target
 * wrapper" (needed to resolve `it`), and "what event caused the trigger"
 * (needed to resolve `trigger_source` / `trigger_victim`).
 *
 * ExecCtx is separate from ReduceCtx because it changes as the interpreter
 * recurses into `with_target` / `foreach` — each recursion layer derives a
 * new ExecCtx with a different `it`.
 *
 * ExecCtx is immutable: we derive new contexts rather than mutating, so
 * the interpreter's recursion is tractable and replay traces are clean.
 */
import type { EntityId, Side } from "../types/Ids";

export interface ExecCtx {
  /**
   * The entity whose ability is firing right now. Resolves `self`.
   * May be undefined for spells that have no board presence — in that
   * case the caster's side is still carried via `actorSide`.
   */
  readonly sourceEntityId: EntityId | undefined;
  /** The side that initiated the effect (spell caster or ability owner). */
  readonly actorSide: Side;
  /**
   * Current bound target for `with_target` / `foreach`. Undefined at the
   * top level; populated inside those wrappers.
   */
  readonly it: EntityId | undefined;
  /** Most recently resolved target — the `previous_target` ref. */
  readonly previousTarget: EntityId | undefined;
  /**
   * Trigger source entity — the unit whose abilities caused the trigger.
   * For `on_deploy` this is the deploying unit itself.
   */
  readonly triggerSourceId: EntityId | undefined;
  /**
   * Trigger victim entity — the unit that was the object of the trigger.
   * E.g. for `on_damage_dealt`, this is the unit that took the damage.
   */
  readonly triggerVictimId: EntityId | undefined;
  /**
   * Player-chosen branch index for `choose_one` ops. Populated from the
   * Action submitted by the player; undefined outside choose_one scope.
   */
  readonly chooseIndex: number | undefined;
  /**
   * Player-supplied single-target entity id for selectors with
   * `chooser: "player"`. The reducer extracts this from the Action at
   * dispatch time.
   */
  readonly playerChosenTargetId: EntityId | undefined;
}

/** Minimal ExecCtx for testing — all fields undefined except side. */
export function makeExecCtx(actorSide: Side, overrides: Partial<ExecCtx> = {}): ExecCtx {
  return {
    sourceEntityId: undefined,
    actorSide,
    it: undefined,
    previousTarget: undefined,
    triggerSourceId: undefined,
    triggerVictimId: undefined,
    chooseIndex: undefined,
    playerChosenTargetId: undefined,
    ...overrides,
  };
}

/** Derive a new ExecCtx with a different `it` (used by with_target/foreach). */
export function withIt(ctx: ExecCtx, it: EntityId | undefined): ExecCtx {
  return { ...ctx, it, previousTarget: it ?? ctx.previousTarget };
}
