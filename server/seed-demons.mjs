/**
 * Hierarchy of the Damned - 10 Demon Leader Cards
 * Corporate structure: CEO, CFO, COO, 4 SVPs, 3 Directors
 * Each mirrors an Archon and opposes a Neyon
 */
import "dotenv/config";
import mysql from "mysql2/promise";
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const DEMON_CARDS = [
  // ═══ C-SUITE ═══
  {
    cardId: "demon-molgrath-ceo-0001",
    name: "Mol'Garath the Unmaker",
    cardType: "character",
    rarity: "mythic",
    alignment: "chaos",
    element: "fire",
    dimension: "reality",
    characterClass: "none",
    species: "unknown",
    faction: "Hierarchy of the Damned",
    cost: 10,
    power: 12,
    health: 14,
    abilityText: "HOSTILE ACQUISITION: When Mol'Garath enters play, destroy all non-Hierarchy characters with power 3 or less. CORPORATE RESTRUCTURING: Once per turn, sacrifice a Hierarchy character to gain control of target enemy character permanently. SHADOW OF CREATION: Cannot be targeted by abilities that cost less than 5 energy.",
    flavorText: "\"I am the shadow cast by the act of creation itself. I was here before the first light, and I will remain after the last star dies.\"",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/0_KK3lTZ00ffv1BTdSOZL3RN_1773778345196_na1fn_L2hvbWUvdWJ1bnR1L21vbGdhcmF0aF9wb3J0cmFpdA_96678e3f.png",
    loredexEntryId: "entity_91",
    era: "Pre-Creation",
    season: null,
    disciplines: ["Entropy Manipulation", "Reality Unmaking", "Corporate Dominion"],
    keywords: ["demon", "ceo", "hierarchy", "unmaker", "boss"],
    unlockMethod: "fight",
    unlockCondition: { type: "defeat_boss", bossId: "molgrath", difficulty: "mythic" },
  },
  {
    cardId: "demon-xethraal-cfo-0002",
    name: "Xeth'Raal the Debt Collector",
    cardType: "character",
    rarity: "mythic",
    alignment: "chaos",
    element: "earth",
    dimension: "probability",
    characterClass: "none",
    species: "unknown",
    faction: "Hierarchy of the Damned",
    cost: 9,
    power: 8,
    health: 10,
    abilityText: "COMPOUND INTEREST: At the start of each turn, each opponent loses 1 health for each card they played last turn. SOUL LEDGER: When an enemy character is defeated, draw 2 cards. DEBT COLLECTION: Pay 4 energy to force an opponent to discard their highest-cost card.",
    flavorText: "\"Every whispered prayer, every broken promise — it's all recorded in the Ledger. And I always collect.\"",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/1_3OnVmL0nyyr5XrSWZQS6NC_1773778352306_na1fn_L2hvbWUvdWJ1bnR1L3hldGhfcmFhbF9wb3J0cmFpdA_2ce91495.png",
    loredexEntryId: "entity_92",
    era: "Late Empire",
    season: null,
    disciplines: ["Soul Economics", "Contract Binding", "Debt Enforcement"],
    keywords: ["demon", "cfo", "hierarchy", "debt", "collector"],
    unlockMethod: "fight",
    unlockCondition: { type: "defeat_boss", bossId: "xethraal", difficulty: "legendary" },
  },
  {
    cardId: "demon-vexahlia-coo-0003",
    name: "Vex'Ahlia the Taskmaster",
    cardType: "character",
    rarity: "mythic",
    alignment: "chaos",
    element: "fire",
    dimension: "space",
    characterClass: "soldier",
    species: "unknown",
    faction: "Hierarchy of the Damned",
    cost: 9,
    power: 11,
    health: 9,
    abilityText: "SIX-ARMED ASSAULT: Attacks all enemy characters simultaneously. OPERATIONAL EFFICIENCY: All Hierarchy characters you control gain +1 power. SIEGE COMMANDER: When Vex'Ahlia attacks, she deals 2 damage to the enemy player directly.",
    flavorText: "\"The Architect organized his empire with code. I organize mine with screams.\"",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/2_aAZuZESUeOqHrqUN21IHeO_1773778340218_na1fn_L2hvbWUvdWJ1bnR1L3ZleF9haGxpYV9wb3J0cmFpdA_c892f37b.png",
    loredexEntryId: "entity_93",
    era: "Late Empire",
    season: null,
    disciplines: ["Multi-Armed Combat", "Legion Command", "Siege Warfare"],
    keywords: ["demon", "coo", "hierarchy", "warrior", "queen"],
    unlockMethod: "fight",
    unlockCondition: { type: "defeat_boss", bossId: "vexahlia", difficulty: "legendary" },
  },

  // ═══ SENIOR VICE PRESIDENTS ═══
  {
    cardId: "demon-draelmon-svp-0004",
    name: "Drael'Mon the Harvester",
    cardType: "character",
    rarity: "legendary",
    alignment: "chaos",
    element: "earth",
    dimension: "space",
    characterClass: "none",
    species: "unknown",
    faction: "Hierarchy of the Damned",
    cost: 8,
    power: 10,
    health: 8,
    abilityText: "WORLD EATER: When Drael'Mon defeats a character, gain +2 power permanently. THOUSAND MOUTHS: Deal 1 damage to all enemy characters at the start of your turn. DIMENSIONAL HARVEST: Destroy target location card and draw 3 cards.",
    flavorText: "\"The Collector preserves. I consume. We are two sides of the same hunger.\"",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/3_HIV067cxcQl9kwSL8YAUmZ_1773778352451_na1fn_L2hvbWUvdWJ1bnR1L2RyYWVsX21vbl9wb3J0cmFpdA_0cf33974.png",
    loredexEntryId: "entity_94",
    era: "Late Empire",
    season: null,
    disciplines: ["Dimensional Consumption", "Reality Feeding", "Mass Destruction"],
    keywords: ["demon", "svp", "hierarchy", "harvester", "acquisitions"],
    unlockMethod: "fight",
    unlockCondition: { type: "defeat_boss", bossId: "draelmon", difficulty: "epic" },
  },
  {
    cardId: "demon-shadow-tongue-svp-0005",
    name: "The Shadow Tongue",
    cardType: "character",
    rarity: "legendary",
    alignment: "chaos",
    element: "air",
    dimension: "probability",
    characterClass: "spy",
    species: "unknown",
    faction: "Hierarchy of the Damned",
    cost: 7,
    power: 6,
    health: 8,
    abilityText: "LINGUISTIC CORRUPTION: Take control of target character with power 4 or less until end of turn. REWRITE SCRIPTURE: Negate target event card. PROPAGANDA WAVE: All enemy characters lose 1 power until end of turn.",
    flavorText: "\"I am not a weapon. I am an idea — and ideas cannot be killed.\"",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/4_pD08Ury2oUpL3sKzjKwe4b_1773778376183_na1fn_L2hvbWUvdWJ1bnR1L3RoZV9zaGFkb3dfdG9uZ3Vl_8ef13dc3.png",
    loredexEntryId: "entity_7",
    era: "Late Empire",
    season: null,
    disciplines: ["Language Corruption", "Cultural Subversion", "Mind Control"],
    keywords: ["demon", "svp", "hierarchy", "propaganda", "communications"],
    unlockMethod: "story",
    unlockCondition: { type: "complete_game", gameId: "the-severance" },
  },
  {
    cardId: "demon-nykoth-svp-0006",
    name: "Ny'Koth the Flayer",
    cardType: "character",
    rarity: "legendary",
    alignment: "chaos",
    element: "water",
    dimension: "time",
    characterClass: "oracle",
    species: "unknown",
    faction: "Hierarchy of the Damned",
    cost: 8,
    power: 7,
    health: 9,
    abilityText: "DIMENSIONAL VIVISECTION: Look at target player's hand. Choose and discard 2 cards. THOUGHT VIRUS TEMPLATE: Place a Virus counter on target character. Characters with Virus counters deal 1 damage to their controller at the start of each turn. R&D BREAKTHROUGH: Draw 3 cards, then discard 1.",
    flavorText: "\"The Necromancer studies death. I study the spaces between dimensions where even death fears to tread.\"",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/5_7yZoLkIQZzpQYeFXB1y6sZ_1773778344979_na1fn_L2hvbWUvdWJ1bnR1L255X2tvdGhfdGhlX2ZsYXllcg_cb0ec125.png",
    loredexEntryId: "entity_95",
    era: "Late Empire",
    season: null,
    disciplines: ["Dimensional Surgery", "Thought Virus Engineering", "Forbidden Research"],
    keywords: ["demon", "svp", "hierarchy", "scientist", "the-ninth"],
    unlockMethod: "fight",
    unlockCondition: { type: "defeat_boss", bossId: "nykoth", difficulty: "epic" },
  },
  {
    cardId: "demon-sylvex-svp-0007",
    name: "Syl'Vex the Corruptor",
    cardType: "character",
    rarity: "legendary",
    alignment: "chaos",
    element: "air",
    dimension: "probability",
    characterClass: "spy",
    species: "unknown",
    faction: "Hierarchy of the Damned",
    cost: 7,
    power: 5,
    health: 7,
    abilityText: "THE BEAUTIFUL LIE: Take permanent control of target character with power less than Syl'Vex's power. EMPOWERMENT: Target character gains +3 power but switches to your control at end of turn. SOUL RECRUITMENT: When an enemy character is defeated, you may add a copy to your hand.",
    flavorText: "\"I don't take souls. I show them what they truly want — and they give themselves to me willingly.\"",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/6_d6GWqZP6Po0UuqtR3n4LeV_1773778361362_na1fn_L2hvbWUvdWJ1bnR1L3N5bHZleF9wb3J0cmFpdA_8a00948a.png",
    loredexEntryId: "entity_96",
    era: "Late Empire",
    season: null,
    disciplines: ["Soul Seduction", "Empathic Manipulation", "Identity Theft"],
    keywords: ["demon", "svp", "hierarchy", "recruiter", "hr"],
    unlockMethod: "story",
    unlockCondition: { type: "complete_game", gameId: "advocates-war" },
  },

  // ═══ DIRECTORS ═══
  {
    cardId: "demon-varkul-dir-0008",
    name: "Varkul the Blood Lord",
    cardType: "character",
    rarity: "epic",
    alignment: "chaos",
    element: "water",
    dimension: "reality",
    characterClass: "soldier",
    species: "unknown",
    faction: "Hierarchy of the Damned",
    cost: 6,
    power: 7,
    health: 8,
    abilityText: "BLOOD DRAIN: When Varkul deals damage to a character, heal for the same amount. CATHEDRAL OF CODE: Varkul cannot be targeted while you control another Hierarchy character. UNDEAD LEGION: Summon two 2/2 Undead tokens.",
    flavorText: "\"The gates must be guarded from both sides. I keep the enemies out — and our forces in.\"",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/7_SgDz0eYxp1DNdF8afBzZI3_1773778358328_na1fn_L2hvbWUvdWJ1bnR1L3Zhcmt1bF90aGVfYmxvb2RfbG9yZA_191fcbe9.png",
    loredexEntryId: "entity_82",
    era: "Late Empire",
    season: null,
    disciplines: ["Blood Magic", "Undead Command", "Gate Guarding"],
    keywords: ["demon", "director", "hierarchy", "vampire", "security"],
    unlockMethod: "fight",
    unlockCondition: { type: "defeat_boss", bossId: "varkul", difficulty: "rare" },
  },
  {
    cardId: "demon-fenra-dir-0009",
    name: "Fenra the Moon Tyrant",
    cardType: "character",
    rarity: "epic",
    alignment: "chaos",
    element: "earth",
    dimension: "space",
    characterClass: "soldier",
    species: "unknown",
    faction: "Hierarchy of the Damned",
    cost: 6,
    power: 8,
    health: 6,
    abilityText: "LOGISTICS MASTERY: Reduce the cost of all Hierarchy characters by 1. CURSED FOREST: Place a Forest token on the field. Enemy characters entering combat lose 1 power. PACK TACTICS: +2 power when attacking alongside another Hierarchy character.",
    flavorText: "\"Seventeen dimensions. Simultaneously. On schedule and under budget.\"",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/8_staPlo1Y4RQgwzCiXLyW3n_1773778357981_na1fn_L2hvbWUvdWJ1bnR1L2ZlbnJhX3RoZV9tb29uX3R5cmFudA_a01cff8b.png",
    loredexEntryId: "entity_83",
    era: "Late Empire",
    season: null,
    disciplines: ["Logistics Mastery", "Lycanthropic Fury", "Pack Command"],
    keywords: ["demon", "director", "hierarchy", "werewolf", "operations"],
    unlockMethod: "fight",
    unlockCondition: { type: "defeat_boss", bossId: "fenra", difficulty: "rare" },
  },
  {
    cardId: "demon-ithrael-dir-0010",
    name: "Ith'Rael the Whisperer",
    cardType: "character",
    rarity: "legendary",
    alignment: "chaos",
    element: "air",
    dimension: "time",
    characterClass: "spy",
    species: "unknown",
    faction: "Hierarchy of the Damned",
    cost: 7,
    power: 4,
    health: 6,
    abilityText: "MASTER OF RYLLOH: Look at target player's hand and rearrange their deck's top 5 cards. THE SEVERANCE PROTOCOL: Once per game, destroy all location and event cards on the field. WHISPER CAMPAIGN: Target character cannot use abilities next turn.",
    flavorText: "\"The Severance was not an accident. It was my special project — centuries in the making.\"",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/9_YGH9kZqz4xBukeKgJhfNNM_1773778350345_na1fn_L2hvbWUvdWJ1bnR1L2l0aF9yYWVsX3BvcnRyYWl0_7d33a51f.png",
    loredexEntryId: "entity_97",
    era: "Pre-Creation",
    season: null,
    disciplines: ["Espionage", "Long-Term Manipulation", "Dimensional Infiltration"],
    keywords: ["demon", "director", "hierarchy", "spymaster", "rylloh"],
    unlockMethod: "story",
    unlockCondition: { type: "complete_game", gameId: "master-of-rylloh" },
  },
];

