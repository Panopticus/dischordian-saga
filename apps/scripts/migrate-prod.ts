/**
 * Production migration runner — idempotent wrapper around drizzle-kit's
 * migration model.
 *
 * Why this exists: the Railway deploy's `startCommand` runs migrations
 * on every boot (see `railway.toml`). Plain `drizzle-kit migrate` crashes
 * the container when it re-attempts a migration whose schema objects
 * already exist in prod (e.g. `admin_approval_requests` was created
 * out-of-band and never recorded in `__drizzle_migrations`). That causes
 * a crash-loop Railway can't recover from.
 *
 * This script mirrors drizzle's migration behavior (read `_journal.json`,
 * hash each SQL file, compare against `__drizzle_migrations`, apply
 * missing ones) but treats MySQL "already exists" errors as a successful
 * skip and still records the hash so subsequent boots are fast.
 *
 * Run: tsx apps/scripts/migrate-prod.ts
 *   Requires: DATABASE_URL
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import mysql from "mysql2/promise";

const MIGRATIONS_DIR = "apps/db";
const JOURNAL_PATH = join(MIGRATIONS_DIR, "meta", "_journal.json");

// MySQL error codes that mean "this schema object already exists" — safe
// to treat as a no-op when re-running a migration that was partially or
// fully applied out-of-band.
const IDEMPOTENT_ERRORS = new Set([
  "ER_TABLE_EXISTS_ERROR", // CREATE TABLE — table already exists
  "ER_DUP_FIELDNAME", // ALTER TABLE ADD COLUMN — column already exists
  "ER_DUP_KEYNAME", // CREATE INDEX — index already exists
  "ER_DUP_KEY", // CREATE UNIQUE INDEX — duplicate key
  "ER_DUP_ENTRY", // INSERT seed data — row already exists
]);

interface JournalEntry {
  idx: number;
  version: string;
  when: number;
  tag: string;
  breakpoints: boolean;
}

interface Journal {
  version: string;
  dialect: string;
  entries: JournalEntry[];
}

function loadJournal(): Journal {
  const raw = readFileSync(JOURNAL_PATH, "utf8");
  return JSON.parse(raw) as Journal;
}

// Drizzle-kit hashes the SQL by splitting on its breakpoint delimiter,
// trimming each piece, and SHA-256'ing the concatenation. For
// hand-written files without breakpoints this is just sha256(trim(file)).
function hashSql(sql: string): string {
  const joined = sql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .join("");
  return createHash("sha256").update(joined).digest("hex");
}

// Split a migration file into individually-executable statements so we
// can apply idempotent-error handling per-statement (a single CREATE
// TABLE failing must not mask a later CREATE INDEX that needs to run).
function splitStatements(sql: string): string[] {
  if (sql.includes("--> statement-breakpoint")) {
    return sql
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  // Hand-written file — strip `-- line comments`, then split on `;`.
  const stripped = sql
    .split("\n")
    .map((line) => {
      const idx = line.indexOf("--");
      return idx >= 0 ? line.slice(0, idx) : line;
    })
    .join("\n");
  return stripped
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function ensureMigrationsTable(conn: mysql.Connection): Promise<void> {
  await conn.query(
    "CREATE TABLE IF NOT EXISTS `__drizzle_migrations` (" +
      "`id` SERIAL PRIMARY KEY," +
      "`hash` TEXT NOT NULL," +
      "`created_at` BIGINT" +
      ")",
  );
}

async function getAppliedHashes(conn: mysql.Connection): Promise<Set<string>> {
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    "SELECT `hash` FROM `__drizzle_migrations`",
  );
  return new Set(rows.map((r) => String(r.hash)));
}

async function recordApplied(
  conn: mysql.Connection,
  hash: string,
  when: number,
): Promise<void> {
  await conn.query(
    "INSERT INTO `__drizzle_migrations` (`hash`, `created_at`) VALUES (?, ?)",
    [hash, when],
  );
}

async function applyMigration(
  conn: mysql.Connection,
  entry: JournalEntry,
  sql: string,
): Promise<void> {
  const statements = splitStatements(sql);
  for (const stmt of statements) {
    try {
      await conn.query(stmt);
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code ?? "";
      if (IDEMPOTENT_ERRORS.has(code)) {
        console.log(
          `[migrate] ${entry.tag}: skipping already-applied statement (${code})`,
        );
        continue;
      }
      throw err;
    }
  }
}

function listUnjournaledSqlFiles(journalTags: Set<string>): string[] {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql"));
  return files.filter((f) => !journalTags.has(f.replace(/\.sql$/, "")));
}

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }

  const conn = await mysql.createConnection({
    uri: url,
    multipleStatements: false,
  });

  try {
    await ensureMigrationsTable(conn);
    const journal = loadJournal();
    const applied = await getAppliedHashes(conn);

    const journalTags = new Set(journal.entries.map((e) => e.tag));
    const unjournaled = listUnjournaledSqlFiles(journalTags);
    if (unjournaled.length > 0) {
      console.warn(
        `[migrate] WARNING: ${unjournaled.length} .sql files on disk are not in _journal.json and will be skipped: ${unjournaled.join(", ")}`,
      );
    }

    let appliedCount = 0;
    let skippedCount = 0;

    for (const entry of journal.entries) {
      const sqlPath = join(MIGRATIONS_DIR, `${entry.tag}.sql`);
      const sql = readFileSync(sqlPath, "utf8");
      const hash = hashSql(sql);

      if (applied.has(hash)) {
        skippedCount += 1;
        continue;
      }

      console.log(`[migrate] applying ${entry.tag}`);
      await applyMigration(conn, entry, sql);
      await recordApplied(conn, hash, entry.when);
      appliedCount += 1;
    }

    console.log(
      `[migrate] done — applied ${appliedCount}, already-current ${skippedCount}`,
    );
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error("[migrate] failed:", err);
  process.exit(1);
});
