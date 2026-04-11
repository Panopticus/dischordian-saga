/* ═══════════════════════════════════════════════════════
   EVENT WINDOW MIDDLEWARE

   Gates tRPC procedures to a specific event date range.
   Admins can override the window via the
   `xmas_july_testing` feature flag — useful for QA
   walkthroughs outside the July 1-14 window.
   ═══════════════════════════════════════════════════════ */
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { featureFlags } from "../../db/schema";
import { eq } from "drizzle-orm";

async function isTestingFlagEnabled(): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const [flag] = await db
    .select()
    .from(featureFlags)
    .where(eq(featureFlags.featureName, "xmas_july_testing"))
    .limit(1);
  return Boolean(flag?.enabled);
}

/**
 * Middleware that throws FORBIDDEN if the server clock is outside
 * the event window AND the testing override flag is not set.
 */
export function checkEventWindow(opts: { start: string; end: string; name: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- tRPC middleware next is intentionally loose
  return async (opts2: { next: Function; ctx: unknown }) => {
    const now = Date.now();
    const start = new Date(opts.start).getTime();
    const end = new Date(opts.end).getTime();
    if (now < start || now > end) {
      const testing = await isTestingFlagEnabled();
      if (!testing) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `${opts.name} is not currently active. Window: ${opts.start} → ${opts.end}`,
        });
      }
    }
    return opts2.next();
  };
}

export const CHRISTMAS_IN_JULY_WINDOW = {
  start: "2026-07-01T00:00:00Z",
  end: "2026-07-14T23:59:59Z",
  name: "Christmas in July",
} as const;
