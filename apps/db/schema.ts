import { bigint, boolean, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar, uniqueIndex, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "moderator", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  deletedAt: timestamp("deletedAt"),
}, (table) => ({
  createdAtIdx: index("idx_users_created_at").on(table.createdAt),
  lastSignedInIdx: index("idx_users_last_signed_in").on(table.lastSignedIn),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/* ═══════════════════════════════════════════════════════
   GAMIFICATION — Achievements, Progress, Ark Themes
   Designed franchise-agnostic: franchiseId scopes all data
   ═══════════════════════════════════════════════════════ */

/**
 * User progress: XP, level, points, game state.
 * One row per user per franchise.
 */
export const userProgress = mysqlTable("user_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  franchiseId: varchar("franchiseId", { length: 64 }).notNull().default("dischordian-saga"),
  xp: int("xp").notNull().default(0),
  level: int("level").notNull().default(1),
  points: int("points").notNull().default(0),
  title: varchar("title", { length: 128 }).default("Recruit"),
  /** JSON blob: discovered entries, watched episodes, fight wins, etc. */
  progressData: json("progressData").$type<Record<string, unknown>>(),
  /** JSON blob: unlocked fighters, game save state */
  gameData: json("gameData").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_user_progress_user_id").on(table.userId),
}));

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

/**
 * Achievement definitions — franchise-scoped.
 * Seeded at app start, not user-created.
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  achievementId: varchar("achievementId", { length: 128 }).notNull().unique(),
  franchiseId: varchar("franchiseId", { length: 64 }).notNull().default("dischordian-saga"),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 32 }).notNull().default("trophy"),
  category: varchar("category", { length: 64 }).notNull(),
  tier: mysqlEnum("tier", ["bronze", "silver", "gold", "platinum", "legendary"]).default("bronze").notNull(),
  xpReward: int("xpReward").notNull().default(50),
  pointsReward: int("pointsReward").notNull().default(100),
  /** JSON condition: { type: "discover_entries", count: 10 } */
  condition: json("condition").$type<Record<string, unknown>>(),
  hidden: int("hidden").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;

/**
 * User-earned achievements — junction table.
 */
export const userAchievements = mysqlTable("user_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementId: varchar("achievementId", { length: 128 }).notNull(),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_user_achievements_user_id").on(table.userId),
}));

export type UserAchievement = typeof userAchievements.$inferSelect;

/**
 * Ark themes — user's chosen console appearance.
 * One active theme per user.
 */
export const arkThemes = mysqlTable("ark_themes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  themeId: varchar("themeId", { length: 64 }).notNull().default("default"),
  /** JSON blob: custom colors, background, accent, etc. */
  customization: json("customization").$type<Record<string, unknown>>(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_ark_themes_user_id").on(table.userId),
}));

export type ArkTheme = typeof arkThemes.$inferSelect;

/* ═══════════════════════════════════════════════════════
   CARD GAME — Dischordian Saga TCG
   Based on VTES mechanics adapted for the universe
   ═══════════════════════════════════════════════════════ */

/**
 * Card definitions — the master card database.
 * Every character, event, item, location, song becomes a card.
 */
export const cards = mysqlTable("cards", {
  id: int("id").autoincrement().primaryKey(),
  cardId: varchar("cardId", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  /** Card type determines gameplay role */
  cardType: mysqlEnum("cardType", [
    "character", "event", "item", "location", "action",
    "reaction", "combat", "political", "master", "song"
  ]).notNull(),
  /** Rarity tier */
  rarity: mysqlEnum("rarity", [
    "common", "uncommon", "rare", "epic", "legendary", "mythic", "neyon"
  ]).notNull().default("common"),
  /** Alignment */
  alignment: mysqlEnum("alignment", ["order", "chaos"]).default("order"),
  /** Fundamental element */
  element: mysqlEnum("element", ["earth", "fire", "water", "air"]).default("earth"),
  /** Dimensional affinity */
  dimension: mysqlEnum("dimension", ["space", "time", "probability", "reality"]).default("space"),
  /** Class (for character cards) */
  characterClass: mysqlEnum("characterClass", [
    "spy", "oracle", "assassin", "engineer", "soldier", "neyon", "none"
  ]).default("none"),
  /** Species (for character cards) */
  species: mysqlEnum("species", ["demagi", "quarchon", "neyon", "human", "synthetic", "unknown"]).default("unknown"),
  /** Faction affiliation */
  faction: varchar("faction", { length: 128 }),
  /** Card cost to play (blood/energy equivalent) */
  cost: int("cost").notNull().default(0),
  /** Power/capacity for characters */
  power: int("power").notNull().default(0),
  /** Health/blood capacity */
  health: int("health").notNull().default(0),
  /** Card text / ability description */
  abilityText: text("abilityText"),
  /** Flavor text / lore quote */
  flavorText: text("flavorText"),
  /** Card image URL */
  imageUrl: text("imageUrl"),
  /** Reference to loredex entry ID */
  loredexEntryId: varchar("loredexEntryId", { length: 128 }),
  /** Album name for song cards */
  album: varchar("album", { length: 256 }),
  /** Era in the timeline */
  era: varchar("era", { length: 128 }),
  /** Season */
  season: varchar("season", { length: 64 }),
  /** NFT token ID if linked to an NFT */
  nftTokenId: varchar("nftTokenId", { length: 128 }),
  /** NFT perks JSON */
  nftPerks: json("nftPerks").$type<Record<string, unknown>>(),
  /** Disciplines/abilities JSON array */
  disciplines: json("disciplines").$type<string[]>(),
  /** Keywords for game mechanics */
  keywords: json("keywords").$type<string[]>(),
  /** How to unlock this card */
  unlockMethod: mysqlEnum("unlockMethod", [
    "starter", "story", "achievement", "trade", "fight", "exploration",
    "purchase", "event", "nft", "admin"
  ]).default("starter"),
  /** Unlock condition JSON */
  unlockCondition: json("unlockCondition").$type<Record<string, unknown>>(),
  /** Is this card currently available */
  isActive: int("isActive").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Card = typeof cards.$inferSelect;
export type InsertCard = typeof cards.$inferInsert;

/**
 * User card collection — which cards each user owns.
 */
export const userCards = mysqlTable("user_cards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cardId: varchar("cardId", { length: 128 }).notNull(),
  /** Number of copies owned */
  quantity: int("quantity").notNull().default(1),
  /** Is this card foil/special edition */
  isFoil: int("isFoil").notNull().default(0),
  /** Card condition/level (can be upgraded) */
  cardLevel: int("cardLevel").notNull().default(1),
  /** How was this card obtained */
  obtainedVia: varchar("obtainedVia", { length: 64 }).default("starter"),
  obtainedAt: timestamp("obtainedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_user_cards_user_id").on(table.userId),
}));

export type UserCard = typeof userCards.$inferSelect;

/**
 * Deck definitions — user-created decks for the card game.
 */
export const decks = mysqlTable("decks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  /** Deck type: crypt (characters) or library (actions/events/items) */
  deckType: mysqlEnum("deckType", ["crypt", "library", "combined"]).default("combined"),
  /** JSON array of { cardId, quantity } */
  cardList: json("cardList").$type<Array<{ cardId: string; quantity: number }>>(),
  isActive: int("isActive").notNull().default(1),
  wins: int("wins").notNull().default(0),
  losses: int("losses").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_decks_user_id").on(table.userId),
}));

export type Deck = typeof decks.$inferSelect;

/**
 * Card game matches — game history and state.
 */
export const cardGameMatches = mysqlTable("card_game_matches", {
  id: int("id").autoincrement().primaryKey(),
  /** Player 1 */
  player1Id: int("player1Id").notNull(),
  /** Player 2 (0 = AI opponent) */
  player2Id: int("player2Id").notNull().default(0),
  /** Winner */
  winnerId: int("winnerId"),
  /** Match status */
  status: mysqlEnum("status", ["waiting", "active", "completed", "abandoned"]).default("waiting"),
  /** Full game state JSON */
  gameState: json("gameState").$type<Record<string, unknown>>(),
  /** Match result summary */
  result: json("result").$type<Record<string, unknown>>(),
  /** Victory points earned */
  vpEarned: int("vpEarned").notNull().default(0),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  endedAt: timestamp("endedAt"),
});

export type CardGameMatch = typeof cardGameMatches.$inferSelect;

/* ═══════════════════════════════════════════════════════
   CHARACTER SHEETS — User RPG profiles
   ═══════════════════════════════════════════════════════ */

/**
 * Character sheets — RPG-style profiles for each user.
 */
export const characterSheets = mysqlTable("character_sheets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  characterName: varchar("characterName", { length: 256 }).notNull(),
  species: mysqlEnum("species", ["demagi", "quarchon", "neyon", "human", "synthetic"]).default("human"),
  characterClass: mysqlEnum("characterClass", [
    "spy", "oracle", "assassin", "engineer", "soldier"
  ]).notNull().default("soldier"),
  alignment: mysqlEnum("alignment", ["order", "chaos"]).default("order"),
  element: mysqlEnum("element", ["earth", "fire", "water", "air"]).default("earth"),
  dimension: mysqlEnum("dimension", ["space", "time", "probability", "reality"]).default("space"),
  /** Stats */
  strength: int("strength").notNull().default(5),
  intelligence: int("intelligence").notNull().default(5),
  agility: int("agility").notNull().default(5),
  charisma: int("charisma").notNull().default(5),
  perception: int("perception").notNull().default(5),
  willpower: int("willpower").notNull().default(5),
  /** Resources */
  influence: int("influence").notNull().default(30),
  energy: int("energy").notNull().default(10),
  credits: int("credits").notNull().default(1000),
  /** Morality score: -100 (Machine) to +100 (Humanity) */
  moralityScore: int("moralityScore").notNull().default(0),
  /** Active ship theme ID (from morality unlockables) */
  activeShipTheme: varchar("activeShipTheme", { length: 128 }),
  /** Active character theme ID (from morality unlockables) */
  activeCharacterTheme: varchar("activeCharacterTheme", { length: 128 }),
  /** Avatar/portrait URL */
  avatarUrl: text("avatarUrl"),
  /** Equipped items JSON */
  equipment: json("equipment").$type<Record<string, unknown>>(),
  /** Unlocked abilities */
  abilities: json("abilities").$type<string[]>(),
  /** Prestige tier: 0 = never prestiged, 1-7 = prestige level */
  prestigeTier: int("prestigeTier").notNull().default(0),
  /** Prestige state JSON (history, lifetime stats) */
  prestigeState: json("prestigeState").$type<{
    totalPrestiges: number;
    lifetimeXp: number;
    lifetimeResources: { dream: number; salvage: number; voidCrystals: number };
    prestigeHistory: { level: number; date: string; playerLevel: number }[];
  }>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp("deletedAt"),
}, (table) => ({
  userIdIdx: index("idx_character_sheets_user_id").on(table.userId),
}));
export type CharacterSheet = typeof characterSheets.$inferSelect;;

/* ═══════════════════════════════════════════════════════
   INCEPTION ARK — Explorable ship map
   ═══════════════════════════════════════════════════════ */

/**
 * Ark rooms — areas within the Inception Ark.
 */
export const arkRooms = mysqlTable("ark_rooms", {
  id: int("id").autoincrement().primaryKey(),
  roomId: varchar("roomId", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  /** Room type */
  roomType: mysqlEnum("roomType", [
    "bridge", "quarters", "armory", "lab", "hangar", "medbay",
    "cargo", "engine", "observation", "trophy", "training",
    "market", "comms", "brig", "secret", "tradewars"
  ]).notNull(),
  /** Position on the map grid */
  gridX: int("gridX").notNull().default(0),
  gridY: int("gridY").notNull().default(0),
  /** Deck/floor level */
  deckLevel: int("deckLevel").notNull().default(1),
  /** Is this room locked by default */
  isLocked: int("isLocked").notNull().default(1),
  /** Unlock requirement JSON */
  unlockRequirement: json("unlockRequirement").$type<Record<string, unknown>>(),
  /** Connected room IDs */
  connections: json("connections").$type<string[]>(),
  /** Room image/background URL */
  imageUrl: text("imageUrl"),
  /** Features available in this room */
  features: json("features").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ArkRoom = typeof arkRooms.$inferSelect;

/**
 * User ark progress — which rooms are unlocked.
 */
export const userArkProgress = mysqlTable("user_ark_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  roomId: varchar("roomId", { length: 128 }).notNull(),
  isUnlocked: int("isUnlocked").notNull().default(0),
  /** Times visited */
  visitCount: int("visitCount").notNull().default(0),
  /** Room-specific state JSON */
  roomState: json("roomState").$type<Record<string, unknown>>(),
  firstVisitedAt: timestamp("firstVisitedAt"),
  lastVisitedAt: timestamp("lastVisitedAt"),
}, (table) => ({
  userIdIdx: index("idx_user_ark_progress_user_id").on(table.userId),
}));

export type UserArkProgress = typeof userArkProgress.$inferSelect;

/**
 * Trophy room displays — user's card display configurations.
 */
export const trophyDisplays = mysqlTable("trophy_displays", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  displayName: varchar("displayName", { length: 256 }).notNull(),
  /** Display theme */
  theme: mysqlEnum("theme", [
    "panopticon", "insurgency", "babylon", "ark", "void",
    "crystal", "neon", "ancient", "digital", "custom"
  ]).default("ark"),
  /** Cards displayed JSON array of cardIds */
  displayedCards: json("displayedCards").$type<string[]>(),
  /** Layout configuration */
  layout: json("layout").$type<Record<string, unknown>>(),
  isPublic: int("isPublic").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trophy_displays_user_id").on(table.userId),
}));

export type TrophyDisplay = typeof trophyDisplays.$inferSelect;

/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE — Space trading/combat game
   Based on Trade Empire 2002 BBS mechanics
   ═══════════════════════════════════════════════════════ */

/**
 * Trade Empire sectors — the galaxy map.
 */
export const twSectors = mysqlTable("tw_sectors", {
  id: int("id").autoincrement().primaryKey(),
  sectorId: int("sectorId").notNull().unique(),
  name: varchar("name", { length: 256 }),
  /** Sector type */
  sectorType: mysqlEnum("sectorType", [
    "empty", "port", "planet", "nebula", "asteroid",
    "station", "wormhole", "hazard", "stardock"
  ]).default("empty"),
  /** Connected sector IDs (warps) */
  warps: json("warps").$type<number[]>(),
  /** Is this sector discovered by default */
  isDiscovered: int("isDiscovered").notNull().default(0),
  /** Sector data JSON (port prices, planet info, etc.) */
  sectorData: json("sectorData").$type<Record<string, unknown>>(),
  /** Lore connection */
  loreLocationId: varchar("loreLocationId", { length: 128 }),
});

export type TWSector = typeof twSectors.$inferSelect;

/**
 * Trade Empire player state — ship, inventory, position.
 */
