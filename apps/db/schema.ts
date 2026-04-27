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
  /** Deterministic match seed — used for replay reproduction. */
  seed: varchar("seed", { length: 64 }),
  /** Rules engine version the match was played on — for replay pinning. */
  rulesVersion: varchar("rulesVersion", { length: 16 }),
  /** Gzipped JSON action log — the full replay data. */
  actionLog: text("actionLog"),
  /** SHA-256 hash of the final game state — desync audit + replay verify. */
  finalStateHash: varchar("finalStateHash", { length: 64 }),
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
  /**
   * §G.2 foundation choice — Humanity (Mourner's Coat) or Machine
   * (First Chassis). Drives the deterministic starter Base Mask +
   * Base Suit via resolveStarterLoadout(). Defaults to "humanity"
   * so saved characters hydrate without a migration pass.
   */
  foundation: mysqlEnum("foundation", ["humanity", "machine"]).notNull().default("humanity"),
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
  /** Premium currency — purchased with real money (or granted by admin). */
  gems: int("gems").notNull().default(0),
  /** Lifetime gems purchased via real-money; read-only rollup for rank perks. */
  totalGemsPurchased: int("totalGemsPurchased").notNull().default(0),
  /** Total Dream ever earned (for milestones) */
  totalDreamEarned: int("totalDreamEarned").notNull().default(0),
  /**
   * Hidden Game-Master difficulty scalar — each +1 represents one
   * irreversible cost-paying decision the operative has made (the
   * Med Bay DNA donation is the first source; more beats will add
   * points as they come online). Read by
   * apps/shared/tcg-core/story/encounter.ts at match init and
   * translated into small boss-side startingBonuses. Never surfaced
   * to the player — the sting shows up only in how fights feel.
   */
  difficultyModifier: int("difficultyModifier").notNull().default(0),
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
 * Processed Stripe webhook events — event-level idempotency log.
 *
 * The unique index on `storePurchases.stripePaymentIntentId` (above)
 * catches replays for purchases that carry an intent id. Credit and
 * Dream purchases pay through a flow that produces no payment intent,
 * so the intent column is NULL and MySQL treats every NULL as
 * non-conflicting — meaning a replayed webhook for a credit purchase
 * could double-fulfill before this table existed.
 *
 * The Stripe webhook handler inserts a row here keyed by the Stripe
 * `event.id` *before* doing any fulfillment work. If the insert
 * fails with a unique-violation, the event is a replay and the
 * handler returns a 200 immediately, no fulfillment runs. Records
 * are kept indefinitely so old replays remain blocked even after
 * the original purchase row has been moved or archived.
 */
export const processedWebhookEvents = mysqlTable(
  "processed_webhook_events",
  {
    id: int("id").autoincrement().primaryKey(),
    /** Stripe `event.id` (e.g. `evt_…`). Unique. */
    eventId: varchar("eventId", { length: 256 }).notNull(),
    /** Stripe event type (e.g. `checkout.session.completed`). */
    eventType: varchar("eventType", { length: 128 }).notNull(),
    /** Source of the webhook — currently only `stripe`. Future-proof. */
    source: varchar("source", { length: 32 }).notNull().default("stripe"),
    processedAt: timestamp("processedAt").defaultNow().notNull(),
  },
  (table) => ({
    uqEventId: uniqueIndex("uq_processed_webhook_events_event_id").on(
      table.eventId,
    ),
    typeIdx: index("idx_processed_webhook_events_type").on(table.eventType),
  }),
);

export type ProcessedWebhookEvent = typeof processedWebhookEvents.$inferSelect;

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

/**
 * Arena essences — the "Collector's Ledger" trophy system for the
 * Collectors Arena story mode. One row per (userId, fighterId): tracks
 * how many times the player has defeated that fighter, the best rarity
 * seen across all harvests, and first/last harvest timestamps.
 *
 * Rarity is upgraded on each harvest via maxRarity() in the
 * essenceHarvest router, never downgraded. See
 * apps/client/src/game/essenceHarvest.ts for the registry + rarity
 * derivation rules.
 */
export const arenaEssences = mysqlTable("arena_essences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Matches FighterData.id in gameData.ts */
  fighterId: varchar("fighterId", { length: 128 }).notNull(),
  /** Number of times the fighter has been defeated */
  count: int("count").notNull().default(0),
  /** Highest rarity seen across all harvests of this fighter */
  bestRarity: mysqlEnum("bestRarity", [
    "common", "rare", "epic", "legendary", "mythic",
  ]).notNull().default("common"),
  firstHarvestedAt: timestamp("firstHarvestedAt").defaultNow().notNull(),
  lastHarvestedAt: timestamp("lastHarvestedAt").defaultNow().notNull(),
}, (table) => ({
  userFighterIdx: uniqueIndex("idx_arena_essences_user_fighter").on(table.userId, table.fighterId),
  userIdx: index("idx_arena_essences_user").on(table.userId),
}));

export type ArenaEssence = typeof arenaEssences.$inferSelect;
export type InsertArenaEssence = typeof arenaEssences.$inferInsert;


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
  /** Timestamp of the last time ELO decay was applied for this user.
   *  Used to make decay idempotent across repeated reads — the
   *  decay helper only applies delta since this anchor, never the
   *  full (now - lastMatchAt) window on every check. */
  lastDecayAt: timestamp("lastDecayAt"),
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
    "pet_death", "pet_acquired",
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

/** Per-user puzzle solve history — gates first-solve rewards and tracks stats. */
export const chessPuzzleProgress = mysqlTable("chess_puzzle_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  puzzleId: varchar("puzzleId", { length: 32 }).notNull(),
  solvedAt: timestamp("solvedAt").defaultNow().notNull(),
  attempts: int("attempts").notNull().default(1),
}, (table) => ({
  userPuzzleUq: uniqueIndex("idx_chess_puzzle_progress_user_puzzle").on(table.userId, table.puzzleId),
  userIdx: index("idx_chess_puzzle_progress_user").on(table.userId),
}));
export type ChessPuzzleProgress = typeof chessPuzzleProgress.$inferSelect;

/** Persistent participant state for a chess tournament.
 *
 *  IMPORTANT: `score` and `tieBreak` are stored as 2× the actual
 *  point value to keep them as plain integers (avoiding MySQL DECIMAL).
 *  A win is +2, a draw is +1, half-Buchholz is +1 per opponent half-point.
 *  All read sites in the chess router divide by 2 before returning
 *  values to the client. */
export const chessTournamentParticipants = mysqlTable("chess_tournament_participants", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 128 }).notNull(),
  /** 2× actual score — divide by 2 for display. */
  score: int("score").notNull().default(0),
  /** 2× actual tie-break — divide by 2 for display. */
  tieBreak: int("tieBreak").notNull().default(0),
  active: boolean("active").notNull().default(true),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
}, (table) => ({
  tournamentUserUq: uniqueIndex("idx_chess_tournament_participants_tourney_user").on(table.tournamentId, table.userId),
  tournamentIdx: index("idx_chess_tournament_participants_tournament").on(table.tournamentId),
  userIdx: index("idx_chess_tournament_participants_user").on(table.userId),
}));
export type ChessTournamentParticipant = typeof chessTournamentParticipants.$inferSelect;

/** Per-round pairings for a chess tournament, linked to the chess_games row that resolves them. */
export const chessTournamentPairings = mysqlTable("chess_tournament_pairings", {
  id: int("id").autoincrement().primaryKey(),
  tournamentId: int("tournamentId").notNull(),
  round: int("round").notNull(),
  whiteId: int("whiteId").notNull(),
  blackId: int("blackId").notNull(),
  whiteResult: mysqlEnum("whiteResult", ["win", "loss", "draw"]),
  reported: boolean("reported").notNull().default(false),
  gameId: int("gameId"),
  deadlineAt: timestamp("deadlineAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  tournamentIdx: index("idx_chess_tournament_pairings_tournament").on(table.tournamentId),
  tournamentRoundIdx: index("idx_chess_tournament_pairings_tournament_round").on(table.tournamentId, table.round),
}));
export type ChessTournamentPairing = typeof chessTournamentPairings.$inferSelect;

/* ═══════════════════════════════════════════════════════
   CHESS TUTORIAL PROGRESS — Celebration Game Master's academy.
   Tracks which of the 7 chess tutorial gates the player has
   completed, whether they took the skip-challenge path, and
   whether the Celebration Teaching Set memory-resin keepsake
   has been granted. The tutorial content itself lives in
   apps/shared/tcg-core/story/chessTutorial*.ts
   ═══════════════════════════════════════════════════════ */

export const chessTutorialProgress = mysqlTable("chess_tutorial_progress", {
  userId: int("userId").primaryKey(),
  /** Current active gate (1-7). 8 indicates all gates complete. */
  currentGate: int("currentGate").notNull().default(1),
  /** Array of completed gate numbers, e.g. [1, 2, 3]. */
  completedGates: json("completedGates").$type<number[]>().notNull(),
  /** Current step index within the active gate (0-indexed). */
  currentStep: int("currentStep").notNull().default(0),
  /** Set the first time the player picks the "Challenge me" option on the Gate 1 intro. */
  skippedAt: timestamp("skippedAt"),
  /** True iff the player actually beat the maximum-difficulty Celebration
   *  Game Master on the skip-challenge match. Unlocks the Celebration
   *  Teaching Jacket cosmetic and fast-forwards the full tutorial. */
  skipMatchWon: boolean("skipMatchWon").notNull().default(false),
  /** True once the Gate 7 reveal has been shown and the Celebration
   *  Teaching Set memory-resin keepsake has been granted. */
  keepsakeGranted: boolean("keepsakeGranted").notNull().default(false),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});
export type ChessTutorialProgress = typeof chessTutorialProgress.$inferSelect;


/* ═══════════════════════════════════════════════════════
   ORACLE DECK — The 23-card Dischordian tarot system (Phase E).
   Every player builds a collection over the course of the Saga.
   Once per day they can cast a free 1-card reading; before a
   match they can spend an Oracle charge for a 3-card spread;
   once per week they can cast a 5-card spread for a bigger
   bonus. Readings are deterministic — same seed always produces
   the same draw — so the Oracle can audit them.
   ═══════════════════════════════════════════════════════ */

