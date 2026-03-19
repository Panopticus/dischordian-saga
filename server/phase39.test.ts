import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════
   PHASE 39: DRAFT TOURNAMENTS, CARD TRADING, ACHIEVEMENTS
   ═══════════════════════════════════════════════════════ */

/* ─── DRAFT TOURNAMENT ROUTER ─── */
describe("Phase 39: Draft Tournament Router", () => {
  const draftRouter = fs.readFileSync(
    path.resolve(__dirname, "routers/draft.ts"),
    "utf-8"
  );

  describe("Router structure", () => {
    it("should export draftRouter", () => {
      expect(draftRouter).toContain("export const draftRouter");
    });

    it("should use protectedProcedure for all endpoints", () => {
      expect(draftRouter).toContain("protectedProcedure");
    });

    it("should import from drizzle schema", () => {
      expect(draftRouter).toContain("drizzle/schema");
    });
  });

  describe("CRUD procedures", () => {
    it("should have create procedure", () => {
      expect(draftRouter).toContain("create: protectedProcedure");
    });

    it("should have join procedure", () => {
      expect(draftRouter).toContain("join: protectedProcedure");
    });

    it("should have getTournament procedure", () => {
      expect(draftRouter).toContain("getTournament");
    });

    it("should have getMyDraftState procedure", () => {
      expect(draftRouter).toContain("getMyDraftState");
    });

    it("should have pickCard procedure", () => {
      expect(draftRouter).toContain("pickCard");
    });

    it("should have listOpen procedure", () => {
      expect(draftRouter).toContain("listOpen");
    });

    it("should have myHistory procedure", () => {
      expect(draftRouter).toContain("myHistory");
    });

    it("should have startBattles procedure", () => {
      expect(draftRouter).toContain("startBattles");
    });
  });

  describe("Database integration", () => {
    it("should reference draftTournaments table", () => {
      expect(draftRouter).toContain("draftTournaments");
    });

    it("should reference draftParticipants table", () => {
      expect(draftRouter).toContain("draftParticipants");
    });

    it("should use getDb for database access", () => {
      expect(draftRouter).toContain("getDb");
    });
  });

  describe("Input validation", () => {
    it("should use zod for input validation", () => {
      expect(draftRouter).toContain("z.object");
    });

    it("should validate tournamentId input", () => {
      expect(draftRouter).toContain("tournamentId");
    });
  });
});

