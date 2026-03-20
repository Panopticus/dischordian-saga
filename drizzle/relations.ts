/**
 * DRIZZLE RELATIONS — Defines foreign key relationships between tables
 * Used by Drizzle ORM for type-safe joins and nested queries
 */
import { relations } from "drizzle-orm";
import {
  users,
  userProgress,
  achievements,
  userAchievements,
  arkThemes,
  cards,
  userCards,
  decks,
  cardGameMatches,
  characterSheets,
  arkRooms,
  userArkProgress,
  trophyDisplays,
  twPlayerState,
  twColonies,
  twGameLog,
  craftingLog,
  citizenCharacters,
  dreamBalance,
  storeItems,
  storePurchases,
  shipUpgrades,
  playerBases,
  contentParticipation,
  fightLeaderboard,
  fightMatches,
  linkedWallets,
  nftClaims,
  pvpMatches,
  pvpLeaderboard,
  pvpDecks,
  pvpSeasons,
  pvpSeasonRecords,
  draftTournaments,
  draftParticipants,
  cardTrades,
  cardGameAchievements,
  featureUnlocks,
  warContributions,
} from "./schema";

// ═══ USERS ═══
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  achievements: many(userAchievements),
  arkThemes: many(arkThemes),
  cards: many(userCards),
  decks: many(decks),
  characterSheets: many(characterSheets),
  arkProgress: many(userArkProgress),
  trophyDisplays: many(trophyDisplays),
  tradeState: many(twPlayerState),
  colonies: many(twColonies),
  craftingLogs: many(craftingLog),
  citizens: many(citizenCharacters),
  dreamBalance: many(dreamBalance),
  purchases: many(storePurchases),
  shipUpgrades: many(shipUpgrades),
  bases: many(playerBases),
  contentParticipation: many(contentParticipation),
  fightLeaderboard: many(fightLeaderboard),
  fightMatches: many(fightMatches),
  linkedWallets: many(linkedWallets),
  nftClaims: many(nftClaims),
  pvpLeaderboard: many(pvpLeaderboard),
  pvpDecks: many(pvpDecks),
  pvpSeasonRecords: many(pvpSeasonRecords),
  draftParticipants: many(draftParticipants),
  cardTrades: many(cardTrades),
  cardAchievements: many(cardGameAchievements),
  featureUnlocks: many(featureUnlocks),
  warContributions: many(warContributions),
}));

// ═══ USER PROGRESS ═══
export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
}));

// ═══ ACHIEVEMENTS ═══
export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
  achievement: one(achievements, { fields: [userAchievements.achievementId], references: [achievements.id] }),
}));

// ═══ ARK THEMES ═══
export const arkThemesRelations = relations(arkThemes, ({ one }) => ({
  user: one(users, { fields: [arkThemes.userId], references: [users.id] }),
}));

// ═══ CARDS ═══
export const cardsRelations = relations(cards, ({ many }) => ({
  userCards: many(userCards),
}));

export const userCardsRelations = relations(userCards, ({ one }) => ({
  user: one(users, { fields: [userCards.userId], references: [users.id] }),
  card: one(cards, { fields: [userCards.cardId], references: [cards.cardId] }),
}));

// ═══ DECKS ═══
export const decksRelations = relations(decks, ({ one }) => ({
  user: one(users, { fields: [decks.userId], references: [users.id] }),
}));

// ═══ CARD GAME MATCHES ═══
export const cardGameMatchesRelations = relations(cardGameMatches, ({ one }) => ({
  player: one(users, { fields: [cardGameMatches.userId], references: [users.id] }),
}));

// ═══ CHARACTER SHEETS ═══
export const characterSheetsRelations = relations(characterSheets, ({ one }) => ({
  user: one(users, { fields: [characterSheets.userId], references: [users.id] }),
}));

// ═══ ARK ROOMS & PROGRESS ═══
export const userArkProgressRelations = relations(userArkProgress, ({ one }) => ({
  user: one(users, { fields: [userArkProgress.userId], references: [users.id] }),
  room: one(arkRooms, { fields: [userArkProgress.roomId], references: [arkRooms.roomId] }),
}));

export const arkRoomsRelations = relations(arkRooms, ({ many }) => ({
  userProgress: many(userArkProgress),
}));

// ═══ TROPHY DISPLAYS ═══
export const trophyDisplaysRelations = relations(trophyDisplays, ({ one }) => ({
  user: one(users, { fields: [trophyDisplays.userId], references: [users.id] }),
}));

// ═══ TRADE WAR ═══
export const twPlayerStateRelations = relations(twPlayerState, ({ one, many }) => ({
  user: one(users, { fields: [twPlayerState.userId], references: [users.id] }),
  colonies: many(twColonies),
}));

export const twColoniesRelations = relations(twColonies, ({ one }) => ({
  user: one(users, { fields: [twColonies.userId], references: [users.id] }),
}));

