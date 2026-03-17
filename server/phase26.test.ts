/**
 * Phase 26 Tests: Trade Empire Narrative, Fighter Character Models,
 * Enhanced Level Design, Missing Image Fixes
 */
import { describe, it, expect } from "vitest";

/* ═══ TRADE EMPIRE RENAME ═══ */
describe("Trade Empire Rename", () => {
  it("should have Trade Empire router (renamed from Trade Wars)", async () => {
    const { tradeWarsRouter } = await import("./routers/tradeWars");
    expect(tradeWarsRouter).toBeDefined();
    const procedures = Object.keys(tradeWarsRouter._def.procedures);
    expect(procedures.length).toBeGreaterThan(5);
  });

  it("should have faction choice procedure", async () => {
    const { tradeWarsRouter } = await import("./routers/tradeWars");
    const procedures = Object.keys(tradeWarsRouter._def.procedures);
    expect(procedures).toContain("chooseFaction");
  });

  it("should have tutorial advancement procedure", async () => {
    const { tradeWarsRouter } = await import("./routers/tradeWars");
    const procedures = Object.keys(tradeWarsRouter._def.procedures);
    expect(procedures).toContain("advanceTutorial");
  });

  it("should have relic discovery procedure", async () => {
    const { tradeWarsRouter } = await import("./routers/tradeWars");
    const procedures = Object.keys(tradeWarsRouter._def.procedures);
    expect(procedures).toContain("discoverRelic");
  });

  it("should have research/tech tree procedure", async () => {
    const { tradeWarsRouter } = await import("./routers/tradeWars");
    const procedures = Object.keys(tradeWarsRouter._def.procedures);
    expect(procedures).toContain("research");
  });
});

/* ═══ TRADE EMPIRE SCHEMA ═══ */
describe("Trade Empire Schema", () => {
  it("should have faction field in twPlayerState", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.twPlayerState).toBeDefined();
    // Check that the table has the faction column
    const columns = Object.keys(schema.twPlayerState);
    expect(columns).toContain("faction");
  });

  it("should have tutorialStep field in twPlayerState", async () => {
    const schema = await import("../drizzle/schema");
    const columns = Object.keys(schema.twPlayerState);
    expect(columns).toContain("tutorialStep");
  });

  it("should have discoveredRelics field in twPlayerState", async () => {
    const schema = await import("../drizzle/schema");
    const columns = Object.keys(schema.twPlayerState);
    expect(columns).toContain("discoveredRelics");
  });

  it("should have researchPoints and unlockedTech fields in twPlayerState", async () => {
    const schema = await import("../drizzle/schema");
    const columns = Object.keys(schema.twPlayerState);
    expect(columns).toContain("researchPoints");
    expect(columns).toContain("unlockedTech");
  });
});

