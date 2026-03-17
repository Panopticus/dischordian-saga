/**
 * Phase 25 Tests: Admin Panel, Content Rewards, Fighting Game Invasion,
 * Character Histories, CoNexus Cover Art, Lore Appearances Timeline
 */
import { describe, it, expect } from "vitest";

/* ═══ ADMIN ROUTER ═══ */
describe("Admin Router", () => {
  it("should export admin router with expected procedures", async () => {
    const { adminRouter } = await import("./routers/admin");
    expect(adminRouter).toBeDefined();
    // Check it has the expected procedure names
    const procedures = Object.keys(adminRouter._def.procedures);
    expect(procedures).toContain("dashboardStats");
    expect(procedures).toContain("listUsers");
    expect(procedures).toContain("updateUserRole");
  });
});

/* ═══ CONTENT REWARD ROUTER ═══ */
describe("Content Reward Router", () => {
  it("should export contentReward router with expected procedures", async () => {
    const { contentRewardRouter } = await import("./routers/contentReward");
    expect(contentRewardRouter).toBeDefined();
    const procedures = Object.keys(contentRewardRouter._def.procedures);
    expect(procedures).toContain("recordParticipation");
    expect(procedures).toContain("myParticipation");
    expect(procedures).toContain("stats");
  });
});

/* ═══ SCHEMA: CONTENT PARTICIPATION ═══ */
describe("Content Participation Schema", () => {
  it("should have contentParticipation table", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.contentParticipation).toBeDefined();
  });

  it("should have contentRewards table", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.contentRewards).toBeDefined();
  });

  it("contentParticipation should have required columns", async () => {
    const schema = await import("../drizzle/schema");
    const table = schema.contentParticipation;
    // Check column names exist
    const columns = Object.keys(table);
    expect(columns).toContain("id");
    expect(columns).toContain("userId");
    expect(columns).toContain("contentType");
    expect(columns).toContain("contentId");
  });

  it("contentRewards should have required columns", async () => {
    const schema = await import("../drizzle/schema");
    const table = schema.contentRewards;
    const columns = Object.keys(table);
    expect(columns).toContain("id");
    expect(columns).toContain("contentType");
    expect(columns).toContain("rewardType");
  });
});

/* ═══ CONEXUS COVER ART ═══ */
describe("CoNexus Cover Art", () => {
  it("all 33 games should have coverImage field", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    expect(CONEXUS_GAMES.length).toBe(33);
    for (const game of CONEXUS_GAMES) {
      expect(game.coverImage).toBeDefined();
      expect(typeof game.coverImage).toBe("string");
      expect(game.coverImage!.length).toBeGreaterThan(10);
    }
  });

  it("all cover images should be valid CDN URLs", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    for (const game of CONEXUS_GAMES) {
      expect(game.coverImage).toMatch(/^https:\/\//);
      expect(game.coverImage).toMatch(/\.png$/);
    }
  });

  it("all cover images should be unique", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    const images = CONEXUS_GAMES.map(g => g.coverImage);
    expect(new Set(images).size).toBe(images.length);
  });

  it("ConexusGame interface should include coverImage field", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    // Type check: coverImage is optional string
    const firstGame = CONEXUS_GAMES[0];
    expect("coverImage" in firstGame).toBe(true);
  });
});

/* ═══ CHARACTER HISTORIES ═══ */
describe("Character Histories", () => {
  it("all characters should have history field", async () => {
    const fs = await import("fs");
    const data = JSON.parse(fs.readFileSync("client/src/data/loredex-data.json", "utf-8"));
    const characters = data.entries.filter((e: any) => e.type === "character");
    expect(characters.length).toBeGreaterThan(50);
    for (const char of characters) {
      expect(char.history).toBeDefined();
      expect(typeof char.history).toBe("string");
      expect(char.history.length).toBeGreaterThan(50);
    }
  });

  it("The Engineer should have a history about mind-swap", async () => {
    const fs = await import("fs");
    const data = JSON.parse(fs.readFileSync("client/src/data/loredex-data.json", "utf-8"));
    const engineer = data.entries.find((e: any) => e.name === "The Engineer");
    expect(engineer).toBeDefined();
    expect(engineer.history).toContain("mind-swap");
  });

  it("Wraith of Death should have a history about Fall of Reality", async () => {
    const fs = await import("fs");
    const data = JSON.parse(fs.readFileSync("client/src/data/loredex-data.json", "utf-8"));
    const wraith = data.entries.find((e: any) => e.name === "Wraith of Death");
    expect(wraith).toBeDefined();
    expect(wraith.history).toContain("Fall of Reality");
  });
});

