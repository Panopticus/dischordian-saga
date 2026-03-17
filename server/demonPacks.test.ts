import { describe, it, expect } from "vitest";

// ═══════════════════════════════════════════════════════
// DEMON CARD PACK EXPANSION TESTS
// ═══════════════════════════════════════════════════════

// Test the demon pack products
describe("Demon Card Pack Products", () => {
  it("should have 3 demon pack products in the store", async () => {
    const { STORE_PRODUCTS } = await import("./products");
    const demonPacks = STORE_PRODUCTS.filter((p) => p.key.startsWith("demon_pack_"));
    expect(demonPacks).toHaveLength(3);
  });

  it("should have correct demon pack keys", async () => {
    const { STORE_PRODUCTS } = await import("./products");
    const demonPacks = STORE_PRODUCTS.filter((p) => p.key.startsWith("demon_pack_"));
    const keys = demonPacks.map((p) => p.key);
    expect(keys).toContain("demon_pack_standard");
    expect(keys).toContain("demon_pack_premium");
    expect(keys).toContain("demon_pack_infernal");
  });

  it("should have ascending prices for demon packs", async () => {
    const { getProduct } = await import("./products");
    const standard = getProduct("demon_pack_standard");
    const premium = getProduct("demon_pack_premium");
    const infernal = getProduct("demon_pack_infernal");
    expect(standard).toBeTruthy();
    expect(premium).toBeTruthy();
    expect(infernal).toBeTruthy();
    expect(standard!.priceDream).toBeLessThan(premium!.priceDream);
    expect(premium!.priceDream).toBeLessThan(infernal!.priceDream);
  });

  it("demon packs should be in the cards category", async () => {
    const { STORE_PRODUCTS } = await import("./products");
    const demonPacks = STORE_PRODUCTS.filter((p) => p.key.startsWith("demon_pack_"));
    for (const pack of demonPacks) {
      expect(pack.category).toBe("cards");
    }
  });

  it("demon packs should have card pack rewards", async () => {
    const { STORE_PRODUCTS } = await import("./products");
    const demonPacks = STORE_PRODUCTS.filter((p) => p.key.startsWith("demon_pack_"));
    for (const pack of demonPacks) {
      expect(pack.rewards.cardPacks).toBeGreaterThan(0);
      expect(pack.rewards.cardPackRarity).toBeTruthy();
    }
  });

  it("standard demon pack should cost 30 Dream", async () => {
    const { getProduct } = await import("./products");
    const standard = getProduct("demon_pack_standard");
    expect(standard!.priceDream).toBe(30);
  });

  it("premium demon pack should cost 75 Dream", async () => {
    const { getProduct } = await import("./products");
    const premium = getProduct("demon_pack_premium");
    expect(premium!.priceDream).toBe(75);
  });

  it("infernal demon pack should cost 200 Dream", async () => {
    const { getProduct } = await import("./products");
    const infernal = getProduct("demon_pack_infernal");
    expect(infernal!.priceDream).toBe(200);
  });
});

// Test the demon fighter sprites in CharacterModel3D
describe("Demon Fighter Sprites", () => {
  it("should have CHARACTER_CONFIGS for all demon fighters", async () => {
    const { CHARACTER_CONFIGS } = await import("../client/src/game/CharacterModel3D");
    // Demon configs use base IDs (without -ceo/-cfo suffixes)
    const demonIds = [
      "molgrath", "xethraal", "vexahlia",
      "draelmon", "nykoth", "sylvex",
      "varkul", "fenra", "ithrael"
    ];
    for (const id of demonIds) {
      expect(CHARACTER_CONFIGS[id]).toBeDefined();
      expect(CHARACTER_CONFIGS[id].imageUrl).toBeTruthy();
    }
  });

  it("demon fighter configs should have correct structure", async () => {
    const { CHARACTER_CONFIGS } = await import("../client/src/game/CharacterModel3D");
    const config = CHARACTER_CONFIGS["molgrath"];
    expect(config).toBeDefined();
    expect(config.height).toBeGreaterThan(0);
    expect(config.primaryColor).toBeTruthy();
    expect(config.imageUrl).toBeTruthy();
    expect(config.fightStyle).toBeTruthy();
  });
});

// Test the demon fighters in gameData
describe("Demon Fighters in Game Data", () => {
  it("should have DEMON_FIGHTERS array with 10 entries", async () => {
    const { DEMON_FIGHTERS } = await import("../client/src/game/gameData");
    expect(DEMON_FIGHTERS).toHaveLength(10);
  });

  it("all demon fighters should have hierarchy faction", async () => {
    const { DEMON_FIGHTERS } = await import("../client/src/game/gameData");
    for (const fighter of DEMON_FIGHTERS) {
      expect(fighter.faction).toBe("hierarchy");
    }
  });

  it("demon fighters should be included in ALL_FIGHTERS", async () => {
    const { ALL_FIGHTERS, DEMON_FIGHTERS } = await import("../client/src/game/gameData");
    for (const demon of DEMON_FIGHTERS) {
      const found = ALL_FIGHTERS.find((f) => f.id === demon.id);
      expect(found).toBeDefined();
    }
  });

  it("demon fighters should have valid stats", async () => {
    const { DEMON_FIGHTERS } = await import("../client/src/game/gameData");
    for (const fighter of DEMON_FIGHTERS) {
      expect(fighter.hp).toBeGreaterThan(0);
      expect(fighter.attack).toBeGreaterThan(0);
      expect(fighter.defense).toBeGreaterThan(0);
      expect(fighter.speed).toBeGreaterThan(0);
      expect(fighter.special).toBeTruthy();
      expect(fighter.image).toBeTruthy();
    }
  });

  it("should have the Blood Weave arena for demon fights", async () => {
    const { ARENAS } = await import("../client/src/game/gameData");
    const bloodWeave = ARENAS.find((a) => a.id === "blood-weave");
    expect(bloodWeave).toBeDefined();
    expect(bloodWeave!.name).toBe("The Blood Weave");
  });

  it("should have the Shadow Sanctum arena", async () => {
    const { ARENAS } = await import("../client/src/game/gameData");
    const shadowSanctum = ARENAS.find((a) => a.id === "shadow-sanctum");
    expect(shadowSanctum).toBeDefined();
  });

  it("demon fighter names should use lore-accurate apostrophe format", async () => {
    const { DEMON_FIGHTERS } = await import("../client/src/game/gameData");
    const names = DEMON_FIGHTERS.map((f) => f.name);
    expect(names).toContain("Mol'Garath");
    expect(names).toContain("Xeth'Raal");
    expect(names).toContain("Vex'Ahlia");
  });
});

