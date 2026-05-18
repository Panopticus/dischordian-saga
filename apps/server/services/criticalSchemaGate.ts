/* ═══════════════════════════════════════════════════════
   CRITICAL SCHEMA GATE (Persistence F5 / F6)

   The audit found two coupled defects in the
   schema-compensating bootstrap scheme:

     F5 — the ~30 `bootstrapX()` calls are fire-and-forget and the
          whole cluster runs AFTER `server.listen()`. Requests in
          the boot window hit not-yet-migrated schema. Because
          Drizzle emits the full column list from schema.ts on
          every SELECT, a missing column doesn't degrade
          gracefully — it 500s every query against that table
          (e.g. `citizen.getCharacter` → player stuck at the cryo
          bay; `processed_webhook_events` absent → a retried Stripe
          webhook double-fulfills currency).

     F6 — every bootstrap swallows its own failure to a log line
          and the call sites `.catch(console.error)`. A bootstrap
          that genuinely fails (perms, DDL drift) produces NO
          startup failure, NO health failure — just one lost log
          line, and the environment then 500s every affected query
          indefinitely.

   This gate closes both for the schema-shape-critical bootstraps:
   it (1) joins their in-flight promises (they use the singleton
   pattern, so this is a real await, not a re-run) and then
   (2) authoritatively probes information_schema for the exact
   table/column shapes. If any are still missing it logs a FATAL
   and exits non-zero so the deploy fails LOUDLY instead of
   serving a broken schema. Called BEFORE `server.listen()`.

   Scope is deliberately the curated critical set (the two the
   audit named + the casino harm-reduction columns + the
   battle-pass daily-cap ledger). Data-seed / backfill bootstraps
   stay fire-and-forget: a missing seed degrades one feature, not
   every query, so it must not block boot. Extend CRITICAL_PROBES
   when a new query-critical column/table bootstrap lands.
   ═══════════════════════════════════════════════════════ */
import type { DrizzleDb } from "../db";

interface CriticalProbe {
  /** Real DB table name. */
  table: string;
  /** Column that must exist; omit to assert table existence only. */
  column?: string;
  /** Human note surfaced in the fatal message. */
  why: string;
}

export const CRITICAL_PROBES: ReadonlyArray<CriticalProbe> = [
  {
    table: "citizen_characters",
    column: "foundation",
    why: "citizen.getCharacter 500s without it → player stuck at cryo bay (audit F5)",
  },
  {
    table: "processed_webhook_events",
    why: "Stripe webhook idempotency table — absent ⇒ retried webhook double-fulfills currency (audit F5)",
  },
  {
    table: "battle_pass_progress",
    column: "dailyXpLedger",
    why: "every battle_pass_progress SELECT 500s without it (Balance F2 daily-cap ledger)",
  },
  {
    table: "casino_state",
    column: "dailyLost",
    why: "casino_state SELECTs 500 without the harm-reduction columns",
  },
];

async function tableOrColumnExists(
  db: DrizzleDb,
  probe: CriticalProbe,
): Promise<boolean> {
  const { sql } = await import("drizzle-orm");
  // Table/column names come only from the static CRITICAL_PROBES
  // list (no user input), so the inlined identifiers are safe.
  const query = probe.column
    ? "SELECT COUNT(*) AS c FROM information_schema.columns " +
      "WHERE table_schema = DATABASE() AND table_name = " +
      `'${probe.table}' AND column_name = '${probe.column}'`
    : "SELECT COUNT(*) AS c FROM information_schema.tables " +
      `WHERE table_schema = DATABASE() AND table_name = '${probe.table}'`;
  const r = (await db.execute(sql.raw(query))) as unknown as
    | [Array<{ c: number | string }>, unknown]
    | Array<{ c: number | string }>;
  const rows =
    Array.isArray(r) && Array.isArray(r[0])
      ? r[0]
      : (r as Array<{ c: number | string }>);
  return Number(rows?.[0]?.c ?? 0) > 0;
}

/**
 * Join the critical schema bootstraps and verify the resulting
 * shape. On any missing shape: FATAL log + process.exit(1).
 *
 * No-ops when there is no DB (local/dev without DATABASE_URL) or in
 * the test env — those never served the broken-schema window the
 * audit is about.
 */
export async function ensureCriticalSchemaOrExit(): Promise<void> {
  if (process.env.NODE_ENV === "test") return;
  const { getDb } = await import("../db");
  const db = await getDb();
  if (!db) return;

  // Join the in-flight critical bootstraps. Each uses the
  // module-singleton promise pattern, so calling it here returns the
  // SAME promise the fire-and-forget dispatch created — a real await,
  // not a second run.
  const [
    { bootstrapCitizenSchema },
    { bootstrapWebhookEventsTable },
    { bootstrapBattlePassLedger },
    { bootstrapCasinoHarmReductionColumns },
  ] = await Promise.all([
    import("./citizenSchemaBootstrap"),
    import("./webhookEventsBootstrap"),
    import("./battlePassLedgerBootstrap"),
    import("./casinoHarmReductionColumnsBootstrap"),
  ]);
  await Promise.allSettled([
    bootstrapCitizenSchema(),
    bootstrapWebhookEventsTable(),
    bootstrapBattlePassLedger(),
    bootstrapCasinoHarmReductionColumns(),
  ]);

  const missing: string[] = [];
  for (const probe of CRITICAL_PROBES) {
    let ok = false;
    try {
      ok = await tableOrColumnExists(db, probe);
    } catch (err) {
      ok = false;
      missing.push(
        `${probe.table}${probe.column ? "." + probe.column : ""} — probe errored: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      continue;
    }
    if (!ok) {
      missing.push(
        `${probe.table}${probe.column ? "." + probe.column : ""} — ${probe.why}`,
      );
    }
  }

  if (missing.length > 0) {
    console.error(
      "\n══════════════════════════════════════════════════════\n" +
        "FATAL: critical schema bootstrap did not converge.\n" +
        "Refusing to serve requests against a broken schema " +
        "(every query against these tables would 500).\n" +
        missing.map((m) => "  - " + m).join("\n") +
        "\n══════════════════════════════════════════════════════\n",
    );
    // Loud, non-zero exit so the deploy fails visibly (Railway marks
    // the release failed + retries) instead of silently serving a
    // broken schema with one lost log line. This IS the F6 fix.
    process.exit(1);
  }

  console.log(
    `[CriticalSchemaGate] OK — ${CRITICAL_PROBES.length} critical schema shapes present.`,
  );
}
