/* ═══════════════════════════════════════════════════════
   SOUL STONE CONFIGURATION
   Drop tables, corruption/purity tiers, purification
   settings, and global economy constants.
   ═══════════════════════════════════════════════════════ */

import type {
  SoulStoneDropEntry,
  CorruptionTierEffect,
  PurityTierEffect,
} from "./types";

/* ─── DROP TABLE ─── */

export const DROP_TABLE: SoulStoneDropEntry[] = [
  /* ── Combat Sources ── */
  {
    source: "arena_victory",
    label: "Arena Combat (victory)",
    dropRate: 1.0,
    stoneQuality: "violet",
    notes: "Guaranteed on win.",
  },
  {
    source: "arena_defeat",
    label: "Arena Combat (defeat)",
    dropRate: 0.25,
    stoneQuality: "violet",
    notes: "25% consolation drop on loss. Keeps arena engagement high.",
  },
  {
    source: "terminus_wave",
    label: "Terminus Swarm (wave clear)",
    dropRate: 1.0,
    stoneQuality: "violet",
    notes: "1 per 5 waves. Boss waves drop 3.",
  },
  {
    source: "story_chapter",
    label: "Story Mode (chapter complete)",
    dropRate: 1.0,
    stoneQuality: "violet",
    notes: "2 per chapter, first clear only.",
  },
  {
    source: "story_secret",
    label: "Story Mode (secret found)",
    dropRate: 1.0,
    stoneQuality: "gold",
    notes: "Pre-purified gold stone. Secrets are rare.",
  },
  {
    source: "card_tournament",
    label: "Card Tournament (win)",
    dropRate: 1.0,
    stoneQuality: "violet",
    notes: "Ranked tournaments only.",
  },
  {
    source: "chess_checkmate",
    label: "Chess (checkmate)",
    dropRate: 0.33,
    stoneQuality: "violet",
    notes: "1 per 3 checkmates vs ranked opponent.",
  },

  /* ── Exploration Sources ── */
  {
    source: "exploration_crystal",
    label: "Exploration (data crystal)",
    dropRate: 0.30,
    stoneQuality: "violet",
    notes: "30% chance per data crystal discovered.",
  },

  /* ── Social & Community Sources ── */
  {
    source: "npc_trust_milestone",
    label: "NPC Trust Milestone",
    dropRate: 1.0,
    stoneQuality: "violet",
    notes: "Trust 20, 40, 60, 80, 100 with any NPC. Not subject to weekly cap.",
  },
  {
    source: "governance_vote",
    label: "Governance Vote Participation",
    dropRate: 1.0,
    stoneQuality: "violet",
    notes: "1 per monthly community vote. Not subject to weekly cap.",
  },

  /* ── Dark Sources ── */
  {
    source: "architect_event",
    label: "Architect-Triggered Event",
    dropRate: 1.0,
    stoneQuality: "red",
    notes: "Pre-corrupted red stone. Dropped during special Architect events.",
  },
  {
    source: "betrayal_event",
    label: "Betrayal Event",
    dropRate: 1.0,
    stoneQuality: "red",
    notes: "Pre-corrupted red stone. Awarded when an apprentice betrays.",
  },

  /* ── Special Sources ── */
  {
    source: "eyes_surveillance",
    label: "The Eyes' Surveillance",
    dropRate: 1.0,
    stoneQuality: "gold",
    notes: "Pre-purified gold stone. Only available if the Eyes have been resurrected.",
  },
  {
    source: "daily_login",
    label: "Daily Login Bonus",
    dropRate: 0.10,
    stoneQuality: "violet",
    notes: "10% chance on daily login. Not subject to weekly cap.",
  },
];

/** Sources subject to the weekly 15-stone soft cap */
export const COMBAT_SOURCES = new Set([
  "arena_victory",
  "arena_defeat",
  "terminus_wave",
  "card_tournament",
  "chess_checkmate",
  "exploration_crystal",
]);

/* ─── CORRUPTION TIERS ─── */

export const CORRUPTION_TIERS: CorruptionTierEffect[] = [
  {
    tier: 0,
    minLevel: 0,
    maxLevel: 10,
    name: "Whispers in the Walls",
    description:
      "Faint corruption stirs at the edges. Ambient flavor text shifts. The Hierarchy watches from a distance.",
    effects: [
      "Faint red shimmer on walls occasionally",
      "Whisper sound effects in quiet areas",
      "The Necromancer comments on ambient corruption",
      "Shadow Tongue edits appear at 1% frequency in public text",
    ],
  },
  {
    tier: 1,
    minLevel: 10,
    maxLevel: 25,
    name: "The Hierarchy Takes Notice",
    description:
      "Syl'Vex appears as a holographic NPC offering community-wide 'deals' — tempting but costly.",
    effects: [
      "Syl'Vex hologram appears in the Trade Hub",
      "Hierarchy-themed daily micro-votes",
      "Red tint on the Governance Hub Pulse panel",
      "The Antiquarian's Chronicle entries mention growing darkness",
      "Shadow Tongue edits appear at 5% frequency",
    ],
  },
  {
    tier: 2,
    minLevel: 25,
    maxLevel: 50,
    name: "Corporate Restructuring",
    description:
      "Hierarchy-themed events trigger automatically. NPC dialog shifts. The Castle of Death expands.",
    effects: [
      "Weekly Hierarchy invasion mini-events",
      "NPC dialog includes Hierarchy references",
      "Castle of Death gains new rooms",
      "Corruption visual overlay on the Medical Bay",
      "Shadow Tongue edits at 15% frequency — subtle lore rewrites",
      "The Antiquarian grows quieter, his entries shorter",
    ],
  },
  {
    tier: 3,
    minLevel: 50,
    maxLevel: 75,
    name: "Hostile Acquisition",
    description:
      "The Hierarchy attempts to 'acquire' the Ark. Weekly defense events. The Antiquarian is visibly distressed.",
    effects: [
      "Weekly community defense events",
      "Hierarchy logos appear on Ark walls",
      "NPC dialog becomes stressed and fearful",
      "Community vote results padded up to 10% toward Hierarchy-favored outcomes",
      "Shadow Tongue edits at 30% frequency — overt propaganda",
      "Purity meter cannot exceed 50% while at this tier",
    ],
  },
  {
    tier: 4,
    minLevel: 75,
    maxLevel: 100,
    name: "Under New Management",
    description:
      "The Ark's visual theme shifts to Hierarchy aesthetic. Mol'Garath's voice on intercom. REVERSIBLE with massive community effort.",
    effects: [
      "Full Hierarchy visual theme override — red lighting, corporate logos",
      "Mol'Garath intercom announcements",
      "All NPC dialogs infected with corporate speak",
      "Community votes can be overridden by the Hierarchy AI",
      "Shadow Tongue edits at 50% frequency — half of all public text is rewritten",
      "A door appears in the Castle of Death — stairs descending to the Abyss (Year Two hook)",
    ],
  },
];

