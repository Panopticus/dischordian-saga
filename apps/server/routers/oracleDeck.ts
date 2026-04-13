/**
 * Oracle Deck router — backing API for the 23-card Dischordian
 * tarot system (Phase E5).
 *
 * Procedures:
 *   - getProgress: lazy-create the player's oracle_deck_progress
 *     row and return it along with the full ORACLE_DECK registry
 *     for client rendering.
 *   - listCollection: returns the full deck with an "owned" flag
 *     per card, plus the card's unlock condition for the "how to
 *     earn" UI.
 *   - claimCard: grants a card into the player's collection when
 *     the corresponding milestone is satisfied. Idempotent.
 *   - castDaily: cast today's 1-card reading. Deterministic,
 *     one-per-day. If already cast, returns the cached reading.
 *   - castPreMatch: cast a 3-card pre-match reading. Costs 1
 *     Oracle charge. seedKey is an arbitrary string the caller
 *     provides (typically the chess or TCG match id).
 *   - castWeekly: cast the 5-card weekly spread. Costs 3 charges.
 *     One per week.
 *   - grantCharges: server-side helper (not exposed as a
 *     procedure) other routers can import to award charges when
 *     a milestone completes.
 */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { oracleDeckProgress, oracleReadings } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { logger } from "../logger";
import {
  ORACLE_DECK,
  getOracleCardBySlug,
  castReading,
  type OracleReading,
  type OracleSpreadKind,
} from "@shared/tcg-core";

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

function currentDayNumber(): number {
  return Math.floor(Date.now() / 86_400_000);
}
function currentWeekNumber(): number {
  return Math.floor(currentDayNumber() / 7);
}

/** Lazy-create the player's oracle_deck_progress row. Every
 *  procedure that touches progress calls this first. */
async function ensureProgressRow(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
) {
  const existing = await db.select().from(oracleDeckProgress)
    .where(eq(oracleDeckProgress.userId, userId)).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(oracleDeckProgress).values({
    userId,
    ownedSlugs: [],
    charges: 1, // Start with one free charge so new players can try a pre-match spread.
    fnordUnlocked: false,
  });
  const fresh = await db.select().from(oracleDeckProgress)
    .where(eq(oracleDeckProgress.userId, userId)).limit(1);
  return fresh[0]!;
}

/* ═══════════════════════════════════════════════════════
   ROUTER
   ═══════════════════════════════════════════════════════ */

