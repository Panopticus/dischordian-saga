/* ═══════════════════════════════════════════════════════
   DEGEN'S CASINO — tRPC router (server-authoritative)

   Every game resolves on the server using shared
   deterministic logic from @shared/casinoGames. Clients
   send a bet + game-specific choice; the server:

     1. Validates the bet against GAME_LIMITS and daily cap
     2. Deducts Dream from dreamBalance
     3. Runs the seeded RNG and resolves the outcome
     4. Applies VIP bonus, updates streak/favor, awards payout
     5. Persists the result to casino_results for audit
     6. Returns the game result + updated state snapshot
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb, type DrizzleDb } from "../db";
import { checkFeatureFlag } from "../middleware/featureFlag";
import {
  casinoState, casinoResults, casinoJackpotPool, dreamBalance, userAchievements,
  warTerritories, warSeasons, notifications,
} from "../../db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

/** Broad db-ish handle — accepts either the top-level DrizzleDb or a
 *  transaction handle from `db.transaction(async tx => ...)`. Drizzle
 *  v0.40+ types these distinctly even though both expose the same
 *  query surface we use. */
type DbLike = DrizzleDb | Parameters<Parameters<DrizzleDb["transaction"]>[0]>[0];
import {
  createRng, randomSeed,
  playVoidSlots, playEntropyDice, playNebulaPoker, playQuantumRoulette,
  playPazaak21, playHighLow, playScratchCard, playLiarsDice, playDreamRoulette,
  playCardBattlersGauntlet, playFactionWarBet, playVoidBingo, playVoidCase,
  scoreMahjongRun,
  validateBet, vipLevelFor, vipWinBonus, MAX_DAILY_WAGER,
  ROULETTE_FACTIONS, GAME_LIMITS, splitJackpotPool, rewardsForAchievement,
  type RouletteFaction,
} from "../../shared/casinoGames";

type PlayableGame =
  | "void_slots" | "entropy_dice" | "nebula_poker" | "quantum_roulette"
  | "pazaak_21" | "high_low" | "scratch_cards"
  | "void_blackjack_tournament" | "liars_dice" | "faction_war_betting"
  | "dream_roulette" | "card_battlers_gauntlet" | "void_bingo"
  | "void_cases" | "dischordian_mahjong";

/** Partial casino state shape used for achievement evaluation. */
interface CasinoEvalState {
  totalWagered: number;
  totalWon: number;
  currentStreak: number;
  bestStreak: number;
  totalBetsPlaced: number;
  gamesPlayed: Record<string, number>;
  gamesWon: Record<string, number>;
  consecutiveFactionWins: number;
  consecutiveGauntletWins: number;
  degenFavor: number;
  collectedTales: string[];
}

/** The 12 Degen's Tales — kept server-side so that the tale_collector
 *  achievement can be trusted. Ids mirror the client's DEGEN_TALES. */
const DEGEN_TALE_IDS = [
  "tale_senator", "tale_general", "tale_archon", "tale_drone", "tale_even_odds",
  "tale_politician", "tale_iron_lion", "tale_child", "tale_assassin",
  "tale_programmer", "tale_elara", "tale_necromancer",
] as const;

/** 5% chance per game to drop a tale, bumped to 10% once the player
 *  passes Degen Favor 25. Pure function — the caller owns the RNG via
 *  Math.random since tales are flavor, not audit-critical. */
function maybeRollTale(degenFavor: number, collectedTales: string[]): { id: string } | null {
  const dropRate = degenFavor >= 25 ? 0.10 : 0.05;
  if (Math.random() > dropRate) return null;
  const uncollected = DEGEN_TALE_IDS.filter(t => !collectedTales.includes(t));
  if (uncollected.length === 0) return null;
  const id = uncollected[Math.floor(Math.random() * uncollected.length)];
  return { id };
}

/** Returns the ids of newly earned achievements for this turn. The
 *  caller is responsible for persisting them — this helper is pure
 *  so it can be unit-tested in isolation. */
