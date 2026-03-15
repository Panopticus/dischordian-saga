/**
 * ═══════════════════════════════════════════════════════
 * THE DISCHORDIAN STRUGGLE — AAA Card Battle Engine
 * Chess-like asymmetric warfare: Architect vs Dreamer
 * 3-lane battlefield with keywords, elements, and AI
 * ═══════════════════════════════════════════════════════
 */

// ── Types ──

export type Faction = "architect" | "dreamer";
export type Lane = "vanguard" | "core" | "flank";
export type GamePhase = "untap" | "draw" | "deploy" | "command" | "combat" | "resolve";
export type AIDifficulty = "recruit" | "operative" | "commander" | "archon";

export type Keyword =
  | "stealth"
  | "taunt"
  | "drain"
  | "pierce"
  | "overcharge"
  | "shield"
  | "rally"
  | "resurrect"
  | "evolve";

export type Element = "earth" | "fire" | "water" | "air";

export interface BattleCard {
  uid: string; // unique instance id
  cardId: string;
  name: string;
  cardType: string;
  rarity: string;
  basePower: number;
  baseHealth: number;
  cost: number;
  element: Element | null;
  alignment: string | null;
  species: string | null;
  characterClass: string | null;
  abilityText: string | null;
  imageUrl: string | null;
  keywords: Keyword[];
  // runtime state
  currentHealth: number;
  currentPower: number;
  isExhausted: boolean;
  stealthTurns: number;
  shieldActive: boolean;
  evolveTurns: number;
  evolved: boolean;
  resurrected: boolean;
  lane: Lane | null;
  // faction ability
  factionAbilityId?: string;
}

export interface LaneState {
  vanguard: BattleCard[];
  core: BattleCard[];
  flank: BattleCard[];
}

export interface PlayerState {
  faction: Faction;
  influence: number;
  maxInfluence: number;
  energy: number;
  maxEnergy: number;
  hand: BattleCard[];
  deck: BattleCard[];
  graveyard: BattleCard[];
  lanes: LaneState;
  speciesBonus: { extraHp: number; baseArmor: number };
}

export interface CombatEvent {
  type: "attack" | "destroy" | "influence_damage" | "heal" | "buff" | "keyword" | "element_bonus" | "faction_bonus" | "evolve" | "resurrect" | "deploy" | "draw" | "phase" | "win" | "turn_start";
  source?: string;
  target?: string;
  value?: number;
  lane?: Lane;
  message: string;
}

export interface BattleState {
  player: PlayerState;
  opponent: PlayerState;
  turn: number;
  maxTurns: number;
  currentPhase: GamePhase;
  activePlayer: "player" | "opponent";
  events: CombatEvent[];
  winner: "player" | "opponent" | null;
  winReason: string | null;
  difficulty: AIDifficulty;
}

// ── Constants ──

const MAX_LANE_SLOTS = 3;
const MAX_INFLUENCE = 30;
const MAX_ENERGY = 10;
const STARTING_ENERGY = 3;
const STARTING_HAND = 5;
const MAX_TURNS = 15;

const ELEMENT_ADVANTAGE: Record<Element, Element> = {
  fire: "air",
  air: "water",
  water: "earth",
  earth: "fire",
};

const LANE_BONUSES: Record<Lane, { atkBonus: number; influenceDmgBonus: number }> = {
  vanguard: { atkBonus: 1, influenceDmgBonus: 0 },
  core: { atkBonus: 0, influenceDmgBonus: 0 },
  flank: { atkBonus: 0, influenceDmgBonus: 1 },
};

// ── Helpers ──

import { assignFactionAbility, executeFactionAbility, type FactionAbilityId } from "./FactionAbilities";

