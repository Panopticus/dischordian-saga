import { describe, expect, it } from "vitest";

import { npcTrustBandFor } from "./useNpcTrustBand";

describe("npcTrustBandFor — pure scalar → band selector", () => {
  it("classifies the bottom range as hostile", () => {
    expect(npcTrustBandFor(0)).toBe("hostile");
    expect(npcTrustBandFor(19)).toBe("hostile");
  });

  it("classifies 20-39 as wary", () => {
    expect(npcTrustBandFor(20)).toBe("wary");
    expect(npcTrustBandFor(39)).toBe("wary");
  });

  it("classifies 40-59 as witnessed (the neutral midpoint)", () => {
    expect(npcTrustBandFor(40)).toBe("witnessed");
    expect(npcTrustBandFor(50)).toBe("witnessed");
    expect(npcTrustBandFor(59)).toBe("witnessed");
  });

  it("classifies 60-79 as present", () => {
    expect(npcTrustBandFor(60)).toBe("present");
    expect(npcTrustBandFor(79)).toBe("present");
  });

  it("classifies 80-100 as inheriting", () => {
    expect(npcTrustBandFor(80)).toBe("inheriting");
    expect(npcTrustBandFor(100)).toBe("inheriting");
  });

  it("is deterministic — same input always returns the same band", () => {
    expect(npcTrustBandFor(45)).toBe(npcTrustBandFor(45));
    expect(npcTrustBandFor(85)).toBe(npcTrustBandFor(85));
  });
});
