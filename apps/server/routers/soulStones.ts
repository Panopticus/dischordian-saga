// audit-allow-proc: collect
// `collect` is the player-facing narrative-claim mutation per
// SOUL_STONES_SYSTEM.md §1.3. The client consumer lands with the
// Soul-Stones UI page (scaffolded by main's PR #495 alongside the
// other declared-subsystem-runtime gates). Until the UI button
// surfaces, the route remains reachable for the integration harness
// + the per-router contract tests.
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
  summonDemonPet,
  WEEKLY_COLLECT_CAP,
  DEMON_PET_SUMMON_COST,
  type SoulStoneCounts,
} from "@shared/soulStones";
import { ensureSoulStonesRow, awardCombatDropStone } from "../services/soulStonesService";

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

  /** Summon a Demon Pet by spending DEMON_PET_SUMMON_COST red stones. */
  summon: protectedProcedure.mutation(async ({ ctx }) => {
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
      const result = summonDemonPet(rowToCounts(row));
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
      return {
        success: true as const,
        redSpent: result.redSpent,
        counts: result.newCounts,
        petPlaceholder: result.petPlaceholder,
      };
    });
  }),
});
