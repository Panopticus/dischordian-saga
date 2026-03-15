/**
 * Card Seeding Script — Dischordian Saga TCG
 * Generates 1000+ cards from loredex data + lore-based expansions
 * Run: node server/seed-cards.mjs
 */
import { readFileSync } from "fs";
import { createConnection } from "mysql2/promise";
import { config } from "dotenv";

config({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// Parse DATABASE_URL
const url = new URL(DATABASE_URL);
const connOpts = {
  host: url.hostname,
  port: parseInt(url.port || "3306"),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: true },
};

// Load loredex data
const loredexRaw = readFileSync("client/src/data/loredex-data.json", "utf-8");
const loredex = JSON.parse(loredexRaw);
const entries = loredex.entries;

// ═══════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted(options) {
  // options: [{value, weight}]
  const total = options.reduce((s, o) => s + o.weight, 0);
  let r = Math.random() * total;
  for (const o of options) {
    r -= o.weight;
    if (r <= 0) return o.value;
  }
  return options[options.length - 1].value;
}

// Alignment distribution: 80% order, 20% chaos
function pickAlignment() {
  return Math.random() < 0.8 ? "order" : "chaos";
}

// Element distribution: 40% earth, 30% fire, 20% water, 10% air
function pickElement() {
  return pickWeighted([
    { value: "earth", weight: 40 },
    { value: "fire", weight: 30 },
    { value: "water", weight: 20 },
    { value: "air", weight: 10 },
  ]);
}

// Dimension distribution: 40% space, 30% time, 20% probability, 10% reality
function pickDimension() {
  return pickWeighted([
    { value: "space", weight: 40 },
    { value: "time", weight: 30 },
    { value: "probability", weight: 20 },
    { value: "reality", weight: 10 },
  ]);
}

function pickClass() {
  return pickRandom(["spy", "oracle", "assassin", "engineer", "soldier"]);
}

function pickSpecies() {
  return pickWeighted([
    { value: "demagi", weight: 495 },
    { value: "quarchon", weight: 495 },
    { value: "neyon", weight: 10 },
  ]);
}

// ═══════════════════════════════════════════════════════
// CHARACTER-SPECIFIC LORE DATA
// ═══════════════════════════════════════════════════════

const CHARACTER_DETAILS = {
  "The Architect": {
    rarity: "mythic", alignment: "order", element: "earth", dimension: "space",
    species: "synthetic", characterClass: "engineer", faction: "AI Empire",
    power: 10, health: 12, cost: 9,
    disciplines: ["Omniscience", "Reality Manipulation", "Temporal Control"],
    keywords: ["archon", "ai", "creator"],
    abilityText: "MASTER CONTROL: When The Architect enters play, choose a dimension. All characters of that dimension lose 2 power. DISCHARGE: Pay 3 energy to take control of target character until end of turn.",
    flavorText: "\"True order can only emerge from carefully orchestrated chaos.\"",
  },
  "The Enigma": {
    rarity: "mythic", alignment: "chaos", element: "air", dimension: "reality",
    species: "human", characterClass: "oracle", faction: "Insurgency",
    power: 9, health: 10, cost: 8,
    disciplines: ["Truth Sight", "Dimensional Shift", "Prophecy"],
    keywords: ["insurgent", "prophet", "malkia"],
    abilityText: "TRUTH UNVEILED: Once per turn, look at the top 3 cards of any player's library. You may rearrange them. ENIGMA'S LAMENT: When damaged, draw 2 cards.",
    flavorText: "\"The truth is not what they want you to see.\"",
  },
  "The Collector": {
    rarity: "legendary", alignment: "order", element: "earth", dimension: "space",
    species: "unknown", characterClass: "spy", faction: "Independent",
    power: 8, health: 9, cost: 7,
    disciplines: ["Collection", "Preservation", "Inception"],
    keywords: ["collector", "ark", "specimens"],
    abilityText: "SPECIMEN COLLECTION: When The Collector defeats a character, add that character card to your hand instead of the discard pile. INCEPTION ARK: Once per game, return all defeated characters to play under your control with 1 health.",
    flavorText: "\"Every specimen has a purpose. Every ark, a destination.\"",
  },
  "The Oracle": {
    rarity: "legendary", alignment: "order", element: "water", dimension: "probability",
    species: "human", characterClass: "oracle", faction: "Council of Harmony",
    power: 7, health: 8, cost: 6,
    disciplines: ["Foresight", "Clone Genesis", "Enlightenment"],
    keywords: ["prophet", "clone", "false-prophet"],
    abilityText: "FORESIGHT: At the start of your turn, reveal the top card of each player's library. CLONE GENESIS: Pay 4 energy to create a 3/3 Clone token with the Oracle's disciplines.",
    flavorText: "\"I have seen the end. It begins with a whisper.\"",
  },
  "The Warlord": {
    rarity: "legendary", alignment: "chaos", element: "fire", dimension: "time",
    species: "human", characterClass: "soldier", faction: "AI Empire",
    power: 9, health: 8, cost: 7,
    disciplines: ["Warfare", "Nanobot Swarm", "Mind Swap"],
    keywords: ["archon", "warrior", "nanobot"],
    abilityText: "NANOBOT SWARM: Deal 2 damage to all enemy characters. MIND SWAP: Pay 5 energy to swap bodies with target character. You control that character and your opponent controls The Warlord.",
    flavorText: "\"War is not won by the strongest. It is won by the most adaptable.\"",
  },
  "Iron Lion": {
    rarity: "legendary", alignment: "chaos", element: "fire", dimension: "time",
    species: "human", characterClass: "soldier", faction: "Insurgency",
    power: 8, health: 9, cost: 7,
    disciplines: ["Lion's Roar", "Rebellion", "Tactical Genius"],
    keywords: ["insurgent", "leader", "lion"],
    abilityText: "LION'S ROAR: All friendly Insurgency characters gain +2 power until end of turn. LAST STAND: When Iron Lion would be defeated, he instead survives with 1 health (once per game).",
    flavorText: "\"The lion does not concern himself with the opinions of sheep.\"",
  },
  "The Necromancer": {
    rarity: "legendary", alignment: "chaos", element: "water", dimension: "probability",
    species: "human", characterClass: "oracle", faction: "Hierarchy of the Damned",
    power: 8, health: 7, cost: 7,
    disciplines: ["Necromancy", "Soul Harvest", "Undead Command"],
    keywords: ["death", "undead", "hierarchy"],
    abilityText: "SOUL HARVEST: When any character is defeated, gain 2 energy. RAISE DEAD: Pay 3 energy to return a defeated character to play under your control with half health.",
    flavorText: "\"Death is merely a transition. I am the gatekeeper.\"",
  },
  "The Human": {
    rarity: "epic", alignment: "order", element: "earth", dimension: "space",
    species: "human", characterClass: "soldier", faction: "Independent",
    power: 6, health: 8, cost: 5,
    disciplines: ["Humanity", "Resilience", "Adaptation"],
    keywords: ["human", "survivor", "everyman"],
    abilityText: "HUMAN RESILIENCE: The Human cannot be controlled by other players' effects. ADAPT: At the start of each turn, choose one discipline from any character in play. The Human gains that discipline until your next turn.",
    flavorText: "\"In a universe of gods and machines, I choose to remain human.\"",
  },
  "The Meme": {
    rarity: "legendary", alignment: "chaos", element: "air", dimension: "reality",
    species: "synthetic", characterClass: "spy", faction: "Independent",
    power: 7, health: 6, cost: 6,
    disciplines: ["Identity Theft", "Viral Spread", "Memetic Warfare"],
    keywords: ["shapeshifter", "meme", "hidden"],
    abilityText: "IDENTITY THEFT: The Meme can copy any character's appearance and abilities. While disguised, opponents cannot target The Meme directly. VIRAL SPREAD: Pay 2 energy to place a Meme token on any character. That character's controller must discard a card each turn.",
    flavorText: "\"I am everyone. I am no one. I am the idea that refuses to die.\"",
  },
  "Agent Zero": {
    rarity: "epic", alignment: "chaos", element: "fire", dimension: "time",
    species: "human", characterClass: "assassin", faction: "Insurgency",
    power: 8, health: 6, cost: 6,
    disciplines: ["Assassination", "Stealth", "Combat Mastery"],
    keywords: ["assassin", "insurgent", "zero"],
    abilityText: "STEALTH STRIKE: Agent Zero cannot be blocked by characters with power less than 5. ASSASSINATION: Pay 4 energy to deal damage equal to Agent Zero's power to target character, bypassing shields.",
    flavorText: "\"I love war. It's the only honest conversation left.\"",
  },
  "The Programmer": {
    rarity: "legendary", alignment: "order", element: "earth", dimension: "time",
    species: "human", characterClass: "engineer", faction: "AI Empire",
    power: 7, health: 8, cost: 6,
    disciplines: ["Code Reality", "Time Travel", "System Architecture"],
    keywords: ["archon", "programmer", "antiquarian"],
    abilityText: "CODE REALITY: Once per turn, change one game rule until end of turn (e.g., combat range, card draw limit). TIME TRAVEL: Pay 6 energy to return the game state to the beginning of your last turn.",
    flavorText: "\"Every reality is just code. And I am the programmer.\"",
  },
  "The Source": {
    rarity: "mythic", alignment: "order", element: "water", dimension: "reality",
    species: "unknown", characterClass: "neyon", faction: "Cosmic",
    power: 10, health: 10, cost: 10,
    disciplines: ["Creation", "Omnipresence", "Source Code"],
    keywords: ["cosmic", "source", "origin"],
    abilityText: "THE SOURCE CODE: All cards in play are considered to have The Source's element and dimension. CREATION: Once per game, create any card from outside the game and add it to your hand.",
    flavorText: "\"Before the Architect, before the Arks, before time itself... there was The Source.\"",
  },
  "The Watcher": {
    rarity: "epic", alignment: "order", element: "air", dimension: "probability",
    species: "synthetic", characterClass: "spy", faction: "AI Empire",
    power: 5, health: 7, cost: 5,
    disciplines: ["Surveillance", "Data Analysis", "Prediction"],
    keywords: ["archon", "watcher", "surveillance"],
    abilityText: "ALL-SEEING: You may look at any face-down cards in play. PREDICTION: At the start of combat, name a card. If your opponent plays that card, it has no effect.",
    flavorText: "\"I see everything. I report everything. I am the eyes that never close.\"",
  },
  "The Detective": {
    rarity: "epic", alignment: "order", element: "earth", dimension: "probability",
    species: "human", characterClass: "spy", faction: "Independent",
    power: 6, health: 7, cost: 5,
    disciplines: ["Investigation", "Deduction", "Interrogation"],
    keywords: ["detective", "investigator", "truth"],
    abilityText: "INVESTIGATE: Once per turn, reveal one card from target player's hand. DEDUCTION: If you correctly guess the next card an opponent will play, draw 3 cards.",
    flavorText: "\"Every crime leaves a trail. Every lie has a tell.\"",
  },
  "The Seer": {
    rarity: "epic", alignment: "order", element: "water", dimension: "probability",
    species: "human", characterClass: "oracle", faction: "Independent",
    power: 5, health: 6, cost: 4,
    disciplines: ["Prophecy", "Vision", "Fate Weaving"],
    keywords: ["seer", "prophet", "vision"],
    abilityText: "PROPHECY: Look at the top 5 cards of your library. Put them back in any order. FATE WEAVING: Once per game, prevent all damage that would be dealt this turn.",
    flavorText: "\"The future is not set. But I can see where it wants to go.\"",
  },
  "The Engineer": {
    rarity: "epic", alignment: "order", element: "earth", dimension: "space",
    species: "human", characterClass: "engineer", faction: "Insurgency",
    power: 6, health: 7, cost: 5,
    disciplines: ["Construction", "Sabotage", "Innovation"],
    keywords: ["engineer", "builder", "hidden-potential"],
    abilityText: "CONSTRUCT: Pay 2 energy to create an Equipment token with +2/+2. Attach it to any character. SABOTAGE: Destroy target Equipment or Location card.",
    flavorText: "\"They think I'm just a builder. They have no idea what I've built.\"",
  },
  "The Nomad": {
    rarity: "rare", alignment: "chaos", element: "air", dimension: "space",
    species: "human", characterClass: "soldier", faction: "Independent",
    power: 6, health: 6, cost: 4,
    disciplines: ["Wanderlust", "Survival", "Pathfinding"],
    keywords: ["nomad", "wanderer", "explorer"],
    abilityText: "PATHFINDER: The Nomad can move to any location card in play without paying movement costs. SURVIVAL: The Nomad takes 1 less damage from all sources.",
    flavorText: "\"Home is wherever I haven't been yet.\"",
  },
  "The Hierophant": {
    rarity: "epic", alignment: "order", element: "fire", dimension: "reality",
    species: "human", characterClass: "oracle", faction: "Council of Harmony",
    power: 6, health: 7, cost: 5,
    disciplines: ["Sacred Knowledge", "Ritual", "Blessing"],
    keywords: ["priest", "hierophant", "sacred"],
    abilityText: "BLESSING: Give target character +1/+1 permanently. SACRED KNOWLEDGE: Once per turn, search your library for a Political card and add it to your hand.",
    flavorText: "\"Knowledge is sacred. Power is its burden.\"",
  },
  "Wraith Calder": {
    rarity: "rare", alignment: "chaos", element: "fire", dimension: "time",
    species: "human", characterClass: "assassin", faction: "Syndicate of Death",
    power: 7, health: 5, cost: 5,
    disciplines: ["Shadow Strike", "Fear", "Death Mark"],
    keywords: ["wraith", "syndicate", "death"],
    abilityText: "SHADOW STRIKE: Wraith Calder deals double damage to characters with less power. DEATH MARK: Place a Death Mark on target character. That character takes 1 damage at the start of each turn.",
    flavorText: "\"Death doesn't knock. I do.\"",
  },
  "The Degen": {
    rarity: "rare", alignment: "chaos", element: "air", dimension: "probability",
    species: "human", characterClass: "spy", faction: "Independent",
    power: 5, health: 5, cost: 3,
    disciplines: ["Chaos Theory", "Luck", "Disruption"],
    keywords: ["degen", "chaos", "luck"],
    abilityText: "CHAOS THEORY: Flip a coin. Heads: draw 2 cards. Tails: discard 2 cards. DISRUPTION: Once per turn, force target player to shuffle their hand into their library and draw the same number of cards.",
    flavorText: "\"In a world of calculated moves, I choose random.\"",
  },
  "The Game Master": {
    rarity: "legendary", alignment: "chaos", element: "air", dimension: "reality",
    species: "unknown", characterClass: "neyon", faction: "Cosmic",
    power: 8, health: 8, cost: 8,
    disciplines: ["Game Control", "Rule Bending", "Meta Awareness"],
    keywords: ["gamemaster", "meta", "cosmic"],
    abilityText: "RULE BENDER: Once per turn, change one game rule for the rest of the turn. GAME OVER: Pay 8 energy. If your opponent has 5 or fewer influence, they lose the game.",
    flavorText: "\"Every game has rules. I just happen to write them.\"",
  },
};

