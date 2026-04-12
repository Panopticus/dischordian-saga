/**
 * Campaign AI — pure heuristic-based opponent for story/campaign mode.
 *
 * Unlike the client-side DuelystAI (which returns a full action queue), this
 * AI is a pure function that takes the current GameState + CardRegistry and
 * returns exactly one Action to execute next. The caller invokes it in a
 * loop until it returns `end_turn`.
 *
 * The `difficulty` parameter (0–1) scales how optimal the AI plays:
 *   0 = terrible (random-ish, skips good plays)
 *   1 = optimal  (always picks the best heuristic move)
 *
 * The AI always plays for side 1 (the boss).
 */
import type { GameState, BoardEntity, CardRegistry, PosKey } from "../types/GameState";
import { BOARD_HEIGHT, BOARD_WIDTH, posKey, parsePosKey } from "../types/GameState";
import type { Action } from "../types/Action";
import type { Side } from "../types/Ids";
import type { CardInstance } from "../types/Card";

const AI_SIDE: Side = 1;

/* ═══════════════════════════════════════════════════════
   Public entry point
   ═══════════════════════════════════════════════════════ */

/**
 * Choose a single action for the campaign boss (side 1).
 *
 * Decision priority:
 *   1. Play highest-cost card that can be afforded
 *   2. Attack lowest-HP enemy with any entity that can attack
 *   3. Move idle units toward nearest enemy
 *   4. End turn
 */
export function chooseCampaignAction(
  state: GameState,
  registry: CardRegistry,
  difficulty: number,
): Action {
  const clampedDiff = Math.max(0, Math.min(1, difficulty));
  const seq = state.actionSeq;
  const player = state.players[AI_SIDE];

  // 1. Try to play a card
  const playAction = chooseBestCardPlay(state, registry, player, clampedDiff, seq);
  if (playAction) return playAction;

  // 2. Try to attack
  const attackAction = chooseBestAttack(state, clampedDiff, seq);
  if (attackAction) return attackAction;

  // 3. Try to move toward enemies
  const moveAction = chooseBestMove(state, clampedDiff, seq);
  if (moveAction) return moveAction;

  // 4. Nothing left — end turn
  return { kind: "end_turn", actor: AI_SIDE, seq };
}

/* ═══════════════════════════════════════════════════════
   Card plays
   ═══════════════════════════════════════════════════════ */

interface CardPlayCandidate {
  handIndex: number;
  card: CardInstance;
  row: number;
  col: number;
  cost: number;
}

function chooseBestCardPlay(
  state: GameState,
  registry: CardRegistry,
  player: typeof state.players[0],
  difficulty: number,
  seq: number,
): Action | null {
  const candidates: CardPlayCandidate[] = [];

  for (let i = 0; i < player.hand.length; i++) {
    const card = player.hand[i];
    const def = registry.get(card.defId);
    if (!def) continue;

    const cost = def.cost;
    if (cost > player.mana) continue;

    // Only deploy units/structures — skip spells and artifacts for simplicity
    if (def.cardType !== "unit" && def.cardType !== "structure") continue;

    const tile = findBestDeployTile(state, AI_SIDE);
    if (!tile) continue;

    candidates.push({ handIndex: i, card, row: tile.row, col: tile.col, cost });
  }

  if (candidates.length === 0) return null;

  // Sort by cost descending — play the most expensive card first
  candidates.sort((a, b) => b.cost - a.cost);

  // Difficulty filter: at low difficulty, occasionally skip good plays
  const pick = applyDifficultyFilter(candidates, difficulty);
  if (!pick) return null;

  return {
    kind: "play_card",
    actor: AI_SIDE,
    handIndex: pick.handIndex,
    row: pick.row,
    col: pick.col,
    seq,
  };
}

/**
 * Find an empty tile adjacent to any friendly entity (preferring proximity
 * to the general). This mirrors the engine's adjacency summon rule.
 */
