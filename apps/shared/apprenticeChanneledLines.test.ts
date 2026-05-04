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

  it("deck_builder_intro covers every archetype with a distinct base line", () => {
    const archetypes: Array<Parameters<typeof resolveVariant>[1]> = [
      "zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
      "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal",
    ];
    const seen = new Set<string>();
    for (const arch of archetypes) {
      const v = resolveVariant("deck_builder_intro", arch);
      seen.add(v.base);
    }
    // 12 archetypes, 12 distinct lines
    expect(seen.size).toBe(12);
  });

  it("archetype variants preserve the canonical channeled phrases (the Engineer's voice slipping through)", () => {
    // Sample three archetypes across three topics; each must carry a
    // channeled phrase from the canon list when one is supplied.
    const checks: Array<[Parameters<typeof resolveVariant>[0], Parameters<typeof resolveVariant>[1]]> = [
      ["deck_builder_intro", "zealot"],
      ["deck_builder_intro", "revenant"],
      ["crafting_imprint_laser", "scholar"],
      ["bench_three_frequencies", "oracle"],
    ];
    for (const [topic, arch] of checks) {
      const v = resolveVariant(topic, arch);
      expect(v.channeledPhrase).toBeTruthy();
    }
  });

  it("zealot voice is fervent (mentions covenant / grace / scriptural register)", () => {
    const v = resolveVariant("deck_builder_intro", "zealot");
    expect(v.base.toLowerCase()).toMatch(/covenant|grace|witness|forty/);
  });

  it("martyr voice is apologetic (must contain 'sorry' or apology marker)", () => {
    const v = resolveVariant("deck_builder_intro", "martyr");
    expect(v.base.toLowerCase()).toContain("sorry");
  });

  it("revenant voice carries the 'I have done this before' register", () => {
    const v = resolveVariant("crafting_imprint_laser", "revenant");
    expect(v.base.toLowerCase()).toMatch(/before|have done|some other|remember/);
  });
});