export const twPlayerState = mysqlTable("tw_player_state", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Current sector */
  currentSector: int("currentSector").notNull().default(1),
  /** Ship type */
  shipType: varchar("shipType", { length: 128 }).notNull().default("scout"),
  /** Resources */
  credits: int("credits").notNull().default(5000),
  fuelOre: int("fuelOre").notNull().default(0),
  organics: int("organics").notNull().default(0),
  equipment: int("equipment").notNull().default(0),
  /** Ship stats */
  holds: int("holds").notNull().default(20),
  fighters: int("fighters").notNull().default(0),
  shields: int("shields").notNull().default(100),
  /** Turns remaining today */
  turnsRemaining: int("turnsRemaining").notNull().default(100),
  /** Experience */
  experience: int("experience").notNull().default(0),
  alignment: int("alignment").notNull().default(0),
  /** Discovered sectors JSON */
  discoveredSectors: json("discoveredSectors").$type<number[]>(),
  /** Owned planets JSON */
  ownedPlanets: json("ownedPlanets").$type<number[]>(),
  /** Deployed fighters JSON { sectorId: count } */
  deployedFighters: json("deployedFighters").$type<Record<number, number>>(),
  /** Faction: empire (Architect's faction) or insurgency (Dreamer's faction) */
  faction: mysqlEnum("faction", ["empire", "insurgency"]).default("empire"),
  /** Tutorial step (0 = not started, -1 = completed) */
  tutorialStep: int("tutorialStep").notNull().default(0),
  /** Discovered pre-Fall relics JSON */
  discoveredRelics: json("discoveredRelics").$type<string[]>(),
  /** Research points for Civ-style tech tree */
  researchPoints: int("researchPoints").notNull().default(0),
  /** Unlocked technologies JSON */
  unlockedTech: json("unlockedTech").$type<string[]>(),
  /** Card rewards earned from Trade Empire */
  cardRewards: json("cardRewards").$type<string[]>(),
  lastTurnReset: timestamp("lastTurnReset").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_tw_player_state_user_id").on(table.userId),
}));

export type TWPlayerState = typeof twPlayerState.$inferSelect;

/**
 * Trade Empire colonies — player-owned planet developments.
 */
export const twColonies = mysqlTable("tw_colonies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sectorId: int("sectorId").notNull(),
  planetName: varchar("planetName", { length: 256 }).notNull(),
  /** Colony level (1-5) determines income multiplier */
  level: int("level").notNull().default(1),
  /** Colony type determines what it produces */
  colonyType: mysqlEnum("colonyType", [
    "mining", "agriculture", "technology", "military", "trading"
  ]).default("mining"),
  /** Population (affects production) */
  population: int("population").notNull().default(100),
  /** Defense level (fighters stationed) */
  defense: int("defense").notNull().default(0),
  /** Accumulated uncollected income */
  pendingCredits: int("pendingCredits").notNull().default(0),
  pendingFuelOre: int("pendingFuelOre").notNull().default(0),
  pendingOrganics: int("pendingOrganics").notNull().default(0),
  pendingEquipment: int("pendingEquipment").notNull().default(0),
  /** Last income collection time */
  lastCollected: timestamp("lastCollected").defaultNow().notNull(),
  /** Card bonuses applied JSON */
  cardBonuses: json("cardBonuses").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_tw_colonies_user_id").on(table.userId),
}));

export type TWColony = typeof twColonies.$inferSelect;

/**
 * Trade Empire game log — action history.
 */
export const twGameLog = mysqlTable("tw_game_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 64 }).notNull(),
  details: json("details").$type<Record<string, unknown>>(),
  sectorId: int("sectorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_tw_game_log_user_id").on(table.userId),
}));

/* ═══════════════════════════════════════════════════════
   CARD CRAFTING — Research Lab fusion system
   ═══════════════════════════════════════════════════════ */

/**
 * Crafting log — records every fusion attempt.
 */
export const craftingLog = mysqlTable("crafting_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Recipe type used */
  recipeType: varchar("recipeType", { length: 64 }).notNull(),
  /** Input card IDs JSON */
  inputCards: json("inputCards").$type<Array<{ cardId: string; quantity: number }>>(),
  /** Output card ID */
  outputCardId: varchar("outputCardId", { length: 128 }).notNull(),
  /** Was the craft successful */
  success: int("success").notNull().default(1),
  /** Credits spent */
  creditsCost: int("creditsCost").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_crafting_log_user_id").on(table.userId),
}));

export type CraftingLog = typeof craftingLog.$inferSelect;

/* ═══════════════════════════════════════════════════════
   CITIZEN CHARACTER SYSTEM — White Wolf-style character sheet
   Every player creates one free Citizen. Additional characters unlocked.
   ═══════════════════════════════════════════════════════ */

export const citizenCharacters = mysqlTable("citizen_characters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  /** Species: demagi, quarchon, neyon */
  species: mysqlEnum("species", ["demagi", "quarchon", "neyon"]).notNull(),
  /** Class: engineer, oracle, assassin, soldier, spy */
  characterClass: mysqlEnum("characterClass", ["engineer", "oracle", "assassin", "soldier", "spy"]).notNull(),
  /** Alignment: order, chaos */
  alignment: mysqlEnum("alignment", ["order", "chaos"]).notNull(),
  /** Element (DeMagi) or Dimension (Quarchon) or choice (Ne-Yon) */
  element: mysqlEnum("element", ["earth", "fire", "water", "air", "space", "time", "probability", "reality"]).notNull(),
  /** White Wolf dot ratings 1-5 */
  attrAttack: int("attrAttack").notNull().default(2),
  attrDefense: int("attrDefense").notNull().default(2),
  attrVitality: int("attrVitality").notNull().default(2),
  /** Derived / leveled stats */
  level: int("level").notNull().default(1),
  xp: int("xp").notNull().default(0),
  classLevel: int("classLevel").notNull().default(1),
  /** Current HP derived from vitality + species bonus */
  maxHp: int("maxHp").notNull().default(100),
  /** Armor from species + attribute bonuses */
  armor: int("armor").notNull().default(0),
  /** JSON: equipped gear, inventory, cosmetics */
  gear: json("gear").$type<Record<string, unknown>>(),
  /** JSON: unlocked abilities, element mastery levels */
  abilities: json("abilities").$type<Record<string, unknown>>(),
  /** If species=neyon, which specific Ne-Yon token ID (1-10) this citizen is tied to */
  neyonTokenId: int("neyonTokenId"),
  /** Is this the player's primary (free) citizen? */
  isPrimary: int("isPrimary").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_citizen_characters_user_id").on(table.userId),
}));

export type CitizenCharacter = typeof citizenCharacters.$inferSelect;
export type InsertCitizenCharacter = typeof citizenCharacters.$inferInsert;

/* ═══════════════════════════════════════════════════════
   DREAM RESOURCE ECONOMY
   Soul Bound (boss drops) and Non-Soul Bound (mob drops)
   Used for upgrading Potentials and Phase 3 world-building
   ═══════════════════════════════════════════════════════ */

export const dreamBalance = mysqlTable("dream_balance", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Non-soul-bound Dream (tradeable, from regular mobs) */
  dreamTokens: int("dreamTokens").notNull().default(0),
  /** Soul-bound Dream (non-tradeable, from bosses only) */
  soulBoundDream: int("soulBoundDream").notNull().default(0),
  /** DNA/CODE resource for attribute leveling */
  dnaCode: int("dnaCode").notNull().default(0),
  /** Total Dream ever earned (for milestones) */
  totalDreamEarned: int("totalDreamEarned").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_dream_balance_user_id").on(table.userId),
}));

export type DreamBalance = typeof dreamBalance.$inferSelect;

/* ═══════════════════════════════════════════════════════
   INTERGALACTIC MARKET — In-game store items & purchases
   ═══════════════════════════════════════════════════════ */

export const storeItems = mysqlTable("store_items", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "troop_upgrade", "skill_pack", "cosmetic", "booster",
    "elite_pass", "story_extension", "ship_upgrade", "room_upgrade",
    "dream_pack"
  ]).notNull(),
  /** Price in cents (USD) for real-money items, 0 = in-game currency only */
  priceUsd: int("priceUsd").notNull().default(0),
  /** Price in Dream tokens */
  priceDream: int("priceDream").notNull().default(0),
  /** Price in credits (in-game) */
  priceCredits: int("priceCredits").notNull().default(0),
  /** JSON: item effects, bonuses, contents */
  itemData: json("itemData").$type<Record<string, unknown>>(),
  isActive: int("isActive").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StoreItem = typeof storeItems.$inferSelect;

export const storePurchases = mysqlTable("store_purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  itemId: int("itemId"),
  /** Payment method: credits, dream, stripe */
  paymentMethod: mysqlEnum("paymentMethod", ["credits", "dream", "stripe"]).notNull(),
  /** Stripe checkout session ID */
  stripeSessionId: varchar("stripeSessionId", { length: 256 }),
  /** Stripe payment intent ID — unique when present, for webhook idempotency */
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 256 }),
  /** Product key from our products catalog */
  productKey: varchar("productKey", { length: 128 }),
  /** Quantity purchased */
  quantity: int("quantity").notNull().default(1),
  amount: int("amount").notNull().default(0),
  /** Whether the purchase has been fulfilled (items granted) */
  fulfilled: int("fulfilled").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_store_purchases_user_id").on(table.userId),
  // Task 6.1 — unique index on stripePaymentIntentId so a replayed
  // Stripe webhook cannot create a second fulfillment row. MySQL
  // treats multiple NULLs as non-conflicting, which is what we want
  // for credits/dream purchases that never carry an intent id.
  uqStripeIntent: uniqueIndex("uq_store_purchases_stripe_intent").on(table.stripePaymentIntentId),
}));

export type StorePurchase = typeof storePurchases.$inferSelect;

/**
 * Ship upgrades for Trade Empire — purchased or earned.
 */
export const shipUpgrades = mysqlTable("ship_upgrades", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Upgrade type: hull, engine, weapons, shields, cargo, scanner */
  upgradeType: varchar("upgradeType", { length: 64 }).notNull(),
  /** Current level of this upgrade */
  level: int("level").notNull().default(1),
  /** How it was obtained: purchase, crafting, quest */
  obtainedVia: varchar("obtainedVia", { length: 64 }).default("purchase"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_ship_upgrades_user_id").on(table.userId),
}));

export type ShipUpgrade = typeof shipUpgrades.$inferSelect;

/**
 * Player bases — The Foundation (Phase 3).
 * Each player can build one base on a claimed sector.
 */
export const playerBases = mysqlTable("player_bases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Name of the base */
  baseName: varchar("baseName", { length: 128 }).notNull().default("Outpost Alpha"),
  /** Sector where the base is located */
  sectorId: int("sectorId").notNull(),
  /** Base level (1-10) */
  level: int("level").notNull().default(1),
  /** Resource storage capacity */
  storageCapacity: int("storageCapacity").notNull().default(100),
  /** Current stored resources: ore, organics, equipment, dream */
  storedOre: int("storedOre").notNull().default(0),
  storedOrganics: int("storedOrganics").notNull().default(0),
  storedEquipment: int("storedEquipment").notNull().default(0),
  storedDream: int("storedDream").notNull().default(0),
  /** Defense rating */
  defenseRating: int("defenseRating").notNull().default(10),
  /** Production bonus (percentage) */
  productionBonus: int("productionBonus").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_player_bases_user_id").on(table.userId),
}));

export type PlayerBase = typeof playerBases.$inferSelect;


/* ═══════════════════════════════════════════════════════
   CONTENT PARTICIPATION — Track user engagement with content
   Watching episodes, completing games, solving quizzes → card rewards
   ═══════════════════════════════════════════════════════ */

export const contentParticipation = mysqlTable("content_participation", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Type of content: episode, conexus_game, quiz, song, album */
  contentType: varchar("contentType", { length: 64 }).notNull(),
  /** Unique content identifier (episode ID, game ID, quiz ID) */
  contentId: varchar("contentId", { length: 256 }).notNull(),
  /** Whether the content was completed */
  completed: int("completed").notNull().default(0),
  /** Progress percentage 0-100 */
  progress: int("progress").notNull().default(0),
  /** Whether rewards have been claimed */
  rewardsClaimed: int("rewardsClaimed").notNull().default(0),
  /** JSON: metadata about the participation */
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_content_participation_user_id").on(table.userId),
}));

export type ContentParticipation = typeof contentParticipation.$inferSelect;

/**
 * Content rewards — defines what rewards are given for content completion.
 * Seeded at app start.
 */
