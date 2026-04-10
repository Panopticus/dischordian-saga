/* ═══════════════════════════════════════════════════════
   PROMO CODES ROUTER — Warhammer Tacticus-style redemption
   Supports player redemption + admin CRUD / stats.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb, isDuplicateKeyError } from "../db";
import { promoCodes, promoCodeRedemptions } from "../../drizzle/schema";
import { eq, sql, desc } from "drizzle-orm";

// Admin guard middleware (same pattern as admin.ts)
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const promoCodesRouter = router({
  /* ─── REDEEM A CODE (player) ─── */
  //
  // Concurrency notes:
  //  1. The whole redemption runs inside a DB transaction so any failure
  //     past the row-lock rolls back the counter increment.
  //  2. `SELECT ... FOR UPDATE` on the promo_codes row serializes concurrent
  //     redemptions of the same code so the cap check + increment are
  //     effectively atomic.
  //  3. The `uq_promo_code_redemptions_code_user` unique index (see
  //     drizzle/0036_promo_code_redemption_unique.sql) is a defence-in-depth
  //     guarantee against duplicate redemption by the same user even if
  //     the row lock is bypassed by a different code path.
  redeemCode: protectedProcedure
    .input(z.object({ code: z.string().min(1).max(64).transform(s => s.trim().toUpperCase()) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      return await db.transaction(async (tx) => {
        // Acquire a row-level lock on the promo_codes row for the duration
        // of this transaction. Any concurrent redemption of the same code
        // blocks here until we COMMIT/ROLLBACK.
        await tx.execute(
          sql`SELECT id FROM promo_codes WHERE code = ${input.code} FOR UPDATE`,
        );

        // Now read the (locked) promo row with typed columns.
        const rows = await tx.select().from(promoCodes)
          .where(eq(promoCodes.code, input.code))
          .limit(1);

        const promo = rows[0];
        if (!promo) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Invalid promo code" });
        }
        if (!promo.isActive) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "This code is no longer active" });
        }
        if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "This code has expired" });
        }
        if (
          promo.maxRedemptions !== null &&
          promo.maxRedemptions !== -1 &&
          promo.currentRedemptions >= promo.maxRedemptions
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This code has reached its maximum redemptions",
          });
        }

        // Insert the redemption. The unique index on (promoCodeId, userId)
        // is our second defence against double-redemption — if the same
        // user somehow bypasses the row lock, this still throws.
        try {
          await tx.insert(promoCodeRedemptions).values({
            promoCodeId: promo.id,
            userId: ctx.user.id,
          });
        } catch (err) {
          if (isDuplicateKeyError(err)) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "You have already redeemed this code",
            });
          }
          throw err;
        }

        // Increment the counter. Safe because the row is locked FOR UPDATE.
        await tx.update(promoCodes)
          .set({ currentRedemptions: sql`${promoCodes.currentRedemptions} + 1` })
          .where(eq(promoCodes.id, promo.id));

        return {
          success: true,
          description: promo.description,
          rewardType: promo.rewardType,
          rewardValue: promo.rewardValue as Record<string, unknown>,
        };
      });
    }),

  /* ─── LIST MY REDEEMED CODES (player) ─── */
  listMyCodes: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const redemptions = await db.select({
      id: promoCodeRedemptions.id,
      redeemedAt: promoCodeRedemptions.redeemedAt,
      code: promoCodes.code,
      description: promoCodes.description,
      rewardType: promoCodes.rewardType,
      rewardValue: promoCodes.rewardValue,
    })
      .from(promoCodeRedemptions)
      .innerJoin(promoCodes, eq(promoCodeRedemptions.promoCodeId, promoCodes.id))
      .where(eq(promoCodeRedemptions.userId, ctx.user.id))
      .orderBy(desc(promoCodeRedemptions.redeemedAt));

    return redemptions;
  }),

  /* ─── CREATE CODE (admin) ─── */
  createCode: adminProcedure
    .input(z.object({
      code: z.string().min(1).max(64).transform(s => s.trim().toUpperCase()),
      description: z.string().optional(),
      rewardType: z.enum(["cards", "dream_currency", "credits", "cosmetics", "mixed"]),
      rewardValue: z.record(z.string(), z.unknown()),
      maxRedemptions: z.number().int().default(-1),
      expiresAt: z.string().datetime().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Check for duplicate
      const existing = await db.select().from(promoCodes)
        .where(eq(promoCodes.code, input.code))
        .limit(1);
      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "A code with this name already exists" });
      }

      await db.insert(promoCodes).values({
        code: input.code,
        description: input.description,
        rewardType: input.rewardType,
        rewardValue: input.rewardValue,
        maxRedemptions: input.maxRedemptions,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
        createdBy: ctx.user.id,
      });

      return { success: true };
    }),

  /* ─── LIST ALL CODES (admin) ─── */
  listAllCodes: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const codes = await db.select().from(promoCodes)
      .orderBy(desc(promoCodes.createdAt));

    return codes;
  }),

  /* ─── DEACTIVATE CODE (admin) ─── */
  deactivateCode: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db.update(promoCodes)
        .set({ isActive: false })
        .where(eq(promoCodes.id, input.id));

      return { success: true };
    }),

  /* ─── CODE STATS (admin) ─── */
  getCodeStats: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const codeRows = await db.select().from(promoCodes)
        .where(eq(promoCodes.id, input.id))
        .limit(1);
      if (!codeRows[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Code not found" });
      }

      const redemptions = await db.select({
        id: promoCodeRedemptions.id,
        userId: promoCodeRedemptions.userId,
        redeemedAt: promoCodeRedemptions.redeemedAt,
      })
        .from(promoCodeRedemptions)
        .where(eq(promoCodeRedemptions.promoCodeId, input.id))
        .orderBy(desc(promoCodeRedemptions.redeemedAt));

      return {
        ...codeRows[0],
        redemptions,
      };
    }),
});
