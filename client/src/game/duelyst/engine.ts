/* ═══════════════════════════════════════════════════════
   DUELYST ENGINE — Core game logic
   5×9 tactical board, mana ramping, movement, combat,
   card playing, artifacts, bloodborn spells
   ═══════════════════════════════════════════════════════ */
import type {
  DuelystGameState, DuelystCard, DuelystPlayer, BoardUnit,
  GameAction, Buff, DuelystKeyword, Faction,
  GeneralDef, SpellEffect,
} from "./types";

const BOARD_W = 9;
const BOARD_H = 5;
const MAX_HAND = 6;
const MAX_MANA = 9;
const STARTING_MANA = 2;
const GENERAL_HP = 25;

function posKey(r: number, c: number): string { return `${r},${c}`; }
function parseKey(k: string): [number, number] {
  const [r, c] = k.split(",").map(Number);
  return [r, c];
}
function dist(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}
let _uid = 0;
function uid(): string { return `u_${++_uid}_${Date.now()}`; }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── GENERALS ─── */
export const GENERALS: GeneralDef[] = [
  {
    id: "gen_architect", name: "The Architect", faction: "architect",
    attack: 2, health: GENERAL_HP,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/v2_A1Architect_9a200cb7.png",
    loreDescription: "Master designer of the AI Empire's grand blueprint. His neural network spans galaxies.",
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
    id: "gen_new_babylon", name: "The Human", faction: "new_babylon",
    attack: 2, health: GENERAL_HP,
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/v2_A12TheHuman_0fff52d8.png",
    loreDescription: "Dark authority of New Babylon's Syndicate of Death. Commands fear itself.",
    bloodbornSpell: {
      name: "Death's Embrace", manaCost: 1,
      description: "Deal 2 damage to an enemy unit.",
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

export function getGeneral(faction: Faction): GeneralDef {
  return GENERALS.find(g => g.faction === faction) || GENERALS[0];
}

/* ─── CREATE GAME STATE ─── */
export function createGameState(
  p1Faction: Faction, p1Deck: DuelystCard[],
  p2Faction: Faction, p2Deck: DuelystCard[],
): DuelystGameState {
  _uid = 0;
  const board = new Map<string, BoardUnit>();

  const g1 = getGeneral(p1Faction);
  const g1Unit = createBoardUnit(genAsCard(g1), 0, 2, 0, true);
  board.set(posKey(2, 0), g1Unit);

  const g2 = getGeneral(p2Faction);
  const g2Unit = createBoardUnit(genAsCard(g2), 1, 2, 8, true);
  board.set(posKey(2, 8), g2Unit);

  const deck1 = shuffle([...p1Deck]);
  const deck2 = shuffle([...p2Deck]);
  const hand1 = deck1.splice(0, 5);
  const hand2 = deck2.splice(0, 5);

  return {
    board,
    players: [
      { faction: p1Faction, generalId: g1Unit.id, deck: deck1, hand: hand1, mana: STARTING_MANA, maxMana: STARTING_MANA, artifacts: [], bloodbornUsed: false, replaceUsed: false },
      { faction: p2Faction, generalId: g2Unit.id, deck: deck2, hand: hand2, mana: STARTING_MANA, maxMana: STARTING_MANA, artifacts: [], bloodbornUsed: false, replaceUsed: false },
    ],
    currentPlayer: 0,
    turnNumber: 1,
    phase: "mulligan",
    winner: null,
    actionLog: [],
    boardWidth: BOARD_W,
    boardHeight: BOARD_H,
  };
}

function genAsCard(g: GeneralDef): DuelystCard {
  return {
    id: g.id, name: g.name, faction: g.faction,
    cardType: "general", rarity: "legendary", manaCost: 0,
    attack: g.attack, health: g.health, keywords: [],
    abilityText: g.bloodbornSpell.description,
    flavorText: g.loreDescription, imageUrl: g.imageUrl,
  };
}

function createBoardUnit(card: DuelystCard, owner: 0 | 1, row: number, col: number, isGeneral: boolean): BoardUnit {
  return {
    id: uid(), card, owner, row, col,
    currentAttack: card.attack, currentHealth: card.health, maxHealth: card.health,
    hasMoved: false, hasAttacked: false,
    actionsRemaining: card.keywords.includes("celerity") ? 2 : 1,
    activeKeywords: new Set(card.keywords),
    buffs: [], isGeneral, isStunned: false,
    forcefieldActive: card.keywords.includes("forcefield"),
    growAmount: card.keywords.includes("grow") ? 1 : undefined,
    backstabDamage: card.keywords.includes("backstab") ? 2 : undefined,
  };
}

/* ─── MULLIGAN ─── */
export function performMulligan(state: DuelystGameState, playerIdx: 0 | 1, replaceIndices: number[]): DuelystGameState {
  const player = state.players[playerIdx];
  const newHand = [...player.hand];
  const newDeck = [...player.deck];
  for (const idx of replaceIndices.sort((a, b) => b - a)) {
    if (idx >= 0 && idx < newHand.length) {
      const removed = newHand.splice(idx, 1)[0];
      newDeck.push(removed);
    }
  }
  const shuffled = shuffle(newDeck);
  const needed = 5 - newHand.length;
  const drawn = shuffled.splice(0, needed);
  newHand.push(...drawn);
  const newPlayers = [...state.players] as [DuelystPlayer, DuelystPlayer];
  newPlayers[playerIdx] = { ...player, hand: newHand, deck: shuffled };
  return { ...state, players: newPlayers };
}

export function finishMulligan(state: DuelystGameState): DuelystGameState {
  return { ...state, phase: "playing" };
}

/* ─── VALID MOVES ─── */
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

/* ─── VALID ATTACKS ─── */
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

/* ─── VALID SUMMON TILES ─── */
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

/* ─── EXECUTE ACTION ─── */
export function executeAction(state: DuelystGameState, action: GameAction): DuelystGameState {
  let s = deepCloneState(state);
  switch (action.type) {
    case "move": s = doMove(s, action.unitId, action.toRow, action.toCol); break;
    case "attack": s = doAttack(s, action.attackerId, action.targetId); break;
    case "play_card": s = doPlayCard(s, action.cardIndex, action.row, action.col, action.targetId); break;
    case "replace_card": s = doReplaceCard(s, action.cardIndex); break;
    case "bloodborn_spell": s = doBloodbornSpell(s, action.targetRow, action.targetCol); break;
    case "end_turn": s = doEndTurn(s); break;
  }
  return checkWinCondition(s);
}

function doMove(state: DuelystGameState, unitId: string, toRow: number, toCol: number): DuelystGameState {
  const unit = findUnit(state, unitId);
  if (!unit) return state;
  state.board.delete(posKey(unit.row, unit.col));
  unit.row = toRow; unit.col = toCol; unit.hasMoved = true;
  state.board.set(posKey(toRow, toCol), unit);
  if (unit.activeKeywords.has("infiltrate")) unit.infiltrateActive = unit.owner === 0 ? toCol >= 5 : toCol <= 3;
  addLog(state, "move", `${unit.card.name} moved to (${toRow},${toCol})`);
  return state;
}

function doAttack(state: DuelystGameState, attackerId: string, targetId: string): DuelystGameState {
  const attacker = findUnit(state, attackerId);
  const target = findUnit(state, targetId);
  if (!attacker || !target) return state;
  let atkDmg = attacker.currentAttack;
  if (attacker.backstabDamage && isAttackingFromBehind(attacker, target)) atkDmg += attacker.backstabDamage;
  if (attacker.infiltrateActive) atkDmg += 2;
  if (attacker.activeKeywords.has("zeal") && isNearGeneral(state, attacker)) atkDmg += 2;
  let targetDmg = atkDmg;
  if (target.forcefieldActive) { targetDmg = 0; target.forcefieldActive = false; }
  target.currentHealth -= targetDmg;
  if (!attacker.activeKeywords.has("ranged") && target.currentHealth > 0) {
    let strikeDmg = target.currentAttack;
    if (attacker.forcefieldActive) { strikeDmg = 0; attacker.forcefieldActive = false; }
    attacker.currentHealth -= strikeDmg;
  }
  if (attacker.activeKeywords.has("frenzy")) {
    const enemy = attacker.owner === 0 ? 1 : 0;
    for (const [, u] of state.board) {
      if (u.owner === enemy && u.id !== target.id && Math.abs(u.row - target.row) <= 1 && Math.abs(u.col - target.col) <= 1) {
        if (u.forcefieldActive) u.forcefieldActive = false; else u.currentHealth -= atkDmg;
      }
    }
  }
  if (attacker.activeKeywords.has("blast")) {
    const enemy = attacker.owner === 0 ? 1 : 0;
    const dir = attacker.owner === 0 ? 1 : -1;
    for (let c = attacker.col + dir; c >= 0 && c < BOARD_W; c += dir) {
      const u = state.board.get(posKey(attacker.row, c));
      if (u && u.owner === enemy && u.id !== target.id) {
        if (u.forcefieldActive) u.forcefieldActive = false; else u.currentHealth -= atkDmg;
      }
    }
  }
  attacker.hasAttacked = true;
  attacker.actionsRemaining--;
  if (attacker.actionsRemaining <= 0) attacker.hasMoved = true;
  if (target.isGeneral) {
    const defPlayer = state.players[target.owner];
    defPlayer.artifacts = defPlayer.artifacts.filter(a => { a.durability--; return a.durability > 0; });
  }
  addLog(state, "attack", `${attacker.card.name} attacked ${target.card.name} for ${targetDmg}`);
  return removeDeadUnits(state);
}

function doPlayCard(state: DuelystGameState, cardIndex: number, row: number, col: number, targetId?: string): DuelystGameState {
  const player = state.players[state.currentPlayer];
  if (cardIndex < 0 || cardIndex >= player.hand.length) return state;
  const card = player.hand[cardIndex];
  if (player.mana < card.manaCost) return state;
  player.mana -= card.manaCost;
  player.hand.splice(cardIndex, 1);
  switch (card.cardType) {
    case "unit": {
      const unit = createBoardUnit(card, state.currentPlayer, row, col, false);
      state.board.set(posKey(row, col), unit);
      if (!unit.activeKeywords.has("rush")) { unit.hasMoved = true; unit.hasAttacked = true; }
      if (unit.activeKeywords.has("opening_gambit") && card.spellEffect) {
        state = applySpellEffect(state, card.spellEffect, state.currentPlayer, row, col, targetId);
      }
      addLog(state, "summon", `${card.name} summoned at (${row},${col})`);
      break;
    }
    case "spell": {
      if (card.spellEffect) state = applySpellEffect(state, card.spellEffect, state.currentPlayer, row, col, targetId);
      addLog(state, "spell", `${card.name} cast`);
      break;
    }
    case "artifact": {
      player.artifacts.push({ card, durability: card.artifactDurability || 3 });
      const general = findUnit(state, player.generalId);
      if (general && card.attack > 0) {
        general.currentAttack += card.attack;
        general.buffs.push({ attackMod: card.attack, healthMod: 0, source: card.name });
      }
      addLog(state, "artifact", `${card.name} equipped`);
      break;
    }
  }
  return removeDeadUnits(state);
}

function doReplaceCard(state: DuelystGameState, cardIndex: number): DuelystGameState {
  const player = state.players[state.currentPlayer];
  if (player.replaceUsed || cardIndex < 0 || cardIndex >= player.hand.length || player.deck.length === 0) return state;
  const removed = player.hand.splice(cardIndex, 1)[0];
  player.deck.push(removed);
  player.deck = shuffle(player.deck);
  const drawn = player.deck.shift();
  if (drawn) player.hand.push(drawn);
  player.replaceUsed = true;
  addLog(state, "replace", `Replaced a card`);
  return state;
}

function doBloodbornSpell(state: DuelystGameState, targetRow?: number, targetCol?: number): DuelystGameState {
  const player = state.players[state.currentPlayer];
  if (player.bloodbornUsed) return state;
  const general = getGeneral(player.faction);
  const bbs = general.bloodbornSpell;
  if (player.mana < bbs.manaCost) return state;
  player.mana -= bbs.manaCost;
  player.bloodbornUsed = true;
  state = applySpellEffect(state, bbs.effect, state.currentPlayer, targetRow ?? 0, targetCol ?? 0);
  if (player.faction === "insurgency" && player.deck.length > 0 && player.hand.length < MAX_HAND) {
    const drawn = player.deck.shift();
    if (drawn) player.hand.push(drawn);
  }
  addLog(state, "bloodborn", `Used ${bbs.name}`);
  return removeDeadUnits(state);
}

function doEndTurn(state: DuelystGameState): DuelystGameState {
  for (const [, unit] of state.board) {
    unit.buffs = unit.buffs.filter(b => {
      if (b.temporary) { unit.currentAttack -= b.attackMod; unit.currentHealth -= b.healthMod; unit.maxHealth -= b.healthMod; return false; }
      return true;
    });
  }
  const nextPlayer = (state.currentPlayer === 0 ? 1 : 0) as 0 | 1;
  const newTurn = nextPlayer === 0 ? state.turnNumber + 1 : state.turnNumber;
  const np = state.players[nextPlayer];
  np.maxMana = Math.min(MAX_MANA, np.maxMana + 1);
  np.mana = np.maxMana;
  np.bloodbornUsed = false;
  np.replaceUsed = false;
  if (np.deck.length > 0 && np.hand.length < MAX_HAND) { const drawn = np.deck.shift(); if (drawn) np.hand.push(drawn); }
  for (const [, unit] of state.board) {
    if (unit.owner === nextPlayer) {
      unit.hasMoved = false; unit.hasAttacked = false;
      unit.actionsRemaining = unit.activeKeywords.has("celerity") ? 2 : 1;
      unit.isStunned = false; unit.forcefieldActive = unit.activeKeywords.has("forcefield");
      if (unit.growAmount) { unit.currentAttack += unit.growAmount; unit.currentHealth += unit.growAmount; unit.maxHealth += unit.growAmount; }
    }
  }
  state.currentPlayer = nextPlayer;
  state.turnNumber = newTurn;
  addLog(state, "end_turn", `Turn ${state.turnNumber} — Player ${nextPlayer + 1}`);
  return state;
}

/* ─── SPELL EFFECTS ─── */
function applySpellEffect(state: DuelystGameState, effect: SpellEffect, caster: 0 | 1, row: number, col: number, targetId?: string): DuelystGameState {
  const enemy = caster === 0 ? 1 : 0;
  switch (effect.type) {
    case "damage": {
      if (effect.target === "random_enemy") {
        const enemies = [...state.board.values()].filter(u => u.owner === enemy);
        if (enemies.length > 0) applyDamage(enemies[Math.floor(Math.random() * enemies.length)], effect.value);
      } else if (effect.target === "enemy_general") {
        const gen = findUnit(state, state.players[enemy].generalId);
        if (gen) applyDamage(gen, effect.value);
      } else if (effect.target === "all_enemies") {
        for (const [, u] of state.board) if (u.owner === enemy) applyDamage(u, effect.value);
      } else if (targetId) {
        const t = findUnit(state, targetId); if (t) applyDamage(t, effect.value);
      } else {
        const t = state.board.get(posKey(row, col)); if (t && t.owner === enemy) applyDamage(t, effect.value);
      }
      break;
    }
    case "heal": {
      if (effect.target === "friendly_general") {
        const gen = findUnit(state, state.players[caster].generalId);
        if (gen) gen.currentHealth = Math.min(gen.maxHealth, gen.currentHealth + effect.value);
      } else if (effect.target === "all_friendlies") {
        for (const [, u] of state.board) if (u.owner === caster) u.currentHealth = Math.min(u.maxHealth, u.currentHealth + effect.value);
      } else if (targetId) {
        const t = findUnit(state, targetId); if (t) t.currentHealth = Math.min(t.maxHealth, t.currentHealth + effect.value);
      }
      break;
    }
    case "buff": {
      if (targetId) {
        const t = findUnit(state, targetId);
        if (t) { t.currentAttack += effect.value; t.currentHealth += effect.value; t.maxHealth += effect.value; t.buffs.push({ attackMod: effect.value, healthMod: effect.value, source: "spell" }); }
      }
      break;
    }
    case "draw": {
      const p = state.players[caster];
      for (let i = 0; i < effect.value && p.deck.length > 0 && p.hand.length < MAX_HAND; i++) { const drawn = p.deck.shift(); if (drawn) p.hand.push(drawn); }
      break;
    }
    case "dispel": {
      if (targetId) {
        const t = findUnit(state, targetId);
        if (t) { t.activeKeywords.clear(); t.buffs = []; t.currentAttack = t.card.attack; t.currentHealth = Math.min(t.currentHealth, t.card.health); t.maxHealth = t.card.health; t.isStunned = false; t.forcefieldActive = false; t.growAmount = undefined; t.backstabDamage = undefined; t.infiltrateActive = false; }
      }
      break;
    }
    case "destroy": {
      if (targetId) { const t = findUnit(state, targetId); if (t && !t.isGeneral) t.currentHealth = 0; }
      break;
    }
    case "teleport": {
      if (targetId) {
        const t = findUnit(state, targetId);
        if (t && !state.board.has(posKey(row, col))) { state.board.delete(posKey(t.row, t.col)); t.row = row; t.col = col; state.board.set(posKey(row, col), t); }
      }
      break;
    }
    case "aoe_damage": {
      const radius = effect.radius || 1;
      for (const [, u] of state.board) if (u.owner === enemy && dist(u.row, u.col, row, col) <= radius) applyDamage(u, effect.value);
      break;
    }
    case "aoe_buff": {
      const radius = effect.radius || 1;
      for (const [, u] of state.board) if (u.owner === caster && dist(u.row, u.col, row, col) <= radius) { u.currentAttack += effect.value; u.currentHealth += effect.value; u.maxHealth += effect.value; }
      break;
    }
    case "summon": {
      if (!state.board.has(posKey(row, col))) {
        const token: DuelystCard = { id: `token_${uid()}`, name: "Summoned Entity", faction: state.players[caster].faction, cardType: "unit", rarity: "basic", manaCost: 0, attack: effect.value, health: effect.value, keywords: [], abilityText: "", flavorText: "", imageUrl: "" };
        const unit = createBoardUnit(token, caster, row, col, false);
        unit.hasMoved = true; unit.hasAttacked = true;
        state.board.set(posKey(row, col), unit);
      }
      break;
    }
  }
  if (effect.secondaryEffect) state = applySpellEffect(state, effect.secondaryEffect, caster, row, col, targetId);
  return state;
}

function applyDamage(unit: BoardUnit, dmg: number): void {
  if (unit.forcefieldActive) { unit.forcefieldActive = false; return; }
  unit.currentHealth -= dmg;
}

function removeDeadUnits(state: DuelystGameState): DuelystGameState {
  const toRemove: string[] = [];
  for (const [key, unit] of state.board) {
    if (unit.currentHealth <= 0) {
      if (unit.activeKeywords.has("dying_wish") && unit.card.spellEffect) state = applySpellEffect(state, unit.card.spellEffect, unit.owner, unit.row, unit.col);
      if (unit.activeKeywords.has("rebirth")) {
        const egg: DuelystCard = { id: `egg_${uid()}`, name: `${unit.card.name} Egg`, faction: unit.card.faction, cardType: "unit", rarity: "basic", manaCost: 0, attack: 0, health: 1, keywords: ["structure"], abilityText: "Hatches next turn.", flavorText: "", imageUrl: unit.card.imageUrl };
        state.board.set(key, createBoardUnit(egg, unit.owner, unit.row, unit.col, false));
        continue;
      }
      for (const [, u] of state.board) if (u.activeKeywords.has("deathwatch") && u.currentHealth > 0) { u.currentAttack += 1; u.currentHealth += 1; u.maxHealth += 1; }
      toRemove.push(key);
    }
  }
  for (const key of toRemove) state.board.delete(key);
  return state;
}

function checkWinCondition(state: DuelystGameState): DuelystGameState {
  const g1 = findUnit(state, state.players[0].generalId);
  const g2 = findUnit(state, state.players[1].generalId);
  if (!g1 || g1.currentHealth <= 0) { state.phase = "ended"; state.winner = 1; }
  else if (!g2 || g2.currentHealth <= 0) { state.phase = "ended"; state.winner = 0; }
  return state;
}

/* ─── UTILITY ─── */
export function findUnit(state: DuelystGameState, unitId: string): BoardUnit | undefined {
  for (const [, unit] of state.board) if (unit.id === unitId) return unit;
  return undefined;
}

function getProvokers(state: DuelystGameState, unit: BoardUnit): BoardUnit[] {
  const enemy = unit.owner === 0 ? 1 : 0;
  const provokers: BoardUnit[] = [];
  for (const [, u] of state.board) {
    if (u.owner === enemy && (u.activeKeywords.has("provoke") || u.activeKeywords.has("taunt")) && Math.abs(u.row - unit.row) <= 1 && Math.abs(u.col - unit.col) <= 1) provokers.push(u);
  }
  return provokers;
}

function isAttackingFromBehind(attacker: BoardUnit, target: BoardUnit): boolean {
  return target.owner === 0 ? attacker.col < target.col : attacker.col > target.col;
}

function isNearGeneral(state: DuelystGameState, unit: BoardUnit): boolean {
  const general = findUnit(state, state.players[unit.owner].generalId);
  return general ? dist(unit.row, unit.col, general.row, general.col) <= 1 : false;
}

function addLog(state: DuelystGameState, action: string, details: string): void {
  state.actionLog.push({ turn: state.turnNumber, player: state.currentPlayer, action, details });
}

function deepCloneState(state: DuelystGameState): DuelystGameState {
  const newBoard = new Map<string, BoardUnit>();
  for (const [key, unit] of state.board) {
    newBoard.set(key, { ...unit, activeKeywords: new Set(unit.activeKeywords), buffs: unit.buffs.map(b => ({ ...b })), card: { ...unit.card, keywords: [...unit.card.keywords] } });
  }
  return {
    ...state, board: newBoard,
    players: state.players.map(p => ({ ...p, deck: [...p.deck], hand: [...p.hand], artifacts: p.artifacts.map(a => ({ ...a, card: { ...a.card } })) })) as [DuelystPlayer, DuelystPlayer],
    actionLog: [...state.actionLog],
  };
}

export { posKey, parseKey, dist, shuffle, BOARD_W, BOARD_H, MAX_HAND, GENERAL_HP };
