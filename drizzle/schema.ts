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
