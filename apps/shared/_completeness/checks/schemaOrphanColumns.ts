/**
 * Schema orphan-column parity check.
 *
 * Every column declared in `apps/db/schema.ts` represents a feature the
 * design intends to persist. A column with zero non-schema readers or
 * writers is a feature the runtime never honors — the database row
 * accepts the data but no surface displays or mutates it.
 *
 * This check enumerates known orphan columns identified by audit and
 * asserts each is either:
 *   (a) consumed by at least one file outside `apps/db/`, OR
 *   (b) explicitly EXEMPT here with a documented reason and follow-up.
 *
 * Adding a new orphan column to a live table = adding a row here. The
 * gate ensures someone has to either ship the consumer or write the
 * exemption rationale before the PR lands.
 *
 * Hard parity. The audit-allow comments inside schema.ts are advisory;
 * this gate is the enforcer.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT, walkSourceFiles } from "../scanner";
import type { RawParityCount } from "../types";

interface DeclaredColumn {
  /** `<table>.<column>` — used in the missing line. */
  qualified: string;
  /** Repo-relative file paths to exclude from the consumer search. */
  ignorePathFragments: ReadonlyArray<string>;
  /** Identifiers (column name or property access) we accept as evidence. */
  consumerPatterns: ReadonlyArray<string>;
  /** What the column is for, surfaced in missing notes. */
  purpose: string;
}

const APPS_DIR = path.join(REPO_ROOT, "apps");

/**
 * Columns under enforcement. Identified in the
 * INCOMPLETE_DESIGNS_AUDIT_2026-05-08 audit.
 *
 * NOT included here: columns that are intentionally schema-first per
 * `audit-allow: pending-feature` doc-comments in schema.ts (e.g. the
 * Phase D.5 trade-empire cluster). Those are tracked elsewhere.
 *
 * History: `cards.nftTokenId` and `cards.nftPerks` used to be tracked
 * here; both were removed from schema.ts when the NFT plumbing was
 * deleted. New orphan columns added here = the gate's reminder to
 * either ship the consumer or document the deferral.
 */
const TRACKED_COLUMNS: ReadonlyArray<DeclaredColumn> = [
  {
    qualified: "characterSheets.avatarUrl",
    ignorePathFragments: ["apps/db/", "apps/scripts/", "_completeness/"],
    consumerPatterns: [".avatarUrl", "avatarUrl:"],
    purpose:
      "portrait URL on character_sheets rows; no reader in client or server",
  },
];

export function checkSchemaOrphanColumns(): RawParityCount {
  const missing: string[] = [];
  const apps = walkSourceFiles(APPS_DIR);
  for (const col of TRACKED_COLUMNS) {
    const eligible = apps.filter((abs) => {
      const rel = path.relative(REPO_ROOT, abs);
      return !col.ignorePathFragments.some((frag) => rel.includes(frag));
    });
    let consumerFound = false;
    fileLoop: for (const abs of eligible) {
      const src = fs.readFileSync(abs, "utf-8");
      for (const pat of col.consumerPatterns) {
        if (src.includes(pat)) {
          consumerFound = true;
          break fileLoop;
        }
      }
    }
    if (!consumerFound) {
      missing.push(
        `${col.qualified}: column declared in apps/db/schema.ts but has no consumer in apps/ outside ${col.ignorePathFragments.join(
          ", ",
        )} — ${col.purpose}`,
      );
    }
  }
  return {
    declared: TRACKED_COLUMNS.length,
    implemented: TRACKED_COLUMNS.length - missing.length,
    missing,
  };
}
