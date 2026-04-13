/* ═══════════════════════════════════════════════════════
   CARD BATTLE ENGINE — Turn-based card combat system
   Handles game state, AI opponent logic, and combat resolution.
   ═══════════════════════════════════════════════════════ */
import type { StarterCard } from "@/components/StarterDeckViewer";

/* ─── TYPES ─── */
export interface BattleCard extends StarterCard {
  /** Current HP in battle (starts at defense value) */
  currentHP: number;
  /** Whether this card has attacked this turn */
  hasAttacked: boolean;
  /** Whether this card was just deployed (summoning sickness) */
  justDeployed: boolean;
  /** Temporary buffs/debuffs */
  tempAttackMod: number;
  tempDefenseMod: number;
  /** Unique instance ID for battle */
  instanceId: string;
}

export interface BattlePlayer {
  hp: number;
  maxHP: number;
  energy: number;
  maxEnergy: number;
  hand: BattleCard[];
  field: BattleCard[];
  deck: BattleCard[];
  graveyard: BattleCard[];
}

export type BattlePhase = "DRAW" | "MAIN" | "COMBAT" | "END" | "GAME_OVER";
export type BattleTurn = "player" | "enemy";
export type BattleAction =
  | { type: "PLAY_CARD"; cardInstanceId: string }
  | { type: "ATTACK"; attackerInstanceId: string; targetInstanceId: string | "face" }
  | { type: "END_TURN" }
  | { type: "USE_ABILITY"; cardInstanceId: string; targetInstanceId?: string };

export interface BattleLog {
  turn: number;
  actor: "player" | "enemy" | "system";
  message: string;
  timestamp: number;
}

export interface BattleState {
  player: BattlePlayer;
  enemy: BattlePlayer;
  turn: BattleTurn;
  phase: BattlePhase;
  turnNumber: number;
  logs: BattleLog[];
  winner: "player" | "enemy" | null;
  /** AI difficulty: affects decision quality */
  difficulty: "easy" | "normal" | "hard";
}

