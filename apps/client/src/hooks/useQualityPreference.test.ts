/**
 * M6 — pure-helper tests for the quality-preset resolution table and
 * the per-renderer cap maps.
 *
 * Hook itself (subscribes to localStorage + window events) needs a
 * jsdom env — the project uses node, so we cover the resolver here
 * and source-scan the wiring in `useQualityPreference.test.ts`.
 */
import { describe, it, expect } from "vitest";
import {
  resolveQualityTier,
  pixiResolutionForTier,
  threeDprForTier,
} from "./useQualityPreference";

describe("resolveQualityTier — explicit user preference always wins", () => {
  for (const isMobile of [true, false]) {
    for (const detected of ["low", "high"] as const) {
      it(`'low' preference resolves to low (mobile=${isMobile} detected=${detected})`, () => {
        expect(resolveQualityTier("low", isMobile, detected)).toBe("low");
      });
      it(`'medium' preference resolves to medium (mobile=${isMobile} detected=${detected})`, () => {
        expect(resolveQualityTier("medium", isMobile, detected)).toBe("medium");
      });
      it(`'high' preference resolves to high (mobile=${isMobile} detected=${detected})`, () => {
        expect(resolveQualityTier("high", isMobile, detected)).toBe("high");
      });
    }
  }
});

describe("resolveQualityTier — 'auto' falls back to detector + isMobile", () => {
  it("detector says low → low, regardless of viewport", () => {
    expect(resolveQualityTier("auto", true, "low")).toBe("low");
    expect(resolveQualityTier("auto", false, "low")).toBe("low");
  });

  it("detector says high + mobile viewport → medium (recruitment-plan default)", () => {
    expect(resolveQualityTier("auto", true, "high")).toBe("medium");
  });

  it("detector says high + desktop viewport → high", () => {
    expect(resolveQualityTier("auto", false, "high")).toBe("high");
  });
});

describe("pixiResolutionForTier — caps below devicePixelRatio", () => {
  it("low always returns 1", () => {
    expect(pixiResolutionForTier("low", 1)).toBe(1);
    expect(pixiResolutionForTier("low", 3)).toBe(1);
  });

  it("medium caps at 1.5 even on a 3× retina display", () => {
    expect(pixiResolutionForTier("medium", 3)).toBe(1.5);
    expect(pixiResolutionForTier("medium", 2)).toBe(1.5);
  });

  it("medium honors a sub-1.5 devicePixelRatio without up-scaling", () => {
    expect(pixiResolutionForTier("medium", 1)).toBe(1);
    expect(pixiResolutionForTier("medium", 1.25)).toBe(1.25);
  });

  it("high caps at 2 even on a 3× retina display", () => {
    expect(pixiResolutionForTier("high", 3)).toBe(2);
    expect(pixiResolutionForTier("high", 2)).toBe(2);
  });

  it("high honors a sub-2 devicePixelRatio without up-scaling", () => {
    expect(pixiResolutionForTier("high", 1)).toBe(1);
    expect(pixiResolutionForTier("high", 1.5)).toBe(1.5);
  });
});

describe("threeDprForTier — currently mirrors pixiResolutionForTier", () => {
  it("returns identical values to pixiResolutionForTier across the matrix", () => {
    for (const tier of ["low", "medium", "high"] as const) {
      for (const dpr of [1, 1.5, 2, 3]) {
        expect(threeDprForTier(tier, dpr)).toBe(
          pixiResolutionForTier(tier, dpr),
        );
      }
    }
  });
});

describe("touch-device + tap-highlight invariants", () => {
  it("settings schema declares qualityPreference as a 4-state enum", async () => {
    const { settingsSchema } = await import("@shared/settingsSchema");
    const parsed = settingsSchema.parse({});
    expect(parsed.qualityPreference).toBe("auto");
    // Round-trip every legal value.
    for (const v of ["auto", "low", "medium", "high"] as const) {
      const out = settingsSchema.parse({ qualityPreference: v });
      expect(out.qualityPreference).toBe(v);
    }
    // Reject unknown values.
    expect(() => settingsSchema.parse({ qualityPreference: "ultra" })).toThrow();
  });
});