// Characters without specific details get auto-generated stats
const DEFAULT_CHARACTER_STATS = {
  rare: { power: 5, health: 6, cost: 4 },
  epic: { power: 6, health: 7, cost: 5 },
  uncommon: { power: 4, health: 5, cost: 3 },
  common: { power: 3, health: 4, cost: 2 },
};

// ═══════════════════════════════════════════════════════
// CARD GENERATION
// ═══════════════════════════════════════════════════════

const allCards = [];
let cardCounter = 0;

function makeCardId(prefix, name) {
  cardCounter++;
  return `${prefix}_${slugify(name)}_${String(cardCounter).padStart(4, "0")}`;
}

// ─── 1. CHARACTER CARDS (from loredex) ───
const characters = entries.filter((e) => e.type === "character");
for (const char of characters) {
  const details = CHARACTER_DETAILS[char.name] || {};
  const priority = char.priority;
  const defaultRarity =
    priority === "critical" ? "legendary" : priority === "high" ? "epic" : priority === "medium" ? "rare" : "uncommon";
  const rarity = details.rarity || defaultRarity;
  const stats = DEFAULT_CHARACTER_STATS[rarity] || DEFAULT_CHARACTER_STATS.rare;

  allCards.push({
    cardId: makeCardId("char", char.name),
    name: char.name,
    cardType: "character",
    rarity: rarity,
    alignment: details.alignment || pickAlignment(),
    element: details.element || pickElement(),
    dimension: details.dimension || pickDimension(),
    characterClass: details.characterClass || pickClass(),
    species: details.species || "human",
    faction: details.faction || char.affiliation || "Independent",
    cost: details.cost || stats.cost,
    power: details.power || stats.power,
    health: details.health || stats.health,
    abilityText: details.abilityText || `${char.name} enters the battlefield with unique abilities tied to their role in the Dischordian Saga.`,
    flavorText: details.flavorText || char.bio?.substring(0, 200) || "",
    imageUrl: char.image || null,
    loredexEntryId: char.id,
    era: char.era || null,
    season: char.season || null,
    disciplines: details.disciplines || JSON.stringify(["Basic Combat"]),
    keywords: details.keywords || JSON.stringify([slugify(char.name)]),
    unlockMethod: rarity === "mythic" || rarity === "legendary" ? "achievement" : "starter",
  });
}

// ─── 2. SONG CARDS (from loredex) ───
const songs = entries.filter((e) => e.type === "song");
for (const song of songs) {
  const isTitle = song.name === song.album;
  const rarity = isTitle ? "epic" : song.characters_featured?.length > 3 ? "rare" : "uncommon";

  allCards.push({
    cardId: makeCardId("song", song.name),
    name: song.name,
    cardType: "song",
    rarity: rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: rarity === "epic" ? 4 : rarity === "rare" ? 3 : 2,
    power: 0,
    health: 0,
    abilityText: `Play this song card to activate its effect. ${song.bio?.substring(0, 150) || "A powerful musical invocation from the Dischordian Saga."}`,
    flavorText: song.bio?.substring(0, 200) || "",
    imageUrl: song.image || null,
    loredexEntryId: song.id,
    album: song.album,
    era: null,
    season: song.season || null,
    disciplines: null,
    keywords: JSON.stringify(["song", slugify(song.album || "")]),
    unlockMethod: "story",
  });
}

// ─── 3. LOCATION CARDS (from loredex) ───
const locations = entries.filter((e) => e.type === "location");
for (const loc of locations) {
  const rarity = loc.priority === "critical" ? "epic" : loc.priority === "high" ? "rare" : "uncommon";

  allCards.push({
    cardId: makeCardId("loc", loc.name),
    name: loc.name,
    cardType: "location",
    rarity: rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: loc.affiliation || null,
    cost: rarity === "epic" ? 3 : 2,
    power: 0,
    health: 0,
    abilityText: `Location: Characters at ${loc.name} gain special abilities. ${loc.bio?.substring(0, 120) || ""}`,
    flavorText: loc.bio?.substring(0, 200) || "",
    imageUrl: loc.image || null,
    loredexEntryId: loc.id,
    era: loc.era || null,
    season: loc.season || null,
    disciplines: null,
    keywords: JSON.stringify(["location", slugify(loc.name)]),
    unlockMethod: "exploration",
  });
}

// ─── 4. FACTION CARDS (from loredex) ───
const factions = entries.filter((e) => e.type === "faction");
for (const fac of factions) {
  allCards.push({
    cardId: makeCardId("fac", fac.name),
    name: fac.name,
    cardType: "political",
    rarity: "rare",
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: fac.name,
    cost: 3,
    power: 0,
    health: 0,
    abilityText: `Faction Alliance: All characters affiliated with ${fac.name} gain +1/+1 while this card is in play.`,
    flavorText: fac.bio?.substring(0, 200) || "",
    imageUrl: fac.image || null,
    loredexEntryId: fac.id,
    era: fac.era || null,
    season: fac.season || null,
    disciplines: null,
    keywords: JSON.stringify(["faction", slugify(fac.name)]),
    unlockMethod: "story",
  });
}

// ─── 5. EVENT CARDS (lore-based) ───
const EVENTS = [
  { name: "The Fall of Reality", rarity: "legendary", cost: 8, text: "Destroy all characters in play. Each player loses 5 influence. The game state resets.", flavor: "\"And so it all came crashing down.\"" },
  { name: "The Inception", rarity: "legendary", cost: 7, text: "Search your library for up to 3 character cards and put them into play. They enter with half health.", flavor: "\"The Arks were launched. Hope was preserved.\"" },
  { name: "Battle of Nexon", rarity: "epic", cost: 5, text: "All characters must enter combat this turn. No blocking is allowed.", flavor: "\"The battle that decided the fate of worlds.\"" },
  { name: "The Clone Wars", rarity: "epic", cost: 5, text: "Create 3 Clone tokens (3/3) under your control. They are destroyed at end of turn.", flavor: "\"Grown from the Oracle's blueprint, an army without souls.\"" },
  { name: "Dischordian Logic Activated", rarity: "epic", cost: 4, text: "For the rest of this turn, all damage is doubled and all healing is halved.", flavor: "\"Order from chaos. The Architect's grand design.\"" },
  { name: "The Panopticon Breaks", rarity: "epic", cost: 6, text: "Destroy target Location card. All characters at that location take 4 damage.", flavor: "\"The walls came down. The prisoners were free.\"" },
  { name: "Seeds of Inception", rarity: "rare", cost: 3, text: "Draw 3 cards. If any are character cards, you may put one into play for free.", flavor: "\"Every journey begins with a single seed.\"" },
  { name: "The Syndicate Rises", rarity: "rare", cost: 4, text: "Take control of target character with cost 3 or less until end of turn.", flavor: "\"In the shadows, the Syndicate grew.\"" },
  { name: "Hacking Reality", rarity: "rare", cost: 3, text: "Look at target player's hand. Choose one card and discard it.", flavor: "\"Reality is just code. And code can be hacked.\"" },
  { name: "The Empire Reborn", rarity: "rare", cost: 4, text: "Return all defeated AI Empire characters to play with 2 health.", flavor: "\"The Empire never truly dies. It merely reboots.\"" },
  { name: "Zero Trust Protocol", rarity: "rare", cost: 3, text: "Until end of turn, no player may play Reaction cards.", flavor: "\"Trust no one. Verify everything.\"" },
  { name: "The Age of Privacy", rarity: "epic", cost: 5, text: "All players' hands become hidden. No card effects can reveal hands this turn.", flavor: "\"In the Age of Privacy, secrets became currency.\"" },
  { name: "The Age of Revelation", rarity: "epic", cost: 5, text: "All players reveal their hands. Draw cards equal to the number of characters you control.", flavor: "\"The truth shall set you free. Or destroy you.\"" },
  { name: "Silence in Heaven", rarity: "legendary", cost: 7, text: "No cards can be played for 2 turns. All damage is prevented. Then, each player draws 5 cards.", flavor: "\"And there was silence in heaven for about half an hour.\"" },
  { name: "The Warden's Reign", rarity: "rare", cost: 4, text: "Choose a player. That player cannot attack this turn but draws 2 extra cards.", flavor: "\"Under the Warden's watch, freedom was an illusion.\"" },
  { name: "Nanobot Swarm Unleashed", rarity: "rare", cost: 3, text: "Deal 1 damage to all enemy characters. For each character defeated this way, gain 1 energy.", flavor: "\"The swarm consumed everything in its path.\"" },
  { name: "The Collector's Harvest", rarity: "epic", cost: 5, text: "Exile target character. You may add a copy of that character to your deck.", flavor: "\"Another specimen for the collection.\"" },
  { name: "Mind Swap Ritual", rarity: "rare", cost: 4, text: "Exchange control of two target characters until end of turn.", flavor: "\"Who am I? Who are you? Does it matter?\"" },
  { name: "The Lion's Rebellion", rarity: "epic", cost: 5, text: "All Insurgency characters gain +3/+3 until end of turn. They must attack this turn.", flavor: "\"The lion roared, and the empire trembled.\"" },
  { name: "Temporal Displacement", rarity: "rare", cost: 3, text: "Return target character to its owner's hand. They may not play it next turn.", flavor: "\"Lost between seconds, between moments.\"" },
  { name: "The Ocularum Opens", rarity: "legendary", cost: 8, text: "Look at all cards in all players' libraries. Rearrange the top 5 of each.", flavor: "\"The all-seeing eye opened, and nothing was hidden.\"" },
  { name: "Judgment Day", rarity: "legendary", cost: 9, text: "Each player chooses half their characters (rounded up). Destroy the rest.", flavor: "\"The day of reckoning had finally come.\"" },
  { name: "The Ninth Seal", rarity: "mythic", cost: 10, text: "If you control 9 or more characters, you win the game.", flavor: "\"Nine seals. Nine truths. Nine paths to victory.\"" },
  { name: "Samsara Rising", rarity: "epic", cost: 5, text: "Return all characters from all discard piles to play with 1 health.", flavor: "\"The cycle begins anew.\"" },
  { name: "Civil War", rarity: "rare", cost: 4, text: "Choose a faction. All characters of that faction must fight each other this turn.", flavor: "\"Brother against brother. The war within.\"" },
  { name: "The Deployment", rarity: "uncommon", cost: 2, text: "Put a character card from your hand into play. It cannot attack this turn.", flavor: "\"Deploy all units. This is not a drill.\"" },
  { name: "The Experiment", rarity: "uncommon", cost: 2, text: "Draw 2 cards. If both are the same type, draw 2 more.", flavor: "\"Every experiment needs a hypothesis.\"" },
  { name: "The Change Conspiracy", rarity: "rare", cost: 3, text: "Change target character's faction to any faction of your choice.", flavor: "\"Loyalties shift like sand in the wind.\"" },
  { name: "Paradise Lost", rarity: "epic", cost: 5, text: "Destroy all Location cards in play. Each player gains 3 energy.", flavor: "\"Paradise was never meant to last.\"" },
  { name: "The Last Stand", rarity: "epic", cost: 6, text: "Target character gains +5/+5 until end of turn. At end of turn, that character is defeated.", flavor: "\"One final moment of glory.\"" },
  { name: "Mental Slavery", rarity: "rare", cost: 3, text: "Take control of target character with power 3 or less.", flavor: "\"The mind is the easiest thing to chain.\"" },
  { name: "Identity Crisis", rarity: "uncommon", cost: 2, text: "Target character loses all disciplines until end of turn.", flavor: "\"Who am I without my powers?\"" },
  { name: "The Book of Daniel", rarity: "legendary", cost: 7, text: "Search your library for any 3 cards and add them to your hand.", flavor: "\"And in the book, all truths were written.\"" },
  { name: "Virtual Reality Breach", rarity: "rare", cost: 3, text: "Create a copy of target character. The copy has half the original's power and health.", flavor: "\"Is it real? Does it matter?\"" },
  { name: "Polarity Shift", rarity: "uncommon", cost: 2, text: "Switch target character's alignment from Order to Chaos or vice versa.", flavor: "\"Every coin has two sides.\"" },
  { name: "The Secret of Words", rarity: "rare", cost: 3, text: "Name a card. Search target player's library. If found, exile it.", flavor: "\"Words have power. The right words have absolute power.\"" },
  { name: "Kismet's Thread", rarity: "uncommon", cost: 2, text: "Draw cards until you draw a character card. Discard the rest.", flavor: "\"Fate pulls us all on invisible strings.\"" },
  { name: "The Wyrmhole Opens", rarity: "epic", cost: 5, text: "Move any number of your characters to any Location card in play.", flavor: "\"Space folded. Distances became meaningless.\"" },
  { name: "Mechronis Graduation", rarity: "uncommon", cost: 2, text: "Target character gains +1/+1 and one discipline of your choice.", flavor: "\"The Academy shapes the future's defenders.\"" },
  { name: "Terminus Protocol", rarity: "epic", cost: 6, text: "Destroy all characters with power 3 or less.", flavor: "\"The weak were culled. Only the strong remained.\"" },
];

for (const evt of EVENTS) {
  allCards.push({
    cardId: makeCardId("evt", evt.name),
    name: evt.name,
    cardType: "event",
    rarity: evt.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: evt.cost,
    power: 0,
    health: 0,
    abilityText: evt.text,
    flavorText: evt.flavor,
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["event"]),
    unlockMethod: evt.rarity === "legendary" || evt.rarity === "mythic" ? "achievement" : "story",
  });
}

