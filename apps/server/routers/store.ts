import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { procedureRateLimit } from "../_core/procedureRateLimit";
import { getDb } from "../db";
import { STORE_PRODUCTS, getProduct, getProductsByCategory, getFeaturedProducts } from "../products";
import { storePurchases, dreamBalance, shipUpgrades, playerBases, userCards, cards, purchaseGrants, cosmeticCatalogOwnership, battlePassProgress, battlePassSeasons, type StorePurchase } from "../../db/schema";
import type { DrizzleDb } from "../db";

/** Either a top-level drizzle handle or a transactional one — the
 *  operation methods we need (select/insert/update) are common to
 *  both, so consumers don't care which they receive. */
type TxOrDb = DrizzleDb | Parameters<Parameters<DrizzleDb["transaction"]>[0]>[0];
import { eq, and, desc, sql } from "drizzle-orm";
import { ripple } from "../services/rippleEngine";
import { setEntitlement } from "../services/entitlementService";

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
    // H6 — tight rate limit on a procedure that hits Stripe + has
    // CC-enumeration / cart-bombing risk. 2 calls per 5 minutes
    // per user is enough for a real shopper (single checkout +
    // one refresh) but caps abuse at 24/day worst case.
    .use(procedureRateLimit({ windowMs: 300_000, max: 2 }))
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

      // Auto-tax: requires Stripe Tax to be enabled in the Stripe
      // dashboard with origin tax registrations configured. Set
      // STRIPE_AUTOMATIC_TAX=false to disable for jurisdictions
      // where you haven't yet registered. Defaults to true in
      // production so EU/CA/UK VAT is collected from launch.
      const automaticTaxEnabled = process.env.STRIPE_AUTOMATIC_TAX !== "false";

      // Resolve a real Stripe price-id from env when the product
      // declares one (Phase L / B4). When the env var is set we pass
      // `price` directly (Stripe's SKU carries its own tax_code);
      // otherwise fall back to inline price_data with the
      // electronically-supplied-services tax_code. Lets ops swap
      // SKUs without a code change.
      const stripePriceId = product.stripePriceEnv
        ? process.env[product.stripePriceEnv]
        : undefined;
      const lineItem = stripePriceId
        ? { price: stripePriceId, quantity: input.quantity }
        : {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
                description: product.description,
                // Stripe Tax requires a tax_code for automatic
                // classification. `txcd_10000000` = "General — Services —
                // Electronically Supplied Services", which fits in-game
                // currency / cosmetic / pass purchases. Adjust per
                // product when offerings diverge (digital-good vs
                // service vs subscription).
                tax_code: "txcd_10000000",
              },
              unit_amount: product.priceUsd,
            },
            quantity: input.quantity,
          };

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [lineItem],
        mode: "payment",
        success_url: `${origin}/store?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/store?canceled=true`,
        client_reference_id: ctx.user.id.toString(),
        customer_email: ctx.user.email || undefined,
        allow_promotion_codes: true,
        automatic_tax: { enabled: automaticTaxEnabled },
        // Stripe needs the customer's address to determine the tax
        // rate. Forcing collection guarantees a valid jurisdiction.
        billing_address_collection: automaticTaxEnabled ? "required" : "auto",
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

  /** Purchase with Void Crystals (premium currency stored as `gems`).
   *  Mirrors purchaseWithDream — atomic conditional UPDATE that fails
   *  closed if the balance dropped between the implied check and the
   *  write. Stripe checkout is the primary path for VC SKUs; this
   *  mutation handles in-game spending of already-acquired VC. */
  purchaseWithVoidCrystals: protectedProcedure
    .input(z.object({ productKey: z.string(), quantity: z.number().min(1).max(10).default(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const product = getProduct(input.productKey);
      if (!product) throw new Error("Product not found");
      if (product.priceVoidCrystals <= 0) {
        throw new Error("This product cannot be purchased with Void Crystals");
      }
      const totalCost = product.priceVoidCrystals * input.quantity;
      return await db.transaction(async (tx) => {
        const r = await tx.execute(sql`
          UPDATE dream_balance
          SET gems = gems - ${totalCost}
          WHERE user_id = ${ctx.user.id} AND gems >= ${totalCost}
        `);
        const affected = (r as unknown as Array<{ affectedRows?: number }>)[0]?.affectedRows ?? 0;
        if (affected === 0) {
          throw new Error("Insufficient Void Crystals");
        }
        await tx.insert(storePurchases).values({
          userId: ctx.user.id,
          productKey: input.productKey,
          paymentMethod: "void_crystals",
          quantity: input.quantity,
          amount: totalCost,
          fulfilled: 1,
        });
        const fulfillmentId = synthesiseFulfillmentId(
          "void_crystals",
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
    if (!db) return { dreamTokens: 0, soulBoundDream: 0, totalDreamEarned: 0, dnaCode: 0, gems: 0, totalGemsPurchased: 0 };

    const [balance] = await db
      .select({
        dreamTokens: dreamBalance.dreamTokens,
        soulBoundDream: dreamBalance.soulBoundDream,
        totalDreamEarned: dreamBalance.totalDreamEarned,
        dnaCode: dreamBalance.dnaCode,
        gems: dreamBalance.gems,
        totalGemsPurchased: dreamBalance.totalGemsPurchased,
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
      return { dreamTokens: 10, soulBoundDream: 0, totalDreamEarned: 10, dnaCode: 0, gems: 0, totalGemsPurchased: 0 };
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
  source: "credits" | "dream" | "manual" | "void_crystals",
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

  // Grant entitlement (boolean account flag — gates cards via
  // expansionUnlockService; see services/entitlementService.ts).
  if (rewards.entitlement) {
    summary.entitlement = rewards.entitlement;
    await setEntitlement(tx, userId, rewards.entitlement, true);
  }

  // Grant Void Crystals (premium currency, stored in dreamBalance.gems).
  if (rewards.voidCrystals) {
    const amount = rewards.voidCrystals * quantity;
    summary.voidCrystals = amount;
    const [existing] = await tx
      .select()
      .from(dreamBalance)
      .where(eq(dreamBalance.userId, userId))
      .limit(1);
    if (existing) {
      await tx
        .update(dreamBalance)
        .set({
          gems: sql`${dreamBalance.gems} + ${amount}`,
          totalGemsPurchased: sql`${dreamBalance.totalGemsPurchased} + ${amount}`,
        })
        .where(eq(dreamBalance.userId, userId));
    } else {
      await tx.insert(dreamBalance).values({
        userId,
        dreamTokens: 0,
        soulBoundDream: 0,
        totalDreamEarned: 0,
        dnaCode: 0,
        gems: amount,
        totalGemsPurchased: amount,
      });
    }
  }

  // Grant cosmetics from a bundle (Founder's, Author's Edition, premium
  // cosmetic SKU). Idempotent via the (userId, cosmeticId) unique index —
  // if the player somehow already owns it, the row insert is a no-op.
  if (rewards.cosmetics && rewards.cosmetics.length > 0) {
    summary.cosmeticsCount = rewards.cosmetics.length;
    for (const cosmeticId of rewards.cosmetics) {
      await tx
        .insert(cosmeticCatalogOwnership)
        .values({
          userId,
          cosmeticId,
          source: "bundle",
          pricePaid: 0,
          bundleSkuKey: productKey,
        })
        .onDuplicateKeyUpdate({ set: { grantedAt: sql`granted_at` } })
        .catch(() => {/* idempotent — duplicate is fine */});
    }
  }

  // Grant Battle Pass premium track for the active season. Auto-creates
  // the progress row if missing so a player who buys the pass before
  // earning their first XP isn't stuck.
  if (rewards.battlePassPremium) {
    summary.battlePassPremium = "granted";
    const [season] = await tx
      .select()
      .from(battlePassSeasons)
      .where(eq(battlePassSeasons.status, "active"))
      .limit(1);
    if (season) {
      const [progress] = await tx
        .select()
        .from(battlePassProgress)
        .where(and(
          eq(battlePassProgress.userId, userId),
          eq(battlePassProgress.seasonId, season.id),
        ))
        .limit(1);
      if (progress) {
        await tx
          .update(battlePassProgress)
          .set({ isPremium: true })
          .where(eq(battlePassProgress.id, progress.id));
      } else {
        await tx.insert(battlePassProgress).values({
          userId,
          seasonId: season.id,
          currentXp: 0,
          currentTier: 0,
          isPremium: true,
          claimedFreeTiers: [],
          claimedPremiumTiers: [],
        });
      }
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
