import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { STORE_PRODUCTS, getProduct, getProductsByCategory, getFeaturedProducts } from "../products";
import { storePurchases, dreamBalance, shipUpgrades, playerBases, userCards, cards, purchaseGrants, type StorePurchase } from "../../db/schema";
import type { DrizzleDb } from "../db";

/** Either a top-level drizzle handle or a transactional one — the
 *  operation methods we need (select/insert/update) are common to
 *  both, so consumers don't care which they receive. */
type TxOrDb = DrizzleDb | Parameters<Parameters<DrizzleDb["transaction"]>[0]>[0];
import { eq, and, desc, sql } from "drizzle-orm";
import { ripple } from "../services/rippleEngine";

export const storeRouter = router({
  /** List all products, optionally filtered by category */
  listProducts: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(({ input }) => {
      if (input?.category) {
        return getProductsByCategory(input.category as any);
      }
      return STORE_PRODUCTS.sort((a, b) => a.sortOrder - b.sortOrder);
    }),

  /** Get featured products */
  getFeatured: publicProcedure.query(() => {
    return getFeaturedProducts();
  }),

  /** Create a Stripe checkout session for a product */
  createCheckout: protectedProcedure
    .input(z.object({ productKey: z.string(), quantity: z.number().min(1).max(10).default(1) }))
    .mutation(async ({ ctx, input }) => {
      const product = getProduct(input.productKey);
      if (!product) throw new Error("Product not found");
      if (product.priceUsd <= 0) throw new Error("This product cannot be purchased with real money");

      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) throw new Error("Stripe is not configured");

      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeKey);

      const origin = ctx.req.headers.origin || "https://loredex-os.app";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: product.priceUsd,
            },
            quantity: input.quantity,
          },
        ],
        mode: "payment",
        success_url: `${origin}/store?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/store?canceled=true`,
        client_reference_id: ctx.user.id.toString(),
        customer_email: ctx.user.email || undefined,
        allow_promotion_codes: true,
        metadata: {
          user_id: ctx.user.id.toString(),
          product_key: input.productKey,
          quantity: input.quantity.toString(),
          customer_name: ctx.user.name || "",
        },
      });

      return { checkoutUrl: session.url };
    }),

  /** Purchase with in-game credits */
  purchaseWithCredits: protectedProcedure
    .input(z.object({ productKey: z.string(), quantity: z.number().min(1).max(10).default(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const product = getProduct(input.productKey);
      if (!product) throw new Error("Product not found");
      if (product.priceCredits <= 0) throw new Error("This product cannot be purchased with credits");

      const totalCost = product.priceCredits * input.quantity;

      // Atomic: deduct/track + fulfilment + ledger row all in one
      // transaction. If anything in fulfilment throws, the
      // storePurchases insert rolls back too.
      const fulfillmentId = synthesiseFulfillmentId(
        "credits",
        ctx.user.id,
        input.productKey,
      );
      await db.transaction(async (tx) => {
        await tx.insert(storePurchases).values({
          userId: ctx.user.id,
          productKey: input.productKey,
          paymentMethod: "credits",
          quantity: input.quantity,
          amount: totalCost,
          fulfilled: 1,
        });
        await fulfillPurchase(
          ctx.user.id,
          input.productKey,
          input.quantity,
          fulfillmentId,
          tx,
        );
      });

      await ripple.emit("store_purchase", { userId: ctx.user.id, amount: totalCost });

      return { success: true, message: `Purchased ${product.name}!` };
    }),

  /** Purchase with Dream tokens */
  purchaseWithDream: protectedProcedure
    .input(z.object({ productKey: z.string(), quantity: z.number().min(1).max(10).default(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const product = getProduct(input.productKey);
      if (!product) throw new Error("Product not found");
      if (product.priceDream <= 0) throw new Error("This product cannot be purchased with Dream");
      const totalCost = product.priceDream * input.quantity;
      // Use transaction to ensure atomicity of currency operations.
      // Conditional UPDATE — affects 0 rows iff balance dropped below
      // cost between the implied check and the write (e.g. parallel
      // store + casino spend). Failing-closed avoids the silent
      // negative-balance bug.
      return await db.transaction(async (tx) => {
        const r = await tx.execute(sql`
          UPDATE dream_balance
          SET dream_tokens = dream_tokens - ${totalCost}
          WHERE user_id = ${ctx.user.id} AND dream_tokens >= ${totalCost}
        `);
        const affected = (r as unknown as Array<{ affectedRows?: number }>)[0]?.affectedRows ?? 0;
        if (affected === 0) {
          throw new Error("Insufficient Dream tokens");
        }
        await tx.insert(storePurchases).values({
          userId: ctx.user.id,
          productKey: input.productKey,
          paymentMethod: "dream",
          quantity: input.quantity,
          amount: totalCost,
          fulfilled: 1,
        });
        const fulfillmentId = synthesiseFulfillmentId(
          "dream",
          ctx.user.id,
          input.productKey,
        );
        await fulfillPurchase(
          ctx.user.id,
          input.productKey,
          input.quantity,
          fulfillmentId,
          tx,
        );

        await ripple.emit("store_purchase", { userId: ctx.user.id, amount: totalCost });

        return { success: true, message: `Purchased ${product.name}!` };
      });
    }),

  /** Get user's purchase history */
  myPurchases: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const purchases = await db
      .select()
      .from(storePurchases)
      .where(eq(storePurchases.userId, ctx.user.id))
      .orderBy(desc(storePurchases.createdAt))
      .limit(50);

    return purchases.map((p) => ({
      ...p,
      product: getProduct(p.productKey || ""),
    }));
  }),

  /** Get user's Dream balance.
   *
   * Reads only the four columns the client actually consumes.
   * Avoids selecting `difficultyModifier` here so the panel still
   * loads cleanly during the brief window between server start
   * and `bootstrapDreamBalanceDifficultyModifier()` finishing on a
   * fresh deploy (and during the migration-drift period where the
   * column may not exist yet). The boss-difficulty read uses its
   * own dedicated lookup path. */
  myDreamBalance: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { dreamTokens: 0, soulBoundDream: 0, totalDreamEarned: 0, dnaCode: 0 };

    const [balance] = await db
      .select({
        dreamTokens: dreamBalance.dreamTokens,
        soulBoundDream: dreamBalance.soulBoundDream,
        totalDreamEarned: dreamBalance.totalDreamEarned,
        dnaCode: dreamBalance.dnaCode,
      })
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, ctx.user.id))
      .limit(1);

    if (!balance) {
      await db.insert(dreamBalance).values({
        userId: ctx.user.id,
        dreamTokens: 10,
        soulBoundDream: 0,
        totalDreamEarned: 10,
        dnaCode: 0,
      });
      return { dreamTokens: 10, soulBoundDream: 0, totalDreamEarned: 10, dnaCode: 0 };
    }

    return balance;
  }),
});

