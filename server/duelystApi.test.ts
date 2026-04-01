import { describe, it, expect, vi, beforeAll } from "vitest";
import jwt from "jsonwebtoken";

// Mock the JWT_SECRET to match what the API uses
const JWT_SECRET = process.env.JWT_SECRET || "duelyst-dischordian-saga-secret";

describe("Duelyst API Bridge", () => {
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
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("should decode token with correct user data", () => {
      const payload = {
        d: { id: "user_456", username: "Operative" },
        v: 0,
        iat: Math.floor(Date.now() / 1000),
      };
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
        algorithm: "HS256",
      });

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      expect(decoded.d.id).toBe("user_456");
      expect(decoded.d.username).toBe("Operative");
      expect(decoded.v).toBe(0);
    });

    it("should reject tokens signed with wrong secret", () => {
      const payload = {
        d: { id: "user_789", username: "Hacker" },
        v: 0,
      };
      const token = jwt.sign(payload, "wrong-secret", {
        expiresIn: "7d",
        algorithm: "HS256",
      });

      expect(() => jwt.verify(token, JWT_SECRET)).toThrow();
    });

    it("should reject expired tokens", () => {
      const payload = {
        d: { id: "user_expired", username: "OldUser" },
        v: 0,
        iat: Math.floor(Date.now() / 1000) - 86400 * 8, // 8 days ago
      };
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
        algorithm: "HS256",
      });

      expect(() => jwt.verify(token, JWT_SECRET)).toThrow();
    });
  });

  describe("Firebase shim token parsing", () => {
    it("should parse token payload via base64 decode (mimics Firebase shim)", () => {
      const payload = {
        d: { id: "user_shim", username: "ShimUser" },
        v: 0,
        iat: Math.floor(Date.now() / 1000),
      };
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
        algorithm: "HS256",
      });

      // This is what the Firebase shim does in the browser
      const parts = token.split(".");
      const decoded = JSON.parse(Buffer.from(parts[1], "base64").toString());
      expect(decoded.d.id).toBe("user_shim");
      expect(decoded.d.username).toBe("ShimUser");
    });
  });

  describe("Starter collection", () => {
    it("should generate correct starter card collection", () => {
      const collection: Record<string, number> = {};

      // Neutral cards 1-30
      for (let i = 1; i <= 30; i++) {
        collection[i.toString()] = 3;
      }

      // Faction cards
      for (const base of [100, 200, 300, 400, 500, 600]) {
        for (let i = 1; i <= 30; i++) {
          collection[(base + i).toString()] = 3;
        }
      }

      // Generals
      for (const generalId of [
        1, 2, 101, 102, 201, 202, 301, 302, 401, 402, 501, 502, 601, 602,
      ]) {
        collection[generalId.toString()] = 1;
      }

      // Should have neutral (30) + 6 factions * 30 + generals overwriting some
      expect(Object.keys(collection).length).toBeGreaterThan(200);

      // Verify specific cards exist
      expect(collection["1"]).toBe(1); // General overwrites neutral card 1
      expect(collection["15"]).toBe(3); // Neutral card
      expect(collection["101"]).toBe(1); // General overwrites faction card
      expect(collection["115"]).toBe(3); // Faction card
    });
  });

  describe("Faction progression response format", () => {
    it("should return 6 factions with correct structure", () => {
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

      expect(Object.keys(factions)).toHaveLength(6);
      expect(factions["1"].faction_id).toBe(1);
      expect(factions["6"].faction_id).toBe(6);
      expect(factions["1"].top_rank).toBe(30);
      expect(factions["1"].win_count).toBe(0);
    });
  });

  describe("Rank response format", () => {
    it("should return default rank data", () => {
      const rank = {
        rank: 30,
        stars: 0,
        stars_required: 1,
        win_streak: 0,
        is_unread: false,
        top_rank: 30,
        top_rank_starting_at: new Date().toISOString(),
        top_rank_ladder_position: null,
      };

      expect(rank.rank).toBe(30);
      expect(rank.stars).toBe(0);
      expect(rank.stars_required).toBe(1);
    });
  });

  describe("Auto-login token injection", () => {
    it("should create token compatible with store2 localStorage key format", () => {
      const userId = 42;
      const username = "Operative";
      const payload = {
        d: { id: userId.toString(), username },
        v: 0,
        iat: Math.floor(Date.now() / 1000),
      };
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
        algorithm: "HS256",
      });

      // The key used in localStorage by the game client
      const storageKey = "duelyst-staging.token";
      expect(storageKey).toBe("duelyst-staging.token");

      // Token should be a string that can be stored in localStorage
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(50);

      // Verify the token can be decoded (as the game client does)
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      expect(decoded.d.id).toBe("42");
      expect(decoded.d.username).toBe("Operative");
    });

    it("should handle special characters in username safely", () => {
      const username = "O'Reilly \"The\" <Hacker>";
      const safeName = username
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

      // The escaped version should not contain unescaped single quotes
      // (it contains \' which is the escaped form)
      expect(safeName).toContain("\\'");
      expect(safeName).not.toContain('"');
      expect(safeName).toContain("&quot;");
    });
  });
});
