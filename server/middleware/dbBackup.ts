/* ═══════════════════════════════════════════════════════
   AUTOMATED DATABASE BACKUP SYSTEM
   Runs mysqldump on a configurable schedule, stores
   backups locally with rotation. Optionally uploads
   to S3-compatible storage.

   Env vars:
     DB_BACKUP_ENABLED=true        — Enable automated backups
     DB_BACKUP_INTERVAL_HOURS=24   — Backup frequency (default: 24h)
     DB_BACKUP_RETENTION_DAYS=7    — Keep backups for N days
     DB_BACKUP_DIR=./backups       — Local backup directory
     S3_BACKUP_BUCKET              — (Optional) S3 bucket for offsite copies
   ═══════════════════════════════════════════════════════ */

import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

interface BackupConfig {
  enabled: boolean;
  intervalHours: number;
  retentionDays: number;
  backupDir: string;
  databaseUrl: string;
}

let backupTimer: ReturnType<typeof setInterval> | null = null;
let lastBackupTime: Date | null = null;
let lastBackupStatus: "success" | "failed" | "never" = "never";
let lastBackupError: string | null = null;

function getConfig(): BackupConfig {
  return {
    enabled: process.env.DB_BACKUP_ENABLED === "true",
    intervalHours: parseInt(process.env.DB_BACKUP_INTERVAL_HOURS || "24"),
    retentionDays: parseInt(process.env.DB_BACKUP_RETENTION_DAYS || "7"),
    backupDir: process.env.DB_BACKUP_DIR || "./backups",
    databaseUrl: process.env.DATABASE_URL || "",
  };
}

/** Parse DATABASE_URL into mysqldump arguments */
function parseDatabaseUrl(url: string): { host: string; port: string; user: string; password: string; database: string } | null {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port || "3306",
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, ""),
    };
  } catch {
    return null;
  }
}

/** Run a single backup */
export async function runBackup(): Promise<{ success: boolean; file?: string; error?: string }> {
  const config = getConfig();
  if (!config.databaseUrl) {
    return { success: false, error: "DATABASE_URL not configured" };
  }

  const dbInfo = parseDatabaseUrl(config.databaseUrl);
  if (!dbInfo) {
    return { success: false, error: "Failed to parse DATABASE_URL" };
  }

  // Ensure backup directory exists
  const backupDir = path.resolve(config.backupDir);
  await fs.promises.mkdir(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `backup-${dbInfo.database}-${timestamp}.sql.gz`;
  const filepath = path.join(backupDir, filename);

  try {
    // Run mysqldump and pipe through gzip
    const cmd = `mysqldump --host=${dbInfo.host} --port=${dbInfo.port} --user=${dbInfo.user} --password='${dbInfo.password}' --single-transaction --routines --triggers ${dbInfo.database} | gzip > ${filepath}`;
    await execAsync(cmd, { timeout: 300_000 }); // 5 minute timeout

    lastBackupTime = new Date();
    lastBackupStatus = "success";
    lastBackupError = null;
    console.log(`[Backup] Success: ${filename}`);

    // Cleanup old backups
    await cleanupOldBackups(backupDir, config.retentionDays);

    return { success: true, file: filename };
  } catch (err: any) {
    lastBackupStatus = "failed";
    lastBackupError = err.message;
    console.error(`[Backup] Failed:`, err.message);
    return { success: false, error: err.message };
  }
}

/** Remove backups older than retentionDays */
async function cleanupOldBackups(dir: string, retentionDays: number) {
  try {
    const files = await fs.promises.readdir(dir);
    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

    for (const file of files) {
      if (!file.startsWith("backup-")) continue;
      const filepath = path.join(dir, file);
      const stat = await fs.promises.stat(filepath);
      if (stat.mtimeMs < cutoff) {
        await fs.promises.unlink(filepath);
        console.log(`[Backup] Cleaned up old backup: ${file}`);
      }
    }
  } catch (err) {
    console.warn("[Backup] Cleanup error:", err);
  }
}

/** Start the automated backup scheduler */
export function startBackupScheduler(): void {
  const config = getConfig();
  if (!config.enabled) {
    console.log("[Backup] Automated backups disabled (set DB_BACKUP_ENABLED=true to enable)");
    return;
  }

  const intervalMs = config.intervalHours * 60 * 60 * 1000;
  console.log(`[Backup] Scheduler started — every ${config.intervalHours}h, retaining ${config.retentionDays} days`);

  // Run first backup after a short delay (don't block startup)
  setTimeout(() => runBackup(), 30_000);

  // Schedule recurring backups
  backupTimer = setInterval(() => runBackup(), intervalMs);
}

/** Stop the backup scheduler */
export function stopBackupScheduler(): void {
  if (backupTimer) {
    clearInterval(backupTimer);
    backupTimer = null;
  }
}

/** Get backup status for admin dashboard */
export function getBackupStatus() {
  const config = getConfig();
  return {
    enabled: config.enabled,
    intervalHours: config.intervalHours,
    retentionDays: config.retentionDays,
    lastBackupTime: lastBackupTime?.toISOString() || null,
    lastBackupStatus,
    lastBackupError,
  };
}