let uidCounter = 0;
function genUid(): string {
  return `bc_${Date.now()}_${++uidCounter}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function assignKeywords(card: { rarity: string; cardType: string; characterClass?: string | null }): Keyword[] {
  const kws: Keyword[] = [];
  const r = Math.random();

  if (card.cardType !== "character") return kws;

  // Class-based keywords
  if (card.characterClass === "assassin" || card.characterClass === "spy") {
    if (r < 0.6) kws.push("stealth");
    if (r < 0.3) kws.push("pierce");
  }
  if (card.characterClass === "soldier") {
    if (r < 0.5) kws.push("taunt");
    if (r < 0.2) kws.push("shield");
  }
  if (card.characterClass === "oracle") {
    if (r < 0.4) kws.push("drain");
    if (r < 0.2) kws.push("evolve");
  }
  if (card.characterClass === "engineer") {
    if (r < 0.4) kws.push("rally");
    if (r < 0.2) kws.push("shield");
  }

  // Rarity-based bonus keywords
  if (card.rarity === "legendary" || card.rarity === "mythic" || card.rarity === "neyon") {
    const bonus: Keyword[] = ["overcharge", "resurrect", "evolve"];
    if (r < 0.4) kws.push(bonus[Math.floor(Math.random() * bonus.length)]);
  }

  return Array.from(new Set(kws));
}

function speciesBonuses(species: string | null): { extraHp: number; baseArmor: number } {
  switch (species) {
    case "demagi": return { extraHp: 2, baseArmor: 0 };
    case "quarchon": return { extraHp: 0, baseArmor: 2 };
    case "neyon": return { extraHp: 2, baseArmor: 2 };
    default: return { extraHp: 0, baseArmor: 0 };
  }
}

export function cardToBattleCard(card: {
  cardId: string;
  name: string;
  cardType: string;
  rarity: string;
  power: number;
  health: number;
  cost: number;
  element?: string | null;
  alignment?: string | null;
  species?: string | null;
  characterClass?: string | null;
  abilityText?: string | null;
  imageUrl?: string | null;
}): BattleCard {
  const kws = assignKeywords(card);
  return {
    uid: genUid(),
    cardId: card.cardId,
    name: card.name,
    cardType: card.cardType,
    rarity: card.rarity,
    basePower: card.power,
    baseHealth: card.health,
    cost: card.cost,
    element: (card.element as Element) || null,
    alignment: card.alignment || null,
    species: card.species || null,
    characterClass: card.characterClass || null,
    abilityText: card.abilityText || null,
    imageUrl: card.imageUrl || null,
    keywords: kws,
    currentHealth: card.health,
    currentPower: card.power,
    isExhausted: false,
    stealthTurns: kws.includes("stealth") ? 1 : 0,
    shieldActive: kws.includes("shield"),
    evolveTurns: kws.includes("evolve") ? 3 : 0,
    evolved: false,
    resurrected: false,
    lane: null,
    factionAbilityId: undefined,
  };
}

function applyFactionBonus(card: BattleCard, faction: Faction): void {
  if (faction === "architect") {
    card.currentPower = card.basePower + 2;
  } else {
    card.currentHealth = card.baseHealth + 2;
  }
  // Assign faction ability if not already assigned
  if (!card.factionAbilityId) {
    const ability = assignFactionAbility(card, faction);
    if (ability) {
      card.factionAbilityId = ability.id;
    }
  }
}

function applySpeciesBonus(card: BattleCard, bonus: { extraHp: number; baseArmor: number }): void {
  card.currentHealth += bonus.extraHp;
  card.baseHealth += bonus.extraHp;
}

function getElementMultiplier(attacker: Element | null, defender: Element | null): number {
  if (!attacker || !defender) return 1;
  if (ELEMENT_ADVANTAGE[attacker] === defender) return 1.5;
  if (ELEMENT_ADVANTAGE[defender] === attacker) return 0.75;
  return 1;
}

function emptyLanes(): LaneState {
  return { vanguard: [], core: [], flank: [] };
}

function allLaneCards(lanes: LaneState): BattleCard[] {
  return [...lanes.vanguard, ...lanes.core, ...lanes.flank];
}

function laneCardCount(lanes: LaneState): number {
  return lanes.vanguard.length + lanes.core.length + lanes.flank.length;
}

function removeFromLane(lanes: LaneState, uid: string): BattleCard | null {
  for (const lane of ["vanguard", "core", "flank"] as Lane[]) {
    const idx = lanes[lane].findIndex(c => c.uid === uid);
    if (idx !== -1) {
      const [removed] = lanes[lane].splice(idx, 1);
      return removed;
    }
  }
  return null;
}

// ── Game Initialization ──

export function createBattle(
  playerCards: BattleCard[],
  opponentCards: BattleCard[],
  playerFaction: Faction,
  difficulty: AIDifficulty
): BattleState {
  const opponentFaction: Faction = playerFaction === "architect" ? "dreamer" : "architect";

  const pDeck = shuffle(playerCards);
  const oDeck = shuffle(opponentCards);

  const pSpecies = speciesBonuses(pDeck[0]?.species || null);
  const oSpecies = speciesBonuses(oDeck[0]?.species || null);

  const pHand = pDeck.splice(0, STARTING_HAND);
  const oHand = oDeck.splice(0, STARTING_HAND);

  // Apply faction bonuses to all cards
  [...pHand, ...pDeck].forEach(c => applyFactionBonus(c, playerFaction));
  [...oHand, ...oDeck].forEach(c => applyFactionBonus(c, opponentFaction));

  return {
    player: {
      faction: playerFaction,
      influence: MAX_INFLUENCE,
      maxInfluence: MAX_INFLUENCE,
      energy: STARTING_ENERGY,
      maxEnergy: MAX_ENERGY,
      hand: pHand,
      deck: pDeck,
      graveyard: [],
      lanes: emptyLanes(),
      speciesBonus: pSpecies,
    },
    opponent: {
      faction: opponentFaction,
      influence: MAX_INFLUENCE,
      maxInfluence: MAX_INFLUENCE,
      energy: STARTING_ENERGY,
      maxEnergy: MAX_ENERGY,
      hand: oHand,
      deck: oDeck,
      graveyard: [],
      lanes: emptyLanes(),
      speciesBonus: oSpecies,
    },
    turn: 1,
    maxTurns: MAX_TURNS,
    currentPhase: "deploy",
    activePlayer: "player",
    events: [{ type: "turn_start", message: `Turn 1 begins. Choose your strategy, operative.` }],
    winner: null,
    winReason: null,
    difficulty,
  };
}

// ── Game Actions ──

export function deployCard(
  state: BattleState,
  cardUid: string,
  lane: Lane,
  who: "player" | "opponent"
): BattleState {
  const s = structuredClone(state);
  const p = s[who];
  const events: CombatEvent[] = [];

  const cardIdx = p.hand.findIndex(c => c.uid === cardUid);
  if (cardIdx === -1) return state;

  const card = p.hand[cardIdx];
  if (card.cardType !== "character") return state;

  // Check energy (Architect passive: first card each turn costs 1 less)
  let cost = card.cost;
  if (p.faction === "architect") {
    const cardsPlayedThisTurn = allLaneCards(p.lanes).filter(c => c.isExhausted).length;
    if (cardsPlayedThisTurn === 0) cost = Math.max(0, cost - 1);
  }
  if (cost > p.energy) return state;

  // Check lane capacity
  if (p.lanes[lane].length >= MAX_LANE_SLOTS) return state;

  // Deploy
  p.hand.splice(cardIdx, 1);
  card.isExhausted = true;
  card.lane = lane;
  p.lanes[lane].push(card);
  p.energy -= cost;

  events.push({
    type: "deploy",
    source: card.name,
    lane,
    value: cost,
    message: `${who === "player" ? "You" : "Opponent"} deployed ${card.name} to ${lane} lane (${cost} energy).`,
  });

  // Rally keyword: adjacent units get +1 ATK
  if (card.keywords.includes("rally")) {
    const laneCards = p.lanes[lane];
    for (const adj of laneCards) {
      if (adj.uid !== card.uid) {
        adj.currentPower += 1;
        events.push({
          type: "keyword",
          source: card.name,
          target: adj.name,
          message: `${card.name}'s Rally gives ${adj.name} +1 ATK!`,
        });
      }
    }
  }

  // Trigger on_deploy faction ability
  if (card.factionAbilityId) {
    const abilityResult = triggerFactionAbility(s, card, who, "on_deploy");
    if (abilityResult) {
      Object.assign(s, abilityResult.state);
      events.push(...abilityResult.events);
    }
  }

  s.events = [...s.events, ...events];
  return s;
}

