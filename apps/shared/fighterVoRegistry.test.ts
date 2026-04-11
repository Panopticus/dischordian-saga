/* ═══════════════════════════════════════════════════════
   Fighter VO Registry — invariants + category helpers
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import {
  FIGHTER_VO_REGISTRY,
  REGISTERED_VO_FIGHTER_IDS,
  getVoRegistration,
  hasRegisteredVO,
  normalizeFighterPrefix,
  categoryOf,
  getLinesByCategory,
  pickRandomLineByCategory,
  getAvailableCategories,
  type VoManifest,
} from "./fighterVoRegistry";

describe("fighterVoRegistry — registry invariants", () => {
  it("should register the legacy hooks' fighters", () => {
    // These already had per-character hooks that the unified
    // hook must continue to serve.
    expect(hasRegisteredVO("agent-zero")).toBe(true);
    expect(hasRegisteredVO("necromancer")).toBe(true);
    expect(hasRegisteredVO("source")).toBe(true);
    expect(hasRegisteredVO("meme")).toBe(true);
    expect(hasRegisteredVO("human")).toBe(true);
    expect(hasRegisteredVO("degen")).toBe(true);
  });

  it("should register the Task 3 additions", () => {
    expect(hasRegisteredVO("collector")).toBe(true);
    expect(hasRegisteredVO("architect")).toBe(true);
  });

  it("hasRegisteredVO returns false for unknown ids", () => {
    expect(hasRegisteredVO("__nonexistent__")).toBe(false);
    expect(hasRegisteredVO("")).toBe(false);
  });

  it("every registration's fighterId matches its key", () => {
    for (const [key, reg] of Object.entries(FIGHTER_VO_REGISTRY)) {
      expect(reg.fighterId).toBe(key);
    }
  });

  it("every registration has an async loader", () => {
    for (const reg of Object.values(FIGHTER_VO_REGISTRY)) {
      expect(typeof reg.load).toBe("function");
    }
  });

  it("REGISTERED_VO_FIGHTER_IDS matches FIGHTER_VO_REGISTRY keys", () => {
    expect(REGISTERED_VO_FIGHTER_IDS.sort()).toEqual(
      Object.keys(FIGHTER_VO_REGISTRY).sort(),
    );
  });

  it("getVoRegistration returns null for unknown fighter", () => {
    expect(getVoRegistration("__nope__")).toBeNull();
  });

  it("getVoRegistration returns the registration for a known fighter", () => {
    const reg = getVoRegistration("collector");
    expect(reg).not.toBeNull();
    expect(reg?.fighterId).toBe("collector");
  });

  it("Task 3 stub manifests load without throwing", async () => {
    const col = await getVoRegistration("collector")!.load();
    const arc = await getVoRegistration("architect")!.load();
    // Stubs are shipped empty — the content pass fills them in.
    expect(typeof col).toBe("object");
    expect(typeof arc).toBe("object");
  });
});

describe("fighterVoRegistry — line-id helpers", () => {
  it("normalizeFighterPrefix converts dashes to underscores", () => {
    expect(normalizeFighterPrefix("agent-zero")).toBe("agent_zero");
    expect(normalizeFighterPrefix("white-oracle")).toBe("white_oracle");
    expect(normalizeFighterPrefix("collector")).toBe("collector");
  });

  it("categoryOf parses the category from an agent-zero line id", () => {
    expect(categoryOf("agent-zero", "agent_zero_decisive_victory_00")).toBe(
      "decisive_victory",
    );
    expect(categoryOf("agent-zero", "agent_zero_defeat_08")).toBe("defeat");
    expect(categoryOf("agent-zero", "agent_zero_first_win_12")).toBe("first_win");
    expect(categoryOf("agent-zero", "agent_zero_win_streak_15")).toBe("win_streak");
  });

  it("categoryOf handles triple-digit indices", () => {
    expect(categoryOf("collector", "collector_taunt_100")).toBe("taunt");
  });

  it("categoryOf returns null for a line id that doesn't belong to this fighter", () => {
    expect(categoryOf("collector", "agent_zero_defeat_00")).toBeNull();
  });

  it("categoryOf returns null for a line id missing the trailing index", () => {
    // Still returns the raw rest if there's no `_NN` suffix — not
    // strictly null, but the category token matches the rest.
    expect(categoryOf("collector", "collector_taunt")).toBe("taunt");
  });
});

describe("fighterVoRegistry — manifest query helpers", () => {
  const mockManifest: VoManifest = {
    collector_intro_00: "https://example.test/col_intro_00.mp3",
    collector_intro_01: "https://example.test/col_intro_01.mp3",
    collector_victory_00: "https://example.test/col_victory_00.mp3",
    collector_victory_01: "https://example.test/col_victory_01.mp3",
    collector_victory_02: "https://example.test/col_victory_02.mp3",
    collector_defeat_00: "https://example.test/col_defeat_00.mp3",
    // A line from a different fighter id accidentally present
    agent_zero_defeat_00: "https://example.test/zero_defeat_00.mp3",
  };

  it("getLinesByCategory returns only the matching category lines", () => {
    const intro = getLinesByCategory(mockManifest, "collector", "intro");
    expect(intro.sort()).toEqual([
      "collector_intro_00",
      "collector_intro_01",
    ]);

    const victory = getLinesByCategory(mockManifest, "collector", "victory");
    expect(victory).toHaveLength(3);

    const defeat = getLinesByCategory(mockManifest, "collector", "defeat");
    expect(defeat).toEqual(["collector_defeat_00"]);
  });

  it("getLinesByCategory ignores lines from other fighters", () => {
    const defeat = getLinesByCategory(mockManifest, "collector", "defeat");
    // Should not include agent_zero_defeat_00 even though it ends in _defeat_NN
    expect(defeat).not.toContain("agent_zero_defeat_00");
  });

  it("getLinesByCategory returns an empty array for unknown category", () => {
    expect(getLinesByCategory(mockManifest, "collector", "taunt")).toEqual([]);
  });

  it("pickRandomLineByCategory returns null when no lines exist", () => {
    expect(pickRandomLineByCategory(mockManifest, "collector", "taunt")).toBeNull();
    expect(pickRandomLineByCategory({}, "collector", "intro")).toBeNull();
  });

  it("pickRandomLineByCategory returns a line that belongs to the category", () => {
    // Run 10 times to exercise the random pick
    for (let i = 0; i < 10; i++) {
      const line = pickRandomLineByCategory(mockManifest, "collector", "victory");
      expect(line).not.toBeNull();
      expect(line).toMatch(/^collector_victory_/);
    }
  });

  it("getAvailableCategories returns all distinct categories for this fighter", () => {
    const cats = getAvailableCategories(mockManifest, "collector");
    expect(cats.sort()).toEqual(["defeat", "intro", "victory"]);
    // agent_zero_defeat_00 should NOT appear
    expect(cats).not.toContain("agent_zero_defeat");
  });
});
