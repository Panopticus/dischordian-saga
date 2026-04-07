/* ═══════════════════════════════════════════════════════
   SOUL STONE SYSTEM — Configuration & Drop Tables
   ═══════════════════════════════════════════════════════ */

import type { SoulStoneDropEntry, CorruptionTierEffect, PurityTierEffect } from "./types";

/* ─── PURIFICATION CONFIG ─── */

export const PURIFICATION_CONFIG = {
  durationMs: 24 * 60 * 60 * 1000,   // 24 real hours
  tokenCost: 100,                      // Dream Tokens consumed
  successRate: 0.85,                   // 85% success, 15% failure
  maxConcurrentDefault: 1,             // base concurrent purifications
  maxConcurrentTrust60: 2,             // at Antiquarian Trust 60
  maxConcurrentTrust80: 3,             // at Antiquarian Trust 80
} as const;

/** Weekly soft cap for combat/exploration stone drops */
export const WEEKLY_SOFT_CAP = 15;

/** Corruption decays 1% per week naturally */
export const CORRUPTION_DECAY_RATE = 0.01;

/** 2 successful purifications remove 1 Corruption Point */
export const REDEMPTION_RATIO = 2;

/* ─── DROP TABLE ─── */

export const DROP_TABLE: SoulStoneDropEntry[] = [
  { source: "arena_victory", label: "Arena Combat (victory)", dropRate: 1.0, stoneQuality: "violet", notes: "Guaranteed on win" },
  { source: "arena_defeat", label: "Arena Combat (defeat)", dropRate: 0.25, stoneQuality: "violet", notes: "25% consolation drop" },
  { source: "terminus_wave", label: "Terminus Swarm (wave clear)", dropRate: 1.0, stoneQuality: "violet", notes: "1 per 5 waves, boss waves drop 3" },
  { source: "story_chapter", label: "Story Mode (chapter)", dropRate: 1.0, stoneQuality: "violet", notes: "2 per chapter, first clear only" },
  { source: "story_secret", label: "Story Mode (secret found)", dropRate: 1.0, stoneQuality: "gold", notes: "Pre-purified! Secrets are rare" },
  { source: "card_tournament", label: "Card Tournament (win)", dropRate: 1.0, stoneQuality: "violet", notes: "Ranked tournaments only" },
  { source: "chess_checkmate", label: "Chess (checkmate)", dropRate: 0.33, stoneQuality: "violet", notes: "1 per 3 checkmates vs ranked" },
  { source: "exploration_crystal", label: "Exploration (data crystal)", dropRate: 0.30, stoneQuality: "violet", notes: "30% chance per crystal" },
  { source: "npc_trust_milestone", label: "NPC Trust Milestone", dropRate: 1.0, stoneQuality: "violet", notes: "Trust 20, 40, 60, 80, 100 — uncapped" },
  { source: "governance_vote", label: "Governance Vote", dropRate: 1.0, stoneQuality: "violet", notes: "1 per monthly vote — uncapped" },
  { source: "architect_event", label: "Architect-Triggered Event", dropRate: 1.0, stoneQuality: "red", notes: "Pre-corrupted! Special events" },
  { source: "betrayal_event", label: "Betrayal Event", dropRate: 1.0, stoneQuality: "red", notes: "Pre-corrupted! When apprentice betrays" },
  { source: "eyes_surveillance", label: "The Eyes' Surveillance", dropRate: 1.0, stoneQuality: "gold", notes: "Pre-purified! Only if Eyes resurrected" },
  { source: "daily_login", label: "Daily Login Bonus", dropRate: 0.10, stoneQuality: "violet", notes: "10% chance on daily login — uncapped" },
];

/** Sources subject to the weekly 15-stone cap */
export const COMBAT_SOURCES = new Set([
  "arena_victory", "arena_defeat", "terminus_wave", "card_tournament",
  "chess_checkmate", "exploration_crystal",
]);

/* ─── CORRUPTION TIER EFFECTS ─── */