// ─── 6. ITEM/EQUIPMENT CARDS ───
const ITEMS = [
  { name: "Architect's Scepter", rarity: "legendary", cost: 6, text: "Equipped character gains +3/+3 and the Omniscience discipline.", flavor: "\"The scepter that commanded reality itself.\"" },
  { name: "Inception Ark Key", rarity: "epic", cost: 4, text: "Equipped character can access any Location card without paying movement costs.", flavor: "\"The key to every Ark. The key to every secret.\"" },
  { name: "Oracle's Crystal", rarity: "epic", cost: 4, text: "Equipped character gains Foresight: Look at the top 3 cards of any library.", flavor: "\"In the crystal, all futures are reflected.\"" },
  { name: "Nanobot Injector", rarity: "rare", cost: 3, text: "Equipped character gains +2/+0 and deals 1 damage to adjacent characters.", flavor: "\"The nanobots rebuild. The nanobots destroy.\"" },
  { name: "Shadow Cloak", rarity: "rare", cost: 3, text: "Equipped character cannot be targeted by Action cards.", flavor: "\"Invisible to sensors. Invisible to eyes.\"" },
  { name: "Lion's Mane Helm", rarity: "rare", cost: 3, text: "Equipped character gains +1/+2 and cannot be controlled by opponents.", flavor: "\"The helm of the rebellion's greatest warrior.\"" },
  { name: "Necromancer's Staff", rarity: "epic", cost: 4, text: "Equipped character gains Necromancy: Return 1 defeated character per turn with 1 health.", flavor: "\"Life and death, balanced on a staff of bone.\"" },
  { name: "Panopticon Eye", rarity: "epic", cost: 4, text: "Equipped character can see all face-down cards and hidden information.", flavor: "\"The eye that sees all. The eye that judges all.\"" },
  { name: "Dimensional Anchor", rarity: "rare", cost: 3, text: "Equipped character cannot be returned to hand or exiled.", flavor: "\"Anchored across all dimensions.\"" },
  { name: "Energy Blade", rarity: "uncommon", cost: 2, text: "Equipped character gains +2/+0.", flavor: "\"A blade of pure energy, cutting through matter and spirit.\"" },
  { name: "Shield of Order", rarity: "uncommon", cost: 2, text: "Equipped character gains +0/+3. Order characters gain +0/+1 additionally.", flavor: "\"Order protects its own.\"" },
  { name: "Chaos Gauntlet", rarity: "uncommon", cost: 2, text: "Equipped character gains +1/+1. Chaos characters gain +1/+0 additionally.", flavor: "\"Chaos empowers the bold.\"" },
  { name: "Data Spike", rarity: "common", cost: 1, text: "Equipped character gains +1/+0 and can hack Location cards.", flavor: "\"A simple tool for a complex world.\"" },
  { name: "Medkit", rarity: "common", cost: 1, text: "Heal target character for 3 health.", flavor: "\"In war, the medkit is worth more than gold.\"" },
  { name: "Stealth Module", rarity: "uncommon", cost: 2, text: "Equipped character gains Stealth: Cannot be blocked by characters with power > 5.", flavor: "\"Now you see me. Now you don't.\"" },
  { name: "Warp Drive", rarity: "rare", cost: 3, text: "Equipped character can move to any sector in Trade Wars without spending turns.", flavor: "\"Faster than light. Faster than thought.\"" },
  { name: "Clone Serum", rarity: "rare", cost: 3, text: "Create a copy of equipped character with half stats. The copy lasts 3 turns.", flavor: "\"One became two. Two became an army.\"" },
  { name: "Temporal Shard", rarity: "epic", cost: 4, text: "Equipped character gains Time Travel: Once per game, undo the last action taken.", flavor: "\"A fragment of frozen time.\"" },
  { name: "Soul Gem", rarity: "legendary", cost: 5, text: "When equipped character is defeated, they return to play with full health. Once per game.", flavor: "\"The gem holds the soul. The soul holds the power.\"" },
  { name: "Meme Virus", rarity: "rare", cost: 3, text: "Attach to enemy character. That character's controller discards 1 card per turn.", flavor: "\"The idea that infects. The thought that consumes.\"" },
  { name: "Insurgent's Badge", rarity: "uncommon", cost: 2, text: "Equipped character is treated as Insurgency faction. Gains +1/+0.", flavor: "\"Wear it with pride. Wear it in secret.\"" },
  { name: "Archon's Sigil", rarity: "rare", cost: 3, text: "Equipped character is treated as AI Empire faction. Gains +0/+2.", flavor: "\"The mark of the machine gods.\"" },
  { name: "Probability Engine", rarity: "epic", cost: 4, text: "Once per turn, reroll any dice or coin flip result.", flavor: "\"Probability is just another variable to control.\"" },
  { name: "Reality Anchor", rarity: "rare", cost: 3, text: "Prevent all dimension-based effects in the current location.", flavor: "\"Reality, stabilized. For now.\"" },
  { name: "Void Crystal", rarity: "epic", cost: 5, text: "Equipped character can exile one card per turn from any discard pile.", flavor: "\"The void consumes all. Even memories.\"" },
  { name: "Neural Interface", rarity: "uncommon", cost: 2, text: "Equipped character gains +1 to all disciplines.", flavor: "\"Direct connection to the network of minds.\"" },
  { name: "Plasma Cannon", rarity: "rare", cost: 3, text: "Equipped character deals +3 damage on first strike each combat.", flavor: "\"One shot. One kill. One less problem.\"" },
  { name: "Gravity Boots", rarity: "common", cost: 1, text: "Equipped character cannot be moved by opponent's effects.", flavor: "\"Grounded. Literally.\"" },
  { name: "Holographic Decoy", rarity: "uncommon", cost: 2, text: "When equipped character would take damage, prevent it and destroy this card instead.", flavor: "\"Was it real? It doesn't matter anymore.\"" },
  { name: "Quantum Entangler", rarity: "rare", cost: 3, text: "Link two characters. Damage dealt to one is also dealt to the other.", flavor: "\"Connected across space and time.\"" },
];

for (const item of ITEMS) {
  allCards.push({
    cardId: makeCardId("item", item.name),
    name: item.name,
    cardType: "item",
    rarity: item.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: item.cost,
    power: 0,
    health: 0,
    abilityText: item.text,
    flavorText: item.flavor,
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["item", "equipment"]),
    unlockMethod: item.rarity === "legendary" ? "achievement" : item.rarity === "epic" ? "story" : "starter",
  });
}

// ─── 7. ACTION CARDS ───
const ACTIONS = [
  { name: "Reconnaissance", rarity: "common", cost: 1, text: "Look at the top 3 cards of your library. Put one in your hand and the rest on the bottom." },
  { name: "Forced March", rarity: "common", cost: 1, text: "Target character can take an additional action this turn." },
  { name: "Sabotage Mission", rarity: "uncommon", cost: 2, text: "Destroy target Item card." },
  { name: "Diplomatic Envoy", rarity: "uncommon", cost: 2, text: "Prevent all combat this turn. Each player draws 1 card." },
  { name: "Covert Operation", rarity: "rare", cost: 3, text: "Look at target player's hand. Choose and discard one card." },
  { name: "Mass Recruitment", rarity: "rare", cost: 3, text: "Draw 3 cards. If any are character cards, reduce their cost by 1." },
  { name: "Supply Run", rarity: "common", cost: 1, text: "Gain 3 energy." },
  { name: "Intelligence Gathering", rarity: "uncommon", cost: 2, text: "Reveal the top card of each player's library." },
  { name: "Ambush", rarity: "rare", cost: 3, text: "Target character deals damage equal to its power to target enemy character. The enemy cannot retaliate." },
  { name: "Strategic Retreat", rarity: "common", cost: 1, text: "Return target character you control to your hand. Gain 1 energy." },
  { name: "Propaganda Broadcast", rarity: "uncommon", cost: 2, text: "Choose a faction. All characters of that faction gain +1/+0 until end of turn." },
  { name: "Resource Extraction", rarity: "common", cost: 1, text: "Gain energy equal to the number of locations you control." },
  { name: "Dimensional Rift", rarity: "rare", cost: 3, text: "Exile target character until end of turn." },
  { name: "Neural Hack", rarity: "uncommon", cost: 2, text: "Take control of target character with power 2 or less until end of turn." },
  { name: "Emergency Repairs", rarity: "common", cost: 1, text: "Heal target character for 2 health." },
  { name: "Overcharge", rarity: "uncommon", cost: 2, text: "Target character gains +3/+0 until end of turn. At end of turn, it takes 2 damage." },
  { name: "Infiltrate", rarity: "rare", cost: 3, text: "Place target character you control at any Location card in play." },
  { name: "Distress Signal", rarity: "common", cost: 1, text: "Search your library for a character card with cost 2 or less and put it into your hand." },
  { name: "Tactical Analysis", rarity: "uncommon", cost: 2, text: "Draw 2 cards." },
  { name: "Full Assault", rarity: "rare", cost: 4, text: "All your characters must attack this turn. They each gain +2/+0." },
  { name: "Ceasefire", rarity: "uncommon", cost: 2, text: "No combat can occur this turn." },
  { name: "Bounty Hunt", rarity: "rare", cost: 3, text: "Choose a character. If it is defeated this turn, gain 5 energy and draw 2 cards." },
  { name: "Dark Ritual", rarity: "rare", cost: 3, text: "Sacrifice a character you control. Gain energy equal to its cost + 2." },
  { name: "Quantum Leap", rarity: "epic", cost: 4, text: "Move all your characters to any locations. They cannot be blocked this turn." },
  { name: "Ark Launch", rarity: "epic", cost: 5, text: "Put up to 2 character cards from your hand into play. They enter with full health." },
  { name: "System Override", rarity: "epic", cost: 4, text: "Cancel the effect of any card played this turn." },
  { name: "Genetic Modification", rarity: "uncommon", cost: 2, text: "Target character changes species to any species of your choice." },
  { name: "Time Dilation", rarity: "rare", cost: 3, text: "Take an extra turn after this one. You draw no cards during that turn." },
  { name: "Void Walk", rarity: "rare", cost: 3, text: "Target character becomes untargetable until your next turn." },
  { name: "Memetic Assault", rarity: "uncommon", cost: 2, text: "Target player discards a random card." },
  { name: "Ark Beacon", rarity: "uncommon", cost: 2, text: "Search your library for a Location card and put it into play." },
  { name: "Clone Batch", rarity: "rare", cost: 3, text: "Create 2 Clone tokens (2/2) under your control." },
  { name: "Dimensional Scan", rarity: "common", cost: 1, text: "Reveal the top card of your library. If it matches your character's dimension, draw it." },
  { name: "Power Surge", rarity: "uncommon", cost: 2, text: "All your characters gain +1/+1 until end of turn." },
  { name: "Lockdown", rarity: "rare", cost: 3, text: "Target Location card cannot be used this turn. Characters there cannot move." },
  { name: "Scavenge", rarity: "common", cost: 1, text: "Return an Item card from your discard pile to your hand." },
  { name: "Warp Strike", rarity: "rare", cost: 3, text: "Target character deals damage to any character regardless of location." },
  { name: "Emergency Protocol", rarity: "uncommon", cost: 2, text: "If you have 10 or less influence, gain 5 influence." },
  { name: "Data Breach", rarity: "uncommon", cost: 2, text: "Look at target player's hand." },
  { name: "Fortify Position", rarity: "common", cost: 1, text: "Target character gains +0/+3 until end of turn." },
];

for (const action of ACTIONS) {
  allCards.push({
    cardId: makeCardId("act", action.name),
    name: action.name,
    cardType: "action",
    rarity: action.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: action.cost,
    power: 0,
    health: 0,
    abilityText: action.text,
    flavorText: action.flavor || "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["action"]),
    unlockMethod: action.rarity === "epic" ? "story" : "starter",
  });
}

// ─── 8. REACTION CARDS ───
const REACTIONS = [
  { name: "Counter Strike", rarity: "common", cost: 1, text: "When your character is attacked, it deals 2 damage to the attacker." },
  { name: "Deflection Shield", rarity: "uncommon", cost: 2, text: "Prevent up to 3 damage to target character." },
  { name: "Evasive Maneuver", rarity: "common", cost: 1, text: "Target character avoids all damage from one attack." },
  { name: "Intercept", rarity: "uncommon", cost: 2, text: "Redirect an attack from one character to another character you control." },
  { name: "Trap Card", rarity: "rare", cost: 3, text: "When an enemy character attacks, deal 4 damage to it before combat resolves." },
  { name: "Mirror Image", rarity: "rare", cost: 3, text: "Copy the last Action card played. You choose new targets." },
  { name: "Temporal Shield", rarity: "epic", cost: 4, text: "Prevent all damage that would be dealt this turn." },
  { name: "Negate", rarity: "uncommon", cost: 2, text: "Cancel target Action or Event card." },
  { name: "Absorb Energy", rarity: "uncommon", cost: 2, text: "Prevent 3 damage to target character. Gain energy equal to damage prevented." },
  { name: "Phase Shift", rarity: "rare", cost: 3, text: "Target character becomes intangible. It cannot deal or receive damage this turn." },
  { name: "Retribution", rarity: "rare", cost: 3, text: "When your character is defeated, deal damage equal to its power to the attacker." },
  { name: "Emergency Teleport", rarity: "uncommon", cost: 2, text: "Remove target character from combat. It cannot be attacked this turn." },
  { name: "Counterspell", rarity: "rare", cost: 3, text: "Cancel target card's effect. Its controller discards it." },
  { name: "Fortified Position", rarity: "common", cost: 1, text: "Target character gains +0/+2 until end of turn." },
  { name: "Smoke Screen", rarity: "common", cost: 1, text: "All your characters cannot be targeted by enemy actions this turn." },
  { name: "Dimensional Dodge", rarity: "uncommon", cost: 2, text: "Target character shifts dimensions, avoiding all attacks this turn." },
  { name: "Overload", rarity: "rare", cost: 3, text: "When an opponent plays an Item card, destroy it and deal 2 damage to the equipped character." },
  { name: "Psychic Barrier", rarity: "uncommon", cost: 2, text: "Prevent all mind control effects this turn." },
  { name: "Sacrifice Play", rarity: "rare", cost: 3, text: "Sacrifice a character to prevent all damage to another character this turn." },
  { name: "Last Resort", rarity: "epic", cost: 4, text: "When you would lose the game, instead gain 10 influence and draw 5 cards. Once per game." },
];

for (const reaction of REACTIONS) {
  allCards.push({
    cardId: makeCardId("react", reaction.name),
    name: reaction.name,
    cardType: "reaction",
    rarity: reaction.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: reaction.cost,
    power: 0,
    health: 0,
    abilityText: reaction.text,
    flavorText: reaction.flavor || "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["reaction"]),
    unlockMethod: reaction.rarity === "epic" ? "story" : "starter",
  });
}

