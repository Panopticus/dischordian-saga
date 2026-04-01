import { type Express, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

/**
 * Duelyst API Bridge
 *
 * Provides the REST endpoints that the Duelyst game client expects:
 * - POST /session       — Login (create session token)
 * - GET  /session       — Verify existing session token
 * - GET  /session/logout — Logout
 * - GET  /game/faction_progression — Faction data
 * - GET  /game/inventory — Player inventory
 * - GET  /game/matchmaking/casual — Matchmaking status
 *
 * All endpoints return data in the format the Duelyst client expects.
 * This is a single-player bridge — no real matchmaking server needed.
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

  // GET /session/logout — Logout
  app.get("/session/logout", (_req: Request, res: Response) => {
    return res.json({ success: true });
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

  // Catch-all for other /game/* endpoints
  app.all("/game/*", (_req: Request, res: Response) => {
    return res.json({});
  });

  console.log(
    "[Duelyst API] Bridge registered \u2014 session + game endpoints active"
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
  for (const generalId of [1, 2, 101, 102, 201, 202, 301, 302, 401, 402, 501, 502, 601, 602]) {
    collection[generalId.toString()] = 1;
  }

  return collection;
}