export const oracleDeckProgress = mysqlTable("oracle_deck_progress", {
  userId: int("userId").primaryKey(),
  /** Slugs of cards the player has unlocked. Starts empty; The
   *  Prisoner is always considered owned by the draw engine even
   *  when this array does not contain it. */
  ownedSlugs: json("ownedSlugs").$type<string[]>().notNull(),
  /** Oracle charges the player currently holds. Earned from
   *  specific milestones (Chapter completion, governance
   *  participation, etc.). Spent on pre-match and weekly
   *  readings (daily reads are free). */
  charges: int("charges").notNull().default(0),
  /** Day-number of the player's most recent daily reading
   *  (Math.floor(Date.now() / 86_400_000)). Used to prevent
   *  re-casting within the same day. */
  lastDailyDayNumber: int("lastDailyDayNumber"),
  /** Week-number of the player's most recent weekly spread
   *  (Math.floor(dayNumber / 7)). Prevents re-casting within
   *  the same week. */
  lastWeeklyWeekNumber: int("lastWeeklyWeekNumber"),
  /** Whether the player has unlocked the (hidden) Fnord card
   *  via the secret discovery path. */
  fnordUnlocked: boolean("fnordUnlocked").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type OracleDeckProgress = typeof oracleDeckProgress.$inferSelect;

/** Log of every Oracle reading the player has cast. The router
 *  persists the seed so the reading is perfectly reproducible —
 *  the Oracle can audit any row by re-running castReading() with
 *  the stored userId + spreadKind + seedKey and comparing the
 *  draw JSON against the stored `draws` field. */
export const oracleReadings = mysqlTable("oracle_readings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** "daily" | "pre_match" | "weekly" */
  spreadKind: varchar("spreadKind", { length: 32 }).notNull(),
  /** The deterministic seed key (day number, week number, match
   *  id, etc.). String for forward compatibility. */
  seedKey: varchar("seedKey", { length: 128 }).notNull(),
  /** The 32-bit hash derived from (userId, spreadKind, seedKey). */
  seed: int("seed").notNull(),
  /** Full reading JSON — spread shape + drawn positions. Used by
   *  the client to re-render past readings without re-casting. */
  draws: json("draws").$type<unknown>().notNull(),
  /** When the reading's buffs start applying. For daily readings
   *  this is the start of the day; for pre-match this is the
   *  moment the match starts; for weekly this is the start of
   *  the week. */
  appliesAt: timestamp("appliesAt").notNull(),
  /** Whether the draw fell back to The Prisoner (player owned
   *  fewer cards than the spread length). */
  fallback: boolean("fallback").notNull().default(false),
  castAt: timestamp("castAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_oracle_readings_user").on(table.userId),
  userKindIdx: index("idx_oracle_readings_user_kind").on(table.userId, table.spreadKind),
  // Uniqueness: one reading per (user, spreadKind, seedKey). Lets
  // the router upsert on re-cast within the same seed window.
  userKindSeedUq: uniqueIndex("uq_oracle_readings_user_kind_seed").on(
    table.userId,
    table.spreadKind,
    table.seedKey,
  ),
}));
export type OracleReadingRow = typeof oracleReadings.$inferSelect;


/* ═══════════════════════════════════════════════════════
   NPC IMPRINTS — Phase F. The long-tail collection goal.
   Every NPC appearance in any game mode logs 1+ imprint
   fragments for that NPC. Crossing thresholds (10/25/50/
   100/200) unlocks the next tier of that NPC's signature
   TCG card — Common → Uncommon → Rare → Epic → Legendary.
   18 Season-1 NPCs × 5 tiers = 90 total imprint cards.
   ═══════════════════════════════════════════════════════ */

export const npcImprints = mysqlTable("npc_imprints", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Stable NPC id — "agent_zero", "iron_lion", etc. Matches
   *  the imprintRegistry slug on the tcg-core side. */
  npcId: varchar("npcId", { length: 64 }).notNull(),
  /** Total fragments accumulated across all sources. */
  fragments: int("fragments").notNull().default(0),
  /** Highest tier the player has unlocked for this NPC, 0-5.
   *  0 = none, 1 = common, 2 = uncommon, 3 = rare, 4 = epic,
   *  5 = legendary. The grant flow updates this when a new
   *  threshold is crossed and adds the corresponding cardDefId
   *  to the player's collection in the same transaction. */
  highestTierUnlocked: int("highestTierUnlocked").notNull().default(0),
  /** Last source the fragments came from, for the activity feed
   *  ("Earned 5 Iron Lion fragments from Chapter 7"). Free-form
   *  string — the service layer enforces the canonical sources. */
  lastSource: varchar("lastSource", { length: 64 }),
  firstSeenAt: timestamp("firstSeenAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // One row per (user, npc).
  userNpcUq: uniqueIndex("uq_npc_imprints_user_npc").on(table.userId, table.npcId),
  userIdx: index("idx_npc_imprints_user").on(table.userId),
}));
export type NpcImprintRow = typeof npcImprints.$inferSelect;

/** Audit log of every fragment grant. Lets the activity feed show
 *  "5 Iron Lion fragments from Chapter 7 — Insurgency Stronghold"
 *  and lets us debug grant pipelines without trusting the sum on
 *  the npcImprints row. Append-only. */
export const npcImprintGrants = mysqlTable("npc_imprint_grants", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  npcId: varchar("npcId", { length: 64 }).notNull(),
  amount: int("amount").notNull(),
  /** Source tag — must match a value the imprintService recognizes. */
  source: varchar("source", { length: 64 }).notNull(),
  /** Optional human-readable detail ("ch7_insurgency_stronghold"). */
  sourceDetail: varchar("sourceDetail", { length: 128 }),
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_npc_imprint_grants_user").on(table.userId),
  userNpcIdx: index("idx_npc_imprint_grants_user_npc").on(table.userId, table.npcId),
}));
export type NpcImprintGrantRow = typeof npcImprintGrants.$inferSelect;


/* ═══════════════════════════════════════════════════════
   FACTION STATS — Phase D1. Per-user, per-faction played
   and won counters used by the faction allegiance card
   system. Crossing play/win thresholds unlocks new cards
   into the player's collection (Phase D10) and scales the
   match-init buff on any allegiance card they already own
   (Phase D3 — applied via createMatchState's startingBonuses).
   ═══════════════════════════════════════════════════════ */

export const factionStats = mysqlTable("faction_stats", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Canonical faction id — architect, insurgency, dreamer,
   *  new_babylon, antiquarian, thought_virus. Neutral is NOT
   *  tracked; allegiance is always toward a specific side. */
  faction: mysqlEnum("faction", [
    "architect",
    "insurgency",
    "dreamer",
    "new_babylon",
    "antiquarian",
    "thought_virus",
  ]).notNull(),
  /** Cumulative matches played with the faction (any outcome). */
  played: int("played").notNull().default(0),
  /** Cumulative wins with the faction. */
  won: int("won").notNull().default(0),
  /** Highest allegiance tier unlocked for this faction (0-6).
   *  0 = none, 1-3 = play-based tiers, 4-6 = win-based tiers. */
  highestTierUnlocked: int("highestTierUnlocked").notNull().default(0),
  firstPlayedAt: timestamp("firstPlayedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // One row per (user, faction).
  userFactionUq: uniqueIndex("uq_faction_stats_user_faction").on(table.userId, table.faction),
  userIdx: index("idx_faction_stats_user").on(table.userId),
}));
export type FactionStatsRow = typeof factionStats.$inferSelect;


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
  /** Deterministic seed — enables pure replay reproduction (WS9). */
  seed: varchar("seed", { length: 64 }),
  /** Rules engine version this replay was recorded under. */
  rulesVersion: varchar("rulesVersion", { length: 16 }),
  /** SHA-256 hash of the final state — replay verification. */
  finalStateHash: varchar("finalStateHash", { length: 64 }),
  /** Player 1 deck/faction config snapshot (JSON). */
  p1Config: json("p1Config").$type<Record<string, unknown>>(),
  /** Player 2 deck/faction config snapshot (JSON). */
  p2Config: json("p2Config").$type<Record<string, unknown>>(),
  /** URL-safe random token for unguessable share-links (#6 / #46).
   *  Populated at saveReplay time via `generateShareToken()`. The
   *  primary `id` is autoincrement-int and therefore enumerable —
   *  share URLs use this column instead so a player posting their
   *  cool match can't have a curious viewer scrape neighbouring
   *  replays. Added by migration 0056 + replaysBootstrap. */
  shareToken: varchar("shareToken", { length: 32 }),
  /** Originating server matchId (#92). Required by the verification
   *  job — the tcg-core engine mints card-instance ids via
   *  `makeCardInstance(matchId, counter, …)`, so a GameState
   *  reconstructed under a different matchId hashes differently from
   *  the stored finalStateHash even when every action replays
   *  identically. Nullable for backwards compatibility with rows
   *  written before migration 0057. */
  matchId: varchar("matchId", { length: 64 }),
  playedAt: timestamp("playedAt").defaultNow().notNull(),
}, (table) => ({
  gameTypeIdx: index("idx_game_replays_game_type").on(table.gameType),
  player1Idx: index("idx_game_replays_player1").on(table.player1Id),
  featuredIdx: index("idx_game_replays_featured").on(table.featured),
}));
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
  /** Skill tree node IDs the player has unlocked for this pet */
  unlockedSkillNodes: json("unlockedSkillNodes").$type<string[]>().default([]),
  /** Completed companion-quest step flags */
  completedQuestSteps: json("completedQuestSteps").$type<string[]>().default([]),
  /** Evolution XP for pet evolution tracking */
  evolutionXp: int("evolutionXp").default(0).notNull(),
  /** Total wins / losses / kills */
  wins: int("wins").default(0).notNull(),
  losses: int("losses").default(0).notNull(),
  kills: int("kills").default(0).notNull(),
  /** How many times this pet has died and been revived */
  deathCount: int("deathCount").default(0).notNull(),
  /** Is the pet currently in spectral form (died + gained ghost bonus)? */
  isSpectral: boolean("isSpectral").default(false).notNull(),
  /** Game system that granted the spectral bonus (pet_battles, card_game, etc.) */
  spectralBonusSystem: varchar("spectralBonusSystem", { length: 64 }),
  /** Narrative cause of the most recent death */
  deathCause: varchar("deathCause", { length: 64 }),
  /** Whether this pet is part of the active battle party (trait synergy contributor) */
  isActive: boolean("isActive").default(true).notNull(),
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
   POTENTIAL IDENTITY SYSTEM
   Unity Meter, faction membership, faction state.
   Migration 0046_potential_identity_system.sql.
   ═══════════════════════════════════════════════════════ */

