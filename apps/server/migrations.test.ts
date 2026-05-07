import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Migration journal hygiene guard.
 *
 * CONNECTION_AUDIT 2026-05-07 §3.4 originally claimed "empty migration
 * journal" — that was an overclaim. `apps/db/meta/_journal.json` has
 * 39 entries. The real problem is DRIFT: 42 .sql files exist in
 * apps/db/ that are NOT recorded in the journal, including several
 * with colliding migration numbers (0037, 0043, 0044, 0046, 0055,
 * 0058, 0059 each have two .sql files). This is the
 * `drizzle-kit push` failure mode the smoke-test docstring at
 * apps/scripts/db-fresh-smoke.ts:117–141 already calls out.
 *
 * This guard:
 *
 *   1. Asserts every journal entry has a matching .sql file. A
 *      journal entry whose file is missing is a deploy hazard — a
 *      fresh DB running `drizzle-kit migrate` would error.
 *
 *   2. Asserts every .sql file is either in the journal OR in the
 *      grandfathered baseline at
 *      apps/db/migrations/migration-drift.baseline.json. The
 *      baseline lists the 42 orphans that exist today. PRs that
 *      add new migrations must add a journal entry (the normal
 *      `pnpm db:generate` flow does this automatically); they must
 *      NOT add to the baseline. The baseline can shrink as the
 *      cutover plan resolves the orphans (see apps/db/migrations/
 *      README.md).
 *
 *   3. Asserts no two .sql files share the same migration prefix
 *      (the four-digit ordering key). Collisions are non-deterministic
 *      to apply and signal that two PRs concurrently authored
 *      migrations against the same base; one of them needs to be
 *      renumbered.
 */

const REPO_ROOT = path.resolve(__dirname, "..");
const DB_DIR = path.join(REPO_ROOT, "db");
const JOURNAL_PATH = path.join(DB_DIR, "meta", "_journal.json");
const BASELINE_PATH = path.join(DB_DIR, "migrations", "migration-drift.baseline.json");

interface JournalEntry {
  idx: number;
  tag: string;
}

interface Journal {
  entries: JournalEntry[];
}

function loadJournal(): Journal {
  try {
    return JSON.parse(fs.readFileSync(JOURNAL_PATH, "utf-8")) as Journal;
  } catch {
    return { entries: [] };
  }
}

function listSqlFiles(): string[] {
  try {
    return fs.readdirSync(DB_DIR)
      .filter(f => f.endsWith(".sql"))
      .map(f => f.replace(/\.sql$/, ""))
      .sort();
  } catch {
    return [];
  }
}

interface MigrationBaseline {
  driftedSqlFiles: string[];
  /** NNNN prefixes where two or more .sql files share the same number.
   *  Grandfathered from the pre-guard era; PRs cannot add new entries. */
  knownPrefixCollisions: string[];
}

function loadBaseline(): MigrationBaseline {
  try {
    const raw = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf-8")) as Partial<MigrationBaseline>;
    return {
      driftedSqlFiles: raw.driftedSqlFiles ?? [],
      knownPrefixCollisions: raw.knownPrefixCollisions ?? [],
    };
  } catch {
    return { driftedSqlFiles: [], knownPrefixCollisions: [] };
  }
}

describe("migration journal hygiene", () => {
  const journal = loadJournal();
  const sqlFiles = listSqlFiles();
  const baseline = loadBaseline();
  const journalTags = new Set(journal.entries.map(e => e.tag));
  const baselineSet = new Set(baseline.driftedSqlFiles);
  const collisionBaseline = new Set(baseline.knownPrefixCollisions);

  it("the journal has at least the historical 35 entries (regression floor)", () => {
    expect(journal.entries.length).toBeGreaterThanOrEqual(35);
  });

  it("every journal entry has a matching .sql file in apps/db/", () => {
    const missing: string[] = [];
    const sqlSet = new Set(sqlFiles);
    for (const e of journal.entries) {
      if (!sqlSet.has(e.tag)) {
        missing.push(e.tag);
      }
    }
    expect(
      missing,
      `Journal entries with no matching .sql file:\n${missing.map(m => `  - ${m}`).join("\n")}`,
    ).toEqual([]);
  });

  it("every .sql file is in the journal OR grandfathered in migration-drift.baseline.json", () => {
    const violations: string[] = [];
    for (const f of sqlFiles) {
      if (journalTags.has(f)) continue;
      if (baselineSet.has(f)) continue;
      violations.push(f);
    }
    if (violations.length > 0) {
      throw new Error(
        `Migration .sql files not in journal and not in baseline:\n${violations.map(v => `  - ${v}.sql`).join("\n")}\n\n` +
          `New migrations should land via \`pnpm db:generate\`, which writes both the .sql ` +
          `file AND a journal entry. If you authored a .sql file directly, run \`pnpm db:generate\` ` +
          `against a clean checkout to get the journal entry, or add the file to ` +
          `apps/db/migrations/migration-drift.baseline.json with an explanation in the README. ` +
          `See apps/db/migrations/README.md for the cutover plan.`,
      );
    }
    expect(violations).toEqual([]);
  });

  it("no two .sql files share the same migration number prefix", () => {
    const byPrefix = new Map<string, string[]>();
    for (const f of sqlFiles) {
      const prefix = f.slice(0, 4);
      if (!/^\d{4}$/.test(prefix)) continue;
      const arr = byPrefix.get(prefix) ?? [];
      arr.push(f);
      byPrefix.set(prefix, arr);
    }
    const newCollisions: string[] = [];
    for (const [prefix, files] of byPrefix.entries()) {
      if (files.length > 1 && !collisionBaseline.has(prefix)) {
        newCollisions.push(`${prefix}: ${files.join(", ")}`);
      }
    }
    if (newCollisions.length > 0) {
      throw new Error(
        `New migration number collisions (two .sql files with the same NNNN prefix, not in baseline):\n${newCollisions.map(c => `  - ${c}`).join("\n")}\n\n` +
          `Existing pre-baseline collisions are listed in ` +
          `apps/db/migrations/migration-drift.baseline.json under knownPrefixCollisions. ` +
          `New collisions are blocked: re-number the newer file by running ` +
          `\`pnpm db:generate\` against a checkout that already has the older one applied.`,
      );
    }
    expect(newCollisions).toEqual([]);
  });
});
