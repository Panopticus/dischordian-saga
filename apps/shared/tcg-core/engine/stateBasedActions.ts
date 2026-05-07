/**
 * State-based actions (SBA) pass.
 *
 * SBA is the deterministic cleanup phase that runs after every action and
 * after every trigger resolution. It enforces invariants the engine relies
 * on (no entity with <= 0 HP on the board, no expired buffs lingering, a
 * dead general ends the match).
 *
 * Key property: **SBA is run inside a fixed-point loop** by reducer.ts.
 * Each call returns `true` if it mutated the draft, so the caller can re-run
 * the trigger queue + SBA until the state is quiescent. This is how we
 * correctly handle chains like:
 *
 *    AoE → 3 units drop to 0 HP → each fires deathwatch → deathwatch
 *    damage pushes a 4th unit to 0 → and so on.
 *
 * The old `executeAction` in duelyst/engine.ts resolves inline and misses
 * these chains; we fix that here.
 *
 * What SBA does, in order, on every pass:
 *
 *  1. Find all BoardEntities whose currentHealth <= 0, remove them from the
 *     board, move their CardInstance to the owner's graveyard, emit
 *     `unit_destroyed`. Enqueue `on_death` triggers for the dying units and
 *     `on_any_unit_dies` triggers for any watchers.
 *
 *  2. Expire buffs whose `expiresAtTurn` is < current turn. Emit
 *     `buff_expired` and recompute `currentPower` / `maxHealth` on the
 *     owning CardInstance.
 *
 *  3. Check win condition: if either general is dead or has been removed
 *     from the board, mark the match ended with the appropriate winner.
 *
 *  4. Check turn-limit draw (Dischordia's 15-turn survival rule, applied
 *     only when both players are still alive — the draw decision itself
 *     requires more context, so we only *flag* it here and let the end-turn
 *     handler resolve draws).
 *
 * Iteration stops when a pass makes no changes. The loop in
 * reducer.ts#runFixedPoint bounds this to a hard 64-iteration safety cap —
 * 64 is chosen because no sensible card interaction produces more chained
 * deaths than that, but 9*5 = 45 board slots caps the physical possibility.
 */
import type { Draft } from "immer";
import type { GameState, BoardEntity, PlayerState } from "../types/GameState";
import type { ReduceCtx } from "./reducer";
import type { Side } from "../types/Ids";
import type { ConcreteAbility } from "../types/Trigger";
import { enqueueTrigger } from "./triggerQueue";
import { interpret } from "./effectInterpreter";
import type { ExecCtx } from "./execCtx";
import type { Effect } from "../types/Effect";

/** Maximum SBA iterations per fixed-point loop. Defense in depth. */
export const SBA_SAFETY_CAP = 64;

/**
 * Run one SBA pass. Returns `true` if the draft was mutated, `false` if the
 * state was already stable (so the caller knows to stop looping).
 */
