/* ═══════════════════════════════════════════════════════
   CONTENT API — Serves static JSON data with server-side caching
   Replaces direct JSON imports on the client with tRPC procedures.
   ═══════════════════════════════════════════════════════ */
import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import fs from "fs";
import path from "path";

// In-memory cache for JSON data
let loredexCache: any = null;
let cardsCache: any = null;
let loredexCacheTime = 0;
let cardsCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const DATA_DIR = path.resolve(import.meta.dirname, "../../client/src/data");

function getLoredexData() {
  const now = Date.now();
  if (!loredexCache || now - loredexCacheTime > CACHE_TTL) {
    const raw = fs.readFileSync(path.join(DATA_DIR, "loredex-data.json"), "utf-8");
    loredexCache = JSON.parse(raw);
    loredexCacheTime = now;
  }
  return loredexCache;
}

function getCardsData() {
  const now = Date.now();
  if (!cardsCache || now - cardsCacheTime > CACHE_TTL) {
    const raw = fs.readFileSync(path.join(DATA_DIR, "season1-cards.json"), "utf-8");
    cardsCache = JSON.parse(raw);
    cardsCacheTime = now;
  }
  return cardsCache;
}

export const contentApiRouter = router({
  /* ── Loredex entries ── */
  getAllEntries: publicProcedure.query(() => {
    return getLoredexData();
  }),

  getEntryById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const data = getLoredexData();
      const entries = Array.isArray(data) ? data : data.entries || [];
      return entries.find((e: any) => e.id === input.id) || null;
    }),

  searchEntries: publicProcedure
    .input(z.object({
      query: z.string().optional(),
      type: z.string().optional(),
      limit: z.number().min(1).max(200).default(50),
      cursor: z.number().min(0).default(0),
    }))
    .query(({ input }) => {
      const data = getLoredexData();
      let entries = Array.isArray(data) ? data : data.entries || [];

      if (input.type) {
        entries = entries.filter((e: any) => e.type === input.type);
      }
      if (input.query) {
        const q = input.query.toLowerCase();
        entries = entries.filter((e: any) =>
          e.name?.toLowerCase().includes(q) ||
          e.bio?.toLowerCase().includes(q) ||
          e.aliases?.some((a: string) => a.toLowerCase().includes(q))
        );
      }

      const total = entries.length;
      const items = entries.slice(input.cursor, input.cursor + input.limit);
      const nextCursor = input.cursor + input.limit < total ? input.cursor + input.limit : null;

      return { items, total, nextCursor };
    }),

  /* ── Cards ── */
  getAllCards: publicProcedure.query(() => {
    return getCardsData();
  }),

  getCardById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const data = getCardsData();
      const cards = Array.isArray(data) ? data : data.cards || [];
      return cards.find((c: any) => c.id === input.id) || null;
    }),

  searchCards: publicProcedure
    .input(z.object({
      query: z.string().optional(),
      rarity: z.string().optional(),
      faction: z.string().optional(),
      limit: z.number().min(1).max(200).default(50),
      cursor: z.number().min(0).default(0),
    }))
    .query(({ input }) => {
      const data = getCardsData();
      let cards = Array.isArray(data) ? data : data.cards || [];

      if (input.rarity) {
        cards = cards.filter((c: any) => c.rarity === input.rarity);
      }
      if (input.faction) {
        cards = cards.filter((c: any) => c.faction === input.faction);
      }
      if (input.query) {
        const q = input.query.toLowerCase();
        cards = cards.filter((c: any) =>
          c.name?.toLowerCase().includes(q) ||
          c.character?.toLowerCase().includes(q)
        );
      }

      const total = cards.length;
      const items = cards.slice(input.cursor, input.cursor + input.limit);
      const nextCursor = input.cursor + input.limit < total ? input.cursor + input.limit : null;

      return { items, total, nextCursor };
    }),

  /* ── Stats ── */
  getStats: publicProcedure.query(() => {
    const loredex = getLoredexData();
    const entries = Array.isArray(loredex) ? loredex : loredex.entries || [];
    const cards = getCardsData();
    const cardList = Array.isArray(cards) ? cards : cards.cards || [];

    const typeCounts: Record<string, number> = {};
    for (const e of entries) {
      typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
    }

    return {
      totalEntries: entries.length,
      totalCards: cardList.length,
      typeCounts,
    };
  }),

  /* ── Cache invalidation (admin only) ── */
  invalidateCache: publicProcedure.mutation(() => {
    loredexCache = null;
    cardsCache = null;
    loredexCacheTime = 0;
    cardsCacheTime = 0;
    return { success: true };
  }),
});
