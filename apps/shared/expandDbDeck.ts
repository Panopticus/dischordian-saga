/**
 * Expand a DB deck entry (`{ cardId, quantity }[]`) into a flat
 * `cardDefIds: string[]` array suitable for
 * `TcgClient.init({ p1DeckCardIds, ... })` and the shared
 * `validateDeck` format validator.
 *
 * The DB deck schema (`decks.cardList`) and the tcg-core engine
 * deck input shape are different: the DB stores a compact
 * count-per-card list, the engine wants a flat list with each
 * card repeated N times. This helper is the single bridge between
 * them so the DeckPickerModal + any future save/load flow agree
 * on one conversion.
 *
 * Defensive: filters out malformed rows (missing cardId, non-int
 * quantity, quantity <= 0) so a corrupted row in the DB doesn't
 * crash the match init.
 */

export interface DbDeckCardEntry {
  cardId: string;
  quantity: number;
}

export function expandDbDeckToCardDefIds(
  cardList: readonly DbDeckCardEntry[] | null | undefined,
): string[] {
  if (!cardList || cardList.length === 0) return [];
  const out: string[] = [];
  for (const entry of cardList) {
    if (!entry || typeof entry.cardId !== "string" || !entry.cardId) continue;
    const qty =
      Number.isInteger(entry.quantity) && entry.quantity > 0
        ? entry.quantity
        : 0;
    for (let i = 0; i < qty; i++) out.push(entry.cardId);
  }
  return out;
}

/**
 * Inverse: collapse a flat card-def-id list back into the
 * `{ cardId, quantity }[]` compact form the DB expects on save.
 * Order of output rows follows first-appearance order in the
 * input array for stable JSON blobs across re-saves.
 */
export function compactDeckToDbEntries(
  cardDefIds: readonly string[],
): DbDeckCardEntry[] {
  const order: string[] = [];
  const counts = new Map<string, number>();
  for (const id of cardDefIds) {
    if (typeof id !== "string" || !id) continue;
    if (!counts.has(id)) order.push(id);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return order.map((cardId) => ({ cardId, quantity: counts.get(cardId) ?? 0 }));
}