async function seedDemonCards() {
  const conn = await mysql.createConnection(DATABASE_URL);
  console.log("Connected to database");

  // Check which cards already exist
  const [existing] = await conn.execute(
    `SELECT cardId FROM cards WHERE cardId LIKE 'demon-%'`
  );
  const existingIds = new Set(existing.map(r => r.cardId));
  console.log(`Found ${existingIds.size} existing demon cards`);

  const toInsert = DEMON_CARDS.filter(c => !existingIds.has(c.cardId));
  if (toInsert.length === 0) {
    console.log("All demon cards already exist!");
    await conn.end();
    return;
  }

  console.log(`Inserting ${toInsert.length} new demon cards...`);

  const values = [];
  const placeholders = toInsert.map(c => {
    values.push(
      c.cardId, c.name, c.cardType, c.rarity, c.alignment, c.element, c.dimension,
      c.characterClass, c.species, c.faction, c.cost, c.power, c.health,
      c.abilityText, c.flavorText, c.imageUrl, c.loredexEntryId,
      null, // album
      c.era, c.season,
      JSON.stringify(c.disciplines), JSON.stringify(c.keywords),
      c.unlockMethod, JSON.stringify(c.unlockCondition), 1
    );
    return `(${Array(25).fill("?").join(",")})`;
  }).join(",");

  await conn.execute(
    `INSERT INTO cards (cardId, name, cardType, rarity, alignment, element, dimension, characterClass, species, faction, cost, power, health, abilityText, flavorText, imageUrl, loredexEntryId, album, era, season, disciplines, keywords, unlockMethod, unlockCondition, isActive) VALUES ${placeholders}`,
    values
  );

  console.log(`✅ Successfully seeded ${toInsert.length} demon cards!`);
  await conn.end();
}

seedDemonCards().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