export function drawCards(state: BattleState, who: "player" | "opponent", count: number = 1): BattleState {
  const s = structuredClone(state);
  const p = s[who];
  const events: CombatEvent[] = [];

  for (let i = 0; i < count; i++) {
    if (p.deck.length === 0) {
      p.influence -= 3;
      events.push({
        type: "influence_damage",
        value: 3,
        message: `${who === "player" ? "You" : "Opponent"} can't draw — lost 3 Influence! (deck exhaustion)`,
      });
      continue;
    }
    const drawn = p.deck.shift()!;
    applyFactionBonus(drawn, p.faction);
    p.hand.push(drawn);
    events.push({
      type: "draw",
      source: drawn.name,
      message: `${who === "player" ? "You" : "Opponent"} drew ${who === "player" ? drawn.name : "a card"}.`,
    });
  }

  s.events = [...s.events, ...events];
  return s;
}

export function resolveCombat(state: BattleState): BattleState {
  let s = structuredClone(state);
  const events: CombatEvent[] = [];
  const laneOrder: Lane[] = ["vanguard", "core", "flank"];

  events.push({ type: "phase", message: "═══ COMBAT PHASE ═══" });

  for (const lane of laneOrder) {
    const pCards = s.player.lanes[lane];
    const oCards = s.opponent.lanes[lane];

    if (pCards.length === 0 && oCards.length === 0) continue;

    events.push({ type: "phase", lane, message: `── ${lane.toUpperCase()} LANE ──` });

    // Unblocked lane = direct Influence damage
    if (pCards.length > 0 && oCards.length === 0) {
      const laneBonus = LANE_BONUSES[lane];
      for (const card of pCards) {
        if (card.isExhausted) continue;
        const dmg = card.currentPower + laneBonus.atkBonus + laneBonus.influenceDmgBonus;
        s.opponent.influence = Math.max(0, s.opponent.influence - dmg);
        events.push({
          type: "influence_damage",
          source: card.name,
          value: dmg,
          lane,
          message: `${card.name} strikes unblocked for ${dmg} Influence damage!`,
        });
        card.isExhausted = true;
      }
      continue;
    }

    if (oCards.length > 0 && pCards.length === 0) {
      const laneBonus = LANE_BONUSES[lane];
      for (const card of oCards) {
        if (card.isExhausted) continue;
        const dmg = card.currentPower + laneBonus.atkBonus + laneBonus.influenceDmgBonus;
        s.player.influence = Math.max(0, s.player.influence - dmg);
        events.push({
          type: "influence_damage",
          source: card.name,
          value: dmg,
          lane,
          message: `Opponent's ${card.name} strikes unblocked for ${dmg} Influence damage!`,
        });
        card.isExhausted = true;
      }
      continue;
    }

    // Both sides have cards — resolve combat
    const allAttackers = [...pCards, ...oCards]
      .filter(c => !c.isExhausted)
      .sort((a, b) => b.currentPower - a.currentPower);

    for (const attacker of allAttackers) {
      const isPlayer = pCards.includes(attacker);
      const defenders = isPlayer ? oCards : pCards;

      if (defenders.length === 0) continue;
      if (attacker.currentHealth <= 0) continue;

      // Taunt targeting
      let target = defenders.find(d => d.keywords.includes("taunt") && d.currentHealth > 0);
      if (!target) {
        // Target lowest health
        target = defenders
          .filter(d => d.currentHealth > 0 && d.stealthTurns <= 0)
          .sort((a, b) => a.currentHealth - b.currentHealth)[0];
      }
      if (!target) continue;

      // Calculate damage
      const laneBonus = LANE_BONUSES[lane];
      let damage = attacker.currentPower + laneBonus.atkBonus;

      // Element multiplier
      const elemMult = getElementMultiplier(attacker.element, target.element);
      damage = Math.round(damage * elemMult);

      if (elemMult > 1) {
        events.push({
          type: "element_bonus",
          source: attacker.name,
          target: target.name,
          message: `${attacker.element?.toUpperCase()} beats ${target.element?.toUpperCase()}! +50% damage!`,
        });
      }

      // Pierce keyword
      if (attacker.keywords.includes("pierce")) {
        damage = Math.round(damage * 1.5);
        events.push({
          type: "keyword",
          source: attacker.name,
          message: `${attacker.name}'s Pierce ignores armor!`,
        });
      }

      // Shield keyword
      if (target.shieldActive) {
        target.shieldActive = false;
        events.push({
          type: "keyword",
          target: target.name,
          message: `${target.name}'s Shield absorbs the hit!`,
        });
        attacker.isExhausted = true;
        continue;
      }

      // Apply damage
      target.currentHealth -= damage;
      attacker.isExhausted = true;

      const prefix = isPlayer ? "" : "Opponent's ";
      const targetPrefix = isPlayer ? "Opponent's " : "Your ";
      events.push({
        type: "attack",
        source: attacker.name,
        target: target.name,
        value: damage,
        lane,
        message: `${prefix}${attacker.name} attacks ${targetPrefix}${target.name} for ${damage}!`,
      });

      // Drain keyword
      if (attacker.keywords.includes("drain")) {
        const healed = Math.min(damage, attacker.baseHealth - attacker.currentHealth);
        if (healed > 0) {
          attacker.currentHealth += healed;
          events.push({
            type: "heal",
            source: attacker.name,
            value: healed,
            message: `${attacker.name} drains ${healed} HP!`,
          });
        }
      }

      // Trigger on_combat faction abilities
      const attackerWho = isPlayer ? "player" : "opponent";
      if (attacker.factionAbilityId) {
        const abilityResult = triggerFactionAbility(s, attacker, attackerWho as "player" | "opponent", "on_combat");
        if (abilityResult) {
          Object.assign(s, abilityResult.state);
          events.push(...abilityResult.events);
        }
      }

      // Check destruction
      if (target.currentHealth <= 0) {
        events.push({
          type: "destroy",
          target: target.name,
          lane,
          message: `${targetPrefix}${target.name} was destroyed!`,
        });
      }

      // Overcharge: attack again but die
      if (attacker.keywords.includes("overcharge") && !attacker.isExhausted) {
        events.push({
          type: "keyword",
          source: attacker.name,
          message: `${attacker.name} Overcharges for a second strike!`,
        });
        attacker.isExhausted = false; // allow second attack next loop
      }
    }

    // Remove destroyed cards
    const removeDestroyed = (cards: BattleCard[], graveyard: BattleCard[], who: "player" | "opponent") => {
      const alive: BattleCard[] = [];
      for (const c of cards) {
        if (c.currentHealth <= 0) {
          // Resurrect keyword
          if (c.keywords.includes("resurrect") && !c.resurrected) {
            c.currentHealth = Math.ceil(c.baseHealth / 2);
            c.resurrected = true;
            c.isExhausted = true;
            alive.push(c);
            events.push({
              type: "resurrect",
              source: c.name,
              message: `${c.name} resurrects with half health!`,
            });
          } else {
            // Trigger on_death faction ability before going to graveyard
            if (c.factionAbilityId) {
              const deathResult = triggerFactionAbility(s, c, who, "on_death");
              if (deathResult) {
                Object.assign(s, deathResult.state);
                events.push(...deathResult.events);
              }
            }
            graveyard.push(c);
          }
        } else {
          alive.push(c);
        }
      }
      return alive;
    };

    s.player.lanes[lane] = removeDestroyed(pCards, s.player.graveyard, "player");
    s.opponent.lanes[lane] = removeDestroyed(oCards, s.opponent.graveyard, "opponent");
  }

  s.events = [...s.events, ...events];
  return s;
}

