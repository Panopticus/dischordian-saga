import { type Express, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

/**
 * Duelyst API Bridge — The Collector's Arena
 *
 * Provides the REST endpoints that the Duelyst game client expects:
 * - POST /session       — Login (create session token)
 * - GET  /session       — Verify existing session token
 * - GET  /session/logout — Logout
 * - GET  /game/faction_progression — Faction data
 * - GET  /game/inventory — Player inventory
 * - GET  /game/matchmaking/casual — Matchmaking status
 * - POST /game/match_complete — Report match result → awards XP & achievements
 * - GET  /game/arena_stats — Get arena stats for the current user
 *
 * All endpoints return data in the format the Duelyst client expects.
 * This is a single-player bridge — no real matchmaking server needed.
 * Match completions are connected to the Loredex OS XP/progression system.
 */

const DUELYST_JWT_SECRET =
  process.env.JWT_SECRET || "duelyst-dischordian-saga-secret";

// In-memory user store for the game (simple, no persistence needed)
const gameUsers = new Map<
  string,
  { id: string; username: string; password: string }
>();

// Default starting gold and spirit for new players
const DEFAULT_GOLD = 1000;
const DEFAULT_SPIRIT = 500;

// XP rewards for different match outcomes
const XP_REWARDS = {
  win: 150,
  loss: 50,
  draw: 75,
  practice_win: 75,
  practice_loss: 25,
  first_win_bonus: 100, // bonus for first win of the day
};

// Achievement definitions for arena play
const ARENA_ACHIEVEMENTS = [
  { id: "arena_first_blood", name: "First Blood", condition: { wins: 1 }, xp: 200, tier: "bronze" },
  { id: "arena_warrior", name: "Arena Warrior", condition: { wins: 10 }, xp: 500, tier: "silver" },
  { id: "arena_champion", name: "Arena Champion", condition: { wins: 50 }, xp: 1500, tier: "gold" },
  { id: "arena_legend", name: "Arena Legend", condition: { wins: 100 }, xp: 3000, tier: "platinum" },
  { id: "arena_faction_master", name: "Faction Master", condition: { faction_wins: 25 }, xp: 1000, tier: "gold" },
  { id: "arena_streak_5", name: "Unstoppable", condition: { win_streak: 5 }, xp: 500, tier: "silver" },
  { id: "arena_streak_10", name: "Legendary Streak", condition: { win_streak: 10 }, xp: 2000, tier: "gold" },
  { id: "arena_all_factions", name: "Master of All", condition: { factions_played: 6 }, xp: 1000, tier: "gold" },
  { id: "arena_empire_loyal", name: "Empire Loyalist", condition: { faction_id: 1, faction_wins: 10 }, xp: 500, tier: "silver" },
  { id: "arena_insurgent", name: "Insurgent Commander", condition: { faction_id: 2, faction_wins: 10 }, xp: 500, tier: "silver" },
  { id: "arena_hierarchy", name: "Lord of the Damned", condition: { faction_id: 3, faction_wins: 10 }, xp: 500, tier: "silver" },
  { id: "arena_virus", name: "Viral Propagator", condition: { faction_id: 4, faction_wins: 10 }, xp: 500, tier: "silver" },
  { id: "arena_babylon", name: "Babylonian Conqueror", condition: { faction_id: 5, faction_wins: 10 }, xp: 500, tier: "silver" },
  { id: "arena_potential", name: "Awakened Potential", condition: { faction_id: 6, faction_wins: 10 }, xp: 500, tier: "silver" },
];

// Title progression based on total arena wins
const ARENA_TITLES = [
  { wins: 0, title: "Recruit" },
  { wins: 5, title: "Initiate" },
  { wins: 15, title: "Gladiator" },
  { wins: 30, title: "Centurion" },
  { wins: 50, title: "Champion" },
  { wins: 100, title: "Warlord" },
  { wins: 200, title: "Grand Champion" },
  { wins: 500, title: "Legendary" },
];

function createGameToken(userId: string, username: string): string {
  const payload = {
    d: { id: userId, username },
    v: 0,
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.sign(payload, DUELYST_JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
}

function verifyGameToken(
  token: string
): { id: string; username: string } | null {
  try {
    const decoded = jwt.verify(token, DUELYST_JWT_SECRET) as any;
    if (decoded && decoded.d) {
      return { id: decoded.d.id, username: decoded.d.username };
    }
    return null;
  } catch {
    return null;
  }
}

function extractToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    return auth.substring(7);
  }
  return null;
}

/**
 * Get the numeric Loredex user ID from a Duelyst token.
 * The token's d.id is the Loredex user ID (set during auto-login).
 * For manual logins (non-numeric IDs), returns null.
 */
function getUserIdFromToken(req: Request): number | null {
  const token = extractToken(req);
  if (!token) return null;
  const user = verifyGameToken(token);
  if (!user) return null;
  const numId = parseInt(user.id, 10);
  return isNaN(numId) ? null : numId;
}

/**
 * Get the user info from token (works for both auto-login and manual login).
 */
function getUserFromToken(req: Request): { id: string; username: string } | null {
  const token = extractToken(req);
  if (!token) return null;
  return verifyGameToken(token);
}

/**
 * Award XP and check achievements after a match.
 * Updates the userProgress table in the database.
 */
async function awardMatchXp(
  userId: number,
  result: "win" | "loss" | "draw",
  factionId: number,
  isPractice: boolean
): Promise<{
  xpAwarded: number;
  newTotalXp: number;
  newLevel: number;
  newTitle: string;
  achievementsUnlocked: string[];
}> {
  const { getDb } = await import("./db");
  const { userProgress, userAchievements } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");

  const db = await getDb();
  if (!db) {
    return {
      xpAwarded: 0,
      newTotalXp: 0,
      newLevel: 1,
      newTitle: "Recruit",
      achievementsUnlocked: [],
    };
  }

  // Get or create user progress
  let [progress] = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);

  if (!progress) {
    await db.insert(userProgress).values({
      userId,
      xp: 0,
      level: 1,
      points: 0,
      title: "Recruit",
      progressData: { arena: { wins: 0, losses: 0, draws: 0, streak: 0, best_streak: 0, faction_wins: {}, factions_played: [], matches_today: 0, last_match_date: "" } },
      gameData: {},
    });
    [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
  }

  // Parse existing arena data
  const progressData = (progress.progressData || {}) as Record<string, any>;
  const arena = progressData.arena || {
    wins: 0,
    losses: 0,
    draws: 0,
    streak: 0,
    best_streak: 0,
    faction_wins: {} as Record<string, number>,
    factions_played: [] as number[],
    matches_today: 0,
    last_match_date: "",
  };

  // Calculate XP reward
  let xpAwarded = 0;
  const today = new Date().toISOString().split("T")[0];

  if (isPractice) {
    xpAwarded = result === "win" ? XP_REWARDS.practice_win : XP_REWARDS.practice_loss;
  } else {
    if (result === "win") {
      xpAwarded = XP_REWARDS.win;
      arena.wins = (arena.wins || 0) + 1;
      arena.streak = (arena.streak || 0) + 1;
      if (arena.streak > (arena.best_streak || 0)) {
        arena.best_streak = arena.streak;
      }
      // First win of the day bonus
      if (arena.last_match_date !== today) {
        xpAwarded += XP_REWARDS.first_win_bonus;
        arena.matches_today = 0;
      }
      // Track faction wins
      const fKey = factionId.toString();
      arena.faction_wins = arena.faction_wins || {};
      arena.faction_wins[fKey] = (arena.faction_wins[fKey] || 0) + 1;
    } else if (result === "loss") {
      xpAwarded = XP_REWARDS.loss;
      arena.losses = (arena.losses || 0) + 1;
      arena.streak = 0;
    } else {
      xpAwarded = XP_REWARDS.draw;
      arena.draws = (arena.draws || 0) + 1;
    }
  }

  // Track factions played
  if (!arena.factions_played) arena.factions_played = [];
  if (!arena.factions_played.includes(factionId)) {
    arena.factions_played.push(factionId);
  }

  arena.matches_today = (arena.matches_today || 0) + 1;
  arena.last_match_date = today;

  // Calculate new totals
  const newTotalXp = (progress.xp || 0) + xpAwarded;
  const newLevel = Math.floor(newTotalXp / 500) + 1; // Level up every 500 XP
  const newPoints = (progress.points || 0) + Math.floor(xpAwarded / 2);

  // Determine title from arena wins
  let newTitle = "Recruit";
  for (const t of ARENA_TITLES) {
    if ((arena.wins || 0) >= t.wins) newTitle = t.title;
  }

  // Update progress data
  progressData.arena = arena;

  await db
    .update(userProgress)
    .set({
      xp: newTotalXp,
      level: newLevel,
      points: newPoints,
      title: newTitle,
      progressData,
    })
    .where(eq(userProgress.userId, userId));

  // Check achievements
  const achievementsUnlocked: string[] = [];

  for (const ach of ARENA_ACHIEVEMENTS) {
    const cond = ach.condition as Record<string, number | undefined>;

    let earned = false;
    if (cond.wins !== undefined && (arena.wins || 0) >= cond.wins) {
      earned = true;
    }
    if (cond.win_streak !== undefined && (arena.best_streak || 0) >= cond.win_streak) {
      earned = true;
    }
    if (cond.factions_played !== undefined && (arena.factions_played?.length || 0) >= cond.factions_played) {
      earned = true;
    }
    if (cond.faction_id !== undefined && cond.faction_wins !== undefined) {
      const fWins = arena.faction_wins?.[cond.faction_id.toString()] || 0;
      earned = fWins >= cond.faction_wins;
    } else if (cond.faction_wins !== undefined && cond.faction_id === undefined) {
      // Any faction with N wins
      const maxFactionWins = Math.max(0, ...Object.values(arena.faction_wins || {}).map(Number));
      earned = maxFactionWins >= cond.faction_wins;
    }

    if (earned) {
      // Check if already unlocked
      const [existing] = await db
        .select()
        .from(userAchievements)
        .where(
          and(
            eq(userAchievements.userId, userId),
            eq(userAchievements.achievementId, ach.id)
          )
        )
        .limit(1);

      if (!existing) {
        await db.insert(userAchievements).values({
          userId,
          achievementId: ach.id,
        });
        achievementsUnlocked.push(ach.id);
        // Bonus XP for achievement
        // (already factored into the XP total via the achievement's xpReward)
      }
    }
  }

  return {
    xpAwarded,
    newTotalXp,
    newLevel,
    newTitle,
    achievementsUnlocked,
  };
}

export function registerDuelystApi(app: Express) {
  // ═══ SESSION ENDPOINTS ═══

  // POST /session — Login or auto-create account
  app.post("/session", (req: Request, res: Response) => {
    try {
      const { username, password } = req.body || {};
      if (!username) {
        return res.status(400).json({ error: "Username required" });
      }

      // Generate a deterministic user ID from the username
      let userId: string;
      const existingUser = gameUsers.get(username.toLowerCase());

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Auto-create the user (no real auth needed for single-player)
        userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        gameUsers.set(username.toLowerCase(), {
          id: userId,
          username,
          password: password || "",
        });
      }

      const token = createGameToken(userId, username);

      // Return in the format the Duelyst client expects
      return res.json({
        token,
        analytics_data: {
          last_session_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      console.error("[Duelyst API] Session POST error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /session — Verify existing token
  app.get("/session", (req: Request, res: Response) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const user = verifyGameToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Return refreshed token + analytics
    const newToken = createGameToken(user.id, user.username);
    return res.json({
      token: newToken,
      analytics_data: {
        last_session_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    });
  });

  // POST /session/username_available — Check if username is available
  app.post("/session/username_available", (req: Request, res: Response) => {
    try {
      const { username } = req.body || {};
      if (!username || username.length < 3) {
        return res.json({ available: false });
      }
      // In our single-player bridge, all usernames are available
      return res.json({ available: true });
    } catch (err: any) {
      console.error("[Duelyst API] Username check error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /session/change_username — Set or change username
  app.post("/session/change_username", (req: Request, res: Response) => {
    try {
      const token = extractToken(req);
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const user = verifyGameToken(token);
      if (!user) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const username = req.body?.new_username || req.body?.username;
      if (!username || username.length < 3) {
        return res.status(400).json({ error: "Username must be at least 3 characters" });
      }

      // Update the in-memory user store
      const oldKey = user.username.toLowerCase();
      const existingUser = gameUsers.get(oldKey);
      if (existingUser) {
        gameUsers.delete(oldKey);
        existingUser.username = username;
        gameUsers.set(username.toLowerCase(), existingUser);
      }

      // Return a new token with the updated username
      const newToken = createGameToken(user.id, username);
      console.log(`[Duelyst API] Username changed: ${user.username} → ${username}`);

      return res.json({
        token: newToken,
        username,
      });
    } catch (err: any) {
      console.error("[Duelyst API] Change username error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /session/logout — Logout
  app.get("/session/logout", (_req: Request, res: Response) => {
    return res.json({ success: true });
  });

  // ═══ /api/me/* ENDPOINTS (redirected from staging.duelyst.org) ═══

  // POST /api/me/rank — Season rank data (critical for main menu)
  app.post("/api/me/rank", (_req: Request, res: Response) => {
    return res.json({
      rank: 30,
      stars: 0,
      stars_required: 1,
      win_streak: 0,
      is_unread: false,
      top_rank: 30,
      top_rank_starting_at: new Date().toISOString(),
      top_rank_ladder_position: null,
      delta: 0,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
  });

  // GET /api/me/rank — Season rank data
  app.get("/api/me/rank", (_req: Request, res: Response) => {
    return res.json({
      rank: 30,
      stars: 0,
      stars_required: 1,
      win_streak: 0,
      is_unread: false,
      top_rank: 30,
      top_rank_starting_at: new Date().toISOString(),
      top_rank_ladder_position: null,
    });
  });

  // GET /api/me/rank/history — Season rank history
  app.get("/api/me/rank/history", (_req: Request, res: Response) => {
    return res.json([]);
  });
  app.get("/api/me/rank/history/*", (_req: Request, res: Response) => {
    return res.json([]);
  });

  // GET /api/me/rank/current_ladder_position
  app.get("/api/me/rank/current_ladder_position", (_req: Request, res: Response) => {
    return res.json({ position: null });
  });

  // GET /api/me/inventory/card_collection — Card collection
  app.get("/api/me/inventory/card_collection", (_req: Request, res: Response) => {
    return res.json(getStarterCollection());
  });
  app.all("/api/me/inventory/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  // GET /api/me/quests/daily — Daily quests
  app.get("/api/me/quests/daily", (_req: Request, res: Response) => {
    return res.json({ quests: [] });
  });
  app.all("/api/me/quests/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  // GET /api/me/challenges/* — Challenges
  app.all("/api/me/challenges/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  // GET /api/me/achievements/* — Achievements
  app.all("/api/me/achievements/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  // GET /api/me/decks — Player decks
  app.get("/api/me/decks", (_req: Request, res: Response) => {
    return res.json([]);
  });

  // GET /api/me/games/* — Game history
  app.all("/api/me/games/*", (_req: Request, res: Response) => {
    return res.json([]);
  });

  // GET /api/me/gauntlet/* — Gauntlet runs
  app.all("/api/me/gauntlet/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  // GET /api/me/rift/* — Rift runs
  app.all("/api/me/rift/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  // GET /api/me/crates/* — Crates
  app.all("/api/me/crates/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  // GET /api/me/shop/* — Shop
  app.all("/api/me/shop/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  // GET /api/me/new_player_progression — New player progression
  app.all("/api/me/new_player_progression", (_req: Request, res: Response) => {
    return res.json({ stage: 0, module_name: null, is_complete: true });
  });
  app.all("/api/me/new_player_progression/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  // GET /api/me/referrals — Referrals
  app.all("/api/me/referrals", (_req: Request, res: Response) => {
    return res.json({ referrals: [], summary: {} });
  });
  app.all("/api/me/referrals/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  // GET /api/me/rewards/* — Rewards
  app.all("/api/me/rewards/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  // GET /api/me/spectate/* — Spectate
  app.all("/api/me/spectate/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  // GET /api/me — User profile
  app.get("/api/me", (_req: Request, res: Response) => {
    return res.json({});
  });

  // GET /api/users/* — Other users
  app.all("/api/users/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  // Catch-all for any other /api/me/* endpoints
  app.all("/api/me/*", (req: Request, res: Response) => {
    console.log(`[Duelyst API] Unhandled /api/me endpoint: ${req.method} ${req.path}`);
    return res.json({});
  });

  // Catch-all for other /session/* endpoints
  app.all("/session/*", (req: Request, res: Response) => {
    console.log(`[Duelyst API] Unhandled session endpoint: ${req.method} ${req.path}`);
    return res.json({});
  });

  // ═══ GAME DATA ENDPOINTS ═══

  // GET /game/faction_progression — Returns faction XP/levels
  app.get(
    "/game/faction_progression",
    (req: Request, res: Response) => {
      const token = extractToken(req);
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Return default faction progression for all 6 factions
      const factions: Record<string, any> = {};
      for (let i = 1; i <= 6; i++) {
        factions[i.toString()] = {
          faction_id: i,
          xp: 0,
          level: 0,
          xp_earned: 0,
          is_unread: false,
          win_count: 0,
          loss_count: 0,
          draw_count: 0,
          top_rank: 30,
          top_rank_starting_at: new Date().toISOString(),
          top_rank_ladder_position: null,
        };
      }

      return res.json(factions);
    }
  );

  // GET /game/inventory — Returns player cards and resources
  app.get("/game/inventory", (req: Request, res: Response) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Return a starter inventory with basic cards
    return res.json({
      card_collection: getStarterCollection(),
      spirit_orbs: 5,
      spirit_orbs_count: 5,
      gold: DEFAULT_GOLD,
      spirit: DEFAULT_SPIRIT,
      wallet: {
        gold_amount: DEFAULT_GOLD,
        spirit_amount: DEFAULT_SPIRIT,
        premium_amount: 0,
      },
    });
  });

  // GET /game/matchmaking/* — Matchmaking endpoints (stub for single-player)
  app.get("/game/matchmaking/:type", (_req: Request, res: Response) => {
    return res.json({ status: "idle", players_online: 1 });
  });

  // POST /game/matchmaking/:type — Start matchmaking (stub)
  app.post(
    "/game/matchmaking/:type",
    (_req: Request, res: Response) => {
      return res.json({ status: "searching", estimated_wait: 0 });
    }
  );

  // GET /game/rank — Player rank
  app.get("/game/rank", (req: Request, res: Response) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return res.json({
      rank: 30,
      stars: 0,
      stars_required: 1,
      win_streak: 0,
      is_unread: false,
      top_rank: 30,
      top_rank_starting_at: new Date().toISOString(),
      top_rank_ladder_position: null,
    });
  });

  // GET /game/quests — Daily quests
  app.get("/game/quests", (req: Request, res: Response) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return res.json({
      quests: [],
      daily_challenge: null,
    });
  });

  // ═══ PROGRESSION INTEGRATION ENDPOINTS ═══

  // POST /game/match_complete — Report a match result and award XP
  app.post("/game/match_complete", async (req: Request, res: Response) => {
    try {
      const user = getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = parseInt(user.id, 10);
      const isLoredexUser = !isNaN(userId);

      const {
        result,        // "win" | "loss" | "draw"
        faction_id,    // 1-6
        is_practice,   // boolean
        opponent_name, // string (optional)
        general_id,    // number (optional)
        turns,         // number (optional)
      } = req.body || {};

      if (!result || !["win", "loss", "draw"].includes(result)) {
        return res.status(400).json({ error: "Invalid result. Must be 'win', 'loss', or 'draw'" });
      }

      const factionId = parseInt(faction_id, 10) || 1;
      const isPractice = !!is_practice;

      // Only award XP for Loredex-authenticated users
      if (isLoredexUser) {
        const reward = await awardMatchXp(userId, result, factionId, isPractice);

        console.log(
          `[Arena] User ${userId} ${result} (F${factionId}${isPractice ? " practice" : ""}) → +${reward.xpAwarded} XP (total: ${reward.newTotalXp}, level: ${reward.newLevel})`
        );

        return res.json({
          success: true,
          xp_awarded: reward.xpAwarded,
          total_xp: reward.newTotalXp,
          level: reward.newLevel,
          title: reward.newTitle,
          achievements_unlocked: reward.achievementsUnlocked,
        });
      } else {
        // Guest/manual login — acknowledge but don't persist
        console.log(`[Arena] Guest ${user.username} ${result} (F${factionId}) — no XP awarded (not logged in via Loredex)`);
        return res.json({
          success: true,
          xp_awarded: 0,
          total_xp: 0,
          level: 1,
          title: "Guest",
          achievements_unlocked: [],
          message: "Log in via Loredex OS to earn XP and achievements!",
        });
      }
    } catch (err: any) {
      console.error("[Arena] Match complete error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /game/arena_stats — Get arena stats for the current user
  app.get("/game/arena_stats", async (req: Request, res: Response) => {
    try {
      const user = getUserFromToken(req);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = parseInt(user.id, 10);
      if (isNaN(userId)) {
        return res.json({ arena: { wins: 0, losses: 0, draws: 0, streak: 0, best_streak: 0, total_xp: 0, level: 1, title: "Guest", points: 0 }, achievements: [], achievement_definitions: ARENA_ACHIEVEMENTS });
      }

      const { getDb } = await import("./db");
      const { userProgress, userAchievements } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      const db = await getDb();
      if (!db) {
        return res.json({ arena: null, achievements: [] });
      }

      const [progress] = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId))
        .limit(1);

      const achievements = await db
        .select()
        .from(userAchievements)
        .where(eq(userAchievements.userId, userId));

      const arena = (progress?.progressData as any)?.arena || {
        wins: 0,
        losses: 0,
        draws: 0,
        streak: 0,
        best_streak: 0,
        faction_wins: {},
        factions_played: [],
      };

      return res.json({
        arena: {
          ...arena,
          total_xp: progress?.xp || 0,
          level: progress?.level || 1,
          title: progress?.title || "Recruit",
          points: progress?.points || 0,
        },
        achievements: achievements.map((a) => a.achievementId),
        achievement_definitions: ARENA_ACHIEVEMENTS,
      });
    } catch (err: any) {
      console.error("[Arena] Stats error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Matchmaking endpoint (redirected from staging.duelyst.org)
  app.all("/matchmaking", (_req: Request, res: Response) => {
    return res.json({ status: "idle", players_online: 1 });
  });
  app.all("/matchmaking/*", (_req: Request, res: Response) => {
    return res.json({ status: "idle", players_online: 1 });
  });

  // Replays endpoint
  app.all("/replays/*", (_req: Request, res: Response) => {
    return res.json([]);
  });
  app.all("/replay", (_req: Request, res: Response) => {
    return res.json({});
  });

  // Forgot password (stub)
  app.all("/forgot", (_req: Request, res: Response) => {
    return res.json({ success: true });
  });

  // Catch-all for other /game/* endpoints
  app.all("/game/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  console.log(
    "[Duelyst API] Bridge registered \u2014 session + game + arena progression endpoints active"
  );
}

/**
 * Returns a starter card collection with basic neutral and faction cards.
 * Card IDs follow the Open Duelyst numbering system.
 */
function getStarterCollection(): Record<string, number> {
  const collection: Record<string, number> = {};

  // Give 3 copies of basic neutral cards (IDs 1-30)
  for (let i = 1; i <= 30; i++) {
    collection[i.toString()] = 3;
  }

  // Give 3 copies of basic faction cards for each faction
  // Faction 1 (Lyonar/Empire): 101-130
  // Faction 2 (Songhai/Insurgency): 201-230
  // Faction 3 (Vetruvian/Hierarchy): 301-330
  // Faction 4 (Abyssian/Thought Virus): 401-430
  // Faction 5 (Magmar/New Babylon): 501-530
  // Faction 6 (Vanar/Potentials): 601-630
  for (const base of [100, 200, 300, 400, 500, 600]) {
    for (let i = 1; i <= 30; i++) {
      collection[(base + i).toString()] = 3;
    }
  }

  // Add generals (1 copy each)
  // Each faction has 2 generals
  for (const generalId of [
    1, 2, 101, 102, 201, 202, 301, 302, 401, 402, 501, 502, 601, 602,
  ]) {
    collection[generalId.toString()] = 1;
  }

  return collection;
}
