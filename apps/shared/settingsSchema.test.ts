import { describe, it, expect } from "vitest";
import { settingsSchema, DEFAULT_SETTINGS } from "./settingsSchema";

describe("settingsSchema — caption size", () => {
  it("defaults captionSize to 'medium'", () => {
    expect(DEFAULT_SETTINGS.captionSize).toBe("medium");
  });

  it("accepts every documented preset", () => {
    for (const size of ["small", "medium", "large", "xlarge"] as const) {
      const parsed = settingsSchema.parse({ captionSize: size });
      expect(parsed.captionSize).toBe(size);
    }
  });

  it("rejects unknown caption sizes", () => {
    expect(() => settingsSchema.parse({ captionSize: "huge" })).toThrow();
    expect(() => settingsSchema.parse({ captionSize: 1.5 })).toThrow();
  });

  it("preserves other accessibility defaults when only captionSize is set", () => {
    const parsed = settingsSchema.parse({ captionSize: "xlarge" });
    expect(parsed.highContrast).toBe(false);
    expect(parsed.reduceMotion).toBe(false);
    expect(parsed.colorblindMode).toBe("off");
    expect(parsed.captions).toBe(false);
  });
});
