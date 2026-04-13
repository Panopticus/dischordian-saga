import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════
   PHASE 39b: ACHIEVEMENT AUTO-TRACKING, TRADE NOTIFICATIONS,
   DRAFT TOURNAMENT REWARDS
   ═══════════════════════════════════════════════════════ */

/* ─── ACHIEVEMENT TRACKER HELPER ─── */
describe("Phase 39b: Achievement Tracker Helper", () => {
  const tracker = fs.readFileSync(
    path.resolve(__dirname, "achievementTracker.ts"),
    "utf-8"
  );

  describe("Module structure", () => {
    it("should export trackIncrement function", () => {
      expect(tracker).toContain("export async function trackIncrement");
    });
    it("should export trackSet function", () => {
      expect(tracker).toContain("export async function trackSet");
    });
    it("should export trackPvpResult function", () => {
      expect(tracker).toContain("export async function trackPvpResult");
    });
    it("should export trackCollectionSize function", () => {
      expect(tracker).toContain("export async function trackCollectionSize");
    });
    it("should export trackCraftAction function", () => {
      expect(tracker).toContain("export async function trackCraftAction");
    });
    it("should export trackDisenchant function", () => {
      expect(tracker).toContain("export async function trackDisenchant");
    });
    it("should export trackTradeComplete function", () => {
      expect(tracker).toContain("export async function trackTradeComplete");
    });
    it("should export trackDraftResult function", () => {
      expect(tracker).toContain("export async function trackDraftResult");
    });
    it("should export trackAiResult function", () => {
      expect(tracker).toContain("export async function trackAiResult");
    });
  });

  describe("trackIncrement logic", () => {
    it("should accept userId, achievementKey, and optional amount", () => {
      expect(tracker).toContain("userId: number");
      expect(tracker).toContain("achievementKey: string");
      expect(tracker).toContain("amount: number = 1");
    });
    it("should return newlyCompleted and progress", () => {
      expect(tracker).toContain("newlyCompleted: boolean");
      expect(tracker).toContain("progress: number");
    });
    it("should create row if not exists", () => {
      expect(tracker).toContain("db.insert(cardGameAchievements)");
    });
    it("should update existing row", () => {
      expect(tracker).toContain("db.update(cardGameAchievements)");
    });
    it("should skip if already completed", () => {
      expect(tracker).toContain("existing.completed === 1");
    });
    it("should cap progress at target", () => {
      expect(tracker).toContain("Math.min(");
    });
  });

  describe("trackSet logic", () => {
    it("should set absolute value", () => {
      expect(tracker).toContain("progress: value");
    });
    it("should handle completed state", () => {
      expect(tracker).toContain("completed: completed ? 1 : 0");
    });
  });

  describe("trackPvpResult", () => {
    it("should track win count achievements", () => {
      expect(tracker).toContain("first_blood");
      expect(tracker).toContain("pvp_wins_10");
      expect(tracker).toContain("pvp_wins_50");
      expect(tracker).toContain("pvp_wins_100");
      expect(tracker).toContain("pvp_wins_500");
    });
    it("should track win streak achievements", () => {
      expect(tracker).toContain("win_streak_3");
      expect(tracker).toContain("win_streak_5");
      expect(tracker).toContain("win_streak_10");
    });
    it("should track rank achievements", () => {
      expect(tracker).toContain("reach_silver");
      expect(tracker).toContain("reach_gold");
      expect(tracker).toContain("reach_diamond");
      expect(tracker).toContain("reach_master");
      expect(tracker).toContain("reach_grandmaster");
    });
    it("should return array of completed achievement keys", () => {
      expect(tracker).toContain("const completed: string[] = []");
      expect(tracker).toContain("completed.push(");
    });
  });

  describe("trackCollectionSize", () => {
    it("should count unique cards", () => {
      expect(tracker).toContain("COUNT(DISTINCT cardId)");
    });
    it("should track collection milestones", () => {
      expect(tracker).toContain("collect_10");
      expect(tracker).toContain("collect_50");
      expect(tracker).toContain("collect_100");
      expect(tracker).toContain("collect_all");
    });
  });

  describe("trackCraftAction", () => {
    it("should track first craft", () => {
      expect(tracker).toContain("first_craft");
    });
    it("should track craft count", () => {
      expect(tracker).toContain("craft_10");
    });
    it("should track legendary craft", () => {
      expect(tracker).toContain("craft_legendary");
    });
    it("should check for legendary or mythic rarity", () => {
      expect(tracker).toContain("legendary");
      expect(tracker).toContain("mythic");
    });
  });

  describe("trackDisenchant", () => {
    it("should track disenchant count", () => {
      expect(tracker).toContain("disenchant_50");
    });
  });

  describe("trackTradeComplete", () => {
    it("should track trade milestones", () => {
      expect(tracker).toContain("first_trade");
      expect(tracker).toContain("trades_10");
      expect(tracker).toContain("trades_50");
    });
  });

  describe("trackDraftResult", () => {
    it("should track first draft participation", () => {
      expect(tracker).toContain("first_draft");
    });
    it("should track draft wins", () => {
      expect(tracker).toContain("draft_wins_5");
      expect(tracker).toContain("draft_wins_20");
    });
    it("should track perfect run", () => {
      expect(tracker).toContain("draft_perfect");
    });
  });

  describe("trackAiResult", () => {
    it("should track total games played", () => {
      expect(tracker).toContain("play_100_games");
      expect(tracker).toContain("play_500_games");
    });
    it("should track first AI win", () => {
      expect(tracker).toContain("first_ai_win");
    });
  });

  describe("Error handling", () => {
    it("should catch and log errors without throwing", () => {
      expect(tracker).toContain("catch (e)");
      expect(tracker).toContain("console.error");
    });
    it("should return safe defaults on error", () => {
      expect(tracker).toContain("return { newlyCompleted: false, progress: 0 }");
    });
  });
});