export function endTurn(state: BattleState): BattleState {
  let s = structuredClone(state);
  const events: CombatEvent[] = [];

  // Process evolve keywords
  for (const who of ["player", "opponent"] as const) {
    for (const lane of ["vanguard", "core", "flank"] as Lane[]) {
      for (const card of s[who].lanes[lane]) {
        if (card.keywords.includes("evolve") && !card.evolved) {
          card.evolveTurns--;
          if (card.evolveTurns <= 0) {
            card.evolved = true;
            card.currentPower += 3;
            card.currentHealth += 3;
            card.basePower += 3;
            card.baseHealth += 3;
            events.push({
              type: "evolve",
              source: card.name,
              message: `${card.name} EVOLVES! +3 ATK, +3 HP!`,
            });
          }
        }
        // Reduce stealth
        if (card.stealthTurns > 0) card.stealthTurns--;
        // Overcharge destruction
        if (card.keywords.includes("overcharge") && card.isExhausted) {
          card.currentHealth = 0;
          events.push({
            type: "destroy",
            source: card.name,
            message: `${card.name} burns out from Overcharge!`,
          });
        }
      }
      // Clean up overcharge deaths
      const alive = s[who].lanes[lane].filter(c => c.currentHealth > 0);
      const dead = s[who].lanes[lane].filter(c => c.currentHealth <= 0);
      s[who].graveyard.push(...dead);
      s[who].lanes[lane] = alive;
    }
  }

  // Switch active player or advance turn
  if (s.activePlayer === "player") {
    s.activePlayer = "opponent";
    s.currentPhase = "deploy";
    // Untap opponent cards
    for (const lane of ["vanguard", "core", "flank"] as Lane[]) {
      for (const card of s.opponent.lanes[lane]) {
        card.isExhausted = false;
      }
    }
    // Energy regen
    s.opponent.energy = Math.min(s.opponent.maxEnergy, s.opponent.energy + 1 + Math.floor(s.turn / 3));
    // Trigger on_turn_start abilities for opponent
    for (const lane of ["vanguard", "core", "flank"] as Lane[]) {
      for (const card of s.opponent.lanes[lane]) {
        if (card.factionAbilityId) {
          const result = triggerFactionAbility(s, card, "opponent", "on_turn_start");
          if (result) {
            Object.assign(s, result.state);
            events.push(...result.events);
          }
        }
      }
    }
  } else {
    s.activePlayer = "player";
    s.currentPhase = "deploy";
    s.turn++;
    // Untap player cards
    for (const lane of ["vanguard", "core", "flank"] as Lane[]) {
      for (const card of s.player.lanes[lane]) {
        card.isExhausted = false;
      }
    }
    // Energy regen
    s.player.energy = Math.min(s.player.maxEnergy, s.player.energy + 1 + Math.floor(s.turn / 3));
    // Trigger on_turn_start abilities for player
    for (const lane of ["vanguard", "core", "flank"] as Lane[]) {
      for (const card of s.player.lanes[lane]) {
        if (card.factionAbilityId) {
          const result = triggerFactionAbility(s, card, "player", "on_turn_start");
          if (result) {
            Object.assign(s, result.state);
            events.push(...result.events);
          }
        }
      }
    }

    events.push({
      type: "turn_start",
      message: `═══ TURN ${s.turn} ═══`,
    });
  }

  // Check win conditions
  s = checkWinConditions(s, events);

  s.events = [...s.events, ...events];
  return s;
}