export const contentRewards = mysqlTable("content_rewards", {
  id: int("id").autoincrement().primaryKey(),
  /** Content type: episode, conexus_game, quiz, song, album, milestone */
  contentType: varchar("contentType", { length: 64 }).notNull(),
  /** Content identifier pattern (specific ID or "*" for any) */
  contentId: varchar("contentId", { length: 256 }).notNull(),
  /** Reward type: card, dream, xp, booster */
  rewardType: varchar("rewardType", { length: 64 }).notNull(),
  /** Reward value: card ID for cards, amount for dream/xp */
  rewardValue: varchar("rewardValue", { length: 256 }).notNull(),
  /** Quantity of reward */
  quantity: int("quantity").notNull().default(1),
  /** Description of the reward */
  description: text("description"),
  isActive: int("isActive").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContentReward = typeof contentRewards.$inferSelect;

/* ═══════════════════════════════════════════════════════
   PALIMPSEST STATE — Per-user Signal/Noise meter
   One row per user. Matches the shared PalimpsestState shape
   in apps/shared/palimpsest.ts. The history array lives in
   the `history` JSON blob.
   ═══════════════════════════════════════════════════════ */

export const palimpsestState = mysqlTable("palimpsest_state", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  /** Gold ink — truth, remembering. */
  signal: int("signal").notNull().default(0),
  /** Red ink — corruption, editing. */
  noise: int("noise").notNull().default(0),
  /** ISO timestamp of last passive-decay tick. */
  lastDecayAt: timestamp("lastDecayAt").defaultNow().notNull(),
  /** Current broadcast episode (1..13). */
  currentEpisode: int("currentEpisode").notNull().default(1),
  /** Whether the Host's mask has visibly slipped this episode. */
  hostMaskSlipped: int("hostMaskSlipped").notNull().default(0),
  /** JSON array of EpisodeRecord entries from apps/shared/palimpsest.ts. */
  history: json("history").$type<Record<string, unknown>[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_palimpsest_state_user_id").on(table.userId),
}));

export type PalimpsestStateRow = typeof palimpsestState.$inferSelect;
export type InsertPalimpsestState = typeof palimpsestState.$inferInsert;

/* ═══════════════════════════════════════════════════════
   FIGHT LEADERBOARD — Online ranked ladder
   Tracks fight records, ELO ratings, and achievements
   ═══════════════════════════════════════════════════════ */

/**
 * Fight leaderboard — one row per user.
 * Tracks wins, losses, ELO rating, streaks, and stats.
 */
export const fightLeaderboard = mysqlTable("fight_leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  userName: varchar("userName", { length: 256 }),
  /** ELO rating (starts at 1000) */
  elo: int("elo").notNull().default(1000),
  /** Total wins */
  wins: int("wins").notNull().default(0),
  /** Total losses */
  losses: int("losses").notNull().default(0),
  /** Current win streak */
  winStreak: int("winStreak").notNull().default(0),
  /** Best win streak ever */
  bestStreak: int("bestStreak").notNull().default(0),
  /** Total KOs delivered */
  totalKOs: int("totalKOs").notNull().default(0),
  /** Perfect victories (no damage taken) */
  perfectWins: int("perfectWins").notNull().default(0),
  /** Highest combo achieved */
  bestCombo: int("bestCombo").notNull().default(0),
  /** Most used fighter ID */
  mainFighter: varchar("mainFighter", { length: 128 }),
  /** Rank tier: bronze, silver, gold, platinum, diamond, master, grandmaster */
  rankTier: mysqlEnum("rankTier", [
    "bronze", "silver", "gold", "platinum", "diamond", "master", "grandmaster"
  ]).default("bronze").notNull(),
  /** Last fight timestamp */
  lastFightAt: timestamp("lastFightAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FightLeaderboard = typeof fightLeaderboard.$inferSelect;
export type InsertFightLeaderboard = typeof fightLeaderboard.$inferInsert;

/**
 * Fight match history — individual match records.
 */
export const fightMatches = mysqlTable("fight_matches", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Fighter used by player */
  playerFighter: varchar("playerFighter", { length: 128 }).notNull(),
  /** Opponent fighter */
  opponentFighter: varchar("opponentFighter", { length: 128 }).notNull(),
  /** Difficulty played */
  difficulty: varchar("difficulty", { length: 64 }).notNull(),
  /** Arena played in */
  arena: varchar("arena", { length: 128 }).notNull(),
  /** Did the player win */
  won: int("won").notNull().default(0),
  /** Was it a perfect victory */
  perfect: int("perfect").notNull().default(0),
  /** Highest combo in this match */
  bestCombo: int("bestCombo").notNull().default(0),
  /** ELO change from this match */
  eloChange: int("eloChange").notNull().default(0),
  /** Points earned */
  pointsEarned: int("pointsEarned").notNull().default(0),
  playedAt: timestamp("playedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_fight_matches_user_id").on(table.userId),
}));

export type FightMatch = typeof fightMatches.$inferSelect;
export type InsertFightMatch = typeof fightMatches.$inferInsert;


/* ═══════════════════════════════════════════════════════
   PVP CARD BATTLES — Real-time multiplayer matchmaking
   ═══════════════════════════════════════════════════════ */

/**
 * PvP card battle matches — tracks real-time multiplayer games.
 */
export const pvpMatches = mysqlTable("pvp_matches", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique match ID for WebSocket room */
  matchId: varchar("matchId", { length: 64 }).notNull().unique(),
  /** Player 1 user ID */
  player1Id: int("player1Id").notNull(),
  /** Player 2 user ID */
  player2Id: int("player2Id"),
  /** Match status */
  status: mysqlEnum("status", ["waiting", "active", "completed", "abandoned"]).default("waiting").notNull(),
  /** Winner user ID */
  winnerId: int("winnerId"),
  /** Player 1 deck (JSON array of card IDs) */
  player1Deck: json("player1Deck").$type<string[]>(),
  /** Player 2 deck (JSON array of card IDs) */
  player2Deck: json("player2Deck").$type<string[]>(),
  /** Final game state snapshot */
  finalState: json("finalState").$type<Record<string, unknown>>(),
  /** Total turns played */
  totalTurns: int("totalTurns").notNull().default(0),
  /** ELO change for player 1 */
  player1EloChange: int("player1EloChange").notNull().default(0),
  /** ELO change for player 2 */
  player2EloChange: int("player2EloChange").notNull().default(0),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  endedAt: timestamp("endedAt"),
});

export type PvpMatch = typeof pvpMatches.$inferSelect;
export type InsertPvpMatch = typeof pvpMatches.$inferInsert;

/**
 * PvP leaderboard — card battle ELO ratings.
 */
export const pvpLeaderboard = mysqlTable("pvp_leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  userName: varchar("userName", { length: 256 }),
  /** ELO rating (starts at 1000) */
  elo: int("elo").notNull().default(1000),
  wins: int("wins").notNull().default(0),
  losses: int("losses").notNull().default(0),
  winStreak: int("winStreak").notNull().default(0),
  bestStreak: int("bestStreak").notNull().default(0),
  /** Rank tier */
  rankTier: mysqlEnum("rankTier", [
    "bronze", "silver", "gold", "platinum", "diamond", "master", "grandmaster"
  ]).default("bronze").notNull(),
  lastMatchAt: timestamp("lastMatchAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PvpLeaderboard = typeof pvpLeaderboard.$inferSelect;
export type InsertPvpLeaderboard = typeof pvpLeaderboard.$inferInsert;


/* ═══════════════════════════════════════════════════════
   PVP DECKS — Custom saved decks for PvP battles
   ═══════════════════════════════════════════════════════ */

/**
 * Saved PvP decks — players can build and save custom decks.
 */
export const pvpDecks = mysqlTable("pvp_decks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  /** Faction: architect or dreamer */
  faction: mysqlEnum("faction", ["architect", "dreamer"]).notNull(),
  /** JSON array of card IDs in the deck */
  cardIds: json("cardIds").$type<string[]>().notNull(),
  /** Whether this is the player's active/default PvP deck */
  isActive: int("isActive").notNull().default(0),
  /** Number of cards in the deck */
  cardCount: int("cardCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_pvp_decks_user_id").on(table.userId),
}));

export type PvpDeck = typeof pvpDecks.$inferSelect;
export type InsertPvpDeck = typeof pvpDecks.$inferInsert;

/* ═══════════════════════════════════════════════════════
   RANKED SEASONS — Seasonal competitive rankings
   ═══════════════════════════════════════════════════════ */

/**
 * Season definitions — each season has a start/end date and reward tiers.
 */
export const pvpSeasons = mysqlTable("pvp_seasons", {
  id: int("id").autoincrement().primaryKey(),
  /** Season number (1, 2, 3...) */
  seasonNumber: int("seasonNumber").notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  /** Season start timestamp */
  startsAt: timestamp("startsAt").notNull(),
  /** Season end timestamp */
  endsAt: timestamp("endsAt").notNull(),
  /** Whether this season is currently active */
  isActive: int("isActive").notNull().default(0),
  /** JSON blob: reward definitions per tier */
  rewards: json("rewards").$type<Record<string, { cardPacks: number; title: string; badge: string }>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PvpSeason = typeof pvpSeasons.$inferSelect;
export type InsertPvpSeason = typeof pvpSeasons.$inferInsert;

/**
 * Player season records — tracks ELO, rank, and rewards per season.
 */
export const pvpSeasonRecords = mysqlTable("pvp_season_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  seasonId: int("seasonId").notNull(),
  /** Peak ELO achieved during the season */
  peakElo: int("peakElo").notNull().default(1000),
  /** Final ELO at season end */
  finalElo: int("finalElo").notNull().default(1000),
  /** Peak rank tier achieved */
  peakTier: mysqlEnum("peakTier", [
    "bronze", "silver", "gold", "platinum", "diamond", "master", "grandmaster"
  ]).default("bronze").notNull(),
  /** Total wins this season */
  seasonWins: int("seasonWins").notNull().default(0),
  /** Total losses this season */
  seasonLosses: int("seasonLosses").notNull().default(0),
  /** Best win streak this season */
  bestStreak: int("bestStreak").notNull().default(0),
  /** Whether rewards have been claimed */
  rewardsClaimed: int("rewardsClaimed").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  seasonIdIdx: index("idx_pvp_season_records_season_id").on(table.seasonId),
  userIdIdx: index("idx_pvp_season_records_user_id").on(table.userId),
}));

export type PvpSeasonRecord = typeof pvpSeasonRecords.$inferSelect;
export type InsertPvpSeasonRecord = typeof pvpSeasonRecords.$inferInsert;


/* ═══════════════════════════════════════════════════════
   DRAFT TOURNAMENT — Pick cards from random pools, battle
   ═══════════════════════════════════════════════════════ */

/**
 * Draft tournaments — each tournament has a unique pool and bracket.
 */
export const draftTournaments = mysqlTable("draft_tournaments", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique tournament code */
  tournamentCode: varchar("tournamentCode", { length: 32 }).notNull().unique(),
  /** Tournament status */
  status: mysqlEnum("status", ["drafting", "battling", "completed", "cancelled"]).default("drafting").notNull(),
  /** Max players (2, 4, 8) */
  maxPlayers: int("maxPlayers").notNull().default(2),
  /** Number of draft rounds */
  draftRounds: int("draftRounds").notNull().default(15),
  /** Cards offered per pick */
  cardsPerPick: int("cardsPerPick").notNull().default(3),
  /** Entry cost in Dream tokens */
  entryCost: int("entryCost").notNull().default(5),
  /** Prize pool multiplier */
  prizeMultiplier: int("prizeMultiplier").notNull().default(2),
  /** Creator user ID */
  creatorId: int("creatorId").notNull(),
  /** Winner user ID */
  winnerId: int("winnerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type DraftTournament = typeof draftTournaments.$inferSelect;
export type InsertDraftTournament = typeof draftTournaments.$inferInsert;

/**
 * Draft participants — players in a draft tournament with their picks.
 */
export const draftParticipants = mysqlTable("draft_participants", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  userId: int("userId").notNull(),
  /** JSON array of picked card IDs */
  pickedCards: json("pickedCards").$type<string[]>().notNull(),
  /** Current draft round (0 = not started) */
  currentRound: int("currentRound").notNull().default(0),
  /** Current choices offered (JSON array of card IDs) */
  currentChoices: json("currentChoices").$type<string[]>(),
  /** Tournament wins */
  tournamentWins: int("tournamentWins").notNull().default(0),
  /** Tournament losses */
  tournamentLosses: int("tournamentLosses").notNull().default(0),
  /** Eliminated flag */
  eliminated: int("eliminated").notNull().default(0),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_draft_participants_user_id").on(table.userId),
  tournamentIdIdx: index("idx_draft_participants_tournament_id").on(table.tournamentId),
}));
export type DraftParticipant = typeof draftParticipants.$inferSelect;
export type InsertDraftParticipant = typeof draftParticipants.$inferInsert;

/* ═══════════════════════════════════════════════════════
   CARD TRADING — Player-to-player card trades
   ═══════════════════════════════════════════════════════ */

/**
 * Trade offers — one player offers cards to another.
 */
export const cardTrades = mysqlTable("card_trades", {
  id: int("id").autoincrement().primaryKey(),
  /** Player initiating the trade */
  senderId: int("senderId").notNull(),
  /** Player receiving the trade offer */
  receiverId: int("receiverId").notNull(),
  /** Cards offered by sender (JSON: [{cardId, quantity}]) */
  senderCards: json("senderCards").$type<Array<{ cardId: string; quantity: number }>>().notNull(),
  /** Cards requested from receiver (JSON: [{cardId, quantity}]) */
  receiverCards: json("receiverCards").$type<Array<{ cardId: string; quantity: number }>>().notNull(),
  /** Optional Dream tokens offered by sender */
  senderDream: int("senderDream").notNull().default(0),
  /** Optional Dream tokens offered by receiver */
  receiverDream: int("receiverDream").notNull().default(0),
  /** Trade status */
  status: mysqlEnum("status", ["pending", "accepted", "declined", "cancelled", "expired"]).default("pending").notNull(),
  /** Optional message */
  message: varchar("message", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  senderIdIdx: index("idx_card_trades_sender_id").on(table.senderId),
  receiverIdIdx: index("idx_card_trades_receiver_id").on(table.receiverId),
}));
export type CardTrade = typeof cardTrades.$inferSelect;
export type InsertCardTrade = typeof cardTrades.$inferInsert;

/* ═══════════════════════════════════════════════════════
   CARD GAME ACHIEVEMENTS — Milestones for card game progress
   ═══════════════════════════════════════════════════════ */

/**
 * Card game achievement progress — tracks per-user progress toward milestones.
 */
export const cardGameAchievements = mysqlTable("card_game_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementKey: varchar("achievementKey", { length: 128 }).notNull(),
  /** Progress counter (e.g., wins toward 10-win streak) */
  progress: int("progress").notNull().default(0),
  /** Target to complete */
  target: int("target").notNull().default(1),
  /** Whether completed */
  completed: int("completed").notNull().default(0),
  /** Reward claimed */
  rewardClaimed: int("rewardClaimed").notNull().default(0),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_card_game_achievements_user_id").on(table.userId),
}));
export type CardGameAchievement = typeof cardGameAchievements.$inferSelect;
export type InsertCardGameAchievement = typeof cardGameAchievements.$inferInsert;

/**
 * Feature unlocks — KOTOR-style progressive discovery system.
 * Maps Ark room discoveries to app feature unlocks.
 */
export const featureUnlocks = mysqlTable("feature_unlocks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Feature key matching a nav section or app feature */
  featureKey: varchar("featureKey", { length: 128 }).notNull(),
  /** How it was unlocked */
  unlockedVia: mysqlEnum("unlockedVia", [
    "ark_room", "achievement", "level", "purchase", "admin", "default"
  ]).notNull().default("default"),
  /** Source identifier (room ID, achievement ID, etc.) */
  sourceId: varchar("sourceId", { length: 128 }),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_feature_unlocks_user_id").on(table.userId),
}));
export type FeatureUnlock = typeof featureUnlocks.$inferSelect;
export type InsertFeatureUnlock = typeof featureUnlocks.$inferInsert;

/**
 * War Map — Faction territory control.
 * Tracks which faction controls each sector and the control points.
 */
export const warTerritories = mysqlTable("war_territories", {
  id: int("id").autoincrement().primaryKey(),
  sectorId: int("sectorId").notNull(),
  /** Controlling faction */
  faction: mysqlEnum("faction", ["empire", "insurgency"]),
  /** Control points (0-100). 50 = contested, >50 = faction leans, 100 = fully controlled */
  controlPoints: int("controlPoints").notNull().default(50),
  /** Number of times this sector has been contested */
  contestCount: int("contestCount").notNull().default(0),
  /** Current season ID */
  seasonId: int("seasonId").notNull().default(1),
  /** Last capture event timestamp */
  lastCaptured: timestamp("lastCaptured"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  seasonIdIdx: index("idx_war_territories_season_id").on(table.seasonId),
}));
export type WarTerritory = typeof warTerritories.$inferSelect;

/**
 * War Map — Faction contribution log.
 * Tracks individual player contributions to faction war effort.
 */