/* ═══ FIGHTER CHARACTER SPRITES ═══ */
describe("Fighter Character Sprites", () => {
  it("should have unique imageUrl for all 26 fighters", async () => {
    const { CHARACTER_CONFIGS } = await import("../client/src/game/CharacterModel3D");
    expect(CHARACTER_CONFIGS).toBeDefined();
    
    const urls = new Set<string>();
    let fighterCount = 0;
    for (const [_id, config] of Object.entries(CHARACTER_CONFIGS)) {
      if (config.imageUrl) {
        urls.add(config.imageUrl);
        fighterCount++;
      }
    }
    expect(fighterCount).toBeGreaterThanOrEqual(26);
    expect(urls.size).toBe(fighterCount); // All unique
  });

  it("should have CDN URLs for all fighter sprites", async () => {
    const { CHARACTER_CONFIGS } = await import("../client/src/game/CharacterModel3D");
    for (const [_id, config] of Object.entries(CHARACTER_CONFIGS)) {
      if (config.imageUrl) {
        expect(config.imageUrl).toMatch(/^https:\/\//);
        expect(config.imageUrl).toContain("cloudfront.net");
      }
    }
  });

  it("should have fighting-stance sprite URLs (not portrait images)", async () => {
    const { CHARACTER_CONFIGS } = await import("../client/src/game/CharacterModel3D");
    for (const [id, config] of Object.entries(CHARACTER_CONFIGS)) {
      if (config.imageUrl) {
        // All sprites should be fighter_ prefixed, character-specific, or demon sprites
        const demonIds = ["molgrath", "xethraal", "vexahlia", "draelmon", "nykoth", "sylvex", "varkul", "fenra", "ithrael"];
        if (demonIds.includes(id)) {
          // Demon sprites use CDN URLs from generated images
          expect(config.imageUrl).toMatch(/cloudfront\.net|manus/);
        } else {
          expect(config.imageUrl).toMatch(/fighter_|agent_zero|akai_shi|wraith_calder|iron_lion|game_master|shadow_tongue/);
        }
      }
    }
  });
});

/* ═══ TRADE EMPIRE NARRATIVE ═══ */
describe("Trade Empire Narrative Content", () => {
  it("should reference the Thought Virus in the game narrative", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/TradeWarsPage.tsx", "utf-8");
    expect(content.toLowerCase()).toContain("thought virus");
  });

  it("should reference Inception Arks in the game narrative", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/TradeWarsPage.tsx", "utf-8");
    expect(content.toLowerCase()).toContain("inception ark");
  });

  it("should have faction choice between Empire and Insurgency", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/TradeWarsPage.tsx", "utf-8");
    expect(content).toContain("empire");
    expect(content.toLowerCase()).toContain("insurgency");
  });

  it("should reference the Architect faction", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/TradeWarsPage.tsx", "utf-8");
    expect(content).toContain("Architect");
  });

  it("should reference the Dreamer faction", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/TradeWarsPage.tsx", "utf-8");
    expect(content).toContain("Dreamer");
  });

  it("should have tutorial system", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/TradeWarsPage.tsx", "utf-8");
    expect(content.toLowerCase()).toContain("tutorial");
  });

  it("should have pre-Fall relic discovery", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/TradeWarsPage.tsx", "utf-8");
    expect(content.toLowerCase()).toContain("relic");
  });

  it("should have Civilization-style mechanics", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/TradeWarsPage.tsx", "utf-8");
    // Should have research/tech tree and colonization mechanics
    expect(content.toLowerCase()).toContain("research");
    expect(content.toLowerCase()).toContain("coloniz");
  });

  it("should explain the first 1000 Potentials disappearing", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/TradeWarsPage.tsx", "utf-8");
    expect(content).toContain("1000");
    expect(content.toLowerCase()).toContain("disappear");
  });

  it("should mention first contact with pre-reality race", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/TradeWarsPage.tsx", "utf-8");
    expect(content.toLowerCase()).toContain("first contact");
  });
});

/* ═══ ENHANCED LEVEL DESIGN ═══ */
describe("Enhanced Fight Arena Level Design", () => {
  it("should have enhanced stage building with pillars and archway", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/game/FightEngine3D.ts", "utf-8");
    expect(content).toContain("PILLARS");
    expect(content).toContain("ARCHWAY");
    expect(content).toContain("TorusGeometry"); // emblem rings
    expect(content).toContain("FLOATING PARTICLES");
  });

  it("should have floor glow energy channels", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/game/FightEngine3D.ts", "utf-8");
    expect(content).toContain("FLOOR GLOW LINES");
    expect(content).toContain("energy channels");
  });

  it("should have spectator barriers on sides", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/game/FightEngine3D.ts", "utf-8");
    expect(content).toContain("SIDE DECORATIONS");
    expect(content).toContain("barriers");
  });
});

/* ═══ GAME DATA REFERENCES ═══ */
describe("Game Data - Trade Empire References", () => {
  it("should reference Trade Empire in GamesPage simulations", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/GamesPage.tsx", "utf-8");
    expect(content).toContain("TRADE EMPIRE");
  });

  it("should have /trade-empire route in App.tsx", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/App.tsx", "utf-8");
    expect(content).toContain("/trade-empire");
  });
});