export const CORRUPTION_TIERS: CorruptionTierEffect[] = [
  {
    tier: 0, minLevel: 0, maxLevel: 10,
    name: "Whispers in the Walls",
    description: "Ambient flavor text, minor visual effects. The Hierarchy watches from a distance.",
    effects: ["Faint red shimmer on walls occasionally", "Whisper sound effects in quiet areas", "The Necromancer comments on the ambient corruption"],
  },
  {
    tier: 1, minLevel: 10, maxLevel: 25,
    name: "The Hierarchy Takes Notice",
    description: "Syl'Vex appears as a holographic NPC offering community-wide 'deals' — tempting but costly.",
    effects: ["Syl'Vex hologram appears in Trade Hub", "Hierarchy-themed daily micro-votes", "Red tint on the Governance Hub Pulse panel", "The Antiquarian's Chronicle entries mention growing darkness"],
  },
  {
    tier: 2, minLevel: 25, maxLevel: 50,
    name: "Corporate Restructuring",
    description: "Hierarchy-themed events trigger automatically. NPC dialog shifts. The Castle of Death expands.",
    effects: ["Weekly Hierarchy invasion mini-events", "NPC dialog includes Hierarchy references", "Castle of Death gains new rooms", "Corruption visual overlay on the Medical Bay", "The Meme broadcasts about it: 'The numbers are concerning, frens'"],
  },
  {
    tier: 3, minLevel: 50, maxLevel: 75,
    name: "Hostile Acquisition",
    description: "The Hierarchy attempts to 'acquire' the Ark. Weekly defense events. The Antiquarian is visibly distressed.",
    effects: ["Weekly defense events (community challenge)", "Hierarchy logos appear on Ark walls", "NPC dialog becomes stressed", "The Antiquarian's entries shorten — he writes less", "Purity meter cannot exceed 50% while at this tier"],
  },
  {
    tier: 4, minLevel: 75, maxLevel: 100,
    name: "Under New Management",
    description: "The Ark's visual theme shifts to Hierarchy aesthetic. Red tint. Corporate logos. Mol'Garath's voice on intercom. REVERSIBLE with massive community effort.",
    effects: ["Full Hierarchy visual theme override", "Mol'Garath intercom announcements", "Red lighting throughout the Ark", "All NPC dialogs infected with corporate speak", "A door appears in the Castle of Death — stairs descending to the Abyss (Year Two hook)"],
  },
];

/* ─── PURITY TIER EFFECTS ─── */

export const PURITY_TIERS: PurityTierEffect[] = [
  {
    tier: 0, minLevel: 0, maxLevel: 10,
    name: "The Faintest Light",
    description: "Subtle golden glow in the Medical Bay. The Dreamer stirs in her sleep.",
    effects: ["Golden glow in Medical Bay", "Purification Chamber hums softly", "The Antiquarian mentions hope in his entries"],
  },
  {
    tier: 1, minLevel: 10, maxLevel: 25,
    name: "The Dreamer Stirs",
    description: "The Dreamer's shield on the star map brightens. Shield fluctuation events become less damaging.",
    effects: ["Star map shield brightens visibly", "Shield fluctuation damage -25%", "Golden motes float in the Observation Deck", "Elara reports improved shield harmonics"],
  },
  {
    tier: 2, minLevel: 25, maxLevel: 50,
    name: "Harmonic Convergence",
    description: "The Observation Deck plays songs not in the existing catalog. New music. From the Dreamer herself.",
    effects: ["New music tracks unlock (Dreamer's compositions)", "All healing +15%", "Purification success rate +5% (now 90%)", "The Antiquarian writes longer, more hopeful entries"],
  },
  {
    tier: 3, minLevel: 50, maxLevel: 75,
    name: "The Light Holds",
    description: "Global defense buff. Terminus Swarm difficulty -10%. The Ark itself is healthier.",
    effects: ["Global defense +10% for all players", "Terminus difficulty -10%", "Shield never falls below 50%", "Ne-Yon communication clarity improves", "The Dreamer's heartbeat becomes audible in the Medical Bay"],
  },
  {
    tier: 4, minLevel: 75, maxLevel: 100,
    name: "The Dreamer Wakes",
    description: "The Dreamer sends a direct message through the purification chamber. One sentence. The community chooses the question. She answers. CANNOT HAPPEN IF CORRUPTION IS ABOVE 50%.",
    effects: ["The Dreamer speaks — community chooses the question", "All companions gain +10% effectiveness", "Purification never fails (100% success)", "Every player receives a shared dream — Year Two's opening cinematic", "The Antiquarian weeps for the first time in five Ages"],
  },
];

/* ─── TIER LOOKUP HELPERS ─── */

export function getCorruptionTier(level: number): CorruptionTierEffect {
  return CORRUPTION_TIERS.find(t => level >= t.minLevel && level < t.maxLevel)
    ?? CORRUPTION_TIERS[0];
}

export function getPurityTier(level: number): PurityTierEffect {
  return PURITY_TIERS.find(t => level >= t.minLevel && level < t.maxLevel)
    ?? PURITY_TIERS[0];
}
