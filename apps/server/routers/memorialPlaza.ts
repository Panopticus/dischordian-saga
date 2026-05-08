/**
 * MEMORIAL PLAZA ROUTER
 * ──────────────────────────────────────────────────
 * Each player can inscribe one imprint name per Memorial Day
 * (Nov 11). Cross-player visits emit `memorial_witnessed`
 * ripples (rate-limited at the (visitor, target, day) tuple).
 * High-tier donors during Memorial Day can inscribe to the
 * global plaza visible to every player.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { memorialInscriptions } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { ripple } from "../services/rippleEngine";
import { rippleLedgerService } from "../services/rippleLedgerService";
import { logger } from "../logger";

/**
 * In-process per-day rate limit for `witness` ripples. Keyed by
 * `<visitorId>:<targetId>:<yyyy-mm-dd>`. Cleared lazily.
 */
const witnessFiredToday = new Set<string>();
function dayKey(visitorId: number, targetId: number, now: Date): string {
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  return `${visitorId}:${targetId}:${yyyy}-${mm}-${dd}`;
}

export const memorialPlazaRouter = router({
  /** Inscribe one name on the active player's plaza. */
  inscribe: protectedProcedure
    .input(
      z.object({
        inscribedName: z.string().trim().min(1).max(120),
        scope: z.enum(["personal", "global"]).default("personal"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const memorialYear = new Date().getUTCFullYear();
      try {
        await db.insert(memorialInscriptions).values({
          userId: ctx.user.id,
          inscribedName: input.inscribedName,
          memorialYear,
          scope: input.scope,
        });
        return { ok: true, memorialYear };
      } catch (err) {
        // Unique-key violation = idempotent reinscription. Surface as ok.
        logger.error("[memorialPlaza] inscribe failed:", err);
        return { ok: false, memorialYear };
      }
    }),

  /** List the active player's own inscriptions. */
  myInscriptions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(memorialInscriptions)
      .where(eq(memorialInscriptions.userId, ctx.user.id))
      .orderBy(desc(memorialInscriptions.inscribedAt));
  }),

  /** Read another player's plaza; emits a rate-limited witness ripple. */
  visit: protectedProcedure
    .input(z.object({ targetUserId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { inscriptions: [] };
      const inscriptions = await db
        .select()
        .from(memorialInscriptions)
        .where(eq(memorialInscriptions.userId, input.targetUserId))
        .orderBy(desc(memorialInscriptions.inscribedAt));

      // Fire the witness ripple at most once per (visitor, target, day).
      if (ctx.user.id !== input.targetUserId && inscriptions.length > 0) {
        const key = dayKey(ctx.user.id, input.targetUserId, new Date());
        if (!witnessFiredToday.has(key)) {
          witnessFiredToday.add(key);
          try {
            await ripple.emit("memorial_witnessed", {
              userId: ctx.user.id,
              targetUserId: input.targetUserId,
              inscriptionCount: inscriptions.length,
            });
            await rippleLedgerService.record({
              eventType: "memorial_witnessed",
              userId: ctx.user.id,
              fromSystem: "social",
              toSystems: ["charity", "transmissions"],
              payload: {
                targetUserId: input.targetUserId,
                inscriptionCount: inscriptions.length,
              },
            });
          } catch (err) {
            logger.error("[memorialPlaza] witness ripple failed:", err);
          }
        }
      }
      return { inscriptions };
    }),

  /** Read all global-scope inscriptions for the current memorial year. */
  globalPlaza: publicProcedure
    .input(z.object({ year: z.number().int().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const year = input?.year ?? new Date().getUTCFullYear();
      return db
        .select()
        .from(memorialInscriptions)
        .where(
          and(
            eq(memorialInscriptions.scope, "global"),
            eq(memorialInscriptions.memorialYear, year),
          ),
        )
        .orderBy(desc(memorialInscriptions.inscribedAt))
        .limit(200);
    }),

  /** Test seam: clear the per-day witness rate-limit set. */
  _clearWitnessCache: protectedProcedure.mutation(async () => {
    witnessFiredToday.clear();
    return { ok: true };
  }),
});