export const warContributions = mysqlTable("war_contributions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sectorId: int("sectorId").notNull(),
  faction: mysqlEnum("faction", ["empire", "insurgency"]).notNull(),
  /** Type of contribution */
  actionType: mysqlEnum("actionType", [
    "capture",
    "defend",
    "reinforce",
    "sabotage",
    "trade",
    "build",
  ]).notNull(),
  /** Points contributed */
  points: int("points").notNull().default(1),
  seasonId: int("seasonId").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_war_contributions_user_id").on(table.userId),
  seasonIdIdx: index("idx_war_contributions_season_id").on(table.seasonId),
}));
export type WarContribution = typeof warContributions.$inferSelect;

/**
 * War Map — Season tracking with weekly resets.
 */
export const warSeasons = mysqlTable("war_seasons", {
  id: int("id").autoincrement().primaryKey(),
  seasonNumber: int("seasonNumber").notNull().default(1),
  /** Season name */
  name: varchar("name", { length: 256 }).notNull().default("The First Conflict"),
  /** Which faction won (null if ongoing) */
  winner: mysqlEnum("winner", ["empire", "insurgency"]),
  /** Season start */
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  /** Season end (null if ongoing) */
  endedAt: timestamp("endedAt"),
  /** Reward data JSON */
  rewards: json("rewards").$type<Record<string, unknown>>(),
});
export type WarSeason = typeof warSeasons.$inferSelect;


/* ═══════════════════════════════════════════════════════
   INTERGALACTIC MARKETPLACE — Player-to-player economy
   ═══════════════════════════════════════════════════════ */

/**
 * Market listings — cards and materials listed for sale.
 */
export const marketListings = mysqlTable("market_listings", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  /** Type of item being sold */
  itemType: mysqlEnum("itemType", ["card", "material", "crafted_item"]).notNull(),
  /** Card ID (for card listings) or material/item ID */
  itemId: varchar("itemId", { length: 128 }).notNull(),
  /** Display name for the listing */
  itemName: varchar("itemName", { length: 256 }).notNull(),
  /** Rarity of the item */
  rarity: varchar("rarity", { length: 32 }),
  /** Quantity available */
  quantity: int("quantity").notNull().default(1),
  /** Price per unit in Dream tokens */
  priceDream: int("priceDream").notNull().default(0),
  /** Price per unit in credits */
  priceCredits: int("priceCredits").notNull().default(0),
  /** Status of the listing */
  status: mysqlEnum("status", ["active", "sold", "cancelled", "expired"]).notNull().default("active"),
  /** Optional category tag */
  category: varchar("category", { length: 64 }),
  /** Extra metadata (card stats, material source, etc.) */
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  /** Auto-expire after this date */
  expiresAt: timestamp("expiresAt"),
}, (table) => ({
  createdAtIdx: index("idx_market_listings_created_at").on(table.createdAt),
  statusIdx: index("idx_market_listings_status").on(table.status),
  sellerIdIdx: index("idx_market_listings_seller_id").on(table.sellerId),
}));
export type MarketListing = typeof marketListings.$inferSelect;

/**
 * Market buy orders — "wanted" requests with max price.
 */
export const marketBuyOrders = mysqlTable("market_buy_orders", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull(),
  itemType: mysqlEnum("itemType", ["card", "material", "crafted_item"]).notNull(),
  itemId: varchar("itemId", { length: 128 }).notNull(),
  itemName: varchar("itemName", { length: 256 }).notNull(),
  quantity: int("quantity").notNull().default(1),
  /** Max price willing to pay per unit (Dream) */
  maxPriceDream: int("maxPriceDream").notNull().default(0),
  /** Max price willing to pay per unit (credits) */
  maxPriceCredits: int("maxPriceCredits").notNull().default(0),
  /** Quantity already filled */
  filledQuantity: int("filledQuantity").notNull().default(0),
  status: mysqlEnum("status", ["active", "filled", "cancelled", "expired"]).notNull().default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});
export type MarketBuyOrder = typeof marketBuyOrders.$inferSelect;

/**
 * Market transactions — completed sales for price history.
 */
export const marketTransactions = mysqlTable("market_transactions", {
  id: int("id").autoincrement().primaryKey(),
  listingId: int("listingId"),
  buyOrderId: int("buyOrderId"),
  sellerId: int("sellerId").notNull(),
  buyerId: int("buyerId").notNull(),
  itemType: mysqlEnum("itemType", ["card", "material", "crafted_item"]).notNull(),
  itemId: varchar("itemId", { length: 128 }).notNull(),
  itemName: varchar("itemName", { length: 256 }).notNull(),
  quantity: int("quantity").notNull().default(1),
  /** Actual price paid per unit (Dream) */
  priceDream: int("priceDream").notNull().default(0),
  /** Actual price paid per unit (credits) */
  priceCredits: int("priceCredits").notNull().default(0),
  /** Tax collected (Dream) */
  taxDream: int("taxDream").notNull().default(0),
  /** Tax collected (credits) */
  taxCredits: int("taxCredits").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type MarketTransaction = typeof marketTransactions.$inferSelect;

/**
 * Market auctions — time-limited bidding for rare items.
 */
export const marketAuctions = mysqlTable("market_auctions", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  itemType: mysqlEnum("itemType", ["card", "material", "crafted_item"]).notNull(),
  itemId: varchar("itemId", { length: 128 }).notNull(),
  itemName: varchar("itemName", { length: 256 }).notNull(),
  rarity: varchar("rarity", { length: 32 }),
  quantity: int("quantity").notNull().default(1),
  /** Starting bid (Dream) */
  startingBid: int("startingBid").notNull().default(1),
  /** Current highest bid (Dream) */
  currentBid: int("currentBid").notNull().default(0),
  /** Current highest bidder */
  highestBidderId: int("highestBidderId"),
  /** Minimum bid increment */
  bidIncrement: int("bidIncrement").notNull().default(1),
  /** Buy-it-now price (0 = no buyout) */
  buyoutPrice: int("buyoutPrice").notNull().default(0),
  status: mysqlEnum("status", ["active", "ended", "cancelled"]).notNull().default("active"),
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  endsAt: timestamp("endsAt").notNull(),
});
export type MarketAuction = typeof marketAuctions.$inferSelect;

/**
 * Auction bids — individual bids on auctions.
 */
export const auctionBids = mysqlTable("auction_bids", {
  id: int("id").autoincrement().primaryKey(),
  auctionId: int("auctionId").notNull(),
  bidderId: int("bidderId").notNull(),
  bidAmount: int("bidAmount").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  auctionIdIdx: index("idx_auction_bids_auction_id").on(table.auctionId),
  bidderIdIdx: index("idx_auction_bids_bidder_id").on(table.bidderId),
}));
export type AuctionBid = typeof auctionBids.$inferSelect;

/**
 * Currency exchange — Dream ↔ credits swap orders.
 */
export const currencyExchange = mysqlTable("currency_exchange", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** What they're selling */
  sellCurrency: mysqlEnum("sellCurrency", ["dream", "credits"]).notNull(),
  /** Amount selling */
  sellAmount: int("sellAmount").notNull(),
  /** What they want */
  buyCurrency: mysqlEnum("buyCurrency", ["dream", "credits"]).notNull(),
  /** Amount wanting */
  buyAmount: int("buyAmount").notNull(),
  /** Amount already filled */
  filledAmount: int("filledAmount").notNull().default(0),
  status: mysqlEnum("status", ["active", "filled", "cancelled"]).notNull().default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_currency_exchange_user_id").on(table.userId),
  statusIdx: index("idx_currency_exchange_status").on(table.status),
}));
export type CurrencyExchangeOrder = typeof currencyExchange.$inferSelect;

/* ═══════════════════════════════════════════════════════
   DAILY QUESTS + LOGIN CALENDAR
   ═══════════════════════════════════════════════════════ */

/**
 * Daily quests — rotating objectives with rewards.
 */
export const dailyQuests = mysqlTable("daily_quests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Quest definition ID (from quest templates) */
  questId: varchar("questId", { length: 128 }).notNull(),
  /** Quest title */
  title: varchar("title", { length: 256 }).notNull(),
  /** Quest description */
  description: text("description"),
  /** Quest type/category */
  questType: mysqlEnum("questType", ["fight", "card_battle", "trade", "craft", "explore", "social"]).notNull(),
  /** Target count to complete */
  targetCount: int("targetCount").notNull().default(1),
  /** Current progress */
  currentCount: int("currentCount").notNull().default(0),
  /** Reward in Dream tokens */
  rewardDream: int("rewardDream").notNull().default(0),
  /** Reward in XP */
  rewardXp: int("rewardXp").notNull().default(0),
  /** Reward in credits */
  rewardCredits: int("rewardCredits").notNull().default(0),
  /** Bonus reward description (card pack, material, etc.) */
  bonusReward: varchar("bonusReward", { length: 256 }),
  /** Whether reward has been claimed */
  claimed: boolean("claimed").notNull().default(false),
  /** Date this quest is for (YYYY-MM-DD) */
  questDate: varchar("questDate", { length: 10 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_daily_quests_user_id").on(table.userId),
}));
export type DailyQuest = typeof dailyQuests.$inferSelect;

/**
 * Login calendar — daily login streak tracking.
 */
export const loginCalendar = mysqlTable("login_calendar", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Current streak length */
  currentStreak: int("currentStreak").notNull().default(0),
  /** Longest streak ever */
  longestStreak: int("longestStreak").notNull().default(0),
  /** Last login date (YYYY-MM-DD) */
  lastLoginDate: varchar("lastLoginDate", { length: 10 }),
  /** Total days logged in */
  totalDays: int("totalDays").notNull().default(0),
  /** Days claimed this month (JSON array of day numbers) */
  monthClaims: json("monthClaims").$type<number[]>(),
  /** Current month (YYYY-MM) */
  currentMonth: varchar("currentMonth", { length: 7 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_login_calendar_user_id").on(table.userId),
}));
export type LoginCalendar = typeof loginCalendar.$inferSelect;

/* ═══════════════════════════════════════════════════════
   IN-APP NOTIFICATIONS
   ═══════════════════════════════════════════════════════ */

/**
 * Notifications — in-app notification system.
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Notification type for icon/routing */
  type: mysqlEnum("type", [
    "trade_offer", "trade_accepted", "trade_declined",
    "pvp_challenge", "pvp_result", "pvp_season_reward",
    "auction_outbid", "auction_won", "auction_ended",
    "market_sold", "market_buy_filled",
    "faction_war", "guild_invite", "guild_message", "guild_war_victory",
    "daily_reset", "daily_login", "quest_complete", "weekly_quest", "epoch_quest",
    "achievement", "battle_pass_reward", "syndicate_quest",
    "boss_mastery", "seasonal_event", "recruitment",
    "system",
    // ── Ripple-engine narrative notifications (server/services/rippleEngine.ts) ──
    "feature_hint", "lore_event", "combat_achievement", "streak_milestone",
    "progression", "crafting_achievement", "npc_reaction", "archetype_emergence",
    // ── Prestige narrative (server/services/prestigeNarrative.ts) ──
    "prestige_dialog", "prestige_deferred_dialog", "prestige_conditional_dialog",
    "companion_prestige_gesture", "meme_broadcast", "prestige_complete",
    // ── Universe / living-universe events (server/services/universeConsequences.ts) ──
    "universe_event",
    // ── Companion / eidolon / pet lifecycle ──
    "companion_death", "companion_resurrected", "eidolon_evolved", "pet_evolved",
    "apprentice_sacrificed", "crew_cloned",
    // ── Morality + content discovery ──
    "morality_threshold", "morality_market_notice", "content_discovery",
    "deep_trust", "daily_brief_complete", "outbreak_completed",
    "outbreak_component", "battle_pass_tier_up",
  ]).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  message: text("message").notNull(),
  /** Whether the notification has been read */
  isRead: boolean("isRead").notNull().default(false),
  /** Link to navigate to when clicked */
  actionUrl: varchar("actionUrl", { length: 256 }),
  /** Extra data (trade ID, auction ID, etc.) */
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_notifications_user_id").on(table.userId),
}));
export type Notification = typeof notifications.$inferSelect;

/* ═══════════════════════════════════════════════════════
   BATTLE PASS / SEASON PASS
   ═══════════════════════════════════════════════════════ */

/**
 * Battle pass seasons — defines the pass structure.
 */
export const battlePassSeasons = mysqlTable("battle_pass_seasons", {
  id: int("id").autoincrement().primaryKey(),
  seasonNumber: int("seasonNumber").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  /** Season description/theme */
  description: text("description"),
  /** Total tiers in this pass */
  totalTiers: int("totalTiers").notNull().default(50),
  /** XP required per tier */
  xpPerTier: int("xpPerTier").notNull().default(1000),
  /** Price of premium track in Dream tokens */
  premiumPriceDream: int("premiumPriceDream").notNull().default(500),
  /** Price of premium track in USD cents */
  premiumPriceUsd: int("premiumPriceUsd").notNull().default(499),
  /** Tier rewards JSON: { tier: { free: {...}, premium: {...} } } */
  tierRewards: json("tierRewards").$type<Record<string, { free?: Record<string, unknown>; premium?: Record<string, unknown> }>>(),
  status: mysqlEnum("status", ["active", "upcoming", "ended"]).notNull().default("upcoming"),
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type BattlePassSeason = typeof battlePassSeasons.$inferSelect;

/**
 * Battle pass player progress — tracks each player's pass progress.
 */
export const battlePassProgress = mysqlTable("battle_pass_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  seasonId: int("seasonId").notNull(),
  /** Current XP in this season */
  currentXp: int("currentXp").notNull().default(0),
  /** Current tier reached */
  currentTier: int("currentTier").notNull().default(0),
  /** Whether player has premium pass */
  isPremium: boolean("isPremium").notNull().default(false),
  /** Tiers where free rewards have been claimed (JSON array) */
  claimedFreeTiers: json("claimedFreeTiers").$type<number[]>(),
  /** Tiers where premium rewards have been claimed (JSON array) */
  claimedPremiumTiers: json("claimedPremiumTiers").$type<number[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_battle_pass_progress_user_id").on(table.userId),
  seasonIdIdx: index("idx_battle_pass_progress_season_id").on(table.seasonId),
}));
export type BattlePassProgress = typeof battlePassProgress.$inferSelect;

/* ═══════════════════════════════════════════════════════
   CARD DISENCHANT LOG
   ═══════════════════════════════════════════════════════ */

/**
 * Disenchant log — tracks card salvage operations.
 */
export const disenchantLog = mysqlTable("disenchant_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Card ID that was disenchanted */
  cardId: varchar("cardId", { length: 128 }).notNull(),
  cardName: varchar("cardName", { length: 256 }).notNull(),
  cardRarity: varchar("cardRarity", { length: 32 }).notNull(),
  /** Materials received (JSON: { materialId: quantity }) */
  materialsReceived: json("materialsReceived").$type<Record<string, number>>(),
  /** Dream tokens received */
  dreamReceived: int("dreamReceived").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_disenchant_log_user_id").on(table.userId),
}));
export type DisenchantLog = typeof disenchantLog.$inferSelect;

