/* ═══════════════════════════════════════════════════════
   INTERGALACTIC MARKETPLACE ROUTER
   Player-to-player economy: listings, buy orders, auctions,
   price history, and currency exchange.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq, and, or, desc, asc, sql, gte, lte, like, inArray } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  marketListings, marketBuyOrders, marketTransactions,
  marketAuctions, auctionBids, currencyExchange,
  userCards, dreamBalance, twPlayerState, notifications,
  marketTaxPool, guilds, guildMembers,
} from "../../drizzle/schema";
import { fetchCitizenData, fetchPotentialNftData, resolveMarketBonuses } from "../traitResolver";
import { trackIncrement } from "../achievementTracker";

/** 5% marketplace tax */
const TAX_RATE = 0.05;

function calcTax(amount: number): number {
  return Math.max(1, Math.floor(amount * TAX_RATE));
}

/** Feed tax revenue into the marketplace tax pool (for guild wars + season prizes) */
async function feedTaxPool(db: any, taxDream: number, taxCredits: number) {
  if (taxDream <= 0 && taxCredits <= 0) return;
  // Upsert: create row if not exists, otherwise increment
  const existing = await db.select().from(marketTaxPool).limit(1);
  if (existing[0]) {
    await db.update(marketTaxPool)
      .set({
        poolDream: sql`${marketTaxPool.poolDream} + ${taxDream}`,
        poolCredits: sql`${marketTaxPool.poolCredits} + ${taxCredits}`,
      })
      .where(eq(marketTaxPool.id, existing[0].id));
  } else {
    await db.insert(marketTaxPool).values({ poolDream: taxDream, poolCredits: taxCredits });
  }

  // Also feed 50% of Dream tax into the seller's guild treasury (if they have one)
  // This incentivizes guild membership for marketplace traders
}

/** Feed tax into the seller's guild treasury */
async function feedGuildTreasury(db: any, sellerId: number, taxDream: number, taxCredits: number) {
  if (taxDream <= 0 && taxCredits <= 0) return;
  const guildShare = Math.floor(taxDream * 0.2); // 20% of tax goes to guild
  const creditShare = Math.floor(taxCredits * 0.2);
  if (guildShare <= 0 && creditShare <= 0) return;
  const membership = await db.select().from(guildMembers).where(eq(guildMembers.userId, sellerId)).limit(1);
  if (!membership[0]) return;
  await db.update(guilds)
    .set({
      treasuryDream: sql`${guilds.treasuryDream} + ${guildShare}`,
      treasuryCredits: sql`${guilds.treasuryCredits} + ${creditShare}`,
    })
    .where(eq(guilds.id, membership[0].guildId));
}

