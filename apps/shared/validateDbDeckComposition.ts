/**
 * Server-side composition validator for DB-shaped decks
 * (`{ cardId, quantity }[]`).
 *
 * Complements the tcg-core `validateDeck` (which runs against a
 * format + registry): that one needs a general + flat cardDefIds
 * list, which the DB schema doesn't carry. This validator enforces
 * the rules that can be checked without the registry or general:
 *
 *   - Deck must be non-empty (zero-card decks are never valid).
 *   - Total deck size ≤ FORMAT_MAX_CARDS (engine's 39 excl. general
 *     + 1 headroom for format evolution).
 *   - Per-card quantity capped at FORMAT_MAX_COPIES.
 *   - No duplicate rows for the same cardId (two rows of the same
 *     cardId with qty 2 each would slip past the per-row cap).
 *   - cardId must be a non-empty string.
 *
 * The tRPC createDeck / updateDeck procedures call this before
 * hitting the DB so a malformed payload doesn't land as a
 * user-visible broken deck.
 */

export const FORMAT_MAX_CARDS = 40;
export const FORMAT_MAX_COPIES = 4;

export interface DbDeckCardEntry {
  cardId: string;
  quantity: number;
}

export type DeckValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateDbDeckComposition(
  cardList: readonly DbDeckCardEntry[] | null | undefined,
): DeckValidationResult {
  if (!cardList || cardList.length === 0) {
    return { ok: false, error: "deck is empty" };
  }
  const seen = new Map<string, number>();
  let total = 0;
  for (const entry of cardList) {
    if (!entry || typeof entry.cardId !== "string" || entry.cardId.length === 0) {
      return { ok: false, error: "deck contains an entry with a missing or blank cardId" };
    }
    if (!Number.isInteger(entry.quantity) || entry.quantity <= 0) {
      return {
        ok: false,
        error: `deck entry '${entry.cardId}' has non-positive quantity (${entry.quantity})`,
      };
    }
    if (entry.quantity > FORMAT_MAX_COPIES) {
      return {
        ok: false,
        error: `deck entry '${entry.cardId}' exceeds copy limit (${entry.quantity} > ${FORMAT_MAX_COPIES})`,
      };
    }
    if (seen.has(entry.cardId)) {
      return {
        ok: false,
        error: `deck has duplicate rows for '${entry.cardId}' — merge into a single row`,
      };
    }
    seen.set(entry.cardId, entry.quantity);
    total += entry.quantity;
  }
  if (total > FORMAT_MAX_CARDS) {
    return {
      ok: false,
      error: `deck total is ${total} cards (max ${FORMAT_MAX_CARDS})`,
    };
  }
  return { ok: true };
}
