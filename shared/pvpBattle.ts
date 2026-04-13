/* ═══════════════════════════════════════════════════════
   PVP BATTLE ENGINE — Shared between client & server
   Deterministic game logic for real-time multiplayer card battles.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */
export interface PvpCard {
  instanceId: string;
  cardId: string;
  name: string;
  type: "unit" | "spell" | "support";
  rarity: string;
  attack: number;
  defense: number;
  cost: number;
  ability: string;
  imageUrl: string;
  currentHP: number;
  hasAttacked: boolean;
  justDeployed: boolean;
  tempAttackMod: number;
  tempDefenseMod: number;
}

export interface PvpPlayer {
  id: number;
  name: string;
  hp: number;
  maxHP: number;
  energy: number;
  maxEnergy: number;
  hand: PvpCard[];
  field: PvpCard[];
  deck: PvpCard[];
  graveyard: PvpCard[];
}

export type PvpPhase = "DRAW" | "MAIN" | "COMBAT" | "END" | "GAME_OVER";

export interface PvpBattleState {
  matchId: string;
  player1: PvpPlayer;
  player2: PvpPlayer;
  currentTurn: number; // player ID whose turn it is
  phase: PvpPhase;
  turnNumber: number;
  logs: PvpLog[];
  winner: number | null; // player ID or null
  startedAt: number;
  turnTimer: number; // seconds remaining for current turn
}

export interface PvpLog {
  turn: number;
  actorId: number;
  message: string;
  timestamp: number;
}

export type PvpAction =
  | { type: "PLAY_CARD"; cardInstanceId: string }
  | { type: "ATTACK"; attackerInstanceId: string; targetInstanceId: string | "face" }
  | { type: "END_TURN" }
  | { type: "USE_ABILITY"; cardInstanceId: string; targetInstanceId?: string };

/* ─── CARD CONVERSION ─── */
export interface DeckCard {
  cardId: string;
  name: string;
  type: string;
  rarity: string;
  attack: number;
  defense: number;
  cost: number;
  ability: string;
  imageUrl: string;
}

let _instanceCounter = 0;
export function resetInstanceCounter() { _instanceCounter = 0; }

