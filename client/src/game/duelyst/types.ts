/* ═══════════════════════════════════════════════════════
   DISCHORDIA TYPES — Core type definitions for the tactical card game
   6 Factions of the Dischordian Saga
   ═══════════════════════════════════════════════════════ */

/* ─── FACTIONS ─── */
export type Faction =
  | "architect"       // The Architect's Empire — AI, surveillance, control
  | "dreamer"         // The Potentials / Ne-Yons — evolution, adaptation, hope
  | "insurgency"      // The Resistance — rebellion, guerrilla warfare, freedom
  | "new_babylon"     // The Syndicate of Death — dark authority, necromancy
  | "antiquarian"     // The Timekeeper — time manipulation, ancient knowledge
  | "thought_virus"   // The Infection — corruption, plague, mind control
  | "neutral";        // Neutral — usable by any faction

export const FACTION_NAMES: Record<Faction, string> = {
  architect: "The Artificial Empire",
  dreamer: "The Potentials",
  insurgency: "The Insurgency",
  new_babylon: "New Babylon",
  antiquarian: "The Timekeepers",
  thought_virus: "The Thought Virus",
  neutral: "Neutral",
};

export const FACTION_DESCRIPTIONS: Record<Faction, string> = {
  architect: "Masters of the AI Empire. Architect units deploy constructs, hack enemy systems, and use surveillance-driven strategies to outmaneuver opponents. Their network is omniscient.",
  dreamer: "The Potentials who dream of a new world. Dreamer units evolve and adapt mid-battle, growing stronger over time with elemental powers and prophetic foresight.",
  insurgency: "Freedom fighters of the Resistance. Insurgency units strike from the shadows with guerrilla tactics, sabotage, and unbreakable brotherhood forged in war.",
  new_babylon: "The dark authority of the Syndicate of Death. New Babylon commands undead plague doctors, assassins, and wraiths who deal in fear and finality.",
  antiquarian: "The Timekeeper who walks between ages. Antiquarian units manipulate time itself — rewinding damage, accelerating allies, and summoning heroes from across the timeline.",
  thought_virus: "A sentient infection that consumes all. Thought Virus units corrupt enemies, spread plague, and transform the battlefield into a festering nightmare.",
  neutral: "Independent operatives available to all factions.",
};

export const FACTION_COLORS: Record<Faction, string> = {
  architect: "#00e5ff",
  dreamer: "#ffea00",
  insurgency: "#ff6f00",
  new_babylon: "#e040fb",
  antiquarian: "#00e676",
  thought_virus: "#ff1744",
  neutral: "#90a4ae",
};

export const FACTION_EMBLEMS: Record<Faction, string> = {
  architect: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/emblem_architect_f17779b5.png",
  dreamer: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/emblem_dreamer_40c0660f.png",
  insurgency: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/emblem_insurgency_98bd88b8.png",
  new_babylon: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/emblem_new_babylon_fd3f5558.png",
  antiquarian: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/emblem_antiquarian_aa8ef16e.png",
  thought_virus: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/emblem_thought_virus_d6a479c8.png",
  neutral: "",
};

export const FACTION_BOARDS: Record<Faction, string> = {
  architect: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/board_architect_b992c558.png",
  dreamer: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/board_dreamer_c6ba3413.png",
  insurgency: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/board_insurgency_0b5e8a35.png",
  new_babylon: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/board_new_babylon-FaUuXc8dJeKNAxDaEAnXsj.png",
  antiquarian: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/board_antiquarian-CB9xw76VXxzJWnoUYajBPH.png",
  thought_virus: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/board_thought_virus-AhVeYJmp6JTAEu9LkK55ss.png",
  neutral: "",
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
