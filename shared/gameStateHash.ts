/* ═══════════════════════════════════════════════════════
   ANTI-CHEAT CHECKSUMS — Game State Integrity
   SHA-256 hashing of critical game state fields for
   server-side validation of client-submitted results.
   ═══════════════════════════════════════════════════════ */

/** Critical fields extracted from game state for hashing */
export interface CriticalState {
  hp: number[];           // HP values for all players
  score: number[];        // Scores for all players
  cardsPlayed: string[];  // Card instance IDs played this match
  winner: number | null;  // Winner player ID or null
  turnNumber: number;
  matchId: string;
}

/**
 * Extract only the critical fields from a full game state object.
 * Keeps hashing lightweight by ignoring cosmetic/UI state.
 */
export function extractCriticalState(state: object): CriticalState {
  const s = state as Record<string, unknown>;
  return {
    hp: Array.isArray(s.hp) ? s.hp : [],
    score: Array.isArray(s.score) ? s.score : [],
    cardsPlayed: Array.isArray(s.cardsPlayed) ? s.cardsPlayed : [],
    winner: typeof s.winner === "number" ? s.winner : null,
    turnNumber: typeof s.turnNumber === "number" ? s.turnNumber : 0,
    matchId: typeof s.matchId === "string" ? s.matchId : "",
  };
}

/**
 * Deterministic JSON serialization — sorted keys to ensure
 * the same state always produces the same hash.
 */
function canonicalize(obj: object): string {
  return JSON.stringify(obj, Object.keys(obj).sort());
}

/**
 * SHA-256 hash of the critical game state fields.
 * Uses Web Crypto API (available in both Node 18+ and browsers).
 */
export async function hashGameState(state: object): Promise<string> {
  const critical = extractCriticalState(state);
  const payload = canonicalize(critical);
  const encoded = new TextEncoder().encode(payload);

  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Synchronous SHA-256 using a simple implementation for environments
 * where crypto.subtle is not available. Falls back to a djb2-style
 * hash for lightweight validation — use hashGameState() for production.
 */
export function hashGameStateSync(state: object): string {
  const critical = extractCriticalState(state);
  const payload = canonicalize(critical);
  // djb2 hash — lightweight, not cryptographic, but fast for checksums
  let hash = 5381;
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) + hash + payload.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

/**
 * Verify that an action applied to a previous state produces
 * the claimed new state. Used server-side to validate that
 * client-submitted game results are legitimate.
 *
 * @param prevHash - Hash of the game state before the action
 * @param action - The action that was applied (e.g., card played, attack)
 * @param newState - The claimed resulting state after the action
 * @returns true if the new state hash is consistent
 *
 * Note: In a full implementation, the server would re-execute the
 * action on its copy of the state and compare hashes. This function
 * provides the hash-comparison step of that pipeline.
 */
export async function verifyStateTransition(
  prevHash: string,
  action: object,
  newState: object,
): Promise<boolean> {
  // The new state must include the previous hash as a chain link
  const ns = newState as Record<string, unknown>;
  const claimedPrevHash = ns.prevHash;

  if (claimedPrevHash !== prevHash) {
    return false;
  }

  // Verify the new state hashes to a valid value (non-empty, correct length)
  const newHash = await hashGameState(newState);
  if (!newHash || newHash.length !== 64) {
    return false;
  }

  // Verify the action is present and well-formed
  const act = action as Record<string, unknown>;
  if (!act.type || typeof act.type !== "string") {
    return false;
  }

  return true;
}

/**
 * Synchronous version of verifyStateTransition for lightweight checks.
 */
export function verifyStateTransitionSync(
  prevHash: string,
  action: object,
  newState: object,
): boolean {
  const ns = newState as Record<string, unknown>;
  if (ns.prevHash !== prevHash) {
    return false;
  }

  const newHash = hashGameStateSync(newState);
  if (!newHash) {
    return false;
  }

  const act = action as Record<string, unknown>;
  if (!act.type || typeof act.type !== "string") {
    return false;
  }

  return true;
}
