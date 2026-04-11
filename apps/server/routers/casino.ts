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
  casinoState, casinoResults, dreamBalance, userAchievements,
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
  ROULETTE_FACTIONS, type RouletteFaction,
} from "../../shared/casinoGames";

type PlayableGame =
  | "void_slots" | "entropy_dice" | "nebula_poker" | "quantum_roulette"
  | "pazaak_21" | "high_low" | "scratch_cards"
  | "void_blackjack_tournament" | "liars_dice" | "faction_war_betting"
  | "dream_roulette" | "card_battlers_gauntlet" | "void_bingo"
  | "void_cases" | "dischordian_mahjong";

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

/** Shared helper — deduct bet, run logic, apply payout, persist results + state. */
async function executeGame(
  db: DrizzleDb,
  userId: number,
  game: PlayableGame,
  bet: number,
  runGame: (rng: () => number) => { won: boolean; payout: number; jackpot: boolean; detail: Record<string, unknown> },
  opts: { seed?: string; skipBetDeduction?: boolean } = {},
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
      jackpotContribution:
        bet > 0 ? state.jackpotContribution + Math.ceil(bet * 0.02) : state.jackpotContribution,
    } as const;

    await tx.update(casinoState).set(updates).where(eq(casinoState.userId, userId));

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

    // Unlock jackpot achievement if needed
    if (result.jackpot) {
      const [existing] = await tx
        .select()
        .from(userAchievements)
        .where(and(eq(userAchievements.userId, userId), eq(userAchievements.achievementId, "jackpot")))
        .limit(1);
      if (!existing) {
        await tx.insert(userAchievements).values({ userId, achievementId: "jackpot" });
      }
    }
    if (bestStreak >= 10 && state.bestStreak < 10) {
      const [existing] = await tx
        .select()
        .from(userAchievements)
        .where(and(eq(userAchievements.userId, userId), eq(userAchievements.achievementId, "degens_chosen")))
        .limit(1);
      if (!existing) {
        await tx.insert(userAchievements).values({ userId, achievementId: "degens_chosen" });
      }
    }

    return {
      game,
      bet,
      result: { ...result, payout: finalPayout },
      vipBonusMultiplier: bonusMult,
      seed,
      state: { ...state, ...updates },
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

  /** Faction War Betting — odds-based resolution. */
  playFactionWarBet: protectedProcedure
    .use(checkFeatureFlag("casino"))
    .input(z.object({
      bet: z.number().min(10).max(1000),
      betId: z.string(),
      odds: z.number().min(1.1).max(20),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return executeGame(db, ctx.user.id, "faction_war_betting", input.bet, (rng) => {
        const result = playFactionWarBet(input.bet, input.odds, rng);
        result.detail = { ...result.detail, betId: input.betId };
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
      const state = await ensureCasinoState(db, ctx.user.id);
      const pity = state.casesSinceRarePlus;
      const out = await executeGame(db, ctx.user.id, "void_cases", input.bet, (rng) =>
        playVoidCase(input.bet, pity, rng),
      );
      // Update pity timer on the row
      const detail = out.result.detail as { tier: string };
      const rarePlus = detail.tier === "rare" || detail.tier === "epic" || detail.tier === "legendary" || detail.tier === "mythic";
      await db
        .update(casinoState)
        .set({ casesSinceRarePlus: rarePlus ? 0 : pity + 1 })
        .where(eq(casinoState.userId, ctx.user.id));
      return out;
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
});