function findBestDeployTile(
  state: GameState,
  side: Side,
): { row: number; col: number } | null {
  const friendlyEntities: BoardEntity[] = [];
  for (const entity of Object.values(state.board)) {
    if (entity.card.owner === side) friendlyEntities.push(entity);
  }
  if (friendlyEntities.length === 0) return null;

  // Find the general for proximity scoring
  const general = friendlyEntities.find((e) => e.isGeneral);
  const anchorRow = general ? general.row : friendlyEntities[0].row;
  const anchorCol = general ? general.col : friendlyEntities[0].col;

  let bestTile: { row: number; col: number } | null = null;
  let bestDist = Infinity;

  for (const entity of friendlyEntities) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = entity.row + dr;
        const nc = entity.col + dc;
        if (nr < 0 || nr >= BOARD_HEIGHT || nc < 0 || nc >= BOARD_WIDTH) continue;
        const key = posKey(nr, nc);
        if (state.board[key]) continue; // tile occupied

        const d = Math.abs(nr - anchorRow) + Math.abs(nc - anchorCol);
        if (d < bestDist) {
          bestDist = d;
          bestTile = { row: nr, col: nc };
        }
      }
    }
  }

  return bestTile;
}

/* ═══════════════════════════════════════════════════════
   Attacks
   ═══════════════════════════════════════════════════════ */

interface AttackCandidate {
  attackerId: string;
  targetId: string;
  targetHp: number;
}

function chooseBestAttack(
  state: GameState,
  difficulty: number,
  seq: number,
): Action | null {
  const candidates: AttackCandidate[] = [];
  const enemySide: Side = 0;

  for (const entity of Object.values(state.board)) {
    if (entity.card.owner !== AI_SIDE) continue;
    if (entity.actionsRemaining <= 0) continue;
    if (entity.hasAttacked) continue;
    if (entity.isStunned) continue;

    // Find adjacent enemies this entity can attack
    const targets = findAdjacentEnemies(state, entity, enemySide);
    for (const target of targets) {
      candidates.push({
        attackerId: entity.entityId,
        targetId: target.entityId,
        targetHp: target.card.currentHealth,
      });
    }
  }

  if (candidates.length === 0) return null;

  // Sort by target HP ascending — attack the lowest-HP enemy first
  candidates.sort((a, b) => a.targetHp - b.targetHp);

  const pick = applyDifficultyFilter(candidates, difficulty);
  if (!pick) return null;

  return {
    kind: "attack",
    actor: AI_SIDE,
    attackerId: pick.attackerId,
    targetId: pick.targetId,
    seq,
  };
}

/**
 * Find all enemy entities adjacent (8-directional) to the given entity.
 * Also includes ranged targets if the entity has the `ranged` keyword.
 */
function findAdjacentEnemies(
  state: GameState,
  attacker: BoardEntity,
  enemySide: Side,
): BoardEntity[] {
  const isRanged = attacker.card.activeKeywords.includes("ranged");
  const results: BoardEntity[] = [];

  for (const entity of Object.values(state.board)) {
    if (entity.card.owner !== enemySide) continue;

    if (isRanged) {
      // Ranged units can attack anything
      results.push(entity);
    } else {
      // Melee: must be adjacent (8-directional)
      const dr = Math.abs(attacker.row - entity.row);
      const dc = Math.abs(attacker.col - entity.col);
      if (dr <= 1 && dc <= 1 && !(dr === 0 && dc === 0)) {
        results.push(entity);
      }
    }
  }

  return results;
}

/* ═══════════════════════════════════════════════════════
   Movement
   ═══════════════════════════════════════════════════════ */

interface MoveCandidate {
  entityId: string;
  toRow: number;
  toCol: number;
  distanceGain: number;
}

