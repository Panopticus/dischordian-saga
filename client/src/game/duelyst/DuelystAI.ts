/* ═══════════════════════════════════════════════════════
   DUELYST AI — Heuristic-based opponent for single player
   ═══════════════════════════════════════════════════════ */
import type { DuelystGameState, GameAction, BoardUnit, DuelystCard } from "./types";
import { getValidMoves, getValidAttacks, getValidSummonTiles, findUnit, dist } from "./engine";

interface ScoredAction { action: GameAction; score: number; }

export function getAIActions(state: DuelystGameState): GameAction[] {
  const actions: GameAction[] = [];
  const aiPlayer = state.currentPlayer;
  const player = state.players[aiPlayer];

  const cardPlays = scoreCardPlays(state, aiPlayer);
  cardPlays.sort((a, b) => b.score - a.score);
  // Track mana spent to avoid queueing plays we can't afford
  let manaRemaining = player.mana;
  for (const play of cardPlays) {
    if (play.score <= 0) break;
    const card = player.hand[play.action.cardIndex];
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

  if (!player.bloodbornUsed && player.mana >= 1) {
    const bbs = getBBSAction(state, aiPlayer);
    if (bbs) actions.push(bbs);
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

function getBBSAction(state: DuelystGameState, aiPlayer: 0 | 1): GameAction | null {
  const player = state.players[aiPlayer];
  switch (player.faction) {
    case "thought_virus": return { type: "bloodborn_spell" };
    case "new_babylon": {
      const enemy = aiPlayer === 0 ? 1 : 0;
      const targets = [...state.board.values()].filter(u => u.owner === enemy && !u.isGeneral);
      return targets.length > 0 ? { type: "bloodborn_spell" } : null;
    }
    case "dreamer": {
      const friendlies = [...state.board.values()].filter(u => u.owner === aiPlayer && !u.isGeneral);
      return friendlies.length > 0 ? { type: "bloodborn_spell" } : null;
    }
    default: return { type: "bloodborn_spell" };
  }
}

export function getAIMulliganIndices(hand: DuelystCard[]): number[] {
  const indices: number[] = [];
  for (let i = 0; i < hand.length; i++) { if (hand[i].manaCost > 4) indices.push(i); }
  return indices;
}
