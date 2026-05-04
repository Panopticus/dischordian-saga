/**
 * MolGarathAudienceOfferToast — wiring contract.
 * Source-scan style.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = fs.readFileSync(
  path.resolve(__dirname, "MolGarathAudienceOfferToast.tsx"),
  "utf-8",
);
const APP_SRC = fs.readFileSync(
  path.resolve(__dirname, "..", "App.tsx"),
  "utf-8",
);

describe("MolGarathAudienceOfferToast", () => {
  it("subscribes to the canonical chess climb state", () => {
    expect(SRC).toContain("trpc.chessClimb.getState.useQuery");
  });

  it("gates visibility on Tier 3 cleared (highestClearedRank >= 3)", () => {
    expect(SRC).toContain("highestClearedRank ?? -1) >= 3");
  });

  it("self-suppresses once the audience has been completed", () => {
    expect(SRC).toContain("MOL_GARATH_AUDIENCE_FLAG");
    expect(SRC).toContain("audienceComplete");
  });

  it("self-suppresses on /mol-garath route", () => {
    expect(SRC).toContain('location.startsWith("/mol-garath")');
  });

  it("provides the audience CTA linking to the canonical /mol-garath-audience route", () => {
    expect(SRC).toContain('href="/mol-garath-audience"');
  });

  it("persists a dismiss flag so the offer doesn't keep popping after refusal", () => {
    expect(SRC).toContain("OFFER_DISMISSED_FLAG");
    expect(SRC).toContain("mol_garath_audience_offer_dismissed");
  });

  it("frames the offer in Mol'Garath's voice (almost cheerful, archival)", () => {
    expect(SRC).toContain("Archivist");
    expect(SRC).toContain("centuries");
  });
});

describe("App.tsx — Mol'Garath audience offer mount", () => {
  it("imports the toast", () => {
    expect(APP_SRC).toContain('from "./components/MolGarathAudienceOfferToast"');
  });

  it("mounts <MolGarathAudienceOfferToast />", () => {
    expect(APP_SRC).toContain("<MolGarathAudienceOfferToast");
  });
});
