/**
 * Guild perk + quest registry tests.
 */
import { describe, it, expect } from "vitest";
import {
  GUILD_PERKS,
  getGuildPerk,
  applyGuildPerks,
  getQualifyingPerks,
} from "./perkDefinitions";
import {
  GUILD_QUESTS,
  getGuildQuest,
  questTarget,
  getGuildQuestsByScope,
} from "../guildQuests/questDefinitions";
import {
  GUILD_BANNERS,
  getGuildBanner,
  STARTER_BANNER_KEY,
  validateMotto,
} from "../guildCosmetics/bannerCatalog";

describe("guild perk registry", () => {
  it("every perkKey is unique", () => {
    const seen = new Set<string>();
    for (const p of GUILD_PERKS) {
      expect(seen.has(p.perkKey)).toBe(false);
      seen.add(p.perkKey);
    }
  });

  it("getGuildPerk round-trips", () => {
    for (const p of GUILD_PERKS) {
      expect(getGuildPerk(p.perkKey)).toBe(p);
    }
  });

  it("applyGuildPerks: percentage bonuses stack additively", () => {
    // Two +5% dream perks → +10% total.
    const result = applyGuildPerks(100, "dream_pct", ["panopticon_relay"]);
    expect(result).toBe(105);
  });

  it("applyGuildPerks: card_draw bonus is flat additive", () => {
    const result = applyGuildPerks(3, "card_draw", ["oracles_blessing"]);
    expect(result).toBe(4);
  });

  it("applyGuildPerks: ignores perks of mismatched bonus type", () => {
    const result = applyGuildPerks(100, "dream_pct", ["iron_lions_drill"]);
    expect(result).toBe(100);
  });

  it("applyGuildPerks: empty unlock list returns base", () => {
    expect(applyGuildPerks(50, "dream_pct", [])).toBe(50);
  });

  it("applyGuildPerks: never returns below zero", () => {
    // -10% pvp dmg taken applied to 100 = 90, still positive.
    const result = applyGuildPerks(100, "pvp_dmg_taken_pct", ["enigma_vault_resilience"]);
    expect(result).toBe(90);
  });

  it("getQualifyingPerks: respects hall tier requirement", () => {
    const t1 = getQualifyingPerks(1, 99999);
    expect(t1.every((p) => p.requiredHallTier === 1)).toBe(true);
    const t5 = getQualifyingPerks(5, 99999);
    expect(t5.length).toBeGreaterThan(t1.length);
  });

  it("getQualifyingPerks: respects xp requirement", () => {
    const lowXp = getQualifyingPerks(5, 0);
    expect(lowXp.every((p) => p.requiredXp <= 0)).toBe(true);
  });

  it("getQualifyingPerks: respects faction alignment", () => {
    const empire = getQualifyingPerks(5, 99999, "empire");
    const insurgency = getQualifyingPerks(5, 99999, "insurgency");
    expect(empire.some((p) => p.factionAlignment === "insurgency")).toBe(false);
    expect(insurgency.some((p) => p.factionAlignment === "empire")).toBe(false);
  });
});

describe("guild quest registry", () => {
  it("every questKey is unique", () => {
    const seen = new Set<string>();
    for (const q of GUILD_QUESTS) {
      expect(seen.has(q.questKey)).toBe(false);
      seen.add(q.questKey);
    }
  });

  it("getGuildQuest round-trips", () => {
    for (const q of GUILD_QUESTS) {
      expect(getGuildQuest(q.questKey)).toBe(q);
    }
  });

  it("each scope has at least one quest", () => {
    expect(getGuildQuestsByScope("daily").length).toBeGreaterThan(0);
    expect(getGuildQuestsByScope("weekly").length).toBeGreaterThan(0);
    expect(getGuildQuestsByScope("seasonal").length).toBeGreaterThan(0);
  });

  it("questTarget produces a positive count for every quest", () => {
    for (const q of GUILD_QUESTS) {
      expect(questTarget(q.condition)).toBeGreaterThan(0);
    }
  });

  it("rewards are non-negative", () => {
    for (const q of GUILD_QUESTS) {
      expect(q.rewards.guildXp ?? 0).toBeGreaterThanOrEqual(0);
      expect(q.rewards.treasuryDream ?? 0).toBeGreaterThanOrEqual(0);
      expect(q.rewards.treasuryCredits ?? 0).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("banner catalog", () => {
  it("every bannerKey is unique", () => {
    const seen = new Set<string>();
    for (const b of GUILD_BANNERS) {
      expect(seen.has(b.bannerKey)).toBe(false);
      seen.add(b.bannerKey);
    }
  });

  it("getGuildBanner round-trips", () => {
    for (const b of GUILD_BANNERS) {
      expect(getGuildBanner(b.bannerKey)).toBe(b);
    }
  });

  it("STARTER_BANNER_KEY exists in the catalog", () => {
    expect(getGuildBanner(STARTER_BANNER_KEY)).toBeDefined();
  });
});

describe("motto validation", () => {
  it("accepts a clean short motto", () => {
    expect(validateMotto("For the Insurgency!").ok).toBe(true);
  });
  it("accepts an empty motto", () => {
    expect(validateMotto("").ok).toBe(true);
  });
  it("rejects mottos longer than 80 chars", () => {
    const r = validateMotto("a".repeat(81));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("too_long");
  });
  it("rejects profanity", () => {
    const r = validateMotto("oh shit");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("profanity");
  });
});
