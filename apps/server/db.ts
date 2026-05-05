import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { InsertUser, users } from "../db/schema";
import { ENV } from './_core/env';
import { isReservedName, normalizeDisplayName } from "../shared/usernamePolicy";

/** ISO-week formatter ("2026-W18"). Cheap inline implementation
 *  matching MySQL DATE_FORMAT(_, '%x-W%v') semantics. */
function isoWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/** Re-usable type for the drizzle DB instance */
export type DrizzleDb = ReturnType<typeof drizzle>;

let _db: DrizzleDb | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb(): Promise<DrizzleDb | null> {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = createPool({
        uri: process.env.DATABASE_URL,
        connectionLimit: 20,
        waitForConnections: true,
        queueLimit: 0,
      });
      // pnpm hoists two distinct mysql2 Pool types (regular + promise).
      // drizzle accepts either at runtime but the nominal types don't
      // overlap at compile time, so we bridge through `unknown`.
      _db = drizzle(pool) as unknown as DrizzleDb;
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

const DB_RETRY_DEFAULT_ATTEMPTS = 4;
const DB_RETRY_BASE_DELAY_MS = 100;

/**
 * Wraps getDb() with bounded retry + exponential backoff for transient
 * pool-creation failures. Useful for routers that cannot tolerate a
 * brief DB unavailability at server start.
 *
 * Behaviour:
 *   - DATABASE_URL unset → returns getDb() once (null), no retry
 *   - DATABASE_URL set, db available → returns immediately on attempt 1
 *   - DATABASE_URL set, db null/throws → retries up to maxAttempts with
 *     delays of baseDelayMs * 2^(n-1)
 *   - All attempts exhausted → returns null (callers throw via their own
 *     "DB unavailable" helper)
 *
 * In production once the pool is initialised the cached `_db` returns
 * immediately on every call, so the retry only ever fires on the
 * cold-start window. resolveDb is injectable for unit testing.
 */
export async function getDbWithRetry(
  maxAttempts: number = DB_RETRY_DEFAULT_ATTEMPTS,
  baseDelayMs: number = DB_RETRY_BASE_DELAY_MS,
  resolveDb: () => Promise<DrizzleDb | null> = getDb,
): Promise<DrizzleDb | null> {
  // No DATABASE_URL means local-tooling mode; retrying would just stall
  // tests and CLI tools.
  if (!process.env.DATABASE_URL) {
    return resolveDb();
  }
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const db = await resolveDb();
      if (db) return db;
    } catch (err) {
      lastErr = err;
    }
    if (attempt < maxAttempts) {
      const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
  }
  if (lastErr) {
    console.warn("[Database] All retry attempts exhausted:", lastErr);
  }
  return null;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      let normalized: string | null = value ?? null;
      if (field === "name" && normalized) {
        // NFKC-normalise + strip zero-widths to defeat lookalike
        // username impersonation. If the OAuth-supplied name collides
        // with a reserved name (admin/mod/etc.) under homoglyph
        // collapse, suffix it with a random tag rather than rejecting
        // the whole upsert — OAuth onboarding must not fail because
        // a Google profile happens to be named "Admin".
        normalized = normalizeDisplayName(normalized);
        if (isReservedName(normalized)) {
          const suffix = Math.floor(Math.random() * 9000 + 1000);
          normalized = `${normalized}_${suffix}`;
        }
      }
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    // G27 — set signupWeek on first insert. ON DUPLICATE KEY UPDATE
    // keeps the original value, so existing accounts don't get
    // re-stamped with the current week. installSource and abVariant
    // are populated by the OAuth callback when present (referrer +
    // UTM resolution); upsertUser doesn't have access to those.
    const now = values.lastSignedIn ?? new Date();
    values.signupWeek = isoWeek(now);

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}
