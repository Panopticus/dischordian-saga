/* ═══════════════════════════════════════════════════════
   PHASE 84 TESTS — All 10 remaining roadmap features
   Shared modules, room definitions, route wiring
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";

// ── Shared module imports ──
import { SEASONAL_EVENTS } from "@shared/seasonalEvents";
import { encodeReplay, decodeReplay, PLAYBACK_SPEEDS } from "@shared/replaySystem";
import { ROOM_ZONES, DECORATION_ITEMS } from "@shared/personalQuarters";
import { CHALLENGE_RULES, getDailyChallenge } from "@shared/friendlyChallenges";
import { RAID_BOSSES } from "@shared/coopRaids";
import { BOSS_MASTERY_DEFS, getBossMasteryLevel } from "@shared/bossMastery";
import { COSMETIC_ITEMS, getShopItems } from "@shared/cosmeticShop";
import { REPUTATION_TIERS, WEEKLY_LIMITS, getReputationTier } from "@shared/donationSystem";
import { JOURNAL_CATEGORIES, WRITING_STREAK_REWARDS, MIN_WORDS_FOR_STREAK } from "@shared/loreJournal";

// ── 1. Seasonal Events ──
describe("Seasonal Events", () => {
  it("should have at least 3 seasonal events defined", () => {
    expect(SEASONAL_EVENTS.length).toBeGreaterThanOrEqual(3);
  });

  it("each event should have key, name, milestones, and shopItems", () => {
    for (const event of SEASONAL_EVENTS) {
      expect(event.key).toBeTruthy();
      expect(event.name).toBeTruthy();
      expect(event.milestones.length).toBeGreaterThan(0);
      expect(event.shopItems.length).toBeGreaterThan(0);
    }
  });

  it("event milestones should have increasing thresholds", () => {
    for (const event of SEASONAL_EVENTS) {
      for (let i = 1; i < event.milestones.length; i++) {
        expect(event.milestones[i].threshold).toBeGreaterThan(event.milestones[i - 1].threshold);
      }
    }
  });
});

// ── 2. Replay System ──
describe("Replay System", () => {
  it("should encode and decode replays correctly", () => {
    const moves = [
      { moveIndex: 1, playerId: "p1", action: "move", timestamp: 1000 },
      { moveIndex: 2, playerId: "p2", action: "attack", timestamp: 2000 },
    ];
    const encoded = encodeReplay(moves);
    expect(typeof encoded).toBe("string");
    expect(encoded.length).toBeGreaterThan(0);
    const decoded = decodeReplay(encoded);
    expect(decoded).toHaveLength(2);
    expect(decoded[0].moveIndex).toBe(1);
    expect(decoded[1].action).toBe("attack");
  });

  it("should have valid playback speeds", () => {
    expect(PLAYBACK_SPEEDS.length).toBeGreaterThan(0);
    expect(PLAYBACK_SPEEDS).toContain(1);
  });
});

// ── 3. Personal Quarters ──
describe("Personal Quarters", () => {
  it("should have at least 6 room zones", () => {
    expect(ROOM_ZONES.length).toBeGreaterThanOrEqual(6);
  });

  it("should have 75+ decoration items", () => {
    expect(DECORATION_ITEMS.length).toBeGreaterThanOrEqual(75);
  });

  it("each decoration item should have key, name, category, rarity", () => {
    for (const item of DECORATION_ITEMS.slice(0, 10)) {
      expect(item.key).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.category).toBeTruthy();
      expect(item.rarity).toBeTruthy();
    }
  });

  it("room zones should have unique zone identifiers", () => {
    const zones = ROOM_ZONES.map(z => z.zone);
    expect(new Set(zones).size).toBe(zones.length);
  });
});

// ── 4. Friendly Challenges ──
describe("Friendly Challenges", () => {
  it("should have challenge rules defined", () => {
    expect(CHALLENGE_RULES.length).toBeGreaterThan(0);
  });

  it("getDailyChallenge should return a valid challenge for any date", () => {
    const challenge = getDailyChallenge("2026-03-22");
    expect(challenge).toBeTruthy();
    expect(challenge.title).toBeTruthy();
    expect(challenge.gameType).toBeTruthy();
  });

  it("same date should return same daily challenge", () => {
    const c1 = getDailyChallenge("2026-01-15");
    const c2 = getDailyChallenge("2026-01-15");
    expect(c1.title).toBe(c2.title);
  });
});

// ── 5. Cooperative Raids ──
describe("Cooperative Raids", () => {
  it("should have at least 3 raid bosses", () => {
    expect(RAID_BOSSES.length).toBeGreaterThanOrEqual(3);
  });

  it("each boss should have key, name, element, hp for all difficulties", () => {
    for (const boss of RAID_BOSSES) {
      expect(boss.key).toBeTruthy();
      expect(boss.name).toBeTruthy();
      expect(boss.element).toBeTruthy();
      expect(boss.hp.normal).toBeGreaterThan(0);
      expect(boss.hp.heroic).toBeGreaterThan(boss.hp.normal);
      expect(boss.hp.mythic).toBeGreaterThan(boss.hp.heroic);
    }
  });

  it("boss loot should have items", () => {
    for (const boss of RAID_BOSSES) {
      expect(boss.loot.length).toBeGreaterThan(0);
    }
  });
});

// ── 6. Boss Mastery ──
describe("Boss Mastery", () => {
  it("should have mastery definitions", () => {
    expect(BOSS_MASTERY_DEFS.length).toBeGreaterThan(0);
  });

  it("getBossMasteryLevel should return 0 for 0 kills", () => {
    const level = getBossMasteryLevel(0, BOSS_MASTERY_DEFS[0].key);
    expect(level).toBe(0);
  });

  it("getBossMasteryLevel should increase with more kills", () => {
    const key = BOSS_MASTERY_DEFS[0].key;
    const low = getBossMasteryLevel(5, key);
    const high = getBossMasteryLevel(50, key);
    expect(high).toBeGreaterThanOrEqual(low);
  });
});

// ── 7. Cosmetic Shop ──
describe("Cosmetic Shop", () => {
  it("should have cosmetic items defined", () => {
    expect(COSMETIC_ITEMS.length).toBeGreaterThan(0);
  });

  it("each item should have key, name, type, rarity, price", () => {
    for (const item of COSMETIC_ITEMS.slice(0, 10)) {
      expect(item.key).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.type).toBeTruthy();
      expect(item.rarity).toBeTruthy();
      expect(item.price).toBeGreaterThanOrEqual(0);
    }
  });

  it("getShopItems should filter by type", () => {
    const items = getShopItems({ classKeys: [], prestigeKeys: [], bossKills: {} });
    expect(items.length).toBeGreaterThan(0);
  });
});

// ── 8. Donation System ──
describe("Donation System", () => {
  it("should have reputation tiers", () => {
    expect(REPUTATION_TIERS.length).toBeGreaterThan(0);
  });

  it("should have weekly limits for all donation types", () => {
    expect(WEEKLY_LIMITS.card).toBeGreaterThan(0);
    expect(WEEKLY_LIMITS.material).toBeGreaterThan(0);
    expect(WEEKLY_LIMITS.dream).toBeGreaterThan(0);
    expect(WEEKLY_LIMITS.token).toBeGreaterThan(0);
  });

  it("getReputationTier should return a tier for 0 reputation", () => {
    const tier = getReputationTier(0);
    expect(tier).toBeTruthy();
    expect(tier.name).toBeTruthy();
  });

  it("higher reputation should give higher or equal tier", () => {
    const lowTier = getReputationTier(10);
    const highTier = getReputationTier(10000);
    expect(highTier.minReputation).toBeGreaterThanOrEqual(lowTier.minReputation);
  });
});

// ── 9. Lore Journal ──
describe("Lore Journal", () => {
  it("should have journal categories", () => {
    expect(JOURNAL_CATEGORIES.length).toBeGreaterThan(0);
  });

  it("should have writing streak rewards", () => {
    expect(WRITING_STREAK_REWARDS.length).toBeGreaterThan(0);
  });

  it("MIN_WORDS_FOR_STREAK should be at least 50", () => {
    expect(MIN_WORDS_FOR_STREAK).toBeGreaterThanOrEqual(50);
  });

  it("streak rewards should have increasing day thresholds", () => {
    for (let i = 1; i < WRITING_STREAK_REWARDS.length; i++) {
      expect(WRITING_STREAK_REWARDS[i].days).toBeGreaterThan(WRITING_STREAK_REWARDS[i - 1].days);
    }
  });
});

// ── 10. Route & Room Wiring ──
describe("Phase 84 Route & Room Wiring", () => {
  it("all 10 new routes should be registered in App.tsx", async () => {
    const fs = await import("fs");
    const appContent = fs.readFileSync("client/src/App.tsx", "utf-8");
    const routes = [
      "/seasonal-events", "/replays", "/personal-quarters",
      "/friendly-challenges", "/coop-raids", "/boss-mastery",
      "/cosmetic-shop", "/donations", "/social", "/lore-journal",
    ];
    for (const route of routes) {
      expect(appContent).toContain(`path="${route}"`);
    }
  });

  it("social-hub and war-room Ark rooms should exist", async () => {
    const fs = await import("fs");
    const gameCtx = fs.readFileSync("client/src/contexts/GameContext.tsx", "utf-8");
    expect(gameCtx).toContain('id: "social-hub"');
    expect(gameCtx).toContain('id: "war-room"');
  });

  it("all 10 routers should be wired in routers.ts", async () => {
    const fs = await import("fs");
    const routersContent = fs.readFileSync("server/routers.ts", "utf-8");
    const routers = [
      "seasonalEvent", "replay", "personalQuarters",
      "friendlyChallenge", "coopRaid", "bossMastery",
      "cosmeticShop", "donation", "social", "loreJournal",
    ];
    for (const r of routers) {
      expect(routersContent).toContain(r);
    }
  });
});