/**
 * Singleton row holding the current Unity Meter phase and percent.
 * `id` is always 1. Advanced by unityMeterService.increment().
 */
export const unityMeterState = mysqlTable("unity_meter_state", {
  id: int("id").primaryKey().default(1),
  phase: varchar("phase", { length: 32 }).notNull().default("contested"),
  percent: int("percent").notNull().default(50),
  lastTick: timestamp("lastTick").defaultNow().notNull(),
});

export type UnityMeterState = typeof unityMeterState.$inferSelect;

/** Append-only log of Unity Meter contributions per user + source. */
export const unityContributions = mysqlTable("unity_contributions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  source: varchar("source", { length: 64 }).notNull(),
  delta: int("delta").notNull(),
  /** Optional — which faction this contribution relates to, if any */
  factionId: varchar("factionId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  idxUser: index("idx_unity_contrib_user").on(table.userId),
  idxCreated: index("idx_unity_contrib_created").on(table.createdAt),
  idxFaction: index("idx_unity_contrib_faction").on(table.factionId),
}));

export type UnityContribution = typeof unityContributions.$inferSelect;

/** Per-user membership in a Potential Identity faction. */
export const potentialFactionMembership = mysqlTable("potential_faction_membership", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  factionId: varchar("factionId", { length: 64 }).notNull(),
  rank: varchar("rank", { length: 32 }).notNull().default("recruit"),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  /** Optional — NPC id that recruited this player */
  recruitedBy: varchar("recruitedBy", { length: 64 }),
}, (table) => ({
  idxUser: index("idx_potfac_mem_user").on(table.userId),
  idxFaction: index("idx_potfac_mem_faction").on(table.factionId),
}));

export type PotentialFactionMembership = typeof potentialFactionMembership.$inferSelect;

/** Per-faction aggregate state — dominance %, member count, sector holds. */
export const potentialFactionState = mysqlTable("potential_faction_state", {
  factionId: varchar("factionId", { length: 64 }).primaryKey(),
  dominance: int("dominance").notNull().default(0),
  memberCount: int("memberCount").notNull().default(0),
  /** JSON array of sector ids the faction has unlocked/held */
  sectorHolds: json("sectorHolds").$type<string[]>(),
  threat: int("threat").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PotentialFactionStateRow = typeof potentialFactionState.$inferSelect;

/* ═══════════════════════════════════════════════════════
   EPOCH WITNESS SYSTEM
   Vote tracking, Shadow Tongue state, player progress, Mandela effects.
   Migration 0047_epoch_witness.sql.
   ═══════════════════════════════════════════════════════ */

export const epochVotes = mysqlTable("epoch_votes", {
  id: int("id").autoincrement().primaryKey(),
  voteId: varchar("voteId", { length: 50 }).notNull(),
  epoch: varchar("epoch", { length: 50 }).notNull(),
  userId: int("userId").notNull(),
  optionChosen: varchar("optionChosen", { length: 10 }).notNull(),
  votedAt: timestamp("votedAt").defaultNow().notNull(),
  archetypeAtTime: varchar("archetypeAtTime", { length: 50 }),
}, (table) => ({
  uniqVote: index("idx_epoch_vote_id").on(table.voteId),
  idxUser: index("idx_epoch_user").on(table.userId),
}));

export type EpochVote = typeof epochVotes.$inferSelect;

export const epochVoteTallies = mysqlTable("epoch_vote_tallies", {
  voteId: varchar("voteId", { length: 50 }).primaryKey(),
  optionACount: int("optionACount").notNull().default(0),
  optionBCount: int("optionBCount").notNull().default(0),
  optionCCount: int("optionCCount").notNull().default(0),
  optionDCount: int("optionDCount").notNull().default(0),
  optionECount: int("optionECount").notNull().default(0),
  totalVotes: int("totalVotes").notNull().default(0),
  isClosed: int("isClosed").notNull().default(0),
  closedAt: timestamp("closedAt"),
  winningOption: varchar("winningOption", { length: 10 }),
});

export type EpochVoteTally = typeof epochVoteTallies.$inferSelect;

export const shadowTongueState = mysqlTable("shadow_tongue_state", {
  id: int("id").primaryKey().default(1),
  powerLevel: int("powerLevel").notNull().default(0),
  activeEdits: json("activeEdits").$type<Record<string, unknown>>(),
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
  grandEditActive: int("grandEditActive").notNull().default(0),
});

export type ShadowTongueStateRow = typeof shadowTongueState.$inferSelect;

export const playerEpochProgress = mysqlTable("player_epoch_progress", {
  userId: int("userId").primaryKey(),
  epochsVoted: json("epochsVoted").$type<Record<string, string[]>>(),
  archetype: varchar("archetype", { length: 50 }),
  archetypeEarnedAt: timestamp("archetypeEarnedAt"),
  shadowTongueCatches: int("shadowTongueCatches").notNull().default(0),
  campaignComplete: int("campaignComplete").notNull().default(0),
});

export type PlayerEpochProgress = typeof playerEpochProgress.$inferSelect;

export const mandelaEffects = mysqlTable("mandela_effects", {
  id: int("id").autoincrement().primaryKey(),
  triggeredByVote: varchar("triggeredByVote", { length: 50 }).notNull(),
  entryId: varchar("entryId", { length: 100 }).notNull(),
  fieldEdited: varchar("fieldEdited", { length: 100 }).notNull(),
  originalValue: text("originalValue").notNull(),
  editedValue: text("editedValue").notNull(),
  active: int("active").notNull().default(1),
  triggeredAt: timestamp("triggeredAt").defaultNow().notNull(),
  restoredAt: timestamp("restoredAt"),
  playersWhoNoticed: int("playersWhoNoticed").notNull().default(0),
}, (table) => ({
  idxActive: index("idx_mandela_active").on(table.active),
  idxVote: index("idx_mandela_vote").on(table.triggeredByVote),
}));

export type MandelaEffect = typeof mandelaEffects.$inferSelect;

/* ═══════════════════════════════════════════════════════
   DISCHORDIA CYCLE — Witnessing Narrative Proposal §3
   Community-wide Light/Dark meter. A single row per server
   holds the current state; energy_events is the audit log.
   ═══════════════════════════════════════════════════════ */

/**
 * Dischordia Cycle state — single-row table holding the
 * community Light/Dark/Vortex meter. The `id` column is
 * always 1 (enforced by the service layer) so there is
 * exactly one canonical state.
 */
export const dischordiaCycleState = mysqlTable("dischordia_cycle_state", {
  id: int("id").primaryKey(),
  /** See shared/dischordiaCycle.ts DischordiaPhase enum */
  phase: varchar("phase", { length: 32 }).notNull().default("dawn"),
  phaseStartedAt: timestamp("phaseStartedAt").defaultNow().notNull(),
  cycleNumber: int("cycleNumber").notNull().default(1),
  /** Hidden numeric meter — galaxy waking up */
  lightEnergy: int("lightEnergy").notNull().default(0),
  /** Hidden numeric meter — galaxy going quiet */
  darkEnergy: int("darkEnergy").notNull().default(0),
  /** Doomsday clock 0..100. Only ticks up. */
  vortexProximity: int("vortexProximity").notNull().default(0),
  /** "dark_ascending" | "balanced" | "light_ascending" */
  energyBalance: varchar("energyBalance", { length: 32 }).notNull().default("balanced"),
  /** Append-only history of completed reclamation records */
  history: json("history").$type<Array<Record<string, unknown>>>(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DischordiaCycleStateRow = typeof dischordiaCycleState.$inferSelect;

/**
 * Dischordia energy events — append-only audit log of every
 * applyEnergy / applyRawDelta call. Keyed by userId when the
 * source was a player action.
 */
export const dischordiaEnergyEvents = mysqlTable("dischordia_energy_events", {
  id: int("id").autoincrement().primaryKey(),
  /** Null when the source was server-initiated (tick jobs, admin tools) */
  userId: int("userId"),
  /** A row id from ENERGY_GAIN_TABLE, or a free-form source tag for raw deltas */
  actionId: varchar("actionId", { length: 128 }).notNull(),
  lightDelta: int("lightDelta").notNull().default(0),
  darkDelta: int("darkDelta").notNull().default(0),
  vortexDelta: int("vortexDelta").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  idxCreatedAt: index("idx_dischordia_energy_created").on(table.createdAt),
  idxUserId: index("idx_dischordia_energy_user").on(table.userId),
}));

export type DischordiaEnergyEvent = typeof dischordiaEnergyEvents.$inferSelect;

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
  /** Universe event ids that were active when the season was last ticked. Snapshot for modifier resolution. */
  activeUniverseEvents: json("activeUniverseEvents").$type<string[]>().default([]),
  /** User id of the season's #1 finisher when the season was closed. Used for the Severance Prize. */
  championUserId: int("championUserId"),
  closedAt: timestamp("closedAt"),
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
  /** Reward tier keys the user has already claimed for this season. */
  claimedTiers: json("claimedTiers").$type<string[]>().default([]),
  /** True once the Severance Prize companion has been granted (only valid for #1 finisher of a closed season). */
  severancePrizeClaimed: int("severancePrizeClaimed").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userSeasonIdx: uniqueIndex("uq_circuit_lb_user_season").on(table.userId, table.seasonId),
}));

export type CircuitLeaderboardRow = typeof circuitLeaderboard.$inferSelect;

/* ─── CIRCUIT CLONES — Persistent clone roster across races ─── */
export const circuitClones = mysqlTable("circuit_clones", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  seasonId: int("seasonId").notNull(),
  designation: varchar("designation", { length: 64 }).notNull(),
  neuralSync: int("neuralSync").notNull().default(80),
  velocityCeilingPct: int("velocityCeilingPct").notNull().default(100),
  surfaceGripPct: int("surfaceGripPct").notNull().default(60),
  survivalInstinct: int("survivalInstinct").notNull().default(25),
  chassisColor: varchar("chassisColor", { length: 16 }).notNull().default("#f5f0e8"),
  racesRun: int("racesRun").notNull().default(0),
  killsScored: int("killsScored").notNull().default(0),
  status: mysqlEnum("status", ["active", "dead", "severed"]).notNull().default("active"),
  /** True once this clone has been "noticed" by the Bone Lane (3+ races survived). */
  veteranNoted: int("veteranNoted").notNull().default(0),
  bornAt: timestamp("bornAt").defaultNow().notNull(),
  diedAt: timestamp("diedAt"),
}, (table) => ({
  userSeasonIdx: index("idx_circuit_clones_user_season").on(table.userId, table.seasonId),
  statusIdx: index("idx_circuit_clones_status").on(table.status),
}));

