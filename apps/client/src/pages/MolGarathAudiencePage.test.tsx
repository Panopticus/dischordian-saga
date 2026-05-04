/**
 * MolGarathAudiencePage — wiring contract.
 * Source-scan style.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "MolGarathAudiencePage.tsx"),
  "utf-8",
);

describe("MolGarathAudiencePage — endgame referee surface", () => {
  it("renders the canonical MOL_GARATH_EPILOGUE_SCENES from molGarathEpilogue.ts", () => {
    expect(SRC).toContain('from "@shared/tcg-core/story/molGarathEpilogue"');
    expect(SRC).toContain("MOL_GARATH_EPILOGUE_SCENES");
  });

  it("gates eligibility on Tier 3 chess climb completion", () => {
    expect(SRC).toContain("chess_climb_tier_3_complete");
  });

  it("persists MOL_GARATH_AUDIENCE_FLAG on completion", () => {
    expect(SRC).toContain("MOL_GARATH_AUDIENCE_FLAG");
    expect(SRC).toContain("setNarrativeFlag");
  });

  it("surfaces all three audience unlocks (annotations / traps feed / Hamlet final)", () => {
    expect(SRC).toContain("LABYRINTH_ANNOTATIONS");
    expect(SRC).toContain("TRAPS_IN_DESIGN");
    expect(SRC).toContain("Hamlet final connection");
  });

  it("links to /conspiracy-board on continue (the unlocked surface)", () => {
    expect(SRC).toContain('"/conspiracy-board"');
  });

  it("renders the not-yet-eligible state with Mol'Garath's voice", () => {
    expect(SRC).toContain("NotYetEligible");
    expect(SRC).toContain("centuries");
  });
});
