/**
 * COSMETIC SHOP ROUTER
 * ──────────────────────────────────────────────────
 * Card art variants, skins, theme packs. RPG integration for exclusive items.
 * Boss mastery cosmetics appear in collection once earned.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  cosmeticPurchases, citizenCharacters, prestigeProgress,
  bossMastery, dreamBalance, userTitles,
} from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import {
  COSMETIC_ITEMS, getShopItems, getBossMasteryCosmetics,
  type CosmeticItem,
} from "../../shared/cosmeticShop";
import { ripple } from "../services/rippleEngine";

export const cosmeticShopRouter = router({
  /** Get shop items with availability based on RPG state */
  getShopItems: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    const [char] = await db.select().from(citizenCharacters).where(eq(citizenCharacters.userId, ctx.user.id));
    const prestRows = await db.select().from(prestigeProgress).where(eq(prestigeProgress.userId, ctx.user.id));

    const available = getShopItems({
      prestigeClass: prestRows[0]?.prestigeClassKey,
    });

    // Get already purchased items
    const purchased = await db.select().from(cosmeticPurchases)
      .where(eq(cosmeticPurchases.userId, ctx.user.id));
    const purchasedKeys = new Set(purchased.map(p => p.itemKey));

    return available.map((item: CosmeticItem) => ({
      ...item,
      owned: purchasedKeys.has(item.key),
      equipped: purchased.find(p => p.itemKey === item.key)?.equipped || false,
    }));
  }),

  /** Get full collection: purchased + earned cosmetics */
  getMyCollection: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");

    // Purchased items
    const purchased = await db.select().from(cosmeticPurchases)
      .where(eq(cosmeticPurchases.userId, ctx.user.id));
    const purchasedKeys = new Set(purchased.map(p => p.itemKey));

    // Boss mastery earned cosmetics
    const bossRows = await db.select().from(bossMastery).where(eq(bossMastery.userId, ctx.user.id));
    const allBossCosmetics: string[] = [];
    for (const b of bossRows) {
      if (b.cosmeticsUnlocked) {
        allBossCosmetics.push(...b.cosmeticsUnlocked);
      }
    }
    const earnedFromBoss = getBossMasteryCosmetics(allBossCosmetics);

    // Combine: purchased items + earned items
    const collection: Array<CosmeticItem & { owned: boolean; equipped: boolean; source: string }> = [];

    // Add purchased items
    for (const p of purchased) {
      const item = COSMETIC_ITEMS.find(i => i.key === p.itemKey);
      if (item) {
        collection.push({ ...item, owned: true, equipped: p.equipped || false, source: "purchased" });
      }
    }

    // Add boss mastery earned items (if not already purchased)
    for (const item of earnedFromBoss) {
      if (!purchasedKeys.has(item.key)) {
        collection.push({ ...item, owned: true, equipped: false, source: "boss_mastery" });
      }
    }

    return collection;
  }),

  /** Purchase a cosmetic */
  purchaseCosmetic: protectedProcedure
    .input(z.object({ itemKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const item = COSMETIC_ITEMS.find((i: CosmeticItem) => i.key === input.itemKey);
      if (!item) throw new Error("Item not found");
      // Can't purchase boss mastery items
      if (item.earnedFromBoss) throw new Error("This cosmetic is earned from boss mastery, not purchasable");

      // Wrap the whole purchase in a transaction so balance check,
      // balance deduction, and ownership insert are atomic. The
      // historical TOCTOU let two parallel requests both see funds,
      // both deduct, and the second succeed silently — leaving
      // negative balance or dual-grant.
      const { sql } = await import("drizzle-orm");
      await db.transaction(async (tx) => {
        // Already-owned check inside the tx so a concurrent buy of the
        // same item can't squeak past.
        const [existing] = await tx.select().from(cosmeticPurchases)
          .where(and(eq(cosmeticPurchases.userId, ctx.user.id), eq(cosmeticPurchases.itemKey, input.itemKey)));
        if (existing) throw new Error("Already owned");

        if (item.price > 0) {
          // Single conditional UPDATE — only touches the row when the
          // user has enough Dream. mysql2 returns affectedRows; an
          // affectedRows of 0 means the WHERE clause didn't match
          // (insufficient balance OR no row at all), and we error.
          const result = await tx.execute(sql`
            UPDATE dream_balance
            SET dream_tokens = dream_tokens - ${item.price}
            WHERE user_id = ${ctx.user.id} AND dream_tokens >= ${item.price}
          `);
          // Drizzle/mysql2 result shape: [ResultSetHeader, FieldPacket[]]
          // ResultSetHeader has affectedRows.
          const affected = (result as unknown as Array<{ affectedRows?: number }>)[0]?.affectedRows ?? 0;
          if (affected === 0) {
            // Either no balance row or insufficient funds — fetch to
            // distinguish for a clearer error.
            const [bal] = await tx.select().from(dreamBalance)
              .where(eq(dreamBalance.userId, ctx.user.id));
            if (!bal) throw new Error("No Dream balance found");
            throw new Error(`Not enough Dream tokens. Need ${item.price}, have ${bal.dreamTokens}`);
          }
        }

        await tx.insert(cosmeticPurchases).values({
          userId: ctx.user.id,
          itemKey: input.itemKey,
          price: item.price,
        });
      });

      // Mirror into userTitles so cosmetic-shop title purchases show up
      // in the unified title catalog and can be equipped via the titles
      // router. The titleKey matches the cosmetic key 1:1 for migrated items.
      if (item.type === "title") {
        const { sql } = await import("drizzle-orm");
        await db
          .insert(userTitles)
          .values({ userId: ctx.user.id, titleKey: input.itemKey })
          .onDuplicateKeyUpdate({ set: { earnedAt: sql`earned_at` } })
          .catch(() => {/* idempotent — duplicate is fine */});
      }

      await ripple.emit("store_purchase", { userId: ctx.user.id, amount: item.price });

      return { purchased: true, item: item.name, priceCharged: item.price };
    }),

  /** Equip/unequip a cosmetic */
  toggleEquip: protectedProcedure
    .input(z.object({ itemKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [purchase] = await db.select().from(cosmeticPurchases)
        .where(and(eq(cosmeticPurchases.userId, ctx.user.id), eq(cosmeticPurchases.itemKey, input.itemKey)));
      if (!purchase) throw new Error("Not owned");

      await db.update(cosmeticPurchases)
        .set({ equipped: !purchase.equipped })
        .where(eq(cosmeticPurchases.id, purchase.id));

      return { equipped: !purchase.equipped };
    }),

  /** Get my equipped cosmetics */
  getEquipped: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    return db.select().from(cosmeticPurchases)
      .where(and(eq(cosmeticPurchases.userId, ctx.user.id), eq(cosmeticPurchases.equipped, true)));
  }),
});
