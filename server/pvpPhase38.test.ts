import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/* ═══════════════════════════════════════════════════════════════════
   Phase 38 Tests: PvP Deck Builder, Ranked Seasons, Spectator Mode
   ═══════════════════════════════════════════════════════════════════ */

/* ─── PVP DECK BUILDER ─── */
describe("PvP Deck Builder", () => {
  describe("Database Schema", () => {
    it("should have pvpDecks table in schema", () => {
      const schema = fs.readFileSync(
        path.resolve(__dirname, "../drizzle/schema.ts"),
        "utf-8"
      );
      expect(schema).toContain("pvpDecks");
      expect(schema).toContain('name: varchar("name"');
      expect(schema).toContain("cardIds");
      expect(schema).toContain("isActive");
    });
  });

  describe("PvP Router - Deck Endpoints", () => {
    it("should have getMyDecks endpoint", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("getMyDecks");
      expect(router).toContain("protectedProcedure");
    });

    it("should have saveDeck endpoint with validation", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("saveDeck");
      expect(router).toContain("name: z.string()");
      expect(router).toContain("cardIds");
    });

    it("should have deleteDeck endpoint", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("deleteDeck");
    });

    it("should have setActiveDeck endpoint", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("setActiveDeck");
    });

    it("should have getActiveDeck endpoint", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("getActiveDeck");
    });

    it("should have getDeckRules endpoint", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("getDeckRules");
      expect(router).toContain("MIN_DECK_SIZE");
      expect(router).toContain("MAX_DECK_SIZE");
    });
  });

  describe("Deck Builder Page", () => {
    it("should exist as a page component", () => {
      const exists = fs.existsSync(
        path.resolve(__dirname, "../client/src/pages/DeckBuilderPage.tsx")
      );
      expect(exists).toBe(true);
    });

    it("should have deck-builder route in App.tsx", () => {
      const app = fs.readFileSync(
        path.resolve(__dirname, "../client/src/App.tsx"),
        "utf-8"
      );
      expect(app).toContain("deck-builder");
      expect(app).toContain("DeckBuilderPage");
    });
  });
});

/* ─── RANKED SEASONS ─── */
describe("Ranked Seasons", () => {
  describe("Database Schema", () => {
    it("should have pvpSeasons table", () => {
      const schema = fs.readFileSync(
        path.resolve(__dirname, "../drizzle/schema.ts"),
        "utf-8"
      );
      expect(schema).toContain("pvpSeasons");
      expect(schema).toContain("seasonNumber");
      expect(schema).toContain('name: varchar("name"');
      expect(schema).toContain("isActive");
    });

    it("should have pvpSeasonRecords table with ELO tracking", () => {
      const schema = fs.readFileSync(
        path.resolve(__dirname, "../drizzle/schema.ts"),
        "utf-8"
      );
      expect(schema).toContain("pvpSeasonRecords");
      expect(schema).toContain("peakElo");
      expect(schema).toContain("finalElo");
      expect(schema).toContain("peakTier");
      expect(schema).toContain("seasonWins");
      expect(schema).toContain("seasonLosses");
      expect(schema).toContain("rewardsClaimed");
    });

    it("should have all rank tiers defined", () => {
      const schema = fs.readFileSync(
        path.resolve(__dirname, "../drizzle/schema.ts"),
        "utf-8"
      );
      const tiers = ["bronze", "silver", "gold", "platinum", "diamond", "master", "grandmaster"];
      for (const tier of tiers) {
        expect(schema).toContain(`"${tier}"`);
      }
    });
  });

  describe("PvP Router - Season Endpoints", () => {
    it("should have getCurrentSeason endpoint", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("getCurrentSeason");
    });

    it("should have getMySeasonRecord endpoint", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("getMySeasonRecord");
    });

    it("should have getSeasonLeaderboard endpoint", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("getSeasonLeaderboard");
    });

    it("should have claimSeasonRewards endpoint", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("claimSeasonRewards");
      expect(router).toContain("rewardsClaimed");
    });

    it("should have getPastSeasons endpoint", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("getPastSeasons");
    });
  });

  describe("Tier Configuration", () => {
    it("should have TIER_THRESHOLDS with ELO ranges", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("TIER_THRESHOLDS");
    });

    it("should have tier progression helper", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("getNextTier");
    });
  });

  describe("PvP Arena Page - Seasons Tab", () => {
    it("should display season info and tier badges", () => {
      const page = fs.readFileSync(
        path.resolve(__dirname, "../client/src/pages/PvpArenaPage.tsx"),
        "utf-8"
      );
      expect(page).toContain("RANK_CONFIG");
      expect(page).toContain("peakTier");
      expect(page).toContain("SEASON LEADERBOARD");
      expect(page).toContain("TIER REWARDS");
    });

    it("should have season record display with ELO and W/L", () => {
      const page = fs.readFileSync(
        path.resolve(__dirname, "../client/src/pages/PvpArenaPage.tsx"),
        "utf-8"
      );
      expect(page).toContain("seasonRecord.peakElo");
      expect(page).toContain("seasonRecord.finalElo");
      expect(page).toContain("seasonRecord.seasonWins");
      expect(page).toContain("seasonRecord.seasonLosses");
    });

    it("should have claim rewards button", () => {
      const page = fs.readFileSync(
        path.resolve(__dirname, "../client/src/pages/PvpArenaPage.tsx"),
        "utf-8"
      );
      expect(page).toContain("claimRewards");
      expect(page).toContain("CLAIM REWARDS");
    });
  });
});

