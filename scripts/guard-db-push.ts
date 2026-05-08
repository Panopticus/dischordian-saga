/**
 * audit/06.F5 — guard against `pnpm db:push` against a prod-shaped
 * DATABASE_URL.
 *
 * `db:push` bypasses the migration journal entirely; running it
 * against prod silently makes the schema "whatever main looked like
 * five minutes ago" without an auditable migration row. The guard
 * heuristic is conservative:
 *   - Block if NODE_ENV=production.
 *   - Block if DATABASE_URL host looks like a managed-DB hostname
 *     (railway.app, planetscale, neon.tech, supabase.co,
 *     amazonaws.com, gcp.cloud, azure).
 *
 * Operator can opt out with `DB_PUSH_FORCE=1` (e.g. for a one-off
 * staging schema reset where db:migrate is verified broken). The
 * env var name is intentionally awkward to discourage casual use.
 */
const url = process.env.DATABASE_URL ?? "";
const force = process.env.DB_PUSH_FORCE === "1";
const env = process.env.NODE_ENV ?? "development";

const MANAGED_HOSTS = [
  "railway.app",
  "rlwy.net",
  "planetscale",
  "neon.tech",
  "supabase.co",
  "amazonaws.com",
  "azure",
  "gcp.cloud",
  "googleapis.com",
];

function blocked(reason: string): never {
  console.error(
    `[db:push guard] refusing: ${reason}\n` +
      `If you genuinely need to push to this DB, set DB_PUSH_FORCE=1 ` +
      `(reads as: "I have read the migration-journal cutover plan in " +
       "apps/db/migrations/README.md and I am sure").`,
  );
  process.exit(2);
}

if (env === "production" && !force) {
  blocked("NODE_ENV=production");
}

if (url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (MANAGED_HOSTS.some((h) => host.includes(h)) && !force) {
      blocked(`DATABASE_URL host (${host}) looks like a managed cloud DB`);
    }
  } catch {
    /* malformed URL — drizzle-kit will reject anyway */
  }
}
