import { describe, it, expect } from "vitest";
import { QUOTE_THEMES, pairQuotes, formatPairedCitation } from "./chessQuoteCanon";
import { REAL_QUOTES } from "./chessQuoteCanon.real";
import { LORE_QUOTES } from "./chessQuoteCanon.lore";

describe("chessQuoteCanon", () => {
  it("every theme has at least one REAL quote", () => {
    for (const theme of QUOTE_THEMES) {
      const any = REAL_QUOTES.some((q) => q.themes.includes(theme));
      expect(any, `theme "${theme}" needs a REAL quote`).toBe(true);
    }
  });

  it("every theme has at least one LORE quote", () => {
    for (const theme of QUOTE_THEMES) {
      const any = LORE_QUOTES.some((q) => q.themes.includes(theme));
      expect(any, `theme "${theme}" needs a LORE quote`).toBe(true);
    }
  });

  it("pairQuotes returns matched real + lore quotes on the requested theme", () => {
    for (const theme of QUOTE_THEMES) {
      const pair = pairQuotes(theme, "seed-1");
      expect(pair.real.themes).toContain(theme);
      expect(pair.lore.themes).toContain(theme);
    }
  });

  it("pairQuotes is deterministic when seeded", () => {
    const a = pairQuotes("deception", "same-seed");
    const b = pairQuotes("deception", "same-seed");
    expect(a.real.id).toBe(b.real.id);
    expect(a.lore.id).toBe(b.lore.id);
  });

  it("formatPairedCitation includes both authors and both texts", () => {
    const pair = pairQuotes("patience", "seed-test");
    const line = formatPairedCitation(pair);
    expect(line).toContain(pair.real.author);
    expect(line).toContain(pair.real.text);
    expect(line).toContain(pair.lore.figure);
    expect(line).toContain(pair.lore.text);
  });

  it("quote canon is small (< 20 entries each side)", () => {
    expect(REAL_QUOTES.length).toBeLessThanOrEqual(20);
    expect(LORE_QUOTES.length).toBeLessThanOrEqual(20);
  });
});
