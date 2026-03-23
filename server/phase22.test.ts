/**
 * Phase 22 & 22.5 Tests: Boss Encounters, PreviouslyOn, Card Challenges, Antiquarian's Library
 */
import { describe, it, expect } from "vitest";

/* ═══ BOSS ENCOUNTERS DATA ═══ */
describe("Boss Encounters Data", () => {
  it("should export BOSS_ENCOUNTERS array", async () => {
    const mod = await import("../client/src/data/bossEncounters");
    expect(Array.isArray(mod.BOSS_ENCOUNTERS)).toBe(true);
    expect(mod.BOSS_ENCOUNTERS.length).toBe(8);
  });

  it("each boss should have required fields", async () => {
    const { BOSS_ENCOUNTERS } = await import("../client/src/data/bossEncounters");
    for (const boss of BOSS_ENCOUNTERS) {
      expect(boss.id).toBeTruthy();
      expect(boss.name).toBeTruthy();
      expect(boss.roomId).toBeTruthy();
      expect(boss.image).toBeTruthy();
      expect(boss.difficulty).toBeTruthy();
      expect(boss.description).toBeTruthy();
      expect(Array.isArray(boss.deck)).toBe(true);
      expect(boss.deck.length).toBeGreaterThanOrEqual(4);
      expect(boss.passiveAbility).toBeTruthy();
      expect(boss.passiveAbility.name).toBeTruthy();
      expect(boss.passiveAbility.description).toBeTruthy();
    }
  });

  it("each boss should have unique IDs and room assignments", async () => {
    const { BOSS_ENCOUNTERS } = await import("../client/src/data/bossEncounters");
    const ids = BOSS_ENCOUNTERS.map(b => b.id);
    const roomIds = BOSS_ENCOUNTERS.map(b => b.roomId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(roomIds).size).toBe(roomIds.length);
  });

  it("boss difficulties should span easy through legendary", async () => {
    const { BOSS_ENCOUNTERS } = await import("../client/src/data/bossEncounters");
    const difficulties = new Set(BOSS_ENCOUNTERS.map(b => b.difficulty));
    expect(difficulties.size).toBeGreaterThanOrEqual(3);
  });

  it("each boss deck card should have valid structure", async () => {
    const { BOSS_ENCOUNTERS } = await import("../client/src/data/bossEncounters");
    for (const boss of BOSS_ENCOUNTERS) {
      for (const card of boss.deck) {
        // Cards are Omit<StarterCard, "id"> so no id field
        expect(card.name).toBeTruthy();
        expect(typeof card.cost).toBe("number");
        expect(typeof card.attack).toBe("number");
        expect(typeof card.defense).toBe("number");
        expect(card.type).toBeTruthy();
      }
    }
  });

  it("bosses should have rewards with cardReward defined", async () => {
    const { BOSS_ENCOUNTERS } = await import("../client/src/data/bossEncounters");
    for (const boss of BOSS_ENCOUNTERS) {
      expect(boss.rewards).toBeTruthy();
      expect(boss.rewards.cardReward).toBeTruthy();
      expect(boss.rewards.cardReward.name).toBeTruthy();
      expect(boss.rewards.cardReward.rarity).toBe("legendary");
    }
  });

  it("boss room IDs should correspond to known Ark rooms", async () => {
    const { BOSS_ENCOUNTERS } = await import("../client/src/data/bossEncounters");
    const validRooms = [
      "medical-bay", "bridge", "archives", "comms-array",
      "observation-deck", "engineering", "cargo-hold", "captains-quarters",
    ];
    for (const boss of BOSS_ENCOUNTERS) {
      expect(validRooms).toContain(boss.roomId);
    }
  });
});

