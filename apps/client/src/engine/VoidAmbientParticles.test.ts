/**
 * Unit tests for the pure helpers in VoidAmbientParticles.
 *
 * The component itself draws to a canvas and observes DOM mutations,
 * so per repo convention we don't render-test it. These tests cover
 * the deterministic logic that decides whether the canvas runs at all
 * and how many particles it spawns — exactly the regression surface
 * if a future theme adds a new particleEffect string or a future
 * accessibility setting changes how motion-intensity flows.
 */
import { describe, it, expect } from "vitest";
import {
  resolveParticleKind,
  targetCount,
  type ParticleKind,
} from "./VoidAmbientParticles";

describe("resolveParticleKind", () => {
  it.each([
    ["fireflies"], ["embers"], ["sparks"], ["data"], ["leaves"], ["static"],
  ] as const)("accepts canonical effect %s", (raw) => {
    expect(resolveParticleKind(raw)).toBe(raw);
  });

  it("trims whitespace from attribute values", () => {
    expect(resolveParticleKind("  fireflies  ")).toBe("fireflies");
  });

  it.each([null, undefined, "", "snowflakes", "FIREFLIES"])(
    "returns null for unknown / falsy %s",
    (raw) => {
      expect(resolveParticleKind(raw as unknown as string)).toBeNull();
    },
  );
});

describe("targetCount", () => {
  const KINDS: ParticleKind[] = [
    "fireflies", "embers", "sparks", "data", "leaves", "static",
  ];

  it("never drops below the floor of 6 even at zero motion-intensity", () => {
    for (const kind of KINDS) {
      expect(targetCount(kind, 0)).toBeGreaterThanOrEqual(6);
    }
  });

  it("monotonically increases (or stays equal) as motion-intensity rises", () => {
    for (const kind of KINDS) {
      const low = targetCount(kind, 0);
      const mid = targetCount(kind, 0.5);
      const full = targetCount(kind, 1);
      expect(mid).toBeGreaterThanOrEqual(low);
      expect(full).toBeGreaterThanOrEqual(mid);
    }
  });

  it("caps static at the highest density (CRT noise needs visual mass)", () => {
    // Sanity: static is the only effect we let go above ~30 particles.
    expect(targetCount("static", 1)).toBeGreaterThan(targetCount("data", 1));
    expect(targetCount("static", 1)).toBeGreaterThan(targetCount("fireflies", 1));
  });
});