export type CircuitCloneRow = typeof circuitClones.$inferSelect;

/* ─── CIRCUIT IDENTITY CHAINS — Player-authored four-name identity ─── */
export const circuitIdentityChains = mysqlTable("circuit_identity_chains", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  studentName: varchar("studentName", { length: 64 }),
  seekerName: varchar("seekerName", { length: 64 }),
  detectiveName: varchar("detectiveName", { length: 64 }),
  lastName: varchar("lastName", { length: 64 }),
  /** How many of the four names have been authored. 0..4 */
  slotsCompleted: int("slotsCompleted").notNull().default(0),
  loredexEntryId: int("loredexEntryId"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CircuitIdentityChainRow = typeof circuitIdentityChains.$inferSelect;

/* ─── CIRCUIT SIDE QUEST PROGRESS — Cross-game quests during a season ─── */
export const circuitSideQuestProgress = mysqlTable("circuit_side_quest_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  seasonId: int("seasonId").notNull(),
  questKey: varchar("questKey", { length: 64 }).notNull(),
  progress: int("progress").notNull().default(0),
  target: int("target").notNull(),
  completed: int("completed").notNull().default(0),
  claimed: int("claimed").notNull().default(0),
  cpAwarded: int("cpAwarded").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userQuestIdx: uniqueIndex("uq_circuit_sq_user_season_quest").on(table.userId, table.seasonId, table.questKey),
}));

export type CircuitSideQuestProgressRow = typeof circuitSideQuestProgress.$inferSelect;

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

/* ═══════════════════════════════════════════════════════
   DEGEN'S CASINO — Server-authoritative game state & audit
   ═══════════════════════════════════════════════════════ */

export const casinoState = mysqlTable("casino_state", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  /** Lifetime Dream wagered */
  totalWagered: int("totalWagered").notNull().default(0),
  /** Lifetime Dream won */
  totalWon: int("totalWon").notNull().default(0),
  /** Session wins/losses (reset per login) */
  sessionWins: int("sessionWins").notNull().default(0),
  sessionLosses: int("sessionLosses").notNull().default(0),
  /** VIP tier 0-5 */
  vipLevel: int("vipLevel").notNull().default(0),
  /** Daily free plays remaining */
  freeSpinsLeft: int("freeSpinsLeft").notNull().default(3),
  /** Progressive jackpot pool contribution */
  jackpotContribution: int("jackpotContribution").notNull().default(0),
  /** Unscratched scratch cards in inventory */
  scratchCards: int("scratchCards").notNull().default(0),
  /** Current win streak */
  currentStreak: int("currentStreak").notNull().default(0),
  /** Best streak ever */
  bestStreak: int("bestStreak").notNull().default(0),
  /** Hidden 8th NPC trust (0-100) */
  degenFavor: int("degenFavor").notNull().default(0),
  /** Lifetime bets placed (Equilibrium tracking) */
  totalBetsPlaced: int("totalBetsPlaced").notNull().default(0),
  /** Collected Degen's Tale ids */
  collectedTales: json("collectedTales").$type<string[]>().default([]),
  /** Games played per type */
  gamesPlayed: json("gamesPlayed").$type<Record<string, number>>().default({}),
  /** Games *won* per type — drives achievements that require N wins
   *  rather than N attempts. */
  gamesWon: json("gamesWon").$type<Record<string, number>>().default({}),
  /** Consecutive Faction War Betting wins (resets on loss) — powers the
   *  "Faction Prophet" achievement. */
  consecutiveFactionWins: int("consecutiveFactionWins").notNull().default(0),
  /** Consecutive Card Battler's Gauntlet wins — powers "Gauntlet Master". */
  consecutiveGauntletWins: int("consecutiveGauntletWins").notNull().default(0),
  /** Cases opened since last rare+ drop (Void Cases pity timer) */
  casesSinceRarePlus: int("casesSinceRarePlus").notNull().default(0),
  /** Daily wager accumulator (enforces MAX_DAILY_WAGER) */
  dailyWagered: int("dailyWagered").notNull().default(0),
  /** YYYY-MM-DD string used to reset daily counters */
  dailyCounterDate: varchar("dailyCounterDate", { length: 10 }),
  /** Unlocked cosmetic/title rewards from casino achievements — the
   *  parser at `casino.ts#rewardsFromUnlockString` turns a human
   *  readable `unlockReward` into normalized ids that land here. */
  casinoUnlockedRewards: json("casinoUnlockedRewards").$type<string[]>().default([]),
  /** Currently equipped cosmetics — maps slot → reward id. One
   *  cosmetic per slot (title / chip / card_back / table_felt /
   *  companion / loredex). */
  equippedCasinoCosmetics: json("equippedCasinoCosmetics").$type<Record<string, string>>().default({}),
  /** If true, the player is excluded from the progressive jackpot
   *  claim broadcast blast. They can still see the leaderboard. */
  jackpotBroadcastOptOut: boolean("jackpotBroadcastOptOut").notNull().default(false),
  /** If true, the player is excluded from Christmas in July community
   *  milestone broadcasts. Independent from jackpot opt-out so users
   *  can keep one stream of notifications while muting the other. */
  milestoneBroadcastOptOut: boolean("milestoneBroadcastOptOut").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("idx_casino_state_user").on(table.userId),
}));
export type CasinoStateRow = typeof casinoState.$inferSelect;

export const casinoJackpotPool = mysqlTable("casino_jackpot_pool", {
  id: int("id").autoincrement().primaryKey(),
  /** Stable key — "main" is the only pool for now. */
  poolKey: varchar("poolKey", { length: 32 }).notNull().unique(),
  /** Current accumulated Dream in the pool. */
  balance: int("balance").notNull().default(0),
  /** Lifetime Dream paid out from this pool. */
  totalPaidOut: int("totalPaidOut").notNull().default(0),
  /** userId of the last winner, if any. */
  lastWinnerId: int("lastWinnerId"),
  lastWinAt: timestamp("lastWinAt"),
  /** When the most recent claim was broadcast to players. Lets
   *  claimJackpot avoid double-sending notifications on retries. */
  lastBroadcastAt: timestamp("lastBroadcastAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type CasinoJackpotPoolRow = typeof casinoJackpotPool.$inferSelect;

export const casinoResults = mysqlTable("casino_results", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  game: varchar("game", { length: 64 }).notNull(),
  bet: int("bet").notNull(),
  won: boolean("won").notNull().default(false),
  payout: int("payout").notNull().default(0),
  jackpot: boolean("jackpot").notNull().default(false),
  /** Arbitrary per-game result payload (reels, dice, cards, etc.) */
  detail: json("detail").$type<Record<string, unknown>>(),
  /** Seed used for deterministic replay */
  seed: varchar("seed", { length: 64 }),
  playedAt: timestamp("playedAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_casino_results_user").on(table.userId),
  gameIdx: index("idx_casino_results_game").on(table.game),
  playedAtIdx: index("idx_casino_results_played_at").on(table.playedAt),
}));
export type CasinoResultRow = typeof casinoResults.$inferSelect;

/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — Event progress, gifts, charity pool
   ═══════════════════════════════════════════════════════ */

export const xmasJulyProgress = mysqlTable("xmas_july_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  /** Festive Tokens held */
  festiveTokens: int("festiveTokens").notNull().default(0),
  /** Gift boxes sent */
  giftsSent: int("giftsSent").notNull().default(0),
  /** Gift boxes received */
  giftsReceived: int("giftsReceived").notNull().default(0),
  /** Days whose challenge has been claimed (1-14) */
  completedDays: json("completedDays").$type<number[]>().default([]),
  /** Current consecutive day streak */
  streak: int("streak").notNull().default(0),
  /** Last day claimed (for streak continuity) */
  lastDayClaimed: int("lastDayClaimed"),
  /** Soul stones wagered at craps */
  stonesWagered: int("stonesWagered").notNull().default(0),
  /** Soul stones won back */
  stonesWon: int("stonesWon").notNull().default(0),
  /** Free purifications from lucky 7s */
  blessedPurifications: int("blessedPurifications").notNull().default(0),
  /** Snowflake Soul Stones held */
  snowflakeStones: int("snowflakeStones").notNull().default(0),
  /** Ungifted gift boxes in inventory */
  giftBoxesOwned: int("giftBoxesOwned").notNull().default(0),
  /** Last free daily token claim date (YYYY-MM-DD) */
  lastDailyTokenClaim: varchar("lastDailyTokenClaim", { length: 10 }),
  /** Charity multiplier usage — 100-spend window remaining */
  charityMultiplierRemaining: int("charityMultiplierRemaining").notNull().default(0),
  /** Unlocked cosmetic/badge ids earned from the event */
  unlockedRewards: json("unlockedRewards").$type<string[]>().default([]),
  /** Gifts sent today — resets when giftCounterDate rolls */
  giftsSentToday: int("giftsSentToday").notNull().default(0),
  /** UTC YYYY-MM-DD of the last gift-send — drives daily reset */
  giftCounterDate: varchar("giftCounterDate", { length: 10 }),
  /** Lifetime festive tokens spent (wheel spins + gift crafts + donations) */
  tokensSpent: int("tokensSpent").notNull().default(0),
  /** Festive tokens spent today — for day 10 "High Roller" challenge */
  tokensSpentToday: int("tokensSpentToday").notNull().default(0),
  /** Resolved holiday danger event ids (prevents replaying the same
   *  daily event twice). Format: "YYYY-MM-DD:<danger_id>". */
  dangerResolutions: json("dangerResolutions").$type<string[]>().default([]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("idx_xmas_july_progress_user").on(table.userId),
}));
export type XmasJulyProgressRow = typeof xmasJulyProgress.$inferSelect;

