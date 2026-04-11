/**
 * Deck code serialization — compact, URL-safe strings that encode the
 * contents of a TCG deck so players can share builds without any
 * backend round-trip.
 *
 * Format: `DS1.` + base64url( JSON( {v:1, c:[[cardId, qty], ...] } ) )
 *
 * The `DS1.` prefix is a human-readable version marker so future
 * format upgrades (e.g. binary packing) stay backward compatible.
 */

export interface DeckCodeEntry {
  cardId: string;
  quantity: number;
}

export interface DecodedDeck {
  version: number;
  cards: DeckCodeEntry[];
}

export const DECK_CODE_PREFIX = "DS1.";

const MAX_CARDS = 200; // hard cap to prevent abuse on import

function toBase64Url(input: string): string {
  const b64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(input, "utf-8").toString("base64")
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).btoa(unescape(encodeURIComponent(input)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") +
    "=".repeat((4 - (input.length % 4)) % 4);
  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return decodeURIComponent(escape((globalThis as any).atob(padded)));
}

/**
 * Encode a deck's card list into a compact shareable string.
 * Throws on empty input or invalid entries.
 */
export function encodeDeckCode(cards: DeckCodeEntry[]): string {
  if (!Array.isArray(cards) || cards.length === 0) {
    throw new Error("Cannot encode an empty deck");
  }
  const normalized: [string, number][] = [];
  for (const entry of cards) {
    if (!entry || typeof entry.cardId !== "string" || entry.cardId.length === 0) {
      throw new Error("Invalid deck entry: missing cardId");
    }
    if (!Number.isFinite(entry.quantity) || entry.quantity < 1) {
      throw new Error(`Invalid quantity for ${entry.cardId}`);
    }
    normalized.push([entry.cardId, Math.floor(entry.quantity)]);
  }
  const payload = JSON.stringify({ v: 1, c: normalized });
  return DECK_CODE_PREFIX + toBase64Url(payload);
}

/**
 * Parse a deck code string back into its card list.
 * Returns null on any parse / validation failure so callers can
 * surface a single "invalid code" toast without drilling into reasons.
 */
export function decodeDeckCode(code: string): DecodedDeck | null {
  if (typeof code !== "string") return null;
  const trimmed = code.trim();
  if (!trimmed.startsWith(DECK_CODE_PREFIX)) return null;
  const body = trimmed.slice(DECK_CODE_PREFIX.length);
  if (body.length === 0) return null;

  let json: string;
  try {
    json = fromBase64Url(body);
  } catch {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object") return null;
  const root = parsed as { v?: unknown; c?: unknown };
  if (root.v !== 1) return null;
  if (!Array.isArray(root.c)) return null;
  if (root.c.length > MAX_CARDS) return null;

  const cards: DeckCodeEntry[] = [];
  for (const raw of root.c) {
    if (!Array.isArray(raw) || raw.length !== 2) return null;
    const [cardId, quantity] = raw;
    if (typeof cardId !== "string" || cardId.length === 0 || cardId.length > 128) return null;
    if (!Number.isFinite(quantity) || (quantity as number) < 1 || (quantity as number) > 4) return null;
    cards.push({ cardId, quantity: Math.floor(quantity as number) });
  }

  return { version: 1, cards };
}
