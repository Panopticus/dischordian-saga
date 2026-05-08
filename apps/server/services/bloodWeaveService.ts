/* ═══════════════════════════════════════════════════════
   BLOOD WEAVE SERVICE — server-side persistence of the
   hierarchyAlignment track. Wraps the bloodWeaveAlignment
   table and the pure logic in apps/shared/bloodWeave.ts.

   Public surfaces:
    - getBloodWeaveState(userId) → BloodWeaveState
    - applyBloodWeaveDelta(userId, source, opts) → {
        state, newlyUnlocked, bandTransition?
      }

   The Hellbox router and the Resurrection Protocols router
   both call applyBloodWeaveDelta() after a successful
   restoration / quest completion. Demon summon / purify
   invoke it from the soulStones router.
   ═══════════════════════════════════════════════════════ */

import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { bloodWeaveAlignment } from "../../db/schema";
import {
  type BloodWeaveAlignmentSource,
  type BloodWeaveBand,
  type BloodWeaveState,
  applyAlignmentDelta,
  bandFor,
  createBloodWeaveState,
  newlyUnlockedEntries,
} from "../../shared/bloodWeave";

async function ensureRow(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const [existing] = await db
    .select()
    .from(bloodWeaveAlignment)
    .where(eq(bloodWeaveAlignment.userId, userId))
    .limit(1);
  if (existing) return;
  try {
    await db.insert(bloodWeaveAlignment).values({
      userId,
      resurrectionsPerformed: 0,
      alignmentValue: 0,
      revealedEntries: [],
      strippedEntries: [],
    });
  } catch {
    // Race tolerated.
  }
}

export async function getBloodWeaveState(userId: number): Promise<BloodWeaveState> {
  const db = await getDb();
  if (!db) return createBloodWeaveState();
  await ensureRow(userId);
  const [row] = await db
    .select()
    .from(bloodWeaveAlignment)
    .where(eq(bloodWeaveAlignment.userId, userId))
    .limit(1);
  if (!row) return createBloodWeaveState();
  return {
    alignmentValue: row.alignmentValue,
    revealedEntryIds: row.revealedEntries ?? [],
  };
}

export interface ApplyDeltaResult {
  state: BloodWeaveState;
  newlyUnlocked: readonly string[];
  bandBefore: BloodWeaveBand;
  bandAfter: BloodWeaveBand;
  bandCrossed: boolean;
}

export async function applyBloodWeaveDelta(
  userId: number,
  source: BloodWeaveAlignmentSource,
  opts: { now?: number; alsoCountResurrection?: boolean } = {},
): Promise<ApplyDeltaResult> {
  const before = await getBloodWeaveState(userId);
  const bandBefore = bandFor(before.alignmentValue);
  const next = applyAlignmentDelta(before, source, opts.now ?? Date.now());
  const newly = newlyUnlockedEntries(next);
  const persisted: BloodWeaveState = {
    ...next,
    revealedEntryIds: [...next.revealedEntryIds, ...newly],
  };
  const bandAfter = bandFor(persisted.alignmentValue);
  const db = await getDb();
  if (db) {
    await db
      .update(bloodWeaveAlignment)
      .set({
        alignmentValue: persisted.alignmentValue,
        revealedEntries: [...persisted.revealedEntryIds],
        ...(opts.alsoCountResurrection
          ? {
              resurrectionsPerformed:
                ((before as unknown as { _resCount?: number })._resCount ?? 0) + 1,
            }
          : {}),
      })
      .where(eq(bloodWeaveAlignment.userId, userId));
  }
  return {
    state: persisted,
    newlyUnlocked: newly,
    bandBefore,
    bandAfter,
    bandCrossed: bandBefore !== bandAfter,
  };
}