export const xmasJulyGifts = mysqlTable("xmas_july_gifts", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId").notNull(),
  /** Gift kind — "gift_box", "candy_cane", etc. */
  giftType: varchar("giftType", { length: 64 }).notNull(),
  /** Custom message from sender */
  message: text("message"),
  /** Has the recipient opened/claimed it? */
  claimed: boolean("claimed").notNull().default(false),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  claimedAt: timestamp("claimedAt"),
}, (table) => ({
  senderIdx: index("idx_xmas_july_gifts_sender").on(table.senderId),
  recipientIdx: index("idx_xmas_july_gifts_recipient").on(table.recipientId),
}));
export type XmasJulyGiftRow = typeof xmasJulyGifts.$inferSelect;

export const xmasJulyCharityPool = mysqlTable("xmas_july_charity_pool", {
  id: int("id").autoincrement().primaryKey(),
  eventKey: varchar("eventKey", { length: 64 }).notNull().unique(),
  /** Global gift count (drives milestones) */
  totalGifts: int("totalGifts").notNull().default(0),
  /** Cumulative festive tokens contributed */
  totalTokensDonated: int("totalTokensDonated").notNull().default(0),
  /** Community pool of soul stones (from losing craps rolls) */
  communityPool: int("communityPool").notNull().default(0),
  /** Milestone ids already reached */
  milestonesReached: json("milestonesReached").$type<string[]>().default([]),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type XmasJulyCharityPoolRow = typeof xmasJulyCharityPool.$inferSelect;

export const xmasJulyCrapsRolls = mysqlTable("xmas_july_craps_rolls", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  total: int("total").notNull(),
  die1: int("die1").notNull(),
  die2: int("die2").notNull(),
  outcome: varchar("outcome", { length: 32 }).notNull(),
  /** Id of the wagered soul stone */
  stoneId: varchar("stoneId", { length: 64 }),
  rolledAt: timestamp("rolledAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_xmas_july_craps_user").on(table.userId),
}));
export type XmasJulyCrapsRow = typeof xmasJulyCrapsRolls.$inferSelect;

export const xmasJulyWheelSpins = mysqlTable("xmas_july_wheel_spins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  prizeId: varchar("prizeId", { length: 64 }).notNull(),
  prizeType: varchar("prizeType", { length: 32 }).notNull(),
  amount: int("amount").notNull().default(0),
  rarity: varchar("rarity", { length: 16 }).notNull().default("common"),
  spunAt: timestamp("spunAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_xmas_july_wheel_user").on(table.userId),
}));
export type XmasJulyWheelRow = typeof xmasJulyWheelSpins.$inferSelect;

/* ═══════════════════════════════════════════════════════
   CREW SYSTEM — Bloodlines, Clones, Pods, Missions

   NOTE: The crew system's runtime state lives in
   userProgress.gameData.crew as a JSON blob (see
   apps/shared/crewPersistence.ts). These tables are
   provided for cross-user queries, server-side analytics,
   and future migration away from the JSON blob. The router
   does not require them — they're opt-in promotion
   targets. Run db:push to materialize.
   ═══════════════════════════════════════════════════════ */

export const crewMembers = mysqlTable("crew_members", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Stable client-side id, e.g. "crew-1710000000000-12345" */
  memberKey: varchar("memberKey", { length: 64 }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  nickname: varchar("nickname", { length: 64 }),
  species: varchar("species", { length: 32 }).notNull(),
  gender: varchar("gender", { length: 16 }).notNull(),
  bloodlineKey: varchar("bloodlineKey", { length: 64 }).notNull(),
  generation: int("generation").notNull().default(1),
  parentIds: json("parentIds").$type<[string, string] | null>(),
  children: json("children").$type<string[]>().default([]).notNull(),
  geneticTraits: json("geneticTraits").$type<string[]>().default([]).notNull(),
  role: varchar("role", { length: 32 }),
  stats: json("stats").$type<Record<string, number>>().notNull(),
  morale: int("morale").notNull().default(70),
  health: int("health").notNull().default(100),
  loyalty: int("loyalty").notNull().default(50),
  status: varchar("status", { length: 24 }).notNull().default("active"),
  age: int("age").notNull().default(0),
  maxAge: int("maxAge").notNull().default(80),
  birthCycle: int("birthCycle").notNull().default(0),
  missionHistory: json("missionHistory").$type<string[]>().default([]).notNull(),
  relationships: json("relationships").$type<Record<string, number>>().default({}).notNull(),
  deathRecord: json("deathRecord").$type<{ cycle: number; cause: string; lastWords: string } | null>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userMemberIdx: uniqueIndex("uq_crew_member_user_key").on(table.userId, table.memberKey),
  userIdx: index("idx_crew_member_user").on(table.userId),
  bloodlineIdx: index("idx_crew_member_bloodline").on(table.bloodlineKey),
  statusIdx: index("idx_crew_member_status").on(table.status),
}));

export type CrewMemberRow = typeof crewMembers.$inferSelect;
export type InsertCrewMember = typeof crewMembers.$inferInsert;

export const crewBloodlines = mysqlTable("crew_bloodlines", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bloodlineKey: varchar("bloodlineKey", { length: 64 }).notNull(),
  foundedAt: timestamp("foundedAt").defaultNow().notNull(),
  generationCount: int("generationCount").notNull().default(1),
  geneticDrift: int("geneticDrift").notNull().default(0),
  diversityIndex: int("diversityIndex").notNull().default(0),
  activeTraits: json("activeTraits").$type<string[]>().default([]).notNull(),
  recessiveTraits: json("recessiveTraits").$type<string[]>().default([]).notNull(),
  /** Derived — bloodline data may mirror the immutable FOUNDING_BLOODLINES template */
  metadata: json("metadata").$type<Record<string, unknown>>(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userBloodlineIdx: uniqueIndex("uq_crew_bloodline_user_key").on(table.userId, table.bloodlineKey),
  userIdx: index("idx_crew_bloodline_user").on(table.userId),
}));

export type CrewBloodlineRow = typeof crewBloodlines.$inferSelect;
export type InsertCrewBloodline = typeof crewBloodlines.$inferInsert;

export const crewIncubatorPods = mysqlTable("crew_incubator_pods", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** 1..6 — stable slot index shown in the UI */
  podSlot: int("podSlot").notNull(),
  status: varchar("status", { length: 24 }).notNull().default("empty"),
  templateId: varchar("templateId", { length: 64 }),
  bloodlineKey: varchar("bloodlineKey", { length: 64 }),
  generation: int("generation").notNull().default(1),
  parentIds: json("parentIds").$type<[string, string] | null>(),
  timeRemainingSeconds: int("timeRemainingSeconds").notNull().default(0),
  totalTimeSeconds: int("totalTimeSeconds").notNull().default(0),
  geneticIntegrity: int("geneticIntegrity").notNull().default(100),
  traits: json("traits").$type<string[]>().default([]).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userSlotIdx: uniqueIndex("uq_crew_pod_user_slot").on(table.userId, table.podSlot),
  userIdx: index("idx_crew_pod_user").on(table.userId),
  statusIdx: index("idx_crew_pod_status").on(table.status),
}));

export type CrewIncubatorPodRow = typeof crewIncubatorPods.$inferSelect;
export type InsertCrewIncubatorPod = typeof crewIncubatorPods.$inferInsert;

export const crewMissions = mysqlTable("crew_missions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  missionKey: varchar("missionKey", { length: 96 }).notNull(),
  templateId: varchar("templateId", { length: 64 }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  sectorId: varchar("sectorId", { length: 64 }).notNull(),
  difficulty: varchar("difficulty", { length: 24 }).notNull(),
  status: varchar("status", { length: 24 }).notNull().default("dispatched"),
  assignedCrewIds: json("assignedCrewIds").$type<string[]>().default([]).notNull(),
  successChance: int("successChance").notNull().default(50),
  dispatchedAt: timestamp("dispatchedAt").defaultNow().notNull(),
  completesAt: timestamp("completesAt").notNull(),
  resolvedAt: timestamp("resolvedAt"),
  resolution: json("resolution").$type<{
    success: boolean;
    narrative: string;
    casualties: string[];
    injured: string[];
    survived: string[];
    rewardGranted: Record<string, unknown>;
  } | null>(),
}, (table) => ({
  userMissionIdx: uniqueIndex("uq_crew_mission_user_key").on(table.userId, table.missionKey),
  userStatusIdx: index("idx_crew_mission_user_status").on(table.userId, table.status),
}));

export type CrewMissionRow = typeof crewMissions.$inferSelect;
export type InsertCrewMission = typeof crewMissions.$inferInsert;

/* ═══════════════════════════════════════════════════════
   CAMPAIGN PROGRESS — Story Mode state persistence (WS6)
   Tracks per-chapter completion, branch choices, morality
   axis scores, and encounter-specific data.
   ═══════════════════════════════════════════════════════ */

export const campaignProgress = mysqlTable("campaign_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Which chapter this row tracks (e.g. "ch1_dead_signal"). */
  chapterId: varchar("chapterId", { length: 64 }).notNull(),
  /** Current status of this chapter for this user. */
  status: mysqlEnum("status", ["locked", "unlocked", "in_progress", "completed"]).default("locked").notNull(),
  /** Star rating 0-3 (0 = not completed, 3 = flawless). */
  stars: int("stars").notNull().default(0),
  /** Number of times the player has beaten this chapter. */
  completionCount: int("completionCount").notNull().default(0),
  /** Best turn count (lower = better, for leaderboard). */
  bestTurns: int("bestTurns"),
  /** Branch choices made during this chapter. */
  branchChoices: json("branchChoices").$type<Record<string, string>>(),
  /** Dialog wheel selections — keys chosen by the player. */
  dialogChoices: json("dialogChoices").$type<string[]>(),
  /** Morality axis shifts accumulated in this chapter.
   *  { truth: +2, defiance: -1, empathy: +3, acceptance: 0 } */
  moralityShifts: json("moralityShifts").$type<Record<string, number>>(),
  /** Memory fragments unlocked. */
  memoryFragments: json("memoryFragments").$type<string[]>(),
  /** Power-ups gained. */
  powersGained: json("powersGained").$type<string[]>(),
  /** If a match was played, the cardGameMatch id for replay. */
  matchId: int("matchId"),
  firstCompletedAt: timestamp("firstCompletedAt"),
  lastPlayedAt: timestamp("lastPlayedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userChapterIdx: uniqueIndex("uq_campaign_user_chapter").on(table.userId, table.chapterId),
  userStatusIdx: index("idx_campaign_user_status").on(table.userId, table.status),
}));