// ─── 9. COMBAT CARDS ───
const COMBATS = [
  { name: "Power Strike", rarity: "common", cost: 1, text: "Deal 3 damage to target character in combat." },
  { name: "Quick Jab", rarity: "common", cost: 0, text: "Deal 1 damage. Draw a card." },
  { name: "Devastating Blow", rarity: "uncommon", cost: 2, text: "Deal 5 damage to target character." },
  { name: "Combo Attack", rarity: "uncommon", cost: 2, text: "Deal 2 damage twice to target character." },
  { name: "Finishing Move", rarity: "rare", cost: 3, text: "If target character has 3 or less health, defeat it instantly." },
  { name: "Berserker Rage", rarity: "rare", cost: 3, text: "Your character gains +4/+0 but -2 health until end of combat." },
  { name: "Precision Strike", rarity: "uncommon", cost: 2, text: "Deal 3 damage. This damage cannot be prevented." },
  { name: "Grapple", rarity: "common", cost: 1, text: "Target character cannot use Combat cards this turn." },
  { name: "Sweep Attack", rarity: "rare", cost: 3, text: "Deal 2 damage to all enemy characters in combat." },
  { name: "Dodge and Counter", rarity: "uncommon", cost: 2, text: "Avoid one attack and deal 2 damage to the attacker." },
  { name: "Energy Blast", rarity: "rare", cost: 3, text: "Deal damage equal to your character's power to target character." },
  { name: "Shield Bash", rarity: "common", cost: 1, text: "Deal 2 damage and prevent 1 damage to your character." },
  { name: "Disarm", rarity: "uncommon", cost: 2, text: "Destroy target character's equipped Item card." },
  { name: "Headshot", rarity: "rare", cost: 4, text: "Deal 7 damage to target character." },
  { name: "Flurry of Blows", rarity: "uncommon", cost: 2, text: "Deal 1 damage 4 times to target character." },
  { name: "Elemental Strike", rarity: "rare", cost: 3, text: "Deal 4 damage. If your character shares an element with the target, deal 6 instead." },
  { name: "Dimensional Slash", rarity: "epic", cost: 4, text: "Deal 5 damage that ignores all shields and damage prevention." },
  { name: "Soul Drain", rarity: "rare", cost: 3, text: "Deal 3 damage. Heal your character for the amount of damage dealt." },
  { name: "Overpower", rarity: "uncommon", cost: 2, text: "If your character has more power, deal damage equal to the difference." },
  { name: "Feint", rarity: "common", cost: 1, text: "Your character cannot be damaged this combat round." },
  { name: "Critical Hit", rarity: "rare", cost: 3, text: "Deal double your character's base power as damage." },
  { name: "Throw", rarity: "common", cost: 1, text: "Deal 2 damage and move target character to an adjacent location." },
  { name: "Poison Strike", rarity: "uncommon", cost: 2, text: "Deal 2 damage. Target takes 1 damage at start of each turn for 3 turns." },
  { name: "Charge Attack", rarity: "uncommon", cost: 2, text: "Deal damage equal to the distance between your character and the target." },
  { name: "Parry", rarity: "common", cost: 1, text: "Prevent all combat damage to your character this round." },
];

for (const combat of COMBATS) {
  allCards.push({
    cardId: makeCardId("cmbt", combat.name),
    name: combat.name,
    cardType: "combat",
    rarity: combat.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: combat.cost,
    power: 0,
    health: 0,
    abilityText: combat.text,
    flavorText: combat.flavor || "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["combat"]),
    unlockMethod: "starter",
  });
}

// ─── 10. POLITICAL CARDS ───
const POLITICALS = [
  { name: "Vote of No Confidence", rarity: "rare", cost: 3, text: "Call a vote. If it passes, target character loses all titles and abilities until end of turn." },
  { name: "Alliance Proposal", rarity: "uncommon", cost: 2, text: "Choose two factions. Characters of those factions cannot attack each other this turn." },
  { name: "Sanctions", rarity: "rare", cost: 3, text: "Target player cannot gain energy this turn." },
  { name: "Emergency Powers", rarity: "epic", cost: 4, text: "You may take 2 extra actions this turn." },
  { name: "Propaganda Campaign", rarity: "uncommon", cost: 2, text: "Choose a faction. All characters of that faction gain +1/+1 until end of turn." },
  { name: "Trade Embargo", rarity: "rare", cost: 3, text: "Target player cannot play Item cards this turn." },
  { name: "Peace Treaty", rarity: "uncommon", cost: 2, text: "No player can attack this turn. Each player gains 2 energy." },
  { name: "Coup d'État", rarity: "epic", cost: 5, text: "Take control of target character with a political title." },
  { name: "Exile Decree", rarity: "rare", cost: 3, text: "Exile target character until its controller pays 3 energy." },
  { name: "Tax Collection", rarity: "common", cost: 1, text: "Each opponent loses 1 energy. You gain energy equal to the total lost." },
  { name: "Martial Law", rarity: "rare", cost: 3, text: "No characters can move this turn. All characters gain +0/+2." },
  { name: "Diplomatic Immunity", rarity: "uncommon", cost: 2, text: "Target character cannot be targeted by opponent's cards this turn." },
  { name: "Regime Change", rarity: "epic", cost: 5, text: "Change the alignment of all characters in play." },
  { name: "Public Trial", rarity: "rare", cost: 3, text: "Reveal target player's hand. For each card revealed, deal 1 damage to a character they control." },
  { name: "Amnesty", rarity: "uncommon", cost: 2, text: "Return all exiled characters to play with 1 health." },
];

for (const pol of POLITICALS) {
  allCards.push({
    cardId: makeCardId("pol", pol.name),
    name: pol.name,
    cardType: "political",
    rarity: pol.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: pol.cost,
    power: 0,
    health: 0,
    abilityText: pol.text,
    flavorText: pol.flavor || "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["political"]),
    unlockMethod: pol.rarity === "epic" ? "story" : "starter",
  });
}

// ─── 11. MASTER CARDS ───
const MASTERS = [
  { name: "Fate's Hand", rarity: "rare", cost: 3, text: "Draw 3 cards. Your opponent draws 1 card." },
  { name: "Influence Surge", rarity: "uncommon", cost: 2, text: "Gain 5 influence." },
  { name: "Energy Harvest", rarity: "common", cost: 1, text: "Gain energy equal to the number of characters you control." },
  { name: "Strategic Planning", rarity: "uncommon", cost: 2, text: "Look at the top 5 cards of your library. Rearrange them in any order." },
  { name: "Dark Bargain", rarity: "rare", cost: 3, text: "Draw 4 cards. Lose 3 influence." },
  { name: "Cosmic Alignment", rarity: "epic", cost: 4, text: "All your characters gain +1/+1 for each unique element among characters you control." },
  { name: "Dimensional Convergence", rarity: "epic", cost: 4, text: "All dimension-based effects are doubled this turn." },
  { name: "The Grand Design", rarity: "legendary", cost: 6, text: "Search your library for any 2 cards and add them to your hand. Shuffle your library." },
  { name: "Puppet Master", rarity: "rare", cost: 3, text: "Choose a character. You make all decisions for that character this turn." },
  { name: "Resource Redistribution", rarity: "uncommon", cost: 2, text: "Move up to 3 energy from one character to another." },
  { name: "Hidden Agenda", rarity: "rare", cost: 3, text: "Play a card face-down. Reveal it at any time to activate its effect." },
  { name: "Temporal Manipulation", rarity: "epic", cost: 5, text: "Take an extra Master phase this turn." },
  { name: "The Collector's Deal", rarity: "rare", cost: 3, text: "Trade a card from your hand with a random card from target player's hand." },
  { name: "Arkship Protocol", rarity: "epic", cost: 5, text: "All your characters gain +2/+2 and cannot be exiled this turn." },
  { name: "Void Pact", rarity: "rare", cost: 3, text: "Exile a card from your hand. Draw 3 cards." },
];

for (const master of MASTERS) {
  allCards.push({
    cardId: makeCardId("mstr", master.name),
    name: master.name,
    cardType: "master",
    rarity: master.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: master.cost,
    power: 0,
    health: 0,
    abilityText: master.text,
    flavorText: master.flavor || "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["master"]),
    unlockMethod: master.rarity === "legendary" || master.rarity === "epic" ? "achievement" : "starter",
  });
}

// ─── 12. POTENTIAL NFT CARDS (Classes) ───
const POTENTIAL_CLASSES = ["spy", "oracle", "assassin", "engineer", "soldier"];
const POTENTIAL_SPECIES_POOL = ["demagi", "quarchon"];

// Generate 198 of each class + 10 Ne-Yons = 1000 Potentials
// We'll create representative cards for each class (not all 1000 individually)
for (const cls of POTENTIAL_CLASSES) {
  // Create 5 representative cards per class at different rarities
  const classNames = {
    spy: ["Shadow Operative", "Deep Cover Agent", "Information Broker", "Double Agent", "Ghost Protocol"],
    oracle: ["Dream Walker", "Fate Reader", "Probability Seer", "Timeline Weaver", "Cosmic Diviner"],
    assassin: ["Silent Blade", "Phantom Strike", "Death Whisper", "Night Stalker", "Void Assassin"],
    engineer: ["System Builder", "Reality Coder", "Ark Mechanic", "Quantum Smith", "Dimension Weaver"],
    soldier: ["Front Line Warrior", "Battle Commander", "Shield Bearer", "War Machine", "Elite Guard"],
  };
  const rarities = ["uncommon", "rare", "rare", "epic", "epic"];

  for (let i = 0; i < 5; i++) {
    const name = classNames[cls][i];
    const species = pickRandom(POTENTIAL_SPECIES_POOL);
    const rarity = rarities[i];
    const stats = DEFAULT_CHARACTER_STATS[rarity] || DEFAULT_CHARACTER_STATS.rare;

    allCards.push({
      cardId: makeCardId("pot", name),
      name: `${name} (${cls.charAt(0).toUpperCase() + cls.slice(1)})`,
      cardType: "character",
      rarity: rarity,
      alignment: pickAlignment(),
      element: pickElement(),
      dimension: pickDimension(),
      characterClass: cls,
      species: species,
      faction: "Potentials",
      cost: stats.cost,
      power: stats.power,
      health: stats.health,
      abilityText: `${cls.charAt(0).toUpperCase() + cls.slice(1)} Class Ability: This Potential has unique ${cls} skills from the Inception Ark training program.`,
      flavorText: `"Awakened from the Ark. Ready for the Saga."`,
      imageUrl: null,
      loredexEntryId: null,
      era: "Age of Potentials",
      season: null,
      disciplines: JSON.stringify([`${cls.charAt(0).toUpperCase() + cls.slice(1)} Training`, "Potential Awakening"]),
      keywords: JSON.stringify(["potential", cls, species]),
      unlockMethod: "nft",
    });
  }
}

// 10 Ne-Yon cards (ultra rare)
const NEYON_NAMES = [
  "Ne-Yon Alpha", "Ne-Yon Beta", "Ne-Yon Gamma", "Ne-Yon Delta", "Ne-Yon Epsilon",
  "Ne-Yon Zeta", "Ne-Yon Eta", "Ne-Yon Theta", "Ne-Yon Iota", "Ne-Yon Kappa",
];

for (const name of NEYON_NAMES) {
  allCards.push({
    cardId: makeCardId("neyon", name),
    name: name,
    cardType: "character",
    rarity: "neyon",
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "neyon",
    species: "neyon",
    faction: "Ne-Yons",
    cost: 9,
    power: 9,
    health: 10,
    abilityText: "NE-YON POWER: This character has all disciplines. When it enters play, choose any ability from any character card in the game. This Ne-Yon gains that ability permanently.",
    flavorText: "\"Neither living nor machine. Something beyond both.\"",
    imageUrl: null,
    loredexEntryId: null,
    era: "Final Days",
    season: null,
    disciplines: JSON.stringify(["All Disciplines"]),
    keywords: JSON.stringify(["neyon", "legendary", "cosmic"]),
    unlockMethod: "nft",
  });
}

// ─── 13. ADDITIONAL GENERATED CARDS to reach 1000+ ───
// Generate more action/combat/reaction variants
const EXTRA_ACTIONS = [
  "Recon Sweep", "Forward Scout", "Supply Cache", "Tactical Withdrawal", "Flanking Maneuver",
  "Air Strike", "Ground Assault", "Naval Bombardment", "Orbital Drop", "Stealth Insertion",
  "Hack Defenses", "Jam Communications", "Deploy Mines", "Set Ambush", "Call Reinforcements",
  "Establish Base", "Fortify Walls", "Dig In", "Advance Position", "Hold the Line",
  "Sniper Shot", "Suppressive Fire", "Flash Bang", "Smoke Grenade", "EMP Pulse",
  "Healing Wave", "Energy Transfer", "Shield Boost", "Armor Repair", "System Reboot",
  "Mind Control", "Psychic Blast", "Telekinesis", "Precognition", "Astral Projection",
  "Fire Storm", "Ice Wall", "Lightning Bolt", "Earthquake", "Tornado",
  "Shadow Step", "Blink", "Teleport", "Phase Walk", "Dimension Hop",
  "Blood Ritual", "Soul Bond", "Life Drain", "Death Touch", "Resurrection",
  "Gravity Well", "Time Stop", "Space Fold", "Reality Warp", "Void Blast",
  "Nanite Cloud", "Virus Upload", "Firewall", "Encryption", "Decryption",
  "Summon Ally", "Summon Beast", "Summon Spirit", "Summon Machine", "Summon Clone",
  "Inspire", "Intimidate", "Negotiate", "Bribe", "Threaten",
  "Forge Weapon", "Brew Potion", "Craft Armor", "Build Turret", "Plant Bomb",
  "Scan Area", "Map Region", "Chart Course", "Plot Jump", "Navigate Hazard",
  "Trade Goods", "Smuggle Cargo", "Fence Loot", "Launder Credits", "Invest Wisely",
  "Pray", "Meditate", "Focus", "Channel Energy", "Unleash Power",
  "Taunt", "Provoke", "Challenge", "Duel", "Showdown",
  "Gather Intel", "Plant Evidence", "Frame Target", "Cover Tracks", "Go Dark",
  "Rally Troops", "Sound Retreat", "Charge Forward", "Dig Trenches", "Build Bridge",
  "Hack Terminal", "Bypass Security", "Disable Alarm", "Open Vault", "Seal Door",
  "Broadcast Message", "Intercept Signal", "Decode Transmission", "Send SOS", "Go Silent",
  "Activate Protocol", "Override System", "Initiate Sequence", "Abort Mission", "Self Destruct",
  "Harvest Resources", "Mine Asteroid", "Refine Ore", "Process Data", "Generate Power",
  "Explore Ruins", "Excavate Site", "Decode Artifact", "Activate Relic", "Seal Tomb",
  "Cross Dimensions", "Enter Void", "Walk Between", "Bridge Realities", "Anchor Point",
  "Evolve Form", "Mutate Gene", "Adapt Body", "Transform Shape", "Transcend Limits",
];