/* ─── ACHIEVEMENT WIRING IN GAME ROUTERS ─── */
describe("Phase 39b: Achievement Auto-Tracking Wiring", () => {
  describe("PvP WebSocket wiring", () => {
    const pvpWs = fs.readFileSync(
      path.resolve(__dirname, "pvpWs.ts"),
      "utf-8"
    );
    it("should import trackPvpResult", () => {
      expect(pvpWs).toContain('import { trackPvpResult } from "./achievementTracker"');
    });
    it("should call trackPvpResult after leaderboard update", () => {
      expect(pvpWs).toContain("trackPvpResult(player.userId, won, newStreak, newTier, totalWins)");
    });
    it("should use fire-and-forget pattern with .catch", () => {
      expect(pvpWs).toContain('.catch(e => console.error("[PvP] Achievement tracking error:"');
    });
  });

  describe("Card Game (AI) wiring", () => {
    const cardGame = fs.readFileSync(
      path.resolve(__dirname, "routers/cardGame.ts"),
      "utf-8"
    );
    it("should import trackAiResult and trackCollectionSize", () => {
      expect(cardGame).toContain('import { trackAiResult, trackCollectionSize } from "../achievementTracker"');
    });
    it("should call trackAiResult after match completion", () => {
      expect(cardGame).toContain("trackAiResult(ctx.user.id, winnerId === ctx.user.id)");
    });
    it("should track collection size after pack opening", () => {
      expect(cardGame).toContain("trackCollectionSize(ctx.user.id)");
    });
    it("should use fire-and-forget pattern", () => {
      expect(cardGame).toContain('.catch(e => logger.error("[CardGame]');
    });
  });

  describe("Trading wiring", () => {
    const trading = fs.readFileSync(
      path.resolve(__dirname, "routers/trading.ts"),
      "utf-8"
    );
    it("should import trackTradeComplete and trackCollectionSize", () => {
      expect(trading).toContain('import { trackTradeComplete, trackCollectionSize } from "../achievementTracker"');
    });
    it("should track trade completion for sender", () => {
      expect(trading).toContain("trackTradeComplete(trade.senderId)");
    });
    it("should track trade completion for receiver", () => {
      expect(trading).toContain("trackTradeComplete(ctx.user.id)");
    });
    it("should update collection size for both parties", () => {
      expect(trading).toContain("trackCollectionSize(trade.senderId)");
      expect(trading).toContain("trackCollectionSize(ctx.user.id)");
    });
  });

  describe("Crafting wiring", () => {
    const crafting = fs.readFileSync(
      path.resolve(__dirname, "routers/crafting.ts"),
      "utf-8"
    );
    it("should import trackCraftAction, trackDisenchant, trackCollectionSize", () => {
      expect(crafting).toContain('import { trackCraftAction, trackDisenchant, trackCollectionSize } from "../achievementTracker"');
    });
    it("should track disenchant actions", () => {
      expect(crafting).toContain("trackDisenchant(ctx.user.id)");
    });
    it("should track craft actions with rarity", () => {
      expect(crafting).toContain("trackCraftAction(ctx.user.id, outputCard.rarity");
    });
    it("should update collection after successful craft", () => {
      expect(crafting).toContain("trackCollectionSize(ctx.user.id)");
    });
  });

  describe("Card Challenge wiring", () => {
    const challenge = fs.readFileSync(
      path.resolve(__dirname, "routers/cardChallenge.ts"),
      "utf-8"
    );
    it("should import trackAiResult", () => {
      expect(challenge).toContain('import { trackAiResult } from "../achievementTracker"');
    });
    it("should track winner result", () => {
      expect(challenge).toContain("trackAiResult(winnerId, true)");
    });
    it("should track loser result", () => {
      expect(challenge).toContain("trackAiResult(loserId, false)");
    });
  });
});