export type CampaignProgressRow = typeof campaignProgress.$inferSelect;
export type InsertCampaignProgress = typeof campaignProgress.$inferInsert;

/**
 * Campaign global state — one row per user.
 * Tracks aggregate morality axes, current chapter, global branches.
 */
export const campaignState = mysqlTable("campaign_state", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  /** Current chapter the player is on (1-12). */
  currentChapter: int("currentChapter").notNull().default(1),
  /** Global branch state { branchA: "iron-lion", branchB: "enigma" }. */
  branches: json("branches").$type<Record<string, string>>(),
  /** Aggregate morality axes across all chapters.
   *  { truth: 5, defiance: -2, empathy: 8, acceptance: 3 } */
  moralityAxes: json("moralityAxes").$type<Record<string, number>>(),
  /** Corruption arc encounters completed. */
  corruptionArcCompleted: json("corruptionArcCompleted").$type<string[]>(),
  /** Source boss defeated. */
  sourceBossDefeated: int("sourceBossDefeated").notNull().default(0),
  /** Season finale completed. */
  finaleCompleted: int("finaleCompleted").notNull().default(0),
  /** Season finale vote choice. */
  finaleVote: varchar("finaleVote", { length: 64 }),
  /** Total stars earned across all chapters. */
  totalStars: int("totalStars").notNull().default(0),
  /** Fighters unlocked through story progression. */
  unlockedFighters: json("unlockedFighters").$type<string[]>(),
  /** Videos unlocked through story progression. */
  unlockedVideos: json("unlockedVideos").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_campaign_state_user_id").on(table.userId),
}));

export type CampaignStateRow = typeof campaignState.$inferSelect;
export type InsertCampaignState = typeof campaignState.$inferInsert;

/* ═══════════════════════════════════════════════════════
   TUTORIAL PROGRESS — 4-gate tutorial tracking (WS7)
   ═══════════════════════════════════════════════════════ */

export const tutorialProgress = mysqlTable("tutorial_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  /** Which gates have been completed (bitmask: bit0=gate1, bit1=gate2, etc). */
  completedGates: int("completedGates").notNull().default(0),
  /** Currently active gate (1-4, or 0 if not started, 5 if all done). */
  currentGate: int("currentGate").notNull().default(0),
  /** Has the new player grant been awarded? */
  grantAwarded: int("grantAwarded").notNull().default(0),
  /** Per-gate completion timestamps. */
  gateTimestamps: json("gateTimestamps").$type<Record<string, string>>(),
  /** Tutorial skip flag (admin/debug only). */
  skipped: int("skipped").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_tutorial_progress_user_id").on(table.userId),
}));

export type TutorialProgressRow = typeof tutorialProgress.$inferSelect;
export type InsertTutorialProgress = typeof tutorialProgress.$inferInsert;

/* ═══════════════════════════════════════════════════════
   RANKED SEASONS — Competitive TCG ladder (WS8)
   ═══════════════════════════════════════════════════════ */

export const rankedSeasons = mysqlTable("ranked_seasons", {
  id: int("id").autoincrement().primaryKey(),
  seasonNumber: int("seasonNumber").notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  /** Ranked tiers: Bronze→Silver→Gold→Diamond→Master→Legend. */
  tiers: json("tiers").$type<Array<{
    id: string;
    name: string;
    minRating: number;
    maxRating: number;
    icon: string;
  }>>(),
  /** Starting rating for new players this season. */
  startingRating: int("startingRating").notNull().default(1000),
  /** K-factor for ELO calculation. */
  kFactor: int("kFactor").notNull().default(32),
  /** Season end rewards per tier (JSON). */
  tierRewards: json("tierRewards").$type<Record<string, {
    dreamTokens: number;
    packCredits: number;
    cardBackId?: string;
    titleId?: string;
  }>>(),
  status: mysqlEnum("status", ["upcoming", "active", "ended"]).default("upcoming").notNull(),
  startsAt: timestamp("startsAt").notNull(),
  endsAt: timestamp("endsAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RankedSeasonRow = typeof rankedSeasons.$inferSelect;
export type InsertRankedSeason = typeof rankedSeasons.$inferInsert;

/**
 * Per-user ranked season record.
 */
export const rankedRecords = mysqlTable("ranked_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  seasonId: int("seasonId").notNull(),
  rating: int("rating").notNull().default(1000),
  peakRating: int("peakRating").notNull().default(1000),
  wins: int("wins").notNull().default(0),
  losses: int("losses").notNull().default(0),
  winStreak: int("winStreak").notNull().default(0),
  bestWinStreak: int("bestWinStreak").notNull().default(0),
  /** Current tier id (e.g. "gold_3"). */
  currentTier: varchar("currentTier", { length: 32 }).default("bronze_1"),
  /** Has this player received end-of-season rewards? */
  rewardsClaimed: int("rewardsClaimed").notNull().default(0),
  lastMatchAt: timestamp("lastMatchAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userSeasonIdx: uniqueIndex("uq_ranked_user_season").on(table.userId, table.seasonId),
  ratingIdx: index("idx_ranked_rating").on(table.seasonId, table.rating),
}));

export type RankedRecordRow = typeof rankedRecords.$inferSelect;
export type InsertRankedRecord = typeof rankedRecords.$inferInsert;

/* ═══════════════════════════════════════════════════════
   CELEBRATION TRIAL — 28-day Apprentice training persistence
   ═══════════════════════════════════════════════════════ */

export const celebrationTrialState = mysqlTable("celebration_trial_state", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Apprentice id from client (UUID-style) */
  apprenticeId: varchar("apprenticeId", { length: 64 }).notNull(),
  trialDay: int("trialDay").notNull().default(1),
  bond: int("bond").notNull().default(0),
  corruption: int("corruption").notNull().default(0),
  missedDays: int("missedDays").notNull().default(0),
  stage: varchar("stage", { length: 32 }).notNull().default("training"),
  /** Wall-clock timestamp when trial started (for pacing) */
  trialStartedAt: timestamp("trialStartedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userApprenticeIdx: uniqueIndex("uq_trial_user_apprentice").on(table.userId, table.apprenticeId),
  userIdx: index("idx_trial_user").on(table.userId),
}));

export type CelebrationTrialStateRow = typeof celebrationTrialState.$inferSelect;

/** Per-day decision log — one row per resolved trial day */
export const celebrationTrialHistory = mysqlTable("celebration_trial_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  apprenticeId: varchar("apprenticeId", { length: 64 }).notNull(),
  day: int("day").notNull(),
  mascoteerId: varchar("mascoteerId", { length: 64 }).notNull(),
  decisionId: varchar("decisionId", { length: 128 }).notNull(),
  optionId: varchar("optionId", { length: 64 }).notNull(),
  bondDelta: int("bondDelta").notNull().default(0),
  corruptionDelta: int("corruptionDelta").notNull().default(0),
  moralityDelta: int("moralityDelta").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userApprenticeIdx: index("idx_trial_history_user_apprentice").on(table.userId, table.apprenticeId),
  userDayIdx: uniqueIndex("uq_trial_history_day").on(table.userId, table.apprenticeId, table.day),
}));

export type CelebrationTrialHistoryRow = typeof celebrationTrialHistory.$inferSelect;

/* ═══════════════════════════════════════════════════════
   MECHRONIS ACADEMY — Lesson transcript + professor approval
   ═══════════════════════════════════════════════════════ */

export const academyTranscript = mysqlTable("academy_transcript", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  day: int("day").notNull(),
  professorId: varchar("professorId", { length: 64 }).notNull(),
  lessonId: varchar("lessonId", { length: 128 }).notNull(),
  grade: varchar("grade", { length: 16 }).notNull(),
  skillXpDelta: int("skillXpDelta").notNull().default(0),
  corruptionDelta: int("corruptionDelta").notNull().default(0),
  approvalDelta: int("approvalDelta").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_academy_transcript_user").on(table.userId),
  userDayIdx: uniqueIndex("uq_academy_transcript_day").on(table.userId, table.day),
}));

export type AcademyTranscriptRow = typeof academyTranscript.$inferSelect;

export const professorApproval = mysqlTable("professor_approval", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  professorId: varchar("professorId", { length: 64 }).notNull(),
  approval: int("approval").notNull().default(50),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userProfIdx: uniqueIndex("uq_prof_approval_user_prof").on(table.userId, table.professorId),
}));

export type ProfessorApprovalRow = typeof professorApproval.$inferSelect;

/* ═══════════════════════════════════════════════════════
   ENGINEER'S LOGS — Phase A13
   Tracks which Engineer's Logs each user has discovered
   (unlocked) and whether they've listened/read them yet.
   Used by routers/engineerLogs.ts for the FNORD-23 library.
   ═══════════════════════════════════════════════════════ */
export const engineerLogUnlocks = mysqlTable("engineer_log_unlocks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Stable log id (e.g. "log_keyword_rush"). */
  logId: varchar("logId", { length: 64 }).notNull(),
  /** When the log became available to the player. */
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
  /** Has the player opened/listened to it at least once? Drives
   *  the unread-badge on the FNORD-23 library UI. */
  read: int("read").notNull().default(0),
  /** Short trigger description shown in the unlock toast
   *  ("First Rush unit deployed", "Completed Tutorial Gate 2", etc.). */
  unlockSource: varchar("unlockSource", { length: 128 }),
}, (table) => ({
  userLogIdx: uniqueIndex("uq_engineer_log_unlocks_user_log").on(table.userId, table.logId),
  userIdx: index("idx_engineer_log_unlocks_user").on(table.userId),
}));

export type EngineerLogUnlockRow = typeof engineerLogUnlocks.$inferSelect;

/* ═══════════════════════════════════════════════════════
   FNORD-23 MEMORY RESIN BANK — Phase G3
   Every in-game VO line a player hears gets captured here
   automatically so they can replay it from the FNORD-23 later.
   The whole in-game dialog becomes a searchable, remixable album.
   ═══════════════════════════════════════════════════════ */