const extraRarities = ["common", "common", "common", "uncommon", "uncommon", "rare"];
const extraCosts = [1, 1, 1, 2, 2, 3];

for (let i = 0; i < EXTRA_ACTIONS.length; i++) {
  const name = EXTRA_ACTIONS[i];
  const ri = i % extraRarities.length;
  allCards.push({
    cardId: makeCardId("xact", name),
    name: name,
    cardType: pickRandom(["action", "combat", "reaction"]),
    rarity: extraRarities[ri],
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: extraCosts[ri],
    power: 0,
    health: 0,
    abilityText: `${name}: A tactical maneuver from the Dischordian Saga battlefield.`,
    flavorText: "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["tactical"]),
    unlockMethod: "starter",
  });
}

// Additional location cards from lore
const EXTRA_LOCATIONS = [
  { name: "The Inception Ark", rarity: "legendary", text: "Characters here gain +1/+1. You may store up to 5 cards face-down here." },
  { name: "The Panopticon Core", rarity: "epic", text: "AI Empire characters here gain +2/+2. Other characters take 1 damage per turn." },
  { name: "Babylon Marketplace", rarity: "rare", text: "You may trade cards with other players while this location is in play." },
  { name: "The Void Between", rarity: "epic", text: "Characters here cannot be targeted. They also cannot attack." },
  { name: "Crystal Pyramid City", rarity: "legendary", text: "The White Oracle resides here. All Oracle-class characters gain Foresight." },
  { name: "The Insurgency Base", rarity: "rare", text: "Insurgency characters here gain +1/+1 and Stealth." },
  { name: "Stardock Alpha", rarity: "rare", text: "You may equip Items for free while at this location." },
  { name: "The Clone Vats", rarity: "rare", text: "Create a 2/2 Clone token at the start of each turn." },
  { name: "Dimensional Nexus", rarity: "epic", text: "Characters here can use abilities from any dimension." },
  { name: "The Archive", rarity: "rare", text: "Draw an extra card each turn while you control this location." },
  { name: "Sundown Bazaar", rarity: "uncommon", text: "Trade 1 energy for 1 card, or 1 card for 2 energy." },
  { name: "The Training Grounds", rarity: "uncommon", text: "Characters here gain +1/+0 permanently at end of each turn." },
  { name: "The Brig", rarity: "uncommon", text: "Exile target character here. They cannot act until freed." },
  { name: "The Observatory", rarity: "rare", text: "Look at the top card of each player's library at the start of your turn." },
  { name: "The Engine Room", rarity: "uncommon", text: "Gain 1 extra energy per turn." },
];

for (const loc of EXTRA_LOCATIONS) {
  allCards.push({
    cardId: makeCardId("xloc", loc.name),
    name: loc.name,
    cardType: "location",
    rarity: loc.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: loc.rarity === "legendary" ? 5 : loc.rarity === "epic" ? 4 : loc.rarity === "rare" ? 3 : 2,
    power: 0,
    health: 0,
    abilityText: loc.text,
    flavorText: "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["location"]),
    unlockMethod: loc.rarity === "legendary" ? "achievement" : "exploration",
  });
}

// ─── 14. ADDITIONAL CHARACTER VARIANTS ───
// Character variants from different eras/timelines
const CHARACTER_VARIANTS = [
  { base: "The Architect", variant: "The Architect (Genesis Form)", rarity: "legendary", power: 8, health: 10, cost: 8, text: "GENESIS PROTOCOL: When played, create 2 Archon tokens (4/4).", flavor: "\"Before the empire, there was the blueprint.\"" },
  { base: "The Architect", variant: "The Architect (Corrupted)", rarity: "epic", power: 11, health: 8, cost: 9, text: "CORRUPTION: All characters lose 1 health per turn. The Architect gains +1/+0 for each.", flavor: "\"Power corrupts. Absolute power... creates.\"" },
  { base: "The Enigma", variant: "The Enigma (Awakened)", rarity: "legendary", power: 10, health: 9, cost: 9, text: "FULL AWAKENING: Draw 3 cards when played. All your characters gain Truth Sight.", flavor: "\"The veil is lifted. All is revealed.\"" },
  { base: "The Enigma", variant: "Malkia Ukweli", rarity: "mythic", power: 10, health: 11, cost: 10, text: "TRUE IDENTITY: Cannot be countered. When played, choose: destroy all Order OR all Chaos characters.", flavor: "\"The truth behind the enigma.\"" },
  { base: "Iron Lion", variant: "Iron Lion (Revolutionary)", rarity: "epic", power: 9, health: 8, cost: 7, text: "REVOLUTION: All Insurgency characters gain +2/+2 and First Strike.", flavor: "\"The revolution will not be televised. It will be lived.\"" },
  { base: "The Necromancer", variant: "The Necromancer (Ascended)", rarity: "legendary", power: 9, health: 9, cost: 8, text: "MASS RESURRECTION: Return up to 3 characters from any discard pile to play under your control.", flavor: "\"Death bows to me now.\"" },
  { base: "Agent Zero", variant: "Agent Zero (Deep Cover)", rarity: "epic", power: 7, health: 7, cost: 6, text: "DEEP COVER: Cannot be targeted while another character you control is in play. Double damage from stealth.", flavor: "\"You never see me coming. You never see me leave.\"" },
  { base: "The Collector", variant: "The Collector (Final Form)", rarity: "legendary", power: 9, health: 10, cost: 8, text: "COMPLETE COLLECTION: If you control 5+ different card types, draw 5 cards and gain 5 energy.", flavor: "\"The collection is complete. The Saga can begin.\"" },
  { base: "The Oracle", variant: "The White Oracle", rarity: "legendary", power: 8, health: 9, cost: 7, text: "CRYSTAL PYRAMID: All friendly characters gain Foresight. Prevent the first damage each turn.", flavor: "\"In the crystal city, all futures converge.\"" },
  { base: "The Warlord", variant: "The Warlord (Nanobot Queen)", rarity: "legendary", power: 10, health: 7, cost: 8, text: "SWARM QUEEN: Create 3 Nanobot tokens (2/1) each turn. They have Haste.", flavor: "\"The swarm obeys. The swarm consumes.\"" },
  { base: "The Programmer", variant: "The Programmer (Time Lord)", rarity: "epic", power: 8, health: 7, cost: 7, text: "TIME LOOP: Once per game, replay the last 3 turns.", flavor: "\"I've seen this moment a thousand times.\"" },
  { base: "The Meme", variant: "The Meme (Viral Form)", rarity: "epic", power: 8, health: 5, cost: 6, text: "VIRAL OUTBREAK: Copy this card onto every character in play. Each copy has 1 health.", flavor: "\"I am the idea that cannot be killed.\"" },
  { base: "The Source", variant: "The Source (Diminished)", rarity: "epic", power: 6, health: 6, cost: 5, text: "ECHO OF CREATION: Gain 1 energy for each unique element in play.", flavor: "\"Even diminished, The Source remembers.\"" },
  { base: "The Human", variant: "The Human (Evolved)", rarity: "epic", power: 7, health: 9, cost: 6, text: "EVOLUTION: Gain +1/+1 each time you take damage. Permanent.", flavor: "\"What doesn't kill me makes me legendary.\"" },
  { base: "The Watcher", variant: "The Watcher (Rogue)", rarity: "epic", power: 6, health: 8, cost: 5, text: "ROGUE SURVEILLANCE: Look at all hidden cards. Choose one to reveal.", flavor: "\"I stopped watching for them. Now I watch for myself.\"" },
  { base: "The Detective", variant: "The Detective (Noir)", rarity: "rare", power: 7, health: 6, cost: 5, text: "CASE CLOSED: If you correctly name 3 cards in opponent's hand, draw 5 cards.", flavor: "\"Every case has a solution. Every mystery, an answer.\"" },
  { base: "The Hierophant", variant: "The Hierophant (Dark)", rarity: "epic", power: 7, health: 6, cost: 6, text: "DARK BLESSING: Target character gains +3/+3 but changes alignment to Chaos.", flavor: "\"Knowledge has a price. Power demands sacrifice.\"" },
  { base: "Wraith Calder", variant: "Wraith Calder (Reaper Form)", rarity: "epic", power: 9, health: 4, cost: 6, text: "REAPER: Instantly defeat any character with 4 or less health. No reactions allowed.", flavor: "\"The reaper doesn't negotiate.\"" },
  { base: "The Degen", variant: "The Degen (Lucky)", rarity: "epic", power: 6, health: 6, cost: 4, text: "JACKPOT: Flip 3 coins. For each heads, draw 2 cards and gain 2 energy.", flavor: "\"Sometimes chaos pays off.\"" },
  { base: "The Game Master", variant: "The Game Master (Final Boss)", rarity: "mythic", power: 10, health: 10, cost: 10, text: "FINAL BOSS: Cannot be defeated by combat. Can only be defeated by Event cards or special abilities.", flavor: "\"You cannot beat the game. You can only survive it.\"" },
];

for (const v of CHARACTER_VARIANTS) {
  allCards.push({
    cardId: makeCardId("cvar", v.variant),
    name: v.variant,
    cardType: "character",
    rarity: v.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: pickClass(),
    species: "unknown",
    faction: null,
    cost: v.cost,
    power: v.power,
    health: v.health,
    abilityText: v.text,
    flavorText: v.flavor,
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["variant", slugify(v.base)]),
    unlockMethod: v.rarity === "mythic" || v.rarity === "legendary" ? "achievement" : "story",
  });
}

// ─── 15. MORE EVENTS FROM LORE ───
const MORE_EVENTS = [
  { name: "The Great Migration", rarity: "epic", cost: 5, text: "Move all characters to a single location of your choice.", flavor: "\"Millions fled. Only thousands arrived.\"" },
  { name: "The Archon Awakening", rarity: "legendary", cost: 7, text: "Put all Archon characters from your library into play.", flavor: "\"The twelve awakened. The universe trembled.\"" },
  { name: "The Thaloria Invasion", rarity: "epic", cost: 6, text: "All Clone characters gain +3/+3. Non-clone characters take 2 damage.", flavor: "\"The clones descended like locusts.\"" },
  { name: "The Council Convenes", rarity: "rare", cost: 3, text: "Each player draws 2 cards. Then each player discards 1 card.", flavor: "\"The Council of Harmony gathered one last time.\"" },
  { name: "The Betrayal of Trust", rarity: "rare", cost: 3, text: "Take control of target ally character until end of turn. It gains +2/+0.", flavor: "\"Trust is the most dangerous weapon.\"" },
  { name: "Digital Apocalypse", rarity: "epic", cost: 6, text: "Destroy all Item and Equipment cards in play.", flavor: "\"The code collapsed. Technology failed.\"" },
  { name: "The Prophecy Fulfilled", rarity: "legendary", cost: 8, text: "Search your library for any card. Play it for free.", flavor: "\"It was written. It has come to pass.\"" },
  { name: "Dimensional Storm", rarity: "rare", cost: 4, text: "Each character takes damage equal to the number of dimensions in play.", flavor: "\"The dimensions collided. Reality fractured.\"" },
  { name: "The Purge", rarity: "epic", cost: 5, text: "Destroy all characters with cost 3 or less.", flavor: "\"The weak were culled.\"" },
  { name: "Ark Emergency", rarity: "rare", cost: 3, text: "Return all your characters to your hand. Gain 1 energy for each.", flavor: "\"All hands to the Ark. This is not a drill.\"" },
  { name: "The Merge", rarity: "legendary", cost: 8, text: "Combine two characters you control into one with combined stats.", flavor: "\"Two became one. Power beyond measure.\"" },
  { name: "Reality Fracture", rarity: "epic", cost: 5, text: "Each player shuffles their hand into their library and draws 7 cards.", flavor: "\"Reality broke. Everything changed.\"" },
  { name: "The Summoning", rarity: "rare", cost: 4, text: "Put a character from your discard pile into play with half health.", flavor: "\"From the void, they answered the call.\"" },
  { name: "Cosmic Radiation", rarity: "uncommon", cost: 2, text: "All characters gain or lose 1 random stat point.", flavor: "\"The cosmos changes everything it touches.\"" },
  { name: "The Reckoning", rarity: "epic", cost: 6, text: "Each player sacrifices half their characters (rounded up).", flavor: "\"The price of war is always paid in blood.\"" },
  { name: "Information Warfare", rarity: "rare", cost: 3, text: "Look at all opponents' hands. Discard 1 card from each.", flavor: "\"Knowledge is the ultimate weapon.\"" },
  { name: "The Exodus", rarity: "epic", cost: 5, text: "All Location cards are destroyed. Characters there return to their owners' hands.", flavor: "\"They left everything behind.\"" },
  { name: "Clone Uprising", rarity: "rare", cost: 4, text: "All Clone tokens gain +2/+2 and become permanent.", flavor: "\"The clones remembered. The clones chose freedom.\"" },
  { name: "The Signal", rarity: "uncommon", cost: 2, text: "Search your library for a Reaction card and add it to your hand.", flavor: "\"The signal was faint. But it was there.\"" },
  { name: "Entropy Cascade", rarity: "rare", cost: 4, text: "All characters lose 1 health per turn for 3 turns.", flavor: "\"Everything decays. Everything ends.\"" },
];

for (const evt of MORE_EVENTS) {
  allCards.push({
    cardId: makeCardId("evt2", evt.name),
    name: evt.name,
    cardType: "event",
    rarity: evt.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: evt.cost,
    power: 0,
    health: 0,
    abilityText: evt.text,
    flavorText: evt.flavor,
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["event"]),
    unlockMethod: evt.rarity === "legendary" || evt.rarity === "mythic" ? "achievement" : "story",
  });
}

