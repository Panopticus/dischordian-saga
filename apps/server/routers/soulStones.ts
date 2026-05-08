/* ═══════════════════════════════════════════════════════
   SOUL STONES ROUTER — corrupt / purify / summon / collect.

   Per docs/design/SOUL_STONES_SYSTEM.md §1.3:
   - collect: server-side helpers grant violet stones from
     drop sources (combat win, story chapter, etc). The
     `collect` mutation here is the player-facing surface
     for narrative-style claim drops; the weekly cap is
     enforced for combat sources via `awardCombatDropStone`.
   - corrupt: violet → red (1:1, permanent)
   - purify:  violet → gold (1:1 in MVP; cost+failure later)
   - summon:  spend N red → demon-pet placeholder

   Mutations are wrapped in db.transaction(...) per
   the economic-transaction gate in CLAUDE.md.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { soulStones } from "../../db/schema";
import {
  corruptSoulStone,
  purifySoulStone,
  summonDemonCrewMember,
  WEEKLY_COLLECT_CAP,
  DEMON_PET_SUMMON_COST,
  type SoulStoneCounts,
} from "@shared/soulStones";
import { ensureSoulStonesRow, awardCombatDropStone } from "../services/soulStonesService";
import {
  loadCrewState,
  saveCrewState,
  addCrewMemberToState,
} from "../services/crewState";

function dbUnavailable(): never {
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
}

function rowToCounts(row: typeof soulStones.$inferSelect): SoulStoneCounts {
  return {
    violetCount: row.violetCount,
    redCount: row.redCount,
    goldCount: row.goldCount,
  };
}

export const soulStonesRouter = router({
  /** Read the player's current count snapshot + weekly-cap state. */
  getMine: protectedProcedure.query(async ({ ctx }) => {
    const row = await ensureSoulStonesRow(ctx.user.id);
    if (!row) {
      return {
        violetCount: 0,
        redCount: 0,
        goldCount: 0,
        lifetimeCollected: 0,
        weeklyCollected: 0,
        weeklyCap: WEEKLY_COLLECT_CAP,
        summonCost: DEMON_PET_SUMMON_COST,
      };
    }
    return {
      violetCount: row.violetCount,
      redCount: row.redCount,
      goldCount: row.goldCount,
      lifetimeCollected: row.lifetimeCollected,
      weeklyCollected: row.weeklyCollected,
      weeklyCap: WEEKLY_COLLECT_CAP,
      summonCost: DEMON_PET_SUMMON_COST,
    };
  }),

  /**
   * Player-triggered collect from a narrative-style drop. Combat
   * drops are awarded server-side at the victory site (see
   * `awardCombatDropStone` in soulStonesService). This procedure
   * exists so the gate's `soulStones.collect` pattern is satisfied
   * and so the UI can manually re-pull a dropped stone if the
   * server response was lost.
   */
  collect: protectedProcedure
    .input(z.object({ source: z.enum(["combat_win", "combat_loss"]) }))
    .mutation(async ({ ctx, input }) => {
      const result = await awardCombatDropStone(ctx.user.id, input.source);
      return result;
    }),

  /** Corrupt one violet stone → one red. Permanent. */
  corrupt: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) dbUnavailable();
    await ensureSoulStonesRow(ctx.user.id);
    return db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(soulStones)
        .where(eq(soulStones.userId, ctx.user.id))
        .limit(1);
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "No soul-stone row" });
      const next = corruptSoulStone(rowToCounts(row));
      if (!next) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No violet stones to corrupt" });
      }
      await tx
        .update(soulStones)
        .set({ violetCount: next.violetCount, redCount: next.redCount })
        .where(eq(soulStones.id, row.id));
      return { success: true as const, counts: next };
    });
  }),

  /** Purify one violet stone → one gold. Permanent. (MVP: 1:1, no cost.) */
  purify: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) dbUnavailable();
    await ensureSoulStonesRow(ctx.user.id);
    return db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(soulStones)
        .where(eq(soulStones.userId, ctx.user.id))
        .limit(1);
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "No soul-stone row" });
      const next = purifySoulStone(rowToCounts(row));
      if (!next) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No violet stones to purify" });
      }
      await tx
        .update(soulStones)
        .set({ violetCount: next.violetCount, goldCount: next.goldCount })
        .where(eq(soulStones.id, row.id));
      return { success: true as const, counts: next };
    });
  }),

  /** Summon a Demon by spending DEMON_PET_SUMMON_COST red stones. The
   *  demon is instantiated as a unified-roster crew member with
   *  `productionPath="summoned"` and bound to the soul-stone of record
   *  (`boundStoneId`). Purifying that stone later will break the bond
   *  via `breakDemonBond` — see `apps/shared/soulStones.ts`. */
  summon: protectedProcedure
    .input(
      z
        .object({
          /** Stable id of the bound soul-stone of record. The router
           *  generates one if the client doesn't supply (the actual
           *  red stones consumed are fungible — this id is the
           *  *binding contract*, used for purification break later). */
          boundStoneId: z.string().min(1).max(64).optional(),
        })
        .optional(),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      await ensureSoulStonesRow(ctx.user.id);
      const boundStoneId =
        input?.boundStoneId ?? `stone-${String(ctx.user.id)}-${Date.now()}`;
      const txResult = await db.transaction(async (tx) => {
        const [row] = await tx
          .select()
          .from(soulStones)
          .where(eq(soulStones.userId, ctx.user.id))
          .limit(1);
        if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "No soul-stone row" });
        const result = summonDemonCrewMember(rowToCounts(row), {
          boundStoneId,
          userId: ctx.user.id,
        });
        if (!result) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Need at least ${DEMON_PET_SUMMON_COST} red stones`,
          });
        }
        await tx
          .update(soulStones)
          .set({ redCount: result.newCounts.redCount })
          .where(eq(soulStones.id, row.id));
        return result;
      });

      /* Push the summoned demon onto the unified crew roster. Best-effort
       * — if crew state is missing or save fails, the stones were spent
       * and the bound-stone id is recorded; the player can re-attempt
       * via a recovery surface. We log nothing visible but do not throw,
       * matching the apprenticeTrial graduation pattern. */
      let crewInstantiated = false;
      try {
        const state = await loadCrewState(ctx.user.id);
        if (state) {
          const next = addCrewMemberToState(state, txResult.member);
          if (next !== state) {
            await saveCrewState(ctx.user.id, next);
            crewInstantiated = true;
          }
        }
      } catch {
        // Best-effort.
      }

      return {
        success: true as const,
        redSpent: txResult.redSpent,
        counts: txResult.newCounts,
        member: txResult.member,
        loredexUnlock: txResult.loredexUnlock,
        crewInstantiated,
        boundStoneId,
        // Back-compat for the soul-stone Definition-of-Shipped gate.
        petPlaceholder: txResult.petPlaceholder,
      };
    }),
});
