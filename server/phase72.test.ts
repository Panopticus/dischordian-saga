import { describe, it, expect } from "vitest";
import {
  COMPANION_GIFTS,
  getGiftById,
  getGiftsByRarity,
  calculateGiftXp,
  getRarityColor,
  type CompanionGift,
} from "../client/src/data/companionGifts";
import {
  FACTION_WAR_EVENTS,
  DEFAULT_FACTION_WAR_STATE,
  getNextWarEvent,
  calculateWarOutcome,
  getContributionRank,
  type FactionWarEvent,
} from "../client/src/data/factionWarData";
import { ARENAS } from "../client/src/game/gameData";
import { STORY_CHAPTERS } from "../client/src/game/storyMode";

describe("Phase 72: Companion Gift System", () => {
  it("should have at least 8 companion gifts defined", () => {
    expect(COMPANION_GIFTS.length).toBeGreaterThanOrEqual(8);
  });

  it("every gift should have required fields", () => {
    COMPANION_GIFTS.forEach((gift: CompanionGift) => {
      expect(gift.id).toBeTruthy();
      expect(gift.name).toBeTruthy();
      expect(gift.description).toBeTruthy();
      expect(gift.rarity).toBeTruthy();
      expect(typeof gift.baseXp).toBe("number");
      expect(gift.baseXp).toBeGreaterThan(0);
    });
  });

  it("every gift should have companion-specific dialog responses", () => {
    COMPANION_GIFTS.forEach((gift: CompanionGift) => {
      expect(gift.dialogResponses).toBeTruthy();
      expect(gift.dialogResponses.elara).toBeTruthy();
      expect(gift.dialogResponses.the_human).toBeTruthy();
    });
  });

  it("should have gifts across multiple rarities", () => {
    const rarities = new Set(COMPANION_GIFTS.map(g => g.rarity));
    expect(rarities.size).toBeGreaterThanOrEqual(3);
  });

  it("higher rarity gifts should give more relationship bonus", () => {
    const byRarity: Record<string, number[]> = {};
    COMPANION_GIFTS.forEach(g => {
      if (!byRarity[g.rarity]) byRarity[g.rarity] = [];
      byRarity[g.rarity].push(g.baseXp);
    });
    if (byRarity["legendary"] && byRarity["common"]) {
      const avgLegendary = byRarity["legendary"].reduce((a, b) => a + b, 0) / byRarity["legendary"].length;
      const avgCommon = byRarity["common"].reduce((a, b) => a + b, 0) / byRarity["common"].length;
      expect(avgLegendary).toBeGreaterThan(avgCommon);
    }
  });

  it("getGiftById should return the correct gift", () => {
    const first = COMPANION_GIFTS[0];
    const found = getGiftById(first.id);
    expect(found?.id).toBe(first.id);
    expect(found?.name).toBe(first.name);
  });

  it("getGiftsByRarity should filter correctly", () => {
    const common = getGiftsByRarity("common");
    common.forEach(g => expect(g.rarity).toBe("common"));
  });

  it("getRarityColor should return a color string", () => {
    const color = getRarityColor("legendary");
    expect(color).toBeTruthy();
    expect(typeof color).toBe("string");
  });

  it("calculateGiftXp should return a positive number", () => {
    const gift = COMPANION_GIFTS[0];
    const xp = calculateGiftXp(gift, "elara");
    expect(xp).toBeGreaterThan(0);
  });
});

describe("Phase 72: Faction War Events", () => {
  it("should have at least 3 faction war events", () => {
    expect(FACTION_WAR_EVENTS.length).toBeGreaterThanOrEqual(3);
  });

  it("every war event should have required fields", () => {
    FACTION_WAR_EVENTS.forEach((event: FactionWarEvent) => {
      expect(event.id).toBeTruthy();
      expect(event.name).toBeTruthy();
      expect(event.description).toBeTruthy();
      expect(event.factions).toBeTruthy();
      expect(event.factions.length).toBe(2);
      expect(event.contestedSectors).toBeTruthy();
      expect(event.contestedSectors.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("every war event should have two opposing factions as strings", () => {
    FACTION_WAR_EVENTS.forEach((event: FactionWarEvent) => {
      expect(typeof event.factions[0]).toBe("string");
      expect(typeof event.factions[1]).toBe("string");
      expect(event.factions[0]).not.toBe(event.factions[1]);
    });
  });

  it("DEFAULT_FACTION_WAR_STATE should be valid", () => {
    expect(DEFAULT_FACTION_WAR_STATE).toBeTruthy();
    expect(DEFAULT_FACTION_WAR_STATE.completedWars).toBeDefined();
    expect(Array.isArray(DEFAULT_FACTION_WAR_STATE.completedWars)).toBe(true);
  });

  it("getContributionRank should return a rank", () => {
    const rank = getContributionRank(100);
    expect(rank.rank).toBeTruthy();
    expect(rank.color).toBeTruthy();
  });

  it("calculateWarOutcome should return a result", () => {
    const result = calculateWarOutcome(500, 300);
    expect(result).toBeTruthy();
  });
});

describe("Phase 72: Fight Game Story Mode Enhancements", () => {
  it("story arenas (void, babylon, necropolis) should exist in ARENAS", () => {
    const arenaIds = ARENAS.map(a => a.id);
    expect(arenaIds).toContain("void");
    expect(arenaIds).toContain("babylon");
    expect(arenaIds).toContain("necropolis");
  });

  it("all story chapter arenaIds should reference valid arenas", () => {
    const arenaIds = new Set(ARENAS.map(a => a.id));
    STORY_CHAPTERS.forEach(ch => {
      expect(arenaIds.has(ch.arenaId)).toBe(true);
    });
  });

  it("boss chapters (7, 11, 12) should exist", () => {
    const chapterNums = STORY_CHAPTERS.map(c => c.chapter);
    expect(chapterNums).toContain(7);
    expect(chapterNums).toContain(11);
    expect(chapterNums).toContain(12);
  });

  it("every story chapter should have pre and post-victory dialogue", () => {
    STORY_CHAPTERS.forEach(ch => {
      expect(ch.preDialogue.length).toBeGreaterThan(0);
      expect(ch.postVictoryDialogue.length).toBeGreaterThan(0);
    });
  });

  it("new arenas should have proper visual properties", () => {
    const voidArena = ARENAS.find(a => a.id === "void");
    const babylonArena = ARENAS.find(a => a.id === "babylon");
    const necropolisArena = ARENAS.find(a => a.id === "necropolis");

    expect(voidArena?.bgGradient).toBeTruthy();
    expect(voidArena?.floorColor).toBeTruthy();
    expect(voidArena?.ambientColor).toBeTruthy();

    expect(babylonArena?.bgGradient).toBeTruthy();
    expect(babylonArena?.floorColor).toBeTruthy();
    expect(babylonArena?.ambientColor).toBeTruthy();

    expect(necropolisArena?.bgGradient).toBeTruthy();
    expect(necropolisArena?.floorColor).toBeTruthy();
    expect(necropolisArena?.ambientColor).toBeTruthy();
  });

  it("story mode should have 12 chapters", () => {
    expect(STORY_CHAPTERS.length).toBe(12);
  });
});
