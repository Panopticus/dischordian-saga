import { describe, expect, it } from "vitest";
import {
  comparisonKey,
  isReservedName,
  normalizeDisplayName,
  validateDisplayName,
} from "../usernamePolicy";

describe("normalizeDisplayName", () => {
  it("strips zero-width characters", () => {
    expect(normalizeDisplayName("ad​min")).toBe("admin");
    expect(normalizeDisplayName("rac‌ho")).toBe("racho");
  });

  it("normalises NBSP to regular space and collapses whitespace", () => {
    expect(normalizeDisplayName("hello world")).toBe("hello world");
    expect(normalizeDisplayName("hello   world")).toBe("hello world");
  });

  it("NFKC-normalises compatibility characters", () => {
    // ﬃ U+FB03 → ffi
    expect(normalizeDisplayName("oﬃce")).toBe("office");
  });

  it("trims leading/trailing whitespace", () => {
    expect(normalizeDisplayName("   racho   ")).toBe("racho");
  });
});

describe("comparisonKey", () => {
  it("collapses Cyrillic homoglyphs to Latin equivalents", () => {
    // "аdmin" with Cyrillic 'а' (U+0430) → admin under collapse
    expect(comparisonKey("аdmin")).toBe("admin");
    expect(comparisonKey("admin")).toBe("admin");
  });

  it("strips non-alphanumerics", () => {
    expect(comparisonKey("_admin_")).toBe("admin");
    // 1↔l and 0↔o are intentionally collapsed for collision detection.
    expect(comparisonKey("admin.123")).toBe("adminl23");
    expect(comparisonKey("supp0rt")).toBe("support");
  });

  it("treats reserved variants as collisions", () => {
    expect(isReservedName("аdmin")).toBe(true); // Cyrillic а
    expect(isReservedName("Admin")).toBe(true);
    expect(isReservedName("_admin_")).toBe(true);
    expect(isReservedName("supp0rt")).toBe(true); // 0 → o
  });

  it("does not flag clearly distinct names", () => {
    expect(isReservedName("racho")).toBe(false);
    expect(isReservedName("malkia_ukweli")).toBe(false);
  });
});

describe("validateDisplayName", () => {
  it("accepts a normal name", () => {
    const r = validateDisplayName("Malkia Ukweli");
    expect(r.ok).toBe(true);
    expect(r.normalized).toBe("Malkia Ukweli");
  });

  it("rejects too-short", () => {
    expect(validateDisplayName("a").ok).toBe(false);
  });

  it("rejects too-long", () => {
    expect(validateDisplayName("a".repeat(33)).ok).toBe(false);
  });

  it("rejects reserved", () => {
    expect(validateDisplayName("admin").ok).toBe(false);
    expect(validateDisplayName("admin").reason).toBe("reserved");
  });

  it("rejects homoglyph-reserved", () => {
    const r = validateDisplayName("аdmin"); // Cyrillic а
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("homoglyph_reserved");
  });

  it("rejects RTL override and other shenanigans", () => {
    expect(validateDisplayName("racho‮evil").ok).toBe(false);
  });

  it("accepts diacritics and apostrophes", () => {
    expect(validateDisplayName("D'Arco").ok).toBe(true);
    expect(validateDisplayName("Renée").ok).toBe(true);
  });
});
