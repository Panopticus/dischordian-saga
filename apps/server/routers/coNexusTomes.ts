/* ═══════════════════════════════════════════════════════
   CONEXUS TOMES ROUTER

   Player-facing API for the seven CoNexus Tomes shipped in
   apps/shared/coNexusTomes.ts. Tracks discovery via the
   npc_public_flags table using `conexus:tome:<id>:discovered`
   flags so unlocks survive prestige cycles.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";

import { protectedProcedure, router } from "../_core/trpc";
import { npcPublicFlags } from "../../db/schema";
import {
  CONEXUS_TOMES,
  tomeUnlockFlag,
  type CoNexusTomeId,
} from "../../shared/coNexusTomes";
import { getDb } from "../db";

const tomeIdSchema = z.enum([
  "the_garden_under_sand",
  "ledger_for_the_unborn",
  "the_breath_we_did_not_take",
  "calculus_of_the_long_table",
  "the_secondary_engineer",
  "what_kael_kept",
  "the_room_with_the_open_window",
]);

export const coNexusTomesRouter = router({
  /**
   * List every Tome with discovery state. Locked Tomes only
   * surface their teaser; discovered Tomes return the full
   * body. Always returns all seven (so the locked count is
   * visible even before discovery).
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const discoveredFlags = new Set<string>();
    if (db) {
      try {
        const rows = await db
          .select({ flag: npcPublicFlags.flag })
          .from(npcPublicFlags)
          .where(eq(npcPublicFlags.userId, ctx.user.id));
        for (const r of rows) discoveredFlags.add(r.flag);
      } catch {
        // soft fail; everything reads as locked
      }
    }

    return CONEXUS_TOMES.map((tome) => {
      const discovered = discoveredFlags.has(tomeUnlockFlag(tome.id));
      return {
        id: tome.id,
        title: tome.title,
        redactedTeaser: tome.redactedTeaser,
        body: discovered ? tome.body : null,
        discovered,
        earliestAct: tome.earliestAct,
        requiresFlag: tome.requiresFlag ?? null,
      };
    });
  }),

  /**
   * Mark a Tome as discovered. Idempotent — calling twice is a
   * no-op. The room hint dispatcher fires this when the player
   * enters the relevant room.
   */
  discover: protectedProcedure
    .input(z.object({ tomeId: tomeIdSchema }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { ok: false, alreadyDiscovered: false };
      const flag = tomeUnlockFlag(input.tomeId as CoNexusTomeId);
      const [existing] = await db
        .select()
        .from(npcPublicFlags)
        .where(and(
          eq(npcPublicFlags.userId, ctx.user.id),
          eq(npcPublicFlags.flag, flag),
        ))
        .limit(1);
      if (existing) return { ok: true, alreadyDiscovered: true };
      await db
        .insert(npcPublicFlags)
        .values({ userId: ctx.user.id, flag, setBy: "conexus_tome" })
        .onDuplicateKeyUpdate({
          set: { flag: sql`${npcPublicFlags.flag}` },
        });
      return { ok: true, alreadyDiscovered: false };
    }),
});
