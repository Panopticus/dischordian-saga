/**
 * Shared unit deployment pipeline.
 *
 * Called by `handlePlayCard` (for units played from hand) and by any
 * effect that summons a token (`summon` op in the interpreter, once that
 * ships). Centralizes the "put a card instance on the board at (row,col)"
 * logic so every deploy path fires the same events and respects the same
 * invariants:
 *
 *   - Target tile is empty.
 *   - Tile is within board bounds.
 *   - Summon adjacency rule (if not airdrop): must be adjacent (8-way)
 *     to a friendly on-board entity.
 *   - On-deploy triggers are enqueued on the shared trigger queue, so the
 *     reducer's fixed-point loop drains them before control returns to
 *     the player.
 *   - `rush` units start with their action counts intact; everything
 *     else starts exhausted (hasMoved/hasAttacked = true, actions = 0)
 *     so it can't swing the turn it lands.
 *
 * Returns a DeployResult indicating success or a structured DeployError
 * so callers can translate to ReduceError with the correct code.
 */
import type { Draft } from "immer";
import type { GameState, BoardEntity } from "../types/GameState";
import { BOARD_HEIGHT, BOARD_WIDTH, posKey } from "../types/GameState";
import type { CardInstance } from "../types/Card";
import type { EntityId, Side } from "../types/Ids";
import { enqueueTrigger } from "./triggerQueue";
import type { ReduceCtx } from "./reducer";
import type { ConcreteAbility } from "../types/Trigger";

export type DeployErrorCode =
  | "out_of_range"
  | "tile_occupied"
  | "tile_not_adjacent"
  | "unknown_card";

export interface DeployError {
  code: DeployErrorCode;
  message: string;
}

export interface DeployResult {
  ok: boolean;
  entityId?: EntityId;
  error?: DeployError;
}

/**
 * Place a CardInstance onto the board at (row, col). The instance must
 * already exist (minted via init.ts `makeCardInstance` or via `mintEntityId`).
 * The card is NOT automatically removed from the owning player's hand —
 * callers do that before or after as appropriate.
 */