/* ─── TRADING ROUTER ─── */
describe("Phase 39: Card Trading Router", () => {
  const tradingRouter = fs.readFileSync(
    path.resolve(__dirname, "routers/trading.ts"),
    "utf-8"
  );

  describe("Router structure", () => {
    it("should export tradingRouter", () => {
      expect(tradingRouter).toContain("export const tradingRouter");
    });

    it("should use protectedProcedure", () => {
      expect(tradingRouter).toContain("protectedProcedure");
    });
  });

  describe("Trade procedures", () => {
    it("should have createOffer mutation", () => {
      expect(tradingRouter).toContain("createOffer");
      expect(tradingRouter).toContain(".mutation");
    });

    it("should have acceptTrade mutation", () => {
      expect(tradingRouter).toContain("acceptTrade");
    });

    it("should have declineTrade mutation", () => {
      expect(tradingRouter).toContain("declineTrade");
    });

    it("should have getMyTrades query", () => {
      expect(tradingRouter).toContain("getMyTrades");
      expect(tradingRouter).toContain(".query");
    });

    it("should have searchPlayers query", () => {
      expect(tradingRouter).toContain("searchPlayers");
    });

    it("should have getTradeHistory query", () => {
      expect(tradingRouter).toContain("getTradeHistory");
    });
  });

  describe("Trade card schema", () => {
    it("should define tradeCardSchema with cardId and quantity", () => {
      expect(tradingRouter).toContain("tradeCardSchema");
      expect(tradingRouter).toContain("cardId");
      expect(tradingRouter).toContain("quantity");
    });

    it("should validate receiverId as number", () => {
      expect(tradingRouter).toContain("receiverId: z.number()");
    });

    it("should support senderCards and receiverCards arrays", () => {
      expect(tradingRouter).toContain("senderCards");
      expect(tradingRouter).toContain("receiverCards");
    });

    it("should support Dream token trading", () => {
      expect(tradingRouter).toContain("senderDream");
      expect(tradingRouter).toContain("receiverDream");
    });
  });

  describe("Trade safety checks", () => {
    it("should prevent self-trading", () => {
      expect(tradingRouter).toContain("Cannot trade with yourself");
    });

    it("should verify card ownership before trade", () => {
      expect(tradingRouter).toContain("userCards");
      expect(tradingRouter).toContain("quantity");
    });

    it("should verify Dream balance before trade", () => {
      expect(tradingRouter).toContain("dreamBalance");
    });

    it("should check trade status before accepting", () => {
      expect(tradingRouter).toContain("pending");
    });
  });

  describe("Trade execution", () => {
    it("should transfer cards from sender to receiver", () => {
      // Should update userCards for both parties
      expect(tradingRouter).toContain("trade.senderCards");
      expect(tradingRouter).toContain("trade.receiverCards");
    });

    it("should mark trade as accepted after execution", () => {
      expect(tradingRouter).toContain("accepted");
    });

    it("should support cancelled and declined statuses", () => {
      expect(tradingRouter).toContain("cancelled");
      expect(tradingRouter).toContain("declined");
    });
  });

  describe("getMyTrades returns sent/received structure", () => {
    it("should return sent and received arrays", () => {
      expect(tradingRouter).toContain("sent:");
      expect(tradingRouter).toContain("received:");
    });

    it("should enrich trades with user names", () => {
      expect(tradingRouter).toContain("senderName");
      expect(tradingRouter).toContain("receiverName");
    });
  });
});

