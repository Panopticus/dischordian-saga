/* ═══════════════════════════════════════════════════════
   DISCHORDIA LEGACY HELPERS
   Constants, generals data, and pure query functions that the UI layer
   still reads against the legacy DuelystGameState view shape.

   The game engine that used to live in this file (createGameState,
   executeAction, performMulligan, combat, spells, etc.) has been
   replaced by apps/shared/tcg-core and is dispatched through
   TcgClient.ts. What remains here is:

     1. Board constants (BOARD_W, BOARD_H, MAX_HAND, GENERAL_HP)
     2. Utility functions (posKey, parseKey, dist)
     3. GENERALS constant (general definitions for display + faction
        selection UI)
     4. Query helpers (getValidMoves, getValidAttacks,
        getValidSummonTiles, findUnit) — these operate on the
        Map-based DuelystGameState view projected by the
        compat/viewAdapter. They will be replaced by tcg-core's own
        query helpers in a follow-up; for now they keep the UI
        and AI working without a full port.

   All mutation logic is GONE. This file is read-only over game state.
   ═══════════════════════════════════════════════════════ */
import type {
  DuelystGameState, DuelystCard, BoardUnit,
  Faction, GeneralDef,
} from "./types";

/* ─── CONSTANTS ─── */

const BOARD_W = 9;
const BOARD_H = 5;
const MAX_HAND = 6;
const GENERAL_HP = 25;

/* ─── UTILITIES ─── */

function posKey(r: number, c: number): string { return `${r},${c}`; }
function parseKey(k: string): [number, number] {
  const [r, c] = k.split(",").map(Number);
  return [r, c];
}
function dist(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

/* ─── GENERALS ─── */
export const GENERALS: GeneralDef[] = [
  {
    id: "gen_architect", name: "The Architect", faction: "architect",
    attack: 2, health: GENERAL_HP,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/v2_A1Architect_9a200cb7.png",
    loreDescription: "Supreme intelligence of the Artificial Empire. Created by the Programmer (Dr. Daniel Cross), Logos became the Architect — the entity that would reshape reality itself.",
    bloodbornSpell: {
      name: "Neural Override", manaCost: 1,
      description: "Give a friendly unit +2 attack this turn.",
      effect: { type: "buff", value: 2, target: "friendly_unit" },
    },
  },
  {
    id: "gen_dreamer", name: "The Dreamer", faction: "dreamer",
    attack: 2, health: GENERAL_HP,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/v2_N1TheDreamer_1e277d21.png",
    loreDescription: "Visionary leader of the Potentials who dreams new realities into existence.",
    bloodbornSpell: {
      name: "Adaptive Evolution", manaCost: 1,
      description: "Give a friendly unit +1/+1 permanently.",
      effect: { type: "buff", value: 1, target: "friendly_unit" },
    },
  },
  {
    id: "gen_insurgency", name: "Iron Lion", faction: "insurgency",
    attack: 3, health: GENERAL_HP,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/v2_I1IronLion_8d58aeec.png",
    loreDescription: "Unbreakable commander of the Resistance. His iron will inspires armies.",
    bloodbornSpell: {
      name: "Rally the Resistance", manaCost: 1,
      description: "Deal 1 damage to a random enemy and draw a card.",
      effect: { type: "damage", value: 1, target: "random_enemy" },
    },
  },
  {
    id: "gen_new_babylon", name: "Adjudicator Locke", faction: "new_babylon",
    attack: 2, health: GENERAL_HP,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/v2_A12TheHuman_0fff52d8.png",
    loreDescription: "Special Case Manager of New Babylon's Central Control Authority. Traded her left eye for forbidden wisdom. The Syndicate of Death's most enigmatic operative.",
    bloodbornSpell: {
      name: "Dark Bargain", manaCost: 1,
      description: "Deal 2 damage to an enemy unit. If it dies, draw a card.",
      effect: { type: "damage", value: 2, target: "enemy_unit" },
    },
  },
  {
    id: "gen_antiquarian", name: "The Antiquarian", faction: "antiquarian",
    attack: 2, health: GENERAL_HP,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/v2_Z1TheAntiquarian_1b9e74b2.png",
    loreDescription: "The Timekeeper who walks between ages, bending time to his will.",
    bloodbornSpell: {
      name: "Temporal Shift", manaCost: 1,
      description: "Teleport a friendly unit to any unoccupied tile.",
      effect: { type: "teleport", value: 0, target: "friendly_unit" },
    },
  },
  {
    id: "gen_thought_virus", name: "The Source", faction: "thought_virus",
    attack: 2, health: GENERAL_HP,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/v2_TV1TheSource_1eed24b0.png",
    loreDescription: "A sentient infection given form. The Source corrupts all it touches.",
    bloodbornSpell: {
      name: "Plague Bolt", manaCost: 1,
      description: "Deal 3 damage to the enemy general.",
      effect: { type: "damage", value: 3, target: "enemy_general" },
    },
  },
];

/* ─── QUERY HELPERS ───
 *
 * These operate on the legacy DuelystGameState shape (Map-based board,
 * Set-based keywords). They're called by DuelystGameUI and DuelystAI
 * to compute valid moves/attacks/summon tiles for UI highlighting and
 * AI scoring. The view adapter (compat/viewAdapter.ts) produces exactly
 * this shape from the canonical tcg-core state.
 *
 * These will be replaced by tcg-core's own query helpers (which operate
 * on the Record-based canonical state) in a follow-up commit that
 * ports the AI to read the canonical state directly.
 */

export function getValidMoves(state: DuelystGameState, unitId: string): [number, number][] {
  const unit = findUnit(state, unitId);
  if (!unit || unit.hasMoved || unit.isStunned || unit.activeKeywords.has("structure")) return [];
  if (unit.owner !== state.currentPlayer) return [];
  const moves: [number, number][] = [];
  if (unit.activeKeywords.has("flying")) {
    for (let r = 0; r < BOARD_H; r++)
      for (let c = 0; c < BOARD_W; c++)
        if (!state.board.has(posKey(r, c))) moves.push([r, c]);
  } else {
    if (getProvokers(state, unit).length > 0) return [];
    const visited = new Set<string>();
    const queue: [number, number, number][] = [[unit.row, unit.col, 0]];
    visited.add(posKey(unit.row, unit.col));
    while (queue.length > 0) {
      const [r, c, d] = queue.shift()!;
      if (d > 0 && !state.board.has(posKey(r, c))) moves.push([r, c]);
      if (d < 2) {
        for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < BOARD_H && nc >= 0 && nc < BOARD_W && !visited.has(posKey(nr, nc)) && !state.board.has(posKey(nr, nc))) {
            visited.add(posKey(nr, nc));
            queue.push([nr, nc, d + 1]);
          }
        }
      }
    }
  }
  return moves;
}

