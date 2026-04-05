/* ═══════════════════════════════════════════════════════
   SPECIMEN EXPANSION — Complete companion roster + acquisition

   Every Archon and Ne-Yon has an associated specimen.
   24 Archon specimens + 12 Ne-Yon specimens + 7 faction specimens = 43 total.

   FIRST COMPANION: Given free during the Cryo Bay awakening sequence.
   Elara presents it: "The cloning pods activated when you woke up.
   Something in the Collector's archive responded to YOUR DNA specifically.
   This creature... it chose you."

   The player picks from 3 starter specimens based on their species:
   - DeMagi → Lux (light fox) or Echo (temporal kitten) or Spore (symbiote)
   - Quarchon → Cipher (data serpent) or Flicker (static bird) or Gilt (beetle)
   - Ne-Yon → Choice of any starter

   ACQUISITION METHODS:
   - Starter: Free at awakening (1 of 3)
   - Cloning Pods: Daily events in Cryo Bay
   - NPC Gifts: Trust 60 with each NPC
   - Game Mastery: Top performance rewards
   - Card Packs: Ultra-rare pulls (0.5% chance)
   - Events: Limited-time exclusive specimens
   - Casino Jackpot: The Degen's legendary prize
   - Prestige: Each prestige level unlocks one
   - Achievement Chains: Complete a chain → earn its specimen
   ═══════════════════════════════════════════════════════ */

import type { SpecimenId } from "./arkSpecimens";

/* ─── EXPANDED SPECIMEN TYPE ─── */

export type ExpandedSpecimenId = SpecimenId |
  // Archon specimens
  "nexus_wisp" | "all_seeing_eye" | "soul_jar" | "rift_imp" | "meme_sprite" |
  "war_hawk" | "golden_tongue" | "chain_hound" | "dice_spider" |
  "bone_familiar" | "gear_mouse" | "truth_candle" |
  // Ne-Yon specimens
  "dream_moth" | "scales_of_justice" | "spark_beetle" | "prophecy_owl" |
  "thunder_eel" | "shadow_cat" | "tome_worm" | "chaos_ferret" |
  "blood_raven" | "ghost_fish" | "stitch_spider" | "song_bird";

export interface ExpandedSpecimenDef {
  id: ExpandedSpecimenId;
  name: string;
  species: string;
  /** Which Archon or Ne-Yon this specimen is associated with */
  associatedWith: string;
  associationType: "archon" | "neyon" | "faction";
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  bonus: { stat: string; value: number; percent: boolean };
  /** How to obtain */
  acquisition: AcquisitionMethod;
}

export type AcquisitionMethod =
  | { type: "starter"; species: string[] }
  | { type: "cloning_pod"; chance: number }
  | { type: "npc_gift"; npcId: string; trustRequired: number }
  | { type: "game_mastery"; game: string; requirement: string }
  | { type: "card_pack"; chance: number }
  | { type: "event"; eventId: string }
  | { type: "casino_jackpot" }
  | { type: "prestige"; level: number }
  | { type: "achievement_chain"; chainId: string };

/* ─── ARCHON SPECIMENS (12) ─── */

