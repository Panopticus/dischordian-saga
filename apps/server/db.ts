import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { InsertUser, users } from "../db/schema";
import { ENV } from './_core/env';

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
      const normalized = value ?? null;
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
