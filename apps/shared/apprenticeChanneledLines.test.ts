import { describe, it, expect } from "vitest";
import {
  CHANNELED_TOPICS,
  DEFAULT_ENGINEER_TICS,
  APPRENTICE_AWARE_PAUSES,
  getChanneledTopic,
  resolveVariant,
  pickAwarePause,
  type EngineerDomainTopic,
} from "./apprenticeChanneledLines";

describe("apprenticeChanneledLines", () => {
  it("every topic is registered exactly once", () => {
    const ids = CHANNELED_TOPICS.map((t) => t.topic);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every topic has a non-empty fallback variant", () => {
    for (const topic of CHANNELED_TOPICS) {
      expect(topic.fallback.base.length).toBeGreaterThan(0);
    }
  });

  it("resolveVariant returns the archetype-specific entry when present", () => {
    const v = resolveVariant("crafting_imprint_laser", "artisan");
    expect(v.base).toContain("imprint laser");
    expect(v.channeledPhrase).toContain("clamp the binder");
  });

  it("resolveVariant falls back when archetype is not registered for that topic", () => {
    const v = resolveVariant("crafting_index_wall", "zealot");
    // index_wall has no zealot variant — fallback fires
    expect(v.base).toContain("index wall");
  });

  it("resolveVariant throws on unknown topic", () => {
    expect(() => resolveVariant("nonexistent" as EngineerDomainTopic, "artisan")).toThrow();
  });

  it("default engineer tics are non-empty", () => {
    expect(DEFAULT_ENGINEER_TICS.length).toBeGreaterThan(0);
    for (const t of DEFAULT_ENGINEER_TICS) expect(t.length).toBeGreaterThan(0);
  });

  it("apprentice aware-pauses are non-empty and realistic", () => {
    expect(APPRENTICE_AWARE_PAUSES.length).toBeGreaterThan(0);
    for (const p of APPRENTICE_AWARE_PAUSES) {
      expect(p.length).toBeGreaterThan(0);
      // Every pause begins with the ellipsis-pause register
      expect(p.startsWith("…") || p.startsWith("...")).toBe(true);
    }
  });

  it("pickAwarePause is deterministic for the same topic+archetype", () => {
    const a = pickAwarePause("deck_builder_intro", "artisan");
    const b = pickAwarePause("deck_builder_intro", "artisan");
    expect(a).toBe(b);
  });

  it("getChanneledTopic returns the right entry", () => {
    const t = getChanneledTopic("bench_three_frequencies");
    expect(t?.tutorialGateId).toBe("tutor_bench_three_frequencies");
  });

  it("the goggles_inherited topic has an Elara overlay (canon-load-bearing)", () => {
    const v = resolveVariant("goggles_inherited", "zealot");
    expect(v.elaraOverlay).toBeTruthy();
  });
});
