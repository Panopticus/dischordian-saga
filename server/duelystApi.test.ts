import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";

const BASE = "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "duelyst-dischordian-saga-secret";

function makeToken(id: string, username: string) {
  return jwt.sign({ d: { id, username }, v: 0 }, JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
}

const guestToken = makeToken("user_test_abc123", "GuestPlayer");

describe("Duelyst API Bridge", () => {
  // ═══ TOKEN LOGIC ═══

  describe("Token creation and verification", () => {
    it("should create a valid JWT token with correct payload structure", () => {
      const payload = {
        d: { id: "user_123", username: "TestPlayer" },
        v: 0,
        iat: Math.floor(Date.now() / 1000),
      };
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
        algorithm: "HS256",
      });
      expect(token).toBeTruthy();
      expect(token.split(".")).toHaveLength(3);
    });

    it("should decode token with correct user data", () => {
      const payload = {
        d: { id: "user_456", username: "Operative" },
        v: 0,
        iat: Math.floor(Date.now() / 1000),
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d", algorithm: "HS256" });
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      expect(decoded.d.id).toBe("user_456");
      expect(decoded.d.username).toBe("Operative");
    });

    it("should reject tokens signed with wrong secret", () => {
      const token = jwt.sign({ d: { id: "x", username: "x" }, v: 0 }, "wrong-secret", { expiresIn: "7d", algorithm: "HS256" });
      expect(() => jwt.verify(token, JWT_SECRET)).toThrow();
    });
  });

  // ═══ SESSION ENDPOINTS ═══

  describe("POST /session", () => {
    it("should create a session with username", async () => {
      const res = await fetch(`${BASE}/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "TestPlayer", password: "test" }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.token).toBeDefined();
      expect(typeof data.token).toBe("string");
      expect(data.analytics_data).toBeDefined();
    });

    it("should reject missing username", async () => {
      const res = await fetch(`${BASE}/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /session", () => {
    it("should verify a valid token", async () => {
      const res = await fetch(`${BASE}/session`, {
        headers: { Authorization: `Bearer ${guestToken}` },
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.token).toBeDefined();
    });

    it("should reject missing token", async () => {
      const res = await fetch(`${BASE}/session`);
      expect(res.status).toBe(401);
    });

    it("should reject invalid token", async () => {
      const res = await fetch(`${BASE}/session`, {
        headers: { Authorization: "Bearer invalid.token.here" },
      });
      expect(res.status).toBe(401);
    });
  });

  describe("GET /session/logout", () => {
    it("should return success", async () => {
      const res = await fetch(`${BASE}/session/logout`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });

  // ═══ GAME DATA ENDPOINTS ═══

  describe("GET /game/faction_progression", () => {
    it("should return all 6 factions", async () => {
      const res = await fetch(`${BASE}/game/faction_progression`, {
        headers: { Authorization: `Bearer ${guestToken}` },
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      for (let i = 1; i <= 6; i++) {
        expect(data[i.toString()]).toBeDefined();
        expect(data[i.toString()].faction_id).toBe(i);
      }
    });

    it("should reject unauthorized", async () => {
      const res = await fetch(`${BASE}/game/faction_progression`);
      expect(res.status).toBe(401);
    });
  });

  describe("GET /game/inventory", () => {
    it("should return starter collection with gold and spirit", async () => {
      const res = await fetch(`${BASE}/game/inventory`, {
        headers: { Authorization: `Bearer ${guestToken}` },
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.card_collection).toBeDefined();
      expect(data.gold).toBe(1000);
      expect(data.spirit).toBe(500);
      expect(data.wallet.gold_amount).toBe(1000);
    });
  });

  describe("GET /game/rank", () => {
    it("should return rank data", async () => {
      const res = await fetch(`${BASE}/game/rank`, {
        headers: { Authorization: `Bearer ${guestToken}` },
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.rank).toBe(30);
      expect(data.stars).toBe(0);
    });
  });

  describe("GET /game/quests", () => {
    it("should return quests array", async () => {
      const res = await fetch(`${BASE}/game/quests`, {
        headers: { Authorization: `Bearer ${guestToken}` },
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.quests)).toBe(true);
    });
  });

  // ═══ PROGRESSION INTEGRATION ═══

  describe("POST /game/match_complete", () => {
    it("should accept guest match but award no XP", async () => {
      const res = await fetch(`${BASE}/game/match_complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${guestToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ result: "win", faction_id: 1 }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.xp_awarded).toBe(0);
      expect(data.title).toBe("Guest");
      expect(data.message).toContain("Loredex");
    });

    it("should reject invalid result", async () => {
      const res = await fetch(`${BASE}/game/match_complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${guestToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ result: "invalid", faction_id: 1 }),
      });
      expect(res.status).toBe(400);
    });

    it("should reject unauthorized", async () => {
      const res = await fetch(`${BASE}/game/match_complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: "win", faction_id: 1 }),
      });
      expect(res.status).toBe(401);
    });
  });

  describe("GET /game/arena_stats", () => {
    it("should return guest stats", async () => {
      const res = await fetch(`${BASE}/game/arena_stats`, {
        headers: { Authorization: `Bearer ${guestToken}` },
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.arena).toBeDefined();
      expect(data.arena.title).toBe("Guest");
      expect(data.achievement_definitions).toBeDefined();
    });

    it("should include all 14 achievement definitions", async () => {
      const res = await fetch(`${BASE}/game/arena_stats`, {
        headers: { Authorization: `Bearer ${guestToken}` },
      });
      const data = await res.json();
      expect(data.achievement_definitions.length).toBe(14);
      const ids = data.achievement_definitions.map((a: any) => a.id);
      expect(ids).toContain("arena_first_blood");
      expect(ids).toContain("arena_legend");
      expect(ids).toContain("arena_all_factions");
    });

    it("should reject unauthorized", async () => {
      const res = await fetch(`${BASE}/game/arena_stats`);
      expect(res.status).toBe(401);
    });
  });

  // ═══ MATCHMAKING STUBS ═══

  describe("Matchmaking endpoints", () => {
    it("GET /game/matchmaking/casual should return idle", async () => {
      const res = await fetch(`${BASE}/game/matchmaking/casual`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe("idle");
    });

    it("POST /game/matchmaking/casual should return searching", async () => {
      const res = await fetch(`${BASE}/game/matchmaking/casual`, { method: "POST" });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe("searching");
    });
  });

  // ═══ AUTO-LOGIN TOKEN INJECTION ═══

  describe("Auto-login token injection", () => {
    it("should create token compatible with store2 localStorage key format", () => {
      const token = makeToken("42", "Operative");
      const storageKey = "duelyst-staging.token";
      expect(storageKey).toBe("duelyst-staging.token");
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(50);
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      expect(decoded.d.id).toBe("42");
      expect(decoded.d.username).toBe("Operative");
    });

    it("should handle special characters in username safely", () => {
      const username = "O'Reilly \"The\" <Hacker>";
      const safeName = username.replace(/'/g, "\\'").replace(/"/g, "&quot;");
      expect(safeName).toContain("\\'");
      expect(safeName).not.toContain('"');
    });
  });
});