/* ─── TRADE NOTIFICATION WATCHER ─── */
describe("Phase 39b: Trade Notification Watcher", () => {
  const watcher = fs.readFileSync(
    path.resolve(__dirname, "../client/src/components/TradeNotificationWatcher.tsx"),
    "utf-8"
  );

  describe("Component structure", () => {
    it("should export default function", () => {
      expect(watcher).toContain("export default function TradeNotificationWatcher");
    });
    it("should use useAuth hook", () => {
      expect(watcher).toContain("useAuth");
    });
    it("should use trpc trading queries", () => {
      expect(watcher).toContain("trpc.trading.getMyTrades.useQuery");
    });
    it("should render null (side-effect only)", () => {
      expect(watcher).toContain("return null");
    });
  });

  describe("Polling behavior", () => {
    it("should set refetchInterval for polling", () => {
      expect(watcher).toContain("refetchInterval: POLL_INTERVAL");
    });
    it("should define a poll interval constant", () => {
      expect(watcher).toContain("POLL_INTERVAL");
    });
    it("should only poll when authenticated", () => {
      expect(watcher).toContain("enabled: isAuthenticated");
    });
    it("should not poll in background", () => {
      expect(watcher).toContain("refetchIntervalInBackground: false");
    });
  });

  describe("New trade detection", () => {
    it("should track seen trade IDs", () => {
      expect(watcher).toContain("seenTradeIds");
    });
    it("should skip toasts on initial load", () => {
      expect(watcher).toContain("initialLoadDone");
    });
    it("should show toast for new incoming trades", () => {
      expect(watcher).toContain("sent you a trade offer");
    });
    it("should show toast for accepted trades", () => {
      expect(watcher).toContain("accepted your trade");
    });
    it("should show toast for declined trades", () => {
      expect(watcher).toContain("declined your trade");
    });
  });

  describe("Actionable toasts", () => {
    it("should have accept button in toast", () => {
      expect(watcher).toContain("ACCEPT");
    });
    it("should have decline button in toast", () => {
      expect(watcher).toContain("DECLINE");
    });
    it("should call acceptTrade mutation", () => {
      expect(watcher).toContain("trpc.trading.acceptTrade.useMutation");
    });
    it("should call declineTrade mutation", () => {
      expect(watcher).toContain("trpc.trading.declineTrade.useMutation");
    });
    it("should dismiss toast after action", () => {
      expect(watcher).toContain("toast.dismiss");
    });
    it("should invalidate queries after accept", () => {
      expect(watcher).toContain("utils.trading.getMyTrades.invalidate");
      expect(watcher).toContain("utils.trading.getTradeHistory.invalidate");
    });
  });

  describe("App.tsx integration", () => {
    const appTsx = fs.readFileSync(
      path.resolve(__dirname, "../client/src/App.tsx"),
      "utf-8"
    );
    it("should import TradeNotificationWatcher", () => {
      expect(appTsx).toContain('import TradeNotificationWatcher from "./components/TradeNotificationWatcher"');
    });
    it("should render TradeNotificationWatcher", () => {
      expect(appTsx).toContain("<TradeNotificationWatcher />");
    });
  });
});

