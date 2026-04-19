import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";

/**
 * Source-level contract tests for DevVariantsPage.
 *
 * The page is a dev-only UI that runs locally and has no persistence;
 * a full render test isn't worth the fixture cost. Instead we guard
 * the shape of the module against regressions: it consumes the public
 * variant registry API and exposes the controls the spec requires.
 */

const SRC = fs.readFileSync(
  path.resolve(__dirname, "DevVariantsPage.tsx"),
  "utf-8",
);

describe("DevVariantsPage — contract", () => {
  it("imports the canonical resolver and registry", () => {
    expect(SRC).toContain('from "@shared/moralityTrustActVariants"');
    expect(SRC).toContain("VARIANT_REGISTRY");
    expect(SRC).toContain("resolveVariant");
    expect(SRC).toContain("bandForMorality");
    expect(SRC).toContain("bandForTrust");
  });

  it("exposes sliders for act (0-7) and morality (-100..100)", () => {
    expect(SRC).toMatch(/min=\{0\}\s+max=\{7\}/);
    expect(SRC).toMatch(/min=\{-100\}\s+max=\{100\}/);
  });

  it("exposes a per-companion trust slider (0..100)", () => {
    expect(SRC).toMatch(/min=\{0\}\s+max=\{100\}/);
    expect(SRC).toContain("trustByCompanion");
  });

  it("collects narrative flags from the registry's requiredFlags field", () => {
    expect(SRC).toContain("requiredFlags");
    expect(SRC).toContain("activeFlags");
  });

  it("supports filtering by surface type", () => {
    expect(SRC).toContain('surface: MoralityTrustActVariant["surface"]');
    for (const surface of [
      "room",
      "transmission",
      "npc_line",
      "journal",
      "wheel_followup",
    ]) {
      expect(SRC).toContain(`value="${surface}"`);
    }
  });

  it("displays the resolved variant id and specificity score", () => {
    expect(SRC).toContain("id: {r.resolved.id}");
    expect(SRC).toContain("specificityScore");
  });

  it("is only accessible via an explicit /dev/variants URL", () => {
    const appSrc = fs.readFileSync(
      path.resolve(__dirname, "../App.tsx"),
      "utf-8",
    );
    expect(appSrc).toContain('path="/dev/variants"');
    // Not linked from any main nav entry — guard against future regressions.
    const hubSrc = fs.readFileSync(
      path.resolve(__dirname, "WitnessingHubPage.tsx"),
      "utf-8",
    );
    expect(hubSrc).not.toContain("/dev/variants");
  });
});
