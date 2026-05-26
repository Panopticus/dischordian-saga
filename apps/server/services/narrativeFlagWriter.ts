/* ═══════════════════════════════════════════════════════
   NARRATIVE FLAG WRITER — userProgress mutator

   Plan §"BioWare-Style Dialog Design" — the canonical
   writer the campaign outcome dispatcher forwards
   `setNarrativeFlag()` calls to.

   Mirrors the inline helpers in:
     • apps/server/routers/tradeMissions.ts  (tx-bound)
     • apps/server/routers/potentialIdentity.ts  (tx-bound)
     • apps/client/src/contexts/GameContext.tsx  (client-side)

   The dispatcher pathway is not transaction-bound today
   because a dialog-choice commit is a single mutation, not
   part of a larger atomic flow. If a caller needs
   transaction binding (so a flag write rolls back with a
   parent mutation), they can plug in their own
   tx-bound writer into the dispatch context instead of
   using this default.

   The function is intentionally tolerant — a missing
   userProgress row is logged but does not throw. Same
   "best-effort" contract the tradeMissions helper ships.
   ═══════════════════════════════════════════════════════ */
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import { logger } from "../logger";

type GameDataLike = Record<string, unknown>;

/**
 * Set a single narrative flag on `userProgress.gameData.narrativeFlags`.
 * Idempotent — setting an already-true flag is a no-op write.
 *
 * Returns `{ ok: true, written: boolean }` where `written: false`
 * means the flag was already at the requested value (and no DB
 * write happened) or no userProgress row exists for the user.
 */
export async function setUserNarrativeFlag(
  userId: number,
  flag: string,
  value: boolean,
): Promise<{ ok: boolean; written: boolean }> {
  const db = await getDb();
  if (!db) return { ok: false, written: false };

  try {
    const rows = await db
      .select({ gameData: userProgress.gameData })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    const row = rows[0];
    if (!row) {
      logger?.warn?.("narrativeFlagWriter.setUserNarrativeFlag: no userProgress row", {
        userId,
        flag,
      });
      return { ok: true, written: false };
    }
    const gameData = (row.gameData ?? {}) as GameDataLike;
    const current = (gameData.narrativeFlags ?? {}) as Record<string, boolean>;
    if (Boolean(current[flag]) === Boolean(value)) {
      return { ok: true, written: false };
    }
    const nextFlags = { ...current, [flag]: value };
    const nextGameData: GameDataLike = { ...gameData, narrativeFlags: nextFlags };
    await db
      .update(userProgress)
      .set({ gameData: nextGameData })
      .where(eq(userProgress.userId, userId));
    return { ok: true, written: true };
  } catch (err) {
    logger?.warn?.("narrativeFlagWriter.setUserNarrativeFlag: failed", {
      userId,
      flag,
      err: String(err),
    });
    return { ok: false, written: false };
  }
}
