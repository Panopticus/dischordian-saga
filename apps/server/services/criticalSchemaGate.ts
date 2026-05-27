/* ═══════════════════════════════════════════════════════
   CRITICAL SCHEMA GATE

   Belt-and-braces guard that runs BEFORE `server.listen()` and
   probes information_schema for a curated set of query-critical
   table/column shapes. On a missing shape it logs FATAL and exits
   non-zero so the deploy fails LOUDLY instead of serving a broken
   schema.

   Post-0071_baseline_v1 cutover this gate is no longer the safety
   net for fire-and-forget bootstrap* IIFEs (those are gone). Its
   value now is catching the case where db:migrate succeeded but
   the resulting schema doesn't match what the application expects
   — a corrupted prod DB, a wrong DATABASE_URL pointed at an
   un-migrated environment, a partially-applied migration that
   somehow committed its journal row. Cheap insurance.

   Scope is deliberately the curated critical set: tables/columns
   whose absence 500s every query against that table. Less-critical
   shapes degrade a single feature and shouldn't block boot.
   Extend CRITICAL_PROBES when a new query-critical schema shape
   lands.
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
    why: "citizen.getCharacter 500s without it → player stuck at cryo bay",
  },
  {
    table: "processed_webhook_events",
    why: "Stripe webhook idempotency table — absent ⇒ retried webhook double-fulfills currency",
  },
  {
    table: "battle_pass_progress",
    column: "dailyXpLedger",
    why: "every battle_pass_progress SELECT 500s without it (daily-cap ledger)",
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
 * Probe the curated critical schema shapes. On any missing shape:
 * FATAL log + process.exit(1).
 *
 * No-ops when there is no DB (local/dev without DATABASE_URL) or in
 * the test env.
 */
export async function ensureCriticalSchemaOrExit(): Promise<void> {
  if (process.env.NODE_ENV === "test") return;
  const { getDb } = await import("../db");
  const db = await getDb();
  if (!db) return;

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
        "FATAL: critical schema shape missing.\n" +
        "Refusing to serve requests against a broken schema " +
        "(every query against these tables would 500).\n" +
        "The 0071_baseline_v1 migration creates these shapes; if " +
        "they're missing here, db:migrate may not have applied " +
        "against this DB.\n" +
        missing.map((m) => "  - " + m).join("\n") +
        "\n══════════════════════════════════════════════════════\n",
    );
    // Loud, non-zero exit so the deploy fails visibly (Railway marks
    // the release failed + retries) instead of silently serving a
    // broken schema with one lost log line.
    process.exit(1);
  }

  console.log(
    `[CriticalSchemaGate] OK — ${CRITICAL_PROBES.length} critical schema shapes present.`,
  );
}
