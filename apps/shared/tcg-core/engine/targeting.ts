/**
 * Target resolution.
 *
 * Two kinds of resolution here:
 *
 *  - `resolveTargetRef(ref, ctx, draft)` — resolves a `TargetRef` (like
 *    `{kind: "self"}` or `{kind: "it"}`) to a concrete BoardEntity id or
 *    to a "general ref" meaning the caster's/opponent's general. Used by
 *    effect primitives like `add_counter`, `buff`, `deal_damage`.
 *
 *  - `resolveTargetSelector(sel, ctx, draft)` — resolves a `TargetSelector`
 *    (like `{kind: "single", filter: {...}, chooser: "player"}`) to a list
 *    of BoardEntity ids. Used by `with_target`, `foreach`, and as the
 *    `targetSelector` on abilities whose effect starts from a player-
 *    chosen target.
 *
 * Both resolvers return arrays of `EntityId`. Single-target refs still
 * return a one-element array (or empty on failure), so callers can
 * iterate uniformly.
 *
 * Scope: this file implements only what the 3 reference cards need —
 * `self`, `it`, `friendly_general`, `enemy_general` for TargetRef, and
 * `single` (with `controller` filter and `chooser: "player"`) for
 * TargetSelector. Each future batch of authored cards grows this file
 * to cover the ops their effects demand.
 */
import type { GameState, BoardEntity } from "../types/GameState";
import type { EntityId, Side } from "../types/Ids";
import type { TargetRef, UnitFilter } from "../types/Effect";
import type { TargetSelector } from "../types/Targeting";
import type { ExecCtx } from "./execCtx";

/**
 * Look up a BoardEntity by entityId. Returns undefined if not on board.
 *
 * Parameter is typed as `GameState` (not `Draft<GameState>`) so this
 * helper accepts both plain states in tests and Immer drafts at runtime
 * — `Draft<T>` is structurally assignable to `T` for read-only access.
 * Callers that need to mutate the returned entity should cast to
 * `BoardEntity` via the draft they already hold.
 */
export function findBoardEntity(
  state: GameState,
  entityId: EntityId
): BoardEntity | undefined {
  for (const entity of Object.values(state.board)) {
    if (entity.entityId === entityId) return entity;
  }
  return undefined;
}

/**
 * Resolve a TargetRef to a list of entityIds. Most refs resolve to
 * exactly one entity (or zero if the reference is stale).
 *
 * Generals are resolved through `players[side].generalEntityId`, so
 * `friendly_general` always returns the caster's general, even if that
 * general has moved or been healed.
 */
export function resolveTargetRef(
  ref: TargetRef,
  ctx: ExecCtx,
  state: GameState
): EntityId[] {
  switch (ref.kind) {
    case "self":
      return ctx.sourceEntityId ? [ctx.sourceEntityId] : [];
    case "it":
      return ctx.it ? [ctx.it] : [];
    case "previous_target":
      return ctx.previousTarget ? [ctx.previousTarget] : [];
    case "trigger_source":
      return ctx.triggerSourceId ? [ctx.triggerSourceId] : [];
    case "trigger_victim":
      return ctx.triggerVictimId ? [ctx.triggerVictimId] : [];
    case "friendly_general":
      return [state.players[ctx.actorSide].generalEntityId];
    case "enemy_general": {
      const enemy: Side = (ctx.actorSide === 0 ? 1 : 0) as Side;
      return [state.players[enemy].generalEntityId];
    }
    default: {
      const _exhaust: never = ref;
      void _exhaust;
      return [];
    }
  }
}

/**
 * Resolve a TargetSelector to a list of entityIds.
 *
 * Current scope (driven by the 3 reference cards):
 *  - `self`, `friendly_general`, `enemy_general` — trivial delegates
 *  - `single` with `chooser: "player"` — reads the Action's
 *    `playerChosenTargetId` from the ExecCtx and validates it against
 *    the filter. Returns [] if no match.
 *  - `all` with a unit filter — returns every matching entity.
 *
 * Unsupported selectors throw — the effect interpreter catches and
 * logs via events but does not crash the match.
 */