// Test the CoNexus Blood Weave game
describe("Blood Weave CoNexus Game", () => {
  it("should have the Blood Weave game in CONEXUS_GAMES", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    const bloodWeave = CONEXUS_GAMES.find((g) => g.id === "blood-weave-gates-of-hell");
    expect(bloodWeave).toBeDefined();
  });

  it("Blood Weave game should have correct structure", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    const bloodWeave = CONEXUS_GAMES.find((g) => g.id === "blood-weave-gates-of-hell");
    expect(bloodWeave).toBeDefined();
    expect(bloodWeave!.title).toContain("Blood Weave");
    expect(bloodWeave!.characters).toBeDefined();
    expect(bloodWeave!.characters.length).toBeGreaterThan(0);
  });

  it("Blood Weave game should be in Fall of Reality age", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    const bloodWeave = CONEXUS_GAMES.find((g) => g.id === "blood-weave-gates-of-hell");
    expect(bloodWeave!.age).toBe("Fall of Reality (Prequel)");
  });

  it("Blood Weave game should reference demon characters", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    const bloodWeave = CONEXUS_GAMES.find((g) => g.id === "blood-weave-gates-of-hell");
    const allText = [bloodWeave!.description, ...bloodWeave!.characters].join(" ");
    expect(allText).toMatch(/Mol.Garath|Xeth.Raal|Vex.Ahlia|Shadow Tongue|demon/i);
  });

  it("Blood Weave game should have a cover image", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    const bloodWeave = CONEXUS_GAMES.find((g) => g.id === "blood-weave-gates-of-hell");
    expect(bloodWeave!.coverImage).toBeTruthy();
  });

  it("CONEXUS_GAMES should now have 34 games (33 original + Blood Weave)", async () => {
    const { CONEXUS_GAMES } = await import("../client/src/data/conexusGames");
    expect(CONEXUS_GAMES.length).toBe(34);
  });
});

// Test the demon achievements
describe("Demon Achievements", () => {
  it("should have 6 demon-related achievements", async () => {
    const { DISCHORDIAN_ACHIEVEMENTS } = await import("../shared/gamification");
    const demonAchievements = DISCHORDIAN_ACHIEVEMENTS.filter(
      (a) => a.achievementId.includes("demon") || a.achievementId.includes("hierarchy")
    );
    expect(demonAchievements.length).toBe(6);
  });

  it("demon achievements should have valid conditions", async () => {
    const { DISCHORDIAN_ACHIEVEMENTS } = await import("../shared/gamification");
    const demonAchievements = DISCHORDIAN_ACHIEVEMENTS.filter(
      (a) => a.achievementId.includes("demon") || a.achievementId.includes("hierarchy")
    );
    for (const ach of demonAchievements) {
      expect(ach.condition).toBeDefined();
      expect(ach.condition.type).toBeTruthy();
      expect(ach.xpReward).toBeGreaterThan(0);
    }
  });

  it("should have the Master of the Damned legendary achievement", async () => {
    const { DISCHORDIAN_ACHIEVEMENTS } = await import("../shared/gamification");
    const master = DISCHORDIAN_ACHIEVEMENTS.find((a) => a.achievementId === "demon-card-all");
    expect(master).toBeDefined();
    expect(master!.tier).toBe("legendary");
    expect(master!.name).toBe("Master of the Damned");
  });
});

// Test the demon encounter system in Trade Empire
describe("Trade Empire Demon Encounters", () => {
  it("should have demon fighter data for encounters", async () => {
    const { DEMON_FIGHTERS } = await import("../client/src/game/gameData");
    expect(DEMON_FIGHTERS.length).toBe(10);
    const names = DEMON_FIGHTERS.map((f) => f.name);
    expect(names).toContain("Mol'Garath");
    expect(names).toContain("Xeth'Raal");
    expect(names).toContain("Vex'Ahlia");
  });
});

// Test the UserProgressData has demon tracking fields
describe("Gamification Demon Tracking", () => {
  it("should have demon tracking fields in DEFAULT_PROGRESS", async () => {
    const { DEFAULT_PROGRESS } = await import("../shared/gamification");
    expect(DEFAULT_PROGRESS.demonKills).toBeDefined();
    expect(DEFAULT_PROGRESS.demonKills).toBe(0);
    expect(DEFAULT_PROGRESS.demonCardsCollected).toBeDefined();
    expect(DEFAULT_PROGRESS.demonCardsCollected).toBe(0);
    expect(DEFAULT_PROGRESS.hierarchyExplored).toBeDefined();
    expect(DEFAULT_PROGRESS.hierarchyExplored).toBe(false);
  });
});

// Test the DemonPackPage route exists
describe("Demon Pack Page Route", () => {
  it("should have DemonPackPage component", async () => {
    const DemonPackPage = await import("../client/src/pages/DemonPackPage");
    expect(DemonPackPage.default).toBeDefined();
  });
});