export function evaluateCasinoAchievements(args: {
  game: PlayableGame;
  bet: number;
  result: { won: boolean; payout: number; jackpot: boolean; detail: Record<string, unknown> };
  state: CasinoEvalState;
  previousBestStreak: number;
  previousTotalWon: number;
  previousTotalWagered: number;
  previousVipLevel: number;
  vipLevel: number;
}): string[] {
  const { game, bet, result, state, previousBestStreak, previousTotalWon, previousTotalWagered, previousVipLevel, vipLevel } = args;
  const earned: string[] = [];

  // first_bet — the first win the player has ever had
  if (result.won && previousTotalWon === 0 && result.payout > 0) {
    earned.push("first_bet");
  }

  // high_roller — cumulative 1000 Dream wagered (crossed this turn)
  if (previousTotalWagered < 1000 && state.totalWagered >= 1000) {
    earned.push("high_roller");
  }

  // jackpot — any jackpot hit
  if (result.jackpot) earned.push("jackpot");

  // streak_5 — win streak of 5+
  if (state.currentStreak >= 5 && previousBestStreak < 5) {
    earned.push("streak_5");
  }

  // degens_chosen — win streak of 10+
  if (state.currentStreak >= 10 && previousBestStreak < 10) {
    earned.push("degens_chosen");
  }

  // all_games — played every one of the 15 games
  const distinctGamesPlayed = Object.keys(state.gamesPlayed ?? {}).length;
  if (distinctGamesPlayed >= 15) earned.push("all_games");

  // poker_flush — flush or better in Nebula Poker
  if (game === "nebula_poker") {
    const hand = (result.detail as { handType?: string }).handType;
    if (hand === "flush" || hand === "full_house" || hand === "four_of_a_kind" || hand === "straight_flush") {
      earned.push("poker_flush");
    }
    if (hand === "royal_flush") earned.push("royal_flush");
  }

  // perfect_21 — reach exactly 21 on a Pazaak hand
  if (game === "pazaak_21") {
    const player = (result.detail as { player?: number }).player;
    if (player === 21) earned.push("perfect_21");
  }

  // chain_10 — chain 10 correct in High/Low
  if (game === "high_low") {
    const chain = (result.detail as { chain?: number }).chain ?? 0;
    if (chain >= 10) earned.push("chain_10");
  }

  // vip_3 — reached VIP level 3 on this turn
  if (previousVipLevel < 3 && vipLevel >= 3) earned.push("vip_3");
  // whale — reached VIP level 5 on this turn
  if (previousVipLevel < 5 && vipLevel >= 5) earned.push("whale");

  // all_in — bet the max on any game
  const limits = GAME_LIMITS[game];
  if (limits && bet > 0 && bet === limits.max) earned.push("all_in");

  // house_loses — crossed 10,000 Dream lifetime winnings
  if (previousTotalWon < 10000 && state.totalWon >= 10000) earned.push("house_loses");

  // breaking_even — exactly 0 net across 1000+ bets
  if (
    state.totalBetsPlaced >= 1000 &&
    state.totalWon === state.totalWagered
  ) {
    earned.push("breaking_even");
  }

  // liars_champion — 10 Liar's Dice wins
  if (game === "liars_dice" && result.won) {
    const wins = (state.gamesWon ?? {})["liars_dice"] ?? 0;
    if (wins >= 10) earned.push("liars_champion");
  }

  // tournament_winner — any Void Blackjack Tournament win
  if (game === "void_blackjack_tournament" && result.won) {
    earned.push("tournament_winner");
  }

  // bingo_caller — any Void Bingo session win
  if (game === "void_bingo" && result.won) {
    earned.push("bingo_caller");
  }

  // dream_survivor — surviving all 6 rounds of Dream Roulette
  if (game === "dream_roulette" && result.won) {
    earned.push("dream_survivor");
  }

  // scratched_cursed — revealing the curse on a scratch card
  if (game === "scratch_cards") {
    const cursed = (result.detail as { curseRevealed?: boolean }).curseRevealed;
    if (cursed) earned.push("scratched_cursed");
  }

  // lucky_7 — exact 7 in Entropy Dice
  if (game === "entropy_dice") {
    const detail = result.detail as { total?: number; prediction?: string };
    if (detail.total === 7 && detail.prediction === "exact") earned.push("lucky_7");
  }

  // faction_prophet — 5 Faction War bets won in a row
  if (game === "faction_war_betting" && state.consecutiveFactionWins >= 5) {
    earned.push("faction_prophet");
  }

  // gauntlet_master — 3 Card Battler's Gauntlets in a row
  if (game === "card_battlers_gauntlet" && state.consecutiveGauntletWins >= 3) {
    earned.push("gauntlet_master");
  }

  // tale_collector — collected all 12 Degen's Tales
  if (state.collectedTales.length >= 12) {
    earned.push("tale_collector");
  }

  // degen_favor_max — reached Degen Favor 100
  if (state.degenFavor >= 100) {
    earned.push("degen_favor_max");
  }

  return earned;
}

