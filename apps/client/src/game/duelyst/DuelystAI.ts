/* ═══════════════════════════════════════════════════════
   DISCHORDIA AI — Heuristic-based opponent for single player
   ═══════════════════════════════════════════════════════ */
import type { DuelystGameState, GameAction, BoardUnit, DuelystCard } from "./types";
import { getValidMoves, getValidAttacks, getValidSummonTiles, findUnit, dist } from "./engine";

interface ScoredAction { action: GameAction; score: number; }

/**
 * Severe-disadvantage threshold for the AI concede check (PR-4).
 * Named-boss encounters (Warlord / Programmer / Game Master / Seer /
 * Authority) pass `allowConcede: true` so the boss has a dramatic
 * concession moment when the player has clearly won. Sparring and
 * PvP matches pass `allowConcede: false` (or omit the option) so
 * the AI plays to the last HP, which is the standard card-game
 * contract.
 *
 * Conditions for AI concede:
 *   - AI general at ≤ 15% of max health
 *   - Player has ≥ 10 attack power on the board (across all units
 *     + their general) — so the AI is facing a credible lethal
 *     window, not just a lucky spike
 *   - It's the AI's turn start (so the concede lands between turns
 *     rather than mid-action)
 */
export interface AIOptions {
  /** When true, getAIActions may emit `{ type: "concede" }`. */
  allowConcede?: boolean;
}

function aiIsOutclassed(state: DuelystGameState, aiPlayer: 0 | 1): boolean {
  const opponent: 0 | 1 = aiPlayer === 0 ? 1 : 0;
  // state.board is a Map<string, BoardUnit>; iterate values.
  let aiGen: BoardUnit | null = null;
  let oppAttack = 0;
  for (const unit of state.board.values()) {
    if (unit.isGeneral && unit.owner === aiPlayer) aiGen = unit;
    if (unit.owner === opponent) {
      oppAttack += unit.currentAttack;
    }
  }
  if (!aiGen || aiGen.maxHealth <= 0) return false;
  const hpRatio = aiGen.currentHealth / aiGen.maxHealth;
  if (hpRatio > 0.15) return false;
  return oppAttack >= 10;
}

export function getAIActions(
  state: DuelystGameState,
  options: AIOptions = {},
): GameAction[] {
  const aiPlayer = state.currentPlayer;
  // PR-4 — named-boss encounters concede dramatically when the
  // match is out of reach. Skipped for sparring / PvP so the
  // standard contract (AI fights to last HP) holds there.
  if (options.allowConcede && aiIsOutclassed(state, aiPlayer)) {
    return [{ type: "concede" }];
  }
  const actions: GameAction[] = [];
  const player = state.players[aiPlayer];

  const cardPlays = scoreCardPlays(state, aiPlayer);
  cardPlays.sort((a, b) => b.score - a.score);
  // Track mana spent to avoid queueing plays we can't afford
  let manaRemaining = player.mana;
  for (const play of cardPlays) {
    if (play.score <= 0) break;
    const card = player.hand[(play.action as { type: "play_card"; cardIndex: number }).cardIndex];
    if (!card || card.manaCost > manaRemaining) continue;
    manaRemaining -= card.manaCost;
    actions.push(play.action);
  }

  const attacks = scoreAttacks(state, aiPlayer);
  attacks.sort((a, b) => b.score - a.score);
  for (const atk of attacks) { if (atk.score > 0) actions.push(atk.action); }

  const moves = scoreMoves(state, aiPlayer);
  moves.sort((a, b) => b.score - a.score);
  for (const mv of moves.slice(0, 5)) { if (mv.score > 0) actions.push(mv.action); }

  if (!player.replaceUsed && player.hand.length > 0) {
    const worstIdx = findWorstCard(player.hand, player.mana);
    if (worstIdx >= 0) actions.push({ type: "replace_card", cardIndex: worstIdx });
  }

  // Bloodborn spell: score it and insert by priority (before end_turn,
  // after high-value plays). mana >= 1 + not used yet checked here.
  if (!player.bloodbornUsed && player.mana >= 1) {
    const bbs = scoreBBS(state, aiPlayer);
    if (bbs && bbs.score > 0) {
      // Insert before any moves (moves are low-priority, end_turn is last)
      const insertIdx = actions.length;
      actions.splice(insertIdx, 0, bbs.action);
    }
  }

  actions.push({ type: "end_turn" });
  return actions;
}

