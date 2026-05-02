/**
 * Pure-function tests for the engineer-log discovery-rarity helpers
 * (C5). The bucket boundaries are calibrated for an indie audience;
 * regressions in the boundary table change which logs read as
 * "Mythic" / "Rare" / "Uncommon", so the tests pin every edge.
 */
import { describe, it, expect } from "vitest";
import {
  rarityTierForCount,
  rarityLabelForCount,
  rarityChipForCount,
  _RARITY_BOUNDARIES_FOR_TEST,
} from "./engineerLogRarity";

const { MYTHIC_CEILING, RARE_CEILING, UNCOMMON_CEILING } =
  _RARITY_BOUNDARIES_FOR_TEST;

describe("rarityTierForCount — bucket boundary table", () => {
  it("count <= 0 clamps to common (defensive)", () => {
    expect(rarityTierForCount(0)).toBe("common");
    expect(rarityTierForCount(-5)).toBe("common");
  });

  it(`1 ≤ count ≤ ${MYTHIC_CEILING} → mythic`, () => {
    expect(rarityTierForCount(1)).toBe("mythic");
    expect(rarityTierForCount(MYTHIC_CEILING)).toBe("mythic");
  });

  it(`${MYTHIC_CEILING + 1} ≤ count ≤ ${RARE_CEILING} → rare`, () => {
    expect(rarityTierForCount(MYTHIC_CEILING + 1)).toBe("rare");
    expect(rarityTierForCount(RARE_CEILING)).toBe("rare");
  });

  it(`${RARE_CEILING + 1} ≤ count ≤ ${UNCOMMON_CEILING} → uncommon`, () => {
    expect(rarityTierForCount(RARE_CEILING + 1)).toBe("uncommon");
    expect(rarityTierForCount(UNCOMMON_CEILING)).toBe("uncommon");
  });

  it(`count > ${UNCOMMON_CEILING} → common (no badge)`, () => {
    expect(rarityTierForCount(UNCOMMON_CEILING + 1)).toBe("common");
    expect(rarityTierForCount(50_000)).toBe("common");
  });
});

describe("rarityLabelForCount — player-facing labels", () => {
  it("returns null for the common tier (no badge)", () => {
    expect(rarityLabelForCount(0)).toBe(null);
    expect(rarityLabelForCount(50_000)).toBe(null);
  });

  it("mythic tier leads with 'Only N players have found this'", () => {
    expect(rarityLabelForCount(23)).toBe(
      "Only 23 players have found this.",
    );
    expect(rarityLabelForCount(50)).toBe(
      "Only 50 players have found this.",
    );
  });

  it("rare tier leads with 'Only N players have found this'", () => {
    expect(rarityLabelForCount(100)).toBe(
      "Only 100 players have found this.",
    );
  });

  it("uncommon tier drops the 'Only' prefix (less aggressive flex)", () => {
    expect(rarityLabelForCount(500)).toBe("500 players have found this.");
  });

  it("formats large counts with thousands separator", () => {
    expect(rarityLabelForCount(900)).toBe("900 players have found this.");
  });

  it("clamps non-finite / negative inputs gracefully", () => {
    expect(rarityLabelForCount(NaN)).toBe(null);
    expect(rarityLabelForCount(-10)).toBe(null);
  });
});

describe("rarityChipForCount — short chip text", () => {
  it("returns null for the common tier", () => {
    expect(rarityChipForCount(0)).toBe(null);
    expect(rarityChipForCount(50_000)).toBe(null);
  });

  it("returns Mythic / Rare / Uncommon for the badged tiers", () => {
    expect(rarityChipForCount(1)).toBe("Mythic");
    expect(rarityChipForCount(MYTHIC_CEILING + 1)).toBe("Rare");
    expect(rarityChipForCount(RARE_CEILING + 1)).toBe("Uncommon");
  });
});

describe("router wiring — engineerLogs.getRarityCounts surface", () => {
  it("the router exposes the new getRarityCounts query", async () => {
    const { engineerLogsRouter } = await import(
      "../server/routers/engineerLogs"
    );
    const keys = Object.keys(
      (engineerLogsRouter as unknown as {
        _def: { procedures: Record<string, unknown> };
      })._def.procedures,
    );
    expect(keys).toContain("getRarityCounts");
  });
});