export const memoryResinBank = mysqlTable("memory_resin_bank", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Stable id for the underlying audio asset (not unique per user —
   *  two different contexts of the same line produce two entries). */
  audioClipId: varchar("audioClipId", { length: 128 }).notNull(),
  /** Public URL to the audio file. Lives under /audio/... */
  audioUrl: varchar("audioUrl", { length: 512 }).notNull(),
  /** Who is speaking — "elara", "the_human", "engineer", etc. */
  speaker: varchar("speaker", { length: 64 }),
  /** Where the player was when they heard it. */
  context: varchar("context", { length: 128 }),
  /** Full transcript for search. */
  transcript: text("transcript"),
  /** Duration in seconds so the UI can show a progress bar. */
  durationSeconds: int("durationSeconds").notNull().default(0),
  /** JSON array of filter tags. */
  tags: json("tags").$type<string[]>(),
  capturedAt: timestamp("capturedAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_memory_resin_user").on(table.userId),
  userSpeakerIdx: index("idx_memory_resin_user_speaker").on(table.userId, table.speaker),
  userClipIdx: uniqueIndex("uq_memory_resin_user_clip_context").on(table.userId, table.audioClipId, table.context),
}));

export type MemoryResinRow = typeof memoryResinBank.$inferSelect;

/* ═══════════════════════════════════════════════════════
   FNORD-23 DEVICE STATE — Phase G3
   Per-user device state: which channels are unlocked,
   whether the device itself has been discovered, etc.
   ═══════════════════════════════════════════════════════ */
export const fnord23UserState = mysqlTable("fnord23_user_state", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  /** JSON array of unlocked channel ids. */
  unlockedChannelIds: json("unlockedChannelIds").$type<string[]>(),
  /** Last played track id (resumes playback here on next session). */
  lastPlayedTrackId: varchar("lastPlayedTrackId", { length: 64 }),
  /** Has the player found the device at all yet? First-time
   *  discovery sequence runs when this flips true. */
  discovered: int("discovered").notNull().default(0),
  /** Has the player unlocked the beat minigame? */
  beatGameUnlocked: int("beatGameUnlocked").notNull().default(0),
  /** JSON array of scored BeatGameScore entries. */
  beatGameScores: json("beatGameScores").$type<unknown[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("idx_fnord23_state_user").on(table.userId),
}));

export type Fnord23UserStateRow = typeof fnord23UserState.$inferSelect;

/* ═══════════════════════════════════════════════════════
   TITLE-SCREEN BROADCASTS — "Intercepted Transmissions"
   Drives the ticker, Broadcast Panel, and pop-out video
   transmission player on the Title page. Authored by the
   content team via an admin seed; users only read.
   ═══════════════════════════════════════════════════════ */
export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  /** Stable slug — used by the `triggerOnTitle` intercept hook to
   *  de-dupe across reauth/rerender, and by admin tools. */
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  category: mysqlEnum("category", [
    "ark_alert", "transmission_incoming", "archival_footage", "overlay",
  ]).notNull().default("transmission_incoming"),
  priority: mysqlEnum("priority", ["normal", "high"]).notNull().default("normal"),
  title: varchar("title", { length: 256 }).notNull(),
  body: text("body"),
  /** 16:9 still for the broadcast card. */
  artUrl: varchar("artUrl", { length: 512 }),
  /** External link (news post, Discord, YouTube). */
  linkUrl: varchar("linkUrl", { length: 512 }),
  /** CDN URL for the video file (mp4/webm). null = not a video
   *  transmission. */
  videoUrl: varchar("videoUrl", { length: 512 }),
  /** Still frame shown before the video loads / plays. */
  videoPosterUrl: varchar("videoPosterUrl", { length: 512 }),
  /** Duration in seconds. Displayed on the card chip. */
  videoDurationSec: int("videoDurationSec"),
  /** When true, `useTransmissionIntercept` may pick this video to
   *  auto-play on the title screen once per user per session. */
  triggerOnTitle: boolean("triggerOnTitle").notNull().default(false),
  /** 0.0–1.0. Rolled once per eligible video; lets content authors
   *  prevent over-exposure on low-priority items. */
  triggerProbability: int("triggerProbability").notNull().default(100), // stored as 0-100 int to avoid float
  /** Who should see this broadcast. */
  audience: mysqlEnum("audience", [
    "all", "unauth", "authed", "act_ge_3", "light_aligned", "dark_aligned",
  ]).notNull().default("all"),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex("uq_announcements_slug").on(table.slug),
  publishedIdx: index("idx_announcements_published").on(table.publishedAt),
  audienceIdx: index("idx_announcements_audience").on(table.audience),
}));

export type AnnouncementRow = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

/**
 * Per-user view tracking for announcements. The
 * `useTransmissionIntercept` hook uses this to ensure an
 * auto-intercept never fires twice for the same user, even
 * across sessions or devices.
 */
export const announcementViews = mysqlTable("announcement_views", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  announcementId: int("announcementId").notNull(),
  firstSeenAt: timestamp("firstSeenAt").defaultNow().notNull(),
  /** Set when the user explicitly closes the transmission. null
   *  while still passively-viewed. */
  dismissedAt: timestamp("dismissedAt"),
}, (table) => ({
  userAnnouncementIdx: uniqueIndex("uq_announcement_views_user_ann")
    .on(table.userId, table.announcementId),
  userIdx: index("idx_announcement_views_user").on(table.userId),
}));

export type AnnouncementViewRow = typeof announcementViews.$inferSelect;


/* ═══════════════════════════════════════════════════════
   PLAYER PSYCHOLOGICAL PROFILE
   See `apps/shared/playerProfile.ts` for the seven axes and
   value semantics. The profile snapshot lives in `player_profile`
   (one row per user, INT axes in [-100, 100]); the audit log in
   `player_profile_events` (append-only). Both written atomically
   from `apps/server/routers/playerProfile.ts.recordEvent`.

   Migration: 0050_player_profile.sql
   ═══════════════════════════════════════════════════════ */

export const playerProfile = mysqlTable("player_profile", {
  userId: int("userId").primaryKey(),
  aggression: int("aggression").notNull().default(0),
  mercy: int("mercy").notNull().default(0),
  curiosity: int("curiosity").notNull().default(0),
  conformity: int("conformity").notNull().default(0),
  vigilance: int("vigilance").notNull().default(0),
  vulnerability: int("vulnerability").notNull().default(0),
  wit: int("wit").notNull().default(0),
  eventCount: int("eventCount").notNull().default(0),
  lastUpdatedAt: timestamp("lastUpdatedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PlayerProfileRow = typeof playerProfile.$inferSelect;

export const playerProfileEvents = mysqlTable("player_profile_events", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  source: varchar("source", { length: 64 }).notNull(),
  /** Arbitrary structured data describing what triggered this
   *  event — e.g. `{ matchId, opponentId, moveNumber, archetype }`
   *  for a chess mind-game choice. Lets the GM cite specific past
   *  events instead of just aggregates. */
  payload: json("payload").$type<Record<string, unknown> | null>(),
  /** The actual delta applied. Stored on the event so the audit
   *  log is self-contained — recomputing from the source registry
   *  would lose any one-off override deltas. */
  deltas: json("deltas").$type<Record<string, number> | null>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userCreatedIdx: index("idx_player_profile_events_user_created")
    .on(table.userId, table.createdAt),
  userSourceIdx: index("idx_player_profile_events_user_source")
    .on(table.userId, table.source),
}));
export type PlayerProfileEventRow = typeof playerProfileEvents.$inferSelect;


/* ═══════════════════════════════════════════════════════
   CHESS CLIMB — escalating stakes ladder.
   See `apps/shared/chessClimbTiers.ts` for tier definitions.
   Migration: 0051_chess_climb.sql
   ═══════════════════════════════════════════════════════ */

export const chessClimbRuns = mysqlTable("chess_climb_runs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tierRank: int("tierRank").notNull(),
  tierId: varchar("tierId", { length: 64 }).notNull(),
  game1Result: mysqlEnum("game1Result", ["win", "loss", "draw"]),
  game2Result: mysqlEnum("game2Result", ["win", "loss", "draw"]),
  game3Result: mysqlEnum("game3Result", ["win", "loss", "draw"]),
  outcome: mysqlEnum("outcome", ["ongoing", "won", "lost", "abandoned"])
    .notNull()
    .default("ongoing"),
  stakesApplied: json("stakesApplied").$type<Record<string, unknown> | null>(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  finishedAt: timestamp("finishedAt"),
}, (table) => ({
  userIdx: index("idx_chess_climb_runs_user").on(table.userId),
  userTierIdx: index("idx_chess_climb_runs_user_tier").on(table.userId, table.tierRank),
  userOutcomeIdx: index("idx_chess_climb_runs_user_outcome").on(table.userId, table.outcome),
}));
export type ChessClimbRunRow = typeof chessClimbRuns.$inferSelect;

export const chessClimbUnlocks = mysqlTable("chess_climb_unlocks", {
  userId: int("userId").primaryKey(),
  highestClearedRank: int("highestClearedRank").notNull().default(-1),
  tier2LockoutUntil: timestamp("tier2LockoutUntil"),
  lastUpdatedAt: timestamp("lastUpdatedAt").defaultNow().notNull(),
});
export type ChessClimbUnlocksRow = typeof chessClimbUnlocks.$inferSelect;

/* ═══════════════════════════════════════════════════════
   CHESS USER STATE — per-user UI breadcrumbs that need to
   survive across devices. Currently just lastVisitAt for
   the daily-welcome banner.
   Migration: 0055_chess_user_state.sql
   ═══════════════════════════════════════════════════════ */

export const chessUserState = mysqlTable("chess_user_state", {
  userId: int("userId").primaryKey(),
  lastVisitAt: timestamp("lastVisitAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  lastVisitIdx: index("idx_chess_user_state_last_visit").on(table.lastVisitAt),
}));
export type ChessUserStateRow = typeof chessUserState.$inferSelect;


/* ═══════════════════════════════════════════════════════
   CHESS GAME REVIEWS — persisted post-game Stockfish analysis.
   Migration: 0052_chess_game_reviews.sql
   ═══════════════════════════════════════════════════════ */

export const chessGameReviews = mysqlTable("chess_game_reviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  pgn: text("pgn").notNull(),
  playerSide: mysqlEnum("playerSide", ["white", "black"]).notNull(),
  /** JSON array of ReviewMistake rows. The client owns the
   *  authoritative shape — see ChessPostGameReview.tsx. */
  mistakes: json("mistakes").$type<
    ReadonlyArray<{
      moveNumber: number;
      side: "white" | "black";
      type: string;
      centipawnLoss: number;
      substitutions?: Record<string, string | number>;
    }>
  >().notNull(),
  summary: varchar("summary", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userCreatedIdx: index("idx_chess_game_reviews_user_created")
    .on(table.userId, table.createdAt),
}));
export type ChessGameReviewRow = typeof chessGameReviews.$inferSelect;