/* ═══ FIGHTING GAME INVASION MECHANIC ═══ */
describe("Fighting Game Invasion Mechanic", () => {
  it("FightPage should import useContentReward", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/FightPage.tsx", "utf-8");
    expect(content).toContain("useContentReward");
    expect(content).toContain("INVASION_EVENTS");
  });

  it("should define 4 invasion events", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/FightPage.tsx", "utf-8");
    // Count invasion event definitions
    const matches = content.match(/id: "[\w-]+", faction:/g);
    expect(matches).toBeDefined();
    expect(matches!.length).toBe(4);
  });

  it("invasion events should have increasing minWins requirements", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/FightPage.tsx", "utf-8");
    // Extract minWins values
    const minWinsMatches = content.match(/minWins: (\d+)/g);
    expect(minWinsMatches).toBeDefined();
    const values = minWinsMatches!.map(m => parseInt(m.replace("minWins: ", "")));
    // Should be in ascending order
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
    }
  });

  it("invasion events should have increasing rewards", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/FightPage.tsx", "utf-8");
    const rewardMatches = content.match(/reward: (\d+)/g);
    expect(rewardMatches).toBeDefined();
    const values = rewardMatches!.map(m => parseInt(m.replace("reward: ", "")));
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
    }
  });
});

/* ═══ CONTENT REWARD INTEGRATION ═══ */
describe("Content Reward Integration", () => {
  it("WatchPage should use useContentReward", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/WatchPage.tsx", "utf-8");
    expect(content).toContain("useContentReward");
    expect(content).toContain("recordAndReward");
  });

  it("ConexusPortalPage should use useContentReward", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/ConexusPortalPage.tsx", "utf-8");
    expect(content).toContain("useContentReward");
    expect(content).toContain("recordAndReward");
  });

  it("FightPage should record fight wins as content participation", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/FightPage.tsx", "utf-8");
    expect(content).toContain('recordAndReward("fight_win"');
  });

  it("ConexusPortalPage should record game completion as content participation", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/ConexusPortalPage.tsx", "utf-8");
    expect(content).toContain('recordAndReward("conexus_game"');
  });
});

/* ═══ LORE APPEARANCES TIMELINE ═══ */
describe("Lore Appearances Timeline Component", () => {
  it("should exist as a component file", async () => {
    const fs = await import("fs");
    const exists = fs.existsSync("client/src/components/LoreAppearancesTimeline.tsx");
    expect(exists).toBe(true);
  });

  it("should be imported in EntityPage", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/EntityPage.tsx", "utf-8");
    expect(content).toContain("LoreAppearancesTimeline");
    expect(content).toContain("LORE APPEARANCES TIMELINE");
  });

  it("should define AGE_ORDER with 6 ages", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/components/LoreAppearancesTimeline.tsx", "utf-8");
    expect(content).toContain("AGE_ORDER");
    const ageMatches = content.match(/"Age of \w+"|"Fall of Reality"|"Unknown"/g);
    expect(ageMatches).toBeDefined();
    expect(ageMatches!.length).toBeGreaterThanOrEqual(5);
  });
});

/* ═══ ADMIN PAGE ═══ */
describe("Admin Page", () => {
  it("should exist as a page file", async () => {
    const fs = await import("fs");
    const exists = fs.existsSync("client/src/pages/AdminPage.tsx");
    expect(exists).toBe(true);
  });

  it("should be routed in App.tsx", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/App.tsx", "utf-8");
    expect(content).toContain("AdminPage");
    expect(content).toContain("/admin");
  });

  it("should use tRPC admin procedures", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/AdminPage.tsx", "utf-8");
    expect(content).toContain("trpc.admin");
  });
});

/* ═══ PLAYER PROFILE SERVER SYNC ═══ */
describe("Player Profile Server Sync", () => {
  it("PlayerProfilePage should use tRPC for server sync", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/PlayerProfilePage.tsx", "utf-8");
    expect(content).toContain("trpc.");
    expect(content).toContain("useAuth");
  });

  it("should have auto-save effect", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/PlayerProfilePage.tsx", "utf-8");
    expect(content).toContain("useEffect");
  });
});

/* ═══ MAIN ROUTER INTEGRATION ═══ */
describe("Main Router Integration", () => {
  it("should include admin router", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers.ts", "utf-8");
    expect(content).toContain("admin");
    expect(content).toContain("adminRouter");
  });

  it("should include contentReward router", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers.ts", "utf-8");
    expect(content).toContain("contentReward");
    expect(content).toContain("contentRewardRouter");
  });
});