/**
 * Synthesise a stable fulfilment id for non-Stripe flows. The format
 * is deliberately opaque — only uniqueness and stability matter, and
 * the prefix tells refund tooling at a glance which flow originated
 * the grant.
 */
export function synthesiseFulfillmentId(
  source: "credits" | "dream" | "manual",
  userId: number,
  productKey: string,
): string {
  return `${source}:${userId}:${productKey}:${Date.now()}`;
}

/**
 * Fulfil a purchase by granting the rewards to the user, atomically.
 *
 * Three contracts that distinguish this from the previous version:
 *
 *   1. Atomic. Every grant write happens inside a single transaction.
 *      Either the user gets all their rewards, or they get none — and
 *      the ledger row that records the fulfilment is part of the same
 *      transaction, so the ledger never lies.
 *
 *   2. Idempotent. The unique key on `purchase_grants.fulfillmentId`
 *      means a webhook retry that re-enters this function with the
 *      same id is a no-op: the pre-flight SELECT finds an existing
 *      row and returns. No double-grant under retry.
 *
 *   3. Composable. Callers that already own a transaction (e.g. the
 *      Dream-token purchase path that needs to deduct balance + grant
 *      rewards atomically) pass `tx`. Callers without one (the Stripe
 *      webhook) omit it and we open our own.
 *
 * Returns `{ alreadyFulfilled: true }` on idempotent retry. The
 * caller's UI / log should surface that as a benign skip, not an
 * error.
 */