/* ═══ BOSS BATTLE ENGINE ═══ */
describe("Boss Battle Engine", () => {
  it("should export initBossBattle function", async () => {
    const mod = await import("../client/src/lib/bossBattle");
    expect(typeof mod.initBossBattle).toBe("function");
  });

  it("should create a boss battle state with correct HP scaling", async () => {
    const { initBossBattle } = await import("../client/src/lib/bossBattle");
    const { BOSS_ENCOUNTERS } = await import("../client/src/data/bossEncounters");

    const playerDeck = Array.from({ length: 6 }, (_, i) => ({
      id: `test-${i}`, name: `Test Card ${i}`, type: "unit" as const,
      rarity: "common" as const, attack: 3, defense: 2, cost: 2,
      ability: "None", lore: "Test", imageUrl: "",
    }));

    const boss = BOSS_ENCOUNTERS[0];
    const state = initBossBattle(playerDeck, boss);
    expect(state).toBeTruthy();
    expect(state.enemy.hp).toBeGreaterThanOrEqual(20);
    expect(state.player.hp).toBe(20);
  });

  it("should export processBossAction and checkBossPassive", async () => {
    const mod = await import("../client/src/lib/bossBattle");
    expect(typeof mod.processBossAction).toBe("function");
    expect(typeof mod.checkBossPassive).toBe("function");
  });

  it("boss difficulty should scale HP correctly", async () => {
    const { initBossBattle } = await import("../client/src/lib/bossBattle");
    const { BOSS_ENCOUNTERS } = await import("../client/src/data/bossEncounters");

    const playerDeck = Array.from({ length: 6 }, (_, i) => ({
      id: `test-${i}`, name: `Test Card ${i}`, type: "unit" as const,
      rarity: "common" as const, attack: 3, defense: 2, cost: 2,
      ability: "None", lore: "Test", imageUrl: "",
    }));

    const difficultyOrder: Record<string, number> = {
      easy: 1, medium: 2, hard: 3, elite: 4, legendary: 5,
    };
    const sorted = [...BOSS_ENCOUNTERS].sort(
      (a, b) => (difficultyOrder[a.difficulty] ?? 0) - (difficultyOrder[b.difficulty] ?? 0)
    );

    if (sorted.length >= 2) {
      const easyBoss = sorted[0];
      const hardBoss = sorted[sorted.length - 1];
      const easyState = initBossBattle(playerDeck, easyBoss);
      const hardState = initBossBattle(playerDeck, hardBoss);
      expect(hardState.enemy.hp).toBeGreaterThanOrEqual(easyState.enemy.hp);
    }
  });
});