function checkWinConditions(state: BattleState, events: CombatEvent[]): BattleState {
  const s = state;

  if (s.player.influence <= 0) {
    s.winner = "opponent";
    s.winReason = "Influence destroyed";
    events.push({ type: "win", message: "Your Influence has been shattered. DEFEAT." });
  } else if (s.opponent.influence <= 0) {
    s.winner = "player";
    s.winReason = "Influence destroyed";
    events.push({ type: "win", message: "Enemy Influence shattered! VICTORY!" });
  } else if (s.turn > s.maxTurns) {
    // Dreamer survival win
    if (s.player.faction === "dreamer" && s.player.influence > 0) {
      s.winner = "player";
      s.winReason = "Dreamer survived 15 turns";
      events.push({ type: "win", message: "You survived the onslaught! Dreamer VICTORY!" });
    } else if (s.opponent.faction === "dreamer" && s.opponent.influence > 0) {
      s.winner = "opponent";
      s.winReason = "Dreamer survived 15 turns";
      events.push({ type: "win", message: "The Dreamer outlasted you. DEFEAT." });
    } else {
      // Highest influence wins
      if (s.player.influence > s.opponent.influence) {
        s.winner = "player";
        s.winReason = "Higher Influence at time limit";
        events.push({ type: "win", message: "Time's up — you have more Influence! VICTORY!" });
      } else {
        s.winner = "opponent";
        s.winReason = "Higher Influence at time limit";
        events.push({ type: "win", message: "Time's up — opponent has more Influence. DEFEAT." });
      }
    }
  }

  return s;
}

