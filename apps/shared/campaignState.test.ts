/**
 * Campaign state tests.
 *
 * Covers the §5.8.1 lightDarkAlignment round-trip via the injected
 * storage abstraction. The node-env vitest has no localStorage, so
 * tests use `inMemoryStorage()` — the SSR-safe default-storage path
 * is covered by the "no storage" branch.
 */
import { describe, it, expect } from "vitest";
import {
  clearLightDarkAlignment,
  getLightDarkAlignment,
  inMemoryStorage,
  setLightDarkAlignment,
} from "./campaignState";

describe("campaignState lightDarkAlignment", () => {
  it("returns null before any choice has been made", () => {
    const storage = inMemoryStorage();
    expect(getLightDarkAlignment(storage)).toBeNull();
  });

  it("round-trips a light alignment", () => {
    const storage = inMemoryStorage();
    setLightDarkAlignment("light", storage);
    expect(getLightDarkAlignment(storage)).toBe("light");
  });

  it("round-trips a dark alignment", () => {
    const storage = inMemoryStorage();
    setLightDarkAlignment("dark", storage);
    expect(getLightDarkAlignment(storage)).toBe("dark");
  });

  it("overwrites an existing alignment when set a second time", () => {
    // Spec §5 frames the pillar pick as one-shot at the UI layer,
    // but the schema itself does not gate rewrites. This test locks
    // in the permissive behavior so future UI changes don't depend
    // on schema enforcement.
    const storage = inMemoryStorage();
    setLightDarkAlignment("light", storage);
    setLightDarkAlignment("dark", storage);
    expect(getLightDarkAlignment(storage)).toBe("dark");
  });

  it("clearLightDarkAlignment removes the flag", () => {
    const storage = inMemoryStorage();
    setLightDarkAlignment("light", storage);
    clearLightDarkAlignment(storage);
    expect(getLightDarkAlignment(storage)).toBeNull();
  });

  it("rejects garbage values as null (defensive)", () => {
    // A stale save-file that somehow carries a non-light/dark value
    // should read as "choice not yet made" rather than crashing
    // Acts 2+ dialog branching.
    const storage = inMemoryStorage();
    storage.set("dischordia_campaign_light_dark_alignment", "grey" as string);
    expect(getLightDarkAlignment(storage)).toBeNull();
  });

  it("handles a null storage (SSR / node-env) without throwing", () => {
    expect(() => getLightDarkAlignment(null)).not.toThrow();
    expect(getLightDarkAlignment(null)).toBeNull();
    expect(() => setLightDarkAlignment("light", null)).not.toThrow();
    expect(() => clearLightDarkAlignment(null)).not.toThrow();
  });
});
