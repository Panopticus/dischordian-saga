/* ═══════════════════════════════════════════════════════
   ESSENCE HARVEST ROUTER — The Collector's Ledger

   tRPC endpoints for the arena essence harvest trophy system.
   Backs the EssenceHarvestPage UI and is called from
   fightLeaderboard.recordMatch on victory.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { arenaEssences } from "../../db/schema";
import {
  ESSENCES,
  getEssenceDef,
  deriveHarvestRarity,
  maxRarity,
  type EssenceRarity,
} from "../../client/src/game/essenceHarvest";
import { writeNarrativeFlag } from "../services/narrativeFlagService";

export const essenceHarvestRouter = router({
  /* ─── Get all of my harvested essences ─── */
  getMyLedger: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return {
        essences: [] as Array<{
          fighterId: string;
          count: number;
          bestRarity: EssenceRarity;
          firstHarvestedAt: Date;
          lastHarvestedAt: Date;
        }>,
        totalHarvested: 0,
        uniqueFighters: 0,
        registryTotal: Object.keys(ESSENCES).length,
      };
    }

    const rows = await db
      .select()
      .from(arenaEssences)
      .where(eq(arenaEssences.userId, ctx.user.id))
      .orderBy(desc(arenaEssences.lastHarvestedAt));

    const totalHarvested = rows.reduce((sum, r) => sum + r.count, 0);

    return {
      essences: rows.map(r => ({
        fighterId: r.fighterId,
        count: r.count,
        bestRarity: r.bestRarity as EssenceRarity,
        firstHarvestedAt: r.firstHarvestedAt,
        lastHarvestedAt: r.lastHarvestedAt,
      })),
      totalHarvested,
      uniqueFighters: rows.length,
      registryTotal: Object.keys(ESSENCES).length,
    };
  }),

  /* ─── Look up a single fighter's harvest count ─── */
  getFighterCount: protectedProcedure
    .input(z.object({ fighterId: z.string().min(1).max(128) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { fighterId: input.fighterId, count: 0, bestRarity: "common" as EssenceRarity };

      const [row] = await db
        .select()
        .from(arenaEssences)
        .where(
          and(
            eq(arenaEssences.userId, ctx.user.id),
            eq(arenaEssences.fighterId, input.fighterId),
          ),
        );

      return {
        fighterId: input.fighterId,
        count: row?.count ?? 0,
        bestRarity: (row?.bestRarity as EssenceRarity) ?? "common",
      };
    }),

  /* ─── Harvest an essence from a defeated fighter ───
   *
   * Normally called server-side from fightLeaderboard.recordMatch on
   * victory — exposing it as a mutation lets the client trigger it
   * directly from story mode flows too (e.g., mandatory-loss chapters
   * that grant an essence on narrative completion rather than KO).
   *
   * Upsert-style: inserts a new row on first harvest, or increments
   * count + lifts bestRarity on subsequent harvests. Rarity is
   * one-directional — maxRarity() ensures it never degrades.
   */
  harvest: protectedProcedure
    .input(z.object({
      fighterId: z.string().min(1).max(128),
      difficulty: z.string().min(1).max(64),
      perfect: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const def = getEssenceDef(input.fighterId);
      const harvestRarity = deriveHarvestRarity(
        def.baseRarity,
        input.difficulty,
        input.perfect,
      );

      if (!db) {
        return {
          fighterId: input.fighterId,
          essenceName: def.name,
          count: 1,
          bestRarity: harvestRarity,
          firstHarvest: true,
          upgraded: false,
        };
      }

      // Look up existing row
      const [existing] = await db
        .select()
        .from(arenaEssences)
        .where(
          and(
            eq(arenaEssences.userId, ctx.user.id),
            eq(arenaEssences.fighterId, input.fighterId),
          ),
        );

      if (!existing) {
        await db.insert(arenaEssences).values({
          userId: ctx.user.id,
          fighterId: input.fighterId,
          count: 1,
          bestRarity: harvestRarity,
        });
        // audit/10.F5 — first harvest is a narrative milestone.
        // Drop the sticky flag so The Collector's ledger surfaces
        // can react (variant resolver / companion comments).
        await writeNarrativeFlag(
          ctx.user.id,
          "essence_harvest_first",
          "essence_harvest",
        );
        return {
          fighterId: input.fighterId,
          essenceName: def.name,
          count: 1,
          bestRarity: harvestRarity,
          firstHarvest: true,
          upgraded: false,
        };
      }

      const prevRarity = existing.bestRarity as EssenceRarity;
      const nextRarity = maxRarity(prevRarity, harvestRarity);
      const upgraded = nextRarity !== prevRarity;

      await db
        .update(arenaEssences)
        .set({
          count: existing.count + 1,
          bestRarity: nextRarity,
          lastHarvestedAt: new Date(),
        })
        .where(eq(arenaEssences.id, existing.id));

      // audit/10.F5 — the tenth harvest of any single fighter
      // promotes the player to "veteran" and drops a sticky flag.
      // Idempotent: subsequent harvests re-write the same flag.
      const newCount = existing.count + 1;
      if (newCount === 10) {
        await writeNarrativeFlag(
          ctx.user.id,
          "essence_harvest_veteran",
          "essence_harvest",
        );
      }

      return {
        fighterId: input.fighterId,
        essenceName: def.name,
        count: newCount,
        bestRarity: nextRarity,
        firstHarvest: false,
        upgraded,
      };
    }),

  /* ─── Public: fighter-level leaderboard of who's been harvested most ─── */
  getMostHarvested: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { entries: [] as Array<{ fighterId: string; totalHarvests: number }> };

      const limit = input?.limit ?? 10;

      // Drizzle doesn't support SUM + GROUP BY in our current abstraction
      // cleanly, so fall back to raw-ish SQL. We get the aggregate shape
      // we need without loading every row into memory.
      const rows = await db
        .select({
          fighterId: arenaEssences.fighterId,
          count: arenaEssences.count,
        })
        .from(arenaEssences);

      const totals = new Map<string, number>();
      for (const r of rows) {
        totals.set(r.fighterId, (totals.get(r.fighterId) ?? 0) + r.count);
      }

      const entries = Array.from(totals.entries())
        .map(([fighterId, totalHarvests]) => ({ fighterId, totalHarvests }))
        .sort((a, b) => b.totalHarvests - a.totalHarvests)
        .slice(0, limit);

      return { entries };
    }),
});
