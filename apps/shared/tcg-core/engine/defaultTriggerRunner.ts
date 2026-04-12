/**
 * Default trigger effect runner.
 *
 * Bridges the trigger queue (engine/triggerQueue.ts) to the effect
 * interpreter (engine/effectInterpreter.ts).
 *
 * The runner pulls the source entity off the draft, looks up its
 * CardDefinition via the CardRegistry, finds the correct ability by
 * index, builds an ExecCtx from the pending trigger's context snapshot,
 * then hands the ability.effect to `interpret()`.
 *
 * If the source entity is no longer on the board (e.g. it died before
 * the trigger resolved), the runner silently drops the trigger and
 * returns. This matches the canonical "fizzled trigger" semantics used
 * by Hearthstone and Duelyst.
 *
 * Installed by callers via `setTriggerEffectRunner(createDefaultTriggerRunner())`.
 */
import type { Draft } from "immer";
import type { GameState, PendingTrigger } from "../types/GameState";
import type { ConcreteAbility } from "../types/Trigger";
import type { TriggerEffectRunner } from "./triggerQueue";
import type { ReduceCtx } from "./reducer";
import { interpret } from "./effectInterpreter";
import { findBoardEntity } from "./targeting";
import type { ExecCtx } from "./execCtx";
import { evaluateCondition } from "./conditions";
import type { Condition, Effect } from "../types/Effect";

export function createDefaultTriggerRunner(): TriggerEffectRunner {
  return (draft: Draft<GameState>, pending: PendingTrigger, reduceCtx: ReduceCtx): void => {
    const entity = findBoardEntity(draft, pending.sourceEntityId);
    // Fizzle triggers whose source has left the board. Events tests can
    // detect this by the absence of a matching effect trace.
    if (!entity) return;

    const def = reduceCtx.registry.get(entity.card.defId);
    if (!def) return;
    const ability = def.abilities[pending.abilityIdx] as unknown as ConcreteAbility | undefined;
    if (!ability) return;

    // Build the ExecCtx from the trigger's context snapshot. Fields we
    // don't know at queue time default to undefined — the interpreter
    // handles missing refs as no-op targets.
    const snapshot = (pending.context ?? {}) as Partial<ExecCtx>;
    const ctx: ExecCtx = {
      sourceEntityId: entity.entityId,
      actorSide: entity.card.owner,
      it: undefined,
      previousTarget: undefined,
      triggerSourceId: snapshot.triggerSourceId,
      triggerVictimId: snapshot.triggerVictimId,
      chooseIndex: snapshot.chooseIndex,
      playerChosenTargetId: snapshot.playerChosenTargetId,
    };

    // Evaluate the guard condition (if any) before interpreting the effect.
    if (ability.condition) {
      const cond = ability.condition as unknown as Condition;
      if (!evaluateCondition(cond, ctx, draft)) return;
    }

    reduceCtx.events.push({
      type: "trigger_fired",
      sourceId: entity.entityId,
      abilityId: ability.id,
      cause: `abilityIdx:${pending.abilityIdx}`,
    });

    interpret(ability.effect as unknown as Effect, ctx, draft, reduceCtx);
  };
}
