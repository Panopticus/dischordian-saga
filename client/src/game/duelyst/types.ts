/* ═══════════════════════════════════════════════════════
   DUELYST TYPES — Core type definitions for the tactical card game
   ═══════════════════════════════════════════════════════ */

/* ─── FACTIONS ─── */
export type Faction =
  | "panopticon"      // Panopticon Vanguard — surveillance, control, order
  | "architects"      // Architect's Network — AI, technology, manipulation
  | "demagi"          // DeMagi Conclave — elemental magic, ancient power
  | "quarchon"        // Quarchon Collective — quantum, probability, science
  | "neyon"           // Ne-Yon Synthesis — hybrid, adaptation, evolution
  | "chaos"           // Chaos Undivided — destruction, rebellion, entropy
  | "neutral";        // Neutral — usable by any faction

export const FACTION_NAMES: Record<Faction, string> = {
  panopticon: "Panopticon Vanguard",
  architects: "Architect's Network",
  demagi: "DeMagi Conclave",
  quarchon: "Quarchon Collective",
  neyon: "Ne-Yon Synthesis",
  chaos: "Chaos Undivided",
  neutral: "Neutral",
};

export const FACTION_DESCRIPTIONS: Record<Faction, string> = {
  panopticon: "Masters of surveillance and control. Panopticon units gain power through information — revealing enemies, locking down positions, and coordinating precise strikes.",
  architects: "Technological manipulators who reshape the battlefield. Architect units deploy constructs, hack enemy systems, and use AI-driven strategies to outmaneuver opponents.",
  demagi: "Wielders of elemental fury and ancient magic. DeMagi units channel fire, earth, air, and water to devastate enemies with raw destructive power.",
  quarchon: "Quantum scientists who bend probability. Quarchon units manipulate chance, phase through defenses, and exploit dimensional anomalies for tactical advantage.",
  neyon: "Hybrid organisms that adapt and evolve. Ne-Yon units grow stronger over time, heal allies, and transform the battlefield into a living ecosystem.",
  chaos: "Agents of entropy and destruction. Chaos units sacrifice their own to empower others, dealing massive damage at great cost.",
  neutral: "Independent operatives available to all factions.",
};

export const FACTION_COLORS: Record<Faction, string> = {
  panopticon: "#00e5ff",
  architects: "#ff6f00",
  demagi: "#e040fb",
  quarchon: "#00e676",
  neyon: "#ffea00",
  chaos: "#ff1744",
  neutral: "#90a4ae",
};

/* ─── CARD TYPES ─── */
export type DuelystCardType = "general" | "unit" | "spell" | "artifact";

export type DuelystRarity = "basic" | "common" | "rare" | "epic" | "legendary";

/* ─── KEYWORDS ─── */
export type DuelystKeyword =
  | "rush"          // Can move and attack the turn it's summoned
  | "ranged"        // Can attack from anywhere on the board
  | "flying"        // Can move to any unoccupied tile
  | "provoke"       // Adjacent enemies must attack this unit
  | "celerity"      // Can move and attack twice per turn
  | "blast"         // Ranged attack hits all enemies in a line
  | "frenzy"        // Attacks hit all adjacent enemies
  | "rebirth"       // Leaves an egg on death that hatches next turn
  | "forcefield"    // Ignores the first damage taken each turn
  | "airdrop"       // Can be summoned on any tile
  | "deathwatch"    // Triggers when any minion dies
  | "infiltrate"    // Bonus when on enemy side of the board
  | "grow"          // Gains stats at start of each turn
  | "backstab"      // Extra damage when attacking from behind
  | "zeal"          // Bonus when near your general
  | "opening_gambit"// Effect when summoned
  | "dying_wish"    // Effect when destroyed
  | "dispel"        // Removes all effects from a unit
  | "stun"          // Target cannot act next turn
  | "structure"     // Cannot move or attack
  | "ephemeral"     // Dies at end of turn
  | "taunt";        // Same as provoke (alias)

/* ─── CARD DEFINITION ─── */
export interface DuelystCard {
  id: string;
  name: string;
  faction: Faction;
  cardType: DuelystCardType;
  rarity: DuelystRarity;
  manaCost: number;
  attack: number;
  health: number;
  keywords: DuelystKeyword[];
  abilityText: string;
  flavorText: string;
  imageUrl: string;
  spellEffect?: SpellEffect;
  artifactDurability?: number;
  sagaCardId?: string;
}

export interface SpellEffect {
  type: "damage" | "heal" | "buff" | "debuff" | "summon" | "draw" | "transform" | "teleport" | "dispel" | "destroy" | "aoe_damage" | "aoe_buff";
  value: number;
  target: "enemy_unit" | "friendly_unit" | "any_unit" | "enemy_general" | "friendly_general" | "any_general" | "all_enemies" | "all_friendlies" | "all_units" | "self" | "tile" | "random_enemy";
  radius?: number;
  secondaryEffect?: Omit<SpellEffect, "secondaryEffect">;
}

/* ─── BOARD UNIT ─── */
export interface BoardUnit {
  id: string;
  card: DuelystCard;
  owner: 0 | 1;
  row: number;
  col: number;
  currentAttack: number;
  currentHealth: number;
  maxHealth: number;
  hasMoved: boolean;
  hasAttacked: boolean;
  actionsRemaining: number;
  activeKeywords: Set<DuelystKeyword>;
  buffs: Buff[];
  isGeneral: boolean;
  isStunned: boolean;
  forcefieldActive: boolean;
  growAmount?: number;
  backstabDamage?: number;
  infiltrateActive?: boolean;
}

export interface Buff {
  attackMod: number;
  healthMod: number;
  source: string;
  temporary?: boolean;
}

/* ─── PLAYER STATE ─── */
export interface DuelystPlayer {
  faction: Faction;
  generalId: string;
  deck: DuelystCard[];
  hand: DuelystCard[];
  mana: number;
  maxMana: number;
  artifacts: ActiveArtifact[];
  bloodbornUsed: boolean;
  replaceUsed: boolean;
}

export interface ActiveArtifact {
  card: DuelystCard;
  durability: number;
}

/* ─── GAME STATE ─── */
export type GamePhase = "mulligan" | "playing" | "ended";

export interface DuelystGameState {
  board: Map<string, BoardUnit>;
  players: [DuelystPlayer, DuelystPlayer];
  currentPlayer: 0 | 1;
  turnNumber: number;
  phase: GamePhase;
  winner: 0 | 1 | null;
  actionLog: ActionLogEntry[];
  boardWidth: number;
  boardHeight: number;
}

export interface ActionLogEntry {
  turn: number;
  player: 0 | 1;
  action: string;
  details: string;
}

/* ─── ACTIONS ─── */
export type GameAction =
  | { type: "move"; unitId: string; toRow: number; toCol: number }
  | { type: "attack"; attackerId: string; targetId: string }
  | { type: "play_card"; cardIndex: number; row: number; col: number; targetId?: string }
  | { type: "replace_card"; cardIndex: number }
  | { type: "bloodborn_spell"; targetRow?: number; targetCol?: number }
  | { type: "end_turn" };

/* ─── GENERALS ─── */
export interface GeneralDef {
  id: string;
  name: string;
  faction: Faction;
  attack: number;
  health: number;
  imageUrl: string;
  bloodbornSpell: BloodbornSpell;
  loreDescription: string;
}

export interface BloodbornSpell {
  name: string;
  manaCost: number;
  description: string;
  effect: SpellEffect;
}

/* ─── DECK DEFINITION ─── */
export interface DeckDef {
  name: string;
  faction: Faction;
  generalId: string;
  cardIds: string[];
}
