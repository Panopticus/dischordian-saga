/* ═══════════════════════════════════════════════════════
   VEX REVEAL ADVANCER

   Item 2 of the choice-impact follow-up. The Vex reveal-stage
   resolver lives in apps/shared/vexRevealStage.ts and computes
   the canonical stage from a flag set, but nothing was writing
   `engineer_zero_confirmed` to npc_public_flags when the
   conditions became true. This service is the missing link.

   Call advanceVexRevealIfReady(userId) after any mutation that
   could plausibly cross a stage boundary:

     - governance vote close (engineer_zero_hint candidate)
     - act 5 entry
     - vex romance stage 2 commit (vex_played_for_one_listener)
     - manual admin override

   The service:
     1. reads the player's current flags from npc_public_flags
        and userProgress.gameData.narrativeFlags
     2. derives the player's current act
     3. calls resolveVexRevealStage(input)
     4. if the resolved stage is engineer_zero_confirmed AND
        the flag isn't already in npc_public_flags, write it
        (sticky public flag — companionComments has matching
        flag_set:engineer_zero_confirmed reactions)

   Idempotent. Safe to call from a hot path; the read+write
   path is two queries.
   ═══════════════════════════════════════════════════════ */

import { and, eq, sql } from "drizzle-orm";

import { npcPublicFlags, userProgress } from "../../db/schema";
import { resolveVexRevealStage, type VexRevealStage } from "../../shared/vexRevealStage";
import { getDb } from "../db";
import { logger } from "../logger";

const CONFIRMED_FLAG = "engineer_zero_confirmed";

export interface AdvanceResult {
  /** Stage the resolver returned. */
  stage: VexRevealStage;
  /** True when this call wrote engineer_zero_confirmed for the
   *  first time (i.e. the player just crossed the threshold). */
  newlyConfirmed: boolean;
}

/**
 * Advance the player's Vex reveal stage if the conditions are
 * now met. Returns the resolved stage and whether the
 * confirmation flag was newly written. Idempotent — calling
 * twice in a row returns newlyConfirmed: false on the second
 * call.
 */
export async function advanceVexRevealIfReady(
  userId: number,
): Promise<AdvanceResult> {
  const db = await getDb();
  if (!db) {
    return { stage: "eyes_of_reality", newlyConfirmed: false };
  }

  const flags = new Set<string>();
  let act = 0;

  // Read public flags
  try {
    const rows = await db
      .select({ flag: npcPublicFlags.flag })
      .from(npcPublicFlags)
      .where(eq(npcPublicFlags.userId, userId));
    for (const r of rows) flags.add(r.flag);
  } catch (err) {
    logger.warn("[vexRevealAdvancer] readPublicFlags failed:", err);
  }

  // Read narrative flags + act from userProgress.gameData
  try {
    const [row] = await db
      .select({ gameData: userProgress.gameData })
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    const gd = (row?.gameData as Record<string, unknown> | null) ?? null;
    const narrative = (gd?.narrativeFlags as Record<string, unknown> | undefined) ?? {};
    for (const [k, v] of Object.entries(narrative)) {
      if (v) flags.add(k);
    }
    // Act inference: highest act_N_started or act_N_completed flag.
    for (let a = 7; a >= 0; a--) {
      if (narrative[`act_${a}_started`] || narrative[`act_${a}_completed`]) {
        act = a;
        break;
      }
    }
  } catch (err) {
    logger.warn("[vexRevealAdvancer] readNarrativeFlags failed:", err);
  }

  const stage = resolveVexRevealStage({ flags, act });

  if (stage !== "engineer_zero_confirmed") {
    return { stage, newlyConfirmed: false };
  }
  if (flags.has(CONFIRMED_FLAG)) {
    return { stage, newlyConfirmed: false };
  }

  // Write the confirmation flag. The unique (userId, flag) index
  // makes this idempotent under race; onDuplicateKeyUpdate is a
  // no-op SET to keep the existing row.
  try {
    await db
      .insert(npcPublicFlags)
      .values({ userId, flag: CONFIRMED_FLAG, setBy: "vex_reveal_advancer" })
      .onDuplicateKeyUpdate({
        set: { flag: sql`${npcPublicFlags.flag}` },
      });
  } catch (err) {
    logger.warn("[vexRevealAdvancer] write confirmation flag failed:", err);
    return { stage, newlyConfirmed: false };
  }

  return { stage, newlyConfirmed: true };
}

/**
 * Advance every player who has engineer_zero_hint set but not
 * yet engineer_zero_confirmed. Useful for backfilling after a
 * rule change or for the dev shell. Returns the number of
 * players newly confirmed.
 */
export async function advanceAllEligible(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  // Find players with the hint flag.
  const candidates = await db
    .select({ userId: npcPublicFlags.userId })
    .from(npcPublicFlags)
    .where(eq(npcPublicFlags.flag, "engineer_zero_hint"));
  let advanced = 0;
  for (const { userId } of candidates) {
    const r = await advanceVexRevealIfReady(userId);
    if (r.newlyConfirmed) advanced += 1;
  }
  return advanced;
}
