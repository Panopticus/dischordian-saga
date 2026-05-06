/**
 * Player entitlement service.
 *
 * Single write path for the boolean entitlement flags persisted at
 * `userProgress.gameData.entitlements.{foundingAuthor,authorsEditionS2}`.
 *
 * Read side lives in `playerExpansionState.ts` (which projects these
 * into `PlayerExpansionState.has{FoundingAuthor,AuthorsEditionS2}`),
 * consumed by `expansionUnlockService.evaluateUnlockCondition` to gate
 * the `se_founding_author` and `se_authors_edition_s2` cards.
 *
 * Both grant call sites — `admin.grantEntitlement` and the store's
 * `doFulfill` (when a product carries `rewards.entitlement`) — go
 * through this module so the merge logic is in exactly one place.
 *
 * Kept deliberately small: no business rules, no audit logging here.
 * Audit lives at the call site (admin: caller-id + change reason;
 * store: purchaseGrants ledger row).
 */

import { eq } from "drizzle-orm";
import type { DrizzleDb } from "../db";
import { userProgress } from "../../db/schema";

/** Either a top-level drizzle handle or a transactional one — same
 *  shape as the helper used in routers/store.ts. */
type TxOrDb = DrizzleDb | Parameters<Parameters<DrizzleDb["transaction"]>[0]>[0];

export type EntitlementKey = "foundingAuthor" | "authorsEditionS2";

const ENTITLEMENT_KEYS: readonly EntitlementKey[] = [
  "foundingAuthor",
  "authorsEditionS2",
];

export function isEntitlementKey(value: unknown): value is EntitlementKey {
  return typeof value === "string" && (ENTITLEMENT_KEYS as readonly string[]).includes(value);
}

/**
 * Merge `{ [key]: value }` into `userProgress.gameData.entitlements`.
 *
 * Creates the row if missing (player has never written gameData), and
 * creates the `entitlements` sub-object if missing. Other keys on
 * `gameData` and on `entitlements` are preserved.
 *
 * Returns `{ changed }` so callers can short-circuit no-op grants
 * (e.g. webhook retries) without having to diff themselves.
 */
export async function setEntitlement(
  tx: TxOrDb,
  userId: number,
  key: EntitlementKey,
  value: boolean,
): Promise<{ changed: boolean }> {
  const rows = await tx
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  const row = rows[0];

  type AnyRecord = Record<string, unknown>;
  const existingGameData: AnyRecord = (row?.gameData as AnyRecord) ?? {};
  const existingEntitlements: AnyRecord =
    (existingGameData.entitlements as AnyRecord) ?? {};

  if (existingEntitlements[key] === value) {
    return { changed: false };
  }

  const nextGameData: AnyRecord = {
    ...existingGameData,
    entitlements: { ...existingEntitlements, [key]: value },
  };

  if (row) {
    await tx
      .update(userProgress)
      .set({ gameData: nextGameData })
      .where(eq(userProgress.userId, userId));
  } else {
    await tx.insert(userProgress).values({
      userId,
      gameData: nextGameData,
    });
  }

  return { changed: true };
}

/**
 * Read the player's current entitlement flags. Always returns a populated
 * object with all known keys (defaults to `false`) so call sites can do
 * `(await getEntitlements(uid)).foundingAuthor` without null-guards.
 */
export async function getEntitlements(
  userId: number,
): Promise<Record<EntitlementKey, boolean>> {
  const { getDb } = await import("../db");
  const db = await getDb();
  const empty: Record<EntitlementKey, boolean> = {
    foundingAuthor: false,
    authorsEditionS2: false,
  };
  if (!db) return empty;
  const rows = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  const row = rows[0];
  if (!row) return empty;
  type AnyRecord = Record<string, unknown>;
  const gameData = (row.gameData as AnyRecord) ?? {};
  const ents = (gameData.entitlements as AnyRecord) ?? {};
  return {
    foundingAuthor: ents.foundingAuthor === true,
    authorsEditionS2: ents.authorsEditionS2 === true,
  };
}
