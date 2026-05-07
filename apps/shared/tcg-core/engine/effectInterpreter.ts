/**
 * Effect interpreter.
 *
 * Walks an `Effect` tree against the current ExecCtx and mutates an Immer
 * draft of GameState. This is the single chokepoint that turns authored
 * card data into real state changes.
 *
 * Design rules:
 *  - Single entry point: `interpret(effect, ctx, draft, reduceCtx)`.
 *  - Pure recursion: control-flow nodes (`sequence`, `with_target`, `if`,
 *    etc.) call `interpret` back with a derived ExecCtx. The caller is
 *    responsible for propagating `previousTarget` / `it`.
 *  - Non-fatal resolution: unsupported ops throw `UnsupportedOpError`, which
 *    the trigger-queue runner catches and converts into a logged event.
 *    In dev we re-throw so tests surface the issue loudly.
 *  - Every successful primitive emits a GameEvent via `reduceCtx.events`,
 *    so UI/replay can reconstruct what happened without diffing state.
 *
 * Scope today (driven by the 3 reference cards — Antiquarian, Agent Zero,
 * Enigma's Lament):
 *
 *  Primitives
 *    - add_counter
 *    - buff
 *    - grant_keyword
 *    - remove_keyword
 *
 *  Control flow
 *    - sequence
 *    - with_target
 *    - if (uses the condition evaluator)
 *
 * All EffectOp variants in types/Effect.ts have a concrete branch here.
 * UnsupportedOpError is reserved for future ops added to the schema before
 * the interpreter catches up, and is surfaced via the trigger-queue runner
 * as a logged event in production / re-thrown in tests.
 */
import type { Draft } from "immer";
import type { GameState } from "../types/GameState";
import type { Effect, Duration } from "../types/Effect";
import type { ReduceCtx } from "./reducer";
import type { ExecCtx } from "./execCtx";
import type { EntityId, CardDefId } from "../types/Ids";
import type { Buff, Keyword } from "../types/Card";
import { withIt } from "./execCtx";
import { resolveTargetRef, resolveTargetSelector, findBoardEntity } from "./targeting";
import { evaluateCondition } from "./conditions";
import { evaluateAmount } from "./amounts";
import { enqueueCardDrawnTriggers } from "./turn";

// Re-export so reducer.ts + call sites get a single source of truth.
export type { Effect } from "../types/Effect";

/**
 * Maximum recursion depth before the interpreter aborts. Effect trees
 * compose `sequence`, `with_target`, `if`, `foreach`, and `repeat` — a
 * malformed or adversarially-shaped effect could in principle nest
 * arbitrarily. This bound is well above any authored card pattern but
 * stops a runaway from exhausting the JS stack or pinning the server.
 * If a future card legitimately needs more, raise this — but log a
 * warning, because it's almost certainly a bug.
 */
export const MAX_INTERPRET_DEPTH = 64;

export class InterpretDepthExceededError extends Error {
  constructor(public readonly op: string, public readonly depth: number) {
    super(`Effect interpreter exceeded depth ${depth} at op="${op}" (limit ${MAX_INTERPRET_DEPTH}); likely an unbounded recursive effect`);
    this.name = "InterpretDepthExceededError";
  }
}

/**
 * Interpret an effect tree. Mutates the draft via Immer; pushes events
 * into `reduceCtx.events`.
 */
