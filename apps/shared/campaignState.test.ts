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
  clearProgrammerGiftAccepted,
  getLightDarkAlignment,
  getProgrammerGiftAccepted,
  inMemoryStorage,
  setLightDarkAlignment,
  setProgrammerGiftAccepted,
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

describe("campaignState programmerGiftAccepted (§5.6)", () => {
  it("returns null before any choice has been made", () => {
    const storage = inMemoryStorage();
    expect(getProgrammerGiftAccepted(storage)).toBeNull();
  });

  it("round-trips an accept (true)", () => {
    const storage = inMemoryStorage();
    setProgrammerGiftAccepted(true, storage);
    expect(getProgrammerGiftAccepted(storage)).toBe(true);
  });

  it("round-trips a decline (false)", () => {
    const storage = inMemoryStorage();
    setProgrammerGiftAccepted(false, storage);
    expect(getProgrammerGiftAccepted(storage)).toBe(false);
  });

  it("distinguishes false (declined) from null (never presented)", () => {
    // Important for Acts 2+ codex variants — "declined" is its own
    // narrative branch, not identical to "never faced the Programmer".
    const storage = inMemoryStorage();
    setProgrammerGiftAccepted(false, storage);
    expect(getProgrammerGiftAccepted(storage)).toBe(false);
    clearProgrammerGiftAccepted(storage);
    expect(getProgrammerGiftAccepted(storage)).toBeNull();
  });

  it("rejects garbage values as null (defensive)", () => {
    const storage = inMemoryStorage();
    storage.set(
      "dischordia_campaign_programmer_gift_accepted",
      "maybe" as string,
    );
    expect(getProgrammerGiftAccepted(storage)).toBeNull();
  });

  it("uses a different storage key than Light/Dark (no collision)", () => {
    const storage = inMemoryStorage();
    setLightDarkAlignment("light", storage);
    setProgrammerGiftAccepted(true, storage);
    expect(getLightDarkAlignment(storage)).toBe("light");
    expect(getProgrammerGiftAccepted(storage)).toBe(true);
  });

  it("handles null storage without throwing", () => {
    expect(() => getProgrammerGiftAccepted(null)).not.toThrow();
    expect(getProgrammerGiftAccepted(null)).toBeNull();
    expect(() => setProgrammerGiftAccepted(true, null)).not.toThrow();
    expect(() => clearProgrammerGiftAccepted(null)).not.toThrow();
  });
});
