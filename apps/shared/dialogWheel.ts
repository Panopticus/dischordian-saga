/* ═══════════════════════════════════════════════════════
   DIALOG WHEEL — Mass Effect-inspired radial dialog

   Spec from EXPANSION_BIBLE.md §3.

   6 segments arranged in a circle:
     TOP:          INVESTIGATE
     TOP-LEFT:     MACHINE       TOP-RIGHT:    HUMANITY
     BOTTOM-LEFT:  AGGRESSIVE    BOTTOM-RIGHT: COMPASSIONATE
     BOTTOM:       SKILL_CHECK

   Corruption Levels (tied to Human's influence vs Elara):
     Level 1 (Early): subtle scan lines on Machine side
     Level 2 (Mid):   pulse + flicker + secondary voice
     Level 3 (Late):  wheel physically distorts, half-Elara face at center

   Options have rarity (Common → Mythic). Higher rarities = unlocked by
   skill checks, lore discovery, or Breaking Point choices.
   ═══════════════════════════════════════════════════════ */

import type {
  Species,
  CharClass,
  Element,
  Alignment,
} from "./characterCreationImpact";

export type WheelSegment =
  | "investigate"
  | "machine"
  | "humanity"
  | "aggressive"
  | "compassionate"
  | "skill_check";

export type WheelRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export interface WheelOption {
  id: string;
  segment: WheelSegment;
  rarity: WheelRarity;
  /** Short label shown on the wheel segment */
  label: string;
  /** Full line spoken if chosen */
  fullText: string;
  /** What it shifts — morality, trust, etc. */
  outcome: {
    moralityDelta?: number;
    elaraTrustDelta?: number;
    humanTrustDelta?: number;
    npcTrustDelta?: { npcId: string; delta: number };
    unlocks?: string[];        // e.g., codex entries, hidden options
    requires?: string[];       // e.g., "skill:tactics>=12"
  };
  /** Only shows if these conditions met */
  gateCondition?: {
    minSkillLevel?: { skillId: string; level: number };
    minTrust?: { npcId: string; level: number };
    requireFlag?: string;
    /** Option only visible to listed species (Ne-Yon always passes — see POTENTIAL IDENTITY plan §E "Ne-Yon coverage"). */
    requireSpecies?: Species | Species[];
    /** Option only visible to listed classes. */
    requireClass?: CharClass | CharClass[];
    /** Option only visible to listed elements. */
    requireElement?: Element | Element[];
    /** Option only visible to the listed alignment. */
    requireAlignment?: Alignment;
    /** Option hidden if this flag is set (inverse of requireFlag). */
    forbidFlag?: string;
  };
}

/* ─── CORRUPTION LEVELS ─── */

export type CorruptionLevel = 0 | 1 | 2 | 3;

export interface CorruptionVisuals {
  level: CorruptionLevel;
  name: string;
  /** CSS class applied to wheel */
  wheelClass: string;
  /** Textual description for designers/QA */
  description: string;
  /** Visual effects enabled */
  effects: {
    scanLines: boolean;
    staticPulse: boolean;
    textGlitch: boolean;
    doubleVoice: boolean;
    wheelDistortion: boolean;
    halfFaceCenter: boolean;
  };
}

export const CORRUPTION_LEVELS: CorruptionVisuals[] = [
  {
    level: 0, name: "Clean", wheelClass: "corruption-0",
    description: "The Human has no hold. Elara's voice is clear.",
    effects: { scanLines: false, staticPulse: false, textGlitch: false, doubleVoice: false, wheelDistortion: false, halfFaceCenter: false },
  },
  {
    level: 1, name: "Early", wheelClass: "corruption-1",
    description: "Subtle scan lines across Machine-side options. Occasional character substitution (trust → tru5t).",
    effects: { scanLines: true, staticPulse: false, textGlitch: true, doubleVoice: false, wheelDistortion: false, halfFaceCenter: false },
  },
  {
    level: 2, name: "Mid", wheelClass: "corruption-2",
    description: "Machine-side pulses with static. Elara's options flicker with Human's text beneath. Secondary voice heard.",
    effects: { scanLines: true, staticPulse: true, textGlitch: true, doubleVoice: true, wheelDistortion: false, halfFaceCenter: false },
  },
  {
    level: 3, name: "Late", wheelClass: "corruption-3",
    description: "Wheel physically distorts. Segments shift, overlap, rotate. Center shows half-Elara, half-Human face.",
    effects: { scanLines: true, staticPulse: true, textGlitch: true, doubleVoice: true, wheelDistortion: true, halfFaceCenter: true },
  },
];

export function getCorruptionVisuals(level: CorruptionLevel): CorruptionVisuals {
  return CORRUPTION_LEVELS[level];
}

/**
 * Compute corruption level from Human trust relative to Elara trust.
 * As Human trust grows and/or Elara trust falls, corruption rises.
 */
export function computeCorruptionLevel(elaraTrust: number, humanTrust: number): CorruptionLevel {
  const delta = humanTrust - elaraTrust;
  if (delta < 10) return 0;       // Elara still dominant or balanced
  if (delta < 30) return 1;       // Human starting to influence
  if (delta < 60) return 2;       // Human controlling most interactions
  return 3;                       // Human has taken over
}

