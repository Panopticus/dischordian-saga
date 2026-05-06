// apps/server/services/demandService.test.ts
//
// Pure-function tests for demand helpers.

import { describe, it, expect } from "vitest";
import { _internals } from "./demandService";

describe("rarityForRep ladder", () => {
  it("scales rarity with rep tier", () => {
    expect(_internals.rarityForRep(0)).toBe("common");
    expect(_internals.rarityForRep(35)).toBe("uncommon");
    expect(_internals.rarityForRep(50)).toBe("rare");
    expect(_internals.rarityForRep(70)).toBe("epic");
    expect(_internals.rarityForRep(90)).toBe("legendary");
  });

  it("stays at common below 25", () => {
    expect(_internals.rarityForRep(-50)).toBe("common");
    expect(_internals.rarityForRep(0)).toBe("common");
    expect(_internals.rarityForRep(24)).toBe("common");
  });

  it("ladder rarities are members of RARITY_LADDER", () => {
    for (const rep of [0, 25, 50, 75, 100]) {
      expect(_internals.RARITY_LADDER).toContain(_internals.rarityForRep(rep));
    }
  });

  it("DEMAND_TTL_MS is one week", () => {
    expect(_internals.DEMAND_TTL_MS).toBe(7 * 24 * 60 * 60 * 1000);
  });
});