/* ═══════════════════════════════════════════════════════
   MEMORY ENERGY BALANCE — Act 2 / Act 3 Trade Empire currency.
   Migration: 0053_memory_energy_balance.sql
   ═══════════════════════════════════════════════════════ */

export const memoryEnergyBalance = mysqlTable("memory_energy_balance", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Current reserve. Cap is derived from narrative flags — see
   *  apps/shared/memoryEnergy.ts computeMemoryEnergyCap. */
  memoryEnergy: int("memoryEnergy").notNull().default(15),
  /** Lifetime earned across earn-source calls. */
  totalEarned: int("totalEarned").notNull().default(0),
  /** Lifetime spent on crafts. */
  totalSpent: int("totalSpent").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_memory_energy_balance_user_id").on(table.userId),
}));
export type MemoryEnergyBalanceRow = typeof memoryEnergyBalance.$inferSelect;

/* ═══════════════════════════════════════════════════════
   NPC SUBSTRATE — Stage 1 unified NPC infrastructure
   See apps/shared/npcs/types.ts and apps/shared/npcs/registry.ts
   for the canonical types + per-NPC metadata.
   ═══════════════════════════════════════════════════════ */

/**
 * Per-NPC trust state for NPCs without a bespoke relationship store.
 * Locke uses lockeRelationship (via adapter); Eidolon uses eidolonBonds
 * (via adapter); Elara/Human use companionStats (via adapter).
 * Other priority-roster NPCs read/write here directly.
 */
export const npcTrust = mysqlTable("npc_trust", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** NpcKey from apps/shared/npcs/types.ts. */
  npcKey: varchar("npcKey", { length: 64 }).notNull(),
  /** Numeric trust 0-100 (band resolved at read-time via registry). */
  trust: int("trust").notNull().default(0),
  /** Current reveal-stage for staged NPCs (Vex, Hierophant, Meme, Companion, Oracle, Game Master). */
  revealStage: varchar("revealStage", { length: 64 }),
  /** Per-NPC narrative flags (Set<string> serialized as JSON array). */
  flags: json("flags").$type<string[]>().default([]),
  /** Last interaction timestamp; drives anti-spam windows. */
  lastInteractionAt: timestamp("lastInteractionAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_npc_trust_user_id").on(table.userId),
  userNpcUniq: uniqueIndex("uniq_npc_trust_user_npc").on(table.userId, table.npcKey),
}));
export type NpcTrustRow = typeof npcTrust.$inferSelect;

/**
 * Per-line history; drives cooldownKey + maxPlays enforcement.
 * One row per (user, line) play event. Selector reads aggregate to filter
 * out lines exceeding their cooldown / max-play budget.
 */
export const npcLineHistory = mysqlTable("npc_line_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  npcKey: varchar("npcKey", { length: 64 }).notNull(),
  /** NpcLine.lineId. */
  lineId: varchar("lineId", { length: 256 }).notNull(),
  heardAt: timestamp("heardAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_npc_line_history_user_id").on(table.userId),
  userNpcLineIdx: index("idx_npc_line_history_user_npc_line").on(
    table.userId,
    table.npcKey,
    table.lineId,
  ),
}));
export type NpcLineHistoryRow = typeof npcLineHistory.$inferSelect;

/**
 * Cross-NPC public flags — the "visible action" canon.
 * When player canonically does something one NPC reacts to, the action
 * gets a public flag (e.g., "betrayed_locke_in_act_4"). Other NPCs
 * read these via reactsToPublicFlag in their NpcLine bank.
 *
 * This is how the saga remembers player choices across systems
 * (Trade Empire ↔ TCG ↔ DMC ↔ Hierophant chamber ↔ Oracle dreams).
 */
export const npcPublicFlags = mysqlTable("npc_public_flags", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Canonical public-flag string (writer-coordinated; see crossCharacterReactions.ts). */
  flag: varchar("flag", { length: 256 }).notNull(),
  setAt: timestamp("setAt").defaultNow().notNull(),
  /** Optional NpcKey of the NPC whose action set this flag. */
  setBy: varchar("setBy", { length: 64 }),
}, (table) => ({
  userIdIdx: index("idx_npc_public_flags_user_id").on(table.userId),
  userFlagUniq: uniqueIndex("uniq_npc_public_flags_user_flag").on(
    table.userId,
    table.flag,
  ),
}));
export type NpcPublicFlagRow = typeof npcPublicFlags.$inferSelect;

/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE PHASE 2 — Brokers + multi-stage Contracts
   See apps/shared/tradeEmpire/{brokers,contracts,
   contractTemplates}.ts for canonical types + templates.
   ═══════════════════════════════════════════════════════ */

/**
 * Per-user broker engagement state. Tracks first-meeting flags,
 * cumulative engagement count, lock-out status (e.g., Vex locked out
 * by Locke exclusivity per Touché canon).
 */
export const tradeBrokerEngagement = mysqlTable("trade_broker_engagement", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  brokerKey: varchar("brokerKey", { length: 64 }).notNull(),
  /** Total engagements (mission_offered + mission_accepted + mission_declined). */
  engagementCount: int("engagementCount").notNull().default(0),
  /** First-meeting timestamp; null if never met. */
  firstMetAt: timestamp("firstMetAt"),
  /** Lock-out status: broker declines to engage if locked. */
  isLockedOut: boolean("isLockedOut").notNull().default(false),
  /** Optional reason for lock-out (e.g., "vex_locked_out_by_locke_exclusivity"). */
  lockedOutReason: varchar("lockedOutReason", { length: 256 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trade_broker_engagement_user_id").on(table.userId),
  userBrokerUniq: uniqueIndex("uniq_trade_broker_engagement_user_broker").on(
    table.userId,
    table.brokerKey,
  ),
}));
export type TradeBrokerEngagementRow = typeof tradeBrokerEngagement.$inferSelect;

/**
 * Per-user runtime contract instance. References a template (ContractDef
 * by contractKey) and tracks per-stage status, hidden-clause disclosures,
 * and final outcome.
 */
export const tradeContracts = mysqlTable("trade_contracts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Canonical template key (apps/shared/tradeEmpire/contractTemplates/). */
  contractKey: varchar("contractKey", { length: 128 }).notNull(),
  /** Owning broker (denormalized for query convenience). */
  brokerKey: varchar("brokerKey", { length: 64 }).notNull(),
  /** Contract status: signed → active → succeeded / failed / cancelled. */
  status: mysqlEnum("status", [
    "signed",
    "active",
    "succeeded",
    "failed",
    "cancelled",
  ]).notNull().default("signed"),
  /** Player audited the fine-print on signing? Drives hidden-clause disclosure UI. */
  auditedOnSigning: boolean("auditedOnSigning").notNull().default(false),
  /** Per-stage status, JSON: { [stageId]: ContractStageStatus }. */
  stageStatus: json("stageStatus").$type<Record<string, string>>().default({}),
  /** Disclosed hidden clauses, JSON: list of clause ids. */
  disclosedClauses: json("disclosedClauses").$type<string[]>().default([]),
  signedAt: timestamp("signedAt").defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trade_contracts_user_id").on(table.userId),
  userStatusIdx: index("idx_trade_contracts_user_status").on(table.userId, table.status),
  contractKeyIdx: index("idx_trade_contracts_contract_key").on(table.contractKey),
}));
export type TradeContractRow = typeof tradeContracts.$inferSelect;

/* ═══════════════════════════════════════════════════════
   PHASE 6 INFRASTRUCTURE — Per-NPC ask-topics + dialog tree state
   See apps/shared/npcs/askTopics.ts (AskTopic registry) +
   apps/shared/npcs/dialogTrees/ (per-NPC trees) +
   apps/shared/npcs/conversationRunner.ts (state machine).
   ═══════════════════════════════════════════════════════ */

/**
 * Per-user ask-topic history. Drives the canonical "you've already
 * asked this; here's the re-entry response" pattern + cooldowns. One
 * row per (user, topic) ask-event so the resolver can count repeats
 * if a topic ever wants per-ask escalation.
 */
export const npcAskTopicHistory = mysqlTable("npc_ask_topic_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** NpcKey from apps/shared/npcs/types.ts. */
  npcKey: varchar("npcKey", { length: 64 }).notNull(),
  /** AskTopic.id from apps/shared/npcs/askTopics.ts. */
  topicId: varchar("topicId", { length: 256 }).notNull(),
  askedAt: timestamp("askedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_npc_ask_topic_history_user_id").on(table.userId),
  userTopicIdx: index("idx_npc_ask_topic_history_user_topic").on(
    table.userId,
    table.npcKey,
    table.topicId,
  ),
}));
export type NpcAskTopicHistoryRow = typeof npcAskTopicHistory.$inferSelect;

/**
 * Per-user dialog-tree state. Supports tree-resume across sessions:
 * if a player closes a multi-turn conversation mid-walk, the next
 * session can resume at the same node. One row per (user, tree)
 * with last-known node + completion timestamp.
 */
export const npcDialogTreeState = mysqlTable("npc_dialog_tree_state", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** NpcKey from apps/shared/npcs/types.ts. */
  npcKey: varchar("npcKey", { length: 64 }).notNull(),
  /** NpcDialogTree.id from apps/shared/npcs/dialogTrees/. */
  treeId: varchar("treeId", { length: 256 }).notNull(),
  /** Current node id within the tree; null when conversation ended. */
  currentNodeId: varchar("currentNodeId", { length: 256 }),
  /** Set when the tree reaches a terminal node. */
  completedAt: timestamp("completedAt"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_npc_dialog_tree_state_user_id").on(table.userId),
  userNpcTreeUniq: uniqueIndex("uniq_npc_dialog_tree_state_user_npc_tree").on(
    table.userId,
    table.npcKey,
    table.treeId,
  ),
}));
export type NpcDialogTreeStateRow = typeof npcDialogTreeState.$inferSelect;