/* ─── RARITY COLORS (for UI) ─── */

export const RARITY_COLORS: Record<WheelRarity, { text: string; border: string; label: string }> = {
  common: { text: "#e4e4e7", border: "#71717a", label: "White" },
  uncommon: { text: "#22c55e", border: "#22c55e", label: "Green" },
  rare: { text: "#3b82f6", border: "#3b82f6", label: "Blue" },
  epic: { text: "#a855f7", border: "#a855f7", label: "Purple" },
  legendary: { text: "#f59e0b", border: "#f59e0b", label: "Gold" },
  mythic: { text: "url(#rainbow)", border: "#ec4899", label: "Holographic" },
};

/* ─── SEGMENT METADATA ─── */

export const SEGMENT_META: Record<WheelSegment, {
  label: string;
  position: { x: number; y: number }; // 0-100 % on unit circle
  moralityBias: number;                // -10 (machine) to +10 (humanity)
  color: string;
}> = {
  investigate:   { label: "Investigate",   position: { x: 50, y: 0 },   moralityBias: 0,  color: "#60a5fa" },
  machine:       { label: "Machine",       position: { x: 7,  y: 18 },  moralityBias: -5, color: "#ef4444" },
  humanity:      { label: "Humanity",      position: { x: 93, y: 18 },  moralityBias: 5,  color: "#22c55e" },
  aggressive:    { label: "Confront",      position: { x: 7,  y: 82 },  moralityBias: -3, color: "#f97316" },
  compassionate: { label: "Humanity",      position: { x: 93, y: 82 },  moralityBias: 3,  color: "#ec4899" },
  skill_check:   { label: "Skill Check",   position: { x: 50, y: 100 }, moralityBias: 0,  color: "#a855f7" },
};

/* ─── HELPERS ─── */

/**
 * Filter wheel options to only those the player can currently see
 * (gate conditions met). Identity fields are optional — when omitted,
 * identity-gated options are hidden by default (safe default).
 *
 * Ne-Yon players pass every `requireSpecies` check — they are "bridged"
 * (spec §Part 1.2). A separate contribution source tracks Ne-Yon crossings
 * via the ripple engine; see `unityMeterService`.
 */
/** Stat-name aliases the dialog wheel skill-check honors as a
 *  fallback when a Civil Skill of the same id isn't registered.
 *  Resolves the long-standing collision flagged in the choice-impact
 *  audit: a wheel option declares `requireSkill: { intelligence: 12 }`
 *  but no Civil Skill named 'intelligence' exists; the check would
 *  silently fail. Falling through to the player's RPG stat with the
 *  same name lights up the existing 6-stat columns without a schema
 *  change. */
const STAT_FALLBACK_KEYS = new Set([
  "strength",
  "intelligence",
  "agility",
  "charisma",
  "perception",
  "willpower",
]);

export function getAvailableOptions(
  options: WheelOption[],
  context: {
    skills: Record<string, number>;
    npcTrust: Record<string, number>;
    flags: Record<string, boolean>;
    species?: Species;
    characterClass?: CharClass;
    element?: Element;
    alignment?: Alignment;
    /** Optional RPG stat block (characterSheets columns). Used as a
     *  fallback when a skill check references one of the six stat
     *  names and no Civil Skill of that id is registered. */
    stats?: Partial<Record<
      "strength" | "intelligence" | "agility" | "charisma" | "perception" | "willpower",
      number
    >>;
  },
): WheelOption[] {
  const asArray = <T,>(v: T | T[] | undefined): T[] =>
    v === undefined ? [] : Array.isArray(v) ? v : [v];

  return options.filter(opt => {
    const gate = opt.gateCondition;
    if (!gate) return true;
    if (gate.minSkillLevel) {
      const skillId = gate.minSkillLevel.skillId;
      const skillLevel = context.skills[skillId] ?? 0;
      const statLevel = STAT_FALLBACK_KEYS.has(skillId)
        ? (context.stats?.[skillId as keyof NonNullable<typeof context.stats>] ?? 0)
        : 0;
      const effectiveLevel = Math.max(skillLevel, statLevel);
      if (effectiveLevel < gate.minSkillLevel.level) return false;
    }
    if (gate.minTrust) {
      const trust = context.npcTrust[gate.minTrust.npcId] ?? 0;
      if (trust < gate.minTrust.level) return false;
    }
    if (gate.requireFlag && !context.flags[gate.requireFlag]) return false;
    if (gate.forbidFlag && context.flags[gate.forbidFlag]) return false;
    const reqSpecies = asArray(gate.requireSpecies);
    if (reqSpecies.length > 0) {
      // Ne-Yon bridges — always passes species gates.
      if (context.species !== "neyon" && !reqSpecies.includes(context.species as Species)) return false;
    }
    const reqClass = asArray(gate.requireClass);
    if (reqClass.length > 0 && !reqClass.includes(context.characterClass as CharClass)) return false;
    const reqElement = asArray(gate.requireElement);
    if (reqElement.length > 0 && !reqElement.includes(context.element as Element)) return false;
    if (gate.requireAlignment && context.alignment !== gate.requireAlignment) return false;
    return true;
  });
}