/** ─── Faction War odds lookup ───
 *  Computes the implied odds for each betting market from the
 *  current state of the faction war tables. This is the
 *  server-authoritative source of truth — the client can no
 *  longer smuggle its own odds in. */
async function computeFactionWarOdds(db: DbLike): Promise<Record<string, number>> {
  const territories = await db.select().from(warTerritories);
  const [season] = await db.select().from(warSeasons).where(eq(warSeasons.endedAt, sql`NULL`)).limit(1);
  const total = territories.length || 1;
  const empireHeld = territories.filter(t => t.faction === "empire").length;
  const insurgencyHeld = territories.filter(t => t.faction === "insurgency").length;
  const empireRatio = empireHeld / total;
  const insurgencyRatio = insurgencyHeld / total;
  // Implied probability → odds, inverted and shifted slightly to keep a
  // house edge around 8%. Odds are clamped to [1.15, 20.0].
  const clamp = (n: number) => Math.max(1.15, Math.min(20.0, n));
  const baseOdds = (p: number) => clamp(1 / Math.max(0.05, p * 0.92));

  // Fallback to the seasonal defaults if no war season is active.
  if (!season) {
    return {
      insurgency_weekly: 2.5,
      architect_weekly: 1.8,
      necromancer_event: 8.0,
      alliance_war_outcome: 3.0,
      new_babylon_trade: 3.2,
      thought_virus_spread: 5.0,
    };
  }

  return {
    insurgency_weekly: baseOdds(insurgencyRatio + 0.3),
    architect_weekly: baseOdds(empireRatio + 0.3),
    necromancer_event: 8.0,
    alliance_war_outcome: baseOdds(0.5),
    new_babylon_trade: 3.2,
    thought_virus_spread: 5.0,
  };
}

/** Convert the Date → YYYY-MM-DD so we can reset daily counters. */
function todayString(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

/** Fetch-or-create the casino state row for a user. */
async function ensureCasinoState(db: DbLike, userId: number) {
  const [existing] = await db
    .select()
    .from(casinoState)
    .where(eq(casinoState.userId, userId))
    .limit(1);
  if (existing) {
    // Reset daily counters on date roll
    const today = todayString();
    if (existing.dailyCounterDate !== today) {
      await db
        .update(casinoState)
        .set({ dailyWagered: 0, dailyCounterDate: today, freeSpinsLeft: 3 })
        .where(eq(casinoState.userId, userId));
      return { ...existing, dailyWagered: 0, dailyCounterDate: today, freeSpinsLeft: 3 };
    }
    return existing;
  }
  await db.insert(casinoState).values({
    userId,
    totalWagered: 0,
    dailyCounterDate: todayString(),
  });
  const [fresh] = await db.select().from(casinoState).where(eq(casinoState.userId, userId)).limit(1);
  return fresh!;
}

async function ensureDreamBalance(db: DbLike, userId: number) {
  const [row] = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, userId)).limit(1);
  if (row) return row;
  await db.insert(dreamBalance).values({ userId, dreamTokens: 100, soulBoundDream: 0, totalDreamEarned: 100 });
  const [fresh] = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, userId)).limit(1);
  return fresh!;
}

/** Shared helper — deduct bet, run logic, apply payout, persist results + state.
 *  `afterHook` runs inside the same transaction (after the casino row
 *  update) so callers can patch game-specific state atomically. */