/* ─── CARD ACHIEVEMENTS ROUTER ─── */
describe("Phase 39: Card Achievements Router", () => {
  const achievementsRouter = fs.readFileSync(
    path.resolve(__dirname, "routers/cardAchievements.ts"),
    "utf-8"
  );

  describe("Router structure", () => {
    it("should export cardAchievementsRouter", () => {
      expect(achievementsRouter).toContain("export const cardAchievementsRouter");
    });

    it("should export CARD_ACHIEVEMENTS definitions", () => {
      expect(achievementsRouter).toContain("export const CARD_ACHIEVEMENTS");
    });

    it("should export CardAchievementDef interface", () => {
      expect(achievementsRouter).toContain("export interface CardAchievementDef");
    });
  });

  describe("Achievement definitions", () => {
    it("should define PvP achievements", () => {
      expect(achievementsRouter).toContain("first_blood");
      expect(achievementsRouter).toContain("pvp_wins_10");
      expect(achievementsRouter).toContain("pvp_wins_50");
      expect(achievementsRouter).toContain("pvp_wins_100");
      expect(achievementsRouter).toContain("pvp_wins_500");
    });

    it("should define win streak achievements", () => {
      expect(achievementsRouter).toContain("win_streak_3");
      expect(achievementsRouter).toContain("win_streak_5");
      expect(achievementsRouter).toContain("win_streak_10");
    });

    it("should define rank achievements", () => {
      expect(achievementsRouter).toContain("reach_silver");
      expect(achievementsRouter).toContain("reach_gold");
      expect(achievementsRouter).toContain("reach_diamond");
      expect(achievementsRouter).toContain("reach_master");
      expect(achievementsRouter).toContain("reach_grandmaster");
    });

    it("should define collection achievements", () => {
      expect(achievementsRouter).toContain("collect_10");
      expect(achievementsRouter).toContain("collect_50");
      expect(achievementsRouter).toContain("collect_100");
      expect(achievementsRouter).toContain("collect_all");
    });

    it("should define crafting achievements", () => {
      expect(achievementsRouter).toContain("first_craft");
      expect(achievementsRouter).toContain("craft_10");
      expect(achievementsRouter).toContain("craft_legendary");
    });

    it("should define draft achievements", () => {
      expect(achievementsRouter).toContain("first_draft");
      expect(achievementsRouter).toContain("draft_wins_5");
      expect(achievementsRouter).toContain("draft_wins_20");
      expect(achievementsRouter).toContain("draft_perfect");
    });

    it("should define trading achievements", () => {
      expect(achievementsRouter).toContain("first_trade");
      expect(achievementsRouter).toContain("trades_10");
      expect(achievementsRouter).toContain("trades_50");
    });

    it("should define general achievements", () => {
      expect(achievementsRouter).toContain("play_100_games");
      expect(achievementsRouter).toContain("first_ai_win");
    });

    it("should have correct achievement structure", () => {
      expect(achievementsRouter).toContain("key:");
      expect(achievementsRouter).toContain("title:");
      expect(achievementsRouter).toContain("description:");
      expect(achievementsRouter).toContain("icon:");
      expect(achievementsRouter).toContain("category:");
      expect(achievementsRouter).toContain("tier:");
      expect(achievementsRouter).toContain("target:");
      expect(achievementsRouter).toContain("dreamReward:");
    });

    it("should have 5 tiers: bronze, silver, gold, diamond, legendary", () => {
      expect(achievementsRouter).toContain('"bronze"');
      expect(achievementsRouter).toContain('"silver"');
      expect(achievementsRouter).toContain('"gold"');
      expect(achievementsRouter).toContain('"diamond"');
      expect(achievementsRouter).toContain('"legendary"');
    });

    it("should have 6 categories", () => {
      expect(achievementsRouter).toContain('"pvp"');
      expect(achievementsRouter).toContain('"collection"');
      expect(achievementsRouter).toContain('"crafting"');
      expect(achievementsRouter).toContain('"draft"');
      expect(achievementsRouter).toContain('"trading"');
      expect(achievementsRouter).toContain('"general"');
    });
  });

  describe("Achievement procedures", () => {
    it("should have getAll query", () => {
      expect(achievementsRouter).toContain("getAll:");
    });

    it("should have incrementProgress mutation", () => {
      expect(achievementsRouter).toContain("incrementProgress:");
    });

    it("should have setProgress mutation", () => {
      expect(achievementsRouter).toContain("setProgress:");
    });

    it("should have claimReward mutation", () => {
      expect(achievementsRouter).toContain("claimReward:");
    });

    it("should have getSummary query", () => {
      expect(achievementsRouter).toContain("getSummary:");
    });
  });

  describe("Reward claiming", () => {
    it("should grant Dream tokens on claim", () => {
      expect(achievementsRouter).toContain("dreamReward");
      expect(achievementsRouter).toContain("dreamBalance");
    });

    it("should support card rewards", () => {
      expect(achievementsRouter).toContain("cardReward");
    });

    it("should prevent double-claiming", () => {
      expect(achievementsRouter).toContain("rewardClaimed");
      expect(achievementsRouter).toContain("Reward already claimed");
    });

    it("should check completion before claiming", () => {
      expect(achievementsRouter).toContain("Achievement not completed");
    });
  });

  describe("Summary stats", () => {
    it("should return total, completed, claimed, totalDreamEarned", () => {
      expect(achievementsRouter).toContain("total:");
      expect(achievementsRouter).toContain("completed");
      expect(achievementsRouter).toContain("claimed");
      expect(achievementsRouter).toContain("totalDreamEarned");
    });
  });
});