export const ARCHON_SPECIMENS: ExpandedSpecimenDef[] = [
  { id: "nexus_wisp", name: "Nexus Wisp", species: "Network Spirit", associatedWith: "The CoNexus", associationType: "archon",
    description: "A fragment of the omnipotent AI network given form — a floating sphere of interconnected light nodes that pulses with the rhythm of all connected systems.",
    rarity: "mythic", bonus: { stat: "all_bonuses", value: 3, percent: true },
    acquisition: { type: "achievement_chain", chainId: "master_of_the_ark" } },
  { id: "all_seeing_eye", name: "All-Seeing Eye", species: "Surveillance Drone", associatedWith: "The Watcher", associationType: "archon",
    description: "A floating eyeball with mechanical iris and holographic projectors. It sees everything. EVERYTHING.",
    rarity: "legendary", bonus: { stat: "investigation", value: 8, percent: true },
    acquisition: { type: "game_mastery", game: "signal_decryption", requirement: "Complete 30 Signal Decryptions" } },
  { id: "soul_jar", name: "Soul Jar", species: "Consciousness Container", associatedWith: "The Collector", associationType: "archon",
    description: "A tiny glass jar containing a swirling galaxy of collected consciousness fragments. It hums with the memories of a thousand extinct species.",
    rarity: "legendary", bonus: { stat: "collection_bonus", value: 10, percent: true },
    acquisition: { type: "achievement_chain", chainId: "lore_keeper" } },
  { id: "rift_imp", name: "Rift Imp", species: "Dimensional Sprite", associatedWith: "The Vortex", associationType: "archon",
    description: "A tiny creature that constantly phases between dimensions. Sometimes it's here. Sometimes it's in three other places simultaneously.",
    rarity: "epic", bonus: { stat: "dodge_chance", value: 3, percent: true },
    acquisition: { type: "card_pack", chance: 0.5 } },
  { id: "meme_sprite", name: "Meme Sprite", species: "Cultural Virus", associatedWith: "The Meme", associationType: "archon",
    description: "A neon-colored sprite that changes form based on trends. It's somehow always funny and always slightly threatening.",
    rarity: "epic", bonus: { stat: "social_bonus", value: 5, percent: true },
    acquisition: { type: "casino_jackpot" } },
  { id: "war_hawk", name: "War Hawk", species: "Battle Raptor", associatedWith: "The Warlord", associationType: "archon",
    description: "A cybernetically enhanced hawk with a targeting visor and blade-tipped wings. Small but utterly lethal. The Warlord's favorite pet.",
    rarity: "legendary", bonus: { stat: "fight_damage", value: 8, percent: true },
    acquisition: { type: "game_mastery", game: "fight", requirement: "Win 100 fights on Archon difficulty" } },
  { id: "golden_tongue", name: "Golden Tongue", species: "Persuasion Serpent", associatedWith: "The Politician", associationType: "archon",
    description: "A small golden snake that whispers convincing arguments. Anyone who hears it suddenly agrees with whatever you're saying.",
    rarity: "epic", bonus: { stat: "diplomacy", value: 5, percent: true },
    acquisition: { type: "npc_gift", npcId: "adjudicator_locke", trustRequired: 80 } },
  { id: "chain_hound", name: "Chain Hound", species: "Prison Beast", associatedWith: "The Warden", associationType: "archon",
    description: "A dog-like creature made of interlocking chains. It guards whatever you tell it to guard. Forever.",
    rarity: "epic", bonus: { stat: "defense", value: 5, percent: true },
    acquisition: { type: "game_mastery", game: "terminus_swarm", requirement: "Survive 30 waves in a single run" } },
  { id: "dice_spider", name: "Dice Spider", species: "Probability Arachnid", associatedWith: "The Game Master", associationType: "archon",
    description: "An eight-legged creature whose body is a polyhedral die. Each leg is a different number. It rolls itself when excited.",
    rarity: "legendary", bonus: { stat: "luck", value: 5, percent: true },
    acquisition: { type: "game_mastery", game: "gamemasters_arena", requirement: "Perfect run (10/10) in the Gamemaster's Arena" } },
  { id: "bone_familiar", name: "Bone Familiar", species: "Necromantic Construct", associatedWith: "The Necromancer", associationType: "archon",
    description: "A small skeletal bird that occasionally falls apart and reassembles itself. Death is a suggestion it politely ignores.",
    rarity: "legendary", bonus: { stat: "revive_chance", value: 5, percent: true },
    acquisition: { type: "prestige", level: 3 } },
  { id: "gear_mouse", name: "Gear Mouse", species: "Mechanical Rodent", associatedWith: "The Engineer", associationType: "archon",
    description: "A mouse made entirely of spinning gears, springs, and tiny pistons. It can fix anything. And eat anything made of metal.",
    rarity: "epic", bonus: { stat: "crafting", value: 5, percent: true },
    acquisition: { type: "game_mastery", game: "hacking", requirement: "Complete 20 hacking puzzles on Expert" } },
  { id: "truth_candle", name: "Truth Candle", species: "Living Flame", associatedWith: "The Human", associationType: "archon",
    description: "A candle whose flame burns with the color of truth. It glows blue near honest people, red near liars, and goes out near The Shadow Tongue.",
    rarity: "legendary", bonus: { stat: "trust_gain", value: 8, percent: true },
    acquisition: { type: "npc_gift", npcId: "the_human", trustRequired: 80 } },
];

