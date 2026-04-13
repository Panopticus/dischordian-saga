/**
 * Oracle Deck — registry (Phase E1e).
 *
 * Assembles the 23-card Oracle Deck from the per-batch files and
 * exports:
 *   - ORACLE_DECK: the full 23-card array in draw order (0-22)
 *   - ORACLE_DECK_MAP: slug → OracleCard lookup
 *   - ORACLE_DECK_BY_ID: numeric id → OracleCard lookup
 *   - getOracleCardBySlug(slug): OracleCard | undefined
 *   - getOracleCardById(id): OracleCard | undefined
 *   - listOracleCardsByUnlockKind(kind): OracleCard[]
 *
 * Every downstream consumer (spreads.ts, readings.ts, the router,
 * the client collection page) imports from here, not from the
 * batch files directly, so we have one canonical registry.
 */

import type { OracleCard, OracleUnlockKind } from "./oracleDeckTypes";
import { ORACLE_DECK_BATCH_1 } from "./oracleDeck_batch1";
import { ORACLE_DECK_BATCH_2 } from "./oracleDeck_batch2";
import { ORACLE_DECK_BATCH_3 } from "./oracleDeck_batch3";

/** The full 23-card Oracle Deck in draw order. Frozen. */
export const ORACLE_DECK: readonly OracleCard[] = Object.freeze([
  ...ORACLE_DECK_BATCH_1,
  ...ORACLE_DECK_BATCH_2,
  ...ORACLE_DECK_BATCH_3,
]);

/** Development-time sanity check — the deck must be exactly 23
 *  cards and every id 0-22 must be covered exactly once. The
 *  Engineer would call this a "compile-time invariant" except he
 *  cannot actually check it at compile time, so he settles for
 *  screaming in the console. */
if (ORACLE_DECK.length !== 23) {
  throw new Error(
    `ORACLE_DECK must contain exactly 23 cards — got ${ORACLE_DECK.length}. The 23 Enigma is not a suggestion.`,
  );
}
{
  const seen = new Set<number>();
  for (const card of ORACLE_DECK) {
    if (seen.has(card.id)) {
      throw new Error(`Duplicate Oracle card id: ${card.id}`);
    }
    seen.add(card.id);
  }
  for (let i = 0; i < 23; i++) {
    if (!seen.has(i)) {
      throw new Error(`Missing Oracle card id: ${i}`);
    }
  }
}

/** Slug → card lookup. */
export const ORACLE_DECK_MAP: Readonly<Record<string, OracleCard>> = Object.freeze(
  Object.fromEntries(ORACLE_DECK.map((c) => [c.slug, c])),
);

/** Numeric id → card lookup. */
export const ORACLE_DECK_BY_ID: Readonly<Record<number, OracleCard>> = Object.freeze(
  Object.fromEntries(ORACLE_DECK.map((c) => [c.id, c])),
);

/** Slug lookup helper — returns undefined for unknown slugs. */
export function getOracleCardBySlug(slug: string): OracleCard | undefined {
  return ORACLE_DECK_MAP[slug];
}

/** Numeric id lookup helper. */
export function getOracleCardById(id: number): OracleCard | undefined {
  return ORACLE_DECK_BY_ID[id];
}

/** Filter helper — return every card whose unlock condition uses
 *  the given kind. Used by the router to surface "cards you can
 *  earn from governance votes" etc. */
export function listOracleCardsByUnlockKind(
  kind: OracleUnlockKind,
): readonly OracleCard[] {
  return ORACLE_DECK.filter((c) => c.unlock.kind === kind);
}

/** Re-export the type so downstream files can import everything
 *  from one place. */
export type { OracleCard, OracleUnlockKind } from "./oracleDeckTypes";
