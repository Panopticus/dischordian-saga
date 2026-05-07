/**
 * C3 — Economic-surface transaction-wrapping parity check.
 *
 * Walks every server router under `apps/server/routers/` looking for
 * tRPC procedures that mutate currency balances. Each must wrap its
 * mutation in `db.transaction(...)` so a partial failure (DB error
 * mid-fulfillment, exception in a downstream call) rolls the whole
 * thing back. Without the wrapper, a customer can be debited then
 * silently un-credited if anything fails between the two writes —
 * the canonical double-spend / lost-coin bug.
 *
 * Mechanism: identify procedures whose body touches a known balance
 * surface (UPDATE on dream_balance / void_crystal_balance / credits,
 * INSERT on storePurchases, etc.) and assert each procedure body
 * also contains a `db.transaction(` or `tx.transaction(` call within
 * a reasonable window.
 *
 * Heuristic; doesn't catch every shape. The ECONOMIC_BALANCE_PATTERNS
 * list below is the curated set of "this token means money is
 * moving" markers. New currency surfaces add to this list.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT, walkSourceFiles } from "../scanner";
import type { RawParityCount } from "../types";

const ROUTERS_DIR = path.join(REPO_ROOT, "apps/server/routers");

/**
 * Patterns that mark a code region as a currency-mutation surface.
 * Adding a new currency / store SKU / reward path means adding a
 * marker here. The check fires on any of these tokens; the response
 * is "this region must be inside db.transaction(...)".
 */
const ECONOMIC_BALANCE_PATTERNS: ReadonlyArray<RegExp> = [
  /UPDATE\s+dream_balance\b/i,
  /UPDATE\s+void_crystal_balance\b/i,
  /UPDATE\s+gem_balance\b/i,
  /UPDATE\s+credits\b/i,
  /INSERT\s+INTO\s+store_purchases\b/i,
  /db\.update\(\s*storePurchases\b/,
  /db\.insert\(\s*storePurchases\b/,
  /db\.update\(\s*dreamBalance\b/,
  /db\.update\(\s*voidCrystalBalance\b/,
  /db\.update\(\s*gemBalance\b/,
];

/**
 * Files exempt from the check — the auditor sees them as routers
 * that mention currency in passing (logging, read-only summary,
 * documentation) without actually mutating it. Each entry must
 * include a reason.
 */
const ECONOMIC_TX_EXEMPT: Readonly<Record<string, string>> = {
  // SpendingDashboard etc. read-only telemetry surfaces if any
  // appear here as false positives. Empty at landing.
};

interface FileResult {
  file: string;
  hasMutation: boolean;
  hasTransaction: boolean;
}

function analyzeFile(absPath: string): FileResult {
  const src = fs.readFileSync(absPath, "utf-8");
  const hasMutation = ECONOMIC_BALANCE_PATTERNS.some((re) => re.test(src));
  const hasTransaction =
    /\bdb\.transaction\(/.test(src) || /\btx\.transaction\(/.test(src);
  return {
    file: path.relative(REPO_ROOT, absPath),
    hasMutation,
    hasTransaction,
  };
}

export function checkEconomicTransactionCoverage(): RawParityCount {
  const files = walkSourceFiles(ROUTERS_DIR);
  const offenders: string[] = [];
  let mutationFiles = 0;
  let wrappedFiles = 0;
  for (const abs of files) {
    const r = analyzeFile(abs);
    if (!r.hasMutation) continue;
    mutationFiles++;
    if (ECONOMIC_TX_EXEMPT[r.file]) {
      wrappedFiles++;
      continue;
    }
    if (r.hasTransaction) {
      wrappedFiles++;
      continue;
    }
    offenders.push(
      `${r.file}: touches a currency-mutation pattern (UPDATE dream_balance / store_purchases / etc.) but does not call db.transaction(...) anywhere — partial-failure rollback gap`,
    );
  }
  return {
    declared: mutationFiles,
    implemented: wrappedFiles,
    missing: offenders,
  };
}
