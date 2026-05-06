/**
 * COSMETIC CATALOG ROUTER
 * ──────────────────────────────────────────────────
 * Procedures for the 3-tier cosmetic catalog defined in
 * apps/shared/cosmeticCatalog.ts. Coexists with the legacy
 * cosmeticShop router (which serves the older RPG-themed
 * Dream-only catalog from apps/shared/cosmeticShop.ts).
 *
 * This router supports both Dream and Void Crystal payment paths
 * — the "pay-to-enhance, not pay-to-win" core of the monetization
 * design: every T2 cosmetic has both prices so F2P and paid players
 * always have parallel paths to the same item.
 *
 * Ownership lives in `cosmeticCatalogOwnership` (apps/db/schema.ts);
 * the unique (userId, cosmeticId) index prevents double grants
 * under concurrent purchases.
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { dreamBalance, cosmeticCatalogOwnership } from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  ALL_COSMETICS,
  COSMETICS_BY_ID,
  type Cosmetic,
} from "../../shared/cosmeticCatalog";
import { ripple } from "../services/rippleEngine";
import { getEntitlements } from "../services/entitlementService";

/* ─── Helpers ─── */

interface OwnedCosmetic {
  cosmetic: Cosmetic;
  source: string;
  pricePaid: number;
  grantedAt: Date;
}

/**
 * Reads ownership rows for a user. Always returns an array (empty if
 * the user owns nothing). Joins against the in-memory catalog so any
 * row referencing a removed cosmetic id is silently dropped.
 */
async function readOwnedCosmetics(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
): Promise<OwnedCosmetic[]> {
  const rows = await db
    .select()
    .from(cosmeticCatalogOwnership)
    .where(eq(cosmeticCatalogOwnership.userId, userId));
  const owned: OwnedCosmetic[] = [];
  for (const row of rows) {
    const cosmetic = COSMETICS_BY_ID[row.cosmeticId];
    if (!cosmetic) continue; // catalog entry was removed
    owned.push({
      cosmetic,
      source: row.source,
      pricePaid: row.pricePaid,
      grantedAt: row.grantedAt,
    });
  }
  return owned;
}

/* ─── Router ─── */

export const cosmeticCatalogRouter = router({
  /** List the full catalog with affordability + ownership flags for
   *  the active player. Filters out cosmetics gated by entitlements
   *  the player doesn't hold (founder / authors edition). */
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      // No-DB safety: return the catalog with everything unowned/unaffordable.
      return ALL_COSMETICS.map((c) => ({
        ...c,
        owned: false,
        affordableWithDream: false,
        affordableWithVoidCrystals: false,
      }));
    }

    const [bal] = await db
      .select()
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, ctx.user.id))
      .limit(1);
    const dream = bal?.dreamTokens ?? 0;
    const vc = bal?.gems ?? 0;
    const ents = await getEntitlements(ctx.user.id);

    const owned = await readOwnedCosmetics(db, ctx.user.id);
    const ownedIds = new Set(owned.map((o) => o.cosmetic.id));

    return ALL_COSMETICS.filter((c) => {
      if (c.exclusivity === "founders" && !ents.foundingAuthor) return false;
      if (c.exclusivity === "authors_edition" && !ents.authorsEditionS2) return false;
      return true;
    }).map((c) => ({
      ...c,
      owned: ownedIds.has(c.id),
      affordableWithDream: c.priceDream > 0 && dream >= c.priceDream,
      affordableWithVoidCrystals: c.priceVoidCrystals > 0 && vc >= c.priceVoidCrystals,
    }));
  }),

  /** List cosmetics the player owns. */
  myCosmetics: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return readOwnedCosmetics(db, ctx.user.id);
  }),

  /** Buy a cosmetic with Dream tokens. Errors if the cosmetic is VC-only
   *  (T3) or already owned. */
  purchaseWithDream: protectedProcedure
    .input(z.object({ cosmeticId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const cosmetic = COSMETICS_BY_ID[input.cosmeticId];
      if (!cosmetic) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Cosmetic not found" });
      }
      if (cosmetic.priceDream <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This cosmetic is not purchasable with Dream",
        });
      }

      await db.transaction(async (tx) => {
        // Idempotency / already-owned check inside the tx.
        const [existing] = await tx
          .select()
          .from(cosmeticCatalogOwnership)
          .where(and(
            eq(cosmeticCatalogOwnership.userId, ctx.user.id),
            eq(cosmeticCatalogOwnership.cosmeticId, input.cosmeticId),
          ));
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Already owned" });
        }

        // Atomic conditional UPDATE — same fail-closed pattern as
        // store.purchaseWithDream / cosmeticShopRouter.purchaseCosmetic.
        const result = await tx.execute(sql`
          UPDATE dream_balance
          SET dream_tokens = dream_tokens - ${cosmetic.priceDream}
          WHERE user_id = ${ctx.user.id} AND dream_tokens >= ${cosmetic.priceDream}
        `);
        const affected = (result as unknown as Array<{ affectedRows?: number }>)[0]?.affectedRows ?? 0;
        if (affected === 0) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Insufficient Dream tokens",
          });
        }

        await tx.insert(cosmeticCatalogOwnership).values({
          userId: ctx.user.id,
          cosmeticId: input.cosmeticId,
          source: "dream",
          pricePaid: cosmetic.priceDream,
        });
      });

      await ripple.emit("store_purchase", {
        userId: ctx.user.id,
        amount: cosmetic.priceDream,
      });

      return { success: true, granted: cosmetic.id };
    }),

  /** Buy a cosmetic with Void Crystals. Errors if the cosmetic is
   *  Dream-only (T1) or already owned. */
  purchaseWithVoidCrystals: protectedProcedure
    .input(z.object({ cosmeticId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const cosmetic = COSMETICS_BY_ID[input.cosmeticId];
      if (!cosmetic) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Cosmetic not found" });
      }
      if (cosmetic.priceVoidCrystals <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This cosmetic is not purchasable with Void Crystals",
        });
      }

      // Bundle-exclusive cosmetics (priceDream=0 AND priceVoidCrystals=0)
      // are filtered by the priceVoidCrystals<=0 check above — they can
      // only be granted via product fulfilment, never bought directly.

      await db.transaction(async (tx) => {
        const [existing] = await tx
          .select()
          .from(cosmeticCatalogOwnership)
          .where(and(
            eq(cosmeticCatalogOwnership.userId, ctx.user.id),
            eq(cosmeticCatalogOwnership.cosmeticId, input.cosmeticId),
          ));
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Already owned" });
        }

        const result = await tx.execute(sql`
          UPDATE dream_balance
          SET gems = gems - ${cosmetic.priceVoidCrystals}
          WHERE user_id = ${ctx.user.id} AND gems >= ${cosmetic.priceVoidCrystals}
        `);
        const affected = (result as unknown as Array<{ affectedRows?: number }>)[0]?.affectedRows ?? 0;
        if (affected === 0) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Insufficient Void Crystals",
          });
        }

        await tx.insert(cosmeticCatalogOwnership).values({
          userId: ctx.user.id,
          cosmeticId: input.cosmeticId,
          source: "void_crystals",
          pricePaid: cosmetic.priceVoidCrystals,
        });
      });

      await ripple.emit("store_purchase", {
        userId: ctx.user.id,
        amount: cosmetic.priceVoidCrystals,
      });

      return { success: true, granted: cosmetic.id };
    }),
});
