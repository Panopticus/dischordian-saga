/* ═══════════════════════════════════════════════════════
   THE ARCHITECT'S GAMBIT — Strategic Chess Game
   Characters have unique play styles. Ranked ladder with ELO.
   Game Master boss at the top. Rewards feed into economy.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq, and, desc, sql, gte, ne } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  chessGames, chessRankings, chessTournaments,
  dreamBalance, notifications,
} from "../../drizzle/schema";

// chess.js v1.4 — dynamic import to avoid ESM/CJS mismatch
let Chess: any;
const chessReady = import("chess.js").then(m => { Chess = m.Chess; });

const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/* ─── CHARACTER PLAY STYLES ─── */
interface CharacterStyle {
  name: string;
  loreTitle: string;
  eloBonus: number;       // bonus ELO for AI when playing as this character
  style: "aggressive" | "positional" | "tactical" | "defensive" | "endgame" | "universal";
  openingPreference: string;
  description: string;
  unlockRequirement: string;
}

const CHESS_CHARACTERS: Record<string, CharacterStyle> = {
  the_architect: {
    name: "The Architect",
    loreTitle: "Grand Strategist",
    eloBonus: 200,
    style: "positional",
    openingPreference: "queen_gambit",
    description: "Plays deep positional chess. Controls the center, builds slow crushing pressure. Never rushes.",
    unlockRequirement: "default",
  },
  the_enigma: {
    name: "The Enigma",
    loreTitle: "The Unpredictable",
    eloBonus: 100,
    style: "tactical",
    openingPreference: "sicilian",
    description: "Wild sacrifices and brilliant combinations. Thrives in chaos and complex positions.",
    unlockRequirement: "default",
  },
  the_oracle: {
    name: "The Oracle",
    loreTitle: "Seer of Moves",
    eloBonus: 150,
    style: "endgame",
    openingPreference: "ruy_lopez",
    description: "Sees 10 moves ahead. Simplifies into winning endgames with surgical precision.",
    unlockRequirement: "default",
  },
  the_collector: {
    name: "The Collector",
    loreTitle: "Material Hunter",
    eloBonus: 80,
    style: "defensive",
    openingPreference: "caro_kann",
    description: "Hoards material advantage. Trades down to winning endgames. Patient and methodical.",
    unlockRequirement: "default",
  },
  the_warlord: {
    name: "The Warlord",
    loreTitle: "Blitz Commander",
    eloBonus: 120,
    style: "aggressive",
    openingPreference: "kings_gambit",
    description: "Attacks relentlessly from move 1. Sacrifices pawns for initiative. Lives for checkmate.",
    unlockRequirement: "default",
  },
  iron_lion: {
    name: "Iron Lion",
    loreTitle: "The Fortress",
    eloBonus: 100,
    style: "defensive",
    openingPreference: "london_system",
    description: "Impenetrable defense. Builds a fortress and waits for opponent mistakes.",
    unlockRequirement: "default",
  },
  the_necromancer: {
    name: "The Necromancer",
    loreTitle: "Piece Resurrector",
    eloBonus: 130,
    style: "tactical",
    openingPreference: "french_defense",
    description: "Sacrifices pieces only to bring devastating counterattacks from the dead position.",
    unlockRequirement: "Win 10 ranked games",
  },
  the_human: {
    name: "The Human",
    loreTitle: "The Balanced",
    eloBonus: 60,
    style: "universal",
    openingPreference: "italian_game",
    description: "Adapts to any position. No weaknesses, no extreme strengths. Pure chess fundamentals.",
    unlockRequirement: "default",
  },
  agent_zero: {
    name: "Agent Zero",
    loreTitle: "The Calculator",
    eloBonus: 170,
    style: "tactical",
    openingPreference: "najdorf",
    description: "Calculates every variation. Finds computer-like moves in complex positions.",
    unlockRequirement: "Reach Gold tier",
  },
  the_programmer: {
    name: "The Programmer",
    loreTitle: "Pattern Matcher",
    eloBonus: 140,
    style: "positional",
    openingPreference: "english_opening",
    description: "Recognizes patterns from millions of games. Plays the statistically optimal move.",
    unlockRequirement: "Reach Silver tier",
  },
  the_source: {
    name: "The Source",
    loreTitle: "Reality Bender",
    eloBonus: 250,
    style: "universal",
    openingPreference: "kings_indian",
    description: "Transcends normal chess. Creates positions that shouldn't exist. The ultimate challenge before the Game Master.",
    unlockRequirement: "Reach Diamond tier",
  },
  game_master: {
    name: "The Game Master",
    loreTitle: "Magnus Carlsen Level",
    eloBonus: 600,
    style: "universal",
    openingPreference: "any",
    description: "The final boss. Plays at 2800+ ELO. Only the greatest can challenge the Game Master.",
    unlockRequirement: "Reach Grandmaster tier (2400+ ELO)",
  },
};

