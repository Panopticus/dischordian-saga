/* ═══════════════════════════════════════════════════════
   ANALYTICS ROUTER — Privacy-first player analytics
   Receives batched events, stores in DB, provides admin
   dashboard queries. No PII stored — only user IDs and
   event data.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { analyticsEvents } from "../../db/schema";
import { eq, sql, and, gte, lte, desc, count } from "drizzle-orm";

// ─── Validation schemas ────────────────────────────────

const analyticsEventSchema = z.object({
  event: z.string().max(128),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  timestamp: z.number(),
  sessionId: z.string().max(64),
});

const MAX_EVENTS_PER_BATCH = 100;

// Admin guard
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const analyticsRouter = router({
  // ═══ INGEST — Receive batched events from the client ═══
  ingest: protectedProcedure
    .input(
      z.object({
        events: z
          .array(analyticsEventSchema)
          .max(MAX_EVENTS_PER_BATCH, `Maximum ${MAX_EVENTS_PER_BATCH} events per batch`),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { accepted: 0 };

      const rows = input.events.map((evt) => ({
        userId: ctx.user.id,
        event: evt.event,
        properties: evt.properties ?? {},
        sessionId: evt.sessionId,
        clientTimestamp: new Date(evt.timestamp),
      }));

      if (rows.length > 0) {
        await db.insert(analyticsEvents).values(rows);
      }

      return { accepted: rows.length };
    }),

  // ═══ ADMIN DASHBOARD QUERIES ═══

  /** Daily active users over a date range */
  dailyActiveUsers: adminProcedure
    .input(
      z.object({
        startDate: z.string(), // ISO date string e.g. "2026-04-01"
        endDate: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const rows = await db
        .select({
          date: sql<string>`DATE(${analyticsEvents.createdAt})`.as("date"),
          activeUsers: sql<number>`COUNT(DISTINCT ${analyticsEvents.userId})`.as("activeUsers"),
        })
        .from(analyticsEvents)
        .where(
          and(
            gte(analyticsEvents.createdAt, new Date(input.startDate)),
            lte(analyticsEvents.createdAt, new Date(input.endDate)),
          ),
        )
        .groupBy(sql`DATE(${analyticsEvents.createdAt})`)
        .orderBy(sql`DATE(${analyticsEvents.createdAt})`);

      return rows;
    }),

  /** Retention: users who returned N days after first session */
  retention: adminProcedure
    .input(
      z.object({
        cohortDate: z.string(), // ISO date for cohort
        days: z.number().min(1).max(30).default(7),
      }),
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const results: Array<{ day: number; retainedUsers: number }> = [];

      for (let d = 1; d <= input.days; d++) {
        const [row] = await db
          .select({
            retainedUsers: sql<number>`COUNT(DISTINCT ${analyticsEvents.userId})`.as(
              "retainedUsers",
            ),
          })
          .from(analyticsEvents)
          .where(
            and(
              sql`${analyticsEvents.userId} IN (
                SELECT DISTINCT ${analyticsEvents.userId}
                FROM ${analyticsEvents}
                WHERE DATE(${analyticsEvents.createdAt}) = ${input.cohortDate}
              )`,
              sql`DATE(${analyticsEvents.createdAt}) = DATE_ADD(${input.cohortDate}, INTERVAL ${d} DAY)`,
            ),
          );

        results.push({ day: d, retainedUsers: Number(row?.retainedUsers ?? 0) });
      }

      return results;
    }),

  /** Funnel completion rates for a given funnel sequence */
  funnelCompletion: adminProcedure
    .input(
      z.object({
        events: z.array(z.string()).min(2).max(10),
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const steps: Array<{ step: string; users: number; dropoff: number }> = [];

      for (let i = 0; i < input.events.length; i++) {
        const eventName = input.events[i];
        const [row] = await db
          .select({
            users: sql<number>`COUNT(DISTINCT ${analyticsEvents.userId})`.as("users"),
          })
          .from(analyticsEvents)
          .where(
            and(
              eq(analyticsEvents.event, eventName),
              gte(analyticsEvents.createdAt, new Date(input.startDate)),
              lte(analyticsEvents.createdAt, new Date(input.endDate)),
            ),
          );

        const userCount = Number(row?.users ?? 0);
        const prevCount = i > 0 ? steps[i - 1].users : userCount;
        const dropoff = prevCount > 0 ? Math.round((1 - userCount / prevCount) * 100) : 0;

        steps.push({ step: eventName, users: userCount, dropoff });
      }

      return steps;
    }),

  /** Top events by frequency */
  topEvents: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input.startDate) {
        conditions.push(gte(analyticsEvents.createdAt, new Date(input.startDate)));
      }
      if (input.endDate) {
        conditions.push(lte(analyticsEvents.createdAt, new Date(input.endDate)));
      }

      const rows = await db
        .select({
          event: analyticsEvents.event,
          count: sql<number>`COUNT(*)`.as("count"),
          uniqueUsers: sql<number>`COUNT(DISTINCT ${analyticsEvents.userId})`.as("uniqueUsers"),
        })
        .from(analyticsEvents)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .groupBy(analyticsEvents.event)
        .orderBy(desc(sql`COUNT(*)`))
        .limit(input.limit);

      return rows;
    }),

  /** Current in-memory search rate-limit buckets. Populated by the
   *  rippleEngine `search_rate_limited` handler whenever a user
   *  trips a token bucket on any searchable endpoint (e.g.
   *  `christmasInJuly.searchGiftRecipients`). Admin-only.
   *
   *  NOTE(ci-green): rate-limit tracking is not yet implemented in
   *  rippleEngine — the previous dynamic import of
   *  `getSearchRateLimitCounts` referenced a phantom export. When the
   *  `search_rate_limited` ripple handler starts populating in-memory
   *  buckets, restore the import and return the counts here. Until
   *  then, return an empty shape so the admin UI can render gracefully
   *  and the endpoint stays visible as a placeholder. */
  searchRateLimitBuckets: adminProcedure.query(async () => {
    return { buckets: [] as Array<{ endpoint: string; count: number }> };
  }),
});