async function executeGame(
  db: DrizzleDb,
  userId: number,
  game: PlayableGame,
  bet: number,
  runGame: (rng: () => number) => { won: boolean; payout: number; jackpot: boolean; detail: Record<string, unknown> },
  opts: {
    seed?: string;
    skipBetDeduction?: boolean;
    afterHook?: (
      tx: DbLike,
      result: { won: boolean; payout: number; jackpot: boolean; detail: Record<string, unknown> },
    ) => Promise<void>;
  } = {},
) {
  // Validate bet against game limits
  const validation = validateBet(game, bet);
  if (!validation.ok) throw new Error(validation.reason);

  return db.transaction(async (tx) => {
    const state = await ensureCasinoState(tx, userId);
    const balance = await ensureDreamBalance(tx, userId);

    // Enforce daily wager cap (free-to-play games bypass)
    if (bet > 0 && state.dailyWagered + bet > MAX_DAILY_WAGER) {
      throw new Error(`Daily wager cap reached (${MAX_DAILY_WAGER} Dream/day)`);
    }

    if (bet > 0 && !opts.skipBetDeduction) {
      if (balance.dreamTokens < bet) throw new Error("Insufficient Dream tokens");
      await tx
        .update(dreamBalance)
        .set({ dreamTokens: sql`${dreamBalance.dreamTokens} - ${bet}` })
        .where(eq(dreamBalance.userId, userId));
    }

    const seed = opts.seed ?? randomSeed();
    const rng = createRng(seed);
    const result = runGame(rng);

    // Apply VIP bonus on winnings
    const vipLevel = vipLevelFor(state.totalWagered + bet);
    const bonusMult = vipWinBonus(vipLevel);
    const finalPayout = Math.round(result.payout * bonusMult);

    // Credit winnings to Dream balance
    if (finalPayout > 0) {
      await tx
        .update(dreamBalance)
        .set({
          dreamTokens: sql`${dreamBalance.dreamTokens} + ${finalPayout}`,
          totalDreamEarned: sql`${dreamBalance.totalDreamEarned} + ${finalPayout}`,
        })
        .where(eq(dreamBalance.userId, userId));
    }

    // Update streak, favor, totals
    const newStreak = result.won ? state.currentStreak + 1 : 0;
    const bestStreak = Math.max(state.bestStreak, newStreak);
    let favorGain = 1;
    if (result.won) favorGain += 1;
    if (result.jackpot) favorGain += 5;
    if (bet >= 100) favorGain += 1;
    const gamesPlayedNext: Record<string, number> = {
      ...(state.gamesPlayed ?? {}),
      [game]: ((state.gamesPlayed ?? {})[game] ?? 0) + 1,
    };
    const gamesWonNext: Record<string, number> = {
      ...(state.gamesWon ?? {}),
      [game]: ((state.gamesWon ?? {})[game] ?? 0) + (result.won ? 1 : 0),
    };

    // Consecutive win counters for game-specific streak achievements
    const newConsecutiveFactionWins =
      game === "faction_war_betting"
        ? result.won ? state.consecutiveFactionWins + 1 : 0
        : state.consecutiveFactionWins;
    const newConsecutiveGauntletWins =
      game === "card_battlers_gauntlet"
        ? result.won ? state.consecutiveGauntletWins + 1 : 0
        : state.consecutiveGauntletWins;

    // Server-side lore-tale roll so the `tale_collector` achievement is
    // reachable without trusting the client.
    const previousTales = (state.collectedTales ?? []) as string[];
    const rolledTale = maybeRollTale(state.degenFavor, previousTales);
    const collectedTalesNext = rolledTale
      ? [...previousTales, rolledTale.id]
      : previousTales;

    const newTotalWagered = state.totalWagered + bet;
    const updates = {
      totalWagered: newTotalWagered,
      totalWon: state.totalWon + finalPayout,
      sessionWins: result.won ? state.sessionWins + 1 : state.sessionWins,
      sessionLosses: !result.won ? state.sessionLosses + 1 : state.sessionLosses,
      currentStreak: newStreak,
      bestStreak,
      degenFavor: Math.min(100, state.degenFavor + favorGain),
      totalBetsPlaced: state.totalBetsPlaced + 1,
      vipLevel: vipLevelFor(newTotalWagered),
      dailyWagered: state.dailyWagered + bet,
      gamesPlayed: gamesPlayedNext,
      gamesWon: gamesWonNext,
      consecutiveFactionWins: newConsecutiveFactionWins,
      consecutiveGauntletWins: newConsecutiveGauntletWins,
      collectedTales: collectedTalesNext,
      jackpotContribution:
        bet > 0 ? state.jackpotContribution + Math.ceil(bet * 0.02) : state.jackpotContribution,
    } as const;

    await tx.update(casinoState).set(updates).where(eq(casinoState.userId, userId));

    // Contribute 2% of every paid bet to the global progressive jackpot pool.
    // Free-to-play games (bet === 0) don't contribute.
    if (bet > 0) {
      const contribution = Math.ceil(bet * 0.02);
      await tx
        .update(casinoJackpotPool)
        .set({ balance: sql`${casinoJackpotPool.balance} + ${contribution}` })
        .where(eq(casinoJackpotPool.poolKey, "main"));
    }

    await tx.insert(casinoResults).values({
      userId,
      game,
      bet,
      won: result.won,
      payout: finalPayout,
      jackpot: result.jackpot,
      detail: result.detail,
      seed,
    });

    // ─── Achievement evaluation ───
    // Every achievement listed in CASINO_ACHIEVEMENTS is checked here.
    // The evaluator is shared across all games so new achievements
    // become active as soon as their trigger condition returns true.
    const newState = { ...state, ...updates };
    const nextStateForEval: CasinoEvalState = {
      totalWagered: newState.totalWagered,
      totalWon: newState.totalWon,
      currentStreak: newState.currentStreak,
      bestStreak: newState.bestStreak,
      totalBetsPlaced: newState.totalBetsPlaced,
      gamesPlayed: updates.gamesPlayed,
      gamesWon: updates.gamesWon,
      consecutiveFactionWins: updates.consecutiveFactionWins,
      consecutiveGauntletWins: updates.consecutiveGauntletWins,
      degenFavor: newState.degenFavor,
      collectedTales: updates.collectedTales,
    };
    const earned = evaluateCasinoAchievements({
      game,
      bet,
      result,
      state: nextStateForEval,
      previousBestStreak: state.bestStreak,
      previousTotalWon: state.totalWon,
      previousTotalWagered: state.totalWagered,
      previousVipLevel: state.vipLevel,
      vipLevel: updates.vipLevel,
    });
    // Also persist any cosmetics / titles that come with each newly
    // earned achievement. We accumulate them across the loop and
    // write once at the end so the JSON column is only updated once.
    const existingRewards = new Set(
      (state.casinoUnlockedRewards ?? []) as string[],
    );
    const newRewardIds: string[] = [];
    for (const achievementId of earned) {
      const [existing] = await tx
        .select()
        .from(userAchievements)
        .where(and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievementId),
        ))
        .limit(1);
      if (!existing) {
        await tx.insert(userAchievements).values({ userId, achievementId });
      }
      for (const rewardId of rewardsForAchievement(achievementId)) {
        if (!existingRewards.has(rewardId)) {
          existingRewards.add(rewardId);
          newRewardIds.push(rewardId);
        }
      }
    }
    if (newRewardIds.length > 0) {
      await tx
        .update(casinoState)
        .set({ casinoUnlockedRewards: Array.from(existingRewards) })
        .where(eq(casinoState.userId, userId));
    }

    if (opts.afterHook) {
      await opts.afterHook(tx, result);
    }

    return {
      game,
      bet,
      result: { ...result, payout: finalPayout },
      vipBonusMultiplier: bonusMult,
      seed,
      state: { ...state, ...updates },
      tale: rolledTale,
      achievementsUnlocked: earned,
      rewardsUnlocked: newRewardIds,
    };
  });
}