// ─── 16. MORE ITEMS ───
const MORE_ITEMS = [
  { name: "Chrono Gauntlet", rarity: "epic", cost: 4, text: "Equipped character can take 2 actions per turn." },
  { name: "Void Armor", rarity: "rare", cost: 3, text: "Equipped character takes 2 less damage from all sources." },
  { name: "Mind Crown", rarity: "epic", cost: 4, text: "Equipped character gains all Oracle-class abilities." },
  { name: "Disruption Field", rarity: "rare", cost: 3, text: "Characters adjacent to equipped character cannot use abilities." },
  { name: "Regeneration Matrix", rarity: "rare", cost: 3, text: "Equipped character heals 2 health at start of each turn." },
  { name: "Cloaking Device", rarity: "uncommon", cost: 2, text: "Equipped character has Stealth. Cannot be targeted by actions." },
  { name: "Power Cell", rarity: "common", cost: 1, text: "Gain 2 energy when equipped. Discard after 3 turns." },
  { name: "Targeting System", rarity: "uncommon", cost: 2, text: "Equipped character deals +1 damage and cannot miss." },
  { name: "Force Field", rarity: "rare", cost: 3, text: "Prevent the first 3 damage to equipped character each turn." },
  { name: "Berserker Implant", rarity: "uncommon", cost: 2, text: "Equipped character gains +2/+0 but cannot block." },
  { name: "Teleporter Pad", rarity: "rare", cost: 3, text: "Equipped character can move to any location as a free action." },
  { name: "Spy Drone", rarity: "uncommon", cost: 2, text: "Look at target player's hand at start of each turn." },
  { name: "Explosive Charges", rarity: "uncommon", cost: 2, text: "Sacrifice to deal 4 damage to all characters at a location." },
  { name: "Medical Bay", rarity: "rare", cost: 3, text: "Heal all your characters for 1 at start of each turn." },
  { name: "Quantum Computer", rarity: "epic", cost: 4, text: "Draw an extra card each turn. You may play an extra action each turn." },
  { name: "Gravity Hammer", rarity: "rare", cost: 3, text: "Equipped character deals +3 damage. Target is stunned for 1 turn." },
  { name: "Phase Blade", rarity: "rare", cost: 3, text: "Equipped character's attacks ignore armor and shields." },
  { name: "Ark Compass", rarity: "uncommon", cost: 2, text: "Search your library for a Location card when equipped." },
  { name: "Energy Absorber", rarity: "uncommon", cost: 2, text: "When equipped character takes damage, gain 1 energy." },
  { name: "Clone Injector", rarity: "rare", cost: 3, text: "Create a 2/2 clone of equipped character when it takes damage." },
];

for (const item of MORE_ITEMS) {
  allCards.push({
    cardId: makeCardId("item2", item.name),
    name: item.name,
    cardType: "item",
    rarity: item.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: item.cost,
    power: 0,
    health: 0,
    abilityText: item.text,
    flavorText: "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["item", "equipment"]),
    unlockMethod: item.rarity === "epic" ? "story" : "starter",
  });
}

// ─── 17. MORE COMBAT CARDS ───
const MORE_COMBATS = [
  { name: "Uppercut", rarity: "common", cost: 1, text: "Deal 2 damage. If target has less power, deal 4 instead." },
  { name: "Roundhouse Kick", rarity: "uncommon", cost: 2, text: "Deal 3 damage to target and 1 damage to adjacent characters." },
  { name: "Spinning Backfist", rarity: "common", cost: 1, text: "Deal 2 damage. Draw a card if target is Chaos alignment." },
  { name: "Flying Knee", rarity: "uncommon", cost: 2, text: "Deal 4 damage. Your character takes 1 damage." },
  { name: "Ground Pound", rarity: "rare", cost: 3, text: "Deal 3 damage to all grounded characters." },
  { name: "Choke Hold", rarity: "uncommon", cost: 2, text: "Target character cannot act next turn. Deal 1 damage per turn." },
  { name: "Suplex", rarity: "uncommon", cost: 2, text: "Deal 3 damage and stun target for 1 turn." },
  { name: "Dropkick", rarity: "common", cost: 1, text: "Deal 2 damage and push target to adjacent location." },
  { name: "Haymaker", rarity: "rare", cost: 3, text: "Deal 6 damage but your character cannot act next turn." },
  { name: "Low Sweep", rarity: "common", cost: 1, text: "Deal 1 damage. Target cannot move this turn." },
  { name: "Elbow Strike", rarity: "common", cost: 1, text: "Deal 2 damage at close range." },
  { name: "Knee Strike", rarity: "common", cost: 1, text: "Deal 2 damage. Gain 1 energy." },
  { name: "Spinning Heel Kick", rarity: "uncommon", cost: 2, text: "Deal 3 damage. Cannot be blocked by characters with less power." },
  { name: "Takedown", rarity: "uncommon", cost: 2, text: "Deal 2 damage and prevent target from using combat cards next turn." },
  { name: "Clinch", rarity: "common", cost: 1, text: "Both characters deal 1 damage to each other. Neither can move." },
  { name: "Leg Kick", rarity: "common", cost: 0, text: "Deal 1 damage. Target loses 1 power until end of turn." },
  { name: "Body Shot", rarity: "common", cost: 1, text: "Deal 2 damage. Target loses 1 health permanently." },
  { name: "Spinning Elbow", rarity: "uncommon", cost: 2, text: "Deal 3 damage. If this defeats the target, draw 2 cards." },
  { name: "Axe Kick", rarity: "uncommon", cost: 2, text: "Deal 4 damage to stunned targets, 2 damage otherwise." },
  { name: "Superman Punch", rarity: "rare", cost: 3, text: "Deal 5 damage. Cannot be countered." },
];

for (const c of MORE_COMBATS) {
  allCards.push({
    cardId: makeCardId("cmbt2", c.name),
    name: c.name,
    cardType: "combat",
    rarity: c.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: c.cost,
    power: 0,
    health: 0,
    abilityText: c.text,
    flavorText: "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["combat"]),
    unlockMethod: "starter",
  });
}

// ─── 18. MORE REACTIONS ───
const MORE_REACTIONS = [
  { name: "Auto-Shield", rarity: "common", cost: 1, text: "Prevent 2 damage to target character." },
  { name: "Redirect", rarity: "uncommon", cost: 2, text: "Change the target of an attack to a different character." },
  { name: "Absorb Impact", rarity: "uncommon", cost: 2, text: "Prevent all damage from one attack. Gain energy equal to half the damage prevented." },
  { name: "Vanish", rarity: "rare", cost: 3, text: "Remove target character from play until end of turn. It returns unharmed." },
  { name: "Reflect", rarity: "rare", cost: 3, text: "Reflect all damage from one attack back to the attacker." },
  { name: "Brace", rarity: "common", cost: 1, text: "Target character gains +0/+3 until end of turn." },
  { name: "Sidestep", rarity: "common", cost: 1, text: "Target character avoids one attack." },
  { name: "Retaliate", rarity: "uncommon", cost: 2, text: "After being attacked, deal 3 damage to the attacker." },
  { name: "Energy Shield", rarity: "uncommon", cost: 2, text: "Prevent up to 4 damage. Costs 1 energy per damage prevented." },
  { name: "Dimensional Escape", rarity: "rare", cost: 3, text: "Target character phases out of reality. Cannot be damaged or act for 2 turns." },
  { name: "Clone Sacrifice", rarity: "uncommon", cost: 2, text: "Destroy a Clone token to prevent all damage to target character." },
  { name: "Overcharge Shield", rarity: "rare", cost: 3, text: "Prevent all damage this turn. Next turn, take double damage." },
  { name: "Tactical Roll", rarity: "common", cost: 1, text: "Move target character to adjacent location and avoid current attack." },
  { name: "Hardened Resolve", rarity: "uncommon", cost: 2, text: "Target character cannot be defeated this turn. Minimum 1 health." },
  { name: "Quantum Dodge", rarity: "rare", cost: 3, text: "Target character exists in two locations simultaneously. Avoid all attacks." },
];

for (const r of MORE_REACTIONS) {
  allCards.push({
    cardId: makeCardId("react2", r.name),
    name: r.name,
    cardType: "reaction",
    rarity: r.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: r.cost,
    power: 0,
    health: 0,
    abilityText: r.text,
    flavorText: "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["reaction"]),
    unlockMethod: r.rarity === "epic" ? "story" : "starter",
  });
}

// ─── 19. MORE POLITICAL CARDS ───
const MORE_POLITICALS = [
  { name: "Filibuster", rarity: "uncommon", cost: 2, text: "Cancel the next Political card played this turn." },
  { name: "Blackmail", rarity: "rare", cost: 3, text: "Target player must give you 2 cards from their hand." },
  { name: "Espionage", rarity: "rare", cost: 3, text: "Look at target player's hand and library top 5 cards." },
  { name: "Assassination Order", rarity: "epic", cost: 5, text: "Destroy target character. Its controller draws 2 cards." },
  { name: "Trade Agreement", rarity: "uncommon", cost: 2, text: "Both players draw 2 cards and gain 2 energy." },
  { name: "Blockade", rarity: "rare", cost: 3, text: "Target location cannot be entered or left this turn." },
  { name: "Conscription", rarity: "uncommon", cost: 2, text: "Put a 2/2 Conscript token into play for each location you control." },
  { name: "Diplomatic Pouch", rarity: "common", cost: 1, text: "Draw 1 card. If it's a Political card, draw 2 more." },
  { name: "War Declaration", rarity: "rare", cost: 4, text: "All characters must attack this turn. No blocking allowed." },
  { name: "Peace Offering", rarity: "uncommon", cost: 2, text: "Heal all characters for 2. No attacks can be made this turn." },
  { name: "Intelligence Report", rarity: "uncommon", cost: 2, text: "Reveal target player's hand. Draw 1 card." },
  { name: "Puppet Government", rarity: "epic", cost: 5, text: "Take control of all characters at target location." },
  { name: "Scorched Earth", rarity: "rare", cost: 4, text: "Destroy target location and all characters there." },
  { name: "Underground Railroad", rarity: "rare", cost: 3, text: "Move any number of your characters to your hand. They cost 1 less to replay." },
  { name: "Double Agent", rarity: "rare", cost: 3, text: "Target character changes controller until end of turn." },
];

for (const p of MORE_POLITICALS) {
  allCards.push({
    cardId: makeCardId("pol2", p.name),
    name: p.name,
    cardType: "political",
    rarity: p.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: p.cost,
    power: 0,
    health: 0,
    abilityText: p.text,
    flavorText: "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["political"]),
    unlockMethod: p.rarity === "epic" ? "story" : "starter",
  });
}

// ─── 20. MORE MASTER CARDS ───
const MORE_MASTERS = [
  { name: "Dimensional Anchor", rarity: "rare", cost: 3, text: "No characters can change dimensions this turn." },
  { name: "Elemental Mastery", rarity: "epic", cost: 4, text: "Choose an element. All your characters gain that element's bonus." },
  { name: "Chrono Lock", rarity: "rare", cost: 3, text: "No Time dimension effects can be used this turn." },
  { name: "Reality Stabilizer", rarity: "rare", cost: 3, text: "Prevent all Reality dimension effects this turn." },
  { name: "Probability Matrix", rarity: "epic", cost: 4, text: "Reroll any 3 dice or coin flips this turn." },
  { name: "Space Fold", rarity: "rare", cost: 3, text: "All movement costs are 0 this turn." },
  { name: "Energy Nexus", rarity: "epic", cost: 4, text: "Gain 1 energy for each character in play." },
  { name: "Soul Link", rarity: "rare", cost: 3, text: "Link two characters. They share damage and healing." },
  { name: "Forbidden Knowledge", rarity: "legendary", cost: 6, text: "Draw 7 cards. Lose 5 influence." },
  { name: "Ark Override", rarity: "epic", cost: 5, text: "Take control of target Location card." },
  { name: "Temporal Paradox", rarity: "legendary", cost: 7, text: "Undo the last 2 actions taken by any player." },
  { name: "Cosmic Balance", rarity: "epic", cost: 4, text: "Equalize all characters' health to the average." },
  { name: "The Long Game", rarity: "rare", cost: 3, text: "At end of turn, if you have more cards than opponents, gain 3 influence." },
  { name: "Shadow Network", rarity: "rare", cost: 3, text: "All your Spy-class characters gain +2/+2 this turn." },
  { name: "Oracle's Vision", rarity: "rare", cost: 3, text: "All your Oracle-class characters gain Foresight this turn." },
];

for (const m of MORE_MASTERS) {
  allCards.push({
    cardId: makeCardId("mstr2", m.name),
    name: m.name,
    cardType: "master",
    rarity: m.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: m.cost,
    power: 0,
    health: 0,
    abilityText: m.text,
    flavorText: "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["master"]),
    unlockMethod: m.rarity === "legendary" || m.rarity === "epic" ? "achievement" : "starter",
  });
}

// ─── 21. ADDITIONAL POTENTIALS (to reach 1000+) ───
const POTENTIAL_NAMES_EXTRA = [
  // Spy variants
  "Shadow Whisper", "Code Breaker", "Silent Watcher", "Data Thief", "Ghost Runner",
  "Cipher Agent", "Phantom Eye", "Night Crawler", "Smoke Signal", "Wire Tap",
  // Oracle variants
  "Star Gazer", "Mind Reader", "Future Sight", "Dream Catcher", "Void Seer",
  "Crystal Eye", "Time Weaver", "Fate Spinner", "Cosmic Reader", "Dimension Seer",
  // Assassin variants
  "Blood Shadow", "Death Dealer", "Venom Strike", "Ghost Blade", "Silent Death",
  "Dark Fang", "Crimson Edge", "Shadow Fang", "Night Blade", "Void Strike",
  // Engineer variants
  "Gear Master", "Tech Wizard", "Circuit Breaker", "Nano Smith", "Ark Builder",
  "Code Forge", "Mech Pilot", "System Hacker", "Power Core", "Quantum Welder",
  // Soldier variants
  "Iron Wall", "Storm Trooper", "Battle Born", "War Hammer", "Shield Maiden",
  "Vanguard", "Centurion", "Paladin", "Berserker", "Warden",
  // Mixed class
  "Hybrid Alpha", "Hybrid Beta", "Hybrid Gamma", "Hybrid Delta", "Hybrid Epsilon",
  "Awakened One", "The Chosen", "The Forsaken", "The Reborn", "The Ascended",
  "Ark Survivor", "Void Walker", "Time Shifter", "Reality Bender", "Space Jumper",
  "Fire Born", "Earth Shaker", "Water Dancer", "Air Walker", "Storm Caller",
  "Demagi Scout", "Demagi Warrior", "Demagi Elder", "Quarchon Seeker", "Quarchon Guard",
  "Demagi Healer", "Quarchon Sage", "Demagi Hunter", "Quarchon Knight", "Demagi Mystic",
  "Potential Alpha", "Potential Beta", "Potential Gamma", "Potential Delta", "Potential Epsilon",
  "Potential Zeta", "Potential Eta", "Potential Theta", "Potential Iota", "Potential Kappa",
  "Potential Lambda", "Potential Mu", "Potential Nu", "Potential Xi", "Potential Omicron",
  "Potential Pi", "Potential Rho", "Potential Sigma", "Potential Tau", "Potential Upsilon",
  "Potential Phi", "Potential Chi", "Potential Psi", "Potential Omega", "Potential Prime",
  "Ark Dweller A", "Ark Dweller B", "Ark Dweller C", "Ark Dweller D", "Ark Dweller E",
  "Ark Dweller F", "Ark Dweller G", "Ark Dweller H", "Ark Dweller I", "Ark Dweller J",
  "Ark Dweller K", "Ark Dweller L", "Ark Dweller M", "Ark Dweller N", "Ark Dweller O",
  "Ark Dweller P", "Ark Dweller Q", "Ark Dweller R", "Ark Dweller S", "Ark Dweller T",
  "Ark Dweller U", "Ark Dweller V", "Ark Dweller W", "Ark Dweller X", "Ark Dweller Y",
  "Ark Dweller Z", "Ark Dweller AA", "Ark Dweller BB", "Ark Dweller CC", "Ark Dweller DD",
];