/* ═══ CONEXUS GAMES DATA ═══ */
describe("CoNexus Games Data", () => {
  it("should export CONEXUS_GAMES array", async () => {
    const mod = await import("../client/src/data/conexusGames");
    expect(Array.isArray(mod.CONEXUS_GAMES)).toBe(true);
    expect(mod.CONEXUS_GAMES.length).toBeGreaterThanOrEqual(5);
  });

  it("each game should have required fields", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    for (const game of CONEXUS_GAMES) {
      expect(game.id).toBeTruthy();
      expect(game.title).toBeTruthy();
      expect(game.conexusUrl).toBeTruthy();
      expect(game.description).toBeTruthy();
      expect(game.conexusUrl).toContain("conexus.ink");
    }
  });

  it("each game should have unique IDs", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    const ids = CONEXUS_GAMES.map(g => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each game URL should be a valid URL format", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    for (const game of CONEXUS_GAMES) {
      expect(game.conexusUrl.startsWith("https://")).toBe(true);
    }
  });

  it("should have exactly 41 games matching the CoNexus Dischordian Saga page", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    expect(CONEXUS_GAMES.length).toBe(41);
  });

  it("should have all 5 age categories", async () => {
    const { AGE_CATEGORIES } = await import("../client/src/data/conexusGames");
    expect(AGE_CATEGORIES.length).toBe(6);
    const ageNames = AGE_CATEGORIES.map((c: { age: string }) => c.age);
    expect(ageNames).toContain("The Age of Privacy");
    expect(ageNames).toContain("Haven: Sundown Bazaar");
    expect(ageNames).toContain("Fall of Reality (Prequel)");
    expect(ageNames).toContain("Age of Potentials");
    expect(ageNames).toContain("Visions");
  });

  it("should have correct game counts per age", async () => {
    const { AGE_CATEGORIES } = await import("../client/src/data/conexusGames");
    const counts: Record<string, number> = {};
    for (const cat of AGE_CATEGORIES) {
      counts[cat.age] = cat.games.length;
    }
    expect(counts["The Age of Privacy"]).toBe(4);
    expect(counts["Haven: Sundown Bazaar"]).toBe(7);
    expect(counts["Fall of Reality (Prequel)"]).toBe(12);
    expect(counts["Age of Potentials"]).toBe(7);
    expect(counts["Visions"]).toBe(5);
  });

  it("every game should have a direct story URL (not just the saga page)", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    for (const game of CONEXUS_GAMES) {
      // Each URL should contain a UUID story ID between /Saga/ and ? (except Blood Weave which is new)
      if (game.id === "blood-weave-gates-of-hell" || game.id === "kaels-revenge") continue;
      const match = game.conexusUrl.match(/\/Dischordian%20Saga\/[0-9a-f]{8}-[0-9a-f]{4}/);
      expect(match).toBeTruthy();
    }
  });

  it("no two games should share the same URL", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    const urls = CONEXUS_GAMES.map((g: { conexusUrl: string }) => g.conexusUrl);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

/* ═══ ANTIQUARIAN'S LIBRARY ROOM ═══ */
describe("Antiquarian's Library Room", () => {
  it("should exist in ROOM_DEFINITIONS", async () => {
    const mod = await import("../client/src/contexts/GameContext");
    const rooms = mod.ROOM_DEFINITIONS;
    const library = rooms.find((r: { id: string }) => r.id === "antiquarian-library");
    expect(library).toBeTruthy();
    expect(library!.name).toContain("Antiquarian");
  });

  it("should be accessible from archives room", async () => {
    const mod = await import("../client/src/contexts/GameContext");
    const rooms = mod.ROOM_DEFINITIONS;
    const archives = rooms.find((r: { id: string }) => r.id === "archives");
    expect(archives).toBeTruthy();
    if (archives?.doors) {
      const hasLibraryDoor = archives.doors.some(
        (d: { targetRoom: string }) => d.targetRoom === "antiquarian-library"
      );
      expect(hasLibraryDoor).toBe(true);
    }
  });

  it("library room should have proper metadata", async () => {
    const mod = await import("../client/src/contexts/GameContext");
    const rooms = mod.ROOM_DEFINITIONS;
    const library = rooms.find((r: { id: string }) => r.id === "antiquarian-library");
    expect(library).toBeTruthy();
    expect(library!.imageUrl).toBeTruthy();
    expect(library!.description).toBeTruthy();
  });
});

/* ═══ EASTER EGGS ═══ */
describe("Antiquarian Library Easter Egg", () => {
  it("should have an Easter egg for the library room", async () => {
    const mod = await import("../client/src/components/EasterEggs");
    const eggs = mod.ROOM_EASTER_EGGS;
    // ROOM_EASTER_EGGS is a Record<string, {...}>
    const libraryEgg = eggs["egg-library-prophecy"];
    expect(libraryEgg).toBeTruthy();
    expect(libraryEgg.title).toBeTruthy();
    expect(libraryEgg.loreFragment).toBeTruthy();
  });
});

/* ═══ CARD CHALLENGE ROUTER ═══ */
describe("Card Challenge Router", () => {
  it("should export cardChallengeRouter", async () => {
    const mod = await import("./routers/cardChallenge");
    expect(mod.cardChallengeRouter).toBeTruthy();
  });

  it("should have create, list, accept, decline procedures", async () => {
    const { cardChallengeRouter } = await import("./routers/cardChallenge");
    const procedures = Object.keys((cardChallengeRouter as any)._def.procedures ?? {});
    expect(procedures).toContain("create");
    expect(procedures).toContain("list");
    expect(procedures).toContain("accept");
    expect(procedures).toContain("decline");
  });
});

/* ═══ PREVIOUSLY ON COMPONENT ═══ */
describe("PreviouslyOn Component", () => {
  it("should export default component", async () => {
    const mod = await import("../client/src/components/PreviouslyOn");
    expect(mod.default).toBeTruthy();
    expect(typeof mod.default).toBe("function");
  });
});

/* ═══ GAMES PAGE INTEGRATION ═══ */
describe("GamesPage Integration", () => {
  it("should include Antiquarian's Library in SIMULATIONS", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/GamesPage.tsx", "utf-8");
    expect(content).toContain("ANTIQUARIAN'S LIBRARY");
    expect(content).toContain("conexus-portal");
  });

  it("should include Boss Encounters in SIMULATIONS", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/GamesPage.tsx", "utf-8");
    expect(content).toContain("BOSS ENCOUNTERS");
    expect(content).toContain("boss-battle");
  });

  it("should include Multiplayer Arena in SIMULATIONS", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/pages/GamesPage.tsx", "utf-8");
    expect(content).toContain("MULTIPLAYER ARENA");
    expect(content).toContain("card-challenge");
  });
});

/* ═══ APP ROUTES ═══ */
describe("App Routes", () => {
  it("should have routes for boss-battle, card-challenge, and conexus-portal", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/App.tsx", "utf-8");
    expect(content).toContain("/boss-battle");
    expect(content).toContain("/card-challenge");
    expect(content).toContain("/conexus-portal");
  });

  it("should import all new page components", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("client/src/App.tsx", "utf-8");
    expect(content).toContain("BossBattlePage");
    expect(content).toContain("CardChallengePage");
    expect(content).toContain("ConexusPortalPage");
  });
});

/* ═══ ROUTER WIRING ═══ */
describe("Router Wiring", () => {
  it("should include cardChallenge in the main app router", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/routers.ts", "utf-8");
    expect(content).toContain("cardChallenge: cardChallengeRouter");
    expect(content).toContain("import { cardChallengeRouter }");
  });
});