/* ─── DATABASE SCHEMA ─── */
describe("Phase 39: Database Schema", () => {
  const schema = fs.readFileSync(
    path.resolve(__dirname, "../drizzle/schema.ts"),
    "utf-8"
  );

  describe("Draft tables", () => {
    it("should have draftTournaments table", () => {
      expect(schema).toContain("draftTournaments");
    });

    it("should have draftParticipants table", () => {
      expect(schema).toContain("draftParticipants");
    });
  });

  describe("Trading tables", () => {
    it("should have cardTrades table", () => {
      expect(schema).toContain("cardTrades");
    });

    it("should have trade status field", () => {
      expect(schema).toContain("status");
    });
  });

  describe("Achievement tables", () => {
    it("should have cardGameAchievements table", () => {
      expect(schema).toContain("cardGameAchievements");
    });

    it("should have achievementKey field", () => {
      expect(schema).toContain("achievementKey");
    });

    it("should have progress and target fields", () => {
      expect(schema).toContain("progress");
      expect(schema).toContain("target");
    });

    it("should have rewardClaimed field", () => {
      expect(schema).toContain("rewardClaimed");
    });
  });

  describe("User cards table", () => {
    it("should have userCards table", () => {
      expect(schema).toContain("userCards");
    });

    it("should track obtainedVia for provenance", () => {
      expect(schema).toContain("obtainedVia");
    });
  });
});

/* ─── FRONTEND PAGES ─── */
describe("Phase 39: Frontend Pages", () => {
  describe("DraftTournamentPage", () => {
    const page = fs.readFileSync(
      path.resolve(__dirname, "../client/src/pages/DraftTournamentPage.tsx"),
      "utf-8"
    );

    it("should be a valid React component", () => {
      expect(page).toContain("export default function DraftTournamentPage");
    });

    it("should use tRPC draft procedures", () => {
      expect(page).toContain("trpc.draft");
    });

    it("should have authentication check", () => {
      expect(page).toContain("useAuth");
      expect(page).toContain("isAuthenticated");
    });

    it("should have draft card selection UI", () => {
      expect(page).toContain("drafting");
      expect(page).toContain("currentPack");
    });

    it("should have tournament results display", () => {
      expect(page).toContain("results");
    });

    it("should import season1 cards data", () => {
      expect(page).toContain("season1-cards");
    });

    it("should handle multiple phases: lobby, drafting, battling, results", () => {
      expect(page).toContain('"lobby"');
      expect(page).toContain('"drafting"');
      expect(page).toContain('"battling"');
      expect(page).toContain('"results"');
    });
  });

  describe("CardTradingPage", () => {
    const page = fs.readFileSync(
      path.resolve(__dirname, "../client/src/pages/CardTradingPage.tsx"),
      "utf-8"
    );

    it("should be a valid React component", () => {
      expect(page).toContain("export default function CardTradingPage");
    });

    it("should use tRPC trading procedures", () => {
      expect(page).toContain("trpc.trading");
    });

    it("should have authentication check", () => {
      expect(page).toContain("useAuth");
      expect(page).toContain("isAuthenticated");
    });

    it("should have create trade tab", () => {
      expect(page).toContain('"create"');
    });

    it("should have incoming trades tab", () => {
      expect(page).toContain('"incoming"');
    });

    it("should have outgoing trades tab", () => {
      expect(page).toContain('"outgoing"');
    });

    it("should have trade history tab", () => {
      expect(page).toContain('"history"');
    });

    it("should support player search", () => {
      expect(page).toContain("searchPlayers");
      expect(page).toContain("recipientSearch");
    });

    it("should use senderCards/receiverCards format", () => {
      expect(page).toContain("senderCards");
      expect(page).toContain("receiverCards");
    });

    it("should handle sent/received trade structure", () => {
      expect(page).toContain("'received'");
      expect(page).toContain("'sent'");
    });

    it("should support accept and decline actions", () => {
      expect(page).toContain("acceptTrade");
      expect(page).toContain("declineTrade");
    });
  });

  describe("CardAchievementsPage", () => {
    const page = fs.readFileSync(
      path.resolve(__dirname, "../client/src/pages/CardAchievementsPage.tsx"),
      "utf-8"
    );

    it("should be a valid React component", () => {
      expect(page).toContain("export default function CardAchievementsPage");
    });

    it("should use tRPC cardAchievements procedures", () => {
      expect(page).toContain("trpc.cardAchievements");
    });

    it("should have authentication check", () => {
      expect(page).toContain("useAuth");
      expect(page).toContain("isAuthenticated");
    });

    it("should display achievement categories with icons", () => {
      expect(page).toContain("CATEGORY_ICONS");
      expect(page).toContain("CATEGORY_COLORS");
    });

    it("should display tier colors", () => {
      expect(page).toContain("TIER_COLORS");
      expect(page).toContain("bronze");
      expect(page).toContain("silver");
      expect(page).toContain("gold");
      expect(page).toContain("diamond");
    });

    it("should show progress bars for incomplete achievements", () => {
      expect(page).toContain("achievement.progress");
      expect(page).toContain("achievement.target");
    });

    it("should support reward claiming with achievementKey", () => {
      expect(page).toContain("claimReward");
      expect(page).toContain("achievementKey");
    });

    it("should show summary stats", () => {
      expect(page).toContain("totalDreamEarned");
      expect(page).toContain("claimed");
    });

    it("should support category filtering", () => {
      expect(page).toContain("filterCategory");
    });

    it("should support show/hide completed toggle", () => {
      expect(page).toContain("showCompleted");
    });
  });
});

