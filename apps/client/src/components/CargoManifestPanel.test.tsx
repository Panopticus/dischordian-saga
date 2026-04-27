/**
 * Structural tests for CargoManifestPanel — Phase 2.4.
 *
 * Verifies the panel reads canonical CargoItem fields, surfaces
 * canonical contraband + perishable + attribution stance per
 * Antiquarian "desks-do-not-run" canon, and totals canonical
 * mass + volume.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const src = fs.readFileSync(
  path.resolve(__dirname, "CargoManifestPanel.tsx"),
  "utf-8",
);

describe("CargoManifestPanel — canonical imports", () => {
  it("imports canonical CargoItem type + helpers from shared", () => {
    expect(src).toContain("CargoItem");
    expect(src).toContain("isCargoContrabandInFaction");
    expect(src).toContain("isAttributionCanonicallyComplete");
    expect(src).toContain('from "@shared/tradeEmpire/cargo"');
  });
});

describe("CargoManifestPanel — canonical-totals math", () => {
  it("aggregates canonical mass + volume across items", () => {
    expect(src).toContain("mass += item.mass");
    expect(src).toContain("volume += item.volume");
  });

  it("renders canonical-empty state when items.length === 0", () => {
    expect(src).toContain("items.length === 0");
    expect(src).toContain("canonically empty");
  });
});

describe("CargoManifestPanel — canonical-contraband stance", () => {
  it("respects canonical contrabandPerFaction override via helper", () => {
    expect(src).toContain("isCargoContrabandInFaction(item, currentFactionContext)");
  });

  it("falls back to canonical default contraband boolean when no faction context", () => {
    expect(src).toContain("item.contraband");
  });
});

describe("CargoManifestPanel — canonical-perishable canon", () => {
  it("computes canonical-shelf-life-spoiled per shipmentAgeHours", () => {
    expect(src).toContain("isPerishableSpoiled");
    expect(src).toContain("shipmentAgeHours >= item.shelfLifeHours");
  });

  it("computes canonical-shelf-life-expiring at 70% threshold", () => {
    expect(src).toContain("shelfLifeHours * 0.7");
  });

  it("renders canonical Spoiled / Expiring / Perishable badges", () => {
    expect(src).toContain("Spoiled");
    expect(src).toContain("Expiring");
    expect(src).toContain("Perishable");
  });
});

describe("CargoManifestPanel — canonical-attribution canon", () => {
  it("renders canonical attributionStanceCanon (Antiquarian canon)", () => {
    expect(src).toContain("item.attribution.attributionStanceCanon");
  });

  it("differentiates canonical complete / partial / deliberately_blank", () => {
    expect(src).toContain("attributionComplete");
    expect(src).toContain("deliberately_blank");
  });
});

describe("CargoManifestPanel — canonical-broker stamp", () => {
  it("surfaces canonical brokerOrigin when present", () => {
    expect(src).toContain("item.brokerOrigin");
  });

  it("surfaces canonical destinationSector when present", () => {
    expect(src).toContain("item.destinationSector");
  });
});

describe("CargoManifestPanel — canonical-row-click contract", () => {
  it("exposes canonical onItemClick callback when provided", () => {
    expect(src).toContain("onItemClick?.(item)");
  });
});
