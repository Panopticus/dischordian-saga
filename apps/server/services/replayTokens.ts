/* ═══════════════════════════════════════════════════════
   REPLAY SHARE-TOKEN GENERATOR

   Produces unguessable URL-safe tokens for `game_replays.shareToken`
   so share-link URLs (/replay/<token>) can't be brute-forced from
   the autoincrement id. 16 bytes → 22 base64url chars after stripping
   padding, giving ~96 bits of entropy — orders of magnitude beyond
   what an attacker can scan against a "share-link" rate limit.

   Uses the global `crypto.getRandomValues` (provided by the Node 19+
   `webcrypto` global, which the polyfill in apps/server/_core/crypto-
   polyfill.ts guarantees is on `globalThis`). Pure / deterministic
   when a `getRandomValues` is injected, which keeps unit tests
   reproducible.
   ═══════════════════════════════════════════════════════ */

const TOKEN_BYTE_LENGTH = 16;

/** URL-safe base64 (RFC 4648 §5) of the given bytes, no padding. */
function base64url(bytes: Uint8Array): string {
  // Buffer is available in Node; on the edge of Node-vs-browser we'd
  // fall back to btoa, but this module is server-only so Buffer is fine.
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Generate a 22-char URL-safe random token (96 bits of entropy).
 *  Pass a `getRandomValues` override to make the function
 *  deterministic in unit tests. */
export function generateShareToken(
  getRandomValues: (buf: Uint8Array) => Uint8Array = defaultRandom,
): string {
  const bytes = new Uint8Array(TOKEN_BYTE_LENGTH);
  getRandomValues(bytes);
  return base64url(bytes);
}

function defaultRandom(buf: Uint8Array): Uint8Array {
  // crypto.getRandomValues is on globalThis after the crypto polyfill
  // runs at server startup. Pulling from globalThis instead of
  // importing `node:crypto` keeps the helper isomorphic for tests.
  const g = globalThis as { crypto?: { getRandomValues?: (b: Uint8Array) => Uint8Array } };
  if (!g.crypto?.getRandomValues) {
    throw new Error(
      "[replayTokens] crypto.getRandomValues unavailable — " +
        "the crypto polyfill in apps/server/_core/crypto-polyfill.ts " +
        "must run before this module is used",
    );
  }
  g.crypto.getRandomValues(buf);
  return buf;
}

/** Validate that a string looks like a token this module produced.
 *  Used by `getReplayByToken` so a hostile lookup with `?token=' OR
 *  1=1 --` is rejected before hitting the DB. */
export function isValidShareToken(value: unknown): value is string {
  if (typeof value !== "string") return false;
  // 16 bytes → 22 base64url chars, no padding. Allow ±2 in case a
  // future migration tweaks the length (e.g. 18 bytes → 24 chars).
  if (value.length < 20 || value.length > 24) return false;
  return /^[A-Za-z0-9_-]+$/.test(value);
}