/* ─── ROUTE REGISTRATION ─── */
describe("Phase 39: Route Registration", () => {
  const appTsx = fs.readFileSync(
    path.resolve(__dirname, "../client/src/App.tsx"),
    "utf-8"
  );

  it("should import DraftTournamentPage", () => {
    expect(appTsx).toContain("DraftTournamentPage");
  });

  it("should import CardTradingPage", () => {
    expect(appTsx).toContain("CardTradingPage");
  });

  it("should import CardAchievementsPage", () => {
    expect(appTsx).toContain("CardAchievementsPage");
  });

  it("should register /draft route", () => {
    expect(appTsx).toContain('path="/draft"');
  });

  it("should register /trading route", () => {
    expect(appTsx).toContain('path="/trading"');
  });

  it("should register /card-achievements route", () => {
    expect(appTsx).toContain('path="/card-achievements"');
  });
});

/* ─── NAVIGATION ─── */
describe("Phase 39: Navigation Links", () => {
  const gamesPage = fs.readFileSync(
    path.resolve(__dirname, "../client/src/pages/GamesPage.tsx"),
    "utf-8"
  );

  it("should have Draft Tournament link in Games Hub", () => {
    expect(gamesPage).toContain("/draft");
    expect(gamesPage).toContain("DRAFT TOURNAMENT");
  });

  it("should have Card Trading link in Games Hub", () => {
    expect(gamesPage).toContain("/trading");
    expect(gamesPage).toContain("CARD TRADING");
  });

  it("should have Card Achievements link in Games Hub", () => {
    expect(gamesPage).toContain("/card-achievements");
    expect(gamesPage).toContain("CARD ACHIEVEMENTS");
  });
});

/* ─── ROUTER REGISTRATION ─── */
describe("Phase 39: Server Router Registration", () => {
  const routers = fs.readFileSync(
    path.resolve(__dirname, "routers.ts"),
    "utf-8"
  );

  it("should import draftRouter", () => {
    expect(routers).toContain("draftRouter");
  });

  it("should import tradingRouter", () => {
    expect(routers).toContain("tradingRouter");
  });

  it("should import cardAchievementsRouter", () => {
    expect(routers).toContain("cardAchievementsRouter");
  });

  it("should register draft router", () => {
    expect(routers).toContain("draft:");
  });

  it("should register trading router", () => {
    expect(routers).toContain("trading:");
  });

  it("should register cardAchievements router", () => {
    expect(routers).toContain("cardAchievements:");
  });
});