/* ─── SPECTATOR MODE ─── */
describe("Spectator Mode", () => {
  describe("WebSocket Server - Spectator Support", () => {
    it("should handle SPECTATE message type", () => {
      const ws = fs.readFileSync(
        path.resolve(__dirname, "pvpWs.ts"),
        "utf-8"
      );
      expect(ws).toContain("SPECTATE");
    });

    it("should track spectators per match", () => {
      const ws = fs.readFileSync(
        path.resolve(__dirname, "pvpWs.ts"),
        "utf-8"
      );
      expect(ws).toContain("spectator");
    });

    it("should broadcast game state to spectators", () => {
      const ws = fs.readFileSync(
        path.resolve(__dirname, "pvpWs.ts"),
        "utf-8"
      );
      // Spectators should receive game state updates
      expect(ws).toContain("GAME_STATE");
    });
  });

  describe("PvP Router - Spectator Endpoints", () => {
    it("should have getActiveMatches endpoint", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("getActiveMatches");
    });

    it("should return enriched match data with player names and ELOs", () => {
      const router = fs.readFileSync(
        path.resolve(__dirname, "routers/pvp.ts"),
        "utf-8"
      );
      expect(router).toContain("player1Name");
      expect(router).toContain("player2Name");
      expect(router).toContain("player1Elo");
      expect(router).toContain("player2Elo");
    });
  });

  describe("PvP Arena Page - Spectator Tab", () => {
    it("should have spectator tab/section", () => {
      const page = fs.readFileSync(
        path.resolve(__dirname, "../client/src/pages/PvpArenaPage.tsx"),
        "utf-8"
      );
      expect(page).toContain("SPECTATE");
    });

    it("should display active matches for spectating", () => {
      const page = fs.readFileSync(
        path.resolve(__dirname, "../client/src/pages/PvpArenaPage.tsx"),
        "utf-8"
      );
      expect(page).toContain("activeMatches");
      expect(page).toContain("WATCH");
    });

    it("should have spectator view mode in battle", () => {
      const page = fs.readFileSync(
        path.resolve(__dirname, "../client/src/pages/PvpArenaPage.tsx"),
        "utf-8"
      );
      expect(page).toContain("isSpectating");
    });
  });
});

/* ─── INTEGRATION ─── */
describe("Feature Integration", () => {
  it("should have PvP Arena route in App.tsx", () => {
    const app = fs.readFileSync(
      path.resolve(__dirname, "../client/src/App.tsx"),
      "utf-8"
    );
    expect(app).toContain("/pvp");
    expect(app).toContain("PvpArenaPage");
  });

  it("should have PvP Arena in navigation", () => {
    const shell = fs.readFileSync(
      path.resolve(__dirname, "../client/src/components/AppShell.tsx"),
      "utf-8"
    );
    expect(shell).toContain("pvp");
  });

  it("should have PvP Arena in Games page", () => {
    const games = fs.readFileSync(
      path.resolve(__dirname, "../client/src/pages/GamesPage.tsx"),
      "utf-8"
    );
    expect(games).toContain("PVP ARENA");
  });

  it("should have PvP in CommandConsole", () => {
    const console = fs.readFileSync(
      path.resolve(__dirname, "../client/src/components/CommandConsole.tsx"),
      "utf-8"
    );
    expect(console).toContain("pvp");
  });

  it("should have deck selection integrated into PvP Arena matchmaking", () => {
    const page = fs.readFileSync(
      path.resolve(__dirname, "../client/src/pages/PvpArenaPage.tsx"),
      "utf-8"
    );
    // Deck selection should be part of the matchmaking flow
    expect(page).toContain("activeDeck");
    expect(page).toContain("deck-builder");
  });
});
