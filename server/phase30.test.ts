
import { describe, it, expect } from "vitest";
import {
  STARTER_FIGHTERS,
  UNLOCKABLE_FIGHTERS,
  ARENAS,
} from "../client/src/game/gameData";
import { CHARACTER_CONFIGS } from "../client/src/game/CharacterModel3D";

const ALL_FIGHTERS = [...STARTER_FIGHTERS, ...UNLOCKABLE_FIGHTERS];
const STARTER_IDS = STARTER_FIGHTERS.map(f => f.id);

/* ─── 1. Sprite Pose System ─── */
describe("Sprite Pose System", () => {
  it("top 12 starter fighters have poseSprites in CHARACTER_CONFIGS", () => {
    // These 12 fighters should have pose sprites (excluding authority which wasn't in the generation batch)
    const spriteFighters = STARTER_IDS.filter(id => {
      const config = CHARACTER_CONFIGS[id];
      return config?.poseSprites && Object.keys(config.poseSprites).length > 0;
    });
    expect(spriteFighters.length).toBeGreaterThanOrEqual(12);
  });

  it("pose sprites include all 6 required poses", () => {
    const requiredPoses = ["idle", "attack", "block", "hit", "ko", "victory"];
    for (const id of STARTER_IDS) {
      const config = CHARACTER_CONFIGS[id];
      if (config?.poseSprites) {
        for (const pose of requiredPoses) {
          expect(config.poseSprites[pose], `${id} missing pose: ${pose}`).toBeDefined();
          expect(config.poseSprites[pose]).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("pose sprite URLs are valid CDN URLs", () => {
    for (const id of STARTER_IDS) {
      const config = CHARACTER_CONFIGS[id];
      if (config?.poseSprites) {
        Object.values(config.poseSprites).forEach(url => {
          expect(url).toMatch(/cloudfront\.net/);
          expect(url).toMatch(/\.png$/);
        });
      }
    }
  });
});

/* ─── 2. Arena Backgrounds ─── */
describe("Arena Background System", () => {
  it("all arenas with backgroundImage have valid CDN URLs", () => {
    expect(ARENAS.length).toBeGreaterThanOrEqual(8);
    const withBg = ARENAS.filter(a => a.backgroundImage);
    expect(withBg.length).toBeGreaterThanOrEqual(8);
    for (const arena of withBg) {
      expect(arena.backgroundImage).toMatch(/^https:\/\//);
    }
  });

  it("arena background URLs are valid CDN URLs", () => {
    for (const arena of ARENAS) {
      if (arena.backgroundImage) {
        expect(arena.backgroundImage).toMatch(/cloudfront\.net/);
        // URLs can be either old arena_*_bg_* or new *_bg-* format
        expect(arena.backgroundImage).toMatch(/_bg/);
      }
    }
  });

  it("most arenas have background images", () => {
    const withBg = ARENAS.filter(a => a.backgroundImage);
    // All arenas should now have background images
    expect(withBg.length).toBe(ARENAS.length);
  });

  it("arenas retain original gradient and color data", () => {
    for (const arena of ARENAS) {
      expect(arena.bgGradient).toMatch(/linear-gradient/);
      expect(arena.floorColor).toMatch(/^#/);
      expect(arena.ambientColor).toMatch(/^#/);
    }
  });
});

/* ─── 3. Sound System ─── */
describe("FightSoundManager", () => {
  it("FightSoundManager module exports correctly", async () => {
    const mod = await import("../client/src/game/FightSoundManager");
    expect(mod.FightSoundManager).toBeDefined();
    expect(typeof mod.FightSoundManager).toBe("function");
  });

  it("can instantiate FightSoundManager with arena ID", async () => {
    const { FightSoundManager } = await import("../client/src/game/FightSoundManager");
    const manager = new FightSoundManager("new-babylon");
    expect(manager).toBeDefined();
    expect(manager.isMuted()).toBe(false);
    expect(manager.getArenaTrack()).toBeDefined();
    expect(manager.getArenaTrack()?.title).toBe("The Politician's Reign");
  });

  it("has arena music tracks for core arenas", async () => {
    const { FightSoundManager } = await import("../client/src/game/FightSoundManager");
    // Only test the 8 core arenas that were originally designed with music
    const coreArenaIds = ["new-babylon", "panopticon", "thaloria", "terminus", "mechronis", "crucible", "blood-weave", "shadow-sanctum"];
    for (const arenaId of coreArenaIds) {
      const manager = new FightSoundManager(arenaId);
      const track = manager.getArenaTrack();
      expect(track, `${arenaId} missing arena music track`).toBeDefined();
      expect(track?.youtubeId).toBeDefined();
      expect(track?.title).toBeDefined();
    }
  });

  it("mute toggle works correctly", async () => {
    const { FightSoundManager } = await import("../client/src/game/FightSoundManager");
    const manager = new FightSoundManager("panopticon");
    expect(manager.isMuted()).toBe(false);
    manager.toggleMute();
    expect(manager.isMuted()).toBe(true);
    manager.toggleMute();
    expect(manager.isMuted()).toBe(false);
  });
});

/* ─── 4. CharacterModel3D Config Integrity ─── */
describe("CharacterModel3D Configs", () => {
  it("all starter fighters have CHARACTER_CONFIGS entries", () => {
    for (const fighter of STARTER_FIGHTERS) {
      expect(CHARACTER_CONFIGS[fighter.id], `${fighter.id} missing config`).toBeDefined();
    }
  });

  it("configs have required visual properties", () => {
    for (const fighter of STARTER_FIGHTERS) {
      const config = CHARACTER_CONFIGS[fighter.id];
      if (config) {
        expect(config.imageUrl).toMatch(/^https:\/\//);
        expect(config.primaryColor).toBeDefined();
        expect(config.accentColor).toBeDefined();
      }
    }
  });
});

/* ─── 5. ArenaData Interface ─── */
describe("ArenaData Interface", () => {
  it("all arenas now have backgroundImage", () => {
    const withBg = ARENAS.filter(a => a.backgroundImage);
    // All arenas should now have background images after the enhancement
    expect(withBg.length).toBe(ARENAS.length);
  });

  it("arena IDs include all expected arenas", () => {
    const expectedCoreIds = [
      "new-babylon", "panopticon", "thaloria", "terminus",
      "mechronis", "crucible", "blood-weave", "shadow-sanctum"
    ];
    const actualIds = ARENAS.map(a => a.id);
    for (const id of expectedCoreIds) {
      expect(actualIds).toContain(id);
    }
  });
});
