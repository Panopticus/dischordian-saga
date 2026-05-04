/**
 * MolGarathTrapsFeedPage — wiring contract.
 * Source-scan style.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "MolGarathTrapsFeedPage.tsx"),
  "utf-8",
);
const APP_SRC = fs.readFileSync(
  path.resolve(__dirname, "..", "App.tsx"),
  "utf-8",
);

describe("MolGarathTrapsFeedPage", () => {
  it("imports the canonical TRAPS_IN_DESIGN list from molGarathEndgameLayer", () => {
    expect(SRC).toContain('from "@shared/molGarathEndgameLayer"');
    expect(SRC).toContain("TRAPS_IN_DESIGN");
  });

  it("gates rendering on MOL_GARATH_AUDIENCE_FLAG (audience must be completed)", () => {
    expect(SRC).toContain("MOL_GARATH_AUDIENCE_FLAG");
    expect(SRC).toContain("audienceComplete");
  });

  it("renders the canonical Mol'Garath voice tells (almost cheerful, archival)", () => {
    expect(SRC).toContain("Archivist");
  });

  it("uses livingUniverseEventActiveFlag to decide which traps are LIVE", () => {
    expect(SRC).toContain("livingUniverseEventActiveFlag");
    expect(SRC).toContain("data-live");
  });

  it("links back to the audience chamber", () => {
    expect(SRC).toContain('href="/mol-garath-audience"');
  });

  it("names every canonical trap designer (no missing voicing)", () => {
    expect(SRC).toContain("DESIGNER_LABEL");
    expect(SRC).toContain("the_warlord");
    expect(SRC).toContain("the_architect");
    expect(SRC).toContain("the_necromancer");
    expect(SRC).toContain("shadow_tongue");
    expect(SRC).toContain("the_meme");
    expect(SRC).toContain("the_red_death");
    expect(SRC).toContain("unattributed");
  });
});

describe("App.tsx — traps feed route", () => {
  it("registers the lazy import for MolGarathTrapsFeedPage", () => {
    expect(APP_SRC).toContain("MolGarathTrapsFeedPage");
  });

  it("registers the /mol-garath-traps route", () => {
    expect(APP_SRC).toContain('path="/mol-garath-traps"');
  });
});
