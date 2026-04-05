/* ═══════════════════════════════════════════════════════
   CODEX LORE EXTENSIONS

   Surfaces lore from orphaned game modules as discoverable
   Codex entries. CodexPage imports and merges these with its
   core entries.

   Each entry lazily derives its content from the source module's
   data, so updating the source data automatically updates the
   codex.
   ═══════════════════════════════════════════════════════ */

import type { ReactNode } from "react";
import { EXTINCT_RACES } from "./extinctRaces";
import { COLLECTORS_ARENA_LORE } from "./arenaWorldLore";
import { ARCHONS, NEYONS } from "./loreData";

export interface CodexLoreExtension {
  id: string;
  title: string;
  category: "the_struggle" | "architect" | "dreamer" | "cades" | "multiverse" | "factions" | "artifacts" | "classified";
  content: string;
  unlockCondition: string;
  unlockRequirement: number;
  rarity: "common" | "uncommon" | "rare" | "legendary" | "classified";
  /** Source module — so we can trace where content came from */
  sourceModule: string;
}

/* ─── EXTINCT RACES ─── */

const extinctRaceEntries: CodexLoreExtension[] = EXTINCT_RACES.map((race, i) => ({
  id: `extinct_${race.id}`,
  title: race.name,
  category: "multiverse",
  content: [
    race.aesthetic,
    "",
    `Homeworld: ${race.homeworld}`,
    `Era: ${race.era}`,
    `Extinction: ${race.extinction}`,
    `Known Remnants: ${race.remnants.length}`,
    "",
    "REMNANTS RECOVERED:",
    ...race.remnants.slice(0, 3).map(r => `• ${r.name} — ${r.description}`),
  ].join("\n"),
  unlockCondition: `Discover one remnant of ${race.name}`,
  unlockRequirement: 2 + i,
  rarity: i === 0 ? "legendary" : "rare",
  sourceModule: "extinctRaces",
}));

/* ─── COLLECTOR'S ARENA ─── */

const arenaEntry: CodexLoreExtension = {
  id: "arena_collectors_world",
  title: "The Collector's World",
  category: "cades",
  content: [
    COLLECTORS_ARENA_LORE.purpose,
    "",
    `Location: ${COLLECTORS_ARENA_LORE.location}`,
    `Operator: ${COLLECTORS_ARENA_LORE.operator}`,
    "",
    COLLECTORS_ARENA_LORE.tagline,
  ].join("\n"),
  unlockCondition: "Enter the Collector's Arena",
  unlockRequirement: 3,
  rarity: "rare",
  sourceModule: "arenaWorldLore",
};

/* ─── ARCHONS (12) ─── */

const archonEntries: CodexLoreExtension[] = ARCHONS.slice(0, 12).map((archon, i) => ({
  id: `archon_${archon.id}`,
  title: `Archon ${archon.number}: ${archon.name}`,
  category: "factions",
  content: [
    archon.appearance,
    "",
    `Domain: ${archon.domain}`,
    `Year Created: ${archon.yearCreated}`,
    `Status: ${archon.status}`,
    archon.celebrationAlias ? `Celebration Alias: ${archon.celebrationAlias}` : "",
    archon.destroyedBy ? `Destroyed By: ${archon.destroyedBy}` : "",
  ].filter(Boolean).join("\n"),
  unlockCondition: i === 11 ? "Complete Chapter 12" : `Reach Archon ${archon.number} in Story Mode`,
  unlockRequirement: i,
  rarity: i === 11 ? "legendary" : i >= 8 ? "rare" : "uncommon",
  sourceModule: "loreData",
}));

/* ─── NE-YONS (1/1s) ─── */

const neyonEntries: CodexLoreExtension[] = NEYONS.slice(0, 5).map((ny, i) => ({
  id: `neyon_${ny.id}`,
  title: `Ne-Yon #${i + 1}: ${ny.name}`,
  category: "classified",
  content: [
    ny.appearance,
    "",
    `Era: ${ny.era}`,
    `Year Appeared: ${ny.yearAppeared}`,
    `Status: ${ny.status}`,
    `Domain: ${ny.domain}`,
    "",
    "Psychology:",
    ny.psychology,
    "",
    "Ne-Yons are 1/1 hybrid identities. Only 10 exist across all timelines.",
    "Each one carries fragments of both DeMagi and Quarchon lineages,",
    "and can attune to any elemental or dimensional force.",
  ].join("\n"),
  unlockCondition: "Own the corresponding Potential",
  unlockRequirement: 10,
  rarity: "legendary",
  sourceModule: "loreData",
}));

/* ─── SYSTEM LORE ENTRIES ─── */