// ── AI System ──

export function runAITurn(state: BattleState): BattleState {
  let s = structuredClone(state);
  const events: CombatEvent[] = [];
  const diff = s.difficulty;

  // Draw phase (Dreamer draws 2)
  const drawCount = s.opponent.faction === "dreamer" ? 2 : 1;
  s = drawCards(s, "opponent", drawCount);

  // Deploy phase — AI plays cards
  const hand = [...s.opponent.hand]
    .filter(c => c.cardType === "character")
    .sort((a, b) => {
      if (diff === "recruit") return Math.random() - 0.5;
      if (diff === "operative") return b.basePower - a.basePower;
      // Commander+ considers element matchups
      return (b.basePower + b.baseHealth) - (a.basePower + a.baseHealth);
    });

  for (const card of hand) {
    let cost = card.cost;
    if (s.opponent.faction === "architect") {
      const played = allLaneCards(s.opponent.lanes).filter(c => c.isExhausted).length;
      if (played === 0) cost = Math.max(0, cost - 1);
    }
    if (cost > s.opponent.energy) continue;

    // Choose lane
    let targetLane: Lane;
    if (diff === "recruit") {
      targetLane = (["vanguard", "core", "flank"] as Lane[])[Math.floor(Math.random() * 3)];
    } else {
      // Smart lane selection
      const lanes: Lane[] = ["vanguard", "core", "flank"];
      const laneScores = lanes.map(lane => {
        const myCount = s.opponent.lanes[lane].length;
        const theirCount = s.player.lanes[lane].length;
        if (myCount >= MAX_LANE_SLOTS) return -999;

        let score = 0;
        if (theirCount > 0 && myCount === 0) score += 10; // Defend unprotected lane
        if (theirCount === 0 && myCount === 0) score += 5; // Open lane for influence damage
        if (lane === "flank" && theirCount === 0) score += 8; // Flank bonus
        if (diff === "commander" || diff === "archon") {
          // Element counter
          const enemyCards = s.player.lanes[lane];
          if (card.element && enemyCards.some(e => e.element && ELEMENT_ADVANTAGE[card.element!] === e.element)) {
            score += 6;
          }
        }
        return score;
      });

      const bestIdx = laneScores.indexOf(Math.max(...laneScores));
      targetLane = lanes[bestIdx >= 0 ? bestIdx : 0];
    }

    if (s.opponent.lanes[targetLane].length >= MAX_LANE_SLOTS) continue;

    s = deployCard(s, card.uid, targetLane, "opponent");
  }

  // Combat phase
  s = resolveCombat(s);

  // End turn
  s = endTurn(s);

  return s;
}

