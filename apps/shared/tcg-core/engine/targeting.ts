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
 * §4.9 Seer "silent re-route" (spec §3.1).
 *
 * When the player targets the Seer's general (side 1) while the
 * Seer has a pending future baked, swap the target for another
 * enemy entity if one exists. This is the canon-consistent way to
 * "the prophecy plays out" — the player's effect still resolves,
 * but it doesn't land on the entity that is about to play the
 * retroactive card.
 *
 * No event is emitted. Spec §3.1: "no UI indication of the
 * re-route". Test visibility comes from asserting state changes on
 * the alternate target, not from a dedicated event stream.
 *
 * Scope: runs only when `state.seerProphecy?.pending` is present
 * AND the actor is side 0 (player). AI / opponent effects are not
 * re-routed — the Seer herself may target her own general, and
 * non-§4.9 matches never enter this branch.
 *
 * Selection order (tuned — was first-found, now lowest-sacrifice):
 *   1. Prefer the lowest-currentHealth non-general enemy unit —
 *      narratively the Seer shields her general by letting her
 *      weakest ally take the hit. Canonically consistent with the
 *      prophecy invariant: the smallest piece of her board is the
 *      one she's willing to spend.
 *   2. Tie-break by lowest currentPower (least threatening), then
 *      by entityId lex order for deterministic replay.
 * The specific pending-future card's own entity (if it's already
 * on the board as some summoned minion) is also de-prioritized so
 * the re-route doesn't land on the thing it's protecting.
 */
function reroutePendingFutureTargets(
  ids: EntityId[],
  ctx: ExecCtx,
  state: GameState,
): EntityId[] {
  const pending = state.seerProphecy?.pending;
  if (!pending) return ids;
  if (ctx.actorSide !== 0) return ids;
  const seerGeneralId = state.players[1].generalEntityId;
  if (!ids.includes(seerGeneralId)) return ids;

  const candidates: BoardEntity[] = [];
  for (const entity of Object.values(state.board)) {
    if (entity.card.owner !== 1) continue;
    if (entity.entityId === seerGeneralId) continue;
    candidates.push(entity);
  }
  if (candidates.length === 0) return ids;

  // Rank candidates: (prefers-not-pending-future, health, power, id).
  // Lower is better on each key — we pick candidates[0] after sort.
  candidates.sort((a, b) => {
    const aIsPending = a.card.defId === pending.cardDefId ? 1 : 0;
    const bIsPending = b.card.defId === pending.cardDefId ? 1 : 0;
    if (aIsPending !== bIsPending) return aIsPending - bIsPending;
    if (a.card.currentHealth !== b.card.currentHealth) {
      return a.card.currentHealth - b.card.currentHealth;
    }
    if (a.card.currentPower !== b.card.currentPower) {
      return a.card.currentPower - b.card.currentPower;
    }
    return a.entityId < b.entityId ? -1 : a.entityId > b.entityId ? 1 : 0;
  });

  const alt: EntityId = candidates[0].entityId;
  return ids.map((id) => (id === seerGeneralId ? alt : id));
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
  const ids = resolveTargetRefRaw(ref, ctx, state);
  return reroutePendingFutureTargets(ids, ctx, state);
}

function resolveTargetRefRaw(
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
  const ids = resolveTargetSelectorRaw(sel, ctx, state);
  return reroutePendingFutureTargets(ids, ctx, state);
}

function resolveTargetSelectorRaw(
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
    case "radius": {
      const origin = resolveOrigin(sel.origin, ctx, state);
      if (!origin) return [];
      const out: EntityId[] = [];
      for (const entity of Object.values(state.board)) {
        const dr = Math.abs(entity.row - origin.row);
        const dc = Math.abs(entity.col - origin.col);
        if (Math.max(dr, dc) > sel.radius) continue;
        if (!matchesUnitFilter(entity, sel.filter, ctx)) continue;
        out.push(entity.entityId);
      }
      return out;
    }
    case "line": {
      const origin = resolveOrigin(sel.origin, ctx, state);
      if (!origin) return [];
      const [dr, dc] = directionToDelta(sel.direction);
      const out: EntityId[] = [];
      for (let step = 1; step <= sel.length; step++) {
        const r = origin.row + dr * step;
        const c = origin.col + dc * step;
        const entity = state.board[`${r},${c}`];
        if (!entity) continue;
        if (!matchesUnitFilter(entity, sel.filter, ctx)) continue;
        out.push(entity.entityId);
      }
      return out;
    }
    case "nearest": {
      const origin = resolveOrigin(sel.from, ctx, state);
      if (!origin) return [];
      let best: { dist: number; id: EntityId } | null = null;
      for (const entity of Object.values(state.board)) {
        if (!matchesUnitFilter(entity, sel.filter, ctx)) continue;
        const dr = Math.abs(entity.row - origin.row);
        const dc = Math.abs(entity.col - origin.col);
        const dist = Math.max(dr, dc);
        if (best === null || dist < best.dist) {
          best = { dist, id: entity.entityId };
        }
      }
      return best ? [best.id] : [];
    }
    case "position_empty": {
      // Returns the entityIds of "virtual" empty-tile placeholders is
      // not the right model — empty tiles aren't entities. Effects
      // that consume position_empty (e.g. summon) read positions
      // directly from the constraint, NOT entity ids. Returning [] is
      // the correct contract here; consumers that meaningfully want
      // a tile go through PositionSelector instead. Audit Phase J4.
      return [];
    }
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

/* ─── Phase J4 helpers — origin + direction resolution ─── */

import type { OriginSelector, Direction } from "../types/Targeting";

function resolveOrigin(
  o: OriginSelector,
  ctx: ExecCtx,
  state: GameState,
): { row: number; col: number } | null {
  switch (o.kind) {
    case "self": {
      if (!ctx.sourceEntityId) return null;
      const e = findBoardEntity(state, ctx.sourceEntityId);
      return e ? { row: e.row, col: e.col } : null;
    }
    case "trigger_source": {
      const id = ctx.triggerSourceId ?? ctx.sourceEntityId;
      if (!id) return null;
      const e = findBoardEntity(state, id);
      return e ? { row: e.row, col: e.col } : null;
    }
    case "trigger_victim": {
      const id = ctx.triggerVictimId;
      if (!id) return null;
      const e = findBoardEntity(state, id);
      return e ? { row: e.row, col: e.col } : null;
    }
    case "friendly_general": {
      const generalId = state.players[ctx.actorSide].generalEntityId;
      const e = findBoardEntity(state, generalId);
      return e ? { row: e.row, col: e.col } : null;
    }
    case "enemy_general": {
      const enemySide = ctx.actorSide === 0 ? 1 : 0;
      const generalId = state.players[enemySide].generalEntityId;
      const e = findBoardEntity(state, generalId);
      return e ? { row: e.row, col: e.col } : null;
    }
    case "last_target": {
      const id = ctx.previousTarget;
      if (!id) return null;
      const e = findBoardEntity(state, id);
      return e ? { row: e.row, col: e.col } : null;
    }
    default: {
      const _exhaust: never = o;
      void _exhaust;
      return null;
    }
  }
}

function directionToDelta(d: Direction): [number, number] {
  switch (d) {
    case "up":    return [-1, 0];
    case "down":  return [ 1, 0];
    case "left":  return [ 0, -1];
    case "right": return [ 0, 1];
    default: {
      const _exhaust: never = d;
      void _exhaust;
      return [0, 0];
    }
  }
}