export function runStateBasedActions(
  draft: Draft<GameState>,
  ctx: ReduceCtx
): boolean {
  let changed = false;

  // Pass 1 — dead entities on the board. Must iterate over a snapshot of
  // the keys because we mutate `draft.board` inside the loop.
  const deadKeys: string[] = [];
  for (const [key, entity] of Object.entries(draft.board)) {
    if (entity.card.currentHealth <= 0) {
      deadKeys.push(key);
    }
  }
  // Pass 1a — resurrect intercept. Before any death event fires, give
  // dying units with the `resurrect` keyword one chance to spring back
  // to full health. Once resurrected, the entity carries
  // `card.counters.has_resurrected = 1` so it can't loop. Generals
  // never resurrect (their death is the win condition).
  // Audit 2026-05 §3.3 lifted the `// reserved` annotation on
  // `resurrect` once this hook landed and engine/resurrect.test.ts
  // proved it out.
  if (deadKeys.length > 0) {
    const survivors: string[] = [];
    for (const key of deadKeys) {
      const entity = draft.board[key];
      if (entity.isGeneral) continue;
      const aks = entity.card.activeKeywords;
      const hasResurrect = aks.includes("resurrect");
      const hasRebirth = aks.includes("rebirth");
      if (!hasResurrect && !hasRebirth) continue;
      // Both keywords use a counter to prevent looping. resurrect
      // uses `has_resurrected`; rebirth uses `has_rebirthed` — they
      // are independent so a unit with both keywords (none ship
      // today, but the type union allows it) gets one of each.
      const counterKey = hasResurrect ? "has_resurrected" : "has_rebirthed";
      if (entity.card.counters[counterKey] === 1) continue;
      entity.card.counters = {
        ...entity.card.counters,
        [counterKey]: 1,
      };
      entity.card.currentHealth = entity.card.maxHealth;
      ctx.events.push({
        type: "resurrected",
        entityId: entity.entityId,
        atRow: entity.row,
        atCol: entity.col,
      });
      survivors.push(key);
      changed = true;
    }
    if (survivors.length > 0) {
      const surviving = new Set(survivors);
      // Drop survivors from the dead-keys list — they aren't dying.
      for (let i = deadKeys.length - 1; i >= 0; i--) {
        if (surviving.has(deadKeys[i])) deadKeys.splice(i, 1);
      }
    }
  }
  if (deadKeys.length > 0) {
    // Sort by (owner, row, col, entityId) so death event order is
    // deterministic across JS engines and platforms.
    deadKeys.sort((a, b) => {
      const ea = draft.board[a];
      const eb = draft.board[b];
      return (
        ea.card.owner - eb.card.owner ||
        ea.row - eb.row ||
        ea.col - eb.col ||
        (ea.entityId < eb.entityId ? -1 : ea.entityId > eb.entityId ? 1 : 0)
      );
    });
    // Enqueue on_death triggers for each dying entity BEFORE removing
    // them from the board. The defaultTriggerRunner fizzles if the source
    // entity is gone, so on_death must be enqueued while entity still exists.
    for (const key of deadKeys) {
      const entity = draft.board[key];
      if (!entity.isGeneral) {
        enqueuDeathTriggers(draft, entity, ctx);
      }
    }
    // Enqueue on_any_unit_dies watchers — scan all SURVIVING entities.
    const deadEntityIds = new Set(deadKeys.map(k => draft.board[k].entityId));
    for (const entity of Object.values(draft.board)) {
      if (deadEntityIds.has(entity.entityId)) continue; // skip the dying ones
      enqueueDeathwatchTriggers(draft, entity, deadKeys, ctx);
    }
    // Now destroy + remove from board.
    for (const key of deadKeys) {
      const entity = draft.board[key];
      destroyEntity(draft, entity, ctx);
      delete draft.board[key];
    }
    changed = true;
  }

  // Pass 1c — passive auras. Runs after deaths so dying entities
  // don't have their auras applied one final time. For each on-board
  // entity, walk its abilities; every `passive_aura` ability whose
  // `passive_aura_applied:<abilityIdx>` flag is unset has its effect
  // interpreted exactly once and the flag is set. The flag persists
  // for the life of the entity — when the entity dies and is removed
  // from the board, its CardInstance leaves with it, so a fresh
  // summon of the same defId starts unflagged.
  //
  // All current passive_aura consumers use `range: { kind: "self" }`
  // and a permanent `grant_keyword` effect — i.e. "this unit gains
  // X for the rest of its time on the board." The fire-once model
  // is correct for those. Non-self ranges (adjacent / radius / etc.)
  // would need re-evaluation as units enter/leave the range zone;
  // when the first such consumer lands, this pass extends.
  for (const entity of Object.values(draft.board)) {
    const def = ctx.registry.get(entity.card.defId);
    if (!def) continue;
    const abilities = def.abilities as unknown as ConcreteAbility[];
    for (let i = 0; i < abilities.length; i++) {
      if (abilities[i].trigger.kind !== "passive_aura") continue;
      const flagKey = `passive_aura_applied_${i}`;
      if (entity.card.flags[flagKey]) continue;
      // Build a minimal ExecCtx for the effect interpreter and run.
      // We import the interpreter lazily at top-of-call to keep the
      // SBA pass dependency-light at module init.
      runPassiveAura(draft, entity, abilities[i], ctx);
      entity.card.flags[flagKey] = true;
      changed = true;
    }
  }

  // Pass 2 — expired buffs.
  const turn = draft.turnNumber;
  for (const entity of Object.values(draft.board)) {
    const card = entity.card;
    if (card.buffs.length === 0) continue;
    const keep = card.buffs.filter((b) => b.expiresAtTurn < 0 || b.expiresAtTurn >= turn);
    if (keep.length !== card.buffs.length) {
      const expired = card.buffs.filter(
        (b) => b.expiresAtTurn >= 0 && b.expiresAtTurn < turn
      );
      for (const b of expired) {
        card.currentPower -= b.powerDelta;
        card.maxHealth -= b.healthDelta;
        // Heal does not rebound when a +health buff expires; instead, clamp
        // current health to the new (smaller) max.
        if (card.currentHealth > card.maxHealth) {
          card.currentHealth = card.maxHealth;
        }
        ctx.events.push({
          type: "buff_expired",
          targetId: entity.entityId,
          buffSource: b.source,
        });
      }
      card.buffs = keep;
      changed = true;
    }
  }

  // Pass 2b — artifact durability. Remove artifacts whose durability has
  // reached 0. This happens after buff expiry and before win-condition
  // checks so artifact-death triggers (future) can fire before the match
  // ends.
  for (let side = 0; side < 2; side++) {
    const player: PlayerState = draft.players[side as 0 | 1];
    const keep = player.artifacts.filter((a) => a.durability > 0);
    if (keep.length !== player.artifacts.length) {
      const destroyed = player.artifacts.filter((a) => a.durability <= 0);
      for (const a of destroyed) {
        ctx.events.push({
          type: "artifact_destroyed",
          player: side as 0 | 1,
          entityId: a.entityId as string,
          defId: a.defId,
          reason: "durability",
        });
      }
      player.artifacts = keep;
      changed = true;
    }
  }

  // Pass 3 — win condition from generals being dead.
  // A general can die either by being on the dead-keys list above (picked up
  // on the next SBA iteration, because the board has already shifted) or by
  // its hit points reaching <= 0 via ongoing effects. We scan both board
  // entities and the player.generalEntityId lookup.
  if (draft.phase === "playing") {
    const p0Alive = isGeneralAlive(draft, 0);
    const p1Alive = isGeneralAlive(draft, 1);
    if (!p0Alive && !p1Alive) {
      // Simultaneous deaths: the non-active player is declared the winner
      // so that an attacker who lethal's themselves on a counterattack
      // doesn't win by accident. This matches Hearthstone/Duelyst behavior.
      const winner: Side = (draft.currentPlayer === 0 ? 1 : 0) as Side;
      draft.winner = winner;
      draft.winReason = "general_killed";
      draft.phase = "ended";
      ctx.events.push({
        type: "match_ended",
        winner,
        reason: "general_killed",
      });
      changed = true;
    } else if (!p0Alive) {
      draft.winner = 1;
      draft.winReason = "general_killed";
      draft.phase = "ended";
      ctx.events.push({ type: "match_ended", winner: 1, reason: "general_killed" });
      changed = true;
    } else if (!p1Alive) {
      draft.winner = 0;
      draft.winReason = "general_killed";
      draft.phase = "ended";
      ctx.events.push({ type: "match_ended", winner: 0, reason: "general_killed" });
      changed = true;
    }
  }

  return changed;
}

