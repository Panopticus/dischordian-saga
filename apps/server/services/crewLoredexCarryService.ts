/* ═══════════════════════════════════════════════════════
   CREW LOREDEX CARRY SERVICE

   Per-(user × member × loredex entry) tracking of which crew
   members "carried" which loredex entries while alive — and
   stamping the unread entries memorial-only when the member
   dies. The dead literally take unread knowledge with them.

   Three roles:
     1. recordDiscovery — called from every loredex_entry_discovered
        emit site (rippleEngine.ts loredex handler). Picks the
        player's currently-active member as the carrier.
     2. markRead — called when the player opens an entry. Toggles
        read=1 so future deaths don't memorial-lock the entry.
     3. markMemorialOnDeath — called from the casualty branch of
        crewTick.ts via the carry_memorial_sweep side-effect.
        Stamps memorialAtCycle on every unread row for the dead
        member.

   Reads:
     getCarriedUnreadCount — used by loredexObituary.composeObituary
     listMemorialOnly — used by Memorial Wall UI
   ═══════════════════════════════════════════════════════ */
import { and, eq, isNull, sql } from "drizzle-orm";
import { getDb } from "../db";
import { crewMemberLoredexCarry, crewMembers } from "../../db/schema";
import { logger } from "../logger";

/** Pick the active carrier for a freshly-discovered loredex entry.
 *  Strategy: most-recently-updated live member. Returns null if the
 *  user has no living crew (the discovery is unattributed; the carry
 *  table is not written). */
export async function pickActiveCarrier(userId: number): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select({
      memberKey: crewMembers.memberKey,
      status: crewMembers.status,
      updatedAt: crewMembers.updatedAt,
    })
    .from(crewMembers)
    .where(eq(crewMembers.userId, userId));
  const live = rows.filter((r) => r.status !== "dead");
  if (!live.length) return null;
  live.sort(
    (a, b) =>
      (b.updatedAt?.valueOf() ?? 0) - (a.updatedAt?.valueOf() ?? 0),
  );
  return live[0]!.memberKey;
}

/** Idempotently record that a member discovered an entry at the given
 *  cycle. If the row already exists (composite unique on user+member+entry)
 *  this is a no-op. Returns true if a new row was inserted. */
export async function recordDiscovery(
  userId: number,
  memberKey: string,
  loredexEntryId: string,
  discoveredAtCycle: number,
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    await db
      .insert(crewMemberLoredexCarry)
      .values({
        userId,
        memberKey,
        loredexEntryId,
        discoveredAtCycle,
        read: 0,
      })
      .onDuplicateKeyUpdate({ set: { updatedAt: sql`CURRENT_TIMESTAMP` } });
    return true;
  } catch (err) {
    logger.warn("[crewLoredexCarryService.recordDiscovery] failed", {
      userId,
      memberKey,
      loredexEntryId,
      err: (err as Error).message,
    });
    return false;
  }
}

/** Mark every carry row for (userId, loredexEntryId) as read.
 *  Called when the player opens the loredex entry — applies across
 *  every member that carried it, not just the one who discovered it. */
export async function markRead(
  userId: number,
  loredexEntryId: string,
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const res = await db
    .update(crewMemberLoredexCarry)
    .set({ read: 1 })
    .where(and(
      eq(crewMemberLoredexCarry.userId, userId),
      eq(crewMemberLoredexCarry.loredexEntryId, loredexEntryId),
      eq(crewMemberLoredexCarry.read, 0),
    ));
  return (res as { rowsAffected?: number }).rowsAffected ?? 0;
}

/** Stamp memorialAtCycle on every still-unread carry row for the
 *  dead member. Called by the resurrection drain handler when it
 *  consumes a `carry_memorial_sweep` side-effect from a tick. */
export async function markMemorialOnDeath(
  userId: number,
  deceasedMemberKey: string,
  deathCycle: number,
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const res = await db
    .update(crewMemberLoredexCarry)
    .set({ memorialAtCycle: deathCycle })
    .where(and(
      eq(crewMemberLoredexCarry.userId, userId),
      eq(crewMemberLoredexCarry.memberKey, deceasedMemberKey),
      eq(crewMemberLoredexCarry.read, 0),
      isNull(crewMemberLoredexCarry.memorialAtCycle),
    ));
  return (res as { rowsAffected?: number }).rowsAffected ?? 0;
}

/** Count of unread, not-yet-memorialised entries this member is
 *  currently carrying. Used by composeObituary() to gate the
 *  memorial-only flag and the obituary's "took N entries with them"
 *  prose. */
export async function getCarriedUnreadCount(
  userId: number,
  memberKey: string,
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db
    .select({ id: crewMemberLoredexCarry.id })
    .from(crewMemberLoredexCarry)
    .where(and(
      eq(crewMemberLoredexCarry.userId, userId),
      eq(crewMemberLoredexCarry.memberKey, memberKey),
      eq(crewMemberLoredexCarry.read, 0),
      isNull(crewMemberLoredexCarry.memorialAtCycle),
    ));
  return rows.length;
}

/** List loredex entries that are memorial-only for this user (i.e. all
 *  carriers that ever held the entry are dead with it unread). The
 *  Memorial Wall surfaces these. */
export async function listMemorialOnly(userId: number): Promise<Array<{
  loredexEntryId: string;
  deceasedMemberKey: string;
  memorialAtCycle: number;
}>> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      loredexEntryId: crewMemberLoredexCarry.loredexEntryId,
      memberKey: crewMemberLoredexCarry.memberKey,
      memorialAtCycle: crewMemberLoredexCarry.memorialAtCycle,
    })
    .from(crewMemberLoredexCarry)
    .where(and(
      eq(crewMemberLoredexCarry.userId, userId),
      eq(crewMemberLoredexCarry.read, 0),
    ));
  return rows
    .filter((r): r is { loredexEntryId: string; memberKey: string; memorialAtCycle: number } => r.memorialAtCycle !== null)
    .map((r) => ({
      loredexEntryId: r.loredexEntryId,
      deceasedMemberKey: r.memberKey,
      memorialAtCycle: r.memorialAtCycle,
    }));
}
