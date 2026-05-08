/**
 * C — DB foreign-key coverage parity check.
 *
 * Scans every mysqlTable definition in apps/db/schema.ts for
 * FK-shaped int columns and counts how many declare
 * `.references(() => <other>.id, ...)`.
 *
 * "FK-shaped" = column name ends in `Id` (camelCase) or `_id`
 * (snake), AND the column type is `int(...)`. The varchar /
 * bigint / text columns that share the suffix (openId, externalId)
 * are user-facing identifiers, not relational keys, so they're
 * excluded — that distinction lives in the type, not the name.
 *
 * Drizzle's `.references()` produces a real SQL FK constraint at
 * migration time. Without one, the type system says `int` but
 * the database happily accepts orphans. This is the parity gate
 * that catches the gap.
 *
 * Ratcheted: the schema landed before this gate existed, so we
 * record the current ceiling and tighten as backfill lands. Plan
 * §C2 closes the highest-priority columns (user-owned tables)
 * first; less-critical tables follow.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

const SCHEMA_PATH = path.join(REPO_ROOT, "apps/db/schema.ts");

interface Column {
  table: string;
  column: string;
  hasReferences: boolean;
}

function extractColumns(source: string): Column[] {
  const seen = new Set<string>();
  const out: Column[] = [];
  // Match every `mysqlTable("<name>", { ... }` opening; capture the
  // table body up to the close `}` followed by either `,` (index
  // callback) or `);` (no callback).
  // Tolerates both single-line `mysqlTable("…", { … }` form and
  // multi-line `mysqlTable(\n  "…",\n  {\n    …\n  }` form. The
  // body-close lookbehind `\n\s*\}\s*(?:,|\))` allows the closing
  // brace to be indented (e.g. 2 spaces in the multi-line form).
  const tableRe =
    /export\s+const\s+\w+\s*=\s*mysqlTable\(\s*["']([a-zA-Z0-9_]+)["']\s*,\s*\{([\s\S]*?)\n\s*\}\s*(?:,|\))/g;
  for (const tableMatch of source.matchAll(tableRe)) {
    const tableName = tableMatch[1];
    // Comments between columns confuse the column-body lookahead
    // (the body greedily extends through them). Strip block + line
    // comments first; the column matcher then sees clean column-
    // separated declarations.
    const body = stripComments(tableMatch[2]);
    // Column declarations: `<name>: int(...)` at any indentation
    // depth (2 spaces in single-line tables, 4 in multi-line).
    // Restrict to int(...) columns — varchar/text/bigint suffixes
    // are external identifiers, not FKs.
    const colRe = /^(\s+)([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*int\(([\s\S]*?)(?=,\s*\n\1[a-zA-Z_]|\s*\}\s*$)/gm;
    for (const colMatch of body.matchAll(colRe)) {
      const columnName = colMatch[2];
      const definition = colMatch[3];
      if (!isFkShaped(columnName)) continue;
      const key = `${tableName}.${columnName}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const hasReferences = /\.references\s*\(/.test(definition);
      out.push({ table: tableName, column: columnName, hasReferences });
    }
  }
  return out;
}

/**
 * Strip `/* … *\/` block comments and `// …` line comments from a
 * source slice so the column-body lookahead can rely on adjacent
 * column declarations being directly comma-newline-indent-separated.
 *
 * Conservative; doesn't understand strings or template literals, so
 * a `//` inside a quoted comment-marker string is over-stripped.
 * For schema.ts that's never the case, and over-stripping is the
 * safe direction (we'd rather miss a column than report a phantom).
 */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

function isFkShaped(name: string): boolean {
  if (name === "id") return false;
  if (/Id$/.test(name)) return true;
  if (/_id$/.test(name)) return true;
  return false;
}

/**
 * Column-level exemption list. Each entry is a `<table>.<column>`
 * key paired with a documented reason. Exempting a column counts
 * it as "implemented" in the parity totals — the exemption itself
 * is the runtime contract.
 *
 * Use exemption sparingly. The right reasons are:
 *   - The column IS the FK target, not a source (e.g. unique
 *     non-PK columns other tables reference).
 *   - The value is a static enum-like int, not a database row id.
 *   - The referent lives outside the database (loredex JSON,
 *     external service identifier, etc.).
 *   - Cursor / sentinel patterns whose semantics are broken by
 *     a real FK constraint.
 *   - Intentional decoupling for audit-trail use cases where a
 *     persisted snapshot replaces the live link.
 *
 * Wrong reasons (should be a real FK instead):
 *   - "the target table doesn't exist yet"  (add the table)
 *   - "we'll wire it later"                  (wire it now)
 *   - "the column is unused"                 (drop the column)
 */
const FK_SHAPE_EXEMPT: Readonly<Record<string, string>> = {
  "tw_sectors.sectorId":
    "FK target column itself — other tables reference twSectors.sectorId; this column IS the unique key, not a source.",
  "citizen_characters.neyonTokenId":
    "Static enum-like value (1..10 per the column comment); no neyon_tokens table exists or is planned.",
  "circuit_identity_chains.loredexEntryId":
    "References loredex-data.json (JSON-backed, not a DB table). The canonical varchar form lives at cards.loredexEntryId; the int form here appears vestigial but is kept until a column-drop migration audits its use.",
  "trade_news_cursor.lastSeenEventId":
    "Cursor-pattern column with `0` sentinel meaning 'no events seen yet'. A real FK rejects the sentinel; making the column nullable changes its semantics. Intentional decoupling.",
};

export function checkDbForeignKeyCoverage(): RawParityCount {
  const src = fs.readFileSync(SCHEMA_PATH, "utf-8");
  const cols = extractColumns(src);
  const offenders: string[] = [];
  let implemented = 0;
  for (const col of cols) {
    const key = `${col.table}.${col.column}`;
    if (col.hasReferences) {
      implemented++;
      continue;
    }
    if (FK_SHAPE_EXEMPT[key]) {
      // Treat exempt columns as implemented. The exemption itself
      // is the documented runtime contract — see FK_SHAPE_EXEMPT
      // above for the rules on when an exemption is appropriate.
      implemented++;
      continue;
    }
    offenders.push(
      `${key}: int FK-shaped column without .references() — orphan risk on user/parent delete`,
    );
  }
  return {
    declared: cols.length,
    implemented,
    missing: offenders,
  };
}