async function fulfillPurchase(
  userId: number,
  productKey: string,
  quantity: number,
  fulfillmentId: string,
  tx?: TxOrDb,
): Promise<{ alreadyFulfilled: boolean }> {
  if (tx) {
    return doFulfill(tx, userId, productKey, quantity, fulfillmentId);
  }
  const db = await getDb();
  if (!db) return { alreadyFulfilled: false };
  // No caller-provided transaction — open our own. drizzle's
  // `db.transaction` returns whatever the inner callback returns,
  // so the `alreadyFulfilled` signal flows out unchanged.
  return db.transaction((innerTx) =>
    doFulfill(innerTx, userId, productKey, quantity, fulfillmentId),
  );
}

async function doFulfill(
  tx: TxOrDb,
  userId: number,
  productKey: string,
  quantity: number,
  fulfillmentId: string,
): Promise<{ alreadyFulfilled: boolean }> {
  const product = getProduct(productKey);
  if (!product) return { alreadyFulfilled: false };

  // Idempotency pre-flight. Any prior ledger row with this id means
  // the grant batch ran to completion (the row only commits with the
  // grants); skip without re-granting.
  const existingLedger = await tx
    .select({ id: purchaseGrants.id })
    .from(purchaseGrants)
    .where(eq(purchaseGrants.fulfillmentId, fulfillmentId))
    .limit(1);
  if (existingLedger.length > 0) {
    return { alreadyFulfilled: true };
  }

  const rewards = product.rewards;
  const summary: Record<string, number | string> = {};

  // Grant Dream tokens
  if (rewards.dreamTokens) {
    const amount = rewards.dreamTokens * quantity;
    summary.dreamTokens = amount;
    const [existing] = await tx
      .select()
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, userId))
      .limit(1);

    if (existing) {
      await tx
        .update(dreamBalance)
        .set({
          dreamTokens: sql`${dreamBalance.dreamTokens} + ${amount}`,
          totalDreamEarned: sql`${dreamBalance.totalDreamEarned} + ${amount}`,
        })
        .where(eq(dreamBalance.userId, userId));
    } else {
      await tx.insert(dreamBalance).values({
        userId,
        dreamTokens: amount,
        soulBoundDream: 0,
        totalDreamEarned: amount,
        dnaCode: 0,
      });
    }
  }

  // Grant Soul Bound Dream
  if (rewards.soulBoundDream) {
    const amount = rewards.soulBoundDream * quantity;
    summary.soulBoundDream = amount;
    const [existing] = await tx
      .select()
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, userId))
      .limit(1);

    if (existing) {
      await tx
        .update(dreamBalance)
        .set({ soulBoundDream: sql`${dreamBalance.soulBoundDream} + ${amount}` })
        .where(eq(dreamBalance.userId, userId));
    } else {
      await tx.insert(dreamBalance).values({
        userId,
        dreamTokens: 0,
        soulBoundDream: amount,
        totalDreamEarned: 0,
        dnaCode: 0,
      });
    }
  }

  // Grant card packs — randomly assign cards
  if (rewards.cardPacks) {
    const packSize = rewards.cardPacks * quantity;
    summary.cardPackSize = packSize;
    const minRarity = rewards.cardPackRarity || "common";
    const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];
    const minIdx = rarityOrder.indexOf(minRarity);

    const availableCards = await tx
      .select({ id: cards.id, rarity: cards.rarity })
      .from(cards)
      .limit(500);

    if (availableCards.length > 0) {
      const guaranteedCards = availableCards.filter((c) => {
        const idx = rarityOrder.indexOf(c.rarity || "common");
        return idx >= minIdx;
      });

      for (let i = 0; i < packSize; i++) {
        const pool = i === 0 && guaranteedCards.length > 0 ? guaranteedCards : availableCards;
        const randomCard = pool[Math.floor(Math.random() * pool.length)];

        await tx.insert(userCards).values({
          userId,
          cardId: randomCard.id.toString(),
          obtainedVia: "store_purchase",
        });
      }
    }
  }

  // Grant ship upgrades
  if (rewards.shipUpgrade) {
    summary.shipUpgrade = `${rewards.shipUpgrade.type}:${rewards.shipUpgrade.level}`;
    const [existing] = await tx
      .select()
      .from(shipUpgrades)
      .where(and(eq(shipUpgrades.userId, userId), eq(shipUpgrades.upgradeType, rewards.shipUpgrade.type)))
      .limit(1);

    if (existing) {
      await tx
        .update(shipUpgrades)
        .set({ level: Math.max(existing.level, rewards.shipUpgrade.level) })
        .where(eq(shipUpgrades.id, existing.id));
    } else {
      await tx.insert(shipUpgrades).values({
        userId,
        upgradeType: rewards.shipUpgrade.type,
        level: rewards.shipUpgrade.level,
        obtainedVia: "purchase",
      });
    }
  }

  // Grant base upgrades
  if (rewards.baseUpgrade) {
    summary.baseUpgrade = rewards.baseUpgrade.type;
    const [base] = await tx
      .select()
      .from(playerBases)
      .where(eq(playerBases.userId, userId))
      .limit(1);

    if (base) {
      if (rewards.baseUpgrade.type === "storage") {
        await tx
          .update(playerBases)
          .set({ storageCapacity: sql`${playerBases.storageCapacity} + 200` })
          .where(eq(playerBases.id, base.id));
      } else if (rewards.baseUpgrade.type === "defense") {
        await tx
          .update(playerBases)
          .set({ defenseRating: sql`${playerBases.defenseRating} + 25` })
          .where(eq(playerBases.id, base.id));
      }
    }
  }

  // Grant cargo expansion
  if (rewards.cargoExpansion) {
    summary.cargoExpansion = 1;
    const [existing] = await tx
      .select()
      .from(shipUpgrades)
      .where(and(eq(shipUpgrades.userId, userId), eq(shipUpgrades.upgradeType, "cargo")))
      .limit(1);

    if (existing) {
      await tx.update(shipUpgrades).set({ level: existing.level + 1 }).where(eq(shipUpgrades.id, existing.id));
    } else {
      await tx.insert(shipUpgrades).values({ userId, upgradeType: "cargo", level: 2, obtainedVia: "purchase" });
    }
  }

  // Grant fuel capacity
  if (rewards.fuelCapacity) {
    summary.fuelCapacity = 1;
    const [existing] = await tx
      .select()
      .from(shipUpgrades)
      .where(and(eq(shipUpgrades.userId, userId), eq(shipUpgrades.upgradeType, "engine")))
      .limit(1);

    if (existing) {
      await tx.update(shipUpgrades).set({ level: existing.level + 1 }).where(eq(shipUpgrades.id, existing.id));
    } else {
      await tx.insert(shipUpgrades).values({ userId, upgradeType: "engine", level: 2, obtainedVia: "purchase" });
    }
  }

  // Ledger write — last so the row only exists if every grant above
  // succeeded. The unique key on fulfillmentId means a concurrent
  // retry that lost the race throws here and the whole transaction
  // rolls back, which is exactly what we want.
  await tx.insert(purchaseGrants).values({
    fulfillmentId,
    userId,
    productKey,
    quantity,
    rewardSummary: summary,
  });

  return { alreadyFulfilled: false };
}

/** Export fulfillPurchase for webhook use */
export { fulfillPurchase };
