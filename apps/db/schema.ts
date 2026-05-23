import { bigint, boolean, int, json, mysqlEnum, mysqlTable, text, timestamp, tinyint, varchar, uniqueIndex, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  // Bounded varchar so a malicious caller can't paste megabytes of
  // data into a display-name field. Any sane username fits in 256
  // characters; downstream UI was already assuming short strings.
  name: varchar("name", { length: 256 }),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "moderator", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  deletedAt: timestamp("deletedAt"),
  // Cohort tagging (G27) — derived at signup, immutable.
  /** ISO-week identifier ("2026-W18") for trivial cohort filters. */
  signupWeek: varchar("signupWeek", { length: 8 }),
  /** Coarse install-source bucket: organic / paid / referral / partner. */
  installSource: varchar("installSource", { length: 32 }),
  /** A/B variant assignment at signup (e.g. "tutorial-v2:control"). */
  abVariant: varchar("abVariant", { length: 64 }),

  // ─── Age verification (audit/15.R4 — COPPA + GDPR-K) ────────────
  /** Self-attested date of birth, ISO yyyy-MM-dd. Required to use
   *  the app; null until the AgeVerifyPage is completed. We store
   *  the raw date (not a derived "is_adult" boolean) so geo-policy
   *  changes can be re-evaluated without re-asking the user. */
  dateOfBirth: varchar("dateOfBirth", { length: 10 }),
  /** ISO 3166-1 alpha-2 country code captured at age-verification
   *  time. Used to apply the EU 16+ minimum vs the global 13+
   *  minimum. Sourced from CF-IPCountry / X-Forwarded-Country with
   *  fallback to remote-address GeoIP. */
  ageVerificationCountry: varchar("ageVerificationCountry", { length: 2 }),
  /** Timestamp of the age-verification submission. The presence of
   *  this field is the gate the protected routes check; null →
   *  redirect to /age-verify. */
  ageVerifiedAt: timestamp("ageVerifiedAt"),
}, (table) => ({
  createdAtIdx: index("idx_users_created_at").on(table.createdAt),
  lastSignedInIdx: index("idx_users_last_signed_in").on(table.lastSignedIn),
  signupWeekIdx: index("idx_users_signup_week").on(table.signupWeek),
  emailIdx: uniqueIndex("uq_users_email").on(table.email),
  // Lookup queries on the age-verify gate; small index but the
  // protected-route middleware reads ageVerifiedAt on every request.
  ageVerifiedIdx: index("idx_users_age_verified").on(table.ageVerifiedAt),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User agreements — records every ToS / Privacy / Cookie acceptance
 * with the policy version that was in force at the time. GDPR Art. 7
 * requires demonstrable, recorded consent; this is that record.
 *
 * Schema:
 *   - agreementType: which policy (terms_of_service, privacy_policy,
 *     cookie_policy, etc.)
 *   - version: a string identifier for the policy revision (we use
 *     ISO date prefixes like "2026-05-05" so version ordering is
 *     trivially time-ordered)
 *   - agreedAt: when the user accepted
 *   - ipHash: hash of the IP at acceptance time, in case we ever
 *     need to defend the consent record against a "I never agreed"
 *     dispute. We store a hash so the row itself isn't a PII liability.
 *
 * One row per (user, type, version). Re-acceptance of the same
 * version is idempotent.
 */
export const userAgreements = mysqlTable(
  "user_agreements",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
    agreementType: varchar("agreementType", { length: 64 }).notNull(),
    version: varchar("version", { length: 32 }).notNull(),
    agreedAt: timestamp("agreedAt").defaultNow().notNull(),
    ipHash: varchar("ipHash", { length: 64 }),
  },
  (table) => ({
    userIdx: index("idx_user_agreements_user").on(table.userId),
    uniqueAcceptance: uniqueIndex(
      "uniq_user_agreement_version",
    ).on(table.userId, table.agreementType, table.version),
  }),
);
export type UserAgreement = typeof userAgreements.$inferSelect;

/**
 * User 2FA — TOTP secret + hashed backup codes.
 *
 * One row per user. The TOTP secret is stored as base32 plaintext
 * (it must be retrievable to verify codes) — the database is the
 * trust boundary, so guard it accordingly. Backup codes are
 * sha256-hashed and stored as a JSON array; on use we burn the
 * matching hash from the array.
 *
 * Required for admin role; optional for regular users.
 */
export const userTwoFactor = mysqlTable(
  "user_two_factor",
  {
    userId: int("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
    /** base32 TOTP secret. Generated server-side; revealed once on enroll. */
    secret: varchar("secret", { length: 64 }).notNull(),
    /** Hashed backup codes — JSON array of sha256 hex strings. */
    backupCodeHashes: json("backupCodeHashes").$type<string[]>().notNull(),
    /** True iff the user has confirmed enrollment by entering a valid code. */
    confirmed: boolean("confirmed").notNull().default(false),
    enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
    confirmedAt: timestamp("confirmedAt"),
    lastUsedAt: timestamp("lastUsedAt"),
  },
);
export type UserTwoFactor = typeof userTwoFactor.$inferSelect;

/**
 * User sessions — tracks active refresh tokens per device.
 *
 * Closes the "logging in on device B doesn't invalidate device A"
 * gap. Each refresh token issued by the OAuth callback / refresh
 * endpoint creates a row here keyed by jti. On logout / force-revoke
 * we delete the row, and the in-memory invalidatedRefreshTokens set
 * (apps/server/_core/sdk.ts) loads any DB rows tagged revokedAt.
 *
 * `lastUsedAt` updates on every refresh; nightly cron prunes idle
 * rows > 60 days.
 */
export const userSessions = mysqlTable(
  "user_sessions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    /** jti from the refresh token. */
    refreshTokenJti: varchar("refreshTokenJti", { length: 64 }).notNull(),
    /** Coarse device identifier — User-Agent string trimmed. */
    deviceLabel: varchar("deviceLabel", { length: 256 }),
    ipHash: varchar("ipHash", { length: 64 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    lastUsedAt: timestamp("lastUsedAt").defaultNow().notNull(),
    revokedAt: timestamp("revokedAt"),
  },
  (table) => ({
    userIdx: index("idx_user_sessions_user").on(table.userId),
    jtiIdx: uniqueIndex("uniq_user_sessions_jti").on(table.refreshTokenJti),
  }),
);
export type UserSession = typeof userSessions.$inferSelect;

/**
 * Player blocks — one row per (blocker → blocked) directed edge.
 *
 * The chat / pvp / friend layers consult this table to:
 *   - hide the blocked user's chat messages from the blocker
 *   - filter the blocked user out of friend-suggestion / matchmaking
 *   - reject DM / trade attempts in either direction
 *
 * Bidirectional muting requires two rows; that's intentional —
 * each side independently controls visibility.
 */
export const userBlocks = mysqlTable(
  "user_blocks",
  {
    id: int("id").autoincrement().primaryKey(),
    blockerUserId: int("blockerUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
    blockedUserId: int("blockedUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
    reason: varchar("reason", { length: 256 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    pairIdx: uniqueIndex("uniq_user_block_pair").on(table.blockerUserId, table.blockedUserId),
    blockerIdx: index("idx_user_blocks_blocker").on(table.blockerUserId),
  }),
);
export type UserBlock = typeof userBlocks.$inferSelect;

/**
 * Support impersonation grants — short-lived, audited tokens that
 * let an authorised admin/moderator act as another user to
 * reproduce a bug. The grant must be redeemed within the TTL,
 * carries a mandatory reason, and ends up in adminAuditLog so the
 * use is reviewable after the fact.
 *
 * Storage shape:
 *   - issuedToAdminId: who can use this grant
 *   - targetUserId:    whose account they're entering
 *   - reason:          mandatory free-text justification
 *   - expiresAt:       short, e.g. 1 hour
 *   - usedAt:          burn-after-use; the redeem mutation flips
 *                      this so a leaked token isn't reusable.
 */
export const supportImpersonationGrants = mysqlTable(
  "support_impersonation_grants",
  {
    id: int("id").autoincrement().primaryKey(),
    issuedToAdminId: int("issuedToAdminId").notNull().references(() => users.id, { onDelete: "restrict" }),
    targetUserId: int("targetUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    reason: varchar("reason", { length: 512 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    usedAt: timestamp("usedAt"),
  },
  (table) => ({
    adminIdx: index("idx_support_grants_admin").on(table.issuedToAdminId),
    targetIdx: index("idx_support_grants_target").on(table.targetUserId),
  }),
);
export type SupportImpersonationGrant = typeof supportImpersonationGrants.$inferSelect;

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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  /** Disciplines/abilities JSON array */
  disciplines: json("disciplines").$type<string[]>(),
  /** Keywords for game mechanics */
  keywords: json("keywords").$type<string[]>(),
  /** How to unlock this card */
  unlockMethod: mysqlEnum("unlockMethod", [
    "starter", "story", "achievement", "trade", "fight", "exploration",
    "purchase", "event", "admin"
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  player1Id: int("player1Id").notNull().references(() => users.id, { onDelete: "restrict" }),
  /** Player 2 (0 = AI opponent) */
  player2Id: int("player2Id").notNull().default(0).references(() => users.id, { onDelete: "restrict" }),
  /** Winner */
  winnerId: int("winnerId").references(() => users.id, { onDelete: "restrict" }),
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
}, (table) => ({
  // Hot match-lookup indexes. Without these, every "list my matches"
  // query falls back to a full scan; the table grows unbounded with
  // every concluded match. CONNECTION_AUDIT §3.3 caught the gap.
  player1Idx: index("idx_card_game_matches_player1").on(table.player1Id),
  player2Idx: index("idx_card_game_matches_player2").on(table.player2Id),
  statusIdx: index("idx_card_game_matches_status").on(table.status),
}));

export type CardGameMatch = typeof cardGameMatches.$inferSelect;

/* ═══════════════════════════════════════════════════════
   CHARACTER SHEETS — User RPG profiles
   ═══════════════════════════════════════════════════════ */

/**
 * Character sheets — RPG-style profiles for each user.
 */
export const characterSheets = mysqlTable("character_sheets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sectorId: int("sectorId").notNull().references(() => twSectors.sectorId, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
  action: varchar("action", { length: 64 }).notNull(),
  details: json("details").$type<Record<string, unknown>>(),
  sectorId: int("sectorId").references(() => twSectors.sectorId, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
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
  // Composite index landed via migration 0067 — declared here so a
  // db:push against a divergent dev DB doesn't propose dropping it.
  userCreatedIdx: index("idx_crafting_log_user_created").on(table.userId, table.createdAt),
}));

export type CraftingLog = typeof craftingLog.$inferSelect;

/* ═══════════════════════════════════════════════════════
   CITIZEN CHARACTER SYSTEM — White Wolf-style character sheet
   Every player creates one free Citizen. Additional characters unlocked.
   ═══════════════════════════════════════════════════════ */

export const citizenCharacters = mysqlTable("citizen_characters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  /**
   * JSON: suit-materials inventory keyed by MaterialId
   * (apps/shared/suitRecipes.ts). Used by attemptSuitCraft to gate
   * recipes against the citizen's pouch and deduct on success. Loot
   * drops + quest rewards top this up; defaults to {} for fresh
   * citizens. Audit Phase J1.
   */
  suitMaterials: json("suitMaterials").$type<Record<string, number>>(),
  /** If species=neyon, which specific Ne-Yon token ID (1-10) this citizen is tied to */
  neyonTokenId: int("neyonTokenId").references(() => users.id, { onDelete: "set null" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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

export const storePurchases = mysqlTable("store_purchases", {
  id: int("id").autoincrement().primaryKey(),
  // Purchases must persist for audit even if the user is deleted —
  // financial reconciliation, refund disputes, regulatory access.
  // `restrict` blocks user deletion if any purchases exist; the
  // soft-delete on users.deletedAt is the operational answer.
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
  // `itemId` removed — the column was unused everywhere in the
  // server and there is no items / products DB table. The
  // `productKey` varchar below is the canonical catalog reference,
  // mapping into the static STORE_PRODUCTS array in
  // apps/server/products.ts. The drop migration ships in the next
  // db:generate pass.
  /** Payment method: credits, dream, stripe */
  paymentMethod: mysqlEnum("paymentMethod", ["credits", "dream", "stripe", "void_crystals"]).notNull(),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Name of the base */
  baseName: varchar("baseName", { length: 128 }).notNull().default("Outpost Alpha"),
  /** Sector where the base is located */
  sectorId: int("sectorId").notNull().references(() => twSectors.sectorId, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "restrict" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  /** Player 1 user ID. `restrict` keeps match history intact when
   *  a user is deleted — replays and ladder records reference these
   *  rows; the soft-delete on users.deletedAt is the operational
   *  answer to "the user is gone but their matches remain." */
  player1Id: int("player1Id").notNull().references(() => users.id, { onDelete: "restrict" }),
  /** Player 2 user ID. Nullable for solo / queue-cancel / bot
   *  matches; FK still applies when set. */
  player2Id: int("player2Id").references(() => users.id, { onDelete: "restrict" }),
  /** Match status */
  status: mysqlEnum("status", ["waiting", "active", "completed", "abandoned"]).default("waiting").notNull(),
  /** Winner user ID */
  winnerId: int("winnerId").references(() => users.id, { onDelete: "restrict" }),
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
}, (table) => ({
  // Hot match-lookup indexes — same rationale as cardGameMatches.
  // CONNECTION_AUDIT §3.3.
  player1Idx: index("idx_pvp_matches_player1").on(table.player1Id),
  player2Idx: index("idx_pvp_matches_player2").on(table.player2Id),
  statusIdx: index("idx_pvp_matches_status").on(table.status),
}));

export type PvpMatch = typeof pvpMatches.$inferSelect;
export type InsertPvpMatch = typeof pvpMatches.$inferInsert;

/**
 * PvP leaderboard — card battle ELO ratings.
 */
export const pvpLeaderboard = mysqlTable("pvp_leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "restrict" }),
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
}, (table) => ({
  // Speeds the time-windowed sandbagging-detection scan landed via
  // migration 0067. Declared here so a db:push diff doesn't propose
  // dropping it.
  lastMatchAtIdx: index("idx_pvp_lb_last_match_at").on(table.lastMatchAt),
}));

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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  seasonId: int("seasonId").notNull().references(() => battlePassSeasons.id, { onDelete: "restrict" }),
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
  creatorId: int("creatorId").notNull().references(() => users.id, { onDelete: "restrict" }),
  /** Winner user ID */
  winnerId: int("winnerId").references(() => users.id, { onDelete: "restrict" }),
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
  tournamentId: int("tournamentId").notNull().references(() => chessTournaments.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  senderId: int("senderId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Player receiving the trade offer */
  receiverId: int("receiverId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  // audit/03.F5 — composite (senderId,receiverId) lives in 0067_indexes_and_fks.sql
  // but had no Drizzle declaration; pnpm db:push would propose dropping it. Mirror it here.
  pairIdx: index("idx_card_trades_pair").on(table.senderId, table.receiverId),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  sectorId: int("sectorId").notNull().references(() => twSectors.sectorId, { onDelete: "cascade" }),
  /** Controlling faction */
  faction: mysqlEnum("faction", ["empire", "insurgency"]),
  /** Control points (0-100). 50 = contested, >50 = faction leans, 100 = fully controlled */
  controlPoints: int("controlPoints").notNull().default(50),
  /** Number of times this sector has been contested */
  contestCount: int("contestCount").notNull().default(0),
  /** Current season ID */
  seasonId: int("seasonId").notNull().default(1).references(() => battlePassSeasons.id, { onDelete: "restrict" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sectorId: int("sectorId").notNull().references(() => twSectors.sectorId, { onDelete: "cascade" }),
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
  seasonId: int("seasonId").notNull().default(1).references(() => battlePassSeasons.id, { onDelete: "restrict" }),
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
  sellerId: int("sellerId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  // audit/04.F4 — marketplace.searchListings filters on (status,
  // itemType, createdAt). The status-only index above forced a
  // filesort + leading-wildcard LIKE scan on every page. The
  // composite covers the hot path; itemName needs a FULLTEXT in a
  // follow-up migration (Drizzle's MySQL adapter doesn't expose
  // FULLTEXT yet, so we rely on a manual `ALTER TABLE … ADD
  // FULLTEXT` once db:migrate flow stabilises).
  statusItemCreatedIdx: index("idx_market_listings_status_item_created")
    .on(table.status, table.itemType, table.createdAt),
}));
export type MarketListing = typeof marketListings.$inferSelect;

/**
 * Market buy orders — "wanted" requests with max price.
 */
export const marketBuyOrders = mysqlTable("market_buy_orders", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  listingId: int("listingId").references(() => marketListings.id, { onDelete: "restrict" }),
  buyOrderId: int("buyOrderId").references(() => marketBuyOrders.id, { onDelete: "restrict" }),
  sellerId: int("sellerId").notNull().references(() => users.id, { onDelete: "restrict" }),
  buyerId: int("buyerId").notNull().references(() => users.id, { onDelete: "restrict" }),
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
  sellerId: int("sellerId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  highestBidderId: int("highestBidderId").references(() => users.id, { onDelete: "cascade" }),
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
  auctionId: int("auctionId").notNull().references(() => marketAuctions.id, { onDelete: "restrict" }),
  bidderId: int("bidderId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Notification type for icon/routing */
  type: mysqlEnum("type", [
    "trade_offer", "trade_accepted", "trade_declined",
    "pvp_challenge", "pvp_result", "pvp_season_reward",
    "auction_outbid", "auction_won", "auction_ended",
    "market_sold", "market_buy_filled",
    "faction_war", "guild_invite", "guild_message", "guild_war_victory",
    "daily_reset", "daily_login", "quest_complete", "weekly_quest", "epoch_quest",
    "achievement", "battle_pass_reward",
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  seasonId: int("seasonId").notNull().references(() => battlePassSeasons.id, { onDelete: "restrict" }),
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
  /**
   * Balance F2 — durable per-UTC-day XP-source ledger.
   * Shape: { "<YYYY-MM-DD>": { "<sourceId>": awardCount } }. Read +
   * write by battlePass.addXpFromAction to enforce each XP source's
   * declared `dailyCap`. Pruned to the current UTC day on write so
   * the blob stays O(number of sources). Nullable: legacy rows + the
   * boot window before battlePassLedgerBootstrap adds the column.
   */
  dailyXpLedger: json("dailyXpLedger").$type<
    Record<string, Record<string, number>>
  >(),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
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
  leaderId: int("leaderId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  guildId: int("guildId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  guildId: int("guildId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
 * Chat moderation — player-submitted reports against chat messages
 * across any chat surface (currently guild_chat; extensible to
 * spectator chat / DMs via the sourceType column). One row per
 * reporter+message; the unique key blocks pile-on while still
 * allowing different players to file independent reports against
 * the same message (which is itself useful evidence).
 *
 * `messageSnapshot` is captured at report time so a moderator's
 * queue still has the offending content even if the source row is
 * later deleted (cascade-on-leave-guild for example). Status uses
 * a small enum rather than free-form so admin queries don't have
 * to defensively unparse.
 */
export const chatReports = mysqlTable("chat_reports", {
  id: int("id").autoincrement().primaryKey(),
  reporterUserId: int("reporterUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  reportedUserId: int("reportedUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sourceType: mysqlEnum("sourceType", ["guild_chat"]).notNull().default("guild_chat"),
  /** FK to guildChat.id with set null. The schema is intentionally
   *  decoupled: messageSnapshot persists the offending content even
   *  if the source message is later deleted (cascade-on-leave-guild,
   *  mod purge, etc.), so the report retains the audit-trail
   *  record. set null preserves the snapshot while breaking the
   *  link cleanly when the source goes away. */
  sourceMessageId: int("sourceMessageId").references(() => guildChat.id, { onDelete: "set null" }),
  messageSnapshot: text("messageSnapshot").notNull(),
  reason: mysqlEnum("reason", [
    "harassment",
    "hate_speech",
    "spam",
    "doxxing",
    "other",
  ]).notNull(),
  notes: varchar("notes", { length: 500 }),
  status: mysqlEnum("status", [
    "open",
    "reviewed",
    "dismissed",
    "actioned",
  ]).notNull().default("open"),
  /** Pipe-joined filter-flag string (e.g. "masked|caps") captured
   *  at report time. Empty if the message had no automated flags
   *  — a legitimate signal that the reporter saw something the
   *  filter missed. */
  filterFlagsAtReport: varchar("filterFlagsAtReport", { length: 128 }).notNull().default(""),
  reviewedBy: int("reviewedBy"),
  reviewedAt: timestamp("reviewedAt"),
  reviewerNotes: varchar("reviewerNotes", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  uniqReporterMessage: uniqueIndex("uq_chat_reports_reporter_msg").on(
    table.reporterUserId,
    table.sourceType,
    table.sourceMessageId,
  ),
  idxStatus: index("idx_chat_reports_status").on(table.status),
  idxReportedUser: index("idx_chat_reports_reported_user").on(table.reportedUserId),
}));
export type ChatReport = typeof chatReports.$inferSelect;

/**
 * Purchase grants — append-only ledger of fulfilled purchases.
 *
 * One row per fulfillment, written inside the same transaction as
 * the actual reward grants (dream-token credits, card-pack inserts,
 * ship-upgrade rows, etc). The unique key on `fulfillmentId` means:
 *
 *   - The ledger row CAN'T exist without the grants, because they're
 *     in the same atomic transaction.
 *   - The grants CAN'T be duplicated by a webhook retry, because the
 *     caller checks for an existing ledger row before executing the
 *     transaction body.
 *
 * Together these close the audit-flagged "user is charged but
 * inventory is partial / duplicated" failure mode.
 *
 * `fulfillmentId` is the Stripe payment-intent id for paid flows, or
 * a synthesised stable string for free / Dream-token / credits flows
 * (`{kind}:{userId}:{productKey}:{Date.now()}`). The format is opaque
 * to the consumer; only uniqueness and stability matter.
 *
 * `rewardSummary` is a small JSON snapshot of what was granted —
 * purely audit candy, never read by the runtime. Useful for refund
 * tooling and customer-support replay.
 */
export const purchaseGrants = mysqlTable("purchase_grants", {
  id: int("id").autoincrement().primaryKey(),
  fulfillmentId: varchar("fulfillmentId", { length: 256 }).notNull(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
  productKey: varchar("productKey", { length: 128 }).notNull(),
  quantity: int("quantity").notNull(),
  rewardSummary: json("rewardSummary").$type<Record<string, number | string>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  uniqFulfillment: uniqueIndex("uq_purchase_grants_fulfillment").on(table.fulfillmentId),
  idxUserId: index("idx_purchase_grants_user").on(table.userId),
  idxProductKey: index("idx_purchase_grants_product").on(table.productKey),
}));
export type PurchaseGrant = typeof purchaseGrants.$inferSelect;

/**
 * Guild invites — pending invitations.
 */
export const guildInvites = mysqlTable("guild_invites", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  /** User who was invited */
  invitedUserId: int("invitedUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  warId: int("warId").notNull().references(() => guildWars.id, { onDelete: "cascade" }),
  guildId: int("guildId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  points: int("points").notNull().default(0),
  source: mysqlEnum("source", ["fight_win", "pvp_win", "trade_volume", "quest_complete", "card_battle_win", "chess_win", "terminus_wave", "terminus_boss_kill", "terminus_pvp_star", "terminus_defense"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  warIdIdx: index("idx_guild_war_contributions_war_id").on(table.warId),
  guildIdIdx: index("idx_guild_war_contributions_guild_id").on(table.guildId),
  userIdIdx: index("idx_guild_war_contributions_user_id").on(table.userId),
}));
export type GuildWarContribution = typeof guildWarContributions.$inferSelect;

/**
 * Per-player progress on the 8 weekly guild contracts (F.2.1 / F.2.2
 * cinematic surface). One row per (userId, weekId, contractId) — the
 * weekId is the ISO 8601 week ("2026-W18") so progress resets cleanly
 * at the Sunday→Monday UTC boundary without a destructive write. The
 * uniq index makes incrementProgress an upsert candidate.
 *
 * progressCount counts source-events of the contract's matching type;
 * once it crosses the template's targetCount, completeContract validates
 * + sets completedAt and fires cs_contract_complete.
 */
export const guildContractProgress = mysqlTable("guild_contract_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  weekId: varchar("weekId", { length: 16 }).notNull(),
  contractId: varchar("contractId", { length: 64 }).notNull(),
  progressCount: int("progressCount").notNull().default(0),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
}, (table) => ({
  uniqUserWeekContract: uniqueIndex("uniq_guild_contract_user_week_contract").on(
    table.userId, table.weekId, table.contractId,
  ),
  userWeekIdx: index("idx_guild_contract_user_week").on(table.userId, table.weekId),
}));
export type GuildContractProgress = typeof guildContractProgress.$inferSelect;

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
  whitePlayerId: int("whitePlayerId").references(() => users.id, { onDelete: "cascade" }),
  blackPlayerId: int("blackPlayerId").references(() => users.id, { onDelete: "cascade" }),
  whiteCharacter: varchar("whiteCharacter", { length: 64 }),
  blackCharacter: varchar("blackCharacter", { length: 64 }),
  mode: mysqlEnum("mode", ["casual", "ranked", "tournament", "story", "game_master"]).notNull().default("casual"),
  aiDifficulty: int("aiDifficulty"),
  fen: text("fen"),
  pgn: text("pgn"),
  status: mysqlEnum("status", ["waiting", "active", "checkmate", "stalemate", "draw", "resigned", "timeout", "abandoned"]).notNull().default("waiting"),
  winnerId: int("winnerId").references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  tournamentId: int("tournamentId").notNull().references(() => chessTournaments.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
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
  tournamentId: int("tournamentId").notNull().references(() => chessTournaments.id, { onDelete: "cascade" }),
  round: int("round").notNull(),
  whiteId: int("whiteId").notNull().references(() => users.id, { onDelete: "restrict" }),
  blackId: int("blackId").notNull().references(() => users.id, { onDelete: "restrict" }),
  whiteResult: mysqlEnum("whiteResult", ["win", "loss", "draw"]),
  reported: boolean("reported").notNull().default(false),
  gameId: int("gameId").references(() => chessGames.id, { onDelete: "restrict" }),
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
  userId: int("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  guildId: int("guildId").notNull().unique().references(() => guilds.id, { onDelete: "cascade" }),
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
  worldId: int("worldId").notNull().references(() => syndicateWorlds.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
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
  stationId: int("stationId").notNull().references(() => spaceStations.id, { onDelete: "cascade" }),
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
  ownerId: int("ownerId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  /**
   * Phase 5 (items-matter / GoT arc): one consumable inventory item
   * loaded into the tower as munition. Format: "<itemKind>:<id>"
   * (e.g. "card:card_terrify", "potion:berserker_elixir"). Consumed
   * on the next wave the tower fires in. Null when no munition is
   * loaded.
   */
  equippedMunition: varchar("equippedMunition", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type TowerPlacement = typeof towerPlacements.$inferSelect;

export const raidLogs = mysqlTable("raid_logs", {
  id: int("id").autoincrement().primaryKey(),
  /** Attacker user ID */
  attackerId: int("attackerId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Defender: station or world */
  defenderType: mysqlEnum("defenderType", ["station", "world"]).notNull(),
  defenderId: int("defenderId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Defender user ID (for station) or guild ID (for world) */
  defenderOwnerId: int("defenderOwnerId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  ownerId: int("ownerId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventId: int("eventId").notNull().references(() => seasonalEvents.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
  eventId: int("eventId").notNull().references(() => seasonalEvents.id, { onDelete: "cascade" }),
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
  player1Id: int("player1Id").notNull().references(() => users.id, { onDelete: "cascade" }),
  player1Name: varchar("player1Name", { length: 100 }).notNull(),
  player2Id: int("player2Id").references(() => users.id, { onDelete: "cascade" }),
  player2Name: varchar("player2Name", { length: 100 }),
  winnerId: int("winnerId").references(() => users.id, { onDelete: "cascade" }),
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

/* ─── PVP RATINGS (#7) ─── */
/** Persistent MMR + seasonal rank per (user, game type).
 *  - `mmr` is hidden ELO that drives matchmaking across seasons.
 *  - `seasonRank` is the visible cosmetic rank for the current season.
 *  - `peakMmr` is the highest MMR the player has ever held — a
 *    persistent badge that informs reward tiers.
 *  See migration 0058 + apps/server/services/pvpRatingsBootstrap.ts. */
export const pvpRatings = mysqlTable("pvp_ratings", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  gameType: varchar("gameType", { length: 50 }).notNull(),
  mmr: int("mmr").notNull().default(1200),
  seasonId: int("seasonId").notNull().default(1).references(() => battlePassSeasons.id, { onDelete: "restrict" }),
  seasonRank: int("seasonRank").notNull().default(0),
  seasonWins: int("seasonWins").notNull().default(0),
  seasonLosses: int("seasonLosses").notNull().default(0),
  peakMmr: int("peakMmr").notNull().default(1200),
  lastMatchAt: timestamp("lastMatchAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uqUserGame: uniqueIndex("uq_pvp_ratings_user_game").on(
    table.userId,
    table.gameType,
  ),
  leaderboardIdx: index("idx_pvp_ratings_leaderboard").on(
    table.gameType,
    table.mmr,
  ),
  userIdx: index("idx_pvp_ratings_user").on(table.userId),
}));
export type PvpRatingRow = typeof pvpRatings.$inferSelect;

/* ─── PERSONAL QUARTERS ─── */
export const playerQuarters = mysqlTable("player_quarters", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
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
  ownerId: int("ownerId").notNull().references(() => users.id, { onDelete: "cascade" }),
  visitorId: int("visitorId").notNull().references(() => users.id, { onDelete: "cascade" }),
  visitedAt: timestamp("visitedAt").defaultNow().notNull(),
});
export type QuarterVisitRow = typeof quarterVisits.$inferSelect;

/* ─── FRIENDLY CHALLENGES ─── */
export const friendlyChallenges = mysqlTable("friendly_challenges", {
  id: int("id").primaryKey().autoincrement(),
  challengerId: int("challengerId").notNull().references(() => users.id, { onDelete: "cascade" }),
  opponentId: int("opponentId").references(() => users.id, { onDelete: "cascade" }),
  gameType: varchar("gameType", { length: 50 }).notNull(),
  rules: json("rules").$type<string[]>(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  winnerId: int("winnerId").references(() => users.id, { onDelete: "cascade" }),
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
  guildId: int("guildId").references(() => guilds.id, { onDelete: "cascade" }),
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
  raidId: int("raidId").notNull().references(() => coopRaids.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
  itemKey: varchar("itemKey", { length: 100 }).notNull(),
  price: int("price").notNull(),
  equipped: boolean("equipped").notNull().default(false),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
});
export type CosmeticPurchaseRow = typeof cosmeticPurchases.$inferSelect;

/* ─── 3-TIER COSMETIC CATALOG OWNERSHIP ───
   Tracks ownership of cosmetics from the new tiered catalog
   (apps/shared/cosmeticCatalog.ts). Distinct from cosmeticPurchases
   above, which serves the legacy Dream-only RPG cosmetic shop. The
   two systems coexist; the new catalog adds Void-Crystal pricing
   and bundle-grant sources, neither of which fit the legacy schema.
   The (userId, cosmeticId) pair is unique — no double grants. */
export const cosmeticCatalogOwnership = mysqlTable("cosmetic_catalog_ownership", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Cosmetic id from `apps/shared/cosmeticCatalog.ts` ALL_COSMETICS. */
  cosmeticId: varchar("cosmeticId", { length: 100 }).notNull(),
  /** How the player obtained this cosmetic. Drives analytics + refunds. */
  source: varchar("source", { length: 24 }).notNull(), // "dream" | "void_crystals" | "bundle"
  /** Amount of currency spent (0 for bundle-granted cosmetics). */
  pricePaid: int("pricePaid").notNull().default(0),
  /** Optional: SKU key that granted this when source="bundle". */
  bundleSkuKey: varchar("bundleSkuKey", { length: 100 }),
  /**
   * World-weave provenance — the latest seal broken, active yearly
   * event, and dominant horseman at craft/grant time. Forward-only;
   * never backfilled on existing rows. Drives the cosmetic-tooltip
   * "Forged under the Pale Horse, Severance Year 3" line.
   */
  provenance: json("provenance").$type<{
    latestSeal?: number;
    activeYearly?: string;
    dominantHorseman?: "conquest" | "war" | "famine" | "death";
    stampedAt?: string;
  } | null>(),
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_cosmetic_catalog_ownership_user").on(table.userId),
  uniqUserCosmetic: uniqueIndex("uniq_cosmetic_catalog_ownership_user_item")
    .on(table.userId, table.cosmeticId),
}));
export type CosmeticCatalogOwnershipRow = typeof cosmeticCatalogOwnership.$inferSelect;

/* ─── DONATIONS ─── */
export const donations = mysqlTable("donations", {
  id: int("id").primaryKey().autoincrement(),
  donorId: int("donorId").notNull().references(() => users.id, { onDelete: "cascade" }),
  guildId: int("guildId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  donationType: varchar("donationType", { length: 20 }).notNull(),
  itemKey: varchar("itemKey", { length: 100 }),
  amount: int("amount").notNull().default(1),
  reputationEarned: int("reputationEarned").notNull().default(0),
  donatedAt: timestamp("donatedAt").defaultNow().notNull(),
});
export type DonationRow = typeof donations.$inferSelect;

export const donationReputation = mysqlTable("donation_reputation", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  guildId: int("guildId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  totalReputation: int("totalReputation").notNull().default(0),
  weeklyDonations: json("weeklyDonations").$type<Record<string, number>>(),
  weekResetAt: timestamp("weekResetAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type DonationReputationRow = typeof donationReputation.$inferSelect;

/* ─── SOCIAL: FRIENDS ─── */
export const friends = mysqlTable("friends", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  friendId: int("friendId").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type FriendRow = typeof friends.$inferSelect;

export const directMessages = mysqlTable("direct_messages", {
  id: int("id").primaryKey().autoincrement(),
  fromUserId: int("fromUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  toUserId: int("toUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  readAt: timestamp("readAt"),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
});
export type DirectMessageRow = typeof directMessages.$inferSelect;

export const guildRecruitment = mysqlTable("guild_recruitment", {
  id: int("id").primaryKey().autoincrement(),
  guildId: int("guildId").notNull().unique().references(() => guilds.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
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
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
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
  promoCodeId: int("promoCodeId").notNull().references(() => promoCodes.id, { onDelete: "restrict" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  /**
   * Stable string id (e.g. "power_up", "ark-food"). Optional for
   * legacy votes seeded before the consequence applier landed;
   * required for new votes so the structured-consequence
   * registry in apps/shared/governanceConsequenceMap.ts can
   * resolve the winning option without ordinal coupling.
   */
  optionId: varchar("optionId", { length: 128 }),
  optionText: varchar("optionText", { length: 255 }).notNull(),
  description: text("description"),
  rewardOnWin: json("rewardOnWin"),
  voteCount: int("voteCount").default(0).notNull(),
  isWinner: boolean("isWinner").default(false).notNull(),
});

export const playerVotes = mysqlTable("player_votes", {
  id: int("id").primaryKey().autoincrement(),
  voteId: varchar("voteId", { length: 128 }).notNull(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  optionNumber: int("optionNumber").notNull(),
  votedAt: timestamp("votedAt").defaultNow().notNull(),
}, (table) => ({
  /** Prevent duplicate votes — one vote per user per poll */
  uniqueUserVote: uniqueIndex("uq_player_votes_user_vote").on(table.voteId, table.userId),
  /** Fast lookup by vote */
  voteIdx: index("idx_player_votes_vote").on(table.voteId),
}));

/* ═══════════════════════════════════════════════════════
   ROMANCE LADDERS — per-player progression on each NPC
   romance candidate. Sprint 2 #12-#16 of the choice-impact
   roadmap. The audit named the gap: zero player-facing
   romances vs. Bioware genre baseline.

   stage ranges 0..5:
     0 — not started
     1 — Acquaintance (default flirt available)
     2 — Mutual interest (one personal-quest beat unlocks)
     3 — Commitment (exclusivity decision; locks competing romances)
     4 — Intimacy (one fade-to-black or artistic scene)
     5 — Devotion (post-romance reactivity in cutscenes)

   Stage 3 commitment writes a public flag
   `romance:committed:<npcId>` that other romance ladders'
   gates check via reactsToPublicFlag — the existing Vex/Locke
   exclusivity pattern, generalised.
   ═══════════════════════════════════════════════════════ */
export const romanceLadders = mysqlTable("romance_ladders", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  npcId: varchar("npcId", { length: 64 }).notNull(),
  stage: int("stage").notNull().default(0),
  /** Whether the player committed to exclusivity at stage 3.
   *  Once true, advancing other ladders past stage 2 is gated. */
  exclusive: boolean("exclusive").notNull().default(false),
  /** Whether the romance ended (broken off / partner died /
   *  player rejected). Stays in the table so post-romance
   *  reactivity can fire ("the one I lost"). */
  ended: boolean("ended").notNull().default(false),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqueUserNpc: uniqueIndex("uq_romance_user_npc").on(table.userId, table.npcId),
  userIdx: index("idx_romance_user").on(table.userId),
}));
export type RomanceLadder = typeof romanceLadders.$inferSelect;

/* ═══════════════════════════════════════════════════════
   ENCOUNTER PROGRESS — per-player walk-state for the
   Hierarchy demon-lord encounters, the Malkia revolution
   questline, and the Source/Kael philosophical dialogue.
   The content (shared/encounters/*.ts) is phase-keyed; the
   dispatcher records which phase the player is currently in
   plus the branch they picked at any choice point. The set
   of fired flags is sourced from npc_public_flags as usual.
   ═══════════════════════════════════════════════════════ */
export const encounterProgress = mysqlTable("encounter_progress", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Stable encounter id ('master_of_rlyeh', 'pale_emissary',
   *  'reckoning_daughter', 'malkia_revolution', 'source_kael'). */
  encounterId: varchar("encounterId", { length: 64 }).notNull(),
  /** Which phase the player is currently inside. */
  phase: mysqlEnum("phase", ["entry", "negotiation", "resolution", "aftermath"])
    .notNull()
    .default("entry"),
  /** Branch picked at the choice point, if any. The encounter
   *  content uses setsFlags entries like 'rlyeh_resolution_purchase'
   *  to mark branches; we mirror the choice here for fast UI. */
  branchChosen: varchar("branchChosen", { length: 64 }),
  /** True once the aftermath phase has played to completion. */
  completed: boolean("completed").notNull().default(false),
  /** For Malkia: which step (1-6) the player is on. Encounters
   *  without internal steps leave this null. */
  step: int("step"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqueUserEncounter: uniqueIndex("uq_encounter_user").on(table.userId, table.encounterId),
  userIdx: index("idx_encounter_user").on(table.userId),
}));
export type EncounterProgress = typeof encounterProgress.$inferSelect;

/* ═══════════════════════════════════════════════════════
   THOUGHT VIRUS INFECTION — per-(user, sector) infection
   level (0-100). Item 9 of the choice-impact follow-up. The
   infection grows daily until containment caps at 100;
   containment actions reduce the level. Sectors live in
   apps/shared/thoughtVirusSpread.ts.
   ═══════════════════════════════════════════════════════ */
export const thoughtVirusInfection = mysqlTable("thought_virus_infection", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sectorId: varchar("sectorId", { length: 64 }).notNull(),
  level: int("level").notNull().default(0),
  /** Last day a containment action ran in this sector — used
   *  to gate cooldowns. */
  lastContainmentAt: timestamp("lastContainmentAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqueUserSector: uniqueIndex("uq_virus_user_sector").on(table.userId, table.sectorId),
  userIdx: index("idx_virus_user").on(table.userId),
}));
export type ThoughtVirusInfection = typeof thoughtVirusInfection.$inferSelect;

/* ═══════════════════════════════════════════════════════
   LYRA VOX QUESTLINE PROGRESS — per-user step + chosen
   theory / witness / verdict. Item 11 of the choice-impact
   follow-up.
   ═══════════════════════════════════════════════════════ */
export const lyraVoxProgress = mysqlTable("lyra_vox_progress", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  currentStep: varchar("currentStep", { length: 32 }).notNull().default("file"),
  theoryChosen: varchar("theoryChosen", { length: 32 }),
  doorOpened: varchar("doorOpened", { length: 32 }),
  witnessBelieved: varchar("witnessBelieved", { length: 32 }),
  verdict: varchar("verdict", { length: 32 }),
  completed: boolean("completed").notNull().default(false),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqueUser: uniqueIndex("uq_lyra_vox_user").on(table.userId),
}));
export type LyraVoxProgress = typeof lyraVoxProgress.$inferSelect;

/* ═══════════════════════════════════════════════════════
   FACTION STANDING — per-player reputation with the five
   designed factions. Sprint 2 of the choice-impact roadmap;
   the audit named this gap (no userFactionStanding column,
   alignment lore unbacked by mechanics).

   Standing range: -100 (sworn enemy) to +100 (champion). Each
   row is a (userId, factionId) pair; rows are upserted via
   factionStandingService.applyDelta. The service writes a
   public flag at threshold crossings (faction:championed:* /
   faction:enemied:*) so existing NPC banks read alignment via
   the same mechanism as governance outcomes.
   ═══════════════════════════════════════════════════════ */
export const userFactionStanding = mysqlTable("user_faction_standing", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  factionId: varchar("factionId", { length: 64 }).notNull(),
  standing: int("standing").notNull().default(0),
  /** Highest standing ever reached — for "championed" achievements. */
  peakStanding: int("peakStanding").notNull().default(0),
  /** Lowest standing ever reached — for "enemied" achievements. */
  troughStanding: int("troughStanding").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userFactionUniq: uniqueIndex("uq_user_faction_standing").on(table.userId, table.factionId),
  userIdx: index("idx_user_faction_standing_user").on(table.userId),
}));
export type UserFactionStanding = typeof userFactionStanding.$inferSelect;

/* ═══════════════════════════════════════════════════════
   VOTE TOME ENTRIES — Antiquarian inscriptions per closed vote.
   Written exactly once when a vote's structured consequences
   are applied (see voteConsequenceApplier). The Governance Hub
   renders these to all players; `annotation` gates on
   Antiquarian trust ≥ 60.
   ═══════════════════════════════════════════════════════ */
export const voteAntiquarianEntries = mysqlTable("vote_antiquarian_entries", {
  id: int("id").primaryKey().autoincrement(),
  voteId: varchar("voteId", { length: 128 }).notNull(),
  winningOptionNumber: int("winningOptionNumber").notNull(),
  body: text("body").notNull(),
  annotation: text("annotation"),
  inscribedAt: timestamp("inscribedAt").defaultNow().notNull(),
}, (table) => ({
  voteIdIdx: index("idx_vote_antiquarian_entries_vote").on(table.voteId),
  uniqueVote: uniqueIndex("uq_vote_antiquarian_entries_vote").on(table.voteId),
}));
export type VoteAntiquarianEntry = typeof voteAntiquarianEntries.$inferSelect;

/* ═══════════════════════════════════════════════════════
   WORLD MODIFIERS — Active multipliers from vote outcomes,
   seasonal events, and rehearsal protocols. Consumers
   (combat scaling, crafting XP, daily-vote badge UI) query
   `getActiveWorldModifiers()` and apply their own scaling.
   ═══════════════════════════════════════════════════════ */
export const worldModifiers = mysqlTable("world_modifiers", {
  id: int("id").primaryKey().autoincrement(),
  modifierKey: varchar("modifierKey", { length: 128 }).notNull(),
  modifierType: varchar("modifierType", { length: 64 }).notNull(),
  modifierValue: int("modifierValue").notNull(),
  description: text("description"),
  source: varchar("source", { length: 256 }),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
  isActive: boolean("isActive").default(true).notNull(),
}, (table) => ({
  modifierKeyIdx: index("idx_world_modifiers_key").on(table.modifierKey),
  activeIdx: index("idx_world_modifiers_active").on(table.isActive),
  uniqueKey: uniqueIndex("uq_world_modifiers_key").on(table.modifierKey),
}));
export type WorldModifier = typeof worldModifiers.$inferSelect;

/* ═══════════════════════════════════════════════════════
   DAILY GOVERNANCE VOTES — server-persisted ship-management
   binary choices. Phase 2 of the governance wiring; replaces
   the old client-only Zustand store. Per-day deterministic
   template id; player choice tallied; winning side activates a
   24-hour world modifier surfaced as a badge on the hub.
   ═══════════════════════════════════════════════════════ */
export const dailyGovernanceVotes = mysqlTable("daily_governance_votes", {
  id: int("id").primaryKey().autoincrement(),
  dateKey: varchar("dateKey", { length: 16 }).notNull(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  side: mysqlEnum("side", ["A", "B"]).notNull(),
  votedAt: timestamp("votedAt").defaultNow().notNull(),
}, (table) => ({
  uniqueUserDate: uniqueIndex("uq_daily_governance_votes_user_date").on(table.dateKey, table.userId),
  dateIdx: index("idx_daily_governance_votes_date").on(table.dateKey),
}));
export type DailyGovernanceVote = typeof dailyGovernanceVotes.$inferSelect;

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
  adminId: int("adminId").notNull().references(() => users.id, { onDelete: "restrict" }),
  action: varchar("action", { length: 128 }).notNull(),
  details: json("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══ EIDOLON SOUL BOND ═══
export const eidolonBonds = mysqlTable("eidolon_bonds", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  event: varchar("event", { length: 128 }).notNull(),
  properties: json("properties").$type<Record<string, string | number | boolean>>(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  clientTimestamp: timestamp("clientTimestamp").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  idxUserId: index("idx_analytics_user").on(table.userId),
  idxEvent: index("idx_analytics_event").on(table.event),
  idxCreatedAt: index("idx_analytics_created").on(table.createdAt),
  // Composite landed via migration 0067 — dashboards group by event
  // name within a time window. Declared here so db:push doesn't
  // propose dropping it.
  idxEventCreated: index("idx_analytics_events_name_created").on(table.event, table.createdAt),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  /** When the vote should auto-close. Read by mysteryClosureCron
   *  (see docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §10).
   *  Null means "no scheduled expiry — close manually." */
  expiresAt: timestamp("expiresAt"),
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
  userId: int("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  epochsVoted: json("epochsVoted").$type<Record<string, string[]>>(),
  archetype: varchar("archetype", { length: 50 }),
  archetypeEarnedAt: timestamp("archetypeEarnedAt"),
  shadowTongueCatches: int("shadowTongueCatches").notNull().default(0),
  campaignComplete: int("campaignComplete").notNull().default(0),
});

export type PlayerEpochProgress = typeof playerEpochProgress.$inferSelect;

/* ═══════════════════════════════════════════════════════
   MYSTERY ENGINE — Streamed Prism episodic detective layer

   Six tables hold per-player progress through the Mystery
   Engine's NPC arcs (Wraith, Jericho, Seer, Vex, Game Master,
   Degen) plus vote-spawned and anniversary mysteries. The
   authored side lives in apps/shared/episodeMysteries.ts;
   the orchestration layer is apps/server/services/mysteryService.ts.

   See docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §10 for the
   architectural placement and §11 for the verification probes.
   ═══════════════════════════════════════════════════════ */

/**
 * Per-player progress through one mystery. The (userId, mysteryId)
 * pair is unique — a player has at most one progress row per
 * authored mystery; re-opening the case re-uses the row.
 */
export const playerMysteryProgress = mysqlTable("player_mystery_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Branded MysteryId (see apps/shared/mysteryTypes.ts). */
  mysteryId: varchar("mysteryId", { length: 100 }).notNull(),
  /** Branded EpisodeId — current episode in display order. */
  currentEpisodeId: varchar("currentEpisodeId", { length: 100 }).notNull(),
  openedAt: timestamp("openedAt").defaultNow().notNull(),
  lastActedAt: timestamp("lastActedAt").defaultNow().onUpdateNow().notNull(),
  /** Branded LensId — the player's chosen faction/class/race lens. */
  lensId: varchar("lensId", { length: 50 }).notNull(),
  /** True when the player joined mid-arc; service renders a
   *  recap before the next room beat is shown. */
  recapNeeded: int("recapNeeded").notNull().default(0),
}, (table) => ({
  uniqUserMystery: uniqueIndex("uniq_pmp_user_mystery").on(table.userId, table.mysteryId),
  idxLastActed: index("idx_pmp_last_acted").on(table.lastActedAt),
}));

export type PlayerMysteryProgressRow = typeof playerMysteryProgress.$inferSelect;
export type InsertPlayerMysteryProgress = typeof playerMysteryProgress.$inferInsert;

/**
 * Evidence — a clue the player has found, with metadata for the
 * journal display and interrogation cross-reference. Idempotent:
 * the (userId, mysteryId, clueId) triple is unique so re-finding
 * a clue is a no-op.
 */
export const mysteryEvidence = mysqlTable("mystery_evidence", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  mysteryId: varchar("mysteryId", { length: 100 }).notNull(),
  /** Branded ClueId. */
  clueId: varchar("clueId", { length: 100 }).notNull(),
  foundAt: timestamp("foundAt").defaultNow().notNull(),
  /** Room id where the clue was found, or "recap" / "interrogation"
   *  for non-room sources. */
  foundInRoom: varchar("foundInRoom", { length: 64 }).notNull(),
  /** Verb that fired the clue-find ("look" / "use" / "talk" /
   *  "interrogate" / "recap"). */
  foundViaVerb: varchar("foundViaVerb", { length: 24 }).notNull(),
  /** NPC ids the player has presented this clue to during
   *  interrogation. JSON array; empty = unpresented. */
  presentedToNpcs: json("presentedToNpcs").$type<string[]>().notNull().default([]),
  /** Free-form player notes on this clue. Null until the player
   *  authors a journal entry. */
  notes: text("notes"),
}, (table) => ({
  uniqUserMysteryClue: uniqueIndex("uniq_evidence_user_mystery_clue").on(table.userId, table.mysteryId, table.clueId),
  idxUserMystery: index("idx_evidence_user_mystery").on(table.userId, table.mysteryId),
}));

export type MysteryEvidenceRow = typeof mysteryEvidence.$inferSelect;
export type InsertMysteryEvidence = typeof mysteryEvidence.$inferInsert;

/**
 * Each submitted deduction. Append-only — the player's full
 * deduction history feeds the season-roll-up grading and the
 * recap surface. The (userId, mysteryId, episodeId, clueAId,
 * clueBId, clueCId) tuple is unique-ish but we leave it open
 * so the player can re-attempt the same pair (engine grades
 * on first-correct).
 */
export const mysteryDeductions = mysqlTable("mystery_deductions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  mysteryId: varchar("mysteryId", { length: 100 }).notNull(),
  episodeId: varchar("episodeId", { length: 100 }).notNull(),
  clueAId: varchar("clueAId", { length: 100 }).notNull(),
  clueBId: varchar("clueBId", { length: 100 }).notNull(),
  /** Optional third clue for 3-clue deductions. */
  clueCId: varchar("clueCId", { length: 100 }),
  /** "correct" / "partial" / "false_lead_named" / "nonsense". */
  result: varchar("result", { length: 24 }).notNull(),
  /** Manifest key for the authored reveal narration. */
  narrationId: varchar("narrationId", { length: 200 }).notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
}, (table) => ({
  idxUserMysteryEpisode: index("idx_deductions_user_mystery_episode").on(table.userId, table.mysteryId, table.episodeId),
}));

export type MysteryDeductionRow = typeof mysteryDeductions.$inferSelect;
export type InsertMysteryDeduction = typeof mysteryDeductions.$inferInsert;

/**
 * Choices the player made at episode close. Choice carry-forward
 * surfaces in `CaseRecap.tsx` ("X will remember that"). The
 * willRememberFlag is the NPC id whose memory the choice marked.
 */
export const playerMysteryChoices = mysqlTable("player_mystery_choices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  mysteryId: varchar("mysteryId", { length: 100 }).notNull(),
  episodeId: varchar("episodeId", { length: 100 }).notNull(),
  /** Branded ChoiceId. */
  choiceId: varchar("choiceId", { length: 100 }).notNull(),
  /** Free-form weight tag aggregated by the season-roll-up
   *  ("ruthless" / "patient" / "trusting" / "skeptical" / etc.). */
  weight: varchar("weight", { length: 50 }).notNull(),
  /** NPC id whose memory the choice marked. Empty string when
   *  the choice didn't bind to an NPC. */
  willRememberFlag: varchar("willRememberFlag", { length: 100 }).notNull().default(""),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
}, (table) => ({
  uniqUserMysteryEpisode: uniqueIndex("uniq_choice_user_mystery_episode").on(table.userId, table.mysteryId, table.episodeId),
}));

export type PlayerMysteryChoiceRow = typeof playerMysteryChoices.$inferSelect;
export type InsertPlayerMysteryChoice = typeof playerMysteryChoices.$inferInsert;

/**
 * Interrogation log — every (npc, question, tone) tuple the
 * player presses, with the trust delta that was applied. Drives
 * the L.A. Noire Truth/Doubt/Lie audit and the per-NPC trust
 * scalar finalization at arc close.
 */
export const mysteryInterrogationLog = mysqlTable("mystery_interrogation_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
  mysteryId: varchar("mysteryId", { length: 100 }).notNull(),
  episodeId: varchar("episodeId", { length: 100 }).notNull(),
  npcId: varchar("npcId", { length: 100 }).notNull(),
  /** Authored question id (per-NPC, per-episode authoring). */
  questionId: varchar("questionId", { length: 200 }).notNull(),
  /** "press" / "accept" / "challenge" — see ToneId in
   *  apps/shared/mysteryTypes.ts. */
  toneId: varchar("toneId", { length: 24 }).notNull(),
  /** Trust delta that was applied at the moment the question
   *  fired; durable so retroactive scalar adjustments don't
   *  rewrite history. */
  trustDeltaApplied: int("trustDeltaApplied").notNull().default(0),
  askedAt: timestamp("askedAt").defaultNow().notNull(),
}, (table) => ({
  idxUserNpc: index("idx_interrogation_user_npc").on(table.userId, table.npcId),
  idxUserMysteryEpisode: index("idx_interrogation_user_mystery_episode").on(table.userId, table.mysteryId, table.episodeId),
}));

export type MysteryInterrogationLogRow = typeof mysteryInterrogationLog.$inferSelect;
export type InsertMysteryInterrogationLog = typeof mysteryInterrogationLog.$inferInsert;

/**
 * Per-player NPC trust scalars. Finalized by an arc close;
 * read by every NPC's dialog renderer to pick banded VO. The
 * (userId, npcId) pair is unique — one canonical scalar per
 * (player, NPC).
 *
 * This covers the gap noted in §7: the 5 NPCs without a per-
 * player trust scalar today (Wraith / Seer / Vex / Game Master /
 * Degen) get scalars seeded by their arc episodes; finalizedFromArc
 * stores which arc closed it.
 */
export const npcTrustScalars = mysqlTable("npc_trust_scalars", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  npcId: varchar("npcId", { length: 100 }).notNull(),
  /** 0-100, with 50 as the neutral midpoint. */
  scalar: int("scalar").notNull().default(50),
  /** Most recent mystery whose result moved the scalar. Null
   *  while the scalar is at its initial midpoint. */
  lastUpdatedFromMysteryId: varchar("lastUpdatedFromMysteryId", { length: 100 }),
  /** Branded ArcId — which arc finalized this scalar. Null
   *  until the arc closes. */
  finalizedFromArc: varchar("finalizedFromArc", { length: 100 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqUserNpc: uniqueIndex("uniq_trust_user_npc").on(table.userId, table.npcId),
}));

export type NpcTrustScalarRow = typeof npcTrustScalars.$inferSelect;
export type InsertNpcTrustScalar = typeof npcTrustScalars.$inferInsert;

/**
 * Mystery seeds — the persistent record of every MysterySeed
 * the engine has ever produced (vote closures, anniversaries,
 * pattern triggers). The cron writes a row here on every
 * successful close; the server-startup bootstrap reads them
 * back and re-compiles each seed via mysteryTemplates.compileMysterySeed
 * so the in-memory dynamic registry survives deploys.
 *
 * Compilation is deterministic (same seed → same MysteryDefinition
 * by template contract), so re-hydration is idempotent.
 *
 * The unique index on `seedId` makes the cron's insert safe to
 * retry — a second pass over the same closed vote is a no-op.
 */
export const mysterySeeds = mysqlTable("mystery_seeds", {
  id: int("id").autoincrement().primaryKey(),
  /** Canonical seed.seedId — e.g. "epoch_vote_closure.ap_v1.a". */
  seedId: varchar("seedId", { length: 200 }).notNull(),
  /** MysterySeedSource enum value as a plain string. */
  source: varchar("source", { length: 40 }).notNull(),
  /** Template id used to compile this seed at runtime. */
  templateId: varchar("templateId", { length: 100 }).notNull(),
  /** Template-specific payload — schema is the template's contract. */
  payload: json("payload").$type<Record<string, unknown>>().notNull(),
  /** Branded MysteryId — populated when compile succeeded.
   *  Null when the template rejected the payload. */
  compiledMysteryId: varchar("compiledMysteryId", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqSeedId: uniqueIndex("uniq_mystery_seeds_seedId").on(table.seedId),
}));

export type MysterySeedRow = typeof mysterySeeds.$inferSelect;
export type InsertMysterySeed = typeof mysterySeeds.$inferInsert;

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
  userId: int("userId").references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  championUserId: int("championUserId").references(() => users.id, { onDelete: "cascade" }),
  closedAt: timestamp("closedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CircuitSeasonRow = typeof circuitSeasons.$inferSelect;

export const circuitRaceResults = mysqlTable("circuit_race_results", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  seasonId: int("seasonId").notNull().references(() => battlePassSeasons.id, { onDelete: "restrict" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
  seasonId: int("seasonId").notNull().references(() => battlePassSeasons.id, { onDelete: "restrict" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  seasonId: int("seasonId").notNull().references(() => battlePassSeasons.id, { onDelete: "restrict" }),
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
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  seasonId: int("seasonId").notNull().references(() => battlePassSeasons.id, { onDelete: "restrict" }),
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
  authorId: int("authorId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  contributionId: int("contributionId").notNull().references(() => codexContributions.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  /** Lifetime Dream wagered */
  totalWagered: int("totalWagered").notNull().default(0),
  /** Lifetime Dream won */
  totalWon: int("totalWon").notNull().default(0),
  /** Session wins/losses (reset per login) */
  sessionWins: int("sessionWins").notNull().default(0),
  sessionLosses: int("sessionLosses").notNull().default(0),
  /** VIP tier 0-5 */
  vipLevel: int("vipLevel").notNull().default(0),
  /** Daily free plays remaining (legacy single-counter; preserved for
   *  backwards-compat — the new per-game rotation lives in
   *  `freeSpinsByGame` below). */
  freeSpinsLeft: int("freeSpinsLeft").notNull().default(3),
  /** Per-game free-spin allotment for today (audit/16 PR 3 —
   *  rotating-spins engagement loop). Resets at UTC midnight to the
   *  day's grant: weekdays grant 1 spin to a single rotating game
   *  (slots / pazaak / dice / roulette / high_low); weekends grant 1
   *  spin to two games. JSON-shape `{ [gameId]: count }`. Empty/null
   *  is the "no free spins remaining" state. */
  freeSpinsByGame: json("freeSpinsByGame").$type<Record<string, number>>().default({}),
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
  /** Daily net-loss accumulator (enforces MAX_DAILY_NET_LOSS — audit/16
   *  GA4 harm-reduction). bet - winnings summed across all paid games
   *  in the UTC day; resets when dailyCounterDate rolls over. */
  dailyLost: int("dailyLost").notNull().default(0),
  /** Daily Void Cases opened (enforces 5/day limit — audit/16 GA2
   *  harm-reduction). */
  dailyVoidCasesOpened: int("dailyVoidCasesOpened").notNull().default(0),
  /** YYYY-MM-DD string used to reset daily counters */
  dailyCounterDate: varchar("dailyCounterDate", { length: 10 }),
  /** audit/16 PR 3 — Pazaak tournament daily-entry gate. Stores
   *  the YYYY-MM-DD of the player's last tournament entry; an
   *  entry is rejected if this matches today's UTC date. Resets
   *  organically when the player enters on a new day. */
  lastPazaakTournamentDate: varchar("lastPazaakTournamentDate", { length: 10 }),
  /** Last tournament's full bracket result, JSON-encoded — lets
   *  the player re-view today's bracket from the UI without
   *  another DB query. Cleared on entry. */
  lastPazaakTournamentResult: json("lastPazaakTournamentResult").$type<Record<string, unknown>>(),
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
  lastWinnerId: int("lastWinnerId").references(() => users.id, { onDelete: "cascade" }),
  lastWinAt: timestamp("lastWinAt"),
  /** When the most recent claim was broadcast to players. Lets
   *  claimJackpot avoid double-sending notifications on retries. */
  lastBroadcastAt: timestamp("lastBroadcastAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type CasinoJackpotPoolRow = typeof casinoJackpotPool.$inferSelect;

export const casinoResults = mysqlTable("casino_results", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
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
  senderId: int("senderId").notNull().references(() => users.id, { onDelete: "cascade" }),
  recipientId: int("recipientId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  deathRecord: json("deathRecord").$type<{
    cycle: number;
    cause: string;
    lastWords: string;
    epitaph?: string;
    romanced?: boolean;
    personalQuestStage?: number;
  } | null>(),
  /** "bred"|"trained"|"cloned"|"resurrected"|"summoned"|"recruited". Nullable
   *  for back-compat with rows that predate the unified-roster migration. */
  productionPath: varchar("productionPath", { length: 16 }),
  /** Apprentice archetype tag. */
  archetype: varchar("archetype", { length: 24 }),
  /** Auto-appended biography entries. */
  biography: json("biography").$type<{ cycle: number; text: string; tag: string }[]>().default([]).notNull(),
  /** Personal-quest stage (0..3). */
  personalQuestStage: int("personalQuestStage").notNull().default(0),
  /** "deepened" | "broken" | null — set at stage 3 breaking point. */
  personalQuestResolution: varchar("personalQuestResolution", { length: 16 }),
  /** Resurrection decay 0..N. */
  cloneDegradation: int("cloneDegradation").notNull().default(0),
  /** Predecessor id for Hellbox-restored crew. */
  resurrectedFromId: varchar("resurrectedFromId", { length: 64 }),
  /** Soul-stone id this demon is bound to. */
  boundStoneId: varchar("boundStoneId", { length: 64 }),
  /** Demon corruption 0..100. */
  corruption: int("corruption").notNull().default(0),
  /** Canonical NPC key for productionPath="recruited". */
  linkedNpcKey: varchar("linkedNpcKey", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userMemberIdx: uniqueIndex("uq_crew_member_user_key").on(table.userId, table.memberKey),
  userIdx: index("idx_crew_member_user").on(table.userId),
  bloodlineIdx: index("idx_crew_member_bloodline").on(table.bloodlineKey),
  statusIdx: index("idx_crew_member_status").on(table.status),
  productionPathIdx: index("idx_crew_member_production_path").on(table.productionPath),
  linkedNpcIdx: index("idx_crew_member_linked_npc").on(table.linkedNpcKey),
}));

export type CrewMemberRow = typeof crewMembers.$inferSelect;
export type InsertCrewMember = typeof crewMembers.$inferInsert;

export const crewBloodlines = mysqlTable("crew_bloodlines", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  /** If a match was played, the cardGameMatch id for replay.
   *  set null on match deletion: the campaign progress row keeps
   *  its stars / branchChoices / morality data, just loses the
   *  replay link. */
  matchId: int("matchId").references(() => cardGameMatches.id, { onDelete: "set null" }),
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
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
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
   CELEBRATION TRIAL — 28-day Apprentice training persistence
   ═══════════════════════════════════════════════════════ */

export const celebrationTrialState = mysqlTable("celebration_trial_state", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  announcementId: int("announcementId").notNull().references(() => announcements.id, { onDelete: "cascade" }),
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
  userId: int("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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

/**
 * Per-NPC episodic memory (NPC depth #6).
 *
 * Each row records one memorable thing an NPC has noticed about the
 * player, keyed by an event-key from apps/shared/npcs/memoryEvents.ts.
 * Memories are *episodic* — distinct from npc_public_flags (which are
 * binary, sticky, and globally readable). A memory carries:
 *
 *   - eventKey: the typed event-key (e.g. "convoy_spared",
 *     "loredex_citation", "casino_hot_streak") declared in the
 *     memory-event registry.
 *   - polarity: -1, 0, +1 — derived by the writer service from the
 *     event payload, used by the selector's synthetic-flag projection
 *     to pick the right pre-voiced variant line.
 *   - payload: free-form JSON for the writer to attach context (which
 *     specific convoy was spared, which Loredex entry was cited, etc.)
 *     so future variant lines can reference specifics.
 *
 * Memories are written by the rippleEngine + npcMemoryService when a
 * recorded event happens. The selector reads them via
 * synthesizeMemoryFlags() in apps/shared/npcs/memoryEvents.ts and
 * matches them against per-line `unlockFlags`.
 *
 * Optional expiresAt supports "fresh memory" semantics — a memory
 * past its expiry is treated as forgotten. Default-null memories
 * persist for the lifetime of the save.
 */
export const npcMemory = mysqlTable("npc_memory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** NpcKey from apps/shared/npcs/types.ts. */
  npcKey: varchar("npcKey", { length: 64 }).notNull(),
  /** Event-key from apps/shared/npcs/memoryEvents.ts MEMORY_EVENT_REGISTRY. */
  eventKey: varchar("eventKey", { length: 96 }).notNull(),
  /** Polarity: -1 = disapproved, 0 = noticed, +1 = approved. */
  polarity: int("polarity").notNull().default(0),
  /** Optional JSON payload (specifics the variant line may interpolate). */
  payload: json("payload").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** Null = persistent. Set for fading-memory semantics. */
  expiresAt: timestamp("expiresAt"),
}, (table) => ({
  userIdIdx: index("idx_npc_memory_user_id").on(table.userId),
  userNpcEventIdx: index("idx_npc_memory_user_npc_event").on(
    table.userId,
    table.npcKey,
    table.eventKey,
  ),
}));
export type NpcMemoryRow = typeof npcMemory.$inferSelect;
export type InsertNpcMemory = typeof npcMemory.$inferInsert;

/**
 * Per-player Shadow Tongue redaction state (NPC depth #13).
 *
 * Tracks (player, entry) pairs where the Shadow Tongue has either
 * suppressed information or had its suppression broken. Distinct from
 * the singleton `shadow_tongue_state` (community-wide power level +
 * room/artifact edits) — this table is per-player Loredex redaction.
 *
 * Two row kinds:
 *   - state rows  (triggerKey IS NULL) — declare the player's current
 *     redaction state for a Loredex entry (visible/redacted/partial/
 *     contradictory). Computed lazily by computeRedactionState() and
 *     persisted opportunistically.
 *   - trigger rows (triggerKey IS NOT NULL) — record that a reveal
 *     trigger fired for the player. The encoded key matches the
 *     output of encodeTriggerKey() in apps/shared/universe/shadowTongue.ts.
 *
 * The compound (userId, entryId, triggerKey) uniqueness keeps trigger
 * rows idempotent and allows multiple state rows to coexist with
 * trigger rows for the same entry — the service reads triggers first,
 * then short-circuits the computation if any apply.
 */
export const shadowTongueRedactions = mysqlTable("shadow_tongue_redactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Loredex entryId from apps/client/src/data/loredex-data.json. */
  entryId: varchar("entryId", { length: 96 }).notNull(),
  /**
   * Encoded trigger key (encodeTriggerKey output) when this row
   * records a fired reveal trigger; NULL when this row records
   * computed redaction state.
   */
  triggerKey: varchar("triggerKey", { length: 128 }),
  /**
   * Resolved redaction state (visible/redacted/partial/contradictory).
   * Only meaningful when triggerKey IS NULL; otherwise NULL.
   */
  redactionState: varchar("redactionState", { length: 32 }),
  /** Last computed-or-fired-at. */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_shadow_tongue_redactions_user_id").on(table.userId),
  userEntryIdx: index("idx_shadow_tongue_redactions_user_entry").on(
    table.userId,
    table.entryId,
  ),
  // (userId, entryId, triggerKey) uniqueness — triggerKey may be NULL
  // for state rows, distinct null treatment is MySQL-default.
  userEntryTriggerUniq: uniqueIndex(
    "uniq_shadow_tongue_redactions_user_entry_trigger",
  ).on(table.userId, table.entryId, table.triggerKey),
}));
export type ShadowTongueRedactionRow = typeof shadowTongueRedactions.$inferSelect;
export type InsertShadowTongueRedaction = typeof shadowTongueRedactions.$inferInsert;

/**
 * Per-player tick-event log (NPC depth #12 — "what happened while
 * you were away"). The shipping seasonTickService already advances
 * the world clock and per-user agendas. This table captures the
 * player-relevant fragments of that activity so they can be
 * surfaced as a session-resume summary report.
 *
 * Each row records one notable in-fiction event: a faction objective
 * advanced, an NPC agenda stage fired, a Shadow Tongue power tick,
 * an Architect/Dreamer plot-beat fired, etc. The kind discriminator
 * matches TickEventKind in apps/shared/universe/tickEvents.ts.
 *
 * Acknowledgement: rows have an `acknowledgedAt` column (nullable).
 * The session-resume report reads every unacknowledged row, then
 * batch-acknowledges them. Old acknowledged rows are kept for
 * analytics; a cron can prune past N days.
 */
export const tickEvents = mysqlTable("tick_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Discriminator. See TickEventKind in shared/universe/tickEvents.ts. */
  kind: varchar("kind", { length: 64 }).notNull(),
  /**
   * Headline summary the report renders by default. May be voiced
   * via the `voId` field; renderers fall back to text if voId is null.
   */
  summary: varchar("summary", { length: 512 }).notNull(),
  /**
   * Optional VO id from a per-character or universe-narrator manifest.
   * If set, the resume-report client plays this audio while showing
   * the summary text.
   */
  voId: varchar("voId", { length: 96 }),
  /** Free-form payload (faction id, npc key, stage id, etc). */
  payload: json("payload").$type<Record<string, unknown>>(),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  acknowledgedAt: timestamp("acknowledgedAt"),
}, (table) => ({
  userIdIdx: index("idx_tick_events_user_id").on(table.userId),
  userUnackIdx: index("idx_tick_events_user_unack").on(
    table.userId,
    table.acknowledgedAt,
  ),
}));
export type TickEventRow = typeof tickEvents.$inferSelect;
export type InsertTickEvent = typeof tickEvents.$inferInsert;

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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  /**
   * Multiplier applied to the contract's final reward, stored as an
   * integer percentage to avoid float storage quirks (100 = 1.00x;
   * 110 = 1.10x; 50 = 0.50x). Accumulates from `reward_modifier`
   * clause effects: each clause multiplies the running modifier.
   * Audit Phase J2.
   */
  rewardModifierPct: int("rewardModifierPct").notNull().default(100),
  signedAt: timestamp("signedAt").defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trade_contracts_user_id").on(table.userId),
  userStatusIdx: index("idx_trade_contracts_user_status").on(table.userId, table.status),
  contractKeyIdx: index("idx_trade_contracts_contract_key").on(table.contractKey),
}));
export type TradeContractRow = typeof tradeContracts.$inferSelect;

/**
 * Per-user trade route tracker — Phase 2.1b. Routes are canonical-
 * keyed by (fromSectorId, toSectorId, cargoCategory?) per
 * makeRouteKey() in apps/shared/tradeEmpire/routes.ts. The
 * runCount drives canonical-route-completion ceremonies at the
 * canonical 5 / 10 / 25 / 50 milestone tiers. milestoneTier
 * tracks the canonical-current canonical-tier reached so the
 * engine canonically fires route_milestone ripples only at
 * canonical-tier-crossings.
 */
export const tradeRoutes = mysqlTable("trade_routes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /**
   * Canonical-stable route key derived from
   * (fromSectorId, toSectorId, cargoCategory?) per
   * makeRouteKey() in apps/shared/tradeEmpire/routes.ts.
   */
  routeKey: varchar("routeKey", { length: 256 }).notNull(),
  /** Canonical-origin sector id. */
  fromSectorId: varchar("fromSectorId", { length: 128 }).notNull(),
  /** Canonical-destination sector id. */
  toSectorId: varchar("toSectorId", { length: 128 }).notNull(),
  /**
   * Optional canonical-cargo-category constraint. Null = canonical-
   * cargo-flexible route (counts runs regardless of cargo).
   */
  cargoCategory: varchar("cargoCategory", { length: 64 }),
  /** Total canonical-completed runs for this canonical-route. */
  runCount: int("runCount").notNull().default(0),
  /**
   * Canonical-current canonical-milestone-tier reached: 0 (none),
   * 5, 10, 25, 50. Engine canonically fires route_milestone ripple
   * only at canonical-tier-crossings.
   */
  milestoneTier: int("milestoneTier").notNull().default(0),
  firstRunAt: timestamp("firstRunAt").defaultNow().notNull(),
  lastRunAt: timestamp("lastRunAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trade_routes_user_id").on(table.userId),
  userRouteUniq: uniqueIndex("uniq_trade_routes_user_route").on(
    table.userId,
    table.routeKey,
  ),
  userRunCountIdx: index("idx_trade_routes_user_run_count").on(
    table.userId,
    table.runCount,
  ),
}));
export type TradeRouteRow = typeof tradeRoutes.$inferSelect;

/**
 * Append-only canonical-milestone log — Phase 2.1b. Records
 * canonical-tier-crossings (5 / 10 / 25 / 50). Drives canonical-
 * route-completion ceremonies (NPC acknowledgment lines per faction:
 * Independent trader / Locke calculation / Antiquarian shelf-
 * categorisation per Seer §4.6 *Programmer's shelf* canon).
 */
export const tradeRouteMilestones = mysqlTable("trade_route_milestones", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  routeKey: varchar("routeKey", { length: 256 }).notNull(),
  /** Canonical-milestone-tier reached: 5 | 10 | 25 | 50. */
  milestoneTier: int("milestoneTier").notNull(),
  /** Run count at the moment of canonical-tier-crossing. */
  runCountAtAchievement: int("runCountAtAchievement").notNull(),
  achievedAt: timestamp("achievedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trade_route_milestones_user_id").on(table.userId),
  userTierIdx: index("idx_trade_route_milestones_user_tier").on(
    table.userId,
    table.milestoneTier,
  ),
  userRouteTierUniq: uniqueIndex(
    "uniq_trade_route_milestones_user_route_tier",
  ).on(table.userId, table.routeKey, table.milestoneTier),
}));
export type TradeRouteMilestoneRow =
  typeof tradeRouteMilestones.$inferSelect;

/**
 * Per-user sector-arrival tracker — Phase 2.1b. Records canonical-
 * first-visit per sector so the engine canonically fires
 * sector_first_entered ripple exactly once per sector per user
 * (drives canonical arrivalCinematic + Eyes-narrator-whisper
 * canonical first-visit experience).
 */
export const tradeSectorArrivals = mysqlTable("trade_sector_arrivals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sectorId: varchar("sectorId", { length: 128 }).notNull(),
  firstEnteredAt: timestamp("firstEnteredAt").defaultNow().notNull(),
  /**
   * Canonical-arrival-cinematic watched? Set true on canonical-
   * cinematic-completion (skip + watched both count).
   */
  cinematicWatched: boolean("cinematicWatched").notNull().default(false),
}, (table) => ({
  userIdIdx: index("idx_trade_sector_arrivals_user_id").on(table.userId),
  userSectorUniq: uniqueIndex("uniq_trade_sector_arrivals_user_sector").on(
    table.userId,
    table.sectorId,
  ),
}));
export type TradeSectorArrivalRow =
  typeof tradeSectorArrivals.$inferSelect;

/**
 * Oracle futures positions — Phase 3 Antiquarian sub-family. Real-world
 * cycle clock: settlesAt = signedAt + cyclesAhead * ORACLE_FUTURES_CYCLE_HOURS
 * (router constant, default 24h). Settlement is lazy-on-read via the
 * router's getOracleFutures procedure, which iterates a user's open
 * futures and calls settleOracleFuture for any whose settlesAt has
 * elapsed. Spot price is derived from the user's recent trade-empire
 * activity in the basis sector during the holding window.
 */
export const tradeOracleFutures = mysqlTable("trade_oracle_futures", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** FK to tradeContracts.id — the parent contract instance.
   *  restrict: contracts are financial records; deleting a contract
   *  with open futures should be blocked, not cascaded. */
  contractId: int("contractId").notNull().references(() => tradeContracts.id, { onDelete: "restrict" }),
  commodity: mysqlEnum("commodity", [
    "credits",
    "materials",
    "influence",
    "intelligence",
  ]).notNull(),
  sectorId: varchar("sectorId", { length: 128 }).notNull(),
  position: mysqlEnum("position", ["call", "put", "spread"]).notNull(),
  strikePrice: int("strikePrice").notNull(),
  projectedPrice: int("projectedPrice").notNull(),
  cyclesAhead: int("cyclesAhead").notNull(),
  signedAt: timestamp("signedAt").defaultNow().notNull(),
  /** Computed = signedAt + cyclesAhead * ORACLE_FUTURES_CYCLE_HOURS hrs. */
  settlesAt: timestamp("settlesAt").notNull(),
  /** Spot price at settlement — null until settled. */
  settlementPrice: int("settlementPrice"),
  /** Payout in credits — positive on win, negative on loss; null until settled. */
  payout: int("payout"),
  status: mysqlEnum("status", ["open", "settled", "cancelled"])
    .notNull()
    .default("open"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trade_oracle_futures_user_id").on(table.userId),
  userStatusIdx: index("idx_trade_oracle_futures_user_status").on(
    table.userId,
    table.status,
  ),
  settlesAtIdx: index("idx_trade_oracle_futures_settles_at").on(table.settlesAt),
}));
export type TradeOracleFutureRow = typeof tradeOracleFutures.$inferSelect;

/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE — Normalized state tables (Phase 4).
   Replaces userProgress.gameData.tradeEmpire JSON blob. Read paths
   compose state from these six tables; legacy blob is backfilled by
   apps/scripts/backfill-trade-empire-blob.ts and then ignored.
   ═══════════════════════════════════════════════════════ */

/** Active mission queue. Capped at 3 concurrent per user (router rule). */
export const tradeActiveMissions = mysqlTable("trade_active_missions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Canonical mission id (e.g., "vox_corridor", "salvage_debris"). */
  missionId: varchar("missionId", { length: 128 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  sectorId: varchar("sectorId", { length: 128 }).notNull(),
  /** ms-since-epoch when mission was dispatched (kept as bigint to match
   *  the JSON blob's number semantics). */
  dispatchedAt: bigint("dispatchedAt", { mode: "number" }).notNull(),
  /** ms duration after which the mission is canonically completable. */
  durationMs: bigint("durationMs", { mode: "number" }).notNull(),
  /** Reward shape (dream / salvage / influence / voidCrystals / xp /
   *  material / materialAmount). */
  reward: json("reward").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trade_active_missions_user_id").on(table.userId),
  userMissionUniq: uniqueIndex("uniq_trade_active_missions_user_mission").on(
    table.userId,
    table.missionId,
  ),
}));
export type TradeActiveMissionRow = typeof tradeActiveMissions.$inferSelect;

/**
 * Append-only completion log. One row per completeMission call.
 * Aggregates (totalMissionsCompleted, totalDreamEarned, totalInfluenceEarned)
 * are kept in tradeEmpireUserAggregates for hot-read performance.
 */
export const tradeCompletedMissions = mysqlTable("trade_completed_missions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  missionId: varchar("missionId", { length: 128 }).notNull(),
  sectorId: varchar("sectorId", { length: 128 }).notNull(),
  dreamEarned: int("dreamEarned").notNull().default(0),
  influenceEarned: int("influenceEarned").notNull().default(0),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trade_completed_missions_user_id").on(table.userId),
  userSectorIdx: index("idx_trade_completed_missions_user_sector").on(
    table.userId,
    table.sectorId,
  ),
}));
export type TradeCompletedMissionRow = typeof tradeCompletedMissions.$inferSelect;

/** Per-(user, sector) reputation + control level. */
export const tradeSectorReputation = mysqlTable("trade_sector_reputation", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sectorId: varchar("sectorId", { length: 128 }).notNull(),
  controlLevel: int("controlLevel").notNull().default(0),
  reputation: int("reputation").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trade_sector_reputation_user_id").on(table.userId),
  userSectorUniq: uniqueIndex("uniq_trade_sector_reputation_user_sector").on(
    table.userId,
    table.sectorId,
  ),
}));
export type TradeSectorReputationRow = typeof tradeSectorReputation.$inferSelect;

/** Spy active cover identities. Only one canonically active per user. */
export const tradeActiveCovers = mysqlTable("trade_active_covers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  coverId: varchar("coverId", { length: 128 }).notNull(),
  targetFactionId: varchar("targetFactionId", { length: 128 }).notNull(),
  expiresAt: bigint("expiresAt", { mode: "number" }).notNull(),
  /** false = active, true = canonically blown / expired / cleared. */
  cleared: boolean("cleared").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trade_active_covers_user_id").on(table.userId),
  userActiveIdx: index("idx_trade_active_covers_user_active").on(
    table.userId,
    table.cleared,
  ),
}));
export type TradeActiveCoverRow = typeof tradeActiveCovers.$inferSelect;

/**
 * Class-sector unlocks (e.g., Spy unlocks intelligence_exchange_nightline).
 * Replaces the "unlocked:<sectorId>" string-marker hack that the legacy
 * blob stored inside completedMissionIds.
 */
export const tradeClassSectorUnlocks = mysqlTable("trade_class_sector_unlocks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sectorId: varchar("sectorId", { length: 128 }).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trade_class_sector_unlocks_user_id").on(table.userId),
  userSectorUniq: uniqueIndex("uniq_trade_class_sector_unlocks_user_sector").on(
    table.userId,
    table.sectorId,
  ),
}));
export type TradeClassSectorUnlockRow =
  typeof tradeClassSectorUnlocks.$inferSelect;

/**
 * Per-user running aggregates for hot reads. Updated transactionally
 * with completion writes; invariant: counters here equal SUM/COUNT
 * over the corresponding append-only tables. Backfilled from the
 * legacy blob's totals.
 */
export const tradeEmpireUserAggregates = mysqlTable(
  "trade_empire_user_aggregates",
  {
    userId: int("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
    totalMissionsCompleted: int("totalMissionsCompleted")
      .notNull()
      .default(0),
    totalDreamEarned: int("totalDreamEarned").notNull().default(0),
    totalInfluenceEarned: int("totalInfluenceEarned").notNull().default(0),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
);
export type TradeEmpireUserAggregateRow =
  typeof tradeEmpireUserAggregates.$inferSelect;

/* ═══════════════════════════════════════════════════════
   COLONY COMMERCE TABLES — Trade Empire Phase B extension.
   Three normalized tables backing the Veska / Inception-Ark
   founding-lane surface. See apps/shared/tradeEmpire/colonyCommerce.ts
   for the type + economics canon and apps/server/routers/colonyCommerce.ts
   for the runtime.
   ═══════════════════════════════════════════════════════ */

/**
 * Active colony lane. One row per founding voyage in flight; on
 * arrival, the row's status flips to "arrived" and a colonyWorlds
 * row is created in the same transaction.
 */
export const colonyLanes = mysqlTable("colony_lanes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Stable lane id (e.g., "lane_<userId>_<bloodlineKey>_<sectorId>_<signedAt>"). */
  laneId: varchar("laneId", { length: 192 }).notNull(),
  sectorId: varchar("sectorId", { length: 128 }).notNull(),
  /** ColonyVesselClass — colony_ship_basic / arkforge / panoptic. */
  vesselClass: varchar("vesselClass", { length: 64 }).notNull(),
  /**
   * Bloodline being seeded. References crewBloodlines.bloodlineKey
   * via the (userId, bloodlineKey) composite — application-level FK,
   * not a hard SQL FK because crewBloodlines.bloodlineKey is unique
   * only within (userId, bloodlineKey).
   */
  bloodlineKey: varchar("bloodlineKey", { length: 64 }).notNull(),
  signedAt: bigint("signedAt", { mode: "number" }).notNull(),
  durationMs: bigint("durationMs", { mode: "number" }).notNull(),
  /** Dream tokens charged at signing, AFTER founding-tariff + founder discounts. */
  tariffPaid: int("tariffPaid").notNull().default(0),
  /** "in_voyage" | "arrived" | "abandoned" */
  status: varchar("status", { length: 24 }).notNull().default("in_voyage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_colony_lanes_user_id").on(table.userId),
  userLaneUniq: uniqueIndex("uniq_colony_lanes_user_lane").on(
    table.userId,
    table.laneId,
  ),
  userStatusIdx: index("idx_colony_lanes_user_status").on(
    table.userId,
    table.status,
  ),
}));
export type ColonyLaneRow = typeof colonyLanes.$inferSelect;
export type InsertColonyLane = typeof colonyLanes.$inferInsert;

/**
 * Founded colony world. One row per seeded sector. The colony's
 * generation count ticks via recordGenerationTick; first export
 * fires when the count crosses FIRST_EXPORT_GENERATION (= 2).
 */
export const colonyWorlds = mysqlTable("colony_worlds", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Stable colony id (mirrors the lane id that birthed it for traceability). */
  colonyId: varchar("colonyId", { length: 192 }).notNull(),
  sectorId: varchar("sectorId", { length: 128 }).notNull(),
  bloodlineKey: varchar("bloodlineKey", { length: 64 }).notNull(),
  /** Veska's harbor ledger writes the colony's name on signing. */
  name: varchar("name", { length: 128 }).notNull(),
  foundedAt: timestamp("foundedAt").defaultNow().notNull(),
  currentGeneration: int("currentGeneration").notNull().default(1),
  /** ms-since-epoch of the last export tick; null until first export. */
  lastExportAt: bigint("lastExportAt", { mode: "number" }),
  totalExportValue: int("totalExportValue").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_colony_worlds_user_id").on(table.userId),
  userColonyUniq: uniqueIndex("uniq_colony_worlds_user_colony").on(
    table.userId,
    table.colonyId,
  ),
  userSectorIdx: index("idx_colony_worlds_user_sector").on(
    table.userId,
    table.sectorId,
  ),
}));
export type ColonyWorldRow = typeof colonyWorlds.$inferSelect;
export type InsertColonyWorld = typeof colonyWorlds.$inferInsert;

/**
 * Per-user founder progress. Single row per user; updated on each
 * arrival to keep the founder-tier and discount-bps hot-readable
 * without a COUNT over colonyWorlds.
 */
export const colonyFounderProgress = mysqlTable("colony_founder_progress", {
  userId: int("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  totalColoniesFounded: int("totalColoniesFounded").notNull().default(0),
  /** 0..4 — see resolveFounderTier in colonyCommerce.ts. */
  founderTier: int("founderTier").notNull().default(0),
  /** Last time founderTier ticked up; null if no tier crossed yet. */
  lastTierAt: timestamp("lastTierAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ColonyFounderProgressRow =
  typeof colonyFounderProgress.$inferSelect;
export type InsertColonyFounderProgress =
  typeof colonyFounderProgress.$inferInsert;

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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
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

/* ═══════════════════════════════════════════════════════
   TIER 1 — LORE-TIERED TITLE SYSTEM
   SWTOR-styled multi-tier progressions rooted in LOREDEX entities.
   Granted by events from PvP, narrative, co-op, guild, mystery surfaces.
   ═══════════════════════════════════════════════════════ */

/**
 * Title definitions — declarative registry seeded from
 * apps/shared/titles/titleDefinitions.ts at app start.
 */
export const titleDefinitions = mysqlTable("title_definitions", {
  id: int("id").autoincrement().primaryKey(),
  titleKey: varchar("titleKey", { length: 96 }).notNull().unique(),
  rootKey: varchar("rootKey", { length: 64 }).notNull(),
  tier: int("tier").notNull().default(1),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  flavorText: text("flavorText"),
  rarity: mysqlEnum("rarity", ["common", "rare", "epic", "legendary", "mythic"]).default("rare").notNull(),
  category: mysqlEnum("category", [
    "pvp_rank",
    "narrative",
    "mystery",
    "coop",
    "faction_guild",
    "cross_game",
    "cosmetic_purchase",
    "seasonal",
  ]).notNull(),
  loredexEntityId: varchar("loredexEntityId", { length: 64 }),
  iconKey: varchar("iconKey", { length: 32 }).notNull().default("Award"),
  /** Discriminated-union TitleUnlockCondition serialized as JSON. */
  condition: json("condition").$type<Record<string, unknown>>().notNull(),
  hidden: int("hidden").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  rootIdx: index("idx_title_definitions_root").on(table.rootKey),
  categoryIdx: index("idx_title_definitions_category").on(table.category),
}));

export type TitleDefinition = typeof titleDefinitions.$inferSelect;
export type InsertTitleDefinition = typeof titleDefinitions.$inferInsert;

/**
 * User-earned titles — junction table.
 * `discoveryRank` records position for first-to-witness titles
 * (1 = first discoverer, 2 = second, etc.).
 */
export const userTitles = mysqlTable("user_titles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  titleKey: varchar("titleKey", { length: 96 }).notNull(),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
  seasonNumber: int("seasonNumber"),
  discoveryRank: int("discoveryRank"),
}, (table) => ({
  userIdIdx: index("idx_user_titles_user_id").on(table.userId),
  userTitleUniq: uniqueIndex("uniq_user_titles_user_title").on(
    table.userId,
    table.titleKey,
  ),
}));

export type UserTitle = typeof userTitles.$inferSelect;
export type InsertUserTitle = typeof userTitles.$inferInsert;

/**
 * Equipped cosmetic loadout — supersedes the legacy free-text
 * `userProgress.title` field. Title, badge, frame in one place.
 */
export const userCosmeticLoadout = mysqlTable("user_cosmetic_loadout", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  equippedTitleKey: varchar("equippedTitleKey", { length: 96 }),
  equippedBadgeKey: varchar("equippedBadgeKey", { length: 96 }),
  equippedFrameKey: varchar("equippedFrameKey", { length: 96 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserCosmeticLoadout = typeof userCosmeticLoadout.$inferSelect;
export type InsertUserCosmeticLoadout = typeof userCosmeticLoadout.$inferInsert;

/* ═══════════════════════════════════════════════════════
   TIER 2A — UNIFIED COMPETITIVE RATINGS
   One rating row per (userId, gameType). Generalises the
   chess-specific and card-specific ELO tables into a single
   surface that downstream readers (titles, profile feed,
   leaderboards) consume by gameType key. Existing pvpLeaderboard
   and chessRankings tables remain authoritative for write paths
   during migration; competitiveRatings is mirrored on every
   match end and read by the unified competitive router.
   ═══════════════════════════════════════════════════════ */

export const competitiveRatings = mysqlTable("competitive_ratings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** GameTypeKey from apps/shared/titles/types.ts. */
  gameType: varchar("gameType", { length: 32 }).notNull(),
  currentElo: int("currentElo").notNull().default(1200),
  peakElo: int("peakElo").notNull().default(1200),
  wins: int("wins").notNull().default(0),
  losses: int("losses").notNull().default(0),
  draws: int("draws").notNull().default(0),
  winStreak: int("winStreak").notNull().default(0),
  bestStreak: int("bestStreak").notNull().default(0),
  /** RankTier from apps/shared/pvpBattle.ts (mirrored as varchar so we
   *  don't couple the enum across rating types). */
  rankTier: varchar("rankTier", { length: 32 }).notNull().default("bronze"),
  placementMatchesPlayed: int("placementMatchesPlayed").notNull().default(0),
  lastMatchAt: timestamp("lastMatchAt"),
  lastDecayAt: timestamp("lastDecayAt"),
  seasonNumber: int("seasonNumber").notNull().default(1),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_competitive_ratings_user_id").on(table.userId),
  gameTypeIdx: index("idx_competitive_ratings_game_type").on(table.gameType),
  userGameTypeUniq: uniqueIndex("uniq_competitive_ratings_user_game_type").on(
    table.userId,
    table.gameType,
  ),
}));

export type CompetitiveRating = typeof competitiveRatings.$inferSelect;
export type InsertCompetitiveRating = typeof competitiveRatings.$inferInsert;

/* ═══════════════════════════════════════════════════════
   TIER 2B — WITNESSING DISCOVERY RACE
   Conspiracy boards (mystery puzzles), per-player + per-guild
   clue progress, server-wide reveal events. First-discoverer
   guilds trigger faction-wide bonuses + tier-3 lore titles.
   ═══════════════════════════════════════════════════════ */

/**
 * Persistent record of every globally-significant discovery event.
 * Written exactly once per eventKey when a user (or guild) is first
 * to satisfy the discovery condition. Subsequent solvers are NOT
 * recorded here — they produce normal `userClueProgress` rows.
 */
export const discoveryEvents = mysqlTable("discovery_events", {
  id: int("id").autoincrement().primaryKey(),
  /** Stable key, e.g. "kael_fragment_F4", "secret_act_3_revealed",
   *  "conspiracy_thought_virus_solved". */
  eventKey: varchar("eventKey", { length: 96 }).notNull().unique(),
  firstDiscovererUserId: int("firstDiscovererUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  firstDiscovererGuildId: int("firstDiscovererGuildId").references(() => guilds.id, { onDelete: "restrict" }),
  discoveredAt: timestamp("discoveredAt").defaultNow().notNull(),
  /** When this event triggered a server-wide reveal (i.e. flipped
   *  unlock state for every player). NULL = not yet promoted. */
  serverWideRevealedAt: timestamp("serverWideRevealedAt"),
  /** Faction whose pressureService bumped on this discovery. */
  factionAlignment: varchar("factionAlignment", { length: 32 }),
}, (table) => ({
  eventKeyIdx: index("idx_discovery_events_event_key").on(table.eventKey),
  firstUserIdx: index("idx_discovery_events_first_user").on(table.firstDiscovererUserId),
}));

export type DiscoveryEvent = typeof discoveryEvents.$inferSelect;
export type InsertDiscoveryEvent = typeof discoveryEvents.$inferInsert;

/**
 * Conspiracy board definitions — mystery puzzles assembled from
 * clue tokens. Backed by lore (Project Celebration / Thought Virus
 * / Kael's Revenge / Watcher Infiltration / Recruiter Defection).
 *
 * Definitions are seeded from
 * apps/shared/conspiracyBoards/definitions.ts at app start.
 */
export const conspiracyBoards = mysqlTable("conspiracy_boards", {
  id: int("id").autoincrement().primaryKey(),
  boardKey: varchar("boardKey", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  /** Number of distinct clue keys required to solve. */
  cluesRequired: int("cluesRequired").notNull(),
  /** JSON array of clue keys this board accepts. */
  acceptedClues: json("acceptedClues").$type<string[]>().notNull(),
  factionAlignment: varchar("factionAlignment", { length: 32 }),
  /** When promoted to live, server-wide rules apply. */
  active: int("active").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ConspiracyBoard = typeof conspiracyBoards.$inferSelect;
export type InsertConspiracyBoard = typeof conspiracyBoards.$inferInsert;

/**
 * Per-player clue progress. One row per (userId, boardKey).
 * `cluesGathered` is a JSON array of clue keys the user has earned.
 */
export const userClueProgress = mysqlTable("user_clue_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  boardKey: varchar("boardKey", { length: 64 }).notNull(),
  cluesGathered: json("cluesGathered").$type<string[]>().notNull().default([]),
  solvedAt: timestamp("solvedAt"),
  /** Was this user the first-discoverer (rank=1)? Forwarded from
   *  the discoveryEvents row at solve time. */
  isFirstDiscoverer: int("isFirstDiscoverer").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_user_clue_progress_user_id").on(table.userId),
  userBoardUniq: uniqueIndex("uniq_user_clue_progress_user_board").on(
    table.userId,
    table.boardKey,
  ),
}));

export type UserClueProgress = typeof userClueProgress.$inferSelect;
export type InsertUserClueProgress = typeof userClueProgress.$inferInsert;

/**
 * Per-guild aggregated clue progress. Members' clue contributions
 * roll up to the guild row; the first guild to assemble all clues
 * triggers the server-wide reveal.
 */
export const guildClueProgress = mysqlTable("guild_clue_progress", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  boardKey: varchar("boardKey", { length: 64 }).notNull(),
  /** Aggregated unique clues contributed by any member. */
  cluesGathered: json("cluesGathered").$type<string[]>().notNull().default([]),
  /** Per-member contribution counts: { [userId]: count }. */
  contributors: json("contributors").$type<Record<string, number>>().notNull().default({}),
  solvedAt: timestamp("solvedAt"),
  isFirstDiscoverer: int("isFirstDiscoverer").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  guildIdIdx: index("idx_guild_clue_progress_guild_id").on(table.guildId),
  /** Drives the Oracle Pool peek scan (board, then everything-but-caller). */
  boardIdIdx: index("idx_guild_clue_progress_board_id").on(table.boardKey, table.guildId),
  guildBoardUniq: uniqueIndex("uniq_guild_clue_progress_guild_board").on(
    table.guildId,
    table.boardKey,
  ),
}));

export type GuildClueProgress = typeof guildClueProgress.$inferSelect;
export type InsertGuildClueProgress = typeof guildClueProgress.$inferInsert;

/* ═══════════════════════════════════════════════════════
   TIER 4 — GUILD EXPANSION (Perks, Quests, Banners, Stash)
   Builds on the existing guilds / guildMembers / guildHall
   tables. Banners/mottoes are added to the guilds row in a
   followup migration via the cosmetic loadout shape.
   ═══════════════════════════════════════════════════════ */

/**
 * Guild perk definitions — passive bonuses that apply to every
 * member of a guild that has unlocked the perk. Definitions are
 * seeded from apps/shared/guildPerks/perkDefinitions.ts.
 */
export const guildPerks = mysqlTable("guild_perks", {
  id: int("id").autoincrement().primaryKey(),
  perkKey: varchar("perkKey", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  /** Bonus shape: "dream_pct", "credits_pct", "card_draw", "xp_pct",
   *  "craft_pct", "rare_drop_pct", "pvp_dmg_taken_pct",
   *  "clue_drop_rate_pct", "placement_xp_pct", etc. */
  bonusType: varchar("bonusType", { length: 32 }).notNull(),
  /** Magnitude (interpretation depends on bonusType — % for *_pct,
   *  flat for card_draw, etc.). */
  magnitude: int("magnitude").notNull(),
  requiredHallTier: int("requiredHallTier").notNull().default(1),
  requiredXp: int("requiredXp").notNull().default(0),
  /** Optional faction restriction. */
  factionAlignment: varchar("factionAlignment", { length: 32 }),
  iconKey: varchar("iconKey", { length: 32 }).notNull().default("Sparkles"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GuildPerk = typeof guildPerks.$inferSelect;

/** Junction: which perks a guild has unlocked. */
export const guildUnlockedPerks = mysqlTable("guild_unlocked_perks", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  perkKey: varchar("perkKey", { length: 64 }).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
}, (table) => ({
  guildIdIdx: index("idx_guild_unlocked_perks_guild_id").on(table.guildId),
  guildPerkUniq: uniqueIndex("uniq_guild_unlocked_perks_guild_perk").on(
    table.guildId,
    table.perkKey,
  ),
}));

export type GuildUnlockedPerk = typeof guildUnlockedPerks.$inferSelect;

/** Per-guild quest progress. Reset by cron on the appropriate cadence. */
export const guildQuestProgress = mysqlTable("guild_quest_progress", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  questKey: varchar("questKey", { length: 64 }).notNull(),
  progress: int("progress").notNull().default(0),
  target: int("target").notNull(),
  completedAt: timestamp("completedAt"),
  rewardClaimed: int("rewardClaimed").notNull().default(0),
  /** When this row was last reset (the cron's anchor). */
  resetAt: timestamp("resetAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  guildIdIdx: index("idx_guild_quest_progress_guild_id").on(table.guildId),
  guildQuestUniq: uniqueIndex("uniq_guild_quest_progress_guild_quest").on(
    table.guildId,
    table.questKey,
  ),
}));

export type GuildQuestProgressRow = typeof guildQuestProgress.$inferSelect;

/** Per-guild cosmetic loadout: banner, motto, emblem.
 *  Separate from `guilds` so we don't have to migrate the existing
 *  large table. */
export const guildCosmetics = mysqlTable("guild_cosmetics", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull().unique().references(() => guilds.id, { onDelete: "cascade" }),
  bannerKey: varchar("bannerKey", { length: 64 }),
  mottoText: varchar("mottoText", { length: 80 }),
  emblemKey: varchar("emblemKey", { length: 64 }),
  /** JSON array of unlocked banner keys (catalog of available cosmetics). */
  unlockedBanners: json("unlockedBanners").$type<string[]>().notNull().default([]),
  unlockedEmblems: json("unlockedEmblems").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GuildCosmetics = typeof guildCosmetics.$inferSelect;

/** Guild stash — shared inventory. */
export const guildStash = mysqlTable("guild_stash", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  slotKey: varchar("slotKey", { length: 64 }).notNull(),
  itemType: varchar("itemType", { length: 32 }).notNull(),
  itemKey: varchar("itemKey", { length: 96 }).notNull(),
  quantity: int("quantity").notNull().default(1),
  depositorUserId: int("depositorUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  depositedAt: timestamp("depositedAt").defaultNow().notNull(),
}, (table) => ({
  guildIdIdx: index("idx_guild_stash_guild_id").on(table.guildId),
  guildSlotUniq: uniqueIndex("uniq_guild_stash_guild_slot").on(
    table.guildId,
    table.slotKey,
  ),
}));

export type GuildStashRow = typeof guildStash.$inferSelect;

/** Guild stash audit log — every deposit / withdraw. */
export const guildStashLog = mysqlTable("guild_stash_log", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
  action: mysqlEnum("action", ["deposit", "withdraw"]).notNull(),
  itemType: varchar("itemType", { length: 32 }).notNull(),
  itemKey: varchar("itemKey", { length: 96 }).notNull(),
  quantity: int("quantity").notNull(),
  at: timestamp("at").defaultNow().notNull(),
}, (table) => ({
  guildIdIdx: index("idx_guild_stash_log_guild_id").on(table.guildId),
}));

export type GuildStashLogRow = typeof guildStashLog.$inferSelect;

/* ═══════════════════════════════════════════════════════
   TIER 5 — PVP VARIANTS FOR OTHER GAME MODES
   Circuit Rival Run, Trade Sector Control, Trade Oracle Duels,
   CADES Async PvP, TD Live Siege, Guild Skirmishes.
   ═══════════════════════════════════════════════════════ */

/* ─── 5A. Dead Man's Circuit Rival Race ─── */
export const circuitPvpMatches = mysqlTable("circuit_pvp_matches", {
  id: int("id").autoincrement().primaryKey(),
  matchId: varchar("matchId", { length: 64 }).notNull().unique(),
  player1Id: int("player1Id").notNull().references(() => users.id, { onDelete: "restrict" }),
  player2Id: int("player2Id").notNull().references(() => users.id, { onDelete: "restrict" }),
  trackSeed: varchar("trackSeed", { length: 64 }).notNull(),
  player1Score: int("player1Score"),
  player2Score: int("player2Score"),
  winnerId: int("winnerId").references(() => users.id, { onDelete: "restrict" }),
  /** Type: "single_race" | "survival_wars_3" */
  format: varchar("format", { length: 32 }).notNull().default("single_race"),
  status: mysqlEnum("status", ["queued", "active", "completed", "abandoned"]).notNull().default("queued"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  endedAt: timestamp("endedAt"),
});
export type CircuitPvpMatch = typeof circuitPvpMatches.$inferSelect;

/* ─── 5B. Trade Empire — Sector Control ─── */
export const tradeSectorControl = mysqlTable("trade_sector_control", {
  id: int("id").autoincrement().primaryKey(),
  sectorId: varchar("sectorId", { length: 64 }).notNull(),
  /** Current "Sector Lord" — null between control windows. */
  lordUserId: int("lordUserId").references(() => users.id, { onDelete: "cascade" }),
  /** Anchor for the weekly window. */
  weekStart: timestamp("weekStart").notNull(),
  /** JSON: { [userId]: contributionScore } */
  contributionScores: json("contributionScores").$type<Record<string, number>>().notNull().default({}),
  active: int("active").notNull().default(1),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  sectorIdIdx: index("idx_trade_sector_control_sector_id").on(table.sectorId),
  sectorWeekUniq: uniqueIndex("uniq_trade_sector_control_sector_week").on(
    table.sectorId,
    table.weekStart,
  ),
}));
export type TradeSectorControl = typeof tradeSectorControl.$inferSelect;

/* ─── 5B. Trade Empire — Oracle Futures Duels ─── */
export const tradeOracleDuels = mysqlTable("trade_oracle_duels", {
  id: int("id").autoincrement().primaryKey(),
  duelId: varchar("duelId", { length: 64 }).notNull().unique(),
  callerUserId: int("callerUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  putUserId: int("putUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sectorId: varchar("sectorId", { length: 64 }).notNull(),
  strikePrice: int("strikePrice").notNull(),
  /** Spot price at settlement. */
  settlementPrice: int("settlementPrice"),
  winnerId: int("winnerId").references(() => users.id, { onDelete: "cascade" }),
  status: mysqlEnum("status", ["open", "settled", "abandoned"]).notNull().default("open"),
  openedAt: timestamp("openedAt").defaultNow().notNull(),
  settlesAt: timestamp("settlesAt").notNull(),
  settledAt: timestamp("settledAt"),
});
export type TradeOracleDuel = typeof tradeOracleDuels.$inferSelect;

/* ─── 5C. CADES FPS Async PvP ─── */
export const cadesPvpMatches = mysqlTable("cades_pvp_matches", {
  id: int("id").autoincrement().primaryKey(),
  matchId: varchar("matchId", { length: 64 }).notNull().unique(),
  player1Id: int("player1Id").notNull().references(() => users.id, { onDelete: "restrict" }),
  player2Id: int("player2Id").references(() => users.id, { onDelete: "restrict" }),
  scenarioSeed: varchar("scenarioSeed", { length: 64 }).notNull(),
  scenarioMode: varchar("scenarioMode", { length: 32 }).notNull().default("last_stand"),
  player1Score: int("player1Score"),
  player2Score: int("player2Score"),
  winnerId: int("winnerId").references(() => users.id, { onDelete: "restrict" }),
  status: mysqlEnum("status", ["pending", "p1_done", "p2_done", "completed", "abandoned"]).notNull().default("pending"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  endedAt: timestamp("endedAt"),
});
export type CadesPvpMatch = typeof cadesPvpMatches.$inferSelect;

/* ─── 5D. Tower Defense Live Siege ─── */
export const tdLiveSieges = mysqlTable("td_live_sieges", {
  id: int("id").autoincrement().primaryKey(),
  siegeId: varchar("siegeId", { length: 64 }).notNull().unique(),
  attackerUserId: int("attackerUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  defenderUserId: int("defenderUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Wave snapshot when raid concluded. */
  waveCount: int("waveCount").notNull().default(0),
  /** 0–3 stars. */
  starsAwarded: int("starsAwarded").notNull().default(0),
  defenseHeld: int("defenseHeld").notNull().default(0),
  trophyDelta: int("trophyDelta").notNull().default(0),
  status: mysqlEnum("status", ["active", "completed", "abandoned"]).notNull().default("active"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  endedAt: timestamp("endedAt"),
});
export type TdLiveSiege = typeof tdLiveSieges.$inferSelect;

/* ─── 5E. Guild Skirmishes (mode-mix bracket) ─── */
export const guildWarSkirmishes = mysqlTable("guild_war_skirmishes", {
  id: int("id").autoincrement().primaryKey(),
  skirmishId: varchar("skirmishId", { length: 64 }).notNull().unique(),
  guildAId: int("guildAId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  guildBId: int("guildBId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  /** JSON: { card_duel?: matchId, chess?: gameId, td_live?: siegeId, cades?: matchId } */
  mode_match_ids: json("modeMatchIds").$type<Record<string, string>>().notNull().default({}),
  /** JSON: { [gameType]: "guild_a" | "guild_b" | "tied" | "pending" } */
  modeOutcomes: json("modeOutcomes").$type<Record<string, string>>().notNull().default({}),
  /** Final winner once enough modes resolve. */
  winnerGuildId: int("winnerGuildId").references(() => guilds.id, { onDelete: "restrict" }),
  status: mysqlEnum("status", ["proposed", "accepted", "active", "completed", "abandoned"]).notNull().default("proposed"),
  declaredAt: timestamp("declaredAt").defaultNow().notNull(),
  acceptedAt: timestamp("acceptedAt"),
  completedAt: timestamp("completedAt"),
}, (table) => ({
  guildsIdx: index("idx_guild_war_skirmishes_guilds").on(table.guildAId, table.guildBId),
}));
export type GuildWarSkirmish = typeof guildWarSkirmishes.$inferSelect;

/** Per-mode skirmish match record. */
export const guildWarSkirmishMatches = mysqlTable("guild_war_skirmish_matches", {
  id: int("id").autoincrement().primaryKey(),
  skirmishId: varchar("skirmishId", { length: 64 }).notNull(),
  /** Mode: "card_duel" | "chess" | "td_live" | "cades" */
  mode: varchar("mode", { length: 32 }).notNull(),
  guildAPlayerId: int("guildAPlayerId").notNull().references(() => users.id, { onDelete: "restrict" }),
  guildBPlayerId: int("guildBPlayerId").notNull().references(() => users.id, { onDelete: "restrict" }),
  /** Underlying match id in the per-mode table. */
  underlyingMatchId: varchar("underlyingMatchId", { length: 64 }),
  /** Outcome: "guild_a" | "guild_b" | "tied" | "pending" */
  outcome: varchar("outcome", { length: 16 }).notNull().default("pending"),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
}, (table) => ({
  skirmishIdIdx: index("idx_guild_war_skirmish_matches_skirmish").on(table.skirmishId),
}));
export type GuildWarSkirmishMatch = typeof guildWarSkirmishMatches.$inferSelect;

/* ═══════════════════════════════════════════════════════
   APPRENTICE TRIAL COHORT COMPLETIONS
   Server-side record of every cohort a player has completed.
   Cohort simulation itself stays client-side (apps/shared/pvpCohorts.ts);
   this table records "I survived cohort N" for title grants.
   ═══════════════════════════════════════════════════════ */
export const apprenticeTrialCompletions = mysqlTable("apprentice_trial_completions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "restrict" }),
  cohortNumber: int("cohortNumber").notNull(),
  apprenticeName: varchar("apprenticeName", { length: 96 }).notNull(),
  archetype: varchar("archetype", { length: 32 }).notNull(),
  /** True iff this player was the cohort's sole graduate. */
  graduated: int("graduated").notNull().default(0),
  /** Day the apprentice fell (or 28 if survived to graduation). */
  daySurvived: int("daySurvived").notNull(),
  cohortSize: int("cohortSize").notNull(),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_apprentice_trial_user_id").on(table.userId),
  userCohortUniq: uniqueIndex("uniq_apprentice_trial_user_cohort").on(
    table.userId,
    table.cohortNumber,
  ),
}));
export type ApprenticeTrialCompletion = typeof apprenticeTrialCompletions.$inferSelect;

/* ═══════════════════════════════════════════════════════
   COMPETITIVE RATINGS BACKFILL MARKER
   One-shot record that the migration from pvpLeaderboard +
   chessRankings → competitive_ratings has run. Prevents
   double-execution at boot.
   ═══════════════════════════════════════════════════════ */
export const competitiveRatingsBackfill = mysqlTable("competitive_ratings_backfill", {
  id: int("id").autoincrement().primaryKey(),
  /** Always "v1" for the initial backfill. Future migrations
   *  add additional version rows. */
  version: varchar("version", { length: 32 }).notNull().unique(),
  cardMirrored: int("cardMirrored").notNull().default(0),
  chessMirrored: int("chessMirrored").notNull().default(0),
  ranAt: timestamp("ranAt").defaultNow().notNull(),
});
export type CompetitiveRatingsBackfillRow = typeof competitiveRatingsBackfill.$inferSelect;

/* ═══════════════════════════════════════════════════════
   PVP MODERATION REPORTS
   Player-submitted reports for guild mottoes / banners / titles
   that violate community guidelines. Moderator dashboards consume
   these via the pvpModeration router.
   ═══════════════════════════════════════════════════════ */
export const pvpModerationReports = mysqlTable("pvp_moderation_reports", {
  id: int("id").autoincrement().primaryKey(),
  reporterId: int("reporterId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** "motto" | "banner" | "title" | "guild_name" */
  targetKind: varchar("targetKind", { length: 32 }).notNull(),
  /** id of the offending record (guildId for motto/banner, userId for title). */
  targetId: int("targetId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Snapshot of the offending text for audit (mottoes can be edited). */
  contentSnapshot: text("contentSnapshot"),
  reason: varchar("reason", { length: 64 }).notNull(),
  /** Free-text. Up to 500 chars. */
  details: text("details"),
  status: mysqlEnum("status", ["open", "resolved_action", "resolved_no_action", "duplicate"]).notNull().default("open"),
  resolvedByUserId: int("resolvedByUserId").references(() => users.id, { onDelete: "cascade" }),
  resolvedAt: timestamp("resolvedAt"),
  resolutionNotes: text("resolutionNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("idx_pvp_moderation_reports_status").on(table.status),
  targetIdx: index("idx_pvp_moderation_reports_target").on(table.targetKind, table.targetId),
}));
export type PvpModerationReport = typeof pvpModerationReports.$inferSelect;

/* ═══════════════════════════════════════════════════════
   DREAMER AWARENESS — silent-counter substrate for the dual-
   faction recruitment system (D1 in
   /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md).

   The Dreamer recruits covertly: specific player actions that
   his agents notice raise the awareness counter. The counter
   has no UI — players who notice they're being watched figure
   it out from the coded vision cutscenes that fire at the four
   Discordian thresholds {3, 7, 13, 23}.

   Each tag fires at most once per user (the tagsFired pipe-joined
   string is the dedupe set). Re-firing the same tag is a no-op,
   so callers don't have to guard against double-trigger races.

   Bootstrap: apps/server/services/dreamerAwarenessBootstrap.ts.
   Tag catalog: apps/shared/dreamerAwarenessTags.ts.
   Service: apps/server/services/dreamerAwareness.ts.
   ═══════════════════════════════════════════════════════ */
export const dreamerAwareness = mysqlTable("dreamer_awareness", {
  userId: int("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  /** Monotonic count. Sum of weights of every distinct tag fired. */
  awarenessCount: int("awarenessCount").notNull().default(0),
  /** Pipe-joined tag-id list. Used as the "tag has fired" dedupe set
   *  so re-tagging is idempotent (cheap O(N) substring check at
   *  service-call time; N is bounded by the catalog size in
   *  apps/shared/dreamerAwarenessTags.ts). */
  tagsFired: varchar("tagsFired", { length: 1024 }).notNull().default(""),
  /** JSON array of vision ids the player has been delivered. The
   *  vision system writes here on completion; Set semantics enforced
   *  in the service. */
  visionsReceived: json("visionsReceived").$type<string[]>(),
  lastTagAt: timestamp("lastTagAt"),
  /* ─── Prophecy vision pipeline (apps/shared/prophecyVisionMap.ts).
     The prophecy system layers on top of dreamer awareness — every
     song slideshow has a vision, delivered as marquee (dream-mode
     interrupt), whisper (Antiquarian's Index discovery), or static
     echo (memorable-moments stream). Full slideshows always
     reachable in the Index. ─── */
  /** Marquees received (delivered to the player in dream mode at
   *  least once). Populated by markProphecyReceived. */
  prophecyVisionsReceived: json("prophecyVisionsReceived").$type<string[]>(),
  /** Marquees pending delivery — drained one per session. */
  pendingMarqueeIds: json("pendingMarqueeIds").$type<string[]>(),
  /** Marquees the player watched in full (no awaken-early). Drives
   *  the Witness ladder. */
  prophecyVisionsCompleted: json("prophecyVisionsCompleted").$type<string[]>(),
  /** Whisper visions unlocked into the Antiquarian's Index but not
   *  yet viewed in full. */
  unlockedWhisperIds: json("unlockedWhisperIds").$type<string[]>(),
  /** Vision ids the player has watched in full from the Index
   *  (whispers + statics + replayed marquees). */
  viewedWhisperIds: json("viewedWhisperIds").$type<string[]>(),
  /** Album slugs the player has watched end-to-end as continuous
   *  films — earns the Album Film Witness tier. */
  albumFilmsCompleted: json("albumFilmsCompleted").$type<string[]>(),
  /** Bookmark map: album slug → the trackId the player paused on
   *  via "Awaken from the Album". Empty when nothing is bookmarked. */
  albumFilmBookmarks: json("albumFilmBookmarks").$type<Record<string, string>>(),
  /** Achievement ids granted (idempotent — never re-granted). */
  prophecyAchievementsGranted: json("prophecyAchievementsGranted").$type<string[]>(),
  /** Timestamp of the last marquee dream that played. Drives the
   *  ≤ 1 marquee per session pacing rule. */
  lastMarqueePlayedAt: timestamp("lastMarqueePlayedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type DreamerAwarenessRow = typeof dreamerAwareness.$inferSelect;

/* ═══════════════════════════════════════════════════════
   T12 — PARTY SYSTEM
   Backs 2v2 ranked queues + card co-op encounter parties.
   A player can be in at most one active party at a time.
   ═══════════════════════════════════════════════════════ */
export const parties = mysqlTable("parties", {
  id: int("id").autoincrement().primaryKey(),
  partyId: varchar("partyId", { length: 64 }).notNull().unique(),
  leaderUserId: int("leaderUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Mode the party is preparing for. Affects max member count. */
  mode: mysqlEnum("mode", ["card_2v2", "card_coop", "card_ffa", "open"]).notNull().default("open"),
  /** Open parties accept join requests; closed only honors invites. */
  openToJoin: int("openToJoin").notNull().default(0),
  status: mysqlEnum("status", ["forming", "queued", "in_match", "disbanded"]).notNull().default("forming"),
  /** Set when the party transitions to in_match. */
  matchId: varchar("matchId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  leaderIdx: index("idx_parties_leader").on(table.leaderUserId),
  statusIdx: index("idx_parties_status").on(table.status),
}));
export type Party = typeof parties.$inferSelect;

export const partyMembers = mysqlTable("party_members", {
  id: int("id").autoincrement().primaryKey(),
  partyId: varchar("partyId", { length: 64 }).notNull(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["leader", "member"]).notNull().default("member"),
  /** Slot index inside the party (0..N-1). Leader is always 0. */
  slot: int("slot").notNull(),
  /** T13: per-member deck choice for 2v2 / co-op queues. Null until
   *  the member picks their deck on the staging screen. Cleared when
   *  the party leaves matchmaking. */
  selectedDeckId: int("selectedDeckId").references(() => decks.id, { onDelete: "set null" }),
  /** T13: ready-flag for queue. Leader can only queue once every
   *  member has set selectedDeckId AND ready=1. */
  ready: int("ready").notNull().default(0),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
}, (table) => ({
  partyIdx: index("idx_party_members_party").on(table.partyId),
  userIdx: index("idx_party_members_user").on(table.userId),
  uniqUserParty: uniqueIndex("uniq_party_members_user_party").on(
    table.partyId,
    table.userId,
  ),
  uniqUserSingleParty: uniqueIndex("uniq_party_members_user_single").on(table.userId),
}));
export type PartyMember = typeof partyMembers.$inferSelect;

export const partyInvites = mysqlTable("party_invites", {
  id: int("id").autoincrement().primaryKey(),
  partyId: varchar("partyId", { length: 64 }).notNull(),
  invitedUserId: int("invitedUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  invitedByUserId: int("invitedByUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: mysqlEnum("status", ["pending", "accepted", "declined", "expired"]).notNull().default("pending"),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  respondedAt: timestamp("respondedAt"),
}, (table) => ({
  invitedUserIdx: index("idx_party_invites_invited_user").on(table.invitedUserId),
  partyIdx: index("idx_party_invites_party").on(table.partyId),
  uniqPendingInvite: uniqueIndex("uniq_party_invites_pending").on(
    table.partyId,
    table.invitedUserId,
  ),
}));
export type PartyInvite = typeof partyInvites.$inferSelect;

/* T12 — Card co-op encounter sessions. One row per attempt by a
 * party at a specific encounter. Underlying engine still runs 1v1;
 * the WS layer routes party inputs to side 0. */
export const coopCardSessions = mysqlTable("coop_card_sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull().unique(),
  partyId: varchar("partyId", { length: 64 }).notNull(),
  encounterKey: varchar("encounterKey", { length: 64 }).notNull(),
  difficulty: mysqlEnum("difficulty", ["normal", "heroic", "mythic"]).notNull().default("normal"),
  /** JSON array of contributing user ids, in turn-priority order. */
  partyMemberIds: json("partyMemberIds").$type<number[]>().notNull(),
  /** Underlying matchId in pvp_matches. */
  underlyingMatchId: varchar("underlyingMatchId", { length: 64 }),
  outcome: mysqlEnum("outcome", ["pending", "victory", "defeat", "abandoned"]).notNull().default("pending"),
  /** JSON array of phase fractions that fired. For replays / analysis. */
  phasesFired: json("phasesFired").$type<number[]>().notNull().default([]),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  endedAt: timestamp("endedAt"),
}, (table) => ({
  partyIdx: index("idx_coop_card_sessions_party").on(table.partyId),
  encounterIdx: index("idx_coop_card_sessions_encounter").on(table.encounterKey),
}));
export type CoopCardSession = typeof coopCardSessions.$inferSelect;

/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE — Items-matter / Game-of-Thrones arc (Phase 1)
   Sub-house reputation, season clock singleton, and the
   public-knowledge log NPCs read for dialog flavor.
   ═══════════════════════════════════════════════════════ */

/**
 * Per-(user, sub-house) reputation tracker. Sub-houses sit *inside*
 * top-level factions (see apps/shared/tradeEmpire/houses.ts); rep is
 * tracked per house so internal court intrigue can pull a player in
 * two directions inside a single faction.
 *
 * Top-level faction rep is computed as the mean of sub-house rep on
 * read, not stored separately, so houses are the only source of
 * truth.
 */
export const tradeSubHouseReputation = mysqlTable("trade_sub_house_reputation", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** SubHouseKey from apps/shared/tradeEmpire/houses.ts */
  houseKey: varchar("houseKey", { length: 64 }).notNull(),
  reputation: int("reputation").notNull().default(0),
  /** Highest absolute rep ever reached — used by court widget to show
   *  "you were once a friend of this house". */
  peakReputation: int("peakReputation").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trade_sub_house_rep_user_id").on(table.userId),
  userHouseUniq: uniqueIndex("uniq_trade_sub_house_rep_user_house").on(
    table.userId,
    table.houseKey,
  ),
}));
export type TradeSubHouseReputationRow = typeof tradeSubHouseReputation.$inferSelect;

/**
 * Season clock — singleton row holding the global season state.
 * `id` is always 1 (enforced by the service layer), mirroring the
 * dischordia_cycle_state pattern.
 */
export const seasonClockState = mysqlTable("season_clock_state", {
  id: int("id").primaryKey(),
  seasonNumber: int("seasonNumber").notNull().default(1),
  /** SeasonPhase from apps/shared/tradeEmpire/season.ts */
  phase: varchar("phase", { length: 32 }).notNull().default("prologue"),
  phaseStartedAt: timestamp("phaseStartedAt").defaultNow().notNull(),
  /** When the next phase transition is scheduled. Null inside
   *  interregnum — server triggers manually after settlement. */
  phaseEndsAt: timestamp("phaseEndsAt"),
  /** Tick counter inside the current season. Resets each new season. */
  tickNumber: int("tickNumber").notNull().default(0),
  lastTickAt: timestamp("lastTickAt"),
  /** Active SeasonDeclaration JSON — null inside prologue before
   *  resolution. Shape defined in apps/shared/tradeEmpire/season.ts */
  declaration: json("declaration").$type<Record<string, unknown> | null>(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type SeasonClockStateRow = typeof seasonClockState.$inferSelect;

/**
 * Public-knowledge log — append-only feed of in-world events that any
 * faction NPC may read to flavor dialog. Contract signings, demand
 * refusals, blown covers, agenda step completions, season declarations
 * all post entries here.
 *
 * Distinct from `npc_public_flags` which is per-NPC presence/met
 * tracking. This table is faction-scoped news.
 */
export const tradePublicKnowledge = mysqlTable("trade_public_knowledge", {
  id: int("id").autoincrement().primaryKey(),
  /** Optional acting user — null for world events (declarations,
   *  AI-vs-AI agenda completions). */
  userId: int("userId").references(() => users.id, { onDelete: "cascade" }),
  /** Canonical event kind, e.g. "contract_signed", "demand_refused",
   *  "cover_blown", "agenda_step", "season_declaration", "tribute_paid". */
  eventKind: varchar("eventKind", { length: 64 }).notNull(),
  /** SubHouseKey the event is *primarily* about — drives which NPCs
   *  pull it from the feed. */
  subjectHouseKey: varchar("subjectHouseKey", { length: 64 }),
  /** Free-form summary string for dialog renderers. */
  summary: varchar("summary", { length: 512 }).notNull(),
  /** Optional structured payload (contract id, demand id, etc.). */
  payload: json("payload").$type<Record<string, unknown> | null>(),
  /** Season number when the event posted — lets the court widget
   *  filter "this season" vs. historical. */
  seasonNumber: int("seasonNumber").notNull().default(1),
  /** True once the event is no longer hot news (e.g., season has
   *  rolled over twice). Soft-archive flag; rows are never deleted. */
  archived: boolean("archived").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  createdAtIdx: index("idx_trade_public_knowledge_created").on(table.createdAt),
  userIdx: index("idx_trade_public_knowledge_user").on(table.userId),
  houseIdx: index("idx_trade_public_knowledge_house").on(table.subjectHouseKey),
  seasonIdx: index("idx_trade_public_knowledge_season").on(table.seasonNumber),
}));
export type TradePublicKnowledgeRow = typeof tradePublicKnowledge.$inferSelect;

/**
 * Per-(user, season, agendaKey) progress on a season agenda. One row
 * per agenda the user is engaged with; missing rows default to "not
 * yet started" — the agenda engine creates a row when the agenda
 * first ticks against this user.
 *
 * Phase 4 of the items-matter / Game-of-Thrones arc.
 */
export const tradeAgendaProgress = mysqlTable("trade_agenda_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** SeasonAgendaDef.agendaKey from apps/shared/tradeEmpire/agendas.ts */
  agendaKey: varchar("agendaKey", { length: 128 }).notNull(),
  seasonNumber: int("seasonNumber").notNull(),
  /** First tick at which this agenda began advancing for this user. */
  startedAtTick: int("startedAtTick").notNull().default(0),
  /** Stage statuses keyed by stageId: "pending" | "world_fired" |
   *  "countered" | "skipped". */
  stageStatus: json("stageStatus").$type<Record<string, string>>().notNull(),
  /** Set true when every stage is resolved. */
  resolved: boolean("resolved").notNull().default(false),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_trade_agenda_progress_user_id").on(table.userId),
  userAgendaSeasonUniq: uniqueIndex(
    "uniq_trade_agenda_progress_user_agenda_season",
  ).on(table.userId, table.agendaKey, table.seasonNumber),
}));
export type TradeAgendaProgressRow = typeof tradeAgendaProgress.$inferSelect;

/**
 * Faction demand events — phase 7 of the items-matter / GoT arc.
 *
 * When a sub-house holds enough sphere-of-influence, it can demand a
 * specific item from a player traveling near its territory. The
 * player chooses to pay (item destroyed, +rep with the demanding
 * house, -rep with its rival) or refuse (-rep, public flag posted,
 * possible cargo impound on next mission).
 *
 * Generated by the season-tick driver during the `running` phase
 * against active players (those with at least one sub-house rep
 * row). Resolved by the player via the tradeCourt router.
 */
export const tradeDemands = mysqlTable("trade_demands", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** SubHouseKey making the demand. */
  demandingHouseKey: varchar("demandingHouseKey", { length: 64 }).notNull(),
  /** Demanded card rarity (basic..legendary) — phase 7 only demands cards. */
  demandedRarity: varchar("demandedRarity", { length: 16 }).notNull(),
  /** Optional faction filter on the demanded card. */
  demandedFaction: varchar("demandedFaction", { length: 64 }),
  /** Wall-clock when the demand expires (un-acted demands count as
   *  refusals at expiry). */
  expiresAt: timestamp("expiresAt").notNull(),
  /** "pending" | "paid" | "refused" | "expired" */
  status: mysqlEnum("status", ["pending", "paid", "refused", "expired"]).notNull().default("pending"),
  /** When the player acted on the demand. */
  resolvedAt: timestamp("resolvedAt"),
  /** Free-form note from the resolution path. */
  resolution: varchar("resolution", { length: 256 }),
  seasonNumber: int("seasonNumber").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_trade_demands_user_id").on(table.userId),
  userPendingIdx: index("idx_trade_demands_user_pending").on(table.userId, table.status),
  expiresIdx: index("idx_trade_demands_expires").on(table.expiresAt),
}));
export type TradeDemandRow = typeof tradeDemands.$inferSelect;

/**
 * Phase B (Living Galaxy): per-(user, sector) anomaly discoveries.
 * When the player first enters a sector with hasAnomaly=true, an
 * `anomaly_discovered` event posts and one row lands here. Player
 * spends `intelligence` to investigate; resolution drops a one-time
 * tome / card / trait + a sub-house rep delta.
 */
export const tradeAnomalies = mysqlTable("trade_anomalies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sectorId: varchar("sectorId", { length: 128 }).notNull(),
  /** Anomaly kind drawn from the sector's flavor — see anomalyService. */
  kind: varchar("kind", { length: 64 }).notNull(),
  /** "pending" | "investigated" | "abandoned" */
  status: mysqlEnum("status", ["pending", "investigated", "abandoned"]).notNull().default("pending"),
  /** Intelligence spent so far. Resolution requires meeting the
   *  per-anomaly threshold encoded in anomalyService. */
  intelligenceSpent: int("intelligenceSpent").notNull().default(0),
  /** Optional payload describing the resolution outcome. */
  resolution: json("resolution").$type<Record<string, unknown> | null>(),
  discoveredAt: timestamp("discoveredAt").defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
}, (table) => ({
  userIdx: index("idx_trade_anomalies_user_id").on(table.userId),
  userSectorUniq: uniqueIndex("uniq_trade_anomalies_user_sector").on(
    table.userId,
    table.sectorId,
  ),
}));
export type TradeAnomalyRow = typeof tradeAnomalies.$inferSelect;

/**
 * Phase D (Empire-feel): sub-house alliances. Per-(user, seasonNumber)
 * declared treaties between two sub-houses. Active alliances cause
 * shared-enemy rep deltas to *double*; explicit betrayal posts a
 * public flag and applies -20 to both sides.
 */
export const tradeAlliances = mysqlTable("trade_alliances", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  seasonNumber: int("seasonNumber").notNull(),
  /** Lower-sorted SubHouseKey for canonical pair ordering. */
  houseA: varchar("houseA", { length: 64 }).notNull(),
  /** Higher-sorted SubHouseKey. */
  houseB: varchar("houseB", { length: 64 }).notNull(),
  /** "active" | "betrayed" | "expired" */
  status: mysqlEnum("status", ["active", "betrayed", "expired"]).notNull().default("active"),
  formedAt: timestamp("formedAt").defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
}, (table) => ({
  userIdx: index("idx_trade_alliances_user_id").on(table.userId),
  userSeasonHousesUniq: uniqueIndex(
    "uniq_trade_alliances_user_season_houses",
  ).on(table.userId, table.seasonNumber, table.houseA, table.houseB),
}));
export type TradeAllianceRow = typeof tradeAlliances.$inferSelect;

/**
 * Phase D (Empire-feel): empire dynasty. Per-user record of the
 * player's house name, current leader, and history of successions.
 * Successor + biases inherited at Act completion.
 */
export const tradeDynasty = mysqlTable("trade_dynasty", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  /** Player-chosen House name (legacy, not a person). */
  houseName: varchar("houseName", { length: 128 }).notNull(),
  /** Current leader NPC key (or "player" for the first leader). */
  currentLeader: varchar("currentLeader", { length: 64 }).notNull().default("player"),
  /** Dynasty book — append-only ledger of sealed treaties, broken
   *  oaths, season declarations, succession events. JSON array of
   *  `{ at, kind, summary, payload }`. */
  dynastyBook: json("dynastyBook").$type<Array<Record<string, unknown>>>().notNull(),
  /** Faction biases inherited from successor's faction. JSON map
   *  `{ "new_babylon": -10, "antiquarian": +5, ... }`. */
  factionBiases: json("factionBiases").$type<Record<string, number>>().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type TradeDynastyRow = typeof tradeDynasty.$inferSelect;

/**
 * Phase D (Empire-feel): player-issued edicts. One per season per
 * player. Active edicts apply a season-long modifier (toggleable
 * bonus + sub-house rep cost). Foundation for revolts.
 */
export const tradeEdicts = mysqlTable("trade_edicts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  seasonNumber: int("seasonNumber").notNull(),
  /** Edict key from EDICT_REGISTRY (apps/shared/tradeEmpire/edicts.ts). */
  edictKey: varchar("edictKey", { length: 128 }).notNull(),
  /** "active" | "expired" — edicts auto-expire at season end. */
  status: mysqlEnum("status", ["active", "expired"]).notNull().default("active"),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  expiredAt: timestamp("expiredAt"),
}, (table) => ({
  userIdx: index("idx_trade_edicts_user_id").on(table.userId),
  userSeasonUniq: uniqueIndex("uniq_trade_edicts_user_season").on(
    table.userId,
    table.seasonNumber,
  ),
}));
export type TradeEdictRow = typeof tradeEdicts.$inferSelect;

/**
 * Phase D (Empire-feel): per-user "while you were gone" cursor.
 * Tracks the last public-knowledge event id the player has
 * acknowledged. Session-start UI reads everything past this cursor
 * as the digest. One row per user.
 */
export const tradeNewsCursor = mysqlTable("trade_news_cursor", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  /** Last public-knowledge event id the player has dismissed. */
  lastSeenEventId: int("lastSeenEventId").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type TradeNewsCursorRow = typeof tradeNewsCursor.$inferSelect;

/**
 * Phase D.5 (Empire-feel substrate extensions): blockades.
 * A sector with threat ≥ 50 can be blockaded for 1 turn of orders +
 * influence. Blockaded sectors yield 0 credits that tick. Faction
 * can counter-blockade. Pure political theatre — gates future fleet
 * combat. Per-(user, seasonNumber, sectorId).
 */
export const tradeBlockades = mysqlTable("trade_blockades", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  seasonNumber: int("seasonNumber").notNull(),
  sectorId: varchar("sectorId", { length: 128 }).notNull(),
  /** "active" | "broken" | "expired" */
  status: mysqlEnum("status", ["active", "broken", "expired"]).notNull().default("active"),
  /** Influence spent to establish the blockade. */
  influenceSpent: int("influenceSpent").notNull().default(0),
  declaredAt: timestamp("declaredAt").defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
}, (table) => ({
  userIdx: index("idx_trade_blockades_user_id").on(table.userId),
  userSectorSeasonUniq: uniqueIndex(
    "uniq_trade_blockades_user_sector_season",
  ).on(table.userId, table.sectorId, table.seasonNumber),
}));
export type TradeBlockadeRow = typeof tradeBlockades.$inferSelect;

/**
 * Phase D.5: route commodity saturation. Each route's run count
 * crashes the local commodity price; the saturation row tracks how
 * much of a sector's commodity capacity is currently in oversupply.
 * Decays back to 0 over real-time idle.
 *
 * audit-allow: pending-feature (Phase D.5) — schema lands ahead of
 * helpers/readers; CONNECTION_AUDIT §3.2 flagged the empty consumer
 * footprint, retained per Phase D.5 plan.
 */
export const tradeRouteSaturation = mysqlTable("trade_route_saturation", {
  id: int("id").autoincrement().primaryKey(),
  /** SectorId at the receiving end of a route. */
  sectorId: varchar("sectorId", { length: 128 }).notNull().unique(),
  /** Saturation score (0..200). 100 = at-capacity; >100 = oversupply
   *  yielding price-crash penalties on subsequent runs. */
  saturation: int("saturation").notNull().default(0),
  /** Last time the saturation ticked. */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type TradeRouteSaturationRow = typeof tradeRouteSaturation.$inferSelect;

/**
 * Phase D.5: research races. When a player starts a tech, an NPC
 * racer is rolled. The race ticks until one side completes; if the
 * NPC wins, the player still gets the tech but at -20% bonus.
 *
 * audit-allow: pending-feature (Phase D.5) — see tradeRouteSaturation.
 */
export const tradeResearchRaces = mysqlTable("trade_research_races", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Tech key the race is over. */
  techKey: varchar("techKey", { length: 128 }).notNull(),
  /** Sub-house key of the NPC racer. */
  rivalHouseKey: varchar("rivalHouseKey", { length: 64 }).notNull(),
  /** Real-ms deadline by which one side completes. */
  deadlineMs: bigint("deadlineMs", { mode: "number" }).notNull(),
  /** "pending" | "player_won" | "rival_won" */
  status: mysqlEnum("status", ["pending", "player_won", "rival_won"]).notNull().default("pending"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
}, (table) => ({
  userIdx: index("idx_trade_research_races_user_id").on(table.userId),
}));
export type TradeResearchRaceRow = typeof tradeResearchRaces.$inferSelect;

/**
 * Phase D.5: espionage operations log. Each row is one cover-identity
 * op the player attempted: "intel" (learn an agenda step early) or
 * "sabotage" (lock a broker out for N hours). Tracks success / blown
 * outcomes for the analytics + dialog layer.
 */
export const tradeEspionageOps = mysqlTable("trade_espionage_ops", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Active coverId at the time of the op (FK soft-link). */
  coverId: varchar("coverId", { length: 128 }).notNull(),
  /** "intel" | "sabotage" */
  opKind: mysqlEnum("opKind", ["intel", "sabotage"]).notNull(),
  /** Target broker key for sabotage; agenda key for intel. */
  targetKey: varchar("targetKey", { length: 128 }).notNull(),
  /** "success" | "blown" */
  outcome: mysqlEnum("outcome", ["success", "blown"]).notNull(),
  /** Influence spent on the op. */
  influenceSpent: int("influenceSpent").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_trade_espionage_ops_user_id").on(table.userId),
}));
export type TradeEspionageOpRow = typeof tradeEspionageOps.$inferSelect;

/**
 * Phase D.5: convergence climax. Singleton (id=1) — the doom clock.
 * When `convergence` reaches 100, the climax window opens: all
 * other actions are locked for 72h real-time and the player must
 * pick from 3 bad options. Phase D.5 ships the data + helpers; the
 * UI lock + choice resolution lands when the climax narrative
 * branches are authored.
 *
 * audit-allow: pending-feature (Phase D.5) — type is imported by
 * tradeContracts.ts and tradeCourt.ts (forward-compat for the
 * climax wiring); no read/write callers yet by design.
 */
export const convergenceClimaxState = mysqlTable("convergence_climax_state", {
  id: int("id").primaryKey(),
  /** 0..100 — when 100, the climax window opens. */
  convergence: int("convergence").notNull().default(0),
  /** "dormant" | "open" | "resolved" — open means choice is pending. */
  phase: mysqlEnum("phase", ["dormant", "open", "resolved"]).notNull().default("dormant"),
  /** When the climax window opened. Null in dormant phase. */
  openedAt: timestamp("openedAt"),
  /** Real-ms when the climax window auto-resolves (default 72h). */
  closesAtMs: bigint("closesAtMs", { mode: "number" }),
  /** Resolution choice key (set when phase=resolved). */
  resolutionKey: varchar("resolutionKey", { length: 128 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ConvergenceClimaxStateRow = typeof convergenceClimaxState.$inferSelect;

/**
 * Trade Empire — Coda Agency mission loop, vertical slice.
 *
 * Per `docs/design/CANON_REV_7_ORACLE_VEX_EXPANSION.md` §2 (The Coda)
 * and `docs/design/INCOMPLETE_DESIGNS_AUDIT_2026-05-08.md` §6 item 1:
 * the Coda Agency mission system is the lateral overlay on Trade
 * Empire that delivers the Vex Solène / Engineer Zero reveal cadence.
 * This first slice ships a single working flow — browse → accept →
 * complete → reward — backed by a small typed catalog
 * (`apps/shared/tradeMissionCatalog.ts`).
 */
export const tradeMissions = mysqlTable("trade_missions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Mission catalog id — keys into apps/shared/tradeMissionCatalog.ts. */
  missionDefId: varchar("missionDefId", { length: 64 }).notNull(),
  /** lifecycle */
  status: mysqlEnum("status", [
    "available", "active", "completed", "failed", "expired",
  ]).notNull().default("available"),
  /** Optional Vex/Coda agency id if the mission is faction-aligned. */
  agencyId: varchar("agencyId", { length: 64 }),
  /** Server time the mission was offered (for expiry math). */
  offeredAt: timestamp("offeredAt").defaultNow().notNull(),
  /** Server time the player accepted (null until accepted). */
  acceptedAt: timestamp("acceptedAt"),
  /** Server time the mission completed (null until done). */
  completedAt: timestamp("completedAt"),
  /** Reward payload as JSON — credits, dream, cards, narrative flags. */
  rewardPayload: json("rewardPayload").$type<Record<string, unknown>>(),
}, (t) => ({
  byUser: index("byUser").on(t.userId, t.status),
}));
export type TradeMissionRow = typeof tradeMissions.$inferSelect;

/**
 * Per-(user, agencyId) standing tally. Each Coda mission completion
 * applies +/- standing per its rewardPayload. The CANON Rev 7
 * `coda_faction_standing` tier table (neutral / client / operative /
 * lieutenant / inner_circle) is computed from the integer standing
 * value at read-time; this table just stores the raw points.
 */
export const tradeAgencyStanding = mysqlTable("trade_agency_standing", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  agencyId: varchar("agencyId", { length: 64 }).notNull(),
  standing: int("standing").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
}, (t) => ({
  byUserAgency: uniqueIndex("byUserAgency").on(t.userId, t.agencyId),
}));
export type TradeAgencyStandingRow = typeof tradeAgencyStanding.$inferSelect;

/* ─────────────────────────────────────────────────────────────────
 * GLOBAL ALIGNMENT METER (NARRATIVE_ARCHITECTURE.md §0)
 * Singleton row tracking the community-wide Light/Dark balance.
 * Each player contributes their `users.lightAlignment` and
 * `users.darkAlignment` to the running totals; an hourly cron
 * recomputes the aggregate. Read by Hierarchy invasion cadence,
 * Architect-Triggered Events, and the client meter component.
 * ───────────────────────────────────────────────────────────────── */
export const globalAlignment = mysqlTable("global_alignment", {
  id: int("id").autoincrement().primaryKey(),
  /** Sum of users.lightAlignment across all active players. */
  lightTotal: int("lightTotal").notNull().default(0),
  /** Sum of users.darkAlignment across all active players. */
  darkTotal: int("darkTotal").notNull().default(0),
  /** Players counted in the last aggregation. */
  playerCount: int("playerCount").notNull().default(0),
  /** When the aggregate was last recomputed. */
  computedAt: timestamp("computedAt").defaultNow().notNull(),
  /** Phase derived from balance: "light_dominant" / "balanced" / "dark_dominant". */
  phase: mysqlEnum("phase", ["light_dominant", "balanced", "dark_dominant"]).notNull().default("balanced"),
});
export type GlobalAlignmentRow = typeof globalAlignment.$inferSelect;

/* ─────────────────────────────────────────────────────────────────
 * SOUL STONES (docs/design/SOUL_STONES_SYSTEM.md)
 * Per-player counts of soul-stone fragments by state. Each stone is
 * collected as `violet` (neutral), then chosen: corrupt → red, or
 * purify → gold. Counts feed Demon-Pet summoning (red) and Divine
 * Light investments (gold). The choice is permanent per stone.
 * ───────────────────────────────────────────────────────────────── */
export const soulStones = mysqlTable("soul_stones", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  /** Unprocessed stones awaiting a corrupt/purify choice. */
  violetCount: int("violetCount").notNull().default(0),
  /** Stones the player corrupted; counts toward demon-pet summoning. */
  redCount: int("redCount").notNull().default(0),
  /** Stones the player purified; counts toward divine-light investments. */
  goldCount: int("goldCount").notNull().default(0),
  /** Lifetime collection count for Loredex / progression hooks. */
  lifetimeCollected: int("lifetimeCollected").notNull().default(0),
  /** Weekly soft-cap accumulator (15/week from combat sources). Reset by cron. */
  weeklyCollected: int("weeklyCollected").notNull().default(0),
  /** Last weekly reset boundary (UTC midnight Monday). */
  weekResetAt: timestamp("weekResetAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
});
export type SoulStonesRow = typeof soulStones.$inferSelect;

/* ─────────────────────────────────────────────────────────────────
 * PLAYER PREPARATION (docs/design/NEXUS_TRIAL_PLAN.md)
 * The cumulative buff profile a player carries into the Nexus Trial
 * (March 2027). Composed across November 2026 by passing the five
 * Preparation Missions (Salvage / Reverse Trial / Tribunal: Elara /
 * The Question / Bidding War). Read at hour 0 of the Trial by the
 * Witnessing-weight calculator.
 *
 * One row per user (unique on userId). Default values mirror
 * DEFAULT_PLAYER_PREPARATION_STATE in apps/shared/preparationMissions/
 * registry.ts — keep both in sync.
 * ───────────────────────────────────────────────────────────────── */
export const playerPreparation = mysqlTable("player_preparation", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  /** Trial Witness Hand size. Baseline 5. Salvage recoveries grow it. */
  witnessHandSize: int("witnessHandSize").notNull().default(5),
  /** Reverse-Trial pass enables the +2-plays-per-turn buff on turns 1–3. */
  filedBuff: boolean("filedBuff").notNull().default(false),
  /** Elara's Tribunal pass — Confession-phase Elara-tally visible to the player. */
  elaraConfessionVisibility: boolean("elaraConfessionVisibility").notNull().default(false),
  /** The Question pass — 1.5× weight on confession-category card plays. */
  humanConfessionWeight: int("humanConfessionWeight").notNull().default(100),
  /** Bidding-War pledges. Record<factionId, multiplier×100>. */
  factionMultipliers: json("factionMultipliers").$type<Record<string, number>>().notNull().default({}),
  /** Salvage burnt-card recoveries — NPC ids. Bias ballot vote weight. */
  recoveredBurntCardIds: json("recoveredBurntCardIds").$type<string[]>().notNull().default([]),
  /** Bidding-War pledged card ids. Returned in Season 2 week 1. */
  pledgedCardIds: json("pledgedCardIds").$type<string[]>().notNull().default([]),
  /** Per-mission lifecycle. Mission ids → status. */
  missionStatus: json("missionStatus").$type<Record<string, string>>().notNull().default({
    salvage: "available",
    reverse_trial: "locked",
    tribunal_elara: "locked",
    the_question: "locked",
    bidding_war: "locked",
  }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
});
export type PlayerPreparationRow = typeof playerPreparation.$inferSelect;

/* ─────────────────────────────────────────────────────────────────
 * NEXUS TRIAL (docs/design/NEXUS_TRIAL_PLAN.md)
 * Tables driving the 72-hour live event.
 *   - trials         : 1 row per Trial. Status + timing + version pin.
 *   - trial_phases   : 6 rows per Trial. Phase boundaries + closed snapshot.
 *   - trial_tallies  : denormalized running aggregates. Read by the
 *                      Three Clocks leaderboard at fallback poll cadence.
 * The expectation is one row in `trials` ever (March 2027), but the
 * schema supports replay/restart if needed.
 * ───────────────────────────────────────────────────────────────── */
export const trials = mysqlTable("trials", {
  id: int("id").autoincrement().primaryKey(),
  /** Stable identifier surfaced to clients; e.g. "nexus_trial_2027". */
  trialKey: varchar("trialKey", { length: 64 }).notNull().unique(),
  /** Phase the tick service most recently advanced into. */
  currentPhase: mysqlEnum("currentPhase", [
    "charge",
    "opening",
    "evidence",
    "cross_examination",
    "confession",
    "verdict",
  ]).notNull().default("charge"),
  /** When the trial flipped from pre_trial → live. */
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  /** When the current phase started. */
  phaseStartedAt: timestamp("phaseStartedAt").defaultNow().notNull(),
  /** When the current phase is scheduled to end. */
  phaseEndsAt: timestamp("phaseEndsAt").notNull(),
  /** Production: 12h per phase. Staging dry-runs use shorter. */
  phaseDurationMs: bigint("phaseDurationMs", { mode: "number" }).notNull(),
  /** Replay-pin: rules version at trial start. */
  rulesVersionAtStart: varchar("rulesVersionAtStart", { length: 32 }).notNull(),
  /** Lifecycle status. */
  status: mysqlEnum("status", [
    "pre_trial",
    "live",
    "verdict_resolving",
    "closed",
    "aborted",
  ]).notNull().default("pre_trial"),
  /** Operator abort metadata. Null unless status = "aborted". */
  abortReason: text("abortReason"),
  abortedAt: timestamp("abortedAt"),
  /** Per-CLAUDE.md observability rule: who fired the abort. */
  abortedByUserId: int("abortedByUserId").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
});
export type TrialRow = typeof trials.$inferSelect;

export const trialPhases = mysqlTable("trial_phases", {
  id: int("id").autoincrement().primaryKey(),
  trialId: int("trialId").notNull().references(() => trials.id, { onDelete: "cascade" }),
  phase: mysqlEnum("phase", [
    "charge",
    "opening",
    "evidence",
    "cross_examination",
    "confession",
    "verdict",
  ]).notNull(),
  /** When the phase started (==phaseStartedAt on trials when active). */
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  /** When the phase closed (null while the phase is live). */
  closedAt: timestamp("closedAt"),
  /** Final tally snapshot persisted at transition out of this phase.
   *  Shape stays loose JSON because the Sprint-10 aggregation queries
   *  evolve; the column is the durable record of "what the tally was
   *  when phase N closed". */
  finalTallySnapshot: json("finalTallySnapshot").$type<Record<string, unknown>>(),
}, (t) => ({
  byTrialPhase: uniqueIndex("byTrialPhase").on(t.trialId, t.phase),
}));
export type TrialPhaseRow = typeof trialPhases.$inferSelect;

export const trialTallies = mysqlTable("trial_tallies", {
  id: int("id").autoincrement().primaryKey(),
  trialId: int("trialId").notNull().references(() => trials.id, { onDelete: "cascade" }),
  phase: mysqlEnum("phase", [
    "charge",
    "opening",
    "evidence",
    "cross_examination",
    "confession",
    "verdict",
  ]).notNull(),
  /** Key into the aggregation namespace — e.g. "companion:elara",
   *  "ballot:wraith_calder", "faction:architect". */
  bucket: varchar("bucket", { length: 128 }).notNull(),
  /** Aggregated weighted vote count for this bucket in this phase.
   *  Sprint 10's tick aggregator writes to this row; the leaderboard
   *  reads from it. */
  weight: int("weight").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
}, (t) => ({
  byTrialPhaseBucket: uniqueIndex("byTrialPhaseBucket").on(t.trialId, t.phase, t.bucket),
  byTrialBucket: index("byTrialBucket").on(t.trialId, t.bucket),
}));
export type TrialTallyRow = typeof trialTallies.$inferSelect;

/* ─────────────────────────────────────────────────────────────────
 * TESTIMONY (Nexus Trial vote ingestion)
 * Append-only. Every card-play during the Trial becomes one row.
 * Idempotent: a unique `idempotencyKey` (`${matchId}:${turnIndex}
 * :${cardIndex}`) lets the client retry without double-counting.
 * The aggregation tick reads this table and updates trial_tallies.
 * ───────────────────────────────────────────────────────────────── */
export const testimony = mysqlTable("testimony", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  trialId: int("trialId").notNull().references(() => trials.id, { onDelete: "cascade" }),
  phase: mysqlEnum("phase", [
    "charge",
    "opening",
    "evidence",
    "cross_examination",
    "confession",
    "verdict",
  ]).notNull(),
  /** Idempotency key. Unique — second submit returns deduplicated. */
  idempotencyKey: varchar("idempotencyKey", { length: 192 }).notNull().unique(),
  playerId: int("playerId").notNull().references(() => users.id, { onDelete: "cascade" }),
  cardDefId: varchar("cardDefId", { length: 128 }).notNull(),
  trialCategories: json("trialCategories").$type<string[]>().notNull(),
  /** Buckets this play contributes to (e.g. "companion:elara",
   *  "ballot:wraith_calder"). Computed server-side from cardDefId. */
  buckets: json("buckets").$type<string[]>().notNull(),
  /** Player's Witnessing weight × 100 at submit time. Aggregation
   *  reads this verbatim (no per-tally recomputation). */
  witnessingWeightX100: int("witnessingWeightX100").notNull().default(100),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
}, (t) => ({
  byTrialPhase: index("byTrialPhase").on(t.trialId, t.phase),
  byPlayer: index("byPlayer").on(t.playerId, t.submittedAt),
}));
export type TestimonyRow = typeof testimony.$inferSelect;

/* ─────────────────────────────────────────────────────────────────
 * COMPANION SACRIFICE (Nexus Trial Confession close)
 * Records which companion the Confession-phase vote sacrificed.
 * One row when the Confession resolver fires at hour 60. Read by
 * the romance-tag eligibility query so the freeze cutoff is
 * canonical and player-side reads are deterministic.
 *
 * Per the plan: "Romance state is per-player, not server-canonical.
 * The Trial outcome is canonical (companion X is sacrificed) but
 * the romance tag is private (this player's farewell included
 * the romance variant)." — this table is the canonical anchor;
 * romance-tag eligibility joins against companion_relationships.updatedAt
 * to enforce the freeze.
 * ───────────────────────────────────────────────────────────────── */
export const companionSacrifice = mysqlTable("companion_sacrifice", {
  id: int("id").autoincrement().primaryKey(),
  /** Which companion died. Unique — only one Confession resolution
   *  per Trial. */
  companion: mysqlEnum("companion", ["elara", "human"]).notNull().unique(),
  trialId: int("trialId").notNull().references(() => trials.id, { onDelete: "cascade" }),
  sacrificedAt: timestamp("sacrificedAt").defaultNow().notNull(),
  /** Cinematic that fired. */
  cinematicId: varchar("cinematicId", { length: 64 }).notNull(),
});
export type CompanionSacrificeRow = typeof companionSacrifice.$inferSelect;

/* ─────────────────────────────────────────────────────────────────
 * PET BREEDING (docs/archive/2026-05-08-superseded/BREEDING_SYSTEM_ART_PROMPTS.md)
 * Pair-based breeding: parentA + parentB → offspring with combined
 * traits. `status` walks queued → incubating → ready → claimed/cancelled.
 * Offspring stats are computed at completion and stored in the
 * resolved row for audit reconstruction.
 * ───────────────────────────────────────────────────────────────── */
export const petBreedingPairs = mysqlTable("pet_breeding_pairs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  parentAId: int("parentAId").notNull().references(() => playerPets.id, { onDelete: "cascade" }),
  parentBId: int("parentBId").notNull().references(() => playerPets.id, { onDelete: "cascade" }),
  status: mysqlEnum("status", [
    "queued", "incubating", "ready", "claimed", "cancelled",
  ]).notNull().default("queued"),
  /** Server time the pair was queued. */
  queuedAt: timestamp("queuedAt").defaultNow().notNull(),
  /** Server time incubation started (null until incubating). */
  startedAt: timestamp("startedAt"),
  /** Server time the offspring was ready for claim. */
  readyAt: timestamp("readyAt"),
  /** Resolved offspring blueprint (species, element, stat seed). */
  offspringPayload: json("offspringPayload").$type<Record<string, unknown>>(),
}, (t) => ({
  byUserStatus: index("byUserStatus").on(t.userId, t.status),
}));
export type PetBreedingPairRow = typeof petBreedingPairs.$inferSelect;

/* ═══════════════════════════════════════════════════════
   UNIFIED ROSTER — supporting tables
   See plan: /root/.claude/plans/add-in-the-cloning-compressed-hare.md
   ═══════════════════════════════════════════════════════ */

/** Per-user Blood Weave alignment tracker. Each Hellbox resurrection
 *  increments alignmentValue and unlocks one curated Hierarchy /
 *  Game-Master / Blood-Weave loredex entry from the reveal pool. */
export const bloodWeaveAlignment = mysqlTable("blood_weave_alignment", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  /** Cumulative Hellbox resurrections performed. */
  resurrectionsPerformed: int("resurrectionsPerformed").notNull().default(0),
  /** Hidden alignment value. Higher → closer to Hierarchy. Gates story branches. */
  alignmentValue: int("alignmentValue").notNull().default(0),
  /** Loredex entry ids already revealed via Stage 3 Blood Weave attunement. */
  revealedEntries: json("revealedEntries").$type<string[]>().default([]).notNull(),
  /** Loredex entries the player had unlocked but unread that were stripped
   *  by Hellbox memory-loss events. Surfaced in MemorialWall as "lost". */
  strippedEntries: json("strippedEntries").$type<string[]>().default([]).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
});
export type BloodWeaveAlignmentRow = typeof bloodWeaveAlignment.$inferSelect;

/** Per-crew-member personal-quest progress. One row per (user, member). */
export const apprenticePersonalQuestProgress = mysqlTable("apprentice_personal_quest_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Crew memberKey (matches crewMembers.memberKey). */
  memberKey: varchar("memberKey", { length: 64 }).notNull(),
  /** Apprentice archetype (zealot|ghost|...). */
  archetype: varchar("archetype", { length: 24 }).notNull(),
  /** Stage 0..3. Stage 3 is the breaking-point choice. */
  stage: int("stage").notNull().default(0),
  /** "deepened" | "broken" | null. */
  resolution: varchar("resolution", { length: 16 }),
  /** Stage start timestamps for VO/animation pacing. */
  stageStartedAt: json("stageStartedAt").$type<Record<string, number>>().default({}).notNull(),
  /** Quest-specific narrative flags accumulated across stages. */
  flags: json("flags").$type<Record<string, unknown>>().default({}).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
}, (t) => ({
  userMemberIdx: uniqueIndex("uq_apq_user_member").on(t.userId, t.memberKey),
  userIdx: index("idx_apq_user").on(t.userId),
}));
export type ApprenticePersonalQuestProgressRow = typeof apprenticePersonalQuestProgress.$inferSelect;

/** Gift log: tracks what the player has given to which crew member.
 *  Bond delta is computed at give-time from apprenticeGifts.ts. */
export const apprenticeGiftLog = mysqlTable("apprentice_gift_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  memberKey: varchar("memberKey", { length: 64 }).notNull(),
  giftId: varchar("giftId", { length: 64 }).notNull(),
  /** Bond delta applied (positive for likes, negative for dislikes). */
  bondDelta: int("bondDelta").notNull(),
  /** "like" | "dislike" | "neutral". */
  reaction: varchar("reaction", { length: 16 }).notNull(),
  givenAt: timestamp("givenAt").defaultNow().notNull(),
}, (t) => ({
  userMemberIdx: index("idx_agl_user_member").on(t.userId, t.memberKey),
}));
export type ApprenticeGiftLogRow = typeof apprenticeGiftLog.$inferSelect;

/** NPC world-presence state. When a recruited NPC's crew instance dies,
 *  we mark them dead-in-world here; canonical NPC dialog/quests/banter
 *  read from this row to lock down. */
export const npcWorldDeathState = mysqlTable("npc_world_death_state", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Canonical NPC key (vex_solene|wraith_calder|locke|jericho_jones|akai_shi). */
  npcKey: varchar("npcKey", { length: 32 }).notNull(),
  /** Crew memberKey of the recruited instance that died. */
  killedMemberKey: varchar("killedMemberKey", { length: 64 }).notNull(),
  /** Cycle (in-game) the death occurred. */
  diedAtCycle: int("diedAtCycle").notNull(),
  diedAt: timestamp("diedAt").defaultNow().notNull(),
}, (t) => ({
  userNpcIdx: uniqueIndex("uq_nwds_user_npc").on(t.userId, t.npcKey),
  userIdx: index("idx_nwds_user").on(t.userId),
}));
export type NpcWorldDeathStateRow = typeof npcWorldDeathState.$inferSelect;

/** Romance archetype-arc state. Extends the existing CrewRomance shape
 *  (which lives in crewPersistence's CrewState.romances JSON blob) with a
 *  durable per-couple arc tracker keyed by the two crew memberKeys. */
export const apprenticeRomanceArc = mysqlTable("apprentice_romance_arc", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  memberKeyA: varchar("memberKeyA", { length: 64 }).notNull(),
  memberKeyB: varchar("memberKeyB", { length: 64 }).notNull(),
  /** "spark" | "courtship" | "consummation" | "committed" | "ended". */
  stage: varchar("stage", { length: 16 }).notNull().default("spark"),
  /** Loredex entry id unlocked at consummation; null until reached. */
  loredexEntryId: varchar("loredexEntryId", { length: 96 }),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
}, (t) => ({
  userPairIdx: uniqueIndex("uq_ara_user_pair").on(t.userId, t.memberKeyA, t.memberKeyB),
  userIdx: index("idx_ara_user").on(t.userId),
}));
export type ApprenticeRomanceArcRow = typeof apprenticeRomanceArc.$inferSelect;

/** Per-(user, npcKey) progress through the recruitment quest chain
 *  authored in apps/shared/recruitmentQuests.ts. One row per chain.
 *  Idempotent — re-opening returns the existing row.
 *  Outcome ∈ { null (in progress), "recruited_loyal", "recruited_tense",
 *  "refused" } once the chain reaches a terminal stage. */
export const recruitmentQuestProgress = mysqlTable("recruitment_quest_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  npcKey: varchar("npcKey", { length: 32 }).notNull(),
  /** Current stage id within the chain. NULL until first open. */
  currentStageId: varchar("currentStageId", { length: 64 }),
  /** Choice ids the player has picked, in order. */
  choiceHistory: json("choiceHistory").$type<string[]>().default([]).notNull(),
  /** Narrative flags accumulated from chosen branches. */
  flagsSet: json("flagsSet").$type<string[]>().default([]).notNull(),
  /** Terminal outcome — null while in progress. */
  outcome: varchar("outcome", { length: 32 }),
  /** Snapshot of the recruit-time modifiers — starting loyalty, stat
   *  tweaks, relationship tag — captured from the final choice. The
   *  npcRecruit router reads this to instantiate the crew member. */
  recruitModifiers: json("recruitModifiers").$type<{
    startingLoyalty?: number;
    statTweaks?: Record<string, number>;
    relationshipTag?: string;
  } | null>(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
}, (t) => ({
  userNpcIdx: uniqueIndex("uq_rqp_user_npc").on(t.userId, t.npcKey),
  userIdx: index("idx_rqp_user").on(t.userId),
}));
export type RecruitmentQuestProgressRow = typeof recruitmentQuestProgress.$inferSelect;

/** Per-(user, memberKey, topicId) record of a played BioWare-style
 *  dialogue topic. The choices the player picked for each node along
 *  the way are recorded so re-opening the topic shows "(heard)" and
 *  surfaces the path that was taken. The same memberKey can play any
 *  of the four topics (past / calling / mortality / us) once each. */
export const apprenticeDialogueProgress = mysqlTable("apprentice_dialogue_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Crew memberKey of the apprentice the dialog is with. */
  memberKey: varchar("memberKey", { length: 64 }).notNull(),
  /** Topic id (e.g. "scholar_past"). */
  topicId: varchar("topicId", { length: 64 }).notNull(),
  /** Choice ids picked, in order — entry choice first, then any
   *  follow-up choices the player selected. */
  pathChoices: json("pathChoices").$type<string[]>().default([]).notNull(),
  /** Narrative flags set by the chosen branches. */
  flagsSet: json("flagsSet").$type<string[]>().default([]).notNull(),
  /** Cumulative bond delta applied by this conversation. */
  bondDeltaApplied: int("bondDeltaApplied").notNull().default(0),
  playedAt: timestamp("playedAt").defaultNow().notNull(),
}, (t) => ({
  userMemberTopicIdx: uniqueIndex("uq_adp_user_member_topic").on(t.userId, t.memberKey, t.topicId),
  userMemberIdx: index("idx_adp_user_member").on(t.userId, t.memberKey),
}));
export type ApprenticeDialogueProgressRow = typeof apprenticeDialogueProgress.$inferSelect;

/** Per-(user, memberKey, loredexEntryId) record of a loredex entry the
 *  crew member discovered while alive. The runtime sets `read=1` when
 *  the player opens the entry. If the member dies with unread entries,
 *  the casualty branch in crewTick.ts stamps `memorialAtCycle` for
 *  every unread row — those entries become memorial-only (readable from
 *  the Memorial Wall but not the main loredex). The dead literally take
 *  unread knowledge with them.
 *
 *  Hooked from rippleEngine.ts on every `loredex_entry_discovered`
 *  event. The carrier is the player's currently-deployed member (or
 *  the most-recent active member if no deployment). */
export const crewMemberLoredexCarry = mysqlTable("crew_member_loredex_carry", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Crew memberKey of the member carrying this entry. */
  memberKey: varchar("memberKey", { length: 64 }).notNull(),
  /** Loredex entry id (e.g. "ep2_04_antiquarian_footnote"). */
  loredexEntryId: varchar("loredexEntryId", { length: 96 }).notNull(),
  /** In-game cycle when the carrier discovered the entry. */
  discoveredAtCycle: int("discoveredAtCycle").notNull(),
  /** 0 = unread; 1 = read. Toggled when the player opens the entry. */
  read: tinyint("read").notNull().default(0),
  /** When the carrier dies with this entry unread, this is set to the
   *  death cycle. Entries with non-NULL memorialAtCycle render in the
   *  Memorial Wall and are gated out of the main loredex. */
  memorialAtCycle: int("memorialAtCycle"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
}, (t) => ({
  userMemberEntryIdx: uniqueIndex("uq_cmlc_user_member_entry").on(t.userId, t.memberKey, t.loredexEntryId),
  userMemberIdx: index("idx_cmlc_user_member").on(t.userId, t.memberKey),
  entryIdx: index("idx_cmlc_entry").on(t.loredexEntryId),
  memorialIdx: index("idx_cmlc_memorial").on(t.memorialAtCycle),
}));
export type CrewMemberLoredexCarryRow = typeof crewMemberLoredexCarry.$inferSelect;

/** Per-(user, npcKey) personal-quest progress for named-NPC chains.
 *  Mirrors apprenticePersonalQuestProgress but keyed on the canonical
 *  NPC key (e.g. "the_antiquarian", "the_seer", "the_architect")
 *  instead of a per-member crew key. Tier-3 cosmic figures use
 *  stage 1 only (single-encounter); tier-2 NPCs use the full 3-stage
 *  chain with breaking-point at stage 3. */
export const npcPersonalQuestProgress = mysqlTable("npc_personal_quest_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Canonical NPC key from npcIdentity.ts NAMED_NPC_KEYS. */
  npcKey: varchar("npcKey", { length: 32 }).notNull(),
  /** Tier — "2" (deep-lore) | "3" (cosmic). Cosmic encounters resolve
   *  on stage 1; tier-2 chains resolve on stage 3. */
  tier: varchar("tier", { length: 4 }).notNull(),
  stage: int("stage").notNull().default(0),
  resolution: varchar("resolution", { length: 16 }),
  stageStartedAt: json("stageStartedAt").$type<Record<string, number>>().default({}).notNull(),
  flags: json("flags").$type<Record<string, unknown>>().default({}).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
}, (t) => ({
  userNpcIdx: uniqueIndex("uq_npq_user_npc").on(t.userId, t.npcKey),
  userIdx: index("idx_npq_user").on(t.userId),
}));
export type NpcPersonalQuestProgressRow = typeof npcPersonalQuestProgress.$inferSelect;

/** Per-(user, memberKey) log of completed crew missions, tagged for
 *  sub-task validation. The mission-factory writes one row at
 *  resolution time; apprenticeQuestSubtaskService validates
 *  `mission_tag_complete` sub-tasks by querying for a row matching the
 *  required tag. Keeps tag-based gating decoupled from the mission
 *  templates themselves (which are now procedurally generated). */
export const crewMissionCompletionLog = mysqlTable("crew_mission_completion_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  memberKey: varchar("memberKey", { length: 64 }).notNull(),
  missionId: varchar("missionId", { length: 96 }).notNull(),
  /** Tag set the mission carried at resolution (faction:* / theme:* /
   *  era:* / danger:*). Joined by comma for cheap LIKE indexing; the
   *  validator splits on read. */
  tags: json("tags").$type<string[]>().default([]).notNull(),
  /** "success" | "partial" | "failure". */
  outcome: varchar("outcome", { length: 16 }).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, (t) => ({
  userMemberIdx: index("idx_cmcl_user_member").on(t.userId, t.memberKey),
  userIdx: index("idx_cmcl_user").on(t.userId),
}));
export type CrewMissionCompletionLogRow = typeof crewMissionCompletionLog.$inferSelect;

/** Per-user record of commons scenes the player has witnessed. Used
 *  by apprenticeQuestSubtaskService.validateCommonsSceneWitnessed for
 *  the `commons_scene_witnessed` sub-task type. The CommonsRoom UI
 *  inserts a row whenever a scene plays through to its conclusion. */
export const commonsScenesWitnessed = mysqlTable("commons_scenes_witnessed", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sceneId: varchar("sceneId", { length: 96 }).notNull(),
  witnessedAt: timestamp("witnessedAt").defaultNow().notNull(),
}, (t) => ({
  userSceneIdx: uniqueIndex("uq_csw_user_scene").on(t.userId, t.sceneId),
  userIdx: index("idx_csw_user").on(t.userId),
}));
export type CommonsScenesWitnessedRow = typeof commonsScenesWitnessed.$inferSelect;

/* ═══════════════════════════════════════════════════════
   WORLD WEAVE — yearly events, ripple ledger, memorial plaza

   See:
     - apps/shared/yearlyEvents.ts (canonical defs)
     - apps/server/services/yearlyEventScheduler.ts (activates / closes)
     - apps/server/services/rippleLedgerService.ts (ledger writer)
     - apps/server/services/worldMoodService.ts (reads via player flags)
   ═══════════════════════════════════════════════════════ */

/**
 * One row per scheduled yearly event. The scheduler activates rows
 * on `anchorMonth/anchorDay` and closes them after `durationDays`,
 * emitting a governance motion via `closingMotionKey` on close.
 */
export const yearlyEvents = mysqlTable("yearly_events", {
  id: int("id").autoincrement().primaryKey(),
  /** Stable key — see `apps/shared/yearlyEvents.ts` `YearlyEventKey`. */
  eventKey: varchar("eventKey", { length: 64 }).notNull(),
  anchorMonth: int("anchorMonth").notNull(), // 1-12
  anchorDay: int("anchorDay").notNull(),     // 1-31
  durationDays: int("durationDays").notNull().default(7),
  /** Composed via closingMotionKeyForYear(key, year). */
  closingMotionKey: varchar("closingMotionKey", { length: 96 }),
  /** Year this row represents (e.g. 2026). */
  activeYear: int("activeYear").notNull(),
  activatedAt: timestamp("activatedAt"),
  resolvedAt: timestamp("resolvedAt"),
  /**
   * If activation came from a seal-break override (Severance/Memorial),
   * the seal number that triggered it. NULL = calendar activation.
   */
  triggeredBySeal: int("triggeredBySeal"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  uniqEventYear: uniqueIndex("uniq_event_year").on(table.eventKey, table.activeYear),
  idxActivatedAt: index("idx_yearly_events_activated_at").on(table.activatedAt),
}));
export type YearlyEventRow = typeof yearlyEvents.$inferSelect;
export type InsertYearlyEvent = typeof yearlyEvents.$inferInsert;

/** Per-player participation in a yearly event. */
export const yearlyEventParticipation = mysqlTable("yearly_event_participation", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull().references(() => yearlyEvents.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  contribution: int("contribution").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  uniqEventUser: uniqueIndex("uniq_event_user").on(table.eventId, table.userId),
  idxUser: index("idx_yep_user").on(table.userId),
}));
export type YearlyEventParticipationRow = typeof yearlyEventParticipation.$inferSelect;

/**
 * Ripple ledger — every cross-system ripple emit is appended here for
 * the World Tapestry recent-ripples ticker. A daily prune cron drops
 * rows older than 30 days.
 */
export const rippleEvents = mysqlTable("ripple_events", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  eventType: varchar("eventType", { length: 96 }).notNull(),
  userId: int("userId").references(() => users.id, { onDelete: "set null" }),
  /** WovenSystemId or "none". */
  fromSystem: varchar("fromSystem", { length: 48 }),
  /** JSON array of WovenSystemId values. */
  toSystems: json("toSystems").$type<string[]>(),
  /** Truncated event body (no PII). */
  payload: json("payload").$type<Record<string, unknown> | null>(),
  emittedAt: timestamp("emittedAt").defaultNow().notNull(),
}, (table) => ({
  idxEmittedAt: index("idx_ripple_events_emitted_at").on(table.emittedAt),
  idxUserEmittedAt: index("idx_ripple_events_user_emitted_at").on(table.userId, table.emittedAt),
  idxEventType: index("idx_ripple_events_event_type").on(table.eventType),
}));
export type RippleEventRow = typeof rippleEvents.$inferSelect;
export type InsertRippleEvent = typeof rippleEvents.$inferInsert;

/**
 * Memorial Plaza inscriptions (Phase 5 / Seal V). Each player can
 * inscribe one imprint name per Memorial Day; high-tier donors can
 * inscribe to the global plaza visible to every player.
 */
export const memorialInscriptions = mysqlTable("memorial_inscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Free-form imprint name as inscribed. */
  inscribedName: varchar("inscribedName", { length: 120 }).notNull(),
  /** Year of the Memorial Day this inscription belongs to. */
  memorialYear: int("memorialYear").notNull(),
  /**
   * "personal" — visible only on this player's quarters
   * "global"   — visible everywhere; reserved for top donors
   */
  scope: mysqlEnum("scope", ["personal", "global"]).notNull().default("personal"),
  inscribedAt: timestamp("inscribedAt").defaultNow().notNull(),
}, (table) => ({
  uniqUserYear: uniqueIndex("uniq_memorial_user_year").on(table.userId, table.memorialYear, table.inscribedName),
  idxYearScope: index("idx_memorial_year_scope").on(table.memorialYear, table.scope),
}));
export type MemorialInscriptionRow = typeof memorialInscriptions.$inferSelect;
export type InsertMemorialInscription = typeof memorialInscriptions.$inferInsert;

/* ═══════════════════════════════════════════════════════════════════
   ROLEPLAY MODULE — identity, recognition, ledger, confession.

   These tables back the public-facing RP surface: a Dossier (the
   "RP card"), the Chosen-vs-True-Name Recognition mechanic, the
   Witnessed Ledger ticker, the weekly Confession Booth, and the
   faction-wide encrypted-relay / bureaucratic-bulletin channel.

   The tables are intentionally additive — they reference users /
   guilds / decks but do not modify those tables, so they can land
   independently and bootstrap on cold-start without touching the
   migration journal.
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Roleplay Dossier — public-facing RP card. One row per user.
 *
 * - `chosenName`   what the Insurgency calls them (visible always)
 * - `trueName`     what the Authority calls them (gated by Recognition)
 * - `pronouns`     in-character form-of-address ("called Vessel")
 * - `bio`          500-char in-character self-description
 * - `innerVoice`   one of the seven INNER_VOICE_PROFILES axes
 * - `factionAlleg` declared loyalty (empire/insurgency/neutral/witness)
 * - `motto`        single line shown to opponents at match start
 * - `sigilArt`     asset slug for the dossier sigil
 * - `recognitionMode`
 *      "private"  — only friends with explicit recognition see trueName
 *      "open"     — trueName visible to anyone who visits the dossier
 *      "sealed"   — even friends must be granted; locked by default
 */
export const roleplayDossier = mysqlTable("roleplay_dossier", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  chosenName: varchar("chosenName", { length: 64 }),
  trueName: varchar("trueName", { length: 64 }),
  pronouns: varchar("pronouns", { length: 48 }),
  bio: varchar("bio", { length: 500 }),
  innerVoice: mysqlEnum("innerVoice", [
    "aggression", "mercy", "curiosity", "conformity",
    "vigilance", "vulnerability", "wit",
  ]),
  factionAllegiance: mysqlEnum("factionAllegiance", [
    "empire", "insurgency", "neutral", "witness", "unaligned",
  ]).notNull().default("unaligned"),
  motto: varchar("motto", { length: 140 }),
  sigilArt: varchar("sigilArt", { length: 128 }),
  recognitionMode: mysqlEnum("recognitionMode", ["private", "open", "sealed"]).notNull().default("private"),
  /** Player's declared "calling" — chosen archetype label (Vessel, Cell-Runner, Witness, Archon, etc.) */
  calling: varchar("calling", { length: 48 }),
  /** Reference to ARK_THEMES.id (apps/shared/gamification.ts) — drives
   *  the dossier preview's color palette + sigil ring tint. */
  sigilThemeId: varchar("sigilThemeId", { length: 64 }).default("default"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type RoleplayDossierRow = typeof roleplayDossier.$inferSelect;
export type InsertRoleplayDossier = typeof roleplayDossier.$inferInsert;

/**
 * Recognitions — one user has been granted permission to see another
 * user's `trueName` on their dossier. Asymmetric: A → B means A can
 * see B's true name. B does not automatically see A's.
 */
export const roleplayRecognitions = mysqlTable("roleplay_recognitions", {
  id: int("id").autoincrement().primaryKey(),
  /** The user who is granting recognition (whose true name is being revealed). */
  granterUserId: int("granterUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** The user who is being granted recognition (who can now see the granter's true name). */
  granteeUserId: int("granteeUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Optional in-character note attached to the recognition ceremony. */
  ceremonyNote: varchar("ceremonyNote", { length: 280 }),
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
}, (table) => ({
  uniqGrant: uniqueIndex("uniq_roleplay_recognition").on(table.granterUserId, table.granteeUserId),
  idxGrantee: index("idx_roleplay_recognition_grantee").on(table.granteeUserId),
}));
export type RoleplayRecognitionRow = typeof roleplayRecognitions.$inferSelect;

/**
 * Deck Oaths — extends decks with RP-flavor metadata. One row per deck.
 * Kept separate from `decks` so the existing deck builder doesn't need
 * a schema-shape change.
 */
export const deckOaths = mysqlTable("deck_oaths", {
  id: int("id").autoincrement().primaryKey(),
  deckId: int("deckId").notNull().unique().references(() => decks.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** One-line motto shown to opponent at match start. */
  oath: varchar("oath", { length: 140 }),
  /** Long-form deck lore (1000 char IC justification). */
  lore: text("lore"),
  /** Card id flagged as the deck's signature ("the piece they're known for"). */
  signatureCardId: varchar("signatureCardId", { length: 96 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  idxUser: index("idx_deck_oaths_user").on(table.userId),
}));
export type DeckOathRow = typeof deckOaths.$inferSelect;

/**
 * Guild Charter — extends guilds with RP-flavor + faction-lock.
 *
 * Once `factionLockedUntil` is set, the guild's `faction` cannot be
 * changed before that date. Default lock: 30 days from charter signing.
 * The charter is also the trigger for the founding cutscene event.
 */
export const guildCharters = mysqlTable("guild_charters", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull().unique().references(() => guilds.id, { onDelete: "cascade" }),
  /** The IC guild motto (separate from MOTD, which is OOC announcements). */
  oath: varchar("oath", { length: 280 }),
  /** Guild's preferred vocabulary tier — "rite" (Insurgency), "edict" (Empire), "weave" (Witness), "compact" (neutral). */
  vocabularyTier: mysqlEnum("vocabularyTier", ["rite", "edict", "weave", "compact"]).notNull().default("compact"),
  /** Whom the guild swore in front of — name of presiding companion. */
  presidingCompanion: varchar("presidingCompanion", { length: 48 }),
  signedByUserId: int("signedByUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  signedAt: timestamp("signedAt").defaultNow().notNull(),
  factionLockedUntil: timestamp("factionLockedUntil"),
});
export type GuildCharterRow = typeof guildCharters.$inferSelect;

/**
 * Guild Cells — sub-groups within a guild. 2-6 cells per guild,
 * each with its own name, color, and chapter-style hierarchy.
 *
 * Cell vocabulary varies by guild faction:
 *   Insurgency  — "cells"
 *   Empire      — "chambers"
 *   Witness     — "circles"
 *   Neutral     — "chapters"
 */
export const guildCells = mysqlTable("guild_cells", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 64 }).notNull(),
  /** Hex-token reference (already in arkThemes palette) — UI accent. */
  paletteToken: varchar("paletteToken", { length: 32 }),
  /** Free-form ethos — what this cell stands for, IC. */
  ethos: varchar("ethos", { length: 280 }),
  leaderUserId: int("leaderUserId").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  uniqGuildName: uniqueIndex("uniq_guild_cell_name").on(table.guildId, table.name),
  idxGuild: index("idx_guild_cells_guild").on(table.guildId),
}));
export type GuildCellRow = typeof guildCells.$inferSelect;

/**
 * Guild cell membership — a guild member belongs to at most one cell.
 */
export const guildCellMembers = mysqlTable("guild_cell_members", {
  id: int("id").autoincrement().primaryKey(),
  cellId: int("cellId").notNull().references(() => guildCells.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
}, (table) => ({
  idxCell: index("idx_guild_cell_members_cell").on(table.cellId),
}));
export type GuildCellMemberRow = typeof guildCellMembers.$inferSelect;

/**
 * Faction Channel — encrypted relay (Insurgency) / bureaucratic
 * bulletin (Empire) / weave (Witness). One global feed per faction;
 * read-only to guildless players, writable by faction-aligned guilds.
 */
export const factionChannelPosts = mysqlTable("faction_channel_posts", {
  id: int("id").autoincrement().primaryKey(),
  faction: mysqlEnum("faction", ["empire", "insurgency", "witness", "neutral"]).notNull(),
  authorUserId: int("authorUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Author's guild at time of post (denormalized; survives guild changes). */
  authorGuildId: int("authorGuildId").references(() => guilds.id, { onDelete: "set null" }),
  authorChosenName: varchar("authorChosenName", { length: 64 }),
  message: varchar("message", { length: 500 }).notNull(),
  /** Post tone: "intel" (Insurgency), "edict" (Empire), "vision" (Witness), "notice" (neutral). */
  tone: mysqlEnum("tone", ["intel", "edict", "vision", "notice", "rumor"]).notNull().default("notice"),
  /** Pinned posts surface above the chronological feed. */
  pinned: boolean("pinned").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  idxFactionCreated: index("idx_faction_channel_faction_created").on(table.faction, table.createdAt),
}));
export type FactionChannelPostRow = typeof factionChannelPosts.$inferSelect;

/**
 * Witnessed Ledger Pins — curated, named entries surfaced on the
 * public Witnessed Ledger. The base feed is `rippleEvents`; pins are
 * the editorial layer ("The Antiquarian's column").
 */
export const witnessedLedgerPins = mysqlTable("witnessed_ledger_pins", {
  id: int("id").autoincrement().primaryKey(),
  /** Subject of the pin (the player whose action is recorded). */
  subjectUserId: int("subjectUserId").references(() => users.id, { onDelete: "set null" }),
  /** Headline as the Antiquarian would write it. */
  headline: varchar("headline", { length: 200 }).notNull(),
  /** Body — 500-char IC chronicle. */
  body: text("body"),
  /** Free-form tag for filtering: "naming", "war", "tribunal", "romance", "death", etc. */
  category: varchar("category", { length: 32 }).notNull().default("chronicle"),
  /** Optional ripple event id linking to the underlying world-event. */
  rippleEventId: bigint("rippleEventId", { mode: "number" }),
  pinnedAt: timestamp("pinnedAt").defaultNow().notNull(),
}, (table) => ({
  idxPinnedAt: index("idx_witnessed_ledger_pinned_at").on(table.pinnedAt),
  idxSubject: index("idx_witnessed_ledger_subject").on(table.subjectUserId),
}));
export type WitnessedLedgerPinRow = typeof witnessedLedgerPins.$inferSelect;

/**
 * Confessions — weekly Confession Booth submissions. One IC
 * confession per player per week, chosen Trial card category, voted
 * by the community using the existing trial_categories vocabulary.
 */
export const confessions = mysqlTable("confessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** ISO-week identifier ("2026-W19") — one confession per user per week. */
  weekKey: varchar("weekKey", { length: 8 }).notNull(),
  /** The IC confession text. */
  text: varchar("text", { length: 500 }).notNull(),
  /** Trial category claimed by the confessor — must be one of the
   *  six canonical sorted-order categories. */
  trialCategory: mysqlEnum("trialCategory", [
    "confession", "defensive", "evidence", "narrative", "offensive", "reactive",
  ]).notNull(),
  /** Aggregate vote tallies, denormalized for cheap reads. */
  acquittals: int("acquittals").notNull().default(0),
  condemnations: int("condemnations").notNull().default(0),
  abstentions: int("abstentions").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  uniqUserWeek: uniqueIndex("uniq_confession_user_week").on(table.userId, table.weekKey),
  idxWeek: index("idx_confession_week").on(table.weekKey),
}));
export type ConfessionRow = typeof confessions.$inferSelect;

/**
 * Confession votes — one vote per user per confession. Vote outcome
 * is one of the trial-judgment archetypes.
 */
export const confessionVotes = mysqlTable("confession_votes", {
  id: int("id").autoincrement().primaryKey(),
  confessionId: int("confessionId").notNull().references(() => confessions.id, { onDelete: "cascade" }),
  voterUserId: int("voterUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  verdict: mysqlEnum("verdict", ["acquit", "condemn", "abstain"]).notNull(),
  /** Optional 140-char IC reasoning. */
  reasoning: varchar("reasoning", { length: 140 }),
  votedAt: timestamp("votedAt").defaultNow().notNull(),
}, (table) => ({
  uniqVoterConfession: uniqueIndex("uniq_confession_vote").on(table.confessionId, table.voterUserId),
  idxConfession: index("idx_confession_votes_confession").on(table.confessionId),
}));
export type ConfessionVoteRow = typeof confessionVotes.$inferSelect;

/**
 * Guild Rites — scheduled in-character events: Naming Ceremonies,
 * Witnessings, Tribunals, Investitures. One row per scheduled rite.
 */
export const guildRites = mysqlTable("guild_rites", {
  id: int("id").autoincrement().primaryKey(),
  guildId: int("guildId").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  riteType: mysqlEnum("riteType", ["naming", "witnessing", "tribunal", "investiture", "rite_of_passage", "other"]).notNull(),
  title: varchar("title", { length: 140 }).notNull(),
  description: text("description"),
  scheduledAt: timestamp("scheduledAt").notNull(),
  hostUserId: int("hostUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Cell scoping — null means the whole guild attends. */
  cellId: int("cellId").references(() => guildCells.id, { onDelete: "set null" }),
  status: mysqlEnum("status", ["scheduled", "live", "concluded", "cancelled"]).notNull().default("scheduled"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  idxGuildScheduled: index("idx_guild_rites_guild_scheduled").on(table.guildId, table.scheduledAt),
}));
export type GuildRiteRow = typeof guildRites.$inferSelect;

/**
 * User-authored CoNexus Tomes — community-created flash-fiction
 * fragments slotted into the existing CoNexus universe. The seven
 * canonical tomes ship in `apps/shared/coNexusTomes.ts`; this table
 * is the user-generated content (UGC) layer beneath.
 *
 * Lifecycle:
 *   draft      → author can edit freely
 *   submitted  → frozen, queued for moderation
 *   published  → publicly readable, juried-curated
 *   rejected   → returned to author with a moderator note
 *   retired    → withdrawn from public, kept on record
 *
 * Length-budget mirrors canonical tomes: title up to 120 chars,
 * teaser up to 240, body up to 4000 (200-400 words is the bible
 * convention; we cap at 4000 to leave headroom).
 */
export const userTomes = mysqlTable("user_tomes", {
  id: int("id").autoincrement().primaryKey(),
  authorUserId: int("authorUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 120 }).notNull(),
  /** One-line subtitle the Loredex shows before unlock. */
  teaser: varchar("teaser", { length: 240 }),
  /** Flash-fiction body — Markdown allowed, no HTML. */
  body: text("body").notNull(),
  /** "CoNexus index" the author claims this tome occupies — free text
   *  like "CoNexus 0319"; not enforced unique. */
  cycleIndex: varchar("cycleIndex", { length: 32 }),
  status: mysqlEnum("status", ["draft", "submitted", "published", "rejected", "retired"]).notNull().default("draft"),
  /** Moderator note attached at publish/reject time. */
  moderatorNote: varchar("moderatorNote", { length: 500 }),
  /** User id of the moderator who last touched the row. */
  moderatedByUserId: int("moderatedByUserId").references(() => users.id, { onDelete: "set null" }),
  moderatedAt: timestamp("moderatedAt"),
  /** Aggregate community endorsements; cheap-read. */
  endorsements: int("endorsements").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  idxAuthor: index("idx_user_tomes_author").on(table.authorUserId),
  idxStatus: index("idx_user_tomes_status").on(table.status),
}));
export type UserTomeRow = typeof userTomes.$inferSelect;

/**
 * User tome endorsements — one per user per published tome. Used to
 * surface community-curated featured tomes on the Loredex.
 */
export const userTomeEndorsements = mysqlTable("user_tome_endorsements", {
  id: int("id").autoincrement().primaryKey(),
  tomeId: int("tomeId").notNull().references(() => userTomes.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  uniqUserTome: uniqueIndex("uniq_user_tome_endorsement").on(table.tomeId, table.userId),
}));
export type UserTomeEndorsementRow = typeof userTomeEndorsements.$inferSelect;

/* ═══════════════════════════════════════════════════════
   COMMUNITY DISCOVERY EVENTS — audit/16 PR 35 (AR7).

   Per-discovery rows the cross-player aggregator
   (`buildCommunitySnapshot` in
   apps/shared/communityInvestigation.ts) folds into the
   global tally.

   Privacy invariants enforced server-side:
     - `optIn` is durable per-row. The aggregator filters
       it out of the cross-player snapshot. The player's
       PRIVATE progress UI can still surface their own
       counted-but-not-contributed rows.
     - The unique index on (userId, kind, targetId) prevents
       a single player from over-counting; the aggregator's
       per-(kind, targetId) dedupe handles cross-player
       collapse.
     - The cross-player snapshot returns aggregate counts
       only; per-target / per-player attributions never
       leave the server.

   Migration journal is drifted, so the actual table is
   ensured by `bootstrapCommunityDiscoveryEventsTable()`
   on cold-boot (CREATE TABLE IF NOT EXISTS); see the bridge
   IIFE in apps/server/_core/index.ts.
   ═══════════════════════════════════════════════════════ */
export const communityDiscoveryEvents = mysqlTable("community_discovery_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  kind: mysqlEnum("kind", [
    "clue_collected",
    "mystery_solved",
    "puzzle_solved",
    "manuscript_entry_unlocked",
    "unreachable_registered",
  ]).notNull(),
  targetId: varchar("targetId", { length: 128 }).notNull(),
  optIn: boolean("optIn").notNull().default(false),
  seasonKey: varchar("seasonKey", { length: 32 }),
  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
}, (table) => ({
  uniqUserKindTarget: uniqueIndex("uniq_cde_user_kind_target").on(table.userId, table.kind, table.targetId),
  idxKind: index("idx_cde_kind").on(table.kind),
  idxSeason: index("idx_cde_season").on(table.seasonKey),
  idxUser: index("idx_cde_user").on(table.userId),
}));
export type CommunityDiscoveryEventRow = typeof communityDiscoveryEvents.$inferSelect;
export type InsertCommunityDiscoveryEvent = typeof communityDiscoveryEvents.$inferInsert;

/* ═══════════════════════════════════════════════════════
   APPRENTICE PEDAGOGY LIFT — six new tables backing the
   doctrine / audit / forge / memory / cohort / mission
   system shipped in apps/shared/apprentice*.ts.

   Migration journal is drifted (per CLAUDE.md), so all six
   tables are bootstrapped at server cold-boot via
   apps/server/services/apprenticePedagogyBootstrap.ts.
   ═══════════════════════════════════════════════════════ */

/** One row per (user × apprentice) — the doctrine the player picked
 *  at recruitment. Immutable after first write (the doctrine binds
 *  the apprentice's curriculum). */
export const apprenticeDoctrineSelections = mysqlTable("apprentice_doctrine_selections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  apprenticeId: varchar("apprenticeId", { length: 64 }).notNull(),
  doctrineId: varchar("doctrineId", { length: 32 }).notNull(),
  /** Mentor signature professor at time of pick. */
  mentorProfessorId: varchar("mentorProfessorId", { length: 32 }),
  /** Mechronis House at time of pick. */
  mechronisHouseId: varchar("mechronisHouseId", { length: 32 }),
  /** Hidden architectInfluence at time of pick. */
  initialArchitectInfluence: int("initialArchitectInfluence").notNull().default(0),
  pickedAt: timestamp("pickedAt").defaultNow().notNull(),
}, (table) => ({
  uqUserApprentice: uniqueIndex("uq_apprentice_doctrine_user_apprentice").on(table.userId, table.apprenticeId),
  idxUser: index("idx_apprentice_doctrine_user").on(table.userId),
}));
export type ApprenticeDoctrineSelectionRow = typeof apprenticeDoctrineSelections.$inferSelect;

/** One row per (user × apprentice × auditDay). Records the audit
 *  outcome. Bond/corruption/architectInfluence deltas already applied
 *  to the trial state at write time. */
export const apprenticeMechronisAuditLog = mysqlTable("apprentice_mechronis_audit_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  apprenticeId: varchar("apprenticeId", { length: 64 }).notNull(),
  /** 7 | 14 | 21. */
  auditDay: int("auditDay").notNull(),
  classification: varchar("classification", { length: 16 }).notNull(),
  publicTranscript: text("publicTranscript").notNull(),
  privateTranscript: text("privateTranscript").notNull(),
  bondDelta: int("bondDelta").notNull().default(0),
  corruptionDelta: int("corruptionDelta").notNull().default(0),
  architectInfluenceDelta: int("architectInfluenceDelta").notNull().default(0),
  inheritedLineFired: tinyint("inheritedLineFired").notNull().default(0),
  ranAt: timestamp("ranAt").defaultNow().notNull(),
}, (table) => ({
  uqUserApprenticeDay: uniqueIndex("uq_apprentice_audit_user_apprentice_day").on(table.userId, table.apprenticeId, table.auditDay),
  idxUser: index("idx_apprentice_audit_user").on(table.userId),
}));
export type ApprenticeMechronisAuditLogRow = typeof apprenticeMechronisAuditLog.$inferSelect;

/** One row per minted signature card — the Day-28 forge output.
 *  Stored per-user (the card is unique to the player + apprentice). */
export const apprenticeSignatureCards = mysqlTable("apprentice_signature_cards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  apprenticeId: varchar("apprenticeId", { length: 64 }).notNull(),
  /** sigcard_<apprenticeId> — stable for replay-pin. */
  cardId: varchar("cardId", { length: 96 }).notNull(),
  doctrineId: varchar("doctrineId", { length: 32 }).notNull(),
  pickedSlotId: varchar("pickedSlotId", { length: 64 }).notNull(),
  /** Bond/corruption/influence at the moment of forging. */
  bondAtForge: int("bondAtForge").notNull(),
  corruptionAtForge: int("corruptionAtForge").notNull(),
  architectInfluenceAtForge: int("architectInfluenceAtForge").notNull(),
  /** True when influence ≥ 60 — the card carries the architect echo. */
  architectCoopted: tinyint("architectCoopted").notNull().default(0),
  /** Full serialized CardDefinition payload for the registry. */
  cardPayload: json("cardPayload").$type<unknown>().notNull(),
  forgedAt: timestamp("forgedAt").defaultNow().notNull(),
}, (table) => ({
  uqUserApprentice: uniqueIndex("uq_signature_card_user_apprentice").on(table.userId, table.apprenticeId),
  uqUserCardId: uniqueIndex("uq_signature_card_user_cardid").on(table.userId, table.cardId),
  idxUser: index("idx_signature_card_user").on(table.userId),
}));
export type ApprenticeSignatureCardRow = typeof apprenticeSignatureCards.$inferSelect;

/** One row per (user × fallen apprentice). Memory Cards are immutable
 *  once minted; consumption flips consumedAt + consumedByApprenticeId. */
export const apprenticeMemoryCards = mysqlTable("apprentice_memory_cards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** memcard_<deceasedApprenticeId>. */
  memoryCardId: varchar("memoryCardId", { length: 96 }).notNull(),
  deceasedApprenticeId: varchar("deceasedApprenticeId", { length: 64 }).notNull(),
  deceasedName: varchar("deceasedName", { length: 96 }).notNull(),
  archetype: varchar("archetype", { length: 32 }).notNull(),
  doctrineId: varchar("doctrineId", { length: 32 }),
  finalBond: int("finalBond").notNull(),
  finalCorruption: int("finalCorruption").notNull(),
  daysSurvived: int("daysSurvived").notNull(),
  cause: varchar("cause", { length: 256 }).notNull(),
  finalArchitectInfluence: int("finalArchitectInfluence").notNull().default(0),
  consumedAt: timestamp("consumedAt"),
  consumedByApprenticeId: varchar("consumedByApprenticeId", { length: 64 }),
  mintedAt: timestamp("mintedAt").defaultNow().notNull(),
}, (table) => ({
  uqUserCardId: uniqueIndex("uq_memory_card_user_cardid").on(table.userId, table.memoryCardId),
  idxUser: index("idx_memory_card_user").on(table.userId),
  idxConsumed: index("idx_memory_card_consumed").on(table.consumedByApprenticeId),
}));
export type ApprenticeMemoryCardRow = typeof apprenticeMemoryCards.$inferSelect;

/** One row per user — the live cohort state (active + 2 training).
 *  Slots are nullable; recruitment + promotion + vacate update them. */
export const apprenticeCohortSlots = mysqlTable("apprentice_cohort_slots", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  /** Active companion slot — apprentice id or null. */
  activeApprenticeId: varchar("activeApprenticeId", { length: 64 }),
  activeDoctrineId: varchar("activeDoctrineId", { length: 32 }),
  activeFilledAt: timestamp("activeFilledAt"),
  trainingAApprenticeId: varchar("trainingAApprenticeId", { length: 64 }),
  trainingADoctrineId: varchar("trainingADoctrineId", { length: 32 }),
  trainingAFilledAt: timestamp("trainingAFilledAt"),
  trainingBApprenticeId: varchar("trainingBApprenticeId", { length: 64 }),
  trainingBDoctrineId: varchar("trainingBDoctrineId", { length: 32 }),
  trainingBFilledAt: timestamp("trainingBFilledAt"),
  totalRecruited: int("totalRecruited").notNull().default(0),
  totalGraduated: int("totalGraduated").notNull().default(0),
  totalFallen: int("totalFallen").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  idxUser: index("idx_cohort_slots_user").on(table.userId),
}));
export type ApprenticeCohortSlotsRow = typeof apprenticeCohortSlots.$inferSelect;

/** One row per active mission instance — graduate-legion micro-arcs.
 *  Mission lifecycle: briefed → crisis_pending → resolved. */
export const apprenticeMissionInstances = mysqlTable("apprentice_mission_instances", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  apprenticeId: varchar("apprenticeId", { length: 64 }).notNull(),
  missionTypeId: varchar("missionTypeId", { length: 64 }).notNull(),
  role: varchar("role", { length: 32 }).notNull(),
  /** "briefed" | "crisis_pending" | "resolved". */
  stage: varchar("stage", { length: 16 }).notNull().default("briefed"),
  /** Player's choice id at the crisis beat. Null until resolved. */
  resolvedChoiceId: varchar("resolvedChoiceId", { length: 64 }),
  /** Bond/corruption/influence deltas already applied (idempotency guard). */
  bondDelta: int("bondDelta").notNull().default(0),
  corruptionDelta: int("corruptionDelta").notNull().default(0),
  architectInfluenceDelta: int("architectInfluenceDelta").notNull().default(0),
  rewardMultiplierApplied: int("rewardMultiplierApplied").notNull().default(100), // ×100 to stay int
  briefedAt: timestamp("briefedAt").defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
}, (table) => ({
  idxUser: index("idx_mission_instances_user").on(table.userId),
  idxStage: index("idx_mission_instances_user_stage").on(table.userId, table.stage),
  idxApprentice: index("idx_mission_instances_apprentice").on(table.apprenticeId),
}));
export type ApprenticeMissionInstanceRow = typeof apprenticeMissionInstances.$inferSelect;

/* ═══════════════════════════════════════════════════════
   NEMESIS SYSTEM TABLES

   Per dreamer-canon (2026-05-13): every player apprentice
   recruitment spawns a Nemesis — Shadow-of-Mordor-style
   archetype-mirror rival, canonically the Politician's
   secret apprentice released from the Matrix of Dreams on
   the Necromancer's escape (Resurrectionist arc post-game
   canon, conspiracy-clue-encoded).

   Three tables:
     - nemesis_state — 1 row per Nemesis (user × cohort)
     - nemesis_memory — encounter ledger (1 row per encounter)
     - nemesis_plans — active + resolved Plans
   ═══════════════════════════════════════════════════════ */

export const nemesisState = mysqlTable("nemesis_state", {
  id: int("id").autoincrement().primaryKey(),
  /** Canonical Nemesis id (nem_{userId}_{cohortNumber}). */
  nemesisId: varchar("nemesisId", { length: 64 }).notNull(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  cohortNumber: int("cohortNumber").notNull(),
  /** Apprentice archetype the player is training (used to
   *  derive eligibility set; pinned at spawn). */
  apprenticeArchetype: varchar("apprenticeArchetype", { length: 32 }).notNull(),
  /** Nemesis's archetype (RNG-selected from the 11 others). */
  nemesisArchetype: varchar("nemesisArchetype", { length: 32 }).notNull(),
  /** Display archetype-title (e.g. "The Ghost-Nemesis"). */
  archetypeTitle: varchar("archetypeTitle", { length: 64 }).notNull(),
  /** Procedurally-generated proper name (always computed;
   *  surfaced only when name-reveal gates are closed). */
  properName: varchar("properName", { length: 96 }).notNull(),
  /** Whether name-reveal gates are closed at the moment of
   *  the last refresh. The runtime re-refreshes this flag
   *  from game-state (Resurrectionist E5 + Game Master Fight
   *  2 plague-mask seed) on each fetch. */
  nameRevealed: int("nameRevealed").notNull().default(0),
  /** Which Politician propaganda tic this Nemesis carries. */
  politicianTic: varchar("politicianTic", { length: 64 }).notNull(),
  /** Current visible rank (1-5). */
  rank: tinyint("rank").notNull().default(1),
  /** Current grudge tier (0-5). */
  grudgeTier: tinyint("grudgeTier").notNull().default(0),
  /** Preferred operating surface (cosmetic). */
  preferredSurface: varchar("preferredSurface", { length: 32 }).notNull(),
  /** Faction the Nemesis is aligned with in the living
   *  universe (Phase K + faction alignment). Pinned at
   *  spawn via chooseNemesisFaction; player-state-aware. */
  alignedFaction: varchar("alignedFaction", { length: 32 }).notNull().default("hierarchy"),
  /** Phase K Wave 4 — per-user monotonic spawn-sequence.
   *  Sequence 1 = the player's first-ever Nemesis. Used
   *  to fire `accumulation_reveal` on prior Nemeses when
   *  sequence ≥ 2 spawns. */
  nemesisSequence: int("nemesisSequence").notNull().default(1),
  /** Phase K Wave 4 — one-shot guard so the
   *  `name_reveal_moment` scene fires at most once per
   *  Nemesis (the moment after both gates close). */
  nameRevealAcknowledged: int("nameRevealAcknowledged").notNull().default(0),
  /** Mordor-Saga hybrid (Phase K2). When 1, this Nemesis
   *  has been retired from the active pool — via peace,
   *  recruit, or rank-0 exhaustion. */
  retired: int("retired").notNull().default(0),
  /** Lieutenant promotion (Phase K2). When non-null, this
   *  Nemesis serves under another Nemesis (planning is
   *  coordinated under the higher-rank one). */
  lieutenantOfNemesisId: varchar("lieutenantOfNemesisId", { length: 64 }),
  spawnedAt: timestamp("spawnedAt").defaultNow().notNull(),
  lastEncounterAt: timestamp("lastEncounterAt"),
}, (table) => ({
  uniqNemesisId: uniqueIndex("uniq_nemesis_state_nemesis_id").on(table.nemesisId),
  uniqUserCohort: uniqueIndex("uniq_nemesis_state_user_cohort").on(
    table.userId,
    table.cohortNumber,
  ),
  idxUser: index("idx_nemesis_state_user").on(table.userId),
  idxUserActive: index("idx_nemesis_state_user_active").on(table.userId, table.retired),
  idxFaction: index("idx_nemesis_state_faction").on(table.alignedFaction),
}));
export type NemesisStateRow = typeof nemesisState.$inferSelect;

export const nemesisMemory = mysqlTable("nemesis_memory", {
  id: int("id").autoincrement().primaryKey(),
  /** Canonical memory-entry id (mem_{nemesisId}_{sequence}). */
  memoryId: varchar("memoryId", { length: 96 }).notNull(),
  nemesisId: varchar("nemesisId", { length: 64 }).notNull(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Per-Nemesis sequence number — increases monotonically. */
  sequence: int("sequence").notNull(),
  /** Encounter kind (e.g. "route_sabotaged" / "killed_by_player"). */
  encounterKind: varchar("encounterKind", { length: 64 }).notNull(),
  /** Source surface (e.g. "trade-empire" / "world"). */
  source: varchar("source", { length: 32 }).notNull(),
  /** The verbatim quote-opening generated at record-time. */
  quoteOpening: text("quoteOpening").notNull(),
  /** Optional player-context blob (act / phase / witnessLevel etc.). */
  playerContext: json("playerContext"),
  /** Phase K Wave 6 — when the dialog modal rendered this
   *  encounter to the player. NULL = pending; the next
   *  surface-entry hook should open the modal. */
  renderedAt: timestamp("renderedAt"),
  /** Phase K Wave 6 — the player choice made in the modal
   *  (the dialog node's `sets` flag string). Null = the
   *  scene played out without a recorded choice. */
  choiceFlag: varchar("choiceFlag", { length: 96 }),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
}, (table) => ({
  uniqMemoryId: uniqueIndex("uniq_nemesis_memory_id").on(table.memoryId),
  uniqNemesisSeq: uniqueIndex("uniq_nemesis_memory_nemesis_seq").on(
    table.nemesisId,
    table.sequence,
  ),
  idxNemesisId: index("idx_nemesis_memory_nemesis_id").on(table.nemesisId),
  idxUserKind: index("idx_nemesis_memory_user_kind").on(
    table.userId,
    table.encounterKind,
  ),
}));
export type NemesisMemoryRow = typeof nemesisMemory.$inferSelect;

export const nemesisPlans = mysqlTable("nemesis_plans", {
  id: int("id").autoincrement().primaryKey(),
  /** Canonical plan id (plan_{nemesisId}_{sequence}). */
  planId: varchar("planId", { length: 96 }).notNull(),
  nemesisId: varchar("nemesisId", { length: 64 }).notNull(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Per-Nemesis plan-sequence number. */
  sequence: int("sequence").notNull(),
  /** Plan kind (e.g. "trade_route_sabotage"). */
  kind: varchar("kind", { length: 64 }).notNull(),
  /** Operational surface targeted. */
  targetSurface: varchar("targetSurface", { length: 32 }).notNull(),
  /** Free-form target detail. */
  targetDetail: varchar("targetDetail", { length: 128 }).notNull(),
  /** Lore-title surfaced to the player. */
  loreTitle: varchar("loreTitle", { length: 256 }).notNull(),
  /** Power-up granted on success. */
  rewardOnSuccess: varchar("rewardOnSuccess", { length: 64 }).notNull(),
  /** Current status ("spawned" / "ticking" / "succeeded" /
   *  "disrupted" / "expired"). */
  status: varchar("status", { length: 16 }).notNull().default("spawned"),
  spawnedAt: timestamp("spawnedAt").defaultNow().notNull(),
  /** When the plan ticks. If status is still spawned/ticking
   *  past this timestamp, runtime should resolve it as
   *  succeeded. */
  ticksAt: timestamp("ticksAt").notNull(),
  resolvedAt: timestamp("resolvedAt"),
}, (table) => ({
  uniqPlanId: uniqueIndex("uniq_nemesis_plans_plan_id").on(table.planId),
  uniqNemesisSeq: uniqueIndex("uniq_nemesis_plans_nemesis_seq").on(
    table.nemesisId,
    table.sequence,
  ),
  idxNemesisId: index("idx_nemesis_plans_nemesis_id").on(table.nemesisId),
  idxUserStatus: index("idx_nemesis_plans_user_status").on(
    table.userId,
    table.status,
  ),
  idxStatusTicks: index("idx_nemesis_plans_status_ticks").on(
    table.status,
    table.ticksAt,
  ),
}));
export type NemesisPlanRow = typeof nemesisPlans.$inferSelect;

/** Phase K1.3 — power-up effects ledger. When a Nemesis
 *  plan auto-succeeds via the lazy sweep, the plan's
 *  rewardOnSuccess is materialized as a row here. Surface
 *  systems query the table to apply real gameplay
 *  consequences (e.g. trade-empire reads
 *  trade_route_lock_seven_days; casino reads
 *  casino_odds_double_two_rounds; etc.). */
export const nemesisPowerUpEffects = mysqlTable("nemesis_power_up_effects", {
  id: int("id").autoincrement().primaryKey(),
  effectId: varchar("effectId", { length: 96 }).notNull(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** The Nemesis whose plan-success generated this effect. */
  nemesisId: varchar("nemesisId", { length: 64 }).notNull(),
  /** The plan whose ticksAt triggered the effect. */
  planId: varchar("planId", { length: 96 }).notNull(),
  /** NemesisPowerUp kind from apps/shared/nemesisPlans.ts. */
  effectKind: varchar("effectKind", { length: 64 }).notNull(),
  /** Free-form JSON payload — surface-specific. E.g. for
   *  trade_route_lock_seven_days: {routeKey: "..."}. */
  payload: json("payload"),
  /** Active until this timestamp. Surfaces filter on
   *  `expiresAt > now()` when querying. */
  expiresAt: timestamp("expiresAt").notNull(),
  /** When the effect was consumed/applied (e.g. casino
   *  burned a doubled-odds round). NULL = unconsumed. */
  consumedAt: timestamp("consumedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  uniqEffectId: uniqueIndex("uniq_nemesis_power_up_effect_id").on(table.effectId),
  idxUserActive: index("idx_nemesis_power_up_user_active").on(
    table.userId,
    table.expiresAt,
  ),
  idxKindUser: index("idx_nemesis_power_up_kind_user").on(
    table.effectKind,
    table.userId,
  ),
}));
export type NemesisPowerUpEffectRow = typeof nemesisPowerUpEffects.$inferSelect;