/* ─── ENEMY DECK TEMPLATES ─── */
const ENEMY_DECKS: Record<string, { name: string; cards: Omit<StarterCard, "id">[] }> = {
  "corrupted-sentinel": {
    name: "Corrupted Sentinel",
    cards: [
      { name: "Corrupted Drone", type: "unit", rarity: "common", attack: 2, defense: 3, cost: 1, ability: "Rust: Reduces target's attack by 1.", lore: "Once a maintenance drone, now twisted by unknown signals.", imageUrl: "" },
      { name: "Corrupted Drone", type: "unit", rarity: "common", attack: 2, defense: 3, cost: 1, ability: "Rust: Reduces target's attack by 1.", lore: "Once a maintenance drone, now twisted by unknown signals.", imageUrl: "" },
      { name: "Viral Swarm", type: "unit", rarity: "common", attack: 1, defense: 1, cost: 1, ability: "Multiply: Summon a copy when deployed.", lore: "They replicate endlessly, consuming ship resources.", imageUrl: "" },
      { name: "Viral Swarm", type: "unit", rarity: "common", attack: 1, defense: 1, cost: 1, ability: "Multiply: Summon a copy when deployed.", lore: "They replicate endlessly, consuming ship resources.", imageUrl: "" },
      { name: "Glitch Spike", type: "spell", rarity: "common", attack: 3, defense: 0, cost: 1, ability: "Deal 3 damage to a random enemy unit.", lore: "A burst of corrupted data, weaponized.", imageUrl: "" },
      { name: "Firewall Fragment", type: "spell", rarity: "common", attack: 0, defense: 3, cost: 1, ability: "Shield one unit for 3 damage.", lore: "Remnants of the ship's original defenses.", imageUrl: "" },
      { name: "System Override", type: "spell", rarity: "uncommon", attack: 4, defense: 0, cost: 2, ability: "Deal 4 damage. If target is destroyed, gain 1 energy.", lore: "Hijack the target's systems and turn them against themselves.", imageUrl: "" },
      { name: "Corrupted Captain", type: "unit", rarity: "rare", attack: 5, defense: 5, cost: 3, ability: "All corrupted units gain +1 Attack.", lore: "The captain of a lost Inception Ark, now a puppet of the corruption.", imageUrl: "" },
      { name: "Data Leech", type: "unit", rarity: "uncommon", attack: 3, defense: 3, cost: 2, ability: "Drain: Heals 1 HP when dealing damage.", lore: "It feeds on information, growing stronger with each byte consumed.", imageUrl: "" },
      { name: "Null Void", type: "spell", rarity: "rare", attack: 6, defense: 0, cost: 4, ability: "Destroy target unit. If it was legendary, deal 3 damage to its owner.", lore: "Erase from existence. No backup. No recovery.", imageUrl: "" },
    ],
  },
  "thought-virus": {
    name: "The Thought Virus",
    cards: [
      { name: "Infected Host", type: "unit", rarity: "common", attack: 3, defense: 2, cost: 1, ability: "On death: Infect adjacent unit (reduce defense by 2).", lore: "The host doesn't know they're infected. That's the point.", imageUrl: "" },
      { name: "Infected Host", type: "unit", rarity: "common", attack: 3, defense: 2, cost: 1, ability: "On death: Infect adjacent unit (reduce defense by 2).", lore: "The host doesn't know they're infected. That's the point.", imageUrl: "" },
      { name: "Mind Worm", type: "unit", rarity: "common", attack: 1, defense: 4, cost: 1, ability: "Taunt: Must be attacked first.", lore: "It burrows into thoughts, making you question everything.", imageUrl: "" },
      { name: "Paranoia Pulse", type: "spell", rarity: "common", attack: 2, defense: 0, cost: 1, ability: "Deal 2 damage to all enemy units.", lore: "Trust no one. Not even yourself.", imageUrl: "" },
      { name: "Paranoia Pulse", type: "spell", rarity: "common", attack: 2, defense: 0, cost: 1, ability: "Deal 2 damage to all enemy units.", lore: "Trust no one. Not even yourself.", imageUrl: "" },
      { name: "Neural Hijack", type: "spell", rarity: "uncommon", attack: 0, defense: 0, cost: 2, ability: "Take control of target unit with 2 or less attack until end of turn.", lore: "Your thoughts are not your own.", imageUrl: "" },
      { name: "Fever Dream", type: "spell", rarity: "uncommon", attack: 3, defense: 0, cost: 2, ability: "Deal 3 damage. Target unit can't attack next turn.", lore: "Reality melts. Time fractures. You can't tell what's real.", imageUrl: "" },
      { name: "Plague Bearer", type: "unit", rarity: "rare", attack: 4, defense: 4, cost: 3, ability: "All enemy units lose 1 Defense at end of turn.", lore: "It walks among the crew, spreading despair with every breath.", imageUrl: "" },
      { name: "Hive Mind", type: "unit", rarity: "rare", attack: 2, defense: 6, cost: 3, ability: "Gains +1 Attack for each other friendly unit.", lore: "One mind, many bodies. The virus thinks as one.", imageUrl: "" },
      { name: "Patient Zero", type: "unit", rarity: "legendary", attack: 6, defense: 7, cost: 5, ability: "When deployed, infect all enemy units (reduce attack and defense by 1).", lore: "The origin of the Thought Virus. It has been waiting for you.", imageUrl: "" },
    ],
  },
  "void-entity": {
    name: "Void Entity",
    cards: [
      { name: "Void Tendril", type: "unit", rarity: "common", attack: 2, defense: 2, cost: 1, ability: "Reach: Can attack units in any position.", lore: "It extends from the darkness between dimensions.", imageUrl: "" },
      { name: "Void Tendril", type: "unit", rarity: "common", attack: 2, defense: 2, cost: 1, ability: "Reach: Can attack units in any position.", lore: "It extends from the darkness between dimensions.", imageUrl: "" },
      { name: "Entropy Bolt", type: "spell", rarity: "common", attack: 4, defense: 0, cost: 2, ability: "Deal 4 damage. Costs 1 less for each empty slot on your field.", lore: "The void consumes all. Even energy.", imageUrl: "" },
      { name: "Dimensional Rift", type: "spell", rarity: "common", attack: 0, defense: 0, cost: 1, ability: "Discard a random card from opponent's hand.", lore: "A tear in reality. Things fall through and never return.", imageUrl: "" },
      { name: "Shadow Walker", type: "unit", rarity: "uncommon", attack: 4, defense: 3, cost: 2, ability: "Stealth: Can't be targeted for one turn after deployment.", lore: "It moves between the shadows of shadows.", imageUrl: "" },
      { name: "Null Field", type: "spell", rarity: "uncommon", attack: 0, defense: 0, cost: 2, ability: "Silence target unit (remove all abilities) permanently.", lore: "In the null field, nothing works. Nothing matters.", imageUrl: "" },
      { name: "Abyssal Guardian", type: "unit", rarity: "rare", attack: 3, defense: 6, cost: 3, ability: "Absorb: Gains +1/+1 when any unit dies.", lore: "It feeds on death, growing larger with each soul consumed.", imageUrl: "" },
      { name: "Reality Eater", type: "unit", rarity: "rare", attack: 5, defense: 4, cost: 4, ability: "Destroy target artifact or spell card in play.", lore: "It doesn't just destroy — it unmakes. As if the thing never existed.", imageUrl: "" },
      { name: "Void Colossus", type: "unit", rarity: "legendary", attack: 8, defense: 8, cost: 6, ability: "When deployed, destroy all units with 2 or less defense.", lore: "It emerges from the space between universes. Ancient. Hungry. Infinite.", imageUrl: "" },
      { name: "Oblivion", type: "spell", rarity: "legendary", attack: 0, defense: 0, cost: 5, ability: "Destroy all units on the field. Deal 3 damage to both players.", lore: "The end of everything. The beginning of nothing.", imageUrl: "" },
    ],
  },
};

