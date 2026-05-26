/**
 * mark-baseline-applied — DBA runbook for Step 3 of the 0071_baseline_v1
 * cutover described in apps/db/migrations/README.md.
 *
 * What this does:
 *   Records the baseline migration as already-applied against an
 *   existing prod/staging DB whose schema was built up incrementally
 *   via `db:push` over time. The schema is already past the baseline's
 *   final state, so applying the SQL would error (CREATE TABLE on
 *   tables that already exist). Inserting the hash into
 *   __drizzle_migrations tells drizzle "this migration is done" so the
 *   next `pnpm db:migrate:prod` is a no-op.
 *
 * What this does NOT do:
 *   - Run any DDL. The baseline .sql is not executed; only the
 *     migrations-tracking row is inserted.
 *   - Touch any non-baseline tables. Idempotent: re-running after the
 *     insert is a no-op (skips on duplicate hash).
 *
 * Per-environment runbook:
 *   1. Take a backup. (`mysqldump` to durable storage, even though
 *      this script is read-mostly.)
 *   2. Run against staging first, verify, then promote to prod.
 *   3. After this script runs, set NODE_ENV=production and run
 *      `pnpm db:migrate:prod` once — it should be a clean no-op.
 *   4. Restart the server. Cold-boot still runs the bootstrap* IIFEs
 *      (idempotent CREATE TABLE IF NOT EXISTS), which will all
 *      no-op against the already-populated schema.
 *
 * Run:
 *   DATABASE_URL=mysql://user:pw@host:3306/dischordian_prod \
 *     pnpm tsx scripts/mark-baseline-applied.ts
 *
 *   # dry-run (prints the SQL it would execute, doesn't connect):
 *   pnpm tsx scripts/mark-baseline-applied.ts --dry-run
 */
import * as fs from "fs";
import * as path from "path";
import { createHash } from "crypto";
import mysql from "mysql2/promise";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const BASELINE_SQL = path.join(REPO_ROOT, "apps/db/0071_baseline_v1.sql");
const TAG = "0071_baseline_v1";

function step(label: string, fn: () => void | Promise<void>) {
  console.log(`\n──── ${label} ────`);
  return Promise.resolve(fn());
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const url = process.env.DATABASE_URL;
  if (!url && !dryRun) {
    console.error("Missing DATABASE_URL. Pass it explicitly, or use --dry-run.");
    process.exit(2);
  }

  const sql = fs.readFileSync(BASELINE_SQL, "utf8");
  const hash = createHash("sha256").update(sql).digest("hex");
  const createdAt = Date.now();

  console.log(`Baseline: ${TAG}`);
  console.log(`Hash:     ${hash}`);
  console.log(`SQL size: ${sql.length} bytes`);

  const insertSql =
    "INSERT INTO __drizzle_migrations (hash, created_at) " +
    `VALUES ('${hash}', ${createdAt})`;

  if (dryRun) {
    console.log("\nDry-run — would execute against DATABASE_URL:\n");
    console.log("  " + insertSql + ";");
    console.log("\n(No connection attempted.)");
    return;
  }

  const u = new URL(url!);
  const dbName = u.pathname.replace(/^\//, "");
  console.log(`\nTarget:   ${u.hostname}:${u.port || 3306}/${dbName}`);
  console.log(`User:     ${decodeURIComponent(u.username)}`);

  const conn = await mysql.createConnection({
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: dbName,
    multipleStatements: false,
  });

  try {
    await step("1. Ensure __drizzle_migrations table exists", async () => {
      // drizzle's own bootstrap creates this on first migrate; we
      // recreate the canonical shape here so this script works even
      // if the env has never had db:migrate run against it.
      await conn.execute(
        "CREATE TABLE IF NOT EXISTS `__drizzle_migrations` (" +
          "  `id` SERIAL PRIMARY KEY," +
          "  `hash` text NOT NULL," +
          "  `created_at` bigint" +
          ")",
      );
    });

    await step("2. Check whether baseline is already marked", async () => {
      const [rows] = await conn.execute<mysql.RowDataPacket[]>(
        "SELECT id, created_at FROM `__drizzle_migrations` WHERE hash = ?",
        [hash],
      );
      if (rows.length > 0) {
        console.log(
          `Already marked: id=${rows[0].id} created_at=${rows[0].created_at}. ` +
            "Nothing to do.",
        );
        process.exit(0);
      }
    });

    await step("3. Insert mark-applied row", async () => {
      const [result] = await conn.execute<mysql.ResultSetHeader>(
        "INSERT INTO `__drizzle_migrations` (hash, created_at) VALUES (?, ?)",
        [hash, createdAt],
      );
      console.log(`Inserted row id=${result.insertId}`);
    });

    await step("4. Verify", async () => {
      const [rows] = await conn.execute<mysql.RowDataPacket[]>(
        "SELECT id, hash, created_at FROM `__drizzle_migrations` ORDER BY id",
      );
      for (const row of rows) {
        const tag = row.hash === hash ? TAG : "(other)";
        console.log(
          `  id=${row.id}  ${String(row.hash).slice(0, 16)}…  ${tag}`,
        );
      }
    });
  } finally {
    await conn.end();
  }

  console.log(
    "\nDone. Next: run `NODE_ENV=production pnpm db:migrate:prod` against " +
      "this DB — it should report 0 migrations applied (already up to date).",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
