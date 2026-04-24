import { describe, expect, it } from "vitest";

import { GALACTIC_MAP } from "../client/src/game/tradeEmpire";
import {
  TRADE_EMPIRE_ART_PROMPTS,
  TRADE_EMPIRE_CATEGORY_COUNTS,
  TRADE_EMPIRE_EXISTING_SECTOR_ART,
  TRADE_EMPIRE_SECTOR_ART_COVERAGE,
  TRADE_EMPIRE_STYLE_ANCHOR,
  composeTradeEmpireArtPrompt,
  type TradeEmpireArtCategory,
  type TradeEmpireArtPrompt,
} from "./tradeEmpireArtPrompts";

/**
 * The Trade Empire art vault is the single source of truth for
 * the 70 machine-generated prompts plus a coverage map for every
 * sector (prompted + pre-existing). These tests prevent silent
 * drift before a CSV is emitted to producers.
 */
describe("tradeEmpireArtPrompts catalog", () => {
  it("ships exactly 70 prompts", () => {
    expect(TRADE_EMPIRE_ART_PROMPTS.length).toBe(70);
  });

  it("category counts match declared TRADE_EMPIRE_CATEGORY_COUNTS", () => {
    const actual = new Map<TradeEmpireArtCategory, number>();
    for (const p of TRADE_EMPIRE_ART_PROMPTS) {
      actual.set(p.category, (actual.get(p.category) ?? 0) + 1);
    }
    for (const [category, expected] of Object.entries(
      TRADE_EMPIRE_CATEGORY_COUNTS,
    ) as [TradeEmpireArtCategory, number][]) {
      expect(actual.get(category) ?? 0).toBe(expected);
    }
    const declaredTotal = Object.values(TRADE_EMPIRE_CATEGORY_COUNTS).reduce(
      (s, n) => s + n,
      0,
    );
    expect(declaredTotal).toBe(70);
  });

  it("has no duplicate asset ids", () => {
    const seen = new Set<string>();
    for (const p of TRADE_EMPIRE_ART_PROMPTS) {
      expect(seen.has(p.assetId)).toBe(false);
      seen.add(p.assetId);
    }
    expect(seen.size).toBe(70);
  });

  it("every prompt has non-empty required fields", () => {
    for (const p of TRADE_EMPIRE_ART_PROMPTS) {
      expect(p.assetId).toMatch(/^[a-z0-9_]+$/);
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.resolution).toMatch(/^\d+x\d+$/);
      expect(p.palette.length).toBeGreaterThan(0);
      expect(p.composition.length).toBeGreaterThan(0);
      expect(p.negativePrompt.length).toBeGreaterThan(0);
      expect(["P0", "P1", "P2"]).toContain(p.priority);
      expect(["A", "B", "C", "D"]).toContain(p.reviewGate);
    }
  });

  it("Gate A holds exactly 4 style-lock pieces (2 wonders + 1 era + 1 encounter)", () => {
    const gateA = TRADE_EMPIRE_ART_PROMPTS.filter((p) => p.reviewGate === "A");
    expect(gateA.length).toBe(4);
    const byCat = new Map<TradeEmpireArtCategory, number>();
    for (const p of gateA) {
      byCat.set(p.category, (byCat.get(p.category) ?? 0) + 1);
    }
    expect(byCat.get("wonder")).toBe(2);
    expect(byCat.get("era_banner")).toBe(1);
    expect(byCat.get("encounter_key_art")).toBe(1);
  });

  it("composeTradeEmpireArtPrompt threads the global style anchor", () => {
    const sample: TradeEmpireArtPrompt = TRADE_EMPIRE_ART_PROMPTS[0];
    const composed = composeTradeEmpireArtPrompt(sample);
    expect(composed.startsWith(TRADE_EMPIRE_STYLE_ANCHOR)).toBe(true);
    expect(composed).toContain(sample.composition);
    expect(composed).toContain(sample.palette);
    expect(composed).toContain(sample.negativePrompt);
  });
});

describe("TRADE_EMPIRE_SECTOR_ART_COVERAGE", () => {
  it("covers every sector in GALACTIC_MAP exactly once", () => {
    const gameSectorIds = new Set(GALACTIC_MAP.map((s) => s.id));
    const coverageIds = new Set(Object.keys(TRADE_EMPIRE_SECTOR_ART_COVERAGE));

    // Every game sector must have coverage.
    for (const id of gameSectorIds) {
      expect(coverageIds.has(id)).toBe(true);
    }
    // No coverage entry may be orphaned.
    for (const id of coverageIds) {
      expect(gameSectorIds.has(id)).toBe(true);
    }
    expect(coverageIds.size).toBe(gameSectorIds.size);
  });

  it("marks exactly 4 sectors as pre-existing art", () => {
    const existing = Object.values(TRADE_EMPIRE_SECTOR_ART_COVERAGE).filter(
      (v) => v.kind === "existing",
    );
    expect(existing.length).toBe(4);
    // And those 4 are exactly the ones in TRADE_EMPIRE_EXISTING_SECTOR_ART.
    const existingIds = Object.entries(TRADE_EMPIRE_SECTOR_ART_COVERAGE)
      .filter(([, v]) => v.kind === "existing")
      .map(([id]) => id)
      .sort();
    expect(existingIds).toEqual(
      Object.keys(TRADE_EMPIRE_EXISTING_SECTOR_ART).sort(),
    );
  });

  it("marks exactly 33 sectors as prompted", () => {
    const prompted = Object.values(TRADE_EMPIRE_SECTOR_ART_COVERAGE).filter(
      (v) => v.kind === "prompt",
    );
    expect(prompted.length).toBe(33);
  });

  it("every prompted coverage entry references a real asset in the vault", () => {
    const assetIds = new Set(TRADE_EMPIRE_ART_PROMPTS.map((p) => p.assetId));
    for (const v of Object.values(TRADE_EMPIRE_SECTOR_ART_COVERAGE)) {
      if (v.kind === "prompt") {
        expect(assetIds.has(v.assetId)).toBe(true);
      }
    }
  });
});
