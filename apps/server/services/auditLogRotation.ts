/* ═══════════════════════════════════════════════════════
   AUDIT LOG ROTATION

   Runs daily (via setInterval in _core/index.ts) to delete
   admin_audit_log rows older than AUDIT_LOG_TTL_DAYS. Keeps
   the table bounded on long-running servers with frequent
   admin activity. Fire-and-forget — errors are logged but
   never throw so startup is never blocked.
   ═══════════════════════════════════════════════════════ */
import { getDb } from "../db";
import { adminAuditLog } from "../../db/schema";
import { lt } from "drizzle-orm";

/** Audit entries older than this are eligible for rotation.
 *  Set to 90 days — a balance between compliance retention
 *  and table size. Override via env if ops need more history. */
export const AUDIT_LOG_TTL_DAYS = Number(process.env.AUDIT_LOG_TTL_DAYS ?? 90);

/** Delete audit log entries older than the TTL. Returns the
 *  number of rows removed (best-effort; 0 on any failure). */
export async function rotateAuditLog(): Promise<{ pruned: number }> {
  try {
    const db = await getDb();
    if (!db) return { pruned: 0 };
    const cutoff = new Date(Date.now() - AUDIT_LOG_TTL_DAYS * 24 * 60 * 60 * 1000);
    const result = await db
      .delete(adminAuditLog)
      .where(lt(adminAuditLog.createdAt, cutoff));
    const pruned = (result as unknown as { affectedRows?: number }).affectedRows ?? 0;
    return { pruned };
  } catch (err) {
    console.error("[AuditLogRotation] failed:", err);
    return { pruned: 0 };
  }
}