/**
 * Destroy a single board entity: emit the event, move its CardInstance to
 * the owner's graveyard. Does NOT delete the board slot — the caller does
 * that so it can iterate over a snapshot.
 */
function destroyEntity(
  draft: Draft<GameState>,
  entity: BoardEntity,
  ctx: ReduceCtx
): void {
  ctx.events.push({
    type: "unit_destroyed",
    entityId: entity.entityId,
    killerId: null,
  });
  // Generals don't route to graveyard — their death is the win condition,
  // not a card-in-graveyard event.
  if (entity.isGeneral) return;
  const owner: PlayerState = draft.players[entity.card.owner];
  owner.graveyard = [...owner.graveyard, entity.card];
}

/**
 * True if the player's general entity is still on the board with > 0 HP.
 */
/**
 * Apply a single passive_aura ability's effect once. Drives Pass 1c
 * of {@link runStateBasedActions}.
 *
 * Current consumers all use `range: { kind: "self" }` + a permanent
 * grant_keyword. When non-self ranges land, this function expands to
 * resolve in-range targets and bind them to `it` per the existing
 * effect-interpreter conventions.
 */
function runPassiveAura(
  draft: Draft<GameState>,
  entity: BoardEntity,
  ability: ConcreteAbility,
  ctx: ReduceCtx,
): void {
  const ctxExec: ExecCtx = {
    sourceEntityId: entity.entityId,
    actorSide: entity.card.owner,
    it: undefined,
    previousTarget: undefined,
    triggerSourceId: entity.entityId,
    triggerVictimId: undefined,
    chooseIndex: undefined,
    playerChosenTargetId: undefined,
  };
  ctx.events.push({
    type: "trigger_fired",
    sourceId: entity.entityId,
    abilityId: ability.id,
    cause: "passive_aura",
  });
  interpret(ability.effect as unknown as Effect, ctxExec, draft, ctx);
}

