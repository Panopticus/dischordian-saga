/* ═══════════════════════════════════════════════════════
   CROSS-GAME LEDGER ROUTER

   Plan §E3. Surfaces the typed milestone exchange currency
   to the client. Each subsystem (card_battle, chess, etc.)
   posts to recordMilestone; downstream consumers (codex
   unlocks, card variants, perma-bonuses) react to the
   resulting ledger + flag mints.

   State lives inside userProgress.gameData.crossGameLedger
   so no DB migration is required.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress } from "../../db/schema";
import {
  LEDGER_MILESTONES,
  hasMilestone,
  listLedgerSubsystems,
  pendingMintFlags,
  recordMilestone,
  type LedgerEntry,
} from "../../shared/crossGameLedger";

async function loadLedger(userId: number): Promise<{
  raw: Record<string, unknown>;
  ledger: LedgerEntry[];
  flags: Record<string, boolean | undefined>;
}> {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
  }
  const row = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);
  const raw = (row[0]?.gameData ?? {}) as Record<string, unknown>;
  const ledger = Array.isArray(raw.crossGameLedger) ? (raw.crossGameLedger as LedgerEntry[]) : [];
  const flags = (raw.narrativeFlags ?? {}) as Record<string, boolean | undefined>;
  return { raw, ledger, flags };
}

export const crossGameLedgerRouter = router({
  /** Player's current ledger + computed metadata. */
  getState: protectedProcedure.query(async ({ ctx }) => {
    const { ledger, flags } = await loadLedger(ctx.user.id);
    return {
      entries: ledger,
      subsystems: listLedgerSubsystems(ledger),
      pendingMintFlags: pendingMintFlags(ledger, flags),
      catalog: LEDGER_MILESTONES,
    };
  }),

  /** Record a milestone. Idempotent — a duplicate id is a no-op
   *  on the ledger but still triggers the flag-mint pass so a
   *  late-arriving consumer can pick up an earlier achievement. */
  record: protectedProcedure
    .input(z.object({ milestoneId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const milestone = LEDGER_MILESTONES.find((m) => m.id === input.milestoneId);
      if (!milestone) return { ok: false, error: "Unknown milestone" };

      const { raw, ledger, flags } = await loadLedger(ctx.user.id);
      const wasNew = !hasMilestone(input.milestoneId, ledger);
      const nextLedger = recordMilestone(input.milestoneId, ledger);

      // Mint the flag if declared and not already set. The narrative
      // flag flows through the same gameData.narrativeFlags path the
      // rest of the codebase reads from, so existing consumers (codex
      // unlock, conditional templating, etc.) pick it up immediately.
      const flagMinted = milestone.mintFlag && !flags[milestone.mintFlag] ? milestone.mintFlag : null;
      if (flagMinted) flags[flagMinted] = true;

      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      }
      await db
        .update(userProgress)
        .set({ gameData: { ...raw, crossGameLedger: nextLedger, narrativeFlags: flags } })
        .where(eq(userProgress.userId, ctx.user.id));

      return { ok: true, wasNew, flagMinted };
    }),
});