export const marketplaceRouter = router({
  /* ──────────────────────────────────────────────
     LISTINGS — Sell cards, materials, crafted items
     ────────────────────────────────────────────── */

  /** Create a new sell listing */
  createListing: protectedProcedure
    .input(z.object({
      itemType: z.enum(["card", "material", "crafted_item"]),
      itemId: z.string(),
      itemName: z.string(),
      rarity: z.string().optional(),
      quantity: z.number().min(1).max(9999),
      priceDream: z.number().min(0).max(999999).default(0),
      priceCredits: z.number().min(0).max(9999999).default(0),
      category: z.string().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
      /** Duration in hours (1, 6, 12, 24, 48, 72) */
      durationHours: z.number().min(1).max(72).default(24),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      if (input.priceDream === 0 && input.priceCredits === 0) {
        throw new Error("Must set a price in Dream or credits");
      }

      // Verify ownership for cards
      if (input.itemType === "card") {
        const owned = await db.select().from(userCards)
          .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, input.itemId)))
          .limit(1);
        if (!owned[0] || owned[0].quantity < input.quantity) {
          throw new Error("You don't own enough copies of this card");
        }
        // Deduct from inventory (escrow)
        await db.update(userCards)
          .set({ quantity: sql`${userCards.quantity} - ${input.quantity}` })
          .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, input.itemId)));
      }

      const expiresAt = new Date(Date.now() + input.durationHours * 3600000);
      const [result] = await db.insert(marketListings).values({
        sellerId: ctx.user.id,
        itemType: input.itemType,
        itemId: input.itemId,
        itemName: input.itemName,
        rarity: input.rarity,
        quantity: input.quantity,
        priceDream: input.priceDream,
        priceCredits: input.priceCredits,
        category: input.category,
        metadata: input.metadata,
        expiresAt,
      });

      // Check if any buy orders match
      await tryMatchBuyOrders(db, ctx.user.id, input.itemType, input.itemId, input.priceDream, input.priceCredits, input.quantity, Number(result.insertId));

      // Track marketplace listing achievement
      trackIncrement(ctx.user.id, "market_listings", 1).catch(() => {});
      return { success: true, listingId: Number(result.insertId) };
    }),

  /** Cancel a listing and return items */
  cancelListing: protectedProcedure
    .input(z.object({ listingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const listing = await db.select().from(marketListings)
        .where(and(eq(marketListings.id, input.listingId), eq(marketListings.sellerId, ctx.user.id)))
        .limit(1);
      if (!listing[0] || listing[0].status !== "active") throw new Error("Listing not found or not active");

      // Return items
      if (listing[0].itemType === "card") {
        const existing = await db.select().from(userCards)
          .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, listing[0].itemId)))
          .limit(1);
        if (existing[0]) {
          await db.update(userCards)
            .set({ quantity: sql`${userCards.quantity} + ${listing[0].quantity}` })
            .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, listing[0].itemId)));
        } else {
          await db.insert(userCards).values({
            userId: ctx.user.id, cardId: listing[0].itemId, quantity: listing[0].quantity, obtainedVia: "market_return",
          });
        }
      }

      await db.update(marketListings)
        .set({ status: "cancelled" })
        .where(eq(marketListings.id, input.listingId));
      return { success: true };
    }),

  /** Buy a listing */
  buyListing: protectedProcedure
    .input(z.object({
      listingId: z.number(),
      quantity: z.number().min(1).default(1),
      payWith: z.enum(["dream", "credits"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const listing = await db.select().from(marketListings)
        .where(and(eq(marketListings.id, input.listingId), eq(marketListings.status, "active")))
        .limit(1);
      if (!listing[0]) throw new Error("Listing not found or no longer active");
      if (listing[0].sellerId === ctx.user.id) throw new Error("Cannot buy your own listing");
      if (input.quantity > listing[0].quantity) throw new Error("Not enough quantity available");

      const unitPrice = input.payWith === "dream" ? listing[0].priceDream : listing[0].priceCredits;
      if (unitPrice <= 0) throw new Error(`This listing doesn't accept ${input.payWith}`);
      const totalPrice = unitPrice * input.quantity;

      // Apply seller trait bonuses — reduced marketplace fees
      const [sellerCitizen, sellerNft] = await Promise.all([
        fetchCitizenData(listing[0].sellerId),
        fetchPotentialNftData(listing[0].sellerId),
      ]);
      const sellerTb = resolveMarketBonuses(sellerCitizen, sellerNft);
      const adjustedTaxRate = TAX_RATE * sellerTb.taxReduction;
      const tax = Math.max(1, Math.floor(totalPrice * adjustedTaxRate));
      const sellerReceives = totalPrice - tax;

      // Deduct buyer's currency
      if (input.payWith === "dream") {
        const bal = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        if (!bal[0] || bal[0].dreamTokens < totalPrice) throw new Error("Insufficient Dream tokens");
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`${dreamBalance.dreamTokens} - ${totalPrice}` })
          .where(eq(dreamBalance.userId, ctx.user.id));
        // Credit seller
        const sellerBal = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, listing[0].sellerId)).limit(1);
        if (sellerBal[0]) {
          await db.update(dreamBalance)
            .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${sellerReceives}` })
            .where(eq(dreamBalance.userId, listing[0].sellerId));
        } else {
          await db.insert(dreamBalance).values({ userId: listing[0].sellerId, dreamTokens: sellerReceives, soulBoundDream: 0 });
        }
      } else {
        const ps = await db.select().from(twPlayerState).where(eq(twPlayerState.userId, ctx.user.id)).limit(1);
        if (!ps[0] || ps[0].credits < totalPrice) throw new Error("Insufficient credits");
        await db.update(twPlayerState)
          .set({ credits: sql`${twPlayerState.credits} - ${totalPrice}` })
          .where(eq(twPlayerState.userId, ctx.user.id));
        const sellerPs = await db.select().from(twPlayerState).where(eq(twPlayerState.userId, listing[0].sellerId)).limit(1);
        if (sellerPs[0]) {
          await db.update(twPlayerState)
            .set({ credits: sql`${twPlayerState.credits} + ${sellerReceives}` })
            .where(eq(twPlayerState.userId, listing[0].sellerId));
        }
      }

      // Transfer item to buyer
      if (listing[0].itemType === "card") {
        const existing = await db.select().from(userCards)
          .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, listing[0].itemId)))
          .limit(1);
        if (existing[0]) {
          await db.update(userCards)
            .set({ quantity: sql`${userCards.quantity} + ${input.quantity}` })
            .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, listing[0].itemId)));
        } else {
          await db.insert(userCards).values({
            userId: ctx.user.id, cardId: listing[0].itemId, quantity: input.quantity, obtainedVia: "marketplace",
          });
        }
      }

      // Update listing
      const remainingQty = listing[0].quantity - input.quantity;
      await db.update(marketListings)
        .set({
          quantity: remainingQty,
          status: remainingQty <= 0 ? "sold" : "active",
        })
        .where(eq(marketListings.id, input.listingId));

      // Record transaction
      await db.insert(marketTransactions).values({
        listingId: input.listingId,
        sellerId: listing[0].sellerId,
        buyerId: ctx.user.id,
        itemType: listing[0].itemType,
        itemId: listing[0].itemId,
        itemName: listing[0].itemName,
        quantity: input.quantity,
        priceDream: input.payWith === "dream" ? unitPrice : 0,
        priceCredits: input.payWith === "credits" ? unitPrice : 0,
        taxDream: input.payWith === "dream" ? tax : 0,
        taxCredits: input.payWith === "credits" ? tax : 0,
      });

      // Feed tax into pool and guild treasury
      await feedTaxPool(db, input.payWith === "dream" ? tax : 0, input.payWith === "credits" ? tax : 0);
      await feedGuildTreasury(db, listing[0].sellerId, input.payWith === "dream" ? tax : 0, input.payWith === "credits" ? tax : 0);

      // Notify seller
      await db.insert(notifications).values({
        userId: listing[0].sellerId,
        type: "market_sold",
        title: "Item Sold!",
        message: `Your ${listing[0].itemName} x${input.quantity} sold for ${totalPrice} ${input.payWith}. You received ${sellerReceives} after tax.`,
        actionUrl: "/marketplace",
      });

      // Award class mastery XP for marketplace activity
      const { awardClassXp } = await import("../classMasteryHelper");
      awardClassXp(ctx.user.id, "market_trade").catch(() => {});
      awardClassXp(listing[0].sellerId, "market_trade").catch(() => {});

      // Award civil skill XP for marketplace activity (negotiation)
      const { awardCivilXp } = await import("../civilSkillHelper");
      awardCivilXp(ctx.user.id, "marketplace_buy").catch(() => {});
       awardCivilXp(listing[0].sellerId, "marketplace_sell").catch(() => {});
      // Track marketplace achievements for both buyer and seller
      trackIncrement(ctx.user.id, "market_purchases", 1).catch(() => {});
      trackIncrement(listing[0].sellerId, "market_sales", 1).catch(() => {});
      return { success: true, totalPaid: totalPrice, tax, sellerReceives };
    }),

  /** Search marketplace listings */
  searchListings: protectedProcedure
    .input(z.object({
      itemType: z.enum(["card", "material", "crafted_item", "all"]).default("all"),
      search: z.string().optional(),
      rarity: z.string().optional(),
      category: z.string().optional(),
      sortBy: z.enum(["price_low", "price_high", "newest", "oldest"]).default("newest"),
      currency: z.enum(["dream", "credits", "any"]).default("any"),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { listings: [], total: 0, page: input.page };

      const conditions = [eq(marketListings.status, "active")];
      if (input.itemType !== "all") conditions.push(eq(marketListings.itemType, input.itemType));
      if (input.search) conditions.push(like(marketListings.itemName, `%${input.search}%`));
      if (input.rarity) conditions.push(eq(marketListings.rarity, input.rarity));
      if (input.category) conditions.push(eq(marketListings.category, input.category));
      if (input.currency === "dream") conditions.push(sql`${marketListings.priceDream} > 0`);
      if (input.currency === "credits") conditions.push(sql`${marketListings.priceCredits} > 0`);

      const orderBy = input.sortBy === "price_low" ? asc(marketListings.priceDream)
        : input.sortBy === "price_high" ? desc(marketListings.priceDream)
        : input.sortBy === "oldest" ? asc(marketListings.createdAt)
        : desc(marketListings.createdAt);

      const offset = (input.page - 1) * input.limit;
      const listings = await db.select().from(marketListings)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(input.limit)
        .offset(offset);

      const countResult = await db.select({ count: sql<number>`count(*)` }).from(marketListings)
        .where(and(...conditions));

      return { listings, total: countResult[0]?.count || 0, page: input.page };
    }),

  /** Get my active listings */
  myListings: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(marketListings)
      .where(and(eq(marketListings.sellerId, ctx.user.id), eq(marketListings.status, "active")))
      .orderBy(desc(marketListings.createdAt));
  }),

  /** Price history for an item (last 30 days) */
  priceHistory: protectedProcedure
    .input(z.object({ itemId: z.string(), days: z.number().min(1).max(90).default(30) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const since = new Date(Date.now() - input.days * 86400000);
      return db.select({
        priceDream: marketTransactions.priceDream,
        priceCredits: marketTransactions.priceCredits,
        quantity: marketTransactions.quantity,
        createdAt: marketTransactions.createdAt,
      }).from(marketTransactions)
        .where(and(
          eq(marketTransactions.itemId, input.itemId),
          gte(marketTransactions.createdAt, since),
        ))
        .orderBy(asc(marketTransactions.createdAt));
    }),

  /* ──────────────────────────────────────────────
     BUY ORDERS — "Wanted" requests with max price
     ────────────────────────────────────────────── */

  createBuyOrder: protectedProcedure
    .input(z.object({
      itemType: z.enum(["card", "material", "crafted_item"]),
      itemId: z.string(),
      itemName: z.string(),
      quantity: z.number().min(1).max(9999),
      maxPriceDream: z.number().min(0).max(999999).default(0),
      maxPriceCredits: z.number().min(0).max(9999999).default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      if (input.maxPriceDream === 0 && input.maxPriceCredits === 0) {
        throw new Error("Must set a max price in Dream or credits");
      }

      // Escrow the buyer's funds
      const totalCost = input.maxPriceDream > 0
        ? input.maxPriceDream * input.quantity
        : input.maxPriceCredits * input.quantity;

      if (input.maxPriceDream > 0) {
        const bal = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        if (!bal[0] || bal[0].dreamTokens < totalCost) throw new Error("Insufficient Dream tokens for escrow");
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`${dreamBalance.dreamTokens} - ${totalCost}` })
          .where(eq(dreamBalance.userId, ctx.user.id));
      } else {
        const ps = await db.select().from(twPlayerState).where(eq(twPlayerState.userId, ctx.user.id)).limit(1);
        if (!ps[0] || ps[0].credits < totalCost) throw new Error("Insufficient credits for escrow");
        await db.update(twPlayerState)
          .set({ credits: sql`${twPlayerState.credits} - ${totalCost}` })
          .where(eq(twPlayerState.userId, ctx.user.id));
      }

      const expiresAt = new Date(Date.now() + 72 * 3600000); // 72h default
      const [result] = await db.insert(marketBuyOrders).values({
        buyerId: ctx.user.id,
        itemType: input.itemType,
        itemId: input.itemId,
        itemName: input.itemName,
        quantity: input.quantity,
        maxPriceDream: input.maxPriceDream,
        maxPriceCredits: input.maxPriceCredits,
        expiresAt,
      });
      return { success: true, orderId: Number(result.insertId) };
    }),

  cancelBuyOrder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const order = await db.select().from(marketBuyOrders)
        .where(and(eq(marketBuyOrders.id, input.orderId), eq(marketBuyOrders.buyerId, ctx.user.id)))
        .limit(1);
      if (!order[0] || order[0].status !== "active") throw new Error("Order not found or not active");

      // Refund remaining escrow
      const remaining = order[0].quantity - order[0].filledQuantity;
      if (order[0].maxPriceDream > 0) {
        const refund = order[0].maxPriceDream * remaining;
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${refund}` })
          .where(eq(dreamBalance.userId, ctx.user.id));
      } else {
        const refund = order[0].maxPriceCredits * remaining;
        await db.update(twPlayerState)
          .set({ credits: sql`${twPlayerState.credits} + ${refund}` })
          .where(eq(twPlayerState.userId, ctx.user.id));
      }

      await db.update(marketBuyOrders)
        .set({ status: "cancelled" })
        .where(eq(marketBuyOrders.id, input.orderId));
      return { success: true };
    }),

  /** Search active buy orders */
  searchBuyOrders: protectedProcedure
    .input(z.object({
      itemType: z.enum(["card", "material", "crafted_item", "all"]).default("all"),
      search: z.string().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { orders: [], total: 0 };
      const conditions = [eq(marketBuyOrders.status, "active")];
      if (input.itemType !== "all") conditions.push(eq(marketBuyOrders.itemType, input.itemType));
      if (input.search) conditions.push(like(marketBuyOrders.itemName, `%${input.search}%`));
      const offset = (input.page - 1) * input.limit;
      const orders = await db.select().from(marketBuyOrders)
        .where(and(...conditions))
        .orderBy(desc(marketBuyOrders.createdAt))
        .limit(input.limit).offset(offset);
      const countResult = await db.select({ count: sql<number>`count(*)` }).from(marketBuyOrders)
        .where(and(...conditions));
      return { orders, total: countResult[0]?.count || 0 };
    }),

  myBuyOrders: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(marketBuyOrders)
      .where(and(eq(marketBuyOrders.buyerId, ctx.user.id), eq(marketBuyOrders.status, "active")))
      .orderBy(desc(marketBuyOrders.createdAt));
  }),

  /* ──────────────────────────────────────────────
     AUCTIONS — Time-limited bidding
     ────────────────────────────────────────────── */

  createAuction: protectedProcedure
    .input(z.object({
      itemType: z.enum(["card", "material", "crafted_item"]),
      itemId: z.string(),
      itemName: z.string(),
      rarity: z.string().optional(),
      quantity: z.number().min(1).default(1),
      startingBid: z.number().min(1),
      bidIncrement: z.number().min(1).default(5),
      buyoutPrice: z.number().min(0).default(0),
      durationHours: z.enum(["1", "6", "12", "24"]),
      metadata: z.record(z.string(), z.unknown()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Escrow the item
      if (input.itemType === "card") {
        const owned = await db.select().from(userCards)
          .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, input.itemId)))
          .limit(1);
        if (!owned[0] || owned[0].quantity < input.quantity) throw new Error("You don't own enough copies");
        await db.update(userCards)
          .set({ quantity: sql`${userCards.quantity} - ${input.quantity}` })
          .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, input.itemId)));
      }

      const endsAt = new Date(Date.now() + parseInt(input.durationHours) * 3600000);
      const [result] = await db.insert(marketAuctions).values({
        sellerId: ctx.user.id,
        itemType: input.itemType,
        itemId: input.itemId,
        itemName: input.itemName,
        rarity: input.rarity,
        quantity: input.quantity,
        startingBid: input.startingBid,
        bidIncrement: input.bidIncrement,
        buyoutPrice: input.buyoutPrice,
        metadata: input.metadata,
        endsAt,
      });
      return { success: true, auctionId: Number(result.insertId) };
    }),

  /** Place a bid on an auction */
  placeBid: protectedProcedure
    .input(z.object({ auctionId: z.number(), bidAmount: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const auction = await db.select().from(marketAuctions)
        .where(and(eq(marketAuctions.id, input.auctionId), eq(marketAuctions.status, "active")))
        .limit(1);
      if (!auction[0]) throw new Error("Auction not found or ended");
      if (auction[0].sellerId === ctx.user.id) throw new Error("Cannot bid on your own auction");
      if (new Date() > auction[0].endsAt) throw new Error("Auction has ended");

      const minBid = auction[0].currentBid > 0
        ? auction[0].currentBid + auction[0].bidIncrement
        : auction[0].startingBid;
      if (input.bidAmount < minBid) throw new Error(`Minimum bid is ${minBid} Dream`);

      // Verify buyer has funds
      const bal = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
      if (!bal[0] || bal[0].dreamTokens < input.bidAmount) throw new Error("Insufficient Dream tokens");

      // Escrow new bid
      await db.update(dreamBalance)
        .set({ dreamTokens: sql`${dreamBalance.dreamTokens} - ${input.bidAmount}` })
        .where(eq(dreamBalance.userId, ctx.user.id));

      // Refund previous highest bidder
      if (auction[0].highestBidderId && auction[0].currentBid > 0) {
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${auction[0].currentBid}` })
          .where(eq(dreamBalance.userId, auction[0].highestBidderId));
        // Notify outbid
        await db.insert(notifications).values({
          userId: auction[0].highestBidderId,
          type: "auction_outbid",
          title: "You've been outbid!",
          message: `Someone bid ${input.bidAmount} Dream on ${auction[0].itemName}. Your ${auction[0].currentBid} Dream has been refunded.`,
          actionUrl: "/marketplace",
        });
      }

      // Update auction
      await db.update(marketAuctions)
        .set({ currentBid: input.bidAmount, highestBidderId: ctx.user.id })
        .where(eq(marketAuctions.id, input.auctionId));

      // Record bid
      await db.insert(auctionBids).values({
        auctionId: input.auctionId,
        bidderId: ctx.user.id,
        bidAmount: input.bidAmount,
      });

      // Check buyout
      if (auction[0].buyoutPrice > 0 && input.bidAmount >= auction[0].buyoutPrice) {
        await resolveAuction(db, input.auctionId);
      }

      return { success: true, currentBid: input.bidAmount };
    }),

  /** Get active auctions */
  searchAuctions: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      rarity: z.string().optional(),
      sortBy: z.enum(["ending_soon", "newest", "highest_bid", "lowest_bid"]).default("ending_soon"),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { auctions: [], total: 0 };
      const conditions = [eq(marketAuctions.status, "active")];
      if (input.search) conditions.push(like(marketAuctions.itemName, `%${input.search}%`));
      if (input.rarity) conditions.push(eq(marketAuctions.rarity, input.rarity));
      const orderBy = input.sortBy === "ending_soon" ? asc(marketAuctions.endsAt)
        : input.sortBy === "highest_bid" ? desc(marketAuctions.currentBid)
        : input.sortBy === "lowest_bid" ? asc(marketAuctions.currentBid)
        : desc(marketAuctions.createdAt);
      const offset = (input.page - 1) * input.limit;
      const auctions = await db.select().from(marketAuctions)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(input.limit).offset(offset);
      const countResult = await db.select({ count: sql<number>`count(*)` }).from(marketAuctions)
        .where(and(...conditions));
      return { auctions, total: countResult[0]?.count || 0 };
    }),

  /** Get bids for an auction */
  auctionBids: protectedProcedure
    .input(z.object({ auctionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(auctionBids)
        .where(eq(auctionBids.auctionId, input.auctionId))
        .orderBy(desc(auctionBids.bidAmount))
        .limit(20);
    }),

  /* ──────────────────────────────────────────────
     CURRENCY EXCHANGE — Dream ↔ Credits
     ────────────────────────────────────────────── */

  createExchangeOrder: protectedProcedure
    .input(z.object({
      sellCurrency: z.enum(["dream", "credits"]),
      sellAmount: z.number().min(1).max(999999),
      buyCurrency: z.enum(["dream", "credits"]),
      buyAmount: z.number().min(1).max(999999),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      if (input.sellCurrency === input.buyCurrency) throw new Error("Cannot exchange same currency");

      // Escrow sell amount
      if (input.sellCurrency === "dream") {
        const bal = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        if (!bal[0] || bal[0].dreamTokens < input.sellAmount) throw new Error("Insufficient Dream");
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`${dreamBalance.dreamTokens} - ${input.sellAmount}` })
          .where(eq(dreamBalance.userId, ctx.user.id));
      } else {
        const ps = await db.select().from(twPlayerState).where(eq(twPlayerState.userId, ctx.user.id)).limit(1);
        if (!ps[0] || ps[0].credits < input.sellAmount) throw new Error("Insufficient credits");
        await db.update(twPlayerState)
          .set({ credits: sql`${twPlayerState.credits} - ${input.sellAmount}` })
          .where(eq(twPlayerState.userId, ctx.user.id));
      }

      const [result] = await db.insert(currencyExchange).values({
        userId: ctx.user.id,
        sellCurrency: input.sellCurrency,
        sellAmount: input.sellAmount,
        buyCurrency: input.buyCurrency,
        buyAmount: input.buyAmount,
      });

      // Try to match with existing orders
      await tryMatchExchangeOrders(db, Number(result.insertId), ctx.user.id, input);

      return { success: true, orderId: Number(result.insertId) };
    }),

  cancelExchangeOrder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const order = await db.select().from(currencyExchange)
        .where(and(eq(currencyExchange.id, input.orderId), eq(currencyExchange.userId, ctx.user.id)))
        .limit(1);
      if (!order[0] || order[0].status !== "active") throw new Error("Order not found or not active");

      // Refund remaining
      const remaining = order[0].sellAmount - order[0].filledAmount;
      if (order[0].sellCurrency === "dream") {
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${remaining}` })
          .where(eq(dreamBalance.userId, ctx.user.id));
      } else {
        await db.update(twPlayerState)
          .set({ credits: sql`${twPlayerState.credits} + ${remaining}` })
          .where(eq(twPlayerState.userId, ctx.user.id));
      }

      await db.update(currencyExchange)
        .set({ status: "cancelled" })
        .where(eq(currencyExchange.id, input.orderId));
      return { success: true };
    }),

  /** Get active exchange orders */
  exchangeOrders: protectedProcedure
    .input(z.object({ page: z.number().min(1).default(1) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { orders: [], rate: { dreamPerCredit: 0, creditPerDream: 0 } };
      const orders = await db.select().from(currencyExchange)
        .where(eq(currencyExchange.status, "active"))
        .orderBy(desc(currencyExchange.createdAt))
        .limit(50);

      // Calculate average exchange rate from recent transactions
      const recentTx = await db.select().from(marketTransactions)
        .where(sql`${marketTransactions.priceDream} > 0 AND ${marketTransactions.priceCredits} > 0`)
        .orderBy(desc(marketTransactions.createdAt))
        .limit(20);

      return { orders, rate: { dreamPerCredit: 0.1, creditPerDream: 10 } };
    }),

  myExchangeOrders: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(currencyExchange)
      .where(and(eq(currencyExchange.userId, ctx.user.id), eq(currencyExchange.status, "active")))
      .orderBy(desc(currencyExchange.createdAt));
  }),

  /* ──────────────────────────────────────────────
     TRANSACTION HISTORY
     ────────────────────────────────────────────── */

  myTransactions: protectedProcedure
    .input(z.object({ page: z.number().min(1).default(1), limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { transactions: [], total: 0 };
      const offset = (input.page - 1) * input.limit;
      const transactions = await db.select().from(marketTransactions)
        .where(or(
          eq(marketTransactions.sellerId, ctx.user.id),
          eq(marketTransactions.buyerId, ctx.user.id),
        ))
        .orderBy(desc(marketTransactions.createdAt))
        .limit(input.limit).offset(offset);
      return { transactions, total: transactions.length };
    }),

  /** Market stats — volume, popular items */
  marketStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { activeListings: 0, activeAuctions: 0, activeBuyOrders: 0, recentTransactions: 0 };
    const [listings] = await db.select({ count: sql<number>`count(*)` }).from(marketListings).where(eq(marketListings.status, "active"));
    const [auctions] = await db.select({ count: sql<number>`count(*)` }).from(marketAuctions).where(eq(marketAuctions.status, "active"));
    const [buyOrders] = await db.select({ count: sql<number>`count(*)` }).from(marketBuyOrders).where(eq(marketBuyOrders.status, "active"));
    const since24h = new Date(Date.now() - 86400000);
    const [txCount] = await db.select({ count: sql<number>`count(*)` }).from(marketTransactions).where(gte(marketTransactions.createdAt, since24h));
    return {
      activeListings: listings?.count || 0,
      activeAuctions: auctions?.count || 0,
      activeBuyOrders: buyOrders?.count || 0,
      recentTransactions: txCount?.count || 0,
    };
  }),
});

