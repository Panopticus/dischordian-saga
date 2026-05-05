/**
 * RUM — Real-User Monitoring ingestion.
 *
 * The client posts Web Vitals (LCP/CLS/INP/TTFB) on pagehide. We
 * accept anonymous reports (no userId required), sanity-clamp the
 * values, and write to the existing `analytics_events` pipeline so
 * the dashboard query already in place can read them.
 *
 * Storage shape: `analytics_events` row with eventName="rum.<metric>"
 * and properties JSON of { value, pathname, sessionId, navType }.
 *
 * Public on purpose — we want to capture metrics from anonymous
 * visitors too.
 */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { analyticsEvents } from "../../db/schema";

const ALLOWED_METRICS = ["lcp", "cls", "inp", "ttfb"] as const;

// Sanity caps — defeat trivially-cooked numbers from spammers.
const MAX_VALUES: Record<typeof ALLOWED_METRICS[number], number> = {
  lcp: 60_000,   // ms
  cls: 100,      // unitless
  inp: 60_000,   // ms
  ttfb: 60_000,  // ms
};

export const rumRouter = router({
  webVitals: publicProcedure
    .input(z.object({
      metric: z.enum(ALLOWED_METRICS),
      value: z.number().finite().nonnegative(),
      pathname: z.string().max(256),
      sessionId: z.string().max(64),
      navType: z.string().max(32).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const max = MAX_VALUES[input.metric];
      const clampedValue = Math.min(input.value, max);
      const db = await getDb();
      if (!db) return { ok: true };
      try {
        // analyticsEvents.userId is notNull — anonymous visitors get
        // userId=0 as a sentinel so RUM data still flows.
        await db.insert(analyticsEvents).values({
          userId: ctx.user?.id ?? 0,
          event: `rum.${input.metric}`,
          properties: {
            value: clampedValue,
            pathname: input.pathname,
            navType: input.navType ?? "unknown",
          },
          sessionId: input.sessionId,
          clientTimestamp: new Date(),
        });
      } catch {/* best-effort */}
      return { ok: true };
    }),
});