/* ═══════════════════════════════════════════════════════
   GUILD SYSTEM
   ═══════════════════════════════════════════════════════ */

/**
 * Guilds — player-created organizations.
 */
export const guilds = mysqlTable("guilds", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  /** Guild tag (3-5 chars) */
  tag: varchar("tag", { length: 5 }).notNull().unique(),
  description: text("description"),
  /** Guild leader user ID */
  leaderId: int("leaderId").notNull(),
  /** Guild faction alignment */
  faction: mysqlEnum("faction", ["empire", "insurgency", "neutral"]).notNull().default("neutral"),
  /** Guild icon/emblem identifier */
  emblem: varchar("emblem", { length: 64 }).default("default"),
  /** Max members allowed */
  maxMembers: int("maxMembers").notNull().default(30),
  /** Current member count (denormalized for performance) */
  memberCount: int("memberCount").notNull().default(1),
  /** Guild level */
  level: int("level").notNull().default(1),
  /** Guild XP */
  xp: int("xp").notNull().default(0),
  /** Treasury: Dream tokens pooled */
  treasuryDream: int("treasuryDream").notNull().default(0),
  /** Treasury: credits pooled */
  treasuryCredits: int("treasuryCredits").notNull().default(0),
  /** Total war contributions */
  totalWarPoints: int("totalWarPoints").notNull().default(0),
  /** Guild MOTD */
  motd: text("motd"),
  /** Whether guild is recruiting */
  isRecruiting: boolean("isRecruiting").notNull().default(true),
  /** Minimum level to join */
  minLevelToJoin: int("minLevelToJoin").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Guild = typeof guilds.$inferSelect;

/**
 * Guild members — membership records.
 */
export const guildMembers = mysqlTable("guild_members", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull(),
  userId: int("userId").notNull(),
  /** Role within the guild */
  role: mysqlEnum("role", ["leader", "officer", "member"]).notNull().default("member"),
  contributionXp: int("contributionXp").notNull().default(0),
  /** Dream donated to treasury */
  donatedDream: int("donatedDream").notNull().default(0),
  /** Credits donated to treasury */
  donatedCredits: int("donatedCredits").notNull().default(0),
  /** War points contributed through this guild */
  warPoints: int("warPoints").notNull().default(0),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
}, (table) => ({
  guildIdIdx: index("idx_guild_members_guild_id").on(table.guildId),
  userIdIdx: index("idx_guild_members_user_id").on(table.userId),
}));
export type GuildMember = typeof guildMembers.$inferSelect;

/**
 * Guild chat messages.
 */
export const guildChat = mysqlTable("guild_chat", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 128 }).notNull(),
  message: text("message").notNull(),
  /** Message type */
  messageType: mysqlEnum("messageType", ["chat", "system", "war_update"]).notNull().default("chat"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  guildIdIdx: index("idx_guild_chat_guild_id").on(table.guildId),
}));
export type GuildChatMessage = typeof guildChat.$inferSelect;

/**
 * Guild invites — pending invitations.
 */
export const guildInvites = mysqlTable("guild_invites", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull(),
  /** User who was invited */
  invitedUserId: int("invitedUserId").notNull(),
  /** User who sent the invite */
  invitedBy: int("invitedBy").notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "declined"]).notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  guildIdIdx: index("idx_guild_invites_guild_id").on(table.guildId),
  invitedUserIdIdx: index("idx_guild_invites_invited_user_id").on(table.invitedUserId),
}));
export type GuildInvite = typeof guildInvites.$inferSelect;


/* ═══════════════════════════════════════════════════════
   GUILD WARS — Faction vs Faction territory control events
   ═══════════════════════════════════════════════════════ */
export const guildWars = mysqlTable("guild_wars", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  seasonNumber: int("seasonNumber").notNull().default(1),
  status: mysqlEnum("status", ["upcoming", "active", "ended"]).notNull().default("upcoming"),
  factionA: mysqlEnum("factionA", ["empire", "insurgency", "neutral"]).notNull(),
  factionB: mysqlEnum("factionB", ["empire", "insurgency", "neutral"]).notNull(),
  scoreA: int("scoreA").notNull().default(0),
  scoreB: int("scoreB").notNull().default(0),
  territory: varchar("territory", { length: 128 }).notNull(),
  prizePoolDream: int("prizePoolDream").notNull().default(0),
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type GuildWar = typeof guildWars.$inferSelect;

export const guildWarContributions = mysqlTable("guild_war_contributions", {
  id: int("id").autoincrement().primaryKey(),
  warId: int("warId").notNull(),
  guildId: int("guildId").notNull(),
  userId: int("userId").notNull(),
  points: int("points").notNull().default(0),
  source: mysqlEnum("source", ["fight_win", "pvp_win", "trade_volume", "quest_complete", "card_battle_win", "chess_win", "terminus_wave", "terminus_boss_kill", "terminus_pvp_star", "terminus_defense"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  warIdIdx: index("idx_guild_war_contributions_war_id").on(table.warId),
  guildIdIdx: index("idx_guild_war_contributions_guild_id").on(table.guildId),
  userIdIdx: index("idx_guild_war_contributions_user_id").on(table.userId),
}));
export type GuildWarContribution = typeof guildWarContributions.$inferSelect;

/** Marketplace tax pool — accumulates taxes for guild wars and season prizes */
export const marketTaxPool = mysqlTable("market_tax_pool", {
  id: int("id").autoincrement().primaryKey(),
  poolDream: int("poolDream").notNull().default(0),
  poolCredits: int("poolCredits").notNull().default(0),
  lastDistributedAt: timestamp("lastDistributedAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

/* ═══════════════════════════════════════════════════════
   THE ARCHITECT'S GAMBIT — Strategic Chess Game
   ═══════════════════════════════════════════════════════ */
export const chessGames = mysqlTable("chess_games", {
  id: int("id").autoincrement().primaryKey(),
  whitePlayerId: int("whitePlayerId"),
  blackPlayerId: int("blackPlayerId"),
  whiteCharacter: varchar("whiteCharacter", { length: 64 }),
  blackCharacter: varchar("blackCharacter", { length: 64 }),
  mode: mysqlEnum("mode", ["casual", "ranked", "tournament", "story", "game_master"]).notNull().default("casual"),
  aiDifficulty: int("aiDifficulty"),
  fen: text("fen"),
  pgn: text("pgn"),
  status: mysqlEnum("status", ["waiting", "active", "checkmate", "stalemate", "draw", "resigned", "timeout", "abandoned"]).notNull().default("waiting"),
  winnerId: int("winnerId"),
  timeControl: int("timeControl").notNull().default(600),
  whiteTimeMs: int("whiteTimeMs").notNull().default(600000),
  blackTimeMs: int("blackTimeMs").notNull().default(600000),
  moveCount: int("moveCount").notNull().default(0),
  whiteEloChange: int("whiteEloChange"),
  blackEloChange: int("blackEloChange"),
  rewardsDream: int("rewardsDream").default(0),
  rewardsMaterials: json("rewardsMaterials").$type<Record<string, number>>(),
  startedAt: timestamp("startedAt"),
  endedAt: timestamp("endedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ChessGame = typeof chessGames.$inferSelect;

export const chessRankings = mysqlTable("chess_rankings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  elo: int("elo").notNull().default(1200),
  peakElo: int("peakElo").notNull().default(1200),
  tier: mysqlEnum("tier", ["bronze", "silver", "gold", "platinum", "diamond", "master", "grandmaster"]).notNull().default("bronze"),
  gamesPlayed: int("gamesPlayed").notNull().default(0),
  wins: int("wins").notNull().default(0),
  losses: int("losses").notNull().default(0),
  draws: int("draws").notNull().default(0),
  winStreak: int("winStreak").notNull().default(0),
  bestWinStreak: int("bestWinStreak").notNull().default(0),
  defeatedGameMaster: boolean("defeatedGameMaster").notNull().default(false),
  storyProgress: int("storyProgress").notNull().default(0),
  unlockedCharacters: json("unlockedCharacters").$type<string[]>(),
  seasonNumber: int("seasonNumber").notNull().default(1),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type ChessRanking = typeof chessRankings.$inferSelect;

export const chessTournaments = mysqlTable("chess_tournaments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  format: mysqlEnum("format", ["swiss", "elimination", "round_robin"]).notNull().default("swiss"),
  maxPlayers: int("maxPlayers").notNull().default(16),
  currentPlayers: int("currentPlayers").notNull().default(0),
  entryFee: int("entryFee").notNull().default(0),
  prizePool: int("prizePool").notNull().default(0),
  timeControl: int("timeControl").notNull().default(600),
  currentRound: int("currentRound").notNull().default(0),
  totalRounds: int("totalRounds").notNull().default(4),
  status: mysqlEnum("status", ["registration", "active", "completed"]).notNull().default("registration"),
  startsAt: timestamp("startsAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ChessTournament = typeof chessTournaments.$inferSelect;


/* ═══════════════════════════════════════════════════════
   CLASS MASTERY — Progressive class specialization
   Players earn class XP by performing class-aligned actions.
   5 mastery ranks unlock increasingly powerful perks.
   ═══════════════════════════════════════════════════════ */

export const classMastery = mysqlTable("class_mastery", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  characterClass: mysqlEnum("characterClass", [
    "spy", "oracle", "assassin", "engineer", "soldier"
  ]).notNull(),
  /** Class-specific XP earned through aligned actions */
  classXp: int("classXp").notNull().default(0),
  /** Mastery rank 0-5 (0 = unranked, 5 = grandmaster) */
  masteryRank: int("masteryRank").notNull().default(0),
  /** Unlocked perk keys (JSON array) */
  unlockedPerks: json("unlockedPerks").$type<string[]>(),
  /** Total class-aligned actions performed */
  actionsPerformed: int("actionsPerformed").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_class_mastery_user_id").on(table.userId),
}));
export type ClassMastery = typeof classMastery.$inferSelect;

/* ═══════════════════════════════════════════════════════
   RPG RECOMMENDATION TABLES (Phase 80)
   ═══════════════════════════════════════════════════════ */

/** Branching mastery specialization choice at rank 3 */
export const masteryBranches = mysqlTable("mastery_branches", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  characterClass: mysqlEnum("characterClass", [
    "spy", "oracle", "assassin", "engineer", "soldier"
  ]).notNull(),
  /** Branch key chosen (e.g., "cryptographer" or "saboteur") */
  branchKey: varchar("branchKey", { length: 64 }).notNull(),
  /** When the branch was chosen */
  chosenAt: timestamp("chosenAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_mastery_branches_user_id").on(table.userId),
}));
export type MasteryBranch = typeof masteryBranches.$inferSelect;

/** Citizen talents — powerful passives chosen at milestone levels */
export const citizenTalentSelections = mysqlTable("citizen_talent_selections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Talent key from citizenTalents.ts */
  talentKey: varchar("talentKey", { length: 64 }).notNull(),
  /** Milestone level at which this was chosen */
  milestoneLevel: int("milestoneLevel").notNull(),
  selectedAt: timestamp("selectedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_citizen_talent_selections_user_id").on(table.userId),
}));
export type CitizenTalentSelection = typeof citizenTalentSelections.$inferSelect;

/** Civil skill proficiency levels — non-combat skills leveled by use */
export const civilSkillProgress = mysqlTable("civil_skill_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Skill key from civilSkills.ts (e.g., "diplomacy", "lore_mastery") */
  skillKey: varchar("skillKey", { length: 64 }).notNull(),
  /** Current XP in this skill */
  xp: int("xp").notNull().default(0),
  /** Current level (1-10) */
  level: int("level").notNull().default(1),
  /** Total actions performed for this skill */
  actionsPerformed: int("actionsPerformed").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_civil_skill_progress_user_id").on(table.userId),
}));
export type CivilSkillProgress = typeof civilSkillProgress.$inferSelect;

/** Prestige class selection and progression */
export const prestigeProgress = mysqlTable("prestige_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Prestige class key from prestigeClasses.ts */
  prestigeClassKey: varchar("prestigeClassKey", { length: 64 }).notNull(),
  /** Prestige XP */
  prestigeXp: int("prestigeXp").notNull().default(0),
  /** Prestige rank (0-3) */
  prestigeRank: int("prestigeRank").notNull().default(0),
  /** Unlocked perk keys (JSON array) */
  unlockedPerks: json("unlockedPerks").$type<string[]>(),
  selectedAt: timestamp("selectedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_prestige_progress_user_id").on(table.userId),
}));
export type PrestigeProgressRow = typeof prestigeProgress.$inferSelect;

/** Achievement trait tracking — unlocked traits and equipped slots */
export const achievementTraitProgress = mysqlTable("achievement_trait_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Achievement counter values (JSON: Record<string, number>) */
  counters: json("counters").$type<Record<string, number>>(),
  /** Unlocked trait keys (JSON array) */
  unlockedTraits: json("unlockedTraits").$type<string[]>(),
  /** Currently equipped trait keys (max 3, JSON array) */
  equippedTraits: json("equippedTraits").$type<string[]>(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_achievement_trait_progress_user_id").on(table.userId),
}));
export type AchievementTraitProgressRow = typeof achievementTraitProgress.$inferSelect;


/* ═══════════════════════════════════════════════════════
   SYNDICATE WORLDS — Guild Capital System
   Each guild controls a homeworld with buildings that
   generate resources and provide guild-wide bonuses.
   ═══════════════════════════════════════════════════════ */

