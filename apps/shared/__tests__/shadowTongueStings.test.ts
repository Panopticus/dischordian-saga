import { describe, it, expect } from "vitest";

import {
  SHADOW_TONGUE_STINGS,
  pickSting,
  stingVoiceUrl,
  stingsByKind,
} from "../shadowTongueStings";

describe("shadowTongueStings — bank shape", () => {
  it("loads at least one sting", () => {
    expect(SHADOW_TONGUE_STINGS.length).toBeGreaterThan(0);
  });

  it("ids are unique", () => {
    const ids = SHADOW_TONGUE_STINGS.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every sting has a known kind", () => {
    const valid = new Set(["revealed", "contradicted", "edited_back", "escalated"]);
    for (const s of SHADOW_TONGUE_STINGS) {
      expect(valid.has(s.kind)).toBe(true);
    }
  });

  it("every kind has at least one sting (so pickSting never returns null in production)", () => {
    expect(stingsByKind("revealed").length).toBeGreaterThan(0);
    expect(stingsByKind("contradicted").length).toBeGreaterThan(0);
    expect(stingsByKind("edited_back").length).toBeGreaterThan(0);
    expect(stingsByKind("escalated").length).toBeGreaterThan(0);
  });

  it("text is non-empty and short (≤ ~120 chars for ~3-5s of speech)", () => {
    for (const s of SHADOW_TONGUE_STINGS) {
      expect(s.text.length).toBeGreaterThan(8);
      expect(s.text.length).toBeLessThanOrEqual(120);
    }
  });
});

describe("pickSting", () => {
  it("returns a sting of the requested kind with deterministic random", () => {
    const sting = pickSting("revealed", () => 0);
    expect(sting?.kind).toBe("revealed");
  });

  it("randomness drives variation", () => {
    const a = pickSting("revealed", () => 0);
    const b = pickSting("revealed", () => 0.99);
    expect(a?.id).not.toBe(b?.id);
  });
});

describe("stingVoiceUrl", () => {
  it("returns null for ids not yet in the manifest (default state)", () => {
    expect(stingVoiceUrl("not_a_real_sting")).toBeNull();
  });
});
