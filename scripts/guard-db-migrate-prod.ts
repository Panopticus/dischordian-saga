/**
 * audit/06.F5 — guard against `pnpm db:migrate:prod` outside of
 * production.
 *
 * `db:migrate:prod` and `db:migrate` are aliased today (both invoke
 * `drizzle-kit migrate`). That makes it easy to fat-finger a prod-
 * intent invocation against a staging or local DB and miss it. This
 * guard insists on NODE_ENV=production for the :prod variant.
 *
 * Operator can opt out with `DB_MIGRATE_PROD_FORCE=1` for explicit
 * staging-mirror runs.
 */
const env = process.env.NODE_ENV ?? "development";
const force = process.env.DB_MIGRATE_PROD_FORCE === "1";

if (env !== "production" && !force) {
  console.error(
    `[db:migrate:prod guard] refusing: NODE_ENV=${env} (expected "production")\n` +
      `Use \`pnpm db:migrate\` for non-prod environments, or set ` +
      `DB_MIGRATE_PROD_FORCE=1 if this is an intentional staging-mirror run.`,
  );
  process.exit(2);
}
