/* ═══════════════════════════════════════════════════════
   PLAYER EXPANSION STATE — server accessor

   Builds a `PlayerExpansionState` snapshot from `userProgress.
   gameData` so that `expansionUnlockService.ts` /
   `cardVisibility.ts` helpers can decide whether to expose
   each card to the active player.

   Read paths:
     completedActs    ← gameData.narrativeFlags["act_N_completed"]
     secretActsRevealed ← gameData.narrativeFlags["act_N_secret_revealed"]
     battlePassTier   ← gameData.battlePassTier (number, optional)
     hasFoundingAuthor  ← gameData.entitlements.foundingAuthor (bool)
     hasAuthorsEditionS2 ← gameData.entitlements.authorsEditionS2 (bool)

   Returns NULL_PLAYER_EXPANSION_STATE for unauth users (passed
   `null`/`undefined` userId) or when the gameData JSON is empty.
   ═══════════════════════════════════════════════════════ */

import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import {
  ALL_CARD_DEFINITIONS,
} from "@shared/tcg-core/cards";
import {
  NULL_PLAYER_EXPANSION_STATE,
  isCardUnlocked,
  type PlayerExpansionState,
} from "@shared/tcg-core/rewards/expansionUnlockService";
import { isReservedCard } from "@shared/tcg-core/cards/reservedCards";

const ACTS = [1, 2, 3, 4, 5, 6, 7] as const;

type AnyRecord = Record<string, unknown>;

function toBool(v: unknown): boolean {
  return v === true || v === 1 || v === "true";
}

function toNumber(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Read `userProgress.gameData` for the user and project it into a
 * PlayerExpansionState. Failures (no DB, no row, malformed JSON)
 * degrade to the NULL state — never throws.
 */
export async function getPlayerExpansionState(
  userId: number | null | undefined,
): Promise<PlayerExpansionState> {
  if (!userId) return NULL_PLAYER_EXPANSION_STATE;
  const db = await getDb();
  if (!db) return NULL_PLAYER_EXPANSION_STATE;

  const rows = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  const row = rows[0];
  if (!row) return NULL_PLAYER_EXPANSION_STATE;

  const gameData = (row.gameData ?? {}) as AnyRecord;
  const flags = (gameData.narrativeFlags ?? {}) as AnyRecord;
  const entitlements = (gameData.entitlements ?? {}) as AnyRecord;

  const completedActs = new Set<1 | 2 | 3 | 4 | 5 | 6 | 7>();
  const secretActsRevealed = new Set<1 | 2 | 3 | 4 | 5 | 6 | 7>();
  for (const a of ACTS) {
    if (toBool(flags[`act_${a}_completed`])) completedActs.add(a);
    if (toBool(flags[`act_${a}_secret_revealed`])) secretActsRevealed.add(a);
  }

  /* DLC chapter completion mirrors the client-side `derivePlayer
   * ExpansionStateFromFlags` semantics: any narrative flag matching
   * `dlc_chapter_<id>_complete` flips the chapter into the
   * completed-chapter set. Decoupled from the chapter registry so
   * this server file doesn't need to import it. */
  const completedDlcChapters = new Set<string>();
  for (const key of Object.keys(flags)) {
    if (!toBool(flags[key])) continue;
    const m = /^dlc_chapter_(.+)_complete$/.exec(key);
    if (m) completedDlcChapters.add(m[1]);
  }

  return {
    completedActs,
    secretActsRevealed,
    battlePassTier: toNumber(gameData.battlePassTier),
    hasFoundingAuthor: toBool(entitlements.foundingAuthor),
    hasAuthorsEditionS2: toBool(entitlements.authorsEditionS2),
    completedDlcChapters,
  };
}

/**
 * Returns the set of `CardDefinition.id` values that should NOT
 * be visible to the player under `state`. Walks `ALL_CARD_DEFINITIONS`
 * once — pure, no I/O. Cached values aren't worth it: the registry
 * is ~1200 entries and the pass is microseconds.
 *
 * Includes `reserved: true` cards as well so callers don't have to
 * chain a separate `isReservedCard()` filter.
 */
export function getLockedCardIds(state: PlayerExpansionState): Set<string> {
  const locked = new Set<string>();
  for (const def of ALL_CARD_DEFINITIONS) {
    if (isReservedCard(def)) {
      locked.add(def.id);
      continue;
    }
    if (!isCardUnlocked(def, state)) locked.add(def.id);
  }
  return locked;
}