export const casinoRouter = router({
  /** Current per-user casino state (creates row if missing). */
  getState: protectedProcedure.use(checkFeatureFlag("casino")).query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    return ensureCasinoState(db, ctx.user.id);
  }),

  /** Recent game history (for replay + audit). */
  /** All cosmetics, titles, Loredex entries, and companion unlocks
   *  the player has earned from casino achievements. Returns decorated
   *  rows the UI can render directly. */
  getMyCasinoRewards: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const state = await ensureCasinoState(db, ctx.user.id);
      const ids = (state.casinoUnlockedRewards ?? []) as string[];
      return ids.map((id) => {
        const colon = id.indexOf(":");
        const kind = colon >= 0 ? id.slice(0, colon) : "item";
        const slug = colon >= 0 ? id.slice(colon + 1) : id;
        return {
          id,
          kind: (["title", "cosmetic", "loredex", "companion"].includes(kind)
            ? kind
            : "cosmetic") as "title" | "cosmetic" | "loredex" | "companion",
          label: slug.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        };
      });
    }),

  recentResults: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({ limit: z.number().min(1).max(100).default(25) }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db
        .select()
        .from(casinoResults)
        .where(eq(casinoResults.userId, ctx.user.id))
        .orderBy(desc(casinoResults.playedAt))
        .limit(input?.limit ?? 25);
    }),

  /** Void Slots — 3 reels, bet multiplied by match tier. */
  playVoidSlots: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({ bet: z.number().min(1).max(1000) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "void_slots", input.bet, (rng) => playVoidSlots(input.bet, rng));
    }),

  /** Entropy Dice — 2d6 over/under/exact. */
  playEntropyDice: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({
      bet: z.number().min(1).max(1000),
      prediction: z.enum(["over", "under", "exact"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "entropy_dice", input.bet, (rng) =>
        playEntropyDice(input.bet, input.prediction, rng),
      );
    }),

  /** Nebula Poker — 5-card draw against the Degen. Accepts indices to discard. */
  playNebulaPoker: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({
      bet: z.number().min(1).max(1000),
      discard: z.array(z.number().min(0).max(4)).max(3),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "nebula_poker", input.bet, (rng) =>
        playNebulaPoker(input.bet, input.discard, rng),
      );
    }),

  /** Quantum Roulette — bet on one or more factions. */
  playQuantumRoulette: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({
      bet: z.number().min(1).max(1000),
      kind: z.enum(["straight", "adjacent", "half"]),
      factions: z.array(z.enum(ROULETTE_FACTIONS)).min(1).max(3),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "quantum_roulette", input.bet, (rng) =>
        playQuantumRoulette(input.bet, input.kind, input.factions as RouletteFaction[], rng),
      );
    }),

  /** Pazaak 21 — draws until player stands at `stand` value. */
  playPazaak21: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({ bet: z.number().min(1).max(1000), stand: z.number().min(10).max(21) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "pazaak_21", input.bet, (rng) =>
        playPazaak21(input.bet, input.stand, rng),
      );
    }),

  /** High/Low — sequence of higher/lower guesses. */
  playHighLow: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({
      bet: z.number().min(1).max(1000),
      guesses: z.array(z.enum(["high", "low"])).min(1).max(10),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "high_low", input.bet, (rng) =>
        playHighLow(input.bet, input.guesses, rng),
      );
    }),

  /** Scratch Cards — fixed 10 Dream cost. */
  playScratchCard: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "scratch_cards", 10, (rng) => playScratchCard(rng));
    }),

  /** Void Blackjack Tournament — bracket of pazaak21 hands. */
  playVoidBlackjackTournament: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({ bet: z.number().min(50).max(500), stand: z.number().min(10).max(21).default(17) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "void_blackjack_tournament", input.bet, (rng) => {
        // 3 rounds of Pazaak 21 — player must win 2 to advance.
        let wins = 0;
        const rounds: Array<ReturnType<typeof playPazaak21>> = [];
        for (let i = 0; i < 3; i++) {
          const r = playPazaak21(input.bet, input.stand, rng);
          rounds.push(r);
          if (r.won) wins++;
          if (wins === 2) break;
        }
        const champion = wins >= 2;
        const payout = champion ? Math.round(input.bet * 6 * 0.9) : 0; // 10% house rake
        return { won: champion, payout, jackpot: champion, detail: { rounds, wins } };
      });
    }),

  /** Liar's Dice — single round vs NPC. */
  playLiarsDice: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({ bet: z.number().min(20).max(200), call: z.enum(["trust", "liar"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "liars_dice", input.bet, (rng) =>
        playLiarsDice(input.bet, input.call, rng),
      );
    }),

  /** Current live odds for every faction war market. Served fresh
   *  from the warTerritories table so clients can't spoof them. */
  getFactionWarOdds: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .query(async () => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return computeFactionWarOdds(db);
    }),

  /** Faction War Betting — odds are looked up server-side from the
   *  current war state; the client only picks which market to bet on. */
  playFactionWarBet: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({
      bet: z.number().min(10).max(1000),
      betId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const odds = await computeFactionWarOdds(db);
      const liveOdds = odds[input.betId];
      if (!liveOdds) throw new Error(`Unknown faction war market: ${input.betId}`);
      return executeGame(db, ctx.user.id, "faction_war_betting", input.bet, (rng) => {
        const result = playFactionWarBet(input.bet, liveOdds, rng);
        result.detail = { ...result.detail, betId: input.betId, odds: liveOdds };
        return result;
      });
    }),

  /** Dream Roulette — 6 rounds survival. */
  playDreamRoulette: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({ bet: z.number().min(25).max(300) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "dream_roulette", input.bet, (rng) =>
        playDreamRoulette(input.bet, rng),
      );
    }),

  /** Card Battler's Gauntlet — best-of-3 coin flips. */
  playCardBattlersGauntlet: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({ bet: z.number().min(30).max(250) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "card_battlers_gauntlet", input.bet, (rng) =>
        playCardBattlersGauntlet(input.bet, rng),
      );
    }),

  /** Void Bingo — free session. */
  playVoidBingo: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "void_bingo", 0, (rng) => playVoidBingo(rng));
    }),

  /** Void Cases — purchase a case, respect pity timer. */
  playVoidCase: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({ bet: z.number().min(50).max(500) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      // Read pity once up-front so the RNG sees a stable counter; the
      // actual increment happens inside the transaction via afterHook.
      const state = await ensureCasinoState(db, ctx.user.id);
      const pity = state.casesSinceRarePlus;
      return executeGame(
        db,
        ctx.user.id,
        "void_cases",
        input.bet,
        (rng) => playVoidCase(input.bet, pity, rng),
        {
          afterHook: async (tx, result) => {
            const detail = result.detail as { tier: string };
            const rarePlus =
              detail.tier === "rare" ||
              detail.tier === "epic" ||
              detail.tier === "legendary" ||
              detail.tier === "mythic";
            await tx
              .update(casinoState)
              .set({ casesSinceRarePlus: rarePlus ? 0 : pity + 1 })
              .where(eq(casinoState.userId, ctx.user.id));
          },
        },
      );
    }),

  /** Dischordian Mahjong — client reports completion time, server scores it. */
  reportMahjongCompletion: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({
      baseXp: z.number().min(50).max(200),
      timeUsedSeconds: z.number().min(1).max(3600),
      timeLimitSeconds: z.number().min(60).max(3600),
      factionCombo: z.number().min(0).max(50),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "dischordian_mahjong", 0, () =>
        scoreMahjongRun(input.baseXp, input.timeUsedSeconds, input.timeLimitSeconds, input.factionCombo),
      );
    }),

  /** Reset session counters (not the lifetime ones). */
  resetSession: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      await db
        .update(casinoState)
        .set({ sessionWins: 0, sessionLosses: 0 })
        .where(eq(casinoState.userId, ctx.user.id));
      return { ok: true };
    }),

  /** Public leaderboard of biggest jackpots. */
  jackpotLeaderboard: publicProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(casinoResults)
        .where(eq(casinoResults.jackpot, true))
        .orderBy(desc(casinoResults.payout))
        .limit(input?.limit ?? 10);
    }),

  /** Current progressive jackpot pool balance + last winner. */
  getJackpotPool: publicProcedure
    .use(checkFeatureFlag("casino"))
    .query(async () => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [pool] = await db
        .select()
        .from(casinoJackpotPool)
        .where(eq(casinoJackpotPool.poolKey, "main"))
        .limit(1);
      if (pool) return pool;
      await db.insert(casinoJackpotPool).values({ poolKey: "main", balance: 0, totalPaidOut: 0 });
      const [fresh] = await db
        .select()
        .from(casinoJackpotPool)
        .where(eq(casinoJackpotPool.poolKey, "main"))
        .limit(1);
      return fresh!;
    }),

  /** Claim the progressive jackpot pool. Only callable if the
   *  player hit a true jackpot (three Degens in slots, royal flush
   *  in poker, etc.) in the last 5 minutes, verified against the
   *  audit log. Drains the pool into the player's Dream balance. */
  claimJackpot: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        // Look for a qualifying jackpot in the audit log
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const [recent] = await tx
          .select()
          .from(casinoResults)
          .where(and(
            eq(casinoResults.userId, ctx.user.id),
            eq(casinoResults.jackpot, true),
            sql`${casinoResults.playedAt} > ${fiveMinutesAgo}`,
          ))
          .orderBy(desc(casinoResults.playedAt))
          .limit(1);
        if (!recent) {
          throw new Error("No recent jackpot hit. The pool is only claimable within 5 minutes of a jackpot.");
        }

        const [pool] = await tx
          .select()
          .from(casinoJackpotPool)
          .where(eq(casinoJackpotPool.poolKey, "main"))
          .limit(1);
        if (!pool || pool.balance <= 0) {
          throw new Error("The jackpot pool is empty.");
        }

        // Guard against double-claiming: stamp the result row by re-
        // using the seed column. If it contains "CLAIMED", we've
        // already paid out for this hit.
        if (recent.seed?.startsWith("CLAIMED:")) {
          throw new Error("This jackpot has already been claimed.");
        }

        // Split the pool into a payout + retained seed. See
        // `shared/casinoGames#splitJackpotPool` for the formula.
        const { payout, retained } = splitJackpotPool(pool.balance);

        await tx
          .update(casinoJackpotPool)
          .set({
            balance: retained,
            totalPaidOut: pool.totalPaidOut + payout,
            lastWinnerId: ctx.user.id,
            lastWinAt: new Date(),
          })
          .where(eq(casinoJackpotPool.poolKey, "main"));

        if (payout > 0) {
          await tx
            .update(dreamBalance)
            .set({
              dreamTokens: sql`${dreamBalance.dreamTokens} + ${payout}`,
              totalDreamEarned: sql`${dreamBalance.totalDreamEarned} + ${payout}`,
            })
            .where(eq(dreamBalance.userId, ctx.user.id));
        }

        await tx
          .update(casinoResults)
          .set({ seed: `CLAIMED:${recent.seed ?? ""}` })
          .where(eq(casinoResults.id, recent.id));

        // Broadcast a system notification to every casino participant.
        // lastBroadcastAt guards against retries flooding the inbox.
        const alreadyBroadcast = pool.lastBroadcastAt &&
          Date.now() - pool.lastBroadcastAt.getTime() < 60_000;
        if (!alreadyBroadcast) {
          const participants = await tx
            .select({ userId: casinoState.userId })
            .from(casinoState);
          if (participants.length > 0) {
            const winnerName = ctx.user.name ?? `Captain #${ctx.user.id}`;
            const rows = participants.map(p => ({
              userId: p.userId,
              type: "seasonal_event" as const,
              title: "The Jackpot Has Fallen",
              message: `${winnerName} just claimed the progressive jackpot — ${payout.toLocaleString()} Dream. The Degen is weeping. Or laughing. It's hard to tell.`,
              actionUrl: "/casino/leaderboard",
              metadata: {
                kind: "casino_jackpot_claim",
                winnerId: ctx.user.id,
                payout,
                retained,
              },
            }));
            const chunk = 500;
            for (let i = 0; i < rows.length; i += chunk) {
              await tx.insert(notifications).values(rows.slice(i, i + chunk));
            }
            await tx
              .update(casinoJackpotPool)
              .set({ lastBroadcastAt: new Date() })
              .where(eq(casinoJackpotPool.poolKey, "main"));
          }
        }

        return { payout, newBalance: retained, retained };
      });
    }),
});