/* ─── ELO CALCULATION ─── */
function calculateElo(playerElo: number, opponentElo: number, result: 1 | 0 | 0.5, k = 32): number {
  const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  return Math.round(k * (result - expected));
}

function getTier(elo: number): string {
  if (elo >= 2400) return "grandmaster";
  if (elo >= 2200) return "master";
  if (elo >= 2000) return "diamond";
  if (elo >= 1800) return "platinum";
  if (elo >= 1600) return "gold";
  if (elo >= 1400) return "silver";
  return "bronze";
}

/* ─── AI MOVE GENERATION ─── */
function getAiMove(game: any, difficulty: number, style: string): string {
  const moves = game.moves();
  if (moves.length === 0) return "";

  // Higher difficulty = more likely to pick the best move
  // Style influences move selection preferences
  const scored = moves.map((move: string) => {
    let score = Math.random() * 100;
    const testGame = new Chess(game.fen());
    testGame.move(move);

    // Base scoring by difficulty (0-10 scale)
    const depthBonus = difficulty * 8;

    // Checkmate is always best
    if (testGame.isCheckmate()) return { move, score: 10000 };

    // Check is good
    if (testGame.isCheck()) score += 30 + depthBonus;

    // Captures
    if (move.includes("x")) {
      score += 20 + depthBonus * 0.5;
      // Capture high-value pieces
      if (move.includes("Q") || move.includes("q")) score += 50;
      if (move.includes("R") || move.includes("r")) score += 30;
      if (move.includes("B") || move.includes("b") || move.includes("N") || move.includes("n")) score += 20;
    }

    // Style-based preferences
    switch (style) {
      case "aggressive":
        if (move.includes("x") || testGame.isCheck()) score += 25;
        // Prefer central pawn pushes and piece development
        if (move.match(/^[a-h][45]/)) score += 15;
        break;
      case "defensive":
        // Prefer castling and piece retreats
        if (move === "O-O" || move === "O-O-O") score += 40;
        if (!move.includes("x")) score += 10;
        break;
      case "positional":
        // Prefer center control and piece development
        if (move.match(/^[NBRQ][a-h]?[1-8]?[de][45]$/)) score += 20;
        if (move === "O-O" || move === "O-O-O") score += 30;
        break;
      case "tactical":
        // Prefer complex positions with many captures
        if (move.includes("x") || move.includes("+")) score += 30;
        if (move.includes("=Q")) score += 50; // promotion
        break;
      case "endgame":
        // Prefer king activity and pawn pushes in later game
        const moveCount = game.history().length;
        if (moveCount > 40) {
          if (move.match(/^K/)) score += 20;
          if (move.match(/^[a-h][78]/)) score += 25;
        }
        break;
      case "universal":
        // Balanced — slight preference for development
        if (move === "O-O" || move === "O-O-O") score += 20;
        if (move.match(/^[NBRQ]/)) score += 10;
        break;
    }

    // Difficulty-based randomness reduction
    // Difficulty 1-3: very random, 4-6: moderate, 7-9: strong, 10: near-perfect
    const randomFactor = Math.max(5, 100 - difficulty * 10);
    score += Math.random() * randomFactor;

    return { move, score };
  });

  scored.sort((a: any, b: any) => b.score - a.score);

  // At higher difficulties, more likely to pick top moves
  const topN = Math.max(1, Math.floor(moves.length * Math.max(0.05, 1 - difficulty * 0.09)));
  const pick = scored[Math.floor(Math.random() * Math.min(topN, scored.length))];
  return pick.move;
}