export function deployCard(
  draft: Draft<GameState>,
  card: CardInstance,
  row: number,
  col: number,
  side: Side,
  ctx: ReduceCtx
): DeployResult {
  // Bounds check.
  if (row < 0 || row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH) {
    return {
      ok: false,
      error: {
        code: "out_of_range",
        message: `deploy target (${row},${col}) out of bounds`,
      },
    };
  }

  // Tile occupancy check.
  const key = posKey(row, col);
  if (draft.board[key]) {
    return {
      ok: false,
      error: {
        code: "tile_occupied",
        message: `deploy target (${row},${col}) is already occupied`,
      },
    };
  }

  // Adjacency check (airdrop bypasses it).
  const hasAirdrop = card.activeKeywords.includes("airdrop");
  if (!hasAirdrop && !isAdjacentToFriendly(draft, row, col, side)) {
    return {
      ok: false,
      error: {
        code: "tile_not_adjacent",
        message: `deploy target (${row},${col}) is not adjacent to a friendly entity`,
      },
    };
  }

  // Rush semantics: can act the turn it's summoned.
  const hasRush = card.activeKeywords.includes("rush");
  const hasCelerity = card.activeKeywords.includes("celerity");

  const entity: BoardEntity = {
    entityId: card.entityId,
    card,
    row,
    col,
    actionsRemaining: hasRush ? (hasCelerity ? 2 : 1) : 0,
    hasMoved: !hasRush,
    hasAttacked: !hasRush,
    isGeneral: false,
    isStunned: false,
  };
  draft.board[key] = entity;

  ctx.events.push({
    type: "unit_deployed",
    entityId: entity.entityId,
    cardDefId: card.defId,
    owner: side,
    row,
    col,
  });

  // Enqueue on_deploy triggers. We walk the CardDefinition's abilities
  // in declaration order; each one with an `on_deploy` trigger queues a
  // PendingTrigger. The fixed-point loop drains them before the next
  // action resolves, so opening gambits land atomically.
  const def = ctx.registry.get(card.defId);
  if (def) {
    const abilities = def.abilities as unknown as readonly ConcreteAbility[];
    for (let i = 0; i < abilities.length; i++) {
      const ability = abilities[i];
      if (ability.trigger.kind === "on_deploy") {
        enqueueTrigger(draft, {
          sourceEntityId: entity.entityId,
          sourceOwner: side,
          sourceRow: row,
          sourceCol: col,
          abilityIdx: i,
          context: {
            triggerSourceId: entity.entityId,
          },
        });
      }
    }

    // H2 — rally_buff: on deploy, apply CardDefinition.rallyBuff
    // to every king-adjacent friendly unit (excluding the deploying
    // unit itself and the friendly general — buffs are for line
    // units, not the head of state). The Zod superRefine in
    // cards/schema.ts requires `rallyBuff` to be set when the
    // `rally_buff` keyword is present, so the cast below is safe.
    if (card.activeKeywords.includes("rally_buff")) {
      const rallyBuff = (def as { rallyBuff?: { power: number; health: number } }).rallyBuff
        ?? { power: 1, health: 1 };
      if (rallyBuff.power > 0 || rallyBuff.health > 0) {
        for (const friendly of Object.values(draft.board)) {
          if (friendly.entityId === entity.entityId) continue;
          if (friendly.card.owner !== side) continue;
          if (friendly.isGeneral) continue;
          const dr = Math.abs(friendly.row - row);
          const dc = Math.abs(friendly.col - col);
          if (Math.max(dr, dc) !== 1) continue; // king-adjacency only
          friendly.card.currentPower += rallyBuff.power;
          friendly.card.maxHealth += rallyBuff.health;
          friendly.card.currentHealth += rallyBuff.health;
          friendly.card.buffs = [
            ...friendly.card.buffs,
            {
              source: `rally_buff:${entity.entityId}`,
              powerDelta: rallyBuff.power,
              healthDelta: rallyBuff.health,
              expiresAtTurn: -1, // permanent
            },
          ];
          ctx.events.push({
            type: "buff_applied",
            sourceId: entity.entityId,
            targetId: friendly.entityId,
            powerDelta: rallyBuff.power,
            healthDelta: rallyBuff.health,
            expiresAtTurn: -1,
          });
        }
      }
    }
  }

  // Enqueue on_summoned_near_me triggers on friendly entities within
  // their declared radius of the new deploy. Audit 2026-05 §3.2 lifted
  // the `// reserved` annotation on `on_summoned_near_me` once this
  // hook landed.
  for (const observer of Object.values(draft.board)) {
    if (observer.entityId === entity.entityId) continue;
    if (observer.card.owner !== side) continue;
    const obsDef = ctx.registry.get(observer.card.defId);
    if (!obsDef) continue;
    const obsAbilities = obsDef.abilities as unknown as readonly ConcreteAbility[];
    for (let i = 0; i < obsAbilities.length; i++) {
      const ab = obsAbilities[i];
      if (ab.trigger.kind !== "on_summoned_near_me") continue;
      const dr = Math.abs(observer.row - row);
      const dc = Math.abs(observer.col - col);
      const dist = Math.max(dr, dc); // king-distance
      if (dist > ab.trigger.radius) continue;
      enqueueTrigger(draft, {
        sourceEntityId: observer.entityId,
        sourceOwner: observer.card.owner,
        sourceRow: observer.row,
        sourceCol: observer.col,
        abilityIdx: i,
        context: {
          triggerSourceId: observer.entityId,
          triggerVictimId: entity.entityId,
        },
      });
    }
  }

  return { ok: true, entityId: entity.entityId };
}

/**
 * True if (row, col) has at least one friendly BoardEntity in one of
 * the 8 king-adjacency directions. Used to enforce the "summon next to
 * a friendly" rule. Airdrop bypasses this.
 */
export function isAdjacentToFriendly(
  draft: Draft<GameState>,
  row: number,
  col: number,
  side: Side
): boolean {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr < 0 || nr >= BOARD_HEIGHT || nc < 0 || nc >= BOARD_WIDTH) continue;
      const neighbor = draft.board[posKey(nr, nc)];
      if (neighbor && neighbor.card.owner === side) return true;
    }
  }
  return false;
}
