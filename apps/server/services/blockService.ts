/**
 * isBlocked(a, b) — does `a` block `b`?
 *
 * Cached for hot paths (chat broadcast). Cache TTL is short
 * (60s) since unblock should propagate quickly.
 */
import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import { userBlocks } from "../../db/schema";
import { cache } from "../cache";

const TTL_SECONDS = 60;

export async function isBlocked(blockerId: number, blockedId: number): Promise<boolean> {
  if (blockerId === blockedId) return false;
  const key = `block:${blockerId}:${blockedId}`;
  const cached = await cache.get<boolean>(key);
  if (cached !== null) return cached;
  const db = await getDb();
  if (!db) {
    await cache.set(key, false, TTL_SECONDS);
    return false;
  }
  const rows = await db
    .select()
    .from(userBlocks)
    .where(and(
      eq(userBlocks.blockerUserId, blockerId),
      eq(userBlocks.blockedUserId, blockedId),
    ));
  const result = rows.length > 0;
  await cache.set(key, result, TTL_SECONDS);
  return result;
}

/** Either side blocking the other. Used to gate DMs / trade. */
export async function isMutuallyBlocked(a: number, b: number): Promise<boolean> {
  const [ab, ba] = await Promise.all([
    isBlocked(a, b),
    isBlocked(b, a),
  ]);
  return ab || ba;
}
