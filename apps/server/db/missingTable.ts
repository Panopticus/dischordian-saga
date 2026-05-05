/* ═══════════════════════════════════════════════════════
   MISSING-TABLE TOLERANCE

   When a service queries a table that drizzle-kit hasn't yet
   migrated, MySQL throws ER_NO_SUCH_TABLE (errno 1146). The
   right behaviour for bootstrap and poller code is to detect
   that specific error, log it once at a friendly level, and
   degrade gracefully — not spam every poll cycle as if the
   DB were on fire.

   This module exposes a single predicate, `isMissingTableError`,
   that the affected services use to decide whether the failure
   is "DB needs migration" (info-level, one-shot) vs. genuine
   query breakage (warn/error-level, keep alerting).

   Drizzle wraps the underlying mysql2 error, so we have to peel
   one layer of `.cause` to read the real fields.
   ═══════════════════════════════════════════════════════ */

interface MysqlLikeError {
  code?: string;
  errno?: number;
  sqlMessage?: string;
  message?: string;
  cause?: unknown;
}

/**
 * True iff the given error is the MySQL "table doesn't exist"
 * error (errno 1146 / code ER_NO_SUCH_TABLE / SQLSTATE 42S02).
 * Tolerates drizzle's DrizzleQueryError wrapper which exposes
 * the real cause via `.cause`.
 */
export function isMissingTableError(err: unknown): boolean {
  if (err == null) return false;
  const candidates: MysqlLikeError[] = [];
  let cur: unknown = err;
  for (let i = 0; i < 4 && cur != null; i++) {
    if (typeof cur === "object") {
      candidates.push(cur as MysqlLikeError);
      cur = (cur as MysqlLikeError).cause;
    } else {
      break;
    }
  }
  for (const c of candidates) {
    if (c.code === "ER_NO_SUCH_TABLE") return true;
    if (c.errno === 1146) return true;
    const msg = c.sqlMessage ?? c.message ?? "";
    if (typeof msg === "string" && msg.includes("doesn't exist")) {
      return true;
    }
  }
  return false;
}