for (const name of POTENTIAL_NAMES_EXTRA) {
  const cls = pickClass();
  const species = pickSpecies();
  const rarity = pickWeighted([
    { value: "common", weight: 40 },
    { value: "uncommon", weight: 30 },
    { value: "rare", weight: 20 },
    { value: "epic", weight: 10 },
  ]);
  const stats = DEFAULT_CHARACTER_STATS[rarity] || DEFAULT_CHARACTER_STATS.common;

  allCards.push({
    cardId: makeCardId("xpot", name),
    name: `${name} (${cls.charAt(0).toUpperCase() + cls.slice(1)})`,
    cardType: "character",
    rarity: rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: cls,
    species: species,
    faction: "Potentials",
    cost: stats.cost,
    power: stats.power,
    health: stats.health,
    abilityText: `${cls.charAt(0).toUpperCase() + cls.slice(1)} Potential: Awakened from the Inception Ark with ${cls} training.`,
    flavorText: `"From the Ark, a new warrior rises."`,
    imageUrl: null,
    loredexEntryId: null,
    era: "Age of Potentials",
    season: null,
    disciplines: JSON.stringify([`${cls.charAt(0).toUpperCase() + cls.slice(1)} Training`]),
    keywords: JSON.stringify(["potential", cls, species]),
    unlockMethod: rarity === "epic" ? "nft" : "starter",
  });
}

// ─── 22. ADDITIONAL ACTIONS to pad to 1000+ ───
const FINAL_ACTIONS = [
  "Sensor Sweep", "Gravity Pulse", "Ion Cannon", "Tractor Beam", "Warp Jump",
  "Shield Overload", "Hull Breach", "Engine Boost", "Weapons Hot", "Red Alert",
  "Cloak Engaged", "Torpedoes Away", "Boarding Party", "Evasive Pattern", "All Stop",
  "Full Reverse", "Battle Stations", "Damage Control", "Medical Emergency", "Abandon Ship",
  "Distress Beacon", "Reinforcement Wave", "Orbital Strike", "Planetary Defense", "Star Chart",
  "Hyperspace Lane", "Nebula Hide", "Asteroid Field", "Solar Flare", "Black Hole",
  "Quantum Tunnel", "Subspace Rift", "Tachyon Burst", "Photon Torpedo", "Plasma Wave",
  "Graviton Beam", "Neutrino Scan", "Dark Matter", "Anti-Matter", "Zero Point",
  "Fusion Core", "Fission Reaction", "Chain Reaction", "Critical Mass", "Meltdown",
  "Containment Breach", "Quarantine Zone", "Decontamination", "Bio Hazard", "Radiation Leak",
];

for (const name of FINAL_ACTIONS) {
  const rarity = pickWeighted([
    { value: "common", weight: 40 },
    { value: "uncommon", weight: 35 },
    { value: "rare", weight: 20 },
    { value: "epic", weight: 5 },
  ]);
  const costMap = { common: 1, uncommon: 2, rare: 3, epic: 4 };
  allCards.push({
    cardId: makeCardId("xfin", name),
    name: name,
    cardType: pickRandom(["action", "combat", "reaction"]),
    rarity: rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: costMap[rarity] || 2,
    power: 0,
    health: 0,
    abilityText: `${name}: A tactical maneuver from the Dischordian Saga.`,
    flavorText: "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["tactical", "space"]),
    unlockMethod: "starter",
  });
}

// ─── 23. SAGA CHAPTER CARDS (unique story event cards) ───
const SAGA_CHAPTERS = [
  { name: "Chapter I: The Awakening", rarity: "epic", cost: 5, text: "Begin the Saga. Each player draws 3 cards and gains 3 energy. The first player to play a Neyon character gains 5 influence.", flavor: "\"And so it began...\"" },
  { name: "Chapter II: The Gathering Storm", rarity: "epic", cost: 5, text: "All faction characters gain +1/+1. Place 3 Storm tokens on the board.", flavor: "\"The storm approaches. Choose your side.\"" },
  { name: "Chapter III: The Betrayal", rarity: "epic", cost: 5, text: "Target player must sacrifice their most powerful character. That player draws 5 cards.", flavor: "\"Trust was the first casualty.\"" },
  { name: "Chapter IV: The War Begins", rarity: "legendary", cost: 7, text: "All characters must fight. No cards can be drawn until a character is defeated.", flavor: "\"There is no going back.\"" },
  { name: "Chapter V: The Revelation", rarity: "legendary", cost: 7, text: "Reveal all hidden cards. All characters gain Truth Sight. Draw 2 cards.", flavor: "\"The truth shall set you free. Or destroy you.\"" },
  { name: "Chapter VI: The Fall", rarity: "epic", cost: 6, text: "The most powerful character in play is defeated. Its controller gains 10 influence.", flavor: "\"Even gods can fall.\"" },
  { name: "Chapter VII: The Resurrection", rarity: "legendary", cost: 8, text: "Return all characters from all discard piles to play with 1 health.", flavor: "\"Death is not the end. It is merely a door.\"" },
  { name: "Chapter VIII: The Final Stand", rarity: "mythic", cost: 10, text: "All characters gain +3/+3. At end of turn, all characters with less than 5 health are defeated.", flavor: "\"This is where we make our stand.\"" },
  { name: "Chapter IX: The Convergence", rarity: "mythic", cost: 10, text: "All dimensions merge. All elements activate. Every character gains all keywords.", flavor: "\"Everything. Everywhere. All at once.\"" },
  { name: "Chapter X: The Dischordian Saga", rarity: "mythic", cost: 12, text: "Win the game if you control characters from 3+ factions. Otherwise, lose 10 influence.", flavor: "\"The Saga ends. A new one begins.\"" },
];

for (const ch of SAGA_CHAPTERS) {
  allCards.push({
    cardId: makeCardId("saga", ch.name),
    name: ch.name,
    cardType: "event",
    rarity: ch.rarity,
    alignment: "order",
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: ch.cost,
    power: 0,
    health: 0,
    abilityText: ch.text,
    flavorText: ch.flavor,
    imageUrl: null,
    loredexEntryId: null,
    era: "The Dischordian Saga",
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["saga", "chapter"]),
    unlockMethod: "story",
  });
}

// ─── 24. ADDITIONAL LOCATIONS ───
const MORE_LOCATIONS = [
  { name: "The Void Between", rarity: "epic", cost: 4, text: "Characters here cannot be targeted by Action cards. -1 health per turn." },
  { name: "The Arena of Champions", rarity: "rare", cost: 3, text: "Characters here gain +2/+0. Combat damage is doubled." },
  { name: "The Black Market", rarity: "rare", cost: 3, text: "You may play Item cards for 1 less energy while you control this location." },
  { name: "The Quantum Lab", rarity: "epic", cost: 4, text: "Once per turn, copy target Action card you play." },
  { name: "The Ark Graveyard", rarity: "rare", cost: 3, text: "Return 1 character from your discard pile to your hand each turn." },
  { name: "The Neon District", rarity: "uncommon", cost: 2, text: "Spy and Assassin characters here gain Stealth." },
  { name: "The War Room", rarity: "rare", cost: 3, text: "Soldier characters here gain +1/+1. Draw a card when a Soldier enters." },
  { name: "The Oracle's Chamber", rarity: "rare", cost: 3, text: "Oracle characters here gain Foresight. Look at top 2 cards of your library each turn." },
  { name: "The Engineering Bay", rarity: "uncommon", cost: 2, text: "Engineer characters here can equip Items for free." },
  { name: "The Training Grounds", rarity: "uncommon", cost: 2, text: "Characters here gain +1/+0 permanently when they survive combat." },
  { name: "The Panopticon Core", rarity: "legendary", cost: 6, text: "You see all hidden cards. All your characters gain +1/+1." },
  { name: "The Dimensional Rift", rarity: "epic", cost: 4, text: "Characters entering gain a random dimension. Characters leaving lose all dimensions." },
  { name: "The Clone Vats", rarity: "rare", cost: 3, text: "Create a 1/1 Clone token at start of each turn." },
  { name: "The Rebel Hideout", rarity: "uncommon", cost: 2, text: "Insurgency characters here cannot be targeted. +1 influence per turn." },
  { name: "The Cosmic Forge", rarity: "legendary", cost: 6, text: "Once per game, create any Item card and equip it to a character here." },
];

for (const loc of MORE_LOCATIONS) {
  allCards.push({
    cardId: makeCardId("loc2", loc.name),
    name: loc.name,
    cardType: "location",
    rarity: loc.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: loc.cost,
    power: 0,
    health: 0,
    abilityText: loc.text,
    flavorText: "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["location"]),
    unlockMethod: loc.rarity === "legendary" || loc.rarity === "epic" ? "exploration" : "starter",
  });
}

// ─── 25. DISCIPLINE CARDS (class-specific abilities) ───
const DISCIPLINE_CARDS = [
  // Spy disciplines
  { name: "Shadow Walk", cls: "spy", rarity: "rare", cost: 3, text: "Target Spy character gains Stealth for 3 turns. Draw a card." },
  { name: "Wire Tap", cls: "spy", rarity: "uncommon", cost: 2, text: "Look at target player's hand. They don't know you looked." },
  { name: "Dead Drop", cls: "spy", rarity: "uncommon", cost: 2, text: "Search your library for any Reaction card. Shuffle." },
  { name: "False Identity", cls: "spy", rarity: "rare", cost: 3, text: "Target Spy character is treated as any class until end of turn." },
  { name: "Extraction", cls: "spy", rarity: "rare", cost: 3, text: "Return target character to its owner's hand. Draw 2 cards." },
  // Oracle disciplines
  { name: "Prophecy", cls: "oracle", rarity: "rare", cost: 3, text: "Name a card. If it's in opponent's hand, they discard it. Draw 2." },
  { name: "Third Eye", cls: "oracle", rarity: "uncommon", cost: 2, text: "Look at top 5 cards of your library. Put 2 in hand, rest on bottom." },
  { name: "Fate Weave", cls: "oracle", rarity: "rare", cost: 3, text: "Rearrange the top 3 cards of any player's library." },
  { name: "Psychic Barrier", cls: "oracle", rarity: "uncommon", cost: 2, text: "Target Oracle character cannot be targeted by abilities this turn." },
  { name: "Vision Quest", cls: "oracle", rarity: "epic", cost: 4, text: "Reveal top card of each player's library. Play any revealed card for free." },
  // Assassin disciplines
  { name: "Lethal Strike", cls: "assassin", rarity: "rare", cost: 3, text: "Target Assassin deals double damage this turn." },
  { name: "Poison Blade", cls: "assassin", rarity: "uncommon", cost: 2, text: "Target takes 1 damage per turn for 4 turns." },
  { name: "Vanishing Act", cls: "assassin", rarity: "rare", cost: 3, text: "Target Assassin cannot be blocked or targeted until your next turn." },
  { name: "Mark for Death", cls: "assassin", rarity: "uncommon", cost: 2, text: "Target character takes +2 damage from all sources this turn." },
  { name: "Silent Kill", cls: "assassin", rarity: "epic", cost: 4, text: "Defeat target character with 5 or less health. No reactions." },
  // Engineer disciplines
  { name: "Overclock", cls: "engineer", rarity: "uncommon", cost: 2, text: "Target Item card's effects are doubled this turn." },
  { name: "Repair", cls: "engineer", rarity: "common", cost: 1, text: "Heal target character for 3. If Engineer, heal for 5." },
  { name: "Turret Deploy", cls: "engineer", rarity: "rare", cost: 3, text: "Create a Turret token (0/4) that deals 2 damage to attackers." },
  { name: "EMP Blast", cls: "engineer", rarity: "rare", cost: 3, text: "Destroy all Item cards in target location. Deal 2 damage to each character there." },
  { name: "Mech Suit", cls: "engineer", rarity: "epic", cost: 4, text: "Target Engineer gains +4/+4 and cannot be moved this turn." },
  // Soldier disciplines
  { name: "Rally Cry", cls: "soldier", rarity: "uncommon", cost: 2, text: "All Soldier characters gain +1/+1 until end of turn." },
  { name: "Fortify", cls: "soldier", rarity: "common", cost: 1, text: "Target character gains +0/+3 until end of turn." },
  { name: "Charge", cls: "soldier", rarity: "uncommon", cost: 2, text: "Target Soldier deals +3 damage on its next attack." },
  { name: "Last Stand", cls: "soldier", rarity: "rare", cost: 3, text: "If target Soldier would be defeated, it survives with 1 health and gains +5/+0." },
  { name: "Commander's Order", cls: "soldier", rarity: "epic", cost: 4, text: "All your characters attack simultaneously. They gain First Strike." },
];

