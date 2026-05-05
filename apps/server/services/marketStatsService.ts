/* ═══════════════════════════════════════════════════════
   MARKET STATS — Aggregate counters that drive
   marketAchievements.

   For each user, computes the canonical totals the
   apps/server/routers/marketAchievements.ts ACHIEVEMENT_DEFS
   conditions read against (`market_listings`, `market_sales`,
   `market_purchases`, `auctions_won`, etc.). Read-only —
   marketplace mutations don't pre-aggregate; we recompute
   from the source tables on demand.

   Phase I of the build-everything pass un-deprecated
   marketAchievements by wiring this service into the
   achievementTracker, which the marketplace router already
   calls after every stat-changing mutation.
   ═══════════════════════════════════════════════════════ */
import { eq, and, sql } from "drizzle-orm";
import type { DrizzleDb } from "../db";
import {
  marketListings,
  marketTransactions,
  userCards,
} from "../../db/schema";

export interface MarketStats {
  market_listings: number;
  market_sales: number;
  market_purchases: number;
  auctions_won: number;
  buy_orders_placed: number;
  exchanges_completed: number;
  market_dream_spent: number;
  market_credits_earned: number;
  // Keys for parity with marketAchievements ACHIEVEMENT_DEFS — left at 0
  // until the corresponding emitters are wired through this service.
  [k: string]: number;
}

/**
 * Compute the user's running marketplace stats from source tables.
 * The result feeds into apps/server/routers/marketAchievements.ts's
 * checkAndUnlock pattern.
 */
export async function computeMarketStats(
  db: DrizzleDb,
  userId: number,
): Promise<MarketStats> {
  const [listings, sales, purchases, auctions] = await Promise.all([
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(marketListings)
      .where(eq(marketListings.sellerId, userId)),
    db
      .select({
        count: sql<number>`COUNT(*)`,
        credits: sql<number>`COALESCE(SUM(${marketTransactions.priceCredits} * ${marketTransactions.quantity}), 0)`,
      })
      .from(marketTransactions)
      .where(eq(marketTransactions.sellerId, userId)),
    db
      .select({
        count: sql<number>`COUNT(*)`,
        dreamSpent: sql<number>`COALESCE(SUM(${marketTransactions.priceDream} * ${marketTransactions.quantity}), 0)`,
      })
      .from(marketTransactions)
      .where(eq(marketTransactions.buyerId, userId)),
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userCards)
      .where(
        and(
          eq(userCards.userId, userId),
          eq(userCards.obtainedVia, "auction_won"),
        ),
      ),
  ]);

  return {
    market_listings: Number(listings[0]?.count ?? 0),
    market_sales: Number(sales[0]?.count ?? 0),
    market_purchases: Number(purchases[0]?.count ?? 0),
    auctions_won: Number(auctions[0]?.count ?? 0),
    market_credits_earned: Number(sales[0]?.credits ?? 0),
    market_dream_spent: Number(purchases[0]?.dreamSpent ?? 0),
    // Buy-order + currency-exchange counts aren't yet pre-tabulated
    // anywhere; surface as 0 until those emitters route through here.
    buy_orders_placed: 0,
    exchanges_completed: 0,
  };
}