export function resolveTargetSelector(
  sel: TargetSelector,
  ctx: ExecCtx,
  state: GameState
): EntityId[] {
  switch (sel.kind) {
    case "self":
      return ctx.sourceEntityId ? [ctx.sourceEntityId] : [];
    case "friendly_general":
      return [state.players[ctx.actorSide].generalEntityId];
    case "enemy_general": {
      const enemy: Side = (ctx.actorSide === 0 ? 1 : 0) as Side;
      return [state.players[enemy].generalEntityId];
    }
    case "single": {
      if (sel.chooser !== "player") {
        throw new UnsupportedSelectorError(
          `single-target chooser '${sel.chooser}' not yet implemented`
        );
      }
      const chosenId = ctx.playerChosenTargetId;
      if (!chosenId) return [];
      const entity = findBoardEntity(state, chosenId);
      if (!entity) return [];
      if (!matchesUnitFilter(entity, sel.filter, ctx)) return [];
      return [chosenId];
    }
    case "all": {
      const out: EntityId[] = [];
      for (const entity of Object.values(state.board)) {
        if (matchesUnitFilter(entity, sel.filter, ctx)) {
          out.push(entity.entityId);
        }
      }
      return out;
    }
    case "radius":
    case "line":
    case "nearest":
    case "position_empty":
      throw new UnsupportedSelectorError(
        `selector kind '${sel.kind}' not yet implemented`
      );
    default: {
      const _exhaust: never = sel;
      void _exhaust;
      return [];
    }
  }
}

/**
 * Test whether a board entity matches a UnitFilter.
 *
 * Fields that are undefined in the filter are not checked — an empty
 * filter matches everything. Every declared field must match for the
 * entity to pass.
 */
export function matchesUnitFilter(
  entity: BoardEntity,
  filter: UnitFilter,
  ctx: ExecCtx
): boolean {
  if (filter.controller) {
    if (filter.controller === "self" && entity.card.owner !== ctx.actorSide) {
      return false;
    }
    if (filter.controller === "opponent" && entity.card.owner === ctx.actorSide) {
      return false;
    }
    // "any" always passes.
  }
  if (filter.except === "self" && entity.entityId === ctx.sourceEntityId) {
    return false;
  }
  if (filter.keywords?.has) {
    for (const kw of filter.keywords.has) {
      if (!entity.card.activeKeywords.includes(kw)) return false;
    }
  }
  if (filter.keywords?.lacks) {
    for (const kw of filter.keywords.lacks) {
      if (entity.card.activeKeywords.includes(kw)) return false;
    }
  }
  if (filter.faction && !filter.faction.includes(entity.card.defId as never)) {
    // CardInstance doesn't carry faction at runtime (that's a CardDefinition
    // field). This filter field is a no-op today; implemented properly when
    // the interpreter gets access to the CardRegistry in a follow-up. For
    // now we simply fail to match — authoring that relies on faction filters
    // on runtime instances needs to wait.
    return false;
  }
  if (filter.minStats?.power !== undefined && entity.card.currentPower < filter.minStats.power) {
    return false;
  }
  if (filter.minStats?.health !== undefined && entity.card.currentHealth < filter.minStats.health) {
    return false;
  }
  if (filter.maxStats?.power !== undefined && entity.card.currentPower > filter.maxStats.power) {
    return false;
  }
  if (filter.maxStats?.health !== undefined && entity.card.currentHealth > filter.maxStats.health) {
    return false;
  }
  if (filter.idPrefix && !entity.card.defId.startsWith(filter.idPrefix)) {
    return false;
  }
  return true;
}

export class UnsupportedSelectorError extends Error {
  constructor(message: string) {
    super(`UnsupportedSelectorError: ${message}`);
    this.name = "UnsupportedSelectorError";
  }
}
