/**
 * ═══════════════════════════════════════════════════════
 * SEASON 1 CARD GENERATOR — The Dischordian Saga
 * Maps all loredex entries to playable cards with
 * lore-accurate stats, elements, keywords, and abilities
 * ═══════════════════════════════════════════════════════
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const loredexPath = path.join(__dirname, "..", "client", "src", "data", "loredex-data.json");
const outputPath = path.join(__dirname, "..", "client", "src", "data", "season1-cards.json");

const loredex = JSON.parse(fs.readFileSync(loredexPath, "utf-8"));
const entries = loredex.entries;
const relationships = loredex.relationships || [];

// ── Faction/Alignment Mapping ──
const ARCHITECT_AFFILIATIONS = [
  "archons", "ai empire", "archon", "project celebration",
  "mechronis academy", "supreme arbiter", "clone army",
];
const DREAMER_AFFILIATIONS = [
  "insurgency", "ne-yon", "ne-yons", "thaloria",
  "council of harmony", "potentials", "the potentials",
];
const CHAOS_AFFILIATIONS = [
  "hierarchy of the damned", "syndicate of death",
  "terminus swarm", "thought virus", "source",
];

function getAlignment(entry) {
  const aff = (entry.affiliation || "").toLowerCase();
  const name = (entry.name || "").toLowerCase();
  for (const a of ARCHITECT_AFFILIATIONS) if (aff.includes(a)) return "order";
  for (const a of DREAMER_AFFILIATIONS) if (aff.includes(a)) return "chaos";
  for (const a of CHAOS_AFFILIATIONS) if (aff.includes(a)) return "chaos";
  if (name.includes("architect") || name.includes("collector") || name.includes("warden")) return "order";
  if (name.includes("dreamer") || name.includes("enigma") || name.includes("oracle")) return "chaos";
  return Math.random() > 0.5 ? "order" : "chaos";
}

// ── Element Assignment ──
const ELEMENT_MAP = {
  "the architect": "fire",
  "the collector": "earth",
  "the warlord": "fire",
  "the watcher": "air",
  "the necromancer": "earth",
  "the vortex": "air",
  "the meme": "air",
  "the game master": "water",
  "the human": "earth",
  "the politician": "water",
  "the warden": "earth",
  "the authority": "fire",
  "the conexus": "water",
  "the detective": "air",
  "the engineer": "earth",
  "the programmer": "water",
  "the shadow tongue": "fire",
  "the star whisperer": "air",
  "iron lion": "fire",
  "agent zero": "air",
  "the eyes": "air",
  "the nomad": "earth",
  "the recruiter": "fire",
  "the enigma": "water",
  "the oracle": "water",
  "the dreamer": "air",
  "the source": "fire",
  "the antiquarian": "water",
  "the hierophant": "earth",
  "the advocate": "air",
  "the degen": "fire",
  "the inventor": "earth",
  "the jailer": "earth",
  "the judge": "fire",
  "the knowledge": "water",
  "the resurrectionist": "earth",
  "the seer": "water",
  "the silence": "air",
  "the storm": "air",
  "the white oracle": "water",
  "the forgotten": "air",
  "kael": "fire",
  "akai shi": "fire",
  "destiny": "water",
  "jericho jones": "earth",
  "nythera": "air",
  "the host": "fire",
  "the wolf": "earth",
  "wraith calder": "air",
  "master of r'lyeh": "water",
  "adjudicar locke": "earth",
  "ambassador veron": "water",
  "dr. lyra vox": "water",
  "general alarik": "fire",
  "general binath-vii": "earth",
  "general prometheus": "fire",
  "panoptic elara": "air",
  "senator elara voss": "water",
};

function getElement(name) {
  return ELEMENT_MAP[name.toLowerCase()] || ["earth", "fire", "water", "air"][Math.floor(Math.random() * 4)];
}

// ── Species Assignment ──
const SPECIES_MAP = {
  "the architect": "archon",
  "the collector": "archon",
  "the warlord": "archon",
  "the watcher": "archon",
  "the necromancer": "archon",
  "the vortex": "archon",
  "the meme": "archon",
  "the game master": "archon",
  "the human": "human",
  "the politician": "archon",
  "the warden": "archon",
  "the authority": "ai",
  "the conexus": "archon",
  "the detective": "human",
  "the engineer": "human",
  "the programmer": "human",
  "iron lion": "human",
  "agent zero": "human",
  "the eyes": "synthetic",
  "the nomad": "human",
  "the recruiter": "human",
  "the enigma": "ne-yon",
  "the oracle": "ne-yon",
  "the dreamer": "ne-yon",
  "the advocate": "ne-yon",
  "the degen": "ne-yon",
  "the inventor": "ne-yon",
  "the judge": "ne-yon",
  "the knowledge": "ne-yon",
  "the resurrectionist": "ne-yon",
  "the seer": "ne-yon",
  "the silence": "ne-yon",
  "the storm": "ne-yon",
  "the forgotten": "ne-yon",
  "the white oracle": "ne-yon",
  "the source": "corrupted",
  "the antiquarian": "human",
  "the hierophant": "thalorian",
  "the jailer": "archon",
  "the shadow tongue": "demon",
  "the star whisperer": "mythic",
  "kael": "human",
  "akai shi": "potential",
  "destiny": "ai",
  "jericho jones": "potential",
  "nythera": "potential",
  "the host": "corrupted",
  "the wolf": "potential",
  "wraith calder": "potential",
  "master of r'lyeh": "eldritch",
  "adjudicar locke": "human",
  "ambassador veron": "alien",
  "dr. lyra vox": "human",
  "general alarik": "human",
  "general binath-vii": "ai",
  "general prometheus": "ai",
  "panoptic elara": "digital",
  "senator elara voss": "human",
};

// ── Rarity Assignment ──
const LEGENDARY_CHARS = [
  "the architect", "the source", "the enigma", "the programmer",
  "the antiquarian", "master of r'lyeh", "the shadow tongue",
  "the white oracle", "the conexus",
];
const EPIC_CHARS = [
  "iron lion", "agent zero", "the warlord", "the collector",
  "the oracle", "the dreamer", "the necromancer", "the human",
  "the meme", "the engineer", "destiny", "akai shi",
  "the hierophant", "the detective",
];
const RARE_CHARS = [
  "the vortex", "the watcher", "the warden", "the game master",
  "the politician", "the authority", "the recruiter", "the eyes",
  "the nomad", "the advocate", "the degen", "the inventor",
  "the judge", "the knowledge", "the resurrectionist", "the seer",
  "the silence", "the storm", "the forgotten", "the jailer",
  "the star whisperer", "kael",
];

function getCharRarity(name) {
  const n = name.toLowerCase();
  if (LEGENDARY_CHARS.includes(n)) return "legendary";
  if (EPIC_CHARS.includes(n)) return "epic";
  if (RARE_CHARS.includes(n)) return "rare";
  return "uncommon";
}

// ── Keyword Assignment ──
const KEYWORD_MAP = {
  "the architect": ["overcharge", "rally"],
  "the collector": ["drain", "stealth"],
  "the warlord": ["pierce", "rally"],
  "the watcher": ["stealth", "shield"],
  "the necromancer": ["resurrect", "drain"],
  "the vortex": ["pierce", "overcharge"],
  "the meme": ["stealth", "evolve"],
  "the game master": ["shield", "evolve"],
  "the human": ["evolve", "rally"],
  "the politician": ["stealth", "shield"],
  "the warden": ["taunt", "shield"],
  "the authority": ["taunt", "rally"],
  "the conexus": ["overcharge", "drain"],
  "the detective": ["stealth", "pierce"],
  "the engineer": ["shield", "evolve"],
  "the programmer": ["evolve", "overcharge"],
  "the shadow tongue": ["drain", "stealth"],
  "the star whisperer": ["shield", "resurrect"],
  "iron lion": ["taunt", "rally"],
  "agent zero": ["stealth", "pierce"],
  "the eyes": ["stealth"],
  "the nomad": ["evolve"],
  "the recruiter": ["rally"],
  "the enigma": ["stealth", "evolve", "shield"],
  "the oracle": ["shield", "resurrect"],
  "the dreamer": ["shield", "evolve"],
  "the source": ["drain", "overcharge", "pierce"],
  "the antiquarian": ["shield", "evolve"],
  "the advocate": ["rally", "shield"],
  "the degen": ["overcharge", "pierce"],
  "the inventor": ["evolve", "shield"],
  "the jailer": ["taunt", "drain"],
  "the judge": ["taunt", "pierce"],
  "the knowledge": ["evolve", "shield"],
  "the resurrectionist": ["resurrect", "drain"],
  "the seer": ["shield", "stealth"],
  "the silence": ["stealth", "pierce"],
  "the storm": ["overcharge", "pierce"],
  "the forgotten": ["stealth", "evolve"],
  "the white oracle": ["shield", "resurrect", "rally"],
  "the hierophant": ["rally", "shield"],
  "kael": ["evolve", "drain"],
  "akai shi": ["pierce", "stealth"],
  "destiny": ["shield", "rally"],
  "jericho jones": ["taunt", "rally"],
  "nythera": ["evolve", "stealth"],
  "the host": ["drain", "overcharge"],
  "the wolf": ["pierce", "stealth"],
  "wraith calder": ["stealth", "pierce"],
  "master of r'lyeh": ["drain", "resurrect", "overcharge"],
  "adjudicar locke": ["shield", "taunt"],
};

function getKeywords(name) {
  return KEYWORD_MAP[name.toLowerCase()] || ["evolve"];
}

// ── Stat Generation ──
const RARITY_STATS = {
  common: { power: [2, 4], health: [3, 5], cost: [1, 2] },
  uncommon: { power: [3, 5], health: [4, 7], cost: [2, 3] },
  rare: { power: [4, 7], health: [5, 9], cost: [3, 5] },
  epic: { power: [6, 9], health: [7, 11], cost: [4, 6] },
  legendary: { power: [8, 12], health: [9, 14], cost: [5, 8] },
};

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getStats(rarity) {
  const r = RARITY_STATS[rarity] || RARITY_STATS.uncommon;
  return {
    power: randBetween(r.power[0], r.power[1]),
    health: randBetween(r.health[0], r.health[1]),
    cost: randBetween(r.cost[0], r.cost[1]),
  };
}

// ── Ability Text Generation ──
const ABILITY_TEMPLATES = {
  stealth: "Hidden for {n} turn(s). Cannot be targeted until revealed.",
  taunt: "Enemies in this lane must attack this unit first.",
  drain: "Heals for {n}% of damage dealt.",
  pierce: "Ignores {n} points of enemy armor.",
  overcharge: "Deals +{n} damage on first attack, then takes {m} self-damage.",
  shield: "Absorbs the first {n} damage taken.",
  rally: "Adjacent allies gain +{n} ATK this turn.",
  resurrect: "Returns to the field with {n} HP after first death.",
  evolve: "After {n} kills, gains +2/+2 and a new keyword.",
};

function generateAbilityText(keywords, rarity) {
  const mult = rarity === "legendary" ? 3 : rarity === "epic" ? 2 : 1;
  return keywords.map(kw => {
    const template = ABILITY_TEMPLATES[kw] || kw;
    return template.replace("{n}", String(1 + mult)).replace("{m}", String(mult));
  }).join(" ");
}

// ── Character Class Assignment ──
function getCharClass(entry) {
  const name = entry.name.toLowerCase();
  const bio = (entry.bio || "").toLowerCase();
  if (name.includes("agent") || name.includes("eyes") || name.includes("silence") || name.includes("stealth") || bio.includes("assassin")) return "assassin";
  if (name.includes("lion") || name.includes("warlord") || name.includes("general") || name.includes("wolf") || bio.includes("warrior") || bio.includes("soldier")) return "warrior";
  if (name.includes("oracle") || name.includes("seer") || name.includes("prophet") || name.includes("hierophant") || bio.includes("prophet")) return "prophet";
  if (name.includes("engineer") || name.includes("inventor") || name.includes("programmer") || bio.includes("engineer")) return "engineer";
  if (name.includes("detective") || name.includes("spy") || name.includes("calder")) return "spy";
  return ["warrior", "assassin", "prophet", "engineer", "spy"][Math.floor(Math.random() * 5)];
}

// ── Song → Spell/Event Card Mapping ──
const SONG_RARITY_KEYWORDS = {
  // Key songs get higher rarity
  "i love war": { rarity: "epic", keywords: ["pierce", "overcharge"] },
  "the eyes of the watcher": { rarity: "rare", keywords: ["stealth", "shield"] },
  "the fall of reality": { rarity: "legendary", keywords: ["overcharge", "drain", "pierce"] },
  "the age of privacy": { rarity: "epic", keywords: ["stealth", "shield"] },
  "silence in heaven": { rarity: "legendary", keywords: ["shield", "resurrect"] },
  "dischordian logic": { rarity: "epic", keywords: ["evolve", "overcharge"] },
  "the book of daniel": { rarity: "epic", keywords: ["shield", "rally"] },
  "iron lion": { rarity: "epic", keywords: ["taunt", "rally"] },
  "the last stand": { rarity: "legendary", keywords: ["taunt", "rally", "shield"] },
  "the inception ark": { rarity: "legendary", keywords: ["shield", "evolve", "rally"] },
};

function getSongCardData(song) {
  const name = song.name.toLowerCase();
  const override = Object.entries(SONG_RARITY_KEYWORDS).find(([k]) => name.includes(k));
  const rarity = override ? override[1].rarity : ["common", "uncommon", "rare"][Math.floor(Math.random() * 3)];
  const keywords = override ? override[1].keywords : [["shield", "rally", "drain", "overcharge", "evolve"][Math.floor(Math.random() * 5)]];
  return { rarity, keywords };
}

// ── Location → Field Card Mapping ──
function getLocationRarity(name) {
  const n = name.toLowerCase();
  if (["panopticon", "thaloria", "terminus", "heart of time", "matrix of dreams"].some(l => n.includes(l))) return "legendary";
  if (["new babylon", "mechronis", "crucible", "wyrmhole"].some(l => n.includes(l))) return "epic";
  if (["atarion", "nexon", "inbetween"].some(l => n.includes(l))) return "rare";
  return "uncommon";
}

// ── Faction → Support Card Mapping ──
function getFactionRarity() {
  return "epic";
}

// ═══════════════════════════════════════
// GENERATE ALL CARDS
// ═══════════════════════════════════════

const cards = [];
let cardIndex = 1;

function makeId(prefix, index) {
  return `s1_${prefix}_${String(index).padStart(3, "0")}`;
}

// ── Character Cards (Unit type) ──
const characters = entries.filter(e => e.type === "character");
for (const char of characters) {
  const rarity = getCharRarity(char.name);
  const stats = getStats(rarity);
  const alignment = getAlignment(char);
  const element = getElement(char.name);
  const keywords = getKeywords(char.name);
  const species = SPECIES_MAP[char.name.toLowerCase()] || "unknown";
  const charClass = getCharClass(char);

  cards.push({
    id: makeId("char", cardIndex++),
    name: char.name,
    cardType: "unit",
    rarity,
    season: 1,
    set: "Dischordian Saga",
    power: stats.power,
    health: stats.health,
    cost: stats.cost,
    element,
    alignment,
    species,
    characterClass: charClass,
    keywords,
    abilityText: generateAbilityText(keywords, rarity),
    flavorText: (char.bio || "").slice(0, 120) + (char.bio && char.bio.length > 120 ? "..." : ""),
    loreSource: char.id,
    imageUrl: char.image || null,
    era: char.era || null,
    affiliation: char.affiliation || null,
  });
}

// ── Song Cards (Spell/Event type) ──
const songs = entries.filter(e => e.type === "song");
for (const song of songs) {
  const { rarity, keywords } = getSongCardData(song);
  const stats = getStats(rarity);
  const alignment = getAlignment(song);
  const element = ["earth", "fire", "water", "air"][Math.floor(Math.random() * 4)];

  cards.push({
    id: makeId("song", cardIndex++),
    name: song.name,
    cardType: "spell",
    rarity,
    season: 1,
    set: "Dischordian Saga",
    power: Math.floor(stats.power * 0.7),
    health: 0,
    cost: stats.cost,
    element,
    alignment,
    species: null,
    characterClass: null,
    keywords,
    abilityText: generateAbilityText(keywords, rarity),
    flavorText: (song.bio || "").slice(0, 120) + (song.bio && song.bio.length > 120 ? "..." : ""),
    loreSource: song.id,
    imageUrl: song.image || null,
    album: song.album || null,
    affiliation: song.affiliation || null,
  });
}

// ── Location Cards (Field type) ──
const locations = entries.filter(e => e.type === "location");
for (const loc of locations) {
  const rarity = getLocationRarity(loc.name);
  const stats = getStats(rarity);
  const alignment = getAlignment(loc);

  cards.push({
    id: makeId("loc", cardIndex++),
    name: loc.name,
    cardType: "field",
    rarity,
    season: 1,
    set: "Dischordian Saga",
    power: 0,
    health: stats.health,
    cost: stats.cost,
    element: ["earth", "fire", "water", "air"][Math.floor(Math.random() * 4)],
    alignment,
    species: null,
    characterClass: null,
    keywords: ["shield"],
    abilityText: `Field Effect: All ${alignment === "order" ? "Order" : "Chaos"} units gain +1/+1 while this field is active.`,
    flavorText: (loc.bio || "").slice(0, 120) + (loc.bio && loc.bio.length > 120 ? "..." : ""),
    loreSource: loc.id,
    imageUrl: loc.image || null,
    affiliation: null,
  });
}

// ── Faction Cards (Support type) ──
const factions = entries.filter(e => e.type === "faction");
for (const fac of factions) {
  const rarity = getFactionRarity();
  const stats = getStats(rarity);
  const alignment = getAlignment(fac);

  cards.push({
    id: makeId("fac", cardIndex++),
    name: fac.name,
    cardType: "support",
    rarity,
    season: 1,
    set: "Dischordian Saga",
    power: 0,
    health: 0,
    cost: stats.cost,
    element: null,
    alignment,
    species: null,
    characterClass: null,
    keywords: ["rally"],
    abilityText: `Faction Bonus: All allied units gain +2 ATK for 2 turns when deployed.`,
    flavorText: (fac.bio || "").slice(0, 120) + (fac.bio && fac.bio.length > 120 ? "..." : ""),
    loreSource: fac.id,
    imageUrl: fac.image || null,
    affiliation: fac.name,
  });
}

// ═══ Summary ═══
const byType = {};
const byRarity = {};
for (const c of cards) {
  byType[c.cardType] = (byType[c.cardType] || 0) + 1;
  byRarity[c.rarity] = (byRarity[c.rarity] || 0) + 1;
}

console.log(`\n═══ SEASON 1 CARD GENERATION COMPLETE ═══`);
console.log(`Total cards: ${cards.length}`);
console.log(`By type:`, byType);
console.log(`By rarity:`, byRarity);
console.log(`Output: ${outputPath}\n`);

fs.writeFileSync(outputPath, JSON.stringify(cards, null, 2));
console.log("✓ Cards written to season1-cards.json");