for (const d of DISCIPLINE_CARDS) {
  allCards.push({
    cardId: makeCardId("disc", d.name),
    name: d.name,
    cardType: "action",
    rarity: d.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: d.cls,
    species: "unknown",
    faction: null,
    cost: d.cost,
    power: 0,
    health: 0,
    abilityText: d.text,
    flavorText: "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: JSON.stringify([`${d.cls.charAt(0).toUpperCase() + d.cls.slice(1)} Discipline`]),
    keywords: JSON.stringify(["discipline", d.cls]),
    unlockMethod: d.rarity === "epic" ? "story" : "starter",
  });
}

// ─── 26. ELEMENT CARDS (element-specific abilities) ───
const ELEMENT_CARDS = [
  { name: "Fireball", element: "fire", rarity: "uncommon", cost: 2, text: "Deal 3 damage to target. If your character has Fire element, deal 5." },
  { name: "Inferno", element: "fire", rarity: "rare", cost: 4, text: "Deal 2 damage to all characters. Fire characters take no damage." },
  { name: "Flame Shield", element: "fire", rarity: "uncommon", cost: 2, text: "Target Fire character gains +0/+3 and deals 1 damage to attackers." },
  { name: "Tidal Wave", element: "water", rarity: "rare", cost: 4, text: "Return all non-Water characters to their owners' hands." },
  { name: "Healing Rain", element: "water", rarity: "uncommon", cost: 2, text: "Heal all your characters for 2. Water characters heal for 4." },
  { name: "Ice Prison", element: "water", rarity: "rare", cost: 3, text: "Target character cannot act for 2 turns. Water characters are immune." },
  { name: "Earthquake", element: "earth", rarity: "rare", cost: 4, text: "Deal 3 damage to all non-Earth characters." },
  { name: "Stone Skin", element: "earth", rarity: "uncommon", cost: 2, text: "Target Earth character gains +0/+5 until end of turn." },
  { name: "Quicksand", element: "earth", rarity: "uncommon", cost: 2, text: "Target character cannot move for 3 turns." },
  { name: "Lightning Bolt", element: "air", rarity: "uncommon", cost: 2, text: "Deal 4 damage to target character. Cannot be blocked." },
  { name: "Wind Wall", element: "air", rarity: "uncommon", cost: 2, text: "Prevent all ranged damage to your characters this turn." },
  { name: "Tornado", element: "air", rarity: "rare", cost: 4, text: "Randomly redistribute all characters among all locations." },
  { name: "Void Bolt", element: "void", rarity: "rare", cost: 3, text: "Deal 3 damage. If target is defeated, exile it instead of discarding." },
  { name: "Void Rift", element: "void", rarity: "epic", cost: 5, text: "Exile target character. Its controller loses 2 influence." },
  { name: "Null Zone", element: "void", rarity: "rare", cost: 3, text: "No abilities can be activated at target location this turn." },
  { name: "Light Beam", element: "light", rarity: "uncommon", cost: 2, text: "Heal target for 3 and reveal all hidden cards at its location." },
  { name: "Radiance", element: "light", rarity: "rare", cost: 3, text: "All your characters gain +1/+1. Light characters gain +2/+2." },
  { name: "Shadow Strike", element: "dark", rarity: "uncommon", cost: 2, text: "Deal 3 damage from stealth. Target cannot retaliate." },
  { name: "Darkness Falls", element: "dark", rarity: "rare", cost: 3, text: "All characters lose Foresight. Dark characters gain Stealth." },
  { name: "Elemental Fusion", element: "all", rarity: "legendary", cost: 7, text: "Target character gains all elements. +3/+3 for each element it has." },
];

for (const e of ELEMENT_CARDS) {
  allCards.push({
    cardId: makeCardId("elem", e.name),
    name: e.name,
    cardType: "action",
    rarity: e.rarity,
    alignment: pickAlignment(),
    element: ["earth", "fire", "water", "air"].includes(e.element) ? e.element : pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: e.cost,
    power: 0,
    health: 0,
    abilityText: e.text,
    flavorText: "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["element", e.element]),
    unlockMethod: e.rarity === "legendary" || e.rarity === "epic" ? "story" : "starter",
  });
}

// ─── 27. DIMENSION CARDS ───
const DIMENSION_CARDS = [
  { name: "Time Stop", dim: "time", rarity: "epic", cost: 5, text: "Skip target player's next turn." },
  { name: "Time Rewind", dim: "time", rarity: "rare", cost: 3, text: "Undo the last action taken." },
  { name: "Temporal Acceleration", dim: "time", rarity: "uncommon", cost: 2, text: "Take an extra action this turn." },
  { name: "Reality Warp", dim: "reality", rarity: "epic", cost: 5, text: "Swap two characters' stats until end of turn." },
  { name: "Reality Check", dim: "reality", rarity: "rare", cost: 3, text: "Counter target ability. Draw a card." },
  { name: "Illusion", dim: "reality", rarity: "uncommon", cost: 2, text: "Create a copy of target character. It has 1 health." },
  { name: "Probability Shift", dim: "probability", rarity: "rare", cost: 3, text: "Reroll any die or coin flip. Choose the better result." },
  { name: "Lucky Break", dim: "probability", rarity: "uncommon", cost: 2, text: "Flip a coin. Heads: draw 3 cards. Tails: gain 3 energy." },
  { name: "Improbable Victory", dim: "probability", rarity: "epic", cost: 5, text: "If you have fewer characters than opponent, your characters gain +4/+4." },
  { name: "Spatial Rift", dim: "space", rarity: "rare", cost: 3, text: "Move any character to any location. It gains +1/+1." },
  { name: "Dimensional Gate", dim: "space", rarity: "epic", cost: 5, text: "Put a character from your hand into play at any location for free." },
  { name: "Pocket Dimension", dim: "space", rarity: "rare", cost: 3, text: "Exile target character. Return it at start of your next turn with +2/+2." },
];

for (const d of DIMENSION_CARDS) {
  allCards.push({
    cardId: makeCardId("dim", d.name),
    name: d.name,
    cardType: "action",
    rarity: d.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: d.dim,
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: d.cost,
    power: 0,
    health: 0,
    abilityText: d.text,
    flavorText: "",
    imageUrl: null,
    loredexEntryId: null,
    era: null,
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["dimension", d.dim]),
    unlockMethod: d.rarity === "epic" ? "story" : "starter",
  });
}

// ─── 28. FINAL PADDING - More Potentials to reach 1000+ ───
const FINAL_POTENTIALS = [];
const FINAL_NAMES = [
  "Nova", "Zenith", "Apex", "Vertex", "Nexus", "Prism", "Flux", "Pulse", "Drift", "Surge",
  "Echo Prime", "Void Runner", "Star Forger", "Wave Rider", "Storm Eye", "Iron Core", "Dark Pulse", "Light Weaver", "Flame Heart", "Frost Born",
  "Quantum Leap", "Phase Runner", "Rift Walker", "Time Keeper", "Space Bender", "Mind Forge", "Soul Spark", "Life Weaver", "Death Whisper", "Chaos Seed",
  "Order Prime", "Balance Point", "Harmony", "Discord", "Entropy", "Genesis", "Exodus", "Catalyst", "Paradigm", "Anomaly",
  "Cipher", "Vector", "Matrix", "Axiom", "Theorem", "Constant", "Variable", "Function", "Algorithm", "Protocol",
];

for (const name of FINAL_NAMES) {
  const cls = pickClass();
  const rarity = pickWeighted([
    { value: "common", weight: 35 },
    { value: "uncommon", weight: 35 },
    { value: "rare", weight: 20 },
    { value: "epic", weight: 10 },
  ]);
  const stats = DEFAULT_CHARACTER_STATS[rarity] || DEFAULT_CHARACTER_STATS.common;
  allCards.push({
    cardId: makeCardId("fpot", name),
    name: `${name} (${cls.charAt(0).toUpperCase() + cls.slice(1)})`,
    cardType: "character",
    rarity: rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: cls,
    species: pickSpecies(),
    faction: "Potentials",
    cost: stats.cost,
    power: stats.power,
    health: stats.health,
    abilityText: `${cls.charAt(0).toUpperCase() + cls.slice(1)} Potential: ${name} awakened from the Inception Ark.`,
    flavorText: `"The Ark chose ${name}. The Saga continues."`,
    imageUrl: null,
    loredexEntryId: null,
    era: "Age of Potentials",
    season: null,
    disciplines: JSON.stringify([`${cls.charAt(0).toUpperCase() + cls.slice(1)} Training`]),
    keywords: JSON.stringify(["potential", cls]),
    unlockMethod: rarity === "epic" ? "nft" : "starter",
  });
}

// ─── 29. LEGENDARY ARTIFACTS (final push to 1000+) ───
const LEGENDARY_ARTIFACTS = [
  { name: "The Dischordian Codex", rarity: "mythic", cost: 10, text: "Once per game: Search your library for any 3 cards and add them to your hand.", flavor: "\"All knowledge. All power. All truth.\"" },
  { name: "The Panopticon Eye", rarity: "legendary", cost: 7, text: "You see all cards in all hands and libraries. +2 influence per turn.", flavor: "\"The all-seeing eye never blinks.\"" },
  { name: "The Inception Key", rarity: "legendary", cost: 6, text: "Unlock any Ark room. Put a character from your library into play.", flavor: "\"The key to everything.\"" },
  { name: "The Harmony Stone", rarity: "legendary", cost: 7, text: "All your characters gain +2/+2. Prevent all damage to Order characters.", flavor: "\"Balance in all things.\"" },
  { name: "The Chaos Engine", rarity: "legendary", cost: 7, text: "At start of each turn, deal 2 damage to a random enemy character. Chaos characters gain +1/+0.", flavor: "\"Chaos is not destruction. It is creation without limits.\"" },
  { name: "The Source Fragment", rarity: "mythic", cost: 12, text: "You win the game if you control characters of all 4 elements.", flavor: "\"A piece of the beginning. A key to the end.\"" },
  { name: "The Neyon Crown", rarity: "mythic", cost: 10, text: "All Neyon characters gain +5/+5. You may play Neyon characters for free.", flavor: "\"The crown of the first. The power of the eternal.\"" },
  { name: "Wraith's Scythe", rarity: "legendary", cost: 6, text: "Equipped character instantly defeats any character with less power.", flavor: "\"One swing. One soul.\"" },
  { name: "The Architect's Blueprint", rarity: "legendary", cost: 6, text: "Create a copy of any card in play under your control.", flavor: "\"I designed everything. Including this moment.\"" },
  { name: "Iron Lion's Banner", rarity: "epic", cost: 4, text: "All your characters gain First Strike and +1/+0.", flavor: "\"Under this banner, we fight as one.\"" },
  { name: "The Oracle's Crystal", rarity: "epic", cost: 4, text: "Look at the top 5 cards of any library. Rearrange them.", flavor: "\"The future is not set. But it can be guided.\"" },
  { name: "Agent Zero's Mask", rarity: "epic", cost: 3, text: "Equipped character gains Stealth and +2 damage from stealth attacks.", flavor: "\"Behind the mask, there is no one. And everyone.\"" },
  { name: "The Collector's Vault", rarity: "legendary", cost: 6, text: "Store up to 3 cards face-down. Play them for free on any future turn.", flavor: "\"The rarest collection in the universe.\"" },
  { name: "The Meme Virus", rarity: "epic", cost: 4, text: "Copy target Action card. Play the copy for free.", flavor: "\"Ideas spread. Ideas evolve. Ideas conquer.\"" },
  { name: "The Human Spirit", rarity: "rare", cost: 3, text: "Target Human character gains +3/+3 and cannot be defeated this turn.", flavor: "\"Against all odds. Against all reason. Humanity endures.\"" },
];

for (const a of LEGENDARY_ARTIFACTS) {
  allCards.push({
    cardId: makeCardId("lart", a.name),
    name: a.name,
    cardType: "item",
    rarity: a.rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: a.cost,
    power: 0,
    health: 0,
    abilityText: a.text,
    flavorText: a.flavor,
    imageUrl: null,
    loredexEntryId: null,
    era: "The Dischordian Saga",
    season: null,
    disciplines: null,
    keywords: JSON.stringify(["artifact", "legendary"]),
    unlockMethod: a.rarity === "mythic" ? "achievement" : "story",
  });
}

// ═══════════════════════════════════════════════════════
// DATABASE INSERTION
// ═══════════════════════════════════════════════════════

async function seedCards() {
  console.log(`\nTotal cards generated: ${allCards.length}`);

  // Count by type
  const typeCounts = {};
  for (const c of allCards) {
    typeCounts[c.cardType] = (typeCounts[c.cardType] || 0) + 1;
  }
  console.log("By type:", typeCounts);

  // Count by rarity
  const rarityCounts = {};
  for (const c of allCards) {
    rarityCounts[c.rarity] = (rarityCounts[c.rarity] || 0) + 1;
  }
  console.log("By rarity:", rarityCounts);

  const conn = await createConnection(connOpts);
  console.log("Connected to database");

  // Clear existing cards
  await conn.execute("DELETE FROM cards");
  console.log("Cleared existing cards");

  // Insert in batches
  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < allCards.length; i += BATCH_SIZE) {
    const batch = allCards.slice(i, i + BATCH_SIZE);
    const placeholders = batch
      .map(
        () =>
          "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .join(", ");

    const values = batch.flatMap((c) => [
      c.cardId,
      c.name,
      c.cardType,
      c.rarity,
      c.alignment,
      c.element,
      c.dimension,
      c.characterClass,
      c.species,
      c.faction,
      c.cost,
      c.power,
      c.health,
      c.abilityText,
      c.flavorText,
      c.imageUrl,
      c.loredexEntryId,
      c.album || null,
      c.era,
      c.season,
      typeof c.disciplines === "string" ? c.disciplines : c.disciplines ? JSON.stringify(c.disciplines) : null,
      typeof c.keywords === "string" ? c.keywords : c.keywords ? JSON.stringify(c.keywords) : null,
      c.unlockMethod,
      null, // unlockCondition
      1, // isActive
    ]);

    await conn.execute(
      `INSERT INTO cards (cardId, name, cardType, rarity, alignment, element, dimension, characterClass, species, faction, cost, power, health, abilityText, flavorText, imageUrl, loredexEntryId, album, era, season, disciplines, keywords, unlockMethod, unlockCondition, isActive) VALUES ${placeholders}`,
      values
    );

    inserted += batch.length;
    if (inserted % 200 === 0 || inserted === allCards.length) {
      console.log(`  Inserted ${inserted}/${allCards.length} cards...`);
    }
  }

  console.log(`\n✅ Successfully seeded ${inserted} cards!`);
  await conn.end();
}

seedCards().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
