/**
 * C3 / Persistence F8 — Economic-surface transaction-wrapping parity.
 *
 * **Procedure-level** (was file-level). The old check passed a whole
 * router file if it contained `db.transaction(` *anywhere*, so a file
 * with one transactional procedure and several unwrapped currency
 * mutations reported a false PASS (audit Persistence F8). It also
 * couldn't see the casino TOCTOU (F4) or the gameData clobber (F3).
 *
 * Now each tRPC procedure is evaluated independently. A procedure is
 * counted as a money-mutation surface when its body matches an
 * {@link ECONOMIC_BALANCE_PATTERNS} write marker. It is considered
 * SAFE (implemented) when any of:
 *
 *  1. it wraps its writes in `db.transaction(` / `tx.transaction(`;
 *  2. it delegates to a self-transacting fulfillment helper
 *     (`fulfillPurchase(` / `doFulfill(`), which opens its own tx;
 *  3. its only money write is a single **atomic conditional update**
 *     (`UPDATE … SET x = x - n WHERE … x >= n`, detected via a `>=`
 *     guard / `affectedRows` check) — there is no partial-failure
 *     window to roll back, so a wrapping tx adds nothing.
 *
 * Read-only `.query` procedures that merely name a currency token are
 * excluded entirely (not a mutation surface).
 *
 * The residual gap is the honest set of multi-write money sequences
 * with no surrounding transaction — the real F8 offenders. This is a
 * heuristic source scan, deliberately conservative (the three SAFE
 * rules err toward NOT flagging) so every flagged procedure is worth
 * a human look.
 *
 * Ratchet note: switching this check from file- to procedure-level
 * surfaced a pre-existing, previously-masked gap. The ratchet ceiling
 * was deliberately re-seeded to that honest count (documented in the
 * PR) — analogous to how `trial_categories` was seeded — NOT silenced.
 * Target stays 0; it tightens as transaction-wrapping PRs land.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT, walkSourceFiles } from "../scanner";
import type { RawParityCount } from "../types";

const ROUTERS_DIR = path.join(REPO_ROOT, "apps/server/routers");

/**
 * Tokens that mark a code region as a currency-WRITE surface. These
 * are mutations (UPDATE/INSERT/drizzle .update/.insert), not reads —
 * a SELECT that merely names `credits` is not flagged.
 */
const ECONOMIC_BALANCE_PATTERNS: ReadonlyArray<RegExp> = [
  /UPDATE\s+dream_balance\b/i,
  /UPDATE\s+void_crystal_balance\b/i,
  /UPDATE\s+gem_balance\b/i,
  /INSERT\s+INTO\s+store_purchases\b/i,
  /db\.update\(\s*storePurchases\b/,
  /tx\.update\(\s*storePurchases\b/,
  /db\.insert\(\s*storePurchases\b/,
  /tx\.insert\(\s*storePurchases\b/,
  /\b(?:db|tx)\.update\(\s*dreamBalance\b/,
  /\b(?:db|tx)\.update\(\s*voidCrystalBalance\b/,
  /\b(?:db|tx)\.update\(\s*gemBalance\b/,
];

/** A tRPC procedure block sliced out of a router source file. */
interface ProcBlock {
  name: string;
  body: string;
}

/**
 * Split a router source into top-level procedure blocks. A procedure
 * starts at `name: publicProcedure|protectedProcedure|adminProcedure`
 * and runs until the next such marker (or EOF).
 */
function sliceProcedures(src: string): ProcBlock[] {
  const re =
    /(\b[a-zA-Z0-9_]+)\s*:\s*(?:public|protected|admin)Procedure\b/g;
  const starts: Array<{ name: string; idx: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    starts.push({ name: m[1], idx: m.index });
  }
  const blocks: ProcBlock[] = [];
  for (let i = 0; i < starts.length; i++) {
    const end = i + 1 < starts.length ? starts[i + 1].idx : src.length;
    blocks.push({ name: starts[i].name, body: src.slice(starts[i].idx, end) });
  }
  return blocks;
}

function countWriteMarkers(body: string): number {
  let n = 0;
  for (const re of ECONOMIC_BALANCE_PATTERNS) {
    const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    const matched = body.match(g);
    if (matched) n += matched.length;
  }
  return n;
}

function isProcedureSafe(body: string): boolean {
  // 1. wrapped in its own transaction
  if (/\b(?:db|tx)\.transaction\(/.test(body)) return true;
  // 2. delegates to a self-transacting fulfillment helper
  if (/\bfulfillPurchase\(|\bdoFulfill\(/.test(body)) return true;
  // 3. single atomic conditional update — no partial-failure window
  const writes = countWriteMarkers(body);
  const hasConditionalGuard =
    /WHERE[\s\S]{0,160}?>=/i.test(body) ||
    />=\s*\$\{/.test(body) ||
    /affectedRows/.test(body);
  if (writes <= 1 && hasConditionalGuard) return true;
  return false;
}

export function checkEconomicTransactionCoverage(): RawParityCount {
  const files = walkSourceFiles(ROUTERS_DIR);
  const offenders: string[] = [];
  let declared = 0;
  let implemented = 0;

  for (const abs of files) {
    if (abs.endsWith(".test.ts")) continue;
    const src = fs.readFileSync(abs, "utf-8");
    const rel = path.relative(REPO_ROOT, abs);
    for (const proc of sliceProcedures(src)) {
      // Read-only query that merely names a currency token — not a
      // mutation surface.
      const isQuery =
        /\.query\(/.test(proc.body) && !/\.mutation\(/.test(proc.body);
      if (isQuery) continue;
      const mutatesMoney = ECONOMIC_BALANCE_PATTERNS.some((re) =>
        re.test(proc.body),
      );
      if (!mutatesMoney) continue;
      declared++;
      if (isProcedureSafe(proc.body)) {
        implemented++;
      } else {
        offenders.push(
          `${rel} :: ${proc.name} — money write(s) with no surrounding db.transaction(...) and not a single atomic conditional update; wrap the debit+grant(+ledger) sequence in a transaction`,
        );
      }
    }
  }

  return { declared, implemented, missing: offenders };
}