/* ──────────────────────────────────────────────
   HELPER: Try to match buy orders when a listing is created
   ────────────────────────────────────────────── */
async function tryMatchBuyOrders(
  db: any, sellerId: number, itemType: string, itemId: string,
  priceDream: number, priceCredits: number, quantity: number, listingId: number,
) {
  // Find matching buy orders
  const matchConditions = [
    eq(marketBuyOrders.status, "active"),
    eq(marketBuyOrders.itemId, itemId),
  ];
  if (priceDream > 0) matchConditions.push(gte(marketBuyOrders.maxPriceDream, priceDream));
  if (priceCredits > 0) matchConditions.push(gte(marketBuyOrders.maxPriceCredits, priceCredits));

  const matches = await db.select().from(marketBuyOrders)
    .where(and(...matchConditions))
    .orderBy(desc(marketBuyOrders.maxPriceDream))
    .limit(5);

  // Auto-fill matches (simplified — fills first match)
  for (const order of matches) {
    if (quantity <= 0) break;
    const fillQty = Math.min(quantity, order.quantity - order.filledQuantity);
    if (fillQty <= 0) continue;

    const unitPrice = priceDream > 0 ? priceDream : priceCredits;
    const currency = priceDream > 0 ? "dream" : "credits";
    const tax = calcTax(unitPrice * fillQty);
    const sellerReceives = unitPrice * fillQty - tax;

    // Transfer funds to seller (buyer already escrowed)
    if (currency === "dream") {
      const refundDiff = (order.maxPriceDream - priceDream) * fillQty;
      if (refundDiff > 0) {
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${refundDiff}` })
          .where(eq(dreamBalance.userId, order.buyerId));
      }
      await db.update(dreamBalance)
        .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${sellerReceives}` })
        .where(eq(dreamBalance.userId, sellerId));
    }

    // Transfer item to buyer
    if (itemType === "card") {
      const existing = await db.select().from(userCards)
        .where(and(eq(userCards.userId, order.buyerId), eq(userCards.cardId, itemId)))
        .limit(1);
      if (existing[0]) {
        await db.update(userCards)
          .set({ quantity: sql`${userCards.quantity} + ${fillQty}` })
          .where(and(eq(userCards.userId, order.buyerId), eq(userCards.cardId, itemId)));
      } else {
        await db.insert(userCards).values({
          userId: order.buyerId, cardId: itemId, quantity: fillQty, obtainedVia: "marketplace_buy_order",
        });
      }
    }

    // Update buy order
    const newFilled = order.filledQuantity + fillQty;
    await db.update(marketBuyOrders)
      .set({
        filledQuantity: newFilled,
        status: newFilled >= order.quantity ? "filled" : "active",
      })
      .where(eq(marketBuyOrders.id, order.id));

    // Record transaction
    await db.insert(marketTransactions).values({
      listingId,
      buyOrderId: order.id,
      sellerId,
      buyerId: order.buyerId,
      itemType: itemType as any,
      itemId,
      itemName: order.itemName,
      quantity: fillQty,
      priceDream: currency === "dream" ? unitPrice : 0,
      priceCredits: currency === "credits" ? unitPrice : 0,
      taxDream: currency === "dream" ? tax : 0,
      taxCredits: currency === "credits" ? tax : 0,
    });

    // Notify buyer
    await db.insert(notifications).values({
      userId: order.buyerId,
      type: "market_buy_filled",
      title: "Buy Order Filled!",
      message: `Your buy order for ${order.itemName} x${fillQty} has been filled at ${unitPrice} ${currency} each.`,
      actionUrl: "/marketplace",
    });

    quantity -= fillQty;
  }
}