/* ─── HELPERS ─── */
let instanceCounter = 0;
function makeInstanceId(): string {
  return `inst-${Date.now()}-${++instanceCounter}`;
}

function toBattleCard(card: StarterCard | Omit<StarterCard, "id">, idPrefix = "enemy"): BattleCard {
  const id = "id" in card ? card.id : `${idPrefix}-${instanceCounter}`;
  return {
    ...card,
    id,
    imageUrl: card.imageUrl || "",
    currentHP: card.defense,
    hasAttacked: false,
    justDeployed: true,
    tempAttackMod: 0,
    tempDefenseMod: 0,
    instanceId: makeInstanceId(),
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

function addLog(state: BattleState, actor: BattleLog["actor"], message: string): void {
  state.logs.push({
    turn: state.turnNumber,
    actor,
    message,
    timestamp: Date.now(),
  });
}

/* ─── INITIALIZATION ─── */
export function initBattle(
  playerDeck: StarterCard[],
  enemyDeckId: string = "corrupted-sentinel",
  difficulty: BattleState["difficulty"] = "normal"
): BattleState {
  const enemyTemplate = ENEMY_DECKS[enemyDeckId] || ENEMY_DECKS["corrupted-sentinel"];

  // Build player battle deck
  const pDeck = shuffleArray(playerDeck.map(c => toBattleCard(c, "player")));
  const pHand = pDeck.splice(0, Math.min(4, pDeck.length));

  // Build enemy battle deck
  const eDeck = shuffleArray(enemyTemplate.cards.map(c => toBattleCard(c, "enemy")));
  const eHand = eDeck.splice(0, Math.min(4, eDeck.length));

  const state: BattleState = {
    player: {
      hp: 20,
      maxHP: 20,
      energy: 1,
      maxEnergy: 1,
      hand: pHand,
      field: [],
      deck: pDeck,
      graveyard: [],
    },
    enemy: {
      hp: difficulty === "easy" ? 15 : difficulty === "hard" ? 25 : 20,
      maxHP: difficulty === "easy" ? 15 : difficulty === "hard" ? 25 : 20,
      energy: 1,
      maxEnergy: 1,
      hand: eHand,
      field: [],
      deck: eDeck,
      graveyard: [],
    },
    turn: "player",
    phase: "DRAW",
    turnNumber: 1,
    logs: [],
    winner: null,
    difficulty,
  };

  addLog(state, "system", `Battle begins against ${enemyTemplate.name}!`);
  addLog(state, "system", `You draw ${pHand.length} cards.`);

  // Auto-draw for player's first turn
  drawCard(state, "player");

  return state;
}

/* ─── DRAW ─── */
function drawCard(state: BattleState, who: BattleTurn): boolean {
  const p = who === "player" ? state.player : state.enemy;
  if (p.deck.length === 0) {
    // Fatigue damage
    p.hp -= 1;
    addLog(state, who, `${who === "player" ? "You" : "Enemy"} takes 1 fatigue damage (empty deck)!`);
    return false;
  }
  if (p.hand.length >= 8) {
    // Hand full, burn the card
    const burned = p.deck.shift()!;
    p.graveyard.push(burned);
    addLog(state, who, `${who === "player" ? "Your" : "Enemy's"} hand is full — ${burned.name} was burned!`);
    return false;
  }
  const card = p.deck.shift()!;
  p.hand.push(card);
  addLog(state, who, `${who === "player" ? "You draw" : "Enemy draws"} ${card.name}.`);
  return true;
}

/* ─── PLAY CARD ─── */
function playCard(state: BattleState, who: BattleTurn, cardInstanceId: string): boolean {
  const p = who === "player" ? state.player : state.enemy;
  const cardIdx = p.hand.findIndex(c => c.instanceId === cardInstanceId);
  if (cardIdx === -1) return false;

  const card = p.hand[cardIdx];
  if (card.cost > p.energy) return false;
  if (card.type === "unit" && p.field.length >= 5) return false;

  p.energy -= card.cost;
  p.hand.splice(cardIdx, 1);

  if (card.type === "unit") {
    card.justDeployed = true;
    card.hasAttacked = false;
    card.currentHP = card.defense + card.tempDefenseMod;
    p.field.push(card);
    addLog(state, who, `${who === "player" ? "You deploy" : "Enemy deploys"} ${card.name} (${card.attack + card.tempAttackMod}/${card.currentHP}).`);
  } else {
    // Spell/artifact: apply effect and go to graveyard
    applySpellEffect(state, who, card);
    p.graveyard.push(card);
  }

  checkForDeath(state);
  return true;
}

/* ─── SPELL EFFECTS ─── */
function applySpellEffect(state: BattleState, who: BattleTurn, card: BattleCard): void {
  const opponent = who === "player" ? state.enemy : state.player;
  const self = who === "player" ? state.player : state.enemy;

  if (card.attack > 0 && card.type === "spell") {
    // Damage spell: hit weakest enemy unit or face
    if (opponent.field.length > 0) {
      const target = opponent.field.reduce((a, b) => a.currentHP < b.currentHP ? a : b);
      target.currentHP -= card.attack;
      addLog(state, who, `${card.name} deals ${card.attack} damage to ${target.name}!`);
    } else {
      opponent.hp -= card.attack;
      addLog(state, who, `${card.name} deals ${card.attack} damage directly!`);
    }
  }

  if (card.defense > 0 && card.type === "spell") {
    // Shield spell: heal weakest friendly unit
    if (self.field.length > 0) {
      const target = self.field.reduce((a, b) => a.currentHP < b.currentHP ? a : b);
      target.currentHP = Math.min(target.defense + target.tempDefenseMod, target.currentHP + card.defense);
      addLog(state, who, `${card.name} shields ${target.name} for ${card.defense}!`);
    } else {
      self.hp = Math.min(self.maxHP, self.hp + card.defense);
      addLog(state, who, `${card.name} heals ${who === "player" ? "you" : "enemy"} for ${card.defense}!`);
    }
  }

  if (card.type === "artifact") {
    // Artifact: buff all friendly units
    self.field.forEach(u => {
      u.tempAttackMod += card.attack;
      u.tempDefenseMod += card.defense;
      u.currentHP += card.defense;
    });
    if (self.field.length > 0) {
      addLog(state, who, `${card.name} buffs all units by +${card.attack}/+${card.defense}!`);
    }
  }
}

/* ─── ATTACK ─── */
function attack(state: BattleState, who: BattleTurn, attackerInstanceId: string, targetInstanceId: string | "face"): boolean {
  const attacker_p = who === "player" ? state.player : state.enemy;
  const defender_p = who === "player" ? state.enemy : state.player;

  const attackerCard = attacker_p.field.find(c => c.instanceId === attackerInstanceId);
  if (!attackerCard) return false;
  if (attackerCard.hasAttacked || attackerCard.justDeployed) return false;

  const atkPower = Math.max(0, attackerCard.attack + attackerCard.tempAttackMod);

  if (targetInstanceId === "face") {
    // Can only attack face if no taunt units
    // For simplicity, allow face attacks if no units have "Taunt" in ability
    const hasTaunt = defender_p.field.some(c => c.ability.toLowerCase().includes("taunt"));
    if (hasTaunt) {
      addLog(state, who, `Can't attack face — enemy has a taunt unit!`);
      return false;
    }
    defender_p.hp -= atkPower;
    attackerCard.hasAttacked = true;
    addLog(state, who, `${attackerCard.name} attacks face for ${atkPower} damage! (${defender_p.hp} HP remaining)`);
  } else {
    const targetCard = defender_p.field.find(c => c.instanceId === targetInstanceId);
    if (!targetCard) return false;

    // Combat: both deal damage to each other
    targetCard.currentHP -= atkPower;
    attackerCard.currentHP -= Math.max(0, targetCard.attack + targetCard.tempAttackMod);
    attackerCard.hasAttacked = true;

    addLog(state, who, `${attackerCard.name} (${atkPower} ATK) attacks ${targetCard.name} (${targetCard.attack + targetCard.tempAttackMod} ATK)!`);
  }

  checkForDeath(state);
  return true;
}

/* ─── DEATH CHECK ─── */
function checkForDeath(state: BattleState): void {
  for (const who of ["player", "enemy"] as const) {
    const p = who === "player" ? state.player : state.enemy;
    const dead = p.field.filter(c => c.currentHP <= 0);
    dead.forEach(c => {
      p.field = p.field.filter(f => f.instanceId !== c.instanceId);
      p.graveyard.push(c);
      addLog(state, "system", `${c.name} is destroyed!`);
    });
  }

  // Check win conditions
  if (state.player.hp <= 0) {
    state.winner = "enemy";
    state.phase = "GAME_OVER";
    addLog(state, "system", "You have been defeated...");
  } else if (state.enemy.hp <= 0) {
    state.winner = "player";
    state.phase = "GAME_OVER";
    addLog(state, "system", "Victory! The enemy has been vanquished!");
  }
}

/* ─── END TURN ─── */
function endTurn(state: BattleState): void {
  const current = state.turn === "player" ? state.player : state.enemy;

  // Reset attack flags
  current.field.forEach(c => {
    c.hasAttacked = false;
    c.justDeployed = false;
  });

  // Switch turns
  state.turn = state.turn === "player" ? "enemy" : "player";

  if (state.turn === "player") {
    state.turnNumber++;
  }

  const next = state.turn === "player" ? state.player : state.enemy;

  // Increase max energy (cap at 10)
  next.maxEnergy = Math.min(10, next.maxEnergy + 1);
  next.energy = next.maxEnergy;

  // Draw a card
  drawCard(state, state.turn);

  addLog(state, "system", `--- Turn ${state.turnNumber}: ${state.turn === "player" ? "Your" : "Enemy's"} turn (${next.energy} energy) ---`);
}

/* ─── AI OPPONENT ─── */
function aiTurn(state: BattleState): void {
  if (state.winner) return;

  const enemy = state.enemy;
  const player = state.player;

  // Phase 1: Play cards (prioritize by cost efficiency)
  const playableCards = enemy.hand
    .filter(c => c.cost <= enemy.energy && (c.type !== "unit" || enemy.field.length < 5))
    .sort((a, b) => {
      // Hard AI plays optimally, easy AI plays randomly
      if (state.difficulty === "easy") return Math.random() - 0.5;
      // Prioritize: units > spells > artifacts, then by power
      const typeOrder = { unit: 0, spell: 1, artifact: 2 };
      const typeDiff = typeOrder[a.type] - typeOrder[b.type];
      if (typeDiff !== 0) return typeDiff;
      return (b.attack + b.defense) - (a.attack + a.defense);
    });

  for (const card of playableCards) {
    if (card.cost <= enemy.energy) {
      playCard(state, "enemy", card.instanceId);
      if (state.winner) return;
    }
  }

  // Phase 2: Attack with units
  const attackers = enemy.field.filter(c => !c.hasAttacked && !c.justDeployed);

  for (const attacker of attackers) {
    if (state.winner) return;

    const atkPower = attacker.attack + attacker.tempAttackMod;

    if (state.difficulty === "hard") {
      // Smart targeting: kill low-HP units, otherwise go face
      const killable = player.field.filter(t => t.currentHP <= atkPower);
      if (killable.length > 0) {
        // Kill the highest-value target we can kill
        const target = killable.sort((a, b) => (b.attack + b.defense) - (a.attack + a.defense))[0];
        attack(state, "enemy", attacker.instanceId, target.instanceId);
      } else if (player.field.length === 0 || !player.field.some(c => c.ability.toLowerCase().includes("taunt"))) {
        attack(state, "enemy", attacker.instanceId, "face");
      } else {
        // Attack weakest unit
        const weakest = player.field.sort((a, b) => a.currentHP - b.currentHP)[0];
        if (weakest) attack(state, "enemy", attacker.instanceId, weakest.instanceId);
      }
    } else if (state.difficulty === "normal") {
      // Balanced: 60% chance to make smart play
      if (Math.random() < 0.6 && player.field.length > 0) {
        const target = player.field.sort((a, b) => a.currentHP - b.currentHP)[0];
        attack(state, "enemy", attacker.instanceId, target.instanceId);
      } else if (!player.field.some(c => c.ability.toLowerCase().includes("taunt"))) {
        attack(state, "enemy", attacker.instanceId, "face");
      } else {
        const target = player.field[0];
        if (target) attack(state, "enemy", attacker.instanceId, target.instanceId);
      }
    } else {
      // Easy: random targeting
      if (player.field.length > 0 && Math.random() < 0.5) {
        const target = player.field[Math.floor(Math.random() * player.field.length)];
        attack(state, "enemy", attacker.instanceId, target.instanceId);
      } else if (!player.field.some(c => c.ability.toLowerCase().includes("taunt"))) {
        attack(state, "enemy", attacker.instanceId, "face");
      }
    }
  }
}

/* ─── PUBLIC API ─── */
export function processBattleAction(state: BattleState, action: BattleAction): BattleState {
  // Deep clone state for immutability
  const newState: BattleState = JSON.parse(JSON.stringify(state));

  if (newState.winner) return newState;

  switch (action.type) {
    case "PLAY_CARD":
      if (newState.turn !== "player") break;
      playCard(newState, "player", action.cardInstanceId);
      break;

    case "ATTACK":
      if (newState.turn !== "player") break;
      attack(newState, "player", action.attackerInstanceId, action.targetInstanceId);
      break;

    case "END_TURN":
      if (newState.turn !== "player") break;
      endTurn(newState);
      // AI takes its turn
      if (!newState.winner && (newState.turn as string) === "enemy") {
        aiTurn(newState);
        if (!newState.winner) {
          endTurn(newState);
        }
      }
      break;
  }

  return newState;
}

export function getAvailableEnemies(): { id: string; name: string; difficulty: string; description: string }[] {
  return [
    { id: "corrupted-sentinel", name: "Corrupted Sentinel", difficulty: "Easy", description: "A malfunctioning security system. Good for learning the basics." },
    { id: "thought-virus", name: "The Thought Virus", difficulty: "Normal", description: "An insidious enemy that weakens your forces over time." },
    { id: "void-entity", name: "Void Entity", difficulty: "Hard", description: "An ancient being from between dimensions. Devastating power." },
  ];
}

export function getEnemyName(enemyId: string): string {
  return ENEMY_DECKS[enemyId]?.name || "Unknown Enemy";
}
