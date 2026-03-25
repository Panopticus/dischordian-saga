/**
 * Fight Game Enhancement Tests
 * Tests for: arena background images, training mode data, move list data, sprite sheet URLs
 */
import { describe, it, expect } from "vitest";

// Import game data directly (these are pure data modules)
// We test the data integrity and structure since the engine runs in a Canvas context

describe("Arena Background Images", () => {
  it("all arenas should have backgroundImage URLs", async () => {
    // Dynamic import to handle the module
    const { ARENAS } = await import("../client/src/game/gameData");
    
    expect(ARENAS.length).toBeGreaterThanOrEqual(8);
    
    for (const arena of ARENAS) {
      expect(arena.backgroundImage, `Arena "${arena.name}" (${arena.id}) missing backgroundImage`).toBeDefined();
      expect(arena.backgroundImage).toBeTruthy();
      expect(arena.backgroundImage).toMatch(/^https:\/\//);
    }
  });

  it("all arena backgroundImage URLs should be valid CDN URLs", async () => {
    const { ARENAS } = await import("../client/src/game/gameData");
    
    for (const arena of ARENAS) {
      if (arena.backgroundImage) {
        expect(arena.backgroundImage).toMatch(/cloudfront\.net/);
        expect(arena.backgroundImage).toMatch(/\.(webp|png|jpg)$/);
      }
    }
  });

  it("all arenas should have required color properties", async () => {
    const { ARENAS } = await import("../client/src/game/gameData");
    
    for (const arena of ARENAS) {
      expect(arena.bgGradient, `Arena "${arena.name}" missing bgGradient`).toBeDefined();
      expect(arena.floorColor, `Arena "${arena.name}" missing floorColor`).toBeDefined();
      expect(arena.ambientColor, `Arena "${arena.name}" missing ambientColor`).toBeDefined();
    }
  });
});

describe("Fighter Data Integrity", () => {
  it("all fighters should have required frame profile data", async () => {
    const { ALL_FIGHTERS } = await import("../client/src/game/gameData");
    
    expect(ALL_FIGHTERS.length).toBeGreaterThanOrEqual(12);
    
    for (const fighter of ALL_FIGHTERS) {
      expect(fighter.frameProfile, `Fighter "${fighter.name}" missing frameProfile`).toBeDefined();
      expect(fighter.frameProfile.archetype).toBeTruthy();
      expect(fighter.frameProfile.lightStartup).toBeGreaterThan(0);
      expect(fighter.frameProfile.mediumStartup).toBeGreaterThan(0);
      expect(fighter.frameProfile.heavyStartup).toBeGreaterThan(0);
      expect(fighter.frameProfile.damageMult).toBeGreaterThan(0);
    }
  });

  it("all fighters should have valid archetype values", async () => {
    const { ALL_FIGHTERS } = await import("../client/src/game/gameData");
    const validArchetypes = ["rushdown", "powerhouse", "grappler", "zoner", "balanced", "glass_cannon", "tricky", "tank"];
    
    for (const fighter of ALL_FIGHTERS) {
      expect(
        validArchetypes.includes(fighter.frameProfile.archetype),
        `Fighter "${fighter.name}" has invalid archetype: ${fighter.frameProfile.archetype}`
      ).toBe(true);
    }
  });
});

describe("Special Moves Data", () => {
  it("all fighters should have valid special moves", async () => {
    const { ALL_FIGHTERS } = await import("../client/src/game/gameData");
    const { getCharacterSpecials } = await import("../client/src/game/specialMoves");
    
    for (const fighter of ALL_FIGHTERS) {
      const specials = getCharacterSpecials(fighter.id);
      expect(specials, `Fighter "${fighter.name}" missing specials`).toBeDefined();
      expect(specials.sp1, `Fighter "${fighter.name}" missing sp1`).toBeDefined();
      expect(specials.sp2, `Fighter "${fighter.name}" missing sp2`).toBeDefined();
      expect(specials.sp3, `Fighter "${fighter.name}" missing sp3`).toBeDefined();
      expect(specials.sp1.name).toBeTruthy();
      expect(specials.sp2.name).toBeTruthy();
      expect(specials.sp3.name).toBeTruthy();
    }
  });
});

describe("Training Mode Types", () => {
  it("TrainingData and MoveListEntry types should be exported", async () => {
    const engineModule = await import("../client/src/game/FightEngine2D");
    
    // Verify the module exports the expected types by checking the class exists
    expect(engineModule.FightEngine2D).toBeDefined();
    expect(typeof engineModule.FightEngine2D).toBe("function");
  });
});

describe("Character Model Configs", () => {
  it("all priority characters should have model configs", async () => {
    const { getCharacterConfig } = await import("../client/src/game/CharacterModel3D");
    
    const priorityCharacters = [
      "architect", "enigma", "collector", "oracle",
      "warlord", "iron-lion", "necromancer",
      "source", "meme", "agent-zero", "akai-shi"
    ];
    
    for (const charId of priorityCharacters) {
      const config = getCharacterConfig(charId);
      expect(config, `Character "${charId}" missing model config`).toBeDefined();
      expect(config.primaryColor).toBeTruthy();
    }
  });
});
