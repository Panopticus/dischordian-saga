/* ═══════════════════════════════════════════════════════
   SOUL STONES & DIVINE LIGHT — Type Definitions
   Dual-path corruption economy with demon pets and
   divine companions.
   ═══════════════════════════════════════════════════════ */

/* ─── STONE STATES ─── */

export type StoneState = "violet" | "red" | "gold";
export type CompanionPath = "demon" | "divine" | "dischordian";
export type CompanionTier = 1 | 2 | 3;

/* ─── SOUL STONE ─── */

export interface SoulStone {
  id: string;
  state: StoneState;
  /** Where this stone came from — "arena_victory", "story_ch3", etc. */
  source: string;
  collectedAt: number;
  /** If currently being purified */
  isPurifying: boolean;
  purificationStartedAt?: number;
  purificationCompletesAt?: number;
}

/* ─── COMPANION ABILITIES & DRAWBACKS ─── */

export type AbilityType =
  | "stat_boost"
  | "detection"
  | "defense"
  | "economy"
  | "social"
  | "lore_access"
  | "narrative"
  | "destructive"
  | "save_mechanic"
  | "vision";

export interface CompanionAbility {
  type: AbilityType;
  /** What stat/system it affects */
  target: string;
  /** Magnitude of the effect */
  value: number;
  /** Persists after dismissal? */
  permanent: boolean;
  description: string;
}

export type DrawbackType =
  | "periodic_drain"
  | "increased_threat"
  | "fragile_trust"
  | "perception_corruption"
  | "health_drain"
  | "reality_distortion"
  | "dialog_corruption"
  | "vote_distortion";

export interface CompanionDrawback {
  type: DrawbackType;
  /** 1-10 severity scale */
  severity: number;
  /** "weekly", "daily", "per_use" */
  frequency: string;
  description: string;
  /** Does dismissing the pet stop it? */
  reversible: boolean;
}

/* ─── DEMON PETS ─── */

export interface DemonPet {
  id: string;
  name: string;
  patron: string;
  patronTitle: string;
  tier: CompanionTier;
  corruptionCost: number;
  ability: CompanionAbility;
  drawback: CompanionDrawback;
  /** How much this pet adds to global corruption */
  corruptionContribution: number;
  artPrompt: string;
  description: string;
  visual: string;
  necromancerDialog: string;
  /** Icon hint for lucide */
  icon: string;
  color: string;
}

/* ─── DIVINE COMPANIONS ─── */

export interface DivineCompanion {
  id: string;
  name: string;
  patron: string;
  tier: CompanionTier;
  divineLightCost: number;
  ability: CompanionAbility;
  /** Divine companions have NO drawbacks */
  drawback: null;
  purityContribution: number;
  artPrompt: string;
  description: string;
  visual: string;
  antiquarianEntry: string;
  icon: string;
  color: string;
}

/* ─── DISCHORDIAN COMPANIONS (secret tier) ─── */

export interface DischordianCompanion {
  id: string;
  name: string;
  tier: 3;
  /** Requires red + gold + violet stones */
  cost: { red: number; gold: number; violet: number };
  /** Trust requirements to unlock */
  trustRequirements: { antiquarian: number; necromancer: number };
  ability: CompanionAbility;
  drawback: null;
  description: string;
  visual: string;
  icon: string;
  color: string;
  /** Specimen portrait art path (NanoBanna2 asset) */
  artPath?: string;
}

/* ─── PURIFICATION ─── */

export interface PurificationAttempt {
  id: string;
  stoneId: string;
  startTime: number;
  endTime: number;
  tokenCost: number;
  successProbability: number;
  result?: "success" | "failure";
}

/* ─── DROP TABLE ─── */

export interface SoulStoneDropEntry {
  source: string;
  label: string;
  dropRate: number;
  stoneQuality: StoneState;
  notes: string;
}

/* ─── GLOBAL ALIGNMENT ─── */

export type CorruptionTier = 0 | 1 | 2 | 3 | 4;
export type PurityTier = 0 | 1 | 2 | 3 | 4;

export interface GlobalAlignment {
  corruptionLevel: number;
  purityLevel: number;
  activeDemonPets: number;
  activeDivineCompanions: number;
  corruptionTier: CorruptionTier;
  purityTier: PurityTier;
  lastUpdated: number;
}

export interface CorruptionTierEffect {
  tier: CorruptionTier;
  minLevel: number;
  maxLevel: number;
  name: string;
  description: string;
  effects: string[];
}

export interface PurityTierEffect {
  tier: PurityTier;
  minLevel: number;
  maxLevel: number;
  name: string;
  description: string;
  effects: string[];
}

/* ─── STORE SHAPE ─── */

export interface ActiveCompanion {
  id: string;
  path: CompanionPath;
  companionId: string;
  equippedAt: number;
}