/** Resolve an auction (called on buyout or when time expires) */
async function resolveAuction(db: any, auctionId: number) {
  const auction = await db.select().from(marketAuctions)
    .where(eq(marketAuctions.id, auctionId)).limit(1);
  if (!auction[0] || auction[0].status !== "active") return;

  if (auction[0].highestBidderId && auction[0].currentBid > 0) {
    const tax = calcTax(auction[0].currentBid);
    const sellerReceives = auction[0].currentBid - tax;

    // Pay seller
    const sellerBal = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, auction[0].sellerId)).limit(1);
    if (sellerBal[0]) {
      await db.update(dreamBalance)
        .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${sellerReceives}` })
        .where(eq(dreamBalance.userId, auction[0].sellerId));
    } else {
      await db.insert(dreamBalance).values({ userId: auction[0].sellerId, dreamTokens: sellerReceives, soulBoundDream: 0 });
    }

    // Transfer item to winner
    if (auction[0].itemType === "card") {
      const existing = await db.select().from(userCards)
        .where(and(eq(userCards.userId, auction[0].highestBidderId), eq(userCards.cardId, auction[0].itemId)))
        .limit(1);
      if (existing[0]) {
        await db.update(userCards)
          .set({ quantity: sql`${userCards.quantity} + ${auction[0].quantity}` })
          .where(and(eq(userCards.userId, auction[0].highestBidderId), eq(userCards.cardId, auction[0].itemId)));
      } else {
        await db.insert(userCards).values({
          userId: auction[0].highestBidderId, cardId: auction[0].itemId, quantity: auction[0].quantity, obtainedVia: "auction_won",
        });
      }
    }

    // Record transaction
    await db.insert(marketTransactions).values({
      sellerId: auction[0].sellerId,
      buyerId: auction[0].highestBidderId,
      itemType: auction[0].itemType,
      itemId: auction[0].itemId,
      itemName: auction[0].itemName,
      quantity: auction[0].quantity,
      priceDream: auction[0].currentBid,
      taxDream: tax,
    });

    // Feed tax into pool and guild treasury
    await feedTaxPool(db, tax, 0);
    await feedGuildTreasury(db, auction[0].sellerId, tax, 0);

    // Notify winner
    await db.insert(notifications).values({
      userId: auction[0].highestBidderId,
      type: "auction_won",
      title: "Auction Won!",
      message: `You won ${auction[0].itemName} for ${auction[0].currentBid} Dream!`,
      actionUrl: "/marketplace",
    });

    // Notify seller
    await db.insert(notifications).values({
      userId: auction[0].sellerId,
      type: "auction_ended",
      title: "Auction Completed!",
      message: `Your ${auction[0].itemName} sold for ${auction[0].currentBid} Dream. You received ${sellerReceives} after tax.`,
      actionUrl: "/marketplace",
    });
  } else {
    // No bids — return item to seller
    if (auction[0].itemType === "card") {
      const existing = await db.select().from(userCards)
        .where(and(eq(userCards.userId, auction[0].sellerId), eq(userCards.cardId, auction[0].itemId)))
        .limit(1);
      if (existing[0]) {
        await db.update(userCards)
          .set({ quantity: sql`${userCards.quantity} + ${auction[0].quantity}` })
          .where(and(eq(userCards.userId, auction[0].sellerId), eq(userCards.cardId, auction[0].itemId)));
      } else {
        await db.insert(userCards).values({
          userId: auction[0].sellerId, cardId: auction[0].itemId, quantity: auction[0].quantity, obtainedVia: "auction_return",
        });
      }
    }
  }

  await db.update(marketAuctions)
    .set({ status: "ended" })
    .where(eq(marketAuctions.id, auctionId));
}

/** Try to match currency exchange orders */
async function tryMatchExchangeOrders(db: any, orderId: number, userId: number, input: any) {
  // Find complementary orders (someone selling what we want to buy)
  const matches = await db.select().from(currencyExchange)
    .where(and(
      eq(currencyExchange.status, "active"),
      eq(currencyExchange.sellCurrency, input.buyCurrency),
      eq(currencyExchange.buyCurrency, input.sellCurrency),
      sql`${currencyExchange.id} != ${orderId}`,
    ))
    .orderBy(asc(currencyExchange.createdAt))
    .limit(5);

  for (const match of matches) {
    // Check rate compatibility
    const myRate = input.sellAmount / input.buyAmount;
    const theirRate = match.buyAmount / match.sellAmount;
    if (myRate < theirRate) continue; // Rates don't match

    const fillAmount = Math.min(
      input.sellAmount - 0, // our remaining
      match.buyAmount - match.filledAmount, // their remaining want
    );
    if (fillAmount <= 0) continue;

    // Transfer currencies
    if (input.sellCurrency === "dream") {
      // We sell dream, they get dream
      await db.update(dreamBalance)
        .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${fillAmount}` })
        .where(eq(dreamBalance.userId, match.userId));
      // We get credits
      const creditsToGet = Math.floor(fillAmount * (match.sellAmount / match.buyAmount));
      await db.update(twPlayerState)
        .set({ credits: sql`${twPlayerState.credits} + ${creditsToGet}` })
        .where(eq(twPlayerState.userId, userId));
    } else {
      // We sell credits, they get credits
      await db.update(twPlayerState)
        .set({ credits: sql`${twPlayerState.credits} + ${fillAmount}` })
        .where(eq(twPlayerState.userId, match.userId));
      // We get dream
      const dreamToGet = Math.floor(fillAmount * (match.sellAmount / match.buyAmount));
      await db.update(dreamBalance)
        .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${dreamToGet}` })
        .where(eq(dreamBalance.userId, userId));
    }

    // Update both orders
    await db.update(currencyExchange)
      .set({ filledAmount: sql`${currencyExchange.filledAmount} + ${fillAmount}`, status: "filled" })
      .where(eq(currencyExchange.id, match.id));

    await db.update(currencyExchange)
      .set({ filledAmount: sql`${currencyExchange.filledAmount} + ${fillAmount}`, status: "filled" })
      .where(eq(currencyExchange.id, orderId));

    break; // One match at a time
  }
}