const systemLoreEntries: CodexLoreExtension[] = [
  {
    id: "system_awakening_ceremonies",
    title: "Awakening Ceremonies",
    category: "cades",
    content: [
      "Every level you cross is witnessed. The Ark's systems log your",
      "neural shifts. At milestones (5, 10, 15, 20, 25, 30, 35, 40, 45, 50),",
      "a mentor NPC appears to witness your becoming and mark it with a gift.",
      "",
      "At Thresholds (10, 25, 50), the WHOLE community feels your rise —",
      "every player sees an announcement. You become canon, person by person.",
      "",
      "XP alone is insufficient. Each Threshold has an in-world gate: a",
      "trust choice, a completed relationship arc, a witnessed ending.",
      "Leveling is a QUEST.",
    ].join("\n"),
    unlockCondition: "Cross your first Threshold (Level 10)",
    unlockRequirement: 10,
    rarity: "rare",
    sourceModule: "levelingAsEvent",
  },
  {
    id: "system_necromancer_return",
    title: "The Necromancer's Return Cycle",
    category: "classified",
    content: [
      "Every time a Potential dies aboard an Ark, the death is recorded.",
      "When the cumulative death count crosses a threshold, the",
      "Necromancer manifests — a resurrection-echo NPC who arrives to",
      "call the dead back.",
      "",
      "The cycle has four stages:",
      "  • DORMANT — accumulating death-energy silently",
      "  • MANIFESTING — the Community feels presence stir",
      "  • RETURNED — Necromancer active, resurrection quests available",
      "  • BANISHED — Community action pushes them back to Dormant",
      "",
      "The Necromancer is not evil. They are the universe's undo button.",
    ].join("\n"),
    unlockCondition: "Witness your first community Necromancer event",
    unlockRequirement: 20,
    rarity: "legendary",
    sourceModule: "necromancerCycle",
  },
  {
    id: "system_living_universe",
    title: "Emergent Community Events",
    category: "multiverse",
    content: [
      "The Dischordian multiverse responds to its players. Five known",
      "emergent events arise from collective player behavior:",
      "",
      "  • Community deaths → Necromancer's Return",
      "  • Community betrayals → Architect's Audit",
      "  • Community mercy → Dreamer's Bloom",
      "  • Community trade → New Babylon's Summit",
      "  • Community war → Insurgency's Call",
      "",
      "No single player can trigger these alone. The universe watches",
      "what everyone does, and responds.",
    ].join("\n"),
    unlockCondition: "Participate in any live community event",
    unlockRequirement: 5,
    rarity: "rare",
    sourceModule: "livingUniverseEvents",
  },
  {
    id: "system_companion_bonds",
    title: "Companion Bonding",
    category: "dreamer",
    content: [
      "Specimens bond with you across a 0-100 scale. At Bond 20, they",
      "speak their first uncommanded thought. At Bond 50, they share a",
      "secret. At Bond 80, they offer their life for yours.",
      "",
      "Companions evolve visually at bond thresholds. They may die in",
      "combat — permanently, if you let them. They may disagree with",
      "your choices, gaining morality dissonance. If dissonance exceeds",
      "40, they leave.",
      "",
      "BioWare-style. Mass Effect-depth. You are accountable to them.",
    ].join("\n"),
    unlockCondition: "Recruit your first companion",
    unlockRequirement: 1,
    rarity: "uncommon",
    sourceModule: "petBonding",
  },
  {
    id: "system_pet_arena",
    title: "Pet Spectator Arena",
    category: "cades",
    content: [
      "Specimens fight each other in the Arena of Small Things. Three",
      "tiers exist: Bronze, Silver, Gold. Injuries carry between matches.",
      "Death is possible. Trainers bet Dream tokens on outcomes.",
      "",
      "Your pet's combat style emerges from their bond level, their",
      "species, and your training. Over time, they develop their own",
      "fighting identity — separate from your own.",
    ].join("\n"),
    unlockCondition: "Watch a Pet Arena match",
    unlockRequirement: 4,
    rarity: "common",
    sourceModule: "petBattles",
  },
  {
    id: "system_degen_casino",
    title: "Degen's Casino",
    category: "multiverse",
    content: [
      "An intergalactic gambling station in Ne-Yon space. Stakes are",
      "Dream tokens — the currency of unrealized potential. Games",
      "include Pazaak-style card duels, dice of probability, and the",
      "Roulette of Realities.",
      "",
      "The house always wins — except when a Ne-Yon sits at the table.",
      "Ne-Yons can see across probability fields, which is why the",
      "Collector Clone-007 both courts them and bans them.",
    ].join("\n"),
    unlockCondition: "Enter Degen's Casino",
    unlockRequirement: 5,
    rarity: "uncommon",
    sourceModule: "degensCasino",
  },
  {
    id: "system_failure_content",
    title: "What Failure Teaches",
    category: "the_struggle",
    content: [
      "Ten lore fragments exist in the Archive that can ONLY be unlocked",
      "by failing. Fail a trust check, fail a puzzle, fail a combat",
      "encounter — and the world reveals something it would never tell",
      "the competent.",
      "",
      "Success hides truth. Failure is the Dreamer's classroom.",
    ].join("\n"),
    unlockCondition: "Fail any major check",
    unlockRequirement: 1,
    rarity: "rare",
    sourceModule: "failureContent",
  },
];

/* ─── COMBINED EXPORT ─── */

export const CODEX_LORE_EXTENSIONS: CodexLoreExtension[] = [
  ...extinctRaceEntries,
  arenaEntry,
  ...archonEntries,
  ...neyonEntries,
  ...systemLoreEntries,
];

export function getExtensionEntryCount(): number {
  return CODEX_LORE_EXTENSIONS.length;
}