/* ─── REWARD CALCULATION ─── */
function calculateRewards(mode: string, difficulty: number, won: boolean, eloChange: number) {
  if (!won) return { dream: 0, materials: {} };

  const baseDream = mode === "game_master" ? 500
    : mode === "ranked" ? 50 + Math.max(0, eloChange) * 2
    : mode === "story" ? 30 + difficulty * 10
    : mode === "tournament" ? 100
    : 15 + difficulty * 5; // casual

  const materials: Record<string, number> = {};
  // Higher difficulty = better material drops
  if (difficulty >= 3) materials["quantum_dust"] = Math.floor(Math.random() * 3) + 1;
  if (difficulty >= 5) materials["neural_thread"] = Math.floor(Math.random() * 2) + 1;
  if (difficulty >= 7) materials["void_crystal"] = Math.floor(Math.random() * 2) + 1;
  if (difficulty >= 9) materials["architect_sigil"] = 1;
  if (mode === "game_master") {
    materials["game_master_trophy"] = 1;
    materials["reality_shard"] = Math.floor(Math.random() * 3) + 2;
  }

  return { dream: baseDream, materials };
}

// Ensure chess.js is loaded before router is used
chessReady.catch(e => console.error("[Chess] Failed to load chess.js:", e));

export const chessRouter = router({
  /** Get available characters and their styles */
  getCharacters: protectedProcedure.query(async ({ ctx }) => {
    await chessReady;
    const db = (await getDb())!;
    const ranking = await db.select().from(chessRankings)
      .where(eq(chessRankings.userId, ctx.user.id)).limit(1);
    const unlocked = ranking[0]?.unlockedCharacters || [];
    const playerElo = ranking[0]?.elo || 1200;
    const tier = getTier(playerElo);

    return Object.entries(CHESS_CHARACTERS).map(([id, char]) => {
      const isUnlocked = char.unlockRequirement === "default"
        || unlocked.includes(id)
        || (id === "the_necromancer" && (ranking[0]?.wins || 0) >= 10)
        || (id === "the_programmer" && ["silver", "gold", "platinum", "diamond", "master", "grandmaster"].includes(tier))
        || (id === "agent_zero" && ["gold", "platinum", "diamond", "master", "grandmaster"].includes(tier))
        || (id === "the_source" && ["diamond", "master", "grandmaster"].includes(tier))
        || (id === "game_master" && tier === "grandmaster");
      return { id, ...char, isUnlocked };
    });
  }),

  /** Get player's chess ranking */
  getMyRanking: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const ranking = await db.select().from(chessRankings)
      .where(eq(chessRankings.userId, ctx.user.id)).limit(1);
    if (!ranking[0]) {
      return { elo: 1200, peakElo: 1200, tier: "bronze", gamesPlayed: 0, wins: 0, losses: 0, draws: 0, winStreak: 0, bestWinStreak: 0, defeatedGameMaster: false, storyProgress: 0 };
    }
    return { ...ranking[0], tier: getTier(ranking[0].elo) };
  }),

  /** Get the ranked leaderboard */
  getLeaderboard: protectedProcedure.query(async () => {
    const db = (await getDb())!;
    const leaders = await db.select().from(chessRankings)
      .orderBy(desc(chessRankings.elo))
      .limit(50);
    return leaders.map(r => ({ ...r, tier: getTier(r.elo) }));
  }),

  /** Start a new game against AI */
  startGame: protectedProcedure
    .input(z.object({
      mode: z.enum(["casual", "ranked", "story", "game_master"]).default("casual"),
      characterId: z.string(),
      opponentCharacterId: z.string().optional(),
      timeControl: z.number().min(60).max(3600).default(600),
    }))
    .mutation(async ({ ctx, input }) => {
      await chessReady;
      const db = (await getDb())!;
      const character = CHESS_CHARACTERS[input.characterId];
      if (!character) throw new Error("Invalid character");

      // For story mode, pick opponent based on story progress
      let opponentId = input.opponentCharacterId;
      const storyOrder = ["the_human", "the_collector", "iron_lion", "the_enigma", "the_warlord", "the_oracle", "the_necromancer", "the_programmer", "agent_zero", "the_source", "game_master"];

      if (input.mode === "story") {
        const ranking = await db.select().from(chessRankings)
          .where(eq(chessRankings.userId, ctx.user.id)).limit(1);
        const progress = ranking[0]?.storyProgress || 0;
        opponentId = storyOrder[Math.min(progress, storyOrder.length - 1)];
      }

      if (input.mode === "game_master") {
        opponentId = "game_master";
      }

      const opponent = CHESS_CHARACTERS[opponentId || "the_human"];
      if (!opponent) throw new Error("Invalid opponent");

      // Calculate AI difficulty based on character + mode
      let aiDifficulty = 3; // casual default
      if (input.mode === "ranked") {
        const ranking = await db.select().from(chessRankings)
          .where(eq(chessRankings.userId, ctx.user.id)).limit(1);
        const playerElo = ranking[0]?.elo || 1200;
        aiDifficulty = Math.min(10, Math.max(1, Math.floor((playerElo + opponent.eloBonus) / 300)));
      } else if (input.mode === "story") {
        const ranking = await db.select().from(chessRankings)
          .where(eq(chessRankings.userId, ctx.user.id)).limit(1);
        aiDifficulty = Math.min(10, (ranking[0]?.storyProgress || 0) + 2);
      } else if (input.mode === "game_master") {
        aiDifficulty = 10;
      }

      // Player is always white (for now)
      const result = await db.insert(chessGames).values({
        whitePlayerId: ctx.user.id,
        blackPlayerId: null,
        whiteCharacter: input.characterId,
        blackCharacter: opponentId || "the_human",
        mode: input.mode,
        aiDifficulty,
        fen: STARTING_FEN,
        pgn: "",
        status: "active",
        timeControl: input.timeControl,
        whiteTimeMs: input.timeControl * 1000,
        blackTimeMs: input.timeControl * 1000,
        startedAt: new Date(),
      });

      return {
        gameId: result[0].insertId,
        fen: STARTING_FEN,
        playerColor: "white",
        opponent: { id: opponentId, ...opponent },
        aiDifficulty,
      };
    }),

  /** Make a move and get AI response */
  makeMove: protectedProcedure
    .input(z.object({
      gameId: z.number(),
      from: z.string(),
      to: z.string(),
      promotion: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await chessReady;
      const db = (await getDb())!;
      const game = await db.select().from(chessGames)
        .where(and(eq(chessGames.id, input.gameId), eq(chessGames.whitePlayerId, ctx.user.id)))
        .limit(1);
      if (!game[0]) throw new Error("Game not found");
      if (game[0].status !== "active") throw new Error("Game is not active");

      const chess = new Chess(game[0].fen || STARTING_FEN);

      // Validate and make player move
      const playerMove = chess.move({
        from: input.from,
        to: input.to,
        promotion: input.promotion || undefined,
      });
      if (!playerMove) throw new Error("Invalid move");

      let status: string = "active";
      let aiMoveResult = null;
      let winnerId = null;

      // Check if game ended after player move
      if (chess.isCheckmate()) {
        status = "checkmate";
        winnerId = ctx.user.id;
      } else if (chess.isStalemate()) {
        status = "stalemate";
      } else if (chess.isDraw()) {
        status = "draw";
      }

      // AI responds if game is still active
      if (status === "active") {
        const opponentChar = CHESS_CHARACTERS[game[0].blackCharacter || "the_human"];
        const aiMove = getAiMove(chess, game[0].aiDifficulty || 3, opponentChar?.style || "universal");
        if (aiMove) {
          const result = chess.move(aiMove);
          aiMoveResult = result;

          // Check if AI won
          if (chess.isCheckmate()) {
            status = "checkmate";
            winnerId = -1; // AI wins
          } else if (chess.isStalemate()) {
            status = "stalemate";
          } else if (chess.isDraw()) {
            status = "draw";
          }
        }
      }

      const moveCount = chess.history().length;

      // Update game state
      await db.update(chessGames)
        .set({
          fen: chess.fen(),
          pgn: chess.pgn(),
          status: status as any,
          moveCount,
          winnerId: winnerId === -1 ? null : winnerId,
          ...(status !== "active" ? { endedAt: new Date() } : {}),
        })
        .where(eq(chessGames.id, input.gameId));

      // Process game end
      let rewards = null;
      let eloChange = 0;
      if (status !== "active") {
        const result = await processGameEnd(db, ctx.user.id, game[0], status, winnerId);
        rewards = result.rewards;
        eloChange = result.eloChange;
      }

      return {
        fen: chess.fen(),
        pgn: chess.pgn(),
        playerMove: { from: playerMove.from, to: playerMove.to, san: playerMove.san },
        aiMove: aiMoveResult ? { from: aiMoveResult.from, to: aiMoveResult.to, san: aiMoveResult.san } : null,
        status,
        moveCount,
        isCheck: chess.isCheck(),
        rewards,
        eloChange,
      };
    }),

  /** Resign a game */
  resign: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const game = await db.select().from(chessGames)
        .where(and(eq(chessGames.id, input.gameId), eq(chessGames.whitePlayerId, ctx.user.id)))
        .limit(1);
      if (!game[0] || game[0].status !== "active") throw new Error("Game not found or not active");

      await db.update(chessGames)
        .set({ status: "resigned", endedAt: new Date() })
        .where(eq(chessGames.id, input.gameId));

      const result = await processGameEnd(db, ctx.user.id, game[0], "resigned", null);
      return { success: true, eloChange: result.eloChange };
    }),

  /** Get game history */
  getHistory: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const games = await db.select().from(chessGames)
        .where(eq(chessGames.whitePlayerId, ctx.user.id))
        .orderBy(desc(chessGames.createdAt))
        .limit(input.limit);
      return games.map(g => ({
        ...g,
        whiteCharacterName: CHESS_CHARACTERS[g.whiteCharacter || ""]?.name || "Unknown",
        blackCharacterName: CHESS_CHARACTERS[g.blackCharacter || ""]?.name || "Unknown",
      }));
    }),

  /** Get active game (resume) */
  getActiveGame: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const game = await db.select().from(chessGames)
      .where(and(eq(chessGames.whitePlayerId, ctx.user.id), eq(chessGames.status, "active")))
      .orderBy(desc(chessGames.createdAt))
      .limit(1);
    if (!game[0]) return null;
    return {
      ...game[0],
      opponent: CHESS_CHARACTERS[game[0].blackCharacter || "the_human"],
    };
  }),

  /** Get legal moves for current position */
  getLegalMoves: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ ctx, input }) => {
      await chessReady;
      const db = (await getDb())!;
      const game = await db.select().from(chessGames)
        .where(and(eq(chessGames.id, input.gameId), eq(chessGames.whitePlayerId, ctx.user.id)))
        .limit(1);
      if (!game[0]) return [];
      const chess = new Chess(game[0].fen || STARTING_FEN);
      return chess.moves({ verbose: true });
    }),
});

