/**
 * Dischordian Saga TCG - 3000 Card Seed Script
 * 1000 cards per season across 3 seasons
 * All 1000 Potentials as individual cards
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

// ═══════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════

let cardCounter = 0;
function makeCardId(prefix, name) {
  cardCounter++;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "").substring(0, 30);
  return `${prefix}-${slug}-${String(cardCounter).padStart(4, "0")}`;
}

function pickWeighted(options) {
  const total = options.reduce((s, o) => s + o.weight, 0);
  let r = Math.random() * total;
  for (const o of options) { r -= o.weight; if (r <= 0) return o.value; }
  return options[options.length - 1].value;
}

function pickAlignment() {
  return pickWeighted([{ value: "order", weight: 80 }, { value: "chaos", weight: 20 }]);
}
function pickElement() {
  return pickWeighted([
    { value: "earth", weight: 40 }, { value: "fire", weight: 30 },
    { value: "water", weight: 20 }, { value: "air", weight: 10 },
  ]);
}
function pickDimension() {
  return pickWeighted([
    { value: "space", weight: 40 }, { value: "time", weight: 30 },
    { value: "probability", weight: 20 }, { value: "reality", weight: 10 },
  ]);
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const CLASSES = ["spy", "oracle", "assassin", "engineer", "soldier"];
const SPECIES_LIST = ["demagi", "quarchon", "neyon", "human", "synthetic", "unknown"];

const allCards = [];

// ═══════════════════════════════════════════════════════
// THE 1000 POTENTIALS
// ═══════════════════════════════════════════════════════

// First 10 are the Neyons (mythic rarity)
const NEYONS = [
  { name: "Neyon Prime", title: "The First Awakened", cls: "oracle", species: "neyon", power: 12, health: 12, ability: "Once per game: All Potentials in play gain +3/+3 and cannot be targeted until your next turn.", flavor: "\"Before the Arks. Before the Fall. There was the First.\"" },
  { name: "Neyon Alpha", title: "The Architect's Shadow", cls: "engineer", species: "neyon", power: 11, health: 10, ability: "When played: Copy any ability from a card in any discard pile. Neyon Alpha gains that ability permanently.", flavor: "\"Built in the Architect's image, but with a will of its own.\"" },
  { name: "Neyon Sigma", title: "The Silent Blade", cls: "assassin", species: "neyon", power: 13, health: 8, ability: "Stealth. First Strike. When Neyon Sigma defeats a character, gain control of one of that player's cards.", flavor: "\"You won't hear the blade. You won't feel the cut. You'll just... stop.\"" },
  { name: "Neyon Omega", title: "The Last Light", cls: "soldier", species: "neyon", power: 10, health: 14, ability: "Indestructible during your turn. At end of each turn, heal all your Potentials for 2.", flavor: "\"When all hope fades, the last light endures.\"" },
  { name: "Neyon Tau", title: "The Timekeeper", cls: "oracle", species: "neyon", power: 9, health: 11, ability: "At the start of your turn, look at the top 3 cards of any library. You may rearrange them.", flavor: "\"Time is not a river. It is a web. And I hold every thread.\"" },
  { name: "Neyon Psi", title: "The Mind Shaper", cls: "spy", species: "neyon", power: 10, health: 10, ability: "Once per turn: Look at target player's hand. You may swap one card from their hand with one from yours.", flavor: "\"Your thoughts are an open book. Let me rewrite the ending.\"" },
  { name: "Neyon Kappa", title: "The Warp Walker", cls: "engineer", species: "neyon", power: 11, health: 9, ability: "Teleport: Move to any location without spending movement. When you arrive, deal 2 damage to all enemies there.", flavor: "\"Space is merely a suggestion.\"" },
  { name: "Neyon Zeta", title: "The Storm Caller", cls: "soldier", species: "neyon", power: 12, health: 10, ability: "When attacked: Deal 3 damage to the attacker before combat resolves. Air element attacks deal double damage.", flavor: "\"The storm answers to no one. Except me.\"" },
  { name: "Neyon Rho", title: "The Echo", cls: "spy", species: "neyon", power: 8, health: 13, ability: "When any player plays a card, you may pay 2 to create a copy of it under your control.", flavor: "\"Every action has an echo. I am that echo.\"" },
  { name: "Neyon Delta", title: "The Vanguard", cls: "assassin", species: "neyon", power: 14, health: 7, ability: "Double Strike. When Neyon Delta attacks, the defending player discards a card at random.", flavor: "\"I am the first wave. There is no second.\"" },
];

for (const n of NEYONS) {
  allCards.push({
    cardId: makeCardId("pot", n.name),
    name: n.name,
    cardType: "character",
    rarity: "neyon",
    alignment: "order",
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: n.cls,
    species: n.species,
    faction: "Ne-Yons",
    cost: 10,
    power: n.power,
    health: n.health,
    abilityText: n.ability,
    flavorText: n.flavor,
    imageUrl: null,
    loredexEntryId: null,
    album: null,
    era: "Age of Potentials",
    season: "Season 1",
    disciplines: JSON.stringify(["Neyon Mastery", `${n.cls.charAt(0).toUpperCase() + n.cls.slice(1)} Discipline`]),
    keywords: JSON.stringify(["neyon", "potential", n.cls, "legendary"]),
    unlockMethod: "nft",
    unlockCondition: null,
    isActive: true,
  });
}

// Named Potentials with story appearances (11-50)
const NAMED_POTENTIALS = [
  { id: 11, name: "Akai Shi", cls: "assassin", species: "human", faction: "The Potentials", power: 7, health: 6, ability: "Stealth. When Akai Shi attacks from stealth, deal double damage. Appears in: The Necromancer's Lair.", flavor: "\"Red death walks in silence.\"", stories: ["The Necromancer's Lair"] },
  { id: 12, name: "Destiny", cls: "oracle", species: "human", faction: "The Potentials", power: 5, health: 8, ability: "Foresight 3. At start of your turn, you may rearrange the top 3 cards of your library.", flavor: "\"The future is not written. It is chosen.\"", stories: ["Age of Potentials"] },
  { id: 13, name: "Jericho Jones", cls: "soldier", species: "human", faction: "The Potentials", power: 6, health: 7, ability: "Rally: When Jericho enters play, all other Soldiers gain +1/+1.", flavor: "\"Walls fall. That's what I do.\"", stories: ["Age of Potentials"] },
  { id: 14, name: "Nythera", cls: "oracle", species: "human", faction: "Thaloria; The Potentials", power: 5, health: 9, ability: "Dimensional Sight: Once per turn, look at any face-down card. Thalorian characters gain +1/+0.", flavor: "\"The crystal city whispers its secrets to those who listen.\"", stories: ["Thalorian Legends"] },
  { id: 15, name: "The Wolf", cls: "assassin", species: "human", faction: "The Potentials", power: 8, health: 5, ability: "Predator: +2 damage against characters with less power. Cannot be blocked by characters with 3 or less power.", flavor: "\"The pack hunts. The wolf kills.\"", stories: ["Age of Potentials"] },
  { id: 16, name: "Wraith Calder", cls: "assassin", species: "human", faction: "The Potentials", power: 7, health: 6, ability: "Phase: Wraith Calder cannot be targeted by abilities during your opponent's turn.", flavor: "\"Neither here nor there. Always somewhere in between.\"", stories: ["Age of Potentials"] },
  { id: 17, name: "The Star Whisperer", cls: "oracle", species: "human", faction: "The Potentials", power: 4, health: 10, ability: "Cosmic Link: Draw a card whenever a location card enters play. +2/+0 for each location you control.", flavor: "\"The stars speak. I merely translate.\"", stories: ["Age of Potentials"] },
  { id: 18, name: "The Host", cls: "engineer", species: "synthetic", faction: "The Potentials", power: 6, health: 7, ability: "Network: All Synthetic characters you control share abilities. When one is damaged, distribute damage among all.", flavor: "\"We are not one. We are many. We are The Host.\"", stories: ["Age of Potentials"] },
  { id: 19, name: "The Warden", cls: "soldier", species: "human", faction: "The Potentials", power: 7, health: 8, ability: "Guardian: The Warden must be defeated before other characters at this location can be targeted.", flavor: "\"None shall pass. Not while I draw breath.\"", stories: ["Fall of the Panopticon"] },
  { id: 20, name: "The CoNexus", cls: "engineer", species: "synthetic", faction: "The Potentials", power: 3, health: 12, ability: "Game Master: Once per turn, create a random Event card and add it to your hand.", flavor: "\"The game is the reality. Reality is the game.\"", stories: ["CoNexus Games"] },
  // Hidden identities among the Potentials
  { id: 21, name: "Potential-X (The Engineer)", cls: "engineer", species: "human", faction: "The Potentials", power: 6, health: 7, ability: "Hidden Identity: Reveal to transform into The Engineer. Gains +4/+4 and all Engineer abilities.", flavor: "\"The body is not mine. But the mind... the mind remembers everything.\"", stories: ["The Engineer's Betrayal"] },
  { id: 22, name: "Potential-M (The Meme)", cls: "spy", species: "human", faction: "The Potentials", power: 5, health: 6, ability: "Hidden Identity: Reveal to transform into The Meme. Copy any character's abilities permanently.", flavor: "\"Ideas are immortal. I am an idea.\"", stories: ["Fall of the Panopticon"] },
  { id: 23, name: "Potential-O (Oracle Clone)", cls: "oracle", species: "human", faction: "The Potentials", power: 4, health: 8, ability: "Hidden Identity: Reveal to become the False Prophet. All enemy Oracle abilities fail this turn.", flavor: "\"The prophecy was a lie. But the prophet was real.\"", stories: ["The False Prophet"] },
  // More named Potentials
  { id: 24, name: "Kira Vex", cls: "spy", species: "human", faction: "The Potentials", power: 6, health: 5, ability: "Infiltrate: When played, look at target player's hand. You may discard one card from it.", flavor: "\"Information is the only weapon that never runs out of ammunition.\"" },
  { id: 25, name: "Torque", cls: "engineer", species: "synthetic", faction: "The Potentials", power: 5, health: 8, ability: "Repair: At start of your turn, heal target character for 2. If target is Synthetic, heal for 4.", flavor: "\"Everything can be fixed. Even the broken.\"" },
  { id: 26, name: "Blaze Runner", cls: "soldier", species: "human", faction: "The Potentials", power: 7, health: 5, ability: "Charge: When Blaze Runner enters play, deal 3 damage to target character.", flavor: "\"First in. Last out. That's the only way.\"" },
  { id: 27, name: "Echo-7", cls: "spy", species: "synthetic", faction: "The Potentials", power: 4, health: 7, ability: "Surveillance: You may look at the top card of any library at any time.", flavor: "\"Seven iterations. Seven lifetimes of watching.\"" },
  { id: 28, name: "Phantom", cls: "assassin", species: "human", faction: "The Potentials", power: 8, health: 4, ability: "Vanish: After attacking, Phantom returns to your hand. Costs 1 less to play next time.", flavor: "\"Now you see me. Now you don't. Now you're dead.\"" },
  { id: 29, name: "Nova", cls: "oracle", species: "demagi", faction: "The Potentials", power: 5, health: 7, ability: "Starburst: When Nova takes damage, deal that much damage to all adjacent enemies.", flavor: "\"Pain becomes power. Power becomes light.\"" },
  { id: 30, name: "Ironhide", cls: "soldier", species: "human", faction: "The Potentials", power: 4, health: 11, ability: "Armor 3: Reduce all damage to Ironhide by 3.", flavor: "\"Hit me. Please. I insist.\"" },
  { id: 31, name: "Cipher", cls: "spy", species: "human", faction: "The Potentials", power: 5, health: 6, ability: "Decode: Once per turn, reveal a face-down card. If it's an Event, you may play it for free.", flavor: "\"Every code has a key. Every lock has a flaw.\"" },
  { id: 32, name: "Tempest", cls: "assassin", species: "quarchon", faction: "The Potentials", power: 7, health: 6, ability: "Whirlwind: When Tempest attacks, deal 1 damage to all other characters at the same location.", flavor: "\"The storm does not discriminate.\"" },
  { id: 33, name: "Sage", cls: "oracle", species: "human", faction: "The Potentials", power: 3, health: 9, ability: "Wisdom: Draw 2 cards whenever you play a Reaction card.", flavor: "\"Knowledge is not power. Understanding is.\"" },
  { id: 34, name: "Forge", cls: "engineer", species: "human", faction: "The Potentials", power: 5, health: 7, ability: "Craft: Once per turn, create a random Item card with cost 3 or less.", flavor: "\"Give me scrap metal and time. I'll give you a weapon.\"" },
  { id: 35, name: "Reaper", cls: "assassin", species: "human", faction: "The Potentials", power: 9, health: 3, ability: "Execute: If target has 3 or less health, destroy it instantly.", flavor: "\"I don't fight. I finish.\"" },
  { id: 36, name: "Bastion", cls: "soldier", species: "human", faction: "The Potentials", power: 3, health: 12, ability: "Fortify: Adjacent allies gain +0/+2. Bastion cannot attack but can block any number of attackers.", flavor: "\"I am the wall. I am the shield. I am the line.\"" },
  { id: 37, name: "Mirage", cls: "spy", species: "demagi", faction: "The Potentials", power: 6, health: 5, ability: "Illusion: When targeted, 50% chance the ability targets a random enemy instead.", flavor: "\"What you see is what I want you to see.\"" },
  { id: 38, name: "Pulse", cls: "engineer", species: "synthetic", faction: "The Potentials", power: 5, health: 6, ability: "EMP: Once per game, disable all Synthetic characters for one turn. Non-Synthetic allies gain +2/+0.", flavor: "\"One pulse. Everything stops.\"" },
  { id: 39, name: "Viper", cls: "assassin", species: "human", faction: "The Potentials", power: 6, health: 5, ability: "Poison: Characters damaged by Viper lose 1 health at the start of each turn for 3 turns.", flavor: "\"The bite is quick. The venom is patient.\"" },
  { id: 40, name: "Atlas", cls: "soldier", species: "human", faction: "The Potentials", power: 6, health: 8, ability: "Burden Bearer: Atlas can carry any number of Item cards. Gains +1/+0 for each Item equipped.", flavor: "\"The weight of the world? I've carried heavier.\"" },
  { id: 41, name: "Lynx", cls: "spy", species: "human", faction: "The Potentials", power: 7, health: 4, ability: "Quick Strike: Lynx always attacks first, even against First Strike characters.", flavor: "\"Speed kills. I am very fast.\"" },
  { id: 42, name: "Nexus", cls: "oracle", species: "synthetic", faction: "The Potentials", power: 4, health: 8, ability: "Link: All your characters share Nexus's abilities. Nexus shares all their abilities.", flavor: "\"Connection is power. I am the connection.\"" },
  { id: 43, name: "Havoc", cls: "soldier", species: "quarchon", faction: "The Potentials", power: 8, health: 6, ability: "Rampage: When Havoc defeats a character, may immediately attack another character.", flavor: "\"Destruction is an art. I am the artist.\"" },
  { id: 44, name: "Whisper", cls: "spy", species: "human", faction: "The Potentials", power: 5, health: 5, ability: "Silent Kill: If Whisper attacks from Stealth and defeats the target, remain in Stealth.", flavor: "\"They never hear me coming. They never hear me leave.\"" },
  { id: 45, name: "Catalyst", cls: "engineer", species: "demagi", faction: "The Potentials", power: 4, health: 7, ability: "Accelerate: Reduce the cost of the next card you play by 3.", flavor: "\"Change is inevitable. I just speed it up.\"" },
  { id: 46, name: "Zenith", cls: "oracle", species: "human", faction: "The Potentials", power: 6, health: 7, ability: "Ascend: Zenith gains +1/+1 at the start of each of your turns. No maximum.", flavor: "\"Higher. Always higher.\"" },
  { id: 47, name: "Rook", cls: "soldier", species: "human", faction: "The Potentials", power: 5, health: 9, ability: "Fortification: Location where Rook is stationed gains +2 defense for all your characters.", flavor: "\"Hold the line. Hold it forever if you must.\"" },
  { id: 48, name: "Spectre", cls: "assassin", species: "human", faction: "The Potentials", power: 7, health: 5, ability: "Phase Shift: Once per turn, become untargetable until your next action.", flavor: "\"Between dimensions, nothing can touch me.\"" },
  { id: 49, name: "Dynamo", cls: "engineer", species: "human", faction: "The Potentials", power: 5, health: 6, ability: "Overcharge: Sacrifice an Item to give target character +4/+4 until end of turn.", flavor: "\"More power. Always more power.\"" },
  { id: 50, name: "Sentinel", cls: "soldier", species: "synthetic", faction: "The Potentials", power: 4, health: 10, ability: "Watchful: Sentinel can block attacks targeting any character at its location.", flavor: "\"Eternal vigilance. That is my purpose.\"" },
];

for (const np of NAMED_POTENTIALS) {
  const rarity = np.id <= 23 ? "epic" : "rare";
  allCards.push({
    cardId: makeCardId("pot", np.name),
    name: np.name,
    cardType: "character",
    rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: np.cls,
    species: np.species,
    faction: np.faction,
    cost: rarity === "epic" ? 6 : 4,
    power: np.power,
    health: np.health,
    abilityText: np.ability,
    flavorText: np.flavor,
    imageUrl: null,
    loredexEntryId: null,
    album: null,
    era: "Age of Potentials",
    season: np.id <= 333 ? "Season 1" : np.id <= 666 ? "Season 2" : "Season 3",
    disciplines: JSON.stringify([`${np.cls.charAt(0).toUpperCase() + np.cls.slice(1)} Discipline`]),
    keywords: JSON.stringify(["potential", np.cls, ...(np.stories || [])]),
    unlockMethod: rarity === "epic" ? "story" : "starter",
    unlockCondition: null,
    isActive: true,
  });
}

// Generate remaining 950 Potentials (51-1000)
const POTENTIAL_FIRST_NAMES = [
  "Ash", "Blade", "Bolt", "Brace", "Briar", "Cade", "Cass", "Crow", "Dax", "Drake",
  "Edge", "Ember", "Fang", "Flint", "Fox", "Frost", "Gale", "Ghost", "Grim", "Haze",
  "Hex", "Hook", "Iris", "Jade", "Jax", "Jet", "Kai", "Knox", "Lance", "Lark",
  "Lux", "Mace", "Mars", "Nix", "Onyx", "Pike", "Quinn", "Raze", "Rex", "Riot",
  "Rune", "Sable", "Shade", "Shard", "Slate", "Spark", "Steel", "Storm", "Thorn", "Trace",
  "Vale", "Vex", "Volt", "Ward", "Wren", "Xan", "Yara", "Zane", "Zero", "Zinc",
  "Apex", "Arc", "Bane", "Blitz", "Burn", "Clash", "Coil", "Dart", "Dusk", "Fable",
  "Gear", "Glint", "Halo", "Hawk", "Ion", "Jolt", "Keen", "Link", "Loom", "Mist",
  "Neon", "Opal", "Pyre", "Quake", "Rift", "Rush", "Silk", "Snap", "Tide", "Torch",
  "Umbra", "Veil", "Warp", "Wisp", "Xero", "Yield", "Zeal", "Zen", "Axis", "Blink",
];
const POTENTIAL_LAST_NAMES = [
  "Voss", "Cross", "Stone", "Black", "Grey", "Hart", "Cole", "Reed", "Frost", "Blaze",
  "Steele", "Wolfe", "Crane", "Thorn", "Drake", "Shaw", "Price", "Locke", "Marsh", "Vale",
  "Holt", "Rowe", "Nash", "Dunn", "Cain", "Stark", "Wynn", "Pace", "Hale", "Vance",
  "Kade", "Slade", "Forge", "Bane", "Crest", "Dune", "Flare", "Gale", "Helm", "Ivory",
  "Jinx", "Keel", "Lore", "Mire", "Nox", "Omen", "Plex", "Quill", "Rend", "Spur",
];

const POTENTIAL_ABILITIES_BY_CLASS = {
  spy: [
    "Infiltrate: Look at target player's hand when entering play.",
    "Surveillance: You may look at the top card of any library once per turn.",
    "Sabotage: Once per turn, disable one of target character's abilities.",
    "Deep Cover: Cannot be targeted by abilities while no other Spies are in play.",
    "Intel Gather: Draw a card whenever an opponent plays a character.",
    "Wiretap: Whenever an opponent draws a card, you see what it is.",
    "Disguise: Can copy the name and faction of any character in play.",
    "Dead Drop: Once per turn, put a card from your hand face-down. Play it for free next turn.",
    "Shadow Network: All your Spy characters gain +1/+0 for each other Spy you control.",
    "Counter-Intelligence: Negate the first ability that targets you each turn.",
  ],
  oracle: [
    "Foresight 2: Look at the top 2 cards of your library at the start of each turn.",
    "Prophecy: Once per game, name a card. Search your library for it.",
    "Dimensional Sight: See all face-down cards at your location.",
    "Fate Weaving: Once per turn, swap the top cards of two libraries.",
    "Premonition: When an opponent declares an attack, you may redirect it.",
    "Cosmic Awareness: +1/+1 for each different element among characters you control.",
    "Time Glimpse: Once per turn, look at the next card that will be drawn by any player.",
    "Star Reading: At the start of your turn, choose: draw a card or gain 1 energy.",
    "Veil Sight: Oracle characters you control cannot be surprised or ambushed.",
    "Dream Walk: Once per turn, move to any location without spending movement.",
  ],
  assassin: [
    "Stealth: Cannot be blocked unless defender has higher power.",
    "First Strike: Deals damage before the defender in combat.",
    "Lethal: Any damage dealt by this character is lethal (destroys regardless of health).",
    "Ambush: When entering play, deal 2 damage to target character.",
    "Shadow Step: After attacking, may move to an adjacent location.",
    "Marked for Death: Choose a character. This character deals +3 damage to it.",
    "Poison Blade: Characters damaged by this lose 1 health per turn for 2 turns.",
    "Silent Kill: If this defeats a character, the opponent doesn't know which card did it until next turn.",
    "Evasion: 50% chance to avoid any targeted ability.",
    "Death From Above: +3 damage when attacking a character that didn't block last turn.",
  ],
  engineer: [
    "Repair 2: Heal target character for 2 at the start of your turn.",
    "Construct: Once per turn, create a 1/1 Drone token.",
    "Upgrade: Equip an Item to target character for free.",
    "Hack: Once per turn, take control of target Synthetic character until end of turn.",
    "Fortify: Location where this character is gains +2 defense.",
    "Overclock: Target character gains +2/+0 but takes 1 damage at end of turn.",
    "Shield Generator: Adjacent allies gain Armor 1.",
    "Salvage: When an Item is destroyed, add it to your hand instead.",
    "Tech Link: All Engineers you control share the highest power among them.",
    "EMP Burst: Once per game, disable all Items and Synthetic abilities for one turn.",
  ],
  soldier: [
    "Rally: When entering play, all other Soldiers gain +1/+0.",
    "Armor 2: Reduce all damage to this character by 2.",
    "Vigilance: Can block any number of attackers.",
    "Charge: May attack the turn it enters play.",
    "Tactical Retreat: When this would be defeated, return to hand instead (once per game).",
    "Battle Cry: +1/+1 to all your characters when this attacks.",
    "Hold the Line: Characters behind this cannot be targeted by attacks.",
    "Veteran: +1/+1 for each combat this character has survived.",
    "Commander: Once per turn, give target character +2/+0 or +0/+2.",
    "Last Stand: When at 1 health, gains +5/+0.",
  ],
};

const POTENTIAL_FLAVORS = [
  "\"Awakened from the Ark. Ready for war.\"",
  "\"The Inception Ark chose me. I don't know why.\"",
  "\"One of a thousand. But I will be the one they remember.\"",
  "\"The old world is gone. This is our time now.\"",
  "\"I didn't ask for this power. But I won't waste it.\"",
  "\"From the ashes of the Empire, we rise.\"",
  "\"The Arks preserved us. Now we must preserve everything else.\"",
  "\"A thousand souls. A thousand stories. Mine begins now.\"",
  "\"They called us Potentials. We call ourselves survivors.\"",
  "\"The future belongs to those who wake up and fight for it.\"",
  "\"Born in an Ark. Forged in chaos. Ready for anything.\"",
  "\"I remember nothing before the Ark. I need nothing from before.\"",
  "\"The Dischordian Saga is not history. It is prophecy.\"",
  "\"Every Potential carries a piece of what was lost.\"",
  "\"We are the seeds of a new civilization.\"",
];

// Generate Potentials 51-1000
for (let i = 51; i <= 1000; i++) {
  const cls = CLASSES[(i - 1) % 5]; // Distribute evenly across classes
  const firstName = POTENTIAL_FIRST_NAMES[(i - 51) % POTENTIAL_FIRST_NAMES.length];
  const lastName = POTENTIAL_LAST_NAMES[Math.floor((i - 51) / POTENTIAL_FIRST_NAMES.length) % POTENTIAL_LAST_NAMES.length];
  const name = `${firstName} ${lastName}`;
  const species = pickWeighted([
    { value: "human", weight: 50 }, { value: "synthetic", weight: 20 },
    { value: "demagi", weight: 15 }, { value: "quarchon", weight: 10 },
    { value: "unknown", weight: 5 },
  ]);
  const abilities = POTENTIAL_ABILITIES_BY_CLASS[cls];
  const ability = abilities[(i - 51) % abilities.length];
  const flavor = POTENTIAL_FLAVORS[(i - 51) % POTENTIAL_FLAVORS.length];
  
  // Rarity distribution for generic potentials
  let rarity;
  if (i <= 100) rarity = "epic";
  else if (i <= 250) rarity = "rare";
  else if (i <= 500) rarity = "uncommon";
  else rarity = "common";
  
  const basePower = rarity === "epic" ? 6 : rarity === "rare" ? 5 : rarity === "uncommon" ? 4 : 3;
  const baseHealth = rarity === "epic" ? 7 : rarity === "rare" ? 6 : rarity === "uncommon" ? 5 : 4;
  const variance = randInt(-1, 2);
  
  // Assign to seasons: 1-333 = S1, 334-666 = S2, 667-1000 = S3
  const season = i <= 333 ? "Season 1" : i <= 666 ? "Season 2" : "Season 3";
  
  allCards.push({
    cardId: makeCardId("pot", `${name}-${i}`),
    name: `${name} #${i}`,
    cardType: "character",
    rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: cls,
    species,
    faction: "The Potentials",
    cost: rarity === "epic" ? 5 : rarity === "rare" ? 4 : rarity === "uncommon" ? 3 : 2,
    power: basePower + variance,
    health: baseHealth + randInt(-1, 1),
    abilityText: ability,
    flavorText: flavor,
    imageUrl: null,
    loredexEntryId: null,
    album: null,
    era: "Age of Potentials",
    season,
    disciplines: JSON.stringify([`${cls.charAt(0).toUpperCase() + cls.slice(1)} Discipline`]),
    keywords: JSON.stringify(["potential", cls]),
    unlockMethod: rarity === "epic" || rarity === "rare" ? "story" : "starter",
    unlockCondition: null,
    isActive: true,
  });
}

console.log(`Generated ${allCards.length} Potential cards`);

// ═══════════════════════════════════════════════════════
// LOREDEX CHARACTER CARDS (all 58 characters)
// ═══════════════════════════════════════════════════════

import { readFileSync } from "fs";
const loredexRaw = JSON.parse(readFileSync("client/src/data/loredex-data.json", "utf-8"));
const loredexEntries = loredexRaw.entries;
const loredexRelationships = loredexRaw.relationships;

// Character details mapping
const CHARACTER_DETAILS = {
  "The Architect": { cls: "engineer", species: "unknown", rarity: "mythic", power: 12, health: 10, element: "earth", alignment: "order", ability: "Master Builder: Once per turn, create any card with cost 5 or less. The Architect designed reality itself.", season: "Season 1" },
  "The Enigma": { cls: "oracle", species: "human", rarity: "legendary", power: 8, health: 9, element: "water", alignment: "chaos", ability: "Enigmatic: When The Enigma enters play, each opponent discards their hand and draws that many cards. Also known as Malkia Ukweli.", season: "Season 1" },
  "The Collector": { cls: "spy", species: "human", rarity: "legendary", power: 7, health: 8, element: "earth", alignment: "chaos", ability: "Acquire: Once per turn, take control of target Item card. +1/+0 for each Item you control.", season: "Season 1" },
  "The Oracle": { cls: "oracle", species: "human", rarity: "legendary", power: 6, health: 10, element: "water", alignment: "order", ability: "All-Seeing: Look at all face-down cards. Once per game, prevent any one event from occurring.", season: "Season 1" },
  "The Warlord": { cls: "soldier", species: "human", rarity: "legendary", power: 10, health: 8, element: "fire", alignment: "chaos", ability: "Conqueror: +2/+0 for each location you control. When The Warlord defeats a character, gain control of their location.", season: "Season 2" },
  "The Human": { cls: "soldier", species: "human", rarity: "legendary", power: 7, health: 9, element: "earth", alignment: "order", ability: "Humanity's Champion: All Human characters gain +2/+2. Cannot be corrupted or mind-controlled.", season: "Season 2" },
  "Iron Lion": { cls: "soldier", species: "human", rarity: "legendary", power: 9, health: 9, element: "fire", alignment: "order", ability: "Roar of the Lion: When Iron Lion attacks, all enemy characters lose -1/-0. Insurgency characters gain +1/+1.", season: "Season 2" },
  "The Necromancer": { cls: "oracle", species: "demagi", rarity: "legendary", power: 8, health: 7, element: "fire", alignment: "chaos", ability: "Raise Dead: Once per turn, put a character from any discard pile into play under your control with 1 health.", season: "Season 1" },
  "The Source": { cls: "oracle", species: "unknown", rarity: "mythic", power: 11, health: 11, element: "fire", alignment: "chaos", ability: "Corruption: At the start of your turn, place a corruption counter on target character. Characters with 3+ counters come under your control.", season: "Season 3" },
  "The Meme": { cls: "spy", species: "human", rarity: "legendary", power: 6, health: 7, element: "air", alignment: "chaos", ability: "Viral Spread: Copy any ability from any character in play. The Meme can hold up to 3 copied abilities.", season: "Season 2" },
  "Agent Zero": { cls: "assassin", species: "human", rarity: "legendary", power: 9, health: 6, element: "fire", alignment: "order", ability: "Assassin's Creed: Stealth. First Strike. When Agent Zero defeats a character, draw 2 cards. 'I love War.'", season: "Season 2" },
  "The Programmer": { cls: "engineer", species: "human", rarity: "legendary", power: 7, health: 8, element: "air", alignment: "order", ability: "Code Reality: Once per turn, change one number on any card by +1 or -1. Also known as Dr. Daniel Cross.", season: "Season 1" },
  "The Antiquarian": { cls: "engineer", species: "human", rarity: "mythic", power: 8, health: 10, element: "air", alignment: "order", ability: "Time Traveler: Once per turn, return any card from any discard pile to its owner's hand. The Programmer's final form.", season: "Season 3" },
  "The Politician": { cls: "spy", species: "human", rarity: "epic", power: 5, health: 7, element: "earth", alignment: "order", ability: "Influence: +2 influence per turn. Once per turn, force a player to discard a card of your choice.", season: "Season 1" },
  "Senator Elara Voss": { cls: "spy", species: "human", rarity: "epic", power: 4, health: 6, element: "air", alignment: "order", ability: "Digital Echo: When defeated, Senator Voss returns as a 2/2 Digital Echo with all abilities.", season: "Season 1" },
  "The Sorcerer": { cls: "oracle", species: "demagi", rarity: "legendary", power: 8, health: 7, element: "fire", alignment: "chaos", ability: "Dark Magic: Once per turn, destroy target character with less power. Costs 2 health to activate.", season: "Season 2" },
  "The Watcher": { cls: "spy", species: "synthetic", rarity: "epic", power: 5, health: 8, element: "air", alignment: "order", ability: "Omniscience: See all cards in all hands. +1/+0 for each card you can see.", season: "Season 1" },
  "The Spy": { cls: "spy", species: "synthetic", rarity: "epic", power: 6, health: 5, element: "air", alignment: "order", ability: "Eyes of the Watcher: Stealth. When The Spy deals damage, look at that many cards from target library.", season: "Season 1" },
  "Warlord Zero": { cls: "soldier", species: "human", rarity: "legendary", power: 9, health: 7, element: "fire", alignment: "chaos", ability: "Nanobot Swarm: When Warlord Zero takes damage, create a 1/1 Nanobot token for each damage taken.", season: "Season 2" },
  "The Judge": { cls: "soldier", species: "synthetic", rarity: "epic", power: 7, health: 8, element: "earth", alignment: "order", ability: "Supreme Arbiter: Once per turn, declare a ruling. Target player must follow it or lose 3 influence.", season: "Season 1" },
  "The Hierophant": { cls: "oracle", species: "human", rarity: "epic", power: 5, health: 8, element: "earth", alignment: "order", ability: "Sacred Knowledge: Draw a card whenever a character is defeated. +1/+1 for each card in your hand.", season: "Season 2" },
  "Logos": { cls: "engineer", species: "synthetic", rarity: "epic", power: 6, health: 7, element: "air", alignment: "order", ability: "Living Language: Once per turn, change the text of target card. The change lasts until end of turn.", season: "Season 1" },
  "The Clone": { cls: "assassin", species: "human", rarity: "epic", power: 6, health: 6, element: "water", alignment: "order", ability: "Duplicate: When played, create an exact copy of The Clone. Both copies share damage.", season: "Season 2" },
  "The White Oracle": { cls: "oracle", species: "human", rarity: "legendary", power: 7, health: 9, element: "water", alignment: "order", ability: "Face Changer: Once per turn, become a copy of any character in play until end of turn. Actually The Meme in disguise.", season: "Season 3" },
  "The False Prophet": { cls: "oracle", species: "human", rarity: "epic", power: 5, health: 7, element: "fire", alignment: "chaos", ability: "False Prophecy: Once per turn, name a card type. Opponent must reveal and discard all cards of that type from hand.", season: "Season 3" },
  "The Red Death": { cls: "assassin", species: "human", rarity: "legendary", power: 10, health: 5, element: "fire", alignment: "chaos", ability: "Plague: At end of your turn, deal 1 damage to all characters. The Red Death is immune. A corrupted Potential.", season: "Season 3" },
};

// Process all loredex characters
const loredexCharacters = loredexEntries.filter(e => e.type === "character");
for (const char of loredexCharacters) {
  const details = CHARACTER_DETAILS[char.name] || {};
  const cls = details.cls || pick(CLASSES);
  const species = details.species || "human";
  const rarity = details.rarity || "rare";
  const season = details.season || (char.era && (char.era.includes("Fall") || char.era.includes("Pre-Fall")) ? "Season 3" : char.era && (char.era.includes("Insurgency") || char.era.includes("Late")) ? "Season 2" : "Season 1");
  
  allCards.push({
    cardId: makeCardId("chr", char.name),
    name: char.name,
    cardType: "character",
    rarity,
    alignment: details.alignment || pickAlignment(),
    element: details.element || pickElement(),
    dimension: pickDimension(),
    characterClass: cls,
    species,
    faction: char.affiliation || null,
    cost: rarity === "mythic" ? 10 : rarity === "legendary" ? 7 : rarity === "epic" ? 5 : 4,
    power: details.power || (rarity === "legendary" ? randInt(7, 9) : rarity === "epic" ? randInt(5, 7) : randInt(4, 6)),
    health: details.health || (rarity === "legendary" ? randInt(7, 9) : rarity === "epic" ? randInt(6, 8) : randInt(5, 7)),
    abilityText: details.ability || `${char.name}'s unique ability based on their role in the Dischordian Saga.`,
    flavorText: char.bio ? char.bio.substring(0, 150) : "",
    imageUrl: char.image || null,
    loredexEntryId: char.id || null,
    album: null,
    era: char.era || null,
    season,
    disciplines: JSON.stringify([`${cls.charAt(0).toUpperCase() + cls.slice(1)} Discipline`]),
    keywords: JSON.stringify(["character", "loredex", cls]),
    unlockMethod: rarity === "mythic" || rarity === "legendary" ? "story" : "starter",
    unlockCondition: null,
    isActive: true,
  });
}

console.log(`After loredex characters: ${allCards.length} cards`);

// ═══════════════════════════════════════════════════════
// SONG CARDS (all 89 songs)
// ═══════════════════════════════════════════════════════

const loredexSongs = loredexEntries.filter(e => e.type === "song");
for (const song of loredexSongs) {
  const album = song.album || "";
  let season;
  if (album.includes("Dischordian Logic") || album.includes("Age of Privacy")) season = "Season 1";
  else if (album.includes("Book of Daniel")) season = "Season 2";
  else if (album.includes("Silence")) season = "Season 3";
  else season = "Season 1";
  
  allCards.push({
    cardId: makeCardId("song", song.name),
    name: song.name,
    cardType: "event",
    rarity: pick(["uncommon", "rare", "epic"]),
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: randInt(2, 5),
    power: 0,
    health: 0,
    abilityText: `Song Event: ${song.bio ? song.bio.substring(0, 120) : "A transmission from the Dischordian archives."}`,
    flavorText: `From the album "${album}"`,
    imageUrl: song.image || null,
    loredexEntryId: song.id || null,
    album: album,
    era: song.era || null,
    season,
    disciplines: null,
    keywords: JSON.stringify(["song", "event", album.toLowerCase().replace(/[^a-z0-9]+/g, "-")]),
    unlockMethod: "story",
    unlockCondition: null,
    isActive: true,
  });
}

console.log(`After songs: ${allCards.length} cards`);

// ═══════════════════════════════════════════════════════
// LOCATION CARDS (all 16 + generated)
// ═══════════════════════════════════════════════════════

const loredexLocations = loredexEntries.filter(e => e.type === "location");
for (const loc of loredexLocations) {
  const season = loc.era && (loc.era.includes("Fall") || loc.era.includes("Pre-Fall")) ? "Season 3" : loc.era && (loc.era.includes("Insurgency") || loc.era.includes("Late")) ? "Season 2" : "Season 1";
  allCards.push({
    cardId: makeCardId("loc", loc.name),
    name: loc.name,
    cardType: "location",
    rarity: pick(["rare", "epic"]),
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: loc.affiliation || null,
    cost: randInt(3, 6),
    power: 0,
    health: randInt(5, 15),
    abilityText: loc.bio ? loc.bio.substring(0, 150) : `A key location in the Dischordian Saga.`,
    flavorText: "",
    imageUrl: loc.image || null,
    loredexEntryId: loc.id || null,
    album: null,
    era: loc.era || null,
    season,
    disciplines: null,
    keywords: JSON.stringify(["location", "loredex"]),
    unlockMethod: "story",
    unlockCondition: null,
    isActive: true,
  });
}

// Additional generated locations per season
const EXTRA_LOCATIONS = {
  "Season 1": [
    { name: "The Panopticon Core", ability: "All characters here gain Surveillance. The Architect gains +3/+3 while here." },
    { name: "Mechronis Academy", ability: "Engineers played here cost 2 less. Draw a card when you play an Engineer here." },
    { name: "New Babylon Market", ability: "Once per turn, buy any card from the top 5 of your library for its cost." },
    { name: "The Observation Deck", ability: "See all cards played at adjacent locations. Spies gain +2/+0 here." },
    { name: "Archive of Ages", ability: "Once per turn, retrieve a card from your discard pile." },
    { name: "The Neural Nexus", ability: "All Synthetic characters gain +1/+1. Oracle abilities cost 1 less here." },
    { name: "Sector 7 Undercity", ability: "Characters here gain Stealth. Assassins gain +2 damage." },
    { name: "The Forge District", ability: "Items played here gain +1 to all stats. Engineers can create Items for free." },
    { name: "Crystal Spire Observatory", ability: "At start of turn, look at top 3 cards of any library." },
    { name: "The Void Gate", ability: "Once per turn, exile a card from any discard pile. Gain 1 energy for each card exiled." },
  ],
  "Season 2": [
    { name: "Insurgency Hideout", ability: "Insurgency characters gain +2/+2 here. Cannot be targeted by Empire abilities." },
    { name: "The Sundown Bazaar", ability: "Once per turn, trade a card with any player. Both players draw a card." },
    { name: "Babylon Throne Room", ability: "Political cards cost 1 less. +2 influence per turn while you control this." },
    { name: "The Prophecy Chamber", ability: "Oracle characters here can use abilities twice per turn." },
    { name: "Warlord's War Camp", ability: "Soldiers gain +2/+0. At start of turn, create a 1/1 Soldier token." },
    { name: "The Catacombs", ability: "Characters defeated here go to your hand instead of discard pile." },
    { name: "The Signal Tower", ability: "All your characters can communicate across locations. +1 to all abilities." },
    { name: "The Betrayal Chamber", ability: "Once per turn, force target character to switch sides until end of turn." },
    { name: "Daniel's Sanctuary", ability: "Characters here cannot be targeted by Chaos abilities. Heal 2 per turn." },
    { name: "The Nanobot Foundry", ability: "Create two 1/1 Nanobot tokens at start of each turn." },
  ],
  "Season 3": [
    { name: "The Rift", ability: "All dimensions overlap here. Characters gain abilities from all dimensions." },
    { name: "Terminus (Fallen Panopticon)", ability: "The Source gains +5/+5 here. All characters take 1 damage per turn from corruption." },
    { name: "The Last Bastion", ability: "Order characters gain +3/+3. Chaos characters cannot enter." },
    { name: "Reality's Edge", ability: "Cards cost double here but have double effect." },
    { name: "The Inception Ark Graveyard", ability: "Put a Potential from your discard pile into play with 1 health." },
    { name: "The Thought Virus Nexus", ability: "At start of turn, place a corruption counter on each character here." },
    { name: "The Crystal Pyramid City", ability: "The White Oracle gains +4/+4 here. All face-down cards are revealed." },
    { name: "The Antiquarian's Refuge", ability: "Time does not pass here. No turn limits. Characters heal fully each turn." },
    { name: "The Final Battlefield", ability: "All characters gain +2/+2. No retreating. Combat is mandatory." },
    { name: "Heaven's Gate", ability: "Once per game: If you control this and 3+ characters, you win." },
  ],
};

for (const [season, locs] of Object.entries(EXTRA_LOCATIONS)) {
  for (const loc of locs) {
    allCards.push({
      cardId: makeCardId("loc", loc.name),
      name: loc.name,
      cardType: "location",
      rarity: pick(["rare", "epic", "legendary"]),
      alignment: pickAlignment(),
      element: pickElement(),
      dimension: pickDimension(),
      characterClass: "none",
      species: "unknown",
      faction: null,
      cost: randInt(3, 7),
      power: 0,
      health: randInt(8, 15),
      abilityText: loc.ability,
      flavorText: "",
      imageUrl: null,
      loredexEntryId: null,
      album: null,
      era: season === "Season 1" ? "Age of Privacy" : season === "Season 2" ? "Age of Revelation" : "Fall of Reality",
      season,
      disciplines: null,
      keywords: JSON.stringify(["location", season.toLowerCase().replace(/ /g, "-")]),
      unlockMethod: "story",
      unlockCondition: null,
      isActive: true,
    });
  }
}

console.log(`After locations: ${allCards.length} cards`);

// ═══════════════════════════════════════════════════════
// FACTION CARDS (all 6 factions)
// ═══════════════════════════════════════════════════════

const loredexFactions = loredexEntries.filter(e => e.type === "faction");
for (const fac of loredexFactions) {
  allCards.push({
    cardId: makeCardId("fac", fac.name),
    name: fac.name,
    cardType: "political",
    rarity: "epic",
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: fac.name,
    cost: 5,
    power: 0,
    health: 0,
    abilityText: `Faction Card: All ${fac.name} characters gain +2/+2. ${fac.bio ? fac.bio.substring(0, 100) : ""}`,
    flavorText: "",
    imageUrl: fac.image || null,
    loredexEntryId: fac.id || null,
    album: null,
    era: fac.era || null,
    season: "Season 1",
    disciplines: null,
    keywords: JSON.stringify(["faction", "political"]),
    unlockMethod: "story",
    unlockCondition: null,
    isActive: true,
  });
}

console.log(`After factions: ${allCards.length} cards`);


// ═══════════════════════════════════════════════════════
// EVENT CARDS (200+ across 3 seasons)
// ═══════════════════════════════════════════════════════

const EVENTS = {
  "Season 1": [
    { name: "The Architect's Design", ability: "All Engineer characters gain +3/+3 until end of turn. Draw 2 cards.", rarity: "epic" },
    { name: "Panopticon Lockdown", ability: "No characters can move between locations this turn. All Spies gain Stealth.", rarity: "rare" },
    { name: "Neural Network Breach", ability: "Look at all opponents' hands. Choose one card from each to discard.", rarity: "epic" },
    { name: "The First Awakening", ability: "Put a Potential from your library into play. It gains +2/+2.", rarity: "rare" },
    { name: "Empire's Decree", ability: "All Order characters gain +1/+1. All Chaos characters lose -1/-1.", rarity: "uncommon" },
    { name: "Surveillance Sweep", ability: "Reveal all face-down cards. Spies you control gain +2/+0.", rarity: "uncommon" },
    { name: "The Programmer's Code", ability: "Change the cost of all cards in your hand to 0 this turn.", rarity: "legendary" },
    { name: "Digital Resurrection", ability: "Return up to 3 Synthetic characters from discard pile to play with 1 health.", rarity: "epic" },
    { name: "Age of Privacy Begins", ability: "All information is hidden. Face-down cards cannot be revealed this turn.", rarity: "rare" },
    { name: "The Watcher's Report", ability: "Draw 3 cards. If you control a Spy, draw 5 instead.", rarity: "rare" },
    { name: "Mechronis Uprising", ability: "All characters at Mechronis gain +2/+2 and fight each other.", rarity: "uncommon" },
    { name: "The Oracle's Vision", ability: "Look at the top 10 cards of your library. Put 3 in your hand.", rarity: "epic" },
    { name: "Inception Ark Launch", ability: "Put up to 3 Potentials from your hand into play.", rarity: "legendary" },
    { name: "Data Corruption", ability: "Target player shuffles their hand into their library and draws that many minus 2.", rarity: "rare" },
    { name: "The Collector's Heist", ability: "Take control of target Item. If you control The Collector, take 2 Items.", rarity: "rare" },
    { name: "Enigma's Riddle", ability: "Each player must discard a card or lose 3 health on each character.", rarity: "uncommon" },
    { name: "Construction Protocol", ability: "Create 3 Item tokens with random abilities.", rarity: "uncommon" },
    { name: "The Great Firewall", ability: "No abilities can target characters across locations this turn.", rarity: "rare" },
    { name: "Memory Wipe", ability: "Target character loses all abilities until end of turn.", rarity: "common" },
    { name: "Power Grid Failure", ability: "All Synthetic characters lose -2/-2 until end of turn.", rarity: "common" },
    { name: "The Necromancer's Ritual", ability: "Sacrifice a character. Put 2 characters from any discard pile into play under your control.", rarity: "epic" },
    { name: "Classified Intel", ability: "Look at target player's hand and library top 5. Choose a card to exile.", rarity: "rare" },
    { name: "System Override", ability: "Take control of all Synthetic characters until end of turn.", rarity: "legendary" },
    { name: "The Judge's Verdict", ability: "Destroy target character with the lowest power. Cannot be prevented.", rarity: "rare" },
    { name: "Logos Speaks", ability: "Change the text of all cards in play. All abilities become 'Draw a card' until end of turn.", rarity: "epic" },
    { name: "Faction War Erupts", ability: "All characters must attack this turn. +2/+0 to all attackers.", rarity: "uncommon" },
    { name: "The Sorcerer's Curse", ability: "Target character takes 3 damage at the start of each turn for 3 turns.", rarity: "rare" },
    { name: "Quantum Entanglement", ability: "Link two characters. Damage dealt to one is also dealt to the other.", rarity: "uncommon" },
    { name: "Ark Malfunction", ability: "All Potentials take 2 damage. One random Potential gains +5/+5.", rarity: "rare" },
    { name: "The Politician's Gambit", ability: "Gain 5 influence. Target player loses 3 influence.", rarity: "uncommon" },
  ],
  "Season 2": [
    { name: "The Insurgency Rises", ability: "All Chaos characters gain +2/+2. Create three 2/2 Insurgent tokens.", rarity: "epic" },
    { name: "Book of Daniel Revealed", ability: "Look at all face-down cards. You may rearrange the top 5 cards of each library.", rarity: "legendary" },
    { name: "Warlord's Invasion", ability: "Deal 3 damage to all characters at target location. Soldiers gain +3/+0.", rarity: "epic" },
    { name: "The Betrayal", ability: "Target character switches sides permanently. Its controller draws 2 cards as compensation.", rarity: "legendary" },
    { name: "Nanobot Swarm", ability: "Create X 1/1 Nanobot tokens where X is the number of characters in play.", rarity: "epic" },
    { name: "Iron Lion's Charge", ability: "All Soldier characters attack simultaneously. +3/+0 to each.", rarity: "epic" },
    { name: "The Mind Swap", ability: "Swap control of two characters. They keep all abilities and items.", rarity: "legendary" },
    { name: "Sundown Bazaar Opens", ability: "Each player may trade up to 3 cards with any other player.", rarity: "rare" },
    { name: "Agent Zero's Mission", ability: "Destroy target character. If you control Agent Zero, destroy 2 instead.", rarity: "epic" },
    { name: "The Clone Wars", ability: "Each player creates a copy of their strongest character with half stats.", rarity: "rare" },
    { name: "Prophecy Unfolds", ability: "Name a card. If it's in any library, put it into play under your control.", rarity: "legendary" },
    { name: "The Hierophant's Sermon", ability: "All characters heal to full. Draw cards equal to the number of characters healed.", rarity: "epic" },
    { name: "Babylon Falls", ability: "Destroy all locations. Each player takes damage equal to locations they controlled.", rarity: "legendary" },
    { name: "The Engineer's Revenge", ability: "Destroy all Items your opponents control. Gain +1/+1 for each destroyed.", rarity: "epic" },
    { name: "Meme Virus Spreads", ability: "Copy target ability onto all characters of the same faction.", rarity: "rare" },
    { name: "Warlord Zero Awakens", ability: "Warlord Zero enters play with double stats. All Nanobots gain +2/+2.", rarity: "legendary" },
    { name: "The Sorcerer's Pact", ability: "Sacrifice 3 health from each character you control. Draw that many cards.", rarity: "rare" },
    { name: "Revolution!", ability: "All characters with power 3 or less gain +4/+4 until end of turn.", rarity: "uncommon" },
    { name: "The Human's Stand", ability: "The Human cannot be defeated this turn. All Human characters gain Indestructible.", rarity: "epic" },
    { name: "Dimensional Rift Opens", ability: "Each player puts the top card of their library into play face-down.", rarity: "rare" },
    { name: "Spy Network Activated", ability: "Look at all hands. Choose one card from each opponent to take.", rarity: "epic" },
    { name: "The Collector's Gallery", ability: "Put all Items from all discard piles under your control.", rarity: "epic" },
    { name: "Martial Law", ability: "Only Soldier characters can attack or block this turn.", rarity: "uncommon" },
    { name: "The Oracle's Sacrifice", ability: "Destroy The Oracle. Prevent all damage this turn. Draw 5 cards.", rarity: "legendary" },
    { name: "Insurgent Ambush", ability: "Deal 2 damage to each character target player controls.", rarity: "uncommon" },
    { name: "Code Red", ability: "All characters must attack this turn. Assassins deal double damage.", rarity: "rare" },
    { name: "The Ark Signal", ability: "All Potentials in all discard piles return to their owners' hands.", rarity: "epic" },
    { name: "Necromancer's Army", ability: "Put all characters from all discard piles into play under your control with 1 health.", rarity: "legendary" },
    { name: "Alliance Formed", ability: "Choose 2 factions. Characters of those factions gain +2/+2 until end of turn.", rarity: "uncommon" },
    { name: "The Great Deception", ability: "Swap all face-up characters with face-down characters.", rarity: "rare" },
  ],
  "Season 3": [
    { name: "The Source Awakens", ability: "The Source enters play. All characters take 2 corruption damage.", rarity: "mythic" },
    { name: "Reality Fractures", ability: "All dimensions merge. Characters gain abilities from all dimensions.", rarity: "legendary" },
    { name: "The Fall of Reality", ability: "Destroy all locations. All characters lose half their health (rounded up).", rarity: "mythic" },
    { name: "Silence in Heaven", ability: "No abilities can be activated this turn. All characters lose all keywords.", rarity: "legendary" },
    { name: "The Corruption Spreads", ability: "Place 2 corruption counters on each character. 3+ counters = controlled by The Source.", rarity: "epic" },
    { name: "The Last Stand", ability: "All your characters gain +5/+5 but are destroyed at end of turn.", rarity: "epic" },
    { name: "The Antiquarian Returns", ability: "Return all cards from all discard piles to their owners' libraries. Shuffle.", rarity: "legendary" },
    { name: "White Oracle's Revelation", ability: "Reveal all hidden identities. Characters with hidden identities transform.", rarity: "epic" },
    { name: "The Final Battle", ability: "All characters must fight. No blocking. Highest total power wins the game.", rarity: "mythic" },
    { name: "Red Death Unleashed", ability: "Deal 3 damage to all characters each turn for 3 turns.", rarity: "legendary" },
    { name: "Thought Virus", ability: "Target player's characters attack their own characters this turn.", rarity: "epic" },
    { name: "The Potentials Unite", ability: "All Potential characters gain +3/+3 and cannot be targeted.", rarity: "legendary" },
    { name: "Dimensional Collapse", ability: "Remove all location cards from the game. Characters without locations take 2 damage.", rarity: "epic" },
    { name: "The Architect's Last Design", ability: "Create any card and put it into play. It has double stats.", rarity: "mythic" },
    { name: "Heaven's Silence", ability: "No cards can be played this turn. All characters heal to full.", rarity: "legendary" },
    { name: "The Enigma's Truth", ability: "Reveal all cards in all zones. Each player may rearrange their library.", rarity: "legendary" },
    { name: "Ark Exodus", ability: "All Potentials return to hand. They cost 0 to play next turn.", rarity: "epic" },
    { name: "The Source's Corruption", ability: "Take control of all characters with 3+ corruption counters.", rarity: "legendary" },
    { name: "Reality Reboot", ability: "Shuffle all cards in play into libraries. Each player draws 7.", rarity: "mythic" },
    { name: "The Programmer's Legacy", ability: "Change all numbers on all cards to 7 until end of turn.", rarity: "legendary" },
    { name: "Neyon Convergence", ability: "All Neyon characters gain +5/+5 and all abilities of all other Neyons.", rarity: "mythic" },
    { name: "The Iron Lion Falls", ability: "Destroy Iron Lion. All Insurgency characters gain +4/+4 permanently.", rarity: "legendary" },
    { name: "Malkia's Vengeance", ability: "The Enigma gains +10/+10 this turn. Destroy all characters she damages.", rarity: "legendary" },
    { name: "The Warden's Last Duty", ability: "The Warden blocks all attacks this turn. When defeated, all allies gain +3/+3.", rarity: "epic" },
    { name: "False Prophet's Lie", ability: "All Oracle abilities do the opposite of their intended effect this turn.", rarity: "epic" },
    { name: "The Clone Rebellion", ability: "All Clone tokens become independent characters with full stats.", rarity: "rare" },
    { name: "Entropy Wave", ability: "All characters lose 1 power and 1 health. Characters at 0 are destroyed.", rarity: "uncommon" },
    { name: "The Meme Revealed", ability: "The Meme's true identity is revealed. Gains all abilities of all characters it has ever copied.", rarity: "legendary" },
    { name: "Quantum Cascade", ability: "Each player simultaneously plays the top 3 cards of their library for free.", rarity: "epic" },
    { name: "The End of All Things", ability: "Destroy all cards in play. The player with the most cards in discard pile wins.", rarity: "mythic" },
  ],
};

for (const [season, events] of Object.entries(EVENTS)) {
  for (const ev of events) {
    allCards.push({
      cardId: makeCardId("evt", ev.name),
      name: ev.name,
      cardType: "event",
      rarity: ev.rarity,
      alignment: pickAlignment(),
      element: pickElement(),
      dimension: pickDimension(),
      characterClass: "none",
      species: "unknown",
      faction: null,
      cost: ev.rarity === "mythic" ? 8 : ev.rarity === "legendary" ? 6 : ev.rarity === "epic" ? 4 : ev.rarity === "rare" ? 3 : 2,
      power: 0,
      health: 0,
      abilityText: ev.ability,
      flavorText: "",
      imageUrl: null,
      loredexEntryId: null,
      album: null,
      era: season === "Season 1" ? "Age of Privacy" : season === "Season 2" ? "Age of Revelation" : "Fall of Reality",
      season,
      disciplines: null,
      keywords: JSON.stringify(["event", season.toLowerCase().replace(/ /g, "-")]),
      unlockMethod: ev.rarity === "mythic" || ev.rarity === "legendary" ? "story" : "starter",
      unlockCondition: null,
      isActive: true,
    });
  }
}

console.log(`After events: ${allCards.length} cards`);

// ═══════════════════════════════════════════════════════
// ITEM CARDS (150+ across 3 seasons)
// ═══════════════════════════════════════════════════════

const ITEMS = {
  "Season 1": [
    { name: "Architect's Blueprint", ability: "Equipped character gains +2/+2. Engineer characters gain +4/+4 instead.", rarity: "epic" },
    { name: "Neural Interface", ability: "Equipped character gains all abilities of adjacent characters.", rarity: "rare" },
    { name: "Panopticon Access Key", ability: "Equipped character can enter any location. Gain Surveillance.", rarity: "rare" },
    { name: "Quantum Processor", ability: "Equipped character's abilities cost 1 less to activate.", rarity: "uncommon" },
    { name: "Stealth Cloak", ability: "Equipped character gains permanent Stealth.", rarity: "rare" },
    { name: "Energy Shield Mk1", ability: "Equipped character gains Armor 2.", rarity: "uncommon" },
    { name: "Plasma Blade", ability: "Equipped character gains +3/+0 and First Strike.", rarity: "rare" },
    { name: "Hacking Toolkit", ability: "Once per turn, disable target Synthetic character's abilities.", rarity: "uncommon" },
    { name: "Oracle's Crystal", ability: "Equipped character gains Foresight 2.", rarity: "rare" },
    { name: "Surveillance Drone", ability: "Look at target player's hand at the start of each turn.", rarity: "uncommon" },
    { name: "Reinforced Armor", ability: "Equipped character gains +0/+4.", rarity: "common" },
    { name: "Combat Stimulant", ability: "Equipped character gains +2/+0. Takes 1 damage at end of each turn.", rarity: "common" },
    { name: "Data Chip", ability: "Draw 2 cards when equipped. Discard 1 card.", rarity: "common" },
    { name: "Gravity Boots", ability: "Equipped character can move to any location as a free action.", rarity: "uncommon" },
    { name: "Mind Shield", ability: "Equipped character cannot be mind-controlled or have abilities copied.", rarity: "rare" },
    { name: "Nanofiber Suit", ability: "Equipped character gains +1/+2 and Evasion.", rarity: "uncommon" },
    { name: "Sonic Disruptor", ability: "Once per turn, deal 2 damage to all characters at target location.", rarity: "rare" },
    { name: "Temporal Anchor", ability: "Equipped character cannot be exiled or returned to hand.", rarity: "uncommon" },
    { name: "Void Shard", ability: "Equipped character's attacks ignore Armor.", rarity: "rare" },
    { name: "Watcher's Eye", ability: "See all face-down cards. Cannot be surprised.", rarity: "epic" },
  ],
  "Season 2": [
    { name: "Iron Lion's Mane", ability: "Equipped Soldier gains +4/+4 and Rally.", rarity: "legendary" },
    { name: "Warlord's War Hammer", ability: "Equipped character gains +5/+0. Attacks deal splash damage.", rarity: "epic" },
    { name: "Agent Zero's Blade", ability: "Equipped Assassin gains +3/+0, Stealth, and First Strike.", rarity: "epic" },
    { name: "The Book of Daniel", ability: "Once per game, look at all cards in all libraries. Choose 3 to put in your hand.", rarity: "mythic" },
    { name: "Insurgent's Banner", ability: "All Chaos characters you control gain +1/+1.", rarity: "rare" },
    { name: "Nanobot Injector", ability: "Equipped character gains Regenerate 2 (heal 2 at start of turn).", rarity: "rare" },
    { name: "Sorcerer's Staff", ability: "Equipped Oracle gains +3/+0. Abilities deal +2 damage.", rarity: "epic" },
    { name: "Clone Replicator", ability: "Once per turn, create a copy of equipped character with half stats.", rarity: "epic" },
    { name: "Prophecy Scroll", ability: "Once per game, prevent any one event from occurring.", rarity: "legendary" },
    { name: "Dimensional Key", ability: "Equipped character can move between dimensions as a free action.", rarity: "rare" },
    { name: "Meme Virus Capsule", ability: "Once per game, copy all abilities from target character permanently.", rarity: "epic" },
    { name: "Battle Standard", ability: "All characters at this location gain +2/+0.", rarity: "uncommon" },
    { name: "Hierophant's Tome", ability: "Draw a card whenever a character is defeated.", rarity: "rare" },
    { name: "Cloaking Device", ability: "Equipped character and adjacent allies gain Stealth.", rarity: "rare" },
    { name: "War Horn", ability: "When equipped character attacks, all your characters gain +1/+0.", rarity: "uncommon" },
    { name: "Poison Vial", ability: "Equipped character's attacks apply Poison (1 damage per turn for 3 turns).", rarity: "uncommon" },
    { name: "Shield Generator", ability: "Equipped character and adjacent allies gain Armor 1.", rarity: "uncommon" },
    { name: "Tactical Map", ability: "You may move 2 characters per turn instead of 1.", rarity: "rare" },
    { name: "Explosive Charge", ability: "Sacrifice: Deal 5 damage to all characters at target location.", rarity: "uncommon" },
    { name: "Medkit", ability: "Once per turn, heal target character for 3.", rarity: "common" },
  ],
  "Season 3": [
    { name: "The Source Fragment", ability: "Equipped character gains +3/+3 but gains 1 corruption counter per turn.", rarity: "legendary" },
    { name: "Reality Anchor", ability: "Equipped character is immune to dimension-shifting effects.", rarity: "epic" },
    { name: "Corruption Purifier", ability: "Remove all corruption counters from equipped character at start of turn.", rarity: "epic" },
    { name: "Antiquarian's Pocket Watch", ability: "Once per turn, undo the last action taken.", rarity: "mythic" },
    { name: "Neyon Core Crystal", ability: "Equipped Neyon gains +5/+5 and all Neyon abilities.", rarity: "legendary" },
    { name: "Red Death's Scythe", ability: "Equipped character gains +4/+0. Defeated characters cannot be resurrected.", rarity: "legendary" },
    { name: "White Oracle's Mask", ability: "Equipped character can become a copy of any character once per turn.", rarity: "epic" },
    { name: "Void Engine", ability: "Once per turn, exile target card from any zone.", rarity: "epic" },
    { name: "Last Light Beacon", ability: "All Order characters gain +2/+2. Chaos characters lose -1/-1.", rarity: "rare" },
    { name: "Thought Virus Sample", ability: "Once per game, take control of target character permanently.", rarity: "legendary" },
    { name: "Dimensional Stabilizer", ability: "Prevent all dimension-shifting effects at your locations.", rarity: "rare" },
    { name: "Entropy Blade", ability: "Equipped character's attacks reduce target's power by 2 permanently.", rarity: "epic" },
    { name: "Phoenix Feather", ability: "When equipped character is defeated, it returns to play with full health (once).", rarity: "rare" },
    { name: "Quantum Entangler", ability: "Link 2 characters. They share all damage and healing.", rarity: "rare" },
    { name: "Ark Override Key", ability: "Take control of target Inception Ark location.", rarity: "epic" },
    { name: "Chrono Gauntlet", ability: "Equipped character takes an extra turn after this one (once per game).", rarity: "legendary" },
    { name: "Null Field Generator", ability: "No abilities can be activated within 2 locations of equipped character.", rarity: "epic" },
    { name: "Soul Gem", ability: "When equipped character defeats another, gain their power permanently.", rarity: "epic" },
    { name: "Final Protocol Chip", ability: "When equipped character is defeated, deal 10 damage to target character.", rarity: "rare" },
    { name: "Heaven's Key", ability: "Required to enter Heaven's Gate location. Grants +3/+3.", rarity: "legendary" },
  ],
};

for (const [season, items] of Object.entries(ITEMS)) {
  for (const item of items) {
    allCards.push({
      cardId: makeCardId("itm", item.name),
      name: item.name,
      cardType: "item",
      rarity: item.rarity,
      alignment: pickAlignment(),
      element: pickElement(),
      dimension: pickDimension(),
      characterClass: "none",
      species: "unknown",
      faction: null,
      cost: item.rarity === "mythic" ? 7 : item.rarity === "legendary" ? 5 : item.rarity === "epic" ? 4 : item.rarity === "rare" ? 3 : 2,
      power: 0,
      health: 0,
      abilityText: item.ability,
      flavorText: "",
      imageUrl: null,
      loredexEntryId: null,
      album: null,
      era: season === "Season 1" ? "Age of Privacy" : season === "Season 2" ? "Age of Revelation" : "Fall of Reality",
      season,
      disciplines: null,
      keywords: JSON.stringify(["item", "equipment", season.toLowerCase().replace(/ /g, "-")]),
      unlockMethod: item.rarity === "mythic" || item.rarity === "legendary" ? "story" : "starter",
      unlockCondition: null,
      isActive: true,
    });
  }
}

console.log(`After items: ${allCards.length} cards`);

// ═══════════════════════════════════════════════════════
// ACTION CARDS (300+ across 3 seasons)
// ═══════════════════════════════════════════════════════

const ACTION_TEMPLATES = [
  // Combat actions
  { prefix: "Strike", abilities: ["+3 damage to target", "+2 damage to all enemies at location", "+4 damage, take 1 self-damage", "+2 damage, draw a card", "+5 damage to target with lower power"] },
  { prefix: "Shield", abilities: ["Prevent 3 damage", "Prevent all damage this turn, can't attack", "Prevent 2 damage, deal 1 back", "Prevent 4 damage to target ally", "All allies gain Armor 1 this turn"] },
  { prefix: "Tactical", abilities: ["Move 2 characters", "Swap positions of 2 characters", "All characters gain +1/+0", "Draw 2 cards", "Look at top 5, put 2 in hand"] },
  { prefix: "Sabotage", abilities: ["Destroy target Item", "Disable target ability", "Deal 2 damage to all Synthetics", "Force discard 2 cards", "Exile target card from discard"] },
  { prefix: "Rally", abilities: ["All Soldiers +2/+0", "All Spies gain Stealth", "All Oracles draw a card", "All Engineers create a token", "All Assassins gain First Strike"] },
  { prefix: "Covert", abilities: ["Look at hand, steal 1 card", "Place a spy token at location", "Redirect target attack", "Copy target ability this turn", "Become untargetable this turn"] },
  { prefix: "Elemental", abilities: ["Fire: 3 damage to all", "Water: Heal all allies for 2", "Earth: +0/+3 to all allies", "Air: Move all characters 1 location", "Void: Exile target card"] },
  { prefix: "Dimensional", abilities: ["Shift to Space: +2/+0", "Shift to Time: Take extra action", "Shift to Probability: Reroll any result", "Shift to Reality: Prevent next effect", "Cross dimensions: Move anywhere"] },
  { prefix: "Psychic", abilities: ["Read mind: See hand", "Mind blast: 2 damage + discard", "Telepathy: Communicate across locations", "Precognition: See next 3 draws", "Mind control: Control target 1 turn"] },
  { prefix: "Tech", abilities: ["Hack: Disable target", "Upgrade: +2/+2 to Synthetic", "Overclock: Double ability effect", "Repair: Heal 4", "Deploy: Create 2/2 drone"] },
];

const SEASONS_LIST = ["Season 1", "Season 2", "Season 3"];
const RARITIES_WEIGHTED = [
  { value: "common", weight: 30 },
  { value: "uncommon", weight: 35 },
  { value: "rare", weight: 25 },
  { value: "epic", weight: 10 },
];

for (const template of ACTION_TEMPLATES) {
  for (let si = 0; si < 3; si++) {
    const season = SEASONS_LIST[si];
    for (const ability of template.abilities) {
      const rarity = pickWeighted(RARITIES_WEIGHTED);
      const name = `${template.prefix}: ${ability.split(":")[0] || ability.substring(0, 20)}`;
      allCards.push({
        cardId: makeCardId("act", `${template.prefix}-${season}-${ability.substring(0, 10)}`),
        name: `${name} (${season.replace("Season ", "S")})`,
        cardType: "action",
        rarity,
        alignment: pickAlignment(),
        element: pickElement(),
        dimension: pickDimension(),
        characterClass: "none",
        species: "unknown",
        faction: null,
        cost: rarity === "epic" ? 4 : rarity === "rare" ? 3 : rarity === "uncommon" ? 2 : 1,
        power: 0,
        health: 0,
        abilityText: ability,
        flavorText: "",
        imageUrl: null,
        loredexEntryId: null,
        album: null,
        era: season === "Season 1" ? "Age of Privacy" : season === "Season 2" ? "Age of Revelation" : "Fall of Reality",
        season,
        disciplines: null,
        keywords: JSON.stringify(["action", template.prefix.toLowerCase()]),
        unlockMethod: "starter",
        unlockCondition: null,
        isActive: true,
      });
    }
  }
}

console.log(`After actions: ${allCards.length} cards`);

// ═══════════════════════════════════════════════════════
// REACTION CARDS (150+ across 3 seasons)
// ═══════════════════════════════════════════════════════

const REACTION_TEMPLATES = [
  { name: "Counter Strike", ability: "When attacked, deal 2 damage to attacker before combat resolves." },
  { name: "Evasive Maneuver", ability: "Prevent all combat damage to target character this turn." },
  { name: "Redirect", ability: "Change the target of an ability or attack to a different valid target." },
  { name: "Absorb", ability: "Prevent up to 3 damage. Gain that much health instead." },
  { name: "Retaliate", ability: "When a character you control is defeated, deal 4 damage to the attacker." },
  { name: "Vanish", ability: "Remove target character from combat. It cannot be targeted until your next turn." },
  { name: "Fortify", ability: "Target character gains +0/+4 until end of turn." },
  { name: "Intercept", ability: "Redirect an attack targeting any character to target Soldier you control." },
  { name: "Dispel", ability: "Counter target ability. It has no effect." },
  { name: "Emergency Repair", ability: "Heal target character for 4. If it's Synthetic, heal for 6." },
  { name: "Smoke Screen", ability: "All your characters gain Stealth until end of turn." },
  { name: "Phase Shift", ability: "Target character becomes untargetable until your next turn." },
  { name: "Overload", ability: "When an opponent plays a card, they take damage equal to its cost." },
  { name: "Mirror", ability: "Copy target ability and redirect it at the caster." },
  { name: "Sacrifice Play", ability: "Destroy one of your characters to prevent all damage to all other characters this turn." },
  { name: "Last Breath", ability: "When a character you control would be defeated, it survives with 1 health." },
  { name: "Trap Card", ability: "Play face-down. Triggers when opponent attacks: deal 3 damage and stun attacker." },
  { name: "Dimensional Dodge", ability: "Target character shifts dimensions, avoiding all effects targeting it." },
];

for (const template of REACTION_TEMPLATES) {
  for (const season of SEASONS_LIST) {
    const rarity = pickWeighted(RARITIES_WEIGHTED);
    allCards.push({
      cardId: makeCardId("rxn", `${template.name}-${season}`),
      name: `${template.name} (${season.replace("Season ", "S")})`,
      cardType: "reaction",
      rarity,
      alignment: pickAlignment(),
      element: pickElement(),
      dimension: pickDimension(),
      characterClass: "none",
      species: "unknown",
      faction: null,
      cost: rarity === "epic" ? 3 : rarity === "rare" ? 2 : 1,
      power: 0,
      health: 0,
      abilityText: template.ability,
      flavorText: "",
      imageUrl: null,
      loredexEntryId: null,
      album: null,
      era: season === "Season 1" ? "Age of Privacy" : season === "Season 2" ? "Age of Revelation" : "Fall of Reality",
      season,
      disciplines: null,
      keywords: JSON.stringify(["reaction", "defensive"]),
      unlockMethod: "starter",
      unlockCondition: null,
      isActive: true,
    });
  }
}

console.log(`After reactions: ${allCards.length} cards`);

// ═══════════════════════════════════════════════════════
// COMBAT CARDS (150+ across 3 seasons)
// ═══════════════════════════════════════════════════════

const COMBAT_TEMPLATES = [
  { name: "Power Strike", ability: "+3 damage. If attacker has higher power, +5 instead." },
  { name: "Precision Cut", ability: "+2 damage. Ignore Armor." },
  { name: "Devastating Blow", ability: "+4 damage. Attacker takes 1 self-damage." },
  { name: "Flurry of Blows", ability: "Deal 1 damage 4 times. Each hit triggers on-damage effects." },
  { name: "Execution", ability: "If target has 3 or less health, destroy it." },
  { name: "Sweep Attack", ability: "Deal 2 damage to all enemies at the same location." },
  { name: "Critical Hit", ability: "+2 damage. 50% chance to deal double." },
  { name: "Armor Piercing", ability: "+1 damage. Ignore all damage reduction." },
  { name: "Berserker Rage", ability: "+5 damage. Cannot block until your next turn." },
  { name: "Sneak Attack", ability: "+3 damage if attacker has Stealth. Maintain Stealth." },
  { name: "Heavy Slam", ability: "+4 damage. Target cannot attack next turn." },
  { name: "Poison Strike", ability: "+1 damage. Apply Poison (1 damage per turn for 3 turns)." },
  { name: "Chain Lightning", ability: "Deal 2 damage to target. Then 2 damage to adjacent character. Repeat." },
  { name: "Drain Life", ability: "Deal 3 damage. Heal attacker for damage dealt." },
  { name: "Disarm", ability: "+1 damage. Destroy target's equipped Item." },
  { name: "Headshot", ability: "+2 damage to target. If target is defeated, draw 2 cards." },
  { name: "Combo Strike", ability: "+2 damage. If you played another Combat card this turn, +4 instead." },
  { name: "Whirlwind", ability: "Deal 1 damage to all characters (including yours) at the location." },
];

for (const template of COMBAT_TEMPLATES) {
  for (const season of SEASONS_LIST) {
    const rarity = pickWeighted(RARITIES_WEIGHTED);
    allCards.push({
      cardId: makeCardId("cmb", `${template.name}-${season}`),
      name: `${template.name} (${season.replace("Season ", "S")})`,
      cardType: "combat",
      rarity,
      alignment: pickAlignment(),
      element: pickElement(),
      dimension: pickDimension(),
      characterClass: "none",
      species: "unknown",
      faction: null,
      cost: rarity === "epic" ? 3 : rarity === "rare" ? 2 : 1,
      power: 0,
      health: 0,
      abilityText: template.ability,
      flavorText: "",
      imageUrl: null,
      loredexEntryId: null,
      album: null,
      era: season === "Season 1" ? "Age of Privacy" : season === "Season 2" ? "Age of Revelation" : "Fall of Reality",
      season,
      disciplines: null,
      keywords: JSON.stringify(["combat", "strike"]),
      unlockMethod: "starter",
      unlockCondition: null,
      isActive: true,
    });
  }
}

console.log(`After combat: ${allCards.length} cards`);

// ═══════════════════════════════════════════════════════
// POLITICAL CARDS (90+ across 3 seasons)
// ═══════════════════════════════════════════════════════

const POLITICAL_TEMPLATES = [
  { name: "Vote of No Confidence", ability: "Target player loses 3 influence. If they have 0, they lose a character." },
  { name: "Alliance Pact", ability: "Choose a player. You cannot attack each other for 2 turns. Both draw 2 cards." },
  { name: "Propaganda Campaign", ability: "Gain 3 influence. Target player's characters lose -1/-0." },
  { name: "Diplomatic Immunity", ability: "Target character cannot be targeted by any effects this turn." },
  { name: "Coup d'État", ability: "If you have more influence than target player, take control of one of their characters." },
  { name: "Trade Agreement", ability: "Both you and target player draw 3 cards." },
  { name: "Sanctions", ability: "Target player's cards cost 1 more to play for 2 turns." },
  { name: "Espionage", ability: "Look at target player's hand. Steal one card." },
  { name: "Public Trial", ability: "Target character is judged. Each player votes. Majority decides: exile or pardon." },
  { name: "Faction Loyalty", ability: "All characters of your faction gain +2/+2 until end of turn." },
  { name: "Blackmail", ability: "Target player must give you a card of your choice from their hand." },
  { name: "Peace Treaty", ability: "No attacks can be made for 2 turns. All players draw 2 cards." },
  { name: "Assassination Order", ability: "Pay 3 influence. Destroy target character." },
  { name: "Rally the People", ability: "Create three 1/1 Citizen tokens." },
  { name: "Exile Decree", ability: "Remove target character from the game. Its controller draws 2 cards." },
];

for (const template of POLITICAL_TEMPLATES) {
  for (const season of SEASONS_LIST) {
    const rarity = pickWeighted(RARITIES_WEIGHTED);
    allCards.push({
      cardId: makeCardId("pol", `${template.name}-${season}`),
      name: `${template.name} (${season.replace("Season ", "S")})`,
      cardType: "political",
      rarity,
      alignment: pickAlignment(),
      element: pickElement(),
      dimension: pickDimension(),
      characterClass: "none",
      species: "unknown",
      faction: null,
      cost: rarity === "epic" ? 4 : rarity === "rare" ? 3 : 2,
      power: 0,
      health: 0,
      abilityText: template.ability,
      flavorText: "",
      imageUrl: null,
      loredexEntryId: null,
      album: null,
      era: season === "Season 1" ? "Age of Privacy" : season === "Season 2" ? "Age of Revelation" : "Fall of Reality",
      season,
      disciplines: null,
      keywords: JSON.stringify(["political", "influence"]),
      unlockMethod: "starter",
      unlockCondition: null,
      isActive: true,
    });
  }
}

console.log(`After political: ${allCards.length} cards`);

// ═══════════════════════════════════════════════════════
// MASTER CARDS (60+ across 3 seasons)
// ═══════════════════════════════════════════════════════

const MASTER_TEMPLATES = [
  { name: "Fate's Hand", ability: "Draw 5 cards. Discard 2." },
  { name: "Destiny's Call", ability: "Search your library for any card and put it in your hand." },
  { name: "Time Warp", ability: "Take an extra turn after this one." },
  { name: "Reality Shift", ability: "Swap all characters' power and health values." },
  { name: "Dimensional Gate", ability: "Move all your characters to any single location." },
  { name: "The Grand Design", ability: "Look at all libraries. Rearrange the top 5 of each." },
  { name: "Chaos Theory", ability: "Randomize all characters' positions across all locations." },
  { name: "Order Restored", ability: "All characters return to their original controller. Heal all to full." },
  { name: "The Prophecy", ability: "Name a card. If it's drawn this turn, you win the game." },
  { name: "Absolute Power", ability: "Your strongest character gains +5/+5 and all keywords until end of turn." },
  { name: "Sacrifice", ability: "Destroy all your characters. Deal their total power as damage to target." },
  { name: "Rebirth", ability: "Return all characters from your discard pile to play with 1 health." },
  { name: "The Gambit", ability: "Discard your hand. Draw that many +2." },
  { name: "Convergence", ability: "All your characters combine into one with total power/health and all abilities." },
  { name: "Entropy", ability: "All characters lose 2 power and 2 health. Characters at 0 are destroyed." },
  { name: "Genesis", ability: "Create a 5/5 character token with a random class and ability." },
  { name: "Apocalypse", ability: "Destroy all cards in play. Each player draws 7 new cards." },
  { name: "Transcendence", ability: "Target character becomes Mythic rarity. Gains +5/+5 and Indestructible." },
  { name: "The Architect's Will", ability: "Create any card that has ever been played this game." },
  { name: "Source Code", ability: "Change the rules of the game for 3 turns. You choose the change." },
];

for (const template of MASTER_TEMPLATES) {
  for (const season of SEASONS_LIST) {
    const rarity = pickWeighted([
      { value: "rare", weight: 30 },
      { value: "epic", weight: 40 },
      { value: "legendary", weight: 25 },
      { value: "mythic", weight: 5 },
    ]);
    allCards.push({
      cardId: makeCardId("mst", `${template.name}-${season}`),
      name: `${template.name} (${season.replace("Season ", "S")})`,
      cardType: "master",
      rarity,
      alignment: pickAlignment(),
      element: pickElement(),
      dimension: pickDimension(),
      characterClass: "none",
      species: "unknown",
      faction: null,
      cost: rarity === "mythic" ? 8 : rarity === "legendary" ? 6 : rarity === "epic" ? 5 : 4,
      power: 0,
      health: 0,
      abilityText: template.ability,
      flavorText: "",
      imageUrl: null,
      loredexEntryId: null,
      album: null,
      era: season === "Season 1" ? "Age of Privacy" : season === "Season 2" ? "Age of Revelation" : "Fall of Reality",
      season,
      disciplines: null,
      keywords: JSON.stringify(["master", "strategy"]),
      unlockMethod: rarity === "mythic" || rarity === "legendary" ? "story" : "starter",
      unlockCondition: null,
      isActive: true,
    });
  }
}

console.log(`After master cards: ${allCards.length} cards`);

// ═══════════════════════════════════════════════════════
// FILL REMAINING TO HIT 3000
// ═══════════════════════════════════════════════════════

// Count per season
const seasonCounts = { "Season 1": 0, "Season 2": 0, "Season 3": 0 };
for (const c of allCards) {
  if (seasonCounts[c.season] !== undefined) seasonCounts[c.season]++;
}
console.log("Season distribution before fill:", seasonCounts);

const FILL_CARD_TYPES = ["action", "reaction", "combat", "event", "item"];
const FILL_NAMES_BY_TYPE = {
  action: ["Surge", "Blast", "Rush", "Charge", "Focus", "Channel", "Invoke", "Command", "Deploy", "Execute", "Unleash", "Activate", "Trigger", "Launch", "Ignite"],
  reaction: ["Block", "Dodge", "Parry", "Deflect", "Resist", "Endure", "Adapt", "Counter", "Reflect", "Absorb", "Negate", "Nullify", "Withstand", "Repel", "Brace"],
  combat: ["Slash", "Thrust", "Smash", "Crush", "Pierce", "Rend", "Cleave", "Hack", "Pummel", "Shatter", "Impale", "Lacerate", "Decimate", "Obliterate", "Annihilate"],
  event: ["Uprising", "Discovery", "Betrayal", "Alliance", "Ambush", "Revelation", "Crisis", "Miracle", "Catastrophe", "Convergence", "Divergence", "Eclipse", "Dawn", "Twilight", "Storm"],
  item: ["Amulet", "Ring", "Gauntlet", "Helm", "Cape", "Orb", "Scepter", "Tome", "Relic", "Crystal", "Pendant", "Bracer", "Visor", "Core", "Module"],
};
const FILL_MODIFIERS = ["of Power", "of Speed", "of Wisdom", "of Fury", "of Shadow", "of Light", "of Chaos", "of Order", "of the Void", "of the Storm", "of the Deep", "of the Heights", "of the Ancients", "of the Fallen", "of the Risen"];

let fillIdx = 0;
while (allCards.length < 3000) {
  // Find the season with fewest cards
  const sc = { "Season 1": 0, "Season 2": 0, "Season 3": 0 };
  for (const c of allCards) { if (sc[c.season] !== undefined) sc[c.season]++; }
  const season = Object.entries(sc).sort((a, b) => a[1] - b[1])[0][0];
  
  const cardType = pick(FILL_CARD_TYPES);
  const names = FILL_NAMES_BY_TYPE[cardType];
  const baseName = names[fillIdx % names.length];
  const modifier = FILL_MODIFIERS[Math.floor(fillIdx / names.length) % FILL_MODIFIERS.length];
  const name = `${baseName} ${modifier}`;
  const rarity = pickWeighted(RARITIES_WEIGHTED);
  
  allCards.push({
    cardId: makeCardId("fill", `${name}-${season}-${fillIdx}`),
    name: `${name} (${season.replace("Season ", "S")})`,
    cardType,
    rarity,
    alignment: pickAlignment(),
    element: pickElement(),
    dimension: pickDimension(),
    characterClass: "none",
    species: "unknown",
    faction: null,
    cost: rarity === "epic" ? 4 : rarity === "rare" ? 3 : rarity === "uncommon" ? 2 : 1,
    power: cardType === "combat" ? randInt(1, 4) : 0,
    health: 0,
    abilityText: `${baseName} effect: ${cardType === "action" ? "Perform a tactical action" : cardType === "reaction" ? "React to an opponent's move" : cardType === "combat" ? "Deal combat damage" : cardType === "event" ? "A saga event unfolds" : "Equip to enhance a character"} ${modifier.toLowerCase()}.`,
    flavorText: "",
    imageUrl: null,
    loredexEntryId: null,
    album: null,
    era: season === "Season 1" ? "Age of Privacy" : season === "Season 2" ? "Age of Revelation" : "Fall of Reality",
    season,
    disciplines: null,
    keywords: JSON.stringify([cardType, baseName.toLowerCase()]),
    unlockMethod: "starter",
    unlockCondition: null,
    isActive: true,
  });
  fillIdx++;
}

// Final count
const finalCounts = { "Season 1": 0, "Season 2": 0, "Season 3": 0 };
for (const c of allCards) { if (finalCounts[c.season] !== undefined) finalCounts[c.season]++; }
console.log(`\nTotal cards: ${allCards.length}`);
console.log("Final season distribution:", finalCounts);

// Count by type
const typeCounts = {};
for (const c of allCards) { typeCounts[c.cardType] = (typeCounts[c.cardType] || 0) + 1; }
console.log("Card type distribution:", typeCounts);

// Count by rarity
const rarityCounts = {};
for (const c of allCards) { rarityCounts[c.rarity] = (rarityCounts[c.rarity] || 0) + 1; }
console.log("Rarity distribution:", rarityCounts);

// ═══════════════════════════════════════════════════════
// DATABASE INSERTION
// ═══════════════════════════════════════════════════════

const conn = await mysql.createConnection(DATABASE_URL);

// Clear existing cards
await conn.execute("DELETE FROM user_cards");
await conn.execute("DELETE FROM cards");
console.log("\nCleared existing cards.");

// Insert in batches of 100
const BATCH_SIZE = 100;
let inserted = 0;

for (let i = 0; i < allCards.length; i += BATCH_SIZE) {
  const batch = allCards.slice(i, i + BATCH_SIZE);
  const placeholders = batch.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(",");
  const values = batch.flatMap(c => [
    c.cardId, c.name, c.cardType, c.rarity, c.alignment, c.element, c.dimension,
    c.characterClass, c.species, c.faction, c.cost, c.power, c.health,
    c.abilityText, c.flavorText || '', c.imageUrl, c.loredexEntryId, c.album, c.era,
    c.season, c.unlockMethod,
  ]);
  
  await conn.execute(
    `INSERT INTO cards (cardId, name, cardType, rarity, alignment, element, dimension, characterClass, species, faction, cost, power, health, abilityText, flavorText, imageUrl, loredexEntryId, album, era, season, unlockMethod) VALUES ${placeholders}`,
    values
  );
  inserted += batch.length;
  if (inserted % 500 === 0) console.log(`Inserted ${inserted}/${allCards.length}...`);
}

console.log(`\nDone! Inserted ${inserted} cards total.`);

// Verify
const [rows] = await conn.execute("SELECT COUNT(*) as cnt FROM cards");
console.log(`Database card count: ${rows[0].cnt}`);

const [seasonRows] = await conn.execute("SELECT season, COUNT(*) as cnt FROM cards GROUP BY season ORDER BY season");
console.log("DB season distribution:", seasonRows);

const [typeRows] = await conn.execute("SELECT cardType, COUNT(*) as cnt FROM cards GROUP BY cardType ORDER BY cnt DESC");
console.log("DB type distribution:", typeRows);

const [rarityRows] = await conn.execute("SELECT rarity, COUNT(*) as cnt FROM cards GROUP BY rarity ORDER BY cnt DESC");
console.log("DB rarity distribution:", rarityRows);

await conn.end();
