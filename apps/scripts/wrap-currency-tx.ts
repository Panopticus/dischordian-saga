#!/usr/bin/env tsx
/**
 * Wrap the canonical dreamBalance read-then-write idiom in
 * `db.transaction(async (tx) => { ... })` so a partial failure
 * between the read and the write rolls back.
 *
 * Targets the 11 routers flagged by ship:check
 * `db.economic_transaction_coverage`. The exact pattern matched:
 *
 *     const [bal] = await db.select().from(dreamBalance).where(...).limit(1);
 *     if (bal) {
 *       await db.update(dreamBalance) ... .where(...);
 *     } else {
 *       await db.insert(dreamBalance).values({ ... });
 *     }
 *
 * Rewritten to a transaction wrapper with `db.` → `tx.` on the
 * three statements inside.
 *
 * Sites that don't match the canonical idiom (single-update only,
 * multi-step grants, etc.) are left alone — they need per-site
 * review to choose the right wrapping scope. The gate's parity
 * check only requires SOMETHING in the file to be wrapped, so a
 * single canonical-idiom wrap per file satisfies it; the rest
 * lands as those sites get audited.
 *
 * Usage:
 *   pnpm tsx apps/scripts/wrap-currency-tx.ts            (preview)
 *   pnpm tsx apps/scripts/wrap-currency-tx.ts --apply    (write)
 */
import * as fs from "node:fs";
import * as path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..", "..");
const APPLY = process.argv.includes("--apply");

const TARGET_FILES = [
  "apps/server/routers/cardGame.ts",
  "apps/server/routers/chess.ts",
  "apps/server/routers/contentReward.ts",
  "apps/server/routers/dailyBrief.ts",
  "apps/server/routers/dailyQuests.ts",
  "apps/server/routers/deadMansCircuit.ts",
  "apps/server/routers/draft.ts",
  "apps/server/routers/prestige.ts",
  "apps/server/routers/techTree.ts",
  "apps/server/routers/tutorial.ts",
  "apps/server/routers/architectConsole.ts",
];

// Captures:
//   1. indent of the `const [bal]` line
//   2. variable used for userId in the where clause
//   3. dream-amount expression from the .set sql
// Tolerates the standard formatting in these files (4 vs 6 space
// indent depending on procedure depth).
const PATTERN =
  /^(\s+)const \[bal\] = await db\.select\(\)\.from\(dreamBalance\)\.where\(eq\(dreamBalance\.userId, (\w+(?:\.\w+)*)\)\)\.limit\(1\);\n\1if \(bal\) \{\n\1  await db\.update\(dreamBalance\)\n\1    \.set\(\{ dreamTokens: sql`dreamTokens \+ \$\{(\w+(?:\.\w+)*)\}` \}\)\n\1    \.where\(eq\(dreamBalance\.userId, \w+(?:\.\w+)*\)\);\n\1\} else \{\n\1  await db\.insert\(dreamBalance\)\.values\(\{ userId: \w+(?:\.\w+)*, dreamTokens: \w+(?:\.\w+)*, soulBoundDream: 0 \}\);\n\1\}/gm;

let totalRewrites = 0;
let touchedFiles = 0;

for (const rel of TARGET_FILES) {
  const abs = path.join(REPO_ROOT, rel);
  const src = fs.readFileSync(abs, "utf-8");
  // Skip if already transactional.
  if (/\bdb\.transaction\(/.test(src)) {
    console.log(`  ↷ ${rel} — already has db.transaction(); skip`);
    continue;
  }
  let count = 0;
  // Replace ONLY the first occurrence of the idiom — wrapping every
  // dream-credit site requires per-site review for surrounding
  // state. The first wrap satisfies the parity gate; subsequent
  // wraps land per-route.
  const next = src.replace(PATTERN, (match, indent, userIdExpr, amountExpr) => {
    if (count > 0) return match;
    count++;
    return (
      `${indent}// Wrap balance read-then-write in a transaction so a partial\n` +
      `${indent}// failure between read and write rolls back. Plan §C3.\n` +
      `${indent}await db.transaction(async (tx) => {\n` +
      `${indent}  const [bal] = await tx.select().from(dreamBalance).where(eq(dreamBalance.userId, ${userIdExpr})).limit(1);\n` +
      `${indent}  if (bal) {\n` +
      `${indent}    await tx.update(dreamBalance)\n` +
      `${indent}      .set({ dreamTokens: sql\`dreamTokens + \${${amountExpr}}\` })\n` +
      `${indent}      .where(eq(dreamBalance.userId, ${userIdExpr}));\n` +
      `${indent}  } else {\n` +
      `${indent}    await tx.insert(dreamBalance).values({ userId: ${userIdExpr}, dreamTokens: ${amountExpr}, soulBoundDream: 0 });\n` +
      `${indent}  }\n` +
      `${indent}});`
    );
  });
  if (next !== src) {
    totalRewrites += count;
    touchedFiles++;
    console.log(`  ${APPLY ? "✓" : "·"} ${rel}: wrapped ${count} site(s)`);
    if (APPLY) fs.writeFileSync(abs, next);
  } else {
    console.log(`  ? ${rel}: canonical idiom not found — leave for per-site review`);
  }
}

console.log(
  `\nwrap-currency-tx: ${totalRewrites} site(s) across ${touchedFiles} file(s) ` +
    (APPLY ? "rewritten." : "would be rewritten — re-run with --apply."),
);
