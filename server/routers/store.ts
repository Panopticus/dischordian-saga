import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { STORE_PRODUCTS, getProduct, getProductsByCategory, getFeaturedProducts } from "../products";
import { storePurchases, dreamBalance, shipUpgrades, playerBases, userCards, cards, type StorePurchase } from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";

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

      const origin = ctx.req.headers.origin || "https://loredex-os.manus.space";

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

      await db.insert(storePurchases).values({
        userId: ctx.user.id,
        productKey: input.productKey,
        paymentMethod: "credits",
        quantity: input.quantity,
        amount: totalCost,
        fulfilled: 1,
      });

      await fulfillPurchase(ctx.user.id, input.productKey, input.quantity);
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

      const [balance] = await db
        .select()
        .from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id))
        .limit(1);

      if (!balance || balance.dreamTokens < totalCost) {
        throw new Error("Insufficient Dream tokens");
      }

      await db
        .update(dreamBalance)
        .set({ dreamTokens: sql`${dreamBalance.dreamTokens} - ${totalCost}` })
        .where(eq(dreamBalance.userId, ctx.user.id));

      await db.insert(storePurchases).values({
        userId: ctx.user.id,
        productKey: input.productKey,
        paymentMethod: "dream",
        quantity: input.quantity,
        amount: totalCost,
        fulfilled: 1,
      });

      await fulfillPurchase(ctx.user.id, input.productKey, input.quantity);
      return { success: true, message: `Purchased ${product.name}!` };
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

  /** Get user's Dream balance */
  myDreamBalance: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { dreamTokens: 0, soulBoundDream: 0, totalDreamEarned: 0, dnaCode: 0 };

    const [balance] = await db
      .select()
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

    return {
      dreamTokens: balance.dreamTokens,
      soulBoundDream: balance.soulBoundDream,
      totalDreamEarned: balance.totalDreamEarned,
      dnaCode: balance.dnaCode,
    };
  }),
});

/** Fulfill a purchase by granting the rewards to the user */
async function fulfillPurchase(userId: number, productKey: string, quantity: number) {
  const db = await getDb();
  if (!db) return;
  const product = getProduct(productKey);
  if (!product) return;

  const rewards = product.rewards;

  // Grant Dream tokens
  if (rewards.dreamTokens) {
    const amount = rewards.dreamTokens * quantity;
    const [existing] = await db
      .select()
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, userId))
      .limit(1);

    if (existing) {
      await db
        .update(dreamBalance)
        .set({
          dreamTokens: sql`${dreamBalance.dreamTokens} + ${amount}`,
          totalDreamEarned: sql`${dreamBalance.totalDreamEarned} + ${amount}`,
        })
        .where(eq(dreamBalance.userId, userId));
    } else {
      await db.insert(dreamBalance).values({
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
    const [existing] = await db
      .select()
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, userId))
      .limit(1);

    if (existing) {
      await db
        .update(dreamBalance)
        .set({ soulBoundDream: sql`${dreamBalance.soulBoundDream} + ${amount}` })
        .where(eq(dreamBalance.userId, userId));
    } else {
      await db.insert(dreamBalance).values({
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
    const minRarity = rewards.cardPackRarity || "common";
    const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];
    const minIdx = rarityOrder.indexOf(minRarity);

    const availableCards = await db
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

        await db.insert(userCards).values({
          userId,
          cardId: randomCard.id.toString(),
          obtainedVia: "store_purchase",
        });
      }
    }
  }

  // Grant ship upgrades
  if (rewards.shipUpgrade) {
    const [existing] = await db
      .select()
      .from(shipUpgrades)
      .where(and(eq(shipUpgrades.userId, userId), eq(shipUpgrades.upgradeType, rewards.shipUpgrade.type)))
      .limit(1);

    if (existing) {
      await db
        .update(shipUpgrades)
        .set({ level: Math.max(existing.level, rewards.shipUpgrade.level) })
        .where(eq(shipUpgrades.id, existing.id));
    } else {
      await db.insert(shipUpgrades).values({
        userId,
        upgradeType: rewards.shipUpgrade.type,
        level: rewards.shipUpgrade.level,
        obtainedVia: "purchase",
      });
    }
  }

  // Grant base upgrades
  if (rewards.baseUpgrade) {
    const [base] = await db
      .select()
      .from(playerBases)
      .where(eq(playerBases.userId, userId))
      .limit(1);

    if (base) {
      if (rewards.baseUpgrade.type === "storage") {
        await db
          .update(playerBases)
          .set({ storageCapacity: sql`${playerBases.storageCapacity} + 200` })
          .where(eq(playerBases.id, base.id));
      } else if (rewards.baseUpgrade.type === "defense") {
        await db
          .update(playerBases)
          .set({ defenseRating: sql`${playerBases.defenseRating} + 25` })
          .where(eq(playerBases.id, base.id));
      }
    }
  }

  // Grant cargo expansion
  if (rewards.cargoExpansion) {
    const [existing] = await db
      .select()
      .from(shipUpgrades)
      .where(and(eq(shipUpgrades.userId, userId), eq(shipUpgrades.upgradeType, "cargo")))
      .limit(1);

    if (existing) {
      await db.update(shipUpgrades).set({ level: existing.level + 1 }).where(eq(shipUpgrades.id, existing.id));
    } else {
      await db.insert(shipUpgrades).values({ userId, upgradeType: "cargo", level: 2, obtainedVia: "purchase" });
    }
  }

  // Grant fuel capacity
  if (rewards.fuelCapacity) {
    const [existing] = await db
      .select()
      .from(shipUpgrades)
      .where(and(eq(shipUpgrades.userId, userId), eq(shipUpgrades.upgradeType, "engine")))
      .limit(1);

    if (existing) {
      await db.update(shipUpgrades).set({ level: existing.level + 1 }).where(eq(shipUpgrades.id, existing.id));
    } else {
      await db.insert(shipUpgrades).values({ userId, upgradeType: "engine", level: 2, obtainedVia: "purchase" });
    }
  }
}

/** Export fulfillPurchase for webhook use */
export { fulfillPurchase };