/** Process game end — update ELO, give rewards, advance story */
async function processGameEnd(
  db: any, playerId: number, game: any, status: string, winnerId: number | null
) {
  const playerWon = winnerId === playerId;
  const isDraw = status === "stalemate" || status === "draw";

  // Get or create ranking
  let ranking = await db.select().from(chessRankings)
    .where(eq(chessRankings.userId, playerId)).limit(1);
  if (!ranking[0]) {
    await db.insert(chessRankings).values({ userId: playerId, elo: 1200, peakElo: 1200 });
    ranking = await db.select().from(chessRankings)
      .where(eq(chessRankings.userId, playerId)).limit(1);
  }

  const currentElo = ranking[0].elo;
  const opponentChar = CHESS_CHARACTERS[game.blackCharacter || "the_human"];
  const opponentElo = 1200 + (opponentChar?.eloBonus || 0) + (game.aiDifficulty || 3) * 50;

  // Calculate ELO change (only for ranked/story/game_master)
  let eloChange = 0;
  if (game.mode === "ranked" || game.mode === "story" || game.mode === "game_master") {
    const result = playerWon ? 1 : isDraw ? 0.5 : 0;
    eloChange = calculateElo(currentElo, opponentElo, result as 1 | 0 | 0.5);
  }

  const newElo = Math.max(100, currentElo + eloChange);
  const newPeakElo = Math.max(ranking[0].peakElo, newElo);
  const newWinStreak = playerWon ? ranking[0].winStreak + 1 : 0;
  const newBestWinStreak = Math.max(ranking[0].bestWinStreak, newWinStreak);

  // Update ranking
  await db.update(chessRankings)
    .set({
      elo: newElo,
      peakElo: newPeakElo,
      tier: getTier(newElo) as any,
      gamesPlayed: sql`${chessRankings.gamesPlayed} + 1`,
      wins: playerWon ? sql`${chessRankings.wins} + 1` : ranking[0].wins,
      losses: !playerWon && !isDraw ? sql`${chessRankings.losses} + 1` : ranking[0].losses,
      draws: isDraw ? sql`${chessRankings.draws} + 1` : ranking[0].draws,
      winStreak: newWinStreak,
      bestWinStreak: newBestWinStreak,
      defeatedGameMaster: playerWon && game.mode === "game_master" ? true : ranking[0].defeatedGameMaster,
      storyProgress: playerWon && game.mode === "story"
        ? sql`${chessRankings.storyProgress} + 1`
        : ranking[0].storyProgress,
    })
    .where(eq(chessRankings.userId, playerId));

  // Update game with ELO change
  await db.update(chessGames)
    .set({ whiteEloChange: eloChange, rewardsDream: 0 })
    .where(eq(chessGames.id, game.id));

  // Calculate and give rewards
  const rewards = calculateRewards(game.mode, game.aiDifficulty || 3, playerWon, eloChange);
  if (rewards.dream > 0) {
    const bal = await db.select().from(dreamBalance)
      .where(eq(dreamBalance.userId, playerId)).limit(1);
    if (bal[0]) {
      await db.update(dreamBalance)
        .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${rewards.dream}` })
        .where(eq(dreamBalance.userId, playerId));
    } else {
      await db.insert(dreamBalance).values({ userId: playerId, dreamTokens: rewards.dream, soulBoundDream: 0 });
    }

    await db.update(chessGames)
      .set({ rewardsDream: rewards.dream, rewardsMaterials: rewards.materials })
      .where(eq(chessGames.id, game.id));
  }

  // Notify on special achievements
  if (playerWon && game.mode === "game_master") {
    await db.insert(notifications).values({
      userId: playerId,
      type: "achievement",
      title: "GAME MASTER DEFEATED!",
      message: "You have defeated The Game Master! You are the ultimate chess champion of the Dischordian Saga!",
      actionUrl: "/chess",
    });
  }

  return { eloChange, rewards };
}