export const syndicateWorlds = mysqlTable("syndicate_worlds", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull().unique(),
  /** World biome type */
  biome: varchar("biome", { length: 32 }).notNull().default("forge_world"),
  /** World name (customizable) */
  worldName: varchar("worldName", { length: 128 }).notNull().default("Unnamed World"),
  /** World level (affects max buildings, defense) */
  level: int("level").notNull().default(1),
  /** Grid size NxN */
  gridSize: int("gridSize").notNull().default(8),
  /** Total defense rating (sum of all defense buildings + bonuses) */
  totalDefense: int("totalDefense").notNull().default(0),
  /** Total resource production rates (JSON: Record<string, number>) */
  productionRates: json("productionRates").$type<Record<string, number>>(),
  /** Stored resources (JSON: Record<string, number>) */
  storedResources: json("storedResources").$type<Record<string, number>>(),
  /** Last time resources were collected */
  lastCollection: timestamp("lastCollection").defaultNow().notNull(),
  /** Active elemental synergies (JSON array) */
  activeSynergies: json("activeSynergies").$type<string[]>(),
  /** Shield active until (null = no shield) */
  shieldUntil: timestamp("shieldUntil"),
  /** Number of times raided */
  timesRaided: int("timesRaided").notNull().default(0),
  /** Number of successful defenses */
  successfulDefenses: int("successfulDefenses").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type SyndicateWorld = typeof syndicateWorlds.$inferSelect;

export const syndicateBuildings = mysqlTable("syndicate_buildings", {
  id: int("id").autoincrement().primaryKey(),
  worldId: int("worldId").notNull(),
  /** Building definition key (from shared/syndicateWorlds.ts) */
  buildingKey: varchar("buildingKey", { length: 64 }).notNull(),
  /** Current level */
  level: int("level").notNull().default(1),
  /** Grid position X */
  gridX: int("gridX").notNull(),
  /** Grid position Y */
  gridY: int("gridY").notNull(),
  /** Building status */
  status: mysqlEnum("status", ["active", "building", "upgrading", "damaged", "destroyed"]).notNull().default("active"),
  /** Build/upgrade completion time */
  completesAt: timestamp("completesAt"),
  /** Current HP (for raids) */
  currentHp: int("currentHp").notNull().default(100),
  /** Max HP */
  maxHp: int("maxHp").notNull().default(100),
  /** Who built this (user ID) */
  builtBy: int("builtBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type SyndicateBuilding = typeof syndicateBuildings.$inferSelect;


/* ═══════════════════════════════════════════════════════
   SPACE STATIONS — Personal Player Base System
   Each player has a personal station with modules.
   ═══════════════════════════════════════════════════════ */

export const spaceStations = mysqlTable("space_stations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  /** Station name */
  stationName: varchar("stationName", { length: 128 }).notNull().default("Outpost Alpha"),
  /** Station tier (1-5) */
  tier: int("tier").notNull().default(1),
  /** Grid size */
  gridSize: int("gridSize").notNull().default(6),
  /** Total defense rating */
  totalDefense: int("totalDefense").notNull().default(0),
  /** Total stealth rating */
  stealthRating: int("stealthRating").notNull().default(0),
  /** Stored resources (JSON: Record<string, number>) */
  storedResources: json("storedResources").$type<Record<string, number>>(),
  /** Production rates (JSON: Record<string, number>) */
  productionRates: json("productionRates").$type<Record<string, number>>(),
  /** Last resource collection */
  lastCollection: timestamp("lastCollection").defaultNow().notNull(),
  /** Stationed companion IDs (JSON array) */
  stationedCompanions: json("stationedCompanions").$type<string[]>(),
  /** Active module synergies (JSON array) */
  activeSynergies: json("activeSynergies").$type<string[]>(),
  /** Shield active until */
  shieldUntil: timestamp("shieldUntil"),
  /** Visit count (other players visiting) */
  visitCount: int("visitCount").notNull().default(0),
  /** Reputation earned from visits */
  reputation: int("reputation").notNull().default(0),
  /** Times raided */
  timesRaided: int("timesRaided").notNull().default(0),
  /** Successful defenses */
  successfulDefenses: int("successfulDefenses").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type SpaceStation = typeof spaceStations.$inferSelect;

export const stationModules = mysqlTable("station_modules", {
  id: int("id").autoincrement().primaryKey(),
  stationId: int("stationId").notNull(),
  /** Module definition key (from shared/spaceStations.ts) */
  moduleKey: varchar("moduleKey", { length: 64 }).notNull(),
  /** Current level */
  level: int("level").notNull().default(1),
  /** Grid position */
  gridX: int("gridX").notNull(),
  gridY: int("gridY").notNull(),
  /** Module status */
  status: mysqlEnum("status", ["active", "building", "upgrading", "damaged", "destroyed"]).notNull().default("active"),
  /** Build/upgrade completion time */
  completesAt: timestamp("completesAt"),
  /** Current HP */
  currentHp: int("currentHp").notNull().default(100),
  maxHp: int("maxHp").notNull().default(100),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type StationModuleRow = typeof stationModules.$inferSelect;


/* ═══════════════════════════════════════════════════════
   TOWER DEFENSE — Tower placements, raid logs, defense waves
   Clash of Clans-style base defense and raiding.
   ═══════════════════════════════════════════════════════ */

export const towerPlacements = mysqlTable("tower_placements", {
  id: int("id").autoincrement().primaryKey(),
  /** Owner type: 'station' or 'world' */
  ownerType: mysqlEnum("ownerType", ["station", "world"]).notNull(),
  /** Owner ID (station ID or world ID) */
  ownerId: int("ownerId").notNull(),
  /** Tower definition key (from shared/towerDefense.ts) */
  towerKey: varchar("towerKey", { length: 64 }).notNull(),
  /** Current level */
  level: int("level").notNull().default(1),
  /** Grid position */
  gridX: int("gridX").notNull(),
  gridY: int("gridY").notNull(),
  /** Current HP */
  currentHp: int("currentHp").notNull().default(200),
  maxHp: int("maxHp").notNull().default(200),
  /** Status */
  status: mysqlEnum("status", ["active", "building", "upgrading", "destroyed"]).notNull().default("active"),
  completesAt: timestamp("completesAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type TowerPlacement = typeof towerPlacements.$inferSelect;

export const raidLogs = mysqlTable("raid_logs", {
  id: int("id").autoincrement().primaryKey(),
  /** Attacker user ID */
  attackerId: int("attackerId").notNull(),
  /** Defender: station or world */
  defenderType: mysqlEnum("defenderType", ["station", "world"]).notNull(),
  defenderId: int("defenderId").notNull(),
  /** Defender user ID (for station) or guild ID (for world) */
  defenderOwnerId: int("defenderOwnerId").notNull(),
  /** Raid result */
  result: mysqlEnum("result", ["victory", "defeat", "draw"]).notNull(),
  /** Stars earned (0-3) */
  stars: int("stars").notNull().default(0),
  /** Destruction percentage */
  destructionPercent: int("destructionPercent").notNull().default(0),
  /** Loot stolen (JSON: Record<string, number>) */
  lootStolen: json("lootStolen").$type<Record<string, number>>(),
  /** Units deployed (JSON: { key: string, count: number }[]) */
  unitsDeployed: json("unitsDeployed").$type<{ key: string; count: number }[]>(),
  /** Units lost */
  unitsLost: int("unitsLost").notNull().default(0),
  /** Towers destroyed */
  towersDestroyed: int("towersDestroyed").notNull().default(0),
  /** XP earned by attacker */
  xpEarned: int("xpEarned").notNull().default(0),
  /** Trophies gained/lost */
  trophiesChanged: int("trophiesChanged").notNull().default(0),
  /** RPG bonuses applied (JSON summary) */
  rpgBonuses: json("rpgBonuses").$type<Record<string, number>>(),
  /** Duration in seconds */
  duration: int("duration").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type RaidLog = typeof raidLogs.$inferSelect;

export const defenseWaves = mysqlTable("defense_waves", {
  id: int("id").autoincrement().primaryKey(),
  /** Owner type and ID (same as tower placements) */
  ownerType: mysqlEnum("ownerType", ["station", "world"]).notNull(),
  ownerId: int("ownerId").notNull(),
  /** Wave number (for PvE defense mode) */
  waveNumber: int("waveNumber").notNull().default(1),
  /** Enemy composition (JSON: { key: string, count: number, level: number }[]) */
  enemies: json("enemies").$type<{ key: string; count: number; level: number }[]>(),
  /** Wave difficulty multiplier */
  difficultyMultiplier: int("difficultyMultiplier").notNull().default(100),
  /** Reward for surviving this wave (JSON) */
  rewards: json("rewards").$type<Record<string, number>>(),
  /** Status */
  status: mysqlEnum("status", ["pending", "active", "completed", "failed"]).notNull().default("pending"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type DefenseWave = typeof defenseWaves.$inferSelect;


/* ═══════════════════════════════════════════════════════
   PRESTIGE QUEST PROGRESS — Track prestige quest chains
   ═══════════════════════════════════════════════════════ */

export const prestigeQuestProgress = mysqlTable("prestige_quest_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Prestige quest chain key */
  questChainKey: varchar("questChainKey", { length: 128 }).notNull(),
  /** Current step index (0-based) */
  currentStep: int("currentStep").notNull().default(0),
  /** Completed step IDs (JSON array) */
  completedSteps: json("completedSteps").$type<string[]>(),
  /** Skipped step IDs via talents (JSON array) */
  skippedSteps: json("skippedSteps").$type<string[]>(),
  /** Overall status */
  status: mysqlEnum("status", ["in_progress", "completed", "abandoned"]).notNull().default("in_progress"),
  /** Step-specific progress data (JSON: Record<stepId, progressValue>) */
  stepProgress: json("stepProgress").$type<Record<string, number>>(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_prestige_quest_progress_user_id").on(table.userId),
}));
export type PrestigeQuestProgressRow = typeof prestigeQuestProgress.$inferSelect;


/* ═══════════════════════════════════════════════════════
   RAID TROPHIES — Unified trophy/league system
   ═══════════════════════════════════════════════════════ */

export const raidTrophies = mysqlTable("raid_trophies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  /** Current trophy count */
  trophies: int("trophies").notNull().default(0),
  /** Current league */
  league: mysqlEnum("league", [
    "bronze_1", "bronze_2", "bronze_3",
    "silver_1", "silver_2", "silver_3",
    "gold_1", "gold_2", "gold_3",
    "platinum_1", "platinum_2", "platinum_3",
    "diamond_1", "diamond_2", "diamond_3",
    "champion", "legend"
  ]).notNull().default("bronze_1"),
  /** Season high */
  seasonHigh: int("seasonHigh").notNull().default(0),
  /** All-time high */
  allTimeHigh: int("allTimeHigh").notNull().default(0),
  /** Total raids */
  totalRaids: int("totalRaids").notNull().default(0),
  /** Total defenses */
  totalDefenses: int("totalDefenses").notNull().default(0),
  /** Win rate (percentage * 100) */
  winRate: int("winRate").notNull().default(0),
  /** Current win streak */
  winStreak: int("winStreak").notNull().default(0),
  /** Best win streak */
  bestWinStreak: int("bestWinStreak").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type RaidTrophyRow = typeof raidTrophies.$inferSelect;


/* ═══════════════════════════════════════════════════════
   DAILY ENGAGEMENT STREAKS — Chrono Shards system
   ═══════════════════════════════════════════════════════ */

export const dailyStreaks = mysqlTable("daily_streaks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  /** Current streak count */
  currentStreak: int("currentStreak").notNull().default(0),
  /** Longest streak ever */
  longestStreak: int("longestStreak").notNull().default(0),
  /** Chrono Shards earned */
  chronoShards: int("chronoShards").notNull().default(0),
  /** Last check-in date (YYYY-MM-DD stored as varchar) */
  lastCheckIn: varchar("lastCheckIn", { length: 10 }),
  /** Streak repair items available */
  repairItems: int("repairItems").notNull().default(0),
  /** Total check-ins */
  totalCheckIns: int("totalCheckIns").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type DailyStreakRow = typeof dailyStreaks.$inferSelect;


/* ═══════════════════════════════════════════════════════════
   PHASE 84 — ALL REMAINING COMPETITIVE ROADMAP FEATURES
   ═══════════════════════════════════════════════════════════ */

/* ─── SEASONAL EVENTS ─── */
export const seasonalEvents = mysqlTable("seasonal_events", {
  id: int("id").primaryKey().autoincrement(),
  eventKey: varchar("eventKey", { length: 100 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt").notNull(),
  globalProgress: int("globalProgress").notNull().default(0),
  globalTarget: int("globalTarget").notNull().default(100000),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SeasonalEventRow = typeof seasonalEvents.$inferSelect;

export const eventParticipation = mysqlTable("event_participation", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  eventId: int("eventId").notNull(),
  contribution: int("contribution").notNull().default(0),
  tokensEarned: int("tokensEarned").notNull().default(0),
  tokensSpent: int("tokensSpent").notNull().default(0),
  milestonesReached: json("milestonesReached").$type<number[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_event_participation_user_id").on(table.userId),
  eventIdIdx: index("idx_event_participation_event_id").on(table.eventId),
}));
export type EventParticipationRow = typeof eventParticipation.$inferSelect;

export const eventShopPurchases = mysqlTable("event_shop_purchases", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  eventId: int("eventId").notNull(),
  itemKey: varchar("itemKey", { length: 100 }).notNull(),
  quantity: int("quantity").notNull().default(1),
  tokensCost: int("tokensCost").notNull(),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_event_shop_purchases_user_id").on(table.userId),
}));
export type EventShopPurchaseRow = typeof eventShopPurchases.$inferSelect;

/* ─── GAME REPLAYS ─── */
export const gameReplays = mysqlTable("game_replays", {
  id: int("id").primaryKey().autoincrement(),
  gameType: varchar("gameType", { length: 50 }).notNull(),
  player1Id: int("player1Id").notNull(),
  player1Name: varchar("player1Name", { length: 100 }).notNull(),
  player2Id: int("player2Id"),
  player2Name: varchar("player2Name", { length: 100 }),
  winnerId: int("winnerId"),
  moveData: text("moveData").notNull(),
  totalMoves: int("totalMoves").notNull().default(0),
  duration: int("duration").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  tags: json("tags").$type<string[]>(),
  playedAt: timestamp("playedAt").defaultNow().notNull(),
});
export type GameReplayRow = typeof gameReplays.$inferSelect;

/* ─── PERSONAL QUARTERS ─── */
export const playerQuarters = mysqlTable("player_quarters", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().unique(),
  name: varchar("name", { length: 200 }).notNull().default("My Quarters"),
  unlockedZones: json("unlockedZones").$type<string[]>(),
  placedItems: json("placedItems").$type<{ itemKey: string; zone: string; x: number; y: number }[]>(),
  ownedItems: json("ownedItems").$type<string[]>(),
  visitCount: int("visitCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type PlayerQuartersRow = typeof playerQuarters.$inferSelect;

export const quarterVisits = mysqlTable("quarter_visits", {
  id: int("id").primaryKey().autoincrement(),
  ownerId: int("ownerId").notNull(),
  visitorId: int("visitorId").notNull(),
  visitedAt: timestamp("visitedAt").defaultNow().notNull(),
});
export type QuarterVisitRow = typeof quarterVisits.$inferSelect;

/* ─── FRIENDLY CHALLENGES ─── */
export const friendlyChallenges = mysqlTable("friendly_challenges", {
  id: int("id").primaryKey().autoincrement(),
  challengerId: int("challengerId").notNull(),
  opponentId: int("opponentId"),
  gameType: varchar("gameType", { length: 50 }).notNull(),
  rules: json("rules").$type<string[]>(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  winnerId: int("winnerId"),
  isDaily: boolean("isDaily").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});
export type FriendlyChallengeRow = typeof friendlyChallenges.$inferSelect;

/* ─── COOPERATIVE PvE RAIDS ─── */
export const coopRaids = mysqlTable("coop_raids", {
  id: int("id").primaryKey().autoincrement(),
  bossKey: varchar("bossKey", { length: 100 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull().default("normal"),
  guildId: int("guildId"),
  currentHp: int("currentHp").notNull(),
  maxHp: int("maxHp").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  startsAt: timestamp("startsAt").defaultNow().notNull(),
  endsAt: timestamp("endsAt").notNull(),
  completedAt: timestamp("completedAt"),
});
export type CoopRaidRow = typeof coopRaids.$inferSelect;

export const raidContributions = mysqlTable("raid_contributions", {
  id: int("id").primaryKey().autoincrement(),
  raidId: int("raidId").notNull(),
  userId: int("userId").notNull(),
  damageDealt: int("damageDealt").notNull().default(0),
  healingDone: int("healingDone").notNull().default(0),
  damageTaken: int("damageTaken").notNull().default(0),
  mechanicsHandled: int("mechanicsHandled").notNull().default(0),
  contributionScore: int("contributionScore").notNull().default(0),
  role: varchar("role", { length: 20 }).notNull().default("dps"),
  lootClaimed: boolean("lootClaimed").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type RaidContributionRow = typeof raidContributions.$inferSelect;

/* ─── BOSS MASTERY ─── */
export const bossMastery = mysqlTable("boss_mastery", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  bossKey: varchar("bossKey", { length: 100 }).notNull(),
  kills: int("kills").notNull().default(0),
  masteryLevel: int("masteryLevel").notNull().default(0),
  bestTime: int("bestTime"),
  highestDifficulty: varchar("highestDifficulty", { length: 20 }),
  cosmeticsUnlocked: json("cosmeticsUnlocked").$type<string[]>(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type BossMasteryRow = typeof bossMastery.$inferSelect;

/* ─── COSMETIC SHOP ─── */
export const cosmeticPurchases = mysqlTable("cosmetic_purchases", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  itemKey: varchar("itemKey", { length: 100 }).notNull(),
  price: int("price").notNull(),
  equipped: boolean("equipped").notNull().default(false),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
});
export type CosmeticPurchaseRow = typeof cosmeticPurchases.$inferSelect;

/* ─── DONATIONS ─── */
export const donations = mysqlTable("donations", {
  id: int("id").primaryKey().autoincrement(),
  donorId: int("donorId").notNull(),
  guildId: int("guildId").notNull(),
  donationType: varchar("donationType", { length: 20 }).notNull(),
  itemKey: varchar("itemKey", { length: 100 }),
  amount: int("amount").notNull().default(1),
  reputationEarned: int("reputationEarned").notNull().default(0),
  donatedAt: timestamp("donatedAt").defaultNow().notNull(),
});
export type DonationRow = typeof donations.$inferSelect;

export const donationReputation = mysqlTable("donation_reputation", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  guildId: int("guildId").notNull(),
  totalReputation: int("totalReputation").notNull().default(0),
  weeklyDonations: json("weeklyDonations").$type<Record<string, number>>(),
  weekResetAt: timestamp("weekResetAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type DonationReputationRow = typeof donationReputation.$inferSelect;

/* ─── SOCIAL: FRIENDS ─── */
export const friends = mysqlTable("friends", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  friendId: int("friendId").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type FriendRow = typeof friends.$inferSelect;

export const directMessages = mysqlTable("direct_messages", {
  id: int("id").primaryKey().autoincrement(),
  fromUserId: int("fromUserId").notNull(),
  toUserId: int("toUserId").notNull(),
  content: text("content").notNull(),
  readAt: timestamp("readAt"),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
});
export type DirectMessageRow = typeof directMessages.$inferSelect;

export const guildRecruitment = mysqlTable("guild_recruitment", {
  id: int("id").primaryKey().autoincrement(),
  guildId: int("guildId").notNull().unique(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  status: varchar("status", { length: 20 }).notNull().default("open"),
  minLevel: int("minLevel").notNull().default(1),
  preferredClasses: json("preferredClasses").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type GuildRecruitmentRow = typeof guildRecruitment.$inferSelect;

/* ─── LORE JOURNAL ─── */
export const loreJournalEntries = mysqlTable("lore_journal_entries", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  wordCount: int("wordCount").notNull().default(0),
  xpEarned: int("xpEarned").notNull().default(0),
  linkedEntityId: varchar("linkedEntityId", { length: 100 }),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type LoreJournalEntryRow = typeof loreJournalEntries.$inferSelect;

export const writingStreaks = mysqlTable("writing_streaks", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().unique(),
  currentStreak: int("currentStreak").notNull().default(0),
  longestStreak: int("longestStreak").notNull().default(0),
  lastWriteDate: varchar("lastWriteDate", { length: 10 }),
  totalWordsWritten: int("totalWordsWritten").notNull().default(0),
  totalEntries: int("totalEntries").notNull().default(0),
  streakProtectionUsed: boolean("streakProtectionUsed").notNull().default(false),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type WritingStreakRow = typeof writingStreaks.$inferSelect;

/* ═══════════════════════════════════════════════════════
   PROMO CODES — Warhammer Tacticus-style redemption system
   ═══════════════════════════════════════════════════════ */

export const promoCodes = mysqlTable("promo_codes", {
  id: int("id").primaryKey().autoincrement(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  description: text("description"),
  rewardType: mysqlEnum("rewardType", ["cards", "dream_currency", "credits", "cosmetics", "mixed"]).notNull(),
  rewardValue: json("rewardValue").notNull(), // { dream?: number, credits?: number, cards?: string[], cosmetics?: string[] }
  maxRedemptions: int("maxRedemptions").default(-1), // -1 = unlimited
  currentRedemptions: int("currentRedemptions").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  expiresAt: timestamp("expiresAt"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type PromoCodeRow = typeof promoCodes.$inferSelect;

export const promoCodeRedemptions = mysqlTable("promo_code_redemptions", {
  id: int("id").primaryKey().autoincrement(),
  promoCodeId: int("promoCodeId").notNull(),
  userId: int("userId").notNull(),
  redeemedAt: timestamp("redeemedAt").defaultNow().notNull(),
});
export type PromoCodeRedemptionRow = typeof promoCodeRedemptions.$inferSelect;

/* ═══════════════════════════════════════════════════════
   ARCHITECT'S CONSOLE — Community Governance
   Community votes, live events, and audit logging for the
   lore-native admin panel themed as the Architect's
   surveillance/control interface.
   ═══════════════════════════════════════════════════════ */

export const communityVotes = mysqlTable("community_votes", {
  id: int("id").primaryKey().autoincrement(),
  voteId: varchar("voteId", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["lore", "event", "content", "quest", "sacrifice"]).notNull(),
  status: mysqlEnum("status", ["active", "closed", "announced"]).default("active").notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  endsAt: timestamp("endsAt").notNull(),
  impactType: varchar("impactType", { length: 128 }),
  impactPayload: json("impactPayload"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const voteOptions = mysqlTable("vote_options", {
  id: int("id").primaryKey().autoincrement(),
  voteId: varchar("voteId", { length: 128 }).notNull(),
  optionNumber: int("optionNumber").notNull(),
  optionText: varchar("optionText", { length: 255 }).notNull(),
  description: text("description"),
  rewardOnWin: json("rewardOnWin"),
  voteCount: int("voteCount").default(0).notNull(),
  isWinner: boolean("isWinner").default(false).notNull(),
});

export const playerVotes = mysqlTable("player_votes", {
  id: int("id").primaryKey().autoincrement(),
  voteId: varchar("voteId", { length: 128 }).notNull(),
  userId: int("userId").notNull(),
  optionNumber: int("optionNumber").notNull(),
  votedAt: timestamp("votedAt").defaultNow().notNull(),
}, (table) => ({
  /** Prevent duplicate votes — one vote per user per poll */
  uniqueUserVote: uniqueIndex("uq_player_votes_user_vote").on(table.voteId, table.userId),
  /** Fast lookup by vote */
  voteIdx: index("idx_player_votes_vote").on(table.voteId),
}));

// ═══ ARCHITECT'S CONSOLE — Live Events ═══
export const adminEvents = mysqlTable("admin_events", {
  id: int("id").primaryKey().autoincrement(),
  eventKey: varchar("eventKey", { length: 128 }).notNull().unique(),
  eventName: varchar("eventName", { length: 255 }).notNull(),
  eventType: mysqlEnum("eventType", ["notification", "living_universe", "seasonal_bonus", "instance_spawn", "narrative_trigger", "multiplier"]).notNull(),
  message: text("message"),
  targetAudience: mysqlEnum("targetAudience", ["all", "by_level", "by_guild", "specific"]).default("all").notNull(),
  targetPayload: json("targetPayload"),
  gameStateChanges: json("gameStateChanges"),
  isActive: boolean("isActive").default(false).notNull(),
  scheduledFor: timestamp("scheduledFor"),
  activatedAt: timestamp("activatedAt"),
  expiresAt: timestamp("expiresAt"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ═══ ARCHITECT'S CONSOLE — Audit Log ═══
export const adminAuditLog = mysqlTable("admin_audit_log", {
  id: int("id").primaryKey().autoincrement(),
  adminId: int("adminId").notNull(),
  action: varchar("action", { length: 128 }).notNull(),
  details: json("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══ EIDOLON SOUL BOND ═══
export const eidolonBonds = mysqlTable("eidolon_bonds", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  eidolonId: varchar("eidolonId", { length: 64 }).notNull(),
  bond: int("bond").default(0).notNull(),
  level: int("level").default(1).notNull(),
  xp: int("xp").default(0).notNull(),
  stage: mysqlEnum("stage", ["fragment", "companion", "ascended", "spectral"]).default("fragment").notNull(),
  rarity: mysqlEnum("rarity", ["common", "uncommon", "rare", "epic", "legendary", "mythic"]).default("common").notNull(),
  health: mysqlEnum("health", ["healthy", "hurt", "critical", "downed", "dead"]).default("healthy").notNull(),
  injury: int("injury").default(0).notNull(),
  deathCount: int("deathCount").default(0).notNull(),
  isResonant: boolean("isResonant").default(false).notNull(),
  isSoulBound: boolean("isSoulBound").default(true).notNull(),
  nickname: varchar("nickname", { length: 64 }),
  memories: json("memories").$type<string[]>().default([]),
  unlockedSkills: json("unlockedSkills").$type<string[]>().default([]),
  skillPoints: int("skillPoints").default(0).notNull(),
  missionsShared: int("missionsShared").default(0).notNull(),
  questsCompleted: json("questsCompleted").$type<string[]>().default([]),
  moralityDissonance: int("moralityDissonance").default(0).notNull(),
  /** Evolution XP — separate from regular XP, tracks progress toward next stage */
  evolutionXp: int("evolutionXp").default(0).notNull(),
  /** Death cause for narrative purposes */
  deathCause: varchar("deathCause", { length: 64 }),
  /** Whether eidolon exists as spectral form (ghost-blue overlay) */
  isSpectral: boolean("isSpectral").default(false).notNull(),
  /** Game system where companion died — gets +10% spectral bonus */
  spectralBonusSystem: varchar("spectralBonusSystem", { length: 64 }),
  /** Soul Stone absorption tracking — Hierarchy path */
  redStonesAbsorbed: int("redStonesAbsorbed").default(0).notNull(),
  /** Soul Stone absorption tracking — Dreamer path */
  goldFragmentsAbsorbed: int("goldFragmentsAbsorbed").default(0).notNull(),
  /** Eidolon transformation state */
  transformState: mysqlEnum("transformState", ["normal", "hierarchy_evolved", "dreamer_evolved"]).default("normal").notNull(),
  lastFed: timestamp("lastFed"),
  lastInteraction: timestamp("lastInteraction"),
  boundAt: timestamp("boundAt").defaultNow().notNull(),
  diedAt: timestamp("diedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_eidolon_bonds_user_id").on(table.userId),
}));

export const eidolonMemorial = mysqlTable("eidolon_memorial", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  eidolonId: varchar("eidolonId", { length: 64 }).notNull(),
  eidolonName: varchar("eidolonName", { length: 128 }).notNull(),
  bondAtDeath: int("bondAtDeath").notNull(),
  causeOfDeath: varchar("causeOfDeath", { length: 255 }).notNull(),
  daysActive: int("daysActive").notNull(),
  flowers: int("flowers").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_eidolon_memorial_user_id").on(table.userId),
}));

// ═══════════════════════════════════════════════════════
//  PET BATTLES — Server-Persisted Arena Combat
// ═══════════════════════════════════════════════════════

/** Player's pet roster — acquired specimens ready for battle */
export const playerPets = mysqlTable("player_pets", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  petId: varchar("petId", { length: 64 }).notNull(),
  species: varchar("species", { length: 64 }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  evolutionStage: int("evolutionStage").default(1).notNull(),
  bond: int("bond").default(0).notNull(),
  skillPoints: int("skillPoints").default(0).notNull(),
  /** Current HP (injury tracking between battles) */
  currentHp: int("currentHp").default(100).notNull(),
  maxHp: int("maxHp").default(100).notNull(),
  /** Unlocked moves beyond the standard 3 */
  unlockedMoves: json("unlockedMoves").$type<string[]>(),
  /** Evolution XP for pet evolution tracking */
  evolutionXp: int("evolutionXp").default(0).notNull(),
  /** Total wins / losses / kills */
  wins: int("wins").default(0).notNull(),
  losses: int("losses").default(0).notNull(),
  kills: int("kills").default(0).notNull(),
  /** Injury cooldown — timestamp when pet can fight again */
  injuredUntil: timestamp("injuredUntil"),
  acquiredAt: timestamp("acquiredAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_player_pets_user_id").on(table.userId),
}));

/** Battle history — persisted match results */
export const petBattleHistory = mysqlTable("pet_battle_history", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  petId: varchar("petId", { length: 64 }).notNull(),
  opponentSpecies: varchar("opponentSpecies", { length: 64 }).notNull(),
  arenaTier: varchar("arenaTier", { length: 64 }).notNull(),
  won: boolean("won").notNull(),
  rounds: int("rounds").notNull(),
  perfectVictory: boolean("perfectVictory").default(false).notNull(),
  /** Rewards granted */
  bondGain: int("bondGain").default(0).notNull(),
  dreamEarned: int("dreamEarned").default(0).notNull(),
  xpEarned: int("xpEarned").default(0).notNull(),
  injuryDealt: int("injuryDealt").default(0).notNull(),
  /** Full battle log (JSON array of BattleLogEntry) */
  battleLog: json("battleLog"),
  foughtAt: timestamp("foughtAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_pet_battle_history_user_id").on(table.userId),
}));

// ═══════════════════════════════════════════════════════
//  COMPANION CHAT — Persistent Message History
// ═══════════════════════════════════════════════════════

/** Chat messages between player and NPC companions (Elara, The Human) */
export const companionMessages = mysqlTable("companion_messages", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  companionId: varchar("companionId", { length: 64 }).notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  relationshipLevel: int("relationshipLevel").default(0).notNull(),
  category: varchar("category", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userCompanionIdx: index("idx_companion_messages_user").on(table.userId, table.companionId, table.createdAt),
}));

/** Companion relationship progression (server-authoritative) */
export const companionRelationships = mysqlTable("companion_relationships", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  companionId: varchar("companionId", { length: 64 }).notNull(),
  relationshipLevel: int("relationshipLevel").default(0).notNull(),
  totalMessages: int("totalMessages").default(0).notNull(),
  backstoryUnlocked: json("backstoryUnlocked").$type<string[]>(),
  questsCompleted: json("questsCompleted").$type<string[]>(),
  romanceActive: boolean("romanceActive").default(false).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqueUserCompanion: uniqueIndex("uq_companion_rel_user").on(table.userId, table.companionId),
}));

/* ═══════════════════════════════════════════════════════
   ANALYTICS — Privacy-first player event tracking
   No PII stored — only user IDs and event data.
   ═══════════════════════════════════════════════════════ */

export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  event: varchar("event", { length: 128 }).notNull(),
  properties: json("properties").$type<Record<string, string | number | boolean>>(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  clientTimestamp: timestamp("clientTimestamp").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  idxUserId: index("idx_analytics_user").on(table.userId),
  idxEvent: index("idx_analytics_event").on(table.event),
  idxCreatedAt: index("idx_analytics_created").on(table.createdAt),
}));

/* ═══════════════════════════════════════════════════════
   DAILY BRIEF — The Living Ark's daily event system
   3 events/day (gameplay, story, relationship) seeded
   deterministically per user per day.
   ═══════════════════════════════════════════════════════ */

/**
 * Daily brief events — generated and persisted per user per day.
 * Each brief contains exactly 3 events (gameplay, story, relationship).
 */
export const dailyBriefs = mysqlTable("daily_briefs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Date string YYYY-MM-DD */
  briefDate: varchar("briefDate", { length: 10 }).notNull(),
  /** The 3 events as JSON */
  events: json("events").$type<{
    gameplay: { id: string; roomId: string; type: string; title: string; description: string; npcId?: string; song?: string };
    story: { id: string; roomId: string; type: string; title: string; description: string; npcId?: string; song?: string };
    relationship: { id: string; roomId: string; type: string; title: string; description: string; npcId?: string; song?: string };
  }>().notNull(),
  /** Which events the user has interacted with */
  completedEvents: json("completedEvents").$type<string[]>(),
  /** Result data from processing events (trust changes, rewards given) */
  results: json("results").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  idxUserDate: uniqueIndex("uq_daily_brief_user_date").on(table.userId, table.briefDate),
  idxBriefDate: index("idx_daily_brief_date").on(table.briefDate),
}));

export type DailyBrief = typeof dailyBriefs.$inferSelect;

/* ═══════════════════════════════════════════════════════
   PRESSURE EVENTS — Living Universe behavior tracking
   Records individual player actions that feed community
   pressure meters for emergent events.
   ═══════════════════════════════════════════════════════ */

/**
 * Pressure events — every death, betrayal, trust gain, etc.
 * Aggregated community-wide to determine emergent events.
 */
export const pressureEvents = mysqlTable("pressure_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Pressure type: deaths, trustGains, viralExposures, loreDiscoveries, betrayals,
   *  moralityHumanity, moralityMachine, truthRevealed, healingDone, exploration */
  pressureType: varchar("pressureType", { length: 64 }).notNull(),
  /** How much pressure this event contributes */
  amount: int("amount").notNull().default(1),
  /** Source context: what caused this (fight_death, npc_trust_elara, tome_found, etc.) */
  source: varchar("source", { length: 128 }).notNull(),
  /** Optional metadata */
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  idxPressureType: index("idx_pressure_type").on(table.pressureType),
  idxCreatedAt: index("idx_pressure_created").on(table.createdAt),
  idxUserId: index("idx_pressure_user").on(table.userId),
}));

export type PressureEvent = typeof pressureEvents.$inferSelect;

/**
 * Universe event state — tracks which emergent events are active,
 * their accumulated pressure, and when they were last triggered.
 */
export const universeEventState = mysqlTable("universe_event_state", {
  id: int("id").autoincrement().primaryKey(),
  eventId: varchar("eventId", { length: 64 }).notNull().unique(),
  /** Is this event currently active */
  isActive: int("isActive").notNull().default(0),
  /** Accumulated pressure score */
  pressureScore: int("pressureScore").notNull().default(0),
  /** When the event was last activated */
  activatedAt: timestamp("activatedAt"),
  /** When this active event should expire (community has a window to resolve) */
  expiresAt: timestamp("expiresAt"),
  /** When the event was last resolved */
  resolvedAt: timestamp("resolvedAt"),
  /** How many players have interacted with the event (quests completed, counter-actions) */
  playerParticipation: int("playerParticipation").notNull().default(0),
  /** Number of times this event has occurred */
  occurrenceCount: int("occurrenceCount").notNull().default(0),
  /** Current cycle data (consequences applied, player participation) */
  cycleData: json("cycleData").$type<Record<string, unknown>>(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UniverseEventState = typeof universeEventState.$inferSelect;

/**
 * Universe event history — append-only log of resolved events.
 * Every time an event concludes (community success, community failure, or
 * expiry), a row is written here so we keep a permanent record of how the
 * Living Universe has evolved.
 */
export const universeEventHistory = mysqlTable("universe_event_history", {
  id: int("id").autoincrement().primaryKey(),
  eventId: varchar("eventId", { length: 64 }).notNull(),
  activatedAt: timestamp("activatedAt").notNull(),
  resolvedAt: timestamp("resolvedAt").defaultNow().notNull(),
  /** How the event ended: "community_success", "community_failure", "expired", "admin" */
  resolution: varchar("resolution", { length: 32 }).notNull(),
  /** Final accumulated pressure score at resolution */
  finalPressureScore: int("finalPressureScore").notNull().default(0),
  /** Total players who participated in the event */
  totalParticipants: int("totalParticipants").notNull().default(0),
  /** Summary of effects applied during the event (cached for fast lookup) */
  effectsSummary: json("effectsSummary").$type<Record<string, unknown>>(),
}, (table) => ({
  idxEventId: index("idx_universe_history_event").on(table.eventId),
  idxResolvedAt: index("idx_universe_history_resolved").on(table.resolvedAt),
}));

export type UniverseEventHistory = typeof universeEventHistory.$inferSelect;

/* ═══════════════════════════════════════════════════════
   ROOM STATES — Visual evolution of Ark rooms based
   on player actions. Rooms change over time.
   ═══════════════════════════════════════════════════════ */

/**
 * Room states — per-user visual/functional state for each Ark room.
 * Tracks decorations, damage, crew presence, upgrades.
 */
export const roomStates = mysqlTable("room_states", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  roomId: varchar("roomId", { length: 64 }).notNull(),
  /** Visual tier: 0=default, 1=decorated, 2=upgraded, 3=masterwork */
  visualTier: int("visualTier").notNull().default(0),
  /** Damage level from Terminus/quarantine events: 0=pristine, 1=scuffed, 2=damaged, 3=critical */
  damageLevel: int("damageLevel").notNull().default(0),
  /** Number of times crafted in this room (for Engineering evolution) */
  craftCount: int("craftCount").notNull().default(0),
  /** Number of quarantine events weathered */
  quarantineCount: int("quarantineCount").notNull().default(0),
  /** Crew members assigned to this room (NPC IDs after Crew Awakening) */
  crewAssigned: json("crewAssigned").$type<string[]>(),
  /** Active decorations/modifications */
  decorations: json("decorations").$type<string[]>(),
  /** Room-specific state (e.g., conspiracy board pins for Bridge, tools for Engineering) */
  roomData: json("roomData").$type<Record<string, unknown>>(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  idxUserRoom: uniqueIndex("uq_room_state_user_room").on(table.userId, table.roomId),
  idxUserId: index("idx_room_state_user").on(table.userId),
}));

export type RoomState = typeof roomStates.$inferSelect;

/* ═══════════════════════════════════════════════════════
   GRADUATE LEGION — Deployed apprentice army system
   Graduated apprentices fill roles: army_leader, trade_envoy,
   tower_captain, companion, cryo_vault, sacrificed, relationship_gift.
   ═══════════════════════════════════════════════════════ */

export const graduateDeployments = mysqlTable("graduate_deployments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Apprentice ID (from client-side apprentice system) */
  graduateId: varchar("graduateId", { length: 128 }).notNull(),
  /** Graduate's name for display */
  graduateName: varchar("graduateName", { length: 128 }).notNull(),
  /** Archetype of the apprentice */
  archetype: varchar("archetype", { length: 64 }).notNull(),
  /** Rarity tier */
  rarity: varchar("rarity", { length: 32 }).notNull(),
  /** Deployed role */
  role: varchar("role", { length: 64 }).notNull(),
  /** Whether this deployment is currently active */
  active: boolean("active").default(true).notNull(),
  /** Computed bonuses JSON */
  bonuses: json("bonuses").$type<{ target: string; value: number; label: string }[]>(),
  /** Role-specific deployment payload */
  payload: json("payload").$type<Record<string, unknown>>(),
  deployedAt: timestamp("deployedAt").defaultNow().notNull(),
  recalledAt: timestamp("recalledAt"),
}, (table) => ({
  idxUserId: index("idx_graduate_deployments_user").on(table.userId),
  idxRole: index("idx_graduate_deployments_role").on(table.role),
}));

export type GraduateDeployment = typeof graduateDeployments.$inferSelect;

/* ═══════════════════════════════════════════════════════
   FEATURE FLAGS — Toggle game features without deploys
   ═══════════════════════════════════════════════════════ */

export const featureFlags = mysqlTable("feature_flags", {
  id: int("id").autoincrement().primaryKey(),
  featureName: varchar("featureName", { length: 128 }).notNull().unique(),
  enabled: int("enabled").notNull().default(1),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  updatedBy: varchar("updatedBy", { length: 255 }),
});

export type FeatureFlag = typeof featureFlags.$inferSelect;

/* ═══════════════════════════════════════════════════════
   DEAD MAN'S CIRCUIT — Seasonal kart racing on bone-tracks
   ═══════════════════════════════════════════════════════ */

export const circuitSeasons = mysqlTable("circuit_seasons", {
  id: int("id").autoincrement().primaryKey(),
  seasonNumber: int("seasonNumber").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  phase: int("phase").notNull().default(1), // 1, 2, or 3
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt").notNull(),
  status: mysqlEnum("status", ["upcoming", "active", "ended"]).default("upcoming").notNull(),
  trackPreset: varchar("trackPreset", { length: 64 }).default("the_first_circuit"),
  boneObstacles: json("boneObstacles").$type<{x:number,z:number}[]>().default([]),
  totalRaces: int("totalRaces").default(0).notNull(),
  totalDeaths: int("totalDeaths").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CircuitSeasonRow = typeof circuitSeasons.$inferSelect;

export const circuitRaceResults = mysqlTable("circuit_race_results", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  seasonId: int("seasonId").notNull(),
  cloneDesignation: varchar("cloneDesignation", { length: 64 }).notNull(),
  finishPosition: int("finishPosition").notNull(),
  totalTimeMs: int("totalTimeMs").notNull(),
  bestLapMs: int("bestLapMs"),
  cloneSurvived: int("cloneSurvived").notNull().default(1),
  rivalKills: int("rivalKills").notNull().default(0),
  abilitiesUsed: json("abilitiesUsed").$type<string[]>().default([]),
  cpEarned: int("cpEarned").notNull().default(0),
  cpBreakdown: json("cpBreakdown").$type<Record<string, number>>(),
  phase: int("phase").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_circuit_results_user").on(table.userId),
  seasonIdx: index("idx_circuit_results_season").on(table.seasonId),
}));

export type CircuitRaceResultRow = typeof circuitRaceResults.$inferSelect;

export const circuitLeaderboard = mysqlTable("circuit_leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  seasonId: int("seasonId").notNull(),
  totalCp: int("totalCp").notNull().default(0),
  racesCompleted: int("racesCompleted").notNull().default(0),
  bestPosition: int("bestPosition").notNull().default(99),
  bestLapMs: int("bestLapMs"),
  totalKills: int("totalKills").notNull().default(0),
  clonesSurvived: int("clonesSurvived").notNull().default(0),
  clonesLost: int("clonesLost").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userSeasonIdx: uniqueIndex("uq_circuit_lb_user_season").on(table.userId, table.seasonId),
}));

export type CircuitLeaderboardRow = typeof circuitLeaderboard.$inferSelect;

export const codexContributions = mysqlTable("codex_contributions", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  category: mysqlEnum("category", [
    "theory",
    "analysis",
    "alternate_history",
    "character_study",
    "prophecy_interpretation",
  ]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  referencedEntities: json("referencedEntities").$type<string[]>().default([]),
  upvotes: int("upvotes").notNull().default(0),
  downvotes: int("downvotes").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  status: mysqlEnum("status", ["pending", "approved", "featured", "rejected"]).notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  authorIdx: index("idx_codex_contributions_author").on(table.authorId),
  statusIdx: index("idx_codex_contributions_status").on(table.status),
}));

export type CodexContributionRow = typeof codexContributions.$inferSelect;

export const codexVotes = mysqlTable("codex_votes", {
  id: int("id").autoincrement().primaryKey(),
  contributionId: int("contributionId").notNull(),
  userId: int("userId").notNull(),
  direction: mysqlEnum("direction", ["up", "down"]).notNull(),
}, (table) => ({
  userContributionIdx: uniqueIndex("uq_codex_votes_user_contribution").on(table.userId, table.contributionId),
}));

/* ═══════════════════════════════════════════════════════
   ADMIN RBAC — Two-admin approval flow for economy knobs
   Moderators submit requests; two distinct admins must
   approve before the dispatcher applies the change.
   ═══════════════════════════════════════════════════════ */

export const adminApprovalRequests = mysqlTable("admin_approval_requests", {
  id: int("id").autoincrement().primaryKey(),
  requestedBy: int("requestedBy").notNull(),
  action: varchar("action", { length: 64 }).notNull(),
  targetKey: varchar("targetKey", { length: 128 }).notNull(),
  newValue: json("newValue"),
  reason: text("reason"),
  status: mysqlEnum("status", ["pending", "executed", "rejected"]).default("pending").notNull(),
  approvals: json("approvals").$type<Array<{ adminId: number; approvedAt: string }>>().default([]).notNull(),
  rejectedBy: int("rejectedBy"),
  rejectionReason: text("rejectionReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  executedAt: timestamp("executedAt"),
  rejectedAt: timestamp("rejectedAt"),
}, (table) => ({
  statusIdx: index("idx_admin_approval_status").on(table.status),
  requestedByIdx: index("idx_admin_approval_requested_by").on(table.requestedBy),
  createdAtIdx: index("idx_admin_approval_created_at").on(table.createdAt),
}));

export type AdminApprovalRequest = typeof adminApprovalRequests.$inferSelect;
export type InsertAdminApprovalRequest = typeof adminApprovalRequests.$inferInsert;

export type CodexVoteRow = typeof codexVotes.$inferSelect;