function toInstance(card: DeckCard, ownerId: number): PvpCard {
  _instanceCounter++;
  return {
    instanceId: `pvp-${ownerId}-${_instanceCounter}-${Date.now()}`,
    cardId: card.cardId,
    name: card.name,
    type: (card.type as PvpCard["type"]) || "unit",
    rarity: card.rarity,
    attack: card.attack,
    defense: card.defense,
    cost: card.cost,
    ability: card.ability,
    imageUrl: card.imageUrl,
    currentHP: card.defense,
    hasAttacked: false,
    justDeployed: true,
    tempAttackMod: 0,
    tempDefenseMod: 0,
  };
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── INIT BATTLE ─── */
export function initPvpBattle(
  matchId: string,
  p1: { id: number; name: string; deck: DeckCard[] },
  p2: { id: number; name: string; deck: DeckCard[] }
): PvpBattleState {
  resetInstanceCounter();

  const p1Deck = shuffleArray(p1.deck.map(c => toInstance(c, p1.id)));
  const p1Hand = p1Deck.splice(0, Math.min(4, p1Deck.length));

  const p2Deck = shuffleArray(p2.deck.map(c => toInstance(c, p2.id)));
  const p2Hand = p2Deck.splice(0, Math.min(4, p2Deck.length));

  const state: PvpBattleState = {
    matchId,
    player1: {
      id: p1.id,
      name: p1.name,
      hp: 20,
      maxHP: 20,
      energy: 1,
      maxEnergy: 1,
      hand: p1Hand,
      field: [],
      deck: p1Deck,
      graveyard: [],
    },
    player2: {
      id: p2.id,
      name: p2.name,
      hp: 20,
      maxHP: 20,
      energy: 1,
      maxEnergy: 1,
      hand: p2Hand,
      field: [],
      deck: p2Deck,
      graveyard: [],
    },
    currentTurn: p1.id, // Player 1 goes first
    phase: "MAIN",
    turnNumber: 1,
    logs: [{ turn: 1, actorId: 0, message: "PvP Battle begins!", timestamp: Date.now() }],
    winner: null,
    startedAt: Date.now(),
    turnTimer: 60,
  };

  // Draw initial card for P1
  drawCard(state, state.player1);

  return state;
}

/* ─── HELPERS ─── */
function getActivePlayer(state: PvpBattleState): PvpPlayer {
  return state.currentTurn === state.player1.id ? state.player1 : state.player2;
}

function getOpponent(state: PvpBattleState): PvpPlayer {
  return state.currentTurn === state.player1.id ? state.player2 : state.player1;
}

function addLog(state: PvpBattleState, actorId: number, message: string) {
  state.logs.push({
    turn: state.turnNumber,
    actorId,
    message,
    timestamp: Date.now(),
  });
}

function drawCard(state: PvpBattleState, player: PvpPlayer): boolean {
  if (player.deck.length === 0) {
    // Fatigue damage
    player.hp -= state.turnNumber;
    addLog(state, player.id, `${player.name} takes ${state.turnNumber} fatigue damage! (${player.hp} HP)`);
    if (player.hp <= 0) {
      state.winner = player.id === state.player1.id ? state.player2.id : state.player1.id;
      state.phase = "GAME_OVER";
      addLog(state, 0, `${player.name} has been defeated by fatigue!`);
    }
    return false;
  }
  if (player.hand.length >= 8) {
    const burned = player.deck.shift()!;
    player.graveyard.push(burned);
    addLog(state, player.id, `${player.name}'s hand is full! ${burned.name} was burned.`);
    return false;
  }
  const card = player.deck.shift()!;
  player.hand.push(card);
  return true;
}

function checkDeath(state: PvpBattleState) {
  for (const player of [state.player1, state.player2]) {
    const dead = player.field.filter(c => c.currentHP <= 0);
    dead.forEach(c => {
      player.graveyard.push(c);
      addLog(state, player.id, `${c.name} is destroyed!`);
    });
    player.field = player.field.filter(c => c.currentHP > 0);
  }
  // Check player HP
  if (state.player1.hp <= 0) {
    state.winner = state.player2.id;
    state.phase = "GAME_OVER";
    addLog(state, 0, `${state.player1.name} has been defeated!`);
  } else if (state.player2.hp <= 0) {
    state.winner = state.player1.id;
    state.phase = "GAME_OVER";
    addLog(state, 0, `${state.player2.name} has been defeated!`);
  }
}

/* ─── ACTIONS ─── */
function playCard(state: PvpBattleState, playerId: number, cardInstanceId: string): boolean {
  const player = playerId === state.player1.id ? state.player1 : state.player2;
  const cardIdx = player.hand.findIndex(c => c.instanceId === cardInstanceId);
  if (cardIdx === -1) return false;

  const card = player.hand[cardIdx];
  if (card.cost > player.energy) return false;
  if (player.field.length >= 5 && card.type === "unit") return false;

  player.energy -= card.cost;
  player.hand.splice(cardIdx, 1);

  if (card.type === "unit" || card.type === "support") {
    card.justDeployed = true;
    card.hasAttacked = false;
    player.field.push(card);
    addLog(state, playerId, `${player.name} deploys ${card.name} (${card.attack + card.tempAttackMod}/${card.currentHP})`);
  } else if (card.type === "spell") {
    // Spell: deal damage to random enemy unit or face
    const opponent = playerId === state.player1.id ? state.player2 : state.player1;
    const dmg = card.attack + card.tempAttackMod;
    if (dmg > 0) {
      if (opponent.field.length > 0) {
        const target = opponent.field[Math.floor(Math.random() * opponent.field.length)];
        target.currentHP -= dmg;
        addLog(state, playerId, `${player.name} casts ${card.name} dealing ${dmg} damage to ${target.name}!`);
      } else {
        opponent.hp -= dmg;
        addLog(state, playerId, `${player.name} casts ${card.name} dealing ${dmg} damage to ${opponent.name}!`);
      }
    }
    // Healing spells
    if (card.defense > 0 && player.field.length > 0) {
      const weakest = [...player.field].sort((a, b) => a.currentHP - b.currentHP)[0];
      weakest.currentHP = Math.min(weakest.defense + weakest.tempDefenseMod, weakest.currentHP + card.defense);
      addLog(state, playerId, `${card.name} heals ${weakest.name} for ${card.defense}!`);
    }
    player.graveyard.push(card);
  }

  checkDeath(state);
  return true;
}

function attackUnit(state: PvpBattleState, playerId: number, attackerInstanceId: string, targetInstanceId: string | "face"): boolean {
  const player = playerId === state.player1.id ? state.player1 : state.player2;
  const opponent = playerId === state.player1.id ? state.player2 : state.player1;

  const attacker = player.field.find(c => c.instanceId === attackerInstanceId);
  if (!attacker) return false;
  if (attacker.hasAttacked || attacker.justDeployed) return false;

  const atkPower = attacker.attack + attacker.tempAttackMod;

  if (targetInstanceId === "face") {
    // Check for taunt
    const hasTaunt = opponent.field.some(c =>
      c.ability.toLowerCase().includes("taunt") || c.ability.toLowerCase().includes("guard")
    );
    if (hasTaunt) return false;

    opponent.hp -= atkPower;
    addLog(state, playerId, `${attacker.name} attacks ${opponent.name} for ${atkPower} damage! (${opponent.hp} HP)`);
    attacker.hasAttacked = true;
  } else {
    const target = opponent.field.find(c => c.instanceId === targetInstanceId);
    if (!target) return false;

    target.currentHP -= atkPower;
    const counterDmg = target.attack + target.tempAttackMod;
    attacker.currentHP -= counterDmg;

    addLog(state, playerId, `${attacker.name} attacks ${target.name}! (${atkPower} dmg → ${target.currentHP} HP, ${counterDmg} counter → ${attacker.currentHP} HP)`);
    attacker.hasAttacked = true;
  }

  checkDeath(state);
  return true;
}

function endTurn(state: PvpBattleState): void {
  const current = getActivePlayer(state);
  const opponent = getOpponent(state);

  // Reset current player's units
  current.field.forEach(c => {
    c.hasAttacked = false;
    c.justDeployed = false;
  });

  // Switch turn
  state.currentTurn = opponent.id;
  state.turnNumber++;
  state.turnTimer = 60;

  // Increase max energy (cap at 10)
  opponent.maxEnergy = Math.min(10, opponent.maxEnergy + 1);
  opponent.energy = opponent.maxEnergy;

  // Wake up opponent's units
  opponent.field.forEach(c => {
    c.justDeployed = false;
    c.hasAttacked = false;
  });

  // Draw card for new active player
  drawCard(state, opponent);

  addLog(state, opponent.id, `${opponent.name}'s turn (Turn ${state.turnNumber}, ${opponent.energy} energy)`);
}

/* ─── PROCESS ACTION ─── */
export function processPvpAction(state: PvpBattleState, playerId: number, action: PvpAction): { state: PvpBattleState; success: boolean; error?: string } {
  // Deep clone for immutability
  const newState: PvpBattleState = JSON.parse(JSON.stringify(state));

  if (newState.winner) {
    return { state: newState, success: false, error: "Game is already over" };
  }

  if (newState.currentTurn !== playerId) {
    return { state: newState, success: false, error: "Not your turn" };
  }

  let success = false;
  switch (action.type) {
    case "PLAY_CARD":
      success = playCard(newState, playerId, action.cardInstanceId);
      break;
    case "ATTACK":
      success = attackUnit(newState, playerId, action.attackerInstanceId, action.targetInstanceId);
      break;
    case "END_TURN":
      endTurn(newState);
      success = true;
      break;
  }

  return { state: newState, success, error: success ? undefined : "Invalid action" };
}

/* ─── VIEW HELPERS ─── */
/** Create a view of the state for a specific player (hides opponent's hand/deck) */
export function getPlayerView(state: PvpBattleState, playerId: number): PvpBattleState {
  const view: PvpBattleState = JSON.parse(JSON.stringify(state));

  // Hide the opponent's hand and deck details
  const isP1 = playerId === view.player1.id;
  const opponent = isP1 ? view.player2 : view.player1;

  // Replace hand cards with hidden cards (keep count)
  const hiddenHand = opponent.hand.map(c => ({
    ...c,
    name: "???",
    ability: "???",
    imageUrl: "",
    cardId: "hidden",
  }));
  opponent.hand = hiddenHand;

  // Hide deck count only
  opponent.deck = new Array(opponent.deck.length).fill(null).map((_, i) => ({
    instanceId: `hidden-${i}`,
    cardId: "hidden",
    name: "???",
    type: "unit" as const,
    rarity: "common",
    attack: 0,
    defense: 0,
    cost: 0,
    ability: "",
    imageUrl: "",
    currentHP: 0,
    hasAttacked: false,
    justDeployed: false,
    tempAttackMod: 0,
    tempDefenseMod: 0,
  }));

  return view;
}

/* ─── ELO CALCULATION ─── */
export function calculateEloChange(winnerElo: number, loserElo: number): { winnerChange: number; loserChange: number } {
  const K = 32;
  const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedLoser = 1 - expectedWinner;
  const winnerChange = Math.round(K * (1 - expectedWinner));
  const loserChange = Math.round(K * (0 - expectedLoser));
  return { winnerChange, loserChange };
}

export function getRankTier(elo: number): string {
  if (elo >= 2200) return "grandmaster";
  if (elo >= 2000) return "master";
  if (elo >= 1800) return "diamond";
  if (elo >= 1600) return "platinum";
  if (elo >= 1400) return "gold";
  if (elo >= 1200) return "silver";
  return "bronze";
}