export function interpret(
  effect: Effect,
  ctx: ExecCtx,
  draft: Draft<GameState>,
  reduceCtx: ReduceCtx,
  depth = 0
): void {
  if (depth >= MAX_INTERPRET_DEPTH) {
    throw new InterpretDepthExceededError(effect.op, depth);
  }
  switch (effect.op) {
    /* ─── Control flow ─── */

    case "sequence":
      for (const step of effect.steps) {
        interpret(step, ctx, draft, reduceCtx, depth + 1);
      }
      return;

    case "with_target": {
      const targets = resolveTargetSelector(effect.selector, ctx, draft, reduceCtx.rng);
      if (targets.length === 0) return;
      // For single-target selectors we only iterate the first result.
      // Multi-target aggregation lives on `foreach`.
      const newCtx = withIt(ctx, targets[0]);
      interpret(effect.do, newCtx, draft, reduceCtx, depth + 1);
      return;
    }

    case "if": {
      const branch = evaluateCondition(effect.cond, ctx, draft);
      if (branch) {
        interpret(effect.then, ctx, draft, reduceCtx, depth + 1);
      } else if (effect.else) {
        interpret(effect.else, ctx, draft, reduceCtx, depth + 1);
      }
      return;
    }

    /* ─── Primitives (scope: 3 reference cards) ─── */

    case "add_counter": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const current = entity.card.counters[effect.kind] ?? 0;
        const next = Math.max(0, current + effect.amount);
        entity.card.counters[effect.kind] = next;
        reduceCtx.events.push({
          type: "counter_added",
          targetId: id,
          counterKind: effect.kind,
          delta: effect.amount,
          newValue: next,
        });
      }
      return;
    }

    case "reset_counter": {
      // Explicit zeroing primitive. Replaces the legacy
      // `add_counter amount: -999` workaround which clamps to 0 in
      // add_counter above but breaks silently if a counter ever
      // exceeds 999. The new shape is unambiguous and can't drift.
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const previous = entity.card.counters[effect.counter] ?? 0;
        if (previous === 0) continue;
        entity.card.counters[effect.counter] = 0;
        // Emit counter_added with delta = -previous so existing event
        // consumers (replay, animation) treat it like an add to 0
        // without needing a new event variant.
        reduceCtx.events.push({
          type: "counter_added",
          targetId: id,
          counterKind: effect.counter,
          delta: -previous,
          newValue: 0,
        });
      }
      return;
    }

    case "buff": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const power = effect.stats.power ?? 0;
        const health = effect.stats.health ?? 0;
        entity.card.currentPower += power;
        entity.card.maxHealth += health;
        entity.card.currentHealth += health;
        const expiresAtTurn = expiresAtTurnFor(effect.duration, draft.turnNumber);
        entity.card.buffs = [
          ...entity.card.buffs,
          {
            source: ctx.sourceEntityId ?? "effect",
            powerDelta: power,
            healthDelta: health,
            expiresAtTurn,
          },
        ];
        reduceCtx.events.push({
          type: "buff_applied",
          sourceId: ctx.sourceEntityId ?? "effect",
          targetId: id,
          powerDelta: power,
          healthDelta: health,
          expiresAtTurn,
        });
      }
      return;
    }

    case "grant_keyword": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        if (!entity.card.activeKeywords.includes(effect.keyword)) {
          entity.card.activeKeywords = [
            ...entity.card.activeKeywords,
            effect.keyword,
          ];
        }
        const expiresAtTurn = expiresAtTurnFor(effect.duration, draft.turnNumber);
        reduceCtx.events.push({
          type: "keyword_granted",
          targetId: id,
          keyword: effect.keyword,
          expiresAtTurn,
        });
      }
      return;
    }

    case "remove_keyword": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const before = entity.card.activeKeywords;
        const after = before.filter((k) => k !== effect.keyword);
        if (after.length !== before.length) {
          entity.card.activeKeywords = after;
          reduceCtx.events.push({
            type: "keyword_removed",
            targetId: id,
            keyword: effect.keyword,
          });
        }
      }
      return;
    }

    /* ─── Primitives: damage, heal, draw (new batch) ─── */

    case "deal_damage": {
      const amount = evaluateAmount(effect.amount, ctx, draft);
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const charges = entity.card.counters.forcefield_charges ?? 0;
        if (charges > 0) {
          entity.card.counters.forcefield_charges = charges - 1;
          reduceCtx.events.push({
            type: "damage_dealt",
            sourceId: ctx.sourceEntityId ?? null,
            targetId: id,
            amount,
            absorbed: true,
          });
        } else {
          entity.card.currentHealth -= amount;
          reduceCtx.events.push({
            type: "damage_dealt",
            sourceId: ctx.sourceEntityId ?? null,
            targetId: id,
            amount,
            absorbed: false,
          });
        }
      }
      return;
    }

    case "heal": {
      const amount = evaluateAmount(effect.amount, ctx, draft);
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const before = entity.card.currentHealth;
        entity.card.currentHealth = Math.min(
          entity.card.maxHealth,
          entity.card.currentHealth + amount
        );
        const healed = entity.card.currentHealth - before;
        if (healed > 0) {
          reduceCtx.events.push({
            type: "healed",
            sourceId: ctx.sourceEntityId ?? null,
            targetId: id,
            amount: healed,
          });
        }
      }
      return;
    }

    case "draw": {
      const amount = evaluateAmount(effect.amount, ctx, draft);
      const side = effect.who === "self" ? ctx.actorSide : (ctx.actorSide === 0 ? 1 : 0);
      const player = draft.players[side];
      for (let i = 0; i < amount; i++) {
        if (player.deck.length === 0) {
          reduceCtx.events.push({
            type: "card_burned",
            player: side,
            reason: "deck_empty",
          });
          break;
        }
        const top = player.deck[0];
        player.deck = player.deck.slice(1);
        if (player.hand.length >= 6) {
          player.graveyard = [...player.graveyard, top];
          reduceCtx.events.push({
            type: "card_burned",
            player: side,
            reason: "hand_full",
          });
        } else {
          player.hand = [...player.hand, top];
          reduceCtx.events.push({
            type: "card_drawn",
            player: side,
            cardDefId: top.defId,
            entityId: top.entityId,
          });
          enqueueCardDrawnTriggers(draft, side, top.defId, reduceCtx);
        }
      }
      return;
    }

    case "destroy": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity || entity.isGeneral) continue;
        entity.card.currentHealth = 0;
        // SBA will clean up the 0-HP entity on the next fixed-point pass.
      }
      return;
    }

    case "dispel": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        // Strip all buffs and revert stats to base.
        for (const b of entity.card.buffs) {
          entity.card.currentPower -= b.powerDelta;
          entity.card.maxHealth -= b.healthDelta;
          if (entity.card.currentHealth > entity.card.maxHealth) {
            entity.card.currentHealth = entity.card.maxHealth;
          }
        }
        // Emit keyword_removed for each stripped keyword.
        for (const kw of entity.card.activeKeywords) {
          reduceCtx.events.push({
            type: "keyword_removed",
            targetId: id,
            keyword: kw,
          });
        }
        entity.card.buffs = [];
        entity.card.activeKeywords = [];
        entity.card.counters = {};
        entity.isStunned = false;
      }
      return;
    }

    case "stun": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        entity.isStunned = true;
      }
      return;
    }

    case "debuff": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const power = -(effect.stats.power ?? 0);
        const health = -(effect.stats.health ?? 0);
        entity.card.currentPower += power;
        entity.card.maxHealth += health;
        if (entity.card.currentHealth > entity.card.maxHealth) {
          entity.card.currentHealth = entity.card.maxHealth;
        }
        const expiresAtTurn = expiresAtTurnFor(effect.duration, draft.turnNumber);
        entity.card.buffs = [
          ...entity.card.buffs,
          {
            source: ctx.sourceEntityId ?? "effect",
            powerDelta: power,
            healthDelta: health,
            expiresAtTurn,
          },
        ];
        reduceCtx.events.push({
          type: "buff_applied",
          sourceId: ctx.sourceEntityId ?? "effect",
          targetId: id,
          powerDelta: power,
          healthDelta: health,
          expiresAtTurn,
        });
      }
      return;
    }

    case "summon": {
      // Find an empty tile near the summoner (or at the specified position).
      const posSelector = effect.at;
      let row = 0;
      let col = 0;
      if (posSelector.kind === "specific") {
        row = posSelector.row;
        col = posSelector.col;
      } else if (posSelector.kind === "random_empty") {
        // Find all empty tiles and pick one via RNG.
        const empty: Array<{ row: number; col: number }> = [];
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 9; c++) {
            const k = `${r},${c}`;
            if (!draft.board[k]) empty.push({ row: r, col: c });
          }
        }
        if (empty.length === 0) return;
        const pick = empty[Math.floor(reduceCtx.rng.next() * empty.length)];
        row = pick.row;
        col = pick.col;
      } else {
        // origin_offset: offset from the source entity's position.
        const sourceIds = resolveTargetRef({ kind: "self" }, ctx, draft);
        const sourceEntity = sourceIds.length > 0 ? findBoardEntity(draft, sourceIds[0]) : null;
        if (!sourceEntity) return;
        row = sourceEntity.row + (posSelector.dRow ?? 0);
        col = sourceEntity.col + (posSelector.dCol ?? 0);
      }
      const k = `${row},${col}`;
      if (draft.board[k]) return; // occupied
      if (row < 0 || row >= 5 || col < 0 || col >= 9) return; // OOB
      const side = effect.controller === "self" ? ctx.actorSide : (ctx.actorSide === 0 ? 1 : 0);
      // Mint a new entity for the token.
      const counter = draft.nextEntityCounter;
      draft.nextEntityCounter += 1;
      const entityId = `e_${draft.matchId}_${counter}`;
      const tokenDef = reduceCtx.registry.get(effect.tokenId);
      const tokenCard = {
        entityId: entityId as EntityId,
        defId: effect.tokenId as CardDefId,
        owner: side,
        currentPower: tokenDef?.baseStats?.power ?? 1,
        currentHealth: tokenDef?.baseStats?.health ?? 1,
        maxHealth: tokenDef?.baseStats?.health ?? 1,
        counters: {} as Record<string, number>,
        activeKeywords: (tokenDef?.keywords ? [...tokenDef.keywords] : []) as Keyword[],
        buffs: [] as Buff[],
        flags: {} as Record<string, boolean>,
      };
      draft.board[k] = {
        entityId: entityId as EntityId,
        card: tokenCard,
        row,
        col,
        actionsRemaining: 0,
        hasMoved: true,
        hasAttacked: true,
        isGeneral: false,
        isStunned: false,
      };
      reduceCtx.events.push({
        type: "token_summoned",
        tokenId: effect.tokenId,
        owner: side,
        row,
        col,
        entityId,
      });
      return;
    }

    /* ─── Newly implemented ops ─── */

    case "silence": {
      // Silence = dispel: strip keywords, buffs, counters, unstun.
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        for (const b of entity.card.buffs) {
          entity.card.currentPower -= b.powerDelta;
          entity.card.maxHealth -= b.healthDelta;
          if (entity.card.currentHealth > entity.card.maxHealth) {
            entity.card.currentHealth = entity.card.maxHealth;
          }
        }
        for (const kw of entity.card.activeKeywords) {
          reduceCtx.events.push({ type: "keyword_removed", targetId: id, keyword: kw });
        }
        entity.card.buffs = [];
        entity.card.activeKeywords = [];
        entity.card.counters = {};
        entity.isStunned = false;
      }
      return;
    }

    case "gain_mana": {
      const amount = evaluateAmount(effect.amount, ctx, draft);
      const player = draft.players[ctx.actorSide];
      if (effect.permanent) {
        player.maxMana = Math.min(9, player.maxMana + amount);
      }
      player.mana = Math.min(player.maxMana, player.mana + amount);
      return;
    }

    case "discard": {
      const amount = evaluateAmount(effect.amount, ctx, draft);
      const side = effect.from === "self" ? ctx.actorSide : (ctx.actorSide === 0 ? 1 : 0) as 0 | 1;
      const player = draft.players[side];
      for (let i = 0; i < amount && player.hand.length > 0; i++) {
        let idx: number;
        if (effect.mode === "random") {
          idx = Math.floor(reduceCtx.rng.next() * player.hand.length);
        } else {
          idx = 0; // "choose" falls back to first card for AI
        }
        const discarded = player.hand[idx];
        player.hand = [...player.hand.slice(0, idx), ...player.hand.slice(idx + 1)];
        player.graveyard = [...player.graveyard, discarded];
        reduceCtx.events.push({
          type: "card_discarded",
          player: side,
          entityId: discarded.entityId,
          mode: effect.mode,
        });
      }
      return;
    }

    case "return_to_hand": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity || entity.isGeneral) continue;
        const ownerSide = effect.owner === "self" ? ctx.actorSide : entity.card.owner;
        const owner = draft.players[ownerSide];
        // Remove from board.
        for (const [key, e] of Object.entries(draft.board)) {
          if (e.entityId === id) {
            delete draft.board[key];
            break;
          }
        }
        // Add to hand (or graveyard if hand full).
        if (owner.hand.length < 6) {
          owner.hand = [...owner.hand, entity.card];
        } else {
          owner.graveyard = [...owner.graveyard, entity.card];
        }
      }
      return;
    }

    case "transform": {
      const ids = resolveTargetRef(effect.to, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity || entity.isGeneral) continue;
        const newDef = reduceCtx.registry.get(effect.into);
        if (!newDef) continue;
        // Replace the card data with the new definition's base stats.
        entity.card.defId = effect.into as typeof entity.card.defId;
        entity.card.currentPower = newDef.baseStats?.power ?? 1;
        entity.card.currentHealth = newDef.baseStats?.health ?? 1;
        entity.card.maxHealth = newDef.baseStats?.health ?? 1;
        entity.card.activeKeywords = [...newDef.keywords];
        entity.card.buffs = [];
        entity.card.counters = {};
        entity.card.flags = {};
      }
      return;
    }

    case "foreach": {
      const targets = resolveTargetSelector(effect.over, ctx, draft, reduceCtx.rng);
      for (const targetId of targets) {
        const newCtx = withIt(ctx, targetId);
        interpret(effect.do, newCtx, draft, reduceCtx, depth + 1);
      }
      return;
    }

    case "sacrifice_then": {
      const sacTargets = resolveTargetSelector(effect.sac, ctx, draft, reduceCtx.rng);
      if (sacTargets.length === 0) return;
      // Sacrifice the first resolved target.
      const sacId = sacTargets[0];
      const sacEntity = findBoardEntity(draft, sacId);
      if (sacEntity && !sacEntity.isGeneral) {
        sacEntity.card.currentHealth = 0;
        // SBA will clean up on the next fixed-point pass.
      }
      // Execute the "then" effect.
      interpret(effect.then, ctx, draft, reduceCtx, depth + 1);
      return;
    }

    case "mill": {
      const amount = evaluateAmount(effect.amount, ctx, draft);
      const side = effect.who === "self" ? ctx.actorSide : (ctx.actorSide === 0 ? 1 : 0) as 0 | 1;
      const player = draft.players[side];
      for (let i = 0; i < amount && player.deck.length > 0; i++) {
        const top = player.deck[0];
        player.deck = player.deck.slice(1);
        player.graveyard = [...player.graveyard, top];
      }
      return;
    }

    case "repeat": {
      // Evaluate `times` once at the start; iterations don't re-resolve.
      // For `count_of`, this matches "+1/+1 per ally on deploy" semantics
      // (Governor Thane, Bloodline Inheritor, Ironclad Veteran) — the
      // counted set is the snapshot at trigger time, not after the buff
      // pulses change anything.
      const times = evaluateAmount(effect.times, ctx, draft);
      for (let i = 0; i < times; i++) {
        interpret(effect.do, ctx, draft, reduceCtx, depth + 1);
      }
      return;
    }

    case "teleport": {
      const ids = resolveTargetRef(effect.target, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        const sel = effect.to;
        let row: number;
        let col: number;
        if (sel.kind === "specific") {
          row = sel.row;
          col = sel.col;
        } else if (sel.kind === "random_empty") {
          // The teleporting entity occupies its current tile, so the
          // empty-tile scan naturally excludes it.
          const empty: Array<{ row: number; col: number }> = [];
          for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 9; c++) {
              if (!draft.board[`${r},${c}`]) empty.push({ row: r, col: c });
            }
          }
          if (empty.length === 0) continue;
          const pick = empty[Math.floor(reduceCtx.rng.next() * empty.length)];
          row = pick.row;
          col = pick.col;
        } else {
          // origin_offset for teleport is relative to the entity being
          // teleported (not the spell source) — that is the only mental
          // model in which "offset" makes sense for a destination.
          row = entity.row + sel.dRow;
          col = entity.col + sel.dCol;
        }
        if (row < 0 || row >= 5 || col < 0 || col >= 9) continue;
        const oldKey = `${entity.row},${entity.col}`;
        const newKey = `${row},${col}`;
        if (newKey === oldKey) continue; // already there — no-op
        if (draft.board[newKey]) continue; // occupied
        delete draft.board[oldKey];
        entity.row = row;
        entity.col = col;
        draft.board[newKey] = entity;
        reduceCtx.events.push({
          type: "teleported",
          entityId: id,
          toRow: row,
          toCol: col,
        });
      }
      return;
    }

    case "choose_one": {
      // Player picks a branch; the chosen index rides on ExecCtx, plumbed
      // from the Action via reducer.ts/playCard.ts. Out-of-range or absent
      // index falls back to option 0 — this is the AI / scripted path and
      // also keeps replays from imploding when a malformed action lands.
      if (effect.options.length === 0) return;
      const raw = ctx.chooseIndex ?? 0;
      const idx =
        Number.isInteger(raw) && raw >= 0 && raw < effect.options.length
          ? raw
          : 0;
      // Clear chooseIndex on the way down: nested choose_ones are not yet
      // expressible in card data, but if they ever are, each layer should
      // carry its own choice via Action plumbing rather than inheriting.
      const innerCtx: ExecCtx = { ...ctx, chooseIndex: undefined };
      interpret(effect.options[idx].effect, innerCtx, draft, reduceCtx, depth + 1);
      return;
    }

    case "push": {
      // Resolve once per target. Direction is recomputed per-target so a
      // selector hitting multiple units produces sensible motion (e.g.
      // away_from_source pushes each unit on its own bearing).
      if (effect.distance <= 0) return;
      const ids = resolveTargetRef(effect.target, ctx, draft);
      for (const id of ids) {
        const entity = findBoardEntity(draft, id);
        if (!entity) continue;
        if (entity.isGeneral) continue; // generals don't displace

        const step = pushStep(effect.direction, entity, ctx, draft);
        if (step.dRow === 0 && step.dCol === 0) continue;

        let row = entity.row;
        let col = entity.col;
        let moved = 0;
        for (let i = 0; i < effect.distance; i++) {
          const nextRow = row + step.dRow;
          const nextCol = col + step.dCol;
          if (nextRow < 0 || nextRow >= 5 || nextCol < 0 || nextCol >= 9) break;
          if (draft.board[`${nextRow},${nextCol}`]) break;
          row = nextRow;
          col = nextCol;
          moved += 1;
        }

        if (moved === 0) continue;

        const oldKey = `${entity.row},${entity.col}`;
        const newKey = `${row},${col}`;
        delete draft.board[oldKey];
        entity.row = row;
        entity.col = col;
        draft.board[newKey] = entity;

        reduceCtx.events.push({
          type: "pushed",
          entityId: id,
          toRow: row,
          toCol: col,
          distance: moved,
        });
      }
      return;
    }

    default: {
      // Exhaustiveness: the compiler should reject any missed case above.
      const _exhaust: never = effect as never;
      void _exhaust;
      throw new UnsupportedOpError(
        `unknown effect op: ${JSON.stringify(effect)}`
      );
    }
  }
}