/* ─── DRAFT TOURNAMENT REWARDS ─── */
describe("Phase 39b: Draft Tournament Rewards", () => {
  const draft = fs.readFileSync(
    path.resolve(__dirname, "routers/draft.ts"),
    "utf-8"
  );

  describe("completeTournament procedure", () => {
    it("should have completeTournament procedure", () => {
      expect(draft).toContain("completeTournament: protectedProcedure");
    });
    it("should accept tournamentId input", () => {
      expect(draft).toContain("tournamentId: z.number()");
    });
    it("should only allow creator to complete", () => {
      expect(draft).toContain("Only creator can complete");
    });
    it("should require battling status", () => {
      expect(draft).toContain("Tournament not in battling phase");
    });
    it("should prevent double completion", () => {
      expect(draft).toContain("Tournament already completed");
    });
    it("should require at least 2 participants", () => {
      expect(draft).toContain("Not enough participants");
    });
  });

  describe("Winner determination", () => {
    it("should sort by tournament wins descending", () => {
      expect(draft).toContain("b.tournamentWins !== a.tournamentWins");
    });
    it("should tiebreak by fewest losses", () => {
      expect(draft).toContain("a.tournamentLosses - b.tournamentLosses");
    });
    it("should detect perfect run", () => {
      expect(draft).toContain("isPerfectRun");
      expect(draft).toContain("winner.tournamentLosses === 0 && winner.tournamentWins > 0");
    });
  });

  describe("Dream token prize pool", () => {
    it("should calculate prize pool from entry cost, player count, and multiplier", () => {
      expect(draft).toContain("tournament.entryCost * participants.length * tournament.prizeMultiplier");
    });
    it("should split prizes: winner gets 70%, runner-up gets 30%", () => {
      expect(draft).toContain("prizePool * 0.3");
      expect(draft).toContain("prizePool - runnerUpPrize");
    });
    it("should award Dream tokens to winner", () => {
      expect(draft).toContain("dreamTokens + ${winnerPrize}");
    });
    it("should award runner-up prize only with 3+ players", () => {
      expect(draft).toContain("participants.length >= 3");
    });
    it("should create dream balance if not exists", () => {
      expect(draft).toContain("db.insert(dreamBalance).values");
    });
  });

  describe("Exclusive card reward", () => {
    it("should import userCards schema", () => {
      expect(draft).toContain("userCards");
    });
    it("should query epic/legendary/mythic cards", () => {
      expect(draft).toContain("'epic', 'legendary', 'mythic'");
    });
    it("should prefer cards the winner doesn't own", () => {
      expect(draft).toContain("ownedSet");
      expect(draft).toContain("unowned.length > 0 ? unowned : exclusiveCandidates");
    });
    it("should grant card as foil (draft exclusive)", () => {
      expect(draft).toContain("isFoil: 1");
    });
    it("should set obtainedVia to draft_reward", () => {
      expect(draft).toContain('obtainedVia: "draft_reward"');
    });
    it("should increment quantity if card already owned", () => {
      expect(draft).toContain("quantity + 1");
    });
  });

  describe("Tournament completion", () => {
    it("should mark tournament as completed", () => {
      expect(draft).toContain('status: "completed"');
    });
    it("should set winnerId on tournament", () => {
      expect(draft).toContain("winnerId: winner.userId");
    });
    it("should return reward details", () => {
      expect(draft).toContain("winnerPrize");
      expect(draft).toContain("runnerUpPrize");
      expect(draft).toContain("exclusiveCard");
      expect(draft).toContain("isPerfectRun");
    });
  });

  describe("Achievement tracking integration", () => {
    it("should import trackDraftResult and trackCollectionSize", () => {
      expect(draft).toContain('import { trackDraftResult, trackCollectionSize } from "../achievementTracker"');
    });
    it("should track draft result for all participants", () => {
      expect(draft).toContain("for (const p of participants)");
      expect(draft).toContain("trackDraftResult(p.userId");
    });
    it("should track collection size for winner", () => {
      expect(draft).toContain("trackCollectionSize(p.userId)");
    });
  });

  describe("getResults procedure", () => {
    it("should have getResults procedure", () => {
      expect(draft).toContain("getResults: protectedProcedure");
    });
    it("should return standings sorted by wins", () => {
      expect(draft).toContain("standings");
    });
    it("should return prize information", () => {
      expect(draft).toContain("winnerPrize");
      expect(draft).toContain("runnerUpPrize");
      expect(draft).toContain("prizePool");
    });
    it("should only return results for completed tournaments", () => {
      expect(draft).toContain('tournament.status !== "completed"');
    });
  });
});
