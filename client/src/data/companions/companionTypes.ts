/* ═══════════════════════════════════════════════════════
   COMPANION SYSTEM — Core Type Definitions
   Covers all 12 Eidolons, Path A/B/C, Soul Bond mechanics
   ═══════════════════════════════════════════════════════ */

export type EidolonSource = "demagi_starter" | "quarchon_starter" | "class_eidolon" | "thought_virus";
export type SeveringPath = "A" | "B" | "C";
export type TransformState = "normal" | "hierarchy_evolved" | "dreamer_evolved";
export type EidolonStage = "fragment" | "companion" | "ascended" | "spectral";
export type EidolonRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
export type HealthState = "healthy" | "hurt" | "critical" | "downed" | "dead";

export interface EidolonConfig {
  id: string;
  name: string;
  source: EidolonSource;
  classLock: string | null;
  howAcquired: string;
  baseElement: string;
  description: string;
}

/** All 12 possible Eidolons */
export const ALL_EIDOLONS: EidolonConfig[] = [
  { id: "lux", name: "Lux", source: "demagi_starter", classLock: null, howAcquired: "Kept at Severing", baseElement: "light", description: "Holographic fox — warm, curious, made of cyan light" },
  { id: "echo", name: "Echo", source: "demagi_starter", classLock: null, howAcquired: "Kept at Severing", baseElement: "time", description: "Temporal kitten — sees multiple timelines, leaves afterimages" },
  { id: "glyph", name: "Glyph", source: "demagi_starter", classLock: null, howAcquired: "Kept at Severing", baseElement: "language", description: "Text moth — wings display quotes, communicates through words" },
  { id: "cipher", name: "Cipher", source: "quarchon_starter", classLock: null, howAcquired: "Kept at Severing", baseElement: "data", description: "Data serpent — algorithmic intelligence, flowing green code" },
  { id: "flicker", name: "Flicker", source: "quarchon_starter", classLock: null, howAcquired: "Kept at Severing", baseElement: "signal", description: "Static bird — made of electromagnetic frequencies, nests in radio" },
  { id: "gilt", name: "Gilt", source: "quarchon_starter", classLock: null, howAcquired: "Kept at Severing", baseElement: "value", description: "Golden beetle — economic processor, shell displays trade data" },
  { id: "auros", name: "Auros", source: "class_eidolon", classLock: "soldier", howAcquired: "Severing Path B/C", baseElement: "valor", description: "Gilded lion — combat companion, disciplined and fierce" },
  { id: "nyx", name: "Nyx", source: "class_eidolon", classLock: "spy", howAcquired: "Severing Path B/C", baseElement: "shadow", description: "Umbral raven — carries Agent Zero's memories in its feathers" },
  { id: "toxis", name: "Toxis", source: "class_eidolon", classLock: "assassin", howAcquired: "Severing Path B/C", baseElement: "venom", description: "Blight frog — patient, precise, lethally quiet" },
  { id: "cog", name: "Cog", source: "class_eidolon", classLock: "engineer", howAcquired: "Severing Path B/C", baseElement: "logic", description: "Lattice golem — self-building, made of interlocking components" },
  { id: "sibyl", name: "Sibyl", source: "class_eidolon", classLock: "oracle", howAcquired: "Severing Path B/C", baseElement: "prophecy", description: "Dreaming owl — eyes show futures, prophetic visions" },
  { id: "strain", name: "Strain", source: "thought_virus", classLock: null, howAcquired: "3rd Terminus visit", baseElement: "virus", description: "Living infection — Thought Virus fragment that chose freedom" },
];

/** Path A Soul-Keeper: player keeps starter */
export interface StarterEidolonState {
  speciesId: string;
  baseEffectiveness: number;       // starts at 0.70
  currentEffectiveness: number;    // increases 3% per quest chapter
  maxEffectiveness: number;        // 0.85 at chapter 5
  questChapter: number;            // 0-5
  soulKeeperTitle: boolean;
  goldenThreadVFX: boolean;
  loyaltyResonance: number;        // +5% bond gain
  isOriginalStarter: true;
  memories: string[];              // unlocked quest memories
}

/** Severing choices */
export interface SeveringChoice {
  path: SeveringPath;
  label: string;
  description: string;
  consequence: string;
  necromancerDialog: string;
}

export const SEVERING_CHOICES: SeveringChoice[] = [
  {
    path: "A",
    label: "Keep My Bond",
    description: "Refuse the class Eidolon. Keep your original companion. The harder path. The better path.",
    consequence: "Starter becomes Eidolon at 70% effectiveness. 'Bond That Held' quest chain unlocks. Soul-Keeper title earned.",
    necromancerDialog: "See pathANarrative.ts for full dialog",
  },
  {
    path: "B",
    label: "Accept the Class Eidolon",
    description: "Sever the starter bond. Accept the purpose-built companion. The optimal choice. The colder choice.",
    consequence: "Class Eidolon at 100% effectiveness. Starter returns to specimen slot. Bond memory lingers.",
    necromancerDialog: `The Necromancer nods. "The practical choice. I designed the class Eidolons to be superior. They are. [pause] Your starter will be returned to the specimen registry. It will be cared for. It will not be bonded. It will not understand why." [He does not look at you.] "This is how the Archons did it. Every one."`,
  },
  {
    path: "C",
    label: "Walk Away",
    description: "Refuse both. No Eidolon. No bond. Alone. The loneliest path. The freest.",
    consequence: "No active Eidolon. Eidolon slot remains empty. Unique 'Unbonded' dialog from all NPCs.",
    necromancerDialog: `The Necromancer stares. Then he laughs — genuinely, for the first time. "Nobody's ever done that before. Not in three thousand years of designing this system. You don't want EITHER?" [He takes off his goggles. Puts them back on.] "I respect that more than I should. The empty slot is... a statement. It says: 'I don't need to own a soul to have one.' [pause] The Dreamer would have liked you."`,
  },
];

/** Art asset count summary */
export const COMPANION_ART_SUMMARY = {
  starterNormal: 18,           // 6 × 3 stages
  starterHierarchy: 18,        // 6 × 3 stages
  starterDreamer: 18,          // 6 × 3 stages
  starterScarred: 6,           // 6 × 1
  sporeNormal: 4,              // 3 stages + legendary
  classNormal: 15,             // 5 × 3 stages
  classHierarchy: 15,          // 5 × 3 stages
  classDreamer: 15,            // 5 × 3 stages
  classScarred: 5,             // 5 × 1
  strainForms: 12,             // 4 × 3 stages
  strainScarred: 1,
  spectralForms: 13,           // all 12 + Spore
  soulStones: 3,
  demonPets: 10,
  divineCompanions: 6,
  dischordianCompanions: 3,
  rooms: 3,
  soulFusionVFX: 12,
  goldenThreadVFX: 6,
  total: 183,
} as const;