function scoreCardPlays(state: DuelystGameState, aiPlayer: 0 | 1): ScoredAction[] {
  const player = state.players[aiPlayer];
  const scored: ScoredAction[] = [];
  for (let i = 0; i < player.hand.length; i++) {
    const card = player.hand[i];
    if (card.manaCost > player.mana) continue;
    if (card.cardType === "unit") {
      const tiles = getValidSummonTiles(state, card, aiPlayer);
      if (tiles.length === 0) continue;
      const enemyGen = findEnemyGeneral(state, aiPlayer);
      let bestTile = tiles[0];
      let bestDist = Infinity;
      for (const [r, c] of tiles) {
        const d = enemyGen ? dist(r, c, enemyGen.row, enemyGen.col) : 99;
        if (d < bestDist) { bestDist = d; bestTile = [r, c]; }
      }
      let score = card.attack + card.health + (card.keywords.length * 2);
      if (card.manaCost <= player.mana && card.manaCost >= player.mana - 2) score += 5;
      if (card.keywords.includes("rush")) score += 8;
      if (card.keywords.includes("ranged")) score += 5;
      if (card.keywords.includes("provoke")) score += 4;
      scored.push({ action: { type: "play_card", cardIndex: i, row: bestTile[0], col: bestTile[1] }, score });
    } else if (card.cardType === "spell" && card.spellEffect) {
      const effect = card.spellEffect;
      let score = 0;
      let targetId: string | undefined;
      if (effect.type === "damage") {
        const enemy = aiPlayer === 0 ? 1 : 0;
        const targets = [...state.board.values()].filter(u => u.owner === enemy);
        const killable = targets.filter(u => u.currentHealth <= effect.value);
        if (killable.length > 0) {
          const target = killable.sort((a, b) => b.currentAttack - a.currentAttack)[0];
          targetId = target.id; score = target.currentAttack + target.currentHealth + 10;
        } else if (targets.length > 0) {
          const target = targets.sort((a, b) => a.currentHealth - b.currentHealth)[0];
          targetId = target.id; score = effect.value * 2;
        }
      } else if (effect.type === "heal") {
        const gen = findUnit(state, player.generalId);
        if (gen && gen.currentHealth < gen.maxHealth - effect.value) score = effect.value * 2;
      } else if (effect.type === "buff") {
        const friendlies = [...state.board.values()].filter(u => u.owner === aiPlayer && !u.isGeneral);
        if (friendlies.length > 0) {
          targetId = friendlies.sort((a, b) => b.currentAttack - a.currentAttack)[0].id;
          score = effect.value * 3;
        }
      } else if (effect.type === "draw") { score = effect.value * 3; }
      else if (effect.type === "dispel") {
        const enemy = aiPlayer === 0 ? 1 : 0;
        const buffed = [...state.board.values()].filter(u => u.owner === enemy && u.buffs.length > 0);
        if (buffed.length > 0) { targetId = buffed[0].id; score = 6; }
      }
      if (score > 0) scored.push({ action: { type: "play_card", cardIndex: i, row: 0, col: 0, targetId }, score });
    } else if (card.cardType === "artifact") {
      scored.push({ action: { type: "play_card", cardIndex: i, row: 0, col: 0 }, score: card.attack * 3 + 2 });
    }
  }
  return scored;
}

function scoreAttacks(state: DuelystGameState, aiPlayer: 0 | 1): ScoredAction[] {
  const scored: ScoredAction[] = [];
  for (const [, unit] of state.board) {
    if (unit.owner !== aiPlayer) continue;
    const targets = getValidAttacks(state, unit.id);
    for (const targetId of targets) {
      const target = findUnit(state, targetId);
      if (!target) continue;
      let score = 5;
      if (target.currentHealth <= unit.currentAttack) score += target.currentAttack + target.currentHealth + 15;
      if (target.isGeneral) score += 10;
      if (unit.currentAttack >= target.currentHealth && target.currentAttack < unit.currentHealth) score += 8;
      if (target.currentAttack >= unit.currentHealth && !target.isGeneral) score -= 5;
      scored.push({ action: { type: "attack", attackerId: unit.id, targetId }, score });
    }
  }
  return scored;
}

