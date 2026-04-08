/* ═══════════════════════════════════════════════════════
   FEATURE FLAG MIDDLEWARE — Gate endpoints by feature flag

   Usage in any router:
     import { checkFeatureFlag } from "../middleware/featureFlag";

     myEndpoint: protectedProcedure
       .use(checkFeatureFlag("casino"))
       .query(async () => { ... })
   ═══════════════════════════════════════════════════════ */
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { featureFlags } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/** Cache feature flag states for 60 seconds to avoid per-request DB hits */
const cache = new Map<string, { enabled: boolean; cachedAt: number }>();
const CACHE_TTL = 60_000;

async function isFeatureEnabled(featureName: string): Promise<boolean> {
  const cached = cache.get(featureName);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
    return cached.enabled;
  }

  const db = await getDb();
  if (!db) return true; // If DB is unavailable, default to enabled

  const [flag] = await db.select().from(featureFlags)
    .where(eq(featureFlags.featureName, featureName))
    .limit(1);

  // If flag doesn't exist in DB, treat as enabled
  const enabled = flag ? flag.enabled === 1 : true;
  cache.set(featureName, { enabled, cachedAt: Date.now() });
  return enabled;
}

/** Invalidate a single flag's cache (call after admin toggle) */
export function invalidateFeatureFlagCache(featureName?: string) {
  if (featureName) {
    cache.delete(featureName);
  } else {
    cache.clear();
  }
}

/**
 * tRPC middleware factory — returns 403 if the feature is disabled.
 *
 * Usage: `.use(checkFeatureFlag("casino"))`
 */
export function checkFeatureFlag(featureName: string) {
  return async (opts: { next: Function; ctx: any }) => {
    const enabled = await isFeatureEnabled(featureName);
    if (!enabled) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Feature "${featureName}" is currently disabled.`,
      });
    }
    return opts.next();
  };
}
