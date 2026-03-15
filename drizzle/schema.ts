import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

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
});

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
});

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
});

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
});

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
});

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
  /** Avatar/portrait URL */
  avatarUrl: text("avatarUrl"),
  /** Equipped items JSON */
  equipment: json("equipment").$type<Record<string, unknown>>(),
  /** Unlocked abilities */
  abilities: json("abilities").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CharacterSheet = typeof characterSheets.$inferSelect;

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
});

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
});

export type TrophyDisplay = typeof trophyDisplays.$inferSelect;

/* ═══════════════════════════════════════════════════════
   TRADE WARS — Space trading/combat game
   Based on Trade Wars 2002 BBS mechanics
   ═══════════════════════════════════════════════════════ */

/**
 * Trade Wars sectors — the galaxy map.
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
 * Trade Wars player state — ship, inventory, position.
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
  /** Card rewards earned from Trade Wars */
  cardRewards: json("cardRewards").$type<string[]>(),
  lastTurnReset: timestamp("lastTurnReset").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TWPlayerState = typeof twPlayerState.$inferSelect;

/**
 * Trade Wars colonies — player-owned planet developments.
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
});

export type TWColony = typeof twColonies.$inferSelect;

/**
 * Trade Wars game log — action history.
 */
export const twGameLog = mysqlTable("tw_game_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 64 }).notNull(),
  details: json("details").$type<Record<string, unknown>>(),
  sectorId: int("sectorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

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
});

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
  /** Is this the player's primary (free) citizen? */
  isPrimary: int("isPrimary").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

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
});

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
  /** Stripe payment intent ID */
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 256 }),
  /** Product key from our products catalog */
  productKey: varchar("productKey", { length: 128 }),
  /** Quantity purchased */
  quantity: int("quantity").notNull().default(1),
  amount: int("amount").notNull().default(0),
  /** Whether the purchase has been fulfilled (items granted) */
  fulfilled: int("fulfilled").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StorePurchase = typeof storePurchases.$inferSelect;

/**
 * Ship upgrades for Trade Wars — purchased or earned.
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
});

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
});

export type PlayerBase = typeof playerBases.$inferSelect;