export const oracleDeckRouter = router({
  /** Full progress + deck state for the client. */
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const row = await ensureProgressRow(db, ctx.user.id);
    return {
      progress: row,
      deckSize: ORACLE_DECK.length,
      ownedCount: row.ownedSlugs.length,
      dayNumber: currentDayNumber(),
      weekNumber: currentWeekNumber(),
    };
  }),

  /** Full deck with per-card owned status. */
  listCollection: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const row = await ensureProgressRow(db, ctx.user.id);
    const ownedSet = new Set(row.ownedSlugs);
    return ORACLE_DECK.map((card) => ({
      ...card,
      owned: ownedSet.has(card.slug),
    }));
  }),

  /** Grant a card into the player's collection. Idempotent. The
   *  caller (or server-side helper) is responsible for verifying
   *  the milestone was actually satisfied — this procedure trusts
   *  the call site. */
  claimCard: protectedProcedure
    .input(z.object({ slug: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const card = getOracleCardBySlug(input.slug);
      if (!card) throw new Error(`Unknown Oracle card slug: ${input.slug}`);

      const row = await ensureProgressRow(db, ctx.user.id);
      if (row.ownedSlugs.includes(input.slug)) {
        return { granted: false, alreadyOwned: true, card };
      }
      const newOwned = [...row.ownedSlugs, input.slug];
      await db.update(oracleDeckProgress)
        .set({
          ownedSlugs: newOwned,
          fnordUnlocked: row.fnordUnlocked || input.slug === "fnord",
        })
        .where(eq(oracleDeckProgress.userId, ctx.user.id));
      return { granted: true, alreadyOwned: false, card };
    }),

  /** Cast today's 1-card daily reading. Free. One per day. */
  castDaily: protectedProcedure.mutation(async ({ ctx }) => {
    const db = (await getDb())!;
    const row = await ensureProgressRow(db, ctx.user.id);
    const day = currentDayNumber();
    const seedKey = String(day);

    // If already cast today, return the cached reading.
    const cached = await db.select().from(oracleReadings)
      .where(and(
        eq(oracleReadings.userId, ctx.user.id),
        eq(oracleReadings.spreadKind, "daily"),
        eq(oracleReadings.seedKey, seedKey),
      )).limit(1);
    if (cached[0]) {
      return { reading: cached[0].draws as OracleReading, cached: true };
    }

    const reading = castReading({
      userId: ctx.user.id,
      spreadKind: "daily",
      seedKey,
      ownedSlugs: row.ownedSlugs,
      appliesAt: new Date().toISOString(),
    });

    try {
      await db.insert(oracleReadings).values({
        userId: ctx.user.id,
        spreadKind: "daily",
        seedKey,
        seed: reading.seed,
        draws: reading,
        appliesAt: new Date(reading.appliesAt),
        fallback: reading.fallback,
      });
    } catch (err) {
      logger.warn(`[OracleDeck] Race on daily insert for user ${ctx.user.id}: ${err}`);
    }
    await db.update(oracleDeckProgress)
      .set({ lastDailyDayNumber: day })
      .where(eq(oracleDeckProgress.userId, ctx.user.id));
    return { reading, cached: false };
  }),

  /** Cast a pre-match 3-card spread. Costs 1 Oracle charge. The
   *  seedKey is provided by the caller — typically the match id
   *  — so the same match always gets the same reading. */
  castPreMatch: protectedProcedure
    .input(z.object({ matchSeedKey: z.string().min(1).max(128) }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const row = await ensureProgressRow(db, ctx.user.id);
      if (row.charges < 1) {
        throw new Error("Not enough Oracle charges to cast a pre-match reading.");
      }

      // Check cache first — same match id = same reading.
      const cached = await db.select().from(oracleReadings)
        .where(and(
          eq(oracleReadings.userId, ctx.user.id),
          eq(oracleReadings.spreadKind, "pre_match"),
          eq(oracleReadings.seedKey, input.matchSeedKey),
        )).limit(1);
      if (cached[0]) {
        return { reading: cached[0].draws as OracleReading, cached: true, charges: row.charges };
      }

      const reading = castReading({
        userId: ctx.user.id,
        spreadKind: "pre_match",
        seedKey: input.matchSeedKey,
        ownedSlugs: row.ownedSlugs,
        appliesAt: new Date().toISOString(),
      });

      try {
        await db.insert(oracleReadings).values({
          userId: ctx.user.id,
          spreadKind: "pre_match",
          seedKey: input.matchSeedKey,
          seed: reading.seed,
          draws: reading,
          appliesAt: new Date(reading.appliesAt),
          fallback: reading.fallback,
        });
      } catch (err) {
        logger.warn(`[OracleDeck] Race on pre_match insert: ${err}`);
      }
      await db.update(oracleDeckProgress)
        .set({ charges: row.charges - 1 })
        .where(eq(oracleDeckProgress.userId, ctx.user.id));
      return { reading, cached: false, charges: row.charges - 1 };
    }),

  /** Cast the weekly 5-card spread. Costs 3 Oracle charges. One
   *  per week. */
  castWeekly: protectedProcedure.mutation(async ({ ctx }) => {
    const db = (await getDb())!;
    const row = await ensureProgressRow(db, ctx.user.id);
    const week = currentWeekNumber();
    if (row.lastWeeklyWeekNumber === week) {
      // Already cast this week — return cached.
      const cached = await db.select().from(oracleReadings)
        .where(and(
          eq(oracleReadings.userId, ctx.user.id),
          eq(oracleReadings.spreadKind, "weekly"),
          eq(oracleReadings.seedKey, String(week)),
        )).limit(1);
      if (cached[0]) {
        return { reading: cached[0].draws as OracleReading, cached: true, charges: row.charges };
      }
    }
    if (row.charges < 3) {
      throw new Error("Not enough Oracle charges for the weekly spread.");
    }

    const reading = castReading({
      userId: ctx.user.id,
      spreadKind: "weekly",
      seedKey: String(week),
      ownedSlugs: row.ownedSlugs,
      appliesAt: new Date().toISOString(),
    });

    try {
      await db.insert(oracleReadings).values({
        userId: ctx.user.id,
        spreadKind: "weekly",
        seedKey: String(week),
        seed: reading.seed,
        draws: reading,
        appliesAt: new Date(reading.appliesAt),
        fallback: reading.fallback,
      });
    } catch (err) {
      logger.warn(`[OracleDeck] Race on weekly insert: ${err}`);
    }
    await db.update(oracleDeckProgress)
      .set({ charges: row.charges - 3, lastWeeklyWeekNumber: week })
      .where(eq(oracleDeckProgress.userId, ctx.user.id));
    return { reading, cached: false, charges: row.charges - 3 };
  }),

  /** Get today's daily reading if one has been cast, else null.
   *  Pure read — does not cast the reading. Used by the client to
   *  display "Today's Reading" and by other routers to apply the
   *  reading's buff to quest rewards / match init. */
  getActiveDailyReading: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const day = currentDayNumber();
    const cached = await db.select().from(oracleReadings)
      .where(and(
        eq(oracleReadings.userId, ctx.user.id),
        eq(oracleReadings.spreadKind, "daily"),
        eq(oracleReadings.seedKey, String(day)),
      )).limit(1);
    if (!cached[0]) return null;
    return cached[0].draws as OracleReading;
  }),

  /** List the player's recent readings of a given kind. */
  listReadings: protectedProcedure
    .input(z.object({
      spreadKind: z.enum(["daily", "pre_match", "weekly"]).optional(),
      limit: z.number().int().min(1).max(50).default(10),
    }))
    .query(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const whereExpr = input.spreadKind
        ? and(
            eq(oracleReadings.userId, ctx.user.id),
            eq(oracleReadings.spreadKind, input.spreadKind),
          )
        : eq(oracleReadings.userId, ctx.user.id);
      const rows = await db.select().from(oracleReadings)
        .where(whereExpr)
        .orderBy(oracleReadings.castAt)
        .limit(input.limit);
      return rows.map((r) => ({
        id: r.id,
        spreadKind: r.spreadKind as OracleSpreadKind,
        seedKey: r.seedKey,
        reading: r.draws as OracleReading,
        castAt: r.castAt,
        appliesAt: r.appliesAt,
      }));
    }),
});

