/**
 * Questline registry coverage — the completion-tracking gate (W7).
 *
 * The audit flagged "questline completion status is unknown /
 * untracked." It was: the only aggregation was a partial 11-entry
 * array inside questlineAll.test.ts while 23 questline modules
 * existed on disk.
 *
 * HARD PARITY: every apps/shared/questline*.ts module (non-test)
 * MUST be registered in QUESTLINE_REGISTRY with a status. declared
 * = questline modules on disk; implemented = modules present in the
 * registry. A questline module with no registry entry is the exact
 * "untracked" failure — surfaced in `missing`. Two-way: a registry
 * entry pointing at a deleted module is also a defect.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import { QUESTLINE_REGISTRY } from "../../questlineRegistry";
import type { RawParityCount } from "../types";

const SHARED_DIR = path.join(REPO_ROOT, "apps/shared");

export function checkQuestlineRegistryCoverage(): RawParityCount {
  const onDisk = fs
    .readdirSync(SHARED_DIR)
    .filter(
      (f) =>
        f.startsWith("questline") &&
        f.endsWith(".ts") &&
        !f.endsWith(".test.ts") &&
        // The registry + its types are infra, not questline content.
        f !== "questlineRegistry.ts",
    )
    .map((f) => f.replace(/\.ts$/, ""));

  const registered = new Set(QUESTLINE_REGISTRY.map((q) => q.module));
  const missing: string[] = [];

  for (const mod of onDisk) {
    if (!registered.has(mod)) {
      missing.push(
        `questline module '${mod}' is on disk but not in ` +
          `QUESTLINE_REGISTRY — its completion status is untracked`,
      );
    }
  }
  for (const q of QUESTLINE_REGISTRY) {
    if (!onDisk.includes(q.module)) {
      missing.push(
        `QUESTLINE_REGISTRY entry '${q.module}' has no matching ` +
          `apps/shared/${q.module}.ts on disk (stale registry entry)`,
      );
    }
  }

  const implemented = onDisk.filter((m) => registered.has(m)).length;
  return { declared: onDisk.length, implemented, missing };
}
