/**
 * Chess Quote Canon — pairing utility.
 *
 * Given a theme, return one real-history quote + one in-world
 * quote on the same theme. Used by the mind-game dialog system
 * so the Game Master's citations always land in matched pairs
 * (the real quote gives the lesson legibility; the lore quote
 * earns the worldbuilding).
 */

import {
  QUOTE_THEMES,
  getRealQuotesByTheme,
  type QuoteTheme,
  type RealQuote,
} from "./chessQuoteCanon.real";
import { getLoreQuotesByTheme, type LoreQuote } from "./chessQuoteCanon.lore";

export { QUOTE_THEMES };
export type { QuoteTheme, RealQuote, LoreQuote };

export interface QuotePair {
  theme: QuoteTheme;
  real: RealQuote;
  lore: LoreQuote;
}

/** Deterministic string hash used for seed selection. */
function hashSeed(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

/** Pair a real-history quote with a lore quote, both matching the
 *  given theme. Throws if either side has no entry for the theme
 *  (catches canon gaps early). Deterministic when `seed` is
 *  provided; otherwise picks a random pairing.
 *
 *  `seed` example uses: the cue id, the match id, or the climb
 *  tier id — anything stable per narrative moment so repeat
 *  viewings of the same beat show the same pairing. */
export function pairQuotes(theme: QuoteTheme, seed?: string): QuotePair {
  const reals = getRealQuotesByTheme(theme);
  const lores = getLoreQuotesByTheme(theme);
  if (reals.length === 0) {
    throw new Error(
      `pairQuotes: no REAL quote for theme "${theme}". Add one in chessQuoteCanon.real.ts.`,
    );
  }
  if (lores.length === 0) {
    throw new Error(
      `pairQuotes: no LORE quote for theme "${theme}". Add one in chessQuoteCanon.lore.ts.`,
    );
  }
  const h = seed !== undefined ? hashSeed(seed) : Math.floor(Math.random() * 1e9);
  const real = reals[h % reals.length];
  const lore = lores[(h >>> 1) % lores.length];
  return { theme, real, lore };
}

/** Assemble a paired-citation line the GM can speak. Format:
 *   `<real.author> — "<real.text>" — and <lore.figure> at
 *    <lore.source>: "<lore.text>"` */
export function formatPairedCitation(pair: QuotePair): string {
  return `${pair.real.author} — "${pair.real.text}" — and ${pair.lore.figure}: "${pair.lore.text}"`;
}
