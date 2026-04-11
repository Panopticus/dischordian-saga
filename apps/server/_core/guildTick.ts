/**
 * Guild Tick — hourly background job for guild-side housekeeping.
 *
 * Called from _core/index.ts alongside the living-universe tick. The
 * job is idempotent and safe to run at any cadence; the welfare and
 * event-close steps both track "last run" timestamps in memory so they
 * only fire at their configured intervals.
 *
 * Current responsibilities:
 *   1. Weekly guild welfare — every guild whose treasuryDream is below
 *      a threshold gets a small stipend from the marketplace tax pool
 *      (or minted if the pool is empty). Based on the design note:
 *      "50 Dream/week for new guilds". We apply it to all guilds whose
 *      treasury is below the stipend amount, so established guilds
 *      don't get handouts.
 *   2. Event auto-completion — any scheduled/in_progress event whose
 *      endsAt has passed flips to `completed`. The read path already
 *      reconciles status per-query, but this sweeps stale events that
 *      nobody is actively viewing.
 */
import { eq, and, lt, inArray, sql } from "drizzle-orm";
import { getDb } from "../db";
import { guilds, guildEvents, marketTaxPool } from "../../db/schema";

const WELFARE_AMOUNT = 50;
const WELFARE_THRESHOLD = 50;
const WELFARE_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

let lastWelfareAt = 0;

/** Grant welfare Dream to every guild with a treasury below the
 *  threshold. Funded from the marketplace tax pool when possible. */
async function runWelfarePass(): Promise<{ guildsFunded: number; source: "pool" | "mint" | "mixed" }> {
  const db = await getDb();
  if (!db) return { guildsFunded: 0, source: "mint" };

  const eligible = await db
    .select({ id: guilds.id, treasuryDream: guilds.treasuryDream })
    .from(guilds)
    .where(lt(guilds.treasuryDream, WELFARE_THRESHOLD));

  if (eligible.length === 0) return { guildsFunded: 0, source: "mint" };

  const totalNeeded = eligible.length * WELFARE_AMOUNT;

  // Try to fund from the marketplace tax pool first. If it's empty or
  // underfunded, fall back to minting (the design calls for welfare to
  // always be granted).
  const [pool] = await db.select().from(marketTaxPool).limit(1);
  const poolDream = pool?.poolDream ?? 0;
  const fundedFromPool = Math.min(poolDream, totalNeeded);
  const mintedAmount = totalNeeded - fundedFromPool;

  if (fundedFromPool > 0 && pool) {
    await db.update(marketTaxPool)
      .set({
        poolDream: sql`${marketTaxPool.poolDream} - ${fundedFromPool}`,
        lastDistributedAt: new Date(),
      })
      .where(eq(marketTaxPool.id, pool.id));
  }

  await db.update(guilds)
    .set({ treasuryDream: sql`${guilds.treasuryDream} + ${WELFARE_AMOUNT}` })
    .where(inArray(guilds.id, eligible.map((g) => g.id)));

  const source: "pool" | "mint" | "mixed" =
    mintedAmount === 0 ? "pool" : fundedFromPool === 0 ? "mint" : "mixed";
  return { guildsFunded: eligible.length, source };
}

/** Flip any scheduled/in_progress events whose endsAt has passed to
 *  the `completed` status. Cancelled rows are never touched. */
async function runEventCloseSweep(): Promise<{ closed: number }> {
  const db = await getDb();
  if (!db) return { closed: 0 };

  const now = new Date();
  const stale = await db
    .select({ id: guildEvents.id })
    .from(guildEvents)
    .where(and(
      lt(guildEvents.endsAt, now),
      inArray(guildEvents.status, ["scheduled", "in_progress"] as const),
    ));
  if (stale.length === 0) return { closed: 0 };

  await db.update(guildEvents)
    .set({ status: "completed" })
    .where(inArray(guildEvents.id, stale.map((e) => e.id)));
  return { closed: stale.length };
}

/** Run the guild tick. Safe to call repeatedly — the welfare pass is
 *  rate-limited via an in-memory timestamp; the event-close sweep is
 *  idempotent. The tick never throws. */
export async function runGuildTick(): Promise<{
  welfare: { guildsFunded: number; source: "pool" | "mint" | "mixed" } | null;
  closedEvents: number;
}> {
  const now = Date.now();
  let welfare = null;
  if (now - lastWelfareAt >= WELFARE_INTERVAL_MS) {
    try {
      welfare = await runWelfarePass();
      lastWelfareAt = now;
    } catch (err) {
      console.error("[guildTick] welfare pass failed:", err);
    }
  }

  let closedEvents = 0;
  try {
    const result = await runEventCloseSweep();
    closedEvents = result.closed;
  } catch (err) {
    console.error("[guildTick] event close sweep failed:", err);
  }

  return { welfare, closedEvents };
}

/** Test hook — resets the welfare rate limit so vitest can exercise the
 *  pass multiple times per run. Not exported as a public API. */
export function __resetGuildTickState() {
  lastWelfareAt = 0;
}