/* ─── PURITY TIERS ─── */

export const PURITY_TIERS: PurityTierEffect[] = [
  {
    tier: 0,
    minLevel: 0,
    maxLevel: 10,
    name: "The Faintest Light",
    description:
      "Subtle golden glow in the Medical Bay. The Dreamer stirs in her sleep.",
    effects: [
      "Golden glow in Medical Bay",
      "Purification Chamber hums softly",
      "The Antiquarian mentions hope in his Chronicle entries",
    ],
  },
  {
    tier: 1,
    minLevel: 10,
    maxLevel: 25,
    name: "The Dreamer Stirs",
    description:
      "The Dreamer's shield on the star map brightens. Shield fluctuation events become less damaging.",
    effects: [
      "Star map shield brightens visibly",
      "Shield fluctuation damage reduced by 25%",
      "Golden motes float in the Observation Deck",
      "The Antiquarian offers bonus dialog and lore fragments",
    ],
  },
  {
    tier: 2,
    minLevel: 25,
    maxLevel: 50,
    name: "Harmonic Convergence",
    description:
      "The Observation Deck plays songs from the Dreamer herself. New music. Healing improves.",
    effects: [
      "New music tracks unlock — the Dreamer's compositions",
      "All healing increased by 15%",
      "Purification success rate increased by 5% (now 90%)",
      "Weekly Soul Stone soft cap increased by 2",
      "The Antiquarian writes longer, more hopeful entries",
    ],
  },
  {
    tier: 3,
    minLevel: 50,
    maxLevel: 75,
    name: "The Light Holds",
    description:
      "Global defense buff. The Ark itself is healthier. The Dreamer's heartbeat becomes audible.",
    effects: [
      "Global defense +10% for all players",
      "Terminus Swarm difficulty reduced by 10%",
      "Shield never falls below 50%",
      "Divine companion abilities boosted by 10%",
      "The Dreamer's heartbeat becomes audible in the Medical Bay",
    ],
  },
  {
    tier: 4,
    minLevel: 75,
    maxLevel: 100,
    name: "The Dreamer Wakes",
    description:
      "The Dreamer sends a direct message. The community chooses the question. She answers. Cannot happen if corruption exceeds 50%.",
    effects: [
      "The Dreamer speaks — community chooses the question, she answers",
      "All companions gain +10% effectiveness",
      "Purification never fails (100% success rate)",
      "Every player receives a shared dream — Year Two's opening cinematic",
      "The Antiquarian weeps for the first time in five Ages",
      "Corruption is actively pushed back at 2% per week",
    ],
  },
];

/* ─── PURIFICATION SETTINGS ─── */

export const PURIFICATION_CONFIG = {
  /** Duration of a single purification attempt in milliseconds (24 hours) */
  durationMs: 24 * 60 * 60 * 1000,
  /** Dream Token cost per purification attempt */
  tokenCost: 100,
  /** Base success rate (85%) */
  successRate: 0.85,
  /** Default max concurrent purifications */
  maxConcurrentDefault: 1,
  /** Max concurrent at Antiquarian trust level 60 */
  maxConcurrentTrust60: 2,
  /** Max concurrent at Antiquarian trust level 80 */
  maxConcurrentTrust80: 3,
} as const;

/* ─── GLOBAL ECONOMY CONSTANTS ─── */

/** Maximum Soul Stones acquirable per week before diminishing returns */
export const WEEKLY_SOFT_CAP = 15;

/** Corruption decays at 1% per week naturally */
export const CORRUPTION_DECAY_RATE = 0.01;

/** 2 successful purifications remove 1 point of global corruption */
export const REDEMPTION_RATIO = 2;

/* ─── TIER LOOKUP HELPERS ─── */

export function getCorruptionTier(level: number): CorruptionTierEffect {
  return (
    CORRUPTION_TIERS.find((t) => level >= t.minLevel && level < t.maxLevel) ??
    CORRUPTION_TIERS[0]
  );
}

export function getPurityTier(level: number): PurityTierEffect {
  return (
    PURITY_TIERS.find((t) => level >= t.minLevel && level < t.maxLevel) ??
    PURITY_TIERS[0]
  );
}