/**
 * Compute the concrete turn number a buff/keyword grant expires at,
 * given its Duration. -1 for permanent, a future turn number otherwise.
 */
function expiresAtTurnFor(duration: Duration, currentTurn: number): number {
  switch (duration.kind) {
    case "permanent":
      return -1;
    case "this_turn":
      return currentTurn;
    case "until_end_of_opponent_turn":
      // Opponent turn ends on the cycle after ours; approximated as
      // currentTurn. Real semantics need more tracking and land with the
      // full turn system port.
      return currentTurn;
    case "n_turns":
      return currentTurn + duration.n;
    default: {
      const _exhaust: never = duration;
      void _exhaust;
      return -1;
    }
  }
}

/**
 * Reduce a DirectionRef to a unit step on the 5×9 grid. Pushes are
 * single-axis: when both components of the resolved vector are non-zero we
 * pick the larger absolute axis (ties go to the column axis, since the
 * board is wider than it is tall and horizontal pressure is the common
 * design idiom). A zero vector — pushing a unit toward itself, or a source
 * occupying the same tile — collapses to a no-op.
 */
function pushStep(
  direction: import("../types/Effect").DirectionRef,
  target: { row: number; col: number },
  ctx: ExecCtx,
  draft: Draft<GameState>
): { dRow: number; dCol: number } {
  let dRow = 0;
  let dCol = 0;
  if (direction.kind === "specific") {
    dRow = direction.dRow;
    dCol = direction.dCol;
  } else if (direction.kind === "away_from_source") {
    if (!ctx.sourceEntityId) return { dRow: 0, dCol: 0 };
    const source = findBoardEntity(draft, ctx.sourceEntityId);
    if (!source) return { dRow: 0, dCol: 0 };
    dRow = target.row - source.row;
    dCol = target.col - source.col;
  } else {
    // toward_friendly_general: friendly is the target's controller's general.
    const targetEntity = (() => {
      for (const e of Object.values(draft.board)) {
        if (e.row === target.row && e.col === target.col) return e;
      }
      return undefined;
    })();
    const ownerSide = targetEntity?.card.owner ?? ctx.actorSide;
    const generalId = draft.players[ownerSide].generalEntityId;
    const general = findBoardEntity(draft, generalId);
    if (!general) return { dRow: 0, dCol: 0 };
    dRow = general.row - target.row;
    dCol = general.col - target.col;
  }
  if (dRow === 0 && dCol === 0) return { dRow: 0, dCol: 0 };
  // Single-axis projection.
  if (Math.abs(dCol) >= Math.abs(dRow)) {
    return { dRow: 0, dCol: Math.sign(dCol) };
  }
  return { dRow: Math.sign(dRow), dCol: 0 };
}

export class UnsupportedOpError extends Error {
  constructor(message: string) {
    super(`UnsupportedOpError: ${message}`);
    this.name = "UnsupportedOpError";
  }
}