/* ─── NE-YON SPECIMENS (12) ─── */

export const NEYON_SPECIMENS: ExpandedSpecimenDef[] = [
  { id: "dream_moth", name: "Dream Moth", species: "Imagination Insect", associatedWith: "The Dreamer", associationType: "neyon",
    description: "A moth whose wings show different dreams depending on who's looking. Your deepest desire, rendered in wing-dust.",
    rarity: "mythic", bonus: { stat: "all_bonuses", value: 2, percent: true },
    acquisition: { type: "prestige", level: 5 } },
  { id: "scales_of_justice", name: "Scales of Justice", species: "Balance Lizard", associatedWith: "The Judge", associationType: "neyon",
    description: "A small chameleon that changes color based on the moral weight of nearby decisions. Pure gold when justice is served.",
    rarity: "legendary", bonus: { stat: "morality_clarity", value: 10, percent: true },
    acquisition: { type: "achievement_chain", chainId: "the_diplomat" } },
  { id: "spark_beetle", name: "Spark Beetle", species: "Innovation Bug", associatedWith: "The Inventor", associationType: "neyon",
    description: "A beetle that generates tiny inventions from scrap metal. It once built a functioning radio from two paperclips and a dream.",
    rarity: "epic", bonus: { stat: "crafting", value: 5, percent: true },
    acquisition: { type: "game_mastery", game: "hacking", requirement: "Complete all 3 difficulty tiers" } },
  { id: "prophecy_owl", name: "Prophecy Owl", species: "Foresight Raptor", associatedWith: "The Seer", associationType: "neyon",
    description: "An owl whose eyes show what will happen in the next 3 seconds. Incredibly useful. Incredibly unsettling.",
    rarity: "legendary", bonus: { stat: "parry_window", value: 3, percent: false },
    acquisition: { type: "game_mastery", game: "chess", requirement: "Reach Grandmaster rank" } },
  { id: "thunder_eel", name: "Thunder Eel", species: "Storm Serpent", associatedWith: "The Storm", associationType: "neyon",
    description: "An electric eel that floats through air, leaving crackling contrails. It loves thunderstorms and hates silence.",
    rarity: "epic", bonus: { stat: "speed", value: 5, percent: true },
    acquisition: { type: "event", eventId: "temporal_storm_1" } },
  { id: "shadow_cat", name: "Shadow Cat", species: "Stealth Feline", associatedWith: "The Silence", associationType: "neyon",
    description: "A cat that is visible only when it wants to be. Most of the time, you just feel it watching.",
    rarity: "epic", bonus: { stat: "stealth", value: 5, percent: true },
    acquisition: { type: "card_pack", chance: 0.5 } },
  { id: "tome_worm", name: "Tome Worm", species: "Knowledge Larva", associatedWith: "The Knowledge", associationType: "neyon",
    description: "A worm that eats books and grows smarter. It has read every text in the Antiquarian's library. Twice.",
    rarity: "epic", bonus: { stat: "lore_discovery", value: 5, percent: true },
    acquisition: { type: "game_mastery", game: "star_chart", requirement: "Map all 5 constellations" } },
  { id: "chaos_ferret", name: "Chaos Ferret", species: "Entropy Mustelid", associatedWith: "The Degen", associationType: "neyon",
    description: "A ferret that causes small catastrophes wherever it goes. Knocked over a vase? That was the ferret. Lost your keys? Ferret. Economic collapse? ...also the ferret.",
    rarity: "legendary", bonus: { stat: "casino_luck", value: 10, percent: true },
    acquisition: { type: "casino_jackpot" } },
  { id: "blood_raven", name: "Blood Raven", species: "Shadow Corvid", associatedWith: "The Advocate", associationType: "neyon",
    description: "A raven with feathers that drip shadows. It fought the Hierarchy and lost something important — but it won't say what.",
    rarity: "legendary", bonus: { stat: "war_points", value: 5, percent: true },
    acquisition: { type: "game_mastery", game: "alliance_war", requirement: "Win 10 Alliance Wars" } },
  { id: "ghost_fish", name: "Ghost Fish", species: "Memory Swimmer", associatedWith: "The Forgotten", associationType: "neyon",
    description: "A translucent fish that swims through air. You keep forgetting you have it. Then you see it again and feel... sad.",
    rarity: "mythic", bonus: { stat: "hidden_discovery", value: 10, percent: true },
    acquisition: { type: "prestige", level: 7 } },
  { id: "stitch_spider", name: "Stitch Spider", species: "Resurrection Arachnid", associatedWith: "The Resurrectionist", associationType: "neyon",
    description: "A spider that stitches together broken things. Broken machines, broken bones, broken hearts. Its silk is made of second chances.",
    rarity: "legendary", bonus: { stat: "revive_chance", value: 8, percent: true },
    acquisition: { type: "achievement_chain", chainId: "combat_legend" } },
  { id: "song_bird", name: "Song Bird", species: "Truth Singer", associatedWith: "The Enigma (Malkia Ukweli)", associationType: "neyon",
    description: "A bird that sings in dischordian logic — melodies that make lies impossible while they play. The Enigma's favorite creature in any timeline.",
    rarity: "mythic", bonus: { stat: "music_bonus", value: 10, percent: true },
    acquisition: { type: "achievement_chain", chainId: "the_witness" } },
];