function scoreMoves(state: DuelystGameState, aiPlayer: 0 | 1): ScoredAction[] {
  const scored: ScoredAction[] = [];
  const enemyGen = findEnemyGeneral(state, aiPlayer);
  if (!enemyGen) return scored;
  for (const [, unit] of state.board) {
    if (unit.owner !== aiPlayer || unit.isGeneral) continue;
    const moves = getValidMoves(state, unit.id);
    for (const [r, c] of moves) {
      const currentD = dist(unit.row, unit.col, enemyGen.row, enemyGen.col);
      const newD = dist(r, c, enemyGen.row, enemyGen.col);
      let score = (currentD - newD) * 3;
      const enemy = aiPlayer === 0 ? 1 : 0;
      for (const [, eu] of state.board) {
        if (eu.owner === enemy && Math.abs(eu.row - r) <= 1 && Math.abs(eu.col - c) <= 1) { score += 5; break; }
      }
      if (score > 0) scored.push({ action: { type: "move", unitId: unit.id, toRow: r, toCol: c }, score });
    }
  }
  return scored;
}

function findEnemyGeneral(state: DuelystGameState, aiPlayer: 0 | 1): BoardUnit | undefined {
  const enemy = aiPlayer === 0 ? 1 : 0;
  return findUnit(state, state.players[enemy].generalId);
}

function findWorstCard(hand: DuelystCard[], currentMana: number): number {
  let worstIdx = -1;
  let worstScore = Infinity;
  for (let i = 0; i < hand.length; i++) {
    if (hand[i].manaCost > currentMana + 2) {
      const score = hand[i].manaCost;
      if (score < worstScore || worstIdx === -1) { worstScore = score; worstIdx = i; }
    }
  }
  return worstIdx;
}

/**
 * Score the Bloodborn spell based on the current board state and the
 * AI's faction. Returns a ScoredAction or null if BBS is not worth
 * using this turn.
 *
 * Scoring heuristics per faction:
 *   architect:      +2 ATK buff is decent if any friendly exists → 8
 *   dreamer:        +1/+1 buff is best when a damaged unit exists → 10
 *   insurgency:     1 damage + draw is always solid → 7
 *   new_babylon:    2 damage to unit, strong if killable targets → 9
 *   antiquarian:    teleport is situational → 6
 *   thought_virus:  3 damage to general is always strong → 12
 */
function scoreBBS(state: DuelystGameState, aiPlayer: 0 | 1): ScoredAction | null {
  const player = state.players[aiPlayer];
  const enemy = aiPlayer === 0 ? 1 : 0;
  const friendlies = [...state.board.values()].filter(u => u.owner === aiPlayer && !u.isGeneral);
  const enemies = [...state.board.values()].filter(u => u.owner === enemy);

  let score = 0;
  switch (player.faction) {
    case "architect":
      score = friendlies.length > 0 ? 8 : 3;
      break;
    case "dreamer":
      score = friendlies.some(u => u.currentHealth < u.maxHealth) ? 10 : 5;
      break;
    case "insurgency":
      score = 7;
      break;
    case "new_babylon":
      score = enemies.filter(u => !u.isGeneral).some(u => u.currentHealth <= 2) ? 12 : 9;
      break;
    case "antiquarian":
      score = friendlies.length > 1 ? 6 : 2;
      break;
    case "thought_virus":
      score = 12;
      break;
    default:
      score = 5;
  }
  return score > 0 ? { action: { type: "bloodborn_spell" }, score } : null;
}

export function getAIMulliganIndices(hand: DuelystCard[]): number[] {
  const indices: number[] = [];
  for (let i = 0; i < hand.length; i++) { if (hand[i].manaCost > 4) indices.push(i); }
  return indices;
}