/**
 * Enqueue on_death triggers for a dying entity.
 */
function enqueuDeathTriggers(
  draft: Draft<GameState>,
  entity: BoardEntity,
  ctx: ReduceCtx
): void {
  const def = ctx.registry.get(entity.card.defId);
  if (!def) return;
  const abilities = def.abilities as unknown as ConcreteAbility[];
  for (let i = 0; i < abilities.length; i++) {
    if (abilities[i].trigger.kind === "on_death") {
      enqueueTrigger(draft, {
        sourceEntityId: entity.entityId,
        sourceOwner: entity.card.owner,
        sourceRow: entity.row,
        sourceCol: entity.col,
        abilityIdx: i,
        context: { triggerSourceId: entity.entityId },
      });
    }
  }
}

/**
 * Enqueue on_any_unit_dies triggers for a surviving watcher entity.
 */
function enqueueDeathwatchTriggers(
  draft: Draft<GameState>,
  watcher: BoardEntity,
  _deadKeys: string[],
  ctx: ReduceCtx
): void {
  const def = ctx.registry.get(watcher.card.defId);
  if (!def) return;
  const abilities = def.abilities as unknown as ConcreteAbility[];
  for (let i = 0; i < abilities.length; i++) {
    if (abilities[i].trigger.kind === "on_any_unit_dies") {
      enqueueTrigger(draft, {
        sourceEntityId: watcher.entityId,
        sourceOwner: watcher.card.owner,
        sourceRow: watcher.row,
        sourceCol: watcher.col,
        abilityIdx: i,
        context: { triggerSourceId: watcher.entityId },
      });
    }
  }
}

/**
 * Enqueue on_kill triggers for a killer entity after a unit dies.
 * Called externally when combat resolves a kill.
 */
export function enqueueKillTriggers(
  draft: Draft<GameState>,
  killer: BoardEntity,
  ctx: ReduceCtx
): void {
  const def = ctx.registry.get(killer.card.defId);
  if (!def) return;
  const abilities = def.abilities as unknown as ConcreteAbility[];
  for (let i = 0; i < abilities.length; i++) {
    if (abilities[i].trigger.kind === "on_kill") {
      enqueueTrigger(draft, {
        sourceEntityId: killer.entityId,
        sourceOwner: killer.card.owner,
        sourceRow: killer.row,
        sourceCol: killer.col,
        abilityIdx: i,
        context: { triggerSourceId: killer.entityId },
      });
    }
  }
}

function isGeneralAlive(draft: Draft<GameState>, side: Side): boolean {
  const genId = draft.players[side].generalEntityId;
  for (const entity of Object.values(draft.board)) {
    if (entity.entityId === genId) {
      return entity.card.currentHealth > 0 && entity.isGeneral;
    }
  }
  return false;
}