function chooseBestMove(
  state: GameState,
  difficulty: number,
  seq: number,
): Action | null {
  const candidates: MoveCandidate[] = [];
  const enemySide: Side = 0;

  // Find nearest enemy position for each of our units
  const enemies: BoardEntity[] = [];
  for (const entity of Object.values(state.board)) {
    if (entity.card.owner === enemySide) enemies.push(entity);
  }
  if (enemies.length === 0) return null;

  for (const entity of Object.values(state.board)) {
    if (entity.card.owner !== AI_SIDE) continue;
    if (entity.hasMoved) continue;
    if (entity.isStunned) continue;
    if (entity.actionsRemaining <= 0) continue;
    if (entity.card.activeKeywords.includes("structure")) continue;

    // Find the nearest enemy to this unit
    let nearestDist = Infinity;
    for (const enemy of enemies) {
      const d = manhattanDist(entity.row, entity.col, enemy.row, enemy.col);
      if (d < nearestDist) nearestDist = d;
    }

    // Try all legal 1-2 tile orthogonal moves (standard movement range)
    const moves = getSimpleMoves(state, entity);
    for (const move of moves) {
      let closestToEnemy = Infinity;
      for (const enemy of enemies) {
        const d = manhattanDist(move.row, move.col, enemy.row, enemy.col);
        if (d < closestToEnemy) closestToEnemy = d;
      }
      const gain = nearestDist - closestToEnemy;
      if (gain > 0) {
        candidates.push({
          entityId: entity.entityId,
          toRow: move.row,
          toCol: move.col,
          distanceGain: gain,
        });
      }
    }
  }

  if (candidates.length === 0) return null;

  // Sort by distance gain descending — move units that get closer first
  candidates.sort((a, b) => b.distanceGain - a.distanceGain);

  const pick = applyDifficultyFilter(candidates, difficulty);
  if (!pick) return null;

  return {
    kind: "move",
    actor: AI_SIDE,
    entityId: pick.entityId,
    toRow: pick.toRow,
    toCol: pick.toCol,
    seq,
  };
}

/**
 * Simplified movement tile search: orthogonal moves up to 2 tiles away,
 * checking only that destination tiles are empty and in bounds.
 * This is a lightweight approximation of the full engine's getValidMoves —
 * we keep the AI decoupled from Immer-based Draft types.
 */
function getSimpleMoves(
  state: GameState,
  entity: BoardEntity,
): Array<{ row: number; col: number }> {
  const results: Array<{ row: number; col: number }> = [];
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // Step-1 and step-2 orthogonal moves
  for (const [dr, dc] of dirs) {
    const r1 = entity.row + dr;
    const c1 = entity.col + dc;
    if (r1 < 0 || r1 >= BOARD_HEIGHT || c1 < 0 || c1 >= BOARD_WIDTH) continue;
    if (!state.board[posKey(r1, c1)]) {
      results.push({ row: r1, col: c1 });
      // Can continue through the empty tile for a 2nd step
      const r2 = r1 + dr;
      const c2 = c1 + dc;
      if (r2 >= 0 && r2 < BOARD_HEIGHT && c2 >= 0 && c2 < BOARD_WIDTH) {
        if (!state.board[posKey(r2, c2)]) {
          results.push({ row: r2, col: c2 });
        }
      }
    }
    // Blocked at step 1 — cannot reach step 2 in that direction
  }

  return results;
}

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

function manhattanDist(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

/**
 * Apply difficulty scaling: at difficulty=1 always pick the best (index 0).
 * At difficulty=0, pick uniformly at random. In between, linearly bias
 * toward the front of the (already sorted best-first) array.
 *
 * Returns null with probability (1 - difficulty) * 0.3 to simulate
 * the AI "forgetting" to take an action at low difficulty.
 */
function applyDifficultyFilter<T>(sorted: T[], difficulty: number): T | null {
  if (sorted.length === 0) return null;

  // At low difficulty, occasionally skip the action entirely
  if (difficulty < 1 && Math.random() > difficulty + 0.3) {
    return null;
  }

  if (difficulty >= 1 || sorted.length === 1) return sorted[0];

  // Weighted random: higher difficulty biases toward index 0
  const bias = difficulty * difficulty; // quadratic curve
  const roll = Math.random();
  if (roll < bias) return sorted[0];

  // Otherwise pick a random candidate
  const idx = Math.floor(Math.random() * sorted.length);
  return sorted[idx];
}