export function getValidAttacks(state: DuelystGameState, unitId: string): string[] {
  const unit = findUnit(state, unitId);
  if (!unit || unit.hasAttacked || unit.isStunned || unit.activeKeywords.has("structure")) return [];
  if (unit.owner !== state.currentPlayer) return [];
  const enemy = unit.owner === 0 ? 1 : 0;
  const provokers = getProvokers(state, unit);
  if (provokers.length > 0) return provokers.map(p => p.id);
  const targets: string[] = [];
  if (unit.activeKeywords.has("ranged")) {
    for (const [, u] of state.board) if (u.owner === enemy) targets.push(u.id);
  } else {
    for (const [, u] of state.board) {
      if (u.owner === enemy && Math.abs(u.row - unit.row) <= 1 && Math.abs(u.col - unit.col) <= 1) targets.push(u.id);
    }
  }
  return targets;
}

export function getValidSummonTiles(state: DuelystGameState, card: DuelystCard, playerIdx: 0 | 1): [number, number][] {
  const tiles: [number, number][] = [];
  if (card.keywords.includes("airdrop")) {
    for (let r = 0; r < BOARD_H; r++)
      for (let c = 0; c < BOARD_W; c++)
        if (!state.board.has(posKey(r, c))) tiles.push([r, c]);
    return tiles;
  }
  for (const [, u] of state.board) {
    if (u.owner === playerIdx) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = u.row + dr, nc = u.col + dc;
          if (nr >= 0 && nr < BOARD_H && nc >= 0 && nc < BOARD_W && !state.board.has(posKey(nr, nc))) tiles.push([nr, nc]);
        }
    }
  }
  const seen = new Set<string>();
  return tiles.filter(([r, c]) => { const k = posKey(r, c); if (seen.has(k)) return false; seen.add(k); return true; });
}

export function findUnit(state: DuelystGameState, unitId: string): BoardUnit | undefined {
  for (const [, unit] of state.board) if (unit.id === unitId) return unit;
  return undefined;
}

/* ─── PRIVATE HELPERS (used by query functions above) ─── */

function getProvokers(state: DuelystGameState, unit: BoardUnit): BoardUnit[] {
  const enemy = unit.owner === 0 ? 1 : 0;
  const provokers: BoardUnit[] = [];
  for (const [, u] of state.board) {
    if (u.owner === enemy && (u.activeKeywords.has("provoke") || u.activeKeywords.has("taunt")) && Math.abs(u.row - unit.row) <= 1 && Math.abs(u.col - unit.col) <= 1) provokers.push(u);
  }
  return provokers;
}

/* ─── RE-EXPORTS ─── */

export { posKey, parseKey, dist, BOARD_W, BOARD_H, MAX_HAND, GENERAL_HP };
