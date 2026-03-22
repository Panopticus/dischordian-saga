/**
 * COSMETIC SHOP ROUTER
 * ──────────────────────────────────────────────────
 * Card art variants, skins, theme packs. RPG integration for exclusive items.
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  cosmeticPurchases, citizenCharacters, prestigeProgress,
} from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import {
  COSMETIC_ITEMS, getShopItems,
  type CosmeticItem,
} from "../../shared/cosmeticShop";

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

  /** Purchase a cosmetic */
  purchaseCosmetic: protectedProcedure
    .input(z.object({ itemKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const item = COSMETIC_ITEMS.find((i: CosmeticItem) => i.key === input.itemKey);
      if (!item) throw new Error("Item not found");

      // Check if already owned
      const [existing] = await db.select().from(cosmeticPurchases)
        .where(and(eq(cosmeticPurchases.userId, ctx.user.id), eq(cosmeticPurchases.itemKey, input.itemKey)));
      if (existing) throw new Error("Already owned");

      await db.insert(cosmeticPurchases).values({
        userId: ctx.user.id,
        itemKey: input.itemKey,
        price: item.price,
      });

      return { purchased: true, item: item.name };
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