// ── Faction Ability Integration ──

import { ALL_FACTION_ABILITIES } from "./FactionAbilities";

function triggerFactionAbility(
  state: BattleState,
  card: BattleCard,
  who: "player" | "opponent",
  triggerType: "on_deploy" | "on_combat" | "on_death" | "on_turn_start"
): { state: BattleState; events: CombatEvent[] } | null {
  if (!card.factionAbilityId) return null;
  const ability = ALL_FACTION_ABILITIES.find(a => a.id === card.factionAbilityId);
  if (!ability || ability.triggerType !== triggerType) return null;
  return executeFactionAbility(ability, state, card, who);
}

// ── Utility Exports ──

export function getLaneCards(state: BattleState, who: "player" | "opponent", lane: Lane): BattleCard[] {
  return state[who].lanes[lane];
}

export function canDeploy(state: BattleState, cardUid: string, lane: Lane): boolean {
  const card = state.player.hand.find(c => c.uid === cardUid);
  if (!card || card.cardType !== "character") return false;

  let cost = card.cost;
  if (state.player.faction === "architect") {
    const played = allLaneCards(state.player.lanes).filter(c => c.isExhausted).length;
    if (played === 0) cost = Math.max(0, cost - 1);
  }

  return cost <= state.player.energy && state.player.lanes[lane].length < MAX_LANE_SLOTS;
}

