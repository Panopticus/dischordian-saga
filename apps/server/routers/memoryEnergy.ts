/* ═══════════════════════════════════════════════════════
   MEMORY ENERGY — server-authoritative balance router

   Act 2 shipped Memory Energy as a client-persisted value
   (userProgress.gameData JSON blob). Once Act 3 Trade Empire
   content stages Memory Energy as a real currency that gates
   progression, the client state becomes tamperable — this
   router migrates Memory Energy to its own dedicated balance
   table mirroring the dreamBalance pattern.

   Procedures:
     - getBalance(): Current memoryEnergy + lifetime totals
     - earn(source, amount?): Apply an earn-source with optional
       override; server calculates the clamped next value.
     - spend(amount): Validates affordability, deducts, returns
       the new balance. Used by crafting.ts.

   Cap is NOT stored server-side; it's derived from narrative
   flags (see shared/memoryEnergy.ts computeMemoryEnergyCap).
   The server reads flags from userProgress.gameData so the
   clamp honors whichever cap the player has unlocked.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { memoryEnergyBalance, userProgress } from "../../db/schema";
import {
  MEMORY_ENERGY_MIN,
  MEMORY_ENERGY_STARTING,
  MEMORY_ENERGY_EARN_RATES,
  computeMemoryEnergyCap,
  clampMemoryEnergy,
  type MemoryEnergyEarnSource,
} from "../../shared/memoryEnergy";
import { TRPCError } from "@trpc/server";

type BalanceRow = {
  memoryEnergy: number;
  totalEarned: number;
  totalSpent: number;
};

const ZERO_BALANCE: BalanceRow = {
  memoryEnergy: MEMORY_ENERGY_STARTING,
  totalEarned: 0,
  totalSpent: 0,
};

async function loadFlags(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
): Promise<Record<string, unknown>> {
  const rows = await db
    .select({ gameData: userProgress.gameData })
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  const gameData = (rows[0]?.gameData ?? {}) as {
    narrativeFlags?: Record<string, unknown>;
  };
  return gameData.narrativeFlags ?? {};
}

async function loadOrCreateBalance(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
): Promise<BalanceRow> {
  const rows = await db
    .select({
      memoryEnergy: memoryEnergyBalance.memoryEnergy,
      totalEarned: memoryEnergyBalance.totalEarned,
      totalSpent: memoryEnergyBalance.totalSpent,
    })
    .from(memoryEnergyBalance)
    .where(eq(memoryEnergyBalance.userId, userId))
    .limit(1);

  if (rows.length > 0) return rows[0];

  await db.insert(memoryEnergyBalance).values({
    userId,
    memoryEnergy: MEMORY_ENERGY_STARTING,
    totalEarned: 0,
    totalSpent: 0,
  });
  return { ...ZERO_BALANCE };
}

const earnSourceSchema = z.enum([
  "cardBattleWin",
  "chessWin",
  "arenaWin",
  "recordingDiscovery",
  "dailyBriefClaim",
]);

export const memoryEnergyRouter = router({
  /** Current reserve + derived cap + lifetime totals. */
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const [balance, flags] = await Promise.all([
      loadOrCreateBalance(db, ctx.user.id),
      loadFlags(db, ctx.user.id),
    ]);
    const cap = computeMemoryEnergyCap(flags);
    // Re-clamp on read in case the cap dropped below the stored
    // value (prestige reset lowers cap back to base).
    const current = clampMemoryEnergy(balance.memoryEnergy, cap);
    return {
      memoryEnergy: current,
      cap,
      totalEarned: balance.totalEarned,
      totalSpent: balance.totalSpent,
    };
  }),

  /** Apply an earn-source event. Returns the new balance. */
  earn: protectedProcedure
    .input(
      z.object({
        source: earnSourceSchema,
        /** Optional amount override (defaults to MEMORY_ENERGY_EARN_RATES[source]). */
        amount: z.number().int().min(0).max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const [balance, flags] = await Promise.all([
        loadOrCreateBalance(db, ctx.user.id),
        loadFlags(db, ctx.user.id),
      ]);
      const cap = computeMemoryEnergyCap(flags);
      const delta =
        input.amount ??
        (MEMORY_ENERGY_EARN_RATES[input.source as MemoryEnergyEarnSource] ?? 0);
      if (delta <= 0) {
        return {
          memoryEnergy: balance.memoryEnergy,
          cap,
          delta: 0,
          totalEarned: balance.totalEarned,
          totalSpent: balance.totalSpent,
        };
      }
      const next = clampMemoryEnergy(balance.memoryEnergy + delta, cap);
      const actualDelta = next - balance.memoryEnergy;
      await db
        .update(memoryEnergyBalance)
        .set({
          memoryEnergy: next,
          totalEarned: balance.totalEarned + actualDelta,
        })
        .where(eq(memoryEnergyBalance.userId, ctx.user.id));
      return {
        memoryEnergy: next,
        cap,
        delta: actualDelta,
        totalEarned: balance.totalEarned + actualDelta,
        totalSpent: balance.totalSpent,
      };
    }),

  /** Deduct an amount. Rejects under-budget spends. */
  spend: protectedProcedure
    .input(z.object({ amount: z.number().int().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const balance = await loadOrCreateBalance(db, ctx.user.id);
      if (balance.memoryEnergy < input.amount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "INSUFFICIENT_MEMORY_ENERGY",
        });
      }
      const next = Math.max(MEMORY_ENERGY_MIN, balance.memoryEnergy - input.amount);
      await db
        .update(memoryEnergyBalance)
        .set({
          memoryEnergy: next,
          totalSpent: balance.totalSpent + input.amount,
        })
        .where(eq(memoryEnergyBalance.userId, ctx.user.id));
      return {
        memoryEnergy: next,
        delta: -input.amount,
        totalSpent: balance.totalSpent + input.amount,
      };
    }),
});