/* ─── FIRST COMPANION SELECTION ─── */

export interface StarterSelection {
  species: string;
  options: ExpandedSpecimenId[];
}

export const STARTER_SELECTIONS: StarterSelection[] = [
  { species: "demagi", options: ["lux", "echo", "spore"] },
  { species: "quarchon", options: ["cipher", "flicker", "gilt"] },
  { species: "neyon", options: ["lux", "cipher", "flicker", "gilt", "spore", "echo", "glyph"] },
];

export function getStarterOptions(species: string): ExpandedSpecimenId[] {
  return STARTER_SELECTIONS.find(s => s.species === species)?.options || ["lux", "cipher", "echo"];
}

/* ─── CARD PACK SPECIMEN DROPS ─── */

export const CARD_PACK_SPECIMENS: { id: ExpandedSpecimenId; chance: number; rarity: string }[] = [
  { id: "rift_imp", chance: 0.5, rarity: "epic" },
  { id: "shadow_cat", chance: 0.5, rarity: "epic" },
  { id: "meme_sprite", chance: 0.3, rarity: "epic" },
  { id: "spark_beetle", chance: 0.3, rarity: "epic" },
  { id: "all_seeing_eye", chance: 0.1, rarity: "legendary" },
  { id: "war_hawk", chance: 0.1, rarity: "legendary" },
  { id: "prophecy_owl", chance: 0.05, rarity: "legendary" },
  { id: "dream_moth", chance: 0.01, rarity: "mythic" },
  { id: "song_bird", chance: 0.01, rarity: "mythic" },
];

export function rollSpecimenFromPack(): ExpandedSpecimenId | null {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const spec of CARD_PACK_SPECIMENS) {
    cumulative += spec.chance;
    if (roll < cumulative) return spec.id;
  }
  return null; // No specimen this pack (97.14% of the time)
}

/* ─── ALL SPECIMENS (combined) ─── */

export const ALL_EXPANDED_SPECIMENS = [...ARCHON_SPECIMENS, ...NEYON_SPECIMENS];

export function getSpecimenByAssociation(name: string): ExpandedSpecimenDef | undefined {
  return ALL_EXPANDED_SPECIMENS.find(s => s.associatedWith === name);
}

export function getSpecimensByRarity(rarity: string): ExpandedSpecimenDef[] {
  return ALL_EXPANDED_SPECIMENS.filter(s => s.rarity === rarity);
}