/** Server-side helper for other routers to grant Oracle charges
 *  when a milestone completes. Not exposed as a procedure — imported
 *  directly into routers that award progression rewards. */
export async function grantOracleCharges(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
  amount: number,
): Promise<void> {
  await ensureProgressRow(db, userId);
  await db.update(oracleDeckProgress)
    .set({ charges: (await db.select().from(oracleDeckProgress)
      .where(eq(oracleDeckProgress.userId, userId)).limit(1))[0]!.charges + amount })
    .where(eq(oracleDeckProgress.userId, userId));
}

/** Server-side helper — fetch the player's most recent daily
 *  reading for today. Returns the single drawn position (or
 *  null if no daily reading has been cast yet). Used by other
 *  routers to apply the daily buff to activities throughout
 *  the day. Pure read. */
export async function getActiveDailyOracleDraw(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
): Promise<{
  cardSlug: string;
  orientation: "upright" | "reversed";
  buff: { label: string; effect: { kind: string; [key: string]: any } };
} | null> {
  const day = currentDayNumber();
  const cached = await db.select().from(oracleReadings)
    .where(and(
      eq(oracleReadings.userId, userId),
      eq(oracleReadings.spreadKind, "daily"),
      eq(oracleReadings.seedKey, String(day)),
    )).limit(1);
  if (!cached[0]) return null;
  const reading = cached[0].draws as OracleReading;
  const draw = reading.draws[0];
  if (!draw) return null;
  return {
    cardSlug: draw.cardSlug,
    orientation: draw.orientation,
    buff: draw.buff as any,
  };
}

/** Server-side helper — apply the active daily reading's
 *  dream-token bonus to a reward payout. Returns the adjusted
 *  amount and a label for the client toast. A no-op when the
 *  player has not cast today's reading or the active card's
 *  buff effect isn't a dream_token_bonus. */
export async function applyDailyOracleBonusToReward(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
  baseAmount: number,
): Promise<{
  adjustedAmount: number;
  oracleLabel: string | null;
  oraclePercent: number;
}> {
  if (baseAmount <= 0) {
    return { adjustedAmount: baseAmount, oracleLabel: null, oraclePercent: 0 };
  }
  const draw = await getActiveDailyOracleDraw(db, userId);
  if (!draw) {
    return { adjustedAmount: baseAmount, oracleLabel: null, oraclePercent: 0 };
  }
  const effect = draw.buff.effect;
  if (effect.kind !== "dream_token_bonus") {
    return { adjustedAmount: baseAmount, oracleLabel: null, oraclePercent: 0 };
  }
  const percent = typeof effect.percent === "number" ? effect.percent : 0;
  if (percent <= 0) {
    return { adjustedAmount: baseAmount, oracleLabel: null, oraclePercent: 0 };
  }
  const bonus = Math.round(baseAmount * (percent / 100));
  return {
    adjustedAmount: baseAmount + bonus,
    oracleLabel: `Oracle Reading: ${draw.cardSlug} (${draw.orientation}) +${percent}%`,
    oraclePercent: percent,
  };
}

/** Server-side helper to grant an Oracle card. Called by any
 *  game-mode router when a milestone completes. Returns true iff
 *  the card was newly granted. */
export async function grantOracleCard(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
  slug: string,
): Promise<boolean> {
  const card = getOracleCardBySlug(slug);
  if (!card) return false;
  const row = await ensureProgressRow(db, userId);
  if (row.ownedSlugs.includes(slug)) return false;
  await db.update(oracleDeckProgress)
    .set({
      ownedSlugs: [...row.ownedSlugs, slug],
      fnordUnlocked: row.fnordUnlocked || slug === "fnord",
    })
    .where(eq(oracleDeckProgress.userId, userId));
  return true;
}