export function getMatchRewards(state: BattleState): {
  xp: number;
  credits: number;
  boosters: number;
  dreamDrops: number;
  soulBoundDream: number;
  dnaCode: number;
  achievement: string | null;
} {
  if (!state.winner) return { xp: 0, credits: 0, boosters: 0, dreamDrops: 0, soulBoundDream: 0, dnaCode: 0, achievement: null };

  const isWin = state.winner === "player";
  const diffMultiplier = { recruit: 1, operative: 1.5, commander: 2, archon: 3 }[state.difficulty];

  if (!isWin) {
    return {
      xp: Math.round(25 * diffMultiplier),
      credits: 10,
      boosters: 0,
      dreamDrops: Math.random() < 0.1 ? 1 : 0,
      soulBoundDream: 0,
      dnaCode: 0,
      achievement: null,
    };
  }

  const baseXp = 100;
  const baseCreds = 50;
  let achievement: string | null = null;

  if (state.winReason === "Dreamer survived 15 turns") {
    achievement = "Dream Walker";
  } else if (state.player.influence === state.player.maxInfluence) {
    achievement = "Architect Supreme";
  }

  // Dream drops: regular from all enemies, Soul Bound only from boss-level (Archon)
  const dreamDrops = Math.random() < 0.3 ? Math.ceil(Math.random() * 3 * diffMultiplier) : 0;
  // Soul Bound Dream: only drops from Archon (boss-level) difficulty
  const soulBoundDream = state.difficulty === "archon" && Math.random() < 0.4
    ? Math.ceil(Math.random() * 2) : 0;
  // DNA/CODE: drops from Commander+ difficulty
  const dnaCode = (state.difficulty === "commander" || state.difficulty === "archon")
    && Math.random() < 0.25 ? Math.ceil(Math.random() * 5) : 0;

  return {
    xp: Math.round(baseXp * diffMultiplier),
    credits: Math.round(baseCreds * diffMultiplier),
    boosters: state.difficulty === "archon" ? 2 : 1,
    dreamDrops,
    soulBoundDream,
    dnaCode,
    achievement,
  };
}