export const twGameLogRelations = relations(twGameLog, ({ one }) => ({
  user: one(users, { fields: [twGameLog.userId], references: [users.id] }),
}));

// ═══ CRAFTING ═══
export const craftingLogRelations = relations(craftingLog, ({ one }) => ({
  user: one(users, { fields: [craftingLog.userId], references: [users.id] }),
}));

// ═══ CITIZEN CHARACTERS ═══
export const citizenCharactersRelations = relations(citizenCharacters, ({ one }) => ({
  user: one(users, { fields: [citizenCharacters.userId], references: [users.id] }),
}));

// ═══ DREAM BALANCE ═══
export const dreamBalanceRelations = relations(dreamBalance, ({ one }) => ({
  user: one(users, { fields: [dreamBalance.userId], references: [users.id] }),
}));

// ═══ STORE ═══
export const storePurchasesRelations = relations(storePurchases, ({ one }) => ({
  user: one(users, { fields: [storePurchases.userId], references: [users.id] }),
  item: one(storeItems, { fields: [storePurchases.itemId], references: [storeItems.id] }),
}));

export const storeItemsRelations = relations(storeItems, ({ many }) => ({
  purchases: many(storePurchases),
}));

// ═══ SHIP UPGRADES ═══
export const shipUpgradesRelations = relations(shipUpgrades, ({ one }) => ({
  user: one(users, { fields: [shipUpgrades.userId], references: [users.id] }),
}));

// ═══ PLAYER BASES ═══
export const playerBasesRelations = relations(playerBases, ({ one }) => ({
  user: one(users, { fields: [playerBases.userId], references: [users.id] }),
}));

// ═══ CONTENT PARTICIPATION ═══
export const contentParticipationRelations = relations(contentParticipation, ({ one }) => ({
  user: one(users, { fields: [contentParticipation.userId], references: [users.id] }),
}));

// ═══ FIGHT SYSTEM ═══
export const fightLeaderboardRelations = relations(fightLeaderboard, ({ one }) => ({
  user: one(users, { fields: [fightLeaderboard.userId], references: [users.id] }),
}));

export const fightMatchesRelations = relations(fightMatches, ({ one }) => ({
  user: one(users, { fields: [fightMatches.userId], references: [users.id] }),
}));

// ═══ WALLETS & NFT ═══
export const linkedWalletsRelations = relations(linkedWallets, ({ one }) => ({
  user: one(users, { fields: [linkedWallets.userId], references: [users.id] }),
}));

export const nftClaimsRelations = relations(nftClaims, ({ one }) => ({
  user: one(users, { fields: [nftClaims.userId], references: [users.id] }),
}));

// ═══ PVP SYSTEM ═══
export const pvpMatchesRelations = relations(pvpMatches, ({ one }) => ({
  player1: one(users, { fields: [pvpMatches.player1Id], references: [users.id] }),
}));

export const pvpLeaderboardRelations = relations(pvpLeaderboard, ({ one }) => ({
  user: one(users, { fields: [pvpLeaderboard.userId], references: [users.id] }),
}));

export const pvpDecksRelations = relations(pvpDecks, ({ one }) => ({
  user: one(users, { fields: [pvpDecks.userId], references: [users.id] }),
}));

export const pvpSeasonsRelations = relations(pvpSeasons, ({ many }) => ({
  records: many(pvpSeasonRecords),
}));

export const pvpSeasonRecordsRelations = relations(pvpSeasonRecords, ({ one }) => ({
  user: one(users, { fields: [pvpSeasonRecords.userId], references: [users.id] }),
  season: one(pvpSeasons, { fields: [pvpSeasonRecords.seasonId], references: [pvpSeasons.id] }),
}));

// ═══ DRAFT SYSTEM ═══
export const draftTournamentsRelations = relations(draftTournaments, ({ many }) => ({
  participants: many(draftParticipants),
}));

export const draftParticipantsRelations = relations(draftParticipants, ({ one }) => ({
  user: one(users, { fields: [draftParticipants.userId], references: [users.id] }),
  tournament: one(draftTournaments, { fields: [draftParticipants.tournamentId], references: [draftTournaments.id] }),
}));

// ═══ CARD TRADES ═══
export const cardTradesRelations = relations(cardTrades, ({ one }) => ({
  user: one(users, { fields: [cardTrades.userId], references: [users.id] }),
}));

// ═══ CARD GAME ACHIEVEMENTS ═══
export const cardGameAchievementsRelations = relations(cardGameAchievements, ({ one }) => ({
  user: one(users, { fields: [cardGameAchievements.userId], references: [users.id] }),
}));

// ═══ FEATURE UNLOCKS ═══
export const featureUnlocksRelations = relations(featureUnlocks, ({ one }) => ({
  user: one(users, { fields: [featureUnlocks.userId], references: [users.id] }),
}));

// ═══ WAR CONTRIBUTIONS ═══
export const warContributionsRelations = relations(warContributions, ({ one }) => ({
  user: one(users, { fields: [warContributions.userId], references: [users.id] }),
}));
